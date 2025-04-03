
// Animation variants shared across components
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export const dashboardVariants = {
  initial: { opacity: 0, scale: 0.9, rotate: -1 },
  animate: { 
    opacity: 1, 
    scale: 1,
    rotate: -1,
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  }
};
