"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const modalSizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-4xl",
};

const ModalContext = React.createContext<HTMLDivElement | null>(null);
export const useModalContainer = () => React.useContext(ModalContext);

export default function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  // useOnClickOutside(modalRef, () => onClose());
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const titleId = title ? `modal-title-${Math.random().toString(36).substring(2, 9)}` : undefined;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement;

      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    } else if (previousActiveElementRef.current) {
      previousActiveElementRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements.at(-1);

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empeche React de propager l'event aux composants parents
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            onClick={handleBackdropClick}
            className="fixed inset-0 z-[80] bg-background/70 backdrop-blur-sm "
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[90] flex items-center justify-center pointer-events-none ">
            <motion.div
              onClick={(e) => e.stopPropagation()}
              aria-labelledby={titleId}
              aria-modal="true"
              className={`${modalSizes[size]} relative mx-auto w-fit overflow-hidden md:w-full rounded-xl border bg-card shadow-xl  pointer-events-auto `}
              ref={modalRef}
              role="dialog"
              animate={shouldReduceMotion ? {} : { scale: 1, y: 0, opacity: 1 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0, transition: { duration: 0 } }
                  : {
                      scale: 0.95,
                      y: 10,
                      opacity: 0,
                      transition: { duration: 0.15 },
                    }
              }
              initial={shouldReduceMotion ? { opacity: 1 } : { scale: 0.95, y: 10, opacity: 0 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      type: "spring",
                      damping: 25,
                      stiffness: 300,
                      duration: 0.25,
                    }
              }
            >
              <ModalContext.Provider value={modalRef.current}>
                <div className="relative max-h-[90vh] overflow-y-auto p-4 sm:p-6">{children}</div>
              </ModalContext.Provider>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  if (!mounted) {
    return null;
  }

  return createPortal(modalContent, document.body);
}
