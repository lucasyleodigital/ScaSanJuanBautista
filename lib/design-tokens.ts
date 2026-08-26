/** Design tokens centralizados para SCA San Juan Bautista Peñolite
 * Paleta: Verde oliva + Oro + Crema + Negro
 */

export const colors = {
  // Base
  negro: "#060D03",
  crema: "#F5F1E8",

  // Verde
  verdeOscuro: "#2D4A2B",
  verdeOliva: "#243D0F",

  // Dorado
  dorado: "#C8961E",
  doradoSuave: "rgba(200, 150, 30, 0.12)",

  // Textos
  txCrema: "#F0E8CC",
  txMedio: "rgba(240, 232, 204, 0.6)",
  txBajo: "rgba(240, 232, 204, 0.35)",
  txOscuro: "#1A1910",

  // UI
  rule: "rgba(200, 150, 30, 0.2)",
  overlay: "rgba(6, 13, 3, 0.9)",
};

export const typography = {
  fontSerif: '"EB Garamond", Georgia, serif',
  fontSans: '"Inter", "Helvetica Neue", Arial, sans-serif',
  fontMono: '"Fira Code", monospace',
};

export const motion = {
  // Easing - Emil Kowalski inspired
  easeSnappy: "cubic-bezier(0.34, 1.56, 0.64, 1)", // Playful entrance, bouncy
  easeResponsive: "cubic-bezier(0.23, 1, 0.32, 1)", // Instant feedback, high energy
  easeSmooth: "cubic-bezier(0.43, 0.13, 0.23, 0.96)", // Micro-interactions
  easeDivine: "cubic-bezier(0.22, 1, 0.36, 1)", // Section entrance
  easeExitSlow: "cubic-bezier(0.83, 0, 0.16, 1)", // Dramatic exit
  easeDrawer: "cubic-bezier(0.32, 0.72, 0, 1)", // iOS-like drawer

  // Duraciones (ms)
  durationPress: 100, // Button :active
  durationQuick: 200, // Tooltips
  durationStd: 600, // Default UI
  durationMedium: 1000, // Sections
  durationSlow: 1500, // Cinematographic
  durationXL: 1800, // Extra slow
  durationXSlow: 2000, // Cierre épica

  // Stagger (ms)
  staggerTight: 50,
  staggerNormal: 75,
  staggerLoose: 100,

  // Scroll trigger
  scrollSnapEnabled: true,
  reducedMotionFallback: true,
};

export const spacing = {
  xs: "8px",
  sm: "16px",
  md: "24px",
  lg: "32px",
  xl: "48px",
  xxl: "64px",
  xxxl: "80px",
  huge: "96px",
};

export const layout = {
  containerMaxWidth: "1280px",
  contentMaxWidth: "900px",
  mobileBreak: "768px",
  tabletBreak: "1024px",
};

export const shadows = {
  soft: "0 4px 12px rgba(0, 0, 0, 0.15)",
  medium: "0 8px 24px rgba(0, 0, 0, 0.2)",
  strong: "0 16px 40px rgba(0, 0, 0, 0.3)",
};

// Media query helpers
export const media = {
  mobile: "@media (max-width: 767px)",
  tablet: "@media (max-width: 1023px)",
  desktop: "@media (min-width: 1024px)",
};
