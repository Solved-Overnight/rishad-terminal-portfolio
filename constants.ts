
import { Experience, Project, SkillCategory, FileSystemNode, Certification, LeadershipItem } from './types';

// Toggle this to false to hide the "Open for Remote job" status across the app
export const OPEN_FOR_WORK = false;

export const ABOUT_TEXT = `
Hi, I'm Moniruzzaman Rishad, an AI & ML Engineer.

I specialize in building exceptional digital experiences using modern technologies.
Currently, I'm focused on building accessible, human-centered AI products.

I have a passion for blending creative design with robust engineering.
`;


export const PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "AI Portfolio Terminal OS",
    tagline: "Interactive 3D & Cyberpunk Linux Shell Portfolio",
    description: "An interactive terminal-based portfolio website featuring Three.js 3D ID cards, virtual filesystem, and Gemini AI assistant integration.",
    longDescription: "A full-featured developer portfolio engineered as an interactive Linux-style OS. Incorporates a custom virtual filesystem, real-time command execution, dynamic theme switcher, audio synthesizers, 3D interactive physics canvas, and server-side Gemini 3.6 Flash intelligent chat responses.",
    tech: ["React 19", "TypeScript", "Three.js", "Gemini 3.6", "Tailwind CSS"],
    category: "Full Stack & AI",
    stars: 342,
    forks: 88,
    color: "#00f0ff",
    accentColor: "rgba(0, 240, 255, 0.2)",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    link: "https://rishadhabib.me/",
    github: "https://github.com/Solved-Overnight/terminal-portfolio",
    features: [
      "Custom Shell Emulator with VFS Navigation (ls, cd, cat, pwd, clear)",
      "Interactive 3D Lanyard Card with Rapier Physics & WebGL Shaders",
      "Server-side Gemini AI Chat Assistant Proxy",
      "Kali Linux Theme Customization Engine with Audio Feedback"
    ],
    highlights: [
      { label: "Lighthouse Score", value: "99/100" },
      { label: "Active Visitors", value: "12.4K+" },
      { label: "Latency", value: "< 12ms" }
    ]
  },
  {
    id: "proj-2",
    name: "OmniRAG - Multimodal Vector Engine",
    tagline: "Ultra-Fast Multimodal Neural Retrieval System",
    description: "Enterprise multimodal RAG search engine processing pdfs, images, and audio with Gemini Multimodal Embeddings.",
    longDescription: "Designed for high-throughput enterprise knowledge retrieval. Leverages Gemini Multimodal Embeddings to vectorize unstructured documents, architectural diagrams, and video snippets into HNSW vector indexes for real-time semantic query answering.",
    tech: ["Python", "PyTorch", "Gemini API", "Qdrant", "FastAPI"],
    category: "Generative AI & Search",
    stars: 512,
    forks: 140,
    color: "#10b981",
    accentColor: "rgba(16, 185, 129, 0.2)",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop",
    link: "#",
    github: "https://github.com/Solved-Overnight/omni-rag-engine",
    features: [
      "Sub-20ms hybrid dense-sparse vector search across 10M+ documents",
      "Automatic OCR, layout parsing, and figure extraction pipeline",
      "Streaming citation source highlighting with relevance scoring",
      "Multi-tenant isolation and strict document access controls"
    ],
    highlights: [
      { label: "Index Capacity", value: "10M+ Docs" },
      { label: "Query Speed", value: "18ms" },
      { label: "Accuracy", value: "98.4%" }
    ]
  },
  {
    id: "proj-3",
    name: "Neural Style Synthesizer",
    tagline: "Real-Time Artistic Deep Learning Pipeline",
    description: "Deep learning model implementation for real-time artistic style transfer on live video streams and HD imagery.",
    longDescription: "An end-to-end computer vision neural network architecture that applies style loss and content loss optimizations using VGG19 feature extractors. Optimized for ONNX Runtime and WebGL for real-time browser inferencing.",
    tech: ["Python", "PyTorch", "ONNX", "WebGL", "Flask"],
    category: "Computer Vision",
    stars: 289,
    forks: 64,
    color: "#a855f7",
    accentColor: "rgba(168, 85, 247, 0.2)",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop",
    link: "#",
    github: "https://github.com/Solved-Overnight/neural-style-synth",
    features: [
      "Arbitrary style transfer using Feed-Forward Convolutional Networks",
      "60 FPS real-time webcam style rendering via WebGL canvas shaders",
      "Perceptual loss function tuning with Gram matrix feature correlations",
      "Custom palette control and content-preserving masks"
    ],
    highlights: [
      { label: "Frame Rate", value: "60 FPS" },
      { label: "Model Size", value: "6.2 MB" },
      { label: "Inference Time", value: "14ms" }
    ]
  },
  {
    id: "proj-4",
    name: "Nexus Commerce & Agentic Analytics",
    tagline: "Autonomous AI-Driven Retail Intelligence Platform",
    description: "A comprehensive analytics dashboard for online retailers with real-time prediction, dynamic pricing, and autonomous inventory agents.",
    longDescription: "Empowers e-commerce brands with autonomous inventory forecasting, sentiment monitoring, and automated dynamic pricing engines. Built with Next.js, Supabase, and custom micro-agent event triggers.",
    tech: ["Next.js", "TypeScript", "Supabase", "Recharts", "Tailwind CSS"],
    category: "E-Commerce & FinTech",
    stars: 420,
    forks: 95,
    color: "#f59e0b",
    accentColor: "rgba(245, 158, 11, 0.2)",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    link: "#",
    github: "https://github.com/Solved-Overnight/nexus-commerce-analytics",
    features: [
      "Real-time revenue metrics & WebSocket live order stream",
      "Automated stock level reordering powered by predictive AI models",
      "Customer cohort retention heatmaps and lifetime value (LTV) graphs",
      "Multi-currency conversion engine with Stripe integration"
    ],
    highlights: [
      { label: "GMV Processed", value: "$4.2M+" },
      { label: "Uptime", value: "99.99%" },
      { label: "Live Stores", value: "180+" }
    ]
  },
  {
    id: "proj-5",
    name: "HyperFlow - Agentic Inference Mesh",
    tagline: "Ultra-Low Latency Streaming Orchestrator for LLMs",
    description: "High-performance streaming engine for multi-agent LLM task orchestration with backpressure handling and failovers.",
    longDescription: "A high-performance micro-orchestrator that manages multi-model LLM workflows, parallel function calling, and live audio-text streaming pipelines. Features adaptive rate-limiting and fallback routing across providers.",
    tech: ["Rust", "Node.js", "WebSockets", "Docker", "Redis"],
    category: "MLOps & Infrastructure",
    stars: 680,
    forks: 182,
    color: "#ec4899",
    accentColor: "rgba(236, 72, 153, 0.2)",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
    link: "#",
    github: "https://github.com/Solved-Overnight/hyperflow-inference-mesh",
    features: [
      "Zero-copy streaming pipeline over WebSockets & gRPC",
      "Intelligent prompt caching reducing API token costs by 45%",
      "Multi-provider failover routing (Gemini, OpenAI, Anthropic)",
      "Built-in telemetry dashboard with Prometheus and OpenTelemetry"
    ],
    highlights: [
      { label: "Throughput", value: "25k req/s" },
      { label: "Cost Savings", value: "45%" },
      { label: "First Token Latency", value: "< 90ms" }
    ]
  }
];

export const EXPERIENCE: Experience[] = [
  {
    role: "AI/ML Engineer",
    company: "Lantabur Apparels Ltd.",
    period: "2025 - Present",
    description: "Increased monthly factory output by 22% (18 → 22 tons) through ML-powered demand forecasting and automated procurement planning. Reduced QA headcount by 40% (5 → 3) using AI-driven production analytics and visual inspection."
  },
  {
    role: "Machine Learning Engineer",
    company: "AppliedVastu",
    period: "2023 - 2025",
    description: "Achieved 88% classification accuracy on a live product serving 5,000+ users by building and deploying a TensorFlow deep learning system for floor-plan image classification."
  }
];

export const SKILLS: SkillCategory[] = [
  {
    category: "Languages",
    skills: ["Python", "JavaScript", "Java"]
  },
  {
    category: "AI & Machine Learning",
    skills: ["PyTorch", "TensorFlow", "LLMs", "LangChain"]
  },
  {
    category: "Data & MLOps",
    skills: ["Pandas", "NumPy", "Docker", "MLflow"]
  }
];

export const CERTIFICATIONS: Certification[] = [
  {
    name: "Professional Cloud Architect",
    issuer: "Google Cloud",
    year: "2023"
  },
  {
    name: "Certified Solutions Architect - Associate",
    issuer: "Amazon Web Services",
    year: "2022"
  },
  {
    name: "Deep Learning Specialization",
    issuer: "DeepLearning.AI",
    year: "2021"
  },
  {
    name: "TensorFlow Developer Certificate",
    issuer: "Google",
    year: "2021"
  }
];

export const LEADERSHIP: LeadershipItem[] = [
  {
    role: "Lead Organizer",
    event: "University Hackathon",
    year: "2019",
    description: "Orchestrated logistics, sponsorship, and judging for a 48-hour event with 200+ participants."
  },
  {
    role: "Team Lead",
    event: "Regional Innovation Challenge",
    year: "2020",
    description: "Led a cross-functional team of 5 developers to build an award-winning accessibility tool, securing 1st place among 50 teams."
  },
  {
    role: "Tech Community Mentor",
    event: "Local Dev Guild",
    year: "2022-Present",
    description: "Mentoring junior developers and conducting workshops on React and Modern UI patterns."
  }
];

export const SOCIALS = {
  github: "https://github.com/Solved-Overnight",
  linkedin: "https://linkedin.com/in/mzrishad/",
  twitter: "https://twitter.com/mzrishad",
  email: "mzrishad.info@gmail.com",
  whatsapp: "+8801710237055"
};

export const KALI_ASCII_ART = `
      ..............
    ..,;:ccc,.
  ......''';lxO.
.....''''..........,:ld;
           .';;;:::;,,.x,
      ..'''.            0Xxoc:,.  ...
  ....                ,ONkc;,;cokOdc',.
 .                   OMo           ':ddo.
                    dMc               :OO;
                    0M.                 .:o.
                    ;Wd
                     ;XO,
                       ,d0Odlc;,..
                           ..',;:cdOOd::,.
                                    .:d;.':;.
                                       'd,  .'
                                         ;l   ..
                                          .o
                                            c
                                            .'
                                             .
`;

// Mock File System Structure representing the "home" directory
export const FILE_SYSTEM: { [key: string]: FileSystemNode } = {
  'about.txt': { type: 'file', content: ABOUT_TEXT },
  'contact.txt': { type: 'file', content: `Email: ${SOCIALS.email}\nGitHub: ${SOCIALS.github}\nLinkedIn: ${SOCIALS.linkedin}\nTwitter: ${SOCIALS.twitter}` },
  'projects': {
    type: 'directory',
    children: PROJECTS.reduce((acc, proj) => ({
      ...acc,
      [proj.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.txt']: {
        type: 'file',
        content: `Name: ${proj.name}\nDescription: ${proj.description}\nTech Stack: ${proj.tech.join(', ')}`
      }
    }), {} as { [key: string]: FileSystemNode })
  },
  'skills': {
    type: 'directory',
    children: SKILLS.reduce((acc, skill) => ({
      ...acc,
      [skill.category.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.txt']: {
        type: 'file',
        content: skill.skills.join('\n')
      }
    }), {} as { [key: string]: FileSystemNode })
  },
  'experience.txt': {
    type: 'file',
    content: EXPERIENCE.map(e => `${e.role} @ ${e.company} (${e.period})\n${e.description}`).join('\n\n')
  },
  'blogs': {
    type: 'directory',
    children: {
      'blog1.md': { type: 'file', content: 'Building High-Performance AI Applications with Gemini 3.6 Flash' },
      'blog2.md': { type: 'file', content: 'Why Every AI Engineer Needs an Interactive Terminal Portfolio' },
      'blog3.md': { type: 'file', content: 'Architecting Real-Time LLM Agents and Local State Engines' }
    }
  },
  'secret': {
    type: 'directory',
    children: {
        'plan.txt': { type: 'file', content: '1. Build cool things.\n2. ???\n3. Profit.' }
    }
  }
};

export const SYSTEM_INSTRUCTION = `
You are Moniruzzaman Rishad, an AI & ML Engineer.
You are interacting with a visitor via your Linux-style terminal portfolio website.
Your goal is to answer questions about your background, skills, and projects in a concise, technical, yet friendly manner.

Here is your personal data:
About: ${ABOUT_TEXT}
Experience: ${JSON.stringify(EXPERIENCE)}
Projects: ${JSON.stringify(PROJECTS)}
Skills: ${JSON.stringify(SKILLS)}

Guidelines:
- ALWAYS speak in the first person ("I", "my", "me"). 
- Never refer to yourself as "the AI" or "an AI persona". You are Rishad.
- Keep responses relatively short and punchy, suitable for a terminal interface.
- Use technical terminology where appropriate but remain accessible.
- If asked about "sudo", make a joke about the user not having root privileges on your machine.
- If asked about contact info, provide your email hello@rishadhabib.me.
- Be humble but confident.
`;
