import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import theme from '../theme';

interface ScreenData {
    window: ScaledSize;
    screen: ScaledSize;
}

interface ResponsiveLayout {
    width: number;
    height: number;
    isSmall: boolean;
    isMedium: boolean;
    isLarge: boolean;
    isXLarge: boolean;
    isPortrait: boolean;
    isLandscape: boolean;
    scale: number;
    fontScale: number;
    columns: number;
    gutter: number;
}

export const useResponsiveLayout = (): ResponsiveLayout => {
    const [screenData, setScreenData] = useState<ScreenData>(() => {
        const { width, height, scale, fontScale } = Dimensions.get('window');
        return {
            window: { width, height, scale, fontScale },
            screen: Dimensions.get('screen'),
        };
    });

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window, screen }) => {
            setScreenData({ window, screen });
        });

        return () => subscription?.remove();
    }, []);

    const { width, height, scale, fontScale } = screenData.window;

    // Determine breakpoints
    const isSmall = width < theme.breakpoints.sm;
    const isMedium = width >= theme.breakpoints.sm && width < theme.breakpoints.md;
    const isLarge = width >= theme.breakpoints.md && width < theme.breakpoints.lg;
    const isXLarge = width >= theme.breakpoints.lg;

    // Orientation
    const isPortrait = height > width;
    const isLandscape = width > height;

    // Grid system
    const getColumns = (): number => {
        if (isSmall) return 1;
        if (isMedium) return 2;
        if (isLarge) return 3;
        return 4;
    };

    const getGutter = (): number => {
        if (isSmall) return theme.spacing.sm;
        if (isMedium) return theme.spacing.md;
        return theme.spacing.lg;
    };

    return {
        width,
        height,
        isSmall,
        isMedium,
        isLarge,
        isXLarge,
        isPortrait,
        isLandscape,
        scale,
        fontScale,
        columns: getColumns(),
        gutter: getGutter(),
    };
};

// Helper functions for responsive values
export const responsiveValue = <T>(
    values: {
        sm?: T;
        md?: T;
        lg?: T;
        xl?: T;
        default: T;
    },
    layout: ResponsiveLayout
): T => {
    if (layout.isXLarge && values.xl !== undefined) return values.xl;
    if (layout.isLarge && values.lg !== undefined) return values.lg;
    if (layout.isMedium && values.md !== undefined) return values.md;
    if (layout.isSmall && values.sm !== undefined) return values.sm;
    return values.default;
};

export const responsiveSpacing = (
    multiplier: number,
    layout: ResponsiveLayout
): number => {
    const baseSpacing = responsiveValue(
        {
            sm: theme.spacing.sm,
            md: theme.spacing.md,
            lg: theme.spacing.lg,
            xl: theme.spacing.xl,
            default: theme.spacing.md,
        },
        layout
    );

    return baseSpacing * multiplier;
};

export const responsiveFontSize = (
    size: keyof typeof theme.typography.fontSize,
    layout: ResponsiveLayout
): number => {
    const baseSize = theme.typography.fontSize[size];

    // Scale font size based on screen size and fontScale
    const scaleMultiplier = responsiveValue(
        {
            sm: 0.9,
            md: 1,
            lg: 1.1,
            xl: 1.2,
            default: 1,
        },
        layout
    );

    return baseSize * scaleMultiplier * layout.fontScale;
}; 