import { useEffect } from 'react';
import { weddingConfig } from '../config/weddingConfig';

interface DocumentMetaProps {
  title: string;
  description?: string;
}

export function useDocumentMeta({ title, description }: DocumentMetaProps): void {
  useEffect(() => {
    const fullTitle = `${title} | ${weddingConfig.couple.fullTitle}`;
    document.title = fullTitle;

    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute('content', description);
      }
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', fullTitle);
    }
  }, [title, description]);
}
