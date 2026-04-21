import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Keyboard, LayoutAnimation, UIManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, getColors, SHADOWS } from '../utils/theme';
import { triggerHaptic } from '../utils/feedback';
import { UserStats } from '../utils/types';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Memo {
  id: string;
  text: string;
  completed: boolean;
  isArchived?: boolean;
}

const MEMOS_KEY = '@memo_pad_data';

const MemoScreen = ({ onOpenMenu, stats }: { onOpenMenu: () => void, stats: UserStats | null }) => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isArchiveVisible, setIsArchiveVisible] = useState(false);

  const theme = stats?.theme || 'dark';
  const colors = getColors(theme);

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

  const archiveMemo = (id: string) => {
    saveMemos(memos.map(m => m.id === id ? { ...m, isArchived: true } : m));
    triggerHaptic('impactMedium');
  };

  const unarchiveMemo = (id: string) => {
    saveMemos(memos.map(m => m.id === id ? { ...m, isArchived: false } : m));
    triggerHaptic('impactMedium');
  };

  const filteredMemos = memos.filter(m => {
    const matchesSearch = m.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArchive = isArchiveVisible ? m.isArchived : !m.isArchived;
    return matchesSearch && matchesArchive;
  });

  const sortedMemos = [...filteredMemos].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.menuBtn} onPress={onOpenMenu}>
          <View style={[styles.menuLine, { backgroundColor: colors.primary }]} />
          <View style={[styles.menuLine, { width: 15, backgroundColor: colors.primary }]} />
          <View style={[styles.menuLine, { backgroundColor: colors.primary }]} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.primary }]}>MEMO PAD</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={[styles.searchRow, { borderBottomColor: colors.border }]}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: colors.surface, color: colors.text }]}
          placeholder="SEARCH MEMOS..."
          placeholderTextColor={colors.textDim}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity 
          style={[styles.archiveToggle, { borderColor: colors.border }, isArchiveVisible && { borderColor: colors.accent, backgroundColor: colors.accent + '22' }]} 
          onPress={() => setIsArchiveVisible(!isArchiveVisible)}
        >
          <Text style={[styles.archiveToggleText, { color: colors.textDim }, isArchiveVisible && { color: colors.accent }]}>ARCHIVE</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedMemos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.memoItem, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => toggleMemo(item.id)} style={[styles.checkbox, { borderColor: colors.primary }]}>
              {item.completed && <View style={[styles.checked, { backgroundColor: colors.primary }]} />}
            </TouchableOpacity>
            <Text style={[styles.memoText, { color: colors.text }, item.completed && { color: colors.textDim, textDecorationLine: 'line-through' }]}>{item.text}</Text>
            <View style={styles.memoActions}>
              {item.isArchived ? (
                <TouchableOpacity onPress={() => unarchiveMemo(item.id)} style={{marginRight: 15}}>
                  <Text style={[styles.unarchiveText, { color: colors.success }]}>UN-ARC</Text>
                </TouchableOpacity>
              ) : item.completed && (
                <TouchableOpacity onPress={() => archiveMemo(item.id)} style={{marginRight: 15}}>
                  <Text style={[styles.archiveText, { color: colors.accent }]}>ARC</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => deleteMemo(item.id)}>
                <Text style={[styles.deleteText, { color: colors.danger }]}>DEL</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {!isArchiveVisible && (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={[styles.inputRow, { backgroundColor: colors.surface }]}>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
              placeholder="[+] QUICK MEMO"
              placeholderTextColor={colors.textDim}
              value={input}
              onChangeText={setInput}
            />
            <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.primary }]} onPress={addMemo}>
              <Text style={[styles.addBtnText, { color: colors.background }]}>ADD</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  title: { color: COLORS.primary, fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  menuBtn: { width: 40, height: 40, justifyContent: 'center' },
  menuLine: { height: 2, width: 25, backgroundColor: COLORS.primary, marginBottom: 5, ...SHADOWS.glow },
  searchRow: { flexDirection: 'row', padding: 15, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  searchInput: { flex: 1, height: 35, backgroundColor: COLORS.surface, color: COLORS.text, paddingHorizontal: 15, fontSize: 12 },
  archiveToggle: { marginLeft: 10, paddingHorizontal: 12, height: 35, justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },
  archiveToggleActive: { borderColor: COLORS.accent, backgroundColor: COLORS.accent + '22' },
  archiveToggleText: { color: COLORS.textDim, fontSize: 10, fontWeight: 'bold' },
  archiveToggleTextActive: { color: COLORS.accent },
  memoItem: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  checkbox: { width: 20, height: 20, borderWidth: 2, borderColor: COLORS.primary, marginRight: 15 },
  checked: { width: 12, height: 12, backgroundColor: COLORS.primary, margin: 2 },
  memoText: { flex: 1, color: COLORS.text, fontSize: 14 },
  memoCompleted: { textDecorationLine: 'line-through', color: COLORS.textDim },
  memoActions: { flexDirection: 'row', alignItems: 'center' },
  archiveText: { color: COLORS.accent, fontWeight: 'bold', fontSize: 10 },
  unarchiveText: { color: COLORS.success, fontWeight: 'bold', fontSize: 10 },
  deleteText: { color: COLORS.danger, fontWeight: 'bold', fontSize: 10 },
  inputRow: { flexDirection: 'row', padding: 20, backgroundColor: COLORS.surface },
  input: { flex: 1, backgroundColor: COLORS.background, color: COLORS.text, paddingHorizontal: 15, height: 45 },
  addBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 20, justifyContent: 'center', marginLeft: 10 },
  addBtnText: { fontWeight: '900' }
});

export default MemoScreen;
