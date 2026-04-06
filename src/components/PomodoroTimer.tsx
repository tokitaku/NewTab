import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "@/styles/Home.module.css";

export const PomodoroTimer: React.FC = () => {
  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");
  const [permission, setPermission] = useState<NotificationPermission>("default");

  // Use a ref to store the AudioContext instance
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
    }
  };

  const initAudio = () => {
    try {
      if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          audioContextRef.current = new AudioContext();
        }
      }

      // Resume context if it was suspended (browser policy)
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    } catch (e) {
      console.error("Audio initialization failed", e);
    }
  };

  const playNotificationSound = () => {
    try {
      const audioContext = audioContextRef.current;
      if (!audioContext) return;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      console.error("Audio play failed", e);
    }
  };

  const showNotification = useCallback(() => {
    if (permission === "granted") {
      new Notification("Time's up!", {
        body: mode === "work" ? "Take a break!" : "Time to work!",
        icon: "/images/iconmonstr-plus.png", // Assuming this exists based on index.tsx
      });
    }
    playNotificationSound();
  }, [permission, mode]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      showNotification();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, showNotification]);

  const toggleTimer = () => {
    // Initialize audio on first user interaction to satisfy browser policies
    initAudio();

    if (!isActive && permission === "default") {
      requestNotificationPermission();
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === "work" ? WORK_TIME : BREAK_TIME);
  };

  const switchMode = (newMode: "work" | "break") => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === "work" ? WORK_TIME : BREAK_TIME);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className={styles.pomodoroContainer}>
      <div className={styles.pomodoroModes}>
        <button
          className={`${styles.modeButton} ${
            mode === "work" ? styles.activeMode : ""
          }`}
          onClick={() => switchMode("work")}
        >
          Work
        </button>
        <button
          className={`${styles.modeButton} ${
            mode === "break" ? styles.activeMode : ""
          }`}
          onClick={() => switchMode("break")}
        >
          Break
        </button>
      </div>
      <div className={styles.timerDisplay}>{formatTime(timeLeft)}</div>
      <div className={styles.pomodoroControls}>
        <button className={styles.controlButton} onClick={toggleTimer}>
          {isActive ? "Pause" : "Start"}
        </button>
        <button className={styles.controlButton} onClick={resetTimer}>
          Reset
        </button>
      </div>
    </div>
  );
};
