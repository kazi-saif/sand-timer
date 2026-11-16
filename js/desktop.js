const desktop = window.__TAURI__;

export async function scheduleDesktopAlarm(snapshot, label) {
  if (!desktop || snapshot.state === 'complete') return;
  await desktop.core.invoke('schedule_alarm', {
    deadline: snapshot.state === 'running' ? snapshot.endTime : null,
    label,
  });
}

export async function listenForDesktopCompletion(callback) {
  if (!desktop) return;
  await desktop.event.listen('sand-complete', callback);
}

if (desktop) document.documentElement.dataset.desktop = 'true';
