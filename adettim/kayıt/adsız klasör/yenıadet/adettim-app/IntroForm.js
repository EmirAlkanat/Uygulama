import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
  SafeAreaView,
  Dimensions,
  Animated,
  KeyboardAvoidingView,
  ScrollView,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function IntroForm({ navigation }) {
  const [periodLength, setPeriodLength] = useState('');
  const [cycleLength, setCycleLength] = useState('');
  const [error, setError] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSave = async () => {
    const period = parseInt(periodLength);
    const cycle = parseInt(cycleLength);
    if (
      isNaN(period) ||
      isNaN(cycle) ||
      period < 1 ||
      cycle < 15 ||
      cycle > 60
    ) {
      setError('Lütfen tüm alanları doğru bir şekilde doldurun.');
      return;
    }
    
    setError('');
    
    // Kişisel bilgileri kaydet
    await AsyncStorage.setItem('PERIOD_LENGTH', String(period));
    await AsyncStorage.setItem('CYCLE_LENGTH', String(cycle));
    
    if (navigation) {
      navigation.replace('MainTabs');
    }
  };

  return (
    <LinearGradient colors={['#FFDEE9', '#B5FFFC']} style={styles.bg}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }] }]}> 
              <View style={styles.emojiWrap}>
                <Image source={require('./assets/adetresim.png')} style={{ width: 60, height: 60, resizeMode: 'contain' }} />
              </View>
              <Text style={styles.title}>Kişisel Bilgileriniz</Text>
              <Text style={styles.desc}>Daha doğru takip için birkaç bilgiye ihtiyacımız var.</Text>
              
              <View style={styles.formCard}>
                {/* Period Length Input */}
                <View style={styles.inputWrap}>
                  <MaterialCommunityIcons name="water" size={22} color="#FF6B9D" style={{ marginRight: 8 }} />
                  <TextInput
                    keyboardType="numeric"
                    style={[styles.input, error && !periodLength ? styles.inputError : null]}
                    placeholder="Adet süresi (kaç gün sürdü?)"
                    placeholderTextColor="#B83280"
                    value={periodLength}
                    onChangeText={setPeriodLength}
                    maxLength={2}
                  />
                </View>

                {/* Cycle Length Input */}
                <View style={styles.inputWrap}>
                  <MaterialCommunityIcons name="calendar-range" size={22} color="#4ECDC4" style={{ marginRight: 8 }} />
                  <TextInput
                    keyboardType="numeric"
                    style={[styles.input, error && !cycleLength ? styles.inputError : null]}
                    placeholder="Aylık döngü uzunluğu (gün)"
                    placeholderTextColor="#1976d2"
                    value={cycleLength}
                    onChangeText={setCycleLength}
                    maxLength={2}
                  />
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}
                
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <LinearGradient colors={['#FF6B9D', '#FF8E9E']} style={styles.saveButtonGradient}>
                    <Text style={styles.saveButtonText}>Kaydet ve Başla</Text>
                  </LinearGradient>
                </TouchableOpacity>
                  
                <Text style={styles.privacy}>
                  Verilerin gizli tutulur ve asla paylaşılmaz. <Feather name="lock" size={16} color="#B83280" />
                </Text>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emojiWrap: {
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 40,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#B83280',
    marginBottom: 8,
    textAlign: 'center',
  },
  desc: {
    fontSize: 16,
    color: '#B83280',
    marginBottom: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 28,
    width: width * 0.92,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 8,
    alignItems: 'center',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FF',
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: '#F3E8FF',
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#333',
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  inputError: {
    borderColor: '#FF6B9D',
  },
  saveButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 8,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  saveButtonGradient: {
    padding: 18,
    alignItems: 'center',
    borderRadius: 16,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  error: {
    color: '#FF6B9D',
    fontSize: 15,
    marginBottom: 8,
    textAlign: 'center',
  },
  privacy: {
    marginTop: 10,
    color: '#B83280',
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.7,
  },
});
