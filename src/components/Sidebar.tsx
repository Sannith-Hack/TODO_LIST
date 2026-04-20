import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Dimensions, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  SafeAreaView 
} from 'react-native';
import { COLORS, SHADOWS, getRankTheme } from '../utils/theme';
import { UserStats } from '../utils/types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentScreen: 'Home' | 'SkillTree' | 'Testing' | 'Calendar' | 'Settings' | 'Memo';
  onNavigate: (screen: 'Home' | 'SkillTree' | 'Testing' | 'Calendar' | 'Settings' | 'Memo') => void;
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

  const handleNavigate = (screen: 'Home' | 'SkillTree' | 'Testing' | 'Calendar' | 'Settings' | 'Memo') => {
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
        { transform: [{ translateX: slideAnim }], opacity: glitchAnim }
      ]}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.profileSection}>
            <View style={[styles.avatarContainer, { borderColor: primaryColor }, SHADOWS.glowCustom(primaryColor)]}>
              <Text style={[styles.avatarText, { color: primaryColor }]}>{stats?.playerName?.[0] || 'P'}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.playerName}>{stats?.playerName || 'PLAYER'}</Text>
              <Text style={[styles.rankText, { color: primaryColor }]}>{stats?.reputationTitle || 'E-RANK HUNTER'}</Text>
              <Text style={styles.levelText}>LEVEL {stats?.totalLevel || 1}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: primaryColor }]} />

          <View style={styles.menuItems}>
            <TouchableOpacity style={[styles.menuItem, currentScreen === 'Home' && { backgroundColor: primaryColor + '15', borderLeftWidth: 4, borderLeftColor: primaryColor }]} onPress={() => handleNavigate('Home')}>
              <Text style={[styles.menuText, currentScreen === 'Home' && { color: primaryColor, textShadowColor: primaryColor, textShadowRadius: 10 }]}>QUEST LOG</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, currentScreen === 'Memo' && { backgroundColor: primaryColor + '15', borderLeftWidth: 4, borderLeftColor: primaryColor }]} onPress={() => handleNavigate('Memo')}>
              <Text style={[styles.menuText, currentScreen === 'Memo' && { color: primaryColor, textShadowColor: primaryColor, textShadowRadius: 10 }]}>MEMO PAD</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, currentScreen === 'Calendar' && { backgroundColor: primaryColor + '15', borderLeftWidth: 4, borderLeftColor: primaryColor }]} onPress={() => handleNavigate('Calendar')}>
              <Text style={[styles.menuText, currentScreen === 'Calendar' && { color: primaryColor, textShadowColor: primaryColor, textShadowRadius: 10 }]}>CHRONICLES</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, currentScreen === 'SkillTree' && { backgroundColor: primaryColor + '15', borderLeftWidth: 4, borderLeftColor: primaryColor }]} onPress={() => handleNavigate('SkillTree')}>
              <Text style={[styles.menuText, currentScreen === 'SkillTree' && { color: primaryColor, textShadowColor: primaryColor, textShadowRadius: 10 }]}>STATUS WINDOW</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, currentScreen === 'Testing' && { backgroundColor: primaryColor + '15', borderLeftWidth: 4, borderLeftColor: primaryColor }]} onPress={() => handleNavigate('Testing')}>
              <Text style={[styles.menuText, currentScreen === 'Testing' && { color: primaryColor, textShadowColor: primaryColor, textShadowRadius: 10 }]}>SYSTEM CONSOLE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, currentScreen === 'Settings' && { backgroundColor: primaryColor + '15', borderLeftWidth: 4, borderLeftColor: primaryColor }]} onPress={() => handleNavigate('Settings')}>
              <Text style={[styles.menuText, currentScreen === 'Settings' && { color: primaryColor, textShadowColor: primaryColor, textShadowRadius: 10 }]}>SYSTEM SETTINGS</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>SYSTEM v1.0.6</Text>
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
  sidebar: { width: SIDEBAR_WIDTH, height: '100%', backgroundColor: COLORS.surface, borderRightWidth: 1, borderRightColor: COLORS.primary, ...SHADOWS.glow },
  safeArea: { flex: 1 },
  profileSection: { padding: 25, flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  avatarContainer: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: COLORS.primary, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', ...SHADOWS.glow },
  avatarText: { color: COLORS.primary, fontSize: 24, fontWeight: '900' },
  profileInfo: { marginLeft: 15 },
  playerName: { color: COLORS.text, fontSize: 16, fontWeight: '900', letterSpacing: 1, marginBottom: 2 },
  rankText: { color: COLORS.primary, fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  levelText: { color: COLORS.text, fontSize: 18, fontWeight: 'bold', marginTop: 2 },
  divider: { height: 1, backgroundColor: COLORS.primary, marginHorizontal: 25, opacity: 0.3, marginVertical: 10 },
  menuItems: { flex: 1, paddingTop: 20 },
  menuItem: { paddingVertical: 18, paddingHorizontal: 25, borderLeftWidth: 0 },
  activeMenuItem: { backgroundColor: COLORS.primary + '15', borderLeftWidth: 4, borderLeftColor: COLORS.primary },
  menuText: { color: COLORS.textDim, fontSize: 14, fontWeight: 'bold', letterSpacing: 2 },
  activeMenuText: { color: COLORS.primary, textShadowColor: COLORS.primary, textShadowRadius: 10 },
  footer: { padding: 25, borderTopWidth: 1, borderTopColor: COLORS.border },
  footerText: { color: COLORS.textDim, fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  footerSubtext: { color: COLORS.primary, fontSize: 8, fontWeight: '900', marginTop: 4, opacity: 0.6 },
});

export default Sidebar;
