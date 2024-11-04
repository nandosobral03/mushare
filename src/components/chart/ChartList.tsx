import { type Album } from "@/types/spotify";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Trash2, Check } from "lucide-react";

interface ChartListProps {
  albums: (Album & { index: number })[];
  onReorder: (newOrder: (Album & { index: number })[]) => void;
  onRemove: (album: Album & { index: number }) => void;
}

export const ChartList = ({ albums, onReorder, onRemove }: ChartListProps) => {
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest(".delete-confirm") &&
        !target.closest(".delete-trigger")
      ) {
        setPendingDelete(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative min-h-[200px]">
      <Reorder.Group
        axis="y"
        values={albums}
        onReorder={onReorder}
        className="space-y-4"
        style={{ position: "relative" }}
      >
        {albums.map((album) => (
          <Reorder.Item
            key={album.id}
            value={album}
            style={{ position: "relative" }}
            className="relative overflow-hidden rounded-lg"
          >
            <div
              className="relative flex cursor-grab items-center gap-4 rounded-lg p-4 hover:bg-spotify-900/50 active:cursor-grabbing"
              style={{
                transform: "translate3d(0, 0, 0)",
                WebkitTransform: "translate3d(0, 0, 0)",
              }}
            >
              <span className="min-w-[2.5rem] text-2xl font-semibold text-spotify">
                #{album.index + 1}
              </span>
              <img
                src={album.imageUrl ?? ""}
                alt={album.name}
                width={64}
                height={64}
                className="rounded-md"
              />
              <div className="flex-grow">
                <h3 className="font-semibold text-white">{album.name}</h3>
                <p className="text-primary-foreground">{album.artist}</p>
              </div>
              <button
                onClick={() => setPendingDelete(album.id)}
                className="delete-trigger ml-auto p-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <AnimatePresence>
              {pendingDelete === album.id && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "8rem" }}
                  exit={{ width: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  className="delete-confirm absolute inset-y-0 right-0 z-20 flex items-center justify-center rounded-r-lg bg-red-500"
                >
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => {
                      onRemove(album);
                      setPendingDelete(null);
                    }}
                    className="p-2 text-white transition-transform hover:scale-110"
                  >
                    <Check size={24} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};
