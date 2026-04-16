import React, { useState, useEffect, memo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, SectionList, TouchableOpacity, TextInput, ScrollView, Alert, Modal, Keyboard, Platform } from 'react-native';
import { COLORS, SHADOWS, SKILL_COLORS, CATEGORY_COLORS } from '../utils/theme';
import { Task, TaskCategory, SkillType, UserStats } from '../utils/types';
import { saveTasks, loadTasks, saveStats, loadStats, calculateLevelUp, getTitleByLevel, saveLastUsedSettings, loadLastUsedSettings } from '../storage/taskStorage';
import { QUEST_TEMPLATES } from '../utils/templates';
import TaskItem from '../components/TaskItem';

// Memoized Creation Panel to prevent keyboard focus loss
const CreationPanel = memo(({ onAdd, onShowTemplates, selectedSkill, setSelectedSkill, selectedCategory, setSelectedCategory, scheduledDays, setScheduledDays, taskInput, setTaskInput, targetCount, setTargetCount }: any) => (
    <View style={styles.creationPanel}>
        <View style={styles.creationHeader}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['Coding', 'Workout', 'Cultural', 'Sports', 'Mental'].map(s => (
                    <TouchableOpacity key={s} onPress={() => setSelectedSkill(s)} style={[styles.selectorItem, selectedSkill === s && { borderColor: SKILL_COLORS[s as any], backgroundColor: SKILL_COLORS[s as any] + '22' }]}>
                        <Text style={[styles.selectorText, selectedSkill === s && { color: SKILL_COLORS[s as any] }]}>{s}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <TouchableOpacity style={styles.templateToggle} onPress={onShowTemplates}><Text style={styles.templateToggleText}>PRESETS</Text></TouchableOpacity>
        </View>
        <View style={styles.categorySelectorContainer}>
            {(['Regular', 'OneTime', 'LongTerm'] as TaskCategory[]).map(cat => (
                <TouchableOpacity key={cat} onPress={() => setSelectedCategory(cat)} style={[styles.categoryItem, selectedCategory === cat && { borderColor: CATEGORY_COLORS[cat], backgroundColor: CATEGORY_COLORS[cat] + '22' }]}>
                    <Text style={[styles.categoryText, selectedCategory === cat && { color: CATEGORY_COLORS[cat] }]}>{cat.toUpperCase()}</Text>
                </TouchableOpacity>
            ))}
        </View>
        {selectedCategory !== 'Regular' && (
          <View style={styles.scheduleContainer}>
            <Text style={styles.scheduleLabel}>DATE:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[0, 1, 2, 3, 4, 5, 6, 7].map(offset => (
                <TouchableOpacity key={offset} onPress={() => setScheduledDays(offset)} style={[styles.offsetItem, scheduledDays === offset && styles.offsetItemActive]}>
                    <Text style={[styles.offsetText, scheduledDays === offset && styles.offsetTextActive]}>{offset === 0 ? 'TODAY' : `+${offset}D`}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        <View style={styles.inputRow}>
            <TextInput style={styles.input} placeholder="[+] QUEST NAME" placeholderTextColor={COLORS.textDim} value={taskInput} onChangeText={setTaskInput} />
            <TouchableOpacity style={styles.addButton} onPress={onAdd}><Text style={styles.addButtonText}>ADD</Text></TouchableOpacity>
        </View>
        {selectedSkill === 'Workout' && (
            <TextInput style={[styles.input, {marginTop: 10}]} placeholder="[+] REPS (e.g. 50)" placeholderTextColor={COLORS.textDim} value={targetCount} onChangeText={setTargetCount} keyboardType="numeric" />
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
  const [scheduledDays, setScheduledDays] = useState(0);
  const [isTemplatePickerVisible, setIsTemplatePickerVisible] = useState(false);

  useEffect(() => {
    loadTasks().then(setTasks);
    setIsInitialized(true);
  }, []);

  useEffect(() => { if (isInitialized) saveTasks(tasks); }, [tasks]);

  const addTask = () => {
    if (taskInput.trim() === '') return;
    const dueDate = scheduledDays > 0 ? new Date().setHours(0,0,0,0) + (scheduledDays * 24 * 60 * 60 * 1000) : undefined;
    const newTask: Task = { 
        id: Date.now().toString(), text: taskInput.trim(), completed: false, createdAt: Date.now(), dueDate,
        category: selectedCategory, skillType: selectedSkill, xpValue: 10,
        currentCount: selectedSkill === 'Workout' ? 0 : undefined,
        targetCount: selectedSkill === 'Workout' ? parseInt(targetCount) || 0 : undefined
    };
    setTasks(prev => [newTask, ...prev]);
    setTaskInput(''); setTargetCount(''); setScheduledDays(0);
  };

  const getSections = () => {
    const now = new Date().setHours(0,0,0,0);
    const visible = tasks.filter(t => !t.dueDate || t.dueDate <= now);
    return [
        { title: 'DAILY', data: visible.filter(t => t.category === 'Regular') },
        { title: 'ONE-TIME', data: visible.filter(t => t.category === 'OneTime') },
        { title: 'LONG-TERM', data: visible.filter(t => t.category === 'LongTerm') }
    ].filter(s => s.data.length > 0);
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={onOpenMenu}><Text style={styles.menuText}>MENU</Text></TouchableOpacity>
            <Text style={styles.title}>QUEST LOG</Text>
            <View style={{width: 40}} />
        </View>
        <SectionList
            sections={getSections()}
            keyExtractor={t => t.id}
            renderItem={({ item }) => <TaskItem item={item} onToggle={(id) => setTasks(prev => prev.map(t => t.id === id ? {...t, completed: !t.completed} : t))} onDelete={(id) => setTasks(prev => prev.filter(t => t.id !== id))} onUpdate={(id, text) => setTasks(prev => prev.map(t => t.id === id ? {...t, text} : t))} onUpdateCount={(id, c) => setTasks(prev => prev.map(t => t.id === id ? {...t, currentCount: c} : t))} />}
            ListHeaderComponent={<CreationPanel onAdd={addTask} onShowTemplates={() => setIsTemplatePickerVisible(true)} selectedSkill={selectedSkill} setSelectedSkill={setSelectedSkill} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} scheduledDays={scheduledDays} setScheduledDays={setScheduledDays} taskInput={taskInput} setTaskInput={setTaskInput} targetCount={targetCount} setTargetCount={setTargetCount} />}
        />
        <Modal visible={isTemplatePickerVisible} transparent animationType="fade" onRequestClose={() => setIsTemplatePickerVisible(false)}>
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsTemplatePickerVisible(false)}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>PRESETS</Text>
                    <ScrollView>
                        {QUEST_TEMPLATES[selectedSkill].map((t) => (
                            <TouchableOpacity key={t.id} style={styles.templateItem} onPress={() => { setTaskInput(t.name); setTargetCount(t.targetCount?.toString() || ''); setSelectedCategory(t.category); setIsTemplatePickerVisible(false); }}>
                                <Text style={styles.templateName}>{t.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </TouchableOpacity>
        </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: COLORS.primary, fontSize: 20, fontWeight: '900', letterSpacing: 2 },
  menuText: { color: COLORS.primary, fontWeight: 'bold' },
  creationPanel: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  creationHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  selectorItem: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: COLORS.border, marginRight: 8, backgroundColor: COLORS.surface },
  selectorText: { color: COLORS.textDim, fontSize: 10, fontWeight: 'bold' },
  templateToggle: { paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: COLORS.primary, backgroundColor: COLORS.primary + '11' },
  templateToggleText: { color: COLORS.primary, fontSize: 10, fontWeight: 'bold' },
  categorySelectorContainer: { flexDirection: 'row', marginBottom: 10 },
  categoryItem: { flex: 1, padding: 8, borderWidth: 1, borderColor: COLORS.border, marginRight: 5, alignItems: 'center' },
  categoryText: { fontSize: 9, fontWeight: 'bold', color: COLORS.textDim },
  scheduleContainer: { flexDirection: 'row', marginBottom: 10 },
  scheduleLabel: { color: COLORS.primary, fontSize: 10, alignSelf: 'center', marginRight: 10 },
  offsetItem: { padding: 8, borderWidth: 1, borderColor: COLORS.border, marginRight: 5 },
  offsetItemActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '22' },
  offsetText: { color: COLORS.textDim, fontSize: 10 },
  offsetTextActive: { color: COLORS.primary, fontWeight: 'bold' },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, backgroundColor: COLORS.surface, color: COLORS.text, paddingHorizontal: 15, height: 40 },
  addButton: { paddingHorizontal: 15, height: 40, justifyContent: 'center', backgroundColor: COLORS.primary, marginLeft: 10 },
  addButtonText: { color: COLORS.background, fontWeight: '900', fontSize: 11 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 40 },
  modalContent: { backgroundColor: COLORS.surface, padding: 20, width: '100%' },
  modalTitle: { color: COLORS.primary, fontWeight: 'bold', marginBottom: 10 },
  templateItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  templateName: { color: COLORS.text }
});

export default HomeScreen;
