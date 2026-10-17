import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollReveal = ({ children }) => {
  const scopeRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const scope = scopeRef.current;

    if (!scope) return undefined;

    const customRevealRoots = ".smart-string-page, .smart-energy-page, .smart-module-page, .huawei-showcase";
    const hasCustomReveal = Boolean(scope.querySelector(customRevealRoots));
    const targets = [...scope.querySelectorAll(
      "section, article, header, [data-scroll-reveal], " +
      ".hardware-card, .spec-tag, .table-row, .analytics-card, .product-card, " +
      ".reference-card, .compliance-card, .lifecycle-card, .np-chart-card, " +
      ".np-project-card, .contact-network-card, .contact-office, " +
      ".contact-training-card, .smart-module-feature-card, .smart-module-benefit-card, " +
      ".smart-energy-benefit-card, .similar-product-card, .helpful-link-card, " +
      ".dashboard-metric-card, .dashboard-panel, .dashboard-auth-card",
    )].filter((target) => !target.closest(customRevealRoots));
    const revealTargets = targets.length
      ? targets
      : hasCustomReveal
        ? []
        : [scope.firstElementChild].filter(Boolean);

    if (!revealTargets.length) return undefined;

    revealTargets.forEach((target, index) => {
      target.classList.add("scroll-reveal");
      target.style.setProperty("--reveal-delay", `${Math.min(index * 55, 300)}ms`);
    });

    const showAll = () => revealTargets.forEach((target) => target.classList.add("is-visible"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      showAll();
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px",
    });

    revealTargets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
      revealTargets.forEach((target) => {
        target.classList.remove("scroll-reveal", "is-visible");
        target.style.removeProperty("--reveal-delay");
      });
    };
  }, [location.pathname, location.search]);

  return (
    <div ref={scopeRef} className="scroll-reveal-scope">
      {children}
    </div>
  );
};

export default ScrollReveal;
