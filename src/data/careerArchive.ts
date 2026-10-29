import { EXPERIENCES } from './cvData';

const exhibits = [
  {
    slug: 'techera', category: 'CONNECTED SYSTEMS', title: 'Ticketing & IoT Platform',
    artifact: 'Ticket gates and an edge controller, connected as one system.',
    engineering: 'Follow the boundary between central services, local ticket state and physical access.',
    focus: ['Transactional integrity', 'Offline-first gateways', 'Physical access'],
  },
  {
    slug: 'enterprise', category: 'ENTERPRISE & COMMERCE', title: 'Interfaces at Enterprise Scale',
    artifact: 'An architectural study of enterprise interfaces and commerce workflows.',
    engineering: 'Explore how interface state, API contracts and commerce integrations fit together.',
    focus: ['Application state', 'API integration', 'Web delivery'],
  },
  {
    slug: 'nashtech', category: 'MODULAR FRONTENDS', title: 'Components Into Experiences',
    artifact: 'A collection of reusable interface modules, assembled around a shared core.',
    engineering: 'Trace reusable components, accessible interaction and service boundaries.',
    focus: ['Reusable components', 'Accessibility', 'Client collaboration'],
  },
  {
    slug: 'tma', category: 'RESPONSIVE ENGINEERING', title: 'One Interface. Every Viewport.',
    artifact: 'The same visual system reflowing across desktop, tablet and phone.',
    engineering: 'Inspect how layout constraints adapt while preserving content and interaction.',
    focus: ['Responsive layouts', 'Cross-browser behavior', 'Frontend quality'],
  },
  {
    slug: 'sutrix', category: 'THE FOUNDATIONS', title: 'From Blueprint to Browser',
    artifact: 'A wireframe becomes a structured, finished web interface.',
    engineering: 'Move from layout intent to semantic HTML, CSS and browser-ready interaction.',
    focus: ['HTML & CSS', 'Design fidelity', 'Web standards'],
  },
];

export const CAREER_ARCHIVE = EXPERIENCES.map((experience, index) => ({
  ...experience,
  ...exhibits[index],
  number: String(index + 1).padStart(2, '0'),
  image: `./career/${exhibits[index].slug}-artifact.webp`,
  diagram: `./career/${exhibits[index].slug}-engineering.svg`,
}));

export type CareerExhibit = typeof CAREER_ARCHIVE[number];
