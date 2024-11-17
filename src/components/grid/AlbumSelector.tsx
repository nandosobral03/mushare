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
      <DialogContent className="max-w-4xl">
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

        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-spotify"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {results.map((album) => (
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
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{album.name}</div>
                    <div className="truncate text-sm text-gray-600">
                      {album.artist}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
