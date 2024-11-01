"use client";

import { useState, useEffect } from "react";
import { type Album } from "@/types/album";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";

type AlbumSelectorProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (album: Album) => void;
};

export const AlbumSelector = ({
  isOpen,
  onClose,
  onSelect,
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

  const { data: results = [], isLoading } = api.spotify.searchAlbums.useQuery(
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
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded border p-2 focus:outline-none focus:ring-2 focus:ring-spotify"
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
              <div
                key={album.id}
                onClick={() => {
                  onSelect(album);
                  handleClose();
                }}
                className="flex cursor-pointer gap-2 rounded border p-2 hover:bg-gray-100"
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
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
