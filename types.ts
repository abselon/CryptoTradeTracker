export interface CustomCoin {
    id: string;
    name: string;
    symbol: string;
}

export interface SellRecord {
    id: string;
    sellPrice: number;
    soldAmount: number;
    usdtReceived: number;
    timestamp: Date;
}

export interface Trade {
    id: string;
    name: string;
    currencyName: string;
    price: number;
    amount: number;
    usdtUsed: number;
    timestamp: Date;
    sells: SellRecord[];
    remainingAmount: number;
}

export interface CoinAnalytics {
    totalTrades: number;
    totalInvested: number;
    totalSold: number;
    currentHoldings: number;
    totalProfit: number;
    averageROI: number;
    bestTrade: number;
    worstTrade: number;
}

export type TimeFilter = 'today' | '7d' | '30d' | 'lifetime' | 'custom';

export interface DateRange {
    start: Date;
    end: Date;
}

export interface DailyData {
    date: string;
    pnl: number;
    roi: number;
    trades: number;
    sells: number;
}

export interface DeepAnalytics {
    totalTrades: number;
    totalInvested: number;
    totalRealized: number;
    totalUnrealized: number;
    netPnL: number;
    averageTradeAmount: number;
    averageHoldingPeriod: number;
    winRate: number;
    bestPerformingCoin: string;
    worstPerformingCoin: string;
    monthlyPerformance: { month: string; pnl: number }[];
    tradingFrequency: number;
    largestWin: number;
    largestLoss: number;
    profitFactor: number;
} 