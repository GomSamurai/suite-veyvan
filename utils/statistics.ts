import { Term, Tonality } from '../types';

export const calculateLetterDistribution = (terms: Term[]) => {
  const counts: Record<string, number> = {};
  terms.forEach(term => {
    const root = term.root ? String(term.root) : '';
    const cleanRoot = root.toLowerCase().replace(/[^a-z]/g, '');
    for (const char of cleanRoot) {
      counts[char] = (counts[char] || 0) + 1;
    }
  });
  
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1]) // Sort descending
    .slice(0, 10) // Top 10
    .map(([name, value]) => ({ name: name.toUpperCase(), value }));
};

export const calculateVowelConsonantRatio = (terms: Term[]) => {
  let vowels = 0;
  let consonants = 0;
  const vowelList = ['a', 'e', 'i', 'o', 'u'];

  terms.forEach(term => {
    const root = term.root ? String(term.root) : '';
    const cleanRoot = root.toLowerCase().replace(/[^a-z]/g, '');
    for (const char of cleanRoot) {
      if (vowelList.includes(char)) vowels++;
      else consonants++;
    }
  });
  
  const total = vowels + consonants;
  if (total === 0) return [];

  return [
    { name: 'Vocales', value: vowels, color: '#8884d8' },
    { name: 'Consonantes', value: consonants, color: '#82ca9d' }
  ];
};

export const calculateWordLengthDist = (terms: Term[]) => {
  const dist: Record<number, number> = {};
  terms.forEach(term => {
    const root = term.root ? String(term.root) : '';
    const len = root.length;
    if (len > 0) {
      dist[len] = (dist[len] || 0) + 1;
    }
  });

  return Object.entries(dist)
    .map(([len, count]) => ({ name: `${len} letras`, value: count }))
    .sort((a, b) => parseInt(a.name) - parseInt(b.name));
};

export const calculateTonalityDist = (terms: Term[]) => {
  const dist: Record<string, number> = {};
  Object.values(Tonality).forEach(t => dist[t] = 0);

  terms.forEach(term => {
    if (term && term.tonality) {
      const tonality = term.tonality as string;
      dist[tonality] = (dist[tonality] || 0) + 1;
    }
  });

  // Color mapping for tonalities
  const colors: Record<string, string> = {
    [Tonality.POSITIVE]: '#4ade80', // green
    [Tonality.NEUTRAL]: '#94a3b8', // slate
    [Tonality.NEGATIVE]: '#f87171', // red
    [Tonality.TRANSFORMATIVE]: '#c084fc', // purple
    [Tonality.MIXED]: '#fbbf24' // amber
  };

  return Object.entries(dist).map(([name, value]) => ({
    name,
    value,
    color: colors[name] || '#ccc'
  })).filter(x => x.value > 0);
};

export const calculateCategoryDist = (terms: Term[]) => {
   const dist: Record<string, number> = {};
   terms.forEach(term => {
     if (term && term.category) {
       dist[term.category] = (dist[term.category] || 0) + 1;
     }
   });
   
   return Object.entries(dist)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};