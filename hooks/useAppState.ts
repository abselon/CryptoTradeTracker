import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trade, CustomCoin, SellRecord, TimeFilter, DateRange } from '../types';

export const useAppState = () => {
    // Main data states
    const [trades, setTrades] = useState<Trade[]>([]);
    const [customCoins, setCustomCoins] = useState<CustomCoin[]>([]);

    // Modal visibility states
    const [modalVisible, setModalVisible] = useState(false);
    const [sellModalVisible, setSellModalVisible] = useState(false);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [addCoinModalVisible, setAddCoinModalVisible] = useState(false);
    const [currencyPickerVisible, setCurrencyPickerVisible] = useState(false);
    const [coinsModalVisible, setCoinsModalVisible] = useState(false);
    const [editCoinModalVisible, setEditCoinModalVisible] = useState(false);
    const [editTradeModalVisible, setEditTradeModalVisible] = useState(false);
    const [editSellModalVisible, setEditSellModalVisible] = useState(false);
    const [analyticsModalVisible, setAnalyticsModalVisible] = useState(false);
    const [chartsModalVisible, setChartsModalVisible] = useState(false);
    const [calendarModalVisible, setCalendarModalVisible] = useState(false);
    const [customRangeModalVisible, setCustomRangeModalVisible] = useState(false);

    // Selected items states
    const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
    const [editingCoin, setEditingCoin] = useState<CustomCoin | null>(null);
    const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
    const [editingSell, setEditingSell] = useState<SellRecord | null>(null);

    // Form states for creating trades
    const [tradeName, setTradeName] = useState('');
    const [currencyName, setCurrencyName] = useState('');
    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');
    const [usdtUsed, setUsdtUsed] = useState('');

    // Form states for adding coins
    const [newCoinName, setNewCoinName] = useState('');
    const [newCoinSymbol, setNewCoinSymbol] = useState('');

    // Form states for editing coins
    const [editCoinName, setEditCoinName] = useState('');
    const [editCoinSymbol, setEditCoinSymbol] = useState('');

    // Form states for editing trades
    const [editTradeName, setEditTradeName] = useState('');
    const [editCurrencyName, setEditCurrencyName] = useState('');
    const [editPrice, setEditPrice] = useState('');
    const [editAmount, setEditAmount] = useState('');
    const [editUsdtUsed, setEditUsdtUsed] = useState('');

    // Form states for selling
    const [sellPrice, setSellPrice] = useState('');
    const [sellAmount, setSellAmount] = useState('');
    const [sellUSDT, setSellUSDT] = useState('');

    // Form states for editing sells
    const [editSellPrice, setEditSellPrice] = useState('');
    const [editSellAmount, setEditSellAmount] = useState('');
    const [editSellUSDT, setEditSellUSDT] = useState('');

    // Time filter states
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('lifetime');
    const [customDateRange, setCustomDateRange] = useState<DateRange>({
        start: new Date(),
        end: new Date()
    });
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');

    // Analytics and Charts states
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [chartType, setChartType] = useState<'pnl' | 'roi' | 'cumulative'>('pnl');

    // Calendar navigation states
    const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date().getMonth());
    const [currentCalendarYear, setCurrentCalendarYear] = useState(new Date().getFullYear());

    // Load custom coins from storage on app start
    useEffect(() => {
        const loadCustomCoins = async () => {
            try {
                const savedCoins = await AsyncStorage.getItem('customCoins');
                if (savedCoins) {
                    setCustomCoins(JSON.parse(savedCoins));
                }
            } catch (error) {
                console.error('Error loading custom coins:', error);
            }
        };
        loadCustomCoins();
    }, []);

    // Save custom coins to storage whenever they change
    useEffect(() => {
        const saveCustomCoins = async () => {
            try {
                await AsyncStorage.setItem('customCoins', JSON.stringify(customCoins));
            } catch (error) {
                console.error('Error saving custom coins:', error);
            }
        };
        saveCustomCoins();
    }, [customCoins]);

    return {
        // Data states
        trades,
        setTrades,
        customCoins,
        setCustomCoins,

        // Modal states
        modalVisible,
        setModalVisible,
        sellModalVisible,
        setSellModalVisible,
        detailsModalVisible,
        setDetailsModalVisible,
        addCoinModalVisible,
        setAddCoinModalVisible,
        currencyPickerVisible,
        setCurrencyPickerVisible,
        coinsModalVisible,
        setCoinsModalVisible,
        editCoinModalVisible,
        setEditCoinModalVisible,
        editTradeModalVisible,
        setEditTradeModalVisible,
        editSellModalVisible,
        setEditSellModalVisible,
        analyticsModalVisible,
        setAnalyticsModalVisible,
        chartsModalVisible,
        setChartsModalVisible,
        calendarModalVisible,
        setCalendarModalVisible,
        customRangeModalVisible,
        setCustomRangeModalVisible,

        // Selected items
        selectedTrade,
        setSelectedTrade,
        editingCoin,
        setEditingCoin,
        editingTrade,
        setEditingTrade,
        editingSell,
        setEditingSell,

        // Form states
        tradeName,
        setTradeName,
        currencyName,
        setCurrencyName,
        price,
        setPrice,
        amount,
        setAmount,
        usdtUsed,
        setUsdtUsed,
        newCoinName,
        setNewCoinName,
        newCoinSymbol,
        setNewCoinSymbol,
        editCoinName,
        setEditCoinName,
        editCoinSymbol,
        setEditCoinSymbol,
        editTradeName,
        setEditTradeName,
        editCurrencyName,
        setEditCurrencyName,
        editPrice,
        setEditPrice,
        editAmount,
        setEditAmount,
        editUsdtUsed,
        setEditUsdtUsed,
        sellPrice,
        setSellPrice,
        sellAmount,
        setSellAmount,
        sellUSDT,
        setSellUSDT,
        editSellPrice,
        setEditSellPrice,
        editSellAmount,
        setEditSellAmount,
        editSellUSDT,
        setEditSellUSDT,

        // Time filter states
        timeFilter,
        setTimeFilter,
        customDateRange,
        setCustomDateRange,
        customStartDate,
        setCustomStartDate,
        customEndDate,
        setCustomEndDate,

        // Charts and analytics states
        selectedDate,
        setSelectedDate,
        chartType,
        setChartType,
        currentCalendarMonth,
        setCurrentCalendarMonth,
        currentCalendarYear,
        setCurrentCalendarYear,
    };
}; 