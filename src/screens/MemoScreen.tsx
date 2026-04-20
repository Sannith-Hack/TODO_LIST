import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Keyboard, LayoutAnimation, UIManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SHADOWS } from '../utils/theme';
import { triggerHaptic } from '../utils/feedback';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Memo {
  id: string;
  text: string;
  completed: boolean;
}

const MEMOS_KEY = '@memo_pad_data';

const MemoScreen = ({ onOpenMenu }: { onOpenMenu: () => void }) => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    loadMemos();
  }, []);

  const loadMemos = async () => {
    const data = await AsyncStorage.getItem(MEMOS_KEY);
    if (data) setMemos(JSON.parse(data));
  };

  const saveMemos = async (newMemos: Memo[]) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    await AsyncStorage.setItem(MEMOS_KEY, JSON.stringify(newMemos));
    setMemos(newMemos);
  };

  const addMemo = () => {
    if (input.trim() === '') return;
    const newMemo = { id: Date.now().toString(), text: input.trim(), completed: false };
    saveMemos([newMemo, ...memos]);
    setInput('');
    Keyboard.dismiss();
    triggerHaptic('impactMedium');
  };

  const toggleMemo = (id: string) => {
    const isCompleting = !memos.find(m => m.id === id)?.completed;
    saveMemos(memos.map(m => m.id === id ? { ...m, completed: !m.completed } : m));
    triggerHaptic(isCompleting ? 'notificationSuccess' : 'impactLight');
  };

  const deleteMemo = (id: string) => {
    saveMemos(memos.filter(m => m.id !== id));
    triggerHaptic('impactMedium');
  };

  const sortedMemos = [...memos].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuBtn} onPress={onOpenMenu}>
          <View style={styles.menuLine} />
          <View style={[styles.menuLine, { width: 15 }]} />
          <View style={styles.menuLine} />
        </TouchableOpacity>
        <Text style={styles.title}>MEMO PAD</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={sortedMemos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.memoItem}>
            <TouchableOpacity onPress={() => toggleMemo(item.id)} style={styles.checkbox}>
              {item.completed && <View style={styles.checked} />}
            </TouchableOpacity>
            <Text style={[styles.memoText, item.completed && styles.memoCompleted]}>{item.text}</Text>
            <TouchableOpacity onPress={() => deleteMemo(item.id)}>
              <Text style={styles.deleteText}>DEL</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="[+] QUICK MEMO"
            placeholderTextColor={COLORS.textDim}
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addMemo}>
            <Text style={styles.addBtnText}>ADD</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  title: { color: COLORS.primary, fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  menuBtn: { width: 40, height: 40, justifyContent: 'center' },
  menuLine: { height: 2, width: 25, backgroundColor: COLORS.primary, marginBottom: 5, ...SHADOWS.glow },
  memoItem: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  checkbox: { width: 20, height: 20, borderWidth: 2, borderColor: COLORS.primary, marginRight: 15 },
  checked: { width: 12, height: 12, backgroundColor: COLORS.primary, margin: 2 },
  memoText: { flex: 1, color: COLORS.text, fontSize: 14 },
  memoCompleted: { textDecorationLine: 'line-through', color: COLORS.textDim },
  deleteText: { color: COLORS.danger, fontWeight: 'bold', fontSize: 10 },
  inputRow: { flexDirection: 'row', padding: 20, backgroundColor: COLORS.surface },
  input: { flex: 1, backgroundColor: COLORS.background, color: COLORS.text, paddingHorizontal: 15, height: 45 },
  addBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 20, justifyContent: 'center', marginLeft: 10 },
  addBtnText: { fontWeight: '900' }
});

export default MemoScreen;
