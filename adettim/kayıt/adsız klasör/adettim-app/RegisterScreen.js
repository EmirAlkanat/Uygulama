import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Dimensions,
  Animated,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (!email || !validateEmail(email)) {
      setError('Lütfen geçerli bir email adresi girin.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    try {
      // Email'in daha önce kullanılıp kullanılmadığını kontrol et
      const existingEmail = await AsyncStorage.getItem('USER_EMAIL');
      if (existingEmail === email) {
        setError('Bu email adresi zaten kullanılıyor.');
        return;
      }

      // Kullanıcı bilgilerini kaydet
      await AsyncStorage.setItem('USER_EMAIL', email);
      await AsyncStorage.setItem('USER_PASSWORD', password);

      Alert.alert(
        'Hoş Geldin!',
        'Kayıt işlemin tamamlandı. Şimdi kendine özel döngü takibini başlatmak için birkaç bilgi girmen yeterli!',
        [
          {
            text: 'Devam Et',
            onPress: () => navigation.replace('IntroForm')
          }
        ]
      );
    } catch (error) {
      setError('Kayıt olurken bir hata oluştu.');
    }
  };

  return (
    <LinearGradient colors={['#FFDEE9', '#B5FFFC']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
              
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.logoContainer}>
                  <Image source={require('./assets/adetresim.png')} style={{ width: 60, height: 60, resizeMode: 'contain' }} />
                </View>
                <Text style={styles.title}>Hesap Oluştur</Text>
                <Text style={styles.subtitle}>Kişisel döngü takibine başlayın</Text>
              </View>

              {/* Form */}
              <View style={styles.formCard}>
                {/* Email Input */}
                <View style={styles.inputWrap}>
                  <Ionicons name="mail-outline" size={22} color="#FF6B9D" style={{ marginRight: 8 }} />
                  <TextInput
                    keyboardType="email-address"
                    style={[styles.input, error && !email ? styles.inputError : null]}
                    placeholder="Email adresiniz"
                    placeholderTextColor="#B83280"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setError('');
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {/* Password Input */}
                <View style={styles.inputWrap}>
                  <Ionicons name="lock-closed-outline" size={22} color="#4ECDC4" style={{ marginRight: 8 }} />
                  <TextInput
                    secureTextEntry={!showPassword}
                    style={[styles.input, error && !password ? styles.inputError : null]}
                    placeholder="Şifreniz (en az 6 karakter)"
                    placeholderTextColor="#1976d2"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setError('');
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons 
                      name={showPassword ? "eye-off-outline" : "eye-outline"} 
                      size={22} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                </View>

                {/* Confirm Password Input */}
                <View style={styles.inputWrap}>
                  <Ionicons name="lock-closed-outline" size={22} color="#4ECDC4" style={{ marginRight: 8 }} />
                  <TextInput
                    secureTextEntry={!showConfirmPassword}
                    style={[styles.input, error && !confirmPassword ? styles.inputError : null]}
                    placeholder="Şifrenizi tekrar girin"
                    placeholderTextColor="#1976d2"
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      setError('');
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons 
                      name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                      size={22} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                {/* Register Button */}
                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                  <LinearGradient colors={['#FF6B9D', '#FF8E9E']} style={styles.registerGradient}>
                    <Text style={styles.registerText}>Hesap Oluştur</Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>veya</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Login Button */}
                <TouchableOpacity 
                  style={styles.loginButton} 
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.loginText}>Zaten hesabım var</Text>
                </TouchableOpacity>

                {/* Privacy */}
                <Text style={styles.privacy}>
                  Hesap oluşturarak <Text style={styles.link}>Kullanım Şartları</Text> ve{' '}
                  <Text style={styles.link}>Gizlilik Politikası</Text>'nı kabul etmiş olursunuz.
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
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  logo: {
    fontSize: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#B83280',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#B83280',
    opacity: 0.8,
  },
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FF',
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#F3E8FF',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 14,
    backgroundColor: 'transparent',
  },
  inputError: {
    borderColor: '#FF6B9D',
  },
  error: {
    color: '#FF6B9D',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  registerButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  registerGradient: {
    padding: 16,
    alignItems: 'center',
  },
  registerText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FF6B9D',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: '#FF6B9D',
    fontSize: 16,
    fontWeight: '600',
  },
  privacy: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: '#FF6B9D',
    textDecorationLine: 'underline',
  },
});
