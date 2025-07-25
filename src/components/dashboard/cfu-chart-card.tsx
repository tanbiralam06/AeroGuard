'use client';

import React from 'react';
import { Activity } from 'lucide-react';
import { Line, Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
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
        <CardDescription>Bacterial load over the last 24 hours.</CardDescription>
      </CardHeader>
      <CardContent className="pr-0">
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ChartContainer config={chartConfig}>
                <AreaChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 20,
                    left: -20,
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
                  <Area
                    type="linear"
                    dataKey="value"
                    name="CFU/m³"
                    stroke="var(--color-value)"
                    fill="var(--color-value)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}