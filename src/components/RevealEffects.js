"use client";
import { useEffect } from "react";

export default function RevealEffects() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!("IntersectionObserver" in window)) return;
    const seen = new WeakSet();
    const animations = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        observer.unobserve(target);
        if (preference.matches || typeof target.animate !== "function") return;
        const animation = target.animate([
          { opacity: 0.2, transform: "translateY(20px)" },
          { opacity: 1, transform: "translateY(0)" },
        ], { duration: 550, easing: "cubic-bezier(.2,.7,.2,1)" });
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      });
    }, { threshold: 0.08 });
    const discover = () => document.querySelectorAll("[data-reveal], .catalog-item").forEach((element) => {
      if (seen.has(element)) return;
      seen.add(element);
      observer.observe(element);
    });
    const reduceMotion = () => {
      if (preference.matches) { animations.forEach((animation) => animation.cancel()); animations.clear(); }
    };
    discover();
    const mutations = new MutationObserver(discover);
    mutations.observe(document.querySelector("main") || document.body, { childList: true, subtree: true });
    preference.addEventListener("change", reduceMotion);
    return () => {
      observer.disconnect(); mutations.disconnect();
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener("change", reduceMotion);
    };
  }, []);
  return null;
}
