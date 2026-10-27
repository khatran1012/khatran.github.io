import React, { useState } from 'react';
import { Mail, Phone, MapPin, Globe, Send, Copy, Check, MessageSquare } from 'lucide-react';
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
    
    // Construct mailto link
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
        <div className="section-header">
          <div className="section-badge">
            <MessageSquare size={14} />
            <span>Get In Touch</span>
          </div>
          <h2 className="section-title">
            Let's <span>Connect</span>
          </h2>
          <p className="section-subtitle">
            Whether you have a technical project inquiry, architectural discussion, or career opportunity, I'd love to hear from you.
          </p>
        </div>

        <div className="contact-grid">
          {/* Left: Contact Info Cards */}
          <div className="contact-info-list">
            {/* Email */}
            <div className="contact-card-item">
              <div className="contact-icon">
                <Mail size={22} />
              </div>
              <div className="contact-details" style={{ flex: 1 }}>
                <span className="contact-label">Email Address</span>
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="contact-value"
                  style={{ color: 'var(--text-primary)' }}
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
                {copied === 'email' ? <Check size={18} color="var(--emerald-primary)" /> : <Copy size={18} />}
              </button>
            </div>

            {/* Phone */}
            <div className="contact-card-item">
              <div className="contact-icon" style={{ backgroundColor: 'var(--blue-light)', color: 'var(--blue-accent)' }}>
                <Phone size={22} />
              </div>
              <div className="contact-details" style={{ flex: 1 }}>
                <span className="contact-label">Direct Phone</span>
                <a
                  href={`tel:${PERSONAL_INFO.phone}`}
                  className="contact-value"
                  style={{ color: 'var(--text-primary)' }}
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
                {copied === 'phone' ? <Check size={18} color="var(--emerald-primary)" /> : <Copy size={18} />}
              </button>
            </div>

            {/* Location */}
            <div className="contact-card-item">
              <div className="contact-icon">
                <MapPin size={22} />
              </div>
              <div className="contact-details">
                <span className="contact-label">Location</span>
                <span className="contact-value">{PERSONAL_INFO.location}</span>
              </div>
            </div>

            {/* Website / GitHub / LinkedIn */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginTop: '0.5rem',
              }}
            >
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card-item"
                style={{ padding: '1rem' }}
              >
                <div className="contact-icon" style={{ width: '40px', height: '40px', backgroundColor: 'var(--blue-light)', color: 'var(--blue-accent)' }}>
                  <LinkedinIcon size={18} />
                </div>
                <div className="contact-details">
                  <span className="contact-label">LinkedIn</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>/in/khatran1012</span>
                </div>
              </a>

              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card-item"
                style={{ padding: '1rem' }}
              >
                <div className="contact-icon" style={{ width: '40px', height: '40px', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-primary)' }}>
                  <GithubIcon size={18} />
                </div>
                <div className="contact-details">
                  <span className="contact-label">GitHub</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>/khatran1012</span>
                </div>
              </a>
            </div>

            {/* GitHub Pages Domain Banner */}
            <div
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--emerald-light)',
                border: '1px solid var(--emerald-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <Globe size={22} color="var(--emerald-primary)" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--emerald-primary)', textTransform: 'uppercase' }}>
                  CV Portfolio Domain
                </div>
                <a
                  href={PERSONAL_INFO.website}
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    wordBreak: 'break-all',
                  }}
                >
                  {PERSONAL_INFO.website}
                </a>
              </div>
            </div>
          </div>

          {/* Right: Message Form */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Send a Direct Message
            </h3>

            <div className="form-group">
              <label className="form-label" htmlFor="contact-name">
                Your Name *
              </label>
              <input
                id="contact-name"
                type="text"
                required
                className="form-input"
                placeholder="e.g. Sarah Connor"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contact-email">
                Your Email *
              </label>
              <input
                id="contact-email"
                type="email"
                required
                className="form-input"
                placeholder="e.g. sarah@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contact-subject">
                Subject
              </label>
              <input
                id="contact-subject"
                type="text"
                className="form-input"
                placeholder="Project discussion / Fullstack role / Collaboration"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contact-message">
                Message *
              </label>
              <textarea
                id="contact-message"
                required
                rows={5}
                className="form-textarea"
                placeholder="Write your message here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              <Send size={18} />
              <span>Send Message</span>
            </button>

            {submitted && (
              <div
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--emerald-light)',
                  color: 'var(--emerald-primary)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Check size={18} />
                <span>Message composer launched! Thank you for reaching out.</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};
