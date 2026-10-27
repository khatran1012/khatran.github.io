import React, { useState } from 'react';
import { Mail, Phone, MapPin, Copy, Check, MessageSquare, Download, Globe } from 'lucide-react';
import { PERSONAL_INFO } from '../data/cvData';
import { GithubIcon, LinkedinIcon } from './Icons';

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2500);
  };

  return (
    <section id="contact" className="section">
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <MessageSquare size={13} />
            <span>05 — CONTACT / DIRECT CHANNELS</span>
          </div>
          <h2 className="section-title">
            Let's <span>Connect</span>
          </h2>
          <p className="section-subtitle">
            Direct communication channels for engineering inquiries, high-concurrency systems, and career opportunities.
          </p>
        </div>

        {/* Minimal 2D Contact Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem',
          }}
        >
          {/* Email Card */}
          <div
            className="cyber-card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--cyber-emerald-subtle)',
                  color: 'var(--cyber-emerald)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-glow)',
                  flexShrink: 0,
                }}
              >
                <Mail size={22} />
              </div>
              <div style={{ minWidth: 0 }}>
                <span
                  style={{
                    fontSize: '0.76rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    fontFamily: "'Fira Code', monospace",
                    display: 'block',
                  }}
                >
                  Primary Email
                </span>
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  style={{
                    fontSize: '0.96rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {PERSONAL_INFO.email}
                </a>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(PERSONAL_INFO.email, 'email')}
              className="btn-icon"
              title="Copy email to clipboard"
              aria-label="Copy email"
            >
              {copied === 'email' ? <Check size={18} color="var(--cyber-emerald)" /> : <Copy size={18} />}
            </button>
          </div>

          {/* Phone Card */}
          <div
            className="cyber-card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--neon-blue-subtle)',
                  color: 'var(--neon-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-blue-glow)',
                  flexShrink: 0,
                }}
              >
                <Phone size={22} />
              </div>
              <div>
                <span
                  style={{
                    fontSize: '0.76rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    fontFamily: "'Fira Code', monospace",
                    display: 'block',
                  }}
                >
                  Direct Phone
                </span>
                <a
                  href={`tel:${PERSONAL_INFO.phone}`}
                  style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-primary)' }}
                >
                  {PERSONAL_INFO.displayPhone}
                </a>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(PERSONAL_INFO.phone, 'phone')}
              className="btn-icon"
              title="Copy phone to clipboard"
              aria-label="Copy phone"
            >
              {copied === 'phone' ? <Check size={18} color="var(--cyber-emerald)" /> : <Copy size={18} />}
            </button>
          </div>

          {/* Location Card */}
          <div
            className="cyber-card"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1.5rem',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                color: 'var(--neon-purple)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                flexShrink: 0,
              }}
            >
              <MapPin size={22} />
            </div>
            <div>
              <span
                style={{
                  fontSize: '0.76rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  fontFamily: "'Fira Code', monospace",
                  display: 'block',
                }}
              >
                Based In
              </span>
              <div style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {PERSONAL_INFO.location}
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Channels & Socials */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem',
          }}
        >
          {/* LinkedIn */}
          <a
            href={PERSONAL_INFO.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="cyber-card"
            style={{
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              transition: 'all var(--transition-normal)',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'var(--neon-blue-subtle)',
                color: 'var(--neon-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <LinkedinIcon size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Professional Profile
              </span>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                LinkedIn /in/khatran1012
              </div>
            </div>
          </a>

          {/* GitHub */}
          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noopener noreferrer"
            className="cyber-card"
            style={{
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              transition: 'all var(--transition-normal)',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <GithubIcon size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Source Code &amp; Repos
              </span>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                GitHub /khatran1012
              </div>
            </div>
          </a>

          {/* Download CV */}
          <a
            href={PERSONAL_INFO.cvPdfUrl}
            download="Kha_Tran_Software_Engineer_CV.pdf"
            className="cyber-card"
            style={{
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              borderColor: 'var(--border-glow)',
              transition: 'all var(--transition-normal)',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'var(--cyber-emerald-subtle)',
                color: 'var(--cyber-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Download size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Official Resume
              </span>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--cyber-emerald)' }}>
                Download CV (PDF)
              </div>
            </div>
          </a>
        </div>

        {/* Verified Domain Footer Banner */}
        <div
          className="cyber-card"
          style={{
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
            background: 'linear-gradient(90deg, rgba(0, 245, 160, 0.06), rgba(59, 130, 246, 0.06))',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Globe size={22} color="var(--cyber-emerald)" />
            <div>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--cyber-emerald)', textTransform: 'uppercase' }}>
                GitHub Pages Domain (Matches CV)
              </span>
              <a
                href={PERSONAL_INFO.website}
                style={{
                  display: 'block',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  wordBreak: 'break-all',
                }}
              >
                {PERSONAL_INFO.website}
              </a>
            </div>
          </div>

          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="btn btn-primary"
            style={{ padding: '0.55rem 1.25rem', fontSize: '0.88rem' }}
          >
            <Mail size={16} />
            <span>Send Email Directly</span>
          </a>
        </div>
      </div>
    </section>
  );
};
