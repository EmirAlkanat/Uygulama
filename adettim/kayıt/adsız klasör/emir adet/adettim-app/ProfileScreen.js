import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Animated,
  ScrollView,
  Alert,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  const [periodLength, setPeriodLength] = useState('');
  const [cycleLength, setCycleLength] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const scrollRef = useRef(null);

  useEffect(() => {
    loadUserData();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ y: 0, animated: false });
      }
    }, [])
  );

  const loadUserData = async () => {
    try {
      const savedPeriodLength = await AsyncStorage.getItem('PERIOD_LENGTH');
      const savedCycleLength = await AsyncStorage.getItem('CYCLE_LENGTH');
      const savedEmail = await AsyncStorage.getItem('USER_EMAIL');
      if (savedPeriodLength) setPeriodLength(savedPeriodLength);
      if (savedCycleLength) setCycleLength(savedCycleLength);
      if (savedEmail) setUserEmail(savedEmail);
    } catch (error) {
      console.log('Veri yüklenirken hata:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Çıkış Yap', 
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            navigation.replace('IntroForm');
          }
        }
      ]
    );
  };

  const handleResetData = () => {
    Alert.alert(
      'Verileri Sıfırla',
      'Tüm verileriniz silinecek. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Sıfırla', 
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            setPeriodLength('');
            setCycleLength('');
            Alert.alert('Başarılı', 'Verileriniz sıfırlandı.');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FFDEE9', '#B5FFFC']} style={styles.gradient}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
              
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.avatarContainer}>
                  <Image source={require('./assets/adetresim.png')} style={{ width: 60, height: 60, resizeMode: 'contain' }} />
                </View>
                <Text style={styles.userName}>Kullanıcı</Text>
                <Text style={styles.userEmail}>{userEmail || 'email@example.com'}</Text>
                <Text style={styles.userSubtitle}>Sağlıklı takip, mutlu günler</Text>
              </View>

              {/* Stats Cards */}
              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <LinearGradient colors={['#FF6B9D', '#FF8E9E']} style={styles.statIconContainer}>
                    <MaterialCommunityIcons name="water" size={24} color="#FFF" />
                  </LinearGradient>
                  <Text style={styles.statNumber}>{periodLength || '0'}</Text>
                  <Text style={styles.statLabel}>Adet Süresi (gün)</Text>
                </View>

                <View style={styles.statCard}>
                  <LinearGradient colors={['#4ECDC4', '#44A08D']} style={styles.statIconContainer}>
                    <MaterialCommunityIcons name="calendar-range" size={24} color="#FFF" />
                  </LinearGradient>
                  <Text style={styles.statNumber}>{cycleLength || '0'}</Text>
                  <Text style={styles.statLabel}>Döngü Uzunluğu (gün)</Text>
                </View>
              </View>

              {/* Menu Items */}
              <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('IntroForm')}>
                  <LinearGradient colors={['#667eea', '#764ba2']} style={styles.menuIconContainer}>
                    <Feather name="edit" size={20} color="#FFF" />
                  </LinearGradient>
                  <View style={styles.menuTextContainer}>
                    <Text style={styles.menuTitle}>Bilgileri Düzenle</Text>
                    <Text style={styles.menuSubtitle}>Adet ve döngü bilgilerinizi güncelleyin</Text>
                  </View>
                  <Feather name="chevron-right" size={20} color="#B83280" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={handleResetData}>
                  <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.menuIconContainer}>
                    <MaterialCommunityIcons name="refresh" size={20} color="#FFF" />
                  </LinearGradient>
                  <View style={styles.menuTextContainer}>
                    <Text style={styles.menuTitle}>Verileri Sıfırla</Text>
                    <Text style={styles.menuSubtitle}>Tüm verilerinizi silin</Text>
                  </View>
                  <Feather name="chevron-right" size={20} color="#B83280" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                  <LinearGradient colors={['#10B981', '#059669']} style={styles.menuIconContainer}>
                    <MaterialCommunityIcons name="shield-check" size={20} color="#FFF" />
                  </LinearGradient>
                  <View style={styles.menuTextContainer}>
                    <Text style={styles.menuTitle}>Gizlilik</Text>
                    <Text style={styles.menuSubtitle}>Verileriniz güvende</Text>
                  </View>
                  <Feather name="chevron-right" size={20} color="#B83280" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                  <LinearGradient colors={['#A78BFA', '#8B5CF6']} style={styles.menuIconContainer}>
                    <MaterialCommunityIcons name="help-circle" size={20} color="#FFF" />
                  </LinearGradient>
                  <View style={styles.menuTextContainer}>
                    <Text style={styles.menuTitle}>Yardım</Text>
                    <Text style={styles.menuSubtitle}>Nasıl kullanılır?</Text>
                  </View>
                  <Feather name="chevron-right" size={20} color="#B83280" />
                </TouchableOpacity>
              </View>

              {/* Logout Button */}
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.logoutGradient}>
                  <Ionicons name="log-out-outline" size={20} color="#FFF" />
                  <Text style={styles.logoutText}>Çıkış Yap</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* App Info */}
              <View style={styles.appInfo}>
                <Text style={styles.appVersion}>AdetTakvim v1.0.0</Text>
                <Text style={styles.appDescription}>Sağlıklı takip, mutlu günler <Image source={require('./assets/adetresim.png')} style={{ width: 18, height: 18, resizeMode: 'contain' }} /></Text>
              </View>

            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1, paddingTop: 48, paddingHorizontal: 18 },
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  avatar: {
    fontSize: 48,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B83280',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#B83280',
    opacity: 0.7,
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: 16,
    color: '#B83280',
    opacity: 0.8,
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 6,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  menuContainer: {
    marginBottom: 32,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  appVersion: {
    fontSize: 14,
    color: '#B83280',
    fontWeight: '600',
    marginBottom: 4,
  },
  appDescription: {
    fontSize: 12,
    color: '#B83280',
    opacity: 0.7,
  },
}); 