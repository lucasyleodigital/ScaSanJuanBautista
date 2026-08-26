// Easing curves inspired by Emil Kowalski's design engineering philosophy
// @see animations.dev

export const EASING = {
  // UI Interactions — responsive and snappy
  snappy: "cubic-bezier(0.34, 1.56, 0.64, 1)", // Playful entrance, bouncy
  responsive: "cubic-bezier(0.23, 1, 0.32, 1)", // Instant feedback, high energy
  smooth: "cubic-bezier(0.43, 0.13, 0.23, 0.96)", // Micro-interactions, subtle
  divine: "cubic-bezier(0.22, 1, 0.36, 1)", // Section entrance, elegant

  // Special curves
  exitSlow: "cubic-bezier(0.83, 0, 0.16, 1)", // Dramatic exit
  drawer: "cubic-bezier(0.32, 0.72, 0, 1)", // iOS-like drawer motion
};

export const DURATION = {
  press: 100, // Button :active feedback (scale 0.97)
  quick: 200, // Tooltips, small popovers
  standard: 600, // Default UI elements, cards
  medium: 1000, // Section entrances, medium animations
  slow: 1500, // Cinematographic, dramatic moments
  xslow: 2000, // Extra slow (cierre épica)
};

export const STAGGER = {
  tight: 50, // Quick cascade (50ms between items)
  normal: 75, // Default stagger (75ms between items)
  loose: 100, // Slow cascade (100ms between items)
};

// Accessibility: prefers-reduced-motion
export const shouldReduceMotion = (context?: any): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Get safe easing — returns null if motion is reduced (to disable animation)
export const getEasing = (easing: string): string | null => {
  return shouldReduceMotion() ? null : easing;
};

// Get safe duration — reduces to minimum if motion is reduced
export const getSafeDuration = (duration: number): number => {
  return shouldReduceMotion() ? 0 : duration;
};
