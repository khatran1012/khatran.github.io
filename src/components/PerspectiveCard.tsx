import React, { useRef, useState, MouseEvent } from 'react';
import { ExternalLink, ArrowUpRight, Sparkles } from 'lucide-react';
import { Project } from '../data/cvData';

interface PerspectiveCardProps {
  project: Project;
  onOpenCaseStudy: (project: Project) => void;
}

export const PerspectiveCard: React.FC<PerspectiveCardProps> = ({
  project,
  onOpenCaseStudy,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();

    // Normalized coordinates (-0.5 to +0.5)
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;

    // Subtle 3D tilt angles (max ~12 degrees)
    setRotate({
      x: -normY * 16,
      y: normX * 16,
    });

    // Holographic glare tracking
    setGlarePos({
      x: (normX + 0.5) * 100,
      y: (normY + 0.5) * 100,
      opacity: 0.15,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlarePos({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <div
      ref={cardRef}
      className="perspective-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ height: '100%' }}
    >
      <div
        className="cyber-card tilt-card"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          position: 'relative',
        }}
      >
        {/* Holographic Specular Glare Reflection */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(0, 245, 160, 0.25) 0%, transparent 60%)`,
            opacity: glarePos.opacity,
            pointerEvents: 'none',
            transition: 'opacity 0.2s ease',
            borderRadius: 'inherit',
          }}
        />

        {/* Top Header */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <span
              className={`pill ${
                project.category === 'iot'
                  ? 'pill-emerald'
                  : project.category === 'frontend'
                  ? 'pill-blue'
                  : ''
              }`}
              style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}
            >
              {project.category === 'iot'
                ? 'IoT & Microservices'
                : project.category === 'frontend'
                ? 'Frontend & WebApp'
                : 'Enterprise FMCG'}
            </span>

            {project.featured && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                  color: 'var(--cyber-emerald)',
                  fontFamily: "'Fira Code', monospace",
                  fontWeight: 700,
                }}
              >
                <Sparkles size={13} />
                FEATURED
              </span>
            )}
          </div>

          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1.3,
              marginBottom: '0.35rem',
            }}
          >
            {project.title}
          </h3>

          <p
            style={{
              fontSize: '0.88rem',
              color: 'var(--cyber-emerald)',
              fontWeight: 600,
              marginBottom: '0.85rem',
            }}
          >
            {project.subtitle}
          </p>

          <p
            style={{
              fontSize: '0.91rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '1.25rem',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {project.description}
          </p>

          {/* Highlights Preview */}
          <div
            style={{
              padding: '0.85rem 1rem',
              backgroundColor: 'rgba(8, 13, 24, 0.6)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              marginBottom: '1.25rem',
            }}
          >
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {project.highlights.slice(0, 2).map((h, idx) => (
                <li
                  key={idx}
                  style={{
                    position: 'relative',
                    paddingLeft: '1.2rem',
                    fontSize: '0.83rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.45,
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      color: 'var(--cyber-emerald)',
                      fontWeight: 'bold',
                    }}
                  >
                    ✓
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
            {project.technologies.slice(0, 5).map((tech) => (
              <span key={tech} className="pill" style={{ fontSize: '0.75rem' }}>
                {tech}
              </span>
            ))}
            {project.technologies.length > 5 && (
              <span className="pill pill-emerald" style={{ fontSize: '0.75rem' }}>
                +{project.technologies.length - 5}
              </span>
            )}
          </div>
        </div>

        {/* Card Footer Actions */}
        <div
          style={{
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {project.domain ? (
            <a
              href={project.domain}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.84rem',
                color: 'var(--neon-blue)',
                fontWeight: 600,
              }}
              title="Visit live domain"
            >
              <ExternalLink size={14} />
              <span>Live Site</span>
            </a>
          ) : (
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {project.company || 'Enterprise'}
            </span>
          )}

          <button
            onClick={() => onOpenCaseStudy(project)}
            className="btn btn-secondary"
            style={{
              padding: '0.45rem 1rem',
              fontSize: '0.84rem',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <span>Case Study</span>
            <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
