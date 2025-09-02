import type { Hospital, RoomData } from './types';

export const hospitals: Hospital[] = [
  {
    id: 'mercy_general',
    name: 'General Hospital',
    rooms: [
      { id: 'icu_101', name: 'ICU Room 101' },
      { id: 'icu_2', name: 'ICU Room 102' },
      { id: 'or_203', name: 'ICU Room 103' },
      { id: 'icu_104', name: 'ICU Room 104' },
    ],
  },
  {
    id: 'city_central',
    name: 'Central Hospital',
    rooms: [
      { id: 'maternity_301', name: 'ICU Room 301' },
      { id: 'cardiac_402', name: 'ICU Room 402' },
    ],
  },
  {
    id: 'st_judes',
    name: 'General Hospital 2',
    rooms: [
      { id: 'pediatrics_a', name: 'ICU Room 101' },
      { id: 'pediatrics_b', name: 'ICU Room 102' },
    ],
  },
  {
    id: 'new_hospital',
    name: 'New City Hospital',
    rooms: [
      { id: 'room_a', name: 'Room A' },
      { id: 'room_b', name: 'Room B' },
    ],
  },
  {
    id: 'facility',
    name: 'Facility',
    rooms: [
      { id: 'room_a', name: 'Room A' },
      { id: 'room_b', name: 'Room B' },
    ],
  },
];

/** Utility functions */
const simpleHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const randWithSeed = (seed: number) => (min: number, max: number, offset = 0) =>
  Math.floor(seededRandom(seed + offset) * (max - min + 1)) + min;

/** Room-specific overrides for current CFU */
const getCurrentCfu = (hospitalId: string, roomId: string, rand: ReturnType<typeof randWithSeed>): number => {
  let value = rand(5, 1000, 1);

  if (hospitalId === 'mercy_general' && roomId === 'icu_101') {
    return value > 250 ? rand(5, 249, 1) : value;
  }
  if (roomId === 'icu_2') {
    return rand(750, 1000, 1);
  }
  if (hospitalId === 'new_hospital') {
    return roomId === 'room_a' ? rand(50, 70, 1)
         : roomId === 'room_b' ? rand(500, 750, 1)
         : value;
  }
  if (hospitalId === 'facility') {
    return roomId === 'room_a' ? rand(750, 900, 1)
         : roomId === 'room_b' ? rand(20, 80, 1)
         : value;
  }
  return value;
};

/** Room-specific CFU history */
const getCfuHistory = (
  hospitalId: string,
  roomId: string,
  currentCfu: number,
  rand: ReturnType<typeof randWithSeed>
) => {
  const data: { time: string; value: number }[] = [];
  const now = new Date();

  let intervalMinutes = (hospitalId === 'new_hospital' || hospitalId === 'facility') ? 30 : 5;
  const numberOfIntervals = 24 * (60 / intervalMinutes);

  for (let i = numberOfIntervals - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * intervalMinutes * 60 * 1000);
    const hour = time.getHours();
    const minute = time.getMinutes();

    let value = rand(5, 249, 100 + i);

    if (hospitalId === 'new_hospital') {
      value = roomId === 'room_a' ? rand(50, 70, 50 + i)
            : roomId === 'room_b' ? rand(500, 750, 100 + i)
            : rand(5, 1000, 100 + i);
    } else if (hospitalId === 'facility') {
      value = roomId === 'room_a' ? rand(750, 900, 50 + i)
            : roomId === 'room_b' ? rand(20, 80, 100 + i)
            : rand(5, 1000, 100 + i);
    } else if (hospitalId === 'mercy_general' && ['icu_101', 'or_203', 'icu_104'].includes(roomId)) {
      if (
        (hour >= 7 && hour < 9) ||
        (hour >= 11 && hour < 14) ||
        (hour >= 16 && (hour < 19 || (hour === 19 && minute <= 30))) ||
        (hour >= 20 && (hour < 22 || (hour === 22 && minute <= 30)))
      ) {
        value = rand(250, 500, 100 + i);
      } else if (hour >= 22 || hour < 7) {
        value = rand(5, 249, 100 + i);
      }
    } else if (roomId === 'icu_2') {
      value = rand(500, 1000, 100 + i);
    } else {
      value = rand(5, 1000, 100 + i);
    }

    data.push({
      time: time.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
      value,
    });
  }

  // last point must reflect current value
  data[data.length - 1].value = currentCfu;
  return data;
};

/** Main data generator */
export const getRoomData = (hospitalId: string, roomId: string): RoomData => {
  const baseSeed = simpleHash(`${hospitalId}-${roomId}`);
  const timeSeed = Math.floor(Date.now() / (1000 * 60 * 5)); // new seed every 5 min
  const rand = randWithSeed(baseSeed + timeSeed);

  const currentCfu = getCurrentCfu(hospitalId, roomId, rand);
  const healthStatus = currentCfu > 750 ? 'Poor' : currentCfu > 250 ? 'Moderate' : 'Good';
  const cfuHistory = getCfuHistory(hospitalId, roomId, currentCfu, rand);

  const co2Max24h = rand(400, 900, 3);

  return {
    hospitalId,
    roomId,
    bacterialLoad: {
      current: currentCfu,
      threshold: { moderate: 250, high: 750 },
    },
    environmentalParameters: {
      co2: { current: rand(400, co2Max24h, 2), max24h: co2Max24h, min24h: rand(350, 399, 4), unit: 'ppm', name: 'CO2' },
      pm25: { current: rand(5, 30, 5), max24h: rand(31, 50, 6), min24h: rand(1, 4, 7), unit: 'µg/m³', name: 'PM2.5' },
      pm4: { current: rand(10, 40, 8), max24h: rand(41, 60, 9), min24h: rand(2, 9, 10), unit: 'µg/m³', name: 'PM4' },
      pm10: { current: rand(15, 50, 11), max24h: rand(51, 80, 12), min24h: rand(5, 14, 13), unit: 'µg/m³', name: 'PM10' },
      o3: { current: rand(10, 70, 14), max24h: rand(71, 100, 15), min24h: rand(1, 9, 16), unit: 'ppb', name: 'Ozone' },
      tvoc: { current: rand(50, 300, 17), max24h: rand(301, 500, 18), min24h: rand(10, 49, 19), unit: 'µg/m³', name: 'TVOC' },
    },
    systemStatus: {
      overallHealth: healthStatus,
      ach: rand(6, 12, 20),
      uvSterilization: healthStatus === 'Poor' ? 'Active' : 'Inactive',
      lastContaminationEvent: rand(0, 1, 21) === 1 ? 'High pollen count detected 2 days ago.' : 'No recent events.',
    },
    cfuHistory,
  };
};
