import React from 'react'
import SalaryCalculator from '../../components/SalaryCalculateApp/SalaryCalculator'
import ToolPageLayout from '../../components/ToolPageLayout'

function SalaryCalculatePage() {
  return (
    <ToolPageLayout title='Salary Calculator' description='Calculate mutlple country tax and after tax salary'>
      <SalaryCalculator />
    </ToolPageLayout>
  )
}

export default SalaryCalculatePage
