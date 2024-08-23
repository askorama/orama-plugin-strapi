import React, { memo } from 'react'
import { DateTime } from 'luxon';
import { Button, EmptyStateLayout, Flex, LinkButton, Status, Table, Tbody, Td, Th, Thead, Tr, Typography, VisuallyHidden } from '@strapi/design-system'
import { ExternalLink, Plus, Refresh } from '@strapi/icons'

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

const CollectionsTable = ({ collections, onEditAction, onDeployAction, onCreateAction }) => {

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
      <Table colCount={6} footer={null}>
        <Thead>
          <Tr>
            <Th action={null}>
              <Typography variant="sigma">
                CONTENT TYPE
              </Typography>
            </Th>
            <Th action={null}>
              <Typography variant="sigma">
                ORAMA INDEX ID
              </Typography>
            </Th>
            <Th action={null}>
              <Typography variant="sigma">
                STATUS
              </Typography>
            </Th>
            <Th action={null}>
              <Typography variant="sigma">
                UPDATE HOOK
              </Typography>
            </Th>
            <Th action={null}>
              <Typography variant="sigma">
                LAST DEPLOYMENT
              </Typography>
            </Th>
            <Th action={null}>
              <Typography variant="sigma">
                Actions
              </Typography>
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
                    style={{ whiteSpace: 'nowrap', textDecoration: 'none' }}
                    endIcon={<ExternalLink width={10} />}
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
                <Flex gap={2}>
                  {onEditAction && (<Button onClick={() => onEditAction(entry)} size="S" variant="secondary">
                    Edit
                  </Button>)}
                  {onDeployAction && (<Button
                    onClick={() => onDeployAction(entry)}
                    size="S"
                    variant="success-light"
                    startIcon={<Refresh />}
                    loading={entry.status === 'updating'}
                  >
                    Deploy
                  </Button>)}
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {collections.length === 0 && (
        <EmptyStateLayout
          icon={null}
          content="You don't have any collection yet."
          action={<Button
            variant="secondary"
            startIcon={<Plus />}
            onClick={onCreateAction}>Configure your first Orama index</Button>} />
      )}

    </>
  )
}

export default memo(CollectionsTable)
