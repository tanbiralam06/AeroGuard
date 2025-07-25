'use client';

import React from 'react';
import { HeartPulse, ArrowRight } from 'lucide-react';
import type { SystemStatusData, BacterialLoadData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type SystemStatusCardProps = {
  systemData: SystemStatusData;
  bacterialLoadData: BacterialLoadData;
};

const healthVariantMap: Record<SystemStatusData['overallHealth'], 'default' | 'destructive' | 'secondary'> = {
    Good: 'default',
    Moderate: 'secondary',
    Poor: 'destructive',
    Fair: 'default', // Fair is not used anymore but kept for type safety
};

const healthColorMap: Record<SystemStatusData['overallHealth'], string> = {
    Good: 'bg-green-500 hover:bg-green-600',
    Moderate: 'bg-yellow-500 hover:bg-yellow-600 text-black',
    Poor: 'bg-red-500',
    Fair: 'bg-yellow-500 hover:bg-yellow-600', // Fair is not used anymore
};

const getActionForBacterialLoad = (cfu: number): string => {
  if (cfu > 750) {
    return 'Increase ACH (Air Changes per Hour) immediately. Investigate contamination source.';
  }
  if (cfu > 250) {
    return 'Increase local airflow and monitor levels closely.';
  }
  return 'Normal activity. Current air quality is optimal.';
};


export default function SystemStatusCard({ systemData, bacterialLoadData }: SystemStatusCardProps) {
  const { overallHealth, ach, uvSterilization } = systemData;
  const action = getActionForBacterialLoad(bacterialLoadData.current);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-primary" />
            <CardTitle>System Status & Actions</CardTitle>
        </div>
        <CardDescription>Overall air health and recommended actions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-3">
          <span className="text-sm font-medium">Overall Health</span>
          <Badge variant={healthVariantMap[overallHealth]} className={healthColorMap[overallHealth]}>
            {overallHealth === 'Poor' ? 'High' : overallHealth.toUpperCase()}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Air Changes/Hour (ACH)</span>
          <span className="font-semibold">{ach}</span>
        </div>
        {/* <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">UV Sterilization</span>
          <span className={`font-semibold ${uvSterilization === 'Active' ? 'text-green-600' : 'text-muted-foreground'}`}>
            {uvSterilization}
          </span>
        </div> */}

        <div className="space-y-2 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <h4 className="font-semibold text-primary">Action to be Taken</h4>
            <div className="text-sm text-muted-foreground flex items-start gap-2 pt-1">
                <ArrowRight className="h-4 w-4 shrink-0 mt-1 text-primary"/>
                <span>{action}</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
