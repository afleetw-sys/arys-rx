import { getAllAdherenceHistory } from '../../lib/api';
import type { AdherenceRecord } from '@arys-rx/types';
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

const BRAND = '#3D52D5';

const MOCK_USER = {
  firstName: 'Jane',
  lastName: 'Doe',
  drug: 'Humira',
  dosage: '40mg/0.8mL',
};

function fmtDate(date: Date, opts: Intl.DateTimeFormatOptions) {
  return date.toLocaleDateString('en-US', opts);
}

function fmtTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function MainScreen() {
  const [activeTab, setActiveTab] = useState<'home' | 'history'>('home');
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

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: BRAND }}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BRAND }}>
      {/* ── Header ── */}
      <View style={{ backgroundColor: BRAND, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 20 }}>
        {/* App name + adherence rate */}
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

        {/* Welcome card */}
        <View
          style={{
            backgroundColor: 'rgba(255,255,255,0.14)',
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.2)',
          }}
        >
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
      </View>

      {/* ── Top tab bar ── */}
      <View
        style={{
          backgroundColor: '#fff',
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: '#e2e8f0',
        }}
      >
        {(['home', 'history'] as const).map((tab) => {
          const active = activeTab === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{ flex: 1, alignItems: 'center', paddingTop: 14, paddingBottom: 12 }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: active ? '600' : '400',
                  color: active ? BRAND : '#94a3b8',
                }}
              >
                {tab === 'home' ? 'Home' : 'History'}
              </Text>
              {active && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    height: 2,
                    width: 40,
                    backgroundColor: BRAND,
                    borderRadius: 1,
                  }}
                />
              )}
            </Pressable>
          );
        })}
      </View>

      {/* ── Content ── */}
      <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
        {activeTab === 'home' ? (
          <HomeContent nextDose={pending[0] ?? null} pending={pending} />
        ) : (
          <HistoryContent
            records={completed}
            takenCount={takenCount}
            adherenceRate={adherenceRate}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

// ─── Home tab ────────────────────────────────────────────────────────────────

function HomeContent({
  nextDose,
  pending,
}: {
  nextDose: AdherenceRecord | null;
  pending: AdherenceRecord[];
}) {
  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 40,
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
        {/* Blue header section */}
        <View style={{ backgroundColor: BRAND, padding: 18 }}>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}
          >
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>🕐</Text>
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

        {/* Medication row */}
        <View style={{ padding: 18, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
          <Text style={{ color: '#94a3b8', fontSize: 12, marginBottom: 5 }}>Medication</Text>
          <Text style={{ color: '#0f172a', fontSize: 16, fontWeight: '600' }}>
            {nextDose?.drugName ?? 'Humira'} 40mg/0.8mL
          </Text>
        </View>

        {/* Record Dose button */}
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
            <Text style={{ color: '#fff', fontSize: 14 }}>📹</Text>
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>Record Dose</Text>
          </Pressable>
        </View>
      </View>

      {/* Upcoming Doses */}
      <Text style={{ fontSize: 17, fontWeight: '700', color: '#0f172a' }}>Upcoming Doses</Text>

      {pending.length === 0 ? (
        <Text style={{ color: '#94a3b8', fontSize: 14 }}>No upcoming doses scheduled.</Text>
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
                  <Text style={{ fontSize: 12 }}>📅</Text>
                  <Text style={{ fontSize: 13, color: '#94a3b8' }}>Scheduled</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

// ─── History tab ─────────────────────────────────────────────────────────────

function HistoryContent({
  records,
  takenCount,
  adherenceRate,
}: {
  records: AdherenceRecord[];
  takenCount: number;
  adherenceRate: number;
}) {
  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 40,
        gap: 20,
      }}
    >
      {/* Adherence rate card */}
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 14,
          borderWidth: 1,
          borderColor: '#e2e8f0',
          padding: 28,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
          elevation: 1,
        }}
      >
        <Text style={{ color: BRAND, fontSize: 56, fontWeight: '800', lineHeight: 64 }}>
          {adherenceRate}%
        </Text>
        <Text style={{ color: '#0f172a', fontSize: 15, fontWeight: '500', marginTop: 6 }}>
          Overall Adherence Rate
        </Text>
        <Text style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>
          {takenCount} of {records.length} doses taken
        </Text>
      </View>

      {/* Dose History list */}
      <Text style={{ fontSize: 17, fontWeight: '700', color: '#0f172a' }}>Dose History</Text>

      {records.length === 0 ? (
        <Text style={{ color: '#94a3b8', fontSize: 14 }}>No history yet.</Text>
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
          {records.map((r, i) => {
            const isTaken = r.status === 'taken';
            const d = new Date(r.scheduledAt);
            return (
              <View
                key={r.id}
                style={{
                  flexDirection: 'row',
                  padding: 16,
                  borderTopWidth: i > 0 ? 1 : 0,
                  borderTopColor: '#f1f5f9',
                  gap: 12,
                  alignItems: 'flex-start',
                }}
              >
                {/* Status circle */}
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: isTaken ? '#22c55e' : '#ef4444',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 2,
                    flexShrink: 0,
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>
                    {isTaken ? '✓' : '✗'}
                  </Text>
                </View>

                {/* Details */}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ fontSize: 14, fontWeight: '700', color: '#0f172a', marginBottom: 4 }}
                  >
                    {fmtDate(d, {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                  <Text style={{ fontSize: 13, color: '#64748b', marginBottom: 1 }}>
                    Scheduled: {fmtTime(d)}
                  </Text>
                  {r.takenAt && (
                    <Text style={{ fontSize: 13, color: '#64748b', marginBottom: 5 }}>
                      Taken: {fmtTime(new Date(r.takenAt))}
                    </Text>
                  )}
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: isTaken ? '#16a34a' : '#dc2626',
                    }}
                  >
                    {isTaken ? 'Dose Taken' : 'Dose Missed'}
                  </Text>
                </View>

                {/* Video link */}
                {r.videoId && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                      flexShrink: 0,
                    }}
                  >
                    <Text style={{ fontSize: 12 }}>🎥</Text>
                    <Text style={{ fontSize: 13, color: BRAND, fontWeight: '500' }}>Video</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}
