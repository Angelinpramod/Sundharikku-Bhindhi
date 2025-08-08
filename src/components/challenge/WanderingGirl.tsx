import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type Dims = { width: number; height: number };

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

type WanderingGirlProps = {
  src: string;
  visible: boolean;
  wanderMs?: number; // total wandering time before pause+end
  onEnd?: (dims: Dims) => void;
};

export default function WanderingGirl({ src, visible, wanderMs = 4000, onEnd }: WanderingGirlProps) {
  const { ref, dims } = useMeasure();
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setRunning(true);
    const stepMs = 900;
    const steps = Math.max(1, Math.floor(wanderMs / stepMs));
    let i = 0;
    const id = setInterval(() => {
      i++;
      setPos({ x: Math.random(), y: Math.random() * 0.7 + 0.15 });
      if (i >= steps) {
        clearInterval(id);
        // Pause exactly 1s, then finish
        setTimeout(() => {
          setRunning(false);
          onEnd?.(dims);
        }, 1000);
      }
    }, stepMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, wanderMs]);

  const imgStyle = useMemo(() => {
    const left = pos.x * (dims.width || 1);
    const top = pos.y * (dims.height || 1);
    return { left, top } as React.CSSProperties;
  }, [pos, dims.height, dims.width]);

  return (
    <div
      ref={ref}
      className="relative w-full max-w-[520px] aspect-[1/1] mx-auto rounded-lg bg-card shadow-[var(--shadow-elegant)] overflow-hidden"
      aria-label="Emoji challenge character stage"
      role="img"
    >
      {/* Character */}
      {visible && (
        <img
          src={src}
          alt="Challenge character"
          className={cn(
            "absolute -translate-x-1/2 -translate-y-1/2 w-48 md:w-56 select-none",
            running ? "transition-all duration-700 ease-in-out" : ""
          )}
          style={imgStyle}
          draggable={false}
          loading="eager"
        />
      )}
    </div>
  );
}
