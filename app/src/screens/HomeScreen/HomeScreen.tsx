import React, { useState, useEffect } from "react";
import { View, ScrollView, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Card, Text, Button, Surface, Chip, IconButton } from "react-native-paper";
import styles from "./HomeScreen.styles";
import { useLatestResults } from "../../hooks/useLatestResults";
import { useAuth } from "../../context/AuthContext";

const HomeScreen = ({ navigation }: any) => {
  const { token } = useAuth();
  const { results, loading } = useLatestResults(token);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (current >= results.length) {
      setCurrent(0);
    }
  }, [results.length, current]);

  const hasResults = results.length > 0;
  const currentResult = hasResults ? results[current] : undefined;
  const canFlip = results.length > 1;

  const handleFlip = (direction: 'left' | 'right') => {
    setCurrent((prev) => {
      if (direction === 'left') {
        return prev === 0 ? results.length - 1 : prev - 1;
      } else {
        return prev === results.length - 1 ? 0 : prev + 1;
      }
    });
  };

  let latestContent: React.ReactNode;
  if (loading) {
    latestContent = <ActivityIndicator size="large" color="#0F6B6E" style={{ marginTop: 16 }} />;
  } else if (hasResults && currentResult) {
    latestContent = (
      <View>
        <View style={styles.carouselRow}>
          {canFlip && (
            <IconButton icon="chevron-left" size={28} onPress={() => handleFlip("left")} />
          )}
          <Image source={{ uri: currentResult.image_url }} style={styles.previewImage} />
          {canFlip && (
            <IconButton icon="chevron-right" size={28} onPress={() => handleFlip("right")} />
          )}
        </View>
        <View style={styles.resultPanel}>
          <Text style={styles.resultTitle}>Classification result</Text>
          <View style={styles.chipRow}>
            <Chip icon="recycle" style={styles.infoChip}>
              {currentResult.predicted_class}
            </Chip>
            <Chip icon="cash" style={styles.infoChip}>
              ${currentResult.rebate?.toFixed(2) ?? "--"}
            </Chip>
            <Chip icon="signal" style={styles.infoChip}>
              {currentResult.confidence ?? "--"}
            </Chip>
          </View>
          <View style={styles.feedbackRow}>
            <IconButton icon="thumb-up-outline" onPress={() => {}} />
            <IconButton icon="thumb-down-outline" onPress={() => {}} />
          </View>
        </View>
      </View>
    );
  } else {
    latestContent = <Text style={styles.emptyState}>No image classified yet.</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={["#E2F2F1", "#F6F7F4"]} style={styles.hero}>
          <View style={styles.heroAccent} />
          <View style={styles.heroContent}>
            <Text variant="headlineMedium" style={styles.heroTitle}>
              Recycling Sorter
            </Text>
            <Text variant="bodyMedium" style={styles.heroSubtitle}>
              Make recycling feel effortless with quick, reliable results.
            </Text>
            <View style={styles.heroStats}>
              <Surface style={styles.heroStatCard} elevation={0}>
                <MaterialIcons name="recycling" size={22} color="#0F6B6E" />
                <View>
                  <Text style={styles.heroStatValue}>24</Text>
                  <Text style={styles.heroStatLabel}>Items recycled</Text>
                </View>
              </Surface>
              <Surface style={styles.heroStatCard} elevation={0}>
                <MaterialIcons name="savings" size={22} color="#0F6B6E" />
                <View>
                  <Text style={styles.heroStatValue}>$12.50</Text>
                  <Text style={styles.heroStatLabel}>Rebate earned</Text>
                </View>
              </Surface>
            </View>
          </View>
        </LinearGradient>

        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Latest classifications
              </Text>
              <Text style={styles.sectionSubtitle}>Top 3 from your recent scans</Text>
            </View>
            {latestContent}
          </Card.Content>
        </Card>

        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Quick actions
              </Text>
              <Text style={styles.sectionSubtitle}>Jump back into your activity</Text>
            </View>
            <Button
              mode="contained"
              icon="history"
              style={styles.primaryButton}
              contentStyle={styles.primaryButtonContent}
              onPress={() => navigation.navigate("History")}
            >
              View history
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Recycling tips
              </Text>
              <Text style={styles.sectionSubtitle}>Small habits, bigger impact</Text>
            </View>
            <View style={styles.tipRow}>
              <MaterialIcons name="lightbulb" size={20} color="#0F6B6E" />
              <Text style={styles.tipText}>
                Rinse containers before recycling to prevent contamination.
              </Text>
            </View>
            <View style={styles.tipRow}>
              <MaterialIcons name="lightbulb" size={20} color="#0F6B6E" />
              <Text style={styles.tipText}>
                Check local guidelines to confirm what materials are accepted.
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen; 
