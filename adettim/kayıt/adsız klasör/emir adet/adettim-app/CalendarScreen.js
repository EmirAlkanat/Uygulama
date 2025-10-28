import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  Modal, 
  useColorScheme, 
  ScrollView,
  Dimensions,
  Animated,
  StatusBar,
  SafeAreaView,
  Alert,
  TouchableWithoutFeedback
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// Takvim Türkçe dil ayarları
LocaleConfig.locales['tr'] = {
  monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
  monthNamesShort: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
  dayNames: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
  dayNamesShort: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
  today: 'Bugün'
};
LocaleConfig.defaultLocale = 'tr';

function toYYYYMMDD(date) {
  return new Date(date).toISOString().split('T')[0];
}

function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
}

function formatDateTR(date) {
  return new Date(date).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
}

const AnimatedView = Animated.createAnimatedComponent(View);

// Color themes for different periods
const colorThemes = [
  { primary: '#FF6B9D', secondary: '#FF8E9E', gradient: ['#FFE5F1', '#FFF0F6'] },
  { primary: '#4ECDC4', secondary: '#44A08D', gradient: ['#E0F7FA', '#F0FDFF'] },
  { primary: '#A78BFA', secondary: '#8B5CF6', gradient: ['#F3E8FF', '#FAF5FF'] },
  { primary: '#F59E0B', secondary: '#D97706', gradient: ['#FEF3C7', '#FFFBEB'] },
  { primary: '#10B981', secondary: '#059669', gradient: ['#D1FAE5', '#ECFDF5'] },
];

// Get theme for period index
const getThemeForPeriod = (index) => {
  return colorThemes[index % colorThemes.length];
};

// Kibar döngü kartı stili
const historyCardStyle = {
  backgroundColor: '#FFF',
  borderRadius: 16,
  padding: 16,
  marginBottom: 16,
  shadowColor: '#FF6B9D',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 3,
  borderWidth: 1,
  borderColor: '#F3E8FF',
};

export default function CalendarScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [periods, setPeriods] = useState([]);
  const [cycleLength, setCycleLength] = useState(28);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [endDateModal, setEndDateModal] = useState({ visible: false, idx: null });
  const [selectedEndDateForEdit, setSelectedEndDateForEdit] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const scrollRef = useRef(null);
  const calendarRef = useRef(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showTodayModal, setShowTodayModal] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('PERIODS');
      const savedCycle = await AsyncStorage.getItem('CYCLE_LENGTH');
      if (saved) setPeriods(JSON.parse(saved));
      if (savedCycle) setCycleLength(Number(savedCycle));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('PERIODS', JSON.stringify(periods));
    AsyncStorage.setItem('CYCLE_LENGTH', String(cycleLength));
  }, [periods, cycleLength]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getNextPeriod = () => {
    if (periods.length === 0) return null;
    const last = new Date(periods[0].date);
    last.setDate(last.getDate() + cycleLength);
    return last;
  };

  const addPeriod = () => {
    if (selectedStartDate) {
      const newPeriod = { date: selectedStartDate };
      setPeriods(prevPeriods => [newPeriod, ...prevPeriods]);
      setSelectedStartDate('');
      setShowAddModal(false);
    }
  };

  const openEndDateModal = (idx) => {
    setEndDateModal({ visible: true, idx });
    setSelectedEndDateForEdit('');
  };

  const saveEndDate = () => {
    if (selectedEndDateForEdit && endDateModal.idx !== null) {
      setPeriods(periods => periods.map((p, i) =>
        i === endDateModal.idx ? { ...p, endDate: selectedEndDateForEdit } : p
      ));
      setEndDateModal({ visible: false, idx: null });
      setSelectedEndDateForEdit('');
    }
  };

  const getMarkedDatesForCalendar = () => {
    let marked = {};
    
    periods.forEach((p) => {
      const start = new Date(p.date);
      const end = p.endDate ? new Date(p.endDate) : new Date(p.date);
      let d = new Date(start);
      while (d <= end) {
        const key = toYYYYMMDD(d);
        marked[key] = {
          customStyles: {
            container: {
              backgroundColor: '#FF6B9D',
              borderRadius: 16,
            },
            text: {
              color: '#fff',
              fontWeight: 'bold',
            }
          }
        };
        d.setDate(d.getDate() + 1);
      }
      // Tahmini adet başlangıcı (bir sonraki ay)
      const cycle = cycleLength || 28;
      const nextStart = new Date(start);
      nextStart.setDate(nextStart.getDate() + cycle);
      const nextKey = toYYYYMMDD(nextStart);
      if (!marked[nextKey]) {
        marked[nextKey] = {
          customStyles: {
            container: {
              backgroundColor: '#A78BFA',
              borderRadius: 16,
            },
            text: {
              color: '#fff',
              fontWeight: 'bold',
            }
          }
        };
      }
    });
    
    return marked;
  };

  const nextPeriod = getNextPeriod();

  // Güncel adet durumu hesaplama
  let currentStatusText = '';
  if (periods.length > 0) {
    const latest = periods[0];
    const today = new Date();
    const start = new Date(latest.date);
    const end = latest.endDate ? new Date(latest.endDate) : null;
    if (end && today >= start && today <= end) {
      // Adet dönemi içindeyiz
      const dayNum = Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;
      currentStatusText = `Adetin ${dayNum}. günündesin`;
    } else if (today < start) {
      // Adete kaç gün kaldı
      const daysLeft = Math.floor((start - today) / (1000 * 60 * 60 * 24));
      currentStatusText = `Adete ${daysLeft} gün kaldı`;
    } else if (end && today > end) {
      // Adet dönemi bitti, bir sonraki döngüye kaç gün kaldı
      const nextStart = new Date(start);
      nextStart.setDate(start.getDate() + cycleLength);
      const daysLeft = Math.floor((nextStart - today) / (1000 * 60 * 60 * 24));
      currentStatusText = `Adet bitti. Sonraki döngüye ${daysLeft} gün kaldı`;
    }
  }

  const handleShowCalendar = () => {
    setShowCalendar(prev => {
      const newVal = !prev;
      setTimeout(() => {
        if (newVal && scrollRef.current && calendarRef.current) {
          calendarRef.current.measureLayout(
            scrollRef.current.getInnerViewNode(),
            (x, y) => {
              scrollRef.current.scrollTo({ y: y - 20, animated: true });
            }
          );
        }
      }, 300);
      return newVal;
    });
  };

  // Döngü silme fonksiyonu
  const deletePeriod = (idx) => {
    setPeriods(periods => periods.filter((_, i) => i !== idx));
  };

  useFocusEffect(
    React.useCallback(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ y: 0, animated: false });
      }
    }, [])
  );

  return (
    <LinearGradient colors={['#FFDEE9', '#B5FFFC']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={'#FFDEE9'} />
        <ScrollView ref={scrollRef} style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 60}}>
          <View style={styles.headerGradient}>
            <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}> 
              <View style={styles.headerContent}>
                <View style={styles.logoContainer}>
                  <Image source={require('./assets/adetresim.png')} style={{ width: 60, height: 60, resizeMode: 'contain' }} />
                </View>
                <Text style={[styles.appTitle, { color: '#B83280' }]}>Ishe</Text>
                <Text style={[styles.appSubtitle, { color: '#B83280', opacity: 0.8, fontStyle: 'italic' }]}>Sağlıklı takip, mutlu günler 🌟</Text>
              </View>
            </Animated.View>
          </View>

          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            
            {/* Stats Cards */}
            <View style={styles.statsContainer}>
              <TouchableOpacity
                style={[styles.statCard, { backgroundColor: isDark ? '#2D2D44' : '#FFF' }]}
                activeOpacity={0.8}
                onPress={() => setShowHistoryModal(true)}
              >
                <LinearGradient colors={['#667eea', '#764ba2']} style={styles.statIconContainer}>
                  <MaterialCommunityIcons name="calendar-heart" size={24} color="#FFF" />
                </LinearGradient>
                <Text style={[styles.statLabel, { color: isDark ? '#CCC' : '#666', fontWeight: 'bold', fontSize: 17 }]}>Geçmiş Döngü</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.statCard, { backgroundColor: isDark ? '#2D2D44' : '#FFF' }]}
                activeOpacity={0.8}
                onPress={() => setShowTodayModal(true)}
              >
                <LinearGradient colors={['#4ECDC4', '#44A08D']} style={styles.statIconContainer}>
                  <MaterialCommunityIcons name="clock-outline" size={24} color="#FFF" />
                </LinearGradient>
                <Text style={[styles.statLabel, { color: isDark ? '#CCC' : '#666', fontWeight: 'bold', fontSize: 17 }]}>Aylık Döngü</Text>
              </TouchableOpacity>
            </View>

            {/* Next Period Card */}
            {nextPeriod && (
              <View style={[styles.nextPeriodCard, { backgroundColor: isDark ? '#2D2D44' : '#FFF', marginBottom: 24 }]}>
                <LinearGradient colors={['#667eea', '#764ba2']} style={styles.nextPeriodGradient}>
                  <MaterialCommunityIcons name="calendar-star" size={28} color="#FFF" />
                  <Text style={styles.nextPeriodTitle}>Durum</Text>
                  {currentStatusText ? (
                    <Text style={{color:'#fff', fontSize:16, fontWeight:'bold', marginTop:4, marginBottom:2, textAlign:'center'}}>{currentStatusText}</Text>
                  ) : null}
                </LinearGradient>
              </View>
            )}

            {/* Eğer en güncel döngünün bitiş tarihi yoksa, özel kart ve buton göster */}
            {periods.length > 0 && !periods[0].endDate && (
              <View style={{
                marginTop: 0,
                marginBottom: 24,
                marginHorizontal: 0,
                width: '100%',
                backgroundColor: '#E0F7FA',
                borderRadius: 20,
                padding: 20,
                shadowColor: '#FF6B9D',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.12,
                shadowRadius: 12,
                elevation: 5,
                alignItems: 'center',
              }}>
                <Text style={{color: '#B83280', fontWeight: 'bold', fontSize: 16, marginBottom: 6}}>
                  Başlangıç tarihi: {formatDateTR(periods[0].date)}
                </Text>
                <Text style={{color: '#666', fontSize: 14, marginBottom: 16}}>
                  Bitiş tarihi gir
                </Text>
                <TouchableOpacity
                  onPress={() => setEndDateModal({ visible: true, idx: 0 })}
                  style={{
                    borderRadius: 16,
                    overflow: 'hidden',
                    shadowColor: '#4ECDC4',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 10,
                    elevation: 4,
                  }}
                >
                  <LinearGradient colors={['#4ECDC4', '#44A08D']} style={{ paddingVertical: 14, paddingHorizontal: 36, alignItems: 'center' }}>
                    <Text style={{color: '#FFF', fontSize: 16, fontWeight: 'bold'}}>Bitiş Tarihi Gir</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {/* Action Buttons */}
            <View style={[styles.actionButtons, {marginTop: 0}]}>
              <TouchableOpacity 
                onPress={() => setShowAddModal(true)}
                style={styles.addButton}
              >
                <LinearGradient colors={['#FF6B9D', '#FF8E9E']} style={styles.addButtonGradient}>
                  <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
                  <Text style={styles.addButtonText}>Yeni Döngü Ekle</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleShowCalendar}
                style={[styles.calendarButton, { backgroundColor: isDark ? '#2D2D44' : '#FFF' }]}
              >
                <MaterialCommunityIcons 
                  name={showCalendar ? "calendar-remove" : "calendar-month"} 
                  size={24} 
                  color={isDark ? '#FFF' : '#FF6B9D'} 
                />
                <Text style={[styles.calendarButtonText, { color: isDark ? '#FFF' : '#FF6B9D' }]}>
                  {showCalendar ? 'Takvimi Gizle' : 'Takvimi Göster'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Calendar */}
            {showCalendar && (
              <Animated.View ref={calendarRef} style={[styles.calendarContainer, { opacity: fadeAnim }]}>
                <View style={[styles.calendarCard, { backgroundColor: isDark ? '#2D2D44' : '#FFF' }]}>
                  <Calendar
                    style={styles.calendar}
                    markingType={'period'}
                    markedDates={getMarkedDatesForCalendar()}
                    theme={{
                      backgroundColor: 'transparent',
                      calendarBackground: 'transparent',
                      textSectionTitleColor: isDark ? '#FFF' : '#FF6B9D',
                      selectedDayBackgroundColor: '#FF6B9D',
                      selectedDayTextColor: '#fff',
                      todayTextColor: '#FF6B9D',
                      dayTextColor: isDark ? '#FFF' : '#333',
                      arrowColor: isDark ? '#FFF' : '#FF6B9D',
                      monthTextColor: isDark ? '#FFF' : '#FF6B9D',
                      textDayFontWeight: '600',
                      textMonthFontWeight: 'bold',
                      textDayHeaderFontWeight: '600',
                      textDayFontSize: 16,
                      textMonthFontSize: 18,
                      textDayHeaderFontSize: 13
                    }}
                  />
                </View>
              </Animated.View>
            )}

            {/* Legend */}
            {showCalendar && (
              <View style={[styles.legendContainer, { backgroundColor: isDark ? '#2D2D44' : '#FFF' }]}>
                <Text style={[styles.legendTitle, { color: isDark ? '#FFF' : '#333' }]}>Renk Açıklaması</Text>
                <View style={styles.legendItems}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#FF6B9D' }]} />
                    <Text style={[styles.legendText, { color: isDark ? '#CCC' : '#666' }]}>Adet Dönemi</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#4ECDC4' }]} />
                    <Text style={[styles.legendText, { color: isDark ? '#CCC' : '#666' }]}>Ovulasyon</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#FFE5F1' }]} />
                    <Text style={[styles.legendText, { color: isDark ? '#CCC' : '#666' }]}>Tahmini Dönem</Text>
                  </View>
                </View>
              </View>
            )}
          </Animated.View>
        </ScrollView>

        {/* Add Period Modal */}
        <Modal
          visible={showAddModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowAddModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowAddModal(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={[styles.modalContent, { backgroundColor: isDark ? '#2D2D44' : '#FFF' }]}>
                  <LinearGradient colors={['#FF6B9D', '#FF8E9E']} style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Yeni Döngü Ekle</Text>
                    <TouchableOpacity onPress={() => setShowAddModal(false)}>
                      <Feather name="x" size={24} color="#FFF" />
                    </TouchableOpacity>
                  </LinearGradient>
                  
                  <ScrollView style={styles.modalBody} contentContainerStyle={{paddingBottom: 24}} keyboardShouldPersistTaps="handled">
                    <Text style={[styles.modalLabel, { color: isDark ? '#FFF' : '#333' }]}>Adet başlangıç gününü seçin:</Text>
                    <Calendar
                      style={styles.modalCalendar}
                      current={selectedStartDate || toYYYYMMDD(new Date())}
                      onDayPress={day => setSelectedStartDate(day.dateString)}
                      markedDates={selectedStartDate ? { [selectedStartDate]: { selected: true, selectedColor: '#FF6B9D' } } : {}}
                      theme={{
                        backgroundColor: 'transparent',
                        calendarBackground: 'transparent',
                        selectedDayBackgroundColor: '#FF6B9D',
                        selectedDayTextColor: '#fff',
                        todayTextColor: '#FF6B9D',
                        dayTextColor: isDark ? '#FFF' : '#333',
                        arrowColor: isDark ? '#FFF' : '#FF6B9D',
                        monthTextColor: isDark ? '#FFF' : '#FF6B9D',
                        textDayFontWeight: '600',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '600',
                        textDayFontSize: 16,
                        textMonthFontSize: 18,
                        textDayHeaderFontSize: 13
                      }}
                    />
                    <View style={{alignItems: 'center', marginVertical: 8}}>
                      <Text style={{color: isDark ? '#FFF' : '#333', fontSize: 15}}>
                        {selectedStartDate && `Başlangıç: ${formatDateTR(selectedStartDate)}`}
                      </Text>
                      {selectedStartDate && (
                        <TouchableOpacity onPress={() => setSelectedStartDate('')} style={{marginTop: 4}}>
                          <Text style={{color: '#FF6B9D', fontSize: 13}}>Seçimi Temizle</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <View style={styles.modalButtons}>
                      <TouchableOpacity 
                        onPress={() => setShowAddModal(false)}
                        style={[styles.modalButton, styles.cancelButton]}
                      >
                        <Text style={styles.cancelButtonText}>İptal</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={addPeriod}
                        style={[styles.modalButton, styles.saveButton]}
                        disabled={!selectedStartDate}
                      >
                        <LinearGradient colors={['#FF6B9D', '#FF8E9E']} style={styles.saveButtonGradient}>
                          <Text style={styles.saveButtonText}>Kaydet</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* End Date Modal */}
        <Modal
          visible={endDateModal.visible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setEndDateModal({ visible: false, idx: null })}
        >
          <TouchableWithoutFeedback onPress={() => setEndDateModal({ visible: false, idx: null })}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={[styles.modalContent, { backgroundColor: isDark ? '#2D2D44' : '#FFF' }]}> 
                  <LinearGradient colors={['#4ECDC4', '#44A08D']} style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Bitiş Tarihi Ekle</Text>
                    <TouchableOpacity onPress={() => setEndDateModal({ visible: false, idx: null })}>
                      <Feather name="x" size={24} color="#FFF" />
                    </TouchableOpacity>
                  </LinearGradient>
                  <View style={styles.modalBody}>
                    <Text style={[styles.modalLabel, { color: isDark ? '#FFF' : '#333' }]}>Bitiş gününü seçin:</Text>
                    <Calendar
                      style={styles.modalCalendar}
                      current={selectedEndDateForEdit || (endDateModal.idx !== null ? periods[endDateModal.idx]?.date : toYYYYMMDD(new Date()))}
                      minDate={endDateModal.idx !== null ? periods[endDateModal.idx]?.date : undefined}
                      onDayPress={day => setSelectedEndDateForEdit(day.dateString)}
                      markedDates={(() => {
                        if (endDateModal.idx !== null) {
                          const startDate = periods[endDateModal.idx]?.date;
                          const endDate = selectedEndDateForEdit;
                          let marked = {};
                          if (startDate && endDate && endDate > startDate) {
                            // Aralık seçiliyse, başlangıç ve bitiş günleri aynı renkte ve köşeli olsun
                            let d = new Date(startDate);
                            const end = new Date(endDate);
                            while (d <= end) {
                              const key = toYYYYMMDD(d);
                              if (key === startDate) {
                                marked[key] = { selected: true, startingDay: true, endingDay: false, color: '#FF6B9D', textColor: '#fff' };
                              } else if (key === endDate) {
                                marked[key] = { selected: true, startingDay: false, endingDay: true, color: '#FF6B9D', textColor: '#fff' };
                              } else {
                                marked[key] = { color: '#FFE5F1', textColor: '#333' };
                              }
                              d.setDate(d.getDate() + 1);
                            }
                          } else {
                            // Her durumda başlangıç tarihi işaretli olsun
                            if (startDate) marked[startDate] = { selected: true, startingDay: true, endingDay: true, color: '#FF6B9D', textColor: '#fff' };
                            if (endDate && endDate !== startDate) marked[endDate] = { selected: true, startingDay: true, endingDay: true, color: '#FF6B9D', textColor: '#fff' };
                          }
                          return marked;
                        } else {
                          return {};
                        }
                      })()}
                      markingType={'period'}
                      theme={{
                        backgroundColor: 'transparent',
                        calendarBackground: 'transparent',
                        selectedDayBackgroundColor: '#4ECDC4',
                        selectedDayTextColor: '#fff',
                        todayTextColor: '#4ECDC4',
                        dayTextColor: isDark ? '#FFF' : '#333',
                        arrowColor: isDark ? '#FFF' : '#4ECDC4',
                        monthTextColor: isDark ? '#FFF' : '#4ECDC4',
                        textDayFontWeight: '600',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '600',
                        textDayFontSize: 16,
                        textMonthFontSize: 18,
                        textDayHeaderFontSize: 13
                      }}
                    />
                    <View style={styles.modalButtons}>
                      <TouchableOpacity 
                        onPress={() => setEndDateModal({ visible: false, idx: null })}
                        style={[styles.modalButton, styles.cancelButton]}
                      >
                        <Text style={styles.cancelButtonText}>İptal</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={saveEndDate}
                        style={[styles.modalButton, styles.saveButton]}
                        disabled={!(selectedEndDateForEdit && endDateModal.idx !== null && selectedEndDateForEdit >= periods[endDateModal.idx]?.date)}
                      >
                        <LinearGradient colors={['#4ECDC4', '#44A08D']} style={styles.saveButtonGradient}>
                          <Text style={styles.saveButtonText}>Kaydet</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Geçmiş Döngüler Modalı */}
        <Modal
          visible={showHistoryModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowHistoryModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowHistoryModal(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={{
                  backgroundColor: '#FFF',
                  borderRadius: 28,
                  width: width * 0.92,
                  paddingBottom: 18,
                  shadowColor: '#FF6B9D',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.12,
                  shadowRadius: 24,
                  elevation: 10,
                }}>
                  <View style={{ alignItems: 'center', paddingTop: 28, paddingBottom: 12, backgroundColor: 'transparent' }}>
                    <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#B83280', textAlign: 'center' }}>Geçmiş Döngü Kayıtların</Text>
                  </View>
                  <View style={{ paddingHorizontal: 22, paddingTop: 8 }}>
                    {periods.length === 0 ? (
                      <Text style={{ color: '#B83280', fontSize: 16, textAlign: 'center', marginVertical: 24 }}>
                        Henüz kayıtlı döngün yok. Yeni bir döngü ekleyebilirsin!
                      </Text>
                    ) : (
                      <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator={false}>
                        {periods.map((p, idx) => {
                          const start = new Date(p.date);
                          let end = p.endDate ? new Date(p.endDate) : null;
                          return (
                            <View key={idx} style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              backgroundColor: '#FFE5F1',
                              borderRadius: 16,
                              padding: 16,
                              marginBottom: 16,
                              shadowColor: '#FF6B9D',
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.08,
                              shadowRadius: 8,
                              elevation: 3,
                            }}>
                              <View style={{ marginRight: 16, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 32 }}>✨</Text>
                              </View>
                              <View style={{ flex: 1 }}>
                                <Text style={{ color: '#D72660', fontWeight: 'bold', fontSize: 15, marginBottom: 2 }}>
                                  Başlangıç: <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 16 }}>{formatDateTR(start)}</Text>
                                </Text>
                                {end && (
                                  <Text style={{ color: '#D72660', fontWeight: 'bold', fontSize: 15 }}>
                                    Bitiş: <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 16 }}>{formatDateTR(end)}</Text>
                                  </Text>
                                )}
                              </View>
                              <TouchableOpacity onPress={() => deletePeriod(idx)} style={{ marginLeft: 12, padding: 8 }}>
                                <Feather name="trash-2" size={22} color="#FF6B9D" />
                              </TouchableOpacity>
                            </View>
                          );
                        })}
                      </ScrollView>
                    )}
                    <TouchableOpacity onPress={() => setShowHistoryModal(false)} style={{ marginTop: 18, alignSelf: 'center', borderRadius: 18, backgroundColor: '#FFDEE9', paddingHorizontal: 32, paddingVertical: 12, elevation: 0 }}>
                      <Text style={{ color: '#B83280', fontWeight: 'bold', fontSize: 16 }}>Kapat</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Takvim Modalı */}
        <Modal
          visible={showTodayModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowTodayModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowTodayModal(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={{
                  backgroundColor: '#FFF',
                  borderRadius: 24,
                  width: width * 0.92,
                  alignItems: 'center',
                  padding: 18,
                  shadowColor: '#4ECDC4',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.12,
                  shadowRadius: 24,
                  elevation: 10,
                }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#059669', marginBottom: 12, textAlign: 'center' }}>Takvim</Text>
                  <Calendar
                    key={showTodayModal ? 'open' : 'closed'}
                    current={toYYYYMMDD(new Date())}
                    markingType={'custom'}
                    markedDates={getMarkedDatesForCalendar()}
                    theme={{
                      backgroundColor: 'transparent',
                      calendarBackground: 'transparent',
                      selectedDayBackgroundColor: '#4ECDC4',
                      selectedDayTextColor: '#fff',
                      todayTextColor: '#059669',
                      dayTextColor: '#333',
                      arrowColor: '#059669',
                      monthTextColor: '#059669',
                      textDayFontWeight: '600',
                      textMonthFontWeight: 'bold',
                      textDayHeaderFontWeight: '600',
                      textDayFontSize: 16,
                      textMonthFontSize: 18,
                      textDayHeaderFontSize: 13
                    }}
                    style={{ borderRadius: 16, marginBottom: 18, width: width * 0.8 }}
                  />
                  <TouchableOpacity onPress={() => setShowTodayModal(false)} style={{ borderRadius: 16, backgroundColor: '#4ECDC4', paddingHorizontal: 32, paddingVertical: 12, elevation: 0 }}>
                    <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>Kapat</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 30,
    paddingBottom: 10,
  },
  header: {
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    fontStyle: 'italic',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 6,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  periodsListContainer: {
    marginBottom: 32,
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  periodsListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 20,
    textAlign: 'center',
  },
  periodCard: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
  },
  periodCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 5,
  },
  periodCardEmojiCol: {
    marginRight: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodCardLabel: {
    fontSize: 16,
    color: '#B83280',
    marginBottom: 4,
  },
  periodCardDate: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 18,
  },
  nextPeriodCard: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  nextPeriodGradient: {
    padding: 24,
    alignItems: 'center',
  },
  nextPeriodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 8,
    marginBottom: 4,
  },
  actionButtons: {
    marginBottom: 24,
  },
  addButton: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 8,
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  calendarButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  calendarContainer: {
    marginBottom: 24,
  },
  calendarCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  calendar: {
    borderRadius: 12,
  },
  legendContainer: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    alignItems: 'center',
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  legendText: {
    fontSize: 12,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  modalBody: {
    padding: 20,
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 12,
  },
  modalCalendar: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    overflow: 'hidden',
  },
  saveButtonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  endButton: {
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  endButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
}); 