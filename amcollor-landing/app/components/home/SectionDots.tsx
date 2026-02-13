"use client";

import { useEffect, useState, useCallback } from "react";

type Props = {
  sections: string[];
  locale: "fa" | "en";
};

export default function SectionDots({ sections, locale }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const isFa = locale === "fa";

  // Calculate navbar height offset (sticky header)
  const getNavbarOffset = () => {
    if (typeof window === "undefined") return 80;
    // Navbar is h-16 md:h-20, so approximately 80px on desktop
    return window.innerWidth >= 768 ? 80 : 64;
  };

  // Handle smooth scroll to section with offset
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    setIsScrolling(true);
    const offset = getNavbarOffset();
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    // Reset scrolling flag after animation completes
    setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  }, []);

  // Update active dot based on scroll position
  useEffect(() => {
    if (isScrolling) return; // Don't update during programmatic scroll

    const handleScroll = () => {
      const scrollPosition = window.scrollY + getNavbarOffset() + 100; // Add some threshold
      
      // Find which section is currently in view
      let currentIndex = 0;
      let maxVisibility = 0;

      sections.forEach((id, index) => {
        const element = document.getElementById(id);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + window.scrollY;
        const elementBottom = elementTop + rect.height;
        
        // Calculate how much of the section is visible
        const viewportTop = window.scrollY;
        const viewportBottom = window.scrollY + window.innerHeight;
        
        const visibleTop = Math.max(elementTop, viewportTop);
        const visibleBottom = Math.min(elementBottom, viewportBottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibilityRatio = visibleHeight / rect.height;

        // If this section is more visible than the current one, make it active
        if (visibilityRatio > maxVisibility && visibleHeight > 100) {
          maxVisibility = visibilityRatio;
          currentIndex = index;
        }
      });

      setActiveIndex(currentIndex);
    };

    // Initial check
    handleScroll();

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [sections, isScrolling]);

  // Use IntersectionObserver as a fallback/backup
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          // Only update if not programmatically scrolling
          if (!isScrolling && entry.isIntersecting) {
            // Use a higher threshold to ensure section is mostly visible
            if (entry.intersectionRatio >= 0.3) {
              setActiveIndex(i);
            }
          }
        },
        { 
          threshold: [0, 0.3, 0.5, 0.7, 1],
          rootMargin: `-${getNavbarOffset()}px 0px -50% 0px`
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sections, isScrolling]);

  return (
    <div
      className={`fixed top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 sm:gap-6 md:gap-8 hidden md:flex`}
      style={{
        left: isFa ? "1.5rem" : "auto",
        right: isFa ? "auto" : "1.5rem",
      }}
    >
      {sections.map((id, i) => {
        const isActive = i === activeIndex;
        return (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            aria-label={`Scroll to ${id} section`}
            className={`rounded-full w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center transition-all duration-300 ${
              isActive 
                ? "scale-150 bg-white shadow-lg ring-2 ring-white/50" 
                : "bg-white/40 hover:bg-white/60 hover:scale-125"
            }`}
          >
            {isActive && (
              <span className="absolute rounded-full w-2 h-2 sm:w-3 sm:h-3 bg-white/90" />
            )}
          </button>
        );
      })}
    </div>
  );
}