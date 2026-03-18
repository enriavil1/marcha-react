import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Typography, message } from 'antd';
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
import CreateListingForm from './CreateListingForm';
import type { ListingFormValues } from './CreateListingForm';
import ListingTips from './ListingTips';
import type { CreateListingPageQuery } from './__generated__/CreateListingPageQuery.graphql';
import InsertProductMutation from './graphql/InsertProductMutation.graphql';
import type { InsertProductMutationMutation } from './graphql/__generated__/InsertProductMutationMutation.graphql';

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

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const [commitMutation, isMutating] =
    useMutation<InsertProductMutationMutation>(InsertProductMutation);

  const handleSubmit = useCallback(
    async (values: ListingFormValues) => {
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

      <Typography.Title level={3}>Create a Listing</Typography.Title>

      <Row gutter={24}>
        <Col xs={24} md={16}>
          <Card style={{ borderRadius: RADIUS_LG }}>
            <CreateListingForm
              categories={categories}
              fileList={fileList}
              onFileListChange={setFileList}
              onSubmit={handleSubmit}
              submitting={isMutating}
              uploading={uploading}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <ListingTips />
        </Col>
      </Row>
    </div>
  );
};

export default CreateListingPage;
