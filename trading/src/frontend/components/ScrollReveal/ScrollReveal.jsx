import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollReveal = ({ children }) => {
  const scopeRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const scope = scopeRef.current;

    if (!scope) return undefined;

    const customRevealRoots = ".smart-string-page, .smart-energy-page, .smart-module-page, .huawei-showcase";
    const textRevealSelector =
      "h1, h2, h3, h4, h5, h6, p, li, dt, dd, blockquote, figcaption, label, small, strong, th, td, [data-text-reveal]";
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

    revealTargets.forEach((target, index) => {
      target.classList.add("scroll-reveal");
      target.style.setProperty("--reveal-delay", `${Math.min(index * 55, 300)}ms`);
    });

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const textTargets = new Set();
    const textTargetsMadeVisible = new Set();
    const textObserver = !reduceMotion && "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            textTargetsMadeVisible.add(entry.target);
            textObserver.unobserve(entry.target);
          });
        }, {
          threshold: 0.08,
          rootMargin: "0px 0px -6% 0px",
        })
      : null;

    const registerTextTargets = () => {
      scope.querySelectorAll(textRevealSelector).forEach((target, index) => {
        if (textTargets.has(target)) return;

        textTargets.add(target);
        target.classList.add("text-reveal");
        const isHeading = target.matches("h1, h2, h3, h4, h5, h6");
        target.style.setProperty(
          "--text-reveal-delay",
          `${Math.min(index * 52, 360)}ms`,
        );
        target.style.setProperty(
          "--text-reveal-distance",
          isHeading ? "28px" : "18px",
        );
        target.style.setProperty(
          "--text-reveal-duration",
          isHeading ? "760ms" : "640ms",
        );

        if (textObserver) {
          textObserver.observe(target);
        } else {
          target.classList.add("is-visible");
          textTargetsMadeVisible.add(target);
        }
      });
    };

    registerTextTargets();

    const textMutationObserver = "MutationObserver" in window
      ? new MutationObserver(registerTextTargets)
      : null;
    textMutationObserver?.observe(scope, { childList: true, subtree: true });

    const showAll = () => {
      revealTargets.forEach((target) => target.classList.add("is-visible"));
      textTargets.forEach((target) => {
        target.classList.add("is-visible");
        textTargetsMadeVisible.add(target);
      });
    };

    let observer = null;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      showAll();
    } else {
      observer = new IntersectionObserver((entries) => {
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
    }

    return () => {
      observer?.disconnect();
      textObserver?.disconnect();
      textMutationObserver?.disconnect();
      revealTargets.forEach((target) => {
        target.classList.remove("scroll-reveal", "is-visible");
        target.style.removeProperty("--reveal-delay");
      });
      textTargets.forEach((target) => {
        target.classList.remove("text-reveal");
        target.style.removeProperty("--text-reveal-delay");
        target.style.removeProperty("--text-reveal-distance");
        target.style.removeProperty("--text-reveal-duration");
      });
      textTargetsMadeVisible.forEach((target) => {
        target.classList.remove("is-visible");
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
