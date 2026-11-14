#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod notifications;
mod smtc;
mod window_manager;

use tauri::{AppHandle, command};

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
            .args(["query", "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run", "/v", "NusaSmartNotch"])
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
                    "NusaSmartNotch",
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
                    "NusaSmartNotch",
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
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
