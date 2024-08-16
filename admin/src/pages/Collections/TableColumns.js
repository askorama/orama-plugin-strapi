// @ts-nocheck
import React, { memo } from 'react'
import {
  BaseCheckbox,
  Box,
  Button,
  Flex,
  Tag,
  Td,
  Tr,
  Typography,
} from '@strapi/design-system'
import { Information } from '@strapi/icons'

const TableColumns = ({
  entry,
  deleteCollection,
  addCollection,
  updateCollection,
}) => {
  
  return (
    <Tr key={entry.contentType}>
      {/* Checkbox */}
      <Td>
        <BaseCheckbox
          aria-label={`Select ${entry.collection}`}
          onValueChange={() => {
            if (entry.indexed)
              console.log('Delete collection', { contentType: entry.contentType })
            else {
              console.log('Add collection', { contentType: entry.contentType })
            }
          }}
          value={entry.indexed}
        />
      </Td>
      {/* Collection Name */}
      <Td>
        <Typography textColor="neutral800">{entry.collection}</Typography>
      </Td>
      {/* Status */}
      <Td>
        <Tag icon={<Information aria-hidden />} disabled>{entry.status}</Tag>
      </Td>
      {/* Index ID */}
      <Td>
        <Typography textColor="neutral800">
          {entry.indexId && 
            <a href={`https://cloud.orama.com/indexes/view/${entry.indexId}`} target='_blank'>{entry.indexId}</a>}
        </Typography>
      </Td>
      {/* Documents */}
      <Td>
        <Typography textColor="neutral800">
          {entry.documents_count}
        </Typography>
      </Td>
      <Td>
        <Flex>
          <Box paddingLeft={1}>
            {entry.indexed && (
              <Button
                onClick={() =>
                  console.log('Update collection', entry.contentType)
                }
                size="S"
                variant="secondary"
              >
                Update
              </Button>
            )}
          </Box>
        </Flex>
      </Td>
    </Tr>
  )
}

export default memo(TableColumns)
