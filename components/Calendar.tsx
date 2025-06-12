import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles';
import { getDailyData } from '../utils/calculations';
import { Trade, DailyData } from '../types';

interface CalendarProps {
    trades: Trade[];
    currentCalendarMonth: number;
    currentCalendarYear: number;
    selectedDate: string;
    setCurrentCalendarMonth: (month: number) => void;
    setCurrentCalendarYear: (year: number) => void;
    setSelectedDate: (date: string) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
    trades,
    currentCalendarMonth,
    currentCalendarYear,
    selectedDate,
    setCurrentCalendarMonth,
    setCurrentCalendarYear,
    setSelectedDate,
}) => {
    const getCalendarData = () => {
        const dailyData = getDailyData(trades);
        const calendarMap = new Map<string, DailyData>();

        dailyData.forEach(day => {
            calendarMap.set(day.date, day);
        });

        return calendarMap;
    };

    const calendarData = getCalendarData();
    const today = new Date();
    const isCurrentMonth = currentCalendarMonth === today.getMonth() && currentCalendarYear === today.getFullYear();

    const firstDay = new Date(currentCalendarYear, currentCalendarMonth, 1);
    const lastDay = new Date(currentCalendarYear, currentCalendarMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const weeks = [];
    let currentWeek = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
        currentWeek.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = new Date(currentCalendarYear, currentCalendarMonth, day).toISOString().split('T')[0];
        const dayData = calendarData.get(dateStr);
        const isToday = isCurrentMonth && day === today.getDate();
        const isSelected = selectedDate === dateStr;

        currentWeek.push({
            day,
            date: dateStr,
            pnl: dayData?.pnl || 0,
            trades: dayData?.trades || 0,
            sells: dayData?.sells || 0,
            isToday,
            isSelected,
            hasActivity: (dayData?.trades || 0) > 0 || (dayData?.sells || 0) > 0
        });

        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }

    while (currentWeek.length < 7 && currentWeek.length > 0) {
        currentWeek.push(null);
    }
    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }

    const navigateMonth = (direction: 'prev' | 'next') => {
        if (direction === 'prev') {
            if (currentCalendarMonth === 0) {
                setCurrentCalendarMonth(11);
                setCurrentCalendarYear(currentCalendarYear - 1);
            } else {
                setCurrentCalendarMonth(currentCalendarMonth - 1);
            }
        } else {
            if (currentCalendarMonth === 11) {
                setCurrentCalendarMonth(0);
                setCurrentCalendarYear(currentCalendarYear + 1);
            } else {
                setCurrentCalendarMonth(currentCalendarMonth + 1);
            }
        }
        setSelectedDate('');
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const getDayStyle = (dayData: any) => {
        const baseStyle = styles.calendarDay;
        let additionalStyles = {};

        if (!dayData) return baseStyle;

        if (dayData.isSelected) {
            additionalStyles = {
                backgroundColor: '#10B981',
                borderColor: '#10B981',
                shadowColor: '#10B981',
                shadowOpacity: 0.5,
                elevation: 12,
            };
        } else if (dayData.isToday) {
            additionalStyles = {
                backgroundColor: '#FBBF24',
                borderColor: '#FBBF24',
                shadowColor: '#FBBF24',
                shadowOpacity: 0.5,
                elevation: 12,
            };
        } else if (dayData.pnl > 0) {
            additionalStyles = {
                backgroundColor: '#10B981',
                borderColor: '#10B981',
                shadowColor: '#10B981',
                shadowOpacity: 0.4,
                elevation: 8,
            };
        } else if (dayData.pnl < 0) {
            additionalStyles = {
                backgroundColor: '#EF4444',
                borderColor: '#EF4444',
                shadowColor: '#EF4444',
                shadowOpacity: 0.4,
                elevation: 8,
            };
        } else if (dayData.hasActivity) {
            additionalStyles = {
                backgroundColor: '#10B981',
                borderColor: '#10B981',
                opacity: 0.8,
            };
        }

        return [baseStyle, additionalStyles];
    };

    const getTextStyle = (dayData: any) => {
        const baseStyle = styles.calendarDayText;
        let additionalStyles = {};

        if (!dayData) return baseStyle;

        if (dayData.isSelected || dayData.isToday) {
            additionalStyles = {
                color: '#FFFFFF',
                fontWeight: '800',
            };
        }

        return [baseStyle, additionalStyles];
    };

    return (
        <View style={styles.calendar}>
            <View style={styles.calendarHeader}>
                <TouchableOpacity
                    style={styles.calendarNavButton}
                    onPress={() => navigateMonth('prev')}
                >
                    <Text style={styles.calendarNavText}>‹</Text>
                </TouchableOpacity>

                <View style={styles.calendarTitleContainer}>
                    <Text style={styles.calendarTitle}>
                        {monthNames[currentCalendarMonth]} {currentCalendarYear}
                    </Text>
                    <TouchableOpacity
                        style={styles.calendarTodayButton}
                        onPress={() => {
                            setCurrentCalendarMonth(today.getMonth());
                            setCurrentCalendarYear(today.getFullYear());
                            setSelectedDate('');
                        }}
                    >
                        <Text style={styles.calendarTodayText}>Today</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.calendarNavButton}
                    onPress={() => navigateMonth('next')}
                >
                    <Text style={styles.calendarNavText}>›</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.calendarLegend}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#10B981' }]} />
                    <Text style={styles.legendText}>Profit</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#EF4444' }]} />
                    <Text style={styles.legendText}>Loss</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#10B981', opacity: 0.8 }]} />
                    <Text style={styles.legendText}>Activity</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#FBBF24' }]} />
                    <Text style={styles.legendText}>Today</Text>
                </View>
            </View>

            <View style={styles.calendarWeekHeader}>
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                    <Text key={day} style={styles.calendarWeekDay}>{day}</Text>
                ))}
            </View>

            <View style={styles.calendarGrid}>
                {weeks.map((week, weekIndex) => (
                    <View key={weekIndex} style={styles.calendarWeek}>
                        {week.map((dayData, dayIndex) => (
                            <TouchableOpacity
                                key={dayIndex}
                                style={getDayStyle(dayData)}
                                onPress={() => dayData && setSelectedDate(dayData.date)}
                                disabled={!dayData}
                                activeOpacity={0.7}
                            >
                                {dayData && (
                                    <View style={styles.calendarDayContent}>
                                        <Text style={getTextStyle(dayData)}>
                                            {dayData.day}
                                        </Text>

                                        {dayData.hasActivity && (
                                            <View style={styles.calendarDayIndicators}>
                                                {dayData.trades > 0 && (
                                                    <View style={styles.activityDot} />
                                                )}
                                                {dayData.pnl !== 0 && (
                                                    <Text style={[
                                                        styles.calendarDayPnl,
                                                        dayData.pnl > 0 ? styles.pnlPositive : styles.pnlNegative
                                                    ]}>
                                                        {dayData.pnl > 0 ? '+' : ''}${Math.abs(dayData.pnl).toFixed(0)}
                                                    </Text>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>
        </View>
    );
}; 