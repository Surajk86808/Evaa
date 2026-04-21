"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import styles from "./VideoReel.module.css";

const BASE_ITEMS = [
  {
    src: "/media/avatar-agents.mp4",
    label: "AVATAR AGENTS"
  },
  {
    src: "/media/enterprise-ai.mp4",
    label: "ENTERPRISE AI"
  },
  {
    src: "/media/research.mp4",
    label: "RESEARCH"
  },
  {
    src: "/media/female-animated-doctor.mp4",
    label: "HEALTH AI"
  },
  {
    src: "/media/male-animated-doctor.mp4",
    label: "CONSUMER BEHAVIOUR"
  }
];

function ReelCard({ item, failed, onError }) {
  return (
    <article className={styles.card}>
      {!failed ? (
        <video
          className={styles.video}
          src={item.src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={onError}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 10%"
          }}
        />
      ) : (
        <div className={styles.placeholder}>{item.label}</div>
      )}
      <span className={styles.label}>{item.label}</span>
    </article>
  );
}

export default function VideoReel() {
  const items = useMemo(() => [...BASE_ITEMS, ...BASE_ITEMS, ...BASE_ITEMS], []);
  const [failedItems, setFailedItems] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const scrollRef = useRef(null);
  const accumRef = useRef(0);

  useEffect(() => {
    let animationFrameId;

    const autoScroll = () => {
      if (scrollRef.current && !isHovered) {
        accumRef.current += 0.5;
        if (accumRef.current >= 1) {
          const shift = Math.floor(accumRef.current);
          scrollRef.current.scrollLeft += shift;
          accumRef.current -= shift;

          // Seamless loop check: reset position when one exact set is passed
          const setWidth = scrollRef.current.scrollWidth / 3;
          if (scrollRef.current.scrollLeft >= setWidth) {
            scrollRef.current.scrollLeft -= setWidth;
          }
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const setWidth = scrollRef.current.scrollWidth / 3;
      
      // If going left and about to hit the zero edge, seamlessly pad width
      if (direction === "left" && scrollRef.current.scrollLeft < 304) {
        scrollRef.current.scrollLeft += setWidth;
      }
      
      const scrollAmount = direction === "left" ? -304 : 304; // 280px width + 24px gap
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const markFailed = (index) => {
    setFailedItems((current) => {
      if (current[index]) return current;
      return { ...current, [index]: true };
    });
  };

  return (
    <section className={styles.section} aria-label="EVAA video reel">
      <p className={styles.eyebrow}>WHAT WE BUILD</p>
      <div 
        className={styles.carouselWrapper}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button suppressHydrationWarning={true} className={`${styles.navButton} ${styles.prevButton}`} onClick={() => scroll("left")} aria-label="Previous cards">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div className={styles.viewport} ref={scrollRef}>
          <div className={styles.track}>
            {items.map((item, index) => (
              <ReelCard
                key={`${item.label}-${index}`}
                item={item}
                failed={Boolean(failedItems[index])}
                onError={() => markFailed(index)}
              />
            ))}
          </div>
        </div>

        <button suppressHydrationWarning={true} className={`${styles.navButton} ${styles.nextButton}`} onClick={() => scroll("right")} aria-label="Next cards">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </section>
  );
}
