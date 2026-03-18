import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Typography,
  Upload,
  message,
} from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import graphql from 'babel-plugin-relay/macro';
import React, { useCallback, useState } from 'react';
import {
  EntryPointComponent,
  PreloadedQuery,
  useMutation,
  usePreloadedQuery,
} from 'react-relay';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { RADIUS_LG } from '../../design';
import { supabase } from '../../lib/supabase';
import { Paths } from '../../views/paths';
import type { CreateListingPageQuery } from './__generated__/CreateListingPageQuery.graphql';
import InsertProductMutation from './graphql/InsertProductMutation.graphql';
import type { InsertProductMutationMutation } from './graphql/__generated__/InsertProductMutationMutation.graphql';

const CONDITIONS = [
  { label: 'New', value: 'New' },
  { label: 'Like New', value: 'Like_new' },
  { label: 'Good', value: 'Good' },
  { label: 'Used', value: 'Used' },
];

export const createListingCategoriesQuery = graphql`
  query CreateListingPageQuery {
    categoriesCollection {
      edges {
        node {
          id
          name
          nodeId
        }
      }
    }
  }
`;

type Props = {
  queries: {
    categoriesQuery: PreloadedQuery<CreateListingPageQuery>;
  };
};

type FormValues = {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  condition: string;
};

const CreateListingPage: EntryPointComponent<
  {
    categoriesQuery: CreateListingPageQuery;
  },
  Record<string, never>,
  Record<string, never>
> = (props: Props): React.ReactElement => {
  const navigate = useNavigate();
  const { communityId } = useParams<{ communityId: string }>();
  const { userId } = useAuth();
  const basePath = `/portal/${communityId}`;

  const data = usePreloadedQuery<CreateListingPageQuery>(
    createListingCategoriesQuery,
    props.queries.categoriesQuery
  );

  const categories =
    data.categoriesCollection?.edges?.map((e) => ({
      id: e.node.id,
      name: e.node.name,
    })) ?? [];

  const [form] = Form.useForm<FormValues>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const [commitMutation, isMutating] =
    useMutation<InsertProductMutationMutation>(InsertProductMutation);

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      if (!userId) {
        message.error('You must be logged in to create a listing.');
        return;
      }

      setUploading(true);

      try {
        let imagePath = '';

        // Upload image to Supabase storage if provided
        if (fileList.length > 0 && fileList[0].originFileObj) {
          const file = fileList[0].originFileObj;
          const fileExt = file.name.split('.').pop();
          const fileName = `${userId}/${crypto.randomUUID()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, file, {
              upsert: false,
              contentType: file.type,
            });

          if (uploadError) throw uploadError;
          imagePath = fileName;
        }

        commitMutation({
          variables: {
            objects: [
              {
                name: values.name,
                description: values.description,
                price: values.price,
                categoryId: values.categoryId || null,
                condition: values.condition as
                  | 'New'
                  | 'Like_new'
                  | 'Good'
                  | 'Used',
                image: imagePath,
                userId,
                isPublic: true,
              },
            ],
          },
          onCompleted: () => {
            message.success('Listing created successfully!');
            navigate(`${basePath}/${Paths.Market}`);
          },
          onError: (err) => {
            message.error(`Failed to create listing: ${err.message}`);
          },
        });
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        message.error(`Upload failed: ${errorMessage}`);
      } finally {
        setUploading(false);
      }
    },
    [userId, fileList, commitMutation, navigate, basePath]
  );

  return (
    <div>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(`${basePath}/${Paths.Market}`)}
        style={{ marginBottom: 16, paddingLeft: 0 }}
      >
        Back to Marketplace
      </Button>

      <Typography.Title level={3}>Create New Listing</Typography.Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
          <Card style={{ borderRadius: RADIUS_LG }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark="optional"
            >
              <Form.Item
                name="name"
                label="Title"
                rules={[
                  { required: true, message: 'Please enter a title' },
                  { max: 100, message: 'Title must be 100 characters or less' },
                ]}
              >
                <Input placeholder="What are you selling?" />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: 'Please enter a description' },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Describe your item, including any details buyers should know"
                />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={8}>
                  <Form.Item
                    name="price"
                    label="Price"
                    rules={[
                      { required: true, message: 'Please enter a price' },
                    ]}
                  >
                    <InputNumber
                      prefix="£"
                      min={0}
                      step={0.01}
                      precision={2}
                      style={{ width: '100%' }}
                      placeholder="0.00"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item name="categoryId" label="Category">
                    <Select
                      placeholder="Select category"
                      allowClear
                      options={categories.map((c) => ({
                        label: c.name,
                        value: c.id,
                      }))}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item
                    name="condition"
                    label="Condition"
                    rules={[
                      { required: true, message: 'Please select condition' },
                    ]}
                  >
                    <Select
                      placeholder="Select condition"
                      options={CONDITIONS}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Photo">
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  fileList={fileList}
                  onChange={({ fileList: newFileList }) =>
                    setFileList(newFileList)
                  }
                  beforeUpload={() => false}
                  accept="image/*"
                >
                  {fileList.length < 1 && (
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={uploading || isMutating}
                  style={{ width: '100%' }}
                >
                  {uploading ? 'Uploading image...' : 'Create Listing'}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="Listing Tips" style={{ borderRadius: RADIUS_LG }}>
            <Typography.Paragraph>
              <strong>Great photos sell.</strong> Use natural lighting and show
              the item from multiple angles.
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>Be honest about condition.</strong> Buyers appreciate
              transparency about wear and tear.
            </Typography.Paragraph>
            <Typography.Paragraph>
              <strong>Set a fair price.</strong> Check similar listings to price
              your item competitively.
            </Typography.Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CreateListingPage;
