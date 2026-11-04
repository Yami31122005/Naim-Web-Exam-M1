import { ArrowLeftOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Card, Descriptions, Skeleton, Space, Typography } from "antd";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ButtonLink } from "../../shared/components/ButtonLink";
import { useBikeDetailsProvider } from "../providers/useBikeDetailsProvider";
import { formatPrice } from "../utils/formatPrice";
import { DeleteBikeButton } from "./DeleteBikeButton";
import { EditBikeButton } from "./EditBikeButton";

interface BikeDetailsProps {
  bikeId: string;
}

export const BikeDetails = ({ bikeId }: BikeDetailsProps) => {
  const { bike, isLoading, load, updateBike, deleteBike } =
    useBikeDetailsProvider(bikeId);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, [bikeId]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 16,
        padding: ".25rem .5rem",
      }}
    >
      <ButtonLink to="/bikes" icon={<ArrowLeftOutlined />}>
        Back to bikes
      </ButtonLink>

      <Space align="center">
        <ShoppingOutlined style={{ fontSize: "1.5rem" }} />
        {isLoading ? (
          <Skeleton.Input active size="large" />
        ) : (
          <Typography.Title level={2} style={{ margin: 0 }}>
            {bike ? `${bike.brand} ${bike.model}` : "Bike not found"}
          </Typography.Title>
        )}
      </Space>

      {bike && (
        <>
          <Card style={{ alignSelf: "stretch" }}>
            <Descriptions
              bordered
              column={{ xs: 1, md: 2 }}
              items={[
                { key: "brand", label: "Brand", children: bike.brand },
                { key: "model", label: "Model", children: bike.model },
                {
                  key: "description",
                  label: "Description",
                  children: bike.description,
                },
                { key: "category", label: "Category", children: bike.category },
                {
                  key: "frameMaterial",
                  label: "Frame material",
                  children: bike.frameMaterial,
                },
                {
                  key: "frameSizeCm",
                  label: "Frame size",
                  children: `${bike.frameSizeCm} cm`,
                },
                {
                  key: "wheelSizeInches",
                  label: "Wheel size",
                  children: `${bike.wheelSizeInches} in`,
                },
                { key: "gearCount", label: "Gears", children: bike.gearCount },
                {
                  key: "weightKg",
                  label: "Weight",
                  children: `${bike.weightKg} kg`,
                },
                {
                  key: "electric",
                  label: "Electric",
                  children: bike.electric ? "Yes" : "No",
                },
                {
                  key: "price",
                  label: "Price",
                  children: formatPrice(bike.priceCents),
                },
              ]}
            />
          </Card>
          <Space>
            <EditBikeButton bike={bike} updateBike={updateBike} />
            <DeleteBikeButton
              bike={bike}
              deleteBike={deleteBike}
              label="Delete"
              onDeleted={() => navigate({ to: "/bikes" })}
            />
          </Space>
        </>
      )}
    </div>
  );
};
