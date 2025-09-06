/**
 * Responsive Utilities for EcoVibe Theme
 * Provides utility functions and constants for responsive design
 */

export const breakpoints = {
  xs: 400,      // Extra small phones
  sm: 576,      // Small phones  
  md: 768,      // Tablets
  lg: 992,      // Small laptops
  xl: 1200,     // Large laptops
  xxl: 1400     // Extra large screens
};

// Media query strings
export const mediaQueries = {
  xs: `(max-width: ${breakpoints.xs}px)`,
  sm: `(max-width: ${breakpoints.sm}px)`,
  md: `(max-width: ${breakpoints.md}px)`,
  lg: `(max-width: ${breakpoints.lg}px)`,
  xl: `(max-width: ${breakpoints.xl}px)`,
  
  // Min-width queries
  smUp: `(min-width: ${breakpoints.sm}px)`,
  mdUp: `(min-width: ${breakpoints.md}px)`,
  lgUp: `(min-width: ${breakpoints.lg}px)`,
  xlUp: `(min-width: ${breakpoints.xl}px)`,
  xxlUp: `(min-width: ${breakpoints.xxl}px)`,
  
  // Range queries
  smOnly: `(min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.md - 1}px)`,
  mdOnly: `(min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`,
  lgOnly: `(min-width: ${breakpoints.lg}px) and (max-width: ${breakpoints.xl - 1}px)`,
  xlOnly: `(min-width: ${breakpoints.xl}px) and (max-width: ${breakpoints.xxl - 1}px)`,
  
  // Orientation
  landscape: '(orientation: landscape)',
  portrait: '(orientation: portrait)',
  
  // Special cases
  mobileLandscape: '(max-height: 500px) and (orientation: landscape)',
  retina: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  darkMode: '(prefers-color-scheme: dark)'
};

/**
 * Get current screen size category
 * @param {number} width - Current window width
 * @returns {string} - Screen size category
 */
export const getScreenSize = (width) => {
  if (width <= breakpoints.xs) return 'xs';
  if (width <= breakpoints.sm) return 'sm';
  if (width <= breakpoints.md) return 'md';
  if (width <= breakpoints.lg) return 'lg';
  if (width <= breakpoints.xl) return 'xl';
  return 'xxl';
};

/**
 * Check if screen is mobile
 * @param {number} width - Current window width
 * @returns {boolean}
 */
export const isMobile = (width) => width <= breakpoints.md;

/**
 * Check if screen is tablet
 * @param {number} width - Current window width
 * @returns {boolean}
 */
export const isTablet = (width) => width > breakpoints.md && width <= breakpoints.lg;

/**
 * Check if screen is desktop
 * @param {number} width - Current window width
 * @returns {boolean}
 */
export const isDesktop = (width) => width > breakpoints.lg;

/**
 * Hook to get current window dimensions
 * Usage: const { width, height } = useWindowDimensions();
 */
export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
};

/**
 * Hook to get current screen size category
 * Usage: const screenSize = useScreenSize();
 */
export const useScreenSize = () => {
  const { width } = useWindowDimensions();
  return getScreenSize(width);
};

/**
 * Responsive spacing values
 */
export const spacing = {
  xs: {
    padding: '12px',
    margin: '8px',
    gap: '8px'
  },
  sm: {
    padding: '16px',
    margin: '12px',
    gap: '12px'
  },
  md: {
    padding: '20px',
    margin: '16px',
    gap: '16px'
  },
  lg: {
    padding: '24px',
    margin: '20px',
    gap: '20px'
  },
  xl: {
    padding: '32px',
    margin: '24px',
    gap: '24px'
  }
};

/**
 * Responsive font sizes
 */
export const fontSizes = {
  xs: {
    h1: '20px',
    h2: '18px',
    h3: '16px',
    body: '14px',
    small: '12px'
  },
  sm: {
    h1: '22px',
    h2: '20px',
    h3: '18px',
    body: '14px',
    small: '12px'
  },
  md: {
    h1: '28px',
    h2: '24px',
    h3: '20px',
    body: '16px',
    small: '14px'
  },
  lg: {
    h1: '32px',
    h2: '28px',
    h3: '24px',
    body: '16px',
    small: '14px'
  },
  xl: {
    h1: '36px',
    h2: '32px',
    h3: '28px',
    body: '18px',
    small: '16px'
  }
};

/**
 * Generate responsive CSS classes
 */
export const generateResponsiveCSS = () => {
  return `
    /* Responsive Utility Classes */
    .container-responsive {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    @media ${mediaQueries.sm} {
      .container-responsive { padding: 0 16px; }
      .hide-mobile { display: none !important; }
      .show-mobile { display: block !important; }
    }
    
    @media ${mediaQueries.mdUp} {
      .hide-desktop { display: none !important; }
      .show-desktop { display: block !important; }
    }
    
    /* Responsive spacing */
    @media ${mediaQueries.xs} {
      .spacing-responsive { padding: ${spacing.xs.padding}; }
    }
    
    @media ${mediaQueries.sm} {
      .spacing-responsive { padding: ${spacing.sm.padding}; }
    }
    
    @media ${mediaQueries.mdUp} {
      .spacing-responsive { padding: ${spacing.md.padding}; }
    }
    
    @media ${mediaQueries.lgUp} {
      .spacing-responsive { padding: ${spacing.lg.padding}; }
    }
    
    @media ${mediaQueries.xlUp} {
      .spacing-responsive { padding: ${spacing.xl.padding}; }
    }
  `;
};

export default {
  breakpoints,
  mediaQueries,
  getScreenSize,
  isMobile,
  isTablet,
  isDesktop,
  useWindowDimensions,
  useScreenSize,
  spacing,
  fontSizes,
  generateResponsiveCSS
};
