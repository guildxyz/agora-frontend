const clearUndefinedData = (data: Record<string, unknown>) => {
  const formData = { ...data }

  // Deleting the "undefined" fields
  Object.keys(formData).forEach(
    (key) => formData[key] === undefined && delete formData[key]
  )

  return formData
}

export default clearUndefinedData
