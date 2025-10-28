import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  const handleRegister = () => {
    if (!email || !password || !confirmPassword) return setError('Tüm alanlar zorunlu!');
    if (!emailRegex.test(email)) return setError('Geçerli e-posta girin!');
    if (password !== confirmPassword) return setError('Şifreler eşleşmiyor!');
    if (password.length < 6) return setError('Şifre en az 6 karakter olmalı!');
    setError('');
    navigation.replace('MainTabs');
  };
  
  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgb(255, 208, 197)', padding:24}}>
      <Image source={require('../assets/adet.png')} style={{position:'absolute', width:'100%', height:'100%', resizeMode:'contain', opacity:0.18, top:0, left:0, alignSelf:'center', marginTop:-150, marginLeft:20}} />
      <View style={{width:'100%', maxWidth:340, zIndex:1, marginTop:400}}>
        <Text style={{fontSize:28, fontWeight:'bold', color:'#b83280', marginBottom:18, textAlign:'center'}}>Kayıt Ol</Text>
        <Text style={{color:'#b83280', fontWeight:'bold', marginBottom:4}}>E-posta</Text>
        <TextInput
          style={{backgroundColor:'#fff', borderRadius:8, borderWidth:1, borderColor:'#b83280', padding:10, marginBottom:12, fontSize:16}}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Text style={{color:'#b83280', fontWeight:'bold', marginBottom:4}}>Şifre</Text>
        <TextInput
          style={{backgroundColor:'#fff', borderRadius:8, borderWidth:1, borderColor:'#b83280', padding:10, marginBottom:12, fontSize:16}}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCorrect={false}
          autoComplete="off"
          textContentType="none"
        />
        <Text style={{color:'#b83280', fontWeight:'bold', marginBottom:4}}>Şifre Tekrar</Text>
        <TextInput
          style={{backgroundColor:'#fff', borderRadius:8, borderWidth:1, borderColor:'#b83280', padding:10, fontSize:16}}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCorrect={false}
          autoComplete="off"
          textContentType="none"
        />
        {error ? <Text style={{color:'#e53935', marginTop:8, textAlign:'center'}}>{error}</Text> : null}
        <TouchableOpacity
          style={{backgroundColor:'#b83280', borderRadius:8, paddingVertical:12, marginTop:18, alignItems:'center'}}
          onPress={handleRegister}
        >
          <Text style={{color:'#fff', fontWeight:'bold', fontSize:17}}>Kayıt Ol</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{backgroundColor:'#b83280', borderRadius:8, paddingVertical:12, marginTop:12, alignItems:'center'}}
          onPress={() => navigation.replace('Auth')}
        >
          <Text style={{color:'#fff', fontWeight:'bold', fontSize:17}}>Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 