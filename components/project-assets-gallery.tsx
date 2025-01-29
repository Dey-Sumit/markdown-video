"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, FileVideo, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { formatFileSize } from "./file-dropzone";

// First, create a type for S3 assets
type S3Asset = {
  id: string;
  lastModified: string;
  size: number;
  thumbnailUrl?: string;
  type: "image" | "video";
  url: string;
  name: string;
};

export function AssetGallery() {
  const [assets, setAssets] = React.useState<S3Asset[]>([]);
  const [filter, setFilter] = React.useState<"all" | "image" | "video">("all");
  //   const { toast } = useToast();

  const fetchUserAssets = async () => {
    try {
      const response = await fetch("/api/assets");
      const data = await response.json();

      const formattedAssets: S3Asset[] = data.assets.map(
        (asset: {
          key: string;
          url: string;
          lastModified: string;
          size: number;
          name: string;
        }) => {
          const isVideo = asset.url.match(/\.(mp4|mov|webm)$/i);

          return {
            id: asset.key,
            url: asset.url,
            type: isVideo ? "video" : "image",
            // For videos, we can generate thumbnail using the first frame
            thumbnailUrl: isVideo ? `${asset.url}#t=0.1` : undefined,
            lastModified: asset.lastModified,
            size: asset.size,
            name: asset.name,
          };
        },
      );

      console.log("formattedAssets", formattedAssets);
      setAssets(formattedAssets);
      // setUserUploadedAssets(formattedAssets);
    } catch (error) {
      console.error("Error fetching user assets:", error);
    }
  };

  React.useEffect(() => {
    fetchUserAssets();
  }, []);

  const filteredAssets = React.useMemo(() => {
    if (filter === "all") return assets;
    return assets.filter((asset) => asset.type === filter);
  }, [assets, filter]);

  const copyLink = (url: string) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast("Link copied to clipboard", {
          duration: 1000,
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <section className="-mt-2 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Uploaded Assets</h2>
        <Button size="sm" variant="ghost" className="text-muted-foreground">
          <RefreshCcw className="size-4" />
        </Button>
      </div>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-3">
          <TabsTrigger
            className="text-sm"
            value="all"
            onClick={() => setFilter("all")}
          >
            All
          </TabsTrigger>
          <TabsTrigger
            className="text-sm"
            value="image"
            onClick={() => setFilter("image")}
          >
            Images
          </TabsTrigger>
          <TabsTrigger
            className="text-sm"
            value="video"
            onClick={() => setFilter("video")}
          >
            Videos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-0">
          <div className="flex flex-col gap-2">
            {filteredAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} onCopy={copyLink} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="image" className="mt-0">
          <div className="flex flex-col gap-2">
            {filteredAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} onCopy={copyLink} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="video" className="mt-0">
          <div className="flex flex-col gap-2">
            {filteredAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} onCopy={copyLink} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}

function AssetCard({
  asset,
  onCopy,
}: {
  asset: S3Asset;
  onCopy: (url: string) => void;
}) {
  return (
    <div
      key={asset.id}
      className="flex gap-2 rounded-lg border border-border/50 bg-muted/25 p-2 transition-colors"
    >
      <div className="shrink-0">
        {asset.type.startsWith("image/") ? (
          <div className="size-10 overflow-hidden rounded-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset.url}
              alt={asset.type}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <FileVideo
            strokeWidth={1}
            className="-ml-1 size-10 text-muted-foreground"
          />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate text-xs font-medium">{asset.name}</p>
        <p className="text-xs text-muted-foreground">
          {asset.type.toUpperCase()} • {formatFileSize(asset.size)}
        </p>
      </div>
      <Button
        size="icon"
        variant="ghost"
        className="rounded-full transition-colors hover:bg-primary/20"
        onClick={() => onCopy(asset.url)}
      >
        <Copy className="size-4 text-muted-foreground" />
      </Button>
    </div>
  );
}
