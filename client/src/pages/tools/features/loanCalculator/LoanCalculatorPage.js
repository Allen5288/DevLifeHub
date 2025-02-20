import React from 'react';
import LoanCalculator from '../../components/LoanCalculator/LoanCalculator';
import ToolPageLayout from '../../components/ToolPageLayout';

function LoanCalculatorPage() {
  return (
    <ToolPageLayout 
      title="Loan Calculator" 
      description="Calculate loan payments for Chinese Yuan (CNY) and Australian Dollar (AUD)"
    >
      <LoanCalculator />
    </ToolPageLayout>
  );
}

export default LoanCalculatorPage;