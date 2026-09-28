import React from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, Layout, Radius, Spacing, Typography } from '../../theme';
import AppButton from '../ui/AppButton';
import BottomSheet from '../ui/BottomSheet';

interface Props {
  visible: boolean;
  address: string;
  onClose: () => void;
}

const ReceiveSheet: React.FC<Props> = ({ visible, address, onClose }) => (
  <BottomSheet
    visible={visible}
    onClose={onClose}
    title="Receive crypto"
    subtitle="Share this address to receive ETH and ERC-20 tokens like USDT.">
    <View style={[Layout.row, styles.addressBox]}>
      <Icon name="wallet-outline" size={20} color={Colors.primary} />
      <Text style={styles.address} selectable>
        {address}
      </Text>
    </View>

    <View style={[Layout.row, styles.warning]}>
      <Icon name="information-circle-outline" size={16} color={Colors.warning} />
      <Text style={styles.warningText}>Only send assets on the Ethereum network to this address.</Text>
    </View>

    <AppButton
      title="Share address"
      icon="share-outline"
      onPress={() => Share.share({ message: address }).catch(() => undefined)}
    />
  </BottomSheet>
);

const styles = StyleSheet.create({
  addressBox: {
    gap: Spacing.md,
    backgroundColor: Colors.surfaceRaised,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginTop: Spacing.xl,
  },
  address: { ...Layout.flex, ...Typography.bodyStrong, color: Colors.textPrimary, lineHeight: 22 },
  warning: { gap: Spacing.sm, marginVertical: Spacing.lg },
  warningText: { ...Layout.flex, ...Typography.caption, color: Colors.warning },
});

export default ReceiveSheet;
