"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface MediaScrollerProps {
  title: string;
  items: {
    id: string;
    title: string;
    albums: {
      imageUrl: string;
    }[];
  }[];
  type: "grid" | "chart";
}

const placeholderUrl = "https://via.placeholder.com/150";

const MediaScroller = ({ title, items, type }: MediaScrollerProps) => {
  const getCompositeImage = (item: { albums: { imageUrl: string }[] }) => {
    if (!item.albums?.length) return [placeholderUrl];

    if (item.albums.length === 1) return [item.albums[0]!.imageUrl];

    // For multiple albums, we'll return up to 4 album covers
    const images = item.albums.slice(0, 4).map((album) => album.imageUrl);
    return images;
  };

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-2xl font-bold text-white">{title}</h2>
      <div className="relative">
        <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-4">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/${type}/${item.id}`}
              className="flex-shrink-0"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-48 rounded-lg bg-spotify-800/30 p-4 transition-colors hover:bg-spotify-800/70"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                  {getCompositeImage(item)?.length > 1 ? (
                    <div className="grid grid-cols-2 grid-rows-2 gap-0.5">
                      {getCompositeImage(item)?.map(
                        (image: string, i: number) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={i}
                            src={image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ),
                      )}
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getCompositeImage(item)?.[0]}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <h3 className="mt-2 truncate text-lg font-semibold text-white">
                  {item.title}
                </h3>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaScroller;
