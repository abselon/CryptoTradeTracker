import { Trade, SellRecord, CoinAnalytics, DailyData, DeepAnalytics, TimeFilter, DateRange } from '../types';

export const calculatePNL = (trade: Trade): number => {
    const totalSellValue = trade.sells.reduce((sum, sell) => sum + sell.usdtReceived, 0);
    const soldAmount = trade.sells.reduce((sum, sell) => sum + sell.soldAmount, 0);
    const soldCostBasis = (soldAmount / trade.amount) * trade.usdtUsed;
    return totalSellValue - soldCostBasis;
};

export const calculateROI = (trade: Trade): number => {
    const totalSellValue = trade.sells.reduce((sum, sell) => sum + sell.usdtReceived, 0);
    const soldAmount = trade.sells.reduce((sum, sell) => sum + sell.soldAmount, 0);
    const soldCostBasis = (soldAmount / trade.amount) * trade.usdtUsed;
    if (soldCostBasis === 0) return 0;
    return ((totalSellValue - soldCostBasis) / soldCostBasis) * 100;
};

export const calculateTotalPNL = (trades: Trade[]): number => {
    return trades.reduce((total, trade) => total + calculatePNL(trade), 0);
};

export const calculateTotalROI = (trades: Trade[]): number => {
    const totalInvested = trades.reduce((total, trade) => total + trade.usdtUsed, 0);
    if (totalInvested === 0) return 0;
    return (calculateTotalPNL(trades) / totalInvested) * 100;
};

export const getCoinAnalytics = (symbol: string, trades: Trade[]): CoinAnalytics => {
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

export const getTradeAnalytics = (trade: Trade) => {
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

export const getFilteredTrades = (trades: Trade[], timeFilter: TimeFilter, customDateRange: DateRange): Trade[] => {
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

export const getDailyData = (trades: Trade[]): DailyData[] => {
    const dailyMap = new Map<string, DailyData>();

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

export const getCumulativeData = (trades: Trade[]): { labels: string[], data: number[] } => {
    const dailyData = getDailyData(trades);
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

export const getDeepAnalytics = (trades: Trade[]) => {
    const totalInvested = trades.reduce((sum, trade) => sum + trade.usdtUsed, 0);
    const totalSold = trades.reduce((sum, trade) =>
        sum + trade.sells.reduce((sellSum, sell) => sellSum + sell.usdtReceived, 0), 0);
    const netPnL = totalSold - totalInvested;
    const totalTrades = trades.length;
    const winningTrades = trades.filter(trade => calculatePNL(trade) > 0).length;
    const winRate = (winningTrades / totalTrades) * 100;

    // Calculate average ROI
    const totalROI = trades.reduce((sum, trade) => sum + calculateROI(trade), 0);
    const averageROI = totalTrades > 0 ? totalROI / totalTrades : 0;

    // Find best and worst trades
    const bestTrade = Math.max(...trades.map(trade => calculatePNL(trade)));
    const worstTrade = Math.min(...trades.map(trade => calculatePNL(trade)));

    // Calculate average hold time
    const holdTimes = trades.map(trade => {
        if (trade.sells.length === 0) return 0;
        const firstSell = trade.sells[0];
        return (firstSell.timestamp.getTime() - trade.timestamp.getTime()) / (1000 * 60 * 60 * 24);
    });
    const averageHoldTime = holdTimes.length > 0
        ? Math.round(holdTimes.reduce((sum, time) => sum + time, 0) / holdTimes.length)
        : 0;

    // Find most traded and profitable coins
    const coinStats = trades.reduce((stats, trade) => {
        if (!stats[trade.currencyName]) {
            stats[trade.currencyName] = {
                trades: 0,
                pnl: 0
            };
        }
        stats[trade.currencyName].trades++;
        stats[trade.currencyName].pnl += calculatePNL(trade);
        return stats;
    }, {} as Record<string, { trades: number; pnl: number }>);

    const mostTradedCoin = Object.entries(coinStats)
        .sort((a, b) => b[1].trades - a[1].trades)[0]?.[0] || 'N/A';

    const mostProfitableCoin = Object.entries(coinStats)
        .sort((a, b) => b[1].pnl - a[1].pnl)[0]?.[0] || 'N/A';

    // Calculate daily PNL
    const dailyPnL = getDailyData(trades);
    const bestDayPnL = Math.max(...dailyPnL.map(day => day.pnl));
    const worstDayPnL = Math.min(...dailyPnL.map(day => day.pnl));

    // Calculate risk metrics
    const returns = trades.map(trade => calculateROI(trade));
    const averageReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const standardDeviation = Math.sqrt(
        returns.reduce((sum, ret) => sum + Math.pow(ret - averageReturn, 2), 0) / returns.length
    );
    const sharpeRatio = standardDeviation !== 0 ? averageReturn / standardDeviation : 0;

    // Calculate profit factor
    const grossProfit = trades.reduce((sum, trade) => {
        const pnl = calculatePNL(trade);
        return sum + (pnl > 0 ? pnl : 0);
    }, 0);
    const grossLoss = Math.abs(trades.reduce((sum, trade) => {
        const pnl = calculatePNL(trade);
        return sum + (pnl < 0 ? pnl : 0);
    }, 0));
    const profitFactor = grossLoss !== 0 ? grossProfit / grossLoss : 0;

    // Calculate max drawdown
    let maxDrawdown = 0;
    let peak = 0;
    let currentValue = 0;
    trades.forEach(trade => {
        currentValue += calculatePNL(trade);
        if (currentValue > peak) {
            peak = currentValue;
        }
        const drawdown = ((peak - currentValue) / peak) * 100;
        if (drawdown > maxDrawdown) {
            maxDrawdown = drawdown;
        }
    });

    // Calculate monthly statistics
    const monthlyPnL = trades.reduce((months, trade) => {
        const month = trade.timestamp.toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!months[month]) {
            months[month] = 0;
        }
        months[month] += calculatePNL(trade);
        return months;
    }, {} as Record<string, number>);

    const bestMonthPnL = Math.max(...Object.values(monthlyPnL));
    const worstMonthPnL = Math.min(...Object.values(monthlyPnL));
    const averageMonthlyPnL = Object.values(monthlyPnL).reduce((sum, pnl) => sum + pnl, 0) /
        Object.keys(monthlyPnL).length;

    // Calculate trading consistency
    const profitableMonths = Object.values(monthlyPnL).filter(pnl => pnl > 0).length;
    const tradingConsistency = (profitableMonths / Object.keys(monthlyPnL).length) * 100;

    // Calculate risk/reward ratio
    const riskRewardRatio = Math.abs(bestTrade / worstTrade);

    return {
        totalInvested,
        netPnL,
        winRate,
        totalTrades,
        averageROI,
        bestTrade,
        worstTrade,
        averageHoldTime,
        mostTradedCoin,
        mostProfitableCoin,
        bestDayPnL,
        worstDayPnL,
        sharpeRatio,
        profitFactor,
        maxDrawdown,
        riskRewardRatio,
        bestMonthPnL,
        worstMonthPnL,
        averageMonthlyPnL,
        tradingConsistency
    };
}; 