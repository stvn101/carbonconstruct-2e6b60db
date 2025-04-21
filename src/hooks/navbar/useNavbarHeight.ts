
import { useEffect } from "react";

export function useNavbarHeight(height: string = "64px") {
  useEffect(() => {
    document.documentElement.style.setProperty("--navbar-height", height);
  }, [height]);
}
