/**
 * EcoVibe Theme Configuration
 * 🌿 Sustainable Second-Hand Marketplace Theme
 */

export const theme = {
  colors: {
    // Primary Colors
    primary: {
      ecoGreen: '#27AE60',      // 🌿 Eco Green - Primary buttons, highlights, accents
      mintGreen: '#A8E6CF',     // 🌱 Mint Green - Secondary accents, hover states
    },
    
    // Neutral Colors
    neutral: {
      pureWhite: '#FFFFFF',     // ⚪ Pure White - Background for clean look
      charcoalBlack: '#2C3E50', // ⚫ Charcoal Black - Primary text color
      softGray: '#ECF0F1',      // 🌤️ Soft Gray - Card backgrounds, placeholders, dividers
      lightGray: '#7F8C8D',     // Secondary text
      accentGray: '#95A5A6',    // Placeholder text
    },
    
    // Semantic Colors
    semantic: {
      success: '#27AE60',
      successLight: '#A8E6CF',
      error: '#E74C3C',
      errorLight: '#FFE6E6',
      warning: '#F39C12',
      warningLight: '#FFF3CD',
      info: '#3498DB',
      infoLight: '#D1ECF1',
    },
    
    // Gradients
    gradients: {
      primary: 'linear-gradient(135deg, #27AE60, #2ECC71)',
      primaryHover: 'linear-gradient(135deg, #229954, #27AE60)',
      card: 'linear-gradient(135deg, #A8E6CF, #27AE60, #A8E6CF)',
      error: 'linear-gradient(135deg, #FFE6E6, #FFF0F0)',
      shimmer: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    }
  },
  
  typography: {
    fonts: {
      heading: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    
    sizes: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '28px',
      '4xl': '32px',
    },
    
    lineHeights: {
      tight: 1.3,
      normal: 1.6,
      relaxed: 1.8,
    }
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '40px',
    '5xl': '48px',
    '6xl': '64px',
  },
  
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '50%',
  },
  
  shadows: {
    sm: '0 2px 8px rgba(39, 174, 96, 0.05)',
    md: '0 4px 16px rgba(39, 174, 96, 0.1)',
    lg: '0 8px 32px rgba(39, 174, 96, 0.08)',
    xl: '0 12px 40px rgba(39, 174, 96, 0.12)',
    button: '0 4px 16px rgba(39, 174, 96, 0.2)',
    buttonHover: '0 6px 20px rgba(39, 174, 96, 0.3)',
  },
  
  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },
  
  breakpoints: {
    xs: '320px',
    sm: '480px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  }
};

// CSS Custom Properties Generator
export const generateCSSVars = () => {
  const cssVars = {};
  
  // Colors
  Object.entries(theme.colors).forEach(([category, colors]) => {
    if (typeof colors === 'object') {
      Object.entries(colors).forEach(([name, value]) => {
        cssVars[`--color-${category}-${name.replace(/([A-Z])/g, '-$1').toLowerCase()}`] = value;
      });
    } else {
      cssVars[`--color-${category}`] = colors;
    }
  });
  
  // Spacing
  Object.entries(theme.spacing).forEach(([name, value]) => {
    cssVars[`--spacing-${name}`] = value;
  });
  
  // Border Radius
  Object.entries(theme.borderRadius).forEach(([name, value]) => {
    cssVars[`--radius-${name}`] = value;
  });
  
  return cssVars;
};

// Component Style Helpers
export const styleHelpers = {
  // Button variants
  button: {
    primary: {
      background: theme.colors.gradients.primary,
      color: theme.colors.neutral.pureWhite,
      border: 'none',
      borderRadius: theme.borderRadius.md,
      padding: `${theme.spacing.lg} ${theme.spacing['2xl']}`,
      fontFamily: theme.typography.fonts.heading,
      fontWeight: theme.typography.weights.semibold,
      fontSize: theme.typography.sizes.base,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      cursor: 'pointer',
      transition: theme.transitions.normal,
      boxShadow: theme.shadows.button,
    },
    
    secondary: {
      background: 'transparent',
      color: theme.colors.primary.ecoGreen,
      border: `2px solid ${theme.colors.primary.ecoGreen}`,
      borderRadius: theme.borderRadius.md,
      padding: `${theme.spacing.lg} ${theme.spacing['2xl']}`,
      fontFamily: theme.typography.fonts.heading,
      fontWeight: theme.typography.weights.semibold,
      fontSize: theme.typography.sizes.base,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      cursor: 'pointer',
      transition: theme.transitions.normal,
    }
  },
  
  // Card styles
  card: {
    base: {
      background: theme.colors.neutral.pureWhite,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing['4xl'],
      boxShadow: theme.shadows.lg,
      border: `1px solid rgba(168, 230, 207, 0.3)`,
      transition: theme.transitions.normal,
    }
  },
  
  // Input styles
  input: {
    base: {
      width: '100%',
      padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
      margin: `${theme.spacing.md} 0`,
      borderRadius: theme.borderRadius.md,
      border: `2px solid ${theme.colors.neutral.softGray}`,
      background: theme.colors.neutral.pureWhite,
      color: theme.colors.neutral.charcoalBlack,
      fontFamily: theme.typography.fonts.body,
      fontSize: theme.typography.sizes.base,
      fontWeight: theme.typography.weights.regular,
      transition: theme.transitions.normal,
      outline: 'none',
    }
  }
};

export default theme;
