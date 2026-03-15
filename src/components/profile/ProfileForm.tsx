import { Card, Col, Flex, Form, Input, Row, Typography } from 'antd';
import React, { useState } from 'react';

import { BORDER_DEFAULT, RADIUS_MD, RADIUS_XL } from '../../design';
import ProfileFormButtons from './ProfileFormButtons';

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  username: string;
  description: string;
};

type ProfileFormProps = {
  initialValues: ProfileFormValues;
  isMutating: boolean;
  onSave: (values: ProfileFormValues) => void;
};

const ProfileForm: React.FC<ProfileFormProps> = ({
  initialValues,
  isMutating,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm<ProfileFormValues>();

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .profile-form-card .ant-card-head {
            padding: 0 16px !important;
            min-height: 48px !important;
          }
          .profile-form-card .ant-card-head-title {
            padding: 12px 0 !important;
          }
          .profile-form-card .ant-card-body {
            padding: 16px !important;
          }
          .profile-card-header {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            width: 100% !important;
            min-height: 24px !important;
          }
        }
      `}</style>
      <Card
        className="profile-form-card"
        style={{
          borderRadius: RADIUS_XL,
          border: `1px solid ${BORDER_DEFAULT}`,
          width: '100%',
        }}
        title={
          <div className="profile-card-header">
            <Flex align="center" style={{ flex: 1 }}>
              <Typography.Title level={5} style={{ margin: 0, lineHeight: 1 }}>
                Profile Details
              </Typography.Title>
            </Flex>
            <Flex align="center">
              <ProfileFormButtons
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                isMutating={isMutating}
                form={form}
              />
            </Flex>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={(values) => {
            onSave(values);
            setIsEditing(false);
          }}
          disabled={!isEditing}
        >
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="firstName"
                label={
                  <Typography.Text strong style={{ fontSize: 13 }}>
                    First Name
                  </Typography.Text>
                }
              >
                <Input
                  placeholder="Enter your first name"
                  size="large"
                  style={{ borderRadius: RADIUS_MD }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="lastName"
                label={
                  <Typography.Text strong style={{ fontSize: 13 }}>
                    Last Name
                  </Typography.Text>
                }
              >
                <Input
                  placeholder="Enter your last name"
                  size="large"
                  style={{ borderRadius: RADIUS_MD }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="username"
            label={
              <Typography.Text strong style={{ fontSize: 13 }}>
                Username
              </Typography.Text>
            }
          >
            <Input
              prefix={<Typography.Text type="secondary">@</Typography.Text>}
              placeholder="Choose a username"
              size="large"
              style={{ borderRadius: RADIUS_MD }}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={
              <Typography.Text strong style={{ fontSize: 13 }}>
                Bio
              </Typography.Text>
            }
          >
            <Input.TextArea
              placeholder="Tell us a bit about yourself..."
              rows={4}
              maxLength={300}
              showCount
              style={{ borderRadius: RADIUS_MD }}
            />
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default ProfileForm;
