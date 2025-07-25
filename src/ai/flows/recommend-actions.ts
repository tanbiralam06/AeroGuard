'use server';

/**
 * @fileOverview This file contains the Genkit flow for recommending actions to improve air quality.
 * It analyzes air quality data and suggests actions like adjusting ACH or activating UV sterilization.
 *
 * @exports recommendActions - An async function that takes air quality data as input and returns action recommendations.
 * @exports RecommendActionsInput - The input type for the recommendActions function.
 * @exports RecommendActionsOutput - The output type for the recommendActions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendActionsInputSchema = z.object({
  cfuPerCubicMeter: z.number().describe('CFU/m3 level'),
  co2: z.number().describe('CO2 level in ppm'),
  pm25: z.number().describe('PM2.5 level in ug/m3'),
  pm4: z.number().describe('PM4 level in ug/m3'),
  pm10: z.number().describe('PM10 level in ug/m3'),
  o3: z.number().describe('O3 level in ppm'),
  tvoc: z.number().describe('TVOC level in ug/m3'),
  ach: z.number().describe('Air Changes per Hour'),
  contaminationHistory: z
    .string()
    .describe('History of contamination events in the room.'),
  systemStatus: z.string().describe('Current status of the air purification system.'),
});
export type RecommendActionsInput = z.infer<typeof RecommendActionsInputSchema>;

const RecommendActionsOutputSchema = z.object({
  actions: z
    .string()
    .describe(
      'Recommended actions to take, such as adjusting ACH, activating UV sterilization, or initiating further investigation.'
    ),
  reasoning: z.string().describe('The AI reasoning behind the recommended actions.'),
});
export type RecommendActionsOutput = z.infer<typeof RecommendActionsOutputSchema>;

export async function recommendActions(input: RecommendActionsInput): Promise<RecommendActionsOutput> {
  return recommendActionsFlow(input);
}

const recommendActionsPrompt = ai.definePrompt({
  name: 'recommendActionsPrompt',
  input: {schema: RecommendActionsInputSchema},
  output: {schema: RecommendActionsOutputSchema},
  prompt: `You are an AI assistant specializing in recommending actions to improve air quality in hospital rooms. 

Analyze the provided air quality data, contamination history, and system status to determine the best course of action. Consider adjusting ACH (Air Changes per Hour), activating UV sterilization, or suggesting further investigation by facilities personnel.

Air Quality Data:
- CFU/m3: {{{cfuPerCubicMeter}}}
- CO2: {{{co2}}} ppm
- PM2.5: {{{pm25}}} ug/m3
- PM4: {{{pm4}}} ug/m3
- PM10: {{{pm10}}} ug/m3
- O3: {{{o3}}} ppm
- TVOC: {{{tvoc}}} ug/m3
- ACH: {{{ach}}}

Contamination History: {{{contaminationHistory}}}
System Status: {{{systemStatus}}}

Respond with specific actions and a clear explanation of your reasoning.

Actions:
Reasoning: `,
});

const recommendActionsFlow = ai.defineFlow(
  {
    name: 'recommendActionsFlow',
    inputSchema: RecommendActionsInputSchema,
    outputSchema: RecommendActionsOutputSchema,
  },
  async input => {
    const {output} = await recommendActionsPrompt(input);
    return output!;
  }
);
