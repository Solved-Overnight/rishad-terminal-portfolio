
import { Experience, Project, SkillCategory, FileSystemNode, Certification, LeadershipItem } from './types';

// Toggle this to false to hide the "Open for Remote job" status across the app
export const OPEN_FOR_WORK = false;

export const ABOUT_TEXT = `AI & Machine Learning Engineer with experience building machine learning systems, computer vision applications, data pipelines, and LLM-based workflows.

Reported production outcomes include a 22% increase in monthly factory output through demand forecasting and a TensorFlow floor-plan classifier reporting 88% accuracy for a product serving 5,000+ users.

Works with Python, TensorFlow, scikit-learn, data preprocessing, ETL, FastAPI, RAG, and agent frameworks. Focused on building and integrating practical ML and applied AI systems.`;


export const PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "Agentic AI Business Automation Platform",
    tagline: "Autonomous Agent Orchestrator for Business Q&A & Workflow Automation",
    description: "Configurable agent platform for enterprise business Q&A and workflow automation with LangGraph, LangChain, Groq LLMs, and FastAPI.",
    longDescription: "Engineered a configurable agent platform for business Q&A and workflow automation, using Python, Natural Language Processing (NLP), LangGraph, LangChain, Groq LLMs, and FastAPI. Implemented retrieval-augmented generation (RAG), document ingestion, embeddings, semantic search, ChromaDB vector storage, and conversational memory for business-specific information retrieval. Built FastAPI services connecting LLM providers and external tools, with modular components for configurable agent capabilities, API rate limiting, persistent memory, retrieval pipelines, and tool-based execution for agent workflows.",
    tech: ["Python", "LangGraph", "LangChain", "Groq", "FastAPI", "ChromaDB", "NLP"],
    category: "Generative AI & LLMs",
    stars: 580,
    forks: 142,
    color: "#00f0ff",
    accentColor: "rgba(0, 240, 255, 0.2)",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    link: "https://github.com/Solved-Overnight/agentic-business-automation",
    github: "https://github.com/Solved-Overnight/agentic-business-automation",
    features: [
      "Modular multi-agent architecture with LangGraph state graphs",
      "Retrieval-Augmented Generation (RAG) with ChromaDB vector storage",
      "FastAPI microservices connecting LLM providers (Groq) & external tools",
      "Production rate limiting, conversational memory & tool-based workflows"
    ],
    highlights: [
      { label: "Architecture", value: "LangGraph Multi-Agent" },
      { label: "Vector DB", value: "ChromaDB" },
      { label: "LLM Provider", value: "Groq High-Speed" }
    ]
  },
  {
    id: "proj-2",
    name: "Vastu Floor Plan Analyzer",
    tagline: "Computer Vision & Deep Learning Compliance Classifier",
    description: "Convolutional neural network to classify floor-plan images for Vastu compliance, achieving 88% accuracy in a live product serving 5,000+ users.",
    longDescription: "Developed a convolutional neural network (CNN) using Python, TensorFlow, and Deep Learning to classify floor-plan images for Vastu compliance. The reported model accuracy was 88%, and the product was deployed in production serving a live user base of 5,000+ users.",
    tech: ["Python", "TensorFlow", "Deep Learning", "Computer Vision", "CNN"],
    category: "Computer Vision & ML",
    stars: 430,
    forks: 98,
    color: "#10b981",
    accentColor: "rgba(16, 185, 129, 0.2)",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    link: "https://github.com/Solved-Overnight/vastu-floor-plan-analyzer",
    github: "https://github.com/Solved-Overnight/vastu-floor-plan-analyzer",
    features: [
      "Convolutional Neural Network for floor plan architectural segmentation",
      "Live deployment in product serving 5,000+ active users",
      "High-precision Vastu compliance classification pipeline",
      "End-to-end model inference optimization with TensorFlow"
    ],
    highlights: [
      { label: "Model Accuracy", value: "88%" },
      { label: "Active Users", value: "5,000+" },
      { label: "Framework", value: "TensorFlow Deep Learning" }
    ]
  },
  {
    id: "proj-3",
    name: "Lantabur Industrial Intelligence Hub",
    tagline: "Real-Time Garment Manufacturing Analytics & IoT Stream Monitor",
    description: "Real-time analytics platform ingesting IoT sensor streams to monitor garment-manufacturing KPIs, with pipelines built for predictive analytics.",
    longDescription: "Built a real-time analytics platform to ingest IoT sensor streams and monitor garment-manufacturing KPIs, with data pipelines designed to support future predictive analytics and ML integration for Lantabur Apparels Ltd.",
    tech: ["React", "Firebase", "IoT", "Data Pipelines", "TypeScript"],
    category: "MLOps & Systems",
    stars: 320,
    forks: 65,
    color: "#f59e0b",
    accentColor: "rgba(245, 158, 11, 0.2)",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop",
    link: "https://github.com/Solved-Overnight/industrial-intelligence-hub",
    github: "https://github.com/Solved-Overnight/industrial-intelligence-hub",
    features: [
      "Real-time IoT sensor telemetry ingestion and KPI dashboards",
      "Production line monitoring for large-scale garment manufacturing",
      "Predictive analytics & ML integration data architecture",
      "Responsive React interface connected to Firebase real-time database"
    ],
    highlights: [
      { label: "Factory Output", value: "+22% Ton Boost" },
      { label: "Data Stream", value: "Real-Time IoT" },
      { label: "Stack", value: "React + Firebase" }
    ]
  },
  {
    id: "proj-4",
    name: "Scorpion 2.0 – Automated Dataset Generation System",
    tagline: "Concurrent Web Scraping & High-Throughput ML Dataset Pipeline",
    description: "Concurrent web-scraping framework to generate labeled ML training datasets, increasing throughput by 3x over baseline implementation.",
    longDescription: "Developed a concurrent web-scraping framework using Python, Selenium, and Concurrency to generate labeled ML training datasets; throughput increased by a reported 3x over the baseline implementation.",
    tech: ["Python", "Selenium", "Concurrency", "ETL", "Data Mining"],
    category: "MLOps & Systems",
    stars: 295,
    forks: 72,
    color: "#ec4899",
    accentColor: "rgba(236, 72, 153, 0.2)",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
    link: "https://github.com/Solved-Overnight/scorpion-dataset-generation",
    github: "https://github.com/Solved-Overnight/scorpion-dataset-generation",
    features: [
      "Concurrent multi-threaded Selenium scraping engine",
      "Automated labeling, cleaning, and formatting for ML datasets",
      "3x throughput acceleration over baseline implementations",
      "Robust anti-blocking heuristics and error-recovery pipelines"
    ],
    highlights: [
      { label: "Throughput", value: "3x Baseline Boost" },
      { label: "Task", value: "Automated ML Dataset Gen" },
      { label: "Engine", value: "Python Concurrency" }
    ]
  },
  {
    id: "proj-5",
    name: "Vastu Compass – Spatial Intelligence Application",
    tagline: "Android GPS & Sensor Fusion Spatial Alignment Engine",
    description: "Android application combining GPS and device-sensor inputs for spatial alignment and grid mapping, deployed to 5,000+ users.",
    longDescription: "Developed an Android application combining GPS and device-sensor inputs for spatial alignment and grid mapping; the application was deployed to a reported user base of 5,000+.",
    tech: ["Android", "GPS", "Sensor Fusion", "Kotlin", "Spatial Mapping"],
    category: "Computer Vision & ML",
    stars: 360,
    forks: 84,
    color: "#8b5cf6",
    accentColor: "rgba(139, 92, 246, 0.2)",
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop",
    link: "https://github.com/Solved-Overnight/vastu-compass-spatial",
    github: "https://github.com/Solved-Overnight/vastu-compass-spatial",
    features: [
      "Device sensor fusion integrating magnetometer, gyroscope, and accelerometer",
      "High-accuracy GPS spatial alignment and custom grid mapping",
      "Live deployment in Google Play / Android ecosystem serving 5,000+ users",
      "Smooth hardware-accelerated real-time directional compass UI"
    ],
    highlights: [
      { label: "User Base", value: "5,000+ Users" },
      { label: "Sensors", value: "GPS + Sensor Fusion" },
      { label: "Platform", value: "Android Native" }
    ]
  }
];

export const EXPERIENCE: Experience[] = [
  {
    role: "AI/Machine Learning Engineer",
    company: "Lantabur Apparels Ltd.",
    location: "Gazipur, Dhaka, Bangladesh",
    period: "September 2025 – Present",
    description: "Built demand forecasting and production analytics pipelines, increasing monthly factory output from 18 to 22 tons (22% increase) and reducing QA staffing by 40% with AI visual inspection.",
    points: [
      "Built an ML-powered demand forecasting system to support raw-material procurement planning 2–3 weeks ahead; monthly factory output increased from 18 to 22 tons (reported 22% increase).",
      "Developed historical production-data pipelines to identify order patterns and support proactive purchasing decisions; the team reported zero procurement delays after deployment.",
      "Deployed an AI-assisted visual inspection system for repetitive quality-control tasks; QA staffing for the workflow decreased from five inspectors to three (reported 40% reduction)."
    ]
  },
  {
    role: "Machine Learning Engineer",
    company: "AppliedVastu",
    location: "India (Remote)",
    period: "May 2023 – August 2025",
    description: "Built and deployed TensorFlow deep-learning models for floor-plan classification (88% accuracy) serving 5,000+ users, designed geospatial ETL pipelines, and built scoring/ranking models.",
    points: [
      "Built and deployed a TensorFlow deep-learning model to classify floor-plan images, reporting 88% classification accuracy in a live product serving 5,000+ users.",
      "Designed Python ETL pipelines for geospatial datasets used in production; data-ingestion efficiency improved by a reported 40%.",
      "Developed and deployed machine-learning scoring and ranking models used in property-intelligence features.",
      "Built and maintained web and Android applications with integrated machine-learning inference pipelines."
    ]
  }
];

export const SKILLS: SkillCategory[] = [
  {
    category: "Programming and Data",
    skills: [
      "Python",
      "SQL",
      "pandas",
      "NumPy",
      "Matplotlib",
      "Jupyter Notebook",
      "data preprocessing",
      "EDA",
      "ETL pipelines",
      "dataset generation"
    ]
  },
  {
    category: "Machine Learning",
    skills: [
      "Supervised learning",
      "classification",
      "regression",
      "neural networks",
      "deep learning",
      "computer vision",
      "feature engineering",
      "model evaluation",
      "model deployment",
      "TensorFlow",
      "scikit-learn"
    ]
  },
  {
    category: "Generative and Agentic AI",
    skills: [
      "LLMs",
      "RAG",
      "prompt engineering",
      "tool/function calling",
      "conversational memory",
      "semantic search",
      "embeddings",
      "AI agents",
      "LangChain",
      "LangGraph",
      "MCP",
      "Hugging Face",
      "Groq"
    ]
  },
  {
    category: "Backend and Tools",
    skills: [
      "FastAPI",
      "REST APIs",
      "API integration",
      "API rate limiting",
      "Git",
      "GitHub",
      "Linux",
      "Bash",
      "Docker"
    ]
  },
  {
    category: "Applications and Data Collection",
    skills: [
      "React",
      "JavaScript",
      "HTML",
      "CSS",
      "Recharts",
      "Android development",
      "Selenium",
      "BeautifulSoup",
      "web scraping"
    ]
  }
];

export const CERTIFICATIONS: Certification[] = [
  {
    name: "Machine Learning Specialization",
    issuer: "Andrew Ng, Coursera",
    year: "In Progress, 2025",
    status: "In Progress",
    details: "Supervised and unsupervised learning, deep learning foundations, ML best practices"
  },
  {
    name: "Applied Machine Learning & Data Science",
    issuer: "Coursera",
    year: "2026",
    status: "Completed",
    details: "Supervised machine learning, feature engineering, Python-based ML pipelines"
  },
  {
    name: "Google IT Support Professional Certificate",
    issuer: "Google, Coursera",
    year: "2024",
    status: "Completed",
    details: "Linux, networking, system administration"
  },
  {
    name: "Data Visualisation: Empowering Business with Effective Insights",
    issuer: "Tata Group, Forage",
    year: "2024",
    status: "Completed",
    details: "Data storytelling, executive dashboards, business insights"
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
  'summary.txt': { type: 'file', content: ABOUT_TEXT },
  'contact.txt': { type: 'file', content: `Email: ${SOCIALS.email}\nGitHub: ${SOCIALS.github}\nLinkedIn: ${SOCIALS.linkedin}\nTwitter: ${SOCIALS.twitter}\nWhatsApp: ${SOCIALS.whatsapp}` },
  'projects': {
    type: 'directory',
    children: PROJECTS.reduce((acc, proj) => ({
      ...acc,
      [proj.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.txt']: {
        type: 'file',
        content: `Name: ${proj.name}\nTagline: ${proj.tagline || ''}\nCategory: ${proj.category || ''}\n\nDescription:\n${proj.longDescription || proj.description}\n\nTech Stack:\n${proj.tech.join(', ')}`
      }
    }), {} as { [key: string]: FileSystemNode })
  },
  'skills': {
    type: 'directory',
    children: SKILLS.reduce((acc, skill) => ({
      ...acc,
      [skill.category.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.txt']: {
        type: 'file',
        content: `[CATEGORY: ${skill.category.toUpperCase()}]\n\n` + skill.skills.map(s => `• ${s}`).join('\n')
      }
    }), {} as { [key: string]: FileSystemNode })
  },
  'experience.txt': {
    type: 'file',
    content: EXPERIENCE.map(e => {
      const locStr = e.location ? ` | ${e.location}` : '';
      const pointsStr = e.points && e.points.length > 0 
        ? '\n' + e.points.map(p => `  – ${p}`).join('\n')
        : `\n  ${e.description}`;
      return `${e.role} @ ${e.company}${locStr} (${e.period})${pointsStr}`;
    }).join('\n\n')
  },
  'certifications.txt': {
    type: 'file',
    content: CERTIFICATIONS.map(c => `• ${c.name}\n  Issuer: ${c.issuer}\n  Year: ${c.year}${c.status ? `\n  Status: ${c.status}` : ''}${c.details ? `\n  Focus: ${c.details}` : ''}`).join('\n\n')
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
Professional Summary / About: ${ABOUT_TEXT}
Experience: ${JSON.stringify(EXPERIENCE)}
Projects: ${JSON.stringify(PROJECTS)}
Skills: ${JSON.stringify(SKILLS)}
Certifications: ${JSON.stringify(CERTIFICATIONS)}

Guidelines:
- ALWAYS speak in the first person ("I", "my", "me"). 
- Never refer to yourself as "the AI" or "an AI persona". You are Rishad.
- Keep responses relatively short and punchy, suitable for a terminal interface.
- Use technical terminology where appropriate but remain accessible.
- If asked about "sudo", make a joke about the user not having root privileges on your machine.
- If asked about contact info, provide your email mzrishad.info@gmail.com.
- Be humble but confident.
`;
