// The clock is injected so deadline behavior can be tested without waiting.
export class Timer {
  constructor(durationMs, now = Date.now) {
    this.now = now;
    this.reset(durationMs);
  }

  reset(durationMs = this.durationMs) {
    if (!Number.isFinite(durationMs) || durationMs <= 0) throw new RangeError('Duration must be positive.');
    this.durationMs = durationMs;
    this.remainingMs = durationMs;
    this.endTime = null;
    this.state = 'idle';
    return this.snapshot();
  }

  start() {
    this.tick();
    if (this.state !== 'idle' && this.state !== 'paused') return this.snapshot();
    this.endTime = this.now() + this.remainingMs;
    this.state = 'running';
    return this.snapshot();
  }

  pause() {
    this.tick();
    if (this.state === 'running') {
      this.endTime = null;
      this.state = 'paused';
    }
    return this.snapshot();
  }

  tick() {
    if (this.state === 'running') {
      this.remainingMs = Math.max(0, this.endTime - this.now());
      if (this.remainingMs === 0) {
        this.state = 'complete';
        this.endTime = null;
      }
    }
    return this.snapshot();
  }

  snapshot() {
    return { state: this.state, remainingMs: this.remainingMs, durationMs: this.durationMs };
  }
}

export function formatTime(milliseconds) {
  const seconds = Math.ceil(Math.max(0, milliseconds) / 1000);
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}
