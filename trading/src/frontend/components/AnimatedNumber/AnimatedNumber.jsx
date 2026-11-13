import { useEffect, useRef } from "react";

const formatNumber = (value, decimals) => Number(value).toLocaleString("en-US", {
  minimumFractionDigits: decimals,
  maximumFractionDigits: decimals,
});

const AnimatedNumber = ({ value, decimals = 0, prefix = "", suffix = "", duration = 1400 }) => {
  const numberRef = useRef(null);
  const target = Number(value) || 0;

  useEffect(() => {
    const element = numberRef.current;
    if (!element) return undefined;

    let frameId = 0;
    let observer;
    let animated = false;
    const render = (currentValue) => {
      element.textContent = `${prefix}${formatNumber(currentValue, decimals)}${suffix}`;
    };
    const finish = () => render(target);
    const animate = () => {
      if (animated) return;
      animated = true;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        finish();
        return;
      }

      const start = window.performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const easedProgress = 1 - ((1 - progress) ** 3);
        render(target * easedProgress);
        if (progress < 1) frameId = window.requestAnimationFrame(tick);
      };
      frameId = window.requestAnimationFrame(tick);
    };

    render(0);
    if (!("IntersectionObserver" in window)) {
      animate();
      return () => window.cancelAnimationFrame(frameId);
    }

    observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      animate();
      observer.disconnect();
    }, { threshold: 0.2, rootMargin: "0px 0px -8% 0px" });
    observer.observe(element);

    return () => {
      observer?.disconnect();
      window.cancelAnimationFrame(frameId);
    };
  }, [decimals, duration, prefix, suffix, target]);

  return <span ref={numberRef} aria-label={`${prefix}${formatNumber(target, decimals)}${suffix}`}>0</span>;
};

export default AnimatedNumber;
