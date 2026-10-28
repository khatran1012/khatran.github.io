import React, { useState, useRef, useEffect } from 'react';
import {
  Zap,
  Play,
  Wifi,
  WifiOff,
  Code2,
  QrCode,
  Cpu,
  Cloud,
  ArrowRight,
  CheckCircle2,
  Search,
  Monitor,
  LockKeyhole,
  Server,
} from 'lucide-react';
import { SIMULATION_SPECS } from '../data/cvData';

const TurnstileIcon = () => (
  <svg className="edge-demo-gate" viewBox="0 0 64 44" width="56" height="38" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
    <path d="M10 40V13a4 4 0 0 1 4-4h7v31M48 40V9h5a4 4 0 0 1 4 4v27" />
    <path className="edge-demo-arm" d="M21 21h27" /><circle cx="15" cy="15" r="1" />
  </svg>
);

export const PressureSimulations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const controllers = useRef<AbortController[]>([]);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      timers.current.forEach(clearTimeout);
      controllers.current.forEach((controller) => controller.abort());
    };
  }, []);
  const schedule = (callback: () => void, delay: number) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      callback();
    }, delay);
    timers.current.add(timer);
  };

  const [sim1Mode, setSim1Mode] = useState<'naive' | 'abort' | 'request-id'>('abort');
  const [sim1Running, setSim1Running] = useState(false);
  const [sim1Display, setSim1Display] = useState('Idle (No query fired)');
  const [sim1Log, setSim1Log] = useState<string[]>([]);
  const [sim1Packets, setSim1Packets] = useState(['Ready', 'Ready']);
  const [sim1Input, setSim1Input] = useState('');
  const [firstDelay, setFirstDelay] = useState(750);
  const [secondDelay, setSecondDelay] = useState(250);

  const runSim1 = async () => {
    if (sim1Running) return;
    setSim1Running(true);
    setSim1Log([]);
    setSim1Packets(['Waiting', 'Waiting']);
    setSim1Input('Rea');
    setSim1Display('Loading results for "Rea"...');
    const started = performance.now();
    const log = (message: string) => {
      if (mounted.current) setSim1Log((prev) => [...prev, `[${Math.round(performance.now() - started)}ms] ${message}`]);
    };
    let latestRequestId = 0;
    const first = new AbortController();
    const second = new AbortController();
    controllers.current = [first, second];
    const request = async (query: string, delay: number, controller: AbortController) => {
      const id = ++latestRequestId;
      setSim1Packets((packets) => packets.map((status, index) => index === id - 1 ? 'In flight' : status));
      log(`Request #${id} fired for "${query}" (${delay}ms mock latency)`);
      try {
        const result = await new Promise<string>((resolve, reject) => {
          const abort = () => {
            clearTimeout(timer);
            reject(new DOMException('Request cancelled', 'AbortError'));
          };
          const timer = setTimeout(() => {
            controller.signal.removeEventListener('abort', abort);
            resolve(`Results for "${query}"`);
          }, delay);
          controller.signal.addEventListener('abort', abort, { once: true });
        });
        if (!mounted.current) return;
        if (sim1Mode === 'request-id' && id !== latestRequestId) {
          setSim1Packets((packets) => packets.map((status, index) => index === id - 1 ? 'Ignored · older request' : status));
          log(`Request #${id} completed; ignored because a newer request exists.`);
          return;
        }
        const stale = id !== latestRequestId;
        setSim1Packets((packets) => packets.map((status, index) => index === id - 1 ? (stale ? 'Stale result applied' : 'Result applied') : status === 'Result applied' ? 'Result replaced' : status));
        setSim1Display(result + (stale ? ' — [BUG: STALE OVERWRITE!]' : ''));
        log(`Request #${id} completed; state updated.${stale ? ' ALERT: stale response.' : ''}`);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          if (mounted.current) setSim1Packets((packets) => packets.map((status, index) => index === id - 1 ? 'Cancelled' : status));
          log(`Request #${id} cancelled by AbortController.`);
        } else {
          log(`Request #${id} failed: ${String(error)}`);
        }
      }
    };
    const pendingFirst = request('Rea', firstDelay, first);
    schedule(async () => {
      if (sim1Mode === 'abort') first.abort();
      setSim1Input('React');
      const pendingSecond = request('React', secondDelay, second);
      await Promise.all([pendingFirst, pendingSecond]);
      if (mounted.current) setSim1Running(false);
    }, 100);
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

    schedule(() => {
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
          'CONCEPTUAL RESULT: Gate 01 consumes the ticket under a row lock; Gate 02 is rejected. This scripted browser demo does not connect to Redis or PostgreSQL.'
        );
      }
      setSim2Running(false);
    }, 1000);
  };

  // --- SIMULATION 3 STATE (Offline Edge) ---
  const [sim3Connected, setSim3Connected] = useState<boolean>(true);
  const [sim3ScanCount, setSim3ScanCount] = useState<number>(0);
  const [sim3WalQueue, setSim3WalQueue] = useState<string[]>([]);
  const [sim3GateState, setSim3GateState] = useState<'idle' | 'validating' | 'persisting' | 'open' | 'offline_open'>('idle');
  const [sim3Syncing, setSim3Syncing] = useState(false);
  const [sim3Synced, setSim3Synced] = useState(0);
  const [sim3Message, setSim3Message] = useState('Try it: cut the connection, scan a ticket, then reconnect.');
  const sim3Busy = sim3GateState !== 'idle' || sim3Syncing;

  const scanTicketEdge = () => {
    if (sim3Busy) return;
    const nextScan = sim3ScanCount + 1;
    setSim3ScanCount(nextScan);
    setSim3GateState('validating');
    setSim3Message(`TK-${9000 + nextScan}: checking the ${sim3Connected ? 'cloud service' : 'local ticket snapshot'}…`);
    schedule(() => {
      setSim3GateState('persisting');
      setSim3Message(sim3Connected ? 'Recording ticket usage before opening the gate…' : 'Recording local usage + an outbox event before opening the gate…');
      schedule(() => {
        if (!sim3Connected) setSim3WalQueue((queue) => [`TK-${9000 + nextScan} · Event ${nextScan} · Awaiting cloud acknowledgement`, ...queue]);
        setSim3GateState(sim3Connected ? 'open' : 'offline_open');
        setSim3Message(sim3Connected ? `TK-${9000 + nextScan}: entry approved. Cloud usage recorded.` : `TK-${9000 + nextScan}: entry approved offline. Event queued for replay.`);
        schedule(() => setSim3GateState('idle'), 1200);
      }, 500);
    }, 500);
  };

  const toggleEdgeConnection = () => {
    if (sim3Busy) return;
    setSim3Connected(!sim3Connected);
    if (sim3Connected) {
      setSim3Message('WAN disconnected. The edge gateway can still admit an assumed-valid ticket.');
    } else if (sim3WalQueue.length) {
      const pending = sim3WalQueue.length;
      setSim3Syncing(true);
      setSim3Message(`Replaying ${pending} queued event(s) to the cloud…`);
      schedule(() => {
        setSim3Synced((count) => count + pending);
        setSim3WalQueue([]);
        setSim3Syncing(false);
        setSim3Message(`${pending} event(s) acknowledged. Local outbox cleared.`);
      }, 900);
    } else {
      setSim3Message('Connection restored. No queued events to replay.');
    }
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
            Run real asynchronous mock requests, then explore conceptual lock and offline scenarios. These browser demos do not connect to production services or physical hardware.
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
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

            <div className="sim-body" aria-live="polite">
              {activeTab > 0 && <p className="simulation-note">Conceptual browser demo: scripted events and in-memory state. No Redis, PostgreSQL, durable WAL, HMAC verification, or hardware is running here.</p>}
              {/* --- WORKBENCH 1: RACE CONDITION SIMULATOR --- */}
              {activeTab === 0 && (
                <div>
                  <div className="simulation-modes" role="group" aria-label="Request strategy">
                    {(['naive', 'abort', 'request-id'] as const).map((mode) => (
                      <button key={mode} onClick={() => { setSim1Mode(mode); setSim1Packets(['Ready', 'Ready']); setSim1Input(''); setSim1Display('Idle (No query fired)'); setSim1Log([]); }} disabled={sim1Running}
                        aria-pressed={sim1Mode === mode} className={`arch-tag ${sim1Mode === mode ? 'patina' : ''}`}>
                        {{ naive: 'Naive', abort: 'AbortController', 'request-id': 'Request ID' }[mode]}
                      </button>
                    ))}
                  </div>
                  <div className="simulation-delays">
                    <label>Request #1 latency (ms)
                      <input type="number" min="0" max="5000" step="50" value={firstDelay} disabled={sim1Running}
                        onChange={(event) => setFirstDelay(Math.max(0, Math.min(5000, Number(event.target.value))))} />
                    </label>
                    <label>Request #2 latency (ms)
                      <input type="number" min="0" max="5000" step="50" value={secondDelay} disabled={sim1Running}
                        onChange={(event) => setSecondDelay(Math.max(0, Math.min(5000, Number(event.target.value))))} />
                    </label>
                  </div>

                  <div className="request-demo-search"><Search size={18} /><span>{sim1Input || 'Type to search…'}</span><span>Browser input</span></div>
                  <div className="request-demo-packets">
                    {['Rea', 'React'].map((query, index) => (
                      <div key={query} className={`request-demo-packet ${sim1Packets[index] === 'In flight' ? 'is-active' : ''} ${sim1Packets[index] === 'Stale result applied' ? 'demo-danger' : ''}`}>
                        <div><Server size={18} /><strong>#{index + 1} “{query}”</strong><span>{index === 0 ? firstDelay : secondDelay} ms</span></div>
                        <div className="request-demo-track"><span className={sim1Packets[index] === 'In flight' ? 'is-travelling' : ''} /></div>
                        <span>{sim1Packets[index]}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={runSim1} disabled={sim1Running} className="btn-arch btn-arch-patina edge-demo-scan">
                    <Play size={16} /> {sim1Running ? 'Requests in flight…' : 'Simulate typing “Rea” → “React”'}
                  </button>
                  <div className={`request-demo-screen ${sim1Display.includes('BUG') ? 'demo-danger' : ''}`} role="status">
                    <span><Monitor size={18} /> What the visitor sees</span>
                    <strong>{sim1Display}</strong>
                    <p>{sim1Display.includes('BUG') ? 'The older response overwrote the latest search.' : sim1Running ? 'Watch which response is allowed to update the screen.' : sim1Input ? 'Compare another strategy with the same latencies.' : 'Run the demo, then compare Naive, AbortController and Request ID.'}</p>
                  </div>
                  <details className="demo-event-details"><summary>Request event log · {sim1Log.length} events</summary><div>{sim1Log.length ? sim1Log.map((event, index) => <p key={index}>{event}</p>) : <p>No requests yet.</p>}</div></details>
                </div>
              )}

              {/* --- WORKBENCH 2: CONCURRENCY DISTRIBUTED LOCK --- */}
              {activeTab === 1 && (
                <div className="edge-demo">
                  <div className="simulation-modes" role="group" aria-label="Gate concurrency strategy">
                    {(['naive', 'locked'] as const).map((mode) => (
                      <button key={mode} disabled={sim2Running} onClick={() => { setSim2Mode(mode); setGateAStatus('idle'); setGateBStatus('idle'); setSim2ResultSummary(null); }} aria-pressed={sim2Mode === mode} className={`arch-tag ${sim2Mode === mode ? 'patina' : ''}`}>
                        {mode === 'naive' ? 'Without a lock' : 'With a row lock'}
                      </button>
                    ))}
                  </div>
                  <div className="concurrency-demo-ticket"><QrCode size={28} /><div><strong>One ticket · TK-9001</strong><span>Two gates scan the same ticket almost simultaneously.</span></div></div>
                  <div className="edge-demo-flow concurrency-demo-flow">
                    <div className={`edge-demo-node ${gateAStatus === 'passed' ? 'is-active gate-open' : gateAStatus === 'scanning' ? 'is-active' : ''}`}>
                      <TurnstileIcon /><strong>Gate 01</strong><span>{gateAStatus === 'scanning' ? 'Checking ticket…' : gateAStatus === 'passed' ? 'Admitted · 1 visitor' : 'Ready to scan'}</span>
                    </div>
                    <ArrowRight className="edge-demo-arrow" size={18} />
                    <div className={`edge-demo-node ${sim2Running ? 'is-active' : ''}`}>
                      <LockKeyhole size={32} /><strong>{sim2Mode === 'locked' ? 'Row lock' : 'No lock'}</strong><span>{sim2Running ? sim2Mode === 'locked' ? '01 takes lock · 02 waits' : 'Both read UNUSED' : gateAStatus === 'passed' ? 'Ticket → USED' : 'Ticket → UNUSED'}</span>
                    </div>
                    <ArrowRight className="edge-demo-arrow" size={18} />
                    <div className={`edge-demo-node ${gateBStatus === 'passed' ? 'gate-open demo-danger' : gateBStatus === 'rejected' ? 'demo-blocked' : gateBStatus === 'scanning' ? 'is-active' : ''}`}>
                      <TurnstileIcon /><strong>Gate 02</strong><span>{gateBStatus === 'scanning' ? 'Checking ticket…' : gateBStatus === 'passed' ? 'Admitted · duplicate!' : gateBStatus === 'rejected' ? 'Blocked · already used' : 'Ready to scan'}</span>
                    </div>
                  </div>
                  <button onClick={runSim2} disabled={sim2Running} className="btn-arch btn-arch-patina edge-demo-scan"><Play size={16} />{sim2Running ? 'Both gates are scanning…' : 'Scan the same ticket at both gates'}</button>
                  <div className={`edge-demo-result ${gateBStatus === 'passed' ? 'demo-danger' : ''}`} role="status">
                    <strong>{sim2Running ? 'Two scans · one ticket' : gateBStatus === 'passed' ? '2 visitors admitted · duplicate entry' : gateBStatus === 'rejected' ? '1 admitted · 1 blocked · no duplicate' : 'Can one ticket admit two visitors?'}</strong>
                    <p>{sim2ResultSummary || 'Run without a lock to see the race, then switch to a row lock and replay.'}</p>
                  </div>
                  <p className="edge-demo-note">Scripted browser model. The lock and 4 ms arrival gap are conceptual; no database or physical gates are connected.</p>
                </div>
              )}

              {/* --- WORKBENCH 3: OFFLINE EDGE GATEWAY --- */}
              {activeTab === 2 && (
                <div className="edge-demo">
                  <div className="edge-demo-network">
                    <span>{sim3Connected ? <Wifi size={17} /> : <WifiOff size={17} />} {sim3Connected ? 'Cloud connected' : 'WAN offline · Edge still available'}</span>
                    <button type="button" className="btn-arch btn-arch-outline" disabled={sim3Busy} onClick={toggleEdgeConnection}>
                      {sim3Syncing ? 'Syncing…' : sim3Connected ? '1. Cut connection' : '3. Reconnect & sync'}
                    </button>
                  </div>

                  <div className="edge-demo-flow" aria-label="Ticket validation and gate flow">
                    <div className={`edge-demo-node ${sim3GateState === 'validating' ? 'is-active' : ''}`}>
                      <QrCode size={34} aria-hidden="true" />
                      <strong>Visitor ticket</strong><span>{sim3ScanCount ? `TK-${9000 + sim3ScanCount}` : 'Ready to scan'}</span>
                    </div>
                    <ArrowRight className="edge-demo-arrow" size={18} aria-hidden="true" />
                    <div className={`edge-demo-node ${sim3GateState === 'validating' || sim3GateState === 'persisting' ? 'is-active' : ''}`}>
                      <Cpu size={34} aria-hidden="true" />
                      <strong>Edge gateway</strong><span>{sim3GateState === 'persisting' ? 'Save usage + event' : sim3Connected ? 'Cloud validation' : 'Local validation*'}</span>
                    </div>
                    <ArrowRight className="edge-demo-arrow" size={18} aria-hidden="true" />
                    <div className={`edge-demo-node ${sim3GateState === 'open' || sim3GateState === 'offline_open' ? 'is-active gate-open' : ''}`}>
                      <TurnstileIcon />
                      <strong>{sim3GateState === 'open' || sim3GateState === 'offline_open' ? 'Gate open' : 'Gate closed'}</strong>
                      <span>{sim3GateState === 'open' || sim3GateState === 'offline_open' ? 'Visitor admitted' : 'Waiting for approval'}</span>
                    </div>
                  </div>

                  <button type="button" onClick={scanTicketEdge} disabled={sim3Busy} className="btn-arch btn-arch-patina edge-demo-scan">
                    <QrCode size={18} /> {sim3Syncing ? 'Replaying queued events…' : sim3GateState === 'validating' ? 'Validating ticket…' : sim3GateState === 'persisting' ? 'Recording usage…' : sim3GateState !== 'idle' ? 'Visitor passing through…' : '2. Scan a visitor ticket'}
                  </button>
                  <p className="edge-demo-result" role="status">{sim3Message}</p>

                  <div className="edge-demo-outbox">
                    <div className="edge-demo-outbox-heading"><span><Cloud size={17} /> Local outbox</span><span>{sim3WalQueue.length} pending · {sim3Synced} synced</span></div>
                    {sim3Syncing && <div className="edge-demo-sync"><ArrowRight size={16} /> Replaying events → Cloud acknowledgement</div>}
                    <div className="edge-demo-events">
                      {sim3WalQueue.length ? sim3WalQueue.map((event) => <div key={event}><span className="edge-demo-pending" />{event}</div>) : <div><CheckCircle2 size={15} /> No pending events</div>}
                    </div>
                  </div>
                  <p className="edge-demo-note">* Scripted browser model: tickets are assumed valid. Usage and outbox events exist only in memory; no hardware or durable storage is involved.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Technical Explanation */}
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

            <div style={{ padding: '1rem', background: 'var(--copper-patina-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--copper-patina-border)' }}>
              <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--copper-patina)', marginBottom: '0.25rem' }}>
                THE ROBUST ARCHITECTURE:
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-ivory)', lineHeight: 1.5 }}>
                {SIMULATION_SPECS[activeTab].solutionExplanation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
