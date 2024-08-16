// @ts-nocheck
/*
 *
 * HomePage
 *
 */

import React from 'react';
import {
  Box,
  Tab,
  TabGroup,
  TabPanel,
  TabPanels,
  Tabs
} from '@strapi/design-system';
// @ts-ignore
import { Layout, BaseHeaderLayout, ContentLayout } from '@strapi/design-system/Layout';

// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import Settings from '../Settings';
import Collections from '../Collections';

const HomePage = () => {
  return (
    <Layout>
      <BaseHeaderLayout title="Orama Plugin" subtitle="Index Strapi contents on Orama Cloud." as="h2" />
      <ContentLayout>
        <Box padding={8} margin={10} background="neutral">
          <TabGroup label="Some stuff for the label" id="tabs">
            <Tabs>
              <Tab>Collections</Tab>
              <Tab>Settings</Tab>
            </Tabs>
            <TabPanels>
              <TabPanel>
                <Box color="neutral800" padding={4} background="neutral0">
                  <Collections />
                </Box>
              </TabPanel>
              <TabPanel>
                <Box color="neutral800" padding={4} background="neutral0">
                  <Settings />
                </Box>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </Box>
      </ContentLayout>
    </Layout>
  );
};

export default HomePage;
