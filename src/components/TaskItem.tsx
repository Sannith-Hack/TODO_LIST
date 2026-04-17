import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { COLORS, SHADOWS, SKILL_COLORS, CATEGORY_COLORS } from '../utils/theme';
import { Task } from '../utils/types';

interface TaskItemProps {
  item: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
  onUpdateCount?: (id: string, newCount: number) => void;
}

const TaskItem = ({ item, onToggle, onDelete, onUpdate, onUpdateCount }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);

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

  const isWorkout = (item.skillType === 'Workout' || item.isPenalty) && item.currentCount !== undefined;
  const itemColor = item.isPenalty ? COLORS.danger : SKILL_COLORS[item.skillType];

  return (
    <View style={[
      styles.taskItem, 
      item.completed && styles.taskItemCompleted,
      { borderLeftColor: itemColor },
      item.isPenalty && { borderColor: COLORS.danger, borderWidth: 1 }
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
            { backgroundColor: item.isPenalty ? COLORS.danger + '33' : CATEGORY_COLORS[item.category] + '33', 
              borderColor: item.isPenalty ? COLORS.danger : CATEGORY_COLORS[item.category] }
          ]}>
            <Text style={[styles.badgeText, { color: item.isPenalty ? COLORS.danger : CATEGORY_COLORS[item.category] }]}>
              {item.isPenalty ? 'PENALTY' : item.category.toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.skillLabel, { color: itemColor }]}>
            {item.isPenalty ? 'SYSTEM' : item.skillType}
          </Text>
          {item.deadline && !item.completed && (
            <Text style={styles.deadlineText}>
              LIMIT: {new Date(item.deadline).toLocaleDateString()}
            </Text>
          )}
        </View>

        {isEditing ? (
          <TextInput
            style={styles.editInput}
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
              item.completed && styles.taskTextCompleted,
              item.isPenalty && { color: COLORS.danger, fontWeight: 'bold' }
            ]}
            onPress={() => onToggle(item.id)}
          >
            {item.text}
          </Text>
        )}

        {isWorkout && !isEditing && (
          <View style={styles.workoutControls}>
            <View style={[styles.counterContainer, item.isPenalty && { borderColor: COLORS.danger }]}>
              <TouchableOpacity onPress={handleDecrement} style={[styles.counterBtn, item.isPenalty && { backgroundColor: COLORS.danger }]}>
                <Text style={[styles.counterBtnText, item.isPenalty && { color: COLORS.white }]}>-</Text>
              </TouchableOpacity>
              <Text style={[styles.counterText, item.isPenalty && { color: COLORS.danger }]}>
                {item.currentCount} / {item.targetCount} REPS
              </Text>
              <TouchableOpacity onPress={() => handleIncrement(1)} style={[styles.counterBtn, item.isPenalty && { backgroundColor: COLORS.danger }]}>
                <Text style={[styles.counterBtnText, item.isPenalty && { color: COLORS.white }]}>+</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.quickAddRow}>
              <TouchableOpacity 
                onPress={() => handleIncrement(10)} 
                style={[styles.quickAddBtn, { borderColor: itemColor }]}
              >
                <Text style={[styles.quickAddText, { color: itemColor }]}>+10</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => handleIncrement(25)} 
                style={[styles.quickAddBtn, { borderColor: itemColor }]}
              >
                <Text style={[styles.quickAddText, { color: itemColor }]}>+25</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={styles.actionButtons}>
        {isEditing ? (
          <TouchableOpacity onPress={handleUpdate} style={styles.actionButton}>
            <Text style={styles.saveButtonText}>UPDATE</Text>
          </TouchableOpacity>
        ) : (
          <>
            {!item.isPenalty && (
              <TouchableOpacity 
                onPress={() => setIsEditing(true)} 
                style={styles.actionButton}
              >
                <Text style={styles.editButtonText}>MOD</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => onDelete(item.id)}
            >
              <Text style={styles.deleteButtonText}>DEL</Text>
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
});

export default TaskItem;
