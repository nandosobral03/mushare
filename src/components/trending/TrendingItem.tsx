import Link from "next/link";
import { motion } from "framer-motion";
import { type TrendingItemType } from "@/types/trending";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface TrendingItemProps {
  item: TrendingItemType;
}

export const TrendingItem = ({ item }: TrendingItemProps) => {
  const isGrid = "size" in item;
  const href = isGrid ? `/grid/${item.id}` : `/chart/${item.id}`;

  return (
    <Link href={href}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-6 rounded-lg bg-spotify-800/30 p-6 transition-colors hover:bg-spotify-800/50"
      >
        <div className="relative aspect-square w-32 overflow-hidden rounded-lg">
          {item.albums.slice(0, 4).map((album, i) => (
            <div
              key={i}
              className="absolute h-1/2 w-1/2"
              style={{
                top: i < 2 ? "0" : "50%",
                left: i % 2 === 0 ? "0" : "50%",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={album.album.imageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
        <div className="flex-grow">
          <h3 className="text-xl font-semibold text-white">{item.title}</h3>
          <p className="text-sm text-gray-400">
            by {item.spotifyUser.name} • {dayjs(item.createdAt).fromNow()}
          </p>
          <div className="mt-2 flex items-center gap-4">
            <span className="flex items-center gap-1 text-sm text-gray-400">
              <span className="material-symbols-outlined text-base">
                favorite
              </span>
              {item._count.likes} likes
            </span>
            <span className="text-sm text-gray-400">
              {isGrid ? `${item.size}x${item.size} Grid` : "Chart"}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
