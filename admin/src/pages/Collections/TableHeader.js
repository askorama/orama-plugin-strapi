// @ts-nocheck
import React, { memo } from 'react'
import {
  Th,
  Thead,
  Tr,
  Typography,
  VisuallyHidden,
} from '@strapi/design-system'

const CollectionTableHeader = () => {
  return (
    <Thead>
      <Tr>
        <Th>{' '}</Th>
        <Th>
          <Typography variant="sigma">
            NAME
          </Typography>
        </Th>
        <Th>
          <Typography variant="sigma">
            STATUS
          </Typography>
        </Th>
        <Th>
          <Typography variant="sigma">
            INDEX
          </Typography>
        </Th>
        <Th>
          <Typography variant="sigma">
            DOCUMENTS
          </Typography>
        </Th>
        <Th>
          <VisuallyHidden>Actions</VisuallyHidden>
        </Th>
      </Tr>
    </Thead>
  )
}

export default memo(CollectionTableHeader)
