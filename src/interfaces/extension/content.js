// Responsable de comunicarse con la página
// e inyectar el código necesario.

const script = document.createElement("script");

script.src = chrome.runtime.getURL("inject.js");

document.documentElement.appendChild(script);