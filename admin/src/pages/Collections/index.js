// @ts-nocheck
import React, { memo, useEffect, useState } from 'react'
import { Box, Button, Table, Tbody } from '@strapi/design-system'
import { useFetchClient } from '@strapi/helper-plugin'
import TableHeader from './TableHeader'
import TableColumns from './TableColumns'
import pluginId from '../../pluginId'

const Collections = () => {
  const [collections, setCollections] = useState([])
  const { get } = useFetchClient();
  
  useEffect(() => {
    const fetchCollections = async () => {
      const { data, error } = await get(`/${pluginId}/content-types`, {
        method: 'GET',
      })
      
      if (data) {
        setCollections(data)
      }
    }
    fetchCollections()
  }, [])

  return (
    <Box background="neutral100" padding={5}>
      <Table colCount={10} rowCount={6}>
        <TableHeader />
        <Tbody>
          {collections.map((collection, i) => (
            <TableColumns
              key={i}
              entry={collection}
              // deleteCollection={deleteCollection}
              // addCollection={addCollection}
              // updateCollection={updateCollection}
            />
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}

export default memo(Collections)
