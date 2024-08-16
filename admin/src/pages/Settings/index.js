// @ts-nocheck
import React, { memo } from 'react'
import { Box, Button, TextInput, CardTitle } from '@strapi/design-system'

const Settings = () => {
  return (
    <Box padding={5}>
      <Box>
        <Box>
          <Button variant="secondary">
            {'Save settings'}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default memo(Settings)