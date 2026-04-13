import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { COLORS, SHADOWS } from '../utils/theme';
import { Task } from '../utils/types';
import { saveTasks, loadTasks } from '../storage/taskStorage';
import TaskItem from '../components/TaskItem';

const HomeScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initTasks = async () => {
      const storedTasks = await loadTasks();
      setTasks(storedTasks);
      setIsInitialized(true);
    };
    initTasks();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      saveTasks(tasks);
    }
  }, [tasks, isInitialized]);

  const addTask = () => {
    if (taskInput.trim().length === 0) return;
    const newTask: Task = {
      id: Date.now().toString(),
      text: taskInput.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
    setTaskInput('');
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const updateTask = (id: string, newText: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>SYSTEM LOG</Text>
        <Text style={styles.headerTitle}>ACTIVE QUESTS</Text>
        <View style={styles.divider} />
      </View>

      <View style={[styles.inputContainer, SHADOWS.glow]}>
        <TextInput
          style={styles.input}
          placeholder="[+] REGISTER NEW QUEST"
          placeholderTextColor={COLORS.textDim}
          value={taskInput}
          onChangeText={setTaskInput}
          onSubmitEditing={addTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>ADD</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            item={item}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onUpdate={updateTask}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>- NO QUESTS REGISTERED -</Text>
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
    padding: 24,
    marginTop: 20,
  },
  headerSubtitle: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 3,
    marginBottom: 4,
    textShadowColor: COLORS.primary,
    textShadowRadius: 8,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 2,
  },
  divider: {
    height: 3,
    backgroundColor: COLORS.primary,
    width: 80,
    marginTop: 12,
    ...SHADOWS.glow,
  },
  inputContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingRight: 12,
  },
  input: {
    flex: 1,
    height: 64,
    paddingHorizontal: 20,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  addButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
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
    marginTop: 60,
    fontSize: 12,
    letterSpacing: 3,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
});

export default HomeScreen;
