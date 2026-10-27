import React, { useEffect } from 'react';
import { X, ExternalLink, CheckCircle, Layers, Calendar, Building2 } from 'lucide-react';
import { Project } from '../data/cvData';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="modal-close-btn"
          aria-label="Close project modal"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '1.25rem', paddingRight: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span className={`project-category-badge cat-${project.category}`}>
              {project.category === 'iot'
                ? 'IoT & Microservices'
                : project.category === 'frontend'
                ? 'Frontend & WebApp'
                : 'Enterprise CMS'}
            </span>
            {project.featured && <span className="pill pill-emerald">Featured</span>}
          </div>

          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            {project.title}
          </h3>
          <p style={{ fontSize: '1rem', color: 'var(--emerald-primary)', fontWeight: 600 }}>
            {project.subtitle}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              marginTop: '0.75rem',
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
              flexWrap: 'wrap',
            }}
          >
            {project.company && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Building2 size={15} color="var(--emerald-primary)" />
                {project.company}
              </span>
            )}
            {project.period && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={15} color="var(--blue-accent)" />
                {project.period}
              </span>
            )}
            {project.domain && (
              <a
                href={project.domain}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: 'var(--blue-accent)',
                  fontWeight: 600,
                }}
              >
                <ExternalLink size={15} />
                <span>Visit Live Domain</span>
              </a>
            )}
          </div>
        </div>

        {/* Project Description */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Overview
          </h4>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
            {project.description}
          </p>
        </div>

        {/* Key Responsibilities / Architectural Highlights */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.65rem' }}>
            Engineering Responsibilities &amp; Highlights
          </h4>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
            }}
          >
            {project.highlights.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem',
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}
              >
                <CheckCircle size={16} color="var(--emerald-primary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <h4
            style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '0.65rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Layers size={16} color="var(--emerald-primary)" />
            <span>Technologies &amp; Architecture</span>
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {project.technologies.map((tech) => (
              <span key={tech} className="pill pill-emerald" style={{ fontSize: '0.84rem', padding: '0.35rem 0.75rem' }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
