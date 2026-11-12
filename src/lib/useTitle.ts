import { useEffect } from "react";

const DEFAULT_TITLE = "Орбита — первая работа для студентов";

export function useTitle(title: string) {
  useEffect(() => {
    document.title = `${title} — Орбита`;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title]);
}
