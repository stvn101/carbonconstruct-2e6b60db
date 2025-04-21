
import { useEffect, useCallback } from "react";

export function useMobileMenu(isMenuOpen: boolean, setIsMenuOpen: (open: boolean) => void) {
  const handleClickOutside = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      !target.closest(".mobile-menu-container") &&
      !target.closest(".mobile-menu-button")
    ) {
      setIsMenuOpen(false);
    }
  }, [setIsMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen, handleClickOutside]);
}
