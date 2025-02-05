import React from 'react'
import JsonFormatter from '../../components/JsonFormatter'
import ToolPageLayout from '../../components/ToolPageLayout'

function JsonFormatterPage() {
  return (
    <ToolPageLayout title='JSON Formatter' description='Format and validate JSON data'>
      <JsonFormatter />
    </ToolPageLayout>
  )
}

export default JsonFormatterPage
