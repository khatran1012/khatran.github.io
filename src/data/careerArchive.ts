import { EXPERIENCES } from './cvData';

const exhibits = [
  {
    slug: 'techera', category: 'CONNECTED SYSTEMS', title: 'Ticketing & IoT Platform',
    artifact: 'Ticket gates and an edge controller, connected as one system.',
    engineering: 'Follow the boundary between central services, local ticket state and physical access.',
    focus: ['Transactional integrity', 'Offline-first gateways', 'Physical access'],
    lightPaths: ['M 450 298 Q 492 312 530 282 L 539 577 Q 531 610 455 605', 'M 866 175 Q 925 187 937 162 L 944 410 Q 945 439 865 430', 'M 540 540 L 654 628 Q 676 643 694 623', 'M 837 552 Q 856 575 849 612'],
  },
  {
    slug: 'enterprise', category: 'ENTERPRISE & COMMERCE', title: 'Interfaces at Enterprise Scale',
    artifact: 'An architectural study of enterprise interfaces and commerce workflows.',
    engineering: 'Explore how interface state, API contracts and commerce integrations fit together.',
    focus: ['Application state', 'API integration', 'Web delivery'],
    lightPaths: ['M 111 178 L 840 314 Q 876 324 895 309 L 1010 176', 'M 108 358 L 829 548 Q 854 553 878 539 L 1009 364', 'M 603 250 L 624 263 L 623 303 M 695 431 L 695 454 L 620 485', 'M 119 498 L 805 734 Q 826 739 844 723 L 990 527'],
  },
  {
    slug: 'nashtech', category: 'MODULAR FRONTENDS', title: 'Components Into Experiences',
    artifact: 'A collection of reusable interface modules, assembled around a shared core.',
    engineering: 'Trace reusable components, accessible interaction and service boundaries.',
    focus: ['Reusable components', 'Accessibility', 'Client collaboration'],
    lightPaths: ['M 364 196 C 411 209 377 157 433 170 M 363 402 C 422 424 381 299 433 317 M 361 590 C 416 618 378 462 434 481', 'M 645 249 C 743 281 662 174 755 202 M 645 361 C 726 373 676 400 757 413 M 644 520 C 725 523 673 581 754 593', 'M 448 92 L 548 111 Q 561 114 560 134 L 559 638 Q 557 652 537 647 L 446 622'],
  },
  {
    slug: 'tma', category: 'RESPONSIVE ENGINEERING', title: 'One Interface. Every Viewport.',
    artifact: 'The same visual system reflowing across desktop, tablet and phone.',
    engineering: 'Inspect how layout constraints adapt while preserving content and interaction.',
    focus: ['Responsive layouts', 'Cross-browser behavior', 'Frontend quality'],
    lightPaths: ['M 211 137 L 729 196 Q 743 198 744 214 L 744 317', 'M 724 357 L 891 369 Q 905 371 905 387 L 905 638', 'M 951 442 L 1023 440 Q 1033 440 1033 451 L 1033 632', 'M 678 40 L 678 56 C 825 64 934 169 946 326'],
  },
  {
    slug: 'sutrix', category: 'THE FOUNDATIONS', title: 'From Blueprint to Browser',
    artifact: 'A wireframe becomes a structured, finished web interface.',
    engineering: 'Move from layout intent to semantic HTML, CSS and browser-ready interaction.',
    focus: ['HTML & CSS', 'Design fidelity', 'Web standards'],
    lightPaths: ['M 629 142 L 964 187 Q 982 190 981 211 L 981 579 Q 981 601 963 600 L 632 584 Q 616 583 616 565 L 616 162 Q 616 141 629 142', 'M 368 134 L 588 172 M 363 541 L 590 561', 'M 148 177 L 148 456 M 241 576 C 392 719 827 760 979 607'],
  },
];

export const CAREER_ARCHIVE = EXPERIENCES.map((experience, index) => ({
  ...experience,
  ...exhibits[index],
  number: String(index + 1).padStart(2, '0'),
  image: `./career/${exhibits[index].slug}-artifact.webp`,
  thumbnail: `./career/${exhibits[index].slug}-artifact-640.webp`,
  diagram: `./career/${exhibits[index].slug}-engineering.svg`,
}));

export type CareerExhibit = typeof CAREER_ARCHIVE[number];
