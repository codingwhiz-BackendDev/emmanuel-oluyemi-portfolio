export const profile = {
  name: "Emmanuel Oluyemi",
  firstName: "Emmanuel",
  lastName: "Oluyemi",
  role: "Software & Mobile Developer",
  tagline: "Building scalable, secure web applications and mobile experiences that turn innovative ideas into production-ready products.",
  intro: {
    title: "Software & Mobile Developer",
    paragraphs: [
      "A passionate full-stack developer specializing in backend engineering and mobile development. I craft scalable, efficient, and reliable web applications using Django, React, and JavaScript, while building cross-platform mobile experiences with Dart & Flutter.",
      "With a solid foundation in computer science and a keen eye for detail, I excel at building robust backend systems that power fast, secure, and engaging web and mobile experiences. Currently studying Computer Science at Redeemer's University Ede (2023–2027).",
    ],
    skillsNote: [
      { label: "Currently in 4th year.", value: "Started October 26, 2023." },
      { label: "Started programming in 2021.", value: "5+ years of personal and freelance project experience." },
    ],
  },
  skills: {
    Languages: ["Python", "JavaScript", "Dart", "TypeScript"],
    Frameworks: ["Django", "React.js", "Flask", "Flutter", "FastAPI"],
    Databases: ["PostgreSQL", "MongoDB", "Redis", "SQLite", "MySQL"],
    Tools: ["Git", "Docker", "Celery", "REST APIs", "WebSockets", "TailwindCSS"],
  },
  socials: {
    x: "https://x.com/IAmCodingWhiz",
    github: "https://github.com/codingwhiz-BackendDev",
    linkedin: "https://www.linkedin.com/in/emmanuel-oluyemi-9116a4300/",
    email: "mailto:oluyemiemma2409@gmail.com",
  },
};

export const services = [
  {
    title: "Web Development",
    description: "I build scalable and functional web applications with modern technologies and best practices — from idea to deployment.",
    icon: "Code2",
  },
  {
    title: "Backend Engineering",
    description: "I design, build and maintain robust backend & server-side applications with focus on performance, security and reliability.",
    icon: "Server",
  },
  {
    title: "Web Scraping & Automation",
    description: "I use Python to scrape websites and automate repetitive tasks, saving time and increasing productivity for businesses.",
    icon: "Bot",
  },
  {
    title: "API Development",
    description: "I design and develop reliable, well-documented APIs that enable seamless integration between systems and third-party services.",
    icon: "Plug",
  },
  {
    title: "Mobile Development",
    description: "I build high-performance, cross-platform mobile applications with fluid user experiences and clean architectural patterns.",
    icon: "Smartphone",
  },
];

export const achievements = {
  general: [
    {
      title: "Completed 20+ Projects",
      description: "Successfully designed, developed, and deployed over 20 web applications ranging from simple websites to complex full-stack applications.",
    },
    {
      title: "Python Developer Certification",
      description: "Earned certification in Python development, demonstrating proficiency in building applications with Python and related frameworks.",
    },
    {
      title: "Growing Online Community",
      description: "Regularly active on X (Twitter) and LinkedIn sharing my journey, learning progress and struggles as a 20-year-old Nigerian programmer.",
    },
    {
      title: "Published PyPI Package",
      description: "Open-sourced django-quickstart-setup on PyPI — a package that fully automates Django project setup including settings, urls, templates, and static files.",
    },
  ],
  hackathon: [
    {
      title: "Datican 2025 Hackathon",
      description: "Won third place in the university-wide hackathon with an AI-powered medical diagnosis application. Competed against 25+ teams.",
      image: "/images/portfolio/datican.jpg",
    },
    {
      title: "CodeWars 2025",
      description: "Won third place in the university-wide CodeWars hackathon. Solved an educational problem competing against 25+ teams.",
      image: "/images/portfolio/codewars.jpg",
    },
  ],
};

export const experiences = [
  {
    role: "Founder & Backend Engineer",
    company: "Orion Labs",
    period: "2024 — Present",
    products: ["DjangoPilot", "Sellaris AI"],
    tech: ["Django", "Python", "PostgreSQL", "React", "Docker"],
    bullets: [
      "Founder of Orion Labs, a forward-thinking tech company focused on building impactful, future-driven SaaS solutions. We create intelligent and scalable platforms that empower developers and businesses.",
      "Leading the development of DjangoPilot — an advanced AI-powered Django tool that transforms prompts into fully functional web applications, handling backend logic, API development, and deployment.",
      "Also building Sellaris AI, a smart platform that helps businesses scale, automate customer interactions, and streamline product sales.",
    ],
  },
  {
    role: "Backend Tutor",
    company: "SkillBoost Africa",
    period: "2024 — Present",
    products: [],
    tech: ["Django", "Python", "PostgreSQL", "REST APIs"],
    bullets: [
      "Backend Development Intern at SkillBoost Africa, where I teach and mentor students in server-side development using Django and Python.",
      "I focus on helping learners understand the power of backend systems, including API development, database design, and scalable application logic.",
    ],
  },
  {
    role: "Freelance Backend Developer",
    company: "Self-employed",
    period: "2023 — Present",
    products: [],
    tech: ["Django", "Python", "PostgreSQL", "React", "Flask"],
    bullets: [
      "Working with clients to develop custom web applications with a focus on backend functionality.",
      "Building RESTful APIs, database design, and server-side logic using Django and Python.",
    ],
  },
  {
    role: "Web Developer Intern",
    company: "Internship",
    period: "2022 — 2023",
    products: [],
    tech: ["Python", "Django", "JavaScript", "HTML/CSS"],
    bullets: [
      "Assisted in developing and maintaining web applications. Worked on both frontend and backend components, focusing on implementing features and fixing bugs.",
    ],
  },
  {
    role: "Personal Projects & Self-Learning",
    company: "Self-taught",
    period: "2021 — Present",
    products: [],
    tech: ["Python", "Django", "React", "JavaScript"],
    bullets: [
      "Started programming in September 2021. Built numerous projects including social media platforms, utility tools, chat apps, a Google clone, and content management systems.",
    ],
  },
];

export const projects = [
  {
    title: "CampyAlly",
    description: "Won 3rd Place in the RCCG Kingdom Hackathon (800+ applicants). Your city, one message away. Report emergencies, find the lost, and park smarter with real-time guidance — all from a single WhatsApp chat powered by AI.",
    tag: "Hackathon",
    image: "/images/portfolio/campally.jpg",
    link: "https://campally.online",
  },
  {
    title: "AIDigPay",
    description: "A premium telecom client platform to pay phone numbers, send SMS, and make calls directly from an integrated web dialer utilizing custom APIs and WebRTC.",
    tag: "Web App",
    image: "/images/portfolio/Aidigpay.jpg",
    link: "#",
  },
  {
    title: "Kairo",
    description: "A personal AI assistant on WhatsApp that dynamically plans your day based on your schedule, creates briefs, and builds memory to know you better over time.",
    tag: "AI",
    image: "/images/portfolio/kairo dashboard.jpg",
    link: "#",
  },
  {
    title: "DjangoPilot",
    description: "An AI-powered Django platform that transforms prompts into fully functional web applications — generating backend systems, APIs, and deploying live projects seamlessly.",
    tag: "AI",
    image: "/images/portfolio/djangopilot.jpg",
    link: "#",
  },
  {
    title: "Sellaris AI",
    description: "A smart AI platform that helps businesses scale by automating customer interactions, managing sales processes, and enhancing digital commerce experiences.",
    tag: "SaaS",
    image: "/images/portfolio/sellarisai.jpg",
    link: "#",
  },
  {
    title: "Seggs Chops Deluxe",
    description: "A modern restaurant website with a sleek UI, showcasing menus, offerings, and a premium digital experience for customers.",
    tag: "Web App",
    image: "/images/portfolio/seggschop.jpg",
    link: "#",
  },
  {
    title: "Dr Nova",
    description: "An AI-powered medical assistant that diagnoses illness, prescribes drugs, gives recommendations, suggests hospitals, and links you with medical professionals. Won 3rd place at Datican 2025.",
    tag: "Hackathon",
    image: "/images/portfolio/Dr Nova.jpg",
    link: "#",
  },
  {
    title: "VidScribe",
    description: "Transcribe videos, translate them to other languages, generate subtitles and summarize content with AI.",
    tag: "AI",
    image: "/images/portfolio/VidScribe.png",
    link: "#",
  },
  {
    title: "Tangibles Elegance",
    description: "A stylish and elegant restaurant website designed to deliver a refined digital experience with modern UI and smooth interactions.",
    tag: "Web App",
    image: "/images/portfolio/bisque elegance.jpg",
    link: "#",
  },
  {
    title: "RunSchoolHub",
    description: "A social media website for connecting students at Redeemer's University — posts, profiles, messaging and more.",
    tag: "Web App",
    image: "/images/portfolio/RunSchoolHub.png",
    link: "#",
  },
  {
    title: "TextScoop",
    description: "A web application that extracts text from images seamlessly using OCR technology.",
    tag: "Web App",
    image: "/images/portfolio/textscoop.jpg",
    link: "#",
  },
  {
    title: "Bisque Elegance",
    description: "A premium restaurant website focused on visual appeal, smooth navigation, and an engaging customer experience.",
    tag: "Web App",
    image: "/images/portfolio/bisque-elegance.jpg",
    link: "#",
  },
  {
    title: "Django Quickstart",
    description: "A Python package that automates creating Django projects — setup, app, templates, static/media, settings.py and urls all configured instantly.",
    tag: "Tool",
    image: "/images/portfolio/DjangoQuickstart.png",
    link: "https://pypi.org/project/django-quickstart-setup/",
  },
  {
    title: "WhisperZone",
    description: "A platform for sending anonymous messages — create your link and receive honest messages from anyone.",
    tag: "Web App",
    image: "/images/portfolio/WhisperZone.png",
    link: "#",
  },
  {
    title: "Hey — Chat App",
    description: "A WhatsApp-like chat application with real-time messaging, user authentication and group chats.",
    tag: "Web App",
    image: "/images/portfolio/Hey.png",
    link: "#",
  },
  {
    title: "QR Genie",
    description: "Generate QR codes instantly for websites and text — instant generation with downloadable PNG output.",
    tag: "Tool",
    image: "/images/portfolio/Qr genie.png",
    link: "#",
  },
  {
    title: "VoiceWeave",
    description: "Convert text to speech with multiple voice options — a handy web app for accessibility and content creation.",
    tag: "Web App",
    image: "/images/portfolio/VoiceWeave.png",
    link: "#",
  },
  {
    title: "SpeedyDownload",
    description: "Download videos from various social media platforms — YouTube, Instagram, Twitter, TikTok and more.",
    tag: "Tool",
    image: "/images/portfolio/SpeedyDownload.png",
    link: "#",
  },
  {
    title: "Google Clone",
    description: "A functional Google search engine clone built with Django — one of my earliest milestone projects.",
    tag: "Web App",
    image: "/images/portfolio/Google.png",
    link: "#",
  },
];

export const allTech = [
  "Python", "Django", "React.js", "JavaScript", "TypeScript", "Dart", "Flutter",
  "FastAPI", "Flask", "PostgreSQL", "MongoDB", "Redis", "MySQL", "SQLite",
  "REST APIs", "WebSockets", "Docker", "Git", "Celery", "TailwindCSS",
];
