import { StorageManager } from '@slynova/flydrive';
import { AmazonWebServicesS3Storage } from '@slynova/flydrive-s3';

const config = {
  default: 's3',
  disks: {
    s3: {
      driver: 's3',
      config: {
        key: process.env.AWS_S3_CLIENT_ID,
        secret: process.env.AWS_S3_CLIENT_SECRET,
        region: 'eu-central-1',
        bucket: 'danil-coupons-bot'
      }
    }
  }
};

const storage = new StorageManager(config);

storage.registerDriver('s3', AmazonWebServicesS3Storage);

export default storage;
