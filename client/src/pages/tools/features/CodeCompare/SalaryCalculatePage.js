import React from 'react'
import CodeComparatorPage from '../../components/CodeCompare/CodeComparatorPage'
import ToolPageLayout from '../../components/ToolPageLayout'

function CodeComparator() {
  return (
    <ToolPageLayout title='Salary Calculator' description='Calculate mutlple country tax and after tax salary'>
      <CodeComparatorPage />
    </ToolPageLayout>
  )
}

export default CodeComparator
