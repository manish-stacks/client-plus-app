import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../context/ThemeContext';
import ScreenWrapper from '../components/ScreenWrapper';

export default function ServiceDetailScreen({ navigation, route }) {
  const { colors } = useTheme();
  const sv = route.params.service;
  const s = styles(colors);

  // Circular progress (SVG-based — manual draw with View overlays for simplicity)
  const pct = sv.progress;

  return (
    <ScreenWrapper>
      <View style={s.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
          {/* Hero */}
          <LinearGradient colors={[colors.gradStart, colors.gradEnd]} style={s.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
                <Ionicons name="chevron-back" size={20} color="white" />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: 'white' }}>{sv.name}</Text>
                <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>{sv.type}</Text>
              </View>
            </View>
            {/* Progress Circle (simplified) */}
            <View style={s.circleWrap}>
              <View style={s.circleOuter}>
                <View style={s.circleInner}>
                  <Text style={{ fontSize: 28, fontWeight: '800', color: 'white' }}>{pct}%</Text>
                  <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>Complete</Text>
                </View>
              </View>
            </View>
          </LinearGradient>

          <View style={{ padding: 20 }}>
            {/* Info Grid */}
            <View style={s.infoGrid}>
              {[
                { label: 'Start Date', value: sv.startDate },
                { label: 'Renewal Date', value: sv.renewalDate },
                { label: 'Plan', value: sv.plan },
                { label: 'Monthly Value', value: sv.monthlyValue },
              ].map((item, i) => (
                <View key={i} style={s.infoBox}>
                  <Text style={s.infoLabel}>{item.label.toUpperCase()}</Text>
                  <Text style={s.infoValue}>{item.value}</Text>
                </View>
              ))}
            </View>

            {/* Account Manager */}
            <Text style={s.sectionTitle}>👤 Your Account Manager</Text>
            <View style={s.managerCard}>
              <LinearGradient colors={[colors.gradStart, colors.gradEnd]} style={s.managerAvatar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Text style={{ color: 'white', fontWeight: '800', fontSize: 18 }}>{sv.manager.initials}</Text>
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '700', fontSize: 15, color: colors.text }}>{sv.manager.name}</Text>
                <Text style={{ fontSize: 12, color: colors.text2, marginTop: 2 }}>{sv.manager.role}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity style={[s.contactBtn, { backgroundColor: 'rgba(34,197,94,0.1)' }]}>
                  <Ionicons name="call-outline" size={18} color="#22C55E" />
                </TouchableOpacity>
                <TouchableOpacity style={[s.contactBtn, { backgroundColor: 'rgba(59,130,246,0.1)' }]}>
                  <Ionicons name="mail-outline" size={18} color="#3B82F6" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Chart — only if data exists */}
            {sv.chartData && sv.chartData.length > 0 && (
              <>
                <Text style={s.sectionTitle}>📊 Performance</Text>
                <View style={s.chartCard}>
                  <Text style={{ fontWeight: '700', fontSize: 15, color: colors.text, marginBottom: 12 }}>Organic Traffic (last 6 months)</Text>
                  <LineChart
                    data={{ labels: sv.chartLabels, datasets: [{ data: sv.chartData }] }}
                    width={320}
                    height={150}
                    chartConfig={{
                      backgroundColor: colors.card,
                      backgroundGradientFrom: colors.card,
                      backgroundGradientTo: colors.card,
                      decimalPlaces: 0,
                      color: () => colors.primary,
                      labelColor: () => colors.text3,
                      propsForDots: { r: '4', strokeWidth: '2', stroke: colors.primary },
                    }}
                    bezier
                    style={{ borderRadius: 12 }}
                    withShadow={false}
                  />
                </View>
              </>
            )}

            {/* Monthly Reports */}
            {sv.reports && sv.reports.length > 0 && (
              <>
                <Text style={s.sectionTitle}>📑 Monthly Reports</Text>
                <View style={s.chartCard}>
                  {sv.reports.map((r, i) => (
                    <View key={i} style={[s.reportItem, i === sv.reports.length - 1 && { borderBottomWidth: 0 }]}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 }}>
                        <View style={s.reportIcon}><Ionicons name="document-text-outline" size={18} color={colors.primary} /></View>
                        <View>
                          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>{r.month} Report</Text>
                          <Text style={{ fontSize: 11, color: colors.text2, marginTop: 2 }}>Generated {r.generated}</Text>
                        </View>
                      </View>
                      <TouchableOpacity style={s.dlBtn}><Text style={{ color: colors.primary, fontWeight: '700', fontSize: 12 }}>PDF</Text></TouchableOpacity>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = (c) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.bg },
  hero: { padding: 20, paddingTop: 18 },
  backBtn: { width: 36, height: 36, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  circleWrap: { alignItems: 'center', paddingVertical: 10 },
  circleOuter: { width: 140, height: 140, borderRadius: 70, borderWidth: 10, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  circleInner: { alignItems: 'center' },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  infoBox: { flex: 1, minWidth: '45%', backgroundColor: c.card2, borderWidth: 1.5, borderColor: c.border, borderRadius: 12, padding: 14 },
  infoLabel: { fontSize: 11, color: c.text2, fontWeight: '500', marginBottom: 6, letterSpacing: 0.4 },
  infoValue: { fontSize: 15, fontWeight: '700', color: c.text },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: c.text, marginBottom: 12 },
  managerCard: { backgroundColor: c.card, borderWidth: 1.5, borderColor: c.border, borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  managerAvatar: { width: 50, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  contactBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  chartCard: { backgroundColor: c.card, borderWidth: 1.5, borderColor: c.border, borderRadius: 16, padding: 16, marginBottom: 20 },
  reportItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: c.border },
  reportIcon: { width: 36, height: 36, backgroundColor: 'rgba(229,9,20,0.08)', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  dlBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: 'rgba(229,9,20,0.08)', borderRadius: 8 },
});