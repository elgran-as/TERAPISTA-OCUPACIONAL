/**
 * Shared DOM utilities — eliminates repetitive element-creation
 * boilerplate used across gallery items, service cards, and table rows.
 */

/**
 * Create an element with optional attributes and children.
 * @param {string} tag
 * @param {Record<string, string>} [attrs]
 * @param {(Node | string)[]} [children]
 * @returns {HTMLElement}
 */
function createElement(tag, attrs, children) {
    var el = document.createElement(tag);
    if (attrs) {
        Object.keys(attrs).forEach(function (key) {
            el.setAttribute(key, attrs[key]);
        });
    }
    if (children) {
        children.forEach(function (child) {
            el.appendChild(
                typeof child === 'string' ? document.createTextNode(child) : child
            );
        });
    }
    return el;
}

/**
 * Render an array of items into a container using a factory function.
 * @param {string} containerSelector  CSS selector of the target container
 * @param {Array} items               Data array
 * @param {function} factory          (item) => HTMLElement
 */
function renderList(containerSelector, items, factory) {
    var container = document.querySelector(containerSelector);
    if (!container) return;
    items.forEach(function (item) {
        container.appendChild(factory(item));
    });
}
