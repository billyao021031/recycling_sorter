import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './HomeScreen.styles';

const images = [
  {
    src: require('../../assets/plastic_bottle.jpg'),
    result: {
      material: 'Plastic Bottle',
      category: 'Plastic',
      rebate: 0.10,
      confidence: 0.97
    }
  },
  {
    src: require('../../assets/aluminum_can.jpg'),
    result: {
      material: 'Aluminum Can',
      category: 'Metal',
      rebate: 0.15,
      confidence: 0.93
    }
  },
  {
    src: require('../../assets/cardboard_box.jpg'),
    result: {
      material: 'Cardboard Box',
      category: 'Paper',
      rebate: 0.05,
      confidence: 0.89
    }
  }
];

const HomeScreen = ({ navigation }: any) => {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleFlip = (direction: 'left' | 'right') => {
    setLoading(true);
    setTimeout(() => {
      setCurrent(prev => {
        if (direction === 'left') {
          return prev === 0 ? images.length - 1 : prev - 1;
        } else {
          return prev === images.length - 1 ? 0 : prev + 1;
        }
      });
      setLoading(false);
    }, 600); // Simulate loading
  };

  const result = images[current].result;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Recycling Sorter</Text>
          <Text style={styles.subtitle}>Make recycling easier</Text>
        </View>

        <View style={styles.uploadContainer}>
          <Text style={styles.sectionTitle}>Sorting Ongoing</Text>
          <View style={styles.previewContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity onPress={() => handleFlip('left')} style={{ padding: 8 }}>
                <MaterialIcons name="chevron-left" size={36} color="#4CAF50" />
              </TouchableOpacity>
              <Image source={images[current].src} style={styles.previewImage} />
              <TouchableOpacity onPress={() => handleFlip('right')} style={{ padding: 8 }}>
                <MaterialIcons name="chevron-right" size={36} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          </View>
          {loading && <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 10 }} />}
          {!loading && result && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Classification Result</Text>
              <Text style={styles.resultText}>Material: <Text style={styles.resultValue}>{result.material}</Text></Text>
              <Text style={styles.resultText}>Category: <Text style={styles.resultValue}>{result.category}</Text></Text>
              <Text style={styles.resultText}>Rebate: <Text style={styles.resultValue}>${result.rebate.toFixed(2)}</Text></Text>
              <Text style={styles.resultText}>Confidence: <Text style={styles.resultValue}>{(result.confidence * 100).toFixed(1)}%</Text></Text>
              <View style={styles.feedbackRow}>
                <TouchableOpacity style={styles.feedbackButton}>
                  <MaterialIcons name="thumb-up" size={28} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.feedbackButton}>
                  <MaterialIcons name="thumb-down" size={28} color="#f44336" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Keep stats and tips as before for now */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MaterialIcons name="recycling" size={32} color="#4CAF50" />
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Items Recycled</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="eco" size={32} color="#4CAF50" />
            <Text style={styles.statNumber}>12.5</Text>
            <Text style={styles.statLabel}>kg CO₂ Saved</Text>
          </View>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('History')}>
            <MaterialIcons name="history" size={24} color="white" />
            <Text style={styles.actionButtonText}>View History</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tipsContainer}>
          <Text style={styles.sectionTitle}>Recycling Tips</Text>
          <View style={styles.tipCard}>
            <MaterialIcons name="lightbulb" size={24} color="#4CAF50" />
            <Text style={styles.tipText}>
              Rinse containers before recycling to prevent contamination
            </Text>
          </View>
          <View style={styles.tipCard}>
            <MaterialIcons name="lightbulb" size={24} color="#4CAF50" />
            <Text style={styles.tipText}>
              Check local recycling guidelines for specific material acceptance
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen; 