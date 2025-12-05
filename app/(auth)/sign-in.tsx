import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import { Link, Stack, router } from 'expo-router';
import { supabase } from '@/src/lib/supabase';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 🚀 Auto redirect if user already logged in
  useEffect(() => {
    checkExistingSession();
  }, []);

  async function checkExistingSession() {
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      // User already logged in → go home automatically
      router.replace("/(tabs)/home");
    }
  }

  // ⭐ Login function
  async function SignInwithEmail() {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      Alert.alert("Login Failed", error.message);
      return;
    }

    // Login success → goto HOME
    router.replace("/(tabs)/home");
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Sign in' }} />

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="infinigoal@gmail.com"
        style={styles.input}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder=""
        style={styles.input}
        secureTextEntry
      />

      <Button onPress={SignInwithEmail} text="Sign in" />

      <Link href="/sign-up" style={styles.textButton}>
        Create an account
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
  },
  label: {
    color: 'gray',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginVertical: 10,
  },
});

export default SignInScreen;