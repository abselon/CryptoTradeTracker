import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ViewStyle,
    Animated,
    TouchableOpacity,
} from 'react-native';
import theme from '../theme';
import { Card } from './Card';

interface StatsCardProps {
    label: string;
    value: string | number;
    change?: number;
    changeLabel?: string;
    variant?: 'default' | 'success' | 'danger' | 'warning';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
    onPress?: () => void;
    animated?: boolean;
    loading?: boolean;
    style?: ViewStyle;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    label,
    value,
    change,
    changeLabel,
    variant = 'default',
    size = 'md',
    icon,
    onPress,
    animated = true,
    loading = false,
    style,
}) => {
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (animated) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 300,
                    friction: 20,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            scaleAnim.setValue(1);
            opacityAnim.setValue(1);
        }
    }, [animated, scaleAnim, opacityAnim]);

    const getVariantColor = () => {
        switch (variant) {
            case 'success':
                return theme.colors.success;
            case 'danger':
                return theme.colors.danger;
            case 'warning':
                return theme.colors.warning;
            default:
                return theme.colors.text.accent;
        }
    };

    const getChangeColor = () => {
        if (change === undefined) return theme.colors.text.tertiary;
        return change >= 0 ? theme.colors.success : theme.colors.danger;
    };

    const formatValue = (val: string | number): string => {
        if (typeof val === 'number') {
            if (Math.abs(val) >= 1000000) {
                return `${(val / 1000000).toFixed(1)}M`;
            }
            if (Math.abs(val) >= 1000) {
                return `${(val / 1000).toFixed(1)}K`;
            }
            return val.toFixed(2);
        }
        return val.toString();
    };

    const renderContent = () => (
        <>
            <View style={styles.header}>
                <Text style={[styles.label, styles[`${size}Label`]]}>
                    {label}
                </Text>
                {icon && (
                    <View style={styles.iconContainer}>
                        {icon}
                    </View>
                )}
            </View>

            <View style={styles.valueContainer}>
                <Text
                    style={[
                        styles.value,
                        styles[`${size}Value`],
                        { color: getVariantColor() }
                    ]}
                >
                    {loading ? '...' : formatValue(value)}
                </Text>

                {change !== undefined && (
                    <View style={styles.changeContainer}>
                        <Text style={[styles.changePrefix, { color: getChangeColor() }]}>
                            {change >= 0 ? '+' : ''}
                        </Text>
                        <Text style={[styles.changeValue, { color: getChangeColor() }]}>
                            {change.toFixed(2)}%
                        </Text>
                        {changeLabel && (
                            <Text style={styles.changeLabel}>
                                {changeLabel}
                            </Text>
                        )}
                    </View>
                )}
            </View>
        </>
    );

    const cardContent = (
        <Animated.View
            style={[
                styles.container,
                styles[`${size}Container`],
                {
                    transform: [{ scale: scaleAnim }],
                    opacity: opacityAnim,
                },
                style,
            ]}
        >
            {renderContent()}
        </Animated.View>
    );

    return (
        <Card
            variant="elevated"
            padding="lg"
            onPress={onPress}
            pressable={!!onPress}
            style={styles.card}
        >
            {cardContent}
        </Card>
    );
};

// Grid component for multiple stats
interface StatsGridProps {
    children: React.ReactNode;
    columns?: 1 | 2 | 3 | 4;
    spacing?: number;
    style?: ViewStyle;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
    children,
    columns = 2,
    spacing = theme.spacing.md,
    style,
}) => {
    return (
        <View style={[styles.grid, { gap: spacing }, style]}>
            {React.Children.map(children, (child, index) => (
                <View style={[styles.gridItem, { flex: 1 / columns }]}>
                    {child}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
    },

    container: {
        alignItems: 'flex-start',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: theme.spacing.sm,
    },

    iconContainer: {
        padding: theme.spacing.xs,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.background.tertiary,
    },

    label: {
        color: theme.colors.text.tertiary,
        fontFamily: theme.typography.fontFamily.medium,
        letterSpacing: theme.typography.letterSpacing.wide,
        textTransform: 'uppercase',
    },

    valueContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%',
    },

    value: {
        fontFamily: theme.typography.fontFamily.bold,
        letterSpacing: theme.typography.letterSpacing.tight,
        marginBottom: theme.spacing.xs,
    },

    changeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    changePrefix: {
        fontFamily: theme.typography.fontFamily.semibold,
        fontSize: theme.typography.fontSize.sm,
    },

    changeValue: {
        fontFamily: theme.typography.fontFamily.semibold,
        fontSize: theme.typography.fontSize.sm,
        marginRight: theme.spacing.xs,
    },

    changeLabel: {
        color: theme.colors.text.tertiary,
        fontSize: theme.typography.fontSize.xs,
        fontFamily: theme.typography.fontFamily.regular,
    },

    // Sizes
    smContainer: {
        minHeight: 80,
    },

    mdContainer: {
        minHeight: 100,
    },

    lgContainer: {
        minHeight: 120,
    },

    smLabel: {
        fontSize: theme.typography.fontSize.xs,
    },

    mdLabel: {
        fontSize: theme.typography.fontSize.sm,
    },

    lgLabel: {
        fontSize: theme.typography.fontSize.base,
    },

    smValue: {
        fontSize: theme.typography.fontSize.lg,
    },

    mdValue: {
        fontSize: theme.typography.fontSize.xl,
    },

    lgValue: {
        fontSize: theme.typography.fontSize['2xl'],
    },

    // Grid styles
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },

    gridItem: {
        minWidth: 0, // Prevent flex items from overflowing
    },
}); 