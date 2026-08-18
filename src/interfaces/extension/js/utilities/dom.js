//? Funciones para manipular el DOM

//* Obtener elemento DOM
export const $ = (selector) => document.querySelector(selector);

//* Obtener todos los elementos DOM
export const $$ = (selector) => document.querySelectorAll(selector);

//* Cambiar el texto de un elemento DOM
export const setText = (selector, text) => { ($(selector)) && ($(selector).textContent = text); };

//* Cambiar el valor de un elemento DOM
export const setValue = (selector, propietary, value) => { ($(selector)) && ($(selector)[propietary] = value); };
