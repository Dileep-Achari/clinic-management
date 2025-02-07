const _parser = require('fast-xml-parser');
const _he = require('he');
const _xml_parser_options = {
    attributeNamePrefix: "@_",
    attrNodeName: "attr", //default is 'false'
    textNodeName: "#text",
    ignoreAttributes: true,
    ignoreNameSpace: false,
    allowBooleanAttributes: false,
    parseNodeValue: true,
    parseAttributeValue: false,
    trimValues: true,
    cdataTagName: "__cdata", //default is 'false'
    cdataPositionChar: "\\c",
    parseTrueNumberOnly: false,
    arrayMode: false, //"strict"
    attrValueProcessor: (val, attrName) => _he.decode(val, { isAttributeValue: true }),//default is a=>a
    tagValueProcessor: (val, tagName) => _he.decode(val), //default is a=>a
    stopNodes: ["parse-me-as-string"]
};

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

function xml2JSON(inputXML, extractKey) {

    try {
        if (_parser.validate(inputXML) === true) { //optional (it'll return an object in case it's not valid)
            var jsonOutput = _parser.parse(inputXML, _xml_parser_options);
            //console.log("dara",jsonOutput)
            return {
                'statusCode': 1,
                'status': 'SUCCESS',
                'data': JSON.parse(jsonOutput[extractKey])
            };
        }
        else {
            return {
                'statusCode': 2,
                'status': 'FAILED',
                'reason': 'inputXML data is not valid format'
            };
        }

    } catch (e) {
       // console.log("eeeeeeeeeeeeee",e)
        return {
            'statusCode': 3,
            'status': 'FAILED',
            'reason': 'failed to process your request'
        };

    }
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
    encode,
	xml2JSON
};