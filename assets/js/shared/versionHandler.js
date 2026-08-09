//* Version handler

import { setText } from "../utilities/dom.js"
import packageJson from "../../../package.json" with { type: 'json' }; //with {type: json} nos evita usar el JSON.parse()

export function footerVersion() {
  setText("#footerVersion", `v${packageJson.version }`);
}