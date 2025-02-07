'use strict';
module.exports = {
    getTmpQsDtlsMbl: (data, loadAjax, multiData) => {
        if (!data) return [];
        if (multiData === 'Y') {
            const keys = Object.keys(data);
            const array = [];
            if (data && keys && keys.length > 0) {
                keys.forEach((key) => {
                    array.push(data[key]);
                });
                data = null;
                return array;
            }
            else return data;
        }
        else return data;
    }
}