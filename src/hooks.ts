"use client";

import { useEffect } from "react";
import { startProgress, finishProgress } from "./progressStore";

export const useAutoProgress = () => {
  useEffect(() => {
    startProgress();
    return () => {
      finishProgress();
    };
  }, []);
};

export const useRouteProgress = () => {
  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.currentTarget as HTMLAnchorElement;

      if (
        !target.href ||
        target.target === "_blank" ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        target.hasAttribute("download")
      ) {
        return;
      }

      try {
        const targetUrl = new URL(target.href);
        const currentUrl = new URL(window.location.href);

        if (
          targetUrl.origin === currentUrl.origin &&
          targetUrl.pathname !== currentUrl.pathname
        ) {
          startProgress();
        }
      } catch (err) {
      }
    };

    const handleMutation = () => {
      const anchors = document.querySelectorAll("a[href]");
      anchors.forEach((anchor) => {
        anchor.removeEventListener("click", handleAnchorClick as any);
        anchor.addEventListener("click", handleAnchorClick as any);
      });
    };

    const mutationObserver = new MutationObserver(handleMutation);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    handleMutation();

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      finishProgress();
      return originalPushState.apply(this, args);
    };

    window.history.replaceState = function (...args) {
      finishProgress();
      return originalReplaceState.apply(this, args);
    };

    const handlePopState = () => {
      finishProgress();
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      mutationObserver.disconnect();
      const anchors = document.querySelectorAll("a[href]");
      anchors.forEach((anchor) => {
        anchor.removeEventListener("click", handleAnchorClick as any);
      });
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
};
