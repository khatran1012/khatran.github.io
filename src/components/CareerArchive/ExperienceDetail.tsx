import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDownRight, X } from 'lucide-react';
import type { CareerExhibit } from '../../data/careerArchive';

export function ExperienceDetail({ exhibit, image, reduced, onClose }: { exhibit: CareerExhibit | null; image: string; reduced: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [shown, setShown] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    if (!exhibit || !dialog.current) return;
    returnFocus.current = document.activeElement as HTMLElement;
    const previous = document.body.style.overflow;
    dialog.current.showModal();
    document.body.style.overflow = 'hidden';
    setShown(true);
    return () => { document.body.style.overflow = previous; };
  }, [exhibit]);
  useEffect(() => { if (shown) closeButton.current?.focus({ preventScroll: true }); }, [shown]);
  const finish = () => {
    dialog.current?.close();
    onClose();
    returnFocus.current?.focus({ preventScroll: true });
  };
  return createPortal(<dialog ref={dialog} className="career-detail" aria-labelledby="career-detail-title"
    onKeyDown={event => {
      if (event.key !== 'Tab') return;
      const controls = event.currentTarget.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex="0"]');
      const first = controls[0], last = controls[controls.length - 1];
      if ((event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
        event.preventDefault(); (event.shiftKey ? last : first)?.focus();
      }
    }}
    onCancel={event => { event.preventDefault(); setShown(false); }}
    onClick={event => { if (event.target === event.currentTarget) setShown(false); }}>
    <AnimatePresence onExitComplete={finish}>
      {shown && exhibit && <motion.div className="career-detail-inner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.22 }}>
        <div className="career-detail-toolbar"><span>CAREER ARCHIVE / EXPERIENCE {exhibit.number}</span><button ref={closeButton} type="button" onClick={() => setShown(false)} aria-label="Close experience detail"><X size={20} /></button></div>
        <div className="career-detail-grid">
          <motion.div className="career-detail-image" layoutId={`career-artwork-${exhibit.id}`} transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <img src={image} alt={image === exhibit.diagram ? exhibit.engineering : exhibit.artifact} width={1120} height={840} />
            <span>EXHIBIT {exhibit.number} / {exhibit.category}</span>
          </motion.div>
          <motion.div className="career-detail-copy" initial={{ opacity: 0, y: reduced ? 0 : 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : 0.15 }}>
            <p className="career-kicker">{exhibit.period}</p><h2 id="career-detail-title">{exhibit.company}</h2>
            <p className="career-detail-role">{exhibit.role}</p><p className="career-detail-summary">{exhibit.summary}</p>
            <h3><ArrowDownRight size={17} />The work behind the exhibit</h3>
            <ul>{exhibit.responsibilities.map(item => <li key={item}>{item}</li>)}</ul>
            <div className="career-tech" aria-label="Technologies">{exhibit.technologies?.map(item => <span key={item}>{item}</span>)}</div>
          </motion.div>
        </div>
      </motion.div>}
    </AnimatePresence>
  </dialog>, document.body);
}
