import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { ScanLine } from 'lucide-react';
import type { CareerExhibit } from '../../data/careerArchive';

const GooeyImageTransition = lazy(() => import('./GooeyImageTransition'));

class PreviewBoundary extends Component<{ children: ReactNode; onUnavailable: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onUnavailable(); }
  render() { return this.state.failed ? null : this.props.children; }
}

interface PreviewProps {
  exhibit: CareerExhibit;
  engineering: boolean;
  enabled: boolean;
  visible: boolean;
  expanded: boolean;
  reduced: boolean;
  onIntent: () => void;
}

export function CareerPreview({ exhibit, engineering, enabled, visible, expanded, reduced, onIntent }: PreviewProps) {
  const image = engineering ? exhibit.diagram : exhibit.image;
  const origin = useRef({ x: 0.5, y: 0.5 });
  const firstImage = useRef<string | null>(null);
  const [poster, setPoster] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [displayed, setDisplayed] = useState('');
  const x = useMotionValue(0), y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 150, damping: 24 });
  const rotateY = useSpring(y, { stiffness: 150, damping: 24 });
  const onReady = useCallback(() => setReady(true), []);
  const onUnavailable = useCallback(() => { setFailed(true); setReady(false); }, []);
  const onDisplay = useCallback((value: string) => setDisplayed(value), []);
  useEffect(() => { if (!enabled || reduced) { setReady(false); firstImage.current = null; } }, [enabled, reduced]);
  if (enabled && firstImage.current === null) firstImage.current = poster ?? exhibit.image;
  useEffect(() => {
    if (!visible || (enabled && !reduced && !failed)) return;
    let cancelled = false;
    const next = new Image();
    next.onload = () => { if (!cancelled) setPoster(image); };
    next.onerror = () => { if (!cancelled) { setFailed(true); setReady(false); } };
    next.src = image;
    return () => { cancelled = true; next.onload = null; next.onerror = null; };
  }, [image, visible, enabled, reduced, failed]);
  useEffect(() => { if (reduced || expanded) { x.set(0); y.set(0); } }, [reduced, expanded, x, y]);
  return <motion.div className="career-artwork" layoutId={`career-artwork-${exhibit.id}`} transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}>
    <div className="career-image-surface" role="group" aria-label={`Artwork preview for ${exhibit.company}`}
      onPointerEnter={event => { if (event.pointerType === 'mouse') onIntent(); }}
      onPointerMove={event => {
        if (event.pointerType !== 'mouse' || reduced) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        origin.current = { x: (event.clientX - bounds.left) / bounds.width, y: 1 - (event.clientY - bounds.top) / bounds.height };
        x.set((origin.current.y - 0.5) * 5.6); y.set((origin.current.x - 0.5) * 5.6);
      }} onPointerLeave={() => { x.set(0); y.set(0); }}>
      <motion.div className="career-image-plane" style={{ rotateX, rotateY, transformPerspective: 1100 }}
        data-shader={failed ? 'fallback' : ready ? 'ready' : 'poster'} data-displayed-artwork={ready ? displayed : poster ?? ''}>
        <AnimatePresence initial={false}>
          {poster && <motion.img key={poster} src={poster} alt={engineering ? exhibit.engineering : exhibit.artifact} width={1120} height={840}
            initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.35 }} />}
        </AnimatePresence>
        {enabled && !reduced && !failed && <div className="career-liquid" aria-hidden="true" style={{ opacity: ready ? 1 : 0 }}>
          <PreviewBoundary onUnavailable={onUnavailable}><Suspense fallback={null}>
            <GooeyImageTransition image={image} initialImage={firstImage.current ?? exhibit.image} origin={origin} active={visible && !expanded} onReady={onReady} onUnavailable={onUnavailable} onDisplay={onDisplay} />
          </Suspense></PreviewBoundary>
        </div>}
      </motion.div>
      <span className="career-image-corner" aria-hidden="true"><ScanLine size={16} />{(ready ? displayed : poster) !== image ? 'TRANSITIONING VIEW…' : engineering ? 'SYSTEM VIEW · CHOOSE ARTWORK ABOVE' : 'ARTWORK VIEW · CHOOSE SYSTEM VIEW ABOVE'}</span>
    </div>
  </motion.div>;
}
