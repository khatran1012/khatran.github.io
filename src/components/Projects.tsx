import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderGit2 } from 'lucide-react';
import { PROJECTS, Project } from '../data/cvData';
import { PerspectiveCard } from './PerspectiveCard';
import { ProjectModal } from './ProjectModal';

export const Projects: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'iot' | 'frontend' | 'enterprise'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects =
    filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  const filterOptions = [
    { label: 'All Projects', value: 'all', count: PROJECTS.length },
    { label: 'IoT & Microservices', value: 'iot', count: PROJECTS.filter((p) => p.category === 'iot').length },
    { label: 'Frontend & WebApps', value: 'frontend', count: PROJECTS.filter((p) => p.category === 'frontend').length },
    { label: 'Enterprise CMS & FMCG', value: 'enterprise', count: PROJECTS.filter((p) => p.category === 'enterprise').length },
  ];

  return (
    <section id="projects" className="section" style={{ backgroundColor: 'var(--bg-page-alt)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <FolderGit2 size={13} />
            <span>04 — PROJECTS / 3D PERSPECTIVE CARDS</span>
          </div>
          <h2 className="section-title">
            Engineered <span>Systems</span>
          </h2>
          <p className="section-subtitle">
            Hover to explore 3D tilt perspective. Click "Case Study" for comprehensive architectural deep-dives.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="project-filters">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value as any)}
              className={`filter-btn ${filter === opt.value ? 'active' : ''}`}
            >
              {opt.label} ({opt.count})
            </button>
          ))}
        </div>

        {/* 3D Perspective Projects Grid */}
        <motion.div layout className="projects-grid">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <PerspectiveCard
                  project={project}
                  onOpenCaseStudy={(proj) => setSelectedProject(proj)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
