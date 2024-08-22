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
        </Flex>
    )
}

export default memo(CollectionForm)