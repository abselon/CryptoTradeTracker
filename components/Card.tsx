import React from 'react';
import {
    View,
    StyleSheet,
    ViewStyle,
    TouchableOpacity,
    TouchableOpacityProps,
} from 'react-native';
import theme from '../theme';

interface CardProps {
    children: React.ReactNode;
    variant?: 'primary' | 'elevated' | 'outlined' | 'flat';
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    margin?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    onPress?: () => void;
    style?: ViewStyle;
    pressable?: boolean;
    disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'primary',
    padding = 'lg',
    margin = 'none',
    onPress,
    style,
    pressable = false,
    disabled = false,
}) => {
    const getCardStyle = (): ViewStyle => {
        const baseStyle = styles.card;
        const variantStyle = styles[`${variant}Card`];
        const paddingStyle = styles[`${padding}Padding`];
        const marginStyle = styles[`${margin}Margin`];

        return {
            ...baseStyle,
            ...variantStyle,
            ...paddingStyle,
            ...marginStyle,
            ...(disabled && styles.disabledCard),
            ...style,
        };
    };

    if (pressable || onPress) {
        return (
            <TouchableOpacity
                style={getCardStyle()}
                onPress={onPress}
                disabled={disabled}
                activeOpacity={0.9}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return (
        <View style={getCardStyle()}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: theme.borderRadius.xl,
        borderWidth: 1,
    },

    // Variants
    primaryCard: {
        backgroundColor: theme.colors.background.card,
        borderColor: theme.colors.border.secondary,
        ...theme.shadows.md,
    },

    elevatedCard: {
        backgroundColor: theme.colors.background.card,
        borderColor: theme.colors.border.secondary,
        ...theme.shadows.lg,
    },

    outlinedCard: {
        backgroundColor: 'transparent',
        borderColor: theme.colors.border.primary,
        ...theme.shadows.sm,
    },

    flatCard: {
        backgroundColor: theme.colors.background.tertiary,
        borderColor: 'transparent',
        borderWidth: 0,
    },

    // Padding
    nonePadding: {
        padding: 0,
    },

    smPadding: {
        padding: theme.spacing.sm,
    },

    mdPadding: {
        padding: theme.spacing.md,
    },

    lgPadding: {
        padding: theme.spacing.lg,
    },

    xlPadding: {
        padding: theme.spacing.xl,
    },

    // Margin
    noneMargin: {
        margin: 0,
    },

    smMargin: {
        margin: theme.spacing.sm,
    },

    mdMargin: {
        margin: theme.spacing.md,
    },

    lgMargin: {
        margin: theme.spacing.lg,
    },

    xlMargin: {
        margin: theme.spacing.xl,
    },

    // States
    disabledCard: {
        opacity: 0.6,
    },
}); 