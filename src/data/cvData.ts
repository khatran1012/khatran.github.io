export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: 'iot' | 'frontend' | 'enterprise';
  domain?: string;
  period?: string;
  company?: string;
  description: string;
  highlights: string[];
  technologies: string[];
  featured?: boolean;
}

export interface Experience {
  id: string;
  period: string;
  role: string;
  company: string;
  summary?: string;
  responsibilities: string[];
  technologies?: string[];
  isCurrent?: boolean;
}

export interface Strength {
  title: string;
  description: string;
  icon: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  details: string[];
  isCertificate?: boolean;
}

export const PERSONAL_INFO = {
  name: 'Kha Tran',
  fullName: 'Trần Đình Kha',
  role: 'Senior Software Engineer & Fullstack Developer',
  email: 'khatran1012@gmail.com',
  phone: '0326004229',
  displayPhone: '+84 326 004 229',
  location: 'Ho Chi Minh City, Vietnam',
  website: 'https://khatran1012.github.io/khatran.github.io/',
  linkedin: 'https://www.linkedin.com/in/khatran1012/',
  github: 'https://github.com/khatran1012',
  avatarUrl: './avatar.png',
  cvPdfUrl: './Kha_Tran_Software_Engineer_CV.pdf',
  bio: `I am a Fullstack Developer with a deep passion for user-centered design and robust system engineering. My focus is on crafting end-to-end digital solutions—from responsive, visually engaging, and highly functional user interfaces (React, TypeScript) to resilient, high-concurrency backend architectures and IoT edge gateways (Golang, PostgreSQL, MQTT). Known for my adaptability, diligence, and continuous drive to refine both technical and collaborative skills, I thrive on taking on complex challenges in dynamic environments where I can deliver impactful, reliable products and contribute to collective engineering growth.`,
};

export const STRENGTHS: Strength[] = [
  {
    title: 'Friendly & Collaborative',
    description: 'Easily build good relationships with teammates and contribute to a positive, high-trust engineering working environment.',
    icon: 'Users',
  },
  {
    title: 'Fast Adaptability',
    description: 'Quickly adjust to company culture, agile workflows, and dynamic new working styles with resilience.',
    icon: 'Zap',
  },
  {
    title: 'Project Responsiveness',
    description: 'Able to catch up with high-pressure project demands rapidly, ensuring critical milestones are delivered on time.',
    icon: 'Clock',
  },
  {
    title: 'Quick Learner with New Tech',
    description: "Adapt well to the company's tech stack and new tooling, allowing smooth and rapid integration into ongoing and greenfield projects.",
    icon: 'Sparkles',
  },
];

export const SKILL_CATEGORIES = [
  {
    name: 'Frontend Development',
    skills: [
      { name: 'React.js', level: 95 },
      { name: 'TypeScript', level: 92 },
      { name: 'Next.js', level: 88 },
      { name: 'Angular (v14+)', level: 85 },
      { name: 'Redux / NgRx / RxJS', level: 90 },
      { name: 'Tailwind CSS / Vanilla CSS', level: 95 },
      { name: 'Three.js / 3D WebGL', level: 78 },
      { name: 'A11y (WCAG) & Technical SEO', level: 92 },
      { name: 'PWA (React Native Web)', level: 82 },
    ],
  },
  {
    name: 'Backend & Microservices',
    skills: [
      { name: 'Golang (Gin, SQLC)', level: 90 },
      { name: 'PostgreSQL', level: 88 },
      { name: 'Redis (Distributed Lock)', level: 88 },
      { name: 'RabbitMQ', level: 84 },
      { name: 'RESTful API & OpenAPI / Swagger', level: 94 },
      { name: 'ACID & Anti-fraud Systems', level: 86 },
      { name: '.NET Blazor / Razor Pages', level: 75 },
    ],
  },
  {
    name: 'IoT & Edge Architecture',
    skills: [
      { name: 'MQTT Protocol', level: 92 },
      { name: 'Offline-First Edge Gateways', level: 90 },
      { name: 'Hardware Control (Turnstiles / Scanners)', level: 88 },
      { name: 'Local Edge Caching & Auto-Sync', level: 90 },
      { name: 'Distributed Concurrency Control', level: 86 },
    ],
  },
  {
    name: 'DevOps & CMS Ecosystem',
    skills: [
      { name: 'Docker & Containerization', level: 85 },
      { name: 'Nginx & SSL Configuration', level: 88 },
      { name: 'AWS / Linode / Vercel', level: 82 },
      { name: 'Adobe Experience Manager (AEM)', level: 85 },
      { name: 'Shopify (Liquid & Admin API)', level: 86 },
      { name: 'Umbraco / Drupal / Moodle', level: 80 },
    ],
  },
];

export const EXPERIENCES: Experience[] = [
  {
    id: 'exp-techera',
    period: '04/2026 - Present',
    role: 'FULLSTACK DEVELOPER',
    company: 'Techera',
    isCurrent: true,
    summary: 'Contributed to the architecture and development of an end-to-end Theme Park Ticketing & IoT Access Control Platform.',
    responsibilities: [
      'Architected and implemented high-throughput backend services and IoT edge gateways in Golang (Gin, SQLC), processing concurrent ticket orders and real-time physical access control.',
      'Built resilient microservices capable of processing high-volume ticket transactions while enforcing strict ACID guarantees and anti-fraud protections.',
      'Designed an Offline-First IoT edge gateway synchronization mechanism via MQTT and edge caching, guaranteeing 100% gate operation uptime during central server network interruptions.',
      'Implemented distributed locking via Redis and row-level database transactions (SELECT FOR UPDATE) to prevent double-spending and inventory overselling during flash sales.',
      'Built public-facing OpenAPI/REST integration endpoints for major OTA channels (Klook, Traveloka...) and developed operational portals using React, TypeScript, and Ant Design.',
    ],
    technologies: ['Golang', 'Gin', 'SQLC', 'PostgreSQL', 'Redis', 'RabbitMQ', 'MQTT', 'React', 'TypeScript', 'Docker', 'Ant Design'],
  },
  {
    id: 'exp-freelance',
    period: '03/2023 - 10/2025',
    role: 'FRONT-END DEVELOPER (Contract / Freelance)',
    company: 'Techcombank & Vertis Digital Singapore',
    summary: 'Delivered high-impact solutions with 6-month to 1-year contracts at Techcombank and 3 to 6-month contracts at Vertis Digital Singapore.',
    responsibilities: [
      'Developed e-commerce website projects using Angular, NgRx, RxJS and the Shopify platform for individual clients.',
      'Implemented robust state management for shopping cart, product filtering, and configured Firebase for authentication.',
      'Integrated REST APIs, payment gateways (domestic and international), and shipping services.',
      'Deployed applications on Linode servers, Vercel, and AWS with IP-based setup, domain configuration using Nginx, and SSL certificate installation.',
    ],
    technologies: ['Angular', 'NgRx', 'RxJS', 'Shopify', 'Firebase', 'REST APIs', 'Linode', 'AWS', 'Vercel', 'Nginx', 'SSL'],
  },
  {
    id: 'exp-nashtech',
    period: '2018 - 2022',
    role: 'FRONT-END DEVELOPER',
    company: 'NashTech VN',
    summary: 'Responsible for concurrent enterprise web projects, client interactions, accessibility, and modern frontend frameworks.',
    responsibilities: [
      'Collaborated daily with graphic designers, backend developers, product owners, and marketing teams to clarify customer requirements.',
      'Developed and maintained front-end functionality across multiple enterprise websites with strong Accessibility (A11y WCAG) support.',
      'Proficient in using project support tools such as Jira, Azure DevOps, Microsoft Teams, and effectively applying the Scrum process.',
      'Delivered projects using Vanilla JavaScript, jQuery, ReactJs, Angular, Material UI, Tailwind CSS, and Bootstrap.',
      'Gained hands-on experience with backend support tools: Umbraco CMS, Docker, PostgreSQL, and Fliplet (mobile app engine).',
    ],
    technologies: ['ReactJs', 'Tailwind CSS', 'Angular', 'Material UI', 'Bootstrap', 'Vanilla JS', 'jQuery', 'Three.js', 'Umbraco', 'Docker', 'A11y'],
  },
  {
    id: 'exp-tma',
    period: '2017 - 2018',
    role: 'FRONT-END DEVELOPER',
    company: 'TMA Solutions',
    summary: 'Engineered cross-browser responsive frontend modules for global clients.',
    responsibilities: [
      'Developed and maintained front-end functionality of websites with high code quality.',
      'Built websites with HTML, CSS, Vanilla JavaScript, and Angular compatible across diverse web browsers (cross-browser).',
    ],
    technologies: ['HTML5', 'CSS3', 'Vanilla JavaScript', 'Angular', 'Cross-browser'],
  },
  {
    id: 'exp-sutrix',
    period: '2016 - 2017',
    role: 'FRONT-END DEVELOPER',
    company: 'Sutrix Solutions',
    summary: 'Started professional frontend engineering career specializing in cross-browser compatibility and web standards.',
    responsibilities: [
      'Developed and maintained front-end functionality of websites with HTML, CSS, and Vanilla JavaScript.',
      'Ensured strict cross-browser compatibility and responsive UI fidelity matching design specifications.',
    ],
    technologies: ['HTML5', 'CSS3', 'Vanilla JavaScript', 'Responsive Web Design'],
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'theme-park-iot',
    title: 'Theme Park Management & IoT Access Control Ecosystem',
    subtitle: 'High-Concurrency Distributed Ticketing Platform',
    category: 'iot',
    company: 'Techera',
    period: '04/2026 - Present',
    featured: true,
    description:
      'A distributed enterprise ticketing and access control platform designed for high-concurrency theme parks and entertainment attractions. The ecosystem integrates a central management backend, an edge IoT gateway for on-premise hardware control (turnstiles/scanners), and two modern web portals (Operations Admin and B2B/OTA Partner Portal).',
    highlights: [
      'Architected and implemented high-throughput backend services and IoT edge gateways in Golang (Gin, SQLC), processing concurrent ticket orders and real-time physical access control.',
      'Built resilient microservices capable of processing high-volume ticket transactions while enforcing strict ACID guarantees and anti-fraud protections.',
      'Designed an Offline-First IoT edge gateway synchronization mechanism via MQTT and edge caching, guaranteeing 100% gate operation uptime during central server network disruptions.',
      'Implemented distributed locking via Redis and row-level database transactions (SELECT FOR UPDATE) to prevent double-spending and inventory overselling during flash sales.',
      'Built public-facing OpenAPI/REST integration endpoints for major OTA channels (Klook, Traveloka...) and developed operational portals using React, TypeScript, and Ant Design.',
    ],
    technologies: ['Golang', 'Gin', 'SQLC', 'PostgreSQL', 'Redis', 'RabbitMQ', 'MQTT', 'React', 'TypeScript', 'Docker', 'Ant Design'],
  },
  {
    id: 'marina-bay-sands',
    title: 'Ticket Sales Website and Landing Page',
    subtitle: 'Marina Bay Sands Singapore Park & Attraction Sales',
    category: 'frontend',
    company: 'Vertis Digital Singapore',
    period: 'Freelance / Contract',
    featured: true,
    description:
      'Developed ticket sales website and park introduction pages for Marina Bay Sands in Singapore, built for high performance, mobile responsiveness, and seamless transaction flows.',
    highlights: [
      'Built and optimized e-commerce platforms using ReactJS, Next.js, and Redux.',
      'Developed Progressive Web Apps (PWA) with React Native Web for both web and mobile experiences.',
      'Implemented state management for shopping cart, product filtering, and user authentication.',
      'Integrated REST APIs and payment gateways with high security.',
      'Applied SSR/SSG for technical SEO and lightning-fast load times.',
      'Configured Firebase for authentication, hosting, and cloud services.',
      'Ensured responsive design, cross-browser compatibility, and performance optimization.',
    ],
    technologies: ['ReactJS', 'Next.js', 'Redux', 'React Native Web (PWA)', 'Firebase', 'REST APIs', 'SSR/SSG'],
  },
  {
    id: 'techcombank-portal',
    title: 'Techcombank Banking Portal',
    subtitle: 'Official Banking Information & Digital Assets Platform',
    category: 'enterprise',
    company: 'Techcombank',
    domain: 'https://techcombank.com/',
    period: 'Contract',
    featured: true,
    description:
      'Page introducing TECHCOMBANK banking information, serving millions of banking customers across Vietnam.',
    highlights: [
      'Maintained web author content management system (CMS) Adobe Experience Manager (AEM).',
      'Customized and developed modular components within AEM using Vanilla JavaScript, enabling drag-and-drop page building and reusable front-end modules for dynamic content creation.',
      'Authored and published digital assets, content, and financial documents in a centralized asset management system.',
      'Maintained authoring structure, content fragments, technical SEO, accessibility (A11y), and authoring requirements across all executed tasks.',
    ],
    technologies: ['Adobe Experience Manager (AEM)', 'Vanilla JavaScript', 'CMS Architecture', 'Technical SEO', 'A11y'],
  },
  {
    id: 'oness-fmcg',
    title: 'One Solution (ONESS) - Tân Hiệp Phát',
    subtitle: 'FMCG Business Operations Web-Based Platform',
    category: 'enterprise',
    company: 'NashTech VN',
    period: 'Enterprise Project',
    featured: false,
    description:
      'Developed a web-based platform supporting FMCG business operations for Tân Hiệp Phát, optimizing supply chain, inventory, and field operation workflows.',
    highlights: [
      'Developed dynamic, high-performance web interfaces using Angular (v14+) and .NET Blazor/Razor Pages.',
      'Built reusable UI components and managed complex application states using RxJS and Angular Services.',
      'Integrated frontend views with .NET backend APIs to ensure real-time data synchronization for mission-critical FMCG workflows.',
    ],
    technologies: ['Angular (v14+)', '.NET Blazor', 'Razor Pages', 'RxJS', 'Angular Services', '.NET Backend APIs'],
  },
  {
    id: 'nashtech-virtual-vietnam',
    title: 'NashTech Global & Virtual Vietnam 3D Experience',
    subtitle: 'Interactive 3D/360° Corporate Web Showcase',
    category: 'frontend',
    company: 'NashTech VN',
    domain: 'https://www.nashtechglobal.com',
    period: 'NashTech VN',
    featured: true,
    description:
      'Corporate landing pages for NashTech Global and an interactive 3D/360° virtual web experience showcasing Vietnam attractions.',
    highlights: [
      'Developed and maintained scalable front-end modules using ReactJS and Tailwind CSS, following best practices.',
      'Collaborated cross-functionally with Back-end, Product Owner, and Marketing teams to deliver features and optimize technical SEO.',
      'Improved stability and performance through debugging, refactoring, and continuous optimization.',
      'Developed an interactive 3D/360° web experience using JavaScript and Three.js for NashTech’s Virtual Vietnam.',
    ],
    technologies: ['ReactJS', 'Tailwind CSS', 'Three.js', 'JavaScript 3D/360°', 'Technical SEO'],
  },
  {
    id: 'shopify-custom-cms',
    title: 'Shopify E-Commerce with Tailor-Made Angular CMS',
    subtitle: 'Unified Storefront & Real-Time Back-Office Administration',
    category: 'enterprise',
    company: 'Freelance Client',
    period: 'Contract',
    featured: false,
    description:
      'Developed a customized Shopify e-commerce platform integrated with a tailor-made Angular CMS to streamline back-office operations and enhance SEO performance.',
    highlights: [
      'Shopify Development: Customized storefront using Liquid, HTML, CSS, and JS; integrated third-party apps for payments and logistics.',
      'Custom CMS (Angular): Built a dedicated admin dashboard using Angular & TypeScript to manage metadata and sync real-time data via Shopify Admin API.',
      'State Management: Utilized RxJS for efficient data handling and integrated RESTful APIs for seamless backend communication.',
    ],
    technologies: ['Shopify Liquid', 'Angular', 'TypeScript', 'RxJS', 'Shopify Admin API', 'REST APIs'],
  },
  {
    id: 'open-university-uk',
    title: 'The UK Open University & OpenLearn Portal',
    subtitle: 'Higher Education Learning Platform & Accessibility Compliance',
    category: 'frontend',
    company: 'NashTech VN',
    domain: 'https://www.open.edu/openlearn/',
    period: 'Enterprise Project',
    featured: false,
    description:
      'The homepage of the UK Open University, completing the user interface and creating pages of interactive online learning tools.',
    highlights: [
      'Built and maintained website and front-end modules using Vanilla JavaScript, jQuery, and Bootstrap.',
      'Integrated front-end with back-end systems developed on Drupal (PHP) and later migrated functionalities to Moodle (PHP) to support LMS transition.',
      'Contributed to UI/UX implementation for UK Open University homepage and internal learning tools, ensuring intuitive navigation.',
      'Ensured Accessibility (A11y) compliance meeting international WCAG standards for inclusive education.',
    ],
    technologies: ['Vanilla JavaScript', 'jQuery', 'Bootstrap', 'Drupal (PHP)', 'Moodle (PHP)', 'WCAG A11y'],
  },
  {
    id: 'socotec-platform',
    title: 'Socotec Mobile & Web Application',
    subtitle: 'Testing & Certification Industrial Portal',
    category: 'enterprise',
    company: 'NashTech VN',
    domain: 'https://www.socotec.com/',
    period: 'Client Project',
    featured: false,
    description:
      'A cross-platform mobile and web application created based on the Fliplet engine and Umbraco CMS for international testing and certification leader Socotec.',
    highlights: [
      'Built and maintained website and front-end modules using Vanilla JavaScript, jQuery, and Bootstrap 4.',
      'Collaborated with back-end teams using technologies such as Umbraco CMS, Docker, PostgreSQL, and Fliplet engine.',
      'Implemented UI updates, enhanced component usability, and ensured seamless integration between web platform and mobile app.',
    ],
    technologies: ['Vanilla JavaScript', 'jQuery', 'Bootstrap 4', 'Umbraco CMS', 'Docker', 'PostgreSQL', 'Fliplet Engine'],
  },
  {
    id: 'aoste-food',
    title: 'Aoste - Restaurants & Food Portal',
    subtitle: 'Responsive Brand Showcase for French Charcuterie Leader',
    category: 'frontend',
    company: 'NashTech VN',
    domain: 'https://aoste.fr',
    period: 'Client Project',
    featured: false,
    description:
      'Web application for leading French food and restaurant brand Aoste, ensuring high brand visual fidelity, responsive design, and smooth user interactions.',
    highlights: [
      'Built and maintained website and front-end modules using Vanilla JavaScript, jQuery, and Bootstrap 3.',
      'Ensured full responsive design and smooth user experience across mobile and desktop devices.',
      'Verified, troubleshot, and fixed bugs to ensure stable website performance under traffic.',
    ],
    technologies: ['Vanilla JavaScript', 'jQuery', 'Bootstrap 3', 'Responsive Design'],
  },
];

export const EDUCATION_LIST: EducationItem[] = [
  {
    degree: 'BACHELOR OF COMPUTER SCIENCE',
    institution: 'Open University',
    details: [
      'Core focus on Database Architecture & Query Optimization',
      'Network Programming & Distributed Protocols',
      'Object-Oriented Programming (OOP) & Clean Architecture Patterns',
    ],
  },
  {
    degree: 'FRONT END PROGRAMMING CERTIFICATE',
    institution: 'Ho Chi Minh City University of Science (HCMUS)',
    details: [
      'Comprehensive curriculum in modern Front-End Web Standards',
      'Advanced JavaScript, DOM Manipulation, and Responsive UI Design',
      'Cross-Browser Engineering & Performance Best Practices',
    ],
    isCertificate: true,
  },
];

export const LANGUAGES = [
  {
    name: 'English',
    level: 'Professional Working Proficiency',
    details: 'Read and write technical references, RFCs, and API documentation with ease. Listen, speak, and collaborate effectively during cross-border customer meetings, sprint planning, and client calls.',
  },
  {
    name: 'Vietnamese',
    level: 'Native Speaker',
    details: 'Native fluency.',
  },
];
