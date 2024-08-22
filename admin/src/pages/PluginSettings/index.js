// @ts-nocheck
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  HeaderLayout,
  LinkButton,
  Loader,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalLayout,
  Tab,
  TabGroup,
  TabPanel,
  TabPanels,
  Tabs,
  Typography
} from '@strapi/design-system';
import { Layout, BaseHeaderLayout, ContentLayout } from '@strapi/design-system/Layout';
import CollectionsTable from '../../components/CollectionsTable';
import SettingsManager from '../../components/SettingsManager';
import pluginId from '../../pluginId';
import { ArrowRight, ExternalLink, Plus } from '@strapi/icons';
import { useFetchClient, useNotification } from '@strapi/helper-plugin';
import CollectionForm from '../../components/CollectionForm';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [contentTypes, setContentTypes] = useState([]);
  const [collections, setCollections] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCollection, setCurrentCollection] = useState(null);
  const [formEditMode, setFormEditMode] = useState(false);
  const { get, post, put } = useFetchClient();
  const toggleNotification = useNotification();

  useEffect(() => {
    get(`/${pluginId}/collections`)
      .then(response => setCollections(response.data))
      .then(() => setIsLoading(false))
      .catch(() => {
        toggleNotification({
          type: 'warning',
          message: 'Failed to load collections.',
        });
      });
    get(`/${pluginId}/content-types`)
      .then(response => setContentTypes(response.data))
      .then(() => setIsLoading(false))
      .catch(() => {
        toggleNotification({
          type: 'warning',
          message: 'Failed to load content types.',
        });
      });
  }, [get]);

  const handleCreateClick = (collection) => {
    setCurrentCollection({});
    setFormEditMode(false);
    setIsModalVisible(true);
  };

  const handleEditClick = (collection) => {
    setCurrentCollection(collection);
    setFormEditMode(true);
    setIsModalVisible(true);
  };

  const handleChange = ({ name, value }) => {
    setCurrentCollection({ ...currentCollection, [name]: value });
  };

  const handleCreate = async () => {
    setIsSaving(true);
    try {
      const newCollection = await post(`/${pluginId}/collections`, currentCollection);
      toggleNotification({
        type: 'success',
        message: 'Collection created successfully.',
      });
      setCollections((prevCollections) =>
        [...prevCollections, newCollection]
      );
      setIsModalVisible(false);
    } catch (err) {
      console.error(err);
      toggleNotification({
        type: 'warning',
        message: 'Failed to create collection.',
      });
    } finally {
      setIsSaving(false);
    }
  }

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      await put(`/${pluginId}/collections/${currentCollection.id}`, currentCollection);
      toggleNotification({
        type: 'success',
        message: 'Collection updated successfully.',
      });
      setCollections((prevCollections) =>
        prevCollections.map((col) =>
          col.id === currentCollection.id ? currentCollection : col
        )
      );
      setIsModalVisible(false);
    } catch (err) {
      console.error(err);
      toggleNotification({
        type: 'warning',
        message: 'Failed to update collection.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <HeaderLayout
        title="Orama"
        subtitle="Manage collections to sync content types with your indexes on Orama."
        as="h2"
        primaryAction={
          <Flex gap={2}>{
            isLoading ? null : (
              <>
                <Button startIcon={<Plus />} size="L" onClick={handleCreateClick}>Add collection</Button>
                <LinkButton
                  href="https://cloud.orama.com/indexes"
                  isExternal
                  endIcon={<ExternalLink />}
                  size="L"
                  variant="secondary"
                >View indexes</LinkButton>
              </>
            )
          }</Flex>
        }
      />
      <ContentLayout>
        <Box background="neutral">
          {isLoading ? (
            <Flex justifyContent="center">
              <Loader>Loading content...</Loader>
            </Flex>
          ) :
            <>
              <CollectionsTable
                collections={collections}
                onEditRow={handleEditClick}
                onCreateRecord={handleCreateClick}
              />
              {isModalVisible && (
                <ModalLayout
                  onClose={() => setIsModalVisible(false)}
                  labelledBy="edit-collection-modal"
                >
                  <ModalHeader>
                    <Typography>Edit Collection</Typography>
                  </ModalHeader>
                  <ModalBody>
                    <CollectionForm
                      collection={currentCollection}
                      editMode={formEditMode}
                      contentTypeOptions={contentTypes}
                      onFieldChange={handleChange}
                    />
                  </ModalBody>
                  <ModalFooter
                    startActions={
                      <Button onClick={() => setIsModalVisible(false)} variant="tertiary">
                        Cancel
                      </Button>
                    }
                    endActions={formEditMode ? (
                      <Button onClick={handleUpdate} loading={isSaving}>Update</Button>
                    ) : (
                      <Button onClick={handleCreate} loading={isSaving}>Create</Button>
                    )}
                  />
                </ModalLayout>
              )}
            </>
          }
        </Box>
      </ContentLayout>
    </Layout>
  );
};

export default HomePage;
