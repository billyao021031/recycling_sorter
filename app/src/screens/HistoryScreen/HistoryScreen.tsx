import React, { useEffect, useMemo, useState } from "react";
import { View, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Card, Chip, Surface, Text } from "react-native-paper";
import styles from "./HistoryScreen.styles";
import { getHistory } from "../../services/api";

const HistoryScreen = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    getHistory().then(setHistory);
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(history.map((item) => item.category)));
    return ["All", ...unique];
  }, [history]);

  const filteredHistory = useMemo(() => {
    if (activeFilter === "All") {
      return history;
    }
    return history.filter((item) => item.category === activeFilter);
  }, [history, activeFilter]);

  const totalRebate = useMemo(
    () => filteredHistory.reduce((sum, item) => sum + (item.rebate ?? 0), 0),
    [filteredHistory]
  );

  const renderItem = ({ item }: { item: any }) => (
    <Card style={styles.historyCard}>
      <Card.Content style={styles.cardContent}>
        <Image source={{ uri: item.image_url }} style={styles.thumb} />
        <View style={styles.itemContent}>
          <Text style={styles.categoryText}>{item.category}</Text>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
        <View style={styles.rebateBox}>
          <MaterialIcons name="attach-money" size={18} color="#0F6B6E" />
          <Text style={styles.rebateText}>{item.rebate?.toFixed(2) ?? "--"}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredHistory}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <View>
            <LinearGradient colors={["#E2F2F1", "#F6F7F4"]} style={styles.hero}>
              <Text style={styles.heroTitle}>History</Text>
              <Text style={styles.heroSubtitle}>
                Track your recent classifications and rewards.
              </Text>
              <View style={styles.heroStats}>
                <Surface style={styles.heroStatCard} elevation={0}>
                  <MaterialIcons name="recycling" size={20} color="#0F6B6E" />
                  <View>
                    <Text style={styles.heroStatValue}>{filteredHistory.length}</Text>
                    <Text style={styles.heroStatLabel}>Items</Text>
                  </View>
                </Surface>
                <Surface style={styles.heroStatCard} elevation={0}>
                  <MaterialIcons name="savings" size={20} color="#0F6B6E" />
                  <View>
                    <Text style={styles.heroStatValue}>${totalRebate.toFixed(2)}</Text>
                    <Text style={styles.heroStatLabel}>Total rebate</Text>
                  </View>
                </Surface>
              </View>
            </LinearGradient>

            <View style={styles.filterRow}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  style={styles.filterChip}
                  selected={activeFilter === category}
                  onPress={() => setActiveFilter(category)}
                >
                  {category}
                </Chip>
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyTitle}>No history yet</Text>
              <Text style={styles.emptyBody}>Run a scan to see it here.</Text>
            </Card.Content>
          </Card>
        }
      />
    </SafeAreaView>
  );
};

export default HistoryScreen;
