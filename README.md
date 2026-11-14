# Wisa — A Living Notch for Windows

<p align="center">
  <a href="https://rajibjugi02-ctrl.github.io/Wisa/">
    <img src="https://img.shields.io/badge/%F0%9F%8C%90%20Open%20Wisa%20Official%20Website%20%26%20Download-https%3A%2F%2Frajibjugi02--ctrl.github.io%2FWisa%2F-0A84FF?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Open Official Website" />
  </a>
</p>

<p align="center">
  <a href="https://rajibjugi02-ctrl.github.io/Wisa/"><strong>🌐 https://rajibjugi02-ctrl.github.io/Wisa/</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Windows-10%20%7C%2011%20(64--bit)-0078D6?style=for-the-badge&logo=windows&logoColor=white" alt="Windows Support" />
  <img src="https://img.shields.io/badge/Built%20With-Rust%20%2B%20Tauri%20v2-orange?style=for-the-badge&logo=rust&logoColor=white" alt="Rust Tauri" />
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Tailwind-38bdf8?style=for-the-badge&logo=react&logoColor=white" alt="React Tailwind" />
  <img src="https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge" alt="MIT License" />
</p>

<p align="center">
  <strong>The fluid, tactile island for Windows desktop.</strong><br />
  Music controls, synced lyrics from LRCLIB, focus timer, prayer schedule, smart notifications, and live AI streaming — tucked neatly at the top of your screen.
</p>

<p align="center">
  <a href="https://rajibjugi02-ctrl.github.io/Wisa/"><strong>Explore Live Showcase Website »</strong></a>
  <br />
  <a href="https://github.com/rajibjugi02-ctrl/Wisa/releases/latest">Download Latest Release</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#installation-guide">Installation</a> •
  <a href="#building-from-source">Build from Source</a>
</p>

---

## 🌟 Overview

**Wisa** is a lightweight, responsive desktop island designed specifically for Windows 10 and Windows 11. Built natively with **Rust** and **Tauri v2**, Wisa consumes less than **30 MB of memory** and **0% CPU** when idle.

It rests subtly at the top center of your display. Hover to expand full music player controls with dynamic cover art glow, read synchronized lyrics line by line, launch 25-minute Pomodoro sessions, review daily tasks, check prayer times, or ask questions to Google Gemini and ChatGPT.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| 🎵 **Music & Media Detection** | Connects to Windows System Media Transport Controls (SMTC) to control Spotify, Apple Music, YouTube in browsers, Tidal, and VLC. |
| 🎤 **Synced Lyrics** | Line-by-line synchronized lyrics powered by the LRCLIB API. The notch width flexes dynamically to fit each sung line. |
| 🌈 **Dynamic Cover Glow** | Bottom-up ambient fluid glow dynamically sampled in real-time from the colors of your active album artwork. |
| ⏱️ **Focus Timer & Pomodoro** | 25-minute circular timer ring with configurable break intervals and gentle audio chimes. |
| 🤖 **Built-in AI Assistant** | Real-time token streaming from Google Gemini (2.5 Flash / 1.5 Pro) and OpenAI (GPT-4o) directly from the notch. |
| 🕌 **Prayer Schedule & Sun Arc** | Timetable with Indonesian Kemenag calculation, fine-tune shift adjustments, and a celestial sun trajectory curve. |
| 📥 **File Shelf & Dropzone** | Quick drag-and-drop staging area at the top of the screen for images, code snippets, and assets. |
| 📋 **Clipboard History** | Browse recently copied text and images with instant one-click copying. |
| 🔔 **Smart Notifications** | Priority pop-down alerts that smoothly glide beneath the notch without stealing window focus. |
| ⚡ **Battery & Charging HUD** | Real-time battery percentage and charging wattage indicator upon plugging in your charger. |

---

## ⚡ Performance Benchmarks

Unlike heavy Electron-based desktop widgets, Wisa is engineered with native performance in mind:

- **~30 MB** typical memory footprint (under 20 MB during idle resting)
- **0.0% CPU** consumption when stationary (event-driven hooks, zero polling loops)
- **0% GPU** usage when idle (frames render only during active 60fps spring transitions)
- **~5 MB** lightweight download package

---

## 🚀 Installation Guide

### Option 1: Installer (Recommended)
1. Download `WisaSetup-1.2.0.exe` from [GitHub Releases](https://github.com/rajibjugi02-ctrl/Wisa/releases/latest).
2. Run the installer. If Windows SmartScreen appears, click **More info** then **Run anyway**.
3. Wisa will appear pinned at the top center of your screen.

### Option 2: Portable ZIP
1. Download `Wisa-portable-1.2.0.zip` from [GitHub Releases](https://github.com/rajibjugi02-ctrl/Wisa/releases).
2. Extract anywhere and launch `Wisa.exe`.

---

## 🛠️ Building from Source

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later)
- [Rust](https://rustup.rs/) (stable toolchain)
- Visual Studio C++ Build Tools (for Windows desktop builds)

### Steps
```bash
# 1. Clone the repository
git clone https://github.com/rajibjugi02-ctrl/Wisa.git
cd Wisa

# 2. Install frontend dependencies
npm install

# 3. Start local development server (Web Mode)
npm run dev

# 4. Start native desktop app with Tauri
npm run tauri dev

# 5. Build production bundle
npm run build
npm run tauri build
```

---

## 🔒 Privacy Commitment

- **100% Local**: All settings, to-do lists, staged shelf files, and AI API keys are stored on your local machine.
- **Zero Telemetry**: No tracking, analytics, or background telemetry.
- **No Account Required**: Ready to use immediately upon launch.

---

## 👤 Author

Crafted with care by **Rajib** ([@rajibjugi02-ctrl](https://github.com/rajibjugi02-ctrl)).

Lyrics provided by the [LRCLIB](https://lrclib.net/) community database.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

