import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { SYSTEM_INSTRUCTION } from '../../constants';

function parseGeminiError(err: any): { status: number; message: string; code?: string } {
  const rawMessage = typeof err?.message === 'string' ? err.message : 'Failed to generate response.';
  let status = typeof err?.status === 'number' ? err.status : 500;
  let message = rawMessage;
  let code: string | undefined = err?.code;

  try {
    const parsed = JSON.parse(rawMessage);
    if (parsed?.error) {
      message = parsed.error.message || message;
      status = parsed.error.code || status;
      code = parsed.error.status || code;
    }
  } catch {
    if (rawMessage.includes('API_KEY_INVALID') || rawMessage.includes('API key not valid')) {
      status = 400;
      code = 'API_KEY_INVALID';
    } else if (rawMessage.includes('PERMISSION_DENIED')) {
      status = 403;
      code = 'PERMISSION_DENIED';
    } else if (rawMessage.includes('RESOURCE_EXHAUSTED') || rawMessage.includes('quota')) {
      status = 429;
      code = 'RESOURCE_EXHAUSTED';
    }
  }

  return { status, message, code };
}

const modelCooldownUntil = new Map<string, number>();

export const handler = async (event: any) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    let body: any = {};
    if (event.body) {
      try {
        body = JSON.parse(event.body);
      } catch {
        body = {};
      }
    }

    const { prompt } = body;
    if (!prompt || typeof prompt !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Prompt is required' })
      };
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.VITE_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'GEMINI_API_KEY is not configured in Netlify environment variables.',
          code: 'API_KEY_INVALID'
        })
      };
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const candidateModels: Array<{ model: string; useLowThinking?: boolean }> = [
      { model: 'gemini-3.8-flash', useLowThinking: true },
      { model: 'gemini-3.1-flash-lite' },
      { model: 'gemini-flash-latest' }
    ];

    const startedAt = Date.now();
    const TOTAL_BUDGET_MS = 8500;
    const activeCandidates = candidateModels.filter(c => (modelCooldownUntil.get(c.model) ?? 0) <= startedAt);
    const orderedCandidates = activeCandidates.length > 0 ? activeCandidates : candidateModels;

    let responseText: string | undefined;
    let lastError: { status: number; message: string; code?: string } | null = null;

    for (const candidate of orderedCandidates) {
      const elapsed = Date.now() - startedAt;
      const remaining = TOTAL_BUDGET_MS - elapsed;
      if (remaining < 1200) break;

      const attemptTimeoutMs = Math.min(4500, remaining);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), attemptTimeoutMs);

      try {
        const response = await ai.models.generateContent({
          model: candidate.model,
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            abortSignal: controller.signal,
            ...(candidate.useLowThinking
              ? { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } }
              : {})
          }
        });
        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err?.name === 'AbortError'
          ? { status: 504, message: `Model ${candidate.model} timed out.`, code: 'TIMEOUT' }
          : parseGeminiError(err);

        if (lastError.status === 429 || lastError.code === 'RESOURCE_EXHAUSTED' || lastError.code === 'TIMEOUT') {
          modelCooldownUntil.set(candidate.model, Date.now() + 60_000);
        }

        // Fail fast on invalid API key or permission errors
        if (
          lastError.status === 403 ||
          lastError.code === 'API_KEY_INVALID' ||
          lastError.code === 'PERMISSION_DENIED' ||
          lastError.message.includes('API_KEY_INVALID') ||
          lastError.message.includes('API key not valid')
        ) {
          break;
        }
      } finally {
        clearTimeout(timeoutId);
      }
    }

    if (!responseText) {
      const statusCode = lastError?.status && lastError.status >= 400 && lastError.status < 600 ? lastError.status : 500;
      return {
        statusCode,
        headers,
        body: JSON.stringify({
          error: lastError?.message || 'Failed to generate response.',
          code: lastError?.code
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ text: responseText })
    };
  } catch (error: any) {
    const parsed = parseGeminiError(error);
    return {
      statusCode: parsed.status,
      headers,
      body: JSON.stringify({ error: parsed.message, code: parsed.code })
    };
  }
};
