import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/ui/AppButton';
import Card from '../components/ui/Card';
import DetailRow from '../components/ui/DetailRow';
import Screen from '../components/ui/Screen';
import TextField from '../components/ui/TextField';
import AssetSelector from '../components/wallet/AssetSelector';
import ConfirmSendSheet from '../components/wallet/ConfirmSendSheet';
import { NETWORK_LABELS } from '../config/wallet';
import { useSendForm } from '../hooks/useSendForm';
import { AppScreenProps } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectSend, selectWallet, selectWalletAssets } from '../store/selectors';
import { resetSend, sendTransaction } from '../store/slices/sendSlice';
import { Colors, Layout, Radius, Spacing, Typography } from '../theme';
import { formatAmount, formatUsd } from '../utils/format';
import { ADDRESS_HINTS } from '../utils/validation';

const SendScreen: React.FC<AppScreenProps<'Send'>> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const assets = useAppSelector(selectWalletAssets);
  const { address } = useAppSelector(selectWallet);
  const { status, error } = useAppSelector(selectSend);
  const form = useSendForm(route.params?.symbol ?? 'ETH');
  const [reviewing, setReviewing] = useState(false);

  const asset = assets.find(a => a.symbol === form.symbol) ?? assets[0];
  const feeAsset = assets.find(a => a.symbol === asset.feeSymbol);
  const amountUsd = asset.price === null ? null : form.amount * asset.price;
  const feeUsd = feeAsset?.price == null ? null : asset.fee * feeAsset.price;
  const networkLabel = NETWORK_LABELS[asset.network];

  useEffect(() => {
    dispatch(resetSend());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'succeeded') {
      setReviewing(false);
      navigation.replace('TransactionResult');
    }
  }, [status, navigation]);

  const review = () => {
    if (form.submit()) {
      dispatch(resetSend());
      setReviewing(true);
    }
  };

  const closeReview = () => {
    setReviewing(false);
    dispatch(resetSend());
  };

  const confirm = () => dispatch(sendTransaction({ symbol: asset.symbol, to: form.recipient, amount: form.amount }));

  return (
    <Screen title="Send" onBack={navigation.goBack}>
      <KeyboardAvoidingView style={Layout.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <AssetSelector assets={assets} selected={form.symbol} onSelect={form.selectSymbol} />

          <TextField
            testID="recipient-input"
            label="Recipient address"
            icon="person-outline"
            placeholder={ADDRESS_HINTS[asset.network]}
            value={form.recipientInput}
            onChangeText={form.setRecipient}
            onBlur={() => form.touch('recipient')}
            error={form.visibleErrors.recipient}
            hint={`${networkLabel} · ${ADDRESS_HINTS[asset.network]}`}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextField
            testID="amount-input"
            label="Amount"
            icon="cash-outline"
            placeholder="0.00"
            value={form.amountInput}
            onChangeText={form.setAmount}
            onBlur={() => form.touch('amount')}
            error={form.visibleErrors.amount}
            hint={`≈ ${formatUsd(amountUsd)}`}
            keyboardType="decimal-pad"
            right={
              <View style={[Layout.row, styles.amountAccessory]}>
                <Text style={styles.amountSymbol}>{asset.symbol}</Text>
                <Pressable onPress={form.fillMax} style={styles.maxButton} hitSlop={Spacing.sm}>
                  <Text style={styles.maxText}>MAX</Text>
                </Pressable>
              </View>
            }
          />

          <Card variant="list" style={styles.summary}>
            <DetailRow label="Available" value={`${formatAmount(asset.balance)} ${asset.symbol}`} />
            <DetailRow
              label="Network fee"
              value={`${formatAmount(asset.fee)} ${asset.feeSymbol}`}
              caption={feeUsd === null ? undefined : `≈ ${formatUsd(feeUsd)}`}
            />
            <DetailRow label="Network" value={networkLabel} />
          </Card>
        </ScrollView>

        <View style={styles.footer}>
          <AppButton testID="review-button" title="Review" onPress={review} />
        </View>
      </KeyboardAvoidingView>

      <ConfirmSendSheet
        visible={reviewing}
        asset={asset}
        amount={form.amount}
        from={address}
        to={form.recipient}
        status={status}
        error={error}
        onConfirm={confirm}
        onClose={closeReview}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  amountAccessory: { gap: Spacing.sm },
  amountSymbol: { ...Typography.bodyStrong, color: Colors.textSecondary },
  maxButton: {
    backgroundColor: Colors.primarySoft,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
  },
  maxText: { ...Typography.overline, color: Colors.primary },
  summary: { paddingHorizontal: Spacing.lg },
  footer: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm },
});

export default SendScreen;
