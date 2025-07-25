'use client';

import React from 'react';
import { Cloud, FlaskConical, Sun, Wind } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { EnvironmentalParametersData, EnvParameter } from '@/lib/types';

const iconMap: { [key: string]: React.ReactNode } = {
  co2: <Cloud className="h-5 w-5 text-primary" />,
  pm25: <Wind className="h-5 w-5 text-primary" />,
  pm4: <Wind className="h-5 w-5 text-primary" />,
  pm10: <Wind className="h-5 w-5 text-primary" />,
  o3: <Sun className="h-5 w-5 text-primary" />,
  tvoc: <FlaskConical className="h-5 w-5 text-primary" />,
};

const ParameterRow = ({ parameter }: { parameter: EnvParameter }) => (
  <li className="flex items-center justify-between py-3">
    <div className="flex items-center gap-3">
      {iconMap[parameter.name.toLowerCase().replace('.', '')]}
      <span className="font-medium text-sm">{parameter.name}</span>
    </div>
    <div className="grid grid-cols-3 gap-2 w-[180px] text-right">
      <div className="flex flex-col items-end">
        <span className="font-semibold tabular-nums">{parameter.current}</span>
        <span className="text-xs text-muted-foreground">{parameter.unit}</span>
      </div>
      <div className="flex flex-col items-end">
        <span className="font-semibold tabular-nums text-muted-foreground">{parameter.max24h}</span>
        <span className="text-xs text-muted-foreground">Max</span>
      </div>
      <div className="flex flex-col items-end">
        <span className="font-semibold tabular-nums text-muted-foreground">{parameter.min24h}</span>
        <span className="text-xs text-muted-foreground">Min</span>
      </div>
    </div>
  </li>
);


export default function EnvParametersCard({ data }: { data: EnvironmentalParametersData }) {
  const parameters = Object.values(data);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Environmental Parameters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 w-full text-right mb-2 px-3">
            <span className="text-xs font-bold text-muted-foreground">CURRENT</span>
            <span className="text-xs font-bold text-muted-foreground">24H MAX</span>
            <span className="text-xs font-bold text-muted-foreground">24H MIN</span>
        </div>
        <ul className="divide-y divide-border">
          {parameters.map((param) => (
            <ParameterRow key={param.name} parameter={param} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
