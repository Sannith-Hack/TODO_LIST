import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, SectionList, TouchableOpacity, TextInput, ScrollView, Alert, Modal, Platform, Keyboard, KeyboardAvoidingView } from 'react-native';
import { COLORS, SHADOWS, SKILL_COLORS, CATEGORY_COLORS } from '../utils/theme';
import { Task, TaskCategory, SkillType, UserStats } from '../utils/types';
import { saveTasks, loadTasks, saveStats, loadStats, calculateLevelUp, getTitleByLevel, saveLastUsedSettings, loadLastUsedSettings } from '../storage/taskStorage';
import { QUEST_TEMPLATES, QuestTemplate } from '../utils/templates';
import TaskItem from '../components/TaskItem';
import LevelUpModal from '../components/LevelUpModal';

interface HomeScreenProps {
  onOpenMenu: () => void;
}

const HomeScreen = ({ onOpenMenu }: HomeScreenProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [taskInput, setTaskInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory>('Regular');
  const [selectedSkill, setSelectedSkill] = useState<SkillType>('Coding');
  const [targetCount, setTargetCount] = useState('');
  const [scheduledOffset, setScheduledOffset] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [pendingLevel, setPendingLevel] = useState(1);
  const [isTemplatePickerVisible, setIsTemplatePickerVisible] = useState(false);

  useEffect(() => {
    const initData = async () => {
      const [storedTasks, storedStats, lastUsed] = await Promise.all([loadTasks(), loadStats(), loadLastUsedSettings()]);
      if (lastUsed) { setSelectedCategory(lastUsed.category as TaskCategory); setSelectedSkill(lastUsed.skill as SkillType); }
      const now = Date.now();
      const lastReset = storedStats.lastResetDate || now;
      const isNewDay = new Date(now).toDateString() !== new Date(lastReset).toDateString();
      let migratedTasks = storedTasks.map(t => ({ ...t, category: (t.category as any === 'Challenge' ? 'OneTime' : t.category) || 'Regular', skillType: t.skillType || 'Mental', xpValue: t.xpValue || 10 }));
      let updatedStats = { ...storedStats, statPoints: (storedStats as any).statPoints || 0, reputationTitle: (storedStats as any).reputationTitle || getTitleByLevel(storedStats.totalLevel), lastResetDate: storedStats.lastResetDate || now, };
      if (isNewDay) {
        const missed = migratedTasks.filter(t => t.category === 'Regular' && !t.completed && !t.isPenalty);
        if (missed.length > 0) {
          const penalty: Task = { id: 'penalty-' + now, text: 'PENALTY: Physical Conditioning (100 Reps)', completed: false, createdAt: now, category: 'Regular', skillType: 'Workout', currentCount: 0, targetCount: 100, xpValue: 0, isPenalty: true };
          migratedTasks = [penalty, ...migratedTasks];
        }
        migratedTasks = migratedTasks.map(t => (t.category === 'Regular' && !t.isPenalty) ? { ...t, completed: false, currentCount: t.targetCount ? 0 : undefined } : t);
        updatedStats.lastResetDate = now;
      }
      setTasks(migratedTasks); setStats(updatedStats); setIsInitialized(true);
    };
    initData();
  }, []);

  const addTask = () => {
    if (taskInput.trim().length === 0) return;
    const isWorkout = selectedSkill === 'Workout';
    const reps = parseInt(targetCount) || 0;
    const dueDate = scheduledOffset > 0 ? new Date().setHours(0,0,0,0) + (scheduledOffset * 24 * 60 * 60 * 1000) : undefined;
    const newTask: Task = { id: Date.now().toString(), text: taskInput.trim(), completed: false, createdAt: Date.now(), dueDate, category: selectedCategory, skillType: selectedSkill, currentCount: isWorkout ? 0 : undefined, targetCount: isWorkout ? reps : undefined, xpValue: selectedCategory === 'Regular' ? 10 : selectedCategory === 'OneTime' ? 50 : 200 };
    setTasks(prev => [newTask, ...prev]);
    setTaskInput(''); setTargetCount(''); setScheduledOffset(0);
    Keyboard.dismiss();
  };

  const handleToggle = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed, completedAt: !t.completed ? Date.now() : undefined } : t));
  };

  const getSections = () => {
    const now = new Date().setHours(0,0,0,0);
    const visible = tasks.filter(t => !t.dueDate || t.dueDate <= now);
    const sections = [
        { title: 'DAILY', data: visible.filter(t => t.category === 'Regular'), color: CATEGORY_COLORS.Regular },
        { title: 'ONE-TIME', data: visible.filter(t => t.category === 'OneTime'), color: CATEGORY_COLORS.OneTime },
        { title: 'LONG-TERM', data: visible.filter(t => t.category === 'LongTerm'), color: CATEGORY_COLORS.LongTerm }
    ].filter(s => s.data.length > 0);
    return sections;
  };

  const ListHeader = () => (
    <View style={styles.creationPanel}>
        <View style={styles.creationHeader}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['Coding', 'Workout', 'Cultural', 'Sports', 'Mental'].map(skill => (
              <TouchableOpacity key={skill} onPress={() => setSelectedSkill(skill as any)} style={[ styles.selectorItem, selectedSkill === skill && { borderColor: SKILL_COLORS[skill as any], backgroundColor: SKILL_COLORS[skill as any] + '22' } ]}>
                <Text style={[styles.selectorText, selectedSkill === skill && { color: SKILL_COLORS[skill as any] }]}>{skill}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.templateToggle} onPress={() => setIsTemplatePickerVisible(true)}><Text style={styles.templateToggleText}>PRESETS</Text></TouchableOpacity>
        </View>
        <View style={styles.categorySelectorContainer}>
          {(['Regular', 'OneTime', 'LongTerm'] as TaskCategory[]).map(cat => (
            <TouchableOpacity key={cat} onPress={() => { setSelectedCategory(cat); if (cat === 'Regular') setScheduledOffset(0); }} style={[ styles.categoryItem, selectedCategory === cat && { borderColor: CATEGORY_COLORS[cat], backgroundColor: CATEGORY_COLORS[cat] + '22' } ]}>
              <Text style={[styles.categoryText, selectedCategory === cat && { color: CATEGORY_COLORS[cat] }]}>{cat.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {selectedCategory !== 'Regular' && (
          <View style={styles.scheduleContainer}>
            <Text style={styles.scheduleLabel}>DATE:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[0, 1, 2, 3, 4, 5, 6, 7].map(offset => (
                <TouchableOpacity key={offset} onPress={() => setScheduledOffset(offset)} style={[styles.offsetItem, scheduledOffset === offset && styles.offsetItemActive]}>
                    <Text style={[styles.offsetText, scheduledOffset === offset && styles.offsetTextActive]}>{offset === 0 ? 'TODAY' : `+${offset}D`}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        <View style={styles.inputRow}>
            <TextInput style={styles.input} placeholder="[+] QUEST NAME" placeholderTextColor={COLORS.textDim} value={taskInput} onChangeText={setTaskInput} />
            <TouchableOpacity style={styles.addButton} onPress={addTask}><Text style={styles.addButtonText}>ADD</Text></TouchableOpacity>
        </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onOpenMenu}><Text style={styles.menuText}>MENU</Text></TouchableOpacity>
        <Text style={styles.title}>QUEST LOG</Text>
        <View style={{width: 40}} />
      </View>
      <SectionList
        sections={getSections()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskItem item={item} onToggle={handleToggle} onDelete={(id) => setTasks(prev => prev.filter(t => t.id !== id))} onUpdate={(id, text) => setTasks(prev => prev.map(t => t.id === id ? {...t, text} : t))} onUpdateCount={(id, count) => setTasks(prev => prev.map(t => t.id === id ? {...t, currentCount: count} : t))} />}
        renderSectionHeader={({ section: { title, color } }) => <View style={styles.sectionHeader}><Text style={[styles.sectionHeaderText, { color }]}>{title}</Text></View>}
        ListHeaderComponent={<ListHeader />}
        stickySectionHeadersEnabled={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  title: { color: COLORS.primary, fontSize: 20, fontWeight: '900', letterSpacing: 2 },
  menuText: { color: COLORS.primary, fontWeight: 'bold' },
  creationPanel: { padding: 20 },
  skillSelectorContainer: { marginBottom: 10 },
  selectorItem: { paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: COLORS.border, marginRight: 10 },
  selectorText: { fontSize: 10, fontWeight: 'bold', color: COLORS.textDim },
  categorySelectorContainer: { flexDirection: 'row', marginBottom: 10 },
  categoryItem: { flex: 1, padding: 8, borderWidth: 1, borderColor: COLORS.border, marginRight: 5, alignItems: 'center' },
  categoryText: { fontSize: 9, fontWeight: 'bold' },
  scheduleContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, padding: 5, borderWidth: 1, borderColor: COLORS.border },
  scheduleLabel: { color: COLORS.primary, fontSize: 8, fontWeight: '900', marginRight: 5 },
  offsetItem: { paddingHorizontal: 8, paddingVertical: 4 },
  offsetItemActive: { backgroundColor: COLORS.primary + '22' },
  offsetText: { color: COLORS.textDim, fontSize: 9, fontWeight: 'bold' },
  offsetTextActive: { color: COLORS.primary },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, backgroundColor: COLORS.surface, color: COLORS.text, paddingHorizontal: 15, height: 40 },
  addButton: { paddingHorizontal: 15, height: 40, justifyContent: 'center', backgroundColor: COLORS.primary, marginLeft: 10 },
  addButtonText: { color: COLORS.background, fontWeight: '900', fontSize: 11 },
  sectionHeader: { paddingHorizontal: 20, marginTop: 15, marginBottom: 5 },
  sectionHeaderText: { fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  templateToggle: { paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: COLORS.primary },
  templateToggleText: { color: COLORS.primary, fontSize: 9, fontWeight: 'bold' },
  creationHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }
});

export default HomeScreen;
