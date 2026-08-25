import { useEffect, useRef } from "react";

const sparkleColors = ["#f28c28", "#ef5f6c", "#ffd34e", "#20a98b", "#37a9df", "#8b65c2"];

export function KidsMagicCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!finePointer.matches || reducedMotion.matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let pointerX = -100;
    let pointerY = -100;
    let ringX = pointerX;
    let ringY = pointerY;
    let frame = 0;
    let lastSparkleAt = 0;

    const animate = () => {
      ringX += (pointerX - ringX) * 0.18;
      ringY += (pointerY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      frame = window.requestAnimationFrame(animate);
    };

    const createSparkle = (x: number, y: number) => {
      const sparkle = document.createElement("span");
      const size = 4 + Math.random() * 5;
      sparkle.className = "kids-cursor-sparkle";
      sparkle.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;background:${sparkleColors[Math.floor(Math.random() * sparkleColors.length)]};--sparkle-x:${(Math.random() - 0.5) * 26}px;--sparkle-y:${10 + Math.random() * 18}px;`;
      document.body.appendChild(sparkle);
      sparkle.addEventListener("animationend", () => sparkle.remove(), { once: true });
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      dot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;
      dot.dataset.visible = "true";
      ring.dataset.visible = "true";

      if (event.timeStamp - lastSparkleAt > 70) {
        createSparkle(pointerX, pointerY);
        lastSparkleAt = event.timeStamp;
      }
    };

    const onPointerOver = (event: PointerEvent) => {
      const interactive = event.target instanceof Element && event.target.closest("a, button, input, textarea, select, [role='button']");
      ring.dataset.active = interactive ? "true" : "false";
    };

    const onPointerLeave = () => {
      dot.dataset.visible = "false";
      ring.dataset.visible = "false";
    };

    document.documentElement.classList.add("kids-magic-cursor-active");
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerover", onPointerOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onPointerLeave);
    frame = window.requestAnimationFrame(animate);

    return () => {
      document.documentElement.classList.remove("kids-magic-cursor-active");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerover", onPointerOver);
      document.documentElement.removeEventListener("mouseleave", onPointerLeave);
      window.cancelAnimationFrame(frame);
      document.querySelectorAll(".kids-cursor-sparkle").forEach((sparkle) => sparkle.remove());
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="kids-magic-cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="kids-magic-cursor-dot" aria-hidden="true" />
      <style>{`
        @media (hover: hover) and (pointer: fine) {
          .kids-magic-cursor-active, .kids-magic-cursor-active * { cursor: none !important; }
          .kids-magic-cursor-ring, .kids-magic-cursor-dot {
            pointer-events: none;
            position: fixed;
            left: 0;
            top: 0;
            z-index: 9999;
            opacity: 0;
          }
          .kids-magic-cursor-ring {
            // width: 34px;
            // height: 34px;
            border: 2px solid #8b65c2;
            border-radius: 9999px;
            box-shadow: 0 0 0 3px rgb(255 211 78 / .2), 0 4px 18px rgb(52 48 92 / .22);
            transition: width .2s ease, height .2s ease, opacity .18s ease, border-color .2s ease, background-color .2s ease;
            will-change: transform;
          }
          .kids-magic-cursor-dot {
            width: 7px;
            height: 7px;
            border-radius: 9999px;
            background: #ef5f6c;
            box-shadow: 0 0 10px rgb(239 95 108 / .75);
            transition: opacity .18s ease;
            will-change: transform;
          }
          .kids-magic-cursor-ring[data-visible="true"], .kids-magic-cursor-dot[data-visible="true"] { opacity: 1; }
          .kids-magic-cursor-ring[data-active="true"] {
            // width: 48px;
            // height: 48px;
            border-color: #20a98b;
            background: rgb(32 169 139 / .09);
          }
          .kids-cursor-sparkle {
            pointer-events: none;
            position: fixed;
            z-index: 9998;
            border-radius: 9999px;
            transform: translate(-50%, -50%);
            animation: kidsCursorSparkle .65s ease-out forwards;
          }
          @keyframes kidsCursorSparkle {
            to { opacity: 0; transform: translate(calc(-50% + var(--sparkle-x)), calc(-50% + var(--sparkle-y))) scale(.15) rotate(120deg); }
          }
        }
        @media (prefers-reduced-motion: reduce), (hover: none), (pointer: coarse) {
          .kids-magic-cursor-ring, .kids-magic-cursor-dot, .kids-cursor-sparkle { display: none !important; }
        }
      `}</style>
    </>
  );
}