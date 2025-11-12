import { z } from "zod";

// Basic regex for ORCID iD. A more robust one would be very complex.
const orcidRegex = /^\d{4}-\d{4}-\d{4}-\d{3}(\d|X)$/;

// --- Reusable Array Schemas ---

export const creatorSchema = z.object({
  name: z.string().min(1, { message: "Creator name is required." }),
  affiliation: z.string().min(1, { message: "Affiliation is required." }),
  orcid: z
    .string()
    .regex(orcidRegex, { message: "Invalid ORCID iD format." })
    .optional()
    .or(z.literal("")), // Allow empty string
});
export type Creator = z.infer<typeof creatorSchema>;

export const fundingReferenceSchema = z.object({
  funderName: z.string().min(1, { message: "Funder name is required." }),
  funderIdentifier: z.string().optional(),
  awardNumber: z.string().optional(),
});
export type FundingReference = z.infer<typeof fundingReferenceSchema>;

export const objectIdentifierSchema = z.object({
  identifier: z.string().min(1, { message: "Identifier is required." }),
  identifierType: z
    .string()
    .min(1, { message: "Identifier type is required." }),
});
export type ObjectIdentifier = z.infer<typeof objectIdentifierSchema>;

// --- Step 1: Basic Info ---

export const basicInfoSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
  license: z.string().min(1, { message: "Please select a license." }),
  access: z.string().min(1, { message: "Please select access rights." }),
  affiliations: z
    .array(z.string().min(3, {
      error: "Affiliation must be at least 3 characters."
    }))
    .min(1, {
      error: "At least one affiliation is required."
    }),
  tags: z
    .array(z.string().min(1, {
      error: "Tag has must be at least 1 character."
    }))
    .min(1, {
      error: "At least one tag is required"
    }),
  creators: z.array(creatorSchema).min(1, {
    message: "At least one creator is required.",
  }),
  fundingReference: z.array(fundingReferenceSchema).optional(),
  objectIdentifiers: z.array(objectIdentifierSchema).optional(),
});

export const basicInfoFields = Object.keys(
  basicInfoSchema.shape,
) as (keyof z.infer<typeof basicInfoSchema>)[];

// --- File & Upload Info ---

export const fileIdentificationSchema = z.object({
  // Note: We don't validate the file upload itself in Zod,
  // but we validate its metadata.
  fileName: z.string().min(1, { message: "File name is required." }),
  fileDescription: z.string().optional(),
  fileAuthors: z
    .array(z.string().min(1))
    .min(1, { message: "At least one file author is required." }), // Simple string array
  simulationYear: z.coerce
    .number()
    .int()
    .min(1900, { message: "Year must be after 1900." })
    .max(new Date().getFullYear() + 1, {
      message: "Year cannot be in the future.",
    }),
  doi: z.string().optional(),
});

export const fileIdentificationFields = Object.keys(
  fileIdentificationSchema.shape,
) as (keyof z.infer<typeof fileIdentificationSchema>)[];

// --- Main Simulation Info ---

export const mainInformationSchema = z.object({
  simulationType: z
    .string()
    .min(1, { message: "Simulation type is required." }),
  forceField: z.string().min(1, { message: "Force field is required." }),
  simulationLength: z.coerce
    .number({ message: "Expected value lol."})
    .positive({ message: "Must be a positive number." }),
  simulationTimeStep: z.coerce
    .number()
    .positive({ message: "Must be a positive number." }),
  statisticalEnsemble: z
    .string()
    .min(1, { message: "Ensemble is required." }),
  referenceTemperature: z.coerce
    .number({ error: "Must be a number.", })
    .array()
    .min(1, { message: "At least one temperature is required." }),
  referencePressure: z
    .array(z.array(z.coerce.number()))
    .optional()
    .nullable(), // For Matrix type
  boxSizeAndShape: z.coerce
    .number()
    .positive({ message: "Must be a positive number." }),
  molecules: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Write at least one character" }),
        count: z.coerce.number().int().positive(),
      }),
    )
    .min(1, { message: "At least one molecule is required." }),
  freeEnergyCalculation: z.string().min(1, { message: "Required." }),
  umbrellaSampling: z.boolean(),
  awhAdaptiveBiasing: z.boolean(),
});

export const mainInformationFields = Object.keys(
  mainInformationSchema.shape,
) as (keyof z.infer<typeof mainInformationSchema>)[];

// --- Detailed Simulation Info ---

const vanDerWaalsSchema = z.object({
  rvdw: z.coerce.number().optional(),
  vdwType: z.string().optional(),
  dispcorr: z.string().optional(),
  rvdwSwitch: z.coerce.number().optional(),
  vdwModifier: z.string().optional(),
});

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

const neighbourListSchema = z.object({
  pbc: z.string().optional(),
  rlist: z.coerce.number().optional(),
  nstlist: z.coerce.number().int().optional(),
  cutoffScheme: z.string().optional(),
});

const electrostaticSchema = z.object({
  coulombtype: z.string().optional(),
  rcoulomb: z.coerce.number().optional(),
  epsilonR: z.coerce.number().optional(),
  epsilonRf: z.coerce.number().optional(),
  coulombModifier: z.string().optional(),
});

export const detailedInformationSchema = z.object({
  nstcomm: z.coerce.number().int().optional(),
  commMode: z.string().optional(),
  lincsIter: z.coerce.number().int().optional(),
  lincsOrder: z.coerce.number().int().optional(),
  fourierspacing: z.coerce.number().optional(),
  constraintAlgorithm: z.string().optional(),
  vanDerWaals: vanDerWaalsSchema.optional(),
  barostat: barostatSchema.optional(),
  thermostat: thermostatSchema.optional(),
  neighbourList: neighbourListSchema.optional(),
  electrostatic: electrostaticSchema.optional(),
});

export const detailedInformationFields = Object.keys(
  detailedInformationSchema.shape,
) as (keyof z.infer<typeof detailedInformationSchema>)[];

// --- Master Schema ---

export const depositFormSchema = z.object({
  basicInfo: basicInfoSchema,
  fileIdentification: fileIdentificationSchema,
  mainInformation: mainInformationSchema,
  detailedInformation: detailedInformationSchema.optional(),
});

export type DepositFormData = z.infer<typeof depositFormSchema>;
