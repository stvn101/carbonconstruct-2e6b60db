
import { useState } from "react";

export const SkipToContent = () => {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const main = document.querySelector("main");
    if (main) {
      main.setAttribute("tabindex", "-1");
      main.focus();
      // Remove tabindex after focus to prevent keyboard trap
      setTimeout(() => main.removeAttribute("tabindex"), 1000);
    }
  };

  return (
    <a
      href="#main-content"
      className={`
        fixed top-4 left-4 z-50 transform transition-transform
        bg-carbon-600 text-white px-4 py-3 rounded-md shadow-md
        focus:outline-none focus:ring-2 focus:ring-carbon-400 focus:ring-offset-2
        ${focused ? "translate-y-0" : "-translate-y-20"}
      `}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
    >
      Skip to content
    </a>
  );
};

export default SkipToContent;
