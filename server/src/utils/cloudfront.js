const {  CloudFrontClient, CreateInvalidationCommand  } = require("@aws-sdk/client-cloudfront");
const { serverConfig } = require("../config/index");

const cloudfrontDistributionId = process.env.CLOUDFRONT_DISTRIBUTION_ID

const cloudfront = new CloudFrontClient({
  credentials: {
    accessKeyId: serverConfig.AWS_ACCESS_KEY,
    secretAccessKey: serverConfig.AWS_SECRET_KEY,
  }
});


const invalidateCloudFrontDistribution = async (key) => {

    const invalidationParams = {
        DistributionId: serverConfig.CLOUDFRONT_DISTRIBUTION_ID,
        InvalidationBatch: {
          CallerReference: `${Date.now()}-${key}`,
          Paths: {
            Quantity: 1,
            Items: [
              "/" + key
            ]
          }
        }
    }
    const command = new CreateInvalidationCommand(invalidationParams);  
    await cloudfront.send(command);

}

module.exports = {
    invalidateCloudFrontDistribution
}

