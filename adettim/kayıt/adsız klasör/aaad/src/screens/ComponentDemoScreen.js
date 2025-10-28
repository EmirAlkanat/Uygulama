import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';

const ComponentDemoScreen = () => {
  const [buttonCount, setButtonCount] = useState(0);

  const handleButtonPress = (buttonType) => {
    setButtonCount(prev => prev + 1);
    Alert.alert('Button Pressed', `${buttonType} button was pressed! Count: ${buttonCount + 1}`);
  };

  const handleDisabledPress = () => {
    Alert.alert('Disabled', 'This button is disabled and should not be pressable.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Custom Button Component</Text>
          <Text style={styles.subtitle}>A reusable React Native component with Expo</Text>
        </View>

        {/* Button Count Display */}
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>Buttons Pressed: {buttonCount}</Text>
        </View>

        {/* Size Variants */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Size Variants</Text>
          
          <CustomButton
            title="Small Button"
            onPress={() => handleButtonPress('Small')}
            size="small"
            style={styles.buttonSpacing}
          />
          
          <CustomButton
            title="Medium Button (Default)"
            onPress={() => handleButtonPress('Medium')}
            size="medium"
            style={styles.buttonSpacing}
          />
          
          <CustomButton
            title="Large Button"
            onPress={() => handleButtonPress('Large')}
            size="large"
            style={styles.buttonSpacing}
          />
        </View>

        {/* Color Variants */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Color Variants</Text>
          
          <CustomButton
            title="Primary (Pink)"
            onPress={() => handleButtonPress('Primary')}
            variant="primary"
            style={styles.buttonSpacing}
          />
          
          <CustomButton
            title="Secondary (Purple)"
            onPress={() => handleButtonPress('Secondary')}
            variant="secondary"
            style={styles.buttonSpacing}
          />
          
          <CustomButton
            title="Outline (Pink Border)"
            onPress={() => handleButtonPress('Outline')}
            variant="outline"
            style={styles.buttonSpacing}
          />
        </View>

        {/* With Icons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>With Icons</Text>
          
          <CustomButton
            title="Add Item"
            onPress={() => handleButtonPress('Add')}
            icon={<Text style={styles.icon}>➕</Text>}
            style={styles.buttonSpacing}
          />
          
          <CustomButton
            title="Settings"
            onPress={() => handleButtonPress('Settings')}
            icon={<Text style={styles.icon}>⚙️</Text>}
            variant="secondary"
            style={styles.buttonSpacing}
          />
          
          <CustomButton
            title="Save"
            onPress={() => handleButtonPress('Save')}
            icon={<Text style={styles.icon}>💾</Text>}
            variant="outline"
            style={styles.buttonSpacing}
          />
        </View>

        {/* Disabled State */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disabled State</Text>
          
          <CustomButton
            title="Disabled Button"
            onPress={handleDisabledPress}
            disabled={true}
            style={styles.buttonSpacing}
          />
          
          <CustomButton
            title="Disabled Outline"
            onPress={handleDisabledPress}
            variant="outline"
            disabled={true}
            style={styles.buttonSpacing}
          />
        </View>

        {/* Custom Styling */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Custom Styling</Text>
          
          <CustomButton
            title="Custom Style"
            onPress={() => handleButtonPress('Custom')}
            style={[styles.buttonSpacing, { backgroundColor: '#FF6B35' }]}
            textStyle={{ fontStyle: 'italic' }}
          />
          
          <CustomButton
            title="Rounded Corners"
            onPress={() => handleButtonPress('Rounded')}
            style={[styles.buttonSpacing, { borderRadius: 25 }]}
            variant="outline"
          />
        </View>

        {/* Usage Examples */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Usage Examples</Text>
          
          <View style={styles.exampleContainer}>
            <Text style={styles.exampleTitle}>Basic Usage:</Text>
            <Text style={styles.codeText}>
              {`<CustomButton
  title="Click Me"
  onPress={() => console.log('Pressed!')}
/>`}
            </Text>
          </View>
          
          <View style={styles.exampleContainer}>
            <Text style={styles.exampleTitle}>With Variants:</Text>
            <Text style={styles.codeText}>
              {`<CustomButton
  title="Secondary"
  variant="secondary"
  size="large"
  onPress={handlePress}
/>`}
            </Text>
          </View>
          
          <View style={styles.exampleContainer}>
            <Text style={styles.exampleTitle}>With Icon:</Text>
            <Text style={styles.codeText}>
              {`<CustomButton
  title="Save"
  icon={<Text>💾</Text>}
  variant="outline"
  onPress={handleSave}
/>`}
            </Text>
          </View>
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
    marginBottom: 30,
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E6E6FA',
    opacity: 0.8,
    textAlign: 'center',
  },
  counterContainer: {
    backgroundColor: '#2D1B4E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A2C7A',
  },
  counterText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF69B4',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  buttonSpacing: {
    marginBottom: 12,
  },
  icon: {
    fontSize: 18,
  },
  exampleContainer: {
    backgroundColor: '#2D1B4E',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#4A2C7A',
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF69B4',
    marginBottom: 8,
  },
  codeText: {
    fontSize: 12,
    color: '#E6E6FA',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});

export default ComponentDemoScreen; 