const TRACES = ['M0 220H210L285 295H470L540 365H780L910 235H1200', 'M0 440H185L280 345H450L540 255H815L940 380H1200', 'M80 0V145L255 320V590L145 700', 'M1120 0V160L945 335V560L1060 700'];

export function NanoCircuitBackdrop() {
  return <div className="cyber-nano-space" aria-hidden="true">
    <picture>
      <source type="image/avif" srcSet="./nano-circuit-substrate-1600.avif 1600w, ./nano-circuit-substrate-2400.avif 2400w" sizes="(min-width: 1600px) 1900px, (min-width: 1024px) 130vw, 220vw" />
      <source type="image/webp" srcSet="./nano-circuit-substrate-1600.webp 1600w, ./nano-circuit-substrate-2400.webp 2400w" sizes="(min-width: 1600px) 1900px, (min-width: 1024px) 130vw, 220vw" />
      <img className="cyber-nano-layer" src="./nano-circuit-substrate-1600.webp" width="1200" height="700" alt="" decoding="async" fetchPriority="low" />
    </picture>
    <svg className="cyber-nano-signals" viewBox="0 0 1200 700" fill="none">
      {TRACES.map((d, index) => <g key={d} className={`cyber-nano-led led-${index % 3} cyber-nano-packet`} style={{ offsetPath: `path("${d}")` }}>
        <circle r="7" fill="currentColor" stroke="none" opacity="0.15" />
        <circle r="2" fill="#e7fff6" stroke="currentColor" strokeWidth="1" />
      </g>)}
    </svg>
  </div>;
}
