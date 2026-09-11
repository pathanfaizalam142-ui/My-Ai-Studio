import React, { useRef, useState } from 'react';
import { Upload, Camera, Sparkles, Image as ImageIcon } from 'lucide-react';
import { SAMPLE_PHOTOS } from '../data/presets';
import { playCassetteClick, playShutterSound } from '../utils/audio';

interface PhotoUploaderProps {
  currentPhoto: string;
  onSelectPhoto: (photoUrl: string) => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  currentPhoto,
  onSelectPhoto,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        onSelectPhoto(event.target.result);
        playShutterSound();
      }
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      playCassetteClick();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
      });
      setCameraStream(stream);
      setCameraOpen(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Could not access camera:", err);
      alert("Camera access was not granted or not supported in this frame.");
    }
  };

  const captureCamera = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      onSelectPhoto(dataUrl);
      playShutterSound();
    }
    stopCamera();
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setCameraOpen(false);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Action Buttons: Upload or Snap */}
      <div className="flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <button
          onClick={() => { fileInputRef.current?.click(); playCassetteClick(); }}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-rose-950/40 transition-all cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Your Photo</span>
        </button>

        <button
          onClick={startCamera}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-all"
        >
          <Camera className="w-4 h-4 text-rose-400" />
          <span className="hidden sm:inline">Camera</span>
        </button>
      </div>

      {/* Live Camera View Overlay if Active */}
      {cameraOpen && (
        <div className="relative rounded-2xl overflow-hidden border-2 border-rose-500 bg-slate-950 p-2 flex flex-col items-center gap-2">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full aspect-[4/3] object-cover rounded-xl"
          />
          <div className="flex items-center gap-2 w-full">
            <button
              onClick={captureCamera}
              className="flex-1 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <Camera className="w-4 h-4" />
              <span>Snap 80s Photo</span>
            </button>
            <button
              onClick={stopCamera}
              className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Starter Sample Thumbnails */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-mono text-slate-400">
          OR SELECT STARTER SUBJECT:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {SAMPLE_PHOTOS.map((sample) => {
            const isCurrent = currentPhoto === sample.url;
            return (
              <button
                key={sample.id}
                onClick={() => { onSelectPhoto(sample.url); playShutterSound(); }}
                className={`flex-shrink-0 flex items-center gap-2 p-1.5 rounded-xl border text-left transition-all ${
                  isCurrent
                    ? 'bg-rose-950/50 border-rose-500 shadow-md shadow-rose-900/30'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <img
                  src={sample.url}
                  alt={sample.title}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <div className="pr-1.5">
                  <p className="text-[11px] font-bold text-slate-200 leading-tight">
                    {sample.title}
                  </p>
                  <p className="text-[9px] text-slate-500 font-mono">
                    {sample.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
