import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Dimensions, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { COLORS, LIGHT_COLORS, SHADOWS, getRankTheme } from '../utils/theme';
import { UserStats } from '../utils/types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentScreen: 'Home' | 'SkillTree' | 'Testing' | 'Calendar' | 'Settings' | 'Memo' | 'HunterReport';
  onNavigate: (screen: 'Home' | 'SkillTree' | 'Testing' | 'Calendar' | 'Settings' | 'Memo' | 'HunterReport') => void;
  stats: UserStats | null;
}

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

const Sidebar = ({ isOpen, onClose, currentScreen, onNavigate, stats }: SidebarProps) => {
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const glitchAnim = useRef(new Animated.Value(1)).current;

  const userRank = stats?.reputationTitle?.split('-')[0] || 'E';
  const rankTheme = getRankTheme(userRank);
  const primaryColor = rankTheme.primary;
  const colors = stats?.theme === 'light' ? LIGHT_COLORS : COLORS;

  useEffect(() => {
    if (isOpen) {
      Animated.sequence([
        Animated.timing(glitchAnim, { toValue: 0.3, duration: 50, useNativeDriver: true }),
        Animated.timing(glitchAnim, { toValue: 1, duration: 50, useNativeDriver: true }),
        Animated.timing(glitchAnim, { toValue: 0.5, duration: 50, useNativeDriver: true }),
        Animated.timing(glitchAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();

      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: -SIDEBAR_WIDTH, duration: 250, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [isOpen]);

  const handleNavigate = (screen: 'Home' | 'SkillTree' | 'Testing' | 'Calendar' | 'Settings' | 'Memo' | 'HunterReport') => {
    onNavigate(screen);
    onClose();
  };

  return (
    <View 
      style={styles.overlayContainer} 
      pointerEvents={isOpen ? 'auto' : 'none'}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]} />
      </TouchableWithoutFeedback>

      <Animated.View style={[
        styles.sidebar, 
        { transform: [{ translateX: slideAnim }], opacity: glitchAnim, backgroundColor: colors.surface, borderRightColor: primaryColor }
      ]}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.profileSection}>
            <View style={[styles.avatarContainer, { borderColor: primaryColor, backgroundColor: colors.background }, SHADOWS.glowCustom(primaryColor)]}>
              <Text style={[styles.avatarText, { color: primaryColor }]}>{stats?.playerName?.[0] || 'P'}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.playerName, { color: colors.text }]}>{stats?.playerName || 'PLAYER'}</Text>
              <Text style={[styles.rankText, { color: primaryColor }]}>{stats?.reputationTitle || 'E-RANK HUNTER'}</Text>
              <Text style={[styles.levelText, { color: colors.text }]}>LEVEL {stats?.totalLevel || 1}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: primaryColor }]} />

          <ScrollView style={styles.menuItems}>
            <TouchableOpacity style={[styles.menuItem, currentScreen === 'Home' && { backgroundColor: primaryColor + '15', borderLeftWidth: 4, borderLeftColor: primaryColor }]} onPress={() => handleNavigate('Home')}>
              <Text style={[styles.menuText, { color: colors.textDim }, currentScreen === 'Home' && { color: primaryColor, textShadowColor: primaryColor, textShadowRadius: 10 }]}>QUEST LOG</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, currentScreen === 'Memo' && { backgroundColor: primaryColor + '15', borderLeftWidth: 4, borderLeftColor: primaryColor }]} onPress={() => handleNavigate('Memo')}>
              <Text style={[styles.menuText, { color: colors.textDim }, currentScreen === 'Memo' && { color: primaryColor, textShadowColor: primaryColor, textShadowRadius: 10 }]}>MEMO PAD</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, currentScreen === 'Calendar' && { backgroundColor: primaryColor + '15', borderLeftWidth: 4, borderLeftColor: primaryColor }]} onPress={() => handleNavigate('Calendar')}>
              <Text style={[styles.menuText, { color: colors.textDim }, currentScreen === 'Calendar' && { color: primaryColor, textShadowColor: primaryColor, textShadowRadius: 10 }]}>CHRONICLES</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, currentScreen === 'HunterReport' && { backgroundColor: primaryColor + '15', borderLeftWidth: 4, borderLeftColor: primaryColor }]} onPress={() => handleNavigate('HunterReport')}>
              <Text style={[styles.menuText, { color: colors.textDim }, currentScreen === 'HunterReport' && { color: primaryColor, textShadowColor: primaryColor, textShadowRadius: 10 }]}>HUNTER'S REPORT</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, currentScreen === 'SkillTree' && { backgroundColor: primaryColor + '15', borderLeftWidth: 4, borderLeftColor: primaryColor }]} onPress={() => handleNavigate('SkillTree')}>
              <Text style={[styles.menuText, { color: colors.textDim }, currentScreen === 'SkillTree' && { color: primaryColor, textShadowColor: primaryColor, textShadowRadius: 10 }]}>STATUS WINDOW</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, currentScreen === 'Testing' && { backgroundColor: primaryColor + '15', borderLeftWidth: 4, borderLeftColor: primaryColor }]} onPress={() => handleNavigate('Testing')}>
              <Text style={[styles.menuText, { color: colors.textDim }, currentScreen === 'Testing' && { color: primaryColor, textShadowColor: primaryColor, textShadowRadius: 10 }]}>SYSTEM CONSOLE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, currentScreen === 'Settings' && { backgroundColor: primaryColor + '15', borderLeftWidth: 4, borderLeftColor: primaryColor }]} onPress={() => handleNavigate('Settings')}>
              <Text style={[styles.menuText, { color: colors.textDim }, currentScreen === 'Settings' && { color: primaryColor, textShadowColor: primaryColor, textShadowRadius: 10 }]}>SYSTEM SETTINGS</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Text style={[styles.footerText, { color: colors.textDim }]}>SYSTEM v1.0.7</Text>
            <Text style={[styles.footerSubtext, { color: primaryColor }]}>SOLO LEVELING PROTOCOL</Text>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000 },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)' },
  sidebar: { width: SIDEBAR_WIDTH, height: '100%', borderRightWidth: 1 },
  safeArea: { flex: 1 },
  profileSection: { padding: 25, flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  avatarContainer: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 24, fontWeight: '900' },
  profileInfo: { marginLeft: 15 },
  playerName: { fontSize: 16, fontWeight: '900', letterSpacing: 1, marginBottom: 2 },
  rankText: { fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  levelText: { fontSize: 18, fontWeight: 'bold', marginTop: 2 },
  divider: { height: 1, marginHorizontal: 25, opacity: 0.3, marginVertical: 10 },
  menuItems: { flex: 1, paddingTop: 20 },
  menuItem: { paddingVertical: 18, paddingHorizontal: 25, borderLeftWidth: 0 },
  menuText: { fontSize: 14, fontWeight: 'bold', letterSpacing: 2 },
  footer: { padding: 25, borderTopWidth: 1 },
  footerText: { fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  footerSubtext: { fontSize: 8, fontWeight: '900', marginTop: 4, opacity: 0.6 },
});

export default Sidebar;
