import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Copy, Check, MessageSquare, Terminal } from 'lucide-react';
import { PERSONAL_INFO } from '../data/cvData';
import { GithubIcon, LinkedinIcon } from './Icons';

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    const mailtoUrl = `mailto:${PERSONAL_INFO.email}?subject=${encodeURIComponent(
      formData.subject || `Inquiry from ${formData.name} via Portfolio`
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;

    window.location.href = mailtoUrl;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <MessageSquare size={13} />
            <span>05 — CONTACT / MINIMAL 2D CTA</span>
          </div>
          <h2 className="section-title">
            Let's <span>Collaborate</span>
          </h2>
          <p className="section-subtitle">
            Clean 2D developer interface for fast, frictionless communication and technical inquiries.
          </p>
        </div>

        <div className="contact-grid">
          {/* Left: Contact Info HUD */}
          <div className="contact-info-list">
            {/* Email */}
            <div className="cyber-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
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
                <Mail size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: "'Fira Code', monospace" }}>
                  Primary Email
                </span>
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  style={{ display: 'block', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}
                >
                  {PERSONAL_INFO.email}
                </a>
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

            {/* Phone */}
            <div className="cyber-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
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
                <Phone size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: "'Fira Code', monospace" }}>
                  Direct Phone
                </span>
                <a
                  href={`tel:${PERSONAL_INFO.phone}`}
                  style={{ display: 'block', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}
                >
                  {PERSONAL_INFO.displayPhone}
                </a>
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

            {/* Location */}
            <div className="cyber-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
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
                <MapPin size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: "'Fira Code', monospace" }}>
                  Based In
                </span>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {PERSONAL_INFO.location}
                </div>
              </div>
            </div>

            {/* Social Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-card"
                style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--neon-blue-subtle)',
                    color: 'var(--neon-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LinkedinIcon size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    LinkedIn
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    /in/khatran1012
                  </div>
                </div>
              </a>

              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-card"
                style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <GithubIcon size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    GitHub
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    /khatran1012
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Right: Minimal 2D Message Form */}
          <form className="cyber-card" onSubmit={handleSubmit} style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Terminal size={18} color="var(--cyber-emerald)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Direct Transmission
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="minimal-name" style={{ fontSize: '0.82rem', fontFamily: "'Fira Code', monospace" }}>
                  name: <span style={{ color: 'var(--cyber-emerald)' }}>*</span>
                </label>
                <input
                  id="minimal-name"
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Alex Vance"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="minimal-email" style={{ fontSize: '0.82rem', fontFamily: "'Fira Code', monospace" }}>
                  email: <span style={{ color: 'var(--cyber-emerald)' }}>*</span>
                </label>
                <input
                  id="minimal-email"
                  type="email"
                  required
                  className="form-input"
                  placeholder="e.g. alex@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="minimal-subject" style={{ fontSize: '0.82rem', fontFamily: "'Fira Code', monospace" }}>
                  subject:
                </label>
                <input
                  id="minimal-subject"
                  type="text"
                  className="form-input"
                  placeholder="Project Inquiry / High-Concurrency Architecture"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="minimal-message" style={{ fontSize: '0.82rem', fontFamily: "'Fira Code', monospace" }}>
                  message: <span style={{ color: 'var(--cyber-emerald)' }}>*</span>
                </label>
                <textarea
                  id="minimal-message"
                  required
                  rows={4}
                  className="form-textarea"
                  placeholder="State your technical requirements or message..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                <Send size={16} />
                <span>Execute Transmission</span>
              </button>

              {submitted && (
                <div
                  style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--cyber-emerald-subtle)',
                    color: 'var(--cyber-emerald)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    border: '1px solid var(--border-glow)',
                  }}
                >
                  <Check size={16} />
                  <span>Transmission prepared. Thank you for connecting!</span>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
