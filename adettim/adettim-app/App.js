import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { FlatList, useColorScheme, ScrollView, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const STORAGE_KEY = 'PERIODS';
const CYCLE_KEY = 'CYCLE_LENGTH';

function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
}

function toYYYYMMDD(date) {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

function formatDateTR(date) {
  const d = new Date(date);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
}

// Takvim Türkçe dil ayarları
LocaleConfig.locales['tr'] = {
  monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
  monthNamesShort: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
  dayNames: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
  dayNamesShort: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
  today: 'Bugün'
};
LocaleConfig.defaultLocale = 'tr';

// Onboarding ekranları (3 slayt)
function OnboardingScreen({ navigation }) {
  const [slide, setSlide] = useState(0);
  const slides = [
    { title: 'Adettime Hoşgeldiniz', desc: 'Adet döngünü kolayca takip et.' },
    { title: 'Takvim ve Tahmin', desc: 'Gelecek ve geçmiş döngülerini gör.' },
    { title: 'Not & Semptom', desc: 'Her gün not ve semptom ekle.' },
  ];
  return (
    <View style={styles.centered}>
      <Image source={require('./assets/adet.png')} style={{width:64, height:64, marginBottom:18, borderRadius:16, alignSelf:'center'}} />
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

// Giriş/Kayıt ekranı
function AuthScreen({ navigation }) {
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
      <Image source={require('./assets/adet.png')} style={{position:'absolute', width:'100%', height:'100%', resizeMode:'contain', opacity:0.18, top:0, left:0, alignSelf:'center', marginTop:-150, marginLeft:20}} />
      <View style={{width:'100%', maxWidth:340, zIndex:1, marginTop:420}}>
        <Text style={{fontSize:28, fontWeight:'bold', color:'#b83280', marginBottom:18, textAlign:'center'}}>Adettim</Text>
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

// Kayıt ekranı
function RegisterScreen({ navigation }) {
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
      <Image source={require('./assets/adet.png')} style={{position:'absolute', width:'100%', height:'100%', resizeMode:'contain', opacity:0.18, top:0, left:0, alignSelf:'center', marginTop:-150, marginLeft:20}} />
      <View style={{width:'100%', maxWidth:340, zIndex:1, marginTop:380}}>
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
        />
        <Text style={{color:'#b83280', fontWeight:'bold', marginBottom:4}}>Şifre Tekrar</Text>
        <TextInput
          style={{backgroundColor:'#fff', borderRadius:8, borderWidth:1, borderColor:'#b83280', padding:10, fontSize:16}}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
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

// Ana Takvim Ekranı
function CalendarScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [periods, setPeriods] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [cycleLength, setCycleLength] = useState(28);
  const [cycleInput, setCycleInput] = useState('28');
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarSelected, setCalendarSelected] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Load data from storage
  React.useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) setPeriods(JSON.parse(saved));
      const savedCycle = await AsyncStorage.getItem(CYCLE_KEY);
      if (savedCycle) {
        setCycleLength(Number(savedCycle));
        setCycleInput(savedCycle);
      }
    })();
  }, []);

  // Save periods to storage
  React.useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(periods));
  }, [periods]);

  // Save cycle length to storage
  React.useEffect(() => {
    AsyncStorage.setItem(CYCLE_KEY, String(cycleLength));
  }, [cycleLength]);

  const handleAddPeriod = (date = selectedDate) => {
    setPeriods(prev => [{ date: date.toISOString() }, ...prev]);
    setShowPicker(false);
    setShowCalendar(false);
    setCalendarSelected(null);
  };

  const handleDeletePeriod = (index) => {
    setPeriods(prev => prev.filter((_, i) => i !== index));
  };

  const getNextPeriod = () => {
    if (periods.length === 0) return null;
    const last = new Date(periods[0].date);
    last.setDate(last.getDate() + cycleLength);
    return last;
  };

  const renderPeriod = ({ item, index }) => {
    const today = new Date();
    const periodDate = new Date(item.date);
    const diff = daysBetween(periodDate, today);
    let diffText = '';
    if (diff === 0) diffText = 'Bugün';
    else if (diff > 0) diffText = `${diff} gün önce`;
    else diffText = `${Math.abs(diff)} gün sonra`;
    return (
      <View style={[styles.periodCard, {backgroundColor: isDark ? '#2d2233' : '#fff'}]}>
        <Text style={[styles.periodCardDate, {color: isDark ? '#fff' : '#b83280'}]}>{formatDateTR(item.date)}</Text>
        <Text style={styles.periodCardDiff}>{diffText}</Text>
      </View>
    );
  };

  const lastPeriod = periods[0]?.date ? formatDateTR(periods[0].date) : null;
  const nextPeriod = getNextPeriod();

  const handleCycleInput = (val) => {
    setCycleInput(val.replace(/[^0-9]/g, ''));
    if (/^\d+$/.test(val) && Number(val) > 10 && Number(val) < 60) {
      setCycleLength(Number(val));
    }
  };

  // Son iki adet tarihi arasındaki gün farkı
  let lastCycleLength = '-';
  if (periods.length > 1) {
    const d1 = new Date(periods[0].date);
    const d2 = new Date(periods[1].date);
    lastCycleLength = Math.abs(daysBetween(d1, d2));
  }

  // Tüm işaretli günleri hesapla
  let markedDates = {};
  periods.forEach((p, idx) => {
    const start = new Date(p.date);
    // Adet günleri (pembe)
    for (let i = 0; i < cycleLength; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      markedDates[key] = {
        startingDay: i === 0,
        endingDay: i === cycleLength - 1,
        color: '#ffb6c1', // pembe
        textColor: '#fff',
      };
    }
    // Ovulasyon günü (mavi)
    const ovu = new Date(start);
    ovu.setDate(ovu.getDate() + 14);
    const ovuKey = ovu.toISOString().split('T')[0];
    markedDates[ovuKey] = {
      color: '#4fc3f7',
      textColor: '#fff',
      marked: true,
      dotColor: '#1976d2',
    };
    // Tahmini sonraki adet (açık pembe)
    if (idx === 0) {
      const nextStart = new Date(start);
      nextStart.setDate(nextStart.getDate() + cycleLength);
      for (let i = 0; i < cycleLength; i++) {
        const d = new Date(nextStart);
        d.setDate(d.getDate() + i);
        const key = d.toISOString().split('T')[0];
        markedDates[key] = {
          startingDay: i === 0,
          endingDay: i === cycleLength - 1,
          color: '#ffe4f0',
          textColor: '#b83280',
        };
      }
      // Tahmini ovulasyon
      const nextOvu = new Date(nextStart);
      nextOvu.setDate(nextOvu.getDate() + 14);
      const nextOvuKey = nextOvu.toISOString().split('T')[0];
      markedDates[nextOvuKey] = {
        color: '#b3e5fc',
        textColor: '#1976d2',
        marked: true,
        dotColor: '#1976d2',
      };
    }
  });

  // Geçmiş adetler modalı
  const renderHistoryModal = () => (
    <Modal
      visible={showHistory}
      animationType="none"
      transparent={true}
      onRequestClose={() => setShowHistory(false)}
    >
      <View style={{flex:1, backgroundColor:'rgba(0,0,0,0.3)', justifyContent:'center', alignItems:'center'}}>
        <View style={{backgroundColor: isDark ? '#2d2233' : '#fff', borderRadius:14, padding:22, minWidth:260, maxWidth:'90%', shadowColor:'#000', shadowOpacity:0.04, shadowRadius:2, elevation:1, alignItems:'center'}}>
          <Text style={{fontSize:18, fontWeight:'bold', color: isDark ? '#fff' : '#b83280', marginBottom:12, textAlign:'center'}}>Geçmiş Adetler</Text>
          {periods.length === 0 ? (
            <Text style={{color:'#888', textAlign:'center'}}>Kayıt yok.</Text>
          ) : (
            periods.map((item, i) => {
              const date = formatDateTR(item.date);
              const today = new Date();
              const periodDate = new Date(item.date);
              const diff = daysBetween(periodDate, today);
              let diffText = '';
              if (diff === 0) diffText = 'Bugün';
              else if (diff > 0) diffText = `${diff} gün önce`;
              else diffText = `${Math.abs(diff)} gün sonra`;
              return (
                <View key={i} style={{marginBottom:8, alignItems:'center'}}>
                  <Text style={{fontSize:16, color: isDark ? '#fff' : '#b83280', fontWeight:'bold'}}>{date}</Text>
                  <Text style={{fontSize:12, color:'#888'}}>{diffText}</Text>
                </View>
              );
            })
          )}
          <TouchableOpacity onPress={() => setShowHistory(false)} style={{marginTop:16, alignSelf:'center', backgroundColor:'#b83280', borderRadius:8, paddingVertical:8, paddingHorizontal:24}}>
            <Text style={{color:'#fff', fontWeight:'bold', fontSize:15}}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Ayarlar modalı
  const renderSettingsModal = () => (
    <Modal
      visible={showSettings}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setShowSettings(false)}
    >
      <View style={{flex:1, backgroundColor:'rgba(0,0,0,0.3)', justifyContent:'center', alignItems:'center'}}>
        <View style={{backgroundColor: isDark ? '#2d2233' : '#fff', borderRadius:14, padding:22, minWidth:220, maxWidth:'90%', shadowColor:'#000', shadowOpacity:0.04, shadowRadius:2, elevation:1, alignItems:'center'}}>
          <Text style={{fontSize:18, fontWeight:'bold', color: isDark ? '#fff' : '#b83280', marginBottom:18, textAlign:'center'}}>Ayarlar</Text>
          <TouchableOpacity
            onPress={() => {
              setShowSettings(false);
            }}
            style={{backgroundColor:'#b83280', borderRadius:8, paddingVertical:10, paddingHorizontal:32, marginBottom:8}}
          >
            <Text style={{color:'#fff', fontWeight:'bold', fontSize:16}}>Çıkış Yap</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowSettings(false)} style={{marginTop:4}}>
            <Text style={{color:'#888', fontSize:15}}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Takvim butonunu alta taşı ve toggle özelliği ekle
  const renderHeader = () => (
    <>
      {renderHistoryModal()}
      {renderSettingsModal()}
      <View style={styles.headerBox}>
        <Text style={styles.headerIcon}>♀️</Text>
        <Text style={[styles.title, {color: isDark ? '#fff' : '#b83280'}]}>Adettim</Text>
        <TouchableOpacity onPress={() => setShowSettings(true)} style={styles.settingsIconBtn}>
          <MaterialCommunityIcons name="cog-outline" size={28} color={isDark ? '#fff' : '#b83280'} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{alignSelf:'center', backgroundColor: isDark ? '#b83280' : '#fff0f6', borderRadius: 16, paddingVertical: 10, paddingHorizontal: 28, marginBottom: 12, marginTop: 2, borderWidth: 1.5, borderColor: isDark ? '#fff' : '#b83280'}}
        onPress={() => setShowHistory(true)}
        activeOpacity={0.85}
      >
        <Text style={{color: isDark ? '#fff' : '#b83280', fontWeight:'bold', fontSize:16, letterSpacing:0.5}}>Geçmiş Adet Tarihleri</Text>
      </TouchableOpacity>
      <View style={styles.cardRow}>
        <View style={[styles.infoCard, {backgroundColor: isDark ? '#2d2233' : '#fff'}]}>
          <Text style={styles.cardLabel}>Son Adet</Text>
          <Text style={styles.cardValue}>{lastPeriod || '-'}</Text>
        </View>
        <View style={[styles.infoCard, {backgroundColor: isDark ? '#2d2233' : '#fff'}]}>
          <Text style={styles.cardLabel}>Sonraki Tahmini</Text>
          <Text style={styles.cardValue}>{nextPeriod ? formatDateTR(nextPeriod) : '-'}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.modernCalendarBtn, {backgroundColor: isDark ? '#b83280' : '#fff0f6', borderColor: isDark ? '#fff' : '#b83280'}]}
        onPress={() => setShowCalendar(v => !v)}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name="calendar-month" size={26} color={isDark ? '#fff' : '#b83280'} />
        <Text style={[styles.modernCalendarBtnText, {color: isDark ? '#fff' : '#b83280'}]}>Takvim</Text>
      </TouchableOpacity>
      <View style={[styles.calendarBox, {backgroundColor: isDark ? '#2d2233' : '#fff0f6'}]}>
        <Text style={[styles.sectionTitle, {color: isDark ? '#fff' : '#b83280'}]}>Takvimim</Text>
        <Text style={[styles.calendarText, {color: isDark ? '#fff' : '#b83280'}]}>
          {lastPeriod && `● Son: ${formatDateTR(periods[0].date)}`}
          {nextPeriod && `\n○ Sonraki: ${formatDateTR(nextPeriod)}`}
        </Text>
      </View>
      {showCalendar && (
        <View style={{marginVertical: 10, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
          <View style={{width: 340, maxWidth: '100%', alignItems: 'center', justifyContent: 'center'}}>
            <Calendar
              markingType={'period'}
              markedDates={markedDates}
              theme={{
                backgroundColor: isDark ? '#18121e' : '#fff',
                calendarBackground: isDark ? '#18121e' : '#fff',
                textSectionTitleColor: isDark ? '#fff' : '#b83280',
                selectedDayBackgroundColor: '#b83280',
                selectedDayTextColor: '#fff',
                todayTextColor: '#b83280',
                dayTextColor: isDark ? '#fff' : '#222',
                textDisabledColor: '#ccc',
                dotColor: '#b83280',
                arrowColor: '#b83280',
                monthTextColor: isDark ? '#fff' : '#b83280',
                indicatorColor: '#b83280',
              }}
              minDate={'2000-01-01'}
              maxDate={'2100-12-31'}
            />
          </View>
        </View>
      )}
    </>
  );

  return (
    <View style={[styles.container, {backgroundColor: isDark ? '#18121e' : '#f8f8ff', flex: 1}]}> 
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <FlatList
        data={periods}
        renderItem={renderPeriod}
        keyExtractor={(_, i) => i.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>Henüz kayıt yok.</Text>}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{paddingBottom: 40, alignItems: 'center'}}
      />
    </View>
  );
}

// Not/Semptom Ekleme
function NoteScreen() {
  return (
    <View style={styles.centered}><Text style={styles.screenTitle}>Günlük Not / Semptom Ekle</Text></View>
  );
}

// Profil
function ProfileScreen({ navigation }) {
  return (
    <View style={styles.centered}>
      <Text style={styles.screenTitle}>Profil</Text>
      <Button title="Çıkış Yap" color="#b83280" onPress={() => navigation.replace('Auth')} />
    </View>
  );
}

const Tab = createBottomTabNavigator();
function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{headerShown:false, tabBarActiveTintColor:'#b83280'}}>
      <Tab.Screen name="Takvim" component={CalendarScreen} />
      <Tab.Screen name="Not" component={NoteScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 60,
  },
  headerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    justifyContent: 'center',
    position: 'relative',
  },
  headerIcon: {
    fontSize: 32,
    marginRight: 10,
    color: '#b83280',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  infoCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 13,
    color: '#b83280',
    marginBottom: 2,
    fontWeight: 'bold',
  },
  cardValue: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
  },
  section: {
    width: '100%',
    marginTop: 18,
    marginBottom: 4,
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#b83280',
    marginBottom: 4,
    fontSize: 16,
  },
  periodCard: {
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
    alignItems: 'center',
    position: 'relative',
  },
  periodCardDate: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  periodCardDiff: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  emptyText: {
    color: '#aaa',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  calendarBox: {
    marginTop: 24,
    borderRadius: 8,
    padding: 14,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  calendarText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 4,
  },
  modernCalendarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 18,
    borderWidth: 1.5,
    paddingVertical: 10,
    paddingHorizontal: 28,
    marginBottom: 14,
    marginTop: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  modernCalendarBtnText: {
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  settingsIconBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 4,
  },
  centered: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#ffd0c5', padding:24 },
  onboardTitle: { fontSize:24, fontWeight:'bold', color:'#b83280', marginBottom:10, textAlign:'center' },
  onboardDescBox: {
    backgroundColor: '#ffe4f0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 18,
    minWidth: 220,
    maxWidth: 320,
    alignSelf: 'center',
  },
  onboardDesc: { fontSize:16, color:'#b83280', marginBottom:18, textAlign:'center' },
  loginTitle: { fontSize:28, fontWeight:'bold', color:'#b83280', marginBottom:24 },
  input: { backgroundColor:'#fff', borderRadius:8, borderWidth:1, borderColor:'#b83280', padding:10, marginBottom:12, fontSize:16, width:240 },
  loginBtn: { backgroundColor:'#b83280', borderRadius:8, paddingVertical:12, marginTop:8, alignItems:'center', width:240 },
  screenTitle: { fontSize:22, fontWeight:'bold', color:'#b83280', marginBottom:12 },
  onboardBtn: {
    backgroundColor: '#b83280',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 36,
    alignItems: 'center',
    marginTop: 8,
    minWidth: 120,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  onboardBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});

const moods = [
  { key: 'happy', label: 'Mutlu', icon: 'emoticon-happy-outline' },
  { key: 'sad', label: 'Üzgün', icon: 'emoticon-sad-outline' },
  { key: 'angry', label: 'Sinirli', icon: 'emoticon-angry-outline' },
  { key: 'tired', label: 'Yorgun', icon: 'emoticon-neutral-outline' },
];
const symptoms = [
  { key: 'cramp', label: 'Kramp', icon: 'weather-lightning' },
  { key: 'headache', label: 'Baş Ağrısı', icon: 'head-outline' },
  { key: 'nausea', label: 'Mide Bulantısı', icon: 'emoticon-sick-outline' },
  { key: 'discharge', label: 'Akıntı', icon: 'water-outline' },
];
