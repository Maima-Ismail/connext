import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, Typography } from '../../theme';
import { RequestStatus, WalletAsset } from '../../types';
import { formatAmount, formatUsd, shortenAddress } from '../../utils/format';
import AppButton from '../ui/AppButton';
import Banner from '../ui/Banner';
import BottomSheet from '../ui/BottomSheet';
import DetailRow from '../ui/DetailRow';
import CoinIcon from './CoinIcon';

interface Props {
  visible: boolean;
  asset: WalletAsset;
  amount: number;
  from: string;
  to: string;
  status: RequestStatus;
  error: string | null;
  onConfirm: () => void;
  onClose: () => void;
}

const HERO_ICON = 48;

const ConfirmSendSheet: React.FC<Props> = ({ visible, asset, amount, from, to, status, error, onConfirm, onClose }) => {
  const sending = status === 'loading';
  const failed = status === 'failed';
  const feeInSameAsset = asset.feeSymbol === asset.symbol;

  return (
    <BottomSheet visible={visible} title="Confirm transaction" onClose={sending ? () => undefined : onClose}>
      <View style={styles.hero}>
        <CoinIcon symbol={asset.symbol} imageUrl={asset.market?.image} size={HERO_ICON} />
        <Text style={styles.amount}>
          {formatAmount(amount)} {asset.symbol}
        </Text>
        <Text style={styles.amountUsd}>≈ {formatUsd(asset.price === null ? null : amount * asset.price)}</Text>
      </View>

      <DetailRow label="From" value={shortenAddress(from)} />
      <DetailRow label="To" value={shortenAddress(to, 8, 6)} />
      <DetailRow label="Network fee" value={`${formatAmount(asset.fee)} ${asset.feeSymbol}`} />
      {feeInSameAsset ? (
        <DetailRow label="Total" value={`${formatAmount(amount + asset.fee)} ${asset.symbol}`} emphasis />
      ) : null}

      {failed && error ? (
        <View style={styles.error}>
          <Banner message={error} />
        </View>
      ) : null}

      <AppButton
        testID="confirm-send-button"
        title={failed ? 'Try again' : 'Confirm & send'}
        icon="paper-plane-outline"
        onPress={onConfirm}
        loading={sending}
        style={styles.confirm}
      />
      <AppButton title="Cancel" variant="ghost" onPress={onClose} disabled={sending} style={styles.cancel} />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  hero: { alignItems: 'center', marginVertical: Spacing.xl },
  amount: { ...Typography.h1, ...Typography.numeric, color: Colors.textPrimary, marginTop: Spacing.md },
  amountUsd: { ...Typography.body, color: Colors.textSecondary, marginTop: Spacing.xxs },
  error: { marginTop: Spacing.lg },
  confirm: { marginTop: Spacing.xl },
  cancel: { marginTop: Spacing.sm },
});

export default ConfirmSendSheet;
