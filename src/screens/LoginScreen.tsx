import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AppButton from '../components/ui/AppButton';
import Banner from '../components/ui/Banner';
import BrandLogo from '../components/ui/BrandLogo';
import Screen from '../components/ui/Screen';
import TextField from '../components/ui/TextField';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectAuth } from '../store/selectors';
import { clearAuthMessages, login } from '../store/slices/authSlice';
import { Colors, HitSlop, Layout, Spacing, Typography } from '../theme';
import { validateEmail, validatePassword } from '../utils/validation';

const LOGO_HEIGHT = 76;

const LoginScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { status, error, notice } = useAppSelector(selectAuth);
  const loading = status === 'loading';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const passwordRef = useRef<TextInput>(null);

  const errors = { email: validateEmail(email), password: validatePassword(password) };

  const withErrorReset = (setter: (value: string) => void) => (value: string) => {
    if (error || notice) {
      dispatch(clearAuthMessages());
    }
    setter(value);
  };

  const submit = () => {
    setTouched({ email: true, password: true });
    if (!errors.email && !errors.password && !loading) {
      dispatch(login({ email, password }));
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView style={Layout.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.brand}>
            <BrandLogo height={LOGO_HEIGHT} />
            <Text style={styles.wordmark}>CONNEXT</Text>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to manage your crypto portfolio</Text>
          </View>

          {error || notice ? (
            <View style={styles.banner}>
              <Banner message={error ?? notice ?? ''} tone={error ? 'error' : 'warning'} />
            </View>
          ) : null}

          <TextField
            testID="email-input"
            label="Email"
            icon="mail-outline"
            placeholder="you@example.com"
            value={email}
            onChangeText={withErrorReset(setEmail)}
            onBlur={() => setTouched(t => ({ ...t, email: true }))}
            error={touched.email ? errors.email : null}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            editable={!loading}
          />

          <TextField
            ref={passwordRef}
            testID="password-input"
            label="Password"
            icon="lock-closed-outline"
            placeholder="Enter your password"
            value={password}
            onChangeText={withErrorReset(setPassword)}
            onBlur={() => setTouched(t => ({ ...t, password: true }))}
            error={touched.password ? errors.password : null}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            textContentType="password"
            autoComplete="password"
            returnKeyType="go"
            onSubmitEditing={submit}
            editable={!loading}
            right={
              <Pressable
                onPress={() => setShowPassword(v => !v)}
                hitSlop={HitSlop}
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}>
                <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textTertiary} />
              </Pressable>
            }
          />

          <AppButton testID="login-button" title="Sign in" onPress={submit} loading={loading} style={styles.submit} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: { flexGrow: 1, justifyContent: 'center', padding: Spacing.xl },
  brand: { alignItems: 'center', marginBottom: Spacing.xxl },
  wordmark: {
    ...Typography.overline,
    color: Colors.accent,
    letterSpacing: 4,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  title: { ...Typography.h1, color: Colors.textPrimary },
  subtitle: { ...Typography.body, color: Colors.textSecondary, marginTop: Spacing.xs },
  banner: { marginBottom: Spacing.lg },
  submit: { marginTop: Spacing.sm },
});

export default LoginScreen;
