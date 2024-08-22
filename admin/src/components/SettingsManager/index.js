import React, { memo, useEffect, useState } from 'react'
import { Box, Button, Divider, Flex, SingleSelect, SingleSelectOption, Switch, Typography } from '@strapi/design-system'
import { useFetchClient } from '@strapi/helper-plugin';

const Settings = () => {
  const [cronExpression, setCronExpression] = useState('0 0 * * *');
  const [autoUpdatesEnabled, setAutoUpdatesEnabled] = useState(false);
  const [cronEnabled, setCronEnabled] = useState(false);
  const { get, post } = useFetchClient();

  useEffect(() => {
    /*get('/orama/settings').then((response) => {
      setCronExpression(response.data.cronExpression || '');
      setCronEnabled(response.data.cronEnabled || false);
    });*/
  }, [get]);

  const handleAutoUpdatesSwitch = () => {
    setAutoUpdatesEnabled((prev) => !prev);
  };

  const handleCronUpdatesSwitch = () => {
    setCronEnabled((prev) => !prev);
  };

  const handleSave = async () => {
    await post('/orama/settings', { cronExpression, cronEnabled, autoUpdatesEnabled });
  };

  return (
    <Box padding={2}>
      <Flex gap={5} direction="column" alignItems="flex-start">
        <Box width="100%">
          <Flex gap={8} justifyContent="space-between">
            <Flex gap={1} direction="column" alignItems="flex-start">
              <Typography variant="delta">Live updates</Typography>
              <Typography textColor="neutral600" variant="omega">Trigger a new deployment when an entry in your collections is created, updated or deleted.</Typography>
            </Flex>
            <Switch
              label="Enable Auto Updates"
              selected={autoUpdatesEnabled}
              onChange={handleAutoUpdatesSwitch}
            >
              {autoUpdatesEnabled ? 'Enabled' : 'Disabled'}
            </Switch>
          </Flex>
        </Box>
        <Divider />
        <Box width="100%">
          <Flex gap={8} justifyContent="space-between">
            <Flex gap={1} direction="column" alignItems="flex-start">
              <Typography variant="delta">Scheduled updates</Typography>
              <Typography textColor="neutral600" variant="omega">Schedule a custom frequency to trigger new deployments and update your indexes.</Typography>
            </Flex>
            <Switch
              label="Enable Cron Job"
              selected={cronEnabled}
              onChange={handleCronUpdatesSwitch}
            >
              {cronEnabled ? 'Enabled' : 'Disabled'}
            </Switch>
          </Flex>
        </Box>
        <Box width="100%">
          <SingleSelect
            label="Frequency"
            placeholder="Select a deploy frequency"
            value={cronExpression}
            disabled={!cronEnabled}
            onChange={setCronExpression}
          >
            <SingleSelectOption value="0 * * * *">Hourly</SingleSelectOption>
            <SingleSelectOption value="0 0 * * *">Daily</SingleSelectOption>
            <SingleSelectOption value="0 0 * * 0">Weekly</SingleSelectOption>
            <SingleSelectOption value="0 0 1 * *">Monthly</SingleSelectOption>
          </SingleSelect>
        </Box>
        <Box marginTop={5}>
          <Button onClick={handleSave} variant="primary">
            {'Save settings'}
          </Button>
        </Box>
      </Flex>
    </Box>
  )
}

export default memo(Settings)