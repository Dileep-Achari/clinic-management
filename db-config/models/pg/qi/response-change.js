function masterGroup(arr = []) {
    let retObj = {};
    arr.forEach(obj => {
        if (obj.master_name) {
            if (!retObj[obj.master_name]) retObj[obj.master_name] = [];

            if (obj.master_name === "ott") {
                retObj[obj.master_name].push({
                    "employee_cd": obj.col2,
                    "display_name": obj.col3
                });
            }
            else if (obj.master_name === "snur") {
                retObj[obj.master_name].push({
                    "employee_cd": obj.col2,
                    "display_name": obj.col3
                });
            }
            else if (obj.master_name === "onur") {
                retObj[obj.master_name].push({
                    "employee_cd": obj.col2,
                    "display_name": obj.col3
                });
            }
            else if (obj.master_name === "surg") {
                retObj[obj.master_name].push({
                    "doc_cd": obj.col2,
                    "doctor_name": obj.col3
                });
            }
            else if (obj.master_name === "anst") {
                retObj[obj.master_name].push({
                    "doc_cd": obj.col2,
                    "doctor_name": obj.col3
                });
            }
            else if (obj.master_name === "ots") {
                retObj[obj.master_name].push({
                    "surgery_cd": obj.col2,
                    "surgery_name": obj.col3
                });
            }
            else if (obj.master_name === "oth") {
                retObj[obj.master_name].push({
                    "ot_cd": obj.col2,
                    "theatre_name": obj.col3
                });
            }
            else if (obj.master_name === "nrs"||obj.master_name === "nurra") {
                retObj[obj.master_name].push({
                    "ns_cd": obj.col2,
                    "ns_name": obj.col3
                });
            }
            else if (obj.master_name === "module") {
                retObj[obj.master_name].push({
                    "module_id": obj.col2,
                    "module_name": obj.col3
                });
            }
            else if (obj.master_name === "roles") {
                retObj[obj.master_name].push({
                    "role_id": obj.col2,
                    "role_name": obj.col3
                });
            }
            else if (obj.master_name === "users") {
                retObj[obj.master_name].push({
                    "user_id": obj.col2,
                    "user_name": obj.col3
                });
            }
            else {
                retObj[obj.master_name].push(obj);
            }
        }
    });
    arr = null;
    return retObj
}

module.exports = {
    getMasterData: (data, params) => {
        data = masterGroup(data);
        let keys = Object.keys(data);
        if (data && keys.length && keys.length === 1) return data[keys[0]];
        else return data;
    }
}