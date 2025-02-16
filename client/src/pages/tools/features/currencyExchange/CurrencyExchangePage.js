import React from 'react'
import ToolPageLayout from '../../components/ToolPageLayout'
import CurrencyExchange from '../../components/CurrencyExchange/CurrencyExchange'

function CurrencyExchangePage() {
  return (
    <ToolPageLayout title='Currency Exchange' description='Have a quick look for the currency exchange rates'>
      <CurrencyExchange />
    </ToolPageLayout>
  )
}

export default CurrencyExchangePage
