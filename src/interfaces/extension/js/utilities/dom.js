//? Funciones para manipular el DOM

//* Obtener elemento DOM
export const $ = (selector) => document.querySelector(selector);

//* Obtener todos los elementos DOM
export const $$ = (selector) => document.querySelectorAll(selector);

//* Cambiar el valor de un elemento DOM
export const setValue = (selector, property, value) => { ($(selector)) && ($(selector)[property] = value); };

//* Cambiar el texto de un elemento DOM
export const setText = (selector, text) => { ($(selector)) && (setValue(selector, "textContent", text)); };

//* Ocultar elemento del DOM
export const hideTag = (selector) => { $(selector) && setValue(selector, "hidden", true); };

//* Mostrar elemento del DOM
export const showTag = (selector) => { $(selector) && setValue(selector, "hidden", false); };