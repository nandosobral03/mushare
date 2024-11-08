import { type Grid, type Chart } from "@prisma/client";

export type DateRange = "weekly" | "monthly" | "all";

export type TrendingItemType = (Grid | Chart) & {
  _count: {
    likes: number;
  };
  albums: {
    album: {
      imageUrl: string;
    };
  }[];
  spotifyUser: {
    name: string;
  };
};
