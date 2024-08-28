import { Box, Divider, Flex, Radio, RadioGroup, SingleSelect, SingleSelectOption, Switch, TextInput, Typography } from '@strapi/design-system'
import React, { memo, useEffect, useState } from 'react'
import cronSettings from '../../utils/cronSettings';

const CollectionForm = ({ collection, editMode, contentTypeOptions, onFieldChange }) => {
    const [nextRun, setNextRun] = useState('on content update');
    const [cronUpdates, setCronUpdates] = useState(collection?.updateHook === 'cron');

    useEffect(() => {
        if (collection?.updateHook === 'cron' && collection?.updateCron) {
            const cronSetting = cronSettings.find((setting) => setting.value === collection.updateCron);
            if (cronSetting) {
                setCronUpdates(true);
                setNextRun(cronSetting.getNextRun().toLocaleString());
            }
        } else {
            setCronUpdates(false);
            setNextRun('on content update');
        }
    }, [collection?.updateHook, collection?.updateCron]);

    return (
        <Flex direction="column" alignItems="stretch" gap={6}>
            <Box>
                <TextInput
                    // @ts-ignore
                    required
                    onChange={(e) => onFieldChange({ name: 'indexId', value: e.target.value })}
                    label="Index ID"
                    placeholder="Orama Cloud Index ID"
                    name="indexId"
                    id="indexId"
                    hint="Your Orama Cloud Index ID. Go to Orama Dashboard > Indexes to find it."
                    value={collection?.indexId}
                />
            </Box>
            <Flex alignItems="flex-start" gap={4}>
                <Box width="100%">
                    <SingleSelect
                        required
                        onChange={(value) => onFieldChange({ name: 'entity', value })}
                        label="Content Type"
                        placeholder="Content Type"
                        name="entity"
                        id="entity"
                        hint="Choose the Content Type you want to map with your index on Orama Cloud."
                        value={collection?.entity}
                    >
                        {contentTypeOptions?.length > 0 && contentTypeOptions.map((ct, i) =>
                            <SingleSelectOption key={i} value={ct.value}>{ct.label}</SingleSelectOption>
                        )}
                    </SingleSelect>
                </Box>
                <Box width="100%">
                    <TextInput
                        // @ts-ignore
                        onChange={(e) => onFieldChange({ name: 'includeRelations', value: e.target.value })}
                        label="Include relations"
                        placeholder="No relations"
                        name="includeRelations"
                        id="includeRelations"
                        hint="Comma separated list of relations to include. (optional)"
                        value={collection?.includeRelations}
                    />
                </Box>
            </Flex>
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
                        <Typography variant="omega">
                            {nextRun}
                        </Typography>
                    </Box>
                    <Box paddingTop={4} style={{ opacity: cronUpdates ? 1 : 0 }}>
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
