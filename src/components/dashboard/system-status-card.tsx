'use client';

import React from 'react';
import { HeartPulse, Wand2, ArrowRight } from 'lucide-react';
import type { RecommendActionsOutput } from '@/ai/flows/recommend-actions';
import type { SystemStatusData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

type SystemStatusCardProps = {
  data: SystemStatusData;
  onGenerate: () => void;
  aiResult: {
    loading: boolean;
    data: RecommendActionsOutput | null;
    error: string | null;
  };
};

const healthVariantMap: Record<SystemStatusData['overallHealth'], 'default' | 'destructive'> = {
    Good: 'default',
    Fair: 'default',
    Poor: 'destructive',
};

const healthColorMap: Record<SystemStatusData['overallHealth'], string> = {
    Good: 'bg-green-500 hover:bg-green-600',
    Fair: 'bg-yellow-500 hover:bg-yellow-600',
    Poor: 'bg-red-500',
};


export default function SystemStatusCard({ data, onGenerate, aiResult }: SystemStatusCardProps) {
  const { overallHealth, ach, uvSterilization } = data;

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
            {overallHealth}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Air Changes/Hour (ACH)</span>
          <span className="font-semibold">{ach}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">UV Sterilization</span>
          <span className={`font-semibold ${uvSterilization === 'Active' ? 'text-green-600' : 'text-muted-foreground'}`}>
            {uvSterilization}
          </span>
        </div>

        <div className="space-y-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center justify-between">
                <h4 className="font-semibold text-primary">AI Recommendations</h4>
                <Button size="sm" onClick={onGenerate} disabled={aiResult.loading}>
                    <Wand2 className="mr-2 h-4 w-4" />
                    {aiResult.loading ? 'Analyzing...' : 'Get Actions'}
                </Button>
            </div>

            {aiResult.loading && (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            )}
            {aiResult.error && <p className="text-sm text-destructive">{aiResult.error}</p>}
            {aiResult.data && (
                <div className="space-y-3 text-sm">
                    <div>
                        <h5 className="font-medium">Actions to be taken:</h5>
                        <p className="text-muted-foreground flex items-start gap-2 pt-1">
                            <ArrowRight className="h-4 w-4 shrink-0 mt-1 text-primary"/>
                            <span>{aiResult.data.actions}</span>
                        </p>
                    </div>
                     <div>
                        <h5 className="font-medium">Reasoning:</h5>
                        <p className="text-muted-foreground italic">"{aiResult.data.reasoning}"</p>
                    </div>
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
