const getSchemaFromSearchableAttributes = ({ selectedAttributes, schema }) => {
  return selectedAttributes.reduce((acc, field) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      if (!acc[parent]) {
        acc[parent] = {}
      }

      acc[parent][child] = schema[parent][child]
    } else {
      acc[field] = schema[field]
    }
    return acc
  }, {})
}

module.exports = { getSchemaFromSearchableAttributes }
