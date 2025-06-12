import { Platform } from 'react-native';

// Modern fintech color palette
export const colors = {
    // Primary brand colors
    primary: {
        50: '#ECFDF5',
        100: '#D1FAE5',
        500: '#10B981', // Main brand color
        600: '#059669',
        700: '#047857',
        900: '#064E3B',
    },

    // Neutral colors (dark theme)
    neutral: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        850: '#1A1F2E',
        900: '#111827',
        950: '#0A0A0B',
    },

    // Semantic colors
    success: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',

    // Background colors
    background: {
        primary: '#0A0A0B',
        secondary: '#111827',
        tertiary: '#1F2937',
        card: 'rgba(17, 24, 39, 0.95)',
        modal: 'rgba(17, 24, 39, 0.98)',
        overlay: 'rgba(0, 0, 0, 0.85)',
    },

    // Text colors
    text: {
        primary: '#F9FAFB',
        secondary: '#D1D5DB',
        tertiary: '#9CA3AF',
        accent: '#10B981',
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
    },

    // Border colors
    border: {
        primary: 'rgba(75, 85, 99, 0.3)',
        secondary: 'rgba(55, 65, 81, 0.3)',
        accent: 'rgba(16, 185, 129, 0.3)',
    },
};

// Typography scale using Inter font family
export const typography = {
    fontFamily: {
        regular: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
        medium: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto-Medium',
        semibold: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto-Medium',
        bold: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto-Bold',
    },

    fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 28,
        '4xl': 32,
    },

    fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
    },

    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.6,
    },

    letterSpacing: {
        tight: -0.5,
        normal: 0,
        wide: 0.5,
    },
};

// Spacing scale (based on 4px grid)
export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    '6xl': 64,
};

// Border radius scale
export const borderRadius = {
    none: 0,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    full: 9999,
};

// Shadow configurations
export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },

    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },

    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 12,
    },

    xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 24,
        elevation: 20,
    },

    // Colored shadows
    success: {
        shadowColor: colors.success,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },

    danger: {
        shadowColor: colors.danger,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
};

// Layout breakpoints
export const breakpoints = {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
};

// Animation timing
export const animations = {
    duration: {
        fast: 150,
        normal: 300,
        slow: 500,
    },

    easing: {
        easeOut: 'ease-out',
        easeIn: 'ease-in',
        easeInOut: 'ease-in-out',
    },
};

// Component variants
export const variants = {
    button: {
        primary: {
            backgroundColor: colors.primary[500],
            borderColor: colors.primary[500],
            ...shadows.success,
        },
        secondary: {
            backgroundColor: colors.background.tertiary,
            borderColor: colors.border.primary,
            ...shadows.sm,
        },
        danger: {
            backgroundColor: colors.danger,
            borderColor: colors.danger,
            ...shadows.danger,
        },
        ghost: {
            backgroundColor: 'transparent',
            borderColor: colors.border.primary,
        },
    },

    card: {
        primary: {
            backgroundColor: colors.background.card,
            borderColor: colors.border.secondary,
            borderRadius: borderRadius.xl,
            ...shadows.md,
        },
        elevated: {
            backgroundColor: colors.background.card,
            borderColor: colors.border.secondary,
            borderRadius: borderRadius.xl,
            ...shadows.lg,
        },
    },
};

export const theme = {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    breakpoints,
    animations,
    variants,
};

export default theme; 