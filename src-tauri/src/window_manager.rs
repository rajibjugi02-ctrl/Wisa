use tauri::{AppHandle, Manager, PhysicalPosition, PhysicalSize};

pub fn resize_notch_window(app: &AppHandle, width: u32, height: u32) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        if let Ok(Some(monitor)) = window.current_monitor() {
            let monitor_size = monitor.size();
            let monitor_pos = monitor.position();

            // Center notch horizontally at the top edge of monitor
            let new_x = monitor_pos.x + ((monitor_size.width as i32 - width as i32) / 2);
            let new_y = monitor_pos.y;

            window
                .set_size(PhysicalSize::new(width, height))
                .map_err(|e| e.to_string())?;

            window
                .set_position(PhysicalPosition::new(new_x, new_y))
                .map_err(|e| e.to_string())?;

            return Ok(());
        }
    }
    Err("Window or monitor not found".to_string())
}

pub fn show_settings_window(app: &AppHandle) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("settings") {
        window.show().map_err(|e| e.to_string())?;
        window.set_focus().map_err(|e| e.to_string())?;
        return Ok(());
    }
    Err("Settings window not found".to_string())
}

