import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '../styles/common';

export default function OnboardingScreen({ navigation }) {
  const [slide, setSlide] = useState(0);
  const slides = [
    { title: 'Adettime Hoşgeldiniz', desc: 'Adet döngünü kolayca takip et.' },
    { title: 'Takvim ve Tahmin', desc: 'Gelecek ve geçmiş döngülerini gör.' },
    { title: 'Not & Semptom', desc: 'Her gün not ve semptom ekle.' },
  ];
  return (
    <View style={styles.centered}>
      <Image source={require('../assets/adet.png')} style={{width:90, height:90, marginBottom:18, borderRadius:24}} />
      <Text style={styles.onboardTitle}>{slides[slide].title}</Text>
      <View style={styles.onboardDescBox}>
        <Text style={styles.onboardDesc}>{slides[slide].desc}</Text>
      </View>
      <View style={{flexDirection:'row', margin:16}}>
        {slides.map((_, i) => (
          <View key={i} style={{width:10, height:10, borderRadius:5, margin:4, backgroundColor:slide===i?'#b83280':'#ffe4f0'}} />
        ))}
      </View>
      {slide < 2 ? (
        <TouchableOpacity style={styles.onboardBtn} onPress={() => setSlide(slide+1)}>
          <Text style={styles.onboardBtnText}>İleri</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.onboardBtn} onPress={() => navigation.replace('Auth')}>
          <Text style={styles.onboardBtnText}>Başla</Text>
        </TouchableOpacity>
      )}
    </View>
  );
} 