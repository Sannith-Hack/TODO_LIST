import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { COLORS, getColors, SHADOWS, SKILL_COLORS, CATEGORY_COLORS } from '../utils/theme';
import { Task, SubTask } from '../utils/types';

interface TaskItemProps {
  item: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
  onUpdateCount?: (id: string, newCount: number) => void;
  onToggleSubTask?: (taskId: string, subTaskId: string) => void;
  onAddSubTask?: (taskId: string, text: string) => void;
  onArchive?: (id: string) => void;
  onUnarchive?: (id: string) => void;
  theme?: 'dark' | 'light';
}

const TaskItem = ({ item, onToggle, onDelete, onUpdate, onUpdateCount, onToggleSubTask, onAddSubTask, onArchive, onUnarchive, theme = 'dark' }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);
  const [newSubTask, setNewSubTask] = useState('');
  const [showSubTasks, setShowSubTasks] = useState(false);

  const colors = getColors(theme);

  const handleUpdate = () => {
    if (editText.trim().length > 0) {
      onUpdate(item.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(item.text);
    setIsEditing(false);
  };

  const handleIncrement = (amount: number = 1) => {
    if (onUpdateCount && item.currentCount !== undefined) {
      const newCount = item.currentCount + amount;
      onUpdateCount(item.id, newCount);
    }
  };

  const handleDecrement = () => {
    if (onUpdateCount && item.currentCount !== undefined && item.currentCount > 0) {
      onUpdateCount(item.id, item.currentCount - 1);
    }
  };

  const handleAddSubTask = () => {
    if (newSubTask.trim() && onAddSubTask) {
      onAddSubTask(item.id, newSubTask.trim());
      setNewSubTask('');
    }
  };

  const isWorkout = (item.skillType === 'Workout' || item.isPenalty) && item.currentCount !== undefined;
  const itemColor = item.isPenalty ? colors.danger : SKILL_COLORS[item.skillType];

  return (
    <View style={[
      styles.taskItem, 
      { backgroundColor: colors.surface, borderColor: colors.border },
      item.completed && styles.taskItemCompleted,
      { borderLeftColor: itemColor },
      item.isPenalty && { borderColor: colors.danger, borderWidth: 1 }
    ]}>
      {!isEditing && (
        <TouchableOpacity 
          style={styles.checkboxContainer} 
          onPress={() => onToggle(item.id)}
        >
          <View style={[
            styles.checkbox, 
            { borderColor: itemColor },
            item.completed && { backgroundColor: itemColor, ...SHADOWS.glowCustom(itemColor) }
          ]} />
        </TouchableOpacity>
      )}
      
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <View style={[
            styles.badge, 
            { backgroundColor: item.isPenalty ? colors.danger + '33' : CATEGORY_COLORS[item.category] + '33', 
              borderColor: item.isPenalty ? colors.danger : CATEGORY_COLORS[item.category] }
          ]}>
            <Text style={[styles.badgeText, { color: item.isPenalty ? colors.danger : CATEGORY_COLORS[item.category] }]}>
              {item.isPenalty ? 'PENALTY' : item.category.toUpperCase()}
            </Text>
          </View>
          <View style={[styles.rankBadge, { borderColor: COLORS[item.difficulty as keyof typeof COLORS] || colors.primary }]}>
            <Text style={[styles.rankBadgeText, { color: COLORS[item.difficulty as keyof typeof COLORS] || colors.primary }]}>
              {item.difficulty}-RANK
            </Text>
          </View>
          <Text style={[styles.skillLabel, { color: itemColor }]}>
            {item.isPenalty ? 'SYSTEM' : item.skillType}
          </Text>
          <Text style={[styles.xpLabel, { color: colors.success }]}>
            +{item.xpValue} XP
          </Text>
          {item.deadline && !item.completed && (
            <Text style={[styles.deadlineText, { color: colors.danger }]}>
              LIMIT: {new Date(item.deadline).toLocaleDateString()}
            </Text>
          )}
        </View>

        {isEditing ? (
          <TextInput
            style={[styles.editInput, { color: colors.primary }]}
            value={editText}
            onChangeText={setEditText}
            autoFocus
            onSubmitEditing={handleUpdate}
            onBlur={handleCancel}
          />
        ) : (
          <Text 
            style={[
              styles.taskText, 
              { color: colors.text },
              item.completed && { color: colors.textDim, textDecorationLine: 'line-through' },
              item.isPenalty && { color: colors.danger, fontWeight: 'bold' }
            ]}
            onPress={() => onToggle(item.id)}
          >
            {item.text}
          </Text>
        )}

        {isWorkout && !isEditing && (
          <View style={styles.workoutControls}>
            <View style={[styles.counterContainer, { backgroundColor: colors.background, borderColor: colors.border }, item.isPenalty && { borderColor: colors.danger }]}>
              <TouchableOpacity onPress={handleDecrement} style={[styles.counterBtn, { backgroundColor: colors.secondary }, item.isPenalty && { backgroundColor: colors.danger }]}>
                <Text style={[styles.counterBtnText, { color: colors.primary }, item.isPenalty && { color: colors.white }]}>-</Text>
              </TouchableOpacity>
              <Text style={[styles.counterText, { color: colors.text }, item.isPenalty && { color: colors.danger }]}>
                {item.currentCount} / {item.targetCount} REPS
              </Text>
              <TouchableOpacity onPress={() => handleIncrement(1)} style={[styles.counterBtn, { backgroundColor: colors.secondary }, item.isPenalty && { backgroundColor: colors.danger }]}>
                <Text style={[styles.counterBtnText, { color: colors.primary }, item.isPenalty && { color: colors.white }]}>+</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.quickAddRow}>
              <TouchableOpacity 
                onPress={() => handleIncrement(10)} 
                style={[styles.quickAddBtn, { backgroundColor: colors.surface, borderColor: itemColor }]}
              >
                <Text style={[styles.quickAddText, { color: itemColor }]}>+10</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => handleIncrement(25)} 
                style={[styles.quickAddBtn, { backgroundColor: colors.surface, borderColor: itemColor }]}
              >
                <Text style={[styles.quickAddText, { color: itemColor }]}>+25</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {item.category === 'LongTerm' && !isEditing && (
          <View style={[styles.subTaskSection, { borderTopColor: colors.border }]}>
            <TouchableOpacity onPress={() => setShowSubTasks(!showSubTasks)} style={styles.subTaskToggle}>
              <Text style={[styles.subTaskToggleText, { color: colors.primary }]}>
                {showSubTasks ? '[-] HIDE SUB-QUESTS' : `[+] SUB-QUESTS (${item.subTasks?.length || 0})`}
              </Text>
            </TouchableOpacity>
            
            {showSubTasks && (
              <View style={styles.subTaskList}>
                {item.subTasks?.map(st => (
                  <TouchableOpacity key={st.id} style={styles.subTaskItem} onPress={() => onToggleSubTask?.(item.id, st.id)}>
                    <View style={[styles.subCheckbox, { borderColor: colors.textDim }, st.completed && { backgroundColor: itemColor }]} />
                    <Text style={[styles.subTaskText, { color: colors.text }, st.completed && { color: colors.textDim, textDecorationLine: 'line-through' }]}>{st.text}</Text>
                  </TouchableOpacity>
                ))}
                <View style={styles.addSubTaskRow}>
                  <TextInput
                    style={[styles.subTaskInput, { color: colors.text, backgroundColor: colors.background }]}
                    placeholder="NEW SUB-QUEST..."
                    placeholderTextColor={colors.textDim}
                    value={newSubTask}
                    onChangeText={setNewSubTask}
                  />
                  <TouchableOpacity onPress={handleAddSubTask}>
                    <Text style={[styles.addSubTaskBtn, { color: itemColor }]}>ADD</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.actionButtons}>
        {isEditing ? (
          <TouchableOpacity onPress={handleUpdate} style={styles.actionButton}>
            <Text style={[styles.saveButtonText, { color: colors.success }]}>UPDATE</Text>
          </TouchableOpacity>
        ) : (
          <>
            {item.isArchived && onUnarchive ? (
              <TouchableOpacity onPress={() => onUnarchive(item.id)} style={styles.actionButton}>
                <Text style={[styles.unarchiveButtonText, { color: colors.success }]}>UN-ARC</Text>
              </TouchableOpacity>
            ) : item.completed && onArchive && (
               <TouchableOpacity onPress={() => onArchive(item.id)} style={styles.actionButton}>
                <Text style={[styles.archiveButtonText, { color: colors.accent }]}>ARCHIVE</Text>
              </TouchableOpacity>
            )}
            {!item.isPenalty && (
              <TouchableOpacity 
                onPress={() => setIsEditing(true)} 
                style={styles.actionButton}
              >
                <Text style={[styles.editButtonText, { color: colors.primary }]}>MOD</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => onDelete(item.id)}
            >
              <Text style={[styles.deleteButtonText, { color: colors.danger }]}>DEL</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  taskItemCompleted: {
    opacity: 0.6,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 20,
    height: 24,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  badge: {
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  rankBadge: {
    borderWidth: 1,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginRight: 8,
    borderRadius: 2,
  },
  rankBadgeText: {
    fontSize: 8,
    fontWeight: '900',
  },
  xpLabel: {
    fontSize: 9,
    fontWeight: '900',
    marginLeft: 8,
    opacity: 0.9,
  },
  skillLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    opacity: 0.8,
  },
  deadlineText: {
    fontSize: 8,
    color: COLORS.danger,
    fontWeight: 'bold',
    marginLeft: 'auto',
    letterSpacing: 1,
  },
  taskText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },
  taskTextCompleted: {
    color: COLORS.textDim,
    textDecorationLine: 'line-through',
  },
  editInput: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '600',
    padding: 0,
  },
  workoutControls: {
    marginTop: 8,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  counterText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: 'bold',
    marginHorizontal: 12,
  },
  counterBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondary,
  },
  counterBtnText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  quickAddRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  quickAddBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    marginRight: 8,
    backgroundColor: COLORS.surface,
  },
  quickAddText: {
    fontSize: 9,
    fontWeight: '900',
  },
  subTaskSection: {
    marginTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
    paddingTop: 5,
  },
  subTaskToggle: {
    paddingVertical: 4,
  },
  subTaskToggleText: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  subTaskList: {
    marginTop: 5,
    paddingLeft: 10,
  },
  subTaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  subCheckbox: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: COLORS.textDim,
    marginRight: 8,
  },
  subTaskText: {
    color: COLORS.text,
    fontSize: 12,
  },
  subTaskTextCompleted: {
    color: COLORS.textDim,
    textDecorationLine: 'line-through',
  },
  addSubTaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  subTaskInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 11,
    padding: 2,
    backgroundColor: COLORS.background,
    marginRight: 10,
  },
  addSubTaskBtn: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'column',
    marginLeft: 8,
  },
  actionButton: {
    padding: 4,
  },
  editButtonText: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: COLORS.success,
    fontSize: 9,
    fontWeight: 'bold',
  },
  deleteButtonText: {
    color: COLORS.danger,
    fontSize: 9,
    fontWeight: 'bold',
  },
  archiveButtonText: {
    color: COLORS.accent,
    fontSize: 9,
    fontWeight: 'bold',
  },
  unarchiveButtonText: {
    color: COLORS.success,
    fontSize: 9,
    fontWeight: 'bold',
  }
});

export default TaskItem;
