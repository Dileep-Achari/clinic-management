const redis = require("redis");
const bluebird = require('bluebird');
const config = require("../../config/connection-string")('redis');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


const client = redis.createClient(config);

client.on('connect', () => {
    console.log('Redis:connected');
});

client.on('error', (err) => {
    const message = "error:redis:Something went wrong - " + err.message;
    console.log(message);
});

module.exports = {
    isActive: () => {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    },
    list: () => {
        return new Promise((resolve, reject) => {
            client.keys("*", (err, keys) => {
                if (err) reject(err);
                else resolve(keys);
            });
        });
    },
    putQue: (key, value) => {
        return new Promise(async (resolve, reject) => {
            try {
                await client.rpushAsync(key, value);
                resolve(true);
            }
            catch (ex) {
                reject(ex);
            }
        });
    },
    getQue: (key) => {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await client.lpopAsync(key);
                resolve(data);
            }
            catch (ex) {
                reject(ex);
            }
        });
    },
    rangeQue: (key, from, to) => {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await client.lrangeAsync(key, 0, -1);
                resolve(data);
            }
            catch (ex) {
                reject(ex.message)
            }
        });
    },
    putkey: (key, value, isExpire, tte) => {
		tte = 0;
        return new Promise(async (resolve, reject) => {
            try {
                if (tte && tte > 0 ) {
                    await client.setAsync(key, value, "EX", tte);
                    resolve(true);
                }
                else {
                    await client.setAsync(key, value);
                    resolve(true);
                }
            }
            catch (ex) {
                reject(ex);
            }
        });
    },
    increKey: (key) => {
        return new Promise(async (resolve, reject) => {
            try {
                await client.incr(key);
                resolve(true)
            }
            catch (ex) {
                reject(ex)
            }
        })
    },
    getkey: (key) => {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await client.getAsync(key);
                resolve(data);
            }
            catch (ex) {
                reject(ex);
            }
        });
    },
    delkey: (key) => {
        return new Promise(async (resolve, reject) => {
            try {
				console.log("delete key in redis---",key)
              const data = await client.del(key);
              resolve(data);
			      //	resolve(true);
            }
            catch (ex) {
                reject(ex);
            }
        });
    },
    matchedkeys: (name) => {
        return new Promise((resolve, reject) => {
            client.keys(`*${name}*`, (err, keys) => {
                if (err) reject(err);
                else resolve(keys);
            });
        });
    }
}