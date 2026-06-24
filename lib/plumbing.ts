export const plumbingExamples: Record<string, string> = {
  pipe_repair: `Arrived at 8 Cedar Close. Customer reported low water pressure in kitchen and wet patch under hallway floorboards. Isolated mains supply. Lifted boards, found 22mm copper pipe with pinhole corrosion leak — approx 300mm section affected. Cut out damaged section, soldered in new 22mm copper pipe with two end-feed couplings. Pressure tested at 6 bar for 30 minutes, no further leaks. Restored supply. Cold water pressure now 2.5 bar, hot 2.4 bar. Advised customer to monitor for residual damp over 48 hours.`,
  leak_inspection: `Leak investigation at 3 Birch Lane. Customer reported damp patches on kitchen ceiling below bathroom. Ran dye test through waste systems. Found bath waste trap union nut had worked loose, causing intermittent leak when bath draining. Tightened union, applied PTFE tape. Checked all other bathroom waste joints — toilet pan connector, washbasin waste, shower tray. All now secure. Ran all fixtures for 15 minutes, no further leaks detected. Static pressure 3.0 bar, flow pressure 2.6 bar. Recommended pipe lagging on exposed copper in loft as precaution against frost.`,
  boiler_install: `New boiler installation at 21 Elm Road. Removed old unvented cylinder and indirect tank from airing cupboard. Installed Worcester Bosch Greenstar 8000 Life 30kw combi. New 22mm gas supply run from meter, 15mm compression fittings throughout. Flued through external wall using 60/100 concentric flue kit. Filled and pressure tested system at 6 bar, no leaks. Commissioned boiler — gas pressure at burner 20 mbar, hot water 60 degrees, heating flow 70 degrees. All TRVs checked and set. System flushed with Fernox F1 inhibitor. Issued building regs compliance certificate and Benchmark commissioning checklist.`,
}

export function buildPlumbingPrompt(jobType: string, jobRef: string, spoken: string): string {
  return `You are a plumbing documentation assistant for UK field service engineers. A ${jobType} plumber dictated their job notes. Job ref/address: ${jobRef}.

Spoken notes:
"${spoken}"

Return ONLY valid JSON, no markdown, no backticks. Schema:
{
  "job_report": {
    "job_type": "string",
    "job_ref": "string",
    "date": "string (today in DD Mon YYYY format)",
    "technician_note": "string (professional 3-5 sentence summary)",
    "pipe_specs": "string (pipe diameter, material, and configuration observed, e.g. '22mm copper compression, 15mm push-fit waste')",
    "pressure_readings": "string (all pressure readings taken, e.g. 'Static 3.0 bar, flow 2.6 bar, tested at 6 bar')",
    "fault_found": "string (root cause of the issue identified, or 'No fault — routine installation')",
    "work_completed": ["bullet points of specific tasks done"],
    "materials_used": ["materials and fittings used, or ['None required']"],
    "system_status": "Satisfactory | Requires follow-up | Unsatisfactory",
    "next_action": "string"
  },
  "client_summary": {
    "greeting": "string (friendly one-liner outcome)",
    "what_we_did": "string (plain English, no jargon, 2-3 sentences)",
    "outcome": "string (current state of the system in one sentence)",
    "next_steps": "string (what to expect or do next)"
  }
}`
}
