use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InterceptedNotification {
    pub id: String,
    pub app_name: String,
    pub title: String,
    pub body: String,
    pub timestamp_ms: u64,
}

#[cfg(windows)]
pub async fn fetch_latest_notifications() -> Result<Vec<InterceptedNotification>, String> {
    use windows::UI::Notifications::Management::{UserNotificationListener, UserNotificationListenerAccessStatus};

    let listener = UserNotificationListener::Current().map_err(|e| e.to_string())?;
    let status = listener.RequestAccessAsync().map_err(|e| e.to_string())?.await.map_err(|e| e.to_string())?;

    if status != UserNotificationListenerAccessStatus::Allowed {
        return Ok(vec![]);
    }

    let notifications = listener
        .GetNotificationsAsync(windows::UI::Notifications::NotificationKinds::Toast)
        .map_err(|e| e.to_string())?
        .await
        .map_err(|e| e.to_string())?;

    let mut result = Vec::new();
    for notification in notifications {
        if let Ok(app_info) = notification.AppInfo() {
            let app_name = app_info.DisplayInfo().and_then(|d| d.DisplayName()).map(|s| s.to_string()).unwrap_or_else(|_| "App".to_string());
            let notif_id = notification.Id().map(|id| id.to_string()).unwrap_or_default();

            // Extract bindings from visual toast content
            if let Ok(toast) = notification.Notification() {
                if let Ok(visual) = toast.Visual() {
                    let mut text_lines = Vec::new();
                    if let Ok(bindings) = visual.Bindings() {
                        for binding in bindings {
                            if let Ok(elements) = binding.GetTextElements() {
                                for element in elements {
                                    if let Ok(text) = element.Text() {
                                        text_lines.push(text.to_string());
                                    }
                                }
                            }
                        }
                    }

                    let title = text_lines.first().cloned().unwrap_or_else(|| "New Alert".to_string());
                    let body = if text_lines.len() > 1 {
                        text_lines[1..].join(" ")
                    } else {
                        String::new()
                    };

                    result.push(InterceptedNotification {
                        id: notif_id,
                        app_name,
                        title,
                        body,
                        timestamp_ms: chrono_or_fallback_time(),
                    });
                }
            }
        }
    }

    Ok(result)
}

#[cfg(not(windows))]
pub async fn fetch_latest_notifications() -> Result<Vec<InterceptedNotification>, String> {
    Ok(vec![])
}

fn chrono_or_fallback_time() -> u64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_millis() as u64)
        .unwrap_or(0)
}

