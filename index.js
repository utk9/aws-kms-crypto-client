 const Promise = require('bluebird');

 const config = require('read-config');

const crypto = require('crypto');

 const AWS = require('aws-sdk');
 AWS.config.loadFromPath('./config/aws-config.json');
 AWS.config.setPromisesDependency(bluebird);

 class KMSClient {
 	constructor() {
 		this._client = new aws.KMS({ region: 'us-west-2' });
 		this._plainTextDataKey = null;
 	}

 	decrypt (data) {
 		const pPlainTextDataKey = Promise.resolve(this._plainTextDataKey);
 		if (!this._plainTextDataKey) {
 			const { encryptedDataKey } = config.readConfig('./config.');
 			pPlainTextDataKey = this._client.decrypt({ CipherText: Buffer.from(encryptedDataKey, 'base64') }).promise();
 		}

 		return pPlainTextDataKey
 			.then((dataKey) => {
 				const decipher = crypto.createDecipher('aes256', dataKey);
 				let decrypted = decipher.update(data, 'hex', 'utf8');
 				decrypted += decipher.final('utf8');
 				return decrypted;
 			})
 			.catch((err) => {
 				return null;
 			})
 	}

 	flushPlainTextDataKey() {
 		this._plainTextDataKey = null;
 	}


 }