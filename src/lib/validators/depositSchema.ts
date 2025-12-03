import { z } from "zod";

// Basic regex for ORCID iD.
const orcidRegex = /^\d{4}-\d{4}-\d{4}-\d{3}(\d|X)$/;

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
  identifierType: z.string().min(1, { message: "Identifier type is required." }),
});

// ==========================================
// SECTION 1: ADMINISTRATIVE (Formerly Basic Info)
// ==========================================

export const administrativeSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  license: z.string().min(1, { message: "Please select a license." }),
  access: z.string().min(1, { message: "Please select access rights." }),
  affiliations: z
    .array(z.string().min(3, { message: "Affiliation must be at least 3 characters." }))
    .min(1, { message: "At least one affiliation is required." }),
  tags: z
    .array(z.string().min(1))
    .min(1, { message: "At least one tag is required" }),
  creators: z.array(creatorSchema).min(1, { message: "At least one creator is required." }),
  fundingReference: z.array(fundingReferenceSchema).optional(),
  objectIdentifiers: z.array(objectIdentifierSchema).optional(),
});

// ==========================================
// SECTION 2: SYSTEM INFORMATION
// ==========================================

const simulationEngineSchema = z.object({
  name: z.string().min(1, { message: "Engine name is required (e.g., GROMACS)." }).optional(),
  version: z.string().min(1, { message: "Version is required." }).optional(),
  build: z.string().optional(),
});

export const systemInformationSchema = z.object({
  systemFiles: z
    .array(z.any()) 
    .min(1, { message: "Upload at least one system file (.gro, .top)." }),

  // -- Molecular System Composition --
  initialStructureSource: z.string().min(1, { message: "Source is required (e.g., PDB ID)." }),
  solventModel: z.string().optional(), // e.g., TIP3P
  proteinModel: z.string().optional(), // e.g., AMBER99SB
  ligandModel: z.string().optional(),  // e.g., GAFF

  // -- Size & Dimensions --
  systemSize: z.coerce
    .number()
    .int()
    .positive({ message: "Number of atoms must be positive." }),
  
  // Assuming Box Size refers to Volume or specific magnitude
  boxSize: z.coerce.number().positive().optional(), 
  
  boxDimensions: z.object({
    x: optionalPositiveNumber,
    y: optionalPositiveNumber,
    z: optionalPositiveNumber,
  }),

  // -- Force Field & Parametrization --
  forceField: z.string().min(1, { message: "Force field is required." }),
  parametrizationMethod: z.string().min(1, { message: "Method is required." }),

  // -- Engine --
  simulationEngine: simulationEngineSchema,
});

// ==========================================
// SECTION 3: EXPERIMENTS
// ==========================================

const barostatSchema = z.object({
  pcoupl: z.string().optional(),
  pcoupltype: z.string().optional(),
  tauP: z.coerce.number().optional(),
  compressibility: z.array(z.array(z.coerce.number())).optional().nullable(),
  refcoordScaling: z.string().optional(),
});

const thermostatSchema = z.object({
  tcoupl: z.string().optional(),
  tauT: z.array(z.coerce.number()).optional(),
  tcGrps: z
    .object({ nr: z.coerce.number().int().optional(), name: z.string() })
    .optional(),
  nsttcouple: z.coerce.number().int().optional(),
});

export const experimentEntrySchema = z.object({
  // Unique ID for UI rendering keys (not necessarily sent to backend)
  id: z.string().optional(), 
  
  name: z.string().min(1, { message: "Experiment name is required." }),

  // -- Files (.tpr, .trj, .mdp) --
  experimentFiles: z
    .array(z.any())
    .min(1, { message: "Upload relevant experiment files." }),

  // -- Thermostat / Barostat --
  thermostat: thermostatSchema,
  barostat: barostatSchema,

  // -- Numerical Settings --
  timeStep: z.coerce
    .number()
    .positive({ message: "Time step must be positive (fs)." }),
  
  constraintScheme: z.string().optional(), // e.g., LINCS, SHAKE

  // -- Cutoffs --
  cutoffs: z.object({
    vdw: optionalPositiveNumber,
    coulomb: optionalPositiveNumber,
  }),

  // -- Advanced --
  pmeSettings: z.string().optional(),
  randomSeed: z.coerce.number().int().optional(),
  
  // -- Duration --
  length: z.coerce.number().positive({ message: "Simulation length is required." }),
  outputCadence: z.coerce.number().positive().optional(),
  
  restraintsApplied: z.boolean().default(false),
});

// The Experiments section is an array of the entry schema
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

