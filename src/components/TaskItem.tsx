import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { COLORS, SHADOWS } from '../utils/theme';
import { Task } from '../utils/types';

interface TaskItemProps {
  item: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
}

const TaskItem = ({ item, onToggle, onDelete, onUpdate }: TaskItemProps) => {
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

  return (
    <View style={[styles.taskItem, item.completed && styles.taskItemCompleted]}>
      {!isEditing && (
        <TouchableOpacity 
          style={styles.checkboxContainer} 
          onPress={() => onToggle(item.id)}
        >
          <View style={[styles.checkbox, item.completed && styles.checkboxChecked]} />
        </TouchableOpacity>
      )}
      
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
          style={[styles.taskText, item.completed && styles.taskTextCompleted]}
          onPress={() => onToggle(item.id)}
        >
          {item.text}
        </Text>
      )}

      <View style={styles.actionButtons}>
        {isEditing ? (
          <TouchableOpacity onPress={handleUpdate} style={styles.actionButton}>
            <Text style={styles.saveButtonText}>UPDATE</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity 
              onPress={() => setIsEditing(true)} 
              style={styles.actionButton}
            >
              <Text style={styles.editButtonText}>MODIFY</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => onDelete(item.id)}
            >
              <Text style={styles.deleteButtonText}>DISCARD</Text>
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
    padding: 18,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  taskItemCompleted: {
    borderLeftColor: COLORS.textDim,
    borderColor: COLORS.secondary,
    opacity: 0.6,
  },
  checkboxContainer: {
    marginRight: 18,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.glow,
  },
  taskText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  taskTextCompleted: {
    color: COLORS.textDim,
    textDecorationLine: 'line-through',
  },
  editInput: {
    flex: 1,
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
    padding: 0,
  },
  actionButtons: {
    flexDirection: 'row',
    marginLeft: 12,
  },
  actionButton: {
    marginLeft: 14,
    padding: 6,
  },
  editButtonText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  saveButtonText: {
    color: COLORS.success,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    textShadowColor: COLORS.success,
    textShadowRadius: 5,
  },
  deleteButtonText: {
    color: COLORS.danger,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default TaskItem;
