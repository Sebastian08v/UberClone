// AI-assisted: see docs/AI_LOG.md
import React, { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { FlatList, ActivityIndicator, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SessionContext } from '../context/SessionContext';
import { getDriverTripsPage } from '../services/tripService';
import TripListItem from '../components/TripListItem';
import EmptyState from '../components/EmptyState';
import DatePickerField from '../components/DatePickerField';

function Chip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function TripHistoryScreen() {
  const navigation = useNavigation();
  const { driver, t, language } = useContext(SessionContext);
  const [trips, setTrips] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [dateType, setDateType] = useState('all');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [method, setMethod] = useState('all');

  // Evita que la respuesta de un filtro anterior pise la del filtro actual
  const requestId = useRef(0);

  const fetchTrips = useCallback(
    async (reset) => {
      if (!driver?.id) return;
      if (!reset && (loading || !hasMore)) return;

      const id = ++requestId.current;
      setLoading(true);
      try {
        const page = await getDriverTripsPage(driver.id, reset ? null : lastDoc, {
          dateType,
          from: fromDate,
          to: toDate,
          method,
        });
        if (id !== requestId.current) return;
        setTrips((prev) => (reset ? page.trips : [...prev, ...page.trips]));
        setLastDoc(page.lastDoc);
        setHasMore(page.hasMore);
      } catch (error) {
        if (id !== requestId.current) return;
        console.log('TripHistory error:', error);
        setHasMore(false); // evita reintentos en bucle si la consulta falla
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    },
    [loading, hasMore, driver?.id, lastDoc, dateType, fromDate, toDate, method]
  );

  // Cada vez que cambia un filtro se reinicia la lista desde la página 1
  useEffect(() => {
    setHasMore(true);
    fetchTrips(true);
  }, [driver?.id, dateType, fromDate, toDate, method]);

  const header = (
    <View style={styles.filters}>
      <View style={styles.row}>
        <Chip label={t.history.all} active={dateType === 'all'} onPress={() => setDateType('all')} />
        <Chip label={t.history.today} active={dateType === 'today'} onPress={() => setDateType('today')} />
        <Chip label={t.history.week} active={dateType === 'week'} onPress={() => setDateType('week')} />
        <Chip label={t.history.month} active={dateType === 'month'} onPress={() => setDateType('month')} />
        <Chip label={t.history.range} active={dateType === 'range'} onPress={() => setDateType('range')} />
      </View>

      {dateType === 'range' && (
        <View>
          <DatePickerField
            label={t.history.from}
            value={fromDate}
            onChange={setFromDate}
            placeholder={t.documents.selectDate}
          />
          <DatePickerField
            label={t.history.to}
            value={toDate}
            onChange={setToDate}
            placeholder={t.documents.selectDate}
          />
        </View>
      )}

      <View style={styles.row}>
        <Chip label={t.history.methodAll} active={method === 'all'} onPress={() => setMethod('all')} />
        <Chip label="Mercado Pago" active={method === 'mercadopago'} onPress={() => setMethod('mercadopago')} />
        <Chip label="Stripe" active={method === 'stripe'} onPress={() => setMethod('stripe')} />
        <Chip label={t.history.paymentCash} active={method === 'cash'} onPress={() => setMethod('cash')} />
      </View>
    </View>
  );

  return (
    <FlatList
      data={trips}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TripListItem
          trip={item}
          t={t}
          language={language}
          onPress={() => navigation.navigate('TripDetail', { tripId: item.id })}
        />
      )}
      contentContainerStyle={styles.container}
      ListHeaderComponent={header}
      ListEmptyComponent={!loading ? <EmptyState message={t.history.empty} /> : null}
      onEndReached={() => fetchTrips(false)}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loading ? <ActivityIndicator style={{ margin: 16 }} /> : null}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  filters: { marginBottom: 8 },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  chip: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: { backgroundColor: '#000', borderColor: '#000' },
  chipText: { color: '#333' },
  chipTextActive: { color: '#fff' },
});