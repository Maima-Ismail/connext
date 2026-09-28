import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ChartRange } from '../api/marketApi';
import PriceChart from '../components/charts/PriceChart';
import AppButton from '../components/ui/AppButton';
import Card from '../components/ui/Card';
import Screen from '../components/ui/Screen';
import SegmentedControl from '../components/ui/SegmentedControl';
import StateView from '../components/ui/StateView';
import CoinIcon from '../components/wallet/CoinIcon';
import PriceChange from '../components/wallet/PriceChange';
import { NETWORK_LABELS } from '../config/wallet';
import { usePriceHistory } from '../hooks/usePriceHistory';
import { AppScreenProps } from '../navigation/types';
import { useAppSelector } from '../store/hooks';
import { selectAssetBySymbol } from '../store/selectors';
import { Colors, Layout, Spacing, Typography } from '../theme';
import { formatAmount, formatCompactUsd, formatPrice, formatUsd } from '../utils/format';

const RANGES: { label: string; value: ChartRange }[] = [
  { label: '1D', value: '1' },
  { label: '1W', value: '7' },
  { label: '1M', value: '30' },
  { label: '1Y', value: '365' },
];

const CHART_HEIGHT = 220;
const HERO_ICON = 40;
const BALANCE_ICON = 36;

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.stat}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const seriesChange = (data: number[]) =>
  data.length > 1 ? ((data[data.length - 1] - data[0]) / data[0]) * 100 : null;

const AssetDetailsScreen: React.FC<AppScreenProps<'AssetDetails'>> = ({ navigation, route }) => {
  const { symbol } = route.params;
  const asset = useAppSelector(state => selectAssetBySymbol(state, symbol));

  const [range, setRange] = useState<ChartRange>('1');
  const [scrubPrice, setScrubPrice] = useState<number | null>(null);
  const history = usePriceHistory(asset?.id ?? '', range);

  if (!asset) {
    return (
      <Screen title="Asset" onBack={navigation.goBack}>
        <View style={styles.content}>
          <StateView tone="error" icon="help-circle-outline" title="Asset not found" />
        </View>
      </Screen>
    );
  }

  const { market } = asset;
  const isDaily = range === '1';
  const shownChange = isDaily ? asset.change24h : seriesChange(history.data);
  const changeCaption =
    isDaily && market?.price_change_24h != null
      ? `${market.price_change_24h >= 0 ? '+' : '-'}${formatPrice(Math.abs(market.price_change_24h))} today`
      : `past ${RANGES.find(r => r.value === range)?.label}`;

  const renderChart = () => {
    if (history.loading) {
      return <ActivityIndicator color={Colors.primary} />;
    }
    if (history.error) {
      return (
        <Pressable onPress={history.retry} style={styles.chartMessage}>
          <Icon name="refresh" size={20} color={Colors.textSecondary} />
          <Text style={styles.chartText}>{history.error}</Text>
          <Text style={styles.chartRetry}>Tap to retry</Text>
        </Pressable>
      );
    }
    if (history.data.length < 2) {
      return <Text style={styles.chartText}>No chart data for this period.</Text>;
    }
    return (
      <View style={styles.chartFill}>
        <PriceChart data={history.data} height={CHART_HEIGHT} onScrub={setScrubPrice} />
      </View>
    );
  };

  return (
    <Screen title={asset.name} onBack={navigation.goBack}>
      <ScrollView contentContainerStyle={styles.content} scrollEnabled={scrubPrice === null}>
        <View style={[Layout.row, styles.hero]}>
          <CoinIcon symbol={asset.symbol} imageUrl={market?.image} size={HERO_ICON} />
          <View style={Layout.flex}>
            <Text style={styles.symbol}>
              {asset.name} · {asset.symbol}
            </Text>
            <Text style={styles.network}>{NETWORK_LABELS[asset.network]}</Text>
          </View>
        </View>

        <Text style={styles.price} testID="asset-price">
          {formatPrice(scrubPrice ?? asset.price)}
        </Text>
        <View style={[Layout.row, styles.changeRow]}>
          <PriceChange value={shownChange} variant="pill" />
          <Text style={styles.changeCaption}>{changeCaption}</Text>
        </View>

        <View style={[Layout.center, styles.chart]}>{renderChart()}</View>

        <SegmentedControl options={RANGES} value={range} onChange={setRange} />

        <Card title="Your balance" style={styles.card}>
          <View style={[Layout.rowBetween, styles.cardBody]}>
            <View>
              <Text style={styles.balanceValue} testID="asset-value">
                {formatUsd(asset.valueUsd)}
              </Text>
              <Text style={styles.balanceAmount}>
                {formatAmount(asset.balance)} {asset.symbol}
              </Text>
            </View>
            <CoinIcon symbol={asset.symbol} imageUrl={market?.image} size={BALANCE_ICON} />
          </View>
        </Card>

        <Card title="Market stats" style={styles.card}>
          <View style={styles.statsGrid}>
            <Stat label="Market cap" value={formatCompactUsd(market?.market_cap)} />
            <Stat label="24h volume" value={formatCompactUsd(market?.total_volume)} />
            <Stat label="24h high" value={formatPrice(market?.high_24h)} />
            <Stat label="24h low" value={formatPrice(market?.low_24h)} />
          </View>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton
          title={`Send ${asset.symbol}`}
          icon="arrow-up"
          onPress={() => navigation.navigate('Send', { symbol: asset.symbol })}
          disabled={asset.balance <= 0}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  hero: { gap: Spacing.md },
  symbol: { ...Typography.bodyStrong, color: Colors.textSecondary },
  network: { ...Typography.caption, color: Colors.textTertiary, marginTop: Spacing.xxs },
  price: { ...Typography.display, ...Typography.numeric, color: Colors.textPrimary, marginTop: Spacing.lg },
  changeRow: { gap: Spacing.sm, marginTop: Spacing.sm },
  changeCaption: { ...Typography.caption, color: Colors.textSecondary },
  chart: { height: CHART_HEIGHT, marginVertical: Spacing.lg, marginHorizontal: -Spacing.lg },
  chartFill: { ...Layout.flex, alignSelf: 'stretch' },
  chartMessage: { alignItems: 'center', gap: Spacing.xs, paddingHorizontal: Spacing.xl },
  chartText: { ...Typography.caption, color: Colors.textSecondary, textAlign: 'center' },
  chartRetry: { ...Typography.captionStrong, color: Colors.primary },
  card: { marginTop: Spacing.lg },
  cardBody: { marginTop: Spacing.sm },
  balanceValue: { ...Typography.h2, ...Typography.numeric, color: Colors.textPrimary },
  balanceAmount: { ...Typography.caption, color: Colors.textSecondary, marginTop: Spacing.xxs },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: Spacing.xs },
  stat: { width: '50%', paddingTop: Spacing.md },
  statLabel: { ...Typography.caption, color: Colors.textTertiary },
  statValue: { ...Typography.bodyStrong, ...Typography.numeric, color: Colors.textPrimary, marginTop: Spacing.xxs },
  footer: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm },
});

export default AssetDetailsScreen;
