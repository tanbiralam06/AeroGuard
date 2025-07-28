'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const hospital = hospitals.find(h => h.id === selectedHospital);
    if (hospital) {
      setRooms(hospital.rooms);
      if (!hospital.rooms.some(r => r.id === selectedRoom)) {
        setSelectedRoom(hospital.rooms[0].id);
      } else {
        // If the selected room is still in the new hospital, keep it.
        // This prevents resetting to the first room when just the hospital changes.
        setSelectedRoom(selectedRoom);
      }
    }
  }, [selectedHospital, hospitals, selectedRoom]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = () => {
      try {
        const roomData = getRoomData(selectedHospital, selectedRoom);
        setData(roomData);
      } catch (error) {
        console.error("Failed to get room data", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not fetch room data. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch data initially
    fetchData();

    // Set up interval to fetch data every 5 minutes (300000 milliseconds)
    const intervalId = setInterval(fetchData, 60000); // Adjust the interval as needed

    // Clean up interval on component unmount or when dependencies change
    return () => clearInterval(intervalId);

  }, [selectedHospital, selectedRoom, toast]);

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
                systemData={data.systemStatus}
                bacterialLoadData={data.bacterialLoad}
              />
              <EnvParametersCard data={data.environmentalParameters} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}