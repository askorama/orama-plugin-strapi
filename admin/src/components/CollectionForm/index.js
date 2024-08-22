import { Box, Flex, Radio, RadioGroup, SingleSelect, SingleSelectOption, TextInput } from '@strapi/design-system'
import React, { memo } from 'react'

const CollectionForm = ({ collection, editMode, contentTypeOptions, onFieldChange }) => {
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
                    hint="Map a Content Type with your index on Orama."
                    value={collection?.entity}
                >
                    {contentTypeOptions?.length > 0 && contentTypeOptions.map((ct, i) =>
                        <SingleSelectOption key={i} value={ct.value}>{ct.label}</SingleSelectOption>
                    )}
                </SingleSelect>
            </Box>
            <Box paddingTop={4} paddingBottom={4}>
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

                {collection?.updateHook === 'cron' &&
                    <Box paddingTop={4}>
                        <SingleSelect
                            required
                            onChange={(value) => onFieldChange({ name: 'updateCron', value })}
                            label="Deploy Frequency"
                            placeholder="Set deploy frequency"
                            name="updateCron"
                            id="updateCron"
                            hint="Set the frequency to update your index."
                            value={collection?.updateCron || '*/30 * * * *'}
                        >
                            <SingleSelectOption key="0" value="*/1 * * * *">Every minute (only for testing)</SingleSelectOption>
                            <SingleSelectOption key="1" value="*/30 * * * *">Every 30 minutes</SingleSelectOption>
                            <SingleSelectOption key="2" value="0 * * * *">Every hour</SingleSelectOption>
                            <SingleSelectOption key="3" value="0 0 * * *">Daily</SingleSelectOption>
                            <SingleSelectOption key="4" value="0 0 * * 0">Weekly</SingleSelectOption>
                            <SingleSelectOption key="5" value="0 0 1 * *">Monthly</SingleSelectOption>
                        </SingleSelect>
                    </Box>
                }
            </Box>
        </Flex>
    )
}

export default memo(CollectionForm)