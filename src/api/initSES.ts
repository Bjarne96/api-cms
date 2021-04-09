var aws = require('aws-sdk');
import config = require('../../config')

//SES and IAM config credentials
const SES_CONFIG = {
    accessKeyId: config.aws_ses_accessKeyId,
    secretAccessKey: config.aws_ses_secretAccessKey,
    region: config.aws_ses_region,
};

// Create a new SES object. 
var ses = new aws.SES(SES_CONFIG);

export default ses;