import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { INVOICES } from '../constants/data';
import { StatusChip } from './HomeScreen';
import ScreenWrapper from '../components/ScreenWrapper';

export default function PaymentsScreen() {
  const { colors } = useTheme();
  const s = styles(colors);

  return (
    <ScreenWrapper>
      <View style={s.container}>
        <View style={s.header}>
          <Text style={s.title}>Payments</Text>
          <Text style={s.sub}>Transaction history</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 20 }}>
          {/* Summary */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
            {[
              { val: '₹84K', label: 'Total Paid', color: colors.green },
              { val: '₹12K', label: 'Pending', color: colors.yellow },
              { val: '8', label: 'Invoices', color: colors.text },
            ].map((item, i) => (
              <View key={i} style={s.payStat}>
                <Text style={[s.payVal, { color: item.color }]}>{item.val}</Text>
                <Text style={s.payLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          <Text style={s.sectionTitle}>Recent Invoices</Text>
          {INVOICES.map(inv => (
            <View key={inv.id} style={s.invoiceCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={[s.invoiceIcon, { backgroundColor: inv.status === 'paid' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)' }]}>
                  <Ionicons name="document-text-outline" size={20} color={inv.status === 'paid' ? '#16A34A' : '#D97706'} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', fontSize: 14, color: colors.text }}>{inv.service}</Text>
                  <Text style={{ fontSize: 11, color: colors.text2, marginTop: 2 }}>#{inv.id}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontWeight: '800', fontSize: 16, color: colors.text }}>{inv.amount}</Text>
                  <Text style={{ fontSize: 11, color: colors.text2, marginTop: 2 }}>{inv.date}</Text>
                </View>
              </View>
              <View style={[s.invoiceFooter]}>
                <StatusChip status={inv.status === 'paid' ? 'active' : 'expiring'} />
                <TouchableOpacity style={[s.dlBtn, { backgroundColor: inv.status === 'paid' ? 'rgba(34,197,94,0.08)' : 'rgba(245,158,11,0.1)' }]}>
                  <Text style={{ color: inv.status === 'paid' ? '#16A34A' : '#D97706', fontWeight: '700', fontSize: 12 }}>
                    {inv.status === 'paid' ? '⬇ Receipt' : 'Pay Now'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = (c) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.bg },
  header: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 12 },
  title: { fontSize: 22, fontWeight: '800', color: c.text },
  sub: { fontSize: 13, color: c.text2, marginTop: 2 },
  payStat: { flex: 1, backgroundColor: c.card2, borderWidth: 1.5, borderColor: c.border, borderRadius: 12, padding: 14, alignItems: 'center' },
  payVal: { fontSize: 20, fontWeight: '800' },
  payLabel: { fontSize: 11, color: c.text2, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: c.text, marginBottom: 12 },
  invoiceCard: { backgroundColor: c.card, borderWidth: 1.5, borderColor: c.border, borderRadius: 12, padding: 16, marginBottom: 10 },
  invoiceIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  invoiceFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: c.border },
  dlBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
});