"use client";

import { useEffect, useState } from "react";
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

function MenuItem({ item, onVideoOpen }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      className={`${styles.row} ${hovered ? styles.rowHovered : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onVideoOpen(item)}
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
          <MenuItem key={item.id} item={item} onVideoOpen={openVideo} />
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
