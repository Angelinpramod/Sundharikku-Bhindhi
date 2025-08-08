import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface PlacementNorm {
  player: number;
  emoji: string;
  xNorm: number; // 0..1
  yNorm: number; // 0..1
}

type Dims = { width: number; height: number };

type GameBoardProps = {
  imageUrl: string;
  placements: PlacementNorm[];
  isHidden: boolean; // if true, keep image in layout but visually hidden
  spin?: boolean;
  showTarget?: boolean;
  targetNorm?: { x: number; y: number };
  onPlace: (xNorm: number, yNorm: number) => void;
  onMeasured?: (dims: Dims) => void;
};

export const TARGET_DEFAULT = { x: 0.5, y: 0.28 };

const useMeasure = (onChange?: (d: Dims) => void) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [dims, setDims] = useState<Dims>({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const next = { width: Math.round(rect.width), height: Math.round(rect.height) };
      setDims(next);
      onChange?.(next);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [onChange]);

  return { ref, dims } as const;
};

export default function GameBoard({
  imageUrl,
  placements,
  isHidden,
  spin,
  showTarget,
  targetNorm = TARGET_DEFAULT,
  onPlace,
  onMeasured,
}: GameBoardProps) {
  const { ref, dims } = useMeasure(onMeasured);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (rect.width <= 0 || rect.height <= 0) return;
    const xNorm = Math.min(1, Math.max(0, x / rect.width));
    const yNorm = Math.min(1, Math.max(0, y / rect.height));
    onPlace(xNorm, yNorm);
  };

  const targetPx = useMemo(() => {
    return {
      x: targetNorm.x * (dims.width || 0),
      y: targetNorm.y * (dims.height || 0),
    };
  }, [dims.height, dims.width, targetNorm.x, targetNorm.y]);

  return (
    <div className="w-full flex items-center justify-center">
      <div
        ref={ref}
        onClick={handleClick}
        className={cn(
          "relative inline-block rounded-lg overflow-hidden",
          "shadow-[var(--shadow-elegant)]",
          "bg-card"
        )}
        aria-label="Emoji placement area"
        role="img"
      >
        {/* Image (kept in layout for measurement) */}
        <img
          src={imageUrl}
          alt="Portrait for emoji placement"
          className={cn(
            "block h-auto max-w-[520px] w-full select-none",
            "transition-opacity duration-500",
            isHidden ? "opacity-0 pointer-events-none" : "opacity-100",
            spin ? "animate-spin" : ""
          )}
          draggable={false}
        />

        {/* Placements overlay */}
        <div className="pointer-events-none absolute inset-0">
          {placements.map((p) => (
            <div
              key={`p-${p.player}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-3xl text-foreground drop-shadow"
              style={{ left: `${p.xNorm * 100}%`, top: `${p.yNorm * 100}%` }}
            >
              <div className="text-center">
                <div aria-hidden>{p.emoji}</div>
                <div className="text-xs mt-1 text-muted-foreground">Player {p.player}</div>
              </div>
            </div>
          ))}

          {/* Reveal target indicator */}
          {showTarget && (
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${targetPx.x}px`, top: `${targetPx.y}px` }}
              aria-label="Target location"
            >
              <div className="relative">
                <span className="block w-4 h-4 rounded-full bg-destructive/80 border border-primary shadow-sm" />
                <span className="absolute inset-0 -m-2 rounded-full border border-primary/50 animate-ping" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
