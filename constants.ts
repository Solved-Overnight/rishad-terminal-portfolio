
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
    name: "AI Portfolio Terminal",
    description: "An interactive terminal-based portfolio website powered by Gemini AI.",
    tech: ["React", "TypeScript", "Gemini API", "Tailwind"],
    link: "#"
  },
  {
    name: "E-Commerce Dashboard",
    description: "A comprehensive analytics dashboard for online retailers with real-time data.",
    tech: ["Next.js", "Supabase", "Recharts"],
    link: "#"
  },
  {
    name: "Neural Style Transfer",
    description: "Deep learning model implementation for artistic style transfer on images.",
    tech: ["Python", "PyTorch", "Flask"],
    link: "#"
  }
];

export const EXPERIENCE: Experience[] = [
  {
    role: "Senior Software Engineer",
    company: "Tech Innovations Inc.",
    period: "2023 - Present",
    description: "Leading the frontend team in migrating legacy systems to React 18. Implementing AI-driven features for user personalization."
  },
  {
    role: "Full Stack Developer",
    company: "Creative Solutions Ltd",
    period: "2020 - 2023",
    description: "Developed and maintained multiple client-facing web applications. Optimized database queries improving load times by 40%."
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
  'secret': {
    type: 'directory',
    children: {
        'plan.txt': { type: 'file', content: '1. Build cool things.\n2. ???\n3. Profit.' }
    }
  }
};
