import { Box, Divider, Flex, Radio, RadioGroup, SingleSelect, SingleSelectOption, TextInput, Typography } from '@strapi/design-system'
import React, { memo, useEffect, useState } from 'react'

const cronSettings = [
    {
        value: '*/1 * * * *',
        description: 'Every minute (only for testing)',
        label: 'Every minute',
        getNextRun: () => {
            const now = new Date();
            return new Date(now.getTime() + 60 * 1000);
        },
    },
    {
        value: '*/30 * * * *',
        description: 'Every 30 minutes',
        label: 'Every 30 minutes',
        getNextRun: () => {
            const now = new Date();
            return new Date(now.getTime() + (30 - now.getMinutes() % 30) * 60 * 1000);
        },
    },
    {
        value: '0 * * * *',
        description: 'Every hour at minute 0',
        label: 'Every hour',
        getNextRun: () => {
            const now = new Date();
            const nextRun = new Date(now.getTime() + (60 - now.getMinutes()) * 60 * 1000);
            nextRun.setMinutes(0, 0, 0);
            return nextRun;
        },
    },
    {
        value: '0 0 * * *',
        description: 'Every day at 00:00',
        label: 'Daily',
        getNextRun: () => {
            const now = new Date();
            return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
        },
    },
    {
        value: '0 0 * * 0',
        description: 'Every Sunday at 00:00',
        label: 'Weekly',
        getNextRun: () => {
            const now = new Date();
            return new Date(now.getFullYear(), now.getMonth(), now.getDate() + ((7 - now.getDay()) % 7 || 7), 0, 0, 0);
        },
    },
    {
        value: '0 0 1 * *',
        description: 'Every first day of the month at 00:00',
        label: 'Monthly',
        getNextRun: () => {
            const now = new Date();
            return new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
        },
    },
];

const CollectionForm = ({ collection, editMode, contentTypeOptions, onFieldChange }) => {
    const [nextRun, setNextRun] = useState('n/a');
    useEffect(() => {
        if (collection?.updateHook === 'cron' && collection?.updateCron) {
            const cronSetting = cronSettings.find((setting) => setting.value === collection.updateCron);
            if (cronSetting) {
                setNextRun(cronSetting.getNextRun().toLocaleString());
            }
        }
    }, [collection]);

    return (
        <Flex direction="column" alignItems="stretch" gap={6}>
            <Box>
                <TextInput
                    // @ts-ignore
                    required
                    onChange={(e) => onFieldChange({ name: 'indexId', value: e.target.value })}
                    label="Index ID"
                    placeholder="Orama Index ID"
                    name="indexId"
                    id="indexId"
                    hint="Your Orama Index ID. Go to Orama Dashboard > Indexes to find it."
                    value={collection?.indexId}
                />
            </Box>
            <Box>
                <SingleSelect
                    required
                    onChange={(value) => onFieldChange({ name: 'entity', value })}
                    label="Content Type"
                    placeholder="Content Type"
                    name="entity"
                    id="entity"
                    hint="Choose the Content Type you want to map with your index on Orama."
                    value={collection?.entity}
                >
                    {contentTypeOptions?.length > 0 && contentTypeOptions.map((ct, i) =>
                        <SingleSelectOption key={i} value={ct.value}>{ct.label}</SingleSelectOption>
                    )}
                </SingleSelect>
            </Box>
            <Divider />
            <Flex alignItems="flex-start" justifyContent="flex-start">
                <Box width="100%">
                    <Box marginBottom={2}>
                        <Typography variant="pi" fontWeight="bold">
                            Update Settings
                        </Typography>
                    </Box>
                    <RadioGroup
                        labelledBy="updateHook"
                        name="updateHook"
                        id="updateHook"
                        size="L"
                        onChange={(e) => onFieldChange({ name: 'updateHook', value: e.target.value })}
                        value={collection?.updateHook || 'live'}
                    >
                        <div style={{ marginBottom: '8px' }}><Radio value="live">Live update</Radio></div>
                        <div><Radio value="cron">Scheduled job</Radio></div>
                    </RadioGroup>
                </Box>
                <Box width="100%">
                    <Box>
                        <Box marginBottom={1}>
                            <Typography variant="pi" fontWeight="bold">Next run</Typography>
                        </Box>
                        {collection?.updateHook === 'cron' ? (
                            <Typography variant="omega">
                                {nextRun}
                            </Typography>
                        ) : (
                            <Typography variant="omega">On content update</Typography>
                        )}
                    </Box>
                    <Box paddingTop={4} style={{ opacity: collection?.updateHook === 'live' ? 0 : 1 }}>
                        <SingleSelect
                            required
                            onChange={(value) => onFieldChange({ name: 'updateCron', value })}
                            label="Deploy Frequency"
                            placeholder="Set deploy frequency"
                            name="updateCron"
                            id="updateCron"
                            hint="Set the frequency to update your index."
                            value={collection?.updateCron || '0 * * * *'}
                        >
                            {cronSettings.map((option, i) => (
                                <SingleSelectOption key={i} value={option.value}>{option.label}</SingleSelectOption>
                            ))}
                        </SingleSelect>
                    </Box>
                </Box>
            </Flex>
        </Flex>
    )
}

export default memo(CollectionForm)