import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Switch, Alert, ImageBackground } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';

const REMINDER_TYPES = [
  { key: 'pill', label: 'İlaç Kontrolü', icon: <Ionicons name="add-circle-outline" size={24} color="#A78BFA" /> },
  { key: 'doctor', label: 'Doktor randevusu', icon: <MaterialCommunityIcons name="calendar-plus" size={24} color="#A78BFA" /> },
  { key: 'ovulation', label: 'Yumurtlama hatırlatıcı', icon: <MaterialCommunityIcons name="egg-easter" size={24} color="#A78BFA" /> },
];

export default function RemindersScreen() {
  const [reminders, setReminders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('pill');
  const [modalTime, setModalTime] = useState('');
  const [modalDesc, setModalDesc] = useState('');
  const [modalActive, setModalActive] = useState(true);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('REMINDERS');
      if (saved) setReminders(JSON.parse(saved));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('REMINDERS', JSON.stringify(reminders));
  }, [reminders]);

  const openModal = (type, index = null) => {
    setModalType(type);
    if (index !== null) {
      const r = reminders[index];
      setModalTime(r.time);
      setModalDesc(r.description);
      setModalActive(r.active);
      setEditIndex(index);
    } else {
      setModalTime('');
      setModalDesc('');
      setModalActive(true);
      setEditIndex(null);
    }
    setModalVisible(true);
  };

  const saveReminder = () => {
    if (!modalTime.trim()) {
      Alert.alert('Hata', 'Saat giriniz.');
      return;
    }
    const newReminder = {
      type: modalType,
      time: modalTime,
      description: modalDesc,
      active: modalActive,
    };
    let updated;
    if (editIndex !== null) {
      updated = reminders.map((r, i) => (i === editIndex ? newReminder : r));
    } else {
      updated = [...reminders, newReminder];
    }
    setReminders(updated);
    setModalVisible(false);
    setModalTime('');
    setModalDesc('');
    setModalActive(true);
    setEditIndex(null);
  };

  const deleteReminder = (index) => {
    Alert.alert('Sil', 'Hatırlatıcı silinsin mi?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => {
        setReminders(reminders.filter((_, i) => i !== index));
      }}
    ]);
  };

  const toggleActive = (index) => {
    setReminders(reminders.map((r, i) => i === index ? { ...r, active: !r.active } : r));
  };

  const renderReminders = (type) => reminders
    .map((r, i) => ({ ...r, index: i }))
    .filter(r => r.type === type)
    .map(r => (
      <View key={r.index} style={r.active ? styles.cardRow : styles.cardRowDisabled}>
        <TouchableOpacity onPress={() => openModal(type, r.index)} style={{flex:1}}>
          <Text style={r.active ? styles.cardTitle : styles.cardTitleDisabled}>{r.description || REMINDER_TYPES.find(t=>t.key===type).label}</Text>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text style={{color:'#A78BFA',fontSize:13,marginRight:8}}>{r.time}</Text>
            {r.date && (
              <Text style={{color:'#B83280',fontSize:12}}>{r.date}</Text>
            )}
          </View>
        </TouchableOpacity>
        <Switch value={r.active} onValueChange={() => toggleActive(r.index)} />
        <TouchableOpacity onPress={() => deleteReminder(r.index)} style={{marginLeft:8}}>
          <Ionicons name="trash" size={20} color="#FF6B9D" />
        </TouchableOpacity>
      </View>
    ));

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('./assets/adettim.png')}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        imageStyle={{ resizeMode: 'cover', opacity: 0.18 }}
      >
        <BlurView intensity={60} style={{ flex: 1, width: '100%', height: '100%' }} />
      </ImageBackground>
      <LinearGradient colors={['#232046', '#3B2B5A']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{paddingBottom: 40}} showsVerticalScrollIndicator={false}>
          {/* Başlık */}
          <Text style={{ color: '#A78BFA',
           fontSize: 44, 
           fontWeight: 'bold',
           textAlign: 'center', 
           marginTop: 120, marginBottom: 8, letterSpacing: 1.5, textShadowColor: '#fff', textShadowOffset: { width: 0, height: 2 }, 
          textShadowRadius: 8 }}>Hatırlatmalar</Text>
          {/* Her tür için kart ve + butonu */}
          {REMINDER_TYPES.map(type => (
            <View key={type.key}>
              <Text style={styles.sectionTitle}>{type.label}</Text>
              <View style={styles.card}>
                {renderReminders(type.key)}
                <TouchableOpacity onPress={() => openModal(type.key)} style={{alignSelf:'flex-end',marginTop:8}}>
                  {type.icon}
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </LinearGradient>
      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={()=>setModalVisible(false)}>
        <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.4)',justifyContent:'center',alignItems:'center'}}>
          <View style={{backgroundColor:'#fff',borderRadius:18,padding:24,width:'85%'}}>
            <Text style={{fontWeight:'bold',fontSize:18,marginBottom:12,color:'#A78BFA'}}>Hatırlatıcı {editIndex!==null?'Düzenle':'Ekle'}</Text>
            {editIndex !== null && reminders[editIndex] && reminders[editIndex].date && (
              <View style={{marginBottom:8}}>
                <Text style={{color:'#B83280',marginBottom:2,fontSize:13}}>Tarih</Text>
                <Text style={{color:'#232046',fontSize:15}}>{reminders[editIndex].date}</Text>
              </View>
            )}
            <Text style={{color:'#B83280',marginBottom:4}}>Saat</Text>
            <TextInput
              placeholder="Örn: 08:00"
              value={modalTime}
              onChangeText={setModalTime}
              style={{borderWidth:1,borderColor:'#A78BFA',borderRadius:10,padding:10,marginBottom:12}}
            />
            <Text style={{color:'#B83280',marginBottom:4}}>Açıklama</Text>
            <TextInput
              placeholder="Açıklama (isteğe bağlı)"
              value={modalDesc}
              onChangeText={setModalDesc}
              style={{borderWidth:1,borderColor:'#A78BFA',borderRadius:10,padding:10,marginBottom:12}}
            />
            <View style={{flexDirection:'row',alignItems:'center',marginBottom:12}}>
              <Text style={{color:'#B83280',marginRight:8}}>Aktif</Text>
              <Switch value={modalActive} onValueChange={setModalActive} />
            </View>
            <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
              <TouchableOpacity onPress={()=>setModalVisible(false)} style={{marginRight:12}}><Text style={{color:'#B83280'}}>İptal</Text></TouchableOpacity>
              <TouchableOpacity onPress={saveReminder}><Text style={{color:'#4ECDC4',fontWeight:'bold'}}>Kaydet</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1, paddingTop: 48, paddingHorizontal: 18 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  headerTitle: { 
    color: '#fff', 
    fontSize: 28, fontWeight: 'bold', letterSpacing: 0.5 },
  headerDate: {
    color: '#A78BFA',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  sectionTitle: {
    color: '#A78BFA',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 28,
    marginBottom: 12,
    letterSpacing: 0.5,
    textAlign: 'left'
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#B83280',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  cardTitle: { color: '#232046', fontSize: 15, fontWeight: 'bold', flex: 1 },
  cardTime: { color: '#A78BFA', fontSize: 15, fontWeight: '600', marginHorizontal: 8 },
  cardStatus: { color: '#A78BFA', fontSize: 15, fontWeight: 'bold' },
  cardRowDisabled: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, opacity: 0.5 },
  cardTitleDisabled: { color: '#232046', fontSize: 16, fontWeight: 'bold', flex: 1 },
  cardStatusDisabled: { color: '#A78BFA', fontSize: 15, fontWeight: 'bold' },
}); 