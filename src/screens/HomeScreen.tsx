import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, SectionList, TouchableOpacity, TextInput, ScrollView, Alert, Modal, Platform } from 'react-native';
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
      const [storedTasks, storedStats, lastUsed] = await Promise.all([
        loadTasks(), 
        loadStats(),
        loadLastUsedSettings()
      ]);
      
      if (lastUsed) {
        setSelectedCategory(lastUsed.category as TaskCategory);
        setSelectedSkill(lastUsed.skill as SkillType);
      }

      const now = Date.now();
      const lastReset = storedStats.lastResetDate || now;
      const isNewDay = new Date(now).toDateString() !== new Date(lastReset).toDateString();

      let migratedTasks = storedTasks.map(task => ({
        ...task,
        category: (task.category as any === 'Challenge' ? 'OneTime' : task.category) || 'Regular',
        skillType: task.skillType || 'Mental',
        xpValue: task.xpValue || 10,
      }));

      let updatedStats = {
        ...storedStats,
        statPoints: (storedStats as any).statPoints || 0,
        reputationTitle: (storedStats as any).reputationTitle || getTitleByLevel(storedStats.totalLevel),
        lastResetDate: storedStats.lastResetDate || now,
      };

      if (isNewDay) {
        const missedQuests = migratedTasks.filter(t => t.category === 'Regular' && !t.completed && !t.isPenalty);
        if (missedQuests.length > 0) {
          Alert.alert('SYSTEM WARNING','You failed to complete your daily quests. A Penalty Quest has been issued.',[{ text: 'ACCEPT' }]);
          const penaltyTask: Task = { id: 'penalty-' + now, text: 'PENALTY: Physical Conditioning (100 Reps)', completed: false, createdAt: now, category: 'Regular', skillType: 'Workout', currentCount: 0, targetCount: 100, xpValue: 0, isPenalty: true, };
          migratedTasks = [penaltyTask, ...migratedTasks];
        }
        migratedTasks = migratedTasks.map(t => (t.category === 'Regular' && !t.isPenalty) ? { ...t, completed: false, currentCount: t.targetCount ? 0 : undefined } : t);
        updatedStats.lastResetDate = now;
      }

      setTasks(migratedTasks);
      setStats(updatedStats);
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

  useEffect(() => {
    if (isInitialized) {
      saveLastUsedSettings(selectedCategory, selectedSkill);
    }
  }, [selectedCategory, selectedSkill, isInitialized]);

  const addTask = () => {
    if (taskInput.trim().length === 0) return;
    const isWorkout = selectedSkill === 'Workout';
    const reps = parseInt(targetCount) || 0;
    if (isWorkout && reps <= 0) {
      Alert.alert('System Error', 'Target reps must be greater than 0 for Workout quests.');
      return;
    }
    const dueDate = scheduledOffset > 0 ? new Date().setHours(0,0,0,0) + (scheduledOffset * 24 * 60 * 60 * 1000) : undefined;
    const newTask: Task = { id: Date.now().toString(), text: taskInput.trim(), completed: false, createdAt: Date.now(), dueDate: dueDate, category: selectedCategory, skillType: selectedSkill, currentCount: isWorkout ? 0 : undefined, targetCount: isWorkout ? reps : undefined, xpValue: selectedCategory === 'Regular' ? 10 : selectedCategory === 'OneTime' ? 50 : 200, };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
    setTaskInput('');
    setTargetCount('');
    setScheduledOffset(0);
  };

  const handleApplyTemplate = (template: QuestTemplate) => {
    setTaskInput(template.name);
    setSelectedCategory(template.category);
    setSelectedSkill(template.skillType);
    setTargetCount(template.targetCount?.toString() || '');
    setIsTemplatePickerVisible(false);
  };

  const handleToggle = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    if ((task.skillType === 'Workout' || task.isPenalty) && !task.completed) {
      if ((task.currentCount || 0) < (task.targetCount || 0)) {
        Alert.alert('Quest Requirement', 'You must complete the target reps before finishing this quest.');
        return;
      }
    }
    const newCompletedState = !task.completed;
    setTasks(prevTasks => prevTasks.map(t => t.id === id ? { ...t, completed: newCompletedState, completedAt: newCompletedState ? Date.now() : undefined } : t));
    if (newCompletedState && stats) {
      const skillProgress = stats.skills[task.skillType];
      const { updatedSkill, levelUpCount } = calculateLevelUp(skillProgress, task.xpValue);
      const newTotalLevel = stats.totalLevel + levelUpCount;
      if (levelUpCount > 0) {
        setPendingLevel(newTotalLevel);
        setShowLevelUp(true);
      }
      setStats({ ...stats, totalLevel: newTotalLevel, totalXp: stats.totalXp + task.xpValue, statPoints: stats.statPoints + (levelUpCount * 5), reputationTitle: getTitleByLevel(newTotalLevel), skills: { ...stats.skills, [task.skillType]: updatedSkill, } });
    }
  };

  const handleUpdateCount = (id: string, newCount: number) => {
    setTasks(prevTasks => prevTasks.map(t => t.id === id ? { ...t, currentCount: newCount } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter((task) => task.id !== id));
  };

  const updateTask = (id: string, newText: string) => {
    setTasks(prevTasks => prevTasks.map(task => task.id === id ? { ...task, text: newText } : task));
  };

  const categories: TaskCategory[] = ['Regular', 'OneTime', 'LongTerm'];
  const categoryLabels: Record<TaskCategory, string> = { Regular: 'DAILY', OneTime: 'ONE-TIME', LongTerm: 'LONG-TERM' };
  const skills: SkillType[] = ['Coding', 'Workout', 'Cultural', 'Sports', 'Mental'];

  const getSections = () => {
    const now = new Date().setHours(0,0,0,0);
    const visibleTasks = tasks.filter(t => !t.dueDate || t.dueDate <= now);
    const regular = visibleTasks.filter(t => t.category === 'Regular');
    const oneTime = visibleTasks.filter(t => t.category === 'OneTime');
    const longTerm = visibleTasks.filter(t => t.category === 'LongTerm');
    const sections = [];
    if (regular.length > 0) sections.push({ title: 'DAILY QUESTS', data: regular, color: CATEGORY_COLORS.Regular });
    if (oneTime.length > 0) sections.push({ title: 'ONE-TIME QUESTS', data: oneTime, color: CATEGORY_COLORS.OneTime });
    if (longTerm.length > 0) sections.push({ title: 'JOB CHANGE QUESTS', data: longTerm, color: CATEGORY_COLORS.LongTerm });
    return sections;
  };

  const ListHeader = () => (
    <>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuBtn} onPress={onOpenMenu}>
          <View style={styles.menuLine} />
          <View style={[styles.menuLine, { width: 15 }]} />
          <View style={styles.menuLine} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerSubtitle}>SYSTEM LOG</Text>
          <Text style={styles.headerTitle}>QUESTS</Text>
        </View>
        <View style={styles.headerRightPlaceholder} />
      </View>
      <View style={styles.creationPanel}>
        <View style={styles.skillSelectorContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
            {skills.map(skill => (
              <TouchableOpacity key={skill} onPress={() => setSelectedSkill(skill)} style={[ styles.selectorItem, selectedSkill === skill && { borderColor: SKILL_COLORS[skill], backgroundColor: SKILL_COLORS[skill] + '22' } ]}>
                <Text style={[styles.selectorText, selectedSkill === skill && { color: SKILL_COLORS[skill] }]}>{skill}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.categorySelectorContainer}>
          {categories.map(cat => (
            <TouchableOpacity key={cat} onPress={() => { setSelectedCategory(cat); if (cat === 'Regular') setScheduledOffset(0); }} style={[ styles.categoryItem, selectedCategory === cat && { borderColor: CATEGORY_COLORS[cat], backgroundColor: CATEGORY_COLORS[cat] + '22' } ]}>
              <Text style={[styles.categoryText, selectedCategory === cat && { color: CATEGORY_COLORS[cat] }]}>{categoryLabels[cat]}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {selectedCategory !== 'Regular' && (
          <View style={styles.scheduleContainer}>
            <Text style={styles.scheduleLabel}>SCHEDULE FOR:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[0, 1, 2, 3, 4, 5, 6, 7].map(offset => {
                const date = new Date();
                date.setDate(date.getDate() + offset);
                const isToday = offset === 0;
                return (
                  <TouchableOpacity key={offset} onPress={() => setScheduledOffset(offset)} style={[ styles.offsetItem, scheduledOffset === offset && styles.offsetItemActive ]}>
                    <Text style={[ styles.offsetText, scheduledOffset === offset && styles.offsetTextActive ]}>{isToday ? 'TODAY' : `${date.getMonth()+1}/${date.getDate()}`}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
        <View style={styles.inputRow}>
          <View style={styles.inputWrapper}>
            <TextInput style={styles.input} placeholder="[+] ENTER QUEST NAME" placeholderTextColor={COLORS.textDim} value={taskInput} onChangeText={setTaskInput} />
            <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setIsTemplatePickerVisible(true)}>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
          </View>
          {(selectedSkill === 'Workout') && (<TextInput style={styles.countInput} placeholder="REPS" placeholderTextColor={COLORS.textDim} value={targetCount} onChangeText={setTargetCount} keyboardType="numeric" />)}
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Text style={styles.addButtonText}>ADD</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      {showLevelUp && <LevelUpModal level={pendingLevel} onClose={() => setShowLevelUp(false)} />}
      <Modal visible={isTemplatePickerVisible} transparent animationType="fade" onRequestClose={() => setIsTemplatePickerVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsTemplatePickerVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>SYSTEM PRESETS: {selectedSkill.toUpperCase()}</Text>
            <View style={styles.modalDivider} />
            <ScrollView>
              {QUEST_TEMPLATES[selectedSkill].map((template) => (
                <TouchableOpacity key={template.id} style={styles.templateItem} onPress={() => handleApplyTemplate(template)}>
                  <View>
                    <Text style={styles.templateName}>{template.name}</Text>
                    <Text style={styles.templateMeta}>{template.category} • {template.xpValue} XP {template.targetCount ? ` • ${template.targetCount} Reps` : ''}</Text>
                  </View>
                  <Text style={styles.selectText}>SELECT</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
      <SectionList
        sections={getSections()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskItem item={item} onToggle={handleToggle} onDelete={deleteTask} onUpdate={updateTask} onUpdateCount={handleUpdateCount} />}
        renderSectionHeader={({ section: { title, color } }) => (
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionHeaderText, { color }]}>{title}</Text>
            <View style={[styles.sectionHeaderLine, { backgroundColor: color }]} />
          </View>
        )}
        ListHeaderComponent={<ListHeader />}
        ListEmptyComponent={<View><ListHeader /><Text style={styles.emptyText}>- NO ACTIVE QUESTS -</Text></View>}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{paddingBottom: 40}}
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuBtn: { width: 40, height: 40, justifyContent: 'center' },
  menuLine: { height: 2, width: 25, backgroundColor: COLORS.primary, marginBottom: 5, ...SHADOWS.glow },
  headerTitleContainer: { alignItems: 'center' },
  headerSubtitle: { color: COLORS.primary, fontSize: 10, fontWeight: 'bold', letterSpacing: 2 },
  headerTitle: { color: COLORS.text, fontSize: 24, fontWeight: '900' },
  headerRightPlaceholder: { width: 40 },
  creationPanel: { paddingHorizontal: 20, paddingTop: 15 },
  skillSelectorContainer: { marginBottom: 10, height: 35 },
  selectorScroll: { flex: 1 },
  selectorItem: { paddingHorizontal: 15, height: 30, justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border, marginRight: 10, backgroundColor: COLORS.surface },
  selectorText: { color: COLORS.textDim, fontSize: 10, fontWeight: 'bold' },
  categorySelectorContainer: { flexDirection: 'row', marginBottom: 10 },
  categoryItem: { flex: 1, height: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, marginRight: 5, backgroundColor: COLORS.surface },
  categoryText: { color: COLORS.textDim, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  scheduleContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: COLORS.surface, padding: 5, borderWidth: 1, borderColor: COLORS.border, },
  scheduleLabel: { color: COLORS.primary, fontSize: 8, fontWeight: '900', marginRight: 10, marginLeft: 5 },
  offsetItem: { paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: 'transparent', marginRight: 5, },
  offsetItemActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '22' },
  offsetText: { color: COLORS.textDim, fontSize: 9, fontWeight: 'bold' },
  offsetTextActive: { color: COLORS.primary },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  inputWrapper: { flex: 1, flexDirection: 'row', backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', },
  input: { flex: 1, height: 45, paddingHorizontal: 15, color: COLORS.text, fontSize: 13, fontWeight: 'bold' },
  dropdownTrigger: { paddingHorizontal: 12, height: '100%', justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: COLORS.border, },
  dropdownIcon: { color: COLORS.primary, fontSize: 10 },
  countInput: { width: 60, height: 45, borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.border, textAlign: 'center', color: COLORS.primary, fontWeight: 'bold', backgroundColor: COLORS.surface, },
  addButton: { paddingHorizontal: 15, height: 45, justifyContent: 'center', backgroundColor: COLORS.primary, ...SHADOWS.glow },
  addButtonText: { color: COLORS.background, fontSize: 11, fontWeight: '900' },
  emptyText: { color: COLORS.textDim, textAlign: 'center', marginTop: 40, fontSize: 12, letterSpacing: 2, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 25, marginBottom: 12, paddingHorizontal: 20 },
  sectionHeaderText: { fontSize: 10, fontWeight: '900', letterSpacing: 2, marginRight: 10 },
  sectionHeaderLine: { flex: 1, height: 1, opacity: 0.3 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20, },
  modalContent: { width: '100%', maxHeight: '70%', backgroundColor: COLORS.surface, borderWidth: 2, borderColor: COLORS.primary, padding: 20, ...SHADOWS.glow, },
  modalTitle: { color: COLORS.primary, fontSize: 14, fontWeight: '900', letterSpacing: 2, marginBottom: 10, textAlign: 'center' },
  modalDivider: { height: 1, backgroundColor: COLORS.primary, marginBottom: 15, opacity: 0.5 },
  templateItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: COLORS.border, },
  templateName: { color: COLORS.text, fontSize: 14, fontWeight: 'bold' },
  templateMeta: { color: COLORS.textDim, fontSize: 10, marginTop: 4 },
  selectText: { color: COLORS.primary, fontSize: 10, fontWeight: '900' }
});

export default HomeScreen;
