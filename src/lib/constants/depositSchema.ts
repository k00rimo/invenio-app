export const administrativeDefaultValues = {
  title: "",
  description: "",
  license: "",
  access: "",
  affiliations: [],
  tags: [],
  creators: [], 
  fundingReference: [],
  objectIdentifiers: [],
}

export const systemInformationDefaultValues = {
  systemFiles: [],
  initialStructureSource: "",
  solventModel: "",
  proteinModel: "",
  ligandModel: "",
  systemSize: undefined,
  boxSize: undefined,
  boxDimensions: undefined,
  forceField: "",
  parametrizationMethod: "",
  simulationEngine: {
    name: "",
    version: "",
    build: "",
  },
}

export const experimentDefaultValues = {
  name: "",
  experimentFiles: [], 
  
  // -- General Settings --
  simulationType: undefined,
  ensemble: undefined,
  length: 0, // Set to 0 so "positive" validation triggers if left untouched
  timeStep: 0,
  outputCadence: undefined,

  // -- Physics Objects --
  thermostat: {
    tcoupl: undefined,
    nsttcouple: undefined,
    groups: [], // Important: Initialize empty array for dynamic groups
  },
  
  barostat: {
    pcoupl: undefined,
    pcoupltype: undefined,
    tauP: undefined,
    compressibility: undefined, // Will be handled by MatrixInput
    refPressure: undefined,     // Will be handled by MatrixInput
    refcoordScaling: undefined,
  },

  electrostatics: {
    coulombType: undefined,
    rcoulomb: undefined,
    epsilonR: undefined,
    epsilonRf: undefined,
    coulombModifier: undefined,
    fourierspacing: undefined,
  },

  vanDerWaals: {
    vdwType: undefined,
    rvdw: undefined,
    dispcorr: undefined,
    rvdwSwitch: undefined,
    vdwModifier: undefined,
  },

  neighbourList: {
    pbc: undefined,
    rlist: undefined,
    nstlist: undefined,
    cutoffScheme: undefined,
  },

  constraints: {
    algorithm: undefined,
    lincsIter: undefined,
    lincsOrder: undefined,
  },

  // -- Advanced --
  nstcomm: undefined,
  commMode: undefined,
  freeEnergyCalculation: undefined,
  
  umbrellaSampling: false,
  awhAdaptiveBiasing: false,
  
  restraintsApplied: false,
  randomSeed: undefined,
};
