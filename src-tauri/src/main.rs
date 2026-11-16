#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::{atomic::{AtomicU64, Ordering}, Arc};
use std::time::{Duration, SystemTime, UNIX_EPOCH};
use tauri::{Emitter, Manager, State, menu::{Menu, MenuItem}, tray::TrayIconBuilder};
use tauri_plugin_notification::NotificationExt;

#[derive(Default)]
struct Alarm(Arc<AtomicU64>);

// Native scheduling stays active even when WebView callbacks are throttled in the tray.
#[tauri::command]
fn schedule_alarm(app: tauri::AppHandle, alarm: State<'_, Alarm>, deadline: Option<u64>, label: String) {
    let generation = alarm.0.fetch_add(1, Ordering::SeqCst) + 1;
    let guard = alarm.0.clone();
    let Some(deadline) = deadline else { return };
    std::thread::spawn(move || loop {
        if guard.load(Ordering::SeqCst) != generation { return; }
        let now = SystemTime::now().duration_since(UNIX_EPOCH).unwrap_or_default().as_millis() as u64;
        if now >= deadline {
            if guard.compare_exchange(generation, generation + 1, Ordering::SeqCst, Ordering::SeqCst).is_ok() {
                let _ = app.notification().builder().title("SAND · Session complete")
                    .body(format!("{} finished. Your next moment is yours.", label)).show();
                let _ = app.emit("sand-complete", ());
            }
            return;
        }
        std::thread::sleep(Duration::from_millis((deadline - now).min(250)));
    });
}

fn show_main(app: &tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.unminimize();
        let _ = window.set_focus();
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _, _| show_main(app)))
        .plugin(tauri_plugin_notification::init())
        .manage(Alarm::default())
        .invoke_handler(tauri::generate_handler![schedule_alarm])
        .setup(|app| {
            let show = MenuItem::with_id(app, "show", "Open SAND", true, None::<&str>)?;
            let quit = MenuItem::with_id(app, "quit", "Quit SAND", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show, &quit])?;
            TrayIconBuilder::new()
                .icon(app.default_window_icon().expect("bundled app icon").clone())
                .tooltip("SAND Timer · Right-click to open or quit")
                .menu(&menu)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "show" => show_main(app),
                    "quit" => app.exit(0),
                    _ => {}
                })
                .build(app)?;
            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                if window.hide().is_ok() { api.prevent_close(); }
            }
        })
        .run(tauri::generate_context!())
        .expect("SAND could not start");
}
