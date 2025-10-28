import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'year'

  // Day initials for period tracking
  const dayInitials = ['C', 'P', 'S', 'Ç', 'P', 'C', 'P'];

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

  const monthData = getMonthData(currentMonth);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Turkish month abbreviations
  const monthAbbreviations = [
    'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
    'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'
  ];

  const getMonthAbbreviation = (monthIndex) => {
    return monthAbbreviations[monthIndex];
  };

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

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
        date: monthDate
      });
    }
    
    return months;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Period Tracker</Text>
          <Text style={styles.subtitle}>Track your cycle with ease</Text>
        </View>

        {/* View Mode Toggle */}
        <View style={styles.viewToggleContainer}>
          <TouchableOpacity 
            style={[styles.viewToggleTab, viewMode === 'month' && styles.activeViewTab]} 
            onPress={() => setViewMode('month')}
          >
            <Text style={[styles.viewToggleText, viewMode === 'month' && styles.activeViewText]}>
              Month
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.viewToggleTab, viewMode === 'year' && styles.activeViewTab]} 
            onPress={() => setViewMode('year')}
          >
            <Text style={[styles.viewToggleText, viewMode === 'year' && styles.activeViewText]}>
              Year
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
                  {monthData.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Selected Date Display */}
        {selectedDate && (
          <View style={styles.selectedDateContainer}>
            <Text style={styles.selectedDateLabel}>Selected Date:</Text>
            <Text style={styles.selectedDateText}>{formatDate(selectedDate)}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.pinkButton} onPress={() => Alert.alert('Regli Düzenle', 'Regli düzenleme özelliği açılacak')}>
            <Text style={styles.pinkButtonText}>REGLİ DÜZENLE</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.purpleButton} onPress={() => Alert.alert('Not Ekle', 'Not ekleme özelliği açılacak')}>
            <Text style={styles.purpleButtonText}>NOT EKLE</Text>
          </TouchableOpacity>
        </View>

        {/* Selected Date Display - Large Format */}
        {selectedDate && (
          <View style={styles.largeDateContainer}>
            <Text style={styles.largeDateText}>
              {selectedDate.getDate()} {getMonthAbbreviation(selectedDate.getMonth())}
            </Text>
          </View>
        )}

        {/* Period Tracking Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Track Your Period</Text>
          <Text style={styles.infoText}>
            Tap on a date to mark the start of your period. The calendar will help you track your cycle and predict future periods.
          </Text>
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
    color: '#E6E6FA', // Light lavender
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
    color: '#E6E6FA', // Light lavender
  },
  activeViewText: {
    color: '#1A0B2E', // Dark purple text on lavender background
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
    color: '#FF69B4', // Pink
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
    color: '#FF69B4', // Pink
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#2D1B4E', // Slightly lighter purple
    borderRadius: 16,
    padding: 10,
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
    color: '#FFFFFF',
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
    color: '#B8A9C9', // Muted lavender for other month days
  },
  selectedDateContainer: {
    backgroundColor: '#2D1B4E', // Slightly lighter purple
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#4A2C7A',
  },
  selectedDateLabel: {
    fontSize: 14,
    color: '#E6E6FA', // Light lavender
    marginBottom: 8,
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoContainer: {
    backgroundColor: '#2D1B4E', // Slightly lighter purple
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#4A2C7A',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#E6E6FA', // Light lavender
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
  purpleButton: {
    backgroundColor: '#8A2BE2', // Purple background
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
});

export default CalendarScreen; 