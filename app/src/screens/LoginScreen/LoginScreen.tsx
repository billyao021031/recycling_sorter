import React, { useState } from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Card, Text, TextInput } from "react-native-paper";
import { useAuth } from "../../context/AuthContext";
import styles from './LoginScreen.styles';

const LoginScreen = ({ navigation }: any) => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    const res = await login(username, password);
    if (!res.ok) {
      if (res.status === 423) {
        setError("Kiosk is currently in use. Please check back later.");
      } else {
        setError(res.detail || "Login failed");
      }
    }
  };

  return (
    <LinearGradient colors={["#E2F2F1", "#F6F7F4"]} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.hero}>
          <Text variant="headlineMedium" style={styles.title}>
            Welcome back
          </Text>
          <Text style={styles.subtitle}>
            Let’s make recycling better together.
          </Text>
        </View>

        <Card style={styles.formCard}>
          <Card.Content>
          <TextInput
            mode="outlined"
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            style={styles.input}
            outlineStyle={styles.inputOutline}
            contentStyle={styles.inputContent}
            left={<TextInput.Icon icon="account" />}
          />
          <TextInput
            mode="outlined"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            outlineStyle={styles.inputOutline}
            contentStyle={styles.inputContent}
            left={<TextInput.Icon icon="lock" />}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button mode="contained" style={styles.button} onPress={handleLogin}>
            Log in
          </Button>
            <Button
              mode="text"
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("Register")}
            >
              Don't have an account? Register
            </Button>
          </Card.Content>
        </Card>
      </View>
    </LinearGradient>
  );
};

export default LoginScreen; 
