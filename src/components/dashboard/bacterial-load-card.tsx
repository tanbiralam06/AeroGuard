'use client';

import React from 'react';
import { ShieldAlert, ShieldCheck, ShieldX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BacterialLoadData } from '@/lib/types';

type BacterialLoadCardProps = {
  data: BacterialLoadData;
};

export default function BacterialLoadCard({ data }: BacterialLoadCardProps) {
  const { current, threshold } = data;
  const status = current > threshold.high ? 'High' : current > threshold.moderate ? 'Moderate' : 'OK';

  const statusConfig = {
    OK: {
      icon: <ShieldCheck className="h-4 w-4 text-green-500" />,
      badge: <Badge className="bg-green-500 hover:bg-green-600">OK</Badge>,
      text: `Threshold for moderate alert is ${threshold.moderate} CFU/m³`,
    },
    Moderate: {
      icon: <ShieldAlert className="h-4 w-4 text-yellow-500" />,
      badge: <Badge className="bg-yellow-500 hover:bg-yellow-600">MODERATE</Badge>,
      text: `Threshold for high alert is ${threshold.high} CFU/m³`,
    },
    High: {
      icon: <ShieldX className="h-4 w-4 text-destructive" />,
      badge: <Badge variant="destructive">HIGH</Badge>,
       text: `Value is above the high alert threshold of ${threshold.high} CFU/m³`,
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Bacterial Load (CFU/m³)</CardTitle>
        {currentStatus.icon}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-4">
            <span className="text-4xl font-bold">{current}</span>
            {currentStatus.badge}
        </div>
        <p className="text-xs text-muted-foreground">
          {currentStatus.text}
        </p>
      </CardContent>
    </Card>
  );
}
