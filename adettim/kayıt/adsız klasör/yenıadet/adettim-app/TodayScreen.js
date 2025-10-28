import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, TextInput, Alert, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import DateTimePicker from '@react-native-community/datetimepicker';

function toYYYYMMDD(date) {
  return new Date(date).toISOString().split('T')[0];
}

export default function TodayScreen() {
  const [periods, setPeriods] = useState([]);
  const [cycleLength, setCycleLength] = useState(28);
  const [symptoms, setSymptoms] = useState({});
  const [diary, setDiary] = useState({});
  const [symptomModal, setSymptomModal] = useState(false);
  const [diaryModal, setDiaryModal] = useState(false);
  const [symptomInput, setSymptomInput] = useState('');
  const [diaryInput, setDiaryInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [endDateModal, setEndDateModal] = useState(false);
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());

  const todayStr = toYYYYMMDD(new Date());

  // useFocusEffect ile ekran her açıldığında verileri çek
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      (async () => {
        const savedPeriods = await AsyncStorage.getItem('PERIODS');
        const savedCycle = await AsyncStorage.getItem('CYCLE_LENGTH');
        const savedSymptoms = await AsyncStorage.getItem('SYMPTOMS');
        const savedDiary = await AsyncStorage.getItem('DIARY');
        if (isActive) {
          if (savedPeriods) setPeriods(JSON.parse(savedPeriods));
          else setPeriods([]);
          if (savedCycle) setCycleLength(Number(savedCycle));
          if (savedSymptoms) setSymptoms(JSON.parse(savedSymptoms));
          else setSymptoms({});
          if (savedDiary) setDiary(JSON.parse(savedDiary));
          else setDiary({});
          setLoading(false);
        }
      })();
      return () => { isActive = false; };
    }, [])
  );

  // En güncel döngü
  const currentPeriod = periods.length > 0 ? periods[0] : null;
  const startDate = currentPeriod ? currentPeriod.date : null;
  const endDate = currentPeriod && currentPeriod.endDate ? currentPeriod.endDate : null;

  // Bugün döngüde kaçıncı gün?
  let dayNum = null;
  if (startDate) {
    const start = new Date(startDate);
    const today = new Date(todayStr);
    dayNum = Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;
  }

  // Ovulasyon tahmini (basitçe: döngü ortası)
  let ovulationIn = null;
  if (startDate && cycleLength) {
    const start = new Date(startDate);
    const ovulationDay = new Date(start);
    ovulationDay.setDate(start.getDate() + Math.floor(cycleLength / 2));
    const today = new Date(todayStr);
    ovulationIn = Math.max(0, Math.floor((ovulationDay - today) / (1000 * 60 * 60 * 24)));
  }

  // Regl bitişi butonu aktif mi?
  const canEndPeriod = currentPeriod && !currentPeriod.endDate && startDate && new Date(todayStr) >= new Date(startDate);

  // Belirti ve günlük bugüne ait mi?
  const todaySymptom = symptoms[todayStr] || '';
  const todayDiary = diary[todayStr] || '';

  // Regl bitişini kaydet (seçilen tarihle)
  const handleEndPeriod = async () => {
    if (!canEndPeriod) return;
    setEndDateModal(true);
  };

  const saveEndDate = async () => {
    const endStr = toYYYYMMDD(selectedEndDate);
    if (!canEndPeriod) return;
    const updatedPeriods = periods.map((p, i) => i === 0 ? { ...p, endDate: endStr } : p);
    setPeriods(updatedPeriods);
    await AsyncStorage.setItem('PERIODS', JSON.stringify(updatedPeriods));
    setEndDateModal(false);
    Alert.alert('Başarılı', 'Regl bitişi kaydedildi.');
  };

  // Belirti kaydet
  const handleSaveSymptom = async () => {
    if (!symptomInput.trim()) return;
    const updated = { ...symptoms, [todayStr]: symptomInput };
    setSymptoms(updated);
    await AsyncStorage.setItem('SYMPTOMS', JSON.stringify(updated));
    setSymptomModal(false);
    setSymptomInput('');
  };

  // Günlük kaydet
  const handleSaveDiary = async () => {
    if (!diaryInput.trim()) return;
    const updated = { ...diary, [todayStr]: diaryInput };
    setDiary(updated);
    await AsyncStorage.setItem('DIARY', JSON.stringify(updated));
    setDiaryModal(false);
    setDiaryInput('');
  };

  if (loading) {
    return <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#232046'}}><Text style={{color:'#fff'}}>Yükleniyor...</Text></View>;
  }

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('./assets/adettim.png')}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        imageStyle={{ resizeMode: 'cover', opacity: 0.25 }}
      >
        <BlurView intensity={60} style={{ flex: 1, width: '100%', height: '100%' }} />
      </ImageBackground>
      <LinearGradient colors={['#232046', '#3B2B5A']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{paddingBottom: 40}} showsVerticalScrollIndicator={false}>
          {/* Üst başlık ve tarih */}
          <View style={styles.headerRow}>
            <View style={styles.settingsIcon} />
            <Text style={styles.headerDate}>{new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</Text>
          </View>
          <Text style={styles.headerSub}>{startDate ? 'Regl dönemi' : 'Henüz regl kaydı yok'}</Text>
          <Text style={styles.bigDay}>{startDate ? `${dayNum}. Gün` : '-'}</Text>
          <Text style={styles.ovulation}>{ovulationIn !== null ? `Yumurtlama: ${ovulationIn} gün kaldı` : ''}</Text>
          <TouchableOpacity style={[styles.endBtn, {opacity: canEndPeriod ? 1 : 0.5}]} disabled={!canEndPeriod} onPress={handleEndPeriod}>
            <Text style={styles.endBtnText}>Regl Bitişi</Text>
          </TouchableOpacity>

          {/* Vücut Aşaması Kartı */}
          <View style={styles.cardBodyStage}>
            <View style={{flex:1}}>
              <Text style={styles.cardTitle}>VÜCUT AŞAMASI</Text>
              <Text style={styles.cardDesc}>{startDate ? 'Döngünüzün ilk fazındasınız - adet dönemi.' : 'Henüz regl kaydı yok.'}</Text>
            </View>
            <View style={styles.cardDayNumWrap}>
              <Text style={styles.cardDayNum}>{startDate ? dayNum : '-'}</Text>
              <Text style={styles.cardDayLabel}>DÖNGÜ GÜNÜ</Text>
            </View>
          </View>

          {/* Bugün - Döngü Günü Kartı */}
          <View style={styles.cardTodayCycle}>
            <Text style={styles.cardTodayTitle}>{startDate ? `Bugün - Döngü Günü ${dayNum}` : 'Bugün'}</Text>
            <Text style={styles.cardTodayDesc}>{ovulationIn !== null ? (ovulationIn < 2 ? 'Yüksek - Gebe kalma ihtimali' : 'Düşük - Gebe kalma ihtimali') : ''}</Text>
            <View style={styles.progressBarWrap}>
              <View style={styles.progressBarBg}>
                <View style={styles.progressBarPink} />
                <View style={styles.progressBarYellow} />
                <View style={styles.progressBarGray} />
              </View>
              <View style={styles.progressBarLabels}>
                <Text style={styles.progressBarLabelDate}>{new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</Text>
                <View style={styles.progressBarTodayDot}><Text style={styles.progressBarTodayText}>Bugün</Text></View>
              </View>
            </View>
          </View>

          {/* Belirti Kartı */}
          <View style={styles.cardSymptom}>
            <Text style={styles.cardSymptomTitle}>Bugün kendinizi nasıl hissediyorsunuz?</Text>
            {todaySymptom ? (
              <>
                <Text style={{color:'#B83280',fontWeight:'bold',marginBottom:6}}>Belirtiniz: {todaySymptom}</Text>
                <View style={{flexDirection:'row'}}>
                  <TouchableOpacity style={styles.symptomBtn} onPress={()=>setSymptomModal(true)}>
                    <Text style={styles.symptomBtnText}>Düzenle</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.symptomBtn, {marginLeft:8, backgroundColor:'#FFE5F1'}]} onPress={async ()=>{
                    const updated = { ...symptoms };
                    delete updated[todayStr];
                    setSymptoms(updated);
                    await AsyncStorage.setItem('SYMPTOMS', JSON.stringify(updated));
                  }}>
                    <Text style={[styles.symptomBtnText, {color:'#D72660'}]}>Sil</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.cardSymptomDesc}>Analiz elde etmek için bize vücudunuzla ilgili daha çok bilgi verin.</Text>
                <TouchableOpacity style={styles.symptomBtn} onPress={()=>setSymptomModal(true)}>
                  <Text style={styles.symptomBtnText}>Belirti girin</Text>
                </TouchableOpacity>
              </>
            )}
            <Image source={require('./assets/adetresim.png')} style={styles.cardSymptomImg} />
          </View>

          {/* Günlük Kartı */}
          <View style={styles.cardDiary}>
            <Text style={styles.cardDiaryTitle}>Günlük yaz</Text>
            {todayDiary ? (
              <>
                <Text style={{color:'#B83280',fontWeight:'bold',marginBottom:6}}>Günlüğün: {todayDiary}</Text>
                <View style={{flexDirection:'row'}}>
                  <TouchableOpacity style={styles.diaryBtn} onPress={()=>setDiaryModal(true)}>
                    <Text style={styles.diaryBtnText}>Düzenle</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.diaryBtn, {marginLeft:8, backgroundColor:'#FFE5F1'}]} onPress={async ()=>{
                    const updated = { ...diary };
                    delete updated[todayStr];
                    setDiary(updated);
                    await AsyncStorage.setItem('DIARY', JSON.stringify(updated));
                  }}>
                    <Text style={[styles.diaryBtnText, {color:'#D72660'}]}>Sil</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <TouchableOpacity style={styles.diaryBtn} onPress={()=>setDiaryModal(true)}>
                <Text style={styles.diaryBtnText}>Yaz</Text>
              </TouchableOpacity>
            )}
            <Image source={require('./assets/adetresim.png')} style={styles.cardDiaryImg} />
          </View>
        </ScrollView>

        {/* Belirti Modal */}
        <Modal visible={symptomModal} transparent animationType="fade" onRequestClose={()=>setSymptomModal(false)}>
          <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.4)',justifyContent:'center',alignItems:'center'}}>
            <View style={{backgroundColor:'#fff',borderRadius:18,padding:24,width:'85%'}}>
              <Text style={{fontWeight:'bold',fontSize:18,marginBottom:12,color:'#B83280'}}>Belirti Gir</Text>
              <TextInput
                placeholder="Bugünkü belirtin"
                value={symptomInput}
                onChangeText={setSymptomInput}
                style={{borderWidth:1,borderColor:'#FF6B9D',borderRadius:10,padding:10,marginBottom:16}}
                multiline
              />
              <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                <TouchableOpacity onPress={()=>setSymptomModal(false)} style={{marginRight:12}}><Text style={{color:'#B83280'}}>İptal</Text></TouchableOpacity>
                <TouchableOpacity onPress={handleSaveSymptom}><Text style={{color:'#4ECDC4',fontWeight:'bold'}}>Kaydet</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Günlük Modal */}
        <Modal visible={diaryModal} transparent animationType="fade" onRequestClose={()=>setDiaryModal(false)}>
          <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.4)',justifyContent:'center',alignItems:'center'}}>
            <View style={{backgroundColor:'#fff',borderRadius:18,padding:24,width:'85%'}}>
              <Text style={{fontWeight:'bold',fontSize:18,marginBottom:12,color:'#B83280'}}>Günlük Yaz</Text>
              <TextInput
                placeholder="Bugünkü günlüğün"
                value={diaryInput}
                onChangeText={setDiaryInput}
                style={{borderWidth:1,borderColor:'#FF6B9D',borderRadius:10,padding:10,marginBottom:16}}
                multiline
              />
              <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                <TouchableOpacity onPress={()=>setDiaryModal(false)} style={{marginRight:12}}><Text style={{color:'#B83280'}}>İptal</Text></TouchableOpacity>
                <TouchableOpacity onPress={handleSaveDiary}><Text style={{color:'#4ECDC4',fontWeight:'bold'}}>Kaydet</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Regl Bitişi Modal */}
        <Modal visible={endDateModal} transparent animationType="fade" onRequestClose={()=>setEndDateModal(false)}>
          <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.4)',justifyContent:'center',alignItems:'center'}}>
            <View style={{backgroundColor:'#fff',borderRadius:22,padding:28,width:'85%',alignItems:'center',shadowColor:'#B83280',shadowOffset:{width:0,height:8},shadowOpacity:0.12,shadowRadius:18,elevation:8}}>
              <Text style={{fontWeight:'bold',fontSize:20,marginBottom:18,color:'#B83280'}}>Regl Bitiş Tarihi</Text>
              <DateTimePicker
                value={selectedEndDate}
                mode="date"
                display="spinner"
                minimumDate={startDate ? new Date(startDate) : new Date()}
                maximumDate={new Date()}
                onChange={(e, d) => d && setSelectedEndDate(d)}
                style={{width:'100%',marginBottom:18}}
              />
              <View style={{flexDirection:'row',justifyContent:'flex-end',width:'100%'}}>
                <TouchableOpacity onPress={()=>setEndDateModal(false)} style={{marginRight:18}}><Text style={{color:'#B83280',fontSize:16}}>İptal</Text></TouchableOpacity>
                <TouchableOpacity onPress={saveEndDate}><Text style={{color:'#4ECDC4',fontWeight:'bold',fontSize:16}}>Kaydet</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 40, marginBottom: 0 },
  settingsIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', position: 'absolute', left: 24 },
  headerDate: {
    color: '#A78BFA',
    fontSize: 54,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 120,
    textAlign: 'center',
    letterSpacing: 1.5,
    textShadowColor: '#fff',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  headerSub: { color: '#fff', fontSize: 22, textAlign: 'center', marginTop: 8, fontWeight: '600', opacity: 0.95 },
  bigDay: { color: '#fff', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 18, marginBottom: 0, letterSpacing: 1 },
  ovulation: { color: '#A78BFA', fontSize: 18, textAlign: 'center', marginTop: 18, marginBottom: 18, fontWeight: '600' },
  endBtn: { alignSelf: 'center', backgroundColor: '#fff', borderRadius: 24, paddingHorizontal: 40, paddingVertical: 14, marginTop: 18, marginBottom: 18, shadowColor: '#B83280', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 4 },
  endBtnText: { color: '#B83280', fontWeight: 'bold', fontSize: 20, letterSpacing: 0.5 },
  mascot: { 
    width: 90, 
    height: 90, 
    alignSelf: 'flex-end', 
    marginRight: 24, 
    marginTop: -60, 
    marginBottom: 8 },
  cardBodyStage: { backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 28, flexDirection: 'row', alignItems: 'center', padding: 28, marginHorizontal: 18, marginTop: 24, marginBottom: 24, shadowColor: '#B83280', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.10, shadowRadius: 18, elevation: 8 },
  cardTitle: { color: '#3B2B5A', fontWeight: 'bold', fontSize: 20, marginBottom: 12 },
  cardDesc: { color: '#3B2B5A', fontSize: 16, opacity: 0.85 },
  cardDayNumWrap: { alignItems: 'center', marginLeft: 24 },
  cardDayNum: { color: '#B83280', fontWeight: 'bold', fontSize: 38 },
  cardDayLabel: { color: '#B83280', fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  cardTodayCycle: { backgroundColor: 'rgba(35,32,70,0.92)', borderRadius: 28, padding: 28, marginHorizontal: 18, marginBottom: 24, shadowColor: '#4ECDC4', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.10, shadowRadius: 18, elevation: 8 },
  cardTodayTitle: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 6 },
  cardTodayDesc: { color: '#fff', fontSize: 15, marginBottom: 18 },
  progressBarWrap: { marginTop: 8 },
  progressBarBg: { flexDirection: 'row', height: 12, borderRadius: 8, overflow: 'hidden', backgroundColor: '#eee' },
  progressBarPink: { backgroundColor: '#FF6B9D', width: '20%', height: 12 },
  progressBarYellow: { backgroundColor: '#FFD600', width: '20%', height: 12 },
  progressBarGray: { backgroundColor: '#888', width: '60%', height: 12 },
  progressBarLabels: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  progressBarLabelDate: { color: '#fff', fontSize: 14, marginRight: 10 },
  progressBarTodayDot: { backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4, marginLeft: 8 },
  progressBarTodayText: { color: '#3B2B5A', fontWeight: 'bold', fontSize: 14 },
  cardSymptom: { backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 28, padding: 28, marginHorizontal: 18, marginBottom: 24, position: 'relative', shadowColor: '#B83280', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.10, shadowRadius: 18, elevation: 8 },
  cardSymptomTitle: { color: '#3B2B5A', fontWeight: 'bold', fontSize: 20, marginBottom: 12 },
  cardSymptomDesc: { color: '#3B2B5A', fontSize: 16, marginBottom: 18, opacity: 0.85 },
  symptomBtn: { backgroundColor: 'linear-gradient(90deg, #FF6B9D 0%, #FF8E9E 100%)', borderRadius: 16, paddingHorizontal: 22, paddingVertical: 10, alignSelf: 'flex-start', shadowColor: '#FF6B9D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 4 },
  symptomBtnText: { color: '#B83280', fontWeight: 'bold', fontSize: 16 },
  cardSymptomImg: { width: 60, height: 60, position: 'absolute', right: 12, bottom: 8, opacity: 0.85 },
  cardDiary: { backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 28, padding: 28, marginHorizontal: 18, marginBottom: 32, position: 'relative', shadowColor: '#B83280', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.10, shadowRadius: 18, elevation: 8 },
  cardDiaryTitle: { color: '#3B2B5A', fontWeight: 'bold', fontSize: 20, marginBottom: 12 },
  diaryBtn: { backgroundColor: 'linear-gradient(90deg, #4ECDC4 0%, #44A08D 100%)', borderRadius: 16, paddingHorizontal: 22, paddingVertical: 10, alignSelf: 'flex-start', shadowColor: '#4ECDC4', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 8, elevation: 4 },
  diaryBtnText: { color: '#059669', fontWeight: 'bold', fontSize: 16 },
  cardDiaryImg: { width: 60, height: 60, position: 'absolute', right: 12, bottom: 8, opacity: 0.85 },
}); 