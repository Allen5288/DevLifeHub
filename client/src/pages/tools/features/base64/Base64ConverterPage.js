import React from 'react';
import Base64Converter from '../../components/Base64Converter';
import ToolPageLayout from '../../components/ToolPageLayout';

function Base64ConverterPage() {
  return (
    <ToolPageLayout title="Base64 Converter" description="Encode and decode Base64 strings">
      <Base64Converter />
    </ToolPageLayout>
  );
}

export default Base64ConverterPage;