import { useEffect, useState, useRef } from "react";

type FocusingProps = {
  children: string;
};

export function Focusing(props: FocusingProps) {
  const { children } = props;

  const [isFocusing, setIsFocusing] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current == null) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          setIsFocusing(entry.isIntersecting);
        });
      },
      {
        rootMargin: "0px 0px -55%",
        threshold: [...Array(100)].map((_, index) => index / 100),
      },
    );
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return <span ref={ref}>{isFocusing ? children : null}</span>;
}
