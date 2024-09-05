import React from "react"
import { Box, Checkbox, Flex, Switch, Typography } from "@strapi/design-system"

const generateSelectableFieldsFromSchema = ({ schema, relations }) => {
  console.log("===DEBUG===", schema)
  const fields = Object.entries(schema).filter(([fieldKey, fieldValue]) => {
    console.log("===DEBUG===", fieldKey, fieldValue)

    return true
  })

  return fields
}

const SchemaMapper = ({ schema = {}, relations = [], onSchemaMappingChange }) => {
  const [checkedFields, setCheckedFields] = React.useState([])
  const [searchableFields, setSearchableFields] = React.useState([])

  const schemaFields = generateSelectableFieldsFromSchema({ schema, relations })

  React.useEffect(() => {
    onSchemaMappingChange(checkedFields)
  }, [checkedFields])

  const isChecked = (field) => {
    return checkedFields.includes(field)
  }

  const handleCheck = (field) => {
    if (checkedFields.includes(field)) {
      setCheckedFields(checkedFields.filter((f) => f !== field))
      setSearchableFields(searchableFields.filter((f) => f !== field))
    } else {
      setCheckedFields([...checkedFields, field])
    }
  }

  const isSearchableSelected = (field) => {
    return searchableFields.includes(field)
  }

  const handleSearchable = (field) => {
    if (!isChecked(field)) {
      return
    }

    if (searchableFields.includes(field)) {
      setSearchableFields(searchableFields.filter((f) => f !== field))
    } else {
      setSearchableFields([...searchableFields, field])
    }
  }

  return (
    <></>
    /*<Box marginBottom={2}>
      <Typography variant="beta" fontWeight="bold" >
        Fields Mapping
      </Typography>
      <Flex style={{ marginBottom: 16, marginTop: 4 }}>
        <Typography variant="gamma" color="grey-600">
          Select the fields you want to include in your Orama Cloud index document.
        </Typography>
      </Flex>
      <Flex justifyContent="space-between" style={{ marginBottom: 8 }}>
        <Flex>
          <Typography variant="pi" color="grey-600">
            Fields
          </Typography>
        </Flex>
        <Flex>
          <Typography variant="pi" color="grey-600">
            searchable
          </Typography>
        </Flex>
      </Flex>
      {schemaFields.length > 0 && schemaFields.map((field, i) => (
        <Flex
          key={i}
          gap={10}
          style={{ marginBottom: i === schemaFields.length - 1 ? 0 : 8 }}
          alignItems="center"
          justifyContent="space-between"
        >
          <Flex>
            <Checkbox checked={isChecked(field)} onChange={() => handleCheck(field)}>
              <Typography variant="omega" style={{ marginBottom: 4 }}>
                {field}
              </Typography>
            </Checkbox>
          </Flex>
          <Flex>
            <Switch
              selected={isSearchableSelected(field)}
              onChange={() => handleSearchable(field)}
            />
          </Flex>
        </Flex>
      ))}
    </Box>*/
  )
}

export default SchemaMapper
