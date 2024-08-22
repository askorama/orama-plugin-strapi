import { Box, Flex, Radio, RadioGroup, SingleSelect, SingleSelectOption, TextInput } from '@strapi/design-system'
import React, { memo, useEffect, useState } from 'react'

const CollectionForm = ({ collection, editMode, contentTypeOptions, onFieldChange }) => {
    return (
        <Flex direction="column" alignItems="stretch" gap={2}>
            <TextInput
                // @ts-ignore
                required
                onChange={(e) => onFieldChange(e.target)}
                label="Collection name"
                placeholder="Collection name"
                name="name"
                id="name"
                hint=""
                value={collection?.name}
            />
            <SingleSelect
                required
                onChange={(value) => onFieldChange({ name: 'entity', value })}
                label="Content Type"
                placeholder="Content Type"
                name="entity"
                id="entity"
                hint="Map a Content Type with this index"
                value={collection?.entity}
            >
                {contentTypeOptions?.length > 0 && contentTypeOptions.map((ct, i) =>
                    <SingleSelectOption key={i} value={ct.value}>{ct.label}</SingleSelectOption>
                )}
            </SingleSelect>
            <RadioGroup
                labelledBy="updateHook"
                name="updateHook"
                id="updateHook"
                onChange={(e) => onFieldChange({ name: 'updateHook', value: e.target.value })}
                value={collection?.updateHook}
            >
                <Radio value="live">Live update</Radio>
                <Radio value="cron">Scheduled job</Radio>
            </RadioGroup>
            {collection?.updateHook === 'cron' && <SingleSelect
                required
                onChange={(value) => onFieldChange({ name: 'updateCron', value })}
                label="Deploy Frequency"
                placeholder="Set deploy frequency"
                name="updateCron"
                id="updateCron"
                hint="Set the frequency to update this collection"
                value={collection?.updateCron || '*/30 * * * *'}
            >
                <SingleSelectOption key="1" value="*/1 * * * *">Every minute (only for testing)</SingleSelectOption>
                <SingleSelectOption key="1" value="*/30 * * * *">Every 30 minutes</SingleSelectOption>
                <SingleSelectOption key="2" value="0 * * * *">Every hour</SingleSelectOption>
                <SingleSelectOption key="3" value="0 0 * * *">Daily</SingleSelectOption>
                <SingleSelectOption key="4" value="0 0 * * 0">Weekly</SingleSelectOption>
                <SingleSelectOption key="5" value="0 0 1 * *">Monthly</SingleSelectOption>
            </SingleSelect>}
        </Flex>
    )
}

export default memo(CollectionForm)