// pages/api/files/[fileName].ts
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { NextApiRequest, NextApiResponse } from "next";

const s3Client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_KEY!,
    secretAccessKey: process.env.S3_SECRET!,
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { fileName } = req.query;

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  if (typeof fileName !== "string") {
    return res.status(400).json({ error: "Invalid file name" });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: fileName,
    });

    const data = await s3Client.send(command);

    // Convert the file data to a buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of data.Body as AsyncIterable<Uint8Array>) {
      chunks.push(chunk);
    }
    const fileBuffer = Buffer.concat(chunks);

    // Set headers for the response
    res.setHeader(
      "Content-Type",
      data.ContentType || "application/octet-stream"
    );
    res.setHeader("Content-Length", data.ContentLength?.toString() || "0");
    res.status(200).send(fileBuffer);
  } catch (error) {
    console.error("Error fetching file from S3:", error);
    res.status(500).json({ error: "Error fetching file" });
  }
}
