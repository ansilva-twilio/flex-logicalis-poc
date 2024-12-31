import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: 'your-access-key-id',
  secretAccessKey: 'your-secret-access-key',
  region: 'your-region'
});

export const uploadToS3 = async (blob: any, taskSid: string) => {
  const fileName = `${taskSid}-${Date.now()}.webm`;
  const params = {
    Bucket: 'your-s3-bucket-name',
    Key: fileName,
    Body: blob,
    ContentType: 'video/webm'
  };

  const result = await s3.upload(params).promise();
  
  return result.Location;
};