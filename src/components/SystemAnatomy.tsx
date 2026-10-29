import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode, PointerEvent } from 'react';
import type { ScrollTrigger as ScrollTriggerInstance } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowRight, ChevronLeft, ChevronRight, Layers, Minus, MoveUpRight, Plus, RotateCcw, ZoomOut } from 'lucide-react';
import { EXHIBITION_LAYERS } from '../data/cvData';
import { JOURNEY_CONNECTIONS, JOURNEY_NODES, JOURNEY_PHASES, JOURNEY_SCROLL_STEPS } from '../data/architectureJourney';
import type { JourneyMotion } from '../data/architectureJourney';

const DepthJourneyScene = lazy(() => import('./canvas/DepthJourneyScene'));

class JourneyBoundary extends Component<{ children: ReactNode; onUnavailable: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onUnavailable(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export const SystemAnatomy = ({ theme }: { theme: 'light' | 'dark' }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const inspectorRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const triggerRef = useRef<ScrollTriggerInstance | null>(null);
  const phaseRef = useRef(0);
  const queuedPhase = useRef<number | null>(null);
  const requestedNode = useRef<{ phase: number; node: string } | null>(null);
  const wake = useRef(() => {});
  const input = useRef<JourneyMotion>({ progress: 0, velocity: 0, updatedAt: 0, interactionAt: 0, yaw: 0, pitch: 0, pointerX: 0, pointerY: 0, focusDistance: 3.6, selectedNode: null, hoveredNode: null });
  const drag = useRef<{ id: number; x: number; y: number; yaw: number; pitch: number; target: HTMLCanvasElement } | null>(null);
  const [phase, setPhase] = useState(0);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [compact, setCompact] = useState(() => window.matchMedia('(max-height: 500px)').matches);
  const staticJourney = reducedMotion || unavailable || compact;
  const layerIndex = Math.max(0, phase - 1);
  const layer = EXHIBITION_LAYERS[layerIndex];
  const node = JOURNEY_NODES[layerIndex].find((candidate) => candidate.id === selectedNode);
  const onReady = useCallback(() => setReady(true), []);
  const onUnavailable = useCallback(() => { setUnavailable(true); setReady(false); }, []);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const smallViewport = window.matchMedia('(max-height: 500px)');
    const update = () => setReducedMotion(preference.matches);
    const resize = () => setCompact(smallViewport.matches);
    preference.addEventListener('change', update);
    smallViewport.addEventListener('change', resize);
    const preload = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setNear(true); preload.disconnect(); } }, { rootMargin: '300px' });
    const visibility = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (trackRef.current) preload.observe(trackRef.current);
    if (stageRef.current) visibility.observe(stageRef.current);
    if (window.location.hash === '#architecture-stack' || window.location.hash === '#system') {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
    }
    return () => { preference.removeEventListener('change', update); smallViewport.removeEventListener('change', resize); preload.disconnect(); visibility.disconnect(); };
  }, []);

  useEffect(() => {
    if (!near || staticJourney) return;
    let cancelled = false;
    let trigger: ScrollTriggerInstance | null = null;
    const update = (self: ScrollTriggerInstance) => {
      const now = performance.now();
      input.current.progress = self.progress;
      input.current.velocity = Math.max(-1, Math.min(1, self.getVelocity() / 1800));
      input.current.updatedAt = now;
      input.current.interactionAt = now;
      stageRef.current?.style.setProperty('--journey-progress', String(self.progress));
      const next = Math.min(5, Math.round(self.progress * JOURNEY_SCROLL_STEPS));
      if (phaseRef.current !== next) {
        phaseRef.current = next;
        setPhase(next);
        const selection = requestedNode.current?.phase === next ? requestedNode.current.node : null;
        setSelectedNode(selection);
        input.current.selectedNode = selection;
      }
      if (requestedNode.current && Math.abs(self.progress - requestedNode.current.phase / JOURNEY_SCROLL_STEPS) < 0.005) requestedNode.current = null;
      wake.current();
    };
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled || !trackRef.current || !stageRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      trigger = ScrollTrigger.create({
        trigger: trackRef.current,
        start: () => `top ${parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) + 16}px`,
        end: () => `+=${Math.max(1, trackRef.current!.offsetHeight - stageRef.current!.offsetHeight)}`,
        onUpdate: update,
        onRefresh: update,
        invalidateOnRefresh: true,
      });
      triggerRef.current = trigger;
      trigger.refresh();
      if (queuedPhase.current !== null) {
        window.scrollTo({ top: trigger.start + queuedPhase.current / JOURNEY_SCROLL_STEPS * (trigger.end - trigger.start), behavior: 'instant' });
        queuedPhase.current = null;
      }
    }).catch((error: unknown) => { console.error('Architecture journey initialization failed', error); if (!cancelled) onUnavailable(); });
    return () => { cancelled = true; trigger?.kill(); triggerRef.current = null; };
  }, [near, staticJourney, onUnavailable]);

  useEffect(() => {
    if (inspectorRef.current) inspectorRef.current.scrollTop = 0;
    const tab = tabs.current[phase];
    if (tab?.parentElement) tab.parentElement.scrollTo({ left: Math.max(0, tab.offsetLeft - tab.parentElement.offsetLeft - tab.parentElement.clientWidth / 2 + tab.offsetWidth / 2), behavior: 'instant' });
  }, [phase]);

  const revealSelection = useCallback(() => {
    const panel = inspectorRef.current;
    if (!selectedNode || !panel) return;
    const detail = panel.querySelector('.journey-node-detail');
    if (!detail) return;
    const overflow = detail.getBoundingClientRect().bottom - panel.getBoundingClientRect().bottom + 16;
    if (overflow > 0) panel.scrollBy({ top: overflow, behavior: reducedMotion ? 'instant' : 'smooth' });
  }, [selectedNode, reducedMotion]);
  useEffect(revealSelection, [revealSelection]);

  const zoomNode = useCallback((delta: number) => {
    const current = input.current;
    const distance = Math.max(2.2, Math.min(9, current.focusDistance + delta));
    if (distance === current.focusDistance) return false;
    current.focusDistance = distance;
    current.interactionAt = performance.now();
    wake.current();
    return true;
  }, []);

  useEffect(() => {
    const visual = visualRef.current;
    if (!visual || !selectedNode || !ready || unavailable) return;
    const zoom = (event: WheelEvent) => {
      if (event.ctrlKey || event.shiftKey || !event.deltaY) return;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? visual.clientHeight : 1;
      if (zoomNode(Math.max(-120, Math.min(120, event.deltaY * unit)) * 0.006)) event.preventDefault();
    };
    visual.addEventListener('wheel', zoom, { passive: false });
    return () => visual.removeEventListener('wheel', zoom);
  }, [selectedNode, ready, unavailable, zoomNode]);

  const goToPhase = useCallback((next: number, nodeId: string | null = null) => {
    const target = Math.max(0, Math.min(5, next));
    setNear(true);
    requestedNode.current = nodeId ? { phase: target, node: nodeId } : null;
    setSelectedNode(nodeId);
    input.current.selectedNode = nodeId;
    input.current.focusDistance = 3.6;
    input.current.hoveredNode = null;
    input.current.interactionAt = performance.now();
    const trigger = triggerRef.current;
    if (trigger && !staticJourney) {
      window.scrollTo({ top: trigger.start + target / JOURNEY_SCROLL_STEPS * (trigger.end - trigger.start), behavior: 'smooth' });
    } else {
      if (!staticJourney) queuedPhase.current = target;
      phaseRef.current = target;
      setPhase(target);
      input.current.progress = target / JOURNEY_SCROLL_STEPS;
      input.current.velocity = 0;
      stageRef.current?.style.setProperty('--journey-progress', String(target / JOURNEY_SCROLL_STEPS));
    }
    wake.current();
  }, [staticJourney]);
  const inspectNode = useCallback((board: number, nodeId: string) => goToPhase(board + 1, nodeId), [goToPhase]);
  const resetFocus = () => {
    requestedNode.current = null;
    setSelectedNode(null);
    input.current.selectedNode = null;
    input.current.interactionAt = performance.now();
    wake.current();
  };

  const movePointer = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') {
      const bounds = event.currentTarget.getBoundingClientRect();
      input.current.pointerX = (event.clientX - bounds.left) / bounds.width * 2 - 1;
      input.current.pointerY = (event.clientY - bounds.top) / bounds.height * 2 - 1;
    }
    if (drag.current?.id === event.pointerId) {
      input.current.yaw = Math.max(-0.22, Math.min(0.22, drag.current.yaw + (event.clientX - drag.current.x) * 0.003));
      input.current.pitch = Math.max(-0.12, Math.min(0.12, drag.current.pitch + (event.clientY - drag.current.y) * 0.002));
      input.current.interactionAt = performance.now();
    }
    wake.current();
  };
  const releasePointer = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id !== event.pointerId) return;
    if (drag.current.target.hasPointerCapture(event.pointerId)) drag.current.target.releasePointerCapture(event.pointerId);
    drag.current = null;
  };

  return (
    <section id="system" className="section section-alt">
      <div className="container">
        <div className="journey-heading">
          <div className="chapter-badge"><Layers size={13} /><span>CHAPTER 02 // INSIDE THE MACHINE</span></div>
          <h2 className="chapter-title">Inside <span className="accent-patina">the Machine.</span></h2>
          <p className="chapter-desc">A journey through software architecture. Travel from the interface to the physical edge, follow the signals between them, and inspect the decisions that hold the system together.</p>
        </div>
        <div ref={trackRef} id="architecture-stack" className={`journey-track ${staticJourney ? 'is-static' : ''}`}>
          <div ref={stageRef} className="journey-stage" data-phase={phase}>
            <div className="journey-toolbar">
              <div><span className="journey-eyebrow">PCB DEPTH JOURNEY</span><strong>A journey through software architecture</strong></div>
              <a href="#pressure" className="journey-skip">Skip experience <MoveUpRight size={14} /></a>
            </div>
            <div className="journey-tabs" role="tablist" aria-label="Architecture journey stages">
              {JOURNEY_PHASES.map((label, index) => (
                <button key={label} id={`journey-tab-${index}`} ref={(button) => { tabs.current[index] = button; }}
                  type="button" role="tab" aria-selected={phase === index} aria-controls="journey-inspection" tabIndex={phase === index ? 0 : -1}
                  onClick={() => goToPhase(index)} onKeyDown={(event) => {
                    let next = index;
                    if (event.key === 'ArrowRight') next = Math.min(5, index + 1);
                    else if (event.key === 'ArrowLeft') next = Math.max(0, index - 1);
                    else if (event.key === 'Home') next = 0;
                    else if (event.key === 'End') next = 5;
                    else return;
                    event.preventDefault(); goToPhase(next); tabs.current[next]?.focus({ preventScroll: true });
                  }}><span>0{index}</span>{label}</button>
              ))}
            </div>
            <div className="journey-body">
              <div ref={visualRef} className="journey-visual" onPointerMove={movePointer} onPointerDown={(event) => {
                if ((phase !== 0 && phase !== 5) || reducedMotion || event.button !== 0 || !(event.target instanceof HTMLCanvasElement)) return;
                drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw: input.current.yaw, pitch: input.current.pitch, target: event.target };
                event.target.setPointerCapture(event.pointerId);
              }} onPointerUp={releasePointer} onPointerCancel={releasePointer} onLostPointerCapture={releasePointer}
                onPointerLeave={() => { input.current.pointerX = 0; input.current.pointerY = 0; wake.current(); }}
                role="group" aria-label={selectedNode ? 'Node inspection. Scroll inside the scene or use the zoom buttons. Back to layer resumes the scroll journey.' : 'Interactive 3D architecture. Scroll or use the stage tabs, then select a chip to inspect its role.'}>
                {near && !unavailable && <JourneyBoundary onUnavailable={onUnavailable}><Suspense fallback={null}>
                  <DepthJourneyScene motion={input} wake={wake} active={visible} reducedMotion={reducedMotion} theme={theme}
                    onInspect={inspectNode} onReady={onReady} onUnavailable={onUnavailable} />
                </Suspense></JourneyBoundary>}
                {!ready && <div className="journey-fallback">
                  <div className="journey-fallback-orbit" aria-hidden="true"><Layers size={42} /></div>
                  <strong>{unavailable ? 'Explore the architecture' : 'Your journey starts here.'}</strong>
                  <p>{unavailable ? 'Choose a layer to explore its nodes, signal paths and engineering decisions.' : 'Five connected layers. From the first interaction to the physical world.'}</p>
                  <div>{EXHIBITION_LAYERS.map((item, index) => <button key={item.id} onClick={() => goToPhase(index + 1)}>{item.slabLabel}<ArrowRight size={12} /></button>)}</div>
                </div>}
                <div className="journey-scene-caption" aria-hidden="true"><span>0{phase} / 05</span><strong>{JOURNEY_PHASES[phase]}</strong><span>{unavailable ? 'EXPLORE WITH THE TABS' : selectedNode ? `INSPECTING ${node?.label ?? ''} · SCROLL TO ZOOM` : phase === 0 && !reducedMotion ? 'DRAG TO ORBIT · CLICK A BOARD TO INSPECT' : 'SELECT A CHIP TO ZOOM IN'}</span></div>
                {selectedNode && !unavailable && <div className="journey-focus-controls" role="group" aria-label="Node camera controls">
                  <button type="button" aria-label="Zoom in on node" onClick={() => zoomNode(-0.6)}><Plus size={16} /></button>
                  <button type="button" aria-label="Zoom out from node" onClick={() => zoomNode(0.6)}><Minus size={16} /></button>
                  <button type="button" className="journey-reset-focus" onClick={resetFocus}><ZoomOut size={15} />Back to layer</button>
                </div>}
              </div>
              <div ref={inspectorRef} id="journey-inspection" className="journey-inspector" role="tabpanel" aria-labelledby={`journey-tab-${phase}`} tabIndex={0}>
                <AnimatePresence initial={false} mode="wait">
                  <motion.div key={phase} initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.14 }} onAnimationComplete={revealSelection}>
                    <p className="journey-eyebrow">{phase === 0 ? 'THE BIG PICTURE' : `LAYER 0${phase} / INSPECTION`}</p>
                    <h3>{phase === 0 ? 'One system. Five responsibilities.' : layer.title}</h3>
                    <p className="journey-summary">{phase === 0 ? 'Scroll to move through the architecture, or take a shortcut with the stage tabs. Every board has real nodes you can inspect.' : layer.architecturalRole}</p>
                    {phase === 0 ? <div className="journey-overview-list">{EXHIBITION_LAYERS.map((item, index) => <button key={item.id} onClick={() => goToPhase(index + 1)}><span>{item.number}</span><div><strong>{item.slabLabel}</strong><small>{item.chipCaption}</small></div><ChevronRight size={14} /></button>)}</div> : <>
                      <div className="journey-node-list" role="group" aria-label="Inspect module nodes">{JOURNEY_NODES[layerIndex].map((item) => <button key={item.id} type="button" aria-pressed={selectedNode === item.id} onClick={() => inspectNode(layerIndex, item.id)}><span />{item.label}</button>)}</div>
                      <div className="journey-node-detail" role="status"><strong>{node?.title ?? 'Select a node'}</strong><p>{node?.description ?? 'Select an illuminated chip in the scene or use the node buttons above.'}</p></div>
                      <div className="journey-tags">{layer.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>
                    </>}
                    <div className="journey-signal-paths"><span className="journey-eyebrow">SIGNAL PATHS</span>{JOURNEY_CONNECTIONS.filter((connection) => phase === 0 || phase === 5 || connection.from === layerIndex || connection.to === layerIndex).map((connection) => <p key={connection.label}><ArrowRight size={12} />{connection.label}</p>)}</div>
                    {phase > 0 && <details className="journey-decisions"><summary>Engineering decisions & project context</summary><p>{layer.description}</p><strong>Why this design</strong><p>{layer.engineeringRationale}</p><strong>Trade-off</strong><p>{layer.tradeoffs}</p><strong>Project context</strong><p>{layer.experienceContext}</p></details>}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            <div className="journey-footer">
              <p><ArrowDown size={14} />{selectedNode && !unavailable ? 'Scroll inside the scene to zoom. Back to layer to continue.' : staticJourney ? 'Choose a stage to explore' : phase === 5 ? 'Scroll to reconnect the full system, then continue to Chapter 03.' : 'Scroll to travel deeper. Select a node to inspect.'}</p>
              <div><button type="button" onClick={() => goToPhase(0)} aria-label="Return to architecture overview"><RotateCcw size={15} /></button><button type="button" disabled={phase === 0} onClick={() => goToPhase(phase - 1)} aria-label="Previous architecture stage"><ChevronLeft size={17} /></button><button type="button" disabled={phase === 5} onClick={() => goToPhase(phase + 1)} aria-label="Next architecture stage"><ChevronRight size={17} /></button></div>
            </div>
            <div className="journey-progress" role="progressbar" aria-label="Architecture journey progress" aria-valuemin={0} aria-valuemax={5} aria-valuenow={phase} aria-valuetext={JOURNEY_PHASES[phase]}><span /></div>
          </div>
        </div>
      </div>
    </section>
  );
};
