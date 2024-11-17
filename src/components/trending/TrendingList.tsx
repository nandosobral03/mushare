"use client";

import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { api } from "@/trpc/react";
import { type DateRange } from "@/types/trending";
import { TrendingItem } from "./TrendingItem";

interface TrendingListProps {
  dateRange: DateRange;
}

export const TrendingList = ({ dateRange }: TrendingListProps) => {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.trending.getItems.useInfiniteQuery(
      { dateRange },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  useEffect(() => {
    if (inView && hasNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className="flex flex-col gap-2 space-y-1">
      {data?.pages.map((page) =>
        page.items.map((item) => <TrendingItem key={item.id} item={item} />),
      )}
      <div ref={ref} className="h-4">
        {isFetchingNextPage && (
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-spotify" />
          </div>
        )}
      </div>
    </div>
  );
};
