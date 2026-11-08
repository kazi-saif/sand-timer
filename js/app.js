import { Timer, formatTime } from './timer.js';
import { renderSand } from './hourglass.js';

const root = document.documentElement;
const settings = document.querySelector('#settings');
const themes = ['dark', 'warm', 'ambient'];
const themeButtons = document.querySelectorAll('[data-theme] button[data-theme], .theme-options button');
const themeColors = { dark: '#20211f', warm: '#f4f0e7', ambient: '#151b1d' };

function applyTheme(theme) {
  root.dataset.theme = themes.includes(theme) ? theme : 'dark';
  themeButtons.forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.theme === root.dataset.theme));
  });
  document.querySelector('meta[name="theme-color"]').content = themeColors[root.dataset.theme];
}

// Storage may be blocked by browser privacy settings; the UI still works.
try {
  applyTheme(localStorage.getItem('sand.theme'));
} catch {
  applyTheme('dark');
  document.querySelector('#save-status').textContent = 'Theme changes are available for this visit.';
}

themeButtons.forEach(button => button.addEventListener('click', () => {
  applyTheme(button.dataset.theme);
  try {
    localStorage.setItem('sand.theme', root.dataset.theme);
    document.querySelector('#save-status').textContent = 'Your theme is saved on this browser.';
  } catch {
    document.querySelector('#save-status').textContent = 'Theme changed. Your browser could not save it.';
  }
}));

document.querySelector('#open-settings').addEventListener('click', () => settings.showModal());
document.querySelector('#close-settings').addEventListener('click', () => settings.close());

const modes = {
  focus: { label: 'A moment for focus', minutes: 25, name: 'Focus' },
  short: { label: 'A little room to breathe', minutes: 5, name: 'Short break' },
  long: { label: 'Step away. Come back refreshed.', minutes: 15, name: 'Long break' },
};
let selectedMode = 'focus';
let pendingMode = null;
let lastState = 'idle';
const timer = new Timer(modes.focus.minutes * 60_000);
const startButton = document.querySelector('#start');
const resetButton = document.querySelector('#reset');
const status = document.querySelector('#timer-status');
const switchDialog = document.querySelector('#switch-mode');
const completionDialog = document.querySelector('#completion');
const timeDisplay = document.querySelector('#time');

function render() {
  const snapshot = timer.tick();
  renderSand(document.querySelector('.hourglass'), snapshot);
  const { state, remainingMs } = snapshot;
  const formatted = formatTime(remainingMs);
  timeDisplay.textContent = formatted;
  const seconds = Math.ceil(remainingMs / 1000);
  timeDisplay.setAttribute('aria-label', `${Math.floor(seconds / 60)} minutes ${seconds % 60} seconds remaining`);
  document.title = state === 'idle' ? 'SAND — Let focus flow' : `${formatted} · ${modes[selectedMode].name} · SAND`;
  startButton.textContent = state === 'running' ? 'Pause' : state === 'paused' ? 'Resume' : state === 'complete' ? 'Start again' : selectedMode === 'focus' ? 'Start focus' : 'Start break';
  resetButton.disabled = state === 'idle';
  document.querySelector('#mode-label').textContent = modes[selectedMode].label;
  if (state !== lastState) {
    status.textContent = {
      idle: 'Ready when you are.', running: 'Your time is yours. Stay with it.',
      paused: 'Paused. Take a breath.', complete: 'Session complete. A little progress, made.',
    }[state];
    if (state === 'complete') {
      document.querySelector('#completion-copy').textContent = `${modes[selectedMode].name} session finished. Choose your next moment when you are ready.`;
      if (!completionDialog.open) completionDialog.showModal();
    }
    lastState = state;
  }
  document.querySelector('#glass-description').textContent = `Hourglass showing session progress. ${state === 'running' ? 'Session in progress.' : state === 'paused' ? 'Session paused.' : state === 'complete' ? 'Session complete.' : 'Ready to begin.'}`;
}

function changeMode(mode) {
  selectedMode = mode;
  timer.reset(modes[mode].minutes * 60_000);
  document.querySelectorAll('[data-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === mode)));
  status.textContent = 'Ready when you are.';
  render();
}

startButton.addEventListener('click', () => {
  timer.tick();
  if (timer.state === 'running') timer.pause();
  else {
    if (timer.state === 'complete') timer.reset();
    timer.start();
  }
  render();
});
resetButton.addEventListener('click', () => { timer.reset(); render(); });
document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
  render();
  if (button.dataset.mode === selectedMode || completionDialog.open) return;
  if (timer.state === 'running' || timer.state === 'paused') {
    pendingMode = button.dataset.mode;
    document.querySelector('#switch-copy').textContent = `Switch to ${modes[pendingMode].name.toLowerCase()}? Your current session will be discarded.`;
    switchDialog.showModal();
  } else changeMode(button.dataset.mode);
}));
document.querySelector('#keep-session').addEventListener('click', () => switchDialog.close());
document.querySelector('#confirm-switch').addEventListener('click', () => {
  const nextMode = pendingMode;
  switchDialog.close();
  if (nextMode) changeMode(nextMode);
});
switchDialog.addEventListener('close', () => { pendingMode = null; });
document.querySelector('#dismiss-completion').addEventListener('click', () => completionDialog.close());
// A background tab may delay this callback; the deadline still controls time.
setInterval(render, 250);
document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });
window.addEventListener('pageshow', render);
render();
