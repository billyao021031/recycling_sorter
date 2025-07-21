import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, ActivityIndicator } from "react-native";
import { getRebates } from "../../services/api";
import styles from './RebateListScreen.styles';
import { useAuth } from "../../context/AuthContext";

const RebateListScreen = () => {
  const { token } = useAuth();
  const [rebates, setRebates] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRebates = async () => {
    setError("");
    setLoading(true);
    try {
      if (typeof token === 'string') {
        const data = await getRebates(token);
        setRebates(data);
      } else {
        setError("No token found. Please log in again.");
      }
    } catch (e) {
      setError("Failed to fetch rebates");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRebates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show the latest rebate at the top
  const latestRebate = rebates.length > 0 ? rebates[0] : null;

  return (
    <View style={styles.container}>
      <Button title="Refresh" onPress={fetchRebates} />
      {loading && <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 10 }} />}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {latestRebate && (
        <View style={styles.latestCard}>
          <Text style={styles.latestTitle}>Latest Rebate</Text>
          <Text style={styles.latestAmount}>${latestRebate.amount?.toFixed(2) ?? '0.00'}</Text>
          <Text style={styles.latestDesc}>{latestRebate.title ?? 'Recycled Item'}</Text>
        </View>
      )}
      <Text style={styles.historyTitle}>Rebate History</Text>
      <FlatList
        data={rebates}
        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text style={styles.historyText}>{item.title ?? 'Recycled Item'} - ${item.amount?.toFixed(2) ?? '0.00'}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default RebateListScreen; 