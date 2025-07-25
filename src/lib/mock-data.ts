import type { Hospital, RoomData } from './types';

export const hospitals: Hospital[] = [
  {
    id: 'mercy_general',
    name: 'Mercy General Hospital',
    rooms: [
      { id: 'icu_101', name: 'ICU Room 101' },
      { id: 'or_203', name: 'Operating Room 203' },
      { id: 'er_005', name: 'Emergency Room 5' },
    ],
  },
  {
    id: 'city_central',
    name: 'City Central Hospital',
    rooms: [
      { id: 'maternity_301', name: 'Maternity Ward 301' },
      { id: 'cardiac_402', name: 'Cardiac Unit 402' },
    ],
  },
  {
    id: 'st_judes',
    name: 'St. Jude\'s Children\'s Hospital',
    rooms: [
      { id: 'pediatrics_a', name: 'Pediatrics Wing A' },
      { id: 'pediatrics_b', name: 'Pediatrics Wing B' },
    ],
  },
];

// Simple hash function to make random data deterministic based on input strings
const simpleHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

const seededRandom = (seed: number) => {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export const getRoomData = (hospitalId: string, roomId: string): RoomData => {
  const seed = simpleHash(`${hospitalId}-${roomId}`);
  const rand = (min: number, max: number, offset = 0) => 
    Math.floor(seededRandom(seed + offset) * (max - min + 1)) + min;

  const currentCfu = rand(5, 250, 1);
  const healthStatus = currentCfu > 150 ? 'Poor' : currentCfu > 75 ? 'Fair' : 'Good';

  const generateCfuHistory = () => {
    const data = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000); // last 12 hours
      data.push({
        time: time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        value: rand(5, 250, 100 + i),
      });
    }
    // ensure last point is current value
    data[11].value = currentCfu;
    return data;
  };
  
  const cfuHistory = generateCfuHistory();
  const cfuValues = cfuHistory.map(h => h.value);
  const maxCfu24h = Math.max(...cfuValues, currentCfu);
  const minCfu24h = Math.min(...cfuValues, currentCfu);

  return {
    hospitalId,
    roomId,
    bacterialLoad: {
      current: currentCfu,
      threshold: 150,
    },
    environmentalParameters: {
      co2: { current: rand(400, 1200, 2), max24h: rand(1201, 1500, 3), min24h: rand(350, 399, 4), unit: 'ppm', name: 'CO2' },
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
