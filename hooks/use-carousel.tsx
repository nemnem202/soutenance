import { useRef, useState } from "react";

export default function useCarousel() {
  const [isLastItemVisible, setIsLastItemVisible] = useState(false);
  const [itemIndex, setItemIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isScrollingRef = useRef(false);

  const updateIndex = () => {
    const container = containerRef.current;
    if (!container || widgetsRef.current.length === 0) return;

    const scrollLeft = container.scrollLeft;

    const itemWidth = widgetsRef.current[0]?.offsetWidth || 0;
    const gap = 34;

    const newIndex = Math.round(scrollLeft / (itemWidth + gap));

    setItemIndex(newIndex);
  };

  const scrollToIndex = (index: number) => {
    const container = containerRef.current;
    const target = widgetsRef.current[index];

    if (!container || !target) return;

    isScrollingRef.current = true;
    setItemIndex(index);

    container.scrollTo({
      left: target.offsetLeft,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    if (!isScrollingRef.current) {
      updateIndex();
    }
  };

  const handleScrollEnd = () => {
    isScrollingRef.current = false;
    updateIndex();
  };

  return {
    isLastItemVisible,
    itemIndex,
    containerRef,
    widgetsRef,
    isScrollingRef,
    scrollToIndex,
    handleScroll,
    handleScrollEnd,
    setIsLastItemVisible,
  };
}
