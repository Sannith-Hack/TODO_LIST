import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { COLORS, SHADOWS, SKILL_COLORS, CATEGORY_COLORS } from '../utils/theme';
import { Task, TaskCategory, SkillType, UserStats } from '../utils/types';
import { saveTasks, loadTasks, saveStats, loadStats, calculateLevelUp } from '../storage/taskStorage';
import TaskItem from '../components/TaskItem';

interface HomeScreenProps {
  onOpenStats: () => void;
}

const HomeScreen = ({ onOpenStats }: HomeScreenProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [taskInput, setTaskInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory>('Regular');
  const [selectedSkill, setSelectedSkill] = useState<SkillType>('Coding');
  const [targetCount, setTargetCount] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initData = async () => {
      const [storedTasks, storedStats] = await Promise.all([loadTasks(), loadStats()]);
      
      // Migrate old tasks that might be missing new properties
      const migratedTasks = storedTasks.map(task => ({
        ...task,
        category: task.category || 'Regular',
        skillType: task.skillType || 'Mental',
        xpValue: task.xpValue || 10,
      }));

      setTasks(migratedTasks);
      setStats(storedStats);
      setIsInitialized(true);
    };
    initData();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      saveTasks(tasks);
    }
  }, [tasks, isInitialized]);

  useEffect(() => {
    if (isInitialized && stats) {
      saveStats(stats);
    }
  }, [stats, isInitialized]);

  const addTask = () => {
    if (taskInput.trim().length === 0) return;
    
    const isWorkout = selectedSkill === 'Workout';
    const reps = parseInt(targetCount) || 0;

    if (isWorkout && reps <= 0) {
      Alert.alert('System Error', 'Target reps must be greater than 0 for Workout quests.');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      text: taskInput.trim(),
      completed: false,
      createdAt: Date.now(),
      category: selectedCategory,
      skillType: selectedSkill,
      currentCount: isWorkout ? 0 : undefined,
      targetCount: isWorkout ? reps : undefined,
      xpValue: selectedCategory === 'Regular' ? 10 : selectedCategory === 'Challenge' ? 50 : 200,
    };

    setTasks((prevTasks) => [newTask, ...prevTasks]);
    setTaskInput('');
    setTargetCount('');
  };

  const handleToggle = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // If it's a workout, ensure reps are done before completing
    if (task.skillType === 'Workout' && !task.completed) {
      if ((task.currentCount || 0) < (task.targetCount || 0)) {
        Alert.alert('Quest Requirement', 'You must complete the target reps before finishing this quest.');
        return;
      }
    }

    const newCompletedState = !task.completed;

    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === id ? { ...t, completed: newCompletedState } : t
      )
    );

    // Handle XP Gain
    if (newCompletedState && stats) {
      const skillProgress = stats.skills[task.skillType];
      const updatedSkill = calculateLevelUp(skillProgress, task.xpValue);
      
      setStats({
        ...stats,
        totalXp: stats.totalXp + task.xpValue,
        skills: {
          ...stats.skills,
          [task.skillType]: updatedSkill,
        }
      });
    }
  };

  const handleUpdateCount = (id: string, newCount: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === id ? { ...t, currentCount: newCount } : t
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const updateTask = (id: string, newText: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
  };

  const categories: TaskCategory[] = ['Regular', 'Challenge', 'LongTerm'];
  const skills: SkillType[] = ['Coding', 'Workout', 'Cultural', 'Sports', 'Mental'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>SYSTEM LOG</Text>
          <Text style={styles.headerTitle}>QUESTS</Text>
        </View>
        <TouchableOpacity style={styles.statusBtn} onPress={onOpenStats}>
          <Text style={styles.statusBtnText}>STATUS</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.creationPanel}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
          {categories.map(cat => (
            <TouchableOpacity 
              key={cat} 
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.selectorItem, 
                selectedCategory === cat && { borderColor: CATEGORY_COLORS[cat], backgroundColor: CATEGORY_COLORS[cat] + '22' }
              ]}
            >
              <Text style={[styles.selectorText, selectedCategory === cat && { color: CATEGORY_COLORS[cat] }]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
          {skills.map(skill => (
            <TouchableOpacity 
              key={skill} 
              onPress={() => setSelectedSkill(skill)}
              style={[
                styles.selectorItem, 
                selectedSkill === skill && { borderColor: SKILL_COLORS[skill], backgroundColor: SKILL_COLORS[skill] + '22' }
              ]}
            >
              <Text style={[styles.selectorText, selectedSkill === skill && { color: SKILL_COLORS[skill] }]}>{skill}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="[+] NEW QUEST NAME"
            placeholderTextColor={COLORS.textDim}
            value={taskInput}
            onChangeText={setTaskInput}
          />
          {selectedSkill === 'Workout' && (
            <TextInput
              style={styles.countInput}
              placeholder="REPS"
              placeholderTextColor={COLORS.textDim}
              value={targetCount}
              onChangeText={setTargetCount}
              keyboardType="numeric"
            />
          )}
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Text style={styles.addButtonText}>ADD</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            item={item}
            onToggle={handleToggle}
            onDelete={deleteTask}
            onUpdate={updateTask}
            onUpdateCount={handleUpdateCount}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>- NO ACTIVE QUESTS -</Text>
        }
      />
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
  },
  headerSubtitle: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '900',
  },
  statusBtn: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    ...SHADOWS.glow,
  },
  statusBtnText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  creationPanel: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  selectorScroll: {
    marginBottom: 10,
  },
  selectorItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
    backgroundColor: COLORS.surface,
  },
  selectorText: {
    color: COLORS.textDim,
    fontSize: 10,
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  countInput: {
    width: 60,
    height: 50,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border,
    textAlign: 'center',
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  addButton: {
    paddingHorizontal: 20,
    height: 50,
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  addButtonText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: '900',
  },
  emptyText: {
    color: COLORS.textDim,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 12,
    letterSpacing: 2,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});

export default HomeScreen;
