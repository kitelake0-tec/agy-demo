import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Webcam from 'react-webcam';
import { saveDocument } from '../db/db';
import Gallery from './Gallery';

// Worker types - Should be shared from worker file ideally
type WorkerResponse =
    | { type: 'CV_LOADED'; payload: { loaded: boolean } }
    | { type: 'FRAME_PROCESSED'; payload: { corners: number[] | null } }
    | { type: 'CROP_COMPLETE'; payload: { image: ImageData } };

const CameraView = () => {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [cvReady, setCvReady] = useState(false);
    const [corners, setCorners] = useState<number[] | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [lastImage, setLastImage] = useState<string | null>(null);
    const [showGallery, setShowGallery] = useState(false);

    const worker = useMemo(() =>
        new Worker(new URL('../workers/cv.worker.ts', import.meta.url), { type: 'classic' })
        , []);

    useEffect(() => {
        worker.onmessage = async (e: MessageEvent<WorkerResponse>) => {
            const { type, payload } = e.data;
            if (type === 'CV_LOADED') {
                setCvReady(payload.loaded);
            } else if (type === 'FRAME_PROCESSED') {
                const { corners: detectedCorners } = payload as { corners: number[] | null };
                setCorners(detectedCorners);
            } else if (type === 'CROP_COMPLETE') {
                const { image } = payload as { image: ImageData };

                // Convert to Blob for saving
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.putImageData(image, 0, 0);
                    canvas.toBlob(async (blob) => {
                        if (blob) {
                            await saveDocument(blob, image.width, image.height);
                            setLastImage(URL.createObjectURL(blob));
                            setIsProcessing(false);
                        }
                    }, 'image/jpeg', 0.8);
                } else {
                    setIsProcessing(false);
                }
            }
        };

        return () => {
            worker.terminate();
        };
    }, [worker]);

    const capture = useCallback(() => {
        if (!webcamRef.current || !webcamRef.current.video || !corners || isProcessing) return;
        setIsProcessing(true);

        const video = webcamRef.current.video;
        const { videoWidth, videoHeight } = video;

        const canvas = document.createElement('canvas');
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
        const imageData = ctx.getImageData(0, 0, videoWidth, videoHeight);

        // Send WARP_CROP
        worker.postMessage({
            type: 'WARP_CROP',
            payload: { width: videoWidth, height: videoHeight, data: imageData.data, corners }
        });

    }, [corners, isProcessing, worker]);

    // Frame Processing Loop
    const processFrame = useCallback(() => {
        if (!webcamRef.current || !webcamRef.current.video || !cvReady || isProcessing) return;

        const video = webcamRef.current.video;
        if (video.readyState !== 4) return;

        const { videoWidth, videoHeight } = video;

        // Draw current frame to a temporary canvas to get ImageData
        const canvas = document.createElement('canvas');
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
        const imageData = ctx.getImageData(0, 0, videoWidth, videoHeight);

        worker.postMessage(
            { type: 'PROCESS_FRAME', payload: { width: videoWidth, height: videoHeight, data: imageData.data } },
            // @ts-ignore
            [imageData.data.buffer]
        );
    }, [cvReady, worker, isProcessing]);

    useEffect(() => {
        let intervalId: number;
        if (cvReady) {
            intervalId = window.setInterval(processFrame, 200); // 5 FPS is enough for detection
        }
        return () => clearInterval(intervalId);
    }, [cvReady, processFrame]);

    // Draw Overlay
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !webcamRef.current || !webcamRef.current.video) return;

        // Ensure canvas matches displayed video size
        // Note: react-webcam might be responsive, so checking offsetWidth might be needed
        // But detecting on full resolution and scaling overlay is better
        // For simplicity, we assume videoWidth matches for now or we just use coordinate scaling
        // But since we process full res, the corners are full res.
        // We need to scale context to fit the display size.

        const video = webcamRef.current.video;
        const { videoWidth, videoHeight } = video;

        if (videoWidth === 0) return;

        // Set canvas internal resolution to video resolution
        if (canvas.width !== videoWidth || canvas.height !== videoHeight) {
            canvas.width = videoWidth;
            canvas.height = videoHeight;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (corners) {
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.moveTo(corners[0], corners[1]);
            for (let i = 2; i < corners.length; i += 2) {
                ctx.lineTo(corners[i], corners[i + 1]);
            }
            ctx.closePath();
            ctx.stroke();

            // Draw guide area
            ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
            ctx.fill();
        }
    }, [corners]);

    const videoConstraints = {
        facingMode: { ideal: "environment" },
        width: { ideal: 4096 },
        height: { ideal: 2160 }
    };

    return (
        <div className="relative w-full h-full min-h-screen bg-black overflow-hidden flex flex-col">
            {/* Loader */}
            {!cvReady && (
                <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/80 text-white backdrop-blur-sm">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="font-semibold text-lg">Initializing AI Vision...</p>
                        <p className="text-sm text-gray-400">Loading OpenCV.js (~8MB)</p>
                    </div>
                </div>
            )}

            {/* Video Feed */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    className="absolute inset-0 w-full h-full object-cover"
                    videoConstraints={videoConstraints}
                    playsInline
                />
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
            </div>

            {/* Controls */}
            <div className="h-32 bg-black/40 backdrop-blur-md absolute bottom-0 w-full flex items-center justify-around pb-8 pt-4">
                <button
                    onClick={() => setShowGallery(true)}
                    className="w-16 h-16 flex items-center justify-center active:scale-95 transition-transform"
                >
                    {lastImage ? (
                        <img src={lastImage} alt="Last scan" className="w-12 h-16 object-cover border-2 border-white rounded shadow-lg" />
                    ) : (
                        <div className="w-12 h-16 border-2 border-gray-500 rounded bg-gray-800 flex items-center justify-center text-gray-500 text-xs">
                            Gallery
                        </div>
                    )}
                </button>

                <button
                    onClick={capture}
                    disabled={!corners || isProcessing}
                    className={`w-20 h-20 rounded-full border-4 shadow-lg transition-all transform active:scale-95 flex items-center justify-center
                ${!corners ? 'border-gray-500 bg-transparent' : 'border-white bg-white/20'}
                ${isProcessing ? 'animate-pulse opacity-50' : ''}
             `}
                >
                    <div className={`w-16 h-16 rounded-full ${corners ? 'bg-white' : 'bg-transparent'} transition-colors`}></div>
                </button>

                <div className="w-16 h-16 flex items-center justify-center">
                    {/* Settings or Mode switch placeholder */}
                </div>
            </div>

            {showGallery && <Gallery onClose={() => setShowGallery(false)} />}
        </div>
    );
};

export default CameraView;
