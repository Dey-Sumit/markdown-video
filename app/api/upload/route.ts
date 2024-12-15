import { s3Client } from "@/lib/config/s3.config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function POST(request: Request) {
  const { size, contentType } = await request.json();

  const key = crypto.randomUUID();
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    ContentLength: size,
  });

  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });
  const readUrl = `https://${process.env.BUCKET_NAME}.s3.us-east-1.amazonaws.com/${key}`;

  return Response.json({ presignedUrl, readUrl });
}
