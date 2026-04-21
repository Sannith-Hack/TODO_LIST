import React, { useState, useEffect, memo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, SectionList, TouchableOpacity, TextInput, ScrollView, Alert, Modal, Keyboard, Platform, LayoutAnimation, UIManager } from 'react-native';
import { COLORS, SHADOWS, SKILL_COLORS, CATEGORY_COLORS, getRankTheme } from '../utils/theme';
import { Task, TaskCategory, SkillType, UserStats, TaskFrequency } from '../utils/types';
import { saveTasks, loadTasks, saveStats, calculateLevelUp, getTitleByLevel, addToHistory } from '../storage/taskStorage';
import { QUEST_TEMPLATES } from '../utils/templates';
import { updateSystemNotifications } from '../utils/notifications';
import TaskItem from '../components/TaskItem';
import { triggerHaptic, playSound, FEEDBACK_SOUNDS } from '../utils/feedback';
import LevelUpModal from '../components/LevelUpModal';
import { ParticleEffect } from '../components/ParticleEffect';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Memoized Creation Panel to prevent keyboard focus loss
const CreationPanel = memo(({ onAdd, onShowTemplates, selectedSkill, setSelectedSkill, selectedCategory, setSelectedCategory, scheduledDays, setScheduledDays, deadlineDays, setDeadlineDays, taskInput, setTaskInput, targetCount, setTargetCount, primaryColor, frequency, setFrequency, searchQuery, setSearchQuery, isArchiveVisible, setIsArchiveVisible, recurringDays, setRecurringDays }: any) => (
    <View style={styles.creationPanel}>
        <View style={styles.searchRow}>
          <TextInput 
            style={styles.searchInput} 
            placeholder="SEARCH QUESTS..." 
            placeholderTextColor={COLORS.textDim} 
            value={searchQuery} 
            onChangeText={setSearchQuery} 
          />
          <TouchableOpacity 
            style={[styles.archiveToggle, isArchiveVisible && { borderColor: COLORS.accent, backgroundColor: COLORS.accent + '22' }]} 
            onPress={() => setIsArchiveVisible(!isArchiveVisible)}
          >
            <Text style={[styles.archiveToggleText, isArchiveVisible && { color: COLORS.accent }]}>ARCHIVE</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.creationHeader}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {(['Coding', 'Workout', 'Cultural', 'Sports', 'Mental'] as SkillType[]).map(s => (
                    <TouchableOpacity key={s} onPress={() => setSelectedSkill(s)} style={[styles.selectorItem, selectedSkill === s && { borderColor: SKILL_COLORS[s], backgroundColor: SKILL_COLORS[s] + '22' }]}>
                        <Text style={[styles.selectorText, selectedSkill === s && { color: SKILL_COLORS[s] }]}>{s}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <TouchableOpacity style={[styles.templateToggle, { borderColor: primaryColor, backgroundColor: primaryColor + '11' }]} onPress={onShowTemplates}><Text style={[styles.templateToggleText, { color: primaryColor }]}>PRESETS</Text></TouchableOpacity>
        </View>
        <View style={styles.categorySelectorContainer}>
            {(['Regular', 'OneTime', 'LongTerm'] as TaskCategory[]).map(cat => (
                <TouchableOpacity key={cat} onPress={() => setSelectedCategory(cat)} style={[styles.categoryItem, selectedCategory === cat && { borderColor: CATEGORY_COLORS[cat], backgroundColor: CATEGORY_COLORS[cat] + '22' }]}>
                    <Text style={[styles.categoryText, selectedCategory === cat && { color: CATEGORY_COLORS[cat] }]}>{cat.toUpperCase()}</Text>
                </TouchableOpacity>
            ))}
        </View>

        {selectedCategory === 'Regular' && (
          <View style={styles.scheduleContainer}>
            <Text style={[styles.scheduleLabel, { color: primaryColor }]}>TYPE:</Text>
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              {(['Daily', 'Weekly', 'Custom'] as TaskFrequency[]).map(f => (
                  <TouchableOpacity key={f} onPress={() => setFrequency(f)} style={[styles.offsetItem, frequency === f && { borderColor: primaryColor, backgroundColor: primaryColor + '22' }]}>
                      <Text style={[styles.offsetText, frequency === f && { color: primaryColor, fontWeight: 'bold' }]}>{f.toUpperCase()}</Text>
                  </TouchableOpacity>
              ))}
              {frequency === 'Custom' && (
                <TextInput 
                  style={[styles.smallInput, { borderColor: primaryColor }]} 
                  placeholder="DAYS" 
                  placeholderTextColor={COLORS.textDim} 
                  value={recurringDays} 
                  onChangeText={setRecurringDays} 
                  keyboardType="numeric" 
                />
              )}
            </View>
          </View>
        )}

        {selectedCategory !== 'Regular' && (
          <View style={styles.scheduleContainer}>
            <Text style={[styles.scheduleLabel, { color: primaryColor }]}>START:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[0, 1, 2, 3, 4, 5, 6, 7].map(offset => (
                <TouchableOpacity key={offset} onPress={() => setScheduledDays(offset)} style={[styles.offsetItem, scheduledDays === offset && { borderColor: primaryColor, backgroundColor: primaryColor + '22' }]}>
                    <Text style={[styles.offsetText, scheduledDays === offset && { color: primaryColor, fontWeight: 'bold' }]}>{offset === 0 ? 'TODAY' : `+${offset}D`}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        {selectedCategory === 'LongTerm' && (
          <View style={styles.scheduleContainer}>
            <Text style={[styles.scheduleLabel, { color: primaryColor }]}>LIMIT:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[0, 3, 7, 14, 30].map(offset => (
                <TouchableOpacity key={offset} onPress={() => setDeadlineDays(offset)} style={[styles.offsetItem, deadlineDays === offset && { borderColor: COLORS.danger, backgroundColor: COLORS.danger + '22' }]}>
                    <Text style={[styles.offsetText, deadlineDays === offset && { color: COLORS.danger, fontWeight: 'bold' }]}>{offset === 0 ? 'UNLIMITED' : `${offset} DAYS`}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        <View style={styles.inputRow}>
            <TextInput style={styles.input} placeholder="[+] QUEST NAME" placeholderTextColor={COLORS.textDim} value={taskInput} onChangeText={setTaskInput} />
            <TouchableOpacity style={[styles.addButton, { backgroundColor: primaryColor }]} onPress={onAdd}><Text style={styles.addButtonText}>ADD</Text></TouchableOpacity>
        </View>
        {selectedSkill === 'Workout' && (
            <TextInput style={[styles.input, {marginTop: 10}]} placeholder="[+] REPS (e.g. 50)" placeholderTextColor={COLORS.textDim} value={targetCount} onChangeText={setTargetCount} keyboardType="numeric" />
        )}
    </View>
));

const HomeScreen = ({ onOpenMenu, stats, refreshStats }: { onOpenMenu: () => void, stats: UserStats | null, refreshStats: () => void }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory>('Regular');
  const [selectedSkill, setSelectedSkill] = useState<SkillType>('Coding');
  const [targetCount, setTargetCount] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [scheduledDays, setScheduledDays] = useState(0);
  const [deadlineDays, setDeadlineDays] = useState(0);
  const [isTemplatePickerVisible, setIsTemplatePickerVisible] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ level: number } | null>(null);
  const [userRank, setUserRank] = useState('E');
  const [deletingTask, setDeletingTask] = useState<{ id: string, x: number, y: number, color: string } | null>(null);
  const [frequency, setFrequency] = useState<TaskFrequency>('Daily');
  const [recurringDays, setRecurringDays] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [isArchiveVisible, setIsArchiveVisible] = useState(false);

  const rankTheme = getRankTheme(userRank);
  const primaryColor = rankTheme.primary;

  useEffect(() => {
    const initializeSystem = async () => {
      const loadedTasks = await loadTasks();
      if (!stats) return;
      
      const rank = stats.reputationTitle.split('-')[0];
      setUserRank(rank || 'E');

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const lastReset = new Date(stats.lastResetDate);
      const lastResetDay = new Date(lastReset.getFullYear(), lastReset.getMonth(), lastReset.getDate()).getTime();

      let currentTasks = [...loadedTasks];
      let statsUpdated = false;
      const updatedStats = { ...stats };

      // Day Reset Logic
      if (today > lastResetDay) {
        const missedDailies = currentTasks.filter(t => t.category === 'Regular' && !t.completed && (!t.frequency || t.frequency === 'Daily'));
        if (missedDailies.length > 0) {
          const penaltyQuest: Task = {
            id: 'penalty-' + Date.now(),
            text: `PENALTY: COMPLETE MISSED PROTOCOLS (${missedDailies.length})`,
            completed: false, createdAt: Date.now(), category: 'Regular', skillType: 'Workout', xpValue: 0, isPenalty: true, currentCount: 0,
            targetCount: missedDailies.length * 50 
          };
          currentTasks.push(penaltyQuest);
          Alert.alert('SYSTEM ERROR', 'Daily protocols were incomplete. Penalty Quest has been issued.');
        }

        currentTasks = currentTasks.map(t => {
          if (t.category !== 'Regular' || t.isPenalty) return t;
          let shouldReset = false;
          const daysSinceCreation = Math.floor((today - new Date(t.createdAt).setHours(0,0,0,0)) / (24 * 60 * 60 * 1000));
          if (!t.frequency || t.frequency === 'Daily') shouldReset = true;
          else if (t.frequency === 'Weekly') shouldReset = daysSinceCreation % 7 === 0;
          else if (t.frequency === 'Custom' && t.recurringDays) shouldReset = daysSinceCreation % t.recurringDays === 0;
          if (shouldReset) return { ...t, completed: false, currentCount: t.skillType === 'Workout' ? 0 : t.currentCount };
          return t;
        });
        updatedStats.lastResetDate = Date.now();
        statsUpdated = true;
      }

      const expiredLongTerm = currentTasks.filter(t => t.category === 'LongTerm' && !t.completed && t.deadline && t.deadline < today);
      if (expiredLongTerm.length > 0) {
        currentTasks = currentTasks.map(t => {
          if (t.category === 'LongTerm' && !t.completed && t.deadline && t.deadline < today) return { ...t, isPenalty: true, text: `[FAILED] ${t.text}` };
          return t;
        });
        Alert.alert('QUEST FAILURE', 'One or more Long-Term quests have expired.');
      }

      setTasks(currentTasks);
      if (statsUpdated) {
          await saveStats(updatedStats);
          refreshStats();
      }
      setIsInitialized(true);
    };
    initializeSystem();
  }, [stats === null]); // Only run once when stats become available

  useEffect(() => { 
    if (isInitialized) {
      saveTasks(tasks);
    }
  }, [tasks, isInitialized]);

  const addTask = () => {
    if (taskInput.trim() === '') return;
    const now = new Date().setHours(0,0,0,0);
    const dueDate = scheduledDays > 0 ? now + (scheduledDays * 24 * 60 * 60 * 1000) : undefined;
    const deadline = deadlineDays > 0 ? (dueDate || now) + (deadlineDays * 24 * 60 * 60 * 1000) : undefined;
    
    const newTask: Task = { 
        id: Date.now().toString(), text: taskInput.trim(), completed: false, createdAt: Date.now(), dueDate, deadline,
        category: selectedCategory, skillType: selectedSkill, xpValue: 10,
        currentCount: selectedSkill === 'Workout' ? 0 : undefined,
        targetCount: selectedSkill === 'Workout' ? parseInt(targetCount) || 0 : undefined,
        frequency: selectedCategory === 'Regular' ? frequency : undefined,
        recurringDays: frequency === 'Custom' ? parseInt(recurringDays) || 1 : undefined
    };
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(prev => [newTask, ...prev]);
    setTaskInput(''); setTargetCount(''); setScheduledDays(0); setDeadlineDays(0);
  };

  const toggleSubTask = (taskId: string, subTaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedSubTasks = t.subTasks?.map(st => st.id === subTaskId ? { ...st, completed: !st.completed } : st);
        return { ...t, subTasks: updatedSubTasks };
      }
      return t;
    }));
    triggerHaptic('impactLight');
  };

  const addSubTask = (taskId: string, text: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const newST = { id: Date.now().toString(), text, completed: false };
        return { ...t, subTasks: [...(t.subTasks || []), newST] };
      }
      return t;
    }));
    triggerHaptic('impactMedium');
  };

  const archiveTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isArchived: true } : t));
    triggerHaptic('impactMedium');
  };

  const unarchiveTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isArchived: false } : t));
    triggerHaptic('impactMedium');
  };

  const getSections = () => {
    const now = new Date().setHours(0,0,0,0);
    let filtered = tasks;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t => t.text.toLowerCase().includes(q) || t.skillType.toLowerCase().includes(q));
    }
    if (!isArchiveVisible) filtered = filtered.filter(t => !t.isArchived);
    else filtered = filtered.filter(t => t.isArchived);

    const visible = filtered.filter(t => !t.dueDate || t.dueDate <= now);
    const sortTasks = (data: Task[]) => [...data].sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });
    const prefix = isArchiveVisible ? 'ARCHIVED ' : '';
    return [
        { title: prefix + 'DAILY', data: sortTasks(visible.filter(t => t.category === 'Regular')) },
        { title: prefix + 'ONE-TIME', data: sortTasks(visible.filter(t => t.category === 'OneTime')) },
        { title: prefix + 'LONG-TERM', data: sortTasks(visible.filter(t => t.category === 'LongTerm')) }
    ].filter(s => s.data.length > 0);
  };

  const toggleTask = async (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const updatedTasks = tasks.map(t => {
      if (t.id === id) {
        const completed = !t.completed;
        if (completed) addToHistory(t);
        return { ...t, completed, completedAt: completed ? Date.now() : undefined };
      }
      return t;
    });
    setTasks(updatedTasks);

    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) { // If it was just completed
      if (task.isPenalty) {
        triggerHaptic('notificationWarning');
        playSound(FEEDBACK_SOUNDS.PENALTY_COMPLETE);
      } else {
        triggerHaptic('notificationSuccess');
        playSound(FEEDBACK_SOUNDS.QUEST_COMPLETE);
        
        // Handle XP Gain
        if (stats) {
          const skill = task.skillType;
          const xpGain = task.xpValue || 10;
          const { updatedSkill, levelUpCount } = calculateLevelUp(stats.skills[skill], xpGain);
          const newStats = { ...stats };
          newStats.skills[skill] = updatedSkill;
          newStats.totalXp += xpGain;
          if (levelUpCount > 0) {
            newStats.totalLevel += levelUpCount;
            newStats.statPoints += levelUpCount * 3;
            newStats.reputationTitle = getTitleByLevel(newStats.totalLevel);
            setLevelUpData({ level: newStats.totalLevel });
            triggerHaptic('impactHeavy');
            playSound(FEEDBACK_SOUNDS.LEVEL_UP);
            const newRank = newStats.reputationTitle.split('-')[0];
            setUserRank(newRank || 'E');
          }
          await saveStats(newStats);
          refreshStats();
        }
      }
    }
  };

  const updateTaskCount = async (id: string, c: number) => {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return;
    
    const task = tasks[taskIndex];
    const updatedTask = { ...task, currentCount: c };
    let justCompleted = false;

    if (task.targetCount && c >= task.targetCount && !task.completed) {
      updatedTask.completed = true;
      updatedTask.completedAt = Date.now();
      addToHistory(updatedTask);
      justCompleted = true;
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }

    const newTasks = [...tasks];
    newTasks[taskIndex] = updatedTask;
    setTasks(newTasks);

    if (justCompleted) {
      if (task.isPenalty) {
        triggerHaptic('notificationWarning');
        playSound(FEEDBACK_SOUNDS.PENALTY_COMPLETE);
      } else {
        triggerHaptic('notificationSuccess');
        playSound(FEEDBACK_SOUNDS.QUEST_COMPLETE);
        if (stats) {
          const skill = task.skillType;
          const xpGain = task.xpValue || 10;
          const { updatedSkill, levelUpCount } = calculateLevelUp(stats.skills[skill], xpGain);
          const newStats = { ...stats };
          newStats.skills[skill] = updatedSkill;
          newStats.totalXp += xpGain;
          if (levelUpCount > 0) {
            newStats.totalLevel += levelUpCount;
            newStats.statPoints += levelUpCount * 3;
            newStats.reputationTitle = getTitleByLevel(newStats.totalLevel);
            setLevelUpData({ level: newStats.totalLevel });
            triggerHaptic('impactHeavy');
            playSound(FEEDBACK_SOUNDS.LEVEL_UP);
            const newRank = newStats.reputationTitle.split('-')[0];
            setUserRank(newRank || 'E');
          }
          await saveStats(newStats);
          refreshStats();
        }
      }
    } else {
      triggerHaptic(task.isPenalty ? 'impactMedium' : 'impactLight');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={onOpenMenu}><Text style={[styles.menuText, { color: primaryColor }]}>MENU</Text></TouchableOpacity>
            <Text style={[styles.title, { color: primaryColor }]}>QUEST LOG</Text>
            <View style={{width: 40}} />
        </View>
        <SectionList
            sections={getSections()}
            keyExtractor={t => t.id}
            renderItem={({ item }) => <TaskItem 
              item={item} onToggle={toggleTask} 
              onDelete={(id) => {
                setDeletingTask({ id, x: 100, y: 300, color: SKILL_COLORS[item.skillType] || primaryColor });
                setTimeout(() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  setTasks(prev => prev.filter(t => t.id !== id));
                  triggerHaptic('impactMedium');
                }, 300);
              }} 
              onUpdate={(id, text) => setTasks(prev => prev.map(t => t.id === id ? {...t, text} : t))} 
              onUpdateCount={updateTaskCount} onToggleSubTask={toggleSubTask} onAddSubTask={addSubTask} onArchive={archiveTask} onUnarchive={unarchiveTask}
            />}
            ListHeaderComponent={<CreationPanel 
              onAdd={() => { addTask(); triggerHaptic('impactMedium'); }} 
              onShowTemplates={() => { setIsTemplatePickerVisible(true); triggerHaptic('impactLight'); }} 
              selectedSkill={selectedSkill} setSelectedSkill={(s: any) => { setSelectedSkill(s); triggerHaptic('impactLight'); }} 
              selectedCategory={selectedCategory} setSelectedCategory={(c: any) => { setSelectedCategory(c); triggerHaptic('impactLight'); }} 
              scheduledDays={scheduledDays} setScheduledDays={(d: any) => { setScheduledDays(d); triggerHaptic('impactLight'); }} 
              deadlineDays={deadlineDays} setDeadlineDays={(d: any) => { setDeadlineDays(d); triggerHaptic('impactLight'); }} 
              taskInput={taskInput} setTaskInput={setTaskInput} targetCount={targetCount} setTargetCount={setTargetCount} primaryColor={primaryColor} 
              frequency={frequency} setFrequency={setFrequency} recurringDays={recurringDays} setRecurringDays={setRecurringDays}
              searchQuery={searchQuery} setSearchQuery={setSearchQuery} isArchiveVisible={isArchiveVisible} setIsArchiveVisible={setIsArchiveVisible} 
            />}
        />
        {deletingTask && (
          <ParticleEffect x={deletingTask.x} y={deletingTask.y} color={deletingTask.color} onComplete={() => setDeletingTask(null)} />
        )}
        <Modal visible={isTemplatePickerVisible} transparent animationType="fade" onRequestClose={() => setIsTemplatePickerVisible(false)}>
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsTemplatePickerVisible(false)}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>PRESETS</Text>
                    <ScrollView>
                        {QUEST_TEMPLATES[selectedSkill].map((t) => (
                            <TouchableOpacity key={t.id} style={styles.templateItem} onPress={() => { setTaskInput(t.name); setTargetCount(t.targetCount?.toString() || ''); setSelectedCategory(t.category); setIsTemplatePickerVisible(false); triggerHaptic('impactMedium'); }}>
                                <Text style={styles.templateName}>{t.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </TouchableOpacity>
        </Modal>
        {levelUpData && <LevelUpModal level={levelUpData.level} onClose={() => setLevelUpData(null)} />}
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
  smallInput: { width: 50, height: 35, backgroundColor: COLORS.surface, color: COLORS.text, paddingHorizontal: 5, fontSize: 10, borderWidth: 1, marginLeft: 10, textAlign: 'center' },
  searchRow: { flexDirection: 'row', marginBottom: 15, alignItems: 'center' },
  searchInput: { flex: 1, backgroundColor: COLORS.surface, color: COLORS.text, height: 35, paddingHorizontal: 15, fontSize: 11, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  archiveToggle: { marginLeft: 10, paddingHorizontal: 10, height: 35, justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  archiveToggleText: { color: COLORS.textDim, fontSize: 9, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 40 },
  modalContent: { backgroundColor: COLORS.surface, padding: 20, width: '100%' },
  modalTitle: { color: COLORS.primary, fontWeight: 'bold', marginBottom: 10 },
  templateItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  templateName: { color: COLORS.text }
});

export default HomeScreen;
