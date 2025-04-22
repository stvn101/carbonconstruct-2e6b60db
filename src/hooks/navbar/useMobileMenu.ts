
import { useEffect, useCallback, useRef } from "react";

export function useMobileMenu(isMenuOpen: boolean, setIsMenuOpen: (open: boolean) => void) {
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    // Check if click is outside both the menu and toggle button
    if (
      !target.closest(".mobile-menu-container") &&
      !target.closest(".mobile-menu-button")
    ) {
      setIsMenuOpen(false);
    }
  }, [setIsMenuOpen]);

  const handleEscapeKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isMenuOpen, setIsMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;
    
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isMenuOpen, handleClickOutside, handleEscapeKey]);

  return menuRef;
}
