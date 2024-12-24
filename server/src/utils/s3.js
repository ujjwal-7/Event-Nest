const fs = require('fs');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { serverConfig } = require("../config/index");

const s3Client = new S3Client({
    region: serverConfig.BUCKET_REGION
});


const uploadFileOnS3 = async (filePath, key) => {
    
    try {
        
     const fileStream = fs.createReadStream(filePath);

     fileStream.on('error', (err) => {
       console.error('File Error', err);
     });

     const uploadParams = {
        Bucket: serverConfig.BUCKET_NAME,
        Key: key,
        Body: fileStream,
      };

      const response = await s3Client.send(new PutObjectCommand(uploadParams));
      return response;

    } catch (error) {
        console.log("error uploading on s3 -> ", error);
        
    } finally {
        fs.unlinkSync(filePath);
    }
}


const updateEventImageUrls = async (events) => {
    
    const updatedEvents = events.map((event) => {
        const imageUrl =  `${serverConfig.CLOUDFRONT_DISTRIBUTION}/${event.image}`;
        event.image = imageUrl;
        return event;
      })
    return  updatedEvents;
};

const deleteFileFromS3 = async (key) => {
    const deleteParams = {
      Bucket: serverConfig.BUCKET_NAME,
      Key: key,
    }
  
    return s3Client.send(new DeleteObjectCommand(deleteParams));
  }

module.exports = {
    uploadFileOnS3,
    updateEventImageUrls,
    deleteFileFromS3
}