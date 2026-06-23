import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useAppStore } from '@store/index';
import { colors, palette } from '@theme/colors';
import { spacing, radius, shadows } from '@theme/spacing';
import { typography } from '@theme/typography';
import { ISSUE_CATEGORIES } from '@constants/index';
import { IssueCategory, UrgencyLevel } from '@appTypes/index';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';

export default function ReportScreen({ navigation }: any) {
  const addIssue = useAppStore(state => state.addIssue);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>('pothole');
  const [urgency, setUrgency] = useState<UrgencyLevel>('medium');
  const [address, setAddress] = useState('742 Evergreen Terrace, Sector 4');
  const [isLocating, setIsLocating] = useState(false);

  const handleLocateMe = () => {
    setIsLocating(true);
    setTimeout(() => {
      setAddress('1092 Pine Boulevard, Valley District');
      setIsLocating(false);
    }, 1000);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Missing Field', 'Please enter a summary title.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Missing Field', 'Please enter a description of the issue.');
      return;
    }

    // Call store action
    addIssue(
      title,
      description,
      category,
      urgency,
      address,
      { latitude: 37.7749 + (Math.random() - 0.5) * 0.02, longitude: -122.4194 + (Math.random() - 0.5) * 0.02 }
    );

    Alert.alert(
      'Report Submitted', 
      'Your civic incident has been logged. +15 XP!',
      [
        { 
          text: 'View Feed', 
          onPress: () => {
            // Reset fields
            setTitle('');
            setDescription('');
            setCategory('pothole');
            setUrgency('medium');
            navigation.navigate('Feed');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.sectionTitle}>1. CHOOSE INCIDENT CATEGORY</Text>
          <View style={styles.categoryGrid}>
            {ISSUE_CATEGORIES.map(cat => {
              const isSelected = category === cat.value;
              return (
                <TouchableOpacity
                  key={cat.value}
                  style={[
                    styles.catChip,
                    isSelected && { borderColor: cat.color, backgroundColor: cat.color + '15' }
                  ]}
                  onPress={() => setCategory(cat.value)}
                >
                  <View style={[styles.catIndicator, { backgroundColor: cat.color }]} />
                  <Text style={[styles.catChipText, isSelected && { color: cat.color, fontWeight: '700' }]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>2. SET URGENCY LEVEL</Text>
          <View style={styles.urgencyRow}>
            {(['low', 'medium', 'high', 'critical'] as UrgencyLevel[]).map(level => {
              const isSelected = urgency === level;
              let activeColor: string = palette.success;
              if (level === 'medium') activeColor = colors.brandReward;
              if (level === 'high') activeColor = colors.urgencyHigh;
              if (level === 'critical') activeColor = colors.urgencyCritical;

              return (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.urgencyTab,
                    isSelected && { borderColor: activeColor, backgroundColor: activeColor + '10' }
                  ]}
                  onPress={() => setUrgency(level)}
                >
                  <Text style={[styles.urgencyTabText, isSelected && { color: activeColor, fontWeight: '800' }]}>
                    {level.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>3. DETAILS & DESCRIPTION</Text>
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>SUMMARY TITLE</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Broken Water Pipe / Blocked Drain"
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>DESCRIPTION</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Provide details about the issue. Include size, landmarks, safety hazards, etc."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>4. INCIDENT LOCATION</Text>
          <View style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <View style={styles.pinWrapper}>
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill={colors.brandAccent}/>
                </Svg>
              </View>
              <View style={styles.addressWrapper}>
                <Text style={styles.gpsLabel}>GPS TELEMETRY ADDR</Text>
                <Text style={styles.addressText}>{address}</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.locateBtn} 
              onPress={handleLocateMe}
              disabled={isLocating}
            >
              <Text style={styles.locateBtnText}>
                {isLocating ? 'RECALIBRATING GPS...' : 'REFRESH LOCAL GPS'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Submit Trigger */}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <LinearGradient
              colors={[colors.brandAccent, '#00A896']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.submitGradient}
            >
              <Text style={styles.submitText}>TRANSMIT INCIDENT DATA</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.screenH,
    paddingBottom: spacing.screenV * 2,
  },
  sectionTitle: {
    ...typography.labelSM,
    color: colors.textSecondary,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.xs,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.chip,
    paddingVertical: spacing.xs * 1.2,
    paddingHorizontal: spacing.sm * 1.5,
    margin: 4,
    backgroundColor: colors.bgCard,
  },
  catIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  catChipText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  urgencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  urgencyTab: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.xs,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginHorizontal: 2,
    backgroundColor: colors.bgCard,
  },
  urgencyTabText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.xs,
  },
  inputGroup: {
    marginBottom: spacing.sm,
  },
  inputLabel: {
    ...typography.labelSM,
    color: colors.textMuted,
    fontWeight: '700',
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.input,
    paddingVertical: spacing.xs * 2,
    paddingHorizontal: spacing.sm * 1.5,
    fontSize: 14,
    color: colors.textPrimary,
    backgroundColor: '#F8FAFC',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  locationCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.xs,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  pinWrapper: {
    marginRight: spacing.sm,
  },
  addressWrapper: {
    flex: 1,
  },
  gpsLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '700',
  },
  addressText: {
    ...typography.bodySM,
    color: colors.textPrimary,
    fontWeight: '600',
    marginTop: 2,
  },
  locateBtn: {
    borderWidth: 1,
    borderColor: colors.brandAccent,
    borderRadius: radius.btn,
    paddingVertical: spacing.xs * 2,
    alignItems: 'center',
    backgroundColor: colors.brandAccent + '05',
  },
  locateBtnText: {
    ...typography.btnSM,
    color: colors.brandAccent,
    fontWeight: '800',
  },
  submitBtn: {
    borderRadius: radius.btn,
    overflow: 'hidden',
    ...shadows.teal,
  },
  submitGradient: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    ...typography.btnLG,
    color: colors.btnPrimaryText,
    fontWeight: '800',
  },
});
