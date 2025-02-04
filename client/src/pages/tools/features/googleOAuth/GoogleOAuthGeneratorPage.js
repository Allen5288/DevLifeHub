import React from 'react';
import GoogleOAuthGenerator from '../../components/GoogleOAuthGenerator';
import ToolPageLayout from '../../components/ToolPageLayout';

function GoogleOAuthGeneratorPage() {
  return (
    <ToolPageLayout title="Google OAuth Setup" description="Configure Google OAuth credentials">
      <GoogleOAuthGenerator />
    </ToolPageLayout>
  );
}

export default GoogleOAuthGeneratorPage;