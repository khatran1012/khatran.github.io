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
}

export function CareerPreview({ exhibit, engineering, enabled, visible, expanded, reduced }: PreviewProps) {
  const [small, setSmall] = useState(() => matchMedia('(max-width: 600px)').matches);
  const image = engineering ? exhibit.diagram : small ? exhibit.thumbnail : exhibit.image;
  const target = useRef(image);
  target.current = image;
  const origin = useRef({ x: 0.5, y: 0.5 });
  const firstImage = useRef<string | null>(null);
  const [poster, setPoster] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [displayed, setDisplayed] = useState('');
  const displayedImage = useRef('');
  const x = useMotionValue(0), y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 150, damping: 24 });
  const rotateY = useSpring(y, { stiffness: 150, damping: 24 });
  const onReady = useCallback(() => { if (displayedImage.current === target.current) setReady(true); }, []);
  const onUnavailable = useCallback(() => { setFailed(true); setReady(false); }, []);
  const onDisplay = useCallback((value: string) => { displayedImage.current = value; setDisplayed(value); if (value === target.current) setReady(true); }, []);
  useEffect(() => {
    const query = matchMedia('(max-width: 600px)');
    const update = () => setSmall(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  useEffect(() => { if (!enabled || reduced) { setReady(false); firstImage.current = null; } }, [enabled, reduced]);
  if (enabled && firstImage.current === null) firstImage.current = poster ?? image;
  useEffect(() => {
    if (!visible || (ready && enabled && !reduced && !failed)) return;
    let cancelled = false;
    const next = new Image();
    next.decoding = 'async';
    next.onload = () => { next.decode().then(() => { if (!cancelled) setPoster(image); }).catch(() => { if (!cancelled) setPoster(image); }); };
    next.onerror = () => { if (!cancelled) { setFailed(true); setReady(false); } };
    next.src = image;
    return () => { cancelled = true; next.onload = null; next.onerror = null; };
  }, [image, visible, enabled, reduced, failed, ready]);
  useEffect(() => { if (reduced || expanded) { x.set(0); y.set(0); } }, [reduced, expanded, x, y]);
  return <motion.div className="career-artwork" layoutId={`career-artwork-${exhibit.id}`} transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}>
    <div className="career-image-surface" role="group" aria-label={`Artwork preview for ${exhibit.company}`}
      onPointerMove={event => {
        if (event.pointerType !== 'mouse' || reduced) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        origin.current = { x: (event.clientX - bounds.left) / bounds.width, y: 1 - (event.clientY - bounds.top) / bounds.height };
        x.set((origin.current.y - 0.5) * 5.6); y.set((origin.current.x - 0.5) * 5.6);
      }} onPointerLeave={() => { x.set(0); y.set(0); }}>
      <motion.div className="career-image-plane" style={{ rotateX, rotateY, transformPerspective: 1100 }}
        data-shader={failed ? 'fallback' : ready ? 'ready' : 'poster'} data-displayed-artwork={ready ? displayed : poster ?? ''}>
        <AnimatePresence initial={false}>
          {poster && <motion.img key={poster} src={poster} alt={engineering ? exhibit.engineering : exhibit.artifact} width={1120} height={840} decoding="async"
            initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.35 }} />}
        </AnimatePresence>
        {enabled && !reduced && !failed && <div className="career-liquid" aria-hidden="true" style={{ opacity: ready ? 1 : 0 }}>
          <PreviewBoundary onUnavailable={onUnavailable}><Suspense fallback={null}>
            <GooeyImageTransition image={image} initialImage={firstImage.current ?? exhibit.image} origin={origin} active={visible && !expanded} onReady={onReady} onUnavailable={onUnavailable} onDisplay={onDisplay} />
          </Suspense></PreviewBoundary>
        </div>}
        {!engineering && (ready ? displayed : poster) === image && <svg className="career-artwork-leds" viewBox="0 0 1120 840" aria-hidden="true" focusable="false">
          {exhibit.lightPaths.map((path, index) => <g key={path} className={`career-light-path career-light-${index}`}><path d={path} pathLength="100" className="career-light-track" /><path d={path} pathLength="100" className="career-light-packet" /></g>)}
        </svg>}
      </motion.div>
      <span className="career-image-corner" aria-hidden="true"><ScanLine size={16} />{(ready ? displayed : poster) !== image ? 'TRANSITIONING…' : engineering ? 'SYSTEM VIEW' : reduced ? 'ARTWORK · LED TRACES' : 'ARTWORK · LIVE SIGNALS'}</span>
    </div>
  </motion.div>;
}
