import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

export default function RemindersScreen() {
  const scrollRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ y: 0, animated: false });
      }
    }, [])
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FFDEE9', '#B5FFFC']} style={styles.gradient}>
        <View style={styles.headerRow}>
          <Ionicons name="notifications" size={32} color="#A78BFA" style={{ marginRight: 10 }} />
          <Text style={styles.headerTitle}>Hatırlatmalar</Text>
        </View>
        <ScrollView ref={scrollRef} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Regl & doğurganlık</Text>
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.cardTitle}>Regl başlangıcı</Text>
              <Text style={styles.cardTime}>12:00</Text>
              <Text style={styles.cardStatus}>AÇIK</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.cardTitle}>Regl bitişi</Text>
              <Text style={styles.cardTime}>20:00</Text>
              <Text style={styles.cardStatus}>AÇIK</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.cardTitle}>Regl girdisi</Text>
              <Text style={styles.cardTime}>12:00</Text>
              <Text style={styles.cardStatus}>AÇIK</Text>
            </View>
            <View style={styles.cardRowDisabled}>
              <Text style={styles.cardTitleDisabled}>Doğurganlık zamanı yaklaşıyor</Text>
              <Text style={styles.cardStatusDisabled}>KAPALI</Text>
            </View>
            <View style={styles.cardRowDisabled}>
              <Text style={styles.cardTitleDisabled}>Yumurtlama hatırlatıcı</Text>
              <Text style={styles.cardStatusDisabled}>KAPALI</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>İlaç</Text>
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.cardTitle}>Hap(d. kontrol) hatırlatıcı</Text>
              <TouchableOpacity>
                <Ionicons name="add-circle-outline" size={24} color="#A78BFA" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Randevu</Text>
          <View style={styles.card}>
            <View style={styles.cardRowDisabled}>
              <Text style={styles.cardTitleDisabled}>Doktor randevusu</Text>
              <Text style={styles.cardStatusDisabled}>KAPALI</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Yaşam tarzı</Text>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1, paddingTop: 48, paddingHorizontal: 18 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  headerTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold', letterSpacing: 0.5 },
  sectionTitle: { color: '#A78BFA', fontSize: 16, fontWeight: 'bold', marginTop: 18, marginBottom: 8 },
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
  cardTitle: { color: '#232046', fontSize: 17, fontWeight: 'bold', flex: 1 },
  cardTime: { color: '#A78BFA', fontSize: 15, fontWeight: '600', marginHorizontal: 8 },
  cardStatus: { color: '#A78BFA', fontSize: 15, fontWeight: 'bold' },
  cardRowDisabled: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, opacity: 0.5 },
  cardTitleDisabled: { color: '#232046', fontSize: 16, fontWeight: 'bold', flex: 1 },
  cardStatusDisabled: { color: '#A78BFA', fontSize: 15, fontWeight: 'bold' },
}); 