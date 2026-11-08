// This first stage manages presentation only. Timer behavior comes next.
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
  focus: { time: '25:00', label: 'A moment for focus', minutes: 25 },
  short: { time: '05:00', label: 'A little room to breathe', minutes: 5 },
  long: { time: '15:00', label: 'Step away. Come back refreshed.', minutes: 15 },
};
document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
  const mode = modes[button.dataset.mode];
  document.querySelectorAll('[data-mode]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.querySelector('#time').textContent = mode.time;
  document.querySelector('#time').setAttribute('aria-label', `${mode.minutes} minutes`);
  document.querySelector('#mode-label').textContent = mode.label;
  document.querySelector('#start').firstChild.textContent = button.dataset.mode === 'focus' ? 'Start focus ' : 'Start break ';
}));
