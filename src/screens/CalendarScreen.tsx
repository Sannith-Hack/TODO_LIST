import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { COLORS, SHADOWS, SKILL_COLORS } from '../utils/theme';
import { loadTasks } from '../storage/taskStorage';
import { Task } from '../utils/types';

interface CalendarScreenProps {
  onOpenMenu: () => void;
}

const { width } = Dimensions.get('window');

const CalendarScreen = ({ onOpenMenu }: CalendarScreenProps) => {
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const fetchHistory = async () => {
      const allTasks = await loadTasks();
      setCompletedTasks(allTasks.filter(t => t.completed && t.completedAt));
    };
    fetchHistory();
  }, []);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];
    // Fill empty spots for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    // Fill actual days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = new Date(year, month, d).toDateString();
      const dayTasks = completedTasks.filter(t => 
        new Date(t.completedAt!).toDateString() === dateStr
      );

      days.push(
        <View key={d} style={styles.dayCell}>
          <Text style={styles.dayText}>{d}</Text>
          <View style={styles.dotContainer}>
            {dayTasks.map((t, i) => (
              <View 
                key={`${d}-${i}`} 
                style={[styles.taskDot, { backgroundColor: SKILL_COLORS[t.skillType] }]} 
              />
            ))}
          </View>
        </View>
      );
    }

    return days;
  };

  const changeMonth = (offset: number) => {
    const newMonth = new Date(currentMonth.setMonth(currentMonth.getMonth() + offset));
    setCurrentMonth(new Date(newMonth));
  };

  const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuBtn} onPress={onOpenMenu}>
          <View style={styles.menuLine} />
          <View style={[styles.menuLine, { width: 15 }]} />
          <View style={styles.menuLine} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CHRONICLES</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.calendarContainer}>
          <View style={styles.monthHeader}>
            <TouchableOpacity onPress={() => changeMonth(-1)}>
              <Text style={styles.navText}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.monthTitle}>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</Text>
            <TouchableOpacity onPress={() => changeMonth(1)}>
              <Text style={styles.navText}>{'>'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.weekdayRow}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <Text key={i} style={styles.weekdayText}>{day}</Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {renderCalendar()}
          </View>
        </View>

        <View style={styles.legend}>
          <Text style={styles.legendTitle}>QUEST ARCHIVE</Text>
          <View style={styles.legendItems}>
            {(Object.keys(SKILL_COLORS) as Array<keyof typeof SKILL_COLORS>).map(skill => (
              <View key={skill} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: SKILL_COLORS[skill] }]} />
                <Text style={styles.legendText}>{skill.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  menuLine: {
    height: 2,
    width: 25,
    backgroundColor: COLORS.primary,
    marginBottom: 5,
    ...SHADOWS.glow,
  },
  headerTitle: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
    textShadowColor: COLORS.primary,
    textShadowRadius: 10,
  },
  scrollContent: {
    padding: 20,
  },
  calendarContainer: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 15,
    ...SHADOWS.glow,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  navText: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.textDim,
    fontSize: 10,
    fontWeight: '900',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    height: 50,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 5,
    borderWidth: 0.2,
    borderColor: COLORS.border,
  },
  dayText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  dotContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 4,
  },
  taskDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    margin: 1,
  },
  legend: {
    marginTop: 30,
    padding: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  legendTitle: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 15,
    opacity: 0.7,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 10,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    color: COLORS.textDim,
    fontSize: 9,
    fontWeight: 'bold',
  },
});

export default CalendarScreen;
