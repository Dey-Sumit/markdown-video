import { s3Client } from "@/lib/config/s3.config";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

export async function GET() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.BUCKET_NAME,
      FetchOwner:true
    });

    const response = await s3Client.send(command);

    const assets =
      response.Contents?.map((item) => {
   

        const key = item.Key || ""; // Key might be undefined in rare cases
        const name = key.substring(key.lastIndexOf("/") + 1); // Extract the name from the Key

        return {
          key,
          name,
          url: `https://${process.env.BUCKET_NAME}.s3.us-east-1.amazonaws.com/${key}`,
          lastModified: item.LastModified,
          size: item.Size,
        };
      }) || [];

    return Response.json({ assets });
  } catch (error) {
    console.error("Error listing assets:", error);
    return Response.json({ error: "Failed to list assets" }, { status: 500 });
  }
}
