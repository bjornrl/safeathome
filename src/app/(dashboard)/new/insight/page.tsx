'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  WORK_PACKAGES,
  FIELD_SITES,
  MATERIAL_TYPES,
  WP_CONFIG,
  MATERIAL_TYPE_LABELS,
} from '@/lib/constants';

export default function NewInsightPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [workPackage, setWorkPackage] = useState('');
  const [fieldSite, setFieldSite] = useState('');
  const [materialType, setMaterialType] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('You must be signed in.');
      setSubmitting(false);
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const { error: insertError } = await supabase.from('insights').insert({
      title,
      body,
      author_id: user.id,
      work_package: workPackage || null,
      field_site: fieldSite || null,
      material_type: materialType || null,
      tags: tags.length > 0 ? tags : null,
      flagged_for_design: false,
    });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    router.push('/insights');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-heading text-2xl font-bold mb-6">New Insight</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-surface border border-border-light rounded-[var(--radius-lg)] p-6 flex flex-col gap-4"
      >
        <Input
          id="title"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What did you observe or learn?"
          required
        />
        <Textarea
          id="body"
          label="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Describe your insight in detail..."
          className="min-h-[160px]"
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            id="workPackage"
            label="Work Package"
            value={workPackage}
            onChange={(e) => setWorkPackage(e.target.value)}
            placeholder="Select WP"
            options={WORK_PACKAGES.map((wp) => ({ value: wp, label: WP_CONFIG[wp].label }))}
          />
          <Select
            id="fieldSite"
            label="Field Site"
            value={fieldSite}
            onChange={(e) => setFieldSite(e.target.value)}
            placeholder="Select site"
            options={FIELD_SITES.map((s) => ({ value: s, label: s }))}
          />
          <Select
            id="materialType"
            label="Material Type"
            value={materialType}
            onChange={(e) => setMaterialType(e.target.value)}
            placeholder="Select type"
            options={MATERIAL_TYPES.map((m) => ({ value: m, label: MATERIAL_TYPE_LABELS[m] }))}
          />
        </div>
        <Input
          id="tags"
          label="Tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="Comma-separated tags, e.g. housing, elderly, Oslo"
        />

        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-[var(--radius-sm)]">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Insight'}
          </Button>
        </div>
      </form>
    </div>
  );
}
