import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';

import { buildMarkdownExport, buildTextExport } from '@/src/lib/studio-format';
import type { StudioDocument, StudioExportFormat } from '@/src/types/app';

function sanitizeExportName(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'creatoros-document';
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export async function exportStudioDocument(
  document: StudioDocument,
  format: StudioExportFormat
) {
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('El sistema no permite compartir archivos desde este dispositivo.');
  }

  const safeName = sanitizeExportName(document.title);

  if (format === 'pdf') {
    const html = `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: Georgia, serif; background: #0f0e0c; color: #f0ede6; padding: 32px; }
            h1 { font-size: 28px; margin-bottom: 8px; }
            p, pre { font-size: 16px; line-height: 1.55; }
            .meta { color: #a09a8e; margin-bottom: 24px; }
            pre { white-space: pre-wrap; font-family: "Courier New", monospace; background: #161512; padding: 18px; border-radius: 16px; }
          </style>
        </head>
        <body>
          <h1>${escapeHtml(document.title)}</h1>
          <p class="meta">${escapeHtml(document.description || '')}</p>
          <pre>${escapeHtml(document.noteText)}</pre>
        </body>
      </html>`;

    const result = await Print.printToFileAsync({
      html,
    });

    await Sharing.shareAsync(result.uri);
    return result.uri;
  }

  const file = new File(Paths.cache, `${safeName}.${format}`);
  if (!file.parentDirectory.exists) {
    file.parentDirectory.create({ idempotent: true, intermediates: true });
  }
  if (file.exists) {
    file.delete();
  }
  file.create({ intermediates: true });
  file.write(format === 'txt' ? buildTextExport(document) : buildMarkdownExport(document));

  await Sharing.shareAsync(file.uri, {
    mimeType: format === 'txt' ? 'text/plain' : 'text/markdown',
  });

  return file.uri;
}
