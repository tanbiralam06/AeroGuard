'use client';

import { useState, useEffect } from 'react';
import type { RecommendActionsOutput } from '@/ai/flows/recommend-actions';
import { recommendActions } from '@/ai/flows/recommend-actions';
import { useToast } from '@/hooks/use-toast';
import type { Hospital, RoomData } from '@/lib/types';
import { hospitals as mockHospitals, getRoomData } from '@/lib/mock-data';
import AeroGuardHeader from '@/components/dashboard/aero-guard-header';
import BacterialLoadCard from '@/components/dashboard/bacterial-load-card';
import CfuChartCard from '@/components/dashboard/cfu-chart-card';
import SystemStatusCard from '@/components/dashboard/system-status-card';
import EnvParametersCard from '@/components/dashboard/env-parameters-card';
import DashboardSkeleton from '@/components/dashboard/dashboard-skeleton';

export default function DashboardPage() {
  const { toast } = useToast();
  const [hospitals] = useState<Hospital[]>(mockHospitals);
  const [selectedHospital, setSelectedHospital] = useState<string>(hospitals[0].id);
  const [rooms, setRooms] = useState(hospitals[0].rooms);
  const [selectedRoom, setSelectedRoom] = useState<string>(hospitals[0].rooms[0].id);

  const [data, setData] = useState<RoomData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [aiResult, setAiResult] = useState<{
    loading: boolean;
    data: RecommendActionsOutput | null;
    error: string | null;
  }>({ loading: false, data: null, error: null });

  useEffect(() => {
    const hospital = hospitals.find(h => h.id === selectedHospital);
    if (hospital) {
      setRooms(hospital.rooms);
      // If the currently selected room is not in the new hospital, default to the first room.
      if (!hospital.rooms.some(r => r.id === selectedRoom)) {
        setSelectedRoom(hospital.rooms[0].id);
      }
    }
  }, [selectedHospital, hospitals, selectedRoom]);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    const timer = setTimeout(() => {
      setData(getRoomData(selectedHospital, selectedRoom));
      setAiResult({ loading: false, data: null, error: null });
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedHospital, selectedRoom]);

  const handleGenerateRecommendation = async () => {
    if (!data) return;

    setAiResult({ loading: true, data: null, error: null });

    try {
      const result = await recommendActions({
        cfuPerCubicMeter: data.bacterialLoad.current,
        co2: data.environmentalParameters.co2.current,
        pm25: data.environmentalParameters.pm25.current,
        pm4: data.environmentalParameters.pm4.current,
        pm10: data.environmentalParameters.pm10.current,
        o3: data.environmentalParameters.o3.current,
        tvoc: data.environmentalParameters.tvoc.current,
        ach: data.systemStatus.ach,
        contaminationHistory: data.systemStatus.lastContaminationEvent,
        systemStatus: `Overall health is ${data.systemStatus.overallHealth}. UV Sterilization is ${data.systemStatus.uvSterilization}.`,
      });
      setAiResult({ loading: false, data: result, error: null });
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setAiResult({ loading: false, data: null, error: `Failed to get recommendations: ${errorMessage}` });
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch AI recommendations. Please try again.',
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AeroGuardHeader
        hospitals={hospitals}
        rooms={rooms}
        selectedHospital={selectedHospital}
        onHospitalChange={setSelectedHospital}
        selectedRoom={selectedRoom}
        onRoomChange={setSelectedRoom}
      />
      <main className="flex-1 p-4 sm:p-6">
        {isLoading || !data ? (
          <DashboardSkeleton />
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="flex flex-col gap-6 lg:col-span-2">
              <BacterialLoadCard data={data.bacterialLoad} />
              <CfuChartCard data={data.cfuHistory} />
            </div>
            <div className="flex flex-col gap-6 lg:col-span-1">
              <SystemStatusCard
                data={data.systemStatus}
                onGenerate={handleGenerateRecommendation}
                aiResult={aiResult}
              />
              <EnvParametersCard data={data.environmentalParameters} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
