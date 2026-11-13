import React, { useContext, useState, useEffect, useCallback } from 'react';
import { FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { SessionContext } from '../context/SessionContext';
import { getDriverTripsPage } from '../services/tripService';
import TripListItem from '../components/TripListItem';

export default function TripHistoryScreen() {
  const { driver, t, language } = useContext(SessionContext);
  const [trips, setTrips] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !driver?.id) return;
    setLoading(true);
    try {
      const page = await getDriverTripsPage(driver.id, lastDoc);
      setTrips((prev) => [...prev, ...page.trips]);
      setLastDoc(page.lastDoc);
      setHasMore(page.hasMore);
    } catch (error) {
      console.log('TripHistory error:', error);
      setHasMore(false); // evita reintentos en bucle si la consulta falla
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, driver?.id, lastDoc]);

  useEffect(() => {
    loadMore();
  }, [driver?.id]);

  return (
    <FlatList
      data={trips}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TripListItem trip={item} t={t} language={language} />
      )}
      contentContainerStyle={styles.container}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loading ? <ActivityIndicator style={{ margin: 16 }} /> : null}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
});