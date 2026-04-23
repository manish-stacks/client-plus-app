import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, RefreshControl,
  ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { AxiosInstance } from '../../lib/Axios.instance';
import ScreenWrapper from '../../components/ScreenWrapper';

const StatCard = ({ icon, label, value, color, bg }) => {
  const { colors } = useTheme();
  return (
    <View style={[statStyles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[statStyles.iconWrap, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[statStyles.value, { color: colors.text }]}>{value ?? '—'}</Text>
      <Text style={[statStyles.label, { color: colors.text2 }]}>{label}</Text>
    </View>
  );
};

const statStyles = StyleSheet.create({
  card: {
    flex: 1, borderRadius: 16, padding: 14, alignItems: 'center',
    borderWidth: 1.5, minWidth: '46%', gap: 6,
  },
  iconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  value: { fontSize: 24, fontWeight: '800' },
  label: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
});

export default function DashboardScreen({ navigation }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checking, setChecking] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await AxiosInstance.get('/employee/dashboard');
      setData(res.data?.data || res.data);
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  const onRefresh = useCallback(() => { setRefreshing(true); fetchDashboard(); }, []);

  const s = styles(colors);

  const handleCheckInOut = async () => {
    try {
      setChecking(true);

      const endpoint = checkedIn ? '/employee/check-out' : '/employee/check-in';

      const res = await AxiosInstance.post(endpoint);

      setCheckedIn(!checkedIn);

      Alert.alert(
        'Success',
        checkedIn ? 'Checked out successfully' : 'Checked in successfully'
      );
    } catch (e) {
      Alert.alert('Error', e.message || 'Action failed');
    } finally {
      setChecking(false);
    }
  };

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  const activity = data?.recent_activity || data?.recentActivity || [];

  return (
    <ScreenWrapper isScrollable={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >

        <LinearGradient colors={[colors.gradStart, colors.gradEnd]} style={s.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View>
            <Text style={s.greeting}>Good day, {user?.name?.split(' ')[0] || 'Employee'} 👋</Text>
            <Text style={s.heroSub}>Here's your overview for today</Text>
          </View>
          {/* <View style={s.avatarCircle}>
            <Text style={s.avatarText}>{user?.name ? user.name[0].toUpperCase() : 'E'}</Text>
          </View> */}
        </LinearGradient>
        <View style={[s.checkCard, { backgroundColor: colors.card, borderColor: colors.border }]}>

          <View style={s.checkHeader}>
            <View style={[
              s.statusDot,
              { backgroundColor: checkedIn ? '#22C55E' : '#EF4444' }
            ]} />
            <Text style={[s.statusText, { color: colors.text }]}>
              {checkedIn ? 'Checked In' : 'Not Checked In'}
            </Text>
          </View>


          <Text style={[s.timeText, { color: colors.text2 }]}>
            {checkedIn ? 'You are currently working' : 'Start your day by checking in'}
          </Text>


          <TouchableOpacity
            style={[
              s.checkBtnNew,
              { backgroundColor: checkedIn ? '#EF4444' : '#22C55E' }
            ]}
            onPress={handleCheckInOut}
            disabled={checking}
          >
            {checking ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons
                  name={checkedIn ? 'log-out-outline' : 'log-in-outline'}
                  size={20}
                  color="#fff"
                />
                <Text style={s.checkText}>
                  {checkedIn ? 'Check Out' : 'Check In'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={s.cardBody}>

          <Text style={s.sectionTitle}>Overview</Text>
          <View style={s.statsGrid}>
            <StatCard
              icon="people-outline" label="Total Clients"
              value={data?.total_clients ?? data?.totalClients}
              color="#3B82F6" bg="rgba(59,130,246,0.12)"
            />
            <StatCard
              icon="calendar-outline" label="Today Visits"
              value={data?.today_visits ?? data?.todayVisits}
              color="#22C55E" bg="rgba(34,197,94,0.12)"
            />
            <StatCard
              icon="time-outline" label="Pending Visits"
              value={data?.pending_visits ?? data?.pendingVisits}
              color="#F59E0B" bg="rgba(245,158,11,0.12)"
            />
            <StatCard
              icon="checkmark-circle-outline" label="Completed"
              value={data?.completed_visits ?? data?.completedVisits}
              color="#A855F7" bg="rgba(168,85,247,0.12)"
            />
          </View>


          <Text style={s.sectionTitle}>Quick Actions</Text>
          <View style={s.actionsRow}>
            {[
              { icon: 'person-add-outline', label: 'Add Client', screen: 'AddClient', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
              { icon: 'people-outline', label: 'Clients', screen: 'Clients', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
              { icon: 'map-outline', label: 'Visits', screen: 'Visits', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
            ].map((a, i) => (
              <TouchableOpacity key={i} style={[s.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => navigation.navigate(a.screen)}>
                <View style={[s.actionIcon, { backgroundColor: a.bg }]}>
                  <Ionicons name={a.icon} size={22} color={a.color} />
                </View>
                <Text style={[s.actionLabel, { color: colors.text }]}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {activity.length > 0 && (
            <>
              <Text style={s.sectionTitle}>Recent Activity</Text>
              <View style={[s.card, { borderColor: colors.border }]}>
                {activity.slice(0, 5).map((item, i) => (
                  <View key={i} style={[s.activityRow, i === 0 && { paddingTop: 0 }, i === activity.length - 1 && { borderBottomWidth: 0 }]}>
                    <View style={[s.actDot, { backgroundColor: colors.primary }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={[s.actTitle, { color: colors.text }]}>{item.title || item.description || item.message}</Text>
                      <Text style={[s.actTime, { color: colors.text3 }]}>{item.time || item.created_at || item.date || ''}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = (c) => StyleSheet.create({
  hero: {
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff'
  },
  heroSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff'
  },
  cardBody: {
    padding: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: c.text,
    marginBottom: 12,
    marginTop: 4
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionLabel: { fontSize: 11, fontWeight: '700' },
  card: {
    backgroundColor: c.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    marginBottom: 16
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: c.border
  },
  actDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5
  },
  actTitle: {
    fontSize: 13,
    fontWeight: '600'
  },
  actTime: {
    fontSize: 11,
    marginTop: 2
  },
  checkCard: {
    marginHorizontal: 20,
    marginTop: -20,
    marginBottom: 10,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    elevation: 4,
  },

  checkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  statusText: {
    fontSize: 15,
    fontWeight: '700',
  },

  timeText: {
    fontSize: 12,
    marginBottom: 14,
  },

  checkBtnNew: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  checkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  }
});
