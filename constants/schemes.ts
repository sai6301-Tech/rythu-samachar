export type Scheme = {
  name: string;
  nameTe: string;
  emoji: string;
  color: string;
  description: string;
  descriptionTe: string;
  eligibility: string;
  eligibilityTe: string;
  url: string;
};

export const GOVERNMENT_SCHEMES: Scheme[] = [
  {
    name: 'PM-KISAN',
    nameTe: 'పిఎం-కిసాన్',
    emoji: '💰',
    color: '#1565C0',
    description:
      'Pradhan Mantri Kisan Samman Nidhi provides income support of ₹6,000 per year to farmer families in three equal installments.',
    descriptionTe:
      'ప్రధాన మంత్రి కిసాన్ సమ్మాన్ నిధి రైతు కుటుంబాలకు వార్షికంగా ₹6,000 ఆదాయ సహాయాన్ని మూడు సమాన వాయిదాలలో అందిస్తుంది.',
    eligibility: 'All land-holding farmer families',
    eligibilityTe: 'భూమి కలిగిన అన్ని రైతు కుటుంబాలు',
    url: 'https://pmkisan.gov.in',
  },
  {
    name: 'Rythu Bandhu',
    nameTe: 'రైతు బంధు',
    emoji: '🤝',
    color: '#2E7D32',
    description:
      'Telangana government scheme providing ₹10,000 per acre per season (₹5,000 each for Kharif and Rabi) as investment support to farmers.',
    descriptionTe:
      'తెలంగాణ ప్రభుత్వ పథకం రైతులకు పెట్టుబడి సహాయంగా సీజన్‌కు ఎకరాకు ₹10,000 అందిస్తుంది.',
    eligibility: 'Telangana farmers with registered land',
    eligibilityTe: 'నమోదైన భూమి కలిగిన తెలంగాణ రైతులు',
    url: 'https://rythubandhu.telangana.gov.in',
  },
  {
    name: 'Fasal Bima Yojana',
    nameTe: 'ఫసల్ బీమా యోజన',
    emoji: '🛡️',
    color: '#E65100',
    description:
      'Pradhan Mantri Fasal Bima Yojana provides crop insurance coverage and financial support to farmers in case of crop failure.',
    descriptionTe:
      'పంట వైఫల్యం విషయంలో రైతులకు పంట బీమా కవరేజ్ మరియు ఆర్థిక సహాయాన్ని అందిస్తుంది.',
    eligibility: 'Farmers growing notified crops',
    eligibilityTe: 'నోటిఫైడ్ పంటలు పండించే రైతులు',
    url: 'https://pmfby.gov.in',
  },
  {
    name: 'Kisan Credit Card',
    nameTe: 'కిసాన్ క్రెడిట్ కార్డ్',
    emoji: '💳',
    color: '#6A1B9A',
    description:
      'Provides farmers with affordable credit for agricultural needs including seeds, fertilizers, and crop protection at low interest rates.',
    descriptionTe:
      'విత్తనాలు, ఎరువులు మరియు పంట రక్షణ కోసం తక్కువ వడ్డీ రేట్లకు సాగు అవసరాలకు రైతులకు సరసమైన క్రెడిట్ అందిస్తుంది.',
    eligibility: 'All farmers, sharecroppers, tenant farmers',
    eligibilityTe: 'అన్ని రైతులు, వాటాదారులు, కౌలు రైతులు',
    url: 'https://www.nabard.org/kcc',
  },
  {
    name: 'Rythu Bharosa',
    nameTe: 'రైతు భరోసా',
    emoji: '🌱',
    color: '#00695C',
    description:
      'Andhra Pradesh government scheme providing ₹13,500 per year to farmers as income support through multiple installments.',
    descriptionTe:
      'ఆంధ్రప్రదేశ్ ప్రభుత్వ పథకం రైతులకు వార్షికంగా ₹13,500 ఆదాయ సహాయాన్ని అందిస్తుంది.',
    eligibility: 'AP farmers with less than 5 acres',
    eligibilityTe: '5 ఎకరాల కంటే తక్కువ కలిగిన ఏపీ రైతులు',
    url: 'https://rythubarasaap.ap.gov.in',
  },
];
