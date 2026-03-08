/// <reference lib="webworker" />
/* eslint-disable @typescript-eslint/no-explicit-any */
// Define global cv variable for TypeScript
declare const cv: any;

export type WorkerMessage =
    | { type: 'LOAD_CV'; payload?: never }
    | { type: 'PROCESS_FRAME'; payload: { width: number; height: number; data: Uint8ClampedArray } }
    | { type: 'WARP_CROP'; payload: { width: number; height: number; data: Uint8ClampedArray; corners: number[] } };

export type WorkerResponse =
    | { type: 'CV_LOADED'; payload: { loaded: boolean } }
    | { type: 'FRAME_PROCESSED'; payload: { corners: number[] | null } }
    | { type: 'CROP_COMPLETE'; payload: { image: ImageData } };

let cvLoaded = false;

// Load OpenCV.js
// We assume opencv.js is at the root of public folder
try {
    // eslint-disable-next-line no-restricted-globals
    self.importScripts('/opencv.js');

    // Wait for OpenCV to initialize
    // cv.onRuntimeInitialized is the callback from opencv.js
    if (cv && cv.onRuntimeInitialized) {
        cv.onRuntimeInitialized = () => {
            console.log('OpenCV.js Ready in Worker');
            cvLoaded = true;
            postMessage({ type: 'CV_LOADED', payload: { loaded: true } });
        };
    } else {
        // If it was already loaded or doesn't use the callback
        // polling check or immediate
        waitForCv();
    }
} catch (e) {
    console.error('Failed to load OpenCV.js in worker', e);
}

function waitForCv() {
    if (typeof cv !== 'undefined' && cv.Mat) {
        console.log('OpenCV.js Ready (polled)');
        cvLoaded = true;
        postMessage({ type: 'CV_LOADED', payload: { loaded: true } });
    } else {
        setTimeout(waitForCv, 50);
    }
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
    if (!cvLoaded) return;

    const { type, payload } = e.data;

    if (type === 'PROCESS_FRAME') {
        processFrame(payload);
    } else if (type === 'WARP_CROP') {
        warpAndCrop(payload);
    }
};

function warpAndCrop(data: { width: number; height: number; data: Uint8ClampedArray; corners: number[] }) {
    try {
        const { width, height, data: pixelData, corners } = data;
        const src = new cv.Mat(height, width, cv.CV_8UC4);
        src.data.set(pixelData);

        // Source points
        const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, corners);

        // Determine destination size (approximate)
        // Calculate max width/height
        // Simple distance calc
        const side1 = Math.hypot(corners[0] - corners[2], corners[1] - corners[3]);
        const side2 = Math.hypot(corners[2] - corners[4], corners[3] - corners[5]);
        const side3 = Math.hypot(corners[4] - corners[6], corners[5] - corners[7]);
        const side4 = Math.hypot(corners[6] - corners[0], corners[7] - corners[1]);

        const dstWidth = Math.max(side1, side3);
        const dstHeight = Math.max(side2, side4);

        // Dest points
        const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, dstWidth, 0, dstWidth, dstHeight, 0, dstHeight]);

        const M = cv.getPerspectiveTransform(srcTri, dstTri);
        const dst = new cv.Mat();
        cv.warpPerspective(src, dst, M, new cv.Size(dstWidth, dstHeight), cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

        // Adaptive Thresholding logic (Scanned look)
        const gray = new cv.Mat();
        const binary = new cv.Mat();
        cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0);
        // Gaussian Blur to remove noise
        // cv.GaussianBlur(gray, gray, new cv.Size(5, 5), 0);

        // Adaptive Threshold
        cv.adaptiveThreshold(gray, binary, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 11, 2);

        // Convert back to RGBA for canvas display
        const final = new cv.Mat();
        cv.cvtColor(binary, final, cv.COLOR_GRAY2RGBA);

        const imgData = new ImageData(new Uint8ClampedArray(final.data), final.cols, final.rows);

        src.delete(); srcTri.delete(); dstTri.delete(); M.delete(); dst.delete(); gray.delete(); binary.delete(); final.delete();

        postMessage({ type: 'CROP_COMPLETE', payload: { image: imgData } });

    } catch (err) {
        console.error('Warp Error', err);
    }
}

function processFrame(data: { width: number; height: number; data: Uint8ClampedArray }) {
    try {
        const { width, height, data: pixelData } = data;
        const src = new cv.Mat(height, width, cv.CV_8UC4);
        src.data.set(pixelData);

        const gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

        // Resize for faster detection if needed, but we keep it simple for now or downscale
        // Downscale for performance
        const scale = 0.5;
        const small = new cv.Mat();
        cv.resize(gray, small, new cv.Size(0, 0), scale, scale, cv.INTER_AREA);

        cv.GaussianBlur(small, small, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);
        const edges = new cv.Mat();
        cv.Canny(small, edges, 75, 200);

        const contours = new cv.MatVector();
        const hierarchy = new cv.Mat();
        cv.findContours(edges, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

        let maxArea = 0;
        let maxContour = null;

        for (let i = 0; i < contours.size(); ++i) {
            const cnt = contours.get(i);
            const area = cv.contourArea(cnt);
            if (area > 1000) { // Min area
                const peri = cv.arcLength(cnt, true);
                const approx = new cv.Mat();
                cv.approxPolyDP(cnt, approx, 0.02 * peri, true);
                if (approx.rows === 4 && area > maxArea) {
                    maxArea = area;
                    maxContour = approx; // Keep the approximate 4-point contour
                } else {
                    approx.delete();
                }
            }
        }

        let corners: number[] | null = null;
        if (maxContour) {
            corners = [];
            for (let i = 0; i < 4; i++) {
                // Scale back up
                corners.push(maxContour.data32S[i * 2] / scale);
                corners.push(maxContour.data32S[i * 2 + 1] / scale);
            }
            maxContour.delete();
        }

        // Cleanup
        src.delete();
        gray.delete();
        small.delete();
        edges.delete();
        contours.delete();
        hierarchy.delete();

        postMessage({ type: 'FRAME_PROCESSED', payload: { corners } });

    } catch (err) {
        console.error('CV Processing Error', err);
    }
}
