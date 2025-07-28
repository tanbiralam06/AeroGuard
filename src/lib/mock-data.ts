import type { Hospital, RoomData } from './types';

export const hospitals: Hospital[] = [
  {
    id: 'mercy_general',
    name: 'General Hospital',
    rooms: [
      { id: 'icu_101', name: 'ICU Room 101' },
      { id: 'icu_2', name: 'ICU Room 102' },
      { id: 'or_203', name: 'Operating Room 203' },
    ],
  },
  {
    id: 'city_central',
    name: 'Central Hospital',
    rooms: [
      { id: 'maternity_301', name: 'Maternity Ward 301' },
      { id: 'cardiac_402', name: 'Cardiac Unit 402' },
    ],
  },
  {
    id: 'st_judes',
    name: 'General Hospital 2',
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
  const baseSeed = simpleHash(`${hospitalId}-${roomId}`);
  const now = new Date();
  const timeSeed = Math.floor(now.getTime() / (1000 * 60 * 5)); // Seed changes every 5 minutes
  const seed = baseSeed + timeSeed;

  const rand = (min: number, max: number, offset = 0) => 
    Math.floor(seededRandom(seed + offset) * (max - min + 1)) + min;

  let currentCfu;

  // Generate currentCfu based on timeSeed for dynamism
  currentCfu = rand(5, 1000, 1); // Start with a general range

  // Special case for Mercy General ICU Room 101: Bias initial value to be Good
  if (hospitalId === 'mercy_general' && roomId === 'icu_101') {
      // If the generated value is moderate or poor, regenerate within the good range
      if (currentCfu > 250) {
          currentCfu = rand(5, 249, 1);
      }
      // Ensure subsequent values within the interval can go up to Moderate
      // This part relies on the 5-minute interval fetching in page.tsx
  } else if (roomId === 'icu_2') {
    currentCfu = rand(500, 1000, 1);
    if (currentCfu < 750) {
      currentCfu = rand(750, 1000, 1);
    }
  } // Other rooms use the initial rand(5, 1000, 1)


  const healthStatus = currentCfu > 750 ? 'Poor' : currentCfu > 250 ? 'Moderate' : 'Good';

  const generateCfuHistory = () => {
    const data = [];
    const now = new Date();
    // Generate data for the last 24 hours at 5-minute intervals
    for (let i = 24 * 12 - 1; i >= 0; i--) { // 24 hours * 12 intervals per hour (60/5)
      const time = new Date(now.getTime() - i * 5 * 60 * 1000); // i * 5 minutes
      const hour = time.getHours();
      const minute = time.getMinutes();
      let value = rand(5, 249, 100 + i); // Default to good range

      // Moderate range conditions for ICU Room 101 history
      if (hospitalId === 'mercy_general' && roomId === 'icu_101') {
        if (
          (hour >= 7 && hour < 9) || // 7am to 9am
          (hour >= 11 && hour < 14) || // 11am to 2pm (14 is 2pm in 24h format)
          (hour >= 16 && (hour < 19 || (hour === 19 && minute <= 30))) || // 4pm to 7:30pm
          (hour >= 20 && (hour < 22 || (hour === 22 && minute <= 30))) // 8:30pm to 10:30pm
        ) {  value = rand(250, 500, 100 + i);
        } else if (hour >= 22 || hour < 7 ) { // After 10:30pm to before 7am, mostly good
           value = rand(5, 249, 100 + i);
        }
        // Ensure some high values in ICU_2 history
      } else if (roomId === 'icu_2') {
         value = rand(500, 1000, 100 + i);
      }
       else { // Other rooms history
           value = rand(5, 1000, 100 + i);
       }

      data.push({
        time: time.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
        value,
      });
    }
    // ensure last point is current value
    data[data.length - 1].value = currentCfu;
    return data;
  };

  const cfuHistory = generateCfuHistory();

  const co2Max24h = rand(400, 900, 3);

  return {
    hospitalId,
    roomId,
    bacterialLoad: {
      current: currentCfu,
      threshold: {
        moderate: 250,
        high: 750,
      },
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