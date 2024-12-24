const {  CloudFrontClient, CreateInvalidationCommand  } = require("@aws-sdk/client-cloudfront");
const { serverConfig } = require("../config/index");

const cloudfront = new CloudFrontClient({});

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

