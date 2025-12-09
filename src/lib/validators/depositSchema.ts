import { z } from "zod";
import {
  accessOptions,
  licenseOptions,
  simulationTypeOptions,
  statisticalEnsembleOptions,
  commModeOptions,
  constraintAlgorithmOptions,
  vdwTypeOptions,
  vdwModifierOptions,
  dispcorrOptions,
  pcouplOptions,
  pcouplTypeOptions,
  refcoordScalingOptions,
  tcouplOptions,
  pbcOptions,
  cutoffSchemeOptions,
  coulombTypeOptions,
  coulombModifierOptions,
  freeEnergyCalculationOptions,
  objectIdentifiersType
} from "../deposition/formOptions"; 

// --- Helper to extract values for Zod enums ---
// Zod expects a non-empty tuple [string, ...string[]]
function getValues<T extends string>(options: readonly { value: T }[]): [T, ...T[]] {
  return options.map((o) => o.value) as [T, ...T[]];
}

// --- Reusable Shared Schemas ---

const optionalPositiveNumber = z.preprocess(
  (val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const parsed = Number(val);
    return isNaN(parsed) ? val : parsed;
  },
  z.number({ error: "Must be a valid number" })
   .positive({ message: "Must be positive" })
   .optional()
);

// Generic Matrix schema (used for pressure/compressibility tensors)
const matrixSchema = z.array(z.array(z.coerce.number())).optional();

const orcidRegex = /^\d{4}-\d{4}-\d{4}-\d{3}(\d|X)$/;

// --- Administrative Sub-schemas ---

export const creatorSchema = z.object({
  name: z.string().min(1, { message: "Creator name is required." }),
  affiliation: z.string().min(1, { message: "Affiliation is required." }),
  orcid: z
    .string()
    .regex(orcidRegex, { message: "Invalid ORCID iD format." })
    .optional()
    .or(z.literal("")),
});

export const fundingReferenceSchema = z.object({
  funderName: z.string().min(1, { message: "Funder name is required." }),
  funderIdentifier: z.string().optional(),
  awardNumber: z.string().optional(),
});

export const objectIdentifierSchema = z.object({
  identifier: z.string().min(1, { message: "Identifier is required." }),
  identifierType: z.enum(getValues(objectIdentifiersType), { error: "Identifier type is required." })
});

// --- System Information Sub-schemas ---

const moleculeSchema = z.object({
  name: z.string().min(1, { message: "Molecule name is required" }),
  count: z.coerce.number().int().positive({ message: "Count must be positive" }),
  residues: z.array(z.string()).optional(), 
});

const simulationEngineSchema = z.object({
  name: z.string().min(1, { message: "Engine name is required" }).optional(),
  version: z.string().min(1, { message: "Version is required" }).optional(),
  build: z.string().optional(),
});

// --- Experiments Sub-schemas (Physics Settings) ---

const vanDerWaalsSchema = z.object({
  vdwType: z.enum(getValues(vdwTypeOptions)).optional(),
  rvdw: optionalPositiveNumber.describe("Cut-off distance (nm)"),
  dispcorr: z.enum(getValues(dispcorrOptions)).optional(),
  rvdwSwitch: optionalPositiveNumber.describe("Switching distance (nm)"),
  vdwModifier: z.enum(getValues(vdwModifierOptions)).optional(),
});

const electrostaticSchema = z.object({
  coulombType: z.enum(getValues(coulombTypeOptions)).optional(),
  rcoulomb: optionalPositiveNumber.describe("Coulomb cut-off (nm)"),
  epsilonR: optionalPositiveNumber.describe("Relative dielectric constant"),
  epsilonRf: optionalPositiveNumber,
  coulombModifier: z.enum(getValues(coulombModifierOptions)).optional(),
  // PME specific
  fourierspacing: optionalPositiveNumber.describe("Grid spacing (nm)"),
});

const neighbourListSchema = z.object({
  pbc: z.enum(getValues(pbcOptions)).optional(),
  rlist: optionalPositiveNumber.describe("Cut-off distance for short-range (nm)"),
  nstlist: z.coerce.number().int().optional(),
  cutoffScheme: z.enum(getValues(cutoffSchemeOptions)).optional(),
});

const constraintSchema = z.object({
  algorithm: z.enum(getValues(constraintAlgorithmOptions)).optional(),
  lincsIter: z.coerce.number().int().optional(),
  lincsOrder: z.coerce.number().int().optional(),
});

const thermostatSchema = z.object({
  tcoupl: z.enum(getValues(tcouplOptions)).optional(),
  nsttcouple: z.coerce.number().int().optional(),
  groups: z.array(z.object({
    name: z.string(),
    tauT: z.coerce.number().optional().describe("Time constant (ps)"),
    refT: z.coerce.number().optional().describe("Reference Temperature (K)")
  })).optional(),
});

const barostatSchema = z.object({
  pcoupl: z.enum(getValues(pcouplOptions)).optional(),
  pcoupltype: z.enum(getValues(pcouplTypeOptions)).optional(),
  tauP: optionalPositiveNumber.describe("Time constant (ps)"),
  compressibility: matrixSchema.describe("Compressibility [bar^-1]"),
  refPressure: matrixSchema.describe("Reference Pressure [bar]"),
  refcoordScaling: z.enum(getValues(refcoordScalingOptions)).optional(),
});


// ==========================================
// SECTION 1: ADMINISTRATIVE
// ==========================================

export const administrativeSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  publisher: z.string().optional().describe("Entity responsible for making the resource available"),
  license: z.enum(getValues(licenseOptions), { message: "Please select a valid license." }),  
  access: z.enum(getValues(accessOptions), { message: "Please select access rights." }),
  communities: z.string().min(3, { error: "Provide the community slug"}),
  affiliations: z
    .array(z.string().min(3))
    .min(1, { message: "At least one affiliation is required." }),
  tags: z
    .array(z.string().min(1))
    .min(1, { message: "At least one tag is required" }),
  creators: z.array(creatorSchema).min(1, { message: "At least one creator is required." }),
  fundingReference: z.array(fundingReferenceSchema).optional(),
  objectIdentifiers: z.array(objectIdentifierSchema).min(1, { error: "Provide at least one indentifier." }),
});

// ==========================================
// SECTION 2: SYSTEM INFORMATION
// ==========================================

export const systemInformationSchema = z.object({
  systemFiles: z
    .array(z.any()) 
    .min(1, { message: "Upload at least one system file (.gro, .top, etc)." }),

  // -- Molecular System Composition --
  initialStructureSource: z.string().min(1, { message: "Source is required (e.g., PDB ID)." }),
  molecules: z.array(moleculeSchema).optional().describe("List of molecules in the system"),

  // -- Models --
  solventModel: z.string().optional(),
  proteinModel: z.string().optional(),
  ligandModel: z.string().optional(),

  // -- Size & Dimensions --
  systemSize: z.coerce
    .number()
    .int()
    .positive({ message: "Number of atoms must be positive." }),
  
  boxDimensions: z.object({
    x: optionalPositiveNumber,
    y: optionalPositiveNumber,
    z: optionalPositiveNumber,
    alpha: optionalPositiveNumber.optional(),
    beta: optionalPositiveNumber.optional(),
    gamma: optionalPositiveNumber.optional(),
  }).describe("Size and Shape of simulation box"),

  // -- Force Field & Parametrization --
  forceField: z.string().min(1, { message: "Force field is required." }),
  parametrizationMethod: z.string().min(1, { message: "Method is required." }),

  // -- Engine --
  simulationEngine: simulationEngineSchema,
});

// ==========================================
// SECTION 3: EXPERIMENTS
// ==========================================

export const experimentEntrySchema = z.object({
  id: z.string().optional(), // Internal UI ID
  
  // -- General Run Info --
  name: z.string().min(1, { message: "Experiment name is required." }),
  
  // Updated to use options
  simulationType: z.enum(getValues(simulationTypeOptions)).optional(),
  ensemble: z.enum(getValues(statisticalEnsembleOptions)).optional(),
  
  // -- Files (.tpr, .trj, .mdp) --
  experimentFiles: z
    .array(z.any())
    .min(1, { message: "Upload relevant experiment files." }),

  // -- Time & Duration --
  length: z.coerce.number().positive({ message: "Length is required (ns)." }),
  timeStep: z.coerce.number().positive({ message: "Time step must be positive (ps)." }), 
  outputCadence: z.coerce.number().positive().optional(),

  // -- Physics / Algorithms --
  thermostat: thermostatSchema,
  barostat: barostatSchema,
  electrostatics: electrostaticSchema,
  vanDerWaals: vanDerWaalsSchema,
  neighbourList: neighbourListSchema,
  constraints: constraintSchema,

  // -- Advanced / Center of Mass --
  nstcomm: z.coerce.number().int().optional(),
  commMode: z.enum(getValues(commModeOptions)).optional(),

  // -- Free Energy / Sampling --
  // Using enum options "yes"/"no" instead of boolean to match options file
  freeEnergyCalculation: z.enum(getValues(freeEnergyCalculationOptions)).optional(),
  
  umbrellaSampling: z.boolean().optional(),
  awhAdaptiveBiasing: z.boolean().optional(),
  
  restraintsApplied: z.boolean().default(false),
  randomSeed: z.coerce.number().int().optional(),
});

export const experimentsSchema = z.object({
  experiments: z
    .array(experimentEntrySchema)
    .min(1, { message: "At least one experiment must be defined." }),
});

// ==========================================
// MASTER SCHEMA
// ==========================================

export const depositFormSchema = z.object({
  administrative: administrativeSchema,
  systemInformation: systemInformationSchema,
  experiments: experimentsSchema,
});

export type DepositFormData = z.infer<typeof depositFormSchema>;
export type ExperimentEntry = z.infer<typeof experimentEntrySchema>;

// Helper arrays for UI iterators if needed
export const administrativeFields = Object.keys(administrativeSchema.shape) as (keyof typeof administrativeSchema.shape)[];
export const systemInfoFields = Object.keys(systemInformationSchema.shape) as (keyof typeof systemInformationSchema.shape)[];

