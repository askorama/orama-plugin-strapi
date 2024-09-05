import React from 'react';
import {
  Box,
  MultiSelect,
  MultiSelectOption,
  Typography,
} from "@strapi/design-system"

const RelationsSelect = ({ onChange, relations = [] }) => (
  <>
    <Typography variant="pi" fontWeight="bold">
      Include relations
    </Typography>
    <Box style={{ marginTop: 3 }}>
      <MultiSelect
        placeholder="Select relations.."
        disabled={relations.length === 0}
        onChange={onChange}
      >
        {relations.map((relation, i) => (
          <MultiSelectOption key={relation.value + i} value={relation.value}>
            {relation.value}
          </MultiSelectOption>
        ))}
      </MultiSelect>
    </Box>
  </>
)

export default RelationsSelect;
