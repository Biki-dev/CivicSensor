import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useAppStore } from '@store/index';
import { colors } from '@theme/colors';
import { spacing, radius, shadows } from '@theme/spacing';
import { typography } from '@theme/typography';

export default function AuthorityDetailScreen({ route }: any) {
  const { authorityId } = route.params;
  const { authorities, workOrders, fetchAuthorityStatus } = useAppStore();
  const [status, setStatus] = useState<any>(null);

  const authority = authorities.find(a => a.id === authorityId);
  const authorityWOs = workOrders.filter(w => w.authorityId === authorityId);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const resp = await fetchAuthorityStatus(authorityId);
      if (mounted) setStatus(resp);
    })();
    return () => { mounted = false; };
  }, [authorityId]);

  if (!authority) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{authority.name}</Text>
        <Text style={styles.subtitle}>{authority.department}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Jurisdiction</Text>
        <Text style={styles.cardText}>{authority.jurisdiction}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Latest Work Order</Text>
        {status ? (
          <>
            <Text style={styles.cardText}>Work Order: {status.workOrderId}</Text>
            <Text style={styles.cardText}>Status: {status.status}</Text>
            <Text style={styles.cardText}>{status.message}</Text>
          </>
        ) : (
          <Text style={styles.cardText}>No recent updates</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Work Orders</Text>
        <FlatList
          data={authorityWOs}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.woItem}>
              <Text style={styles.woTitle}>{item.id}</Text>
              <Text style={styles.woMeta}>{item.status} • {new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  header: { padding: spacing.screenH, paddingTop: spacing.lg },
  title: { ...typography.h1, color: colors.textPrimary, fontWeight: '800' },
  subtitle: { ...typography.caption, color: colors.textMuted },
  card: { backgroundColor: colors.bgCard, margin: spacing.screenH, borderRadius: radius.card, padding: spacing.md, ...shadows.xs, marginBottom: spacing.md },
  cardTitle: { ...typography.labelSM, color: colors.textSecondary, fontWeight: '800' },
  cardText: { ...typography.body, color: colors.textPrimary, marginTop: spacing.xs },
  section: { paddingHorizontal: spacing.screenH },
  sectionTitle: { ...typography.label, color: colors.textSecondary, fontWeight: '800', marginBottom: spacing.sm },
  woItem: { paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  woTitle: { ...typography.bodySM, color: colors.textPrimary, fontWeight: '700' },
  woMeta: { ...typography.caption, color: colors.textMuted },
});
