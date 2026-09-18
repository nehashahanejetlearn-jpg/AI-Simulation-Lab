import { StudentBadge } from '../types';

export interface ScienceFact {
  title: string;
  fact: string;
  category: 'volcano' | 'rocket' | 'dna';
}

export const BADGES_LIST: StudentBadge[] = [
  {
    id: 'badge-volcano',
    title: 'Volcanologist',
    icon: '🌋',
    description: 'Trigger active volcanic eruptions, manipulate magma pressure, and pass the Volcano Quiz.',
    unlocked: false,
  },
  {
    id: 'badge-rocket',
    title: 'Rocket Scientist',
    icon: '🚀',
    description: 'Launch orbital rockets, balance thrust against drag and gravity, and pass the Rocket Quiz.',
    unlocked: false,
  },
  {
    id: 'badge-dna',
    title: 'Geneticist',
    icon: '🧬',
    description: 'Inspect nucleotide base pairing, simulate semi-conservative replication, and pass the DNA Quiz.',
    unlocked: false,
  },
  {
    id: 'badge-master',
    title: 'Master Scientist',
    icon: '🔬',
    description: 'Conquer all three scientific domains and complete the Mixed Science Challenge.',
    unlocked: false,
  },
];

export const VOLCANO_FACTS: ScienceFact[] = [
  {
    title: 'Supervolcano Power',
    fact: 'Yellowstone Caldera has erupted three times over the past 2.1 million years, producing enough ash and rock to blanket over half of North America.',
    category: 'volcano',
  },
  {
    title: 'Olympus Mons',
    fact: 'The largest known volcano in our Solar System is Olympus Mons on Mars. Standing at 21.9 km (13.6 miles) high, it is nearly 3 times taller than Mount Everest!',
    category: 'volcano',
  },
  {
    title: 'Underwater Eruptions',
    fact: 'Over 80% of all volcanic eruptions on Earth occur completely underwater along oceanic ridges, quietly forming new ocean floor crust.',
    category: 'volcano',
  },
  {
    title: 'Volcanic Lightning',
    fact: 'Dirty thunderstorms (volcanic lightning) occur inside eruption plumes when colliding ash and rock particles generate massive static electrical charges.',
    category: 'volcano',
  },
  {
    title: 'Pumice: The Floating Stone',
    fact: 'Pumice is an igneous volcanic rock filled with so many gas bubble pockets that its density is less than water, allowing it to float on oceans for years!',
    category: 'volcano',
  },
];

export const ROCKET_EXPERIMENTS = [
  {
    title: 'What happens if you increase thrust?',
    description: 'Higher thrust provides a larger net upward force ($T - mg$), causing the rocket to overcome gravity faster and reach a much higher maximum velocity and altitude.',
    preset: { thrust: 4200, fuel: 35000, dryMass: 8000, gravity: 9.81, airResistance: 0.25 },
    icon: 'Flame',
  },
  {
    title: 'What happens if the rocket becomes heavier?',
    description: 'Increasing dry mass requires more thrust just to balance gravity. The acceleration decreases ($a = F/m$), burning more propellant fighting gravity before reaching speed.',
    preset: { thrust: 2200, fuel: 20000, dryMass: 18000, gravity: 9.81, airResistance: 0.25 },
    icon: 'Weight',
  },
  {
    title: 'What happens if gravity increases?',
    description: 'On a high-gravity world (like Jupiter, $g = 24.79\\text{ m/s}^2$), rocket weight triples. Unless thrust exceeds this massive downward force, the rocket cannot even lift off the pad!',
    preset: { thrust: 4800, fuel: 35000, dryMass: 7000, gravity: 24.79, airResistance: 0.25 },
    icon: 'Orbit',
  },
  {
    title: 'Lunar Launch: Low Gravity & Zero Atmosphere',
    description: 'On the Moon ($g = 1.62\\text{ m/s}^2$, zero drag), even low thrust results in extreme acceleration, shooting the spacecraft into orbit with minimal propellant!',
    preset: { thrust: 1500, fuel: 12000, dryMass: 5000, gravity: 1.62, airResistance: 0.0 },
    icon: 'Moon',
  },
];

export const DNA_COMPONENTS = [
  {
    id: 'sugar',
    name: 'Deoxyribose Sugar',
    formula: 'C₅H₁₀O₄',
    role: 'Structural Backbone',
    description: 'A 5-carbon ring sugar missing one oxygen atom at the 2’ position (hence "deoxy"). It bonds covalently with phosphate groups to build the rigid structural outer rails of DNA.',
  },
  {
    id: 'phosphate',
    name: 'Phosphate Group',
    formula: 'PO₄³⁻',
    role: 'Backbone Linker & Charge',
    description: 'Links the 3’ carbon of one sugar to the 5’ carbon of the next through phosphodiester bonds. The negative charges on phosphates give DNA an overall negative electrical charge.',
  },
  {
    id: 'bases',
    name: 'Nitrogenous Bases (A, T, C, G)',
    formula: 'Purines & Pyrimidines',
    role: 'Information Storage',
    description: 'The four organic bases whose precise sequential order forms genes. Adenine (A) and Guanine (G) are double-ringed purines; Thymine (T) and Cytosine (C) are single-ringed pyrimidines.',
  },
  {
    id: 'nucleotide',
    name: 'Nucleotide Monomer',
    formula: 'Sugar + Phosphate + Base',
    role: 'Fundamental Building Block',
    description: 'The repeating sub-unit of nucleic acids. One human genome contains approximately 3.2 billion nucleotide pairs packed into 23 chromosome pairs inside the cell nucleus.',
  },
  {
    id: 'hydrogen-bonds',
    name: 'Hydrogen Bonds',
    formula: 'Dipole Attractions',
    role: 'Molecular Zipper',
    description: 'Non-covalent attractions between partially charged hydrogen, nitrogen, and oxygen atoms. Weak enough to be unzipped by Helicase during replication, yet strong in aggregate to stabilize the double helix.',
  },
];
