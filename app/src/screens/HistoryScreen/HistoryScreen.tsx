import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './HistoryScreen.styles';

// Mock data for demonstration
const mockHistory = [
  {
    id: '1',
    material: 'Plastic Bottle',
    date: '2024-03-15',
    category: 'Plastic',
    points: 10,
  },
  {
    id: '2',
    material: 'Aluminum Can',
    date: '2024-03-14',
    category: 'Metal',
    points: 5,
  },
  {
    id: '3',
    material: 'Cardboard Box',
    date: '2024-03-13',
    category: 'Paper',
    points: 8,
  },
];

const HistoryScreen = () => {
  const renderItem = ({ item }: { item: typeof mockHistory[0] }) => (
    <TouchableOpacity style={styles.historyItem}>
      <View style={styles.itemHeader}>
        <Text style={styles.materialName}>{item.material}</Text>
        <Text style={styles.points}>+{item.points} pts</Text>
      </View>
      <View style={styles.itemDetails}>
        <View style={styles.categoryTag}>
          <MaterialIcons name="category" size={16} color="#4CAF50" />
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recycling History</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>23</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Points Earned</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={mockHistory}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

export default HistoryScreen; 