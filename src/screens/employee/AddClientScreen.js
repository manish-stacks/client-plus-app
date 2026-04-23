import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { AxiosInstance } from '../../lib/Axios.instance';
import ScreenWrapper from '../../components/ScreenWrapper';

function Field({ label, icon, ...props }) {
  const { colors } = useTheme();
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 12, fontWeight: '700', color: colors.text2, marginBottom: 8, letterSpacing: 0.5 }}>{label}</Text>
      <View style={[fStyles.wrap, { backgroundColor: colors.bg2, borderColor: colors.border }]}>
        {icon && <Ionicons name={icon} size={18} color={colors.text3} />}
        <TextInput
          style={[fStyles.input, { color: colors.text }]}
          placeholderTextColor={colors.text3}
          {...props}
        />
      </View>
    </View>
  );
}

const fStyles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 2 },
  input: { flex: 1, fontSize: 15, paddingVertical: 12 },
});

export default function AddClientScreen({ navigation }) {
  const { colors } = useTheme();
  const [form, setForm] = useState({ name: '', phone: '', email: '', company: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [clientCreated, setClientCreated] = useState(null);

  // Service assignment state
  const [showService, setShowService] = useState(false);
  const [service, setService] = useState({ service_name: '', price: '', renewal_date: '' });
  const [assigning, setAssigning] = useState(false);

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));
  const setS = (key) => (val) => setService(s => ({ ...s, [key]: val }));

  const validateForm = () => {
    if (!form.name.trim()) { Alert.alert('Error', 'Name is required'); return false; }
    if (!form.phone.trim()) { Alert.alert('Error', 'Phone is required'); return false; }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      Alert.alert('Error', 'Enter a valid email'); return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const res = await AxiosInstance.post('/employee/clients', form);
      const created = res.data?.data || res.data?.client || res.data;
      setClientCreated(created);
      setShowService(true);
      Alert.alert('Success', 'Client created! You can now assign a service.');
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to create client');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignService = async () => {
    if (!service.service_name.trim()) { Alert.alert('Error', 'Service name is required'); return; }
    if (!service.price.trim()) { Alert.alert('Error', 'Price is required'); return; }
    setAssigning(true);
    try {
      await AxiosInstance.post('/employee/assign-service', {
        client_id: clientCreated?.id,
        ...service,
        price: parseFloat(service.price),
      });
      Alert.alert('Success', 'Service assigned successfully!', [
        { text: 'View Clients', onPress: () => navigation.navigate('Clients') },
        { text: 'Add Another', onPress: () => { setShowService(false); setClientCreated(null); setForm({ name: '', phone: '', email: '', company: '', address: '' }); } },
      ]);
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to assign service');
    } finally {
      setAssigning(false);
    }
  };

  const s = styles(colors);
  return (
    <ScreenWrapper isScrollable={false}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>{showService ? 'Assign Service' : 'Add Client'}</Text>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {!showService ? (
            <>
              {/* Progress */}
              <View style={s.stepRow}>
                <View style={[s.step, { backgroundColor: colors.primary }]}>
                  <Text style={s.stepTxt}>1</Text>
                </View>
                <View style={[s.stepLine, { backgroundColor: colors.border }]} />
                <View style={[s.step, { backgroundColor: colors.border }]}>
                  <Text style={[s.stepTxt, { color: colors.text3 }]}>2</Text>
                </View>
                <Text style={[s.stepLabel, { color: colors.text2 }]}>Step 1 of 2 – Client Info</Text>
              </View>

              <Field label="FULL NAME *" icon="person-outline" placeholder="John Doe" value={form.name} onChangeText={set('name')} />
              <Field label="PHONE *" icon="call-outline" placeholder="+91 98765 43210" value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" />
              <Field label="EMAIL" icon="mail-outline" placeholder="john@company.com" value={form.email} onChangeText={set('email')} keyboardType="email-address" autoCapitalize="none" />
              <Field label="COMPANY" icon="business-outline" placeholder="Company name" value={form.company} onChangeText={set('company')} />
              <Field label="ADDRESS" icon="location-outline" placeholder="Full address" value={form.address} onChangeText={set('address')} multiline numberOfLines={2} />

              <TouchableOpacity onPress={handleCreate} disabled={loading}>
                <LinearGradient colors={[colors.gradStart, colors.gradEnd]} style={s.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnTxt}>Create Client & Continue →</Text>}
                </LinearGradient>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Success banner */}
              <View style={[s.successBanner, { backgroundColor: colors.green + '15', borderColor: colors.green }]}>
                <Ionicons name="checkmark-circle" size={20} color={colors.green} />
                <Text style={[s.successTxt, { color: colors.greenText }]}>
                  Client <Text style={{ fontWeight: '800' }}>{clientCreated?.name || form.name}</Text> created!
                </Text>
              </View>

              {/* Progress step 2 */}
              <View style={s.stepRow}>
                <View style={[s.step, { backgroundColor: colors.green }]}>
                  <Ionicons name="checkmark" size={14} color="#fff" />
                </View>
                <View style={[s.stepLine, { backgroundColor: colors.primary }]} />
                <View style={[s.step, { backgroundColor: colors.primary }]}>
                  <Text style={s.stepTxt}>2</Text>
                </View>
                <Text style={[s.stepLabel, { color: colors.text2 }]}>Step 2 of 2 – Assign Service</Text>
              </View>

              <Field label="SERVICE NAME *" icon="layers-outline" placeholder="e.g. SEO, Social Media" value={service.service_name} onChangeText={setS('service_name')} />
              <Field label="PRICE (₹) *" icon="cash-outline" placeholder="e.g. 5000" value={service.price} onChangeText={setS('price')} keyboardType="decimal-pad" />
              <Field label="RENEWAL DATE" icon="calendar-outline" placeholder="YYYY-MM-DD" value={service.renewal_date} onChangeText={setS('renewal_date')} />

              <TouchableOpacity onPress={handleAssignService} disabled={assigning}>
                <LinearGradient colors={[colors.gradStart, colors.gradEnd]} style={s.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  {assigning ? <ActivityIndicator color="#fff" /> : <Text style={s.btnTxt}>Assign Service →</Text>}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={s.skipBtn} onPress={() => navigation.navigate('Clients')}>
                <Text style={{ color: colors.text2, fontSize: 14, fontWeight: '600' }}>Skip for now</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = (c) => StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: c.bg2, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: c.text },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 8 },
  step: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  stepTxt: { color: '#fff', fontSize: 13, fontWeight: '800' },
  stepLine: { width: 32, height: 2, borderRadius: 1 },
  stepLabel: { fontSize: 12, fontWeight: '600', flex: 1 },
  btn: { padding: 16, borderRadius: 14, alignItems: 'center', marginTop: 8 },
  btnTxt: { color: '#fff', fontSize: 15, fontWeight: '800' },
  successBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1.5, borderRadius: 12, padding: 12, marginBottom: 20 },
  successTxt: { fontSize: 14 },
  skipBtn: { alignItems: 'center', paddingVertical: 16 },
});
