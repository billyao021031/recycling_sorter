import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Card, Surface, Text } from 'react-native-paper';
import styles from './ProfileScreen.styles';
import { useAuth } from '../../context/AuthContext';

const ProfileScreen = () => {
  const { logout } = useAuth();
  const menuItems = [
    {
      id: '1',
      title: 'Account Settings',
      icon: 'person',
      onPress: () => {},
    },
    {
      id: '2',
      title: 'Notifications',
      icon: 'notifications',
      onPress: () => {},
    },
    {
      id: '3',
      title: 'Privacy Policy',
      icon: 'security',
      onPress: () => {},
    },
    {
      id: '4',
      title: 'Help & Support',
      icon: 'help',
      onPress: () => {},
    },
    {
      id: '5',
      title: 'About',
      icon: 'info',
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#E2F2F1', '#F6F7F4']} style={styles.hero}>
          <View style={styles.heroContent}>
            <View style={styles.profileImage}>
              <MaterialIcons name="person" size={44} color="#0F6B6E" />
            </View>
            <Text variant="titleLarge" style={styles.name}>
              John Doe
            </Text>
            <Text style={styles.email}>john.doe@example.com</Text>
          </View>
        </LinearGradient>

        <View style={styles.statsRow}>
          <Surface style={styles.statCard} elevation={0}>
            <Text style={styles.statValue}>156</Text>
            <Text style={styles.statLabel}>Points</Text>
          </Surface>
          <Surface style={styles.statCard} elevation={0}>
            <Text style={styles.statValue}>23</Text>
            <Text style={styles.statLabel}>Items recycled</Text>
          </Surface>
          <Surface style={styles.statCard} elevation={0}>
            <Text style={styles.statValue}>$12.50</Text>
            <Text style={styles.statLabel}>Rebate earned</Text>
          </Surface>
        </View>

        <Card style={styles.menuCard}>
          <Card.Content>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  index < menuItems.length - 1 ? styles.menuDivider : null,
                ]}
                onPress={item.onPress}
              >
                <View style={styles.menuItemLeft}>
                  <MaterialIcons name={item.icon as any} size={22} color="#0F6B6E" />
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={22} color="#8A9899" />
              </TouchableOpacity>
            ))}
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={logout}
          style={styles.logoutButton}
          contentStyle={styles.logoutContent}
          icon={({ size, color }) => (
            <MaterialIcons name="logout" size={size} color={color} />
          )}
        >
          Log out
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen; 
