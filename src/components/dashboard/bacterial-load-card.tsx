'use client';

import React from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BacterialLoadData } from '@/lib/types';

type BacterialLoadCardProps = {
  data: BacterialLoadData;
};

export default function BacterialLoadCard({ data }: BacterialLoadCardProps) {
  const { current, threshold } = data;
  const isHigh = current > threshold;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Bacterial Load (CFU/m³)</CardTitle>
        {isHigh ? (
          <ShieldAlert className="h-4 w-4 text-destructive" />
        ) : (
          <ShieldCheck className="h-4 w-4 text-green-500" />
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-4">
            <span className="text-4xl font-bold">{current}</span>
            <Badge variant={isHigh ? 'destructive' : 'default'} className={isHigh ? '' : 'bg-green-500 hover:bg-green-600'}>
                {isHigh ? 'HIGH' : 'OK'}
            </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Threshold for high alert is {threshold} CFU/m³
        </p>
      </CardContent>
    </Card>
  );
}
