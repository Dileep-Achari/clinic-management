var toString = Object.prototype.toString;

function isString(val) {
    return typeof val === 'string';
}

function isObject(val) {
    return val !== null && typeof val === 'object';
}

function isNumber(val) {
    return typeof val === 'number';
}

function isDate(val) {
    return toString.call(val) === '[object Date]';
}

function isArray(val) {
    return toString.call(val) === '[object Array]';
}

function isUndefined(val) {
    return typeof val === 'undefined';
}

function trim(str) {
    return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

function isFunction(val) {
    return toString.call(val) === '[object Function]';
}

function encode(val) {
    return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
}

module.exports = {
    isString,
    isObject,
    isNumber,
    isDate,
    isArray,
    isUndefined,
    trim,
    isFunction,
    encode
};