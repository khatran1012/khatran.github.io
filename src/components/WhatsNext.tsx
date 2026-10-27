import React, { useState } from 'react';
import {
  Compass,
  Mail,
  Download,
  Copy,
  Check,
  Globe,
  ArrowRight,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/cvData';
import { GithubIcon, LinkedinIcon } from './Icons';

export const WhatsNext: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2500);
  };

  return (
    <section id="next" className="section">
      <div className="container" style={{ maxWidth: '980px' }}>
        {/* Section Header */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div className="chapter-badge warm">
            <Compass size={13} />
            <span>CHAPTER 05 // WHAT'S NEXT?</span>
          </div>
          <h2 className="chapter-title">
            The Horizon &amp; <span className="accent-copper">Connection.</span>
          </h2>
          <p className="chapter-desc">
            The next era of software belongs to systems that operate deterministically:
            local-first synchronization, efficient services, and interfaces that handle
            network interruptions gracefully.
          </p>
        </div>

        {/* Future Engineering Vectors */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '1.25rem',
            marginBottom: '3rem',
          }}
        >
          <div className="arch-slab" style={{ padding: '1.5rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--copper-patina)', fontWeight: 700, marginBottom: '0.4rem' }}>
              VECTOR 01 // LOCAL-FIRST &amp; CRDTs
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-ivory)', marginBottom: '0.4rem' }}>
              Resilient Offline Computing
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Exploring local data storage and conflict resolution so interfaces can remain useful
              during network loss and reconcile changes after reconnection.
            </p>
          </div>

          <div className="arch-slab" style={{ padding: '1.5rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--copper-warm-bright)', fontWeight: 700, marginBottom: '0.4rem' }}>
              VECTOR 02 // DISTRIBUTED MICROSERVICES
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-ivory)', marginBottom: '0.4rem' }}>
              Golang High-Concurrency Pipelines
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Architecting ultra-low latency transaction backends capable of processing tens of
              thousands of concurrent requests with strict transactional invariants.
            </p>
          </div>

          <div className="arch-slab" style={{ padding: '1.5rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--copper-patina)', fontWeight: 700, marginBottom: '0.4rem' }}>
              VECTOR 03 // ARCHITECTURAL TEAMS
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-ivory)', marginBottom: '0.4rem' }}>
              High-Trust Collaboration
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Fostering engineering cultures of high code ownership, disciplined trade-off analysis,
              and fast adaptation to modern technical stacks.
            </p>
          </div>
        </div>

        {/* Minimalist Recruiter & Collaborator Action Center */}
        <div
          className="arch-slab"
          style={{
            padding: '2.5rem',
            borderColor: 'var(--copper-patina-border)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Corner Coordinate */}
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1.25rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: 'var(--text-tertiary)',
            }}
          >
            DISPATCH // 2026 ACTIVE
          </div>

          <div style={{ maxWidth: '640px', marginBottom: '2rem' }}>
            <div className="arch-tag patina" style={{ marginBottom: '0.6rem' }}>
              ACTION GATEWAY // SOFTWARE ENGINEER
            </div>
            <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.8rem', color: 'var(--text-ivory)', marginBottom: '0.6rem' }}>
              Let's Build Resilient Systems Together.
            </h3>
            <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Whether you are architecting a high-concurrency microservice, deploying edge hardware
              controllers, or building a mission-critical web application—I am open to compelling
              engineering challenges and full-time opportunities.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '2.5rem' }}>
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className="btn-arch btn-arch-patina"
              style={{ padding: '0.8rem 1.8rem' }}
            >
              <Mail size={17} />
              <span>Initiate Direct Inquiry</span>
              <ArrowRight size={16} />
            </a>

            <a
              href={PERSONAL_INFO.cvPdfUrl}
              download="Kha_Tran_Software_Engineer_CV.pdf"
              className="btn-arch btn-arch-outline"
              style={{ padding: '0.8rem 1.6rem' }}
            >
              <Download size={17} />
              <span>Download Official Resume (PDF)</span>
            </a>
          </div>

          {/* Direct Frictionless Channels Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              borderTop: '1px solid var(--border-arch)',
              paddingTop: '2rem',
            }}
          >
            {/* Email Card with 1-click copy */}
            <div
              style={{
                padding: '1rem',
                background: 'var(--bg-canvas)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-arch)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', display: 'block' }}>
                  PRIMARY EMAIL
                </span>
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: 'var(--text-ivory)',
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {PERSONAL_INFO.email}
                </a>
              </div>
              <button
                onClick={() => copyToClipboard(PERSONAL_INFO.email, 'email')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: copied === 'email' ? 'var(--copper-patina)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '0.3rem',
                }}
                title="Copy email to clipboard"
                aria-label="Copy email"
              >
                {copied === 'email' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            {/* Phone Card with 1-click copy */}
            <div
              style={{
                padding: '1rem',
                background: 'var(--bg-canvas)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-arch)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', display: 'block' }}>
                  DIRECT PHONE
                </span>
                <a
                  href={`tel:${PERSONAL_INFO.phone}`}
                  style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-ivory)' }}
                >
                  {PERSONAL_INFO.displayPhone}
                </a>
              </div>
              <button
                onClick={() => copyToClipboard(PERSONAL_INFO.phone, 'phone')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: copied === 'phone' ? 'var(--copper-patina)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '0.3rem',
                }}
                title="Copy phone to clipboard"
                aria-label="Copy phone"
              >
                {copied === 'phone' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            {/* Location */}
            <div
              style={{
                padding: '1rem',
                background: 'var(--bg-canvas)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-arch)',
              }}
            >
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', display: 'block' }}>
                LOCATION BASE
              </span>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-ivory)' }}>
                {PERSONAL_INFO.location}
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              marginTop: '1.25rem',
              alignItems: 'center',
            }}
          >
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="arch-tag"
              style={{ padding: '0.45rem 0.85rem' }}
            >
              <LinkedinIcon size={14} />
              <span>LinkedIn Profile</span>
            </a>

            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className="arch-tag"
              style={{ padding: '0.45rem 0.85rem' }}
            >
              <GithubIcon size={14} />
              <span>GitHub /khatran1012</span>
            </a>

            <a
              href={PERSONAL_INFO.website}
              className="arch-tag patina"
              style={{ padding: '0.45rem 0.85rem' }}
            >
              <Globe size={14} />
              <span>Verified Domain: khatran1012.github.io</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
