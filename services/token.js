const _jwt = require('jsonwebtoken');
const _scretKey = 'T$AV*#^$FKLV@ECdef@';

module.exports = {
    createToken: function (userObj){
        return _jwt.sign(userObj, _scretKey);
    },
    createTokenWithExpire: function (userObj, _expiresIn) {
        return _jwt.sign(userObj, _scretKey, { expiresIn: _expiresIn });
    },
    verifyToken:function(token){
        return new Promise(function(resolve, reject) {
            _jwt.verify(token, _scretKey, function(err, decoded) {
                if (err) {
                    reject({ "ERROR" : "ERROR WHILE DECODE TOKEN" });
                }
                else{
                    resolve(decoded);
                }
            });
        });
    },
    removeToken:function(){
        /* Future purpose */
    }
}
