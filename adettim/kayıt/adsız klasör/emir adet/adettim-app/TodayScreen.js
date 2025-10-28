import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

export default function TodayScreen() {
  const scrollRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ y: 0, animated: false });
      }
    }, [])
  );

  return (
    <LinearGradient colors={['#FFDEE9', '#B5FFFC']} style={styles.bg}>
      <ScrollView ref={scrollRef} contentContainerStyle={{paddingBottom: 40}} showsVerticalScrollIndicator={false}>
        {/* Üst başlık ve tarih */}
        <View style={styles.headerRow}>
          <View style={styles.settingsIcon} />
          <Text style={styles.headerDate}>6 Tem</Text>
        </View>
        <Text style={styles.headerSub}>Regl dönemi</Text>
        <Text style={styles.bigDay}>1. Gün</Text>
        <Text style={styles.ovulation}>Yumurtlama: 14 gün kaldı</Text>
        <TouchableOpacity style={styles.endBtn}><Text style={styles.endBtnText}>Regl Bitişi</Text></TouchableOpacity>
        <Image source={require('./assets/adettim.png')} style={styles.mascot} />

        {/* Vücut Aşaması Kartı */}
        <View style={styles.cardBodyStage}>
          <View style={{flex:1}}>
            <Text style={styles.cardTitle}>VÜCUT AŞAMASI</Text>
            <Text style={styles.cardDesc}>Döngünüzün ilk fazındasınız - adet dönemi.</Text>
          </View>
          <View style={styles.cardDayNumWrap}>
            <Text style={styles.cardDayNum}>1</Text>
            <Text style={styles.cardDayLabel}>DÖNGÜ GÜNÜ</Text>
          </View>
        </View>

        {/* Bugün - Döngü Günü Kartı */}
        <View style={styles.cardTodayCycle}>
          <Text style={styles.cardTodayTitle}>Bugün - Döngü Günü 1</Text>
          <Text style={styles.cardTodayDesc}>Düşük - Gebe kalma ihtimali</Text>
          <View style={styles.progressBarWrap}>
            <View style={styles.progressBarBg}>
              <View style={styles.progressBarPink} />
              <View style={styles.progressBarYellow} />
              <View style={styles.progressBarGray} />
            </View>
            <View style={styles.progressBarLabels}>
              <Text style={styles.progressBarLabelDate}>6 Tem</Text>
              <View style={styles.progressBarTodayDot}><Text style={styles.progressBarTodayText}>Bugün</Text></View>
            </View>
          </View>
        </View>

        {/* Belirti Kartı */}
        <View style={styles.cardSymptom}>
          <Text style={styles.cardSymptomTitle}>Bugün kendinizi nasıl hissediyorsunuz?</Text>
          <Text style={styles.cardSymptomDesc}>Analiz elde etmek için bize vücudunuzla ilgili daha çok bil...</Text>
          <TouchableOpacity style={styles.symptomBtn}><Text style={styles.symptomBtnText}>Belirti girin</Text></TouchableOpacity>
          <Image source={require('./assets/adetresim.png')} style={styles.cardSymptomImg} />
        </View>

        {/* Günlük Kartı */}
        <View style={styles.cardDiary}>
          <Text style={styles.cardDiaryTitle}>Günlük yaz</Text>
          <TouchableOpacity style={styles.diaryBtn}><Text style={styles.diaryBtnText}>Yaz</Text></TouchableOpacity>
          <Image source={require('./assets/adetresim.png')} style={styles.cardDiaryImg} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 32 },
  settingsIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', position: 'absolute', left: 24 },
  headerDate: { color: '#fff', fontSize: 22, fontWeight: 'bold', letterSpacing: 1 },
  headerSub: { color: '#fff', fontSize: 18, textAlign: 'center', marginTop: 2 },
  bigDay: { color: '#fff', fontSize: 44, fontWeight: 'bold', textAlign: 'center', marginTop: 8 },
  ovulation: { color: '#fff', fontSize: 16, textAlign: 'center', marginTop: 2, marginBottom: 10 },
  endBtn: { alignSelf: 'center', backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 32, paddingVertical: 10, marginTop: 8, marginBottom: 8 },
  endBtnText: { color: '#3B2B5A', fontWeight: 'bold', fontSize: 18 },
  mascot: { width: 90, height: 90, alignSelf: 'flex-end', marginRight: 24, marginTop: -60, marginBottom: 8 },
  cardBodyStage: { backgroundColor: '#F3E8FF', borderRadius: 18, flexDirection: 'row', alignItems: 'center', padding: 18, marginHorizontal: 16, marginTop: 8, marginBottom: 16 },
  cardTitle: { color: '#3B2B5A', fontWeight: 'bold', fontSize: 16, marginBottom: 2 },
  cardDesc: { color: '#3B2B5A', fontSize: 14 },
  cardDayNumWrap: { alignItems: 'center', marginLeft: 16 },
  cardDayNum: { color: '#B83280', fontWeight: 'bold', fontSize: 32 },
  cardDayLabel: { color: '#B83280', fontSize: 12, fontWeight: 'bold' },
  cardTodayCycle: { backgroundColor: '#2D2546', borderRadius: 18, padding: 18, marginHorizontal: 16, marginBottom: 16 },
  cardTodayTitle: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  cardTodayDesc: { color: '#fff', fontSize: 13, marginBottom: 10 },
  progressBarWrap: { marginTop: 4 },
  progressBarBg: { flexDirection: 'row', height: 10, borderRadius: 8, overflow: 'hidden', backgroundColor: '#eee' },
  progressBarPink: { backgroundColor: '#FF6B9D', width: '20%', height: 10 },
  progressBarYellow: { backgroundColor: '#FFD600', width: '20%', height: 10 },
  progressBarGray: { backgroundColor: '#888', width: '60%', height: 10 },
  progressBarLabels: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  progressBarLabelDate: { color: '#fff', fontSize: 12, marginRight: 8 },
  progressBarTodayDot: { backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 2, marginLeft: 4 },
  progressBarTodayText: { color: '#3B2B5A', fontWeight: 'bold', fontSize: 12 },
  cardSymptom: { backgroundColor: '#F3E8FF', borderRadius: 18, padding: 18, marginHorizontal: 16, marginBottom: 16, position: 'relative' },
  cardSymptomTitle: { color: '#3B2B5A', fontWeight: 'bold', fontSize: 16, marginBottom: 2 },
  cardSymptomDesc: { color: '#3B2B5A', fontSize: 14, marginBottom: 10 },
  symptomBtn: { backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 18, paddingVertical: 8, alignSelf: 'flex-start' },
  symptomBtnText: { color: '#B83280', fontWeight: 'bold', fontSize: 15 },
  cardSymptomImg: { width: 60, height: 60, position: 'absolute', right: 12, bottom: 8 },
  cardDiary: { backgroundColor: '#F3E8FF', borderRadius: 18, padding: 18, marginHorizontal: 16, marginBottom: 24, position: 'relative' },
  cardDiaryTitle: { color: '#3B2B5A', fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
  diaryBtn: { backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 18, paddingVertical: 8, alignSelf: 'flex-start' },
  diaryBtnText: { color: '#B83280', fontWeight: 'bold', fontSize: 15 },
  cardDiaryImg: { width: 60, height: 60, position: 'absolute', right: 12, bottom: 8 },
}); 