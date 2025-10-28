import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const CalendarGridScreen = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState('tem'); // 'tem' or 'yil'
  const [currentTab, setCurrentTab] = useState('takvim'); // 'bugun', 'takvim', 'hatirlatmalar', 'benimki'

  // Turkish day initials (Monday to Sunday)
  const dayInitials = ['P', 'S', 'Ç', 'P', 'C', 'C', 'P'];

  // Turkish month abbreviations
  const monthAbbreviations = [
    'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
    'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'
  ];

  // Turkish month names
  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  // Get current month data
  const getMonthData = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    
    // Adjust to start from Monday (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = firstDay.getDay();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert Sunday=0 to Sunday=6
    startDate.setDate(startDate.getDate() - mondayOffset);
    
    const days = [];
    const currentDate = new Date(startDate);
    
    // Generate 6 weeks of dates (42 days) to ensure full month display
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const monthData = getMonthData(currentMonth);

  const handleDatePress = (date) => {
    setSelectedDate(date);
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const getMonthAbbreviation = (monthIndex) => {
    return monthAbbreviations[monthIndex];
  };

  // Get year data for year view
  const getYearData = () => {
    const year = currentMonth.getFullYear();
    const months = [];
    
    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(year, month, 1);
      months.push({
        month: month,
        name: monthNames[month],
        abbreviation: monthAbbreviations[month],
        date: monthDate
      });
    }
    
    return months;
  };

  const handleAddPress = () => {
    Alert.alert('Ekle', 'Yeni kayıt ekleme menüsü açılacak');
  };

  const handleSettingsPress = () => {
    Alert.alert('Ayarlar', 'Ayarlar menüsü açılacak');
  };

  const handleHistoryPress = () => {
    Alert.alert('Geçmiş', 'Geçmiş kayıtları açılacak');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Icons */}
      <View style={styles.topIconsContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={handleSettingsPress}>
          <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.topIconsCenter} />
        
        <TouchableOpacity style={styles.iconButton} onPress={handleHistoryPress}>
          <Ionicons name="time-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Takvim</Text>
          <Text style={styles.subtitle}>Aylık görünüm</Text>
        </View>

        {/* View Mode Toggle */}
        <View style={styles.viewToggleContainer}>
          <TouchableOpacity 
            style={[styles.viewToggleTab, viewMode === 'tem' && styles.activeViewTab]} 
            onPress={() => setViewMode('tem')}
          >
            <Text style={[styles.viewToggleText, viewMode === 'tem' && styles.activeViewText]}>
              Tem
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.viewToggleTab, viewMode === 'yil' && styles.activeViewTab]} 
            onPress={() => setViewMode('yil')}
          >
            <Text style={[styles.viewToggleText, viewMode === 'yil' && styles.activeViewText]}>
              Yıl
            </Text>
          </TouchableOpacity>
        </View>

        {/* Month Navigation */}
        <View style={styles.monthNavigation}>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => navigateMonth('prev')}
          >
            <Text style={styles.navButtonText}>‹</Text>
          </TouchableOpacity>
          
          <Text style={styles.monthText}>
            {viewMode === 'tem' 
              ? `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`
              : `${currentMonth.getFullYear()}`
            }
          </Text>
          
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => navigateMonth('next')}
          >
            <Text style={styles.navButtonText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar Content */}
        {viewMode === 'tem' ? (
          <>
            {/* Day Initials Row */}
            <View style={styles.dayInitialsRow}>
              {dayInitials.map((initial, index) => (
                <View key={index} style={styles.dayInitialContainer}>
                  <Text style={styles.dayInitial}>{initial}</Text>
                </View>
              ))}
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
              {monthData.map((date, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.calendarDay,
                    isSelected(date) && styles.selectedDay,
                    isToday(date) && styles.today,
                    !isCurrentMonth(date) && styles.otherMonth,
                  ]}
                  onPress={() => handleDatePress(date)}
                >
                  <Text style={[
                    styles.dayText,
                    isSelected(date) && styles.selectedDayText,
                    isToday(date) && styles.todayText,
                    !isCurrentMonth(date) && styles.otherMonthText,
                  ]}>
                    {date.getDate()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          /* Year View */
          <View style={styles.yearGrid}>
            {getYearData().map((monthData, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.yearMonth,
                  monthData.month === currentMonth.getMonth() && styles.currentYearMonth,
                ]}
                onPress={() => {
                  setCurrentMonth(monthData.date);
                  setViewMode('tem');
                }}
              >
                <Text style={[
                  styles.yearMonthText,
                  monthData.month === currentMonth.getMonth() && styles.currentYearMonthText,
                ]}>
                  {monthData.abbreviation}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Selected Date Display */}
        {selectedDate && (
          <View style={styles.selectedDateContainer}>
            <Text style={styles.selectedDateText}>
              {selectedDate.getDate()} {getMonthAbbreviation(selectedDate.getMonth())}
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={styles.pinkButton} 
            onPress={() => Alert.alert('Regli Düzenle', 'Regli düzenleme özelliği açılacak')}
          >
            <Text style={styles.pinkButtonText}>REGLİ DÜZENLE</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.lavenderButton} 
            onPress={() => Alert.alert('Not Ekle', 'Not ekleme özelliği açılacak')}
          >
            <Text style={styles.lavenderButtonText}>NOT EKLE</Text>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Takvim Kullanımı</Text>
          <Text style={styles.infoText}>
            Bir tarihe dokunarak seçebilirsiniz. Seçilen tarih lavanta rengi ile vurgulanacaktır.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.bottomTabContainer}>
        {/* Add Button - Centered above the bar */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        
        {/* Tab Items */}
        <View style={styles.tabBar}>
          <TouchableOpacity 
            style={[styles.tabItem, currentTab === 'bugun' && styles.activeTabItem]} 
            onPress={() => setCurrentTab('bugun')}
          >
            <Text style={[styles.tabText, currentTab === 'bugun' && styles.activeTabText]}>
              Bugün
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabItem, currentTab === 'takvim' && styles.activeTabItem]} 
            onPress={() => setCurrentTab('takvim')}
          >
            <Text style={[styles.tabText, currentTab === 'takvim' && styles.activeTabText]}>
              Takvim
            </Text>
          </TouchableOpacity>
          
          {/* Empty space for the + button */}
          <View style={styles.centerSpace} />
          
          <TouchableOpacity 
            style={[styles.tabItem, currentTab === 'hatirlatmalar' && styles.activeTabItem]} 
            onPress={() => setCurrentTab('hatirlatmalar')}
          >
            <Text style={[styles.tabText, currentTab === 'hatirlatmalar' && styles.activeTabText]}>
              Hatırlatmalar
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabItem, currentTab === 'benimki' && styles.activeTabItem]} 
            onPress={() => setCurrentTab('benimki')}
          >
            <Text style={[styles.tabText, currentTab === 'benimki' && styles.activeTabText]}>
              Benimki
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A0B2E', // Dark purple background
  },
  topIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#4A2C7A',
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#2D1B4E',
    borderWidth: 1,
    borderColor: '#4A2C7A',
  },
  topIconsCenter: {
    flex: 1,
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E6E6FA', // Light purple text
    opacity: 0.8,
  },
  viewToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#2D1B4E',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4A2C7A',
  },
  viewToggleTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeViewTab: {
    backgroundColor: '#E6E6FA', // Lavender background for active tab
  },
  viewToggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#E6E6FA', // Light purple
  },
  activeViewText: {
    color: '#1A0B2E', // Dark purple text on lavender background
    fontWeight: '600',
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  navButton: {
    backgroundColor: '#2D1B4E', // Slightly lighter purple
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A2C7A',
  },
  navButtonText: {
    color: '#FF69B4', // Pink for navigation buttons
    fontSize: 20,
    fontWeight: 'bold',
  },
  monthText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF', // White text
  },
  dayInitialsRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  dayInitialContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  dayInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E6E6FA', // Light purple text
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#2D1B4E', // Slightly lighter purple
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#4A2C7A',
  },
  calendarDay: {
    width: '14.28%', // 7 days per week
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 1,
  },
  selectedDay: {
    backgroundColor: '#E6E6FA', // Lavender background for selected day
  },
  today: {
    borderWidth: 2,
    borderColor: '#FF69B4', // Pink border for today
  },
  otherMonth: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF', // White text
  },
  selectedDayText: {
    color: '#1A0B2E', // Dark purple text on lavender background
    fontWeight: 'bold',
  },
  todayText: {
    color: '#FF69B4', // Pink text for today
    fontWeight: 'bold',
  },
  otherMonthText: {
    color: '#B8A9C9', // Muted light purple for other month days
  },
  selectedDateContainer: {
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 25,
    paddingVertical: 20,
    backgroundColor: '#2D1B4E', // Slightly lighter purple
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4A2C7A',
  },
  actionButtonsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  pinkButton: {
    backgroundColor: '#FF69B4', // Pink background
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
  pinkButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  lavenderButton: {
    backgroundColor: '#E6E6FA', // Lavender background
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#E6E6FA',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  lavenderButtonText: {
    color: '#1A0B2E', // Dark purple text on lavender background
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  selectedDateText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
    letterSpacing: 1,
  },
  infoContainer: {
    backgroundColor: '#2D1B4E', // Slightly lighter purple
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#4A2C7A',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#E6E6FA', // Light purple text
    lineHeight: 20,
  },
  yearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#2D1B4E',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#4A2C7A',
  },
  yearMonth: {
    width: '33.33%', // 3 months per row
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 1,
    backgroundColor: '#1A0B2E',
  },
  currentYearMonth: {
    backgroundColor: '#E6E6FA', // Lavender background for current month
  },
  yearMonthText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  currentYearMonthText: {
    color: '#1A0B2E', // Dark purple text on lavender background
    fontWeight: '600',
  },
  bottomTabContainer: {
    position: 'relative',
  },
  addButton: {
    position: 'absolute',
    top: -30,
    left: '50%',
    marginLeft: -35,
    width: 70,
    height: 70,
    backgroundColor: '#FF69B4', // Pink background
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF69B4',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    zIndex: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#2D1B4E',
    borderTopWidth: 1,
    borderTopColor: '#4A2C7A',
    paddingTop: 25, // Space for the + button
    paddingBottom: 15,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  centerSpace: {
    flex: 1, // Takes up the space where the + button would be
  },
  activeTabItem: {
    // Active state styling
  },
  tabText: {
    color: '#E6E6FA', // Light lavender
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#FF69B4', // Pink for active items
    fontWeight: '600',
  },
});

export default CalendarGridScreen; 