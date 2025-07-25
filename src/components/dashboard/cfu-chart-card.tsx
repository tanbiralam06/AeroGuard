'use client';

import React from 'react';
import { Activity } from 'lucide-react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { CfuDataPoint } from '@/lib/types';
import { ChartTooltipContent, ChartContainer, type ChartConfig } from '@/components/ui/chart';

type CfuChartCardProps = {
  data: CfuDataPoint[];
};

const chartConfig = {
  value: {
    label: 'CFU/m³',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

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
            <ChartContainer config={chartConfig}>
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
                  stroke="var(--color-value)"
                  strokeWidth={2}
                  dot={{ r: 4, fill: 'var(--color-value)' }}
                  activeDot={{ r: 8, fill: 'var(--color-value)' }}
                />
              </LineChart>
            </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
