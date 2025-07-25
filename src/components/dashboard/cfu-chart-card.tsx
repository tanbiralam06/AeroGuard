'use client';

import React from 'react';
import { Activity } from 'lucide-react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { CfuDataPoint } from '@/lib/types';
import { ChartTooltipContent } from '@/components/ui/chart';


type CfuChartCardProps = {
  data: CfuDataPoint[];
};

export default function CfuChartCard({ data }: CfuChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle>CFU/m³ vs. Time</CardTitle>
        </div>
        <CardDescription>Bacterial load over the last 12 hours.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 20,
                left: -10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Line
                type="monotone"
                dataKey="value"
                name="CFU/m³"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4, fill: 'hsl(var(--primary))' }}
                activeDot={{ r: 8, fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
