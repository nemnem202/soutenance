"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type Dispatch, type ReactNode, type SetStateAction, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// const ROTATION_ANGLE_OPEN = 180;
const DROPDOWN_OFFSET = 4;

export interface DropdownItem {
  id: string | number;
  label: string;
  icon?: React.ReactNode;
}

export interface BasicDropdownProps {
  label: string;
  items: DropdownItem[];
  onItemClick?: (item: DropdownItem) => void;
  onFocusChange?: (item: DropdownItem | null) => void;
  className?: string;
  children: ReactNode;
  closeOnClickOutside?: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
}

export default function BasicDropdown({
  // label,
  items,
  onItemClick,
  onFocusChange,
  className = "",
  children,
  closeOnClickOutside = true,
  isOpen,
  setIsOpen,
}: BasicDropdownProps) {
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerReg = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const shouldReduceMotion = useReducedMotion();

  const handleItemSelect = (item: DropdownItem | null) => {
    setSelectedItem(item);
    setIsOpen(false);
    onFocusChange?.(item);
  };

  const handleToggle = () => {
    if (!isOpen && triggerReg.current) {
      const rect = triggerReg.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + DROPDOWN_OFFSET,
        left: rect.left,
        width: rect.width,
      });
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (!(isOpen && triggerReg.current)) {
      return;
    }

    const updatePosition = () => {
      if (triggerReg.current) {
        const rect = triggerReg.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + DROPDOWN_OFFSET,
          left: rect.left,
          width: rect.width,
        });
      }
    };

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!closeOnClickOutside) return;
      const target = event.target as Node;
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        portalRef.current &&
        !portalRef.current.contains(target)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeOnClickOutside, setIsOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) {
        if ((event.key === "Enter" || event.key === " ") && document.activeElement === triggerReg.current) {
          event.preventDefault();
          handleToggle();
        }
        return;
      }

      if (event.key === "Escape") {
        setIsOpen(false);
        setFocusedIndex(-1);
        triggerReg.current?.focus();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setFocusedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
      } else if (event.key === "Enter" && focusedIndex >= 0) {
        event.preventDefault();
        const item = items[focusedIndex];
        if (item) {
          handleItemSelect(item);
        }
      } else if (event.key === "Home") {
        event.preventDefault();
        setFocusedIndex(0);
      } else if (event.key === "End") {
        event.preventDefault();
        setFocusedIndex(items.length - 1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, items, focusedIndex, handleItemSelect, handleToggle]);

  useEffect(() => {
    setFocusedIndex(-1);
  }, []);

  useEffect(() => {
    if (focusedIndex >= 0) {
      const focusedItem = items[focusedIndex];
      onFocusChange?.(focusedItem);
    }
  }, [focusedIndex, items, onFocusChange]);

  const dropdownContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          ref={portalRef}
          onMouseLeave={() => {
            setFocusedIndex(-1);
            handleItemSelect(null);
          }}
        >
          <motion.div
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scaleY: 1 }}
            className="fixed z-50 origin-top rounded-lg border bg-background shadow-lg"
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : {
                    opacity: 0,
                    y: -10,
                    scaleY: 0.8,
                    transition: { duration: 0.15 },
                  }
            }
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -10, scaleY: 0.8 }}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: `${position.width}px`,
            }}
            transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", bounce: 0.1, duration: 0.25 }}
          >
            <ul aria-label="Dropdown options" className="p-2" id="dropdown-items">
              {items.map((item, index) => (
                <motion.li
                  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                  aria-selected={selectedItem?.id === item.id || index === focusedIndex}
                  className="block"
                  exit={shouldReduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, x: -20 }}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -20 }}
                  key={item.id}
                  role="option"
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : {
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                          duration: 0.2,
                        }
                  }
                  // whileHover={shouldReduceMotion ? {} : { x: 2, width: "calc(100% - 5px)" }}
                >
                  <button
                    aria-label={item.label}
                    className={`flex min-h-[44px] w-full items-center px-4 py-2 text-left text-sm transition-colors cursor-pointer hover:bg-muted focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded text-muted-foreground ${
                      selectedItem?.id === item.id ? "font-medium text-brand" : ""
                    } ${index === focusedIndex ? "bg-muted" : ""}`}
                    onClick={() => {
                      handleItemSelect(item);
                      onItemClick?.(item);
                    }}
                    onMouseEnter={() => setFocusedIndex(index)}
                    type="button"
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div className={`relative inline-block ${className}`} ref={dropdownRef}>
        <div className="" ref={triggerReg} onClick={handleToggle}>
          {children}
        </div>
      </div>
      {typeof window !== "undefined" ? createPortal(dropdownContent, document.body) : null}
    </>
  );
}
