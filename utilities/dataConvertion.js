const _ = require('underscore');
const moment = require('moment');


function viatlsTabFmt(data,method) {
    var _vitals={};
    if(method==="GetVitalSignsNew"){
             _vitals = [{ key: "BP", val: "BP", units: "mmHg" },
               { key: "Pulse", val: "PUL", units: "min" },
               { key: "HR", val: "HRT_RAT", units: "bpm" },
               { key: "RR", val: "RESP_RAT", units: "min" },
               { key: "Wt", val: "WEIGT", units: "kg" },
               { key: "Ht", val: "HEIGT", units: "cms" },
               { key: "BMI", val: "BMI", units: "kg/m2" },
               { key: "BSA", val: "BSA", units: "mins" },
               { key: "Temp", val: "TEMP", units: "°C" },
               { key: "SPO2", val: "SPO2", units: "%" },
               { key: "GRBS", val: "GRBS", units: "mins" }]
    }
    else{
        _vitals = [{ key: "BP", val: "BP", units: "mmHg" },
        { key: "Pulse", val: "PULSE", units: "min" },
        { key: "HR", val: "HEART_RATE", units: "bpm" },
        { key: "RR", val: "RESPORATORY_RATE", units: "min" },
        { key: "Wt", val: "WEIGHTS", units: "kg" },
        { key: "Ht", val: "HEIGHT", units: "cms" },
        { key: "BMI", val: "BMI", units: "kg/m2" },
        { key: "BSA", val: "BSA", units: "mins" },
        { key: "Temp", val: "TEMPRATURE", units: "°C" },
        { key: "SPO2", val: "SPO2", units: "%" },
        { key: "GRBS", val: "GRBS", units: "mins" }]

    }
               var _result = [];
                let _dateFormate = 'DD-MMM-YYYY, HH:mm';
                let _BP="";
                 for(let dta in data){
                    if(method==="GetVitalSignsNew"){
                    _BP=(data[dta].SYS&&data[dta].DIA)?`${data[dta].SYS}/${data[dta].DIA}`:((data[dta].SYS_SIT&&data[dta].DIA_SIT)?`${data[dta].SYS_SIT}/${data[dta].DIA_SIT}`:(data[dta].SYS_STND&&data[dta].DIA_STND)?`${data[dta].SYS_STND}/${data[dta].DIA_STND}`:"")
                    }
                    // _BP=((data[dta].SYSTOLIC) &&(data[dta].DIASTOLIC))?`${data[dta].SYSTOLIC}/${data[dta].DIASTOLIC}`:(data[dta].SYSTOLIC_SITTING && data[dta].SYSTOLIC_SITTING)?`${data[dta].SYSTOLIC}/${data[dta].DIASTOLIC}`:(data[dta].SYSTOLIC_STANDING && data[dta].SYSTOLIC_STANDING)?`${data[dta].SYSTOLIC}/${data[dta].DIASTOLIC}`:""
                       else{
                           _BP=(data[dta].SYSTOLIC&&data[dta].DIASTOLIC)?`${data[dta].SYSTOLIC}/${data[dta].DIASTOLIC}`:((data[dta].SYSTOLIC_SITTING&&data[dta].DIASTOLIC_SITTING)?`${data[dta].SYSTOLIC_SITTING}/${data[dta].DIASTOLIC_SITTING}`:(data[dta].SYSTOLIC_STANDING&&data[dta].DIASTOLIC_STANDING)?`${data[dta].SYSTOLIC_STANDING}/${data[dta].DIASTOLIC_STANDING}`:"")
                       }
                           data[dta]={BP:_BP,...data[dta]}
                    data[dta].epochDate=new Date(data[dta].CREATE_DT).getTime()
                }
                data=_.sortBy(data, 'epochDate')
                data=data.reverse()
                
                for (var a in data) {
                    for (var b in data[a]) {
                        for (var c in _vitals) {
                            if (_vitals[c].val == b) {
                                //debugger;
                                var _obj = {};
                                _obj = {
                                    "CREATE_DATE": data[a].CREATE_DT||data[a].CRT_DT,
                                    "FORMATTED_DATE": moment(new Date(data[a].CREATE_DT)).format(_dateFormate),
                                    "IP_VISIT_ID": data[a].IP_VISIT_ID||data[a].IP_VIST_ID,
                                    "label": _vitals[c].key,
                                    "value": data[a][b] || "",
                                    "units":_vitals[c].units
                                };
                                _result.push(_obj)
                            }
                        }
                    }
                }
                //console.log(_result);CRT_DT
                data = _result;
                let _scrollColumn = [];
                let _maxDays = 3;
                let _checkIndex = 0;
                let _parentCindex = 0;
                let _prepareHeaderRows = [];
                let _availDays = [];
                let _prepareDefaultRows = [];
                let _colors = ["#eec8ff", "#00ff00", "#ffff00", "#ff00ff", "#f7f7f7", "#0000ff"];
                //create EPOCH date to "CHART_DATE  
                _.each(data, function (item, index) {
                    item.CREATE_DATE=item.CREATE_DATE?item.CREATE_DATE:item.CRT_DT
                    
                    item.__CHART_DATE_EPOCH = moment((item.CREATE_DATE.split('T')[0] + ' ' + item.CREATE_DATE.split('T')[1]), 'YYYY-MM-DD HH:mm').valueOf();
                });
                var inc = 0;
                var x = _.groupBy(data, "__CHART_DATE_EPOCH");
                _.each(_.groupBy(data, "__CHART_DATE_EPOCH"), function (item, index) {
                    _.chain(_.sortBy((_.chain(item).map(function (eitem) {
                        return eitem.__CHART_DATE_EPOCH;
                    }).uniq().value()))).each(function (eItem, myindex) {
                        _prepareDefaultRows.push(
                            {
                                dateTime: item[0].__CHART_DATE_EPOCH,
                                 formatDate:moment(new Date(item[0].__CHART_DATE_EPOCH)).format(_dateFormate),
                                value: "",
                                //color: _colors[inc]
                            }
                        );
                    });
                    //_availDays.push(index);
                    inc++;
                });
                data = _.groupBy(data, function (item) {
                    return item.label;
                });
                _.each(data, function (value, key) {
                    data[key] = _.groupBy(value, function (item) {
                        return item.label;
                    });
                });
        
                _.each(data, function (value, index) {
                    // _scrollColumn.push({
                    //     columnType: "header",
                    //     label: index,
                    //     value: ""
                    // });
                    _parentCindex = _scrollColumn.length - 1;
                    _.each(value, function (hederValue, headerIndex) {
                        _scrollColumn.push({
                            columnType: "data",
                            label: index,
                            units: "",
                            value: JSON.parse(JSON.stringify(_prepareDefaultRows))
                        });
                        _checkIndex = 0;
        
                        _.each(hederValue, function (eDate, eIndex) {
                            _.where(_scrollColumn[_scrollColumn.length - 1].value,
                                { dateTime: eDate.__CHART_DATE_EPOCH })[0].value = _.clone(eDate.value);
                            _scrollColumn[_scrollColumn.length - 1].label = eDate.label;
                            _scrollColumn[_scrollColumn.length - 1].units = eDate.units;
        
                        });
                        _checkIndex++;
                    });
                });
                        return _scrollColumn;

        }
    



module.exports = {
    viatlsTabFmt

}