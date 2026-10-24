export const resumeData = {
  profile: {
    name: "Shyamal",
    title: "Full-Stack Developer | 3D & WebGL Enthusiast | AI Explorer",
    status: "Available for High-Impact Roles & Collaborations",
    bio: "I build modern web applications, immersive 3D experiences, and intelligent systems that solve real-world problems. Passionate about technology, creativity and continuous learning.",
    location: "Global / Remote & Hybrid",
    email: "shyamal.eng@gmail.com",
    phone: "+1 (555) 234-5678",
    website: "https://shyamal.dev",
    github: "https://github.com/shyamal",
    linkedin: "https://linkedin.com/in/shyamal",
    twitter: "https://x.com/shyamal",
    photo: "/shyamal.jpg",
    photoFit: "cover", // "cover" | "contain" | "fill"
    photoScale: 1.0,
    photoOffsetY: 0,
    heroPedestal: "/hero-pedestal.jpg",
    stats: [
      { label: "Years Experience", value: "4+" },
      { label: "Production Apps", value: "25+" },
      { label: "Github Contributions", value: "1,200+" },
      { label: "Architecture Uptime", value: "99.98%" },
    ],
    keyInterests: [
      { title: "Full-Stack Development", icon: "Layers" },
      { title: "3D Graphics & WebGL", icon: "Box" },
      { title: "AI & Machine Learning", icon: "Brain" },
      { title: "Cloud Computing", icon: "Cloud" },
      { title: "System Design", icon: "Cpu" },
    ],
    quote: "Build • Learn • Grow"
  },

  sectionsOrder: [
    'about',
    'skills',
    'projects',
    'experience',
    'education',
    'certifications',
    'achievements',
    'contact'
  ],

  sectionsVisibility: {
    about: true,
    skills: true,
    projects: true,
    experience: true,
    education: true,
    certifications: true,
    achievements: true,
    contact: true,
  },

  customSections: [],

  skills: [
    {
      category: "Programming Languages",
      items: [
        { name: "JavaScript", level: 96, highlight: true, tag: "JS", color: "#f7df1e" },
        { name: "Python", level: 92, highlight: true, tag: "PY", color: "#387eb8" },
        { name: "TypeScript", level: 94, highlight: true, tag: "TS", color: "#3178c6" },
        { name: "C", level: 86, highlight: false, tag: "C", color: "#659ad2" },
        { name: "Java", level: 88, highlight: false, tag: "JV", color: "#f89820" },
      ]
    },
    {
      category: "Frontend Development",
      items: [
        { name: "React", level: 96, highlight: true, tag: "RE", color: "#61dafb" },
        { name: "Next.js", level: 94, highlight: true, tag: "NX", color: "#ffffff" },
        { name: "HTML5", level: 98, highlight: false, tag: "H5", color: "#e34f26" },
        { name: "CSS3", level: 95, highlight: false, tag: "C3", color: "#1572b6" },
        { name: "TailwindCSS", level: 95, highlight: true, tag: "TW", color: "#38bdf8" },
      ]
    },
    {
      category: "Backend Development",
      items: [
        { name: "Node.js", level: 93, highlight: true, tag: "ND", color: "#539e43" },
        { name: "Express", level: 91, highlight: false, tag: "EX", color: "#ffffff" },
        { name: "Python / FastAPI", level: 90, highlight: true, tag: "FA", color: "#009688" },
        { name: "Java / Spring", level: 85, highlight: false, tag: "SP", color: "#6db33f" },
      ]
    },
    {
      category: "Databases",
      items: [
        { name: "MongoDB", level: 92, highlight: true, tag: "MG", color: "#47a248" },
        { name: "PostgreSQL", level: 93, highlight: true, tag: "PG", color: "#336791" },
        { name: "MySQL", level: 89, highlight: false, tag: "MY", color: "#4479a1" },
        { name: "Firebase", level: 87, highlight: false, tag: "FB", color: "#ffca28" },
      ]
    },
    {
      category: "Cloud & DevOps",
      items: [
        { name: "AWS", level: 90, highlight: true, tag: "AWS", color: "#ff9900" },
        { name: "Docker", level: 91, highlight: true, tag: "DK", color: "#2496ed" },
        { name: "Kubernetes", level: 84, highlight: false, tag: "K8", color: "#326ce5" },
        { name: "Linux", level: 89, highlight: false, tag: "LX", color: "#fcc624" },
      ]
    },
    {
      category: "Tools & Platforms",
      items: [
        { name: "Git", level: 95, highlight: true, tag: "GT", color: "#f05032" },
        { name: "GitHub", level: 95, highlight: true, tag: "GH", color: "#ffffff" },
        { name: "VS Code", level: 96, highlight: false, tag: "VS", color: "#007acc" },
        { name: "Figma", level: 88, highlight: false, tag: "FG", color: "#f24e1e" },
      ]
    }
  ],

  projects: [
    {
      id: "lawshield",
      title: "LawShield",
      category: "Full-Stack & AI",
      tagline: "AI-powered legal document analysis and fraud detection system.",
      description: "An intelligent legal document ingestion, automated summarization, and anomaly verification platform leveraging LLM fine-tuning, vector search, and secure multi-tenant workflows.",
      highlights: [
        "Automated optical analysis of legal contracts with 98.4% extraction accuracy",
        "Sub-100ms vector semantic search over 50,000+ clauses",
        "Role-based access control and tamper-proof audit trails",
      ],
      tech: ["React", "Node.js", "Python", "MongoDB"],
      image: "/project-lawshield.jpg",
      liveUrl: "https://lawshield.dev",
      githubUrl: "https://github.com/shyamal/lawshield",
      stars: 480,
      featured: true,
      color: "from-blue-600 to-cyan-500"
    },
    {
      id: "voiceshield",
      title: "VoiceShield",
      category: "3D & AI",
      tagline: "Real-time voice authentication and anti-spoofing system.",
      description: "High-security biometric voice verification platform featuring live real-time audio waveform visualizers, synthetic voice deepfake detection, and sub-100ms voiceprint matching.",
      highlights: [
        "Real-time spectrogram and 3D waveform audio visualizer with WebGL Canvas",
        "Deep learning neural acoustic embeddings preventing replay attacks",
        "Sub-50ms biometric verification processing pipeline",
      ],
      tech: ["React", "TensorFlow", "Python"],
      image: "/project-voiceshield.jpg",
      liveUrl: "https://voiceshield.dev",
      githubUrl: "https://github.com/shyamal/voiceshield",
      stars: 620,
      featured: true,
      color: "from-cyan-500 to-blue-600"
    },
    {
      id: "talentnexus",
      title: "TalentNexus",
      category: "Full-Stack & Systems",
      tagline: "AI-driven talent sourcing and recruitment platform.",
      description: "An automated enterprise talent discovery portal matching engineering profiles with technical job specs through contextual skill matching, candidate telemetry, and interactive assessment dashboards.",
      highlights: [
        "Contextual natural language candidate ranking with cross-encoder scoring",
        "Real-time collaborative recruiter evaluation board powered by WebSockets",
        "Automated ATS resume parser and benchmark candidate scoring system",
      ],
      tech: ["Next.js", "Node.js", "PostgreSQL"],
      image: "/project-talentnexus.jpg",
      liveUrl: "https://talentnexus.dev",
      githubUrl: "https://github.com/shyamal/talentnexus",
      stars: 840,
      featured: true,
      color: "from-purple-600 to-pink-500"
    },
    {
      id: "spatialcraft-3d",
      title: "SpatialCraft 3D Studio",
      category: "3D & WebGL",
      tagline: "In-browser WebGL spatial scene composer and procedural material sandbox.",
      description: "A high-performance browser-based 3D environment builder utilizing Three.js and custom GLSL shaders with real-time PBR lighting and glTF streaming.",
      highlights: [
        "60 FPS smooth rendering with dynamic LOD (Level of Detail)",
        "Zero-latency physics simulation with Rapier engine",
        "Collaborative multi-user room sync via WebSockets",
      ],
      tech: ["Three.js", "React 19", "GLSL Shaders", "WebSockets"],
      image: "/project-voiceshield.jpg",
      liveUrl: "https://spatialcraft-preview.dev",
      githubUrl: "https://github.com/shyamal/spatialcraft-3d",
      stars: 520,
      featured: false,
      color: "from-cyan-400 to-teal-500"
    }
  ],

  journey: [
    {
      period: "2021 — 2025",
      title: "B. Tech in Computer Science",
      subtitle: "Your University",
      detail: "CGPA: 8.5 (Distinction)",
      type: "education",
      color: "cyan"
    },
    {
      period: "2024",
      title: "AWS Certified Cloud Practitioner",
      subtitle: "Amazon Web Services",
      detail: "Cloud Computing & Infrastructure",
      type: "certification",
      color: "blue"
    },
    {
      period: "2023 — 2024",
      title: "Internship — Full Stack Developer",
      subtitle: "Tech Company",
      detail: "Built and maintained web applications using React, Node.js and MongoDB.",
      type: "experience",
      color: "purple"
    },
    {
      period: "2022 — 2023",
      title: "Personal Projects",
      subtitle: "Open Source & Freelance",
      detail: "Developed AI and 3D web applications with cutting-edge visual pipelines.",
      type: "projects",
      color: "pink"
    }
  ],

  experience: [
    {
      role: "Internship — Full Stack Developer",
      company: "Tech Company",
      period: "2023 — 2024",
      location: "Remote / Hybrid",
      description: "Built and maintained responsive web applications, high-throughput REST APIs, and database schemas using React, Node.js, and MongoDB.",
      achievements: [
        "Architected reusable responsive React component libraries improving sprint delivery velocity by 35%.",
        "Engineered robust MongoDB aggregations and indexing strategies reducing query latency by 45%.",
        "Collaborated on production deployments with Docker containerization and CI/CD pipelines.",
      ],
      skills: ["React", "Node.js", "MongoDB", "Express", "TailwindCSS"],
      current: false,
    },
    {
      role: "Open Source Contributor & Freelance Engineer",
      company: "Personal Projects",
      period: "2022 — 2023",
      location: "Remote",
      description: "Developed AI and 3D web applications, contributing to community WebGL graphics algorithms, custom shaders, and interactive web tools.",
      achievements: [
        "Engineered browser-based WebGL audio visualizers and neural search engines with 15k+ community views.",
        "Built popular interactive canvas animation hooks and full-stack developer portfolio platforms.",
      ],
      skills: ["Three.js", "Python", "TensorFlow", "WebGL", "TypeScript"],
      current: false,
    }
  ],

  education: [
    {
      degree: "B. Tech in Computer Science",
      institution: "Your University",
      period: "2021 — 2025",
      grade: "CGPA: 8.5 (Distinction)",
      highlights: [
        "Specialization in Computer Graphics, Algorithms, and Distributed Systems",
        "Active member of Web & AI Technical Club; participant in state-wide hackathons",
        "Developed multiple end-to-end full-stack capstone projects including LawShield and VoiceShield",
      ]
    }
  ],

  certifications: [
    {
      name: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      year: "2024",
      badge: "Cloud Computing & Infrastructure",
      url: "https://aws.amazon.com/verification"
    },
    {
      name: "React Development",
      issuer: "Frontend Masters",
      year: "2023",
      badge: "Frontend Architecture",
      url: "https://frontendmasters.com"
    },
    {
      name: "Java Programming",
      issuer: "Oracle University",
      year: "2023",
      badge: "Backend Systems",
      url: "https://mylearn.oracle.com"
    },
    {
      name: "Python Programming",
      issuer: "DeepLearning.AI",
      year: "2023",
      badge: "Machine Learning & Algorithms",
      url: "https://www.deeplearning.ai"
    }
  ],

  achievements: [
    {
      title: "AWS Certified Cloud Practitioner",
      organization: "Amazon Web Services",
      year: "2024",
      badge: "Cloud Certification",
      actionText: "View Certificate",
      description: "Validated comprehensive expertise in Amazon Web Services core infrastructure, security, serverless computing, and cost optimization.",
      url: "https://aws.amazon.com/verification"
    },
    {
      title: "Hackathon Participant",
      organization: "Tech Fest",
      year: "2023",
      badge: "Collegiate Hackathon",
      actionText: "View Details",
      description: "Built and pitched VoiceShield real-time biometric anti-spoofing system in a 48-hour competitive engineering hackathon.",
      url: "https://github.com/shyamal/voiceshield"
    },
    {
      title: "Academic Distinction",
      organization: "University",
      year: "2021 — 2025",
      badge: "University Honors",
      actionText: "View Details",
      description: "Maintained First Class Distinction with a cumulative 8.5 CGPA throughout the Bachelor of Technology in Computer Science curriculum.",
      url: "#"
    }
  ],

  capabilityBadges: [
    { name: "3D WebGL Scene", icon: "Box" },
    { name: "GSAP Scroll Animations", icon: "Sparkles" },
    { name: "PDF Export (ATS Friendly)", icon: "FileText" },
    { name: "Native Print Isolation", icon: "Printer" },
    { name: "Responsive Design", icon: "Monitor" },
    { name: "Performance Optimized", icon: "Zap" },
    { name: "CI/CD (GitHub Actions)", icon: "GitBranch" },
    { name: "Vercel Deployment", icon: "Triangle" }
  ]
};
