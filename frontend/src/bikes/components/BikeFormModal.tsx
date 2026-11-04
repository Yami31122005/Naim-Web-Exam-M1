import {
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Switch,
  message,
} from "antd";
import { useState } from "react";
import { getErrorMessage } from "../../shared/utils/getErrorMessage";
import type { BikeModel, CreateBikeModel } from "../models/BikeModel";

interface BikeFormModalProps {
  open: boolean;
  title: string;
  okText: string;
  bike?: BikeModel;
  onSave: (input: CreateBikeModel) => Promise<unknown>;
  onClose: () => void;
}

// The form works in euros; the API expects cents
type BikeFormValues = {
  brand: string;
  model: string;
  description: string;
  category: string;
  frameMaterial: string;
  frameSizeCm: number | null;
  wheelSizeInches: number | null;
  gearCount: number | null;
  weightKg: number | null;
  electric: boolean;
  price: number | null;
};

const toFormValues = (bike?: BikeModel): BikeFormValues => ({
  brand: bike?.brand ?? "",
  model: bike?.model ?? "",
  description: bike?.description ?? "",
  category: bike?.category ?? "",
  frameMaterial: bike?.frameMaterial ?? "",
  frameSizeCm: bike?.frameSizeCm ?? null,
  wheelSizeInches: bike?.wheelSizeInches ?? null,
  gearCount: bike?.gearCount ?? null,
  weightKg: bike?.weightKg ?? null,
  electric: bike?.electric ?? false,
  price: bike ? bike.priceCents / 100 : null,
});

const toCreateBikeModel = (values: BikeFormValues): CreateBikeModel => ({
  brand: values.brand.trim(),
  model: values.model.trim(),
  description: values.description.trim(),
  category: values.category.trim(),
  frameMaterial: values.frameMaterial.trim(),
  // Required fields are validated by the form before this runs
  frameSizeCm: values.frameSizeCm ?? 0,
  wheelSizeInches: values.wheelSizeInches ?? 0,
  gearCount: values.gearCount ?? 0,
  weightKg: values.weightKg ?? 0,
  electric: values.electric,
  priceCents: Math.round((values.price ?? 0) * 100),
});

const requiredText = (label: string) => [
  { required: true, whitespace: true, message: `${label} is required` },
];

const requiredPositive = (label: string) => [
  { required: true, message: `${label} is required` },
  { type: "number" as const, min: 0.01, message: "Must be greater than 0" },
];

export const BikeFormModal = ({
  open,
  title,
  okText,
  bike,
  onSave,
  onClose,
}: BikeFormModalProps) => {
  const [form] = Form.useForm<BikeFormValues>();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const onFinish = (values: BikeFormValues) => {
    setIsSaving(true);
    return onSave(toCreateBikeModel(values))
      .catch((error) =>
        message.error(getErrorMessage(error, "Could not save the bike")),
      )
      .finally(() => setIsSaving(false));
  };

  return (
    <Modal
      open={open}
      title={title}
      okText={okText}
      onOk={() => form.submit()}
      onCancel={onClose}
      confirmLoading={isSaving}
      width={720}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={toFormValues(bike)}
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="brand" label="Brand" rules={requiredText("Brand")}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="model" label="Model" rules={requiredText("Model")}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="description"
              label="Description"
              rules={requiredText("Description")}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="category"
              label="Category"
              rules={requiredText("Category")}
            >
              <Input placeholder="VTT, route, ville…" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="frameMaterial"
              label="Frame material"
              rules={requiredText("Frame material")}
            >
              <Input placeholder="Aluminium, carbone…" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="frameSizeCm"
              label="Frame size (cm)"
              rules={requiredPositive("Frame size")}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="wheelSizeInches"
              label="Wheel size (in)"
              rules={requiredPositive("Wheel size")}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="gearCount"
              label="Gears"
              rules={[
                { required: true, message: "Gear count is required" },
                { type: "number", min: 1, message: "Must be at least 1" },
              ]}
            >
              <InputNumber min={1} precision={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="weightKg"
              label="Weight (kg)"
              rules={requiredPositive("Weight")}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="price"
              label="Price (€)"
              rules={[
                { required: true, message: "Price is required" },
                { type: "number", min: 0, message: "Must be 0 or more" },
              ]}
            >
              <InputNumber min={0} precision={2} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="electric" label="Electric" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
