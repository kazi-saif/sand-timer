// One progress value drives both chambers; CSS only animates the tiny stream.
export function sandGeometry(progress) {
  const p = Math.max(0, Math.min(1, progress));
  // Square roots keep triangular piles from appearing to lose volume abruptly.
  const upperHeight = 82 * Math.sqrt(1 - p);
  const surface = 148 - upperHeight;
  const curve = Math.min(8, upperHeight * 0.15);
  const pileTop = 271 - 106 * Math.sqrt(p);
  return {
    upper: `M30 ${surface} Q100 ${surface + curve} 170 ${surface} L104 148 H96 Z`,
    lower: `M35 271 Q67 ${271 - (271 - pileTop) * 0.32} 100 ${pileTop} Q133 ${271 - (271 - pileTop) * 0.32} 165 271 Z`,
    streamEnd: pileTop,
    upperVisible: p < 1,
    lowerVisible: p > 0,
  };
}

export function renderSand(svg, { remainingMs, durationMs, state }) {
  const progress = 1 - remainingMs / durationMs;
  const geometry = sandGeometry(progress);
  const upper = svg.querySelector('#upper-sand');
  const lower = svg.querySelector('#lower-sand');
  upper.setAttribute('d', geometry.upper);
  lower.setAttribute('d', geometry.lower);
  upper.style.visibility = geometry.upperVisible ? 'visible' : 'hidden';
  lower.style.visibility = geometry.lowerVisible ? 'visible' : 'hidden';
  svg.querySelector('#sand-stream').setAttribute('y2', geometry.streamEnd);
  svg.dataset.state = state;
}
