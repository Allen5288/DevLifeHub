import React from 'react'
import JwtConfigGenerator from '../../components/JwtConfigGenerator'
import ToolPageLayout from '../../components/ToolPageLayout'

function JwtConfigGeneratorPage() {
  return (
    <ToolPageLayout title='JWT Configuration' description='Generate JWT configuration and keys'>
      <JwtConfigGenerator />
    </ToolPageLayout>
  )
}

export default JwtConfigGeneratorPage
