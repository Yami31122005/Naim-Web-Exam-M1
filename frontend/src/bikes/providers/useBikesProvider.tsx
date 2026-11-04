import axios from "axios";
import { useState } from "react";
import { PAGE_SIZE } from "../../shared/pagination/pagination";
import type { BikeModel, CreateBikeModel } from "../models/BikeModel";

interface BikeListResponse {
  totalCount: number;
  bikes: BikeModel[];
}

export const useBikesProvider = () => {
  const [bikes, setBikes] = useState<BikeModel[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const load = (pageToLoad: number = page) => {
    setIsLoading(true);
    return axios
      .get<BikeListResponse>("http://localhost:3000/bikes", {
        params: { page: pageToLoad, limit: PAGE_SIZE },
      })
      .then((result) => {
        setBikes(result.data.bikes);
        setTotalCount(result.data.totalCount);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Returns the request so the caller can react to errors
  const createBike = (input: CreateBikeModel) =>
    axios
      .post<BikeModel>("http://localhost:3000/bikes", input)
      .then(() => load(page));

  const deleteBike = (id: string) =>
    axios.delete(`http://localhost:3000/bikes/${id}`).then(() => {
      // Last bike of a later page removed: step back to the previous page
      if (bikes.length === 1 && page > 1) setPage(page - 1);
      else return load(page);
    });

  return {
    bikes,
    totalCount,
    page,
    setPage,
    load,
    isLoading,
    createBike,
    deleteBike,
  };
};
