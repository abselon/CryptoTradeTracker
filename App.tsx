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
  Platform,
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

// Add type definition for chartType
type ChartType = 'pnl' | 'roi' | 'cumulative';

// Add type definition for timeFilter
type TimeFilter = 'today' | '7d' | '30d' | 'lifetime' | 'custom';

// Add type definition for customDateRange
interface CustomDateRange {
  startDate: Date;
  endDate: Date;
}

export default function App() {
  const state = useAppState();

  // Destructure commonly used state values
  const {
    trades,
    setTrades,
    customCoins,
    setCustomCoins,
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
    selectedTrade,
    setSelectedTrade,
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
    sellPrice,
    setSellPrice,
    sellAmount,
    setSellAmount,
    sellUSDT,
    setSellUSDT,
    timeFilter,
    setTimeFilter,
    customDateRange,
    analyticsModalVisible,
    setAnalyticsModalVisible,
    chartsModalVisible,
    setChartsModalVisible,
    calendarModalVisible,
    setCalendarModalVisible,
    chartType,
    setChartType,
    selectedDate,
    setSelectedDate,
    currentCalendarMonth,
    setCurrentCalendarMonth,
    currentCalendarYear,
    setCurrentCalendarYear,
    coinsModalVisible,
    setCoinsModalVisible,
    editCoinModalVisible,
    setEditCoinModalVisible,
    editingCoin,
    setEditingCoin,
    editCoinName,
    setEditCoinName,
    editCoinSymbol,
    setEditCoinSymbol,
    editTradeModalVisible,
    setEditTradeModalVisible,
    editingTrade,
    setEditingTrade,
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
    editSellModalVisible,
    setEditSellModalVisible,
    editingSell,
    setEditingSell,
    editSellPrice,
    setEditSellPrice,
    editSellAmount,
    setEditSellAmount,
    editSellUSDT,
    setEditSellUSDT,
  } = state;

  // Handler functions
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

  const getSortedTrades = () => {
    return [...trades].sort((a, b) => {
      if (a.remainingAmount > 0 && b.remainingAmount === 0) return -1;
      if (a.remainingAmount === 0 && b.remainingAmount > 0) return 1;
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
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

  const handleEditSell = (trade: Trade, sell: SellRecord) => {
    setSelectedTrade(trade);
    setEditingSell(sell);
    setEditSellPrice(sell.sellPrice.toString());
    setEditSellAmount(sell.soldAmount.toString());
    setEditSellUSDT(sell.usdtReceived.toString());
    setEditSellModalVisible(true);
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

        <View style={styles.tradeDetails}>
          <Text style={styles.tradeDetail}>
            <Text style={styles.tradeDetailLabel}>Currency:</Text>
            <Text style={styles.tradeDetailValue}> {item.currencyName}</Text>
          </Text>
          <Text style={styles.tradeDetail}>
            <Text style={styles.tradeDetailLabel}>Buy Price:</Text>
            <Text style={styles.tradeDetailValue}> ${item.price.toFixed(2)}</Text>
          </Text>
          <Text style={styles.tradeDetail}>
            <Text style={styles.tradeDetailLabel}>Original Amount:</Text>
            <Text style={styles.tradeDetailValue}> {item.amount.toFixed(8)}</Text>
          </Text>
          <Text style={styles.tradeDetail}>
            <Text style={styles.tradeDetailLabel}>Remaining:</Text>
            <Text style={styles.tradeDetailValue}> {item.remainingAmount.toFixed(8)}</Text>
          </Text>
          <Text style={styles.tradeDetail}>
            <Text style={styles.tradeDetailLabel}>Original USDT:</Text>
            <Text style={styles.tradeDetailValue}> ${item.usdtUsed.toFixed(2)}</Text>
          </Text>
        </View>

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

  const handleEditTrade = (trade: Trade) => {
    setEditingTrade(trade);
    setEditTradeName(trade.name);
    setEditCurrencyName(trade.currencyName);
    setEditPrice(trade.price.toString());
    setEditAmount(trade.amount.toString());
    setEditUsdtUsed(trade.usdtUsed.toString());
    setEditTradeModalVisible(true);
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

  // Additional handler functions for coin management
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

  const renderCoinItem = ({ item }: { item: CustomCoin }) => {
    const analytics = getCoinAnalytics(item.symbol, trades);

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

  const getChartData = () => {
    const dailyData = getDailyData(trades);

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
        const cumulative = getCumulativeData(trades);
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

  const filteredTrades = getFilteredTrades(trades, timeFilter, customDateRange);

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
              calculateTotalPNL(filteredTrades) >= 0 ? styles.profit : styles.loss
            ]}>
              ${calculateTotalPNL(filteredTrades).toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total ROI</Text>
            <Text style={[
              styles.summaryValue,
              calculateTotalROI(filteredTrades) >= 0 ? styles.profit : styles.loss
            ]}>
              {calculateTotalROI(filteredTrades).toFixed(2)}%
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
        data={getSortedTrades().filter(trade => filteredTrades.some(t => t.id === trade.id))}
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
              <Calendar
                trades={trades}
                currentCalendarMonth={currentCalendarMonth}
                currentCalendarYear={currentCalendarYear}
                selectedDate={selectedDate}
                setCurrentCalendarMonth={setCurrentCalendarMonth}
                setCurrentCalendarYear={setCurrentCalendarYear}
                setSelectedDate={setSelectedDate}
              />

              {selectedDate && (() => {
                const calendarData = getDailyData(trades);
                const dayData = calendarData.find(d => d.date === selectedDate);
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
                const analytics = getDeepAnalytics(trades);
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
                          <Text style={styles.statLabel}>Net PNL</Text>
                          <Text style={[styles.statValue, analytics.netPnL >= 0 ? styles.profit : styles.loss]}>
                            ${analytics.netPnL.toFixed(2)}
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Win Rate</Text>
                          <Text style={[styles.statValue, analytics.winRate >= 50 ? styles.profit : styles.loss]}>
                            {analytics.winRate.toFixed(1)}%
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Total Trades</Text>
                          <Text style={styles.statValue}>{analytics.totalTrades}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.detailsSection}>
                      <Text style={styles.sectionTitle}>📈 Performance Metrics</Text>
                      <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Average ROI</Text>
                          <Text style={[styles.statValue, analytics.averageROI >= 0 ? styles.profit : styles.loss]}>
                            {analytics.averageROI.toFixed(2)}%
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Best Trade</Text>
                          <Text style={[styles.statValue, styles.profit]}>
                            ${analytics.bestTrade.toFixed(2)}
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Worst Trade</Text>
                          <Text style={[styles.statValue, styles.loss]}>
                            ${analytics.worstTrade.toFixed(2)}
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Average Hold Time</Text>
                          <Text style={styles.statValue}>
                            {analytics.averageHoldTime} days
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.detailsSection}>
                      <Text style={styles.sectionTitle}>📊 Trading Patterns</Text>
                      <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Most Traded Coin</Text>
                          <Text style={styles.statValue}>{analytics.mostTradedCoin}</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Most Profitable Coin</Text>
                          <Text style={[styles.statValue, styles.profit]}>
                            {analytics.mostProfitableCoin}
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Best Trading Day</Text>
                          <Text style={[styles.statValue, styles.profit]}>
                            ${analytics.bestDayPnL.toFixed(2)}
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Worst Trading Day</Text>
                          <Text style={[styles.statValue, styles.loss]}>
                            ${analytics.worstDayPnL.toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.detailsSection}>
                      <Text style={styles.sectionTitle}>📉 Risk Analysis</Text>
                      <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Risk/Reward Ratio</Text>
                          <Text style={styles.statValue}>
                            {analytics.riskRewardRatio.toFixed(2)}
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Max Drawdown</Text>
                          <Text style={[styles.statValue, styles.loss]}>
                            {analytics.maxDrawdown.toFixed(2)}%
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Sharpe Ratio</Text>
                          <Text style={styles.statValue}>
                            {analytics.sharpeRatio.toFixed(2)}
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Profit Factor</Text>
                          <Text style={styles.statValue}>
                            {analytics.profitFactor.toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.detailsSection}>
                      <Text style={styles.sectionTitle}>📅 Time Analysis</Text>
                      <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Best Trading Month</Text>
                          <Text style={[styles.statValue, styles.profit]}>
                            ${analytics.bestMonthPnL.toFixed(2)}
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Worst Trading Month</Text>
                          <Text style={[styles.statValue, styles.loss]}>
                            ${analytics.worstMonthPnL.toFixed(2)}
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Average Monthly PNL</Text>
                          <Text style={[styles.statValue, analytics.averageMonthlyPnL >= 0 ? styles.profit : styles.loss]}>
                            ${analytics.averageMonthlyPnL.toFixed(2)}
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statLabel}>Trading Consistency</Text>
                          <Text style={styles.statValue}>
                            {analytics.tradingConsistency.toFixed(1)}%
                          </Text>
                        </View>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.closeDetailsButton}
                      onPress={() => setAnalyticsModalVisible(false)}
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

      <StatusBar style="auto" />
    </View>
  );
} 