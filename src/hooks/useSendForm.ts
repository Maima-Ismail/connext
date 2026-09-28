import { useMemo, useState } from 'react';
import { getMaxSendable, validateSendForm } from '../domain/send';
import { useAppSelector } from '../store/hooks';
import { selectBalances, selectWallet } from '../store/selectors';
import { AssetSymbol } from '../types';
import { parseAmount } from '../utils/validation';

type Field = 'recipient' | 'amount';

const UNTOUCHED: Record<Field, boolean> = { recipient: false, amount: false };

export const useSendForm = (initialSymbol: AssetSymbol) => {
  const balances = useAppSelector(selectBalances);
  const { address } = useAppSelector(selectWallet);

  const [symbol, setSymbol] = useState(initialSymbol);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [touched, setTouched] = useState(UNTOUCHED);

  const errors = useMemo(
    () => validateSendForm(symbol, recipient, amount, address, balances),
    [symbol, recipient, amount, address, balances],
  );

  const touch = (field: Field) => setTouched(t => ({ ...t, [field]: true }));

  return {
    symbol,
    recipientInput: recipient,
    recipient: recipient.trim(),
    amountInput: amount,
    amount: parseAmount(amount) ?? 0,
    visibleErrors: {
      recipient: touched.recipient ? errors.recipient : null,
      amount: touched.amount ? errors.amount : null,
    },
    setRecipient,
    setAmount,
    touch,
    selectSymbol: (next: AssetSymbol) => {
      setSymbol(next);
      setAmount('');
      setTouched(t => ({ ...t, amount: false }));
    },
    fillMax: () => {
      setAmount(String(getMaxSendable(symbol, balances)));
      touch('amount');
    },
    submit: () => {
      setTouched({ recipient: true, amount: true });
      return !errors.recipient && !errors.amount;
    },
  };
};
