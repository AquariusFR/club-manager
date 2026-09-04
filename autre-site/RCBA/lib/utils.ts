import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import clubData from './data/club-info.json';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPlayerCategoryByAge(dateNaissance: string | null | undefined): string {
  if (!dateNaissance) return "Non assigné";
  
  const birthDate = new Date(dateNaissance);
  if (isNaN(birthDate.getTime())) return "Non assigné";
  
  const birthYear = birthDate.getFullYear();
  
  const today = new Date();
  let referenceYear = today.getFullYear();
  
  // En France, la saison sportive commence vers juillet/août.
  // Pour la saison 2025/2026 (à partir de juillet 2025), l'année de référence est 2026.
  if (today.getMonth() >= 6) {
    referenceYear += 1;
  }
  
  const age = referenceYear - birthYear;
  
  if (age < 5) return "Baby Foot";
  if (age > 19) return "Sénior";
  return `U${age}`;
}

export function getLicensePrice(category: string | undefined | null): number {
  const cotisations = clubData.cotisations;
  const u6to9 = cotisations.find(c => c.category.includes('U6'))?.price ?? 140;
  const u10to13 = cotisations.find(c => c.category.includes('U10'))?.price ?? 150;
  const u15to18 = cotisations.find(c => c.category.includes('U15'))?.price ?? 160;
  const seniorsVeterans = cotisations.find(c => c.category.includes('Seniors'))?.price ?? 180;
  const dirigeants = cotisations.find(c => c.category.includes('Dirigeants'))?.price ?? 50;

  if (!category) return u10to13;

  const cat = category.toLowerCase().trim();

  // Dirigeants / Staff / Coach / CA / Bureau
  if (
    cat.includes('dirigeant') || 
    cat.includes('staff') || 
    cat.includes('coach') || 
    cat.includes('bureau') || 
    cat.includes('membre')
  ) {
    return dirigeants;
  }

  // U6 à U9
  if (
    cat.includes('u6') || 
    cat.includes('u7') || 
    cat.includes('u8') || 
    cat.includes('u9') ||
    cat.includes('baby')
  ) {
    return u6to9;
  }

  // U10 à U13
  if (
    cat.includes('u10') || 
    cat.includes('u11') || 
    cat.includes('u12') || 
    cat.includes('u13')
  ) {
    return u10to13;
  }

  // U15 à U18
  if (
    cat.includes('u14') || 
    cat.includes('u15') || 
    cat.includes('u16') || 
    cat.includes('u17') || 
    cat.includes('u18') || 
    cat.includes('u19')
  ) {
    return u15to18;
  }

  // Seniors / Vétérans
  if (
    cat.includes('senior') || 
    cat.includes('sénior') || 
    cat.includes('veteran') || 
    cat.includes('vétéran') || 
    cat.includes('vét')
  ) {
    return seniorsVeterans;
  }

  // Fallbacks for teams
  if (cat.includes('d3') || cat.includes('d1') || cat.includes('r2')) {
    if (cat.includes('u18') || cat.includes('u15')) return u15to18;
    if (cat.includes('u13') || cat.includes('u11') || cat.includes('u12')) return u10to13;
    return seniorsVeterans;
  }

  return u10to13;
}

