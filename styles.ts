import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;
const isMediumScreen = width >= 375 && width < 414;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        padding: isSmallScreen ? 12 : 16,
    },
    title: {
        fontSize: isSmallScreen ? 24 : 28,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: isSmallScreen ? 16 : 24,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: isSmallScreen ? 16 : 24,
        flexWrap: 'wrap',
        gap: 8,
    },
    createButton: {
        flex: 1,
        minWidth: isSmallScreen ? '100%' : '30%',
        backgroundColor: '#0F172A',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    addCoinButton: {
        flex: 1,
        minWidth: isSmallScreen ? '100%' : '30%',
        backgroundColor: '#3B82F6',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    manageCoinsButton: {
        flex: 1,
        minWidth: isSmallScreen ? '100%' : '30%',
        backgroundColor: '#6366F1',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    createButtonText: {
        color: '#FFFFFF',
        fontSize: isSmallScreen ? 13 : 14,
        fontWeight: '600',
    },
    tradesList: {
        flex: 1,
    },
    tradeItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: isSmallScreen ? 16 : 20,
        marginBottom: isSmallScreen ? 12 : 16,
        borderWidth: 1,
        borderColor: 'rgba(226, 232, 240, 0.8)',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    completedTrade: {
        opacity: 0.8,
        backgroundColor: '#F8FAFC',
    },
    tradeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isSmallScreen ? 12 : 16,
        paddingBottom: isSmallScreen ? 12 : 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(226, 232, 240, 0.8)',
    },
    tradeName: {
        fontSize: isSmallScreen ? 18 : 20,
        fontWeight: '700',
        color: '#0F172A',
        flex: 1,
        marginRight: 12,
    },
    tradeActions: {
        flexDirection: 'row',
        gap: 8,
    },
    tradeActionButton: {
        paddingHorizontal: isSmallScreen ? 12 : 16,
        paddingVertical: isSmallScreen ? 6 : 8,
        borderRadius: 8,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: 'rgba(226, 232, 240, 0.8)',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    tradeActionButtonText: {
        fontSize: isSmallScreen ? 12 : 13,
        fontWeight: '600',
        color: '#64748B',
    },
    editButton: {
        backgroundColor: '#F0FDF4',
        borderColor: '#86EFAC',
    },
    deleteButton: {
        backgroundColor: '#FEF2F2',
        borderColor: '#FCA5A5',
    },
    tradeDetail: {
        fontSize: isSmallScreen ? 13 : 14,
        color: '#64748B',
        marginBottom: isSmallScreen ? 4 : 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    tradeDetails: {
        marginBottom: isSmallScreen ? 12 : 16,
    },
    tradeDetailLabel: {
        fontWeight: '600',
        color: '#475569',
        marginRight: 8,
    },
    tradeDetailValue: {
        color: '#0F172A',
        fontWeight: '500',
    },
    pnlContainer: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: isSmallScreen ? 12 : 16,
        marginTop: isSmallScreen ? 12 : 16,
        marginBottom: isSmallScreen ? 12 : 16,
        borderWidth: 1,
        borderColor: 'rgba(226, 232, 240, 0.8)',
    },
    pnlText: {
        fontSize: isSmallScreen ? 16 : 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    roiText: {
        fontSize: isSmallScreen ? 14 : 16,
        fontWeight: '600',
    },
    profit: {
        color: '#059669',
    },
    loss: {
        color: '#DC2626',
    },
    tradeTimestamp: {
        fontSize: isSmallScreen ? 11 : 12,
        color: '#94A3B8',
        marginBottom: isSmallScreen ? 12 : 16,
        textAlign: 'right',
    },
    tradeButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: isSmallScreen ? 8 : 12,
    },
    detailsButton: {
        paddingHorizontal: isSmallScreen ? 16 : 20,
        paddingVertical: isSmallScreen ? 8 : 10,
        borderRadius: 8,
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: 'rgba(226, 232, 240, 0.8)',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    detailsButtonText: {
        fontSize: isSmallScreen ? 13 : 14,
        fontWeight: '600',
        color: '#0F172A',
    },
    sellButton: {
        paddingHorizontal: isSmallScreen ? 16 : 20,
        paddingVertical: isSmallScreen ? 8 : 10,
        borderRadius: 8,
        backgroundColor: '#10B981',
        ...Platform.select({
            ios: {
                shadowColor: '#10B981',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    sellButtonText: {
        fontSize: isSmallScreen ? 13 : 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: isSmallScreen ? 16 : 24,
        width: width - 32,
        maxHeight: height * 0.8,
    },
    detailsModalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: isSmallScreen ? 16 : 24,
        width: width - 32,
        maxHeight: height * 0.8,
    },
    modalTitle: {
        fontSize: isSmallScreen ? 20 : 24,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: isSmallScreen ? 16 : 24,
        textAlign: 'center',
    },
    detailsSubtitle: {
        fontSize: isSmallScreen ? 14 : 16,
        color: '#64748B',
        marginBottom: isSmallScreen ? 16 : 24,
        textAlign: 'center',
    },
    detailsSection: {
        marginBottom: isSmallScreen ? 16 : 24,
    },
    sectionTitle: {
        fontSize: isSmallScreen ? 16 : 18,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: isSmallScreen ? 12 : 16,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
    },
    statItem: {
        width: '50%',
        padding: 4,
    },
    statLabel: {
        fontSize: isSmallScreen ? 12 : 14,
        color: '#64748B',
        marginBottom: 2,
    },
    statValue: {
        fontSize: isSmallScreen ? 16 : 18,
        fontWeight: '700',
        color: '#0F172A',
    },
    metaContainer: {
        gap: 12,
    },
    metaItem: {
        fontSize: 15,
        color: '#D1D5DB',
        lineHeight: 22,
    },
    metaValue: {
        fontWeight: '600',
        color: '#F9FAFB',
    },
    analyticsContainer: {
        marginTop: 16,
    },
    analyticsRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    analyticsItem: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 12,
        marginHorizontal: 4,
    },
    analyticsLabel: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 4,
    },
    analyticsValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
    },
    sellHistoryContainer: {
        marginTop: isSmallScreen ? 16 : 24,
    },
    sellHistoryItem: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: isSmallScreen ? 12 : 16,
        marginBottom: isSmallScreen ? 8 : 12,
    },
    sellHistoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isSmallScreen ? 8 : 12,
    },
    sellHistoryActions: {
        flexDirection: 'row',
        gap: 8,
    },
    sellActionButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 60,
    },
    sellActionButtonText: {
        color: '#FFFFFF',
        fontSize: isSmallScreen ? 11 : 12,
        fontWeight: '600',
    },
    sellHistoryTitle: {
        fontSize: isSmallScreen ? 14 : 16,
        fontWeight: '600',
        color: '#0F172A',
    },
    sellHistoryDetail: {
        fontSize: isSmallScreen ? 13 : 14,
        color: '#64748B',
        marginBottom: isSmallScreen ? 2 : 4,
    },
    sellHistoryDate: {
        fontSize: isSmallScreen ? 11 : 12,
        color: '#94A3B8',
        marginTop: isSmallScreen ? 6 : 8,
    },
    noDataText: {
        fontSize: isSmallScreen ? 13 : 14,
        color: '#94A3B8',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    closeDetailsButton: {
        backgroundColor: '#F1F5F9',
        paddingVertical: isSmallScreen ? 10 : 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: isSmallScreen ? 16 : 24,
    },
    closeDetailsButtonText: {
        color: '#64748B',
        fontSize: isSmallScreen ? 14 : 16,
        fontWeight: '600',
    },
    availableAmount: {
        fontSize: isSmallScreen ? 13 : 14,
        color: '#64748B',
        marginBottom: isSmallScreen ? 12 : 16,
        textAlign: 'center',
    },
    inputLabel: {
        fontSize: isSmallScreen ? 13 : 14,
        color: '#64748B',
        marginBottom: isSmallScreen ? 4 : 8,
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: isSmallScreen ? 10 : 12,
        fontSize: isSmallScreen ? 15 : 16,
        color: '#0F172A',
        marginBottom: isSmallScreen ? 12 : 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    orText: {
        textAlign: 'center',
        color: '#94A3B8',
        marginVertical: isSmallScreen ? 12 : 16,
        fontSize: isSmallScreen ? 13 : 14,
        fontWeight: '500',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: isSmallScreen ? 16 : 24,
        gap: 8,
    },
    modalButton: {
        flex: 1,
        paddingVertical: isSmallScreen ? 10 : 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#F1F5F9',
    },
    saveButton: {
        backgroundColor: '#0F172A',
    },
    sellButtonStyle: {
        backgroundColor: '#059669',
    },
    cancelButtonText: {
        color: '#64748B',
        fontSize: isSmallScreen ? 14 : 16,
        fontWeight: '600',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: isSmallScreen ? 14 : 16,
        fontWeight: '600',
    },
    currencySelector: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: isSmallScreen ? 10 : 12,
        marginBottom: isSmallScreen ? 12 : 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    currencySelectorText: {
        fontSize: isSmallScreen ? 15 : 16,
        color: '#0F172A',
    },
    currencySelectorPlaceholder: {
        fontSize: isSmallScreen ? 15 : 16,
        color: '#94A3B8',
    },
    currencyList: {
        maxHeight: height * 0.4,
    },
    currencyItem: {
        paddingVertical: isSmallScreen ? 10 : 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    currencyItemText: {
        fontSize: isSmallScreen ? 15 : 16,
        color: '#0F172A',
    },
    coinsList: {
        maxHeight: 400,
    },
    coinItem: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    coinHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    coinName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
    },
    coinSymbol: {
        fontSize: 14,
        color: '#64748B',
    },
    coinActions: {
        flexDirection: 'row',
    },
    coinActionButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginLeft: 8,
    },
    coinActionButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    summaryContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: isSmallScreen ? 16 : 20,
        marginBottom: isSmallScreen ? 16 : 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: isSmallScreen ? 12 : 20,
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
        padding: isSmallScreen ? 12 : 16,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        marginHorizontal: 4,
    },
    summaryLabel: {
        fontSize: isSmallScreen ? 12 : 14,
        color: '#64748B',
        marginBottom: isSmallScreen ? 4 : 8,
        fontWeight: '500',
    },
    summaryValue: {
        fontSize: isSmallScreen ? 20 : 24,
        fontWeight: '700',
    },
    timeFiltersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: isSmallScreen ? 12 : 16,
        flexWrap: 'wrap',
        gap: 4,
    },
    timeFilterButton: {
        flex: 1,
        minWidth: isSmallScreen ? '30%' : '18%',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    timeFilterButtonActive: {
        backgroundColor: '#0F172A',
    },
    timeFilterButtonText: {
        fontSize: isSmallScreen ? 11 : 13,
        color: '#64748B',
        fontWeight: '500',
    },
    timeFilterButtonTextActive: {
        color: '#FFFFFF',
    },
    analyticsButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: isSmallScreen ? 16 : 24,
        flexWrap: 'wrap',
        gap: 8,
    },
    analyticsButton: {
        flex: 1,
        minWidth: isSmallScreen ? '100%' : '30%',
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    analyticsButtonText: {
        color: '#0F172A',
        fontSize: isSmallScreen ? 13 : 14,
        fontWeight: '600',
    },
    chartTypeSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: isSmallScreen ? 12 : 16,
        flexWrap: 'wrap',
        gap: 4,
    },
    chartTypeButton: {
        flex: 1,
        minWidth: isSmallScreen ? '30%' : '18%',
        paddingVertical: isSmallScreen ? 6 : 8,
        paddingHorizontal: isSmallScreen ? 8 : 12,
        borderRadius: 8,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    chartTypeButtonActive: {
        backgroundColor: '#0F172A',
    },
    chartTypeButtonText: {
        fontSize: isSmallScreen ? 11 : 13,
        color: '#64748B',
        fontWeight: '500',
    },
    chartTypeButtonTextActive: {
        color: '#FFFFFF',
    },
    chartContainer: {
        marginBottom: isSmallScreen ? 12 : 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: isSmallScreen ? 12 : 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    chart: {
        marginVertical: isSmallScreen ? 6 : 8,
        borderRadius: 16,
    },
    chartLegend: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: isSmallScreen ? 8 : 12,
        flexWrap: 'wrap',
        gap: isSmallScreen ? 8 : 12,
    },
    chartLegendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: isSmallScreen ? 8 : 12,
    },
    chartLegendColor: {
        width: isSmallScreen ? 8 : 10,
        height: isSmallScreen ? 8 : 10,
        borderRadius: 4,
        marginRight: 4,
    },
    chartLegendText: {
        fontSize: isSmallScreen ? 11 : 12,
        color: '#64748B',
    },
    chartInfo: {
        marginTop: isSmallScreen ? 8 : 12,
        padding: isSmallScreen ? 8 : 12,
        backgroundColor: '#F8FAFC',
        borderRadius: 8,
    },
    chartInfoText: {
        fontSize: isSmallScreen ? 12 : 13,
        color: '#64748B',
        textAlign: 'center',
    },
    calendar: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        padding: isSmallScreen ? 16 : 24,
        borderRadius: 24,
        marginBottom: isSmallScreen ? 16 : 24,
        borderWidth: 1,
        borderColor: 'rgba(55, 65, 81, 0.3)',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.15,
                shadowRadius: 24,
            },
            android: {
                elevation: 20,
            },
        }),
    },
    calendarHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: isSmallScreen ? 16 : 24,
        paddingHorizontal: 8,
    },
    calendarNavButton: {
        width: isSmallScreen ? 36 : 44,
        height: isSmallScreen ? 36 : 44,
        borderRadius: 16,
        backgroundColor: '#10B981',
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#10B981',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    calendarNavText: {
        color: '#FFFFFF',
        fontSize: isSmallScreen ? 20 : 24,
        fontWeight: '700',
    },
    calendarTitleContainer: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 20,
    },
    calendarTitle: {
        color: '#F9FAFB',
        fontSize: isSmallScreen ? 20 : 24,
        fontWeight: '800',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    calendarTodayButton: {
        paddingHorizontal: isSmallScreen ? 16 : 20,
        paddingVertical: isSmallScreen ? 6 : 8,
        borderRadius: 12,
        backgroundColor: 'rgba(55, 65, 81, 0.6)',
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    calendarTodayText: {
        color: '#10B981',
        fontSize: isSmallScreen ? 12 : 13,
        fontWeight: '700',
    },
    calendarLegend: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: isSmallScreen ? 16 : 24,
        backgroundColor: 'rgba(31, 41, 55, 0.6)',
        borderRadius: 16,
        padding: isSmallScreen ? 12 : 16,
        borderWidth: 1,
        borderColor: 'rgba(75, 85, 99, 0.3)',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendColor: {
        width: isSmallScreen ? 12 : 14,
        height: isSmallScreen ? 12 : 14,
        borderRadius: 8,
        marginRight: 8,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    legendText: {
        color: '#D1D5DB',
        fontSize: isSmallScreen ? 11 : 12,
        fontWeight: '700',
    },
    calendarWeekHeader: {
        flexDirection: 'row',
        marginBottom: isSmallScreen ? 12 : 16,
        paddingHorizontal: 4,
    },
    calendarWeekDay: {
        flex: 1,
        textAlign: 'center',
        fontSize: isSmallScreen ? 12 : 13,
        fontWeight: '800',
        color: '#9CA3AF',
        letterSpacing: 1,
    },
    calendarGrid: {
        flex: 1,
    },
    calendarWeek: {
        flexDirection: 'row',
        marginBottom: isSmallScreen ? 6 : 8,
    },
    calendarDay: {
        flex: 1,
        aspectRatio: 1,
        margin: isSmallScreen ? 2 : 3,
        backgroundColor: 'rgba(31, 41, 55, 0.6)',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: isSmallScreen ? 48 : 56,
        borderWidth: 1,
        borderColor: 'rgba(75, 85, 99, 0.3)',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    calendarDaySelected: {
        backgroundColor: '#10B981',
        borderColor: '#10B981',
        ...Platform.select({
            ios: {
                shadowColor: '#10B981',
                shadowOpacity: 0.5,
            },
            android: {
                elevation: 12,
            },
        }),
    },
    calendarDayToday: {
        backgroundColor: '#FBBF24',
        borderColor: '#FBBF24',
        ...Platform.select({
            ios: {
                shadowColor: '#FBBF24',
                shadowOpacity: 0.5,
            },
            android: {
                elevation: 12,
            },
        }),
    },
    calendarDayActivity: {
        backgroundColor: '#10B981',
        borderColor: '#10B981',
        opacity: 0.8,
    },
    calendarDayProfit: {
        backgroundColor: '#10B981',
        borderColor: '#10B981',
        ...Platform.select({
            ios: {
                shadowColor: '#10B981',
                shadowOpacity: 0.4,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    calendarDayLoss: {
        backgroundColor: '#EF4444',
        borderColor: '#EF4444',
        ...Platform.select({
            ios: {
                shadowColor: '#EF4444',
                shadowOpacity: 0.4,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    calendarDayContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    calendarDayText: {
        fontSize: isSmallScreen ? 14 : 16,
        color: '#F9FAFB',
        fontWeight: '700',
    },
    calendarDayTextActive: {
        color: '#FFFFFF',
        fontWeight: '800',
    },
    calendarDayIndicators: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    activityDot: {
        width: isSmallScreen ? 4 : 6,
        height: isSmallScreen ? 4 : 6,
        borderRadius: isSmallScreen ? 2 : 3,
        backgroundColor: '#F9FAFB',
        marginRight: 2,
    },
    calendarDayPnl: {
        fontSize: isSmallScreen ? 8 : 9,
        fontWeight: '800',
        textAlign: 'center',
    },
    pnlPositive: {
        color: '#10B981',
    },
    pnlNegative: {
        color: '#EF4444',
    },
    selectedDateInfo: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: isSmallScreen ? 12 : 16,
        marginTop: isSmallScreen ? 16 : 24,
    },
    selectedDateTitle: {
        fontSize: isSmallScreen ? 14 : 16,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: isSmallScreen ? 8 : 12,
    },
    selectedDateDetail: {
        fontSize: isSmallScreen ? 13 : 14,
        color: '#64748B',
        marginBottom: isSmallScreen ? 4 : 8,
    },
    monthlyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: isSmallScreen ? 12 : 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(55, 65, 81, 0.3)',
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        paddingHorizontal: isSmallScreen ? 16 : 20,
        marginBottom: 4,
        borderRadius: 12,
    },
    monthlyLabel: {
        fontSize: isSmallScreen ? 14 : 16,
        color: '#F9FAFB',
        fontWeight: '700',
    },
    monthlyValue: {
        fontSize: isSmallScreen ? 16 : 18,
        fontWeight: '800',
    },
    calendarSubtitle: {
        fontSize: isSmallScreen ? 13 : 14,
        color: '#64748B',
        textAlign: 'center',
        marginBottom: isSmallScreen ? 16 : 20,
        paddingHorizontal: isSmallScreen ? 16 : 20,
    },
}); 