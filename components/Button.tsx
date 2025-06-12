import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    ActivityIndicator,
    View,
} from 'react-native';
import theme from '../theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    style,
    textStyle,
}) => {
    const getButtonStyle = (): ViewStyle => {
        const baseStyle = styles.button;
        const variantStyle = styles[`${variant}Button`];
        const sizeStyle = styles[`${size}Button`];

        return {
            ...baseStyle,
            ...variantStyle,
            ...sizeStyle,
            ...(fullWidth && { flex: 1 }),
            ...(disabled && styles.disabledButton),
            ...style,
        };
    };

    const getTextStyle = (): TextStyle => {
        const baseStyle = styles.buttonText;
        const variantStyle = styles[`${variant}ButtonText`];
        const sizeStyle = styles[`${size}ButtonText`];

        return {
            ...baseStyle,
            ...variantStyle,
            ...sizeStyle,
            ...(disabled && styles.disabledButtonText),
            ...textStyle,
        };
    };

    const renderContent = () => {
        if (loading) {
            return <ActivityIndicator color={getTextStyle().color} size="small" />;
        }

        return (
            <View style={styles.buttonContent}>
                {icon && iconPosition === 'left' && (
                    <View style={styles.iconLeft}>{icon}</View>
                )}
                <Text style={getTextStyle()}>{title}</Text>
                {icon && iconPosition === 'right' && (
                    <View style={styles.iconRight}>{icon}</View>
                )}
            </View>
        );
    };

    return (
        <TouchableOpacity
            style={getButtonStyle()}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {renderContent()}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        ...theme.shadows.md,
    },

    // Variants
    primaryButton: {
        backgroundColor: theme.colors.primary[500],
        borderColor: theme.colors.primary[500],
        ...theme.shadows.success,
    },

    secondaryButton: {
        backgroundColor: theme.colors.background.tertiary,
        borderColor: theme.colors.border.primary,
    },

    dangerButton: {
        backgroundColor: theme.colors.danger,
        borderColor: theme.colors.danger,
        ...theme.shadows.danger,
    },

    ghostButton: {
        backgroundColor: 'transparent',
        borderColor: theme.colors.border.primary,
        ...theme.shadows.sm,
    },

    // Sizes
    smButton: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        minHeight: 36,
    },

    mdButton: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        minHeight: 44,
    },

    lgButton: {
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.xl,
        minHeight: 52,
    },

    // Text styles
    buttonText: {
        fontFamily: theme.typography.fontFamily.semibold,
        textAlign: 'center',
        letterSpacing: theme.typography.letterSpacing.wide,
    },

    primaryButtonText: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSize.base,
        fontWeight: '700' as const,
    },

    secondaryButtonText: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSize.base,
        fontWeight: '600' as const,
    },

    dangerButtonText: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSize.base,
        fontWeight: '700' as const,
    },

    ghostButtonText: {
        color: theme.colors.text.accent,
        fontSize: theme.typography.fontSize.base,
        fontWeight: '600' as const,
    },

    // Text sizes
    smButtonText: {
        fontSize: theme.typography.fontSize.sm,
    },

    mdButtonText: {
        fontSize: theme.typography.fontSize.base,
    },

    lgButtonText: {
        fontSize: theme.typography.fontSize.lg,
    },

    // States
    disabledButton: {
        opacity: 0.5,
        ...theme.shadows.sm,
    },

    disabledButtonText: {
        opacity: 0.7,
    },

    // Content layout
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    iconLeft: {
        marginRight: theme.spacing.sm,
    },

    iconRight: {
        marginLeft: theme.spacing.sm,
    },
}); 