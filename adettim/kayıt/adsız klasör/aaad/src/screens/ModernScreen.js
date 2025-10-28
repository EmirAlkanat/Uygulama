import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ModernScreen = () => {
  const [inputText, setInputText] = useState('');

  const handlePrimaryButton = () => {
    Alert.alert('Success!', 'Primary button pressed');
  };

  const handleSecondaryButton = () => {
    Alert.alert('Info', 'Secondary button pressed');
  };

  const handleAccentButton = () => {
    Alert.alert('Action', 'Accent button pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Modern App</Text>
          <Text style={styles.subtitle}>Beautiful & Elegant Design</Text>
        </View>

        {/* Input Section */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter your message</Text>
          <TextInput
            style={styles.input}
            placeholder="Type something here..."
            placeholderTextColor="#B8A9C9"
            value={inputText}
            onChangeText={setInputText}
          />
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handlePrimaryButton}>
            <Text style={styles.primaryButtonText}>Primary Action</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleSecondaryButton}>
            <Text style={styles.secondaryButtonText}>Secondary Action</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.accentButton} onPress={handleAccentButton}>
            <Text style={styles.accentButtonText}>Accent Action</Text>
          </TouchableOpacity>
        </View>

        {/* Content Cards */}
        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Feature 1</Text>
            <Text style={styles.cardDescription}>
              This is a beautiful card with modern styling and elegant typography.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Feature 2</Text>
            <Text style={styles.cardDescription}>
              Another stunning card showcasing the design system with proper spacing.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Feature 3</Text>
            <Text style={styles.cardDescription}>
              The third card demonstrates consistency in design and user experience.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ using React Native</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A0B2E', // Dark purple background
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E6E6FA', // Light lavender
    opacity: 0.8,
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#2D1B4E', // Slightly lighter purple
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#4A2C7A',
  },
  buttonContainer: {
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#FF69B4', // Pink
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#FF69B4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#E6E6FA', // Lavender
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#E6E6FA',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryButtonText: {
    color: '#1A0B2E', // Dark purple for contrast
    fontSize: 16,
    fontWeight: '600',
  },
  accentButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF69B4', // Pink border
  },
  accentButtonText: {
    color: '#FF69B4', // Pink text
    fontSize: 16,
    fontWeight: '600',
  },
  cardsContainer: {
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#2D1B4E', // Slightly lighter purple
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#4A2C7A',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#E6E6FA', // Light lavender
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#B8A9C9', // Muted lavender
    opacity: 0.7,
  },
});

export default ModernScreen; 