import React, {useRef} from "react";
import { Tab, Tabs, TabGroup, TabPanel, TabPanels, Divider, Box, Flex } from '@strapi/design-system';

export const TabsContainer = ({ tabs }) => {
  const tabGroupRef = useRef();

  return (
    <TabGroup
      label="todo"
      id="tabs"
      variant="simple"
      style={{ marginTop: -24 }}
      ref={tabGroupRef}
    >
      <Flex justifyContent="space-between">
        <Tabs>
          {tabs.map((tab) => (
            <Tab key={tab.id}>
              {tab.title}
            </Tab>
          ))}
        </Tabs>
      </Flex>

      <Divider />

      <Box paddingTop={6}>
        <TabPanels>
          {tabs.map((tab) => (
            <TabPanel key={tab.id}>
              {tab.content}
            </TabPanel>
          ))}
        </TabPanels>
      </Box>
    </TabGroup>
  );
};
