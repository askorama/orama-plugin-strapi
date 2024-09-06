const getSchemaFromAttributes = ({ attributes, schema }) => {
  return attributes.reduce((acc, field) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      if (!acc[parent]) {
        acc[parent] = {}
      }

      acc[parent][child] = schema[parent][child]
    } else if (field === 'id') {
      acc[field] = 'string'
    } else {
      acc[field] = schema[field]
    }
    return acc
  }, {})
}

const getSelectedAttributesFromSchema = ({ schema }) => {
  return Object.entries(schema).reduce((acc, [fieldKey, fieldValue]) => {
    if (typeof fieldValue === "object") {
      Object.keys(fieldValue).forEach((key) => acc.push(`${fieldKey}.${key}`))
    } else {
      acc.push(fieldKey)
    }
    return acc
  }, [])
}

module.exports = { getSchemaFromAttributes, getSelectedAttributesFromSchema }
