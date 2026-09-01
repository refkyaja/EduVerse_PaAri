import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Check, Move } from 'lucide-react';

export default function ImageCropperModal({ imageSrc, onClose, onCropComplete }) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  // Reset parameters when imageSrc changes
  useEffect(() => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  }, [imageSrc]);

  // Mouse Drag Handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Drag Handlers for mobile responsiveness
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Perform canvas cropping to 1:1 circular/square PNG image
  const handleSaveCrop = () => {
    const img = imageRef.current;
    if (!img) return;

    const outputSize = 400; // Output avatar size 400x400
    const canvas = document.createElement('canvas');
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Clear background
    ctx.clearRect(0, 0, outputSize, outputSize);

    // Set high quality smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Save context state
    ctx.save();

    // Translate to center of target canvas
    ctx.translate(outputSize / 2, outputSize / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    // Display container scale relative to output
    const containerSize = 250; // The crop preview window is 250x250px
    const scaleFactor = outputSize / containerSize;

    const drawWidth = img.naturalWidth * zoom * scaleFactor;
    const drawHeight = img.naturalHeight * zoom * scaleFactor;
    const drawX = position.x * scaleFactor - drawWidth / 2;
    const drawY = position.y * scaleFactor - drawHeight / 2;

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();

    // Export high-quality cropped Data URL
    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onCropComplete(croppedDataUrl);
  };

  if (!imageSrc) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-card border border-border/80 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col text-foreground">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            <Move className="w-5 h-5 text-primary" />
            <h3 className="font-extrabold text-base md:text-lg">Potong Foto Profil</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Cropper Area */}
        <div className="p-6 flex flex-col items-center gap-5">
          <p className="text-xs text-muted-foreground text-center">
            Geser foto &amp; atur zoom untuk menentukan bagian foto profil yang ingin digunakan.
          </p>

          {/* Crop Box Container */}
          <div
            className="relative w-[250px] h-[250px] rounded-full overflow-hidden border-4 border-primary/80 shadow-2xl bg-black/40 cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Background Grid Guide overlay */}
            <div className="absolute inset-0 pointer-events-none border border-white/20 rounded-full z-10 grid grid-cols-3 grid-rows-3">
              <div className="border-r border-b border-white/10"></div>
              <div className="border-r border-b border-white/10"></div>
              <div className="border-b border-white/10"></div>
              <div className="border-r border-b border-white/10"></div>
              <div className="border-r border-b border-white/10"></div>
              <div className="border-b border-white/10"></div>
              <div className="border-r border-white/10"></div>
              <div className="border-r border-white/10"></div>
              <div></div>
            </div>

            {/* Target Draggable & Scalable Image */}
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop preview"
              draggable={false}
              className="absolute max-w-none origin-center pointer-events-none transition-transform duration-75"
              style={{
                transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                top: '50%',
                left: '50%',
              }}
            />
          </div>

          {/* Controls: Zoom & Rotation */}
          <div className="w-full space-y-4 pt-2">
            {/* Zoom Slider */}
            <div className="flex items-center gap-3">
              <ZoomOut className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
              />
              <ZoomIn className="w-4 h-4 text-primary shrink-0" />
            </div>

            {/* Rotate Button */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Zoom: {(zoom * 100).toFixed(0)}%</span>
              <button
                type="button"
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted text-xs font-bold hover:bg-muted/80 transition-colors cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Putar 90°</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-muted/30 border-t border-border/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl font-extrabold text-xs text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSaveCrop}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs shadow-glow hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Potong &amp; Simpan Foto</span>
          </button>
        </div>
      </div>
    </div>
  );
}
