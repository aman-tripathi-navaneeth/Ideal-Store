import React, { useState, useEffect } from "react";
import {
  isMobileViewport,
  isTabletViewport,
  isDesktopViewport,
  addViewportChangeListener,
} from "../utils/deviceDetection";

function ViewportDemo() {
  const [viewportInfo, setViewportInfo] = useState({
    width: window.innerWidth,
    isMobile: isMobileViewport(),
    isTablet: isTabletViewport(),
    isDesktop: isDesktopViewport(),
  });

  useEffect(() => {
    const cleanup = addViewportChangeListener((info) => {
      setViewportInfo({
        width: info.viewportWidth,
        isMobile: info.isMobile,
        isTablet: info.isTablet,
        isDesktop: info.isDesktop,
      });
    });

    return cleanup;
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "12px",
        zIndex: 1000,
      }}
    >
      <div>
        <strong>Viewport Info:</strong>
      </div>
      <div>Width: {viewportInfo.width}px</div>
      <div>Mobile: {viewportInfo.isMobile ? "✅" : "❌"}</div>
      <div>Tablet: {viewportInfo.isTablet ? "✅" : "❌"}</div>
      <div>Desktop: {viewportInfo.isDesktop ? "✅" : "❌"}</div>
      <div style={{ marginTop: "5px", fontSize: "10px", opacity: 0.7 }}>
        Resize browser to test
      </div>
    </div>
  );
}

export default ViewportDemo;
