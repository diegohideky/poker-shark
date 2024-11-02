import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "./s3";
import { v4 as uuidv4 } from "uuid";

export async function uploadFileToS3(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
) {
  const uniqueFileName = `${uuidv4()}_${fileName}`;
  const uploadParams = {
    Bucket: process.env.S3_BUCKET,
    Key: uniqueFileName,
    Body: fileBuffer,
    ContentType: mimeType,
  };

  await s3.send(new PutObjectCommand(uploadParams));

  return uniqueFileName;
}
