import React, { useState, useEffect, memo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, SectionList, TouchableOpacity, TextInput, ScrollView, Alert, Modal, Keyboard, Platform, LayoutAnimation, UIManager } from 'react-native';
import { COLORS, SHADOWS, SKILL_COLORS, CATEGORY_COLORS } from '../utils/theme';
import { Task, TaskCategory, SkillType, UserStats } from '../utils/types';
import { saveTasks, loadTasks, saveStats, loadStats, calculateLevelUp, getTitleByLevel, saveLastUsedSettings, loadLastUsedSettings, addToHistory } from '../storage/taskStorage';
import { QUEST_TEMPLATES } from '../utils/templates';
import { updateSystemNotifications } from '../utils/notifications';
import TaskItem from '../components/TaskItem';
import { triggerHaptic, playSound, FEEDBACK_SOUNDS } from '../utils/feedback';
import LevelUpModal from '../components/LevelUpModal';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Memoized Creation Panel to prevent keyboard focus loss
const CreationPanel = memo(({ onAdd, onShowTemplates, selectedSkill, setSelectedSkill, selectedCategory, setSelectedCategory, scheduledDays, setScheduledDays, deadlineDays, setDeadlineDays, taskInput, setTaskInput, targetCount, setTargetCount }: any) => (
    <View style={styles.creationPanel}>
        <View style={styles.creationHeader}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {(['Coding', 'Workout', 'Cultural', 'Sports', 'Mental'] as SkillType[]).map(s => (
                    <TouchableOpacity key={s} onPress={() => setSelectedSkill(s)} style={[styles.selectorItem, selectedSkill === s && { borderColor: SKILL_COLORS[s], backgroundColor: SKILL_COLORS[s] + '22' }]}>
                        <Text style={[styles.selectorText, selectedSkill === s && { color: SKILL_COLORS[s] }]}>{s}</Text>
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
            <Text style={styles.scheduleLabel}>START:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[0, 1, 2, 3, 4, 5, 6, 7].map(offset => (
                <TouchableOpacity key={offset} onPress={() => setScheduledDays(offset)} style={[styles.offsetItem, scheduledDays === offset && styles.offsetItemActive]}>
                    <Text style={[styles.offsetText, scheduledDays === offset && styles.offsetTextActive]}>{offset === 0 ? 'TODAY' : `+${offset}D`}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        {selectedCategory === 'LongTerm' && (
          <View style={styles.scheduleContainer}>
            <Text style={styles.scheduleLabel}>LIMIT:</Text>
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
  const [deadlineDays, setDeadlineDays] = useState(0);
  const [isTemplatePickerVisible, setIsTemplatePickerVisible] = useState(false);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [levelUpData, setLevelUpData] = useState<{ level: number } | null>(null);

  useEffect(() => {
    const initializeSystem = async () => {
      const loadedTasks = await loadTasks();
      const loadedStats = await loadStats();
// ... (rest of initializeSystem)

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const lastReset = new Date(loadedStats.lastResetDate);
      const lastResetDay = new Date(lastReset.getFullYear(), lastReset.getMonth(), lastReset.getDate()).getTime();

      let currentTasks = [...loadedTasks];
      let statsUpdated = false;

      // Day Reset Logic
      if (today > lastResetDay) {
        // 1. Identify missed daily quests
        const missedDailies = currentTasks.filter(t => t.category === 'Regular' && !t.completed);
        
        // 2. Add Penalty Quest if any missed
        if (missedDailies.length > 0) {
          const penaltyQuest: Task = {
            id: 'penalty-' + Date.now(),
            text: `PENALTY: COMPLETE MISSED PROTOCOLS (${missedDailies.length})`,
            completed: false,
            createdAt: Date.now(),
            category: 'Regular',
            skillType: 'Workout', // Penalties are always physical
            xpValue: 0,
            isPenalty: true,
            currentCount: 0,
            targetCount: missedDailies.length * 50 // 50 reps per missed quest
          };
          currentTasks.push(penaltyQuest);
          Alert.alert('SYSTEM ERROR', 'Daily protocols were incomplete. Penalty Quest has been issued.');
        }

        // 3. Reset all daily tasks for the new day
        currentTasks = currentTasks.map(t => 
          t.category === 'Regular' && !t.isPenalty ? { ...t, completed: false, currentCount: t.skillType === 'Workout' ? 0 : t.currentCount } : t
        );

        // 4. Update last reset date
        loadedStats.lastResetDate = Date.now();
        statsUpdated = true;
      }

      // Check for Expired Long-Term Quests
      const expiredLongTerm = currentTasks.filter(t => t.category === 'LongTerm' && !t.completed && t.deadline && t.deadline < today);
      if (expiredLongTerm.length > 0) {
        currentTasks = currentTasks.map(t => {
          if (t.category === 'LongTerm' && !t.completed && t.deadline && t.deadline < today) {
            return { ...t, isPenalty: true, text: `[FAILED] ${t.text}` };
          }
          return t;
        });
        Alert.alert('QUEST FAILURE', 'One or more Long-Term quests have expired.');
      }

      setTasks(currentTasks);
      setStats(loadedStats);
      if (statsUpdated) await saveStats(loadedStats);
      setIsInitialized(true);
    };

    initializeSystem();
  }, []);

  useEffect(() => { 
    if (isInitialized) {
      saveTasks(tasks);
      if (stats) updateSystemNotifications(tasks, stats);
    }
  }, [tasks, stats, isInitialized]);

  const addTask = () => {
    if (taskInput.trim() === '') return;
    const now = new Date().setHours(0,0,0,0);
    const dueDate = scheduledDays > 0 ? now + (scheduledDays * 24 * 60 * 60 * 1000) : undefined;
    const deadline = deadlineDays > 0 ? (dueDate || now) + (deadlineDays * 24 * 60 * 60 * 1000) : undefined;
    
    const newTask: Task = { 
        id: Date.now().toString(), text: taskInput.trim(), completed: false, createdAt: Date.now(), dueDate, deadline,
        category: selectedCategory, skillType: selectedSkill, xpValue: 10,
        currentCount: selectedSkill === 'Workout' ? 0 : undefined,
        targetCount: selectedSkill === 'Workout' ? parseInt(targetCount) || 0 : undefined
    };
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(prev => [newTask, ...prev]);
    setTaskInput(''); setTargetCount(''); setScheduledDays(0); setDeadlineDays(0);
  };

  const getSections = () => {
    const now = new Date().setHours(0,0,0,0);
    const visible = tasks.filter(t => !t.dueDate || t.dueDate <= now);
    
    const sortTasks = (data: Task[]) => [...data].sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });

    return [
        { title: 'DAILY', data: sortTasks(visible.filter(t => t.category === 'Regular')) },
        { title: 'ONE-TIME', data: sortTasks(visible.filter(t => t.category === 'OneTime')) },
        { title: 'LONG-TERM', data: sortTasks(visible.filter(t => t.category === 'LongTerm')) }
    ].filter(s => s.data.length > 0);
  };

  const toggleTask = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const completed = !t.completed;
        if (completed) {
          addToHistory(t);
          triggerHaptic('notificationSuccess');
          playSound(FEEDBACK_SOUNDS.QUEST_COMPLETE);
          
          // Handle XP Gain
          if (stats) {
            const skill = t.skillType;
            const xpGain = t.xpValue || 10;
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
            }
            setStats(newStats);
          }
        }
        return { ...t, completed, completedAt: completed ? Date.now() : undefined };
      }
      return t;
    }));
  };

  const updateTaskCount = (id: string, c: number) => {
    setTasks(prev => {
      const taskIndex = prev.findIndex(t => t.id === id);
      if (taskIndex === -1) return prev;
      
      const task = prev[taskIndex];
      const updatedTask = { ...task, currentCount: c };
      
      if (task.targetCount && c >= task.targetCount && !task.completed) {
        updatedTask.completed = true;
        updatedTask.completedAt = Date.now();
        addToHistory(updatedTask);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        
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
          }
          setStats(newStats);
        }
      } else {
        triggerHaptic('impactLight');
      }
      
      const newTasks = [...prev];
      newTasks[taskIndex] = updatedTask;
      return newTasks;
    });
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
            renderItem={({ item }) => <TaskItem 
              item={item} 
              onToggle={toggleTask} 
              onDelete={(id) => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setTasks(prev => prev.filter(t => t.id !== id));
                triggerHaptic('impactMedium');
              }} 
              onUpdate={(id, text) => setTasks(prev => prev.map(t => t.id === id ? {...t, text} : t))} 
              onUpdateCount={updateTaskCount} 
            />}
            ListHeaderComponent={<CreationPanel onAdd={() => { addTask(); triggerHaptic('impactMedium'); }} onShowTemplates={() => { setIsTemplatePickerVisible(true); triggerHaptic('impactLight'); }} selectedSkill={selectedSkill} setSelectedSkill={(s: any) => { setSelectedSkill(s); triggerHaptic('impactLight'); }} selectedCategory={selectedCategory} setSelectedCategory={(c: any) => { setSelectedCategory(c); triggerHaptic('impactLight'); }} scheduledDays={scheduledDays} setScheduledDays={(d: any) => { setScheduledDays(d); triggerHaptic('impactLight'); }} deadlineDays={deadlineDays} setDeadlineDays={(d: any) => { setDeadlineDays(d); triggerHaptic('impactLight'); }} taskInput={taskInput} setTaskInput={setTaskInput} targetCount={targetCount} setTargetCount={setTargetCount} />}
        />
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
        {levelUpData && (
          <LevelUpModal 
            level={levelUpData.level} 
            onClose={() => setLevelUpData(null)} 
          />
        )}
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
