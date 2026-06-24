export const tradesExamples: Record<string, string> = {
  hvac: `Arrived at 14 Maple Street. Customer reported no heating. Checked thermostat, found it set correctly at 20 degrees. Inspected boiler, found error code E9 — pressure low at 0.6 bar. Repressurised system to 1.5 bar, bled radiators in living room and master bedroom. Checked diverter valve, functioning correctly. Test fired system, heating now working throughout. Advised customer to monitor pressure. No parts required today, labour only.`,
  boiler: `Annual boiler service at 7 Oak Avenue. Worcester Bosch 30i combi, 6 years old. Checked flue and combustion, CO2 at 9.1 percent, CO at 18 ppm, both within limits. Cleaned heat exchanger, removed scale buildup. Replaced gas filter. Checked ignition electrodes, slight wear, replaced as precaution. Gas pressure at burner 12.5 mbar, within manufacturer spec. All seals checked, no leaks found. Issued gas safety certificate.`,
  elec: `EICR inspection at 22 High Street commercial unit. Single phase 100 amp supply. Found RCD in consumer unit not tripping within time limits, replaced RCD. Socket in back office showing overheating signs, replaced socket and back box. All circuits polarity correct. Earth bonding to gas and water present. No C1 or C2 defects found. Certificate issued, next inspection in 5 years.`,
}

export function buildTradesPrompt(jobType: string, jobRef: string, spoken: string): string {
  return `You are a trades documentation assistant for UK field service engineers. A ${jobType} technician dictated their job notes. Job ref/address: ${jobRef}.

Spoken notes:
"${spoken}"

Return ONLY valid JSON, no markdown, no backticks. Schema:
{
  "report": {
    "job_type": "string",
    "job_ref": "string",
    "date": "string (today in DD Mon YYYY format)",
    "technician_note": "string (professional 3-5 sentence summary)",
    "work_completed": ["bullet points of specific tasks done"],
    "parts_used": ["parts or ['None required']"],
    "system_status": "Satisfactory | Requires follow-up | Unsatisfactory",
    "next_action": "string"
  },
  "client_summary": {
    "greeting": "string (friendly one-liner outcome)",
    "what_we_did": "string (plain English, no jargon, 2-3 sentences)",
    "outcome": "string (current state in one sentence)",
    "next_steps": "string (what to expect or do next)"
  }
}`
}
