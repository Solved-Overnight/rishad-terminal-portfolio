/**
 * Google Analytics (GA4) Service
 * Handles visitor traffic tracking, page views, and terminal interaction telemetry.
 */

// Global augmentation for gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

// Configurable Measurement ID from Vite environment or default measurement ID
const GA_MEASUREMENT_ID = (import.meta as any).env?.VITE_GA_MEASUREMENT_ID || 'G-0SV0LZVY0P';

/**
 * Initializes Google Analytics 4 (GA4) script if not already present on page.
 */
export const initAnalytics = (): void => {
  if (typeof window === 'undefined') return;

  const measurementId = GA_MEASUREMENT_ID || (window as any).__GA_MEASUREMENT_ID__;
  if (!measurementId || measurementId.trim() === '' || measurementId === 'G-XXXXXXXXXX') {
    // Analytics is ready, awaiting user's measurement ID
    return;
  }

  // Ensure dataLayer is initialized
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
  }

  // Check if script tag is already loaded
  const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${measurementId}"]`);
  if (!existingScript) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }

  // Configure Google Analytics with automatic page_view
  window.gtag('config', measurementId, {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname,
    send_page_view: true
  });
};

/**
 * Track a page or modal view
 */
export const trackPageView = (path: string, title?: string): void => {
  if (typeof window === 'undefined' || !window.gtag) return;
  const measurementId = GA_MEASUREMENT_ID || (window as any).__GA_MEASUREMENT_ID__;
  if (!measurementId) return;

  window.gtag('event', 'page_view', {
    page_title: title || document.title,
    page_location: window.location.href,
    page_path: path
  });
};

/**
 * Track custom interactive engagement events
 */
export const trackEvent = (eventName: string, params: Record<string, any> = {}): void => {
  if (typeof window === 'undefined' || !window.gtag) return;
  try {
    window.gtag('event', eventName, params);
  } catch (err) {
    console.debug('[Analytics] Failed to send event', err);
  }
};

/**
 * Specific portfolio event helpers
 */
export const trackCommand = (command: string): void => {
  const cleanCmd = command.trim().split(' ')[0] || '';
  if (!cleanCmd) return;
  trackEvent('terminal_command', {
    command_name: cleanCmd,
    full_command: command.trim().slice(0, 50)
  });
};

export const trackProjectView = (projectName: string): void => {
  trackEvent('view_project', {
    project_name: projectName
  });
};

export const trackResumeDownload = (): void => {
  trackEvent('resume_download', {
    method: 'pdf_download',
    timestamp: new Date().toISOString()
  });
};

export const trackBlogRead = (blogTitle: string): void => {
  trackEvent('read_blog', {
    blog_title: blogTitle
  });
};

export const trackThemeChange = (themeName: string): void => {
  trackEvent('theme_change', {
    theme_name: themeName
  });
};

export const trackTabSwitch = (tab: 'profile' | 'terminal'): void => {
  trackEvent('mobile_tab_switch', {
    active_tab: tab
  });
};
