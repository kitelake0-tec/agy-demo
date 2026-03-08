# AI Book Scanner PWA

A high-performance, offline-capable Book Scanner PWA running entirely in the browser.

## Features
- **PWA**: Installable, works offline (Service Worker).
- **WebAssembly Computer Vision**: Uses `opencv.js` in a Web Worker for real-time edge detection and perspective warping.
- **Auto-Capture**: Detects documents and handles capturing.
- **Adaptive Thresholding**: Clean, scanned document look.
- **PDF Export**: Generate PDFs from scanned images client-side.
- **Privacy First**: All processing happens on your device. No images are uploaded to any server.

## Tech Stack
- React + Vite + TypeScript
- Web Worker + OpenCV.js (WASM)
- IndexedDB + idb
- Tailwind CSS
- jsPDF

## Development

1. Install dependencies:
   ```bash
   cd ai-book-scanner-web
   npm install
   ```
2. Download OpenCV.js (done automatically or manually place in `public/opencv.js`).
3. Run dev server:
   ```bash
   npm run dev
   ```

## Deployment
Push to `main`. GitHub Actions will build and deploy to GitHub Pages.
