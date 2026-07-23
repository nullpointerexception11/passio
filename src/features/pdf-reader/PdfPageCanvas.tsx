/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PdfEngine } from '../../core/pdf/PdfService';
import { HighlightService } from '../../core/highlight/HighlightService';
import { HighlightEngine, ISelectionResult } from '../../core/highlight/HighlightEngine';
import { IHighlightFragment, HighlightColor } from '../../core/highlight/HighlightModel';
import { HighlightRenderer } from '../../components/organisms/HighlightRenderer';
import { PdfTextLayerOverlay } from './PdfTextLayerOverlay';
import { HighlightToolbar } from '../../components/molecules/HighlightToolbar';
import { useTheme, PdfReadingMode } from '../../core/theme/ThemeContext';
import { AnimatePresence } from 'motion/react';

const getReadingModeStyles = (mode: PdfReadingMode) => {
  switch (mode) {
    case 'dark':
      return {
        containerBg: '#181818',
        canvasFilter: 'invert(0.88) hue-rotate(180deg) contrast(1.05) brightness(0.95)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
      };
    case 'sepia':
      return {
        containerBg: '#FAF2DC',
        canvasFilter: 'sepia(0.5) saturate(1.35) hue-rotate(-10deg) contrast(0.92) brightness(0.97)',
        borderColor: 'rgba(180, 150, 80, 0.25)',
      };
    case 'original':
    default:
      return {
        containerBg: '#FFFFFF',
        canvasFilter: 'none',
        borderColor: 'var(--color-border-subtle)',
      };
  }
};

interface PdfPageCanvasProps {
  docId: string;
  pdfDoc: pdfjsLib.PDFDocumentProxy;
  pageNumber: number;
  scale: number;
  viewMode?: 'continuous' | 'single';
  onVisible?: (pageNumber: number) => void;
}

export const PdfPageCanvas: React.FC<PdfPageCanvasProps> = ({
  docId,
  pdfDoc,
  pageNumber,
  scale,
  viewMode = 'continuous',
  onVisible,
}) => {
  const { pdfReadingMode } = useTheme();
  const modeStyles = getReadingModeStyles(pdfReadingMode);

  const containerRef = useRef<HTMLDivElement>(null);
  const pageBoxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isRendered, setIsRendered] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<number>(0.707); // A4 standard initial ratio
  const [pageHighlights, setPageHighlights] = useState<IHighlightFragment[]>([]);

  // Selection & Toolbar State
  const [pendingSelection, setPendingSelection] = useState<ISelectionResult | null>(null);
  const [selectedHighlight, setSelectedHighlight] = useState<IHighlightFragment | null>(null);
  const [toolbarPos, setToolbarPos] = useState<{ x: number; y: number } | null>(null);

  // Load and subscribe to highlights for this page
  const refreshHighlights = useCallback(() => {
    const list = HighlightService.getHighlightsForPage(docId, pageNumber);
    setPageHighlights(list);
  }, [docId, pageNumber]);

  useEffect(() => {
    refreshHighlights();
    const unsubscribe = HighlightService.subscribe(() => {
      refreshHighlights();
    });
    return () => unsubscribe();
  }, [refreshHighlights]);

  // IntersectionObserver for Lazy Page Rendering (Performance optimization for 1000+ pages)
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (onVisible) onVisible(pageNumber);
          } else {
            const bounding = entry.boundingClientRect;
            const screenHeight = window.innerHeight;
            if (Math.abs(bounding.top) > screenHeight * 3) {
              setIsVisible(false);
              setIsRendered(false);
            }
          }
        });
      },
      {
        rootMargin: '400px 0px 400px 0px',
        threshold: 0.1,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [pageNumber, onVisible]);

  // Fetch initial page dimension ratio
  useEffect(() => {
    let isMounted = true;
    pdfDoc.getPage(pageNumber).then((page) => {
      if (!isMounted) return;
      const viewport = page.getViewport({ scale: 1.0 });
      setAspectRatio(viewport.width / viewport.height);
    });
    return () => {
      isMounted = false;
    };
  }, [pdfDoc, pageNumber]);

  // Execute Canvas Render when page comes into viewport threshold
  useEffect(() => {
    if (!isVisible || !canvasRef.current) return;

    let isSubscribed = true;
    PdfEngine.renderPageToCanvas(pdfDoc, pageNumber, canvasRef.current, scale).then(() => {
      if (isSubscribed) {
        setIsRendered(true);
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, [pdfDoc, pageNumber, scale, isVisible]);

  // Mouse selection handler
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !pageBoxRef.current) {
      if (!selectedHighlight) {
        setPendingSelection(null);
        setToolbarPos(null);
      }
      return;
    }

    const result = HighlightEngine.extractNormalizedSelection(selection, pageBoxRef.current, pageNumber);
    if (result && result.rects.length > 0) {
      setSelectedHighlight(null);
      setPendingSelection(result);
      setToolbarPos({ x: result.boundingClientX, y: result.boundingClientY });
    }
  };

  const handleSelectColor = async (color: HighlightColor) => {
    if (!pendingSelection) return;

    try {
      await HighlightService.createHighlight(
        docId,
        pageNumber,
        pendingSelection.selectedText,
        pendingSelection.rects,
        color
      );
      window.getSelection()?.removeAllRanges();
      setPendingSelection(null);
      setToolbarPos(null);
    } catch {
      // Error handled in service
    }
  };

  const handleDeleteHighlight = async () => {
    if (!selectedHighlight) return;
    try {
      await HighlightService.deleteHighlight(docId, selectedHighlight.id);
      setSelectedHighlight(null);
      setToolbarPos(null);
    } catch {
      // Error handled in service
    }
  };

  const estimatedWidth = Math.floor(600 * scale);
  const estimatedHeight = Math.floor(estimatedWidth / aspectRatio);

  return (
    <div
      ref={containerRef}
      id={`pdf-page-container-${pageNumber}`}
      data-page-number={pageNumber}
      className={`relative flex flex-col items-center transition-all duration-300 ${
        viewMode === 'continuous' ? 'my-0' : 'my-6'
      }`}
      style={{
        minWidth: `${estimatedWidth}px`,
        minHeight: `${estimatedHeight}px`,
      }}
    >
      {/* Page Card Box */}
      <div
        ref={pageBoxRef}
        onMouseUp={handleMouseUp}
        className={`relative transition-all duration-300 ${
          viewMode === 'continuous'
            ? `rounded-none shadow-none border-b border-x ${pageNumber === 1 ? 'border-t' : ''}`
            : 'shadow-lg rounded-sm border'
        }`}
        style={{
          width: `${estimatedWidth}px`,
          height: `${estimatedHeight}px`,
          backgroundColor: modeStyles.containerBg,
          borderColor: modeStyles.borderColor,
        }}
      >
        {/* Canvas PDF Page Render */}
        <canvas
          ref={canvasRef}
          className={`block transition-opacity duration-300 ${
            isRendered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            filter: modeStyles.canvasFilter,
            transition: 'filter 0.25s ease-in-out',
          }}
        />

        {/* Text Selection Overlay Layer */}
        {isRendered && (
          <PdfTextLayerOverlay
            pdfDoc={pdfDoc}
            pageNumber={pageNumber}
            scale={scale}
            containerWidth={estimatedWidth}
            containerHeight={estimatedHeight}
          />
        )}

        {/* Highlight Overlays Layer */}
        {isRendered && (
          <HighlightRenderer
            highlights={pageHighlights}
            pageWidth={estimatedWidth}
            pageHeight={estimatedHeight}
            onHighlightClick={(fragment, e) => {
              e.stopPropagation();
              setSelectedHighlight(fragment);
              setPendingSelection(null);
              setToolbarPos({ x: e.clientX, y: e.clientY });
            }}
          />
        )}

        {/* Skeleton Loader during page initialization */}
        {!isRendered && (
          <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-900 animate-pulse flex flex-col p-8 gap-4 justify-between">
            <div className="w-1/3 h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="space-y-3">
              <div className="w-full h-3 bg-neutral-200 dark:bg-neutral-800 rounded" />
              <div className="w-5/6 h-3 bg-neutral-200 dark:bg-neutral-800 rounded" />
              <div className="w-4/6 h-3 bg-neutral-200 dark:bg-neutral-800 rounded" />
              <div className="w-full h-3 bg-neutral-200 dark:bg-neutral-800 rounded" />
            </div>
            <div className="w-1/4 h-3 bg-neutral-200 dark:bg-neutral-800 rounded self-center" />
          </div>
        )}
      </div>

      {/* Floating Color / Highlight Popover Toolbar */}
      <AnimatePresence>
        {toolbarPos && (pendingSelection || selectedHighlight) && (
          <HighlightToolbar
            position={toolbarPos}
            onSelectColor={handleSelectColor}
            onDelete={handleDeleteHighlight}
            isExisting={!!selectedHighlight}
          />
        )}
      </AnimatePresence>

      {/* Subtle Page Number Label (Only in single mode to preserve zero gap in continuous mode) */}
      {viewMode !== 'continuous' && (
        <span className="mt-2 text-[10px] font-mono tracking-widest text-neutral-400 select-none">
          {pageNumber}
        </span>
      )}
    </div>
  );
};

export default PdfPageCanvas;
