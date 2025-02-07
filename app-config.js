let dirPath = __dirname;
dirPath = dirPath.replace(/\\/gm, "/") + "/";

module.exports = {
    "HOST": "DOC9",
    "NODE_ENV": "production",
    "DIR_PATH": dirPath,
	  "APP_DIR_PATH": "/var/www/html/doc9/op/ui/",
    "TIMEZONE_OFFSET": 0,
    "OP_SMS_EMAIL_URL": "http://localhost:10001/smsEmail/op/",
    "FB_SMS_EMAIL_URL": "http://localhost:10001/smsEmail/fb/",
    "HIMS_PDF_BASE_PATH": "http://dr9.in/",
    "REDIS_URL": "http://localhost:10003/redis/",
    "REDIS_URL_IP": "http://10.15.79.47:10003/redis/",
    "SALCK_URL": "",
    "SLACK_ENABLE": false,
    "DAYS_TO_KEEP_LOG": 10,
    "LOG_METHOD_COUNT": "N",
	"APK_LOG_PATH":"/var/www/html/doc9/node/apk/",
}