const xl = require('excel4node');

function setName(value) {
    if (value) {
        if (value.indexOf('_') > -1) {
            value = value.split('_');
            for (var val in value) {
                value[val] = value[val].charAt(0).toUpperCase() + value[val].slice(1).toLowerCase();
            }
            value = value.join(' ');
        }
        else {
            value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        }
    }
    else {
        value = "";
    }
    return value;
}

function createExcel(data, cb) {
    if (!data) data = [];
    const wb = new xl.Workbook();
    let ws = wb.addWorksheet("One");
    let head = [];
    let z = 1;
    let style = wb.createStyle({
        font: {
            color: 'black',
            size: 11,
            name: 'Arial',
            bold: true
        }
    });
    for (var k in data[0]) {
        head.push({
            column: k
        });
        ws.cell(1, z).string(setName(k)).style(style);
        z++;
    }

    for (var i in data) {
        for (var j in Object.keys(data[i])) {
            if (!data[i][head[j].column]) data[i][head[j].column] = "";
            if (typeof data[i][head[j].column] === 'number') {
                ws.cell((parseInt(i) + 2), (parseInt(j) + 1)).number(data[i][head[j].column]);
            }
            else if (typeof data[i][head[j].column] === 'bool') {
                ws.cell((parseInt(i) + 2), (parseInt(j) + 1)).bool(data[i][head[j].column]);
            }
            else if (typeof data[i][head[j].column] === 'object') {
                if (Object.prototype.toString.call(data[i][head[j].column]) === '[object Date]') {
                    ws.cell((parseInt(i) + 2), (parseInt(j) + 1)).string(data[i][head[j].column].toLocaleString());
                }
                else {
                    ws.cell((parseInt(i) + 2), (parseInt(j) + 1)).string(data[i][head[j].column]);
                }
            }
            else {
                ws.cell((parseInt(i) + 2), (parseInt(j) + 1)).string(data[i][head[j].column]);
            }
        }
    }
    cb(wb);
}

module.exports = createExcel;