# CONNEXT — React Native Crypto Wallet

A crypto wallet app built for the React Native technical assessment. It has secure mock authentication, a live-priced portfolio dashboard, asset details with an interactive price chart, and a simulated send-transaction flow.

> Market data is live from the CoinGecko API. Authentication, balances and transactions are simulated, and no real funds or blockchain calls are involved.

---

## Tech stack

| Area | Choice |
|---|---|
| Framework | React Native **0.81** (New Architecture: Fabric + TurboModules over JSI, Hermes) |
| Language | TypeScript (strict) |
| State | Redux Toolkit + redux-persist |
| Navigation | React Navigation 7 (native stack) |
| Networking | Axios service layer with typed error handling |
| Secure storage | `react-native-keychain` (iOS Keychain / Android Keystore) |
| Graphics | `react-native-svg` (price chart, gradients, vector logo) |
| Testing | Jest (35 unit tests) |

## Getting started

**Prerequisites:** Node ≥ 20, Xcode with CocoaPods (iOS), and Android Studio with SDK 35 (Android).

```bash
npm install
cd ios && bundle exec pod install && cd ..   # iOS only

npm start          # Metro bundler
npm run ios        # or: npm run android
```

| Script | Purpose |
|---|---|
| `npm test` | Runs the unit test suite |
| `npm run lint` | ESLint (`@react-native` config) |
| `npx tsc --noEmit` | Type check |

**Demo login:** `test@example.com` / `password123`

---

## Features

### 1. Authentication
- Email/password form with validation on blur and on submit, a loading state, and error messages for invalid credentials.
- The session is stored in the **Keychain/Keystore** and **expires** after 30 minutes (see [Session security](#session-security)).
- Protected screens are only registered in the navigator while a session exists, so the dashboard can't be reached when logged out.
- Logout goes through a themed confirmation sheet and clears the session and wallet state.

### 2. Wallet dashboard
- Balance card with the wallet address, the total USD value, and the weighted 24h profit/loss (in $ and %).
- A hide-balances toggle.
- Asset rows with a coin icon, price, a 24h change pill, the balance, and the USD value.
- Pull to refresh, auto-refresh every 60 s, and a **Recent activity** list of sent transactions.

### 3. REST API integration
- CoinGecko `/coins/markets` and `/coins/{id}/market_chart` through an Axios service layer (`src/api`).
- **Loading** skeletons, **success**, an **empty** state, and **error** states. Network, timeout, 429 and 5xx errors are mapped to readable messages.
- If a refresh fails, the last known prices stay on screen with a warning banner.
- Chart history is cached per coin and range (TTL, in-flight dedupe, stale-if-error) to stay within the free-tier rate limit.

### 4. Asset details
- Name, symbol, network, current price, and the 24h change in % and $.
- Your balance and its total value, plus market stats (market cap, volume, 24h high/low).
- An interactive SVG price chart with 1D / 1W / 1M / 1Y ranges and touch scrubbing.

### 5. Send transaction
- Asset picker, recipient address, and amount with a **MAX** button that reserves the network fee.
- Validation covers:
  - the address format for each network
  - the chain's decimal precision
  - sending to your own wallet
  - insufficient balance
  - insufficient balance to cover the fee
- Review sheet → loading → **success** screen with a simulated transaction hash, or an inline **error**.

### Blockchain details
- **Address validation per network:** EVM (`0x` + 40 hex characters), Bitcoin (bech32 `bc1…`, legacy `1…`, P2SH `3…`), Solana (base58).
- **Network fees:** native assets pay the fee in the same coin (`amount + fee ≤ balance`). USDT is an ERC-20 token, so its gas is paid in **ETH**, and a USDT send fails without ETH, as it would on-chain.
- **Decimals:** BTC 8, USDT 6, SOL 9, ETH 18.
- A successful send debits the amount and the fee from the wallet state.

---

## Demo guide

| Scenario | How |
|---|---|
| Successful send | Send ETH to `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045` |
| Network rejection | Send to `0x000000000000000000000000000000000000dEaD`. The mock node rejects it and no funds move |
| Wrong network | Select BTC and paste an `0x…` address |
| Fee reservation | ETH → **MAX** fills `balance − fee`. Entering the full `0.85` is rejected |
| ERC-20 gas | Spend almost all ETH, then try to send USDT |
| API error / stale data | Turn on airplane mode and pull to refresh |
| Session expiry | Set `SESSION_TTL_MS` in `src/config/wallet.ts` to `60 * 1000` |

---

## Session security

- **Secure storage:** the session (`token`, `user`, `expiresAt`) is stored in the iOS Keychain / Android Keystore with `WHEN_UNLOCKED_THIS_DEVICE_ONLY`. It's readable only while the device is unlocked, and it never syncs to backups or other devices.
- **Expiry** is enforced in three places:
  1. **On launch:** an expired session is discarded before any protected screen renders. A splash screen shows while the Keychain is read.
  2. **While the app is open:** a timer logs the user out at `expiresAt`.
  3. **On resume:** JS timers pause in the background, so the session is re-checked when the app returns to the foreground.
- **Logout and expiry** clear the Keychain entry and reset the wallet. The login screen explains when a session has expired.
- **AsyncStorage** holds only non-sensitive wallet data. **No token is sent to CoinGecko**, because it's a public third-party API.

---

## Architecture

### Why Redux Toolkit
- Auth, wallet balances, market prices and send status are **global, cross-screen state that affect each other**. A send updates dashboard balances, and logout clears the wallet. `extraReducers` expresses these links directly: `walletSlice` reacts to `sendTransaction.fulfilled`, `logout` and `restoreSession`.
- `createAsyncThunk` gives every async flow the same `pending / fulfilled / rejected` lifecycle for loading and error states.
- Memoised selectors (`createSelector`) join asset config, balances and live prices into view models, so screens contain no business logic.
- **Screen-scoped data** (chart history, form input) stays in hooks and local state rather than the global store.

Context API would work at this size, but it has no async lifecycle or selector memoisation, and it re-renders every consumer on each change.

### Project structure

```
src/
  api/            Axios client (error normalisation, dev-only logging), CoinGecko endpoints
  services/       Mock auth, Keychain session storage, mock transaction broadcast
  domain/         Pure business rules (send validation, fee/balance checks)
  store/          RTK store, slices (auth, wallet, market, send), selectors, typed hooks
  hooks/          useMarketPolling, usePriceHistory, useSendForm, useSessionExpiry
  navigation/     Auth stack vs. app stack, typed route params
  screens/        Login, Dashboard, AssetDetails, Send, TransactionResult
  components/
    ui/           Generic building blocks: AppButton, TextField, Card, BottomSheet, ConfirmSheet…
    wallet/       Feature components: BalanceCard, AssetList, AssetRow, ConfirmSendSheet…
    charts/       Interactive SVG price chart
  theme/          Design tokens: palette, semantic colours, spacing, radius, sizes, typography
  utils/          Formatting, validation, request cache
  config/         Supported assets, mock wallet, credentials, session TTL
__tests__/        Unit tests: validation, send rules, store, session, cache
```

### Code conventions
- **No hard-coded colours.** A private palette taken from the CONNEXT logo feeds semantic tokens (`Colors.surface`, `Colors.onBrandMuted`…). Translucent variants are derived with `alpha()`.
- **One source of truth for business rules.** `domain/send.ts` is used by both the form (instant feedback) and the `sendTransaction` thunk (authoritative re-check).
- **Screens compose, components render, hooks hold logic.** Shared primitives (`Layout.row`, `Card`, `DetailRow`, `BottomSheet`) replace repeated style blocks.

---

## Testing

```bash
npm test
```

| Suite | Covers |
|---|---|
| `validation.test.ts` | Email/password rules, per-network address formats, amount parsing |
| `send.test.ts` | Funds and fee checks, ERC-20 gas, MAX amount, form validation |
| `store.test.ts` | Login/logout, balance debits, simulated rejection, portfolio totals |
| `session.test.ts` | Keychain save/restore, expiry on launch, wallet reset, expiry notice |
| `cache.test.ts` | TTL hits, in-flight dedupe, stale-if-error |

---

## What I'd do next in production

- Short-lived access tokens with refresh-token rotation from a real backend, attached by an Axios interceptor with `401` → logout.
- Biometric unlock (Face ID / fingerprint) on top of the Keychain entry.
- EIP-55 checksum validation and ENS name resolution.
- Live fee estimation and transaction status polling (pending → confirmed).
- RTK Query for all server state, plus a CoinGecko API key.
- Component tests (React Native Testing Library) and E2E tests (Detox).
