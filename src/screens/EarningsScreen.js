import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import useEarnings from '../hooks/useEarnings';
import { SessionContext } from '../context/SessionContext';
import  formatCurrency  from '../utils/formatCurrency';

export default function EarningsScreen() {
  const { driver, t } = useContext(SessionContext);
  const { summaries, balance, loading } = useEarnings(driver?.id);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  const periods = [
    { key: 'today', title: t.earnings.today },
    { key: 'week', title: t.earnings.week },
    { key: 'month', title: t.earnings.month },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>{t.earnings.balance}</Text>
        <Text style={[styles.balanceValue, balance < 0 && styles.negative]}>
          {formatCurrency(balance)}
        </Text>
      </View>

      {periods.map(({ key, title }) => {
        const s = summaries[key];
        return (
          <View key={key} style={styles.card}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Row label={t.earnings.trips} value={String(s.count)} />
            <Row label={t.earnings.billed} value={formatCurrency(s.billed)} />
            <Row label={t.earnings.commissions} value={formatCurrency(s.commissions)} />
            <Row label={t.earnings.tips} value={formatCurrency(s.tips)} />
            <Row label={t.earnings.net} value={formatCurrency(s.net)} bold />
            <Row label={t.earnings.average} value={formatCurrency(s.average)} />
          </View>
        );
      })}
    </ScrollView>
  );
}

const Row = ({ label, value, bold }) => (
  <View style={styles.row}>
    <Text style={[styles.rowLabel, bold && styles.bold]}>{label}</Text>
    <Text style={[styles.rowValue, bold && styles.bold]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  balanceCard: { backgroundColor: '#111', borderRadius: 12, padding: 20 },
  balanceLabel: { color: '#bbb', fontSize: 14 },
  balanceValue: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginTop: 4 },
  negative: { color: '#ff6b6b' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  rowLabel: { color: '#555' },
  rowValue: { color: '#111' },
  bold: { fontWeight: 'bold', color: '#111' },
});