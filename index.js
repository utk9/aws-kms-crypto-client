 const AWS = require('aws-sdk');

 AWS.config.loadFromPath('./config/aws-config.json');

 class KMSClient {
 	constructor() {
 		this._client = new aws.KMS({ region: 'us-west-2' });
 	}
 }