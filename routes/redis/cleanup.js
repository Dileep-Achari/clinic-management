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

 function matchKeys() {
	return new Promise((resolve, reject) => {
		client.keys('DOC9.count.DOC9*', (err, keys) => {
			if (err) reject(err);
			else resolve(keys);
		});
	});
}

async function start(){
	console.log("instart");
var varKeys = await matchKeys();
for ( var i in varKeys){
	console.log(varKeys[i]);
	await client.del(varKeys[i])
}
}

start();

