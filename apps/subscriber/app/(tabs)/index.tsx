import { getAllAdherenceHistory } from '../../lib/api';
import type { AdherenceRecord } from '@arys-rx/types';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';

const BRAND = '#006aff';

const MOCK_USER = {
  firstName: 'Jane',
  lastName: 'Doe',
  drug: 'Humira',
  dosage: '40mg/0.8mL',
  frequency: 'Every 2 weeks',
};

function fmtDate(date: Date, opts: Intl.DateTimeFormatOptions) {
  return date.toLocaleDateString('en-US', opts);
}

function fmtTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function HomeScreen() {
  const [records, setRecords] = useState<AdherenceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllAdherenceHistory()
      .then(setRecords)
      .finally(() => setLoading(false));
  }, []);

  const pending = records.filter((r) => r.status === 'pending');
  const completed = records.filter((r) => r.status !== 'pending');
  const takenCount = completed.filter((r) => r.status === 'taken').length;
  const adherenceRate =
    completed.length > 0 ? Math.round((takenCount / completed.length) * 100) : 0;
  const nextDose = pending[0] ?? null;

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: BRAND }}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
  }

  const initials = `${MOCK_USER.firstName[0]}${MOCK_USER.lastName[0]}`;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BRAND }}>
      {/* ── Blue header ── */}
      <View style={{ backgroundColor: BRAND, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 20 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 18,
          }}
        >
          <View>
            <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800', letterSpacing: -0.3 }}>
              arys·rx
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, marginTop: 2 }}>
              Medication Adherence
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: '#fff', fontSize: 28, fontWeight: '800', lineHeight: 32 }}>
              {adherenceRate}%
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 2 }}>
              ~ Adherence Rate
            </Text>
          </View>
        </View>

        {/* Welcome card — tap for profile */}
        <Pressable onPress={() => router.push('/(tabs)/profile')}>
          <View
            style={{
              backgroundColor: 'rgba(255,255,255,0.14)',
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.2)',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, marginBottom: 3 }}>
                Welcome back,
              </Text>
              <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700', marginBottom: 5 }}>
                {MOCK_USER.firstName} {MOCK_USER.lastName}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                {MOCK_USER.drug} · {MOCK_USER.dosage}
              </Text>
            </View>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(255,255,255,0.2)',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 12,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>{initials}</Text>
            </View>
          </View>
        </Pressable>
      </View>

      {/* ── Content ── */}
      <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 20,
            paddingBottom: 100,
            gap: 20,
          }}
        >
          {/* Next dose card */}
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 14,
              borderWidth: 1,
              borderColor: '#e2e8f0',
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <View style={{ backgroundColor: BRAND, padding: 18 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <MaterialIcons name="schedule" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' }}>
                  Next Scheduled Dose
                </Text>
              </View>
              {nextDose ? (
                <>
                  <Text style={{ color: '#fff', fontSize: 26, fontWeight: '800', marginBottom: 4 }}>
                    {fmtDate(new Date(nextDose.scheduledAt), {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>
                    {fmtTime(new Date(nextDose.scheduledAt))}
                  </Text>
                </>
              ) : (
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>
                  All caught up!
                </Text>
              )}
            </View>

            <View style={{ padding: 18, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
              <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>Medication</Text>
              <Text style={{ color: '#0f172a', fontSize: 16, fontWeight: '600' }}>
                {nextDose?.drugName ?? 'Humira'} 40mg/0.8mL
              </Text>
            </View>

            <View style={{ padding: 14 }}>
              <Pressable
                onPress={() => router.push('/record/camera')}
                style={{
                  backgroundColor: BRAND,
                  borderRadius: 10,
                  paddingVertical: 14,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <MaterialIcons name="videocam" size={20} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>Record Dose</Text>
              </Pressable>
            </View>
          </View>

          {/* Upcoming Doses */}
          <Text style={{ fontSize: 17, fontWeight: '700', color: '#0f172a' }}>
            Upcoming Doses
          </Text>

          {pending.length === 0 ? (
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#e2e8f0',
                padding: 20,
                alignItems: 'center',
                gap: 12,
              }}
            >
              <Text style={{ color: '#94a3b8', fontSize: 14 }}>
                No upcoming doses scheduled.
              </Text>
              <Pressable
                onPress={() => router.push('/onboarding')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  backgroundColor: '#eff6ff',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '600', color: BRAND }}>
                  Set up schedule
                </Text>
              </Pressable>
            </View>
          ) : (
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#e2e8f0',
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 4,
                elevation: 1,
              }}
            >
              {/* Medication header row with edit button */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: '#f1f5f9',
                  backgroundColor: '#fafafa',
                }}
              >
                <View>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#0f172a' }}>
                    {MOCK_USER.drug} {MOCK_USER.dosage}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#94a3b8', marginTop: 1 }}>
                    {MOCK_USER.frequency}
                  </Text>
                </View>
                <Pressable
                  onPress={() => router.push('/onboarding')}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    backgroundColor: '#eff6ff',
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                  }}
                >
                  <MaterialIcons name="edit" size={13} color={BRAND} />
                  <Text style={{ fontSize: 13, fontWeight: '600', color: BRAND }}>Edit</Text>
                </Pressable>
              </View>

              {/* Dose rows */}
              {pending.map((r, i) => {
                const d = new Date(r.scheduledAt);
                return (
                  <View
                    key={r.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 16,
                      borderTopWidth: i > 0 ? 1 : 0,
                      borderTopColor: '#f1f5f9',
                    }}
                  >
                    <View>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#0f172a' }}>
                        {fmtDate(d, { weekday: 'long', month: 'short', day: 'numeric' })}
                      </Text>
                      <Text style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
                        {fmtTime(d)}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                      <MaterialIcons name="event" size={14} color="#94a3b8" />
                      <Text style={{ fontSize: 13, color: '#94a3b8' }}>Scheduled</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* View History */}
          <Pressable
            onPress={() => router.push('/(tabs)/history')}
            style={{
              backgroundColor: '#fff',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#e2e8f0',
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04,
              shadowRadius: 4,
              elevation: 1,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: '600', color: '#0f172a' }}>
              View Dose History
            </Text>
            <MaterialIcons name="arrow_forward" size={20} color={BRAND} />
          </Pressable>
        </ScrollView>

        {/* FAB — reset / re-enroll */}
        <Pressable
          onPress={() => router.push('/download')}
          style={{
            position: 'absolute',
            bottom: 24,
            right: 20,
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: '#0f172a',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <MaterialIcons name="refresh" size={24} color="#fff" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
