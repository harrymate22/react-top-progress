"use client";

import React, {
  useEffect,
  useState,
  CSSProperties,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useProgressStore } from "./progressStore";

export interface TopProgressProps {
  progress?: number;
  color?: string;
  shadow?: boolean;
  height?: number;
  background?: string;
  style?: CSSProperties;
  containerStyle?: CSSProperties;
  shadowStyle?: CSSProperties;
  transitionTime?: number;
  transitionSpeed?: number;
  loaderSpeed?: number;
  waitingTime?: number;
  easing?: string;
  className?: string;
  containerClassName?: string;
  onLoaderFinished?: () => void;
  // Legacy props for backward compatibility
  showGlow?: boolean;
  glowColor?: string;
  zIndex?: number;
}

export interface TopProgressRef {
  start: (loaderType?: "continuous" | "static") => void;
  continuousStart: (startingValue?: number, refreshRate?: number) => void;
  staticStart: (startingValue?: number) => void;
  complete: () => void;
  increase: (value: number) => void;
  decrease: (value: number) => void;
  getProgress: () => number | null;
  set: (value: number) => void;
}

export const TopProgress = forwardRef<TopProgressRef, TopProgressProps>(
  (
    {
      progress: controlledProgress,
      color = "#29D",
      shadow = true,
      height = 3,
      background = "transparent",
      style,
      containerStyle,
      shadowStyle,
      transitionTime,
      transitionSpeed = 200,
      loaderSpeed = 500,
      waitingTime = 1000,
      easing = "cubic-bezier(0.4, 0, 0.2, 1)",
      className,
      containerClassName,
      onLoaderFinished,
      showGlow,
      glowColor,
      zIndex = 9999,
    },
    ref,
  ) => {
    const store = useProgressStore();
    const [internalProgress, setInternalProgress] = useState<number | null>(
      store.getValue(),
    );
    const [mounted, setMounted] = useState(false);

    useImperativeHandle(ref, () => ({
      start: (type) => store.start(type),
      continuousStart: (s, r) => store.continuousStart(s, r),
      staticStart: (s) => store.staticStart(s),
      complete: () => store.complete(),
      increase: (v) => store.increase(v),
      decrease: (v) => store.decrease(v),
      getProgress: () => store.getProgress(),
      set: (v) => store.set(v),
    }));

    const fadeSpeed =
      transitionTime !== undefined ? transitionTime : transitionSpeed;

    useEffect(() => {
      store.config.transitionTime = fadeSpeed;
      store.config.loaderSpeed = loaderSpeed;
      store.config.waitingTime = waitingTime;
    }, [fadeSpeed, loaderSpeed, waitingTime, store]);

    useEffect(() => {
      setMounted(true);
      return store.subscribe(setInternalProgress);
    }, [store]);

    const progress =
      controlledProgress !== undefined ? controlledProgress : internalProgress;

    useEffect(() => {
      if (progress === 100 && onLoaderFinished) {
        onLoaderFinished();
      }
    }, [progress, onLoaderFinished]);

    if (!mounted || progress === null) {
      return null;
    }

    const isGradient = color.includes("gradient(");
    const backgroundStyle = isGradient
      ? { backgroundImage: color }
      : { backgroundColor: color };

    const useShadow = showGlow !== undefined ? showGlow : shadow;
    const computedGlowColor =
      glowColor || (isGradient ? "rgba(41, 216, 255, 0.4)" : color);

    return (
      <div
        className={containerClassName}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: `${height}px`,
          backgroundColor: background,
          zIndex,
          pointerEvents: "none",
          ...containerStyle,
        }}
      >
        <div
          className={className}
          style={{
            width: `${progress}%`,
            height: "100%",
            ...backgroundStyle,
            transition: `width ${loaderSpeed}ms ${easing}, opacity ${fadeSpeed}ms ease`,
            opacity: progress === 100 ? 0 : 1,
            transform: "translateZ(0)",
            ...style,
          }}
        >
          <div
            style={{
              display: useShadow ? "block" : "none",
              position: "absolute",
              right: 0,
              top: 0,
              width: 100,
              height: "100%",
              boxShadow: `0 0 10px ${computedGlowColor}, 0 0 5px ${computedGlowColor}`,
              opacity: 1,
              transform: "rotate(3deg) translate(0px, -4px)",
              ...shadowStyle,
            }}
          />
        </div>
      </div>
    );
  },
);

TopProgress.displayName = "TopProgress";
