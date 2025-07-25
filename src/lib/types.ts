
export type EnvParameter = {
  current: number;
  max24h: number;
  min24h: number;
  unit: string;
  name: string;
};

export type CfuDataPoint = {
  time: string;
  value: number;
};

export type SystemStatusData = {
  overallHealth: 'Good' | 'Fair' | 'Poor' | 'Moderate';
  ach: number;
  uvSterilization: 'Active' | 'Inactive';
  lastContaminationEvent: string;
};

export type BacterialLoadData = {
  current: number;
  threshold: {
    moderate: number;
    high: number;
  };
};

export type EnvironmentalParametersData = {
  co2: EnvParameter;
  pm25: EnvParameter;
  pm4: EnvParameter;
  pm10: EnvParameter;
  o3: EnvParameter;
  tvoc: EnvParameter;
};


export type RoomData = {
  hospitalId: string;
  roomId: string;
  bacterialLoad: BacterialLoadData;
  environmentalParameters: EnvironmentalParametersData;
  systemStatus: SystemStatusData;
  cfuHistory: CfuDataPoint[];
};

export type Hospital = {
  id: string;
  name: string;
  rooms: { id: string; name: string }[];
};
