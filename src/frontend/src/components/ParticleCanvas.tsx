import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  pulsePhase: number;
  pulseSpeed: number;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef({ x: -2000, y: -2000 });
  const nodesRef = useRef<Node[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Neon lime
    const R = 183;
    const G = 255;
    const B = 62;

    const NODE_COUNT_FACTOR = 0.00008; // nodes per px²
    const CONNECT_DIST = 160;
    const CURSOR_R = 200;
    const DRIFT_SPEED = 0.25;

    const initNodes = () => {
      const W = canvas.width;
      const H = canvas.height;
      const count = Math.max(60, Math.floor(W * H * NODE_COUNT_FACTOR));
      const nodes: Node[] = [];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: Math.cos(angle) * DRIFT_SPEED * (0.3 + Math.random() * 0.7),
          vy: Math.sin(angle) * DRIFT_SPEED * (0.3 + Math.random() * 0.7),
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.003 + Math.random() * 0.004,
        });
      }
      nodesRef.current = nodes;
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
    };

    let running = true;

    const animate = () => {
      if (!running) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cursor = cursorRef.current;
      const W = canvas.width;
      const H = canvas.height;
      const nodes = nodesRef.current;

      // Update node positions with wrapping
      for (const n of nodes) {
        n.pulsePhase += n.pulseSpeed;
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = W + 20;
        if (n.x > W + 20) n.x = -20;
        if (n.y < -20) n.y = H + 20;
        if (n.y > H + 20) n.y = -20;
      }

      // Compute per-node glow intensity (cursor proximity only — no scroll wave)
      const glows = nodes.map((p) => {
        const autoGlow = 0.04 + 0.02 * Math.sin(p.pulsePhase);

        // Cursor proximity
        const dx = p.x - cursor.x;
        const dy = p.y - cursor.y;
        const dist = Math.hypot(dx, dy);
        const cursorGlow =
          dist < CURSOR_R ? (1 - dist / CURSOR_R) ** 1.8 * 0.9 : 0;

        return Math.min(1, autoGlow + cursorGlow);
      });

      // Draw lines between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > CONNECT_DIST) continue;

          const proximity = 1 - dist / CONNECT_DIST;
          const lineGlow = Math.max(glows[i], glows[j]);
          const baseAlpha = proximity * 0.12;
          const brightAlpha = proximity * lineGlow * 0.85;
          const alpha = Math.min(1, baseAlpha + brightAlpha);

          if (alpha < 0.02) continue;

          const lineWidth = 0.5 + proximity * lineGlow * 2.0;

          if (lineGlow > 0.2) {
            // Glowing line with blur-like layering
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${R}, ${G}, ${B}, ${(alpha * 0.3).toFixed(3)})`;
            ctx.lineWidth = lineWidth * 4;
            ctx.stroke();
          }

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${R}, ${G}, ${B}, ${alpha.toFixed(3)})`;
          ctx.lineWidth = lineWidth;
          ctx.stroke();
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseLeave = () => {
      cursorRef.current = { x: -2000, y: -2000 };
    };

    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) cursorRef.current = { x: t.clientX, y: t.clientY };
    };

    const onTouchEnd = () => {
      cursorRef.current = { x: -2000, y: -2000 };
    };

    resizeCanvas();
    animate();

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("resize", resizeCanvas);

    return () => {
      running = false;
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1,
        pointerEvents: "none",
        willChange: "transform",
      }}
    />
  );
}
