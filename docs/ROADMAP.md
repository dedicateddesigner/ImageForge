# ImageForge Roadmap

> ImageForge is a local-first image conversion and optimization tool for designers, developers, and content creators.

---

## Product Vision

ImageForge aims to become a professional, local-first image preparation toolkit that helps users:

- Convert images between modern formats
- Reduce file size
- Resize images
- Compare original and optimized results
- Process large batches
- Prepare web-ready image assets
- Automate repetitive image workflows

The application should remain:

- Local-first
- Fast
- Lightweight
- Privacy-friendly
- Easy to use
- Useful for both beginners and professionals

---

# Current Release

## v1.2.0 — Interactive Comparison

### Status

Released

### Completed

- React + TypeScript + Vite architecture
- Tauri desktop application
- macOS Apple Silicon build
- Web Worker based conversion pipeline
- WebP conversion
- AVIF conversion
- Quality controls
- Resize by percentage
- Resize by width
- Resize by height
- Batch image conversion
- SHA-256 exact duplicate detection
- Conversion progress and status
- Original and converted dimensions
- Compression statistics
- Individual image download
- ZIP export
- Responsive masonry image queue
- Natural image proportions
- Click image to open comparison
- Before/after comparison modal
- Interactive comparison slider
- Original / Converted labels
- Modal close and outside-click handling
- Large batch testing
- macOS DMG packaging

---

# Release Priorities

## Priority Levels

### P0 — Essential

Core features that significantly improve the product.

### P1 — Important

High-value features that improve workflow and usability.

### P2 — Nice to Have

Useful enhancements that can wait until the core workflow is mature.

### P3 — Experimental

Features that require research, experimentation, or significant architectural changes.

---

# v1.3 — Workflow Improvements

## Goal

Make ImageForge faster and easier to use when processing many images.

### P0

- [ ] Previous / Next navigation inside comparison
- [ ] Reset comparison slider
- [ ] Select all images
- [ ] Deselect all images
- [ ] Remove selected images
- [ ] Clear all images
- [ ] Improve batch summary

### P1

- [ ] Fullscreen comparison
- [ ] Keyboard navigation
- [ ] Better keyboard accessibility
- [ ] Improved conversion error handling
- [ ] Better progress information for large batches

### P2

- [ ] Drag-and-drop reordering
- [ ] Remember comparison position
- [ ] More detailed per-image statistics

---

# v1.4 — Export & File Management

## Goal

Give users better control over where and how converted files are saved.

### P0

- [ ] Choose output folder
- [ ] Open output folder
- [ ] Custom filename suffix
- [ ] Custom filename prefix
- [ ] Preserve original filename
- [ ] Preserve folder structure

### P1

- [ ] Output naming patterns
- [ ] Batch rename
- [ ] Separate output folder for each conversion job
- [ ] Save conversion settings with a job

### P2

- [ ] Export conversion report
- [ ] CSV conversion report
- [ ] Copy output path

---

# v1.5 — Image Optimization

## Goal

Move beyond format conversion and make ImageForge a proper image optimizer.

### P0

- [ ] Smart optimization mode
- [ ] Balanced quality preset
- [ ] Maximum compression preset
- [ ] Maximum quality preset
- [ ] Target file size
- [ ] Automatically adjust quality to target size

### P1

- [ ] Custom quality presets
- [ ] Save user presets
- [ ] Preset management
- [ ] Compare quality settings before conversion

### P2

- [ ] Advanced compression controls
- [ ] Optimization recommendations

---

# v1.6 — Developer & Web Workflow

## Goal

Make ImageForge particularly useful for web designers and developers.

### P0

- [ ] Folder import
- [ ] Process folders recursively
- [ ] Preserve folder structure
- [ ] Generate WebP and AVIF in the same job
- [ ] Generate 1x and 2x assets

### P1

- [ ] Responsive image generation
- [ ] Multiple output widths
- [ ] Generate 480px / 768px / 1024px / 1440px / 1920px variants
- [ ] Generate `srcset` information
- [ ] Generate HTML `<picture>` markup

### P2

- [ ] Website image preset
- [ ] WordPress image preset
- [ ] Shopify image preset
- [ ] Social media presets

---

# v1.7 — Desktop Workflow

## Goal

Make ImageForge feel like a native desktop utility rather than only a conversion application.

### P0

- [ ] Drag folder onto ImageForge
- [ ] Improved native file/folder selection
- [ ] Better macOS file handling

### P1

- [ ] macOS Finder Quick Action
- [ ] Right-click "Convert with ImageForge"
- [ ] Right-click folder "Optimize with ImageForge"
- [ ] Open With ImageForge

### P2

- [ ] Watch folder
- [ ] Automatic conversion when files are added
- [ ] Custom watch-folder presets

### P3

- [ ] Background processing

---

# v1.8 — Metadata & Image Information

## Goal

Provide better control and visibility into image metadata.

### P1

- [ ] Image information panel
- [ ] EXIF information
- [ ] File metadata overview
- [ ] Color space information

### P2

- [ ] Preserve metadata option
- [ ] Remove metadata option
- [ ] Remove GPS metadata
- [ ] Preserve copyright metadata

### P3

- [ ] Metadata editing

---

# v1.9 — Smart Image Management

## Goal

Help users identify redundant or problematic images.

### P1

- [ ] Better duplicate reporting
- [ ] Duplicate groups
- [ ] Duplicate file comparison

### P2

- [ ] Perceptual hashing
- [ ] Visual duplicate detection
- [ ] Similar image detection

### P3

- [ ] Image quality analysis
- [ ] Blur detection
- [ ] Low-resolution warnings
- [ ] Heavy compression warnings

---

# v2.0 — Professional Image Toolkit

## Goal

Turn ImageForge into a complete professional image preparation workflow.

Potential v2.0 capabilities:

- [ ] Advanced batch processing
- [ ] Folder workflows
- [ ] Custom presets
- [ ] Responsive image generation
- [ ] WebP + AVIF generation
- [ ] Metadata management
- [ ] Visual duplicate detection
- [ ] Image quality analysis
- [ ] Job history
- [ ] Conversion history
- [ ] Advanced export workflows
- [ ] macOS integration
- [ ] Windows support
- [ ] Auto-update system

---

# Future Ideas

These features are not currently committed to a release.

- [ ] JPEG XL support
- [ ] PNG optimization
- [ ] GIF optimization
- [ ] TIFF support
- [ ] SVG optimization
- [ ] PDF image extraction
- [ ] Color profile conversion
- [ ] Image sharpening
- [ ] Basic image transformations
- [ ] Crop
- [ ] Rotate
- [ ] Flip
- [ ] Watermarking
- [ ] Background removal
- [ ] AI-assisted image optimization
- [ ] Cloud integrations
- [ ] Project-based workflows

These should only be added if they support the core product direction.

---

# Product Principles

## 1. Local First

Images should be processed locally whenever technically possible.

Users should not need to upload their images to a server for normal conversion workflows.

## 2. Privacy

ImageForge should avoid unnecessary collection or transmission of user images.

## 3. Performance

Large batches should remain usable without excessive memory consumption.

Performance should be tested with:

- 1 image
- 10 images
- 100 images
- 250+ images
- Very large images

## 4. Simplicity

New features should not unnecessarily complicate the main interface.

Advanced functionality should be progressively disclosed.

## 5. No Feature Bloat

A feature should only be added when it provides a meaningful improvement to the image workflow.

## 6. Cross-Platform

The architecture should avoid unnecessary platform-specific assumptions.

Primary targets:

1. macOS
2. Windows
3. Linux — only if demand justifies it

---

# Release Process

Before every release:

## Code Quality

- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] Tauri production build
- [ ] No TypeScript errors
- [ ] No console errors

## Functional Testing

Test:

- [ ] JPG input
- [ ] PNG input
- [ ] WebP input
- [ ] AVIF input
- [ ] WebP output
- [ ] AVIF output
- [ ] Duplicate detection
- [ ] Resize
- [ ] Quality controls
- [ ] ZIP export
- [ ] Individual download
- [ ] Comparison
- [ ] Large batch conversion
- [ ] Portrait images
- [ ] Landscape images
- [ ] Transparent images
- [ ] Already-compressed images
- [ ] Conversion errors

## Desktop Testing

- [ ] Application launches
- [ ] Window resizing
- [ ] Small window
- [ ] Large window
- [ ] DMG installation
- [ ] Application runs after installation
- [ ] Memory usage
- [ ] Large batch stability

## Release

- [ ] Update version
- [ ] Update README
- [ ] Update CHANGELOG / release notes
- [ ] Create Git commit
- [ ] Create Git tag
- [ ] Push tag
- [ ] Build release DMG
- [ ] Test release DMG
- [ ] Create GitHub release
- [ ] Upload release artifacts

---

# Current Development Focus

## Active Release

**v1.3**

## Current Priority

**Workflow improvements**

### Next features to implement

1. Previous / Next comparison navigation
2. Reset comparison
3. Fullscreen comparison
4. Select all / deselect all
5. Remove selected
6. Clear all
7. Improved batch summary

---

# Deferred Features

Do not begin these until the current release priorities are completed:

- AI features
- Cloud uploads
- Visual duplicate detection
- Watch folders
- Metadata editing
- Advanced image analysis
- Windows packaging
- Complex automation

---

# Decision Log

Important architectural and product decisions should be recorded here.

## 2026-09

### Local-first architecture

ImageForge processes images locally and does not require a backend for normal conversion.

### Web Workers

Image conversion is performed through workers to prevent heavy processing from blocking the UI.

### Tauri

Tauri is used for the desktop application to keep the desktop footprint relatively lightweight.

### WebP + AVIF

WebP and AVIF are the initial modern output formats.

### SHA-256 duplicates

Exact duplicate detection uses SHA-256 rather than filename-based matching.

### Masonry queue

The image queue uses a responsive masonry layout to preserve natural image proportions.

### Interactive comparison

Completed images can be clicked to open an interactive before/after comparison.

---

# Feature Decision Rule

Before adding a new feature, ask:

1. Does it solve a real image workflow problem?
2. Does it benefit the target user?
3. Does it fit the local-first philosophy?
4. Does it introduce unnecessary complexity?
5. Can it be implemented without harming existing workflows?
6. Does it belong in the current release?
7. Can it be tested reliably?

If the answer to most of these is no, defer the feature.

---

# Roadmap Status

Last updated: September 2026

Current release: **v1.2.0**

Next planned release: **v1.3.0**

Current focus: **Workflow Improvements**
