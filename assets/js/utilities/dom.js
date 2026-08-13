//? Funciones para manipular el DOM

//* Obtener elemento DOM
export const $ = (selector) => document.querySelector(selector);

//* Obtener todos los elementos DOM
export const $$ = (selector) => document.querySelectorAll(selector);

//* Cambiar el texto de un elemento DOM
export const setText = (selector, text) => { ($(selector)) && ($(selector).textContent = text); };

//* Cambiar el valor de un elemento DOM
export const setValue = (selector, propietary, value) => { ($(selector)) && ($(selector)[propietary] = value); };

//* Crea elemento DOM con su clase
export function createElement(tagName, className = null, content = null, isHTML = false, id = null) {
    const element = document.createElement(tagName);
    className && (element.className = className);
    id && (element.id = id);
    if (content !== null) {
        isHTML ? (element.innerHTML = content) : (element.textContent = content);
    }

    return element;
}
