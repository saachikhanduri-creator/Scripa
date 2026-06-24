export const vetExamples: Record<string, string> = {
  dog: `Saw Biscuit, a 4-year-old male neutered Labrador. Owner reports lethargy and reduced appetite for 3 days. On examination, mild fever at 39.4, slightly enlarged submandibular lymph nodes, no other abnormalities. Coat in good condition. No vomiting or diarrhoea. Suspect early viral infection. Blood panel showed mildly elevated white cell count. Prescribed 5-day course of amoxicillin 250mg twice daily. Advised recheck if no improvement in 48 hours. Weight 32kg, up 1kg from last visit, discussed weight management.`,
  cat: `Consultation with Mango, 9-year-old female spayed Domestic Shorthair. Annual wellness exam. Owner reports increased drinking and urination over past month. Weight 3.8kg, down from 4.2kg six months ago. Mild dental tartar grade 2. Abdomen: slightly enlarged thyroid palpable bilaterally. Suspect hyperthyroidism. Bloods taken — T4 and full biochemistry panel. Discussed dietary management and likely medication once results back. Scheduled recheck in 1 week for results.`,
  exotic: `Examined Rio, a 2-year-old male Bearded Dragon. Owner concerned about reduced activity and not eating for 10 days. Weight 380g. On exam — mild dehydration, slight mucus in mouth. Oral exam shows early stomatitis. UV-B lamp checked — owner reported it was 18 months old, advised replace immediately. Temperature gradient in enclosure suboptimal. Prescribed chlorhexidine oral wash and vitamin A supplementation. Diet plan discussed. Follow-up in 2 weeks.`,
}

export function buildVetPrompt(species: string, petName: string, spoken: string): string {
  return `You are a veterinary documentation assistant. A vet has dictated their consultation notes for a ${species} named ${petName}.

Spoken notes:
"${spoken}"

Return ONLY valid JSON, no markdown, no backticks. Schema:
{
  "soap_note": {
    "patient": "string (name, species, breed, age, sex)",
    "date": "string (today in DD Mon YYYY format)",
    "subjective": "string (owner complaint and history, 2-3 sentences)",
    "objective": "string (clinical findings on examination, 2-3 sentences)",
    "assessment": "string (diagnosis or differential, 1-2 sentences)",
    "plan": "string (treatment, medications, follow-up)",
    "weight": "string (if mentioned)",
    "next_appointment": "string (or 'As needed')"
  },
  "client_letter": {
    "greeting": "string (warm one-liner about the pet)",
    "what_we_found": "string (plain English findings, no jargon)",
    "treatment": "string (what we're doing and why, simple language)",
    "at_home": "string (what the owner needs to do)",
    "watch_for": "string (warning signs to look out for)"
  }
}`
}
