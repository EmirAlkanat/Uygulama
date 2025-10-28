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

// Icon components
const GearIcon = ({ onPress, style }) => (
  <TouchableOpacity onPress={onPress} style={style}>
    <Text style={{ color: '#FFFFFF', fontSize: 24 }}>⚙️</Text>
  </TouchableOpacity>
);

const ClockIcon = ({ onPress, style }) => (
  <TouchableOpacity onPress={onPress} style={style}>
    <Text style={{ color: '#FFFFFF', fontSize: 24 }}>🕐</Text>
  </TouchableOpacity>
);

const PeriodTrackerScreen = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'year'
  const [currentScreen, setCurrentScreen] = useState('bugun'); // 'bugun', 'takvim', 'hatirlatmalar', 'benimki'

  // Day initials for period tracking
  const dayInitials = ['P', 'S', 'Ç', 'P', 'C', 'C', 'P'];

  // Turkish month names and abbreviations
  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const monthAbbreviations = [
    'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
    'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'
  ];

  // Get current month data
  const getMonthData = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    // Generate 6 weeks of dates (42 days)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
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

  const handleGearPress = () => {
    Alert.alert('Ayarlar', 'Ayarlar menüsü açılacak');
  };

  const handleClockPress = () => {
    Alert.alert('Geçmiş', 'Geçmiş kayıtları açılacak');
  };

  const handleAddPress = () => {
    Alert.alert('Ekle', 'Yeni kayıt ekleme menüsü açılacak');
  };

  const handlePeriodEdit = () => {
    Alert.alert('Regli Düzenle', 'Regli düzenleme özelliği açılacak');
  };

  const handleAddNote = () => {
    Alert.alert('Not Ekle', 'Not ekleme özelliği açılacak');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'takvim':
        return (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* View Mode Toggle */}
            <View style={styles.viewToggleContainer}>
              <TouchableOpacity 
                style={[styles.viewToggleTab, viewMode === 'month' && styles.activeViewTab]} 
                onPress={() => setViewMode('month')}
              >
                <Text style={[styles.viewToggleText, viewMode === 'month' && styles.activeViewText]}>
                  Ay
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.viewToggleTab, viewMode === 'year' && styles.activeViewTab]} 
                onPress={() => setViewMode('year')}
              >
                <Text style={[styles.viewToggleText, viewMode === 'year' && styles.activeViewText]}>
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
                {viewMode === 'month' 
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
            {viewMode === 'month' ? (
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
                      setViewMode('month');
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

            {/* Selected Date Display - Large Format */}
            {selectedDate && (
              <View style={styles.largeDateContainer}>
                <Text style={styles.largeDateText}>
                  {selectedDate.getDate()} {getMonthAbbreviation(selectedDate.getMonth())}
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity style={styles.pinkButton} onPress={handlePeriodEdit}>
                <Text style={styles.pinkButtonText}>REGLİ DÜZENLE</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.purpleButton} onPress={handleAddNote}>
                <Text style={styles.purpleButtonText}>NOT EKLE</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        );
      case 'bugun':
      case 'hatirlatmalar':
      case 'benimki':
      default:
        return (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>{currentScreen.toUpperCase()} Ekranı</Text>
            <Text style={styles.placeholderSubtext}>Bu özellik yakında eklenecek</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <GearIcon onPress={handleGearPress} style={styles.headerIcon} />
        <View style={styles.headerCenter} />
        <ClockIcon onPress={handleClockPress} style={styles.headerIcon} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavContainer}>
        {/* Add Button - Centered above the bar */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        
        {/* Navigation Items */}
        <View style={styles.navBar}>
          <TouchableOpacity 
            style={[styles.navItem, currentScreen === 'bugun' && styles.activeNavItem]} 
            onPress={() => setCurrentScreen('bugun')}
          >
            <Text style={[styles.navText, currentScreen === 'bugun' && styles.activeNavText]}>
              Bugün
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navItem, currentScreen === 'takvim' && styles.activeNavItem]} 
            onPress={() => setCurrentScreen('takvim')}
          >
            <Text style={[styles.navText, currentScreen === 'takvim' && styles.activeNavText]}>
              Takvim
            </Text>
          </TouchableOpacity>
          
          {/* Empty space for the + button */}
          <View style={styles.centerSpace} />
          
          <TouchableOpacity 
            style={[styles.navItem, currentScreen === 'hatirlatmalar' && styles.activeNavItem]} 
            onPress={() => setCurrentScreen('hatirlatmalar')}
          >
            <Text style={[styles.navText, currentScreen === 'hatirlatmalar' && styles.activeNavText]}>
              Hatırlatmalar
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navItem, currentScreen === 'benimki' && styles.activeNavItem]} 
            onPress={() => setCurrentScreen('benimki')}
          >
            <Text style={[styles.navText, currentScreen === 'benimki' && styles.activeNavText]}>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A0B2E',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#4A2C7A',
  },
  headerIcon: {
    padding: 8,
    borderRadius: 8,
  },
  headerCenter: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: '#E6E6FA',
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
    color: '#E6E6FA',
  },
  activeViewText: {
    color: '#1A0B2E',
    fontWeight: '600',
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  navButton: {
    backgroundColor: '#2D1B4E',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A2C7A',
  },
  navButtonText: {
    color: '#FF69B4',
    fontSize: 20,
    fontWeight: 'bold',
  },
  monthText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dayInitialsRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  dayInitialContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  dayInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF69B4',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#2D1B4E',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#4A2C7A',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 1,
  },
  selectedDay: {
    backgroundColor: '#E6E6FA',
  },
  today: {
    borderWidth: 2,
    borderColor: '#FF69B4',
  },
  otherMonth: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  selectedDayText: {
    color: '#1A0B2E',
    fontWeight: 'bold',
  },
  todayText: {
    color: '#FF69B4',
    fontWeight: 'bold',
  },
  otherMonthText: {
    color: '#B8A9C9',
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
    width: '33.33%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 1,
    backgroundColor: '#1A0B2E',
  },
  currentYearMonth: {
    backgroundColor: '#E6E6FA',
  },
  yearMonthText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  currentYearMonthText: {
    color: '#1A0B2E',
    fontWeight: '600',
  },
  largeDateContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  largeDateText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  actionButtonsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  pinkButton: {
    backgroundColor: '#FF69B4',
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
  purpleButton: {
    backgroundColor: '#8A2BE2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#8A2BE2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  purpleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  bottomNavContainer: {
    position: 'relative',
  },
  addButton: {
    position: 'absolute',
    top: -25,
    left: '50%',
    marginLeft: -30,
    width: 60,
    height: 60,
    backgroundColor: '#FF69B4',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF69B4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#2D1B4E',
    borderTopWidth: 1,
    borderTopColor: '#4A2C7A',
    paddingTop: 20,
    paddingBottom: 15,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  centerSpace: {
    flex: 1,
  },
  activeNavItem: {
    // Active state styling
  },
  navText: {
    color: '#E6E6FA',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  activeNavText: {
    color: '#FF69B4',
    fontWeight: '600',
  },
});

export default PeriodTrackerScreen; 