'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';
import type { Attachment } from '@/lib/types/database';

interface AttachmentGalleryProps {
  insightId: string;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getTypeBadge(type: string) {
  if (type.startsWith('image/')) return { label: 'Image', color: '#3A8A7D', bg: '#E6F3F1' };
  if (type === 'application/pdf') return { label: 'PDF', color: '#C45D3E', bg: '#FDF0EC' };
  if (type.startsWith('audio/')) return { label: 'Audio', color: '#5B6AAF', bg: '#ECEEF7' };
  return { label: 'File', color: '#7A756B', bg: '#EDE9E0' };
}

export function AttachmentGallery({ insightId }: AttachmentGalleryProps) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttachments = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('attachments')
        .select('*')
        .eq('insight_id', insightId)
        .order('created_at');

      if (data && data.length > 0) {
        setAttachments(data);

        // Get signed URLs for all files
        const urls: Record<string, string> = {};
        for (const att of data) {
          const { data: urlData } = await supabase.storage
            .from('attachments')
            .createSignedUrl(att.storage_path, 3600);
          if (urlData?.signedUrl) {
            urls[att.id] = urlData.signedUrl;
          }
        }
        setSignedUrls(urls);
      }
      setLoading(false);
    };
    fetchAttachments();
  }, [insightId]);

  if (loading) return null;
  if (attachments.length === 0) return null;

  const images = attachments.filter((a) => a.file_type.startsWith('image/'));
  const pdfs = attachments.filter((a) => a.file_type === 'application/pdf');
  const audio = attachments.filter((a) => a.file_type.startsWith('audio/'));

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-heading text-lg font-semibold">
        Attachments ({attachments.length})
      </h3>

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {images.map((att) => {
            const url = signedUrls[att.id];
            if (!url) return null;
            return (
              <button
                key={att.id}
                onClick={() => setLightboxUrl(url)}
                className="relative group rounded-[var(--radius-md)] overflow-hidden border border-border-light aspect-square cursor-pointer"
              >
                <img
                  src={url}
                  alt={att.file_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-xs text-white truncate">{att.file_name}</p>
                  <p className="text-[10px] text-white/70">{formatSize(att.file_size)}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* PDF list */}
      {pdfs.map((att) => {
        const url = signedUrls[att.id];
        const typeBadge = getTypeBadge(att.file_type);
        return (
          <div key={att.id} className="flex items-center gap-3 p-3 bg-surface-alt rounded-[var(--radius-md)] border border-border-light">
            <span className="text-lg">📄</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text truncate">{att.file_name}</p>
              <p className="text-xs text-text-light">{formatSize(att.file_size)}</p>
            </div>
            <Badge color={typeBadge.color} bg={typeBadge.bg}>{typeBadge.label}</Badge>
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent hover:underline flex-shrink-0"
              >
                Open
              </a>
            )}
          </div>
        );
      })}

      {/* Audio players */}
      {audio.map((att) => {
        const url = signedUrls[att.id];
        const typeBadge = getTypeBadge(att.file_type);
        return (
          <div key={att.id} className="flex flex-col gap-2 p-3 bg-surface-alt rounded-[var(--radius-md)] border border-border-light">
            <div className="flex items-center gap-3">
              <span className="text-lg">♫</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">{att.file_name}</p>
                <p className="text-xs text-text-light">{formatSize(att.file_size)}</p>
              </div>
              <Badge color={typeBadge.color} bg={typeBadge.bg}>{typeBadge.label}</Badge>
            </div>
            {url && (
              <audio controls className="w-full h-8" preload="none">
                <source src={url} type={att.file_type} />
              </audio>
            )}
          </div>
        );
      })}

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-2xl cursor-pointer hover:opacity-80"
            onClick={() => setLightboxUrl(null)}
          >
            &times;
          </button>
          <img
            src={lightboxUrl}
            alt="Full size"
            className="max-w-full max-h-[90vh] object-contain rounded-[var(--radius-md)]"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
