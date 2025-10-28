import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';

export default function AuthScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const handleLogin = () => {
    if (!email || !password) return setError('E-posta ve şifre zorunlu!');
    if (!emailRegex.test(email)) return setError('Geçerli e-posta girin!');
    setError('');
    navigation.replace('MainTabs');
  };
  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgb(255, 208, 197)', padding:24}}>
      <Image source={require('../assets/adet.png')} style={{position:'absolute', width:'100%', height:'100%', resizeMode:'contain', opacity:0.18, top:0, left:0, alignSelf:'center', marginTop:-150, marginLeft:20}} />
      <Image source={require('../assets/adet.png')} style={{alignSelf:'center', marginBottom:14, width:64, height:64, borderRadius:16}} />
      <View style={{width:'100%', maxWidth:340, zIndex:1, marginTop:260, alignItems:'center'}}>
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
          style={{backgroundColor:'#fff', borderRadius:8, borderWidth:1, borderColor:'#b83280', padding:10, fontSize:16}}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error ? <Text style={{color:'#e53935', marginTop:8, textAlign:'center'}}>{error}</Text> : null}
        <TouchableOpacity
          style={{backgroundColor:'#b83280', borderRadius:8, paddingVertical:12, marginTop:18, alignItems:'center'}}
          onPress={handleLogin}
        >
          <Text style={{color:'#fff', fontWeight:'bold', fontSize:17}}>Giriş Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{backgroundColor:'#b83280', borderRadius:8, paddingVertical:12, marginTop:12, alignItems:'center'}}
          onPress={() => navigation.replace('Register')}
        >
          <Text style={{color:'#fff', fontWeight:'bold', fontSize:17}}>Kayıt Ol</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 