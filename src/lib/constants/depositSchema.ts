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
  
  thermostat: {
    tcoupl: "",
    tauT: [], 
    tcGrps: { nr: undefined, name: "" }, 
    nsttcouple: undefined,
  },
  
  barostat: {
    pcoupl: "",
    pcoupltype: "",
    tauP: undefined,
    compressibility: null,
    refcoordScaling: "",
  },

  timeStep: undefined, 
  constraintScheme: "",

  cutoffs: {
    vdw: undefined, 
    coulomb: undefined,
  },

  pmeSettings: "",
  randomSeed: undefined,
  
  length: undefined,
  outputCadence: undefined,
  
  restraintsApplied: false,
};
