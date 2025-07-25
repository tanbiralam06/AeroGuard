'use client';

import React from 'react';
import { Hospital as HospitalIcon, BedDouble } from 'lucide-react';
import type { Hospital } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';

type AeroGuardHeaderProps = {
  hospitals: Hospital[];
  rooms: { id: string; name: string }[];
  selectedHospital: string;
  onHospitalChange: (id: string) => void;
  selectedRoom: string;
  onRoomChange: (id: string) => void;
};

export default function AeroGuardHeader({
  hospitals,
  rooms,
  selectedHospital,
  onHospitalChange,
  selectedRoom,
  onRoomChange,
}: AeroGuardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="Biomoneta Logo" width={64} height={64} />
      </div>
      <div className="ml-auto flex flex-col md:flex-row items-center gap-2 md:gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <HospitalIcon className="h-5 w-5 text-muted-foreground" />
          <Select value={selectedHospital} onValueChange={onHospitalChange}>
            <SelectTrigger className="w-full md:w-[250px]">
              <SelectValue placeholder="Select Hospital" />
            </SelectTrigger>
            <SelectContent>
              {hospitals.map((hospital) => (
                <SelectItem key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <BedDouble className="h-5 w-5 text-muted-foreground" />
          <Select value={selectedRoom} onValueChange={onRoomChange}>
            <SelectTrigger className="w-full md:w-[220px]">
              <SelectValue placeholder="Select Room" />
            </SelectTrigger>
            <SelectContent>
              {rooms.map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name}
                </SelectItem>
              ))
              }
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}
