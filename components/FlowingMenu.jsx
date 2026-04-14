"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./FlowingMenu.module.css";

const ITEMS = [
  {
    id: 1,
    label: "Avatar Agents",
    sub: "AI THAT LOOKS HUMAN",
    image: "/media/avatar-agents.gif",
    video: "/media/avatar-agents.mp4"
  },
  {
    id: 2,
    label: "Enterprise AI",
    sub: "REBUILT FROM GROUND UP",
    image: "/media/enterprise-ai.gif",
    video: "/media/enterprise-ai.mp4"
  },
  {
    id: 3,
    label: "Research",
    sub: "GLOBAL SOUTH & HEALTH AI",
    image: "/media/research.gif",
    video: "/media/research.mp4"
  },
  {
    id: 4,
    label: "Ventures",
    sub: "WHAT WE ARE BUILDING",
    image: "/media/ventures.gif",
    video: "/media/ventures.mp4"
  }
];

function MenuItem({ item, isActive, onActivate, onVideoOpen }) {
  const [hovered, setHovered] = useState(false);
  const touchState = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0
  });

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    onActivate(item.id);

    touchState.current = {
      active: true,
      moved: false,
      startX: touch.clientX,
      startY: touch.clientY
    };
  };

  const handleTouchMove = (event) => {
    const touch = event.touches[0];
    if (!touch || !touchState.current.active) return;

    const deltaX = Math.abs(touch.clientX - touchState.current.startX);
    const deltaY = Math.abs(touch.clientY - touchState.current.startY);

    if (deltaX > 10 || deltaY > 10) {
      touchState.current.moved = true;
      onActivate(item.id);
    }
  };

  const handleTouchEnd = () => {
    touchState.current.active = false;

    if (window.innerWidth < 769) {
      onActivate(item.id);
      return;
    }

    const shouldOpen = !touchState.current.moved;
    touchState.current.moved = false;

    if (shouldOpen) {
      onVideoOpen(item);
    }
  };

  const handleClick = () => {
    if (window.innerWidth < 769) {
      if (touchState.current.moved) {
        touchState.current.moved = false;
        return;
      }

      onVideoOpen(item);
      return;
    }

    if (touchState.current.moved) {
      touchState.current.moved = false;
      return;
    }

    onVideoOpen(item);
  };

  return (
    <button
      type="button"
      className={`${styles.row} ${hovered ? styles.rowHovered : ""} ${isActive ? styles.rowActive : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => {
        touchState.current.active = false;
        touchState.current.moved = false;
      }}
      onClick={handleClick}
      suppressHydrationWarning
    >
      <div className={styles.rowStatic}>
        <span className={styles.num}>0{item.id}</span>
        <span className={styles.label}>{item.label}</span>
        <span className={styles.sub}>{item.sub}</span>
        <span className={styles.arrow}>→</span>
      </div>

      <div className={styles.rowMarquee}>
        <div className={styles.marqueeTrack}>
          {Array(8)
            .fill(null)
            .map((_, index) => (
              <span key={index} className={styles.marqueeUnit}>
                <span className={styles.marqueeLabel}>{item.label}</span>
                <span className={styles.marqueeImgWrap} aria-hidden="true">
                  <img
                    className={styles.marqueeImg}
                    src={item.image}
                    alt=""
                  />
                  <span className={styles.marqueeCaption}>{item.sub}</span>
                </span>
              </span>
            ))}
        </div>
      </div>
    </button>
  );
}

export default function FlowingMenu() {
  const [modalItem, setModalItem] = useState(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [activeItemId, setActiveItemId] = useState(null);
  const activeTimerRef = useRef(null);

  useEffect(() => {
    if (!modalItem) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setModalItem(null);
        setVideoFailed(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [modalItem]);

  useEffect(() => {
    return () => {
      if (activeTimerRef.current) {
        window.clearTimeout(activeTimerRef.current);
      }
    };
  }, []);

  const activateItem = (id) => {
    setActiveItemId(id);

    if (activeTimerRef.current) {
      window.clearTimeout(activeTimerRef.current);
    }

    activeTimerRef.current = window.setTimeout(() => {
      setActiveItemId(null);
      activeTimerRef.current = null;
    }, 1400);
  };

  const openVideo = (item) => {
    setVideoFailed(false);
    setModalItem(item);
  };

  const closeVideo = () => {
    setModalItem(null);
    setVideoFailed(false);
  };

  return (
    <>
      <section className={styles.section}>
        {ITEMS.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            isActive={activeItemId === item.id}
            onActivate={activateItem}
            onVideoOpen={openVideo}
          />
        ))}
      </section>

      {modalItem && (
        <div className={styles.overlay} onClick={closeVideo}>
          <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeVideo}>
              X
            </button>
            {!videoFailed ? (
              <video
                src={modalItem.video}
                autoPlay
                controls
                className={styles.modalVideo}
                onError={() => setVideoFailed(true)}
              />
            ) : (
              <div className={styles.modalPlaceholder}>
                <p>{modalItem.label}</p>
                <span>{modalItem.sub}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
