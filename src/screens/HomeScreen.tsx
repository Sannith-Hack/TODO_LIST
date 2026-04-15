import React, { useState, useEffect, memo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, SectionList, TouchableOpacity, TextInput, Alert, Modal, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS, SHADOWS, SKILL_COLORS, CATEGORY_COLORS } from '../utils/theme';
import { Task, TaskCategory, SkillType, UserStats } from '../utils/types';
import { saveTasks, loadTasks, saveStats, loadStats, calculateLevelUp, getTitleByLevel, saveLastUsedSettings, loadLastUsedSettings } from '../storage/taskStorage';
import { QUEST_TEMPLATES } from '../utils/templates';
import TaskItem from '../components/TaskItem';
import LevelUpModal from '../components/LevelUpModal';

// Memoized Creation Panel to prevent keyboard focus loss
const CreationPanel = memo(({ onAdd, templates, onShowTemplates, selectedSkill, setSelectedSkill, selectedCategory, setSelectedCategory, scheduledDays, setScheduledDays, taskInput, setTaskInput, targetCount, setTargetCount }: any) => (
    <View style={styles.creationPanel}>
        <View style={styles.creationHeader}>
            <View style={{flexDirection: 'row'}}>
                {['Coding', 'Workout', 'Cultural', 'Sports', 'Mental'].map(s => (
                    <TouchableOpacity key={s} onPress={() => setSelectedSkill(s)} style={[styles.selectorItem, selectedSkill === s && { borderColor: SKILL_COLORS[s as any], backgroundColor: SKILL_COLORS[s as any] + '22' }]}>
                        <Text style={[styles.selectorText, selectedSkill === s && { color: SKILL_COLORS[s as any] }]}>{s}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
        <View style={styles.categorySelectorContainer}>
            {(['Regular', 'OneTime', 'LongTerm'] as TaskCategory[]).map(cat => (
                <TouchableOpacity key={cat} onPress={() => setSelectedCategory(cat)} style={[styles.categoryItem, selectedCategory === cat && { borderColor: CATEGORY_COLORS[cat], backgroundColor: CATEGORY_COLORS[cat] + '22' }]}>
                    <Text style={[styles.categoryText, selectedCategory === cat && { color: CATEGORY_COLORS[cat] }]}>{cat.toUpperCase()}</Text>
                </TouchableOpacity>
            ))}
        </View>
        <View style={styles.inputRow}>
            <TextInput style={styles.input} placeholder="[+] QUEST NAME" placeholderTextColor={COLORS.textDim} value={taskInput} onChangeText={setTaskInput} />
            <TouchableOpacity style={styles.addButton} onPress={onAdd}><Text style={styles.addButtonText}>ADD</Text></TouchableOpacity>
        </View>
        {selectedSkill === 'Workout' && (
            <TextInput style={[styles.input, {marginTop: 5}]} placeholder="[+] REPS (e.g. 50)" placeholderTextColor={COLORS.textDim} value={targetCount} onChangeText={setTargetCount} keyboardType="numeric" />
        )}
    </View>
));

const HomeScreen = ({ onOpenMenu }: { onOpenMenu: () => void }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory>('Regular');
  const [selectedSkill, setSelectedSkill] = useState<SkillType>('Coding');
  const [targetCount, setTargetCount] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    loadTasks().then(setTasks);
    setIsInitialized(true);
  }, []);

  useEffect(() => { if (isInitialized) saveTasks(tasks); }, [tasks]);

  const addTask = () => {
    if (taskInput.trim() === '') return;
    const newTask: Task = { 
        id: Date.now().toString(), text: taskInput.trim(), completed: false, createdAt: Date.now(), 
        category: selectedCategory, skillType: selectedSkill, xpValue: 10,
        currentCount: selectedSkill === 'Workout' ? 0 : undefined,
        targetCount: selectedSkill === 'Workout' ? parseInt(targetCount) || 0 : undefined
    };
    setTasks(prev => [newTask, ...prev]);
    setTaskInput(''); setTargetCount('');
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={onOpenMenu}><Text style={styles.menuText}>MENU</Text></TouchableOpacity>
            <Text style={styles.title}>QUEST LOG</Text>
            <View style={{width: 40}} />
        </View>
        <SectionList
            sections={[
                { title: 'DAILY', data: tasks.filter(t => t.category === 'Regular') },
                { title: 'ONE-TIME', data: tasks.filter(t => t.category === 'OneTime') },
                { title: 'LONG-TERM', data: tasks.filter(t => t.category === 'LongTerm') }
            ].filter(s => s.data.length > 0)}
            keyExtractor={t => t.id}
            renderItem={({ item }) => <TaskItem item={item} onToggle={(id) => setTasks(prev => prev.map(t => t.id === id ? {...t, completed: !t.completed} : t))} onDelete={(id) => setTasks(prev => prev.filter(t => t.id !== id))} onUpdate={(id, text) => setTasks(prev => prev.map(t => t.id === id ? {...t, text} : t))} onUpdateCount={(id, c) => setTasks(prev => prev.map(t => t.id === id ? {...t, currentCount: c} : t))} />}
            ListHeaderComponent={<CreationPanel onAdd={addTask} selectedSkill={selectedSkill} setSelectedSkill={setSelectedSkill} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} taskInput={taskInput} setTaskInput={setTaskInput} targetCount={targetCount} setTargetCount={setTargetCount} />}
        />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between' },
  title: { color: COLORS.primary, fontSize: 20, fontWeight: '900' },
  menuText: { color: COLORS.primary, fontWeight: 'bold' },
  creationPanel: { padding: 20 },
  selectorItem: { padding: 8, borderWidth: 1, borderColor: COLORS.border, marginRight: 10 },
  selectorText: { fontSize: 10, color: COLORS.textDim },
  categorySelectorContainer: { flexDirection: 'row', marginTop: 10 },
  categoryItem: { flex: 1, padding: 8, borderWidth: 1, borderColor: COLORS.border, marginRight: 5, alignItems: 'center' },
  categoryText: { fontSize: 9, fontWeight: 'bold', color: COLORS.textDim },
  inputRow: { flexDirection: 'row', marginTop: 10 },
  input: { flex: 1, backgroundColor: COLORS.surface, color: COLORS.text, paddingHorizontal: 15, height: 45 },
  addButton: { paddingHorizontal: 20, backgroundColor: COLORS.primary, justifyContent: 'center' },
  addButtonText: { fontWeight: '900', color: COLORS.background }
});

export default HomeScreen;
