import React from 'react';
import { StatusBar } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashView from './src/components/ui/SplashView';
import { persistor, store } from './src/store';
import { RootNavigator } from './src/navigation';
import { Colors } from './src/theme';

function App(): React.JSX.Element {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={<SplashView />} persistor={persistor}>
        <SafeAreaProvider>
          <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
          <RootNavigator />
        </SafeAreaProvider>
      </PersistGate>
    </ReduxProvider>
  );
}

export default App;
