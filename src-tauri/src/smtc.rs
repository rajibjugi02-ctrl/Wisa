use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MediaTrackInfo {
    pub title: String,
    pub artist: String,
    pub album: String,
    pub is_playing: bool,
    pub position_ms: u64,
    pub duration_ms: u64,
    pub thumbnail_base64: Option<String>,
}

impl Default for MediaTrackInfo {
    fn default() -> Self {
        Self {
            title: "Die With A Smile".to_string(),
            artist: "Lady Gaga & Bruno Mars".to_string(),
            album: "Die With A Smile".to_string(),
            is_playing: true,
            position_ms: 196000,
            duration_ms: 252000,
            thumbnail_base64: None,
        }
    }
}

#[cfg(windows)]
pub async fn get_current_media_session() -> Result<MediaTrackInfo, String> {
    use windows::Media::Control::GlobalSystemMediaTransportControlsSessionManager;

    let manager = GlobalSystemMediaTransportControlsSessionManager::RequestAsync()
        .map_err(|e| e.to_string())?
        .await
        .map_err(|e| e.to_string())?;

    let session = manager.GetCurrentSession().map_err(|e| e.to_string())?;

    let media_properties = session.TryGetMediaPropertiesAsync()
        .map_err(|e| e.to_string())?
        .await
        .map_err(|e| e.to_string())?;

    let timeline = session.GetTimelineProperties().map_err(|e| e.to_string())?;
    let playback_info = session.GetPlaybackInfo().map_err(|e| e.to_string())?;

    let is_playing = playback_info
        .PlaybackStatus()
        .map(|s| s.0 == 4) // 4 corresponds to Playing in SMTC enum
        .unwrap_or(false);

    let position_ms = timeline
        .Position()
        .map(|d| (d.Duration / 10000) as u64)
        .unwrap_or(0);

    let duration_ms = timeline
        .EndTime()
        .map(|d| (d.Duration / 10000) as u64)
        .unwrap_or(0);

    Ok(MediaTrackInfo {
        title: media_properties.Title().map(|h| h.to_string()).unwrap_or_default(),
        artist: media_properties.Artist().map(|h| h.to_string()).unwrap_or_default(),
        album: media_properties.AlbumTitle().map(|h| h.to_string()).unwrap_or_default(),
        is_playing,
        position_ms,
        duration_ms,
        thumbnail_base64: None,
    })
}

#[cfg(not(windows))]
pub async fn get_current_media_session() -> Result<MediaTrackInfo, String> {
    Ok(MediaTrackInfo::default())
}

pub async fn execute_media_command(action: &str) -> Result<(), String> {
    #[cfg(windows)]
    {
        use windows::Media::Control::GlobalSystemMediaTransportControlsSessionManager;

        let manager = GlobalSystemMediaTransportControlsSessionManager::RequestAsync()
            .map_err(|e| e.to_string())?
            .await
            .map_err(|e| e.to_string())?;

        let session = manager.GetCurrentSession().map_err(|e| e.to_string())?;

        match action {
            "play" => {
                session.TryPlayAsync().map_err(|e| e.to_string())?.await.ok();
            }
            "pause" => {
                session.TryPauseAsync().map_err(|e| e.to_string())?.await.ok();
            }
            "toggle" => {
                session.TryTogglePlayPauseAsync().map_err(|e| e.to_string())?.await.ok();
            }
            "next" => {
                session.TrySkipNextAsync().map_err(|e| e.to_string())?.await.ok();
            }
            "previous" => {
                session.TrySkipPreviousAsync().map_err(|e| e.to_string())?.await.ok();
            }
            _ => return Err("Invalid media action".to_string()),
        }
    }
    let _ = action;
    Ok(())
}

