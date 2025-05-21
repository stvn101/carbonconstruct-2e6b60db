
import * as React from "react"

const MOBILE_BREAKPOINT = 640 // Using Tailwind's sm breakpoint

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Initial check
    checkScreenSize()

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize)

    // Clean up event listener
    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  return { isMobile }
}
