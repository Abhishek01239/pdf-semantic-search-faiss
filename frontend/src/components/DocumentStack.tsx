import React, { useState, useEffect } from "react";

interface DocumentStackProps {
  isScanning?: boolean;
  latency?: string;
  match?: string;
  x?: string;
  y?: string;
}

export const DocumentStack: React.FC<DocumentStackProps> = ({
  isScanning = false,
  latency = "0.241s",
  match = "98.6%",
  x = "198.243",
  y = "884.912",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [scanOffset, setScanOffset] = useState(0);

  // Sync expanded state with scanning status and hover state
  useEffect(() => {
    if (isScanning || isHovered) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [isScanning, isHovered]);

  // Handle scanning laser animation speed
  useEffect(() => {
    const intervalTime = isScanning ? 25 : 50; // Scan faster when scanning
    const scanInterval = setInterval(() => {
      setScanOffset((prev) => (prev + 1) % 100);
    }, intervalTime);

    return () => {
      clearInterval(scanInterval);
    };
  }, [isScanning]);

  return (
    <div 
      className="relative w-full h-[360px] flex items-center justify-center select-none"
      style={{ perspective: "1200px" }}
    >
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-[280px] h-[280px] transition-all duration-700 cursor-pointer ease-out hover:scale-105"
        style={{ 
          transformStyle: "preserve-3d", 
          transform: isExpanded 
            ? "rotateX(55deg) rotateZ(-35deg) translateY(-10px)" 
            : "rotateX(60deg) rotateZ(-40deg)"
        }}
      >
        {/* Layer 1: Document Page (Top) */}
        <div 
          className="absolute inset-0 bg-[#121212]/95 border border-primary/20 rounded-xl p-sm flex flex-col justify-between transition-transform duration-700 ease-out shadow-2xl overflow-hidden"
          style={{ 
            transform: `translateZ(${isExpanded ? "100px" : "30px"})`,
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
          }}
        >
          {/* Scanning glow bar */}
          <div 
            className={`absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ff5500] to-transparent shadow-[0_0_12px_#ff5500] transition-all duration-100`}
            style={{ 
              top: `${scanOffset}%`,
              boxShadow: isScanning ? "0 0 20px #ff5500, 0 0 8px #ff5500" : "0 0 12px #ff5500"
            }}
          />

          <div className="flex justify-between items-start border-b border-outline-variant pb-xs">
            <span className="bg-primary/10 border border-primary/30 text-[9px] font-mono text-primary px-sm py-[2px] rounded font-bold uppercase tracking-wider">
              {isScanning ? "PROCESSING" : "RENDER_OK"}
            </span>
            <span className="text-[9px] font-mono text-[#ff5500] font-bold tracking-wider animate-pulse">
              [LATENCY: {latency}]
            </span>
          </div>

          {/* Document Content mockup */}
          <div className="flex-1 py-sm flex flex-col gap-xs opacity-75">
            <div className="h-2 w-3/4 bg-primary/20 rounded"></div>
            <div className="h-2 w-5/6 bg-primary/10 rounded"></div>
            <div className="h-2 w-2/3 bg-primary/10 rounded"></div>
            <div className="h-10 w-full border border-outline-variant/30 rounded flex items-center justify-center mt-xs bg-surface-container-lowest/40">
              <span className="text-[8px] font-mono text-on-surface-variant">IMAGE_PREVIEW_INDEXED</span>
            </div>
            <div className="h-2 w-1/2 bg-primary/10 rounded mt-xs"></div>
          </div>

          <div className="flex justify-between items-end border-t border-outline-variant pt-xs text-[9px] font-mono text-on-surface-variant">
            <span>INPUT: "semantic_search"</span>
            <span>1024x1024_PDF</span>
          </div>
        </div>

        {/* Layer 2: Vectorization Layer (Middle) */}
        <div 
          className="absolute inset-0 bg-[#0f0f0f]/90 border border-outline-variant/30 rounded-xl p-sm flex flex-col justify-between transition-transform duration-700 ease-out shadow-lg"
          style={{ 
            transform: "translateZ(0px)",
            boxShadow: "0 5px 15px rgba(0,0,0,0.4)"
          }}
        >
          <div className="flex justify-between items-start border-b border-outline-variant/40 pb-xs">
            <span className="text-[9px] font-mono text-[#ff5500]">
              [OUTPUT: RETRO_SEMANTIC]
            </span>
            <span className="text-[9px] font-mono text-primary tracking-wider">
              {match} ACC
            </span>
          </div>

          {/* Glowing Vector Chunks mockup */}
          <div className="flex-1 py-sm grid grid-cols-2 gap-sm items-center">
            <div className="space-y-xs">
              <div className="h-1.5 w-full bg-primary/10 rounded"></div>
              <div className="h-1.5 w-5/6 bg-primary/20 rounded"></div>
              <div className="h-1.5 w-full bg-primary/10 rounded"></div>
            </div>
            <div className="border border-[#ff5500]/20 rounded p-xs bg-[#ff5500]/5 text-center flex flex-col justify-center">
              <span className="text-[8px] font-mono text-[#ff5500] font-bold">EMBEDDING</span>
              <span className="text-[7px] font-mono text-on-surface-variant">384_DIM_VECTOR</span>
            </div>
          </div>

          <div className="flex justify-between items-end border-t border-outline-variant/40 pt-xs text-[9px] font-mono text-on-surface-variant">
            <span>CHECKPOINT_V1.4</span>
            <span>COSINE_SIMILARITY</span>
          </div>
        </div>

        {/* Layer 3: Vector DB Grid (Bottom) */}
        <div 
          className="absolute inset-0 bg-[#070707]/95 border border-[#ff5500]/20 rounded-xl p-sm flex flex-col justify-between transition-transform duration-700 ease-out shadow-2xl"
          style={{ 
            transform: `translateZ(${isExpanded ? "-100px" : "-30px"})`,
            backgroundImage: "linear-gradient(rgba(255, 85, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 85, 0, 0.05) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            boxShadow: "0 -5px 25px rgba(255,85,0,0.05)"
          }}
        >
          <div className="flex justify-between items-start border-b border-outline-variant/20 pb-xs">
            <span className="text-[9px] font-mono text-primary/50 uppercase tracking-widest">
              High-Dim Grid
            </span>
            <span className="text-[9px] font-mono text-[#ff5500]">
              Z: 000
            </span>
          </div>

          {/* Pulsing center node vector */}
          <div className="flex-1 flex items-center justify-center relative">
            <div className={`w-2.5 h-2.5 bg-[#ff5500] rounded-full relative z-10 transition-all duration-300 ${isScanning ? "scale-125 shadow-[0_0_10px_#ff5500]" : ""}`}>
              <span className={`absolute -inset-2 bg-[#ff5500]/40 rounded-full animate-ping z-0`} />
            </div>
            {/* Horizontal axes lines */}
            <div className="absolute w-2/3 h-[1px] bg-[#ff5500]/15" />
            <div className="absolute h-2/3 w-[1px] bg-[#ff5500]/15" />
          </div>

          <div className="flex justify-between items-end border-t border-outline-variant/20 pt-xs text-[9px] font-mono text-on-surface-variant">
            <span>X: {x}</span>
            <span>Y: {y}</span>
          </div>
        </div>

        {/* Dynamic connection lines (visible when expanded) */}
        {isExpanded && (
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Dotted border indicators mapping layers */}
            <div 
              className="absolute left-4 top-4 w-0.5 bg-gradient-to-b from-[#ff5500]/40 via-transparent to-primary/20 border-l border-dashed border-primary/40 animate-pulse"
              style={{ height: "200px", transform: "translateZ(-100px)" }}
            />
            <div 
              className="absolute right-4 bottom-4 w-0.5 bg-gradient-to-b from-[#ff5500]/40 via-transparent to-primary/20 border-l border-dashed border-primary/40 animate-pulse"
              style={{ height: "200px", transform: "translateZ(-100px)" }}
            />
          </div>
        )}
      </div>

      {/* Expand Hint Overlay */}
      <div className="absolute bottom-1 text-center z-20 text-[9px] font-mono text-on-surface-variant tracking-wider uppercase bg-[#141313]/90 px-sm py-[2px] border border-outline-variant/60 rounded-full backdrop-blur-sm pointer-events-none">
        {isScanning ? "Scanning Stack Context" : (isExpanded ? "Hover Off to Collapse Stack" : "Hover Cursor to Expand 3D Stack")}
      </div>
    </div>
  );
};
