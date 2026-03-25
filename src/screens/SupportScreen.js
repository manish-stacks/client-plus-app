import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, LayoutAnimation } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { TICKETS } from '../constants/data';
import { StatusChip } from './HomeScreen';

const FAQ = [
  { q: 'How often are SEO reports sent?',  a: 'SEO reports are sent monthly on the 1st of each month via email. You can also access them anytime from the Service Detail screen.' },
  { q: 'How do I renew a service?',        a: 'Go to the Services screen, click on the expiring service, and tap the Renew button. Our team will activate the renewal within 24 hours.' },
  { q: 'Who is my account manager?',       a: "Your assigned account manager's info is available inside each service detail card. You can reach them directly via WhatsApp or email." },
  { q: 'Can I upgrade my current plan?',   a: 'Yes! Visit the Proposals section or raise a support ticket. Our team will send you a custom upgrade proposal within 1 business day.' },
];

const ticketStatusMap = {
  inprogress: 'expiring',
  resolved:   'active',
  open:       'critical',
};

export default function SupportScreen() {
  const { colors } = useTheme();
  const s = styles(colors);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (i) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenFaq(openFaq === i ? null : i);
  };

  return (
    <View style={s.container}>
      <View style={s.header}><Text style={s.title}>Support</Text><Text style={s.sub}>We're here to help</Text></View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{padding:20, paddingBottom:20}}>
        {/* New Ticket button */}
        <TouchableOpacity>
          <LinearGradient colors={[colors.gradStart, colors.gradEnd]} style={s.newTicketBtn} start={{x:0,y:0}} end={{x:1,y:0}}>
            <Text style={{color:'white',fontWeight:'800',fontSize:16}}>+ Raise New Ticket</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={[s.sectionTitle, {marginTop:4}]}>My Tickets</Text>
        {TICKETS.map(t => (
          <View key={t.id} style={s.ticketCard}>
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:6}}>
              <Text style={{fontWeight:'700', fontSize:14, color:colors.text, flex:1, marginRight:8}}>{t.title}</Text>
              <StatusChip status={ticketStatusMap[t.status]} />
            </View>
            <Text style={{fontSize:12, color:colors.text2}}>#{t.id} • Opened {t.date} • {t.replies} replies</Text>
          </View>
        ))}

        <Text style={[s.sectionTitle, {marginTop:8}]}>FAQ</Text>
        {FAQ.map((f, i) => (
          <TouchableOpacity key={i} style={s.faqItem} onPress={() => toggleFaq(i)}>
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:14}}>
              <Text style={{fontWeight:'600', fontSize:14, color:colors.text, flex:1, marginRight:8}}>{f.q}</Text>
              <Ionicons name={openFaq===i ? 'chevron-up' : 'chevron-down'} size={18} color={colors.text2} />
            </View>
            {openFaq === i && (
              <View style={{paddingHorizontal:14, paddingBottom:14}}>
                <Text style={{fontSize:13, color:colors.text2, lineHeight:20}}>{f.a}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = (c) => StyleSheet.create({
  container:    { flex:1, backgroundColor:c.bg },
  header:       { paddingHorizontal:20, paddingTop:54, paddingBottom:12 },
  title:        { fontSize:22, fontWeight:'800', color:c.text },
  sub:          { fontSize:13, color:c.text2, marginTop:2 },
  newTicketBtn: { padding:16, borderRadius:12, alignItems:'center', marginBottom:20 },
  sectionTitle: { fontSize:16, fontWeight:'700', color:c.text, marginBottom:12 },
  ticketCard:   { backgroundColor:c.card, borderWidth:1.5, borderColor:c.border, borderRadius:12, padding:14, marginBottom:8 },
  faqItem:      { backgroundColor:c.card, borderWidth:1.5, borderColor:c.border, borderRadius:12, marginBottom:8, overflow:'hidden' },
});