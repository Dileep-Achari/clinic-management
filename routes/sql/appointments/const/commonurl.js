let url = function (locId) {
    if (locId === 1003) {
        let uri = "https://nodeapi.drramesh.com/radmb/radiology/api/"
        return uri
    }
    else if (locId === 1047) {
        let uri = "https://nodeapi.drramesh.com/radgnt/radiology/api/"
        return uri
    }
    else if (locId === 1043) {
        let uri = "https://nodeapi.drramesh.com/radong/radiology/api/"
        return uri
    }
    else if (locId === 1) {
        let uri = "http://202.65.140.218:9001/radiology/api/"
        return uri
    }
}

let uri = function (sessionId) {
    if (sessionId == 1005) {
        let uri = "https://emraayush.com/rad/"
        return uri
    }
    else if (sessionId == 1167) {
        let uri = "http://111.93.87.226:8060/radiology/api/"
        return uri
    }
    else if (sessionId == 1119) {
        let uri = "http://122.186.5.219/radiology/"
        return uri
    }
}

module.exports = {
    url,
    uri
}