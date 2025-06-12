import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Animated,
    LayoutChangeEvent,
} from 'react-native';
import theme from '../theme';

interface Tab {
    key: string;
    label: string;
    badge?: string | number;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabKey: string) => void;
    variant?: 'default' | 'pills' | 'underline';
    size?: 'sm' | 'md' | 'lg';
    scrollable?: boolean;
    showIndicator?: boolean;
}

export const Tabs: React.FC<TabsProps> = ({
    tabs,
    activeTab,
    onTabChange,
    variant = 'default',
    size = 'md',
    scrollable = true,
    showIndicator = true,
}) => {
    const [tabLayouts, setTabLayouts] = useState<{ [key: string]: { x: number; width: number } }>({});
    const indicatorAnim = useRef(new Animated.Value(0)).current;
    const indicatorWidth = useRef(new Animated.Value(0)).current;

    const handleTabLayout = (tabKey: string, event: LayoutChangeEvent) => {
        const { x, width } = event.nativeEvent.layout;
        const newLayout = { x, width };

        setTabLayouts(prev => {
            const updated = { ...prev, [tabKey]: newLayout };

            // Animate indicator if this is the active tab
            if (tabKey === activeTab) {
                Animated.parallel([
                    Animated.spring(indicatorAnim, {
                        toValue: x,
                        useNativeDriver: false,
                        tension: 300,
                        friction: 30,
                    }),
                    Animated.spring(indicatorWidth, {
                        toValue: width,
                        useNativeDriver: false,
                        tension: 300,
                        friction: 30,
                    }),
                ]).start();
            }

            return updated;
        });
    };

    const handleTabPress = (tabKey: string) => {
        onTabChange(tabKey);

        const layout = tabLayouts[tabKey];
        if (layout && showIndicator) {
            Animated.parallel([
                Animated.spring(indicatorAnim, {
                    toValue: layout.x,
                    useNativeDriver: false,
                    tension: 300,
                    friction: 30,
                }),
                Animated.spring(indicatorWidth, {
                    toValue: layout.width,
                    useNativeDriver: false,
                    tension: 300,
                    friction: 30,
                }),
            ]).start();
        }
    };

    const renderTab = (tab: Tab) => {
        const isActive = tab.key === activeTab;

        return (
            <TouchableOpacity
                key={tab.key}
                style={[
                    styles.tabButton,
                    styles[`${variant}TabButton`],
                    styles[`${size}TabButton`],
                    isActive && styles[`${variant}TabButtonActive`],
                ]}
                onPress={() => handleTabPress(tab.key)}
                onLayout={(event) => handleTabLayout(tab.key, event)}
                activeOpacity={0.7}
            >
                <View style={styles.tabContent}>
                    <Text
                        style={[
                            styles.tabText,
                            styles[`${variant}TabText`],
                            styles[`${size}TabText`],
                            isActive && styles[`${variant}TabTextActive`],
                        ]}
                    >
                        {tab.label}
                    </Text>
                    {tab.badge && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{tab.badge}</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    const renderIndicator = () => {
        if (!showIndicator || variant === 'pills') return null;

        return (
            <Animated.View
                style={[
                    styles.indicator,
                    styles[`${variant}Indicator`],
                    {
                        left: indicatorAnim,
                        width: indicatorWidth,
                    },
                ]}
            />
        );
    };

    const TabContainer = scrollable ? ScrollView : View;
    const containerProps = scrollable ? {
        horizontal: true,
        showsHorizontalScrollIndicator: false,
        contentContainerStyle: styles.scrollContent,
    } : {};

    return (
        <View style={[styles.container, styles[`${variant}Container`]]}>
            <TabContainer
                style={styles.tabsContainer}
                {...containerProps}
            >
                <View style={styles.tabsWrapper}>
                    {tabs.map(renderTab)}
                    {renderIndicator()}
                </View>
            </TabContainer>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },

    tabsContainer: {
        flexGrow: 1,
    },

    scrollContent: {
        flexGrow: 1,
    },

    tabsWrapper: {
        flexDirection: 'row',
        position: 'relative',
    },

    tabButton: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },

    tabContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    tabText: {
        fontFamily: theme.typography.fontFamily.semibold,
        letterSpacing: theme.typography.letterSpacing.wide,
    },

    badge: {
        backgroundColor: theme.colors.primary[500],
        borderRadius: theme.borderRadius.full,
        paddingHorizontal: theme.spacing.xs,
        paddingVertical: 2,
        marginLeft: theme.spacing.xs,
        minWidth: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    badgeText: {
        color: theme.colors.text.primary,
        fontSize: theme.typography.fontSize.xs,
        fontWeight: '700' as const,
    },

    // Default variant
    defaultContainer: {
        backgroundColor: theme.colors.background.tertiary,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xs,
    },

    defaultTabButton: {
        flex: 1,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginHorizontal: 2,
    },

    defaultTabButtonActive: {
        backgroundColor: theme.colors.primary[500],
        ...theme.shadows.sm,
    },

    defaultTabText: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSize.sm,
        fontWeight: '600' as const,
    },

    defaultTabTextActive: {
        color: theme.colors.text.primary,
        fontWeight: '700' as const,
    },

    // Pills variant
    pillsContainer: {
        backgroundColor: 'transparent',
    },

    pillsTabButton: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.borderRadius.full,
        marginHorizontal: theme.spacing.xs,
        backgroundColor: theme.colors.background.tertiary,
        borderWidth: 1,
        borderColor: theme.colors.border.primary,
    },

    pillsTabButtonActive: {
        backgroundColor: theme.colors.primary[500],
        borderColor: theme.colors.primary[500],
        ...theme.shadows.success,
    },

    pillsTabText: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSize.sm,
        fontWeight: '600' as const,
    },

    pillsTabTextActive: {
        color: theme.colors.text.primary,
        fontWeight: '700' as const,
    },

    // Underline variant
    underlineContainer: {
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.primary,
    },

    underlineTabButton: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        marginHorizontal: theme.spacing.xs,
    },

    underlineTabButtonActive: {
        // Active state handled by indicator
    },

    underlineTabText: {
        color: theme.colors.text.tertiary,
        fontSize: theme.typography.fontSize.base,
        fontWeight: '500' as const,
    },

    underlineTabTextActive: {
        color: theme.colors.text.accent,
        fontWeight: '700' as const,
    },

    // Sizes
    smTabButton: {
        minHeight: 32,
    },

    mdTabButton: {
        minHeight: 40,
    },

    lgTabButton: {
        minHeight: 48,
    },

    smTabText: {
        fontSize: theme.typography.fontSize.xs,
    },

    mdTabText: {
        fontSize: theme.typography.fontSize.sm,
    },

    lgTabText: {
        fontSize: theme.typography.fontSize.base,
    },

    // Indicators
    indicator: {
        position: 'absolute',
        bottom: 0,
        height: 2,
    },

    defaultIndicator: {
        display: 'none', // Default variant uses background color
    },

    underlineIndicator: {
        backgroundColor: theme.colors.primary[500],
        height: 3,
        borderRadius: 2,
    },
}); 