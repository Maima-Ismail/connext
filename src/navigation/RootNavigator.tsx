import React, { useEffect } from 'react';
import { DarkTheme, NavigationContainer, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashView from '../components/ui/SplashView';
import { useSessionExpiry } from '../hooks/useSessionExpiry';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectIsAuthenticated, selectSessionRestored } from '../store/selectors';
import { restoreSession } from '../store/slices/authSlice';
import { Colors } from '../theme';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AssetDetailsScreen from '../screens/AssetDetailsScreen';
import SendScreen from '../screens/SendScreen';
import TransactionResultScreen from '../screens/TransactionResultScreen';
import { AppStackParamList, AuthStackParamList } from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

const navTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.background,
    text: Colors.textPrimary,
    border: Colors.border,
  },
};

const screenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: Colors.background },
  animation: 'slide_from_right' as const,
};

const RootNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const restored = useAppSelector(selectSessionRestored);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  useSessionExpiry();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  if (!restored) {
    return <SplashView />;
  }

  return (
    <NavigationContainer theme={navTheme}>
      {isAuthenticated ? (
        <AppStack.Navigator screenOptions={screenOptions}>
          <AppStack.Screen name="Dashboard" component={DashboardScreen} />
          <AppStack.Screen name="AssetDetails" component={AssetDetailsScreen} />
          <AppStack.Screen name="Send" component={SendScreen} />
          <AppStack.Screen
            name="TransactionResult"
            component={TransactionResultScreen}
            options={{ animation: 'fade', gestureEnabled: false }}
          />
        </AppStack.Navigator>
      ) : (
        <AuthStack.Navigator screenOptions={screenOptions}>
          <AuthStack.Screen name="Login" component={LoginScreen} options={{ animationTypeForReplace: 'pop' }} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
