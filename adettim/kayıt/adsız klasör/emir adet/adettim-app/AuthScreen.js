import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

export default function AuthScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email || !password) return setError('Tüm alanları doldurun!');
    if (!email.includes('@')) return setError('Geçerli bir e-posta girin!');
    
    // Giriş başarılıysa ana ekrana git
    setError('');
    navigation.replace('MainTabs');
  };

  return (
    <View style={{ padding: 24, marginTop: 120 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Giriş Yap</Text>

      <TextInput
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginTop: 16, padding: 8 }}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginTop: 16, padding: 8 }}
      />

      {error ? <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text> : null}

      <TouchableOpacity
        style={{ marginTop: 16, backgroundColor: '#b83280', padding: 12 }}
        onPress={handleLogin}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>Giriş Yap</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('Register')} style={{ marginTop: 12 }}>
        <Text style={{ textAlign: 'center', color: '#b83280' }}>Hesabın yok mu? Kayıt ol</Text>
      </TouchableOpacity>
    </View>
  );
}
