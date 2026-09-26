# ImageForge

ImageForge is a local-first bulk image converter and optimizer built
with React, TypeScript, Vite, SCSS, Web Workers, WebAssembly, and Tauri
2.

It is designed to provide a fast, privacy-friendly workflow for
converting and optimizing images without uploading them to a server.

## Features

### Image conversion

-   Convert images to **WebP**
-   Convert images to **AVIF**
-   Adjustable output quality
-   Batch conversion
-   Local image processing

### Resize

-   Resize by percentage
-   Resize by target width
-   Resize by target height
-   Maintain aspect ratio

### Image queue

-   Drag-and-drop image selection
-   Add multiple images
-   Duplicate file detection
-   Responsive masonry layout
-   Natural image aspect ratios
-   Remove individual images
-   Original and converted dimensions

### Compression results

-   Original file size
-   Converted file size
-   Total saved size
-   Overall percentage reduction
-   Per-image compression result

### Downloads

-   Individual converted-image downloads
-   Download completed conversions as a ZIP file

### Desktop app

-   Native macOS application using **Tauri 2**
-   Same React/Vite frontend as the web app
-   Local processing
-   macOS `.app` and `.dmg` builds

## Privacy

ImageForge is designed around local processing. Images are processed
locally in the browser or desktop application and do not need to be
uploaded to a conversion server.

## Tech Stack

-   React
-   TypeScript
-   Vite
-   SCSS
-   Web Workers
-   WebAssembly
-   @jsquash/webp
-   @jsquash/avif
-   JSZip
-   Tauri 2

## Project Structure

``` text
ImageForge/
├── src/
│   ├── components/
│   │   ├── ConversionControls/
│   │   ├── ConversionSummary/
│   │   ├── Dropzone/
│   │   ├── Header/
│   │   └── ImageQueue/
│   ├── services/
│   │   ├── converter.ts
│   │   ├── file-utils.ts
│   │   ├── resize.ts
│   │   └── zip.ts
│   ├── styles/
│   │   └── main.scss
│   ├── types/
│   │   └── image.ts
│   ├── workers/
│   │   └── image-converter.worker.ts
│   ├── App.tsx
│   └── main.tsx
├── src-tauri/
│   ├── src/
│   ├── icons/
│   ├── Cargo.toml
│   └── tauri.conf.json
├── public/
├── package.json
├── vite.config.ts
└── README.md
```

## Requirements

### Web development

-   Node.js
-   npm

### macOS desktop development

-   macOS
-   Node.js
-   npm
-   Rust
-   Cargo
-   Xcode Command Line Tools

Install Xcode Command Line Tools:

``` bash
xcode-select --install
```

Install Rust through `rustup` if it is not already installed.

## Installation

Clone the repository:

``` bash
git clone https://github.com/dedicateddesigner/ImageForge.git
cd ImageForge
```

Install dependencies:

``` bash
npm install
```

## Development

Start the web application:

``` bash
npm run dev
```

Build the production web application:

``` bash
npm run build
```

The production files are generated in `dist/`.

## macOS Desktop App

ImageForge uses Tauri 2 for the native macOS application.

Run the desktop app in development:

``` bash
npm run tauri dev
```

Build the macOS `.app`:

``` bash
npm run tauri build -- --bundles app
```

Build the macOS DMG:

``` bash
npm run tauri build -- --bundles dmg
```

The generated bundles are placed under:

``` text
src-tauri/target/release/bundle/
```

## Available Scripts

  Command                                  Purpose
  ---------------------------------------- --------------------------------------------
  `npm run dev`                            Start the Vite development server
  `npm run build`                          Type-check and create the production build
  `npm run lint`                           Run ESLint
  `npm run format`                         Format files with Prettier
  `npm run format:check`                   Check Prettier formatting
  `npm run tauri dev`                      Run the native desktop app
  `npm run tauri build -- --bundles app`   Build the macOS `.app`
  `npm run tauri build -- --bundles dmg`   Build the macOS DMG

## Architecture

``` text
React UI
   │
   ├── Image Queue
   ├── Conversion Controls
   └── Compression Summary
          │
          ▼
   Conversion Service
          │
          ├── Resize
          │
          ▼
      Web Worker
          │
          ├── WebP / WebAssembly
          └── AVIF / WebAssembly
          │
          ▼
      Converted Blob
```

Heavy encoding work runs inside a Web Worker to keep the UI responsive.

## Current Version

**v1.0.0**

The first stable milestone includes:

-   WebP conversion
-   AVIF conversion
-   Quality controls
-   Image resizing
-   Duplicate detection
-   Batch conversion
-   Compression summary
-   Individual downloads
-   ZIP export
-   Responsive masonry queue
-   macOS desktop application

## Roadmap

Potential future improvements:

-   JPEG output
-   Target file-size optimization
-   Metadata controls
-   Conversion presets
-   Before/after comparison
-   Improved worker performance
-   Desktop application icons and metadata
-   macOS code signing and notarization
-   Windows desktop build
-   Cross-platform release workflow

## Project Status

ImageForge v1.0.0 establishes the core conversion pipeline and a usable
macOS desktop application.

The project is actively being developed.
