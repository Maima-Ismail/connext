# CONNEXT

A crypto wallet app in React Native, built for a technical assessment.

Prices and charts come from the CoinGecko API. Login, balances and transactions are mocked, so no real funds are involved.

## Running it

Requires Node 20+, Xcode with CocoaPods for iOS, and Android Studio (SDK 35) for Android.

```bash
npm install
cd ios && bundle exec pod install && cd ..

npm start
npm run ios      # or npm run android
```

Tests: `npm test`. Lint: `npm run lint`. Type check: `npx tsc --noEmit`.

## What's in it

- Login with validation. The session is stored in the Keychain/Keystore and expires after 30 minutes.
- Dashboard with the total balance, 24h P/L, an asset list, pull to refresh, and recent activity.
- Asset details with market stats and a price chart (1D / 1W / 1M / 1Y).
- Send flow with per-network address checks, fee handling and a confirmation step.

Stack: React Native 0.81, TypeScript, Redux Toolkit + redux-persist, React Navigation 7, Axios, react-native-keychain, react-native-svg, Jest.
