import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Layout, Sizes, Spacing } from '../../theme';
import { RequestStatus, WalletAsset } from '../../types';
import Card from '../ui/Card';
import Skeleton from '../ui/Skeleton';
import StateView from '../ui/StateView';
import AssetRow from './AssetRow';

interface Props {
  assets: WalletAsset[];
  status: RequestStatus;
  error: string | null;
  hasMarketData: boolean;
  hidden: boolean;
  onRetry: () => void;
  onSelect: (asset: WalletAsset) => void;
}

const SkeletonRow = () => (
  <View style={[Layout.row, styles.skeletonRow]}>
    <Skeleton width={Sizes.coinIcon} height={Sizes.coinIcon} radius={Sizes.coinIcon / 2} />
    <View style={Layout.flex}>
      <Skeleton width="55%" height={14} />
      <Skeleton width="35%" height={12} style={styles.skeletonGap} />
    </View>
    <View style={styles.skeletonRight}>
      <Skeleton width={70} height={14} />
      <Skeleton width={50} height={12} style={styles.skeletonGap} />
    </View>
  </View>
);

const AssetList: React.FC<Props> = ({ assets, status, error, hasMarketData, hidden, onRetry, onSelect }) => {
  if (assets.length === 0) {
    return (
      <StateView
        icon="wallet-outline"
        title="No assets yet"
        message="Deposit crypto to this wallet and it will show up here."
      />
    );
  }

  if (!hasMarketData) {
    if (status === 'failed') {
      return (
        <StateView
          tone="error"
          icon="cloud-offline-outline"
          title="Couldn't load prices"
          message={error ?? undefined}
          actionLabel="Try again"
          onAction={onRetry}
        />
      );
    }
    if (status === 'succeeded') {
      return (
        <StateView
          icon="stats-chart-outline"
          title="No market data"
          message="The price provider returned no data for your assets."
          actionLabel="Refresh"
          onAction={onRetry}
        />
      );
    }
    return (
      <Card variant="list">
        {assets.map(asset => (
          <SkeletonRow key={asset.symbol} />
        ))}
      </Card>
    );
  }

  return (
    <Card variant="list">
      {assets.map(asset => (
        <AssetRow key={asset.symbol} asset={asset} hidden={hidden} onPress={onSelect} />
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  skeletonRow: { gap: Spacing.md, padding: Spacing.lg },
  skeletonRight: { alignItems: 'flex-end' },
  skeletonGap: { marginTop: Spacing.sm },
});

export default AssetList;
