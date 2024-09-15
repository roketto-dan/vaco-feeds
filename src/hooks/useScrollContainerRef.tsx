import { useCallback, useEffect, useRef, type DependencyList, type RefCallback } from "react";

type UseScrollContainerRefHandler = (element: HTMLElement | null) => void | (() => void);

export default function useScrollContainerRef(handler: UseScrollContainerRefHandler, deps: DependencyList = []): RefCallback<HTMLElement>  {
  const cleanUpRef = useRef<ReturnType<UseScrollContainerRefHandler>>();

  useEffect(() => {
    return () => {
      cleanUpRef.current?.();
    };
  }, deps);

  return useCallback((element) => {
    cleanUpRef.current = handler(findScrollContainer(element));
  }, deps);
}

function findScrollContainer(element: HTMLElement | null): HTMLElement | null {
  if (element == null) {
    return null;
  }

  let parent = element.parentElement;

  while (parent) {
    const { overflow } = window.getComputedStyle(parent);
    if (overflow.split(' ').every(overflow => overflow === 'auto' || overflow === 'scroll')) {
      return parent;
    }
    parent = parent.parentElement;
  }

  return document.documentElement;
};
