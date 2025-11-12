// --- Basic Info Options ---

export const licenseOptions = [
  {
    value: "apache-2.0",
    label: "Apache License 2.0",
    description:
      "A permissive license... requires preservation of copyright and license notices.",
  },
  {
    value: "cc-by-4.0",
    label: "Creative Commons Attribution 4.0 International",
    description:
      "Allows re-distribution and re-use... on the condition that the creator is appropriately credited.",
  },
  {
    value: "cc-by-sa-4.0",
    label: "Creative Commons Attribution Share Alike 4.0 International",
    description:
      "Permits almost any use subject to providing credit and license notice.",
  },
  {
    value: "cc0-1.0",
    label: "Creative Commons Zero v1.0 Universal",
    description:
      "Waives copyright interest... and dedicates it to the world-wide public domain.",
  },
  {
    value: "gpl-3.0",
    label: "GNU General Public License v3.0 or later",
    description:
      "Permissions of this strong copyleft license are conditioned on making available complete source code...",
  },
  {
    value: "mit",
    label: "MIT License",
    description:
      "A short and simple permissive license with conditions only requiring preservation of copyright and license notices.",
  },
];

export const accessOptions = [
  {
    value: "open",
    label: "Open",
    description: "The dataset will be publicly available.",
  },
  {
    value: "restricted",
    label: "Restricted",
    description: "Access to the dataset will be restricted.",
  },
  {
    value: "closed",
    label: "Closed",
    description: "The dataset will be closed access.",
  },
];

// --- Main Information Options ---

export const simulationTypeOptions = [
  { value: "free energy simulation", label: "Free Energy Simulation" },
  { value: "molecular dynamics", label: "Molecular Dynamics" },
  { value: "energy minimization", label: "Energy Minimization" },
];

export const statisticalEnsembleOptions = [
  { value: "NVE (microcanonical)", label: "NVE (microcanonical)" },
  { value: "NVT (canonical)", label: "NVT (canonical)" },
  { value: "NpT (isothermal-isobaric)", label: "NpT (isothermal-isobaric)" },
];

export const freeEnergyCalculationOptions = [
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
];

// --- Detailed Information Options ---

export const commModeOptions = [
  { value: "none", label: "None" },
  { value: "linear", label: "Linear" },
  { value: "angular", label: "Angular" },
  {
    value: "linear-acceleration-correction",
    label: "Linear Acceleration Correction",
  },
];

export const constraintAlgorithmOptions = [
  { value: "lincs", label: "LINCS" },
  { value: "shake", label: "SHAKE" },
];

export const vdwTypeOptions = [
  { value: "cut-off", label: "Cut-off" },
  { value: "pme", label: "PME" },
  { value: "shift", label: "Shift" },
  { value: "switch", label: "Switch" },
  { value: "user", label: "User" },
];

export const vdwModifierOptions = [
  { value: "potential-shift", label: "Potential-shift" },
  { value: "none", label: "None" },
  { value: "force-switch", label: "Force-switch" },
  { value: "potential-switch", label: "Potential-switch" },
];

export const dispcorrOptions = [
  { value: "no", label: "No" },
  { value: "enerpres", label: "EnerPres" },
  { value: "eber", label: "Eber" },
];

export const pcouplOptions = [
  { value: "no", label: "No" },
  { value: "berendsen", label: "Berendsen" },
  { value: "c-rescale", label: "C-rescale" },
  { value: "parrinello-rahman", label: "Parrinello-Rahman" },
  { value: "mttk", label: "MTTK" },
];

export const pcouplTypeOptions = [
  { value: "isotropic", label: "Isotropic" },
  { value: "semiisotropic", label: "Semiisotropic" },
  { value: "anisotropic", label: "Anisotropic" },
  { value: "surface-tension", label: "Surface-tension" },
];

export const refcoordScalingOptions = [
  { value: "no", label: "No" },
  { value: "all", label: "All" },
  { value: "com", label: "COM" },
];

export const tcouplOptions = [
  { value: "no", label: "No" },
  { value: "berendsen", label: "Berendsen" },
  { value: "nose-hoover", label: "Nose-Hoover" },
  { value: "andersen", label: "Andersen" },
  { value: "andersen-massive", label: "Andersen-massive" },
  { value: "v-rescale", label: "V-rescale" },
];

export const pbcOptions = [
  { value: "no", label: "No" },
  { value: "xy", label: "XY" },
  { value: "xyz", label: "XYZ" },
];

export const cutoffSchemeOptions = [
  { value: "verlet", label: "Verlet" },
  { value: "group", label: "Group" },
];

export const coulombTypeOptions = [
  { value: "cut-off", label: "Cut-off" },
  { value: "ewald", label: "Ewald" },
  { value: "pme", label: "PME" },
  { value: "p3m-ad", label: "P3M-AD" },
  { value: "reaction-field", label: "Reaction-field" },
  { value: "user", label: "User" },
  { value: "pme-shift", label: "PME-shift" },
  { value: "pme-user", label: "PME-user" },
  { value: "pme-user-switch", label: "PME-user-switch" },
];

export const coulombModifierOptions = [
  { value: "none", label: "None" },
  { value: "potential-shift", label: "Potential-shift" },
];
