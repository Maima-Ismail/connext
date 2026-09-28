import React, { useEffect, useRef } from 'react';
import { Animated, Share, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AppButton from '../components/ui/AppButton';
import Card from '../components/ui/Card';
import DetailRow from '../components/ui/DetailRow';
import Screen from '../components/ui/Screen';
import { ASSETS } from '../config/wallet';
import { AppScreenProps } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectSend } from '../store/selectors';
import { resetSend } from '../store/slices/sendSlice';
import { Colors, Layout, Radius, Spacing, Typography } from '../theme';
import { formatAmount, formatDateTime, shortenAddress } from '../utils/format';

const BADGE = 104;
const BADGE_INNER = 76;

const TransactionResultScreen: React.FC<AppScreenProps<'TransactionResult'>> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { lastTransaction: tx } = useAppSelector(selectSend);
  const scale = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
  }, [scale]);

  useEffect(
    () => () => {
      dispatch(resetSend());
    },
    [dispatch],
  );

  const done = () => navigation.popToTop();

  if (!tx) {
    return (
      <Screen>
        <View style={[Layout.flex, styles.empty]}>
          <AppButton title="Back to wallet" onPress={done} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={[Layout.flex, styles.content]}>
        <Animated.View style={[Layout.center, styles.badge, { transform: [{ scale }] }]}>
          <View style={[Layout.center, styles.badgeInner]}>
            <Icon name="checkmark" size={44} color={Colors.textOnPrimary} />
          </View>
        </Animated.View>

        <Text style={styles.title}>Transaction sent</Text>
        <Text style={styles.amount}>
          {formatAmount(tx.amount)} {tx.symbol}
        </Text>
        <Text style={styles.subtitle}>
          {ASSETS[tx.symbol].name} is on its way to {shortenAddress(tx.to)}
        </Text>

        <Card variant="list" style={styles.details}>
          <DetailRow label="Status" value="Confirmed" />
          <DetailRow label="Transaction hash" value={shortenAddress(tx.hash, 10, 8)} />
          <DetailRow label="Recipient" value={shortenAddress(tx.to, 8, 6)} />
          <DetailRow label="Network fee" value={`${formatAmount(tx.fee)} ${tx.feeSymbol}`} />
          <DetailRow label="Date" value={formatDateTime(tx.timestamp)} />
        </Card>

        <Card title="Full hash" style={styles.hashCard}>
          <Text style={styles.hash} selectable testID="tx-hash">
            {tx.hash}
          </Text>
        </Card>
      </View>

      <View style={styles.footer}>
        <AppButton title="Back to wallet" onPress={done} />
        <AppButton
          title="Share hash"
          icon="share-outline"
          variant="ghost"
          onPress={() => Share.share({ message: tx.hash }).catch(() => undefined)}
          style={styles.secondary}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  empty: { justifyContent: 'center', padding: Spacing.xl },
  content: { alignItems: 'center', padding: Spacing.xl, paddingTop: Spacing.xxxl },
  badge: { width: BADGE, height: BADGE, borderRadius: BADGE / 2, backgroundColor: Colors.positiveSoft },
  badgeInner: { width: BADGE_INNER, height: BADGE_INNER, borderRadius: BADGE_INNER / 2, backgroundColor: Colors.positive },
  title: { ...Typography.h2, color: Colors.textPrimary, marginTop: Spacing.xl },
  amount: { ...Typography.h1, ...Typography.numeric, color: Colors.textPrimary, marginTop: Spacing.sm },
  subtitle: { ...Typography.body, color: Colors.textSecondary, marginTop: Spacing.xs, textAlign: 'center' },
  details: { alignSelf: 'stretch', paddingHorizontal: Spacing.lg, marginTop: Spacing.xxl },
  hashCard: { alignSelf: 'stretch', marginTop: Spacing.lg, borderRadius: Radius.md },
  hash: { ...Typography.caption, color: Colors.textSecondary, marginTop: Spacing.xs, lineHeight: 19 },
  footer: { padding: Spacing.lg },
  secondary: { marginTop: Spacing.sm },
});

export default TransactionResultScreen;
