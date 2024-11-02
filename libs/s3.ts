import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_KEY!,
    secretAccessKey: process.env.S3_SECRET!,
  },
});

export default s3;
