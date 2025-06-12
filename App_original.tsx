import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
  FlatList,
  Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

// Import types
import { Trade, CustomCoin, SellRecord } from './types';

// Import utilities
import {
  calculatePNL,
  calculateROI,
  calculateTotalPNL,
  calculateTotalROI,
  getCoinAnalytics,
  getTradeAnalytics,
  getFilteredTrades,
  getDailyData,
  getCumulativeData,
  getDeepAnalytics,
} from './utils/calculations';

// Import styles
import { styles } from './styles';

// Import hooks
import { useAppState } from './hooks/useAppState';

// Import components
import { Calendar } from './components/Calendar';

export default function App() {
  const state = useAppState();

  // Add coin modal states
  const [newCoinName, setNewCoinName] = useState('');
  const [newCoinSymbol, setNewCoinSymbol] = useState('');

  // Manage coins modal states
  const [coinsModalVisible, setCoinsModalVisible] = useState(false);
  const [editCoinModalVisible, setEditCoinModalVisible] = useState(false);
  const [editingCoin, setEditingCoin] = useState<CustomCoin | null>(null);
  const [editCoinName, setEditCoinName] = useState('');
  const [editCoinSymbol, setEditCoinSymbol] = useState('');

  // Edit trade modal states
  const [editTradeModalVisible, setEditTradeModalVisible] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [editTradeName, setEditTradeName] = useState('');
  const [editCurrencyName, setEditCurrencyName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editUsdtUsed, setEditUsdtUsed] = useState('');

  // Edit sell modal states
  const [editSellModalVisible, setEditSellModalVisible] = useState(false);
  const [editingSell, setEditingSell] = useState<SellRecord | null>(null);
  const [editSellPrice, setEditSellPrice] = useState('');
  const [editSellAmount, setEditSellAmount] = useState('');
  const [editSellUSDT, setEditSellUSDT] = useState('');

  // Time filter states
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('lifetime');
  const [customDateRange, setCustomDateRange] = useState<DateRange>({
    start: new Date(),
    end: new Date()
  });
  const [customRangeModalVisible, setCustomRangeModalVisible] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Analytics and Charts states
  const [analyticsModalVisible, setAnalyticsModalVisible] = useState(false);
  const [chartsModalVisible, setChartsModalVisible] = useState(false);
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [chartType, setChartType] = useState<'pnl' | 'roi' | 'cumulative'>('pnl');

  // Calendar navigation states
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date().getMonth());
  const [currentCalendarYear, setCurrentCalendarYear] = useState(new Date().getFullYear());

  // Load custom coins from storage on app start
  useEffect(() => {
    const loadCustomCoins = async () => {
      try {
        const savedCoins = localStorage.getItem('customCoins');
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
    try {
      localStorage.setItem('customCoins', JSON.stringify(customCoins));
    } catch (error) {
      console.error('Error saving custom coins:', error);
    }
  }, [customCoins]);

  const handleAddCoin = () => {
    if (!newCoinName || !newCoinSymbol) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newCoin: CustomCoin = {
      id: Date.now().toString(),
      name: newCoinName,
      symbol: newCoinSymbol.toUpperCase()
    };

    setCustomCoins([...customCoins, newCoin]);
    setNewCoinName('');
    setNewCoinSymbol('');
    setAddCoinModalVisible(false);
    Alert.alert('Success', 'Custom coin added successfully!');
  };

  const handleCreateTrade = () => {
    setModalVisible(true);
  };

  const handleAddCoinPress = () => {
    setAddCoinModalVisible(true);
  };

  const handleTradePress = (trade: Trade) => {
    if (trade.remainingAmount > 0) {
      setSelectedTrade(trade);
      setSellModalVisible(true);
      setSellPrice('');
      setSellAmount('');
      setSellUSDT('');
    }
  };

  const handleViewDetails = (trade: Trade) => {
    setSelectedTrade(trade);
    setDetailsModalVisible(true);
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (value && price) {
      const calculatedUSDT = (parseFloat(value) * parseFloat(price)).toFixed(2);
      setUsdtUsed(calculatedUSDT);
    } else {
      setUsdtUsed('');
    }
  };

  const handleUSDTChange = (value: string) => {
    setUsdtUsed(value);
    if (value && price) {
      const calculatedAmount = (parseFloat(value) / parseFloat(price)).toFixed(8);
      setAmount(calculatedAmount);
    } else {
      setAmount('');
    }
  };

  const handlePriceChange = (value: string) => {
    setPrice(value);
    if (amount && value) {
      const calculatedUSDT = (parseFloat(amount) * parseFloat(value)).toFixed(2);
      setUsdtUsed(calculatedUSDT);
    } else if (usdtUsed && value) {
      const calculatedAmount = (parseFloat(usdtUsed) / parseFloat(value)).toFixed(8);
      setAmount(calculatedAmount);
    }
  };

  // Sell modal handlers
  const [sellPrice, setSellPrice] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [sellUSDT, setSellUSDT] = useState('');

  const handleSellAmountChange = (value: string) => {
    setSellAmount(value);
    if (value && sellPrice) {
      const calculatedUSDT = (parseFloat(value) * parseFloat(sellPrice)).toFixed(2);
      setSellUSDT(calculatedUSDT);
    } else {
      setSellUSDT('');
    }
  };

  const handleSellUSDTChange = (value: string) => {
    setSellUSDT(value);
    if (value && sellPrice) {
      const calculatedAmount = (parseFloat(value) / parseFloat(sellPrice)).toFixed(8);
      setSellAmount(calculatedAmount);
    } else {
      setSellAmount('');
    }
  };

  const handleSellPriceChange = (value: string) => {
    setSellPrice(value);
    if (sellAmount && value) {
      const calculatedUSDT = (parseFloat(sellAmount) * parseFloat(value)).toFixed(2);
      setSellUSDT(calculatedUSDT);
    } else if (sellUSDT && value) {
      const calculatedAmount = (parseFloat(sellUSDT) / parseFloat(value)).toFixed(8);
      setSellAmount(calculatedAmount);
    }
  };

  const handleCurrencySelect = (symbol: string) => {
    setCurrencyName(symbol);
    setCurrencyPickerVisible(false);
  };

  const saveTrade = () => {
    if (!tradeName || !currencyName || !price || (!amount && !usdtUsed)) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const finalAmount = amount || (parseFloat(usdtUsed) / parseFloat(price)).toFixed(8);
    const finalUSDT = usdtUsed || (parseFloat(amount) * parseFloat(price)).toFixed(2);

    const newTrade: Trade = {
      id: Date.now().toString(),
      name: tradeName,
      currencyName: currencyName,
      price: parseFloat(price),
      amount: parseFloat(finalAmount),
      usdtUsed: parseFloat(finalUSDT),
      timestamp: new Date(),
      sells: [],
      remainingAmount: parseFloat(finalAmount),
    };

    setTrades([...trades, newTrade]);

    // Reset form
    setTradeName('');
    setCurrencyName('');
    setPrice('');
    setAmount('');
    setUsdtUsed('');
    setModalVisible(false);

    Alert.alert('Success', 'Trade saved successfully!');
  };

  const saveSell = () => {
    if (!selectedTrade || !sellPrice || (!sellAmount && !sellUSDT)) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const finalSellAmount = sellAmount || (parseFloat(sellUSDT) / parseFloat(sellPrice)).toFixed(8);
    const finalSellUSDT = sellUSDT || (parseFloat(sellAmount) * parseFloat(sellPrice)).toFixed(2);

    if (parseFloat(finalSellAmount) > selectedTrade.remainingAmount) {
      Alert.alert('Error', `Cannot sell more than remaining amount (${selectedTrade.remainingAmount.toFixed(8)})`);
      return;
    }

    const newSell: SellRecord = {
      id: Date.now().toString(),
      sellPrice: parseFloat(sellPrice),
      soldAmount: parseFloat(finalSellAmount),
      usdtReceived: parseFloat(finalSellUSDT),
      timestamp: new Date(),
    };

    const updatedTrades = trades.map(trade => {
      if (trade.id === selectedTrade.id) {
        return {
          ...trade,
          sells: [...trade.sells, newSell],
          remainingAmount: trade.remainingAmount - parseFloat(finalSellAmount),
        };
      }
      return trade;
    });

    setTrades(updatedTrades);
    setSellModalVisible(false);
    setSelectedTrade(null);
    Alert.alert('Success', 'Sell order saved successfully!');
  };

  const calculatePNL = (trade: Trade) => {
    const totalSellValue = trade.sells.reduce((sum, sell) => sum + sell.usdtReceived, 0);
    const soldAmount = trade.sells.reduce((sum, sell) => sum + sell.soldAmount, 0);
    const soldCostBasis = (soldAmount / trade.amount) * trade.usdtUsed;
    return totalSellValue - soldCostBasis;
  };

  const calculateROI = (trade: Trade) => {
    const totalSellValue = trade.sells.reduce((sum, sell) => sum + sell.usdtReceived, 0);
    const soldAmount = trade.sells.reduce((sum, sell) => sum + sell.soldAmount, 0);
    const soldCostBasis = (soldAmount / trade.amount) * trade.usdtUsed;
    if (soldCostBasis === 0) return 0;
    return ((totalSellValue - soldCostBasis) / soldCostBasis) * 100;
  };

  // Analytics functions for details modal
  const getTradeAnalytics = (trade: Trade) => {
    const totalSellValue = trade.sells.reduce((sum, sell) => sum + sell.usdtReceived, 0);
    const soldAmount = trade.sells.reduce((sum, sell) => sum + sell.soldAmount, 0);
    const soldCostBasis = (soldAmount / trade.amount) * trade.usdtUsed;
    const averageSellPrice = soldAmount > 0 ? totalSellValue / soldAmount : 0;
    const bestSell = trade.sells.length > 0 ? trade.sells.reduce((best, sell) =>
      sell.sellPrice > best.sellPrice ? sell : best) : null;
    const worstSell = trade.sells.length > 0 ? trade.sells.reduce((worst, sell) =>
      sell.sellPrice < worst.sellPrice ? sell : worst) : null;
    const daysHeld = Math.floor((new Date().getTime() - trade.timestamp.getTime()) / (1000 * 60 * 60 * 24));
    const remainingCostBasis = (trade.remainingAmount / trade.amount) * trade.usdtUsed;

    return {
      totalInvested: trade.usdtUsed,
      totalReceived: totalSellValue,
      netPnL: totalSellValue - soldCostBasis,
      roi: soldCostBasis > 0 ? ((totalSellValue - soldCostBasis) / soldCostBasis) * 100 : 0,
      averageBuyPrice: trade.price,
      averageSellPrice,
      soldAmount,
      soldPercentage: (soldAmount / trade.amount) * 100,
      bestSell,
      worstSell,
      daysHeld,
      numberOfSells: trade.sells.length,
      remainingValue: trade.remainingAmount,
      remainingCostBasis,
      status: trade.remainingAmount === 0 ? 'Completed' : 'Active'
    };
  };

  const renderSellHistory = (sells: SellRecord[]) => (
    <View style={styles.sellHistoryContainer}>
      <Text style={styles.sectionTitle}>Sell History</Text>
      {sells.length === 0 ? (
        <Text style={styles.noDataText}>No sells yet</Text>
      ) : (
        sells.map((sell, index) => (
          <View key={sell.id} style={styles.sellHistoryItem}>
            <View style={styles.sellHistoryHeader}>
              <Text style={styles.sellHistoryTitle}>Sell #{index + 1}</Text>
              <View style={styles.sellHistoryActions}>
                <TouchableOpacity
                  style={[styles.sellActionButton, styles.editButton]}
                  onPress={() => handleEditSell(selectedTrade!, sell)}
                >
                  <Text style={styles.sellActionButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sellActionButton, styles.deleteButton]}
                  onPress={() => handleDeleteSell(selectedTrade!, sell)}
                >
                  <Text style={styles.sellActionButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.sellHistoryDetail}>Price: ${sell.sellPrice.toFixed(2)}</Text>
            <Text style={styles.sellHistoryDetail}>Amount: {sell.soldAmount.toFixed(8)}</Text>
            <Text style={styles.sellHistoryDetail}>Received: ${sell.usdtReceived.toFixed(2)}</Text>
            <Text style={styles.sellHistoryDate}>
              {sell.timestamp.toLocaleDateString()} {sell.timestamp.toLocaleTimeString()}
            </Text>
          </View>
        ))
      )}
    </View>
  );

  const handleEditTrade = (trade: Trade) => {
    setEditingTrade(trade);
    setEditTradeName(trade.name);
    setEditCurrencyName(trade.currencyName);
    setEditPrice(trade.price.toString());
    setEditAmount(trade.amount.toString());
    setEditUsdtUsed(trade.usdtUsed.toString());
    setEditTradeModalVisible(true);
  };

  const handleUpdateTrade = () => {
    if (!editingTrade || !editTradeName || !editCurrencyName || !editPrice || !editAmount || !editUsdtUsed) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const updatedTrades = trades.map(trade =>
      trade.id === editingTrade.id
        ? {
          ...trade,
          name: editTradeName,
          currencyName: editCurrencyName,
          price: parseFloat(editPrice),
          amount: parseFloat(editAmount),
          usdtUsed: parseFloat(editUsdtUsed),
          remainingAmount: parseFloat(editAmount) // Reset remaining amount to new amount
        }
        : trade
    );

    setTrades(updatedTrades);
    setEditTradeModalVisible(false);
    setEditingTrade(null);
    setEditTradeName('');
    setEditCurrencyName('');
    setEditPrice('');
    setEditAmount('');
    setEditUsdtUsed('');
    Alert.alert('Success', 'Trade updated successfully!');
  };

  const handleDeleteTrade = (trade: Trade) => {
    Alert.alert(
      'Delete Trade',
      `Are you sure you want to delete trade "${trade.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedTrades = trades.filter(t => t.id !== trade.id);
            setTrades(updatedTrades);
            Alert.alert('Success', 'Trade deleted successfully!');
          }
        }
      ]
    );
  };

  const getSortedTrades = () => {
    return [...trades].sort((a, b) => {
      // First sort by active status (active trades first)
      if (a.remainingAmount > 0 && b.remainingAmount === 0) return -1;
      if (a.remainingAmount === 0 && b.remainingAmount > 0) return 1;

      // Then sort by date (newest first)
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  };

  const renderTrade = ({ item }: { item: Trade }) => {
    const pnl = calculatePNL(item);
    const roi = calculateROI(item);
    const hasSells = item.sells.length > 0;
    const isCompletelyTraded = item.remainingAmount === 0;

    return (
      <View style={[
        styles.tradeItem,
        isCompletelyTraded && styles.completedTrade
      ]}>
        <View style={styles.tradeHeader}>
          <Text style={styles.tradeName}>{item.name}</Text>
          <View style={styles.tradeActions}>
            <TouchableOpacity
              style={[styles.tradeActionButton, styles.editButton]}
              onPress={() => handleEditTrade(item)}
            >
              <Text style={styles.tradeActionButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tradeActionButton, styles.deleteButton]}
              onPress={() => handleDeleteTrade(item)}
            >
              <Text style={styles.tradeActionButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.tradeDetail}>{item.currencyName}</Text>
        <Text style={styles.tradeDetail}>Buy Price: ${item.price}</Text>
        <Text style={styles.tradeDetail}>Original Amount: {item.amount.toFixed(8)}</Text>
        <Text style={styles.tradeDetail}>Remaining: {item.remainingAmount.toFixed(8)}</Text>
        <Text style={styles.tradeDetail}>Original USDT: ${item.usdtUsed.toFixed(2)}</Text>

        {hasSells && (
          <View style={styles.pnlContainer}>
            <Text style={[styles.pnlText, pnl >= 0 ? styles.profit : styles.loss]}>
              PNL: ${pnl.toFixed(2)}
            </Text>
            <Text style={[styles.roiText, roi >= 0 ? styles.profit : styles.loss]}>
              ROI: {roi.toFixed(2)}%
            </Text>
          </View>
        )}

        <Text style={styles.tradeTimestamp}>
          {item.timestamp.toLocaleDateString()} {item.timestamp.toLocaleTimeString()}
        </Text>

        <View style={styles.tradeButtons}>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => handleViewDetails(item)}
          >
            <Text style={styles.detailsButtonText}>View Details</Text>
          </TouchableOpacity>

          {!isCompletelyTraded && (
            <TouchableOpacity
              style={styles.sellButton}
              onPress={() => handleTradePress(item)}
            >
              <Text style={styles.sellButtonText}>Sell</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const handleEditCoin = (coin: CustomCoin) => {
    setEditingCoin(coin);
    setEditCoinName(coin.name);
    setEditCoinSymbol(coin.symbol);
    setEditCoinModalVisible(true);
  };

  const handleUpdateCoin = () => {
    if (!editingCoin || !editCoinName || !editCoinSymbol) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const updatedCoins = customCoins.map(coin =>
      coin.id === editingCoin.id
        ? { ...coin, name: editCoinName, symbol: editCoinSymbol.toUpperCase() }
        : coin
    );

    setCustomCoins(updatedCoins);
    setEditCoinModalVisible(false);
    setEditingCoin(null);
    setEditCoinName('');
    setEditCoinSymbol('');
    Alert.alert('Success', 'Coin updated successfully!');
  };

  const handleDeleteCoin = (coin: CustomCoin) => {
    Alert.alert(
      'Delete Coin',
      `Are you sure you want to delete ${coin.name} (${coin.symbol})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedCoins = customCoins.filter(c => c.id !== coin.id);
            setCustomCoins(updatedCoins);
            Alert.alert('Success', 'Coin deleted successfully!');
          }
        }
      ]
    );
  };

  const getCoinAnalytics = (symbol: string): CoinAnalytics => {
    const coinTrades = trades.filter(trade => trade.currencyName === symbol);
    const totalTrades = coinTrades.length;
    const totalInvested = coinTrades.reduce((sum, trade) => sum + trade.usdtUsed, 0);
    const totalSold = coinTrades.reduce((sum, trade) =>
      sum + trade.sells.reduce((sellSum, sell) => sellSum + sell.usdtReceived, 0), 0);
    const currentHoldings = coinTrades.reduce((sum, trade) =>
      sum + (trade.remainingAmount * trade.price), 0);
    const totalProfit = totalSold + currentHoldings - totalInvested;

    const rois = coinTrades.map(trade => calculateROI(trade));
    const averageROI = rois.length > 0 ? rois.reduce((sum, roi) => sum + roi, 0) / rois.length : 0;

    const profits = coinTrades.map(trade => calculatePNL(trade));
    const bestTrade = profits.length > 0 ? Math.max(...profits) : 0;
    const worstTrade = profits.length > 0 ? Math.min(...profits) : 0;

    return {
      totalTrades,
      totalInvested,
      totalSold,
      currentHoldings,
      totalProfit,
      averageROI,
      bestTrade,
      worstTrade
    };
  };

  const renderCoinItem = ({ item }: { item: CustomCoin }) => {
    const analytics = getCoinAnalytics(item.symbol);

    return (
      <View style={styles.coinItem}>
        <View style={styles.coinHeader}>
          <View>
            <Text style={styles.coinName}>{item.name}</Text>
            <Text style={styles.coinSymbol}>{item.symbol}</Text>
          </View>
          <View style={styles.coinActions}>
            <TouchableOpacity
              style={[styles.coinActionButton, styles.editButton]}
              onPress={() => handleEditCoin(item)}
            >
              <Text style={styles.coinActionButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.coinActionButton, styles.deleteButton]}
              onPress={() => handleDeleteCoin(item)}
            >
              <Text style={styles.coinActionButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.analyticsContainer}>
          <View style={styles.analyticsRow}>
            <View style={styles.analyticsItem}>
              <Text style={styles.analyticsLabel}>Total Trades</Text>
              <Text style={styles.analyticsValue}>{analytics.totalTrades}</Text>
            </View>
            <View style={styles.analyticsItem}>
              <Text style={styles.analyticsLabel}>Total Invested</Text>
              <Text style={styles.analyticsValue}>${analytics.totalInvested.toFixed(2)}</Text>
            </View>
          </View>
          <View style={styles.analyticsRow}>
            <View style={styles.analyticsItem}>
              <Text style={styles.analyticsLabel}>Total Sold</Text>
              <Text style={styles.analyticsValue}>${analytics.totalSold.toFixed(2)}</Text>
            </View>
            <View style={styles.analyticsItem}>
              <Text style={styles.analyticsLabel}>Current Holdings</Text>
              <Text style={styles.analyticsValue}>${analytics.currentHoldings.toFixed(2)}</Text>
            </View>
          </View>
          <View style={styles.analyticsRow}>
            <View style={styles.analyticsItem}>
              <Text style={styles.analyticsLabel}>Total Profit/Loss</Text>
              <Text style={[styles.analyticsValue, analytics.totalProfit >= 0 ? styles.profit : styles.loss]}>
                ${analytics.totalProfit.toFixed(2)}
              </Text>
            </View>
            <View style={styles.analyticsItem}>
              <Text style={styles.analyticsLabel}>Average ROI</Text>
              <Text style={[styles.analyticsValue, analytics.averageROI >= 0 ? styles.profit : styles.loss]}>
                {analytics.averageROI.toFixed(2)}%
              </Text>
            </View>
          </View>
          <View style={styles.analyticsRow}>
            <View style={styles.analyticsItem}>
              <Text style={styles.analyticsLabel}>Best Trade</Text>
              <Text style={[styles.analyticsValue, styles.profit]}>
                ${analytics.bestTrade.toFixed(2)}
              </Text>
            </View>
            <View style={styles.analyticsItem}>
              <Text style={styles.analyticsLabel}>Worst Trade</Text>
              <Text style={[styles.analyticsValue, styles.loss]}>
                ${analytics.worstTrade.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const handleEditSell = (trade: Trade, sell: SellRecord) => {
    setSelectedTrade(trade);
    setEditingSell(sell);
    setEditSellPrice(sell.sellPrice.toString());
    setEditSellAmount(sell.soldAmount.toString());
    setEditSellUSDT(sell.usdtReceived.toString());
    setEditSellModalVisible(true);
  };

  const handleUpdateSell = () => {
    if (!selectedTrade || !editingSell || !editSellPrice || !editSellAmount || !editSellUSDT) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newSellAmount = parseFloat(editSellAmount);
    const oldSellAmount = editingSell.soldAmount;
    const amountDifference = newSellAmount - oldSellAmount;

    // Check if the new amount would exceed the remaining amount
    if (amountDifference > selectedTrade.remainingAmount + oldSellAmount) {
      Alert.alert('Error', 'Cannot increase sell amount beyond remaining amount');
      return;
    }

    const updatedTrades = trades.map(trade => {
      if (trade.id === selectedTrade.id) {
        const updatedSells = trade.sells.map(sell =>
          sell.id === editingSell.id
            ? {
              ...sell,
              sellPrice: parseFloat(editSellPrice),
              soldAmount: newSellAmount,
              usdtReceived: parseFloat(editSellUSDT)
            }
            : sell
        );

        return {
          ...trade,
          sells: updatedSells,
          remainingAmount: trade.remainingAmount + oldSellAmount - newSellAmount
        };
      }
      return trade;
    });

    setTrades(updatedTrades);
    setEditSellModalVisible(false);
    setEditingSell(null);
    setEditSellPrice('');
    setEditSellAmount('');
    setEditSellUSDT('');
    Alert.alert('Success', 'Sell record updated successfully!');
  };

  const handleDeleteSell = (trade: Trade, sell: SellRecord) => {
    Alert.alert(
      'Delete Sell Record',
      `Are you sure you want to delete this sell record?\nAmount: ${sell.soldAmount}\nPrice: $${sell.sellPrice}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedTrades = trades.map(t => {
              if (t.id === trade.id) {
                return {
                  ...t,
                  sells: t.sells.filter(s => s.id !== sell.id),
                  remainingAmount: t.remainingAmount + sell.soldAmount
                };
              }
              return t;
            });
            setTrades(updatedTrades);
            Alert.alert('Success', 'Sell record deleted successfully!');
          }
        }
      ]
    );
  };

  const getFilteredTrades = () => {
    const now = new Date();
    let startDate: Date;

    switch (timeFilter) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'custom':
        return trades.filter(trade =>
          trade.timestamp >= customDateRange.start &&
          trade.timestamp <= customDateRange.end
        );
      case 'lifetime':
      default:
        return trades;
    }

    return trades.filter(trade => trade.timestamp >= startDate);
  };

  const calculateTotalPNL = (filteredTrades: Trade[]) => {
    return filteredTrades.reduce((total, trade) => total + calculatePNL(trade), 0);
  };

  const calculateTotalROI = (filteredTrades: Trade[]) => {
    const totalInvested = filteredTrades.reduce((total, trade) => total + trade.usdtUsed, 0);
    if (totalInvested === 0) return 0;
    return (calculateTotalPNL(filteredTrades) / totalInvested) * 100;
  };

  const handleCustomRangeSelect = () => {
    if (!customStartDate || !customEndDate) {
      Alert.alert('Error', 'Please select both start and end dates');
      return;
    }

    const start = new Date(customStartDate);
    const end = new Date(customEndDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      Alert.alert('Error', 'Invalid date format');
      return;
    }

    if (start > end) {
      Alert.alert('Error', 'Start date cannot be after end date');
      return;
    }

    setCustomDateRange({ start, end });
    setTimeFilter('custom');
    setCustomRangeModalVisible(false);
  };

  const renderTimeFilter = (filter: TimeFilter, label: string) => (
    <TouchableOpacity
      style={[
        styles.timeFilterButton,
        timeFilter === filter && styles.timeFilterButtonActive
      ]}
      onPress={() => setTimeFilter(filter)}
    >
      <Text style={[
        styles.timeFilterButtonText,
        timeFilter === filter && styles.timeFilterButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  // Analytics Functions
  const getDailyData = (): DailyData[] => {
    const dailyMap = new Map<string, DailyData>();

    // Process all trades and sells
    trades.forEach(trade => {
      const tradeDate = trade.timestamp.toISOString().split('T')[0];

      if (!dailyMap.has(tradeDate)) {
        dailyMap.set(tradeDate, {
          date: tradeDate,
          pnl: 0,
          roi: 0,
          trades: 0,
          sells: 0
        });
      }

      const dayData = dailyMap.get(tradeDate)!;
      dayData.trades += 1;

      // Add sell data for this trade
      trade.sells.forEach(sell => {
        const sellDate = sell.timestamp.toISOString().split('T')[0];

        if (!dailyMap.has(sellDate)) {
          dailyMap.set(sellDate, {
            date: sellDate,
            pnl: 0,
            roi: 0,
            trades: 0,
            sells: 0
          });
        }

        const sellDayData = dailyMap.get(sellDate)!;
        sellDayData.sells += 1;

        // Calculate PNL for this sell
        const soldCostBasis = (sell.soldAmount / trade.amount) * trade.usdtUsed;
        const sellPnL = sell.usdtReceived - soldCostBasis;
        sellDayData.pnl += sellPnL;

        if (soldCostBasis > 0) {
          sellDayData.roi += (sellPnL / soldCostBasis) * 100;
        }
      });
    });

    return Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  };

  const getCumulativeData = (): { labels: string[], data: number[] } => {
    const dailyData = getDailyData();
    let cumulative = 0;
    const labels: string[] = [];
    const data: number[] = [];

    dailyData.forEach(day => {
      cumulative += day.pnl;
      labels.push(new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      data.push(cumulative);
    });

    return { labels, data };
  };

  const getDeepAnalytics = (): DeepAnalytics => {
    const totalTrades = trades.length;
    const totalInvested = trades.reduce((sum, trade) => sum + trade.usdtUsed, 0);

    let totalRealized = 0;
    let totalUnrealized = 0;
    let totalWins = 0;
    let totalLosses = 0;
    let largestWin = 0;
    let largestLoss = 0;
    let totalHoldingDays = 0;

    const coinPerformance = new Map<string, number>();
    const monthlyMap = new Map<string, number>();

    trades.forEach(trade => {
      const tradePnL = calculatePNL(trade);
      const holdingDays = Math.floor((new Date().getTime() - trade.timestamp.getTime()) / (1000 * 60 * 60 * 24));
      totalHoldingDays += holdingDays;

      // Realized PNL from sells
      const realizedPnL = trade.sells.reduce((sum, sell) => {
        const soldCostBasis = (sell.soldAmount / trade.amount) * trade.usdtUsed;
        return sum + (sell.usdtReceived - soldCostBasis);
      }, 0);

      totalRealized += realizedPnL;

      // Unrealized PNL from remaining holdings
      const unrealizedPnL = tradePnL - realizedPnL;
      totalUnrealized += unrealizedPnL;

      // Win/Loss tracking
      if (tradePnL > 0) totalWins++;
      if (tradePnL < 0) totalLosses++;

      // Largest win/loss
      if (realizedPnL > largestWin) largestWin = realizedPnL;
      if (realizedPnL < largestLoss) largestLoss = realizedPnL;

      // Coin performance
      const currentCoinPnL = coinPerformance.get(trade.currencyName) || 0;
      coinPerformance.set(trade.currencyName, currentCoinPnL + tradePnL);

      // Monthly performance
      trade.sells.forEach(sell => {
        const monthKey = sell.timestamp.toISOString().substring(0, 7); // YYYY-MM
        const sellPnL = sell.usdtReceived - ((sell.soldAmount / trade.amount) * trade.usdtUsed);
        const currentMonthPnL = monthlyMap.get(monthKey) || 0;
        monthlyMap.set(monthKey, currentMonthPnL + sellPnL);
      });
    });

    const netPnL = totalRealized + totalUnrealized;
    const averageTradeAmount = totalTrades > 0 ? totalInvested / totalTrades : 0;
    const averageHoldingPeriod = totalTrades > 0 ? totalHoldingDays / totalTrades : 0;
    const winRate = totalTrades > 0 ? (totalWins / totalTrades) * 100 : 0;

    // Best and worst performing coins
    let bestCoin = '';
    let worstCoin = '';
    let bestPerformance = -Infinity;
    let worstPerformance = Infinity;

    coinPerformance.forEach((pnl, coin) => {
      if (pnl > bestPerformance) {
        bestPerformance = pnl;
        bestCoin = coin;
      }
      if (pnl < worstPerformance) {
        worstPerformance = pnl;
        worstCoin = coin;
      }
    });

    // Monthly performance array
    const monthlyPerformance = Array.from(monthlyMap.entries())
      .map(([month, pnl]) => ({ month, pnl }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Trading frequency (trades per day since first trade)
    const firstTradeDate = trades.length > 0 ? Math.min(...trades.map(t => t.timestamp.getTime())) : Date.now();
    const daysSinceFirst = Math.max(1, Math.floor((Date.now() - firstTradeDate) / (1000 * 60 * 60 * 24)));
    const tradingFrequency = totalTrades / daysSinceFirst;

    // Profit factor (gross profit / gross loss)
    const grossProfit = Math.max(0, totalRealized);
    const grossLoss = Math.abs(Math.min(0, totalRealized));
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;

    return {
      totalTrades,
      totalInvested,
      totalRealized,
      totalUnrealized,
      netPnL,
      averageTradeAmount,
      averageHoldingPeriod,
      winRate,
      bestPerformingCoin: bestCoin,
      worstPerformingCoin: worstCoin,
      monthlyPerformance,
      tradingFrequency,
      largestWin,
      largestLoss,
      profitFactor
    };
  };

  const getChartData = () => {
    const dailyData = getDailyData();
    const screenWidth = Dimensions.get('window').width;

    if (dailyData.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{ data: [0] }]
      };
    }

    const last30Days = dailyData.slice(-30);

    switch (chartType) {
      case 'pnl':
        return {
          labels: last30Days.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
          datasets: [{
            data: last30Days.map(d => d.pnl),
            strokeWidth: 2,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`
          }]
        };
      case 'roi':
        return {
          labels: last30Days.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
          datasets: [{
            data: last30Days.map(d => d.roi),
            strokeWidth: 2,
            color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`
          }]
        };
      case 'cumulative':
        const cumulative = getCumulativeData();
        return {
          labels: cumulative.labels.slice(-30),
          datasets: [{
            data: cumulative.data.slice(-30),
            strokeWidth: 2,
            color: (opacity = 1) => `rgba(156, 39, 176, ${opacity})`
          }]
        };
      default:
        return {
          labels: ['No Data'],
          datasets: [{ data: [0] }]
        };
    }
  };

  const getCalendarData = () => {
    const dailyData = getDailyData();
    const calendarMap = new Map<string, DailyData>();

    dailyData.forEach(day => {
      calendarMap.set(day.date, day);
    });

    return calendarMap;
  };

  const renderCalendar = () => {
    const calendarData = getCalendarData();
    const today = new Date();
    const isCurrentMonth = currentCalendarMonth === today.getMonth() && currentCalendarYear === today.getFullYear();

    // Get first day of month and number of days
    const firstDay = new Date(currentCalendarYear, currentCalendarMonth, 1);
    const lastDay = new Date(currentCalendarYear, currentCalendarMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const weeks = [];
    let currentWeek = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      currentWeek.push(null);
    }

    // Add days of the month
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

    // Fill remaining cells in last week
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
      setSelectedDate(''); // Clear selection when navigating
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
          fontWeight: '800' as const,
        };
      }

      return [baseStyle, additionalStyles];
    };

    return (
      <View style={styles.calendar}>
        {/* Calendar Header with Navigation */}
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

        {/* Legend */}
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

        {/* Week Header */}
        <View style={styles.calendarWeekHeader}>
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
            <Text key={day} style={styles.calendarWeekDay}>{day}</Text>
          ))}
        </View>

        {/* Calendar Grid */}
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PNL Tracker</Text>

      {/* Summary Section */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total PNL</Text>
            <Text style={[
              styles.summaryValue,
              calculateTotalPNL(getFilteredTrades()) >= 0 ? styles.profit : styles.loss
            ]}>
              ${calculateTotalPNL(getFilteredTrades()).toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total ROI</Text>
            <Text style={[
              styles.summaryValue,
              calculateTotalROI(getFilteredTrades()) >= 0 ? styles.profit : styles.loss
            ]}>
              {calculateTotalROI(getFilteredTrades()).toFixed(2)}%
            </Text>
          </View>
        </View>

        {/* Time Filters */}
        <View style={styles.timeFiltersContainer}>
          {renderTimeFilter('today', 'Today')}
          {renderTimeFilter('7d', '7D')}
          {renderTimeFilter('30d', '30D')}
          {renderTimeFilter('lifetime', 'Lifetime')}
          {renderTimeFilter('custom', 'Custom')}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateTrade}>
          <Text style={styles.createButtonText}>Create Trade</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addCoinButton} onPress={handleAddCoinPress}>
          <Text style={[styles.createButtonText, { color: '#EAECEF' }]}>Add Custom Coin</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.manageCoinsButton}
          onPress={() => setCoinsModalVisible(true)}
        >
          <Text style={[styles.createButtonText, { color: '#EAECEF' }]}>Manage Coins</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.analyticsButtonContainer}>
        <TouchableOpacity
          style={styles.analyticsButton}
          onPress={() => setChartsModalVisible(true)}
        >
          <Text style={styles.analyticsButtonText}>📊 Charts</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.analyticsButton}
          onPress={() => setCalendarModalVisible(true)}
        >
          <Text style={styles.analyticsButtonText}>📅 Calendar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.analyticsButton}
          onPress={() => setAnalyticsModalVisible(true)}
        >
          <Text style={styles.analyticsButtonText}>📈 Analytics</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={getSortedTrades().filter(trade => {
          const filteredTrades = getFilteredTrades();
          return filteredTrades.some(t => t.id === trade.id);
        })}
        renderItem={renderTrade}
        keyExtractor={(item) => item.id}
        style={styles.tradesList}
        showsVerticalScrollIndicator={false}
      />

      {/* Add Custom Coin Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addCoinModalVisible}
        onRequestClose={() => setAddCoinModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Custom Coin</Text>

            <Text style={styles.inputLabel}>Coin Name</Text>
            <TextInput
              style={styles.input}
              value={newCoinName}
              onChangeText={setNewCoinName}
              placeholder="e.g., Bitcoin, Ethereum"
              placeholderTextColor="#5E6673"
            />

            <Text style={styles.inputLabel}>Coin Symbol</Text>
            <TextInput
              style={styles.input}
              value={newCoinSymbol}
              onChangeText={(text) => setNewCoinSymbol(text.toUpperCase())}
              placeholder="e.g., BTC, ETH"
              placeholderTextColor="#5E6673"
              maxLength={10}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setAddCoinModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddCoin}
              >
                <Text style={styles.saveButtonText}>Add Coin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Trade Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Create New Trade</Text>

              <Text style={styles.inputLabel}>Trade Name</Text>
              <TextInput
                style={styles.input}
                value={tradeName}
                onChangeText={setTradeName}
                placeholder="Enter trade name"
                placeholderTextColor="#5E6673"
              />

              <Text style={styles.inputLabel}>Currency</Text>
              <TouchableOpacity
                style={styles.currencySelector}
                onPress={() => setCurrencyPickerVisible(true)}
              >
                <Text style={currencyName ? styles.currencySelectorText : styles.currencySelectorPlaceholder}>
                  {currencyName ? customCoins.find(coin => coin.symbol === currencyName)?.name || currencyName : 'Select a currency'}
                </Text>
              </TouchableOpacity>

              {/* Currency Picker Modal */}
              <Modal
                animationType="slide"
                transparent={true}
                visible={currencyPickerVisible}
                onRequestClose={() => setCurrencyPickerVisible(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Select Currency</Text>
                    <ScrollView style={styles.currencyList}>
                      {customCoins.map((coin) => (
                        <TouchableOpacity
                          key={coin.id}
                          style={styles.currencyItem}
                          onPress={() => handleCurrencySelect(coin.symbol)}
                        >
                          <Text style={styles.currencyItemText}>{coin.name} ({coin.symbol})</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.cancelButton]}
                      onPress={() => setCurrencyPickerVisible(false)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              <Text style={styles.inputLabel}>Price (USD)</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={handlePriceChange}
                placeholder="Enter price per coin"
                keyboardType="numeric"
                placeholderTextColor="#5E6673"
              />

              <Text style={styles.inputLabel}>Amount Bought</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={handleAmountChange}
                placeholder="Amount of coins"
                keyboardType="numeric"
                placeholderTextColor="#5E6673"
              />

              <Text style={styles.orText}>OR</Text>

              <Text style={styles.inputLabel}>USDT Used</Text>
              <TextInput
                style={styles.input}
                value={usdtUsed}
                onChangeText={handleUSDTChange}
                placeholder="Total USDT spent"
                keyboardType="numeric"
                placeholderTextColor="#5E6673"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={saveTrade}
                >
                  <Text style={styles.saveButtonText}>Save Trade</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Sell Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={sellModalVisible}
        onRequestClose={() => setSellModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Sell {selectedTrade?.currencyName}</Text>
              <Text style={styles.availableAmount}>
                Available: {selectedTrade?.remainingAmount.toFixed(8)} {selectedTrade?.currencyName}
              </Text>

              <Text style={styles.inputLabel}>Sell Price (USD)</Text>
              <TextInput
                style={styles.input}
                value={sellPrice}
                onChangeText={handleSellPriceChange}
                placeholder="Current sell price"
                keyboardType="numeric"
                placeholderTextColor="#5E6673"
              />

              <Text style={styles.inputLabel}>Amount to Sell</Text>
              <TextInput
                style={styles.input}
                value={sellAmount}
                onChangeText={handleSellAmountChange}
                placeholder="Amount to sell"
                keyboardType="numeric"
                placeholderTextColor="#5E6673"
              />

              <Text style={styles.orText}>OR</Text>

              <Text style={styles.inputLabel}>USDT to Receive</Text>
              <TextInput
                style={styles.input}
                value={sellUSDT}
                onChangeText={handleSellUSDTChange}
                placeholder="Total USDT to receive"
                keyboardType="numeric"
                placeholderTextColor="#5E6673"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setSellModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.sellButtonStyle]}
                  onPress={saveSell}
                >
                  <Text style={styles.sellButtonText}>Sell</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailsModalVisible}
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.detailsModalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedTrade && (() => {
                const analytics = getTradeAnalytics(selectedTrade);
                return (
                  <>
                    <Text style={styles.modalTitle}>Trade Details</Text>
                    <Text style={styles.detailsSubtitle}>{selectedTrade.name} ({selectedTrade.currencyName})</Text>

                    {/* Statistical Information */}
                    <View style={styles.detailsSection}>
                      <Text style={styles.sectionTitle}>📊 Statistical Overview</Text>
                      <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Total Invested</Text>
                          <Text style={styles.statValue}>${analytics.totalInvested.toFixed(2)}</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Total Received</Text>
                          <Text style={styles.statValue}>${analytics.totalReceived.toFixed(2)}</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Net P&L</Text>
                          <Text style={[styles.statValue, analytics.netPnL >= 0 ? styles.profit : styles.loss]}>
                            ${analytics.netPnL.toFixed(2)}
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>ROI</Text>
                          <Text style={[styles.statValue, analytics.roi >= 0 ? styles.profit : styles.loss]}>
                            {analytics.roi.toFixed(2)}%
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Meta Information */}
                    <View style={styles.detailsSection}>
                      <Text style={styles.sectionTitle}>📋 Meta Information</Text>
                      <View style={styles.metaContainer}>
                        <Text style={styles.metaItem}>Status: <Text style={styles.metaValue}>{analytics.status}</Text></Text>
                        <Text style={styles.metaItem}>Days Held: <Text style={styles.metaValue}>{analytics.daysHeld}</Text></Text>
                        <Text style={styles.metaItem}>Number of Sells: <Text style={styles.metaValue}>{analytics.numberOfSells}</Text></Text>
                        <Text style={styles.metaItem}>Sold Percentage: <Text style={styles.metaValue}>{analytics.soldPercentage.toFixed(2)}%</Text></Text>
                        <Text style={styles.metaItem}>Created: <Text style={styles.metaValue}>
                          {selectedTrade.timestamp.toLocaleDateString()} {selectedTrade.timestamp.toLocaleTimeString()}
                        </Text></Text>
                      </View>
                    </View>

                    {/* Analytical Details */}
                    <View style={styles.detailsSection}>
                      <Text style={styles.sectionTitle}>📈 Analytical Details</Text>
                      <View style={styles.analyticsContainer}>
                        <Text style={styles.analyticsItem}>Average Buy Price: <Text style={styles.analyticsValue}>${analytics.averageBuyPrice.toFixed(2)}</Text></Text>
                        {analytics.averageSellPrice > 0 && (
                          <Text style={styles.analyticsItem}>Average Sell Price: <Text style={styles.analyticsValue}>${analytics.averageSellPrice.toFixed(2)}</Text></Text>
                        )}
                        <Text style={styles.analyticsItem}>Remaining Amount: <Text style={styles.analyticsValue}>{analytics.remainingValue.toFixed(8)}</Text></Text>
                        <Text style={styles.analyticsItem}>Remaining Cost Basis: <Text style={styles.analyticsValue}>${analytics.remainingCostBasis.toFixed(2)}</Text></Text>
                        {analytics.bestSell && (
                          <Text style={styles.analyticsItem}>Best Sell Price: <Text style={[styles.analyticsValue, styles.profit]}>${analytics.bestSell.sellPrice.toFixed(2)}</Text></Text>
                        )}
                        {analytics.worstSell && analytics.numberOfSells > 1 && (
                          <Text style={styles.analyticsItem}>Worst Sell Price: <Text style={[styles.analyticsValue, styles.loss]}>${analytics.worstSell.sellPrice.toFixed(2)}</Text></Text>
                        )}
                      </View>
                    </View>

                    {/* Sell History */}
                    {renderSellHistory(selectedTrade.sells)}

                    <TouchableOpacity
                      style={styles.closeDetailsButton}
                      onPress={() => setDetailsModalVisible(false)}
                    >
                      <Text style={styles.closeDetailsButtonText}>Close</Text>
                    </TouchableOpacity>
                  </>
                );
              })()}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Manage Coins Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={coinsModalVisible}
        onRequestClose={() => setCoinsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Manage Custom Coins</Text>
            <FlatList
              data={customCoins}
              renderItem={renderCoinItem}
              keyExtractor={(item) => item.id}
              style={styles.coinsList}
              showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setCoinsModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Coin Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editCoinModalVisible}
        onRequestClose={() => setEditCoinModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Coin</Text>

            <Text style={styles.inputLabel}>Coin Name</Text>
            <TextInput
              style={styles.input}
              value={editCoinName}
              onChangeText={setEditCoinName}
              placeholder="e.g., Bitcoin, Ethereum"
              placeholderTextColor="#5E6673"
            />

            <Text style={styles.inputLabel}>Coin Symbol</Text>
            <TextInput
              style={styles.input}
              value={editCoinSymbol}
              onChangeText={(text) => setEditCoinSymbol(text.toUpperCase())}
              placeholder="e.g., BTC, ETH"
              placeholderTextColor="#5E6673"
              maxLength={10}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditCoinModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleUpdateCoin}
              >
                <Text style={styles.saveButtonText}>Update Coin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Trade Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editTradeModalVisible}
        onRequestClose={() => setEditTradeModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Edit Trade</Text>

              <Text style={styles.inputLabel}>Trade Name</Text>
              <TextInput
                style={styles.input}
                value={editTradeName}
                onChangeText={setEditTradeName}
                placeholder="Enter trade name"
                placeholderTextColor="#5E6673"
              />

              <Text style={styles.inputLabel}>Currency</Text>
              <TouchableOpacity
                style={styles.currencySelector}
                onPress={() => setCurrencyPickerVisible(true)}
              >
                <Text style={editCurrencyName ? styles.currencySelectorText : styles.currencySelectorPlaceholder}>
                  {editCurrencyName ? customCoins.find(coin => coin.symbol === editCurrencyName)?.name || editCurrencyName : 'Select a currency'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.inputLabel}>Price (USD)</Text>
              <TextInput
                style={styles.input}
                value={editPrice}
                onChangeText={(value) => {
                  setEditPrice(value);
                  if (value && editAmount) {
                    const calculatedUSDT = (parseFloat(value) * parseFloat(editAmount)).toFixed(2);
                    setEditUsdtUsed(calculatedUSDT);
                  }
                }}
                placeholder="Enter price per coin"
                keyboardType="numeric"
                placeholderTextColor="#5E6673"
              />

              <Text style={styles.inputLabel}>Amount Bought</Text>
              <TextInput
                style={styles.input}
                value={editAmount}
                onChangeText={(value) => {
                  setEditAmount(value);
                  if (value && editPrice) {
                    const calculatedUSDT = (parseFloat(value) * parseFloat(editPrice)).toFixed(2);
                    setEditUsdtUsed(calculatedUSDT);
                  }
                }}
                placeholder="Amount of coins"
                keyboardType="numeric"
                placeholderTextColor="#5E6673"
              />

              <Text style={styles.orText}>OR</Text>

              <Text style={styles.inputLabel}>USDT Used</Text>
              <TextInput
                style={styles.input}
                value={editUsdtUsed}
                onChangeText={(value) => {
                  setEditUsdtUsed(value);
                  if (value && editPrice) {
                    const calculatedAmount = (parseFloat(value) / parseFloat(editPrice)).toFixed(8);
                    setEditAmount(calculatedAmount);
                  }
                }}
                placeholder="Total USDT spent"
                keyboardType="numeric"
                placeholderTextColor="#5E6673"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setEditTradeModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleUpdateTrade}
                >
                  <Text style={styles.saveButtonText}>Update Trade</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Sell Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editSellModalVisible}
        onRequestClose={() => setEditSellModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Edit Sell Record</Text>
              <Text style={styles.availableAmount}>
                Available: {selectedTrade?.remainingAmount.toFixed(8)} {selectedTrade?.currencyName}
              </Text>

              <Text style={styles.inputLabel}>Sell Price (USD)</Text>
              <TextInput
                style={styles.input}
                value={editSellPrice}
                onChangeText={(value) => {
                  setEditSellPrice(value);
                  if (value && editSellAmount) {
                    const calculatedUSDT = (parseFloat(value) * parseFloat(editSellAmount)).toFixed(2);
                    setEditSellUSDT(calculatedUSDT);
                  }
                }}
                placeholder="Current sell price"
                keyboardType="numeric"
                placeholderTextColor="#5E6673"
              />

              <Text style={styles.inputLabel}>Amount Sold</Text>
              <TextInput
                style={styles.input}
                value={editSellAmount}
                onChangeText={(value) => {
                  setEditSellAmount(value);
                  if (value && editSellPrice) {
                    const calculatedUSDT = (parseFloat(value) * parseFloat(editSellPrice)).toFixed(2);
                    setEditSellUSDT(calculatedUSDT);
                  }
                }}
                placeholder="Amount sold"
                keyboardType="numeric"
                placeholderTextColor="#5E6673"
              />

              <Text style={styles.orText}>OR</Text>

              <Text style={styles.inputLabel}>USDT Received</Text>
              <TextInput
                style={styles.input}
                value={editSellUSDT}
                onChangeText={(value) => {
                  setEditSellUSDT(value);
                  if (value && editSellPrice) {
                    const calculatedAmount = (parseFloat(value) / parseFloat(editSellPrice)).toFixed(8);
                    setEditSellAmount(calculatedAmount);
                  }
                }}
                placeholder="Total USDT received"
                keyboardType="numeric"
                placeholderTextColor="#5E6673"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setEditSellModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleUpdateSell}
                >
                  <Text style={styles.saveButtonText}>Update Sell</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Charts Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={chartsModalVisible}
        onRequestClose={() => setChartsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Performance Charts</Text>

            <View style={styles.chartTypeSelector}>
              <TouchableOpacity
                style={[styles.chartTypeButton, chartType === 'pnl' && styles.chartTypeButtonActive]}
                onPress={() => setChartType('pnl')}
              >
                <Text style={[styles.chartTypeButtonText, chartType === 'pnl' && styles.chartTypeButtonTextActive]}>
                  Daily PNL
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chartTypeButton, chartType === 'roi' && styles.chartTypeButtonActive]}
                onPress={() => setChartType('roi')}
              >
                <Text style={[styles.chartTypeButtonText, chartType === 'roi' && styles.chartTypeButtonTextActive]}>
                  Daily ROI
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chartTypeButton, chartType === 'cumulative' && styles.chartTypeButtonActive]}
                onPress={() => setChartType('cumulative')}
              >
                <Text style={[styles.chartTypeButtonText, chartType === 'cumulative' && styles.chartTypeButtonTextActive]}>
                  Cumulative
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.chartContainer}>
              <LineChart
                data={getChartData()}
                width={Dimensions.get('window').width - 60}
                height={220}
                yAxisLabel="$"
                chartConfig={{
                  backgroundColor: 'rgba(17, 24, 39, 0.8)',
                  backgroundGradientFrom: 'rgba(17, 24, 39, 0.8)',
                  backgroundGradientTo: 'rgba(31, 41, 55, 0.6)',
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(249, 250, 251, ${opacity})`,
                  style: {
                    borderRadius: 20
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "3",
                    stroke: "#10B981"
                  }
                }}
                bezier
                style={styles.chart}
              />
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setChartsModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Calendar Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={calendarModalVisible}
        onRequestClose={() => setCalendarModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>PNL Calendar</Text>
            <Text style={styles.calendarSubtitle}>
              Navigate between months to view trading activity and performance
            </Text>

            <ScrollView>
              {renderCalendar()}

              {selectedDate && (() => {
                const dayData = getCalendarData().get(selectedDate);
                return dayData ? (
                  <View style={styles.selectedDateInfo}>
                    <Text style={styles.selectedDateTitle}>
                      {new Date(selectedDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Text>
                    <Text style={styles.selectedDateDetail}>
                      PNL: <Text style={[dayData.pnl >= 0 ? styles.profit : styles.loss]}>${dayData.pnl.toFixed(2)}</Text>
                    </Text>
                    <Text style={styles.selectedDateDetail}>Trades: {dayData.trades}</Text>
                    <Text style={styles.selectedDateDetail}>Sells: {dayData.sells}</Text>
                  </View>
                ) : null;
              })()}
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setCalendarModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Deep Analytics Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={analyticsModalVisible}
        onRequestClose={() => setAnalyticsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.detailsModalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Deep Analytics</Text>

              {(() => {
                const analytics = getDeepAnalytics();
                return (
                  <>
                    <View style={styles.detailsSection}>
                      <Text style={styles.sectionTitle}>💰 Financial Overview</Text>
                      <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Total Invested</Text>
                          <Text style={styles.statValue}>${analytics.totalInvested.toFixed(2)}</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Total Realized</Text>
                          <Text style={[styles.statValue, analytics.totalRealized >= 0 ? styles.profit : styles.loss]}>
                            ${analytics.totalRealized.toFixed(2)}
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Total Unrealized</Text>
                          <Text style={[styles.statValue, analytics.totalUnrealized >= 0 ? styles.profit : styles.loss]}>
                            ${analytics.totalUnrealized.toFixed(2)}
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Net PNL</Text>
                          <Text style={[styles.statValue, analytics.netPnL >= 0 ? styles.profit : styles.loss]}>
                            ${analytics.netPnL.toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.detailsSection}>
                      <Text style={styles.sectionTitle}>📊 Trading Statistics</Text>
                      <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Total Trades</Text>
                          <Text style={styles.statValue}>{analytics.totalTrades}</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Average Trade Size</Text>
                          <Text style={styles.statValue}>${analytics.averageTradeAmount.toFixed(2)}</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Win Rate</Text>
                          <Text style={[styles.statValue, analytics.winRate >= 50 ? styles.profit : styles.loss]}>
                            {analytics.winRate.toFixed(1)}%
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Avg Holding Period</Text>
                          <Text style={styles.statValue}>{analytics.averageHoldingPeriod.toFixed(0)} days</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.detailsSection}>
                      <Text style={styles.sectionTitle}>🏆 Performance Metrics</Text>
                      <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Largest Win</Text>
                          <Text style={[styles.statValue, styles.profit]}>
                            ${analytics.largestWin.toFixed(2)}
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Largest Loss</Text>
                          <Text style={[styles.statValue, styles.loss]}>
                            ${analytics.largestLoss.toFixed(2)}
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Profit Factor</Text>
                          <Text style={[styles.statValue, analytics.profitFactor >= 1 ? styles.profit : styles.loss]}>
                            {analytics.profitFactor === Infinity ? '∞' : analytics.profitFactor.toFixed(2)}
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Trading Frequency</Text>
                          <Text style={styles.statValue}>{analytics.tradingFrequency.toFixed(2)} trades/day</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.detailsSection}>
                      <Text style={styles.sectionTitle}>🥇 Top Performers</Text>
                      <View style={styles.metaContainer}>
                        <Text style={styles.metaItem}>
                          Best Performing Coin: <Text style={[styles.metaValue, styles.profit]}>
                            {analytics.bestPerformingCoin || 'N/A'}
                          </Text>
                        </Text>
                        <Text style={styles.metaItem}>
                          Worst Performing Coin: <Text style={[styles.metaValue, styles.loss]}>
                            {analytics.worstPerformingCoin || 'N/A'}
                          </Text>
                        </Text>
                      </View>
                    </View>

                    {analytics.monthlyPerformance.length > 0 && (
                      <View style={styles.detailsSection}>
                        <Text style={styles.sectionTitle}>📅 Monthly Performance</Text>
                        {analytics.monthlyPerformance.map(month => (
                          <View key={month.month} style={styles.monthlyItem}>
                            <Text style={styles.monthlyLabel}>
                              {new Date(month.month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                            </Text>
                            <Text style={[styles.monthlyValue, month.pnl >= 0 ? styles.profit : styles.loss]}>
                              ${month.pnl.toFixed(2)}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </>
                );
              })()}

              <TouchableOpacity
                style={styles.closeDetailsButton}
                onPress={() => setAnalyticsModalVisible(false)}
              >
                <Text style={styles.closeDetailsButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0B',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 24,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  createButton: {
    flex: 1,
    backgroundColor: '#10B981',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    minWidth: '45%',
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  addCoinButton: {
    flex: 1,
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    minWidth: '45%',
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.3)',
  },
  manageCoinsButton: {
    flex: 1,
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: '30%',
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  tradesList: {
    flex: 1,
    marginTop: 8,
  },
  tradeItem: {
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(55, 65, 81, 0.3)',
  },
  completedTrade: {
    backgroundColor: 'rgba(17, 24, 39, 0.7)',
    borderColor: 'rgba(55, 65, 81, 0.2)',
    opacity: 0.9,
  },
  tradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tradeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F9FAFB',
    flex: 1,
    letterSpacing: 0.3,
  },
  tradeDetail: {
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 3,
    lineHeight: 20,
  },
  pnlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 6,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(55, 65, 81, 0.3)',
  },
  pnlText: {
    fontSize: 16,
    fontWeight: '700',
  },
  roiText: {
    fontSize: 16,
    fontWeight: '700',
  },
  profit: {
    color: '#10B981',
  },
  loss: {
    color: '#EF4444',
  },
  tradeTimestamp: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 6,
    marginBottom: 8,
  },
  tradeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    gap: 8,
  },
  detailsButton: {
    flex: 0.48,
    backgroundColor: 'rgba(55, 65, 81, 0.6)',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.3)',
  },
  sellButton: {
    flex: 0.48,
    backgroundColor: '#EF4444',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#F9FAFB',
    fontSize: 13,
    fontWeight: '600',
  },
  sellButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  modalContent: {
    backgroundColor: 'rgba(17, 24, 39, 0.98)',
    borderRadius: 20,
    padding: 20,
    width: '94%',
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: 'rgba(55, 65, 81, 0.3)',
  },
  detailsModalContent: {
    backgroundColor: 'rgba(17, 24, 39, 0.98)',
    borderRadius: 24,
    padding: 24,
    width: '95%',
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: 'rgba(55, 65, 81, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 25,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
    color: '#10B981',
    letterSpacing: 0.5,
  },
  detailsSubtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 24,
    color: '#F9FAFB',
    fontWeight: '600',
  },
  detailsSection: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(55, 65, 81, 0.3)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#10B981',
    letterSpacing: 0.3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statItem: {
    width: '47%',
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.3)',
  },
  statLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 4,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F9FAFB',
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
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(55, 65, 81, 0.3)',
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  analyticsItem: {
    flex: 1,
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.3)',
  },
  analyticsLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
    fontWeight: '500',
  },
  analyticsValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  sellHistoryContainer: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(55, 65, 81, 0.3)',
  },
  sellHistoryItem: {
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.3)',
  },
  sellHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sellHistoryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  sellActionButton: {
    padding: 8,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  sellActionButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  sellHistoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 6,
  },
  sellHistoryDetail: {
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 3,
    lineHeight: 20,
  },
  sellHistoryDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 6,
  },
  noDataText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 20,
  },
  closeDetailsButton: {
    backgroundColor: '#10B981',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  closeDetailsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  availableAmount: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    color: '#10B981',
    fontWeight: '700',
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    color: '#F9FAFB',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(55, 65, 81, 0.5)',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    marginBottom: 16,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    color: '#F9FAFB',
  },
  orText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#9CA3AF',
    marginVertical: 16,
    backgroundColor: 'rgba(17, 24, 39, 0.6)',
    padding: 12,
    borderRadius: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 8,
  },
  modalButton: {
    flex: 0.48,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(55, 65, 81, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.3)',
  },
  saveButton: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  sellButtonStyle: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  cancelButtonText: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '700',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  currencySelector: {
    borderWidth: 1,
    borderColor: 'rgba(55, 65, 81, 0.5)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
  },
  currencySelectorText: {
    fontSize: 16,
    color: '#F9FAFB',
  },
  currencySelectorPlaceholder: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  currencyList: {
    maxHeight: 300,
  },
  currencyItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(55, 65, 81, 0.3)',
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    marginBottom: 2,
    borderRadius: 12,
  },
  currencyItemText: {
    fontSize: 16,
    color: '#F9FAFB',
  },
  coinsList: {
    maxHeight: '80%',
  },
  coinItem: {
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
    padding: 20,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(55, 65, 81, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  coinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  coinName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F9FAFB',
    letterSpacing: 0.3,
  },
  coinSymbol: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
  },
  coinActions: {
    flexDirection: 'row',
    gap: 12,
  },
  coinActionButton: {
    padding: 10,
    borderRadius: 12,
    minWidth: 70,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  coinActionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  tradeActions: {
    flexDirection: 'row',
    gap: 12,
  },
  tradeActionButton: {
    padding: 10,
    borderRadius: 12,
    minWidth: 70,
    alignItems: 'center',
  },
  tradeActionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  summaryContainer: {
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(55, 65, 81, 0.3)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.3)',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  timeFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
    marginBottom: 16,
  },
  timeFilterButton: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(55, 65, 81, 0.6)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.3)',
  },
  timeFilterButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  timeFilterButtonText: {
    fontSize: 12,
    color: '#D1D5DB',
    fontWeight: '700',
  },
  timeFilterButtonTextActive: {
    color: '#FFFFFF',
  },
  analyticsButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 6,
  },
  analyticsButton: {
    flex: 1,
    backgroundColor: 'rgba(55, 65, 81, 0.6)',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.3)',
  },
  analyticsButtonText: {
    color: '#F9FAFB',
    fontSize: 13,
    fontWeight: '700',
  },
  chartTypeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 8,
  },
  chartTypeButton: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(55, 65, 81, 0.6)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.3)',
  },
  chartTypeButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  chartTypeButtonText: {
    fontSize: 13,
    color: '#D1D5DB',
    fontWeight: '700',
  },
  chartTypeButtonTextActive: {
    color: '#FFFFFF',
  },
  chartContainer: {
    maxHeight: 300,
    marginBottom: 24,
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(55, 65, 81, 0.3)',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  calendar: {
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(55, 65, 81, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  calendarNavButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  calendarNavText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  calendarTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  calendarTitle: {
    color: '#F9FAFB',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  calendarTodayButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(55, 65, 81, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  calendarTodayText: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '700',
  },
  calendarLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.3)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 14,
    height: 14,
    borderRadius: 8,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  legendText: {
    color: '#D1D5DB',
    fontSize: 12,
    fontWeight: '700',
  },
  calendarSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#9CA3AF',
  },
  calendarWeekHeader: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  calendarWeekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 1,
  },
  calendarGrid: {
    flex: 1,
  },
  calendarWeek: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  calendarDay: {
    flex: 1,
    aspectRatio: 1,
    margin: 3,
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  calendarDaySelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOpacity: 0.5,
    elevation: 12,
  },
  calendarDayToday: {
    backgroundColor: '#FBBF24',
    borderColor: '#FBBF24',
    shadowColor: '#FBBF24',
    shadowOpacity: 0.5,
    elevation: 12,
  },
  calendarDayActivity: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
    opacity: 0.8,
  },
  calendarDayProfit: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOpacity: 0.4,
    elevation: 8,
  },
  calendarDayLoss: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOpacity: 0.4,
    elevation: 8,
  },
  calendarDayContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  calendarDayText: {
    fontSize: 16,
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
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F9FAFB',
    marginRight: 2,
  },
  calendarDayPnl: {
    fontSize: 9,
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
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    padding: 24,
    borderRadius: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  selectedDateTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
    color: '#10B981',
    letterSpacing: 0.3,
  },
  selectedDateDetail: {
    fontSize: 16,
    marginBottom: 8,
    color: '#F9FAFB',
    lineHeight: 24,
    fontWeight: '600',
  },
  monthlyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(55, 65, 81, 0.3)',
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    paddingHorizontal: 20,
    marginBottom: 4,
    borderRadius: 12,
  },
  monthlyLabel: {
    fontSize: 16,
    color: '#F9FAFB',
    fontWeight: '700',
  },
  monthlyValue: {
    fontSize: 18,
    fontWeight: '800',
  },
});
