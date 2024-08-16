// @ts-nocheck
import React, { memo } from 'react'
import {
  BaseCheckbox,
  Box,
  Button,
  Flex,
  Td,
  Tr,
  Typography,
} from '@strapi/design-system'

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
              deleteCollection({ contentType: entry.contentType })
            else addCollection({ contentType: entry.contentType })
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
        <Typography textColor="neutral800">
          {entry.status === 'deployed' ? 'Online' : 'Draft'}
        </Typography>
      </Td>
      {/* Index ID */}
      <Td>
        <Typography textColor="neutral800">{entry.indexId}</Typography>
      </Td>
      {/* Documents */}
      <Td>
        <Typography textColor="neutral800">
          {entry.documents_count || 0}
        </Typography>
      </Td>
      <Td>
        <Flex>
          <Box paddingLeft={1}>
            {entry.indexed && (
              <Button
                onClick={() =>
                  updateCollection({ contentType: entry.contentType })
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
