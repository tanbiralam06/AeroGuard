# **App Name**: AeroGuard

## Core Features:

- Location Identifier: Display Hospital ID and Room ID in the header.
- CFU/m3 Graph: Display a real-time CFU/m3 vs. Time graph.
- Bacterial Load Display: Display the current CFU/m3 level with a 'HIGH' or 'OK' status indicator.
- Environmental Parameters Panel: Show key environmental parameters such as CO2, PM2.5, PM4, PM10, O3, and TVOC. In this panel 3 columns where we display current value, 24 hours max and 24 hours min
- System Status & Actions: Display the Overall Air Health status and suggest actions, like adjusting ACH.
- Dynamic Action Recommendation: Use a generative AI tool to assess data, diagnose root causes, and dynamically determine 'Actions to be taken' such as increasing ACH (Air Changes per Hour) or activating UV sterilization based on detected contamination events or exceedance of thresholds. This tool reasons over available information about contamination history and patterns, system status, and external benchmarks to propose optimized interventions, including adjustment of ACH, UV sterilization activation, and initiating deeper investigations by facilities personnel.
- Multi-Location Support: Allow switching between multiple hospital locations and rooms to view specific data.

## Style Guidelines:

- Use a deep teal (#008080) to convey trust and health.
- Light grayish-teal (#E0EEEE) to maintain focus on the data.
- Soft coral (#F08080) to highlight critical alerts and interactive elements.
- Inter' sans-serif, for a clean, neutral and modern look.
- Use minimalist icons to represent environmental parameters; the style of Noun Project or Google Material Symbols.
- Divide the dashboard into clear, logical sections for real-time data, environmental parameters, and system status.
- Subtle animations for loading data and updating graphs to provide a dynamic feel.