import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { LayoutGroup, motion } from 'framer-motion';
import { ArrowRight, Check, CircleDot, Eye } from 'lucide-react';
import { CAREER_ARCHIVE } from '../../data/careerArchive';
import { CareerPreview } from './CareerPreview';
import { ExperienceDetail } from './ExperienceDetail';
import './career-archive.css';

export function CareerArchive() {
  const section = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const [selected, setSelected] = useState(0);
  const [previewed, setPreviewed] = useState<number | null>(null);
  const [view, setView] = useState<'artifact' | 'engineering'>('artifact');
  const [enabled, setEnabled] = useState(false);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const [finePointer, setFinePointer] = useState(() => matchMedia('(hover: hover) and (pointer: fine)').matches);
  const [detail, setDetail] = useState<number | null>(null);
  const [detailImage, setDetailImage] = useState('');
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const currentIndex = previewed ?? selected;
  const exhibit = CAREER_ARCHIVE[currentIndex];
  const engineering = view === 'engineering';
  const group = useId();
  useEffect(() => {
    const pointer = matchMedia('(hover: hover) and (pointer: fine)');
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReduced(preference.matches);
    const updatePointer = () => { setFinePointer(pointer.matches); setPreviewed(null); };
    const updateVisibility = () => setHidden(document.hidden);
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setNear(true); }, { rootMargin: '160px' });
    const viewport = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (section.current) { observer.observe(section.current); viewport.observe(section.current); }
    if (window.location.hash === '#career-archive') section.current?.scrollIntoView({ behavior: 'instant' });
    pointer.addEventListener('change', updatePointer);
    preference.addEventListener('change', updatePreference);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => { observer.disconnect(); viewport.disconnect(); pointer.removeEventListener('change', updatePointer); preference.removeEventListener('change', updatePreference); document.removeEventListener('visibilitychange', updateVisibility); };
  }, []);
  const intent = useCallback(() => { if (finePointer && !reduced) setEnabled(true); }, [finePointer, reduced]);
  useEffect(() => {
    const button = buttons.current[currentIndex];
    const list = button?.closest('ol');
    if (!button || !list || list.scrollWidth <= list.clientWidth) return;
    const left = button.getBoundingClientRect().left - list.getBoundingClientRect().left + list.scrollLeft;
    list.scrollTo({ left: Math.max(0, left - (list.clientWidth - button.clientWidth) / 2), behavior: reduced ? 'instant' : 'smooth' });
  }, [currentIndex, reduced]);
  const preview = (index: number) => { setPreviewed(index); intent(); };
  const choose = (index: number) => { setSelected(index); setPreviewed(null); };
  const chooseView = (next: 'artifact' | 'engineering') => { setSelected(currentIndex); setPreviewed(null); setView(next); intent(); };
  const open = () => { setSelected(currentIndex); setPreviewed(null); setDetailImage(engineering ? exhibit.diagram : exhibit.image); setDetail(currentIndex); };
  return <LayoutGroup id={group}>
    <div ref={section} id="career-archive" className="career-snapshot career-archive" aria-labelledby="career-archive-title">
      <div className="career-archive-heading"><div><p className="career-kicker"><CircleDot size={13} />CHAPTER 01 / CAREER ARCHIVE</p><h2 id="career-archive-title">Selected <span>experience.</span></h2></div><p>2016 — Present<span>Five chapters. A growing practice.</span></p></div>
      <div className="career-archive-body" onPointerLeave={() => setPreviewed(null)}
        onBlur={event => { if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) setPreviewed(null); }}>
        <div className="career-company-picker"><p className="career-control-hint">01 / {finePointer ? 'Hover to preview · Click to select' : 'Tap to select a company'}</p>
        <ol className="career-list" aria-label="Select a company">
          {CAREER_ARCHIVE.map((item, index) => <motion.li key={item.id} initial={reduced ? false : { opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: index * 0.045 }}>
            <button ref={element => { buttons.current[index] = element; }} type="button" aria-pressed={selected === index} data-previewed={currentIndex === index}
              onPointerEnter={event => { if (event.pointerType === 'mouse') preview(index); }}
              onFocus={event => { if (event.currentTarget.matches(':focus-visible')) preview(index); }}
              onClick={() => choose(index)}
              onKeyDown={event => {
                let next = index;
                if (event.key === 'ArrowDown') next = Math.min(4, index + 1);
                else if (event.key === 'ArrowUp') next = Math.max(0, index - 1);
                else if (event.key === 'Home') next = 0;
                else if (event.key === 'End') next = 4;
                else return;
                event.preventDefault(); preview(next); buttons.current[next]?.focus({ preventScroll: true });
              }}>
              <span className="career-number">{item.number}</span><span className="career-list-copy"><strong>{item.company}</strong><span className="career-list-period">{item.period}{item.isCurrent && <i>Current</i>}</span><span className="career-list-role">{item.role}</span></span>
              <span className="career-row-state">{selected === index ? <><Check size={15} /><small>Selected</small></> : currentIndex === index ? <><Eye size={15} /><small>Preview</small></> : <ArrowRight size={15} />}</span>
            </button>
          </motion.li>)}
        </ol></div>
        <div className="career-exhibit">
          <div className="career-exhibit-bar"><span>{currentIndex === selected ? 'SELECTED' : 'PREVIEW'} / {exhibit.number}</span><div aria-label="Artwork view"><button type="button" aria-pressed={!engineering} onClick={() => chooseView('artifact')}>Artwork</button><button type="button" aria-pressed={engineering} onClick={() => chooseView('engineering')}>System view</button></div></div>
          <CareerPreview exhibit={exhibit} engineering={engineering} enabled={enabled && finePointer} visible={near && !hidden} expanded={detail !== null || !visible} reduced={reduced} onIntent={intent} />
          <div className="career-exhibit-copy" aria-live="polite">{CAREER_ARCHIVE.map((item, index) => <div key={item.id} className="career-readout" aria-hidden={index !== currentIndex}>
            <p className="career-current-company">{item.company}</p><p className="career-kicker">{item.category}</p><h3>{item.title}</h3>
            <div className="career-description-pair"><p aria-hidden={engineering}>{item.summary}</p><p aria-hidden={!engineering}>{item.engineering}</p></div>
            <div className="career-focus">{item.focus.map(focus => <span key={focus}>{focus}</span>)}</div>
          </div>)}</div>
          <button type="button" className="career-explore" onClick={open} aria-haspopup="dialog">Read experience<span aria-hidden="true">Open detail<ArrowRight size={17} /></span></button>
        </div>
      </div>
      <div className="career-archive-footer"><span>LIQUID ENGINEERING GALLERY</span><p>Select a company → Choose a view → Read experience</p></div>
    </div>
    <ExperienceDetail exhibit={detail === null ? null : CAREER_ARCHIVE[detail]} image={detailImage} reduced={reduced} onClose={() => setDetail(null)} />
  </LayoutGroup>;
}
