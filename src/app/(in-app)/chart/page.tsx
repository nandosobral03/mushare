"use client";
import { useState } from "react";
import { type Album } from "@/types/spotify";
import { ChartList } from "@/components/chart/ChartList";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SaveChartButton } from "@/components/chart/SaveChartButton";
import { Button } from "@/components/ui/button";
import { AlbumSelector } from "@/components/grid/AlbumSelector";
import { AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/ui/PageHeader";

export default function ChartPage() {
  const [selectedAlbums, setSelectedAlbums] = useState<
    ((Album & { index: number }) | null)[]
  >([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isAlbumSelectorOpen, setIsAlbumSelectorOpen] = useState(false);

  const addNewAlbum = (album: Album) => {
    if (selectedAlbums.some((existing) => existing?.id === album.id)) {
      return;
    }

    setSelectedAlbums((prev) => [...prev, { ...album, index: prev.length }]);
    setIsAlbumSelectorOpen(false);
  };

  const handleReorder = (newOrder: (Album & { index: number })[]) => {
    const reindexedAlbums = newOrder.map((album, idx) => ({
      ...album,
      index: idx,
    }));
    setSelectedAlbums(reindexedAlbums);
  };

  const handleRemove = (albumToRemove: Album & { index: number }) => {
    setSelectedAlbums((prev) =>
      prev
        .filter((album) => album?.id !== albumToRemove.id)
        .map((album, idx) => (album ? { ...album, index: idx } : null)),
    );
  };

  return (
    <main className="flex flex-col p-6">
      <PageHeader
        icon="view_list"
        title="Create Chart"
        description="Create your own album chart by selecting and ranking albums"
      />
      <div className="flex grow flex-col items-center justify-stretch gap-8 p-8">
        <div className="w-full max-w-5xl space-y-2">
          <div className="space-y-4 rounded-lg p-6">
            <Input
              placeholder="Chart Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-auto border-2 bg-transparent p-4 text-2xl font-bold text-white focus:border-gray-500"
            />
            <Textarea
              placeholder="Chart Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] resize-y border-2 bg-transparent p-4 text-white focus:border-gray-500"
            />
          </div>

          <AnimatePresence>
            <ChartList
              albums={
                selectedAlbums.filter(Boolean) as (Album & { index: number })[]
              }
              onReorder={handleReorder}
              onRemove={handleRemove}
            />
          </AnimatePresence>

          <Button
            onClick={() => setIsAlbumSelectorOpen(true)}
            className="mt-4 h-12 w-full border-2 border-dashed border-spotify bg-transparent text-spotify hover:bg-spotify hover:text-white"
            variant="outline"
          >
            Add Album
          </Button>

          <div className="flex justify-end">
            <SaveChartButton
              title={title}
              description={description}
              albums={selectedAlbums.filter(Boolean) as Album[]}
            />
          </div>
        </div>
        <AlbumSelector
          isOpen={isAlbumSelectorOpen}
          onClose={() => setIsAlbumSelectorOpen(false)}
          onSelect={addNewAlbum}
          selectedAlbumIds={selectedAlbums
            .filter(Boolean)
            .map((album) => (album as Album).id)}
        />
      </div>
    </main>
  );
}
