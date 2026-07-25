import { defaultPipelineConfig } from "./pipelineConfig.js";

// Registro de perfiles del pipeline.
// La CLI y la extensión comparten la misma base de configuración,
// pero cada interfaz puede ajustar sus valores por defecto.
export const pipelineProfiles = {
  cli: {
    ...defaultPipelineConfig,
  },

  extension: {
    ...defaultPipelineConfig,
    compact: true,
  },
};