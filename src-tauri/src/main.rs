#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod notifications;
mod smtc;
mod window_manager;

use tauri::{AppHandle, command};
use tauri::menu::{Menu, MenuItem};
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};

#[command]
async fn exit_app() -> Result<(), String> {
    std::process::exit(0);
}

#[command]
async fn set_notch_size(app: AppHandle, width: u32, height: u32) -> Result<(), String> {
    window_manager::resize_notch_window(&app, width, height)
}

#[command]
async fn open_settings_window(app: AppHandle) -> Result<(), String> {
    window_manager::show_settings_window(&app)
}

#[command]
async fn get_media_state() -> Result<smtc::MediaTrackInfo, String> {
    smtc::get_current_media_session().await
}

#[command]
async fn send_media_command(action: String) -> Result<(), String> {
    smtc::execute_media_command(&action).await
}

#[command]
async fn media_play_pause() -> Result<(), String> {
    smtc::execute_media_command("toggle").await
}

#[command]
async fn media_next() -> Result<(), String> {
    smtc::execute_media_command("next").await
}

#[command]
async fn media_prev() -> Result<(), String> {
    smtc::execute_media_command("previous").await
}

#[command]
async fn poll_notifications() -> Result<Vec<notifications::InterceptedNotification>, String> {
    notifications::fetch_latest_notifications().await
}

#[command]
async fn get_autostart_status() -> Result<bool, String> {
    #[cfg(windows)]
    {
        use std::process::Command;
        let output = Command::new("reg")
            .args(["query", "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run", "/v", "WisaSmartNotch"])
            .output();
        match output {
            Ok(out) => Ok(out.status.success()),
            Err(_) => Ok(false),
        }
    }
    #[cfg(not(windows))]
    Ok(false)
}

#[command]
async fn set_autostart_status(enable: bool) -> Result<bool, String> {
    #[cfg(windows)]
    {
        use std::process::Command;
        if enable {
            let exe_path = std::env::current_exe().map_err(|e| e.to_string())?;
            let exe_str = exe_path.to_str().ok_or_else(|| "Invalid executable path".to_string())?;

            let status = Command::new("reg")
                .args([
                    "add",
                    "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run",
                    "/v",
                    "WisaSmartNotch",
                    "/t",
                    "REG_SZ",
                    "/d",
                    exe_str,
                    "/f",
                ])
                .status()
                .map_err(|e| e.to_string())?;
            Ok(status.success())
        } else {
            let _ = Command::new("reg")
                .args([
                    "delete",
                    "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run",
                    "/v",
                    "WisaSmartNotch",
                    "/f",
                ])
                .status();
            Ok(false)
        }
    }
    #[cfg(not(windows))]
    Ok(enable)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            let _ = window_manager::show_settings_window(app);
        }))
        .setup(|app| {
            let settings_item = MenuItem::with_id(app, "settings", "Open Wisa Settings", true, None::<&str>)?;
            let toggle_item = MenuItem::with_id(app, "toggle_notch", "Toggle Minimalist Mode", true, None::<&str>)?;
            let restart_item = MenuItem::with_id(app, "restart", "Restart Wisa", true, None::<&str>)?;
            let quit_item = MenuItem::with_id(app, "quit", "Quit Wisa", true, None::<&str>)?;

            let menu = Menu::with_items(app, &[&settings_item, &toggle_item, &restart_item, &quit_item])?;

            let _tray = TrayIconBuilder::new()
                .menu(&menu)
                .tooltip("Wisa Smart Notch")
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "quit" => {
                        std::process::exit(0);
                    }
                    "settings" => {
                        let _ = window_manager::show_settings_window(app);
                    }
                    "restart" => {
                        app.restart();
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        let _ = window_manager::show_settings_window(app);
                    }
                })
                .build(app)?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            set_notch_size,
            open_settings_window,
            get_media_state,
            send_media_command,
            media_play_pause,
            media_next,
            media_prev,
            poll_notifications,
            get_autostart_status,
            set_autostart_status,
            exit_app,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
