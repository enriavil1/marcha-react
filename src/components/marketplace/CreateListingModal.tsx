// src/components/marketplace/CreateListingModal.tsx
import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
  message,
} from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import React, { useState } from 'react';

import type {
  Category,
  CreateListingFormValues,
  ProductCondition,
} from './types';
import { CONDITION_LABELS } from './types';

interface CreateListingModalProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onSubmit: (
    values: CreateListingFormValues,
    imageFile: File
  ) => Promise<boolean>;
}

const CreateListingModal: React.FC<CreateListingModalProps> = ({
  open,
  onClose,
  categories,
  onSubmit,
}) => {
  const [form] = Form.useForm<CreateListingFormValues>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleFinish = async (values: CreateListingFormValues) => {
    if (fileList.length === 0) {
      message.error('Please upload at least one image');
      return;
    }

    const imageFile = fileList[0].originFileObj as File;
    if (!imageFile) {
      message.error('Invalid image file');
      return;
    }

    setSubmitting(true);
    try {
      const success = await onSubmit(values, imageFile);
      if (success) {
        message.success('Listing created successfully!');
        form.resetFields();
        setFileList([]);
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onClose();
  };

  return (
    <Modal
      title="Create New Listing"
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={560}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="name"
          label="Title"
          rules={[
            { required: true, message: 'Please enter a title' },
            { max: 100, message: 'Title must be 100 characters or less' },
          ]}
        >
          <Input placeholder="What are you selling?" maxLength={100} />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: 'Please enter a description' },
            {
              max: 1000,
              message: 'Description must be 1000 characters or less',
            },
          ]}
        >
          <Input.TextArea
            placeholder="Describe your item — condition, size, reason for selling..."
            rows={4}
            maxLength={1000}
            showCount
          />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price (£)"
          rules={[{ required: true, message: 'Please enter a price' }]}
        >
          <InputNumber
            min={0}
            step={0.01}
            precision={2}
            placeholder="0.00"
            style={{ width: '100%' }}
            prefix="£"
          />
        </Form.Item>

        <Form.Item
          name="category_id"
          label="Category"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select
            placeholder="Select a category"
            options={categories.map((cat) => ({
              label: cat.name,
              value: cat.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="condition"
          label="Condition"
          rules={[{ required: true, message: 'Please select the condition' }]}
        >
          <Select
            placeholder="Select condition"
            options={(
              Object.entries(CONDITION_LABELS) as [ProductCondition, string][]
            ).map(([value, label]) => ({
              label,
              value,
            }))}
          />
        </Form.Item>

        <Form.Item label="Photo" required>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={({ fileList: newFileList }) => setFileList(newFileList)}
            beforeUpload={() => false}
            maxCount={1}
            accept="image/*"
          >
            {fileList.length < 1 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Post Listing
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateListingModal;
