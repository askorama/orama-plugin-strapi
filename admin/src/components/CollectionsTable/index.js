// @ts-nocheck
import React, { memo, useEffect, useState } from 'react'
import { DateTime } from 'luxon';
import { BaseCheckbox, Box, Button, EmptyStateLayout, FieldLabel, Flex, Icon, LinkButton, ModalBody, ModalFooter, ModalHeader, ModalLayout, SingleSelect, SingleSelectOption, Status, Table, Tbody, Td, TextInput, Th, Thead, Tr, Typography, VisuallyHidden } from '@strapi/design-system'
import { useFetchClient, useNotification } from '@strapi/helper-plugin'
import pluginId from '../../pluginId'
import { CollectionType, Cross, Database, EmptyDocuments, ExternalLink, Plus } from '@strapi/icons'

const status = {
  updated: {
    label: 'Updated',
    color: 'success',
  },
  outdated: {
    label: 'Outdated',
    color: 'danger',
  },
  updating: {
    label: 'Updating',
    color: 'primary',
  },
}

const hook = {
  live: {
    label: 'Live updates'
  },
  cron: {
    label: 'Scheduled job'
  }
}

const CollectionsTable = ({ collections, onEditRow, onCreateRecord }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCollection, setCurrentCollection] = useState(null);
  const [formEditMode, setFormEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { get, post, put } = useFetchClient();
  const toggleNotification = useNotification();


  const formatLastDeployedAt = (date) => {
    if (!date)
      return null;

    const dateTime = DateTime.fromISO(date);
    if (DateTime.now().diff(dateTime, 'hours').hours <= 48) {
      return dateTime.toRelative();
    } else {
      return dateTime.toLocaleString(DateTime.DATETIME_MED);
    }
  };

  return (
    <>
      <Table colCount={10} rowCount={6}>
        <Thead>
          <Tr>
            <Th>
              <Typography variant="sigma">
                CONTENT TYPE
              </Typography>
            </Th>
            <Th>
              <Typography variant="sigma">
                ORAMA INDEX ID
              </Typography>
            </Th>
            <Th>
              <Typography variant="sigma">
                STATUS
              </Typography>
            </Th>
            <Th>
              <Typography variant="sigma">
                HOOK
              </Typography>
            </Th>
            <Th>
              <Typography variant="sigma">
                LAST UPDATED
              </Typography>
            </Th>
            <Th>
              <VisuallyHidden>Actions</VisuallyHidden>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {collections.map((entry, i) => (
            <Tr key={entry.id}>
              {/* Content Type */}
              <Td>
                <Flex>
                  <Status variant="secondary" size="S" showBullet={false}>
                    <Typography>{entry.entity}</Typography>
                  </Status>
                </Flex>
              </Td>
              {/* Index ID */}
              <Td>
                {entry.indexId &&
                  <LinkButton
                    href={`https://cloud.orama.com/indexes/view/${entry.indexId}`}
                    isExternal
                    size="S"
                    variant="secondary"
                    endIcon={<ExternalLink />}
                  >
                    {entry.indexId}
                  </LinkButton>}
              </Td>
              {/* Status */}
              <Td>
                {status?.[entry.status] ? (
                  <Flex>
                    <Status variant={status[entry.status].color} size="S" showBullet={true}>
                      <Typography textColor={status[entry.status].color + "800"}>
                        {status[entry.status].label}
                      </Typography>
                    </Status>
                  </Flex>
                ) : null}
              </Td>
              {/* Update Hook */}
              <Td>
                {hook?.[entry.updateHook] ? (
                  <Typography textColor="neutral800">
                    {hook[entry.updateHook].label}
                  </Typography>
                ) : null}
              </Td>
              {/* Last Updated / Deployed At */}
              <Td>
                <Typography textColor="neutral800">
                  {formatLastDeployedAt(entry.deployedAt)}
                </Typography>
              </Td>
              {/* Actions */}
              <Td>
                <Flex>
                  <Box paddingLeft={1}>
                    {onEditRow && (<Button onClick={() => onEditRow(entry)} size="S" variant="secondary">
                      Edit
                    </Button>)}
                  </Box>
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {collections.length === 0 && (
        <EmptyStateLayout
          content="You don't have any collection yet."
          action={<Button
            variant="secondary"
            startIcon={<Plus />}
            onClick={onCreateRecord}>Create your first collection</Button>} />
      )}

    </>
  )
}

export default memo(CollectionsTable)
