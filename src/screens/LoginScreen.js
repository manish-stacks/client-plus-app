import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView,
  Image,
  Linking
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import logo from '../../assets/hbs-logo.png';
import ScreenWrapper from '../components/ScreenWrapper';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const { colors, isDark } = useTheme();
  const [email, setEmail] = useState('7050690034');
  const [password, setPassword] = useState('123456789');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('Error', 'Please fill all fields'); return; }
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (!success) Alert.alert('Error', 'Invalid credentials');
  };

  const s = styles(colors);
  return (
    <ScreenWrapper isScrollable={false}>
      <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

          {/* Logo */}
          <View style={s.logoWrap}>
            <Image source={logo} style={s.logoIcon} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
            <Text style={s.logoName}>Client<Text style={{ color: colors.primary }}>Plus</Text></Text>
            <Text style={s.logoSub}>Digital Marketing Dashboard</Text>
          </View>

          <Text style={s.title}>Welcome back 👋</Text>
          <Text style={s.sub}>Sign in to manage your services</Text>

          {/* Email */}
          <Text style={s.label}>EMAIL ADDRESS</Text>
          <TextInput
            style={s.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@company.com"
            placeholderTextColor={colors.text3}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Password */}
          <Text style={[s.label, { marginTop: 16 }]}>PASSWORD</Text>
          <TextInput
            style={s.input}
            value={password}
            onChangeText={setPassword}
            placeholder="*********"
            placeholderTextColor={colors.text3}
            secureTextEntry
          />
          <TouchableOpacity style={s.forgot} onPress={() => navigation.navigate('ForgotPassword')}><Text style={{ color: colors.primary, fontWeight: '700', fontSize: 13 }}>Forgot Password?</Text></TouchableOpacity>

          {/* Button */}
          <TouchableOpacity onPress={handleLogin} disabled={loading}>
            <LinearGradient colors={[colors.gradStart, colors.gradEnd]} style={s.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={s.btnText}>{loading ? 'Signing in...' : 'Sign In →'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={s.noAccount}>
            Don't have an account?
            <Text style={{ color: colors.primary, fontWeight: '700' }}
              onPress={() => Linking.openURL('https://hoverbusinessservices.com/contact-us.php')}>
              {' '}Contact us
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = (c) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.bg },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingBottom: 48 },
  logoWrap: { alignItems: 'center', marginBottom: 40 },
  logoIcon: { width: 85, height: 45, marginBottom: 12 },
  logoName: { fontSize: 26, fontWeight: '800', color: c.text },
  logoSub: { fontSize: 13, color: c.text2, marginTop: 4 },
  title: { fontSize: 24, fontWeight: '800', color: c.text },
  sub: { fontSize: 14, color: c.text2, marginBottom: 28, marginTop: 4 },
  label: { fontSize: 12, fontWeight: '700', color: c.text2, marginBottom: 8, letterSpacing: 0.5 },
  input: { backgroundColor: c.bg2, borderWidth: 1.5, borderColor: c.border, borderRadius: 12, padding: 14, fontSize: 15, color: c.text },
  forgot: { alignItems: 'flex-end', marginTop: 8 },
  btn: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  btnText: { color: 'white', fontSize: 16, fontWeight: '800' },
  noAccount: { textAlign: 'center', marginTop: 20, fontSize: 13, color: c.text2 },
});