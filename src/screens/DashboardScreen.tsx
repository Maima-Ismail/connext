import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import Banner from '../components/ui/Banner';
import Card from '../components/ui/Card';
import ConfirmSheet from '../components/ui/ConfirmSheet';
import IconButton from '../components/ui/IconButton';
import Screen from '../components/ui/Screen';
import AssetList from '../components/wallet/AssetList';
import BalanceCard from '../components/wallet/BalanceCard';
import ReceiveSheet from '../components/wallet/ReceiveSheet';
import TransactionRow from '../components/wallet/TransactionRow';
import { useMarketPolling } from '../hooks/useMarketPolling';
import { AppScreenProps } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectMarket, selectPortfolioSummary, selectUser, selectWallet, selectWalletAssets } from '../store/selectors';
import { logout } from '../store/slices/authSlice';
import { Colors, Layout, Sizes, Spacing, Typography } from '../theme';
import { WalletAsset } from '../types';

const RECENT_ACTIVITY_LIMIT = 5;

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Good morning';
  }
  return hour < 18 ? 'Good afternoon' : 'Good evening';
};

const SectionTitle: React.FC<{ title: string; meta?: string }> = ({ title, meta }) => (
  <View style={[Layout.rowBetween, styles.sectionHeader]}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {meta ? <Text style={styles.sectionMeta}>{meta}</Text> : null}
  </View>
);

const DashboardScreen: React.FC<AppScreenProps<'Dashboard'>> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { address, transactions } = useAppSelector(selectWallet);
  const market = useAppSelector(selectMarket);
  const assets = useAppSelector(selectWalletAssets);
  const summary = useAppSelector(selectPortfolioSummary);
  const { reload, refresh, refreshing } = useMarketPolling();

  const [hidden, setHidden] = useState(false);
  const [receiveVisible, setReceiveVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);

  const hasMarketData = Object.keys(market.byId).length > 0;
  const initialLoading = !hasMarketData && (market.status === 'idle' || market.status === 'loading');

  const openAsset = useCallback(
    (asset: WalletAsset) => navigation.navigate('AssetDetails', { symbol: asset.symbol }),
    [navigation],
  );

  return (
    <Screen edges={['top']}>
      <View style={[Layout.row, styles.header]}>
        <View style={[Layout.center, styles.avatar]}>
          <Text style={styles.avatarText}>{(user?.name ?? 'U').charAt(0)}</Text>
        </View>
        <View style={[Layout.flex, styles.headerText]}>
          <Text style={styles.greeting}>{greeting()}</Text>
          <Text style={styles.name}>{user?.name ?? 'Wallet'}</Text>
        </View>
        <IconButton testID="logout-button" icon="log-out-outline" accessibilityLabel="Log out" onPress={() => setLogoutVisible(true)} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={Colors.primary} colors={[Colors.primary]} />
        }>
        <BalanceCard
          address={address}
          total={summary.total}
          changeUsd={summary.changeUsd}
          changePercent={summary.changePercent}
          loading={initialLoading}
          hidden={hidden}
          onToggleHidden={() => setHidden(h => !h)}
          onAddressPress={() => setReceiveVisible(true)}
          onSend={() => navigation.navigate('Send')}
          onReceive={() => setReceiveVisible(true)}
        />

        {market.status === 'failed' && hasMarketData ? (
          <View style={styles.banner}>
            <Banner
              tone="warning"
              message={`${market.error ?? 'Price update failed.'} Showing last known prices.`}
              actionLabel="Retry"
              onAction={reload}
            />
          </View>
        ) : null}

        <SectionTitle title="Assets" meta={market.status === 'loading' && hasMarketData ? 'Updating…' : undefined} />
        <AssetList
          assets={assets}
          status={market.status}
          error={market.error}
          hasMarketData={hasMarketData}
          hidden={hidden}
          onRetry={reload}
          onSelect={openAsset}
        />

        {transactions.length > 0 ? (
          <>
            <SectionTitle title="Recent activity" />
            <Card variant="list">
              {transactions.slice(0, RECENT_ACTIVITY_LIMIT).map(tx => (
                <TransactionRow key={tx.hash} tx={tx} />
              ))}
            </Card>
          </>
        ) : null}
      </ScrollView>

      <ReceiveSheet visible={receiveVisible} address={address} onClose={() => setReceiveVisible(false)} />
      <ConfirmSheet
        testID="confirm-logout-button"
        visible={logoutVisible}
        icon="log-out-outline"
        title="Log out?"
        message="You'll need to sign in again to access your wallet."
        confirmLabel="Log out"
        tone="danger"
        onConfirm={() => dispatch(logout())}
        onCancel={() => setLogoutVisible(false)}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.lg },
  avatar: {
    width: Sizes.avatar,
    height: Sizes.avatar,
    borderRadius: Sizes.avatar / 2,
    backgroundColor: Colors.primarySoft,
  },
  avatarText: { ...Typography.h3, color: Colors.primary },
  headerText: { marginLeft: Spacing.md },
  greeting: { ...Typography.caption, color: Colors.textSecondary },
  name: { ...Typography.h3, color: Colors.textPrimary },
  content: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxxl },
  banner: { marginTop: Spacing.lg },
  sectionHeader: { marginTop: Spacing.xl, marginBottom: Spacing.md },
  sectionTitle: { ...Typography.h3, color: Colors.textPrimary },
  sectionMeta: { ...Typography.caption, color: Colors.textTertiary },
});

export default DashboardScreen;
