import React from 'react';
import ZenFormsEditor from '@/components/forms/ZenFormsEditor';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FormEditPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <ZenFormsEditor formId={resolvedParams.id} />;
}
