import { DeleteOutlined } from "@ant-design/icons";
import { Button, Modal, message } from "antd";
import { useState } from "react";
import { getErrorMessage } from "../../shared/utils/getErrorMessage";
import type { BikeModel } from "../models/BikeModel";

interface DeleteBikeButtonProps {
  bike: BikeModel;
  deleteBike: (id: string) => Promise<unknown>;
  onDeleted?: () => void;
  label?: string;
}

export const DeleteBikeButton = ({
  bike,
  deleteBike,
  onDeleted,
  label,
}: DeleteBikeButtonProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const onConfirm = () => {
    setIsDeleting(true);
    deleteBike(bike.id)
      .then(() => {
        setIsOpen(false);
        onDeleted?.();
      })
      .catch((error) => {
        setIsOpen(false);
        message.error(getErrorMessage(error, "Could not delete the bike"));
      })
      .finally(() => setIsDeleting(false));
  };

  return (
    <>
      <Button danger icon={<DeleteOutlined />} onClick={() => setIsOpen(true)}>
        {label}
      </Button>
      <Modal
        open={isOpen}
        title={`Deleting ${bike.brand} ${bike.model}`}
        okText="Yes, delete"
        okButtonProps={{ danger: true }}
        onOk={onConfirm}
        onCancel={() => setIsOpen(false)}
        confirmLoading={isDeleting}
      >
        You are about to delete this bike. This action cannot be undone, and a
        bike linked to a sale cannot be deleted. Are you sure?
      </Modal>
    </>
  );
};
