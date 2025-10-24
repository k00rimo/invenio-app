// MDposit API TypeScript Types
// Generated from OpenAPI schema

// ============================================================================
// Metadata Types
// ============================================================================

export interface ProjectMetadata {
  // Basic Information
  NAME: string; // Project/trajectory name
  DESCRIPTION?: string; // Detailed description of the project
  AUTHORS?: string[]; // List of project authors
  GROUPS?: string[]; // Research groups/institutions involved
  CONTACT?: string; // Contact email for the project

  // Legal and Attribution
  LICENSE?: string; // License type (e.g., Apache License 2.0)
  LINKCENSE?: string; // URL to license details
  CITATION?: string; // How to cite this work
  THANKS?: string; // Acknowledgements and funding information
  LINKS?: Record<string, unknown>[] | null; // Related links and resources
  WARNINGS?: Record<string, unknown>[]; // Any warnings about the data
  COLLECTIONS?: string[] | string; // Collection(s) this project belongs to

  // Simulation Software
  PROGRAM?: string; // MD simulation program used (e.g., Amber, GROMACS)
  VERSION?: string | number; // Version of the simulation program
  TYPE?: "Trajectory" | "Ensemble" | "trajectory" | "ensemble"; // Type of data
  METHOD?: string; // Simulation method (e.g., Classical MD, QM/MM)

  // Force Field and Water Model
  FF?: string[]; // Force field(s) used
  WAT?: string; // Water model (e.g., TIP3P, SPC/E)

  // Simulation Parameters
  FRAMESTEP?: number; // Frame step/stride (in picoseconds)
  TIMESTEP?: number; // Timestep in femtoseconds
  TEMP?: number; // Temperature in Kelvin
  ENSEMBLE?: string; // Ensemble type (e.g., NPT, NVT, NVE)

  // Simulation Box
  BOXTYPE?: string; // Box shape (e.g., Cubic, Octahedral, Dodecahedral)
  BOXSIZEX?: number; // Box size X dimension in nm
  BOXSIZEY?: number; // Box size Y dimension in nm
  BOXSIZEZ?: number; // Box size Z dimension in nm

  // System Composition - Atom Counts
  SYSTATS?: number; // Total system atoms
  SYSTRES?: number; // Total system residues
  PROTATS?: number; // Protein atoms count
  PROTRES?: number; // Protein residues count
  PROT?: number; // Protein count or related metric
  NUCLATS?: number; // Nucleic acid atoms count
  NUCLRES?: number; // Nucleic acid residues count
  LIPIATS?: number; // Lipid atoms count
  LIPIRES?: number; // Lipid residues count
  CARBATS?: number; // Carbohydrate atoms count
  CARBRES?: number; // Carbohydrate residues count
  SOLVATS?: number; // Solvent atoms count
  SOLVRES?: number; // Solvent residues count
  COUNCAT?: number; // Counter-cation atoms count
  COUNANI?: number; // Counter-anion atoms count
  COUNION?: number; // Counter-ion atoms count
  DPPC?: number; // DPPC lipid count
  SOL?: number; // Solvent molecule count
  NA?: number; // Sodium ion count
  CL?: number; // Chloride ion count

  // References and Identifiers
  PDBIDS?: string[]; // PDB identifiers related to this project
  REFERENCES?: string[]; // UniProt or other reference IDs
  FORCED_REFERENCES?: unknown[] | null; // Manually specified references

  // Ligands
  LIGANDS?: number[]; // Ligand indices or counts
  LIGANDNAMES?: string[] | null; // Names of ligands in the system
  INPUT_LIGANDS?: unknown[] | null; // Input ligand specifications

  // Sequences
  SEQUENCES?: string[]; // Generic sequences (protein/nucleic)
  PROTSEQ?: string[]; // Protein sequences
  NUCLSEQ?: string[]; // Nucleic acid sequences

  // Interactions and Selections
  INTERACTIONS?: Interaction[]; // Defined molecular interactions
  PBC_SELECTION?: string | null; // Periodic boundary condition selection
  CG_SELECTION?: string | null; // Coarse-grained selection
  CHAINNAMES?: string[] | null; // Names of molecular chains
  CUSTOMS?: Record<string, unknown>[] | null; // Custom metadata fields
  ORIENTATION?: number[] | null; // Molecular orientation vector

  // Structural Features
  DOMAINS?: string[]; // Protein domains present
  PTM?: string[]; // Post-translational modifications
  MULTIMERIC?: string[] | null; // Multimeric state information
  MEMBRANES?: Record<string, unknown>[]; // Membrane composition details

  // COVID-19 Related (specific to some projects)
  CV19_UNIT?: string; // COVID-19 related unit
  CV19_STARTCONF?: string; // COVID-19 starting configuration
  CV19_ABS?: boolean; // COVID-19 antibody flag
  CV19_NANOBS?: boolean; // COVID-19 nanobody flag
  CV19_VARIANT?: string; // COVID-19 variant name

  // MD Trajectory Metadata
  mdName?: string; // Name of this specific MD trajectory (e.g., "replica 1")
  mdAtoms?: number; // Number of atoms in this MD trajectory
  mdFrames?: number; // Number of frames in this MD trajectory
}

export interface Interaction {
  name: string;
  agent_1: string;
  selection_1: string;
  agent_2: string;
  selection_2: string;
}

// ============================================================================
// Project Types
// ============================================================================

export interface ProjectMD {
  accession: string;
  published: boolean;
  metadata: ProjectMetadata;
  mds: string[]; // individual instances of experiments/simulations
  mdref: number;
  chains?: string[];
  files?: string[];
  analyses?: string[];
  updateDate?: string; // ISO date string
  mdcount?: number; // number of mds
  node?: string; // derived from accession/identifier - part before the comma
  local?: string; // derived from accession/identifier - part after the comma
  mdIndex?: number; // index of the md in the mds array (0 - mdcount-1)
  mdNumber: number; // unique number for the md within the project (1 - mdcount)
  refframe?: number; // no idea what this is
  internalId?: string;
  creationDate?: string; // ISO date string
  identifier?: string;
}

export interface InternalProjectMD {
  name: string;
  metadata?: Record<string, unknown>;
  analyses?: AnalysisEntry[];
  files?: FileEntry[];
  frames: number;
  atoms?: number;
  warnings?: Record<string, unknown>[];
}

export interface InternalProject {
  internalId?: string;
  accession: string;
  identifier?: string;
  published: boolean;
  metadata: ProjectMetadata;
  mds: InternalProjectMD[];
  mdref: number;
  mdNumber: number;
  mdIndex?: number;
  analyses?: AnalysisEntry[];
  files?: FileEntry[];
  chains?: unknown;
}

export interface AnalysisEntry {
  name: string;
  id: string;
}

export interface FileEntry {
  name: string;
  id: string;
}

export interface ProjectSummary {
  projectsCount: number;
  totalTime: number;
  totalFrames: number;
  totalFiles: number;
  totalAnalyses: number;
}

export interface ProjectsResponse {
  projects: ProjectMD[];
  filteredCount: number;
  totalCount: number;
}

// ============================================================================
// Topology Types
// ============================================================================

export interface Topology {
  atom_names: string[];
  atom_elements: string[];
  atom_charges: number[];
  atom_residue_indices: number[];
  atom_bonds?: number[][];
  residue_names: string[];
  residue_numbers: number[];
  residue_icodes: Record<string, string> | null;
  residue_chain_indices: number[];
  chain_names: string[];
  references: string[];
  reference_types: ("protein" | "ligand")[];
  residue_reference_indices: number[];
  residue_reference_numbers: number[];
}

// ============================================================================
// Reference Types
// ============================================================================

export interface ProteinReference {
  uniprot: string;
  sequence: string;
  name: string;
  gene: string;
  organism: string;
  domains?: {
    name: string;
    selection: string;
    description: string;
  }[];
  functions?: string[];
  entropies?: number[];
  epitopes?: Record<string, unknown>[];
}

export interface LigandReference {
  pubchem: string;
  drugbank?: string;
  chembl?: string;
  name: string;
  smiles: string;
  formula: string;
  mordred: Record<string, unknown>;
  morgan: number[];
}

export interface PdbReference {
  id: string;
  title: string;
  class: string;
  authors: string[];
  date: string;
  organism: string;
  method: string;
  resolution: number;
  chain_uniprots: Record<string, string>;
}

export type Reference = ProteinReference | LigandReference | PdbReference;

// ============================================================================
// Interactions Types
// ============================================================================

export interface InteractionData {
  name: string;
  agent_1: string;
  agent_2: string;
  strong_bonds?: number[][];
  residue_indices_1?: number[];
  residue_indices_2?: number[];
  interface_indices_1?: number[];
  interface_indices_2?: number[];
}

// ============================================================================
// Analysis Types
// ============================================================================

export type AnalysisName =
  | "rmsd"
  | "clusters"
  | "dist-perres"
  | "dist-perres-mean" // just another specifier??
  | "dist-perres-stdv" // just another specifier??
  | "energies"
  | "fluctuation"
  | "hbonds"
  | "interactions"
  | "pca"
  | "pockets"
  | "rgyr"
  | "rmsd-pairwise"
  | "rmsd-pairwise-interface"
  | "rmsd-perres"
  | "rmsds"
  | "sasa"
  | "tmscores";

export interface StatisticalData {
  average: number;
  stddev: number;
  min: number;
  max: number;
  data: number[];
}

// RMSD Analysis
export interface RMSDAnalysis {
  step: number;
  y: {
    rmsd: StatisticalData;
  };
}

// Distance per residue analysis
export interface DistancePerResidueAnalysis {
  data: {
    name: string;
    means: number[][];
    stdvs: number[][];
  }[];
}

// Energies analysis
export interface EnergiesAgentData {
  labels: string[];
  es: number[];
  ies: number[];
  fes: number[];
  vdw: number[];
  ivdw: number[];
  fvdw: number[];
  both: number[];
  iboth: number[];
  fboth: number[];
}

export interface EnergiesAnalysis {
  data: {
    name: string;
    agent1: EnergiesAgentData;
    agent2: EnergiesAgentData;
  }[];
}

// Fluctuation analysis
export interface FluctuationAnalysis {
  start: number;
  step: number;
  y: {
    rmsf: StatisticalData;
  };
}

// Hydrogen bonds analysis
export interface HydrogenBondsAnalysis {
  data: {
    name: string;
    acceptors: number[];
    donors: number[];
    hydrogens: number[];
    hbonds: boolean[][];
  }[];
}

// PCA analysis
export interface PCAAnalysis {
  framestep: number;
  atoms: number[];
  eigenvalues: number[];
  projections: number[][];
}

// Pockets analysis
export interface PocketsAnalysis {
  data: {
    name: string;
    volumes: number[];
    atoms: number[];
  }[];
}

// Radius of gyration analysis
export interface RadiusOfGyrationAnalysis {
  start: number;
  step: number;
  y: {
    rgyr: StatisticalData;
    rgyrx: StatisticalData;
    rgyry: StatisticalData;
    rgyrz: StatisticalData;
  };
}

// RMSD pairwise analysis
export interface RMSDPairwiseAnalysis {
  start: number;
  step: number;
  name: string;
  rmsds: number[][];
}

// RMSD per residue analysis
export interface RMSDPerResidueAnalysis {
  data: {
    name: string;
    rmsds: number[];
  }[];
}

// RMSDs analysis
export interface RMSDsAnalysis {
  start: number;
  step: number;
  data: {
    reference: string;
    group: string;
    values: number[];
  }[];
}

// Solvent accessible surface analysis
export interface SolventAccessibleSurfaceAnalysis {
  data: {
    name: string;
    saspf: number[];
  }[];
}

// TM scores analysis
export interface TMScoresAnalysis {
  start: number;
  step: number;
  data: {
    reference: string;
    group: string;
    values: number[];
  }[];
}

// Clusters analysis
export interface ClustersAnalysis {
  name: string;
  cutoff: number;
  clusters: {
    frames: number[];
    main: number;
  }[];
  transitions: {
    from: number;
    to: number;
    count: number;
  }[];
  step: number;
  version: string;
}

export type Analysis =
  | DistancePerResidueAnalysis
  | EnergiesAnalysis
  | FluctuationAnalysis
  | HydrogenBondsAnalysis
  | InteractionData
  | PCAAnalysis
  | PocketsAnalysis
  | RadiusOfGyrationAnalysis
  | RMSDPairwiseAnalysis
  | RMSDPerResidueAnalysis
  | RMSDsAnalysis
  | SolventAccessibleSurfaceAnalysis
  | TMScoresAnalysis;

// ============================================================================
// Analysis Option Types
// ============================================================================

export interface AnalysisOption {
  name: string; // Human readable label e.g., "Overall" or domain name
  analysis: AnalysisName; // Concrete analysis variant e.g., "rmsd-pairwise-00"
}

export type AnalysisOptionsResponse = AnalysisOption[];

// ============================================================================
// Files Types
// ============================================================================

export interface FileDescription {
  length: number;
  filename: string;
  md5: string;
  contentType: string;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// Chain Types
// ============================================================================

export interface Chain {
  name: string;
  sequence: string;
  interproscan?: Record<string, unknown>;
  hmmer?: Record<string, unknown>;
}

// ============================================================================
// Query Parameters Types
// ============================================================================

export interface ProjectsQueryParams {
  search?: string;
  query?: string;
  projection?: string;
  raw?: boolean;
  limit?: number;
  page?: number;
}

export interface ProjectOptionsQueryParams {
  query?: string;
  projection?: string;
}

export interface ProjectSummaryQueryParams {
  query?: string;
}

export interface StructureQueryParams {
  selection?: string;
}

export interface TrajectoryQueryParams {
  format?: "bin" | "mdcrd" | "xtc" | "trr";
  frames?: string;
  selection?: string;
}

export interface FileQueryParams {
  [key: string]: string | boolean | undefined;
  parse?: boolean;
}
