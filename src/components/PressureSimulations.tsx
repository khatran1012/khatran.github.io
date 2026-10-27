import React, { useState } from 'react';
import {
  Zap,
  Play,
  Wifi,
  WifiOff,
  Code2,
} from 'lucide-react';
import { SIMULATION_SPECS } from '../data/cvData';

export const PressureSimulations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  // --- SIMULATION 1 STATE (Race Condition) ---
  const [sim1Mode, setSim1Mode] = useState<'naive' | 'shielded'>('shielded');
  const [sim1Running, setSim1Running] = useState(false);
  const [sim1Display, setSim1Display] = useState<string>('Idle (No query fired)');
  const [sim1Log, setSim1Log] = useState<string[]>([]);

  const runSim1 = () => {
    if (sim1Running) return;
    setSim1Running(true);
    setSim1Log([`[0ms] User rapidly types: "Rea" -> fires Request #1`]);
    setSim1Display('Loading results for "Rea"...');

    setTimeout(() => {
      setSim1Log((prev) => [...prev, `[100ms] User types: "React" -> fires Request #2`]);
      if (sim1Mode === 'shielded') {
        setSim1Log((prev) => [
          ...prev,
          `[105ms] SHIELD ACTIVE: controller.abort() called for Request #1`,
        ]);
      }
    }, 100);

    // Request 2 completes at 350ms (100ms delay + 250ms fetch)
    setTimeout(() => {
      setSim1Log((prev) => [
        ...prev,
        `[350ms] Request #2 ("React") completes! (Payload: 1,420 items)`,
      ]);
      setSim1Display('Results for "React" (1,420 items)');
    }, 350);

    // Request 1 completes at 750ms
    setTimeout(() => {
      if (sim1Mode === 'naive') {
        setSim1Log((prev) => [
          ...prev,
          `[750ms] Request #1 ("Rea") completes late! Naive handler overwrites state!`,
          `[ALERT] UI is now showing STALE data for "Rea" despite user searching "React"!`,
        ]);
        setSim1Display('Results for "Rea" (84 items) — [BUG: STALE OVERWRITE!]');
      } else {
        setSim1Log((prev) => [
          ...prev,
          `[750ms] Request #1 payload arrived, but dropped: requestId mismatch & socket aborted.`,
          `[VERIFIED] UI preserved current "React" results safely. Zero race condition.`,
        ]);
      }
      setSim1Running(false);
    }, 800);
  };

  // --- SIMULATION 2 STATE (Distributed Lock) ---
  const [sim2Mode, setSim2Mode] = useState<'naive' | 'locked'>('locked');
  const [sim2Running, setSim2Running] = useState(false);
  const [gateAStatus, setGateAStatus] = useState<'idle' | 'scanning' | 'passed' | 'rejected'>('idle');
  const [gateBStatus, setGateBStatus] = useState<'idle' | 'scanning' | 'passed' | 'rejected'>('idle');
  const [sim2ResultSummary, setSim2ResultSummary] = useState<string | null>(null);

  const runSim2 = () => {
    if (sim2Running) return;
    setSim2Running(true);
    setGateAStatus('scanning');
    setGateBStatus('scanning');
    setSim2ResultSummary('Simulating concurrent barcode scan at Gate 01 and Gate 02 (Δt = 4ms)...');

    setTimeout(() => {
      if (sim2Mode === 'naive') {
        // Both pass (Critical bug!)
        setGateAStatus('passed');
        setGateBStatus('passed');
        setSim2ResultSummary(
          'CRITICAL RACE CONDITION: Both gates simultaneously checked status == "UNUSED" before update! 1 ticket let 2 people in.'
        );
      } else {
        // Gate A wins lock, Gate B rejected
        setGateAStatus('passed');
        setGateBStatus('rejected');
        setSim2ResultSummary(
          'PROTECTION SUCCESS: Gate 01 acquired Redis mutex (Key: lock:ticket:TK-8891) and SQL row lock. Gate 02 rejected with ALREADY_CONSUMED.'
        );
      }
      setSim2Running(false);
    }, 600);
  };

  // --- SIMULATION 3 STATE (Offline Edge) ---
  const [sim3Connected, setSim3Connected] = useState<boolean>(true);
  const [sim3ScanCount, setSim3ScanCount] = useState<number>(0);
  const [sim3WalQueue, setSim3WalQueue] = useState<string[]>([]);
  const [sim3GateState, setSim3GateState] = useState<'idle' | 'open' | 'offline_open'>('idle');

  const scanTicketEdge = () => {
    const nextScan = sim3ScanCount + 1;
    setSim3ScanCount(nextScan);

    if (!sim3Connected) {
      // Offline mode
      setSim3GateState('offline_open');
      setSim3WalQueue((prev) => [
        `WAL #0${nextScan}: Ticket TK-${9000 + nextScan} (Signed HMAC valid) - Offline Approved`,
        ...prev,
      ]);
    } else {
      // Online mode
      setSim3GateState('open');
    }

    setTimeout(() => setSim3GateState('idle'), 400);
  };

  return (
    <section id="pressure" className="section">
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div className="chapter-badge warm">
            <Zap size={13} />
            <span>CHAPTER 03 // DECISIONS UNDER PRESSURE</span>
          </div>
          <h2 className="chapter-title">
            Engineering Under <span className="accent-copper">Contention.</span>
          </h2>
          <p className="chapter-desc">
            Seniority is not demonstrated by listing library names—it is revealed in how you reason
            about concurrency, race conditions, edge failures, and physical world constraints.
            Interact with live simulations replicating production scenarios.
          </p>
        </div>

        {/* Simulation Selector Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            marginBottom: '2rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
          }}
        >
          {SIMULATION_SPECS.map((spec, index) => {
            const isSelected = activeTab === index;
            return (
              <button
                key={spec.id}
                onClick={() => setActiveTab(index)}
                className={`arch-slab ${isSelected ? 'active' : ''}`}
                style={{
                  padding: '1rem 1.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  minWidth: '280px',
                  borderBottom: isSelected ? '2px solid var(--copper-warm-bright)' : undefined,
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    backgroundColor: isSelected ? 'var(--copper-warm-subtle)' : 'var(--bg-canvas)',
                    color: isSelected ? 'var(--copper-warm-bright)' : 'var(--text-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                  }}
                >
                  0{index + 1}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                    {spec.category}
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-ivory)' }}>
                    {spec.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Current Active Simulation Workspace */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2rem',
            alignItems: 'start',
          }}
        >
          {/* Left: Interactive Simulation Playground */}
          <div className="sim-container">
            <div className="sim-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--copper-patina)' }} />
                <span>INTERACTIVE WORKBENCH // {SIMULATION_SPECS[activeTab].number}</span>
              </div>
              <span style={{ color: 'var(--copper-warm-bright)', fontWeight: 600 }}>
                {SIMULATION_SPECS[activeTab].keyMetric}
              </span>
            </div>

            <div className="sim-body">
              {/* --- WORKBENCH 1: RACE CONDITION SIMULATOR --- */}
              {activeTab === 0 && (
                <div>
                  {/* Mode Selector */}
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <button
                      onClick={() => setSim1Mode('naive')}
                      style={{
                        flex: 1,
                        padding: '0.65rem',
                        borderRadius: 'var(--radius-xs)',
                        border: `1px solid ${sim1Mode === 'naive' ? 'rgba(239, 68, 68, 0.5)' : 'var(--border-arch)'}`,
                        background: sim1Mode === 'naive' ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                        color: sim1Mode === 'naive' ? '#f87171' : 'var(--text-secondary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      [1] Naive Async (Vulnerable)
                    </button>
                    <button
                      onClick={() => setSim1Mode('shielded')}
                      style={{
                        flex: 1,
                        padding: '0.65rem',
                        borderRadius: 'var(--radius-xs)',
                        border: `1px solid ${sim1Mode === 'shielded' ? 'var(--copper-patina-border)' : 'var(--border-arch)'}`,
                        background: sim1Mode === 'shielded' ? 'var(--copper-patina-subtle)' : 'transparent',
                        color: sim1Mode === 'shielded' ? 'var(--copper-patina)' : 'var(--text-secondary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      [2] AbortController Shield (Robust)
                    </button>
                  </div>

                  {/* Trigger Action */}
                  <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button
                      onClick={runSim1}
                      disabled={sim1Running}
                      className="btn-arch btn-arch-patina"
                      style={{ padding: '0.6rem 1.4rem' }}
                    >
                      <Play size={16} />
                      <span>{sim1Running ? 'Executing Pipeline...' : 'Fire Rapid Keystrokes ("Rea" -> "React")'}</span>
                    </button>
                  </div>

                  {/* Simulated Viewport Output */}
                  <div
                    style={{
                      padding: '1.25rem',
                      background: 'var(--bg-canvas)',
                      border: '1px solid var(--border-arch)',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', display: 'block', marginBottom: '0.4rem' }}>
                      RENDERED UI STATE (What user sees on screen):
                    </span>
                    <div
                      style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: sim1Display.includes('BUG') ? '#f87171' : 'var(--text-ivory)',
                      }}
                    >
                      {sim1Display}
                    </div>
                  </div>

                  {/* Live Packet Logs */}
                  <div
                    style={{
                      maxHeight: '160px',
                      overflowY: 'auto',
                      padding: '0.85rem',
                      background: 'var(--bg-terminal)',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.74rem',
                      lineHeight: 1.6,
                      color: 'var(--text-terminal)',
                    }}
                  >
                    {sim1Log.length === 0 ? (
                      <span style={{ color: 'var(--text-tertiary)' }}>Click button above to trigger asynchronous pipeline execution...</span>
                    ) : (
                      sim1Log.map((log, i) => (
                        <div key={i} style={{ color: log.includes('ALERT') ? '#f87171' : log.includes('VERIFIED') ? 'var(--copper-patina)' : 'inherit' }}>
                          {log}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* --- WORKBENCH 2: CONCURRENCY DISTRIBUTED LOCK --- */}
              {activeTab === 1 && (
                <div>
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <button
                      onClick={() => setSim2Mode('naive')}
                      style={{
                        flex: 1,
                        padding: '0.65rem',
                        borderRadius: 'var(--radius-xs)',
                        border: `1px solid ${sim2Mode === 'naive' ? 'rgba(239, 68, 68, 0.5)' : 'var(--border-arch)'}`,
                        background: sim2Mode === 'naive' ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                        color: sim2Mode === 'naive' ? '#f87171' : 'var(--text-secondary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Naive Read-Then-Update
                    </button>
                    <button
                      onClick={() => setSim2Mode('locked')}
                      style={{
                        flex: 1,
                        padding: '0.65rem',
                        borderRadius: 'var(--radius-xs)',
                        border: `1px solid ${sim2Mode === 'locked' ? 'var(--copper-patina-border)' : 'var(--border-arch)'}`,
                        background: sim2Mode === 'locked' ? 'var(--copper-patina-subtle)' : 'transparent',
                        color: sim2Mode === 'locked' ? 'var(--copper-patina)' : 'var(--text-secondary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Redis Lock + SELECT FOR UPDATE
                    </button>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <button
                      onClick={runSim2}
                      disabled={sim2Running}
                      className="btn-arch btn-arch-patina"
                      style={{ padding: '0.6rem 1.4rem' }}
                    >
                      <Play size={16} />
                      <span>{sim2Running ? 'Processing Mutex...' : 'Fire Concurrent Scans (Δt = 4ms)'}</span>
                    </button>
                  </div>

                  {/* Dual Gate Physical Visualization */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                    {/* Gate 1 */}
                    <div
                      style={{
                        padding: '1.25rem',
                        background: 'var(--bg-canvas)',
                        borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${gateAStatus === 'passed' ? 'var(--copper-patina)' : 'var(--border-arch)'}`,
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', marginBottom: '0.3rem' }}>
                        PHYSICAL TURNSTILE 01
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: gateAStatus === 'passed' ? 'var(--copper-patina)' : 'var(--text-ivory)' }}>
                        {gateAStatus === 'scanning' ? 'VALIDATING...' : gateAStatus === 'passed' ? 'PASS // OPENED' : 'IDLE'}
                      </div>
                    </div>

                    {/* Gate 2 */}
                    <div
                      style={{
                        padding: '1.25rem',
                        background: 'var(--bg-canvas)',
                        borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${gateBStatus === 'passed' ? '#f87171' : gateBStatus === 'rejected' ? 'var(--copper-warm)' : 'var(--border-arch)'}`,
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', marginBottom: '0.3rem' }}>
                        PHYSICAL TURNSTILE 02
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: gateBStatus === 'passed' ? '#f87171' : gateBStatus === 'rejected' ? '#f87171' : 'var(--text-ivory)' }}>
                        {gateBStatus === 'scanning' ? 'VALIDATING...' : gateBStatus === 'passed' ? 'PASS (DUPLICATE!)' : gateBStatus === 'rejected' ? 'REJECTED // LOCKED' : 'IDLE'}
                      </div>
                    </div>
                  </div>

                  {sim2ResultSummary && (
                    <div
                      style={{
                        padding: '0.85rem',
                        background: sim2ResultSummary.includes('CRITICAL') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(50, 168, 149, 0.1)',
                        border: `1px solid ${sim2ResultSummary.includes('CRITICAL') ? 'rgba(239, 68, 68, 0.3)' : 'var(--copper-patina-border)'}`,
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '0.82rem',
                        color: sim2ResultSummary.includes('CRITICAL') ? '#fca5a5' : 'var(--copper-patina)',
                        lineHeight: 1.5,
                      }}
                    >
                      {sim2ResultSummary}
                    </div>
                  )}
                </div>
              )}

              {/* --- WORKBENCH 3: OFFLINE EDGE GATEWAY --- */}
              {activeTab === 2 && (
                <div>
                  {/* Network Status Toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', background: 'var(--bg-canvas)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-arch)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      {sim3Connected ? <Wifi size={18} color="var(--copper-patina)" /> : <WifiOff size={18} color="#f87171" />}
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: sim3Connected ? 'var(--copper-patina)' : '#f87171' }}>
                        WAN CLOUD LINK: {sim3Connected ? 'ONLINE (12ms)' : 'SEVERED / DISCONNECTED'}
                      </span>
                    </div>

                    <button
                      onClick={() => setSim3Connected(!sim3Connected)}
                      style={{
                        padding: '0.35rem 0.85rem',
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid var(--border-arch)',
                        background: sim3Connected ? 'rgba(239, 68, 68, 0.15)' : 'var(--copper-patina-subtle)',
                        color: sim3Connected ? '#f87171' : 'var(--copper-patina)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      {sim3Connected ? 'Simulate Fiber Cut' : 'Restore Connection'}
                    </button>
                  </div>

                  {/* Trigger Gate Scan */}
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                    <button
                      onClick={scanTicketEdge}
                      className="btn-arch btn-arch-patina"
                      style={{ padding: '0.6rem 1.4rem' }}
                    >
                      <Play size={16} />
                      <span>Scan Visitor Ticket At Gate</span>
                    </button>
                  </div>

                  {/* Hardware Status */}
                  <div
                    style={{
                      padding: '1.25rem',
                      background: 'var(--bg-canvas)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-arch)',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>TURNSTILE RELAY STATUS</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: sim3GateState !== 'idle' ? 'var(--copper-patina)' : 'var(--text-ivory)' }}>
                        {sim3GateState === 'idle' ? 'IDLE (READY)' : sim3GateState === 'open' ? 'RELAY OPENED (CLOUD CONFIRMED)' : 'RELAY OPENED (LOCAL HMAC VALIDATED)'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>HARDWARE DOWNTIME</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--copper-patina)' }}>0 ms (100% Uptime)</div>
                    </div>
                  </div>

                  {/* Local WAL Queue */}
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', marginBottom: '0.4rem' }}>
                    LOCAL EDGE WRITE-AHEAD-LOG (WAL) BUFFER ({sim3WalQueue.length} entries pending sync):
                  </div>
                  <div
                    style={{
                      maxHeight: '120px',
                      overflowY: 'auto',
                      padding: '0.65rem',
                      background: 'var(--bg-terminal)',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.72rem',
                      color: 'var(--copper-warm-bright)',
                    }}
                  >
                    {sim3WalQueue.length === 0 ? (
                      <span style={{ color: 'var(--text-tertiary)' }}>WAL queue empty. Turnstile running online sync.</span>
                    ) : (
                      sim3WalQueue.map((wal, idx) => <div key={idx}>{wal}</div>)
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Technical Explanation & Verbatim Production Implementation */}
          <div className="arch-slab" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Code2 size={16} color="var(--copper-patina)" />
              <span className="arch-tag patina">ENGINEERING DEEP DIVE</span>
            </div>

            <h3 style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.6rem', color: 'var(--text-ivory)', marginBottom: '0.75rem' }}>
              {SIMULATION_SPECS[activeTab].title}
            </h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {SIMULATION_SPECS[activeTab].problemSummary}
            </p>

            <div style={{ marginBottom: '1.25rem', padding: '1rem', background: 'var(--bg-canvas)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-arch)' }}>
              <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--copper-warm-bright)', marginBottom: '0.25rem' }}>
                THE FLAWED MENTAL MODEL:
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {SIMULATION_SPECS[activeTab].vulnerableExplanation}
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--copper-patina-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--copper-patina-border)' }}>
              <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--copper-patina)', marginBottom: '0.25rem' }}>
                THE ROBUST ARCHITECTURE:
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-ivory)', lineHeight: 1.5 }}>
                {SIMULATION_SPECS[activeTab].solutionExplanation}
              </p>
            </div>

            {/* Verbatim Code Solution */}
            <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-arch)' }}>
              <div style={{ padding: '0.5rem 1rem', background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-arch)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
                PRODUCTION IMPLEMENTATION BLUEPRINT
              </div>
              <pre
                style={{
                  padding: '1rem',
                  background: 'var(--bg-terminal)',
                  fontSize: '0.76rem',
                  lineHeight: 1.5,
                  overflowX: 'auto',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-terminal)',
                }}
              >
                <code>{SIMULATION_SPECS[activeTab].codeSnippet}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
