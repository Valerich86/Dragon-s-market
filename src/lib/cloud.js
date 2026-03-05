import {
  S3Client,
  ListBucketsCommand,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

export const baseUrl = process.env.VK_CLOUD_ENDPOINT;
export const bucketName = process.env.VK_CLOUD_BUCKET;

export function fetchPath() {
  return `${baseUrl}/${bucketName}`;
}

export const s3Client = new S3Client({
  region: "ru-msk", // или другой регион
  endpoint: baseUrl, // домен вашего региона
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

