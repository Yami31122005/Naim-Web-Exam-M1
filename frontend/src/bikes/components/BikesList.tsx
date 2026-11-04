import { Pagination, Skeleton, Space } from "antd";
import { useEffect } from "react";
import { PAGE_SIZE } from "../../shared/pagination/pagination";
import { useBikesProvider } from "../providers/useBikesProvider";
import { AddBikeButton } from "./AddBikeButton";
import { BikeListItem } from "./BikeListItem";

export const BikesList = () => {
  const {
    bikes,
    totalCount,
    page,
    setPage,
    load,
    isLoading,
    createBike,
    deleteBike,
  } = useBikesProvider();

  useEffect(() => {
    load(page);
  }, [page]);

  return (
    <Space orientation="vertical" style={{ padding: ".25rem .5rem" }}>
      <AddBikeButton createBike={createBike} />
      {isLoading ? (
        <Skeleton />
      ) : (
        bikes.map((bike) => (
          <BikeListItem key={bike.id} bike={bike} deleteBike={deleteBike} />
        ))
      )}
      <Pagination
        current={page}
        pageSize={PAGE_SIZE}
        total={totalCount}
        showSizeChanger={false}
        onChange={(nextPage) => setPage(nextPage)}
      />
    </Space>
  );
};
