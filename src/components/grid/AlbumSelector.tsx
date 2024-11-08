"use client";

import { useState, useEffect } from "react";
import { type Album } from "@/types/spotify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface AlbumSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (album: Album) => void;
  selectedAlbumIds?: string[];
}

export const AlbumSelector = ({
  isOpen,
  onClose,
  onSelect,
  selectedAlbumIds = [],
}: AlbumSelectorProps) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { data: results = [] as Album[], isLoading } =
    api.spotify.searchAlbums.useQuery(
      {
        query: debouncedSearch,
      },
      {
        enabled: isOpen && debouncedSearch.length > 0,
      },
    );

  const handleClose = () => {
    setSearch("");
    setDebouncedSearch("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select an Album</DialogTitle>
        </DialogHeader>
        <div className="mb-4 flex gap-2">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for an album..."
          />
        </div>

        <div className="grid max-h-96 grid-cols-2 gap-4 overflow-y-auto">
          {isLoading ? (
            <div className="col-span-2 flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-spotify"></div>
            </div>
          ) : (
            results.map((album) => (
              <button
                key={album.id}
                onClick={() => {
                  onSelect(album);
                  handleClose();
                }}
                disabled={selectedAlbumIds.includes(album.id)}
                className={cn(
                  "flex items-center gap-4 rounded-lg p-4 transition-colors",
                  "hover:bg-spotify-800/50",
                  selectedAlbumIds.includes(album.id) &&
                    "cursor-not-allowed opacity-50",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={album.imageUrl}
                  alt={album.name}
                  className="h-16 w-16 object-cover"
                />
                <div>
                  <div className="font-medium">{album.name}</div>
                  <div className="text-sm text-gray-600">{album.artist}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
