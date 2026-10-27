import React, { useState } from 'react';
import { FolderGit2, ExternalLink, ArrowUpRight } from 'lucide-react';
import { PROJECTS, Project } from '../data/cvData';
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
    <section id="projects" className="section">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">
            <FolderGit2 size={14} />
            <span>Portfolio</span>
          </div>
          <h2 className="section-title">
            Featured <span>Projects</span>
          </h2>
          <p className="section-subtitle">
            Enterprise platforms, high-concurrency systems, and client solutions engineered with clean architecture.
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

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className={`project-card ${project.featured ? 'featured-card' : ''}`}
            >
              <div>
                <div className="project-top">
                  <span className={`project-category-badge cat-${project.category}`}>
                    {project.category === 'iot'
                      ? 'IoT & Microservices'
                      : project.category === 'frontend'
                      ? 'Frontend & WebApp'
                      : 'Enterprise CMS'}
                  </span>

                  {project.domain && (
                    <a
                      href={project.domain}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-icon"
                      style={{ width: '32px', height: '32px' }}
                      title={`Visit ${project.domain}`}
                      aria-label={`Visit ${project.domain}`}
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>

                <h3 className="project-title">{project.title}</h3>
                <p className="project-subtitle">{project.subtitle}</p>

                <p className="project-desc">{project.description}</p>

                {/* Highlights Preview */}
                <div className="project-highlights-preview">
                  <ul>
                    {project.highlights.slice(0, 2).map((highlight, idx) => (
                      <li key={idx}>{highlight}</li>
                    ))}
                  </ul>
                </div>

                {/* Tech Tags */}
                <div className="project-techs">
                  {project.technologies.slice(0, 5).map((tech) => (
                    <span key={tech} className="pill">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 5 && (
                    <span className="pill pill-emerald">+{project.technologies.length - 5}</span>
                  )}
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="project-footer">
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {project.company || 'Enterprise'}
                </span>

                <button
                  onClick={() => setSelectedProject(project)}
                  className="btn btn-secondary"
                  style={{
                    padding: '0.45rem 0.9rem',
                    fontSize: '0.84rem',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <span>Details</span>
                  <ArrowUpRight size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Project Details Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
