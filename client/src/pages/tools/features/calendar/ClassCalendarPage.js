import React from 'react';
import ClassCalendar from '../../components/ClassCalendar';
import ToolPageLayout from '../../components/ToolPageLayout';

function ClassCalendarPage() {
  return (
    <ToolPageLayout title="Class Calendar" description="Manage your teaching schedule and track earnings">
      <ClassCalendar />
    </ToolPageLayout>
  );
}

export default ClassCalendarPage;