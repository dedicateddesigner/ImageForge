# ImageForge Architecture

> Technical architecture and development guidelines for ImageForge.

---

## 1. Project Overview

ImageForge is a local-first desktop image conversion and optimization application.

The application is designed to process images locally without requiring a backend for normal image conversion workflows.

### Primary goals

- Fast batch image processing
- Local image processing
- Low memory overhead
- Modern image formats
- Simple user interface
- Desktop-first workflow
- Cross-platform architecture
- Maintainable React + TypeScript codebase

---

# 2. Technology Stack

## Frontend

- React
- TypeScript
- Vite
- SCSS

## Desktop

- Tauri 2
- Rust backend/runtime

## Image Processing

- Web Workers
- WebAssembly
- `@jsquash/webp`
- `@jsquash/avif`

## File Handling

- Browser File APIs
- Tauri filesystem capabilities where required
- JSZip for ZIP generation

## Development

- Node.js
- npm
- TypeScript
- Git
- GitHub

---

# 3. High-Level Architecture

```text
                    ┌──────────────────────┐
                    │      ImageForge      │
                    │       Desktop        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     React UI         │
                    │                      │
                    │  Components          │
                    │  State               │
                    │  User interaction    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Application Services │
                    │                      │
                    │ File utilities       │
                    │ Conversion service   │
                    │ ZIP export           │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     Web Workers      │
                    │                      │
                    │ Image conversion     │
                    │ WASM codecs          │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Local Browser /   │
                    │    Tauri Runtime     │
                    │                      │
                    │ Files / Blobs / URLs │
                    └──────────────────────┘
```
