import React from 'react'
import SessionKeyGenerator from '../../components/SessionKeyGenerator'
import ToolPageLayout from '../../components/ToolPageLayout'

function SessionKeyGeneratorPage() {
  return (
    <ToolPageLayout title='Session Key Generator' description='Generate secure session keys'>
      <SessionKeyGenerator />
    </ToolPageLayout>
  )
}

export default SessionKeyGeneratorPage
