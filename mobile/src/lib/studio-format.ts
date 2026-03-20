import type { StudioDocument, StudioMarker, StudioToolbarAction } from '@/src/types/app';

export type TextSelection = {
  end: number;
  start: number;
};

export function formatSecondsToClock(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds || 0));
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, '0');
  const remainder = (safeSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainder}`;
}

export function formatDocumentDate(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'short',
  }).format(date);
}

export function buildTimestampLine(seconds: number) {
  return `──────────── ${formatSecondsToClock(seconds)} ────────────`;
}

export function buildMarkLine() {
  return '──────────── MARK ────────────';
}

export function buildQuickIdeaBlock() {
  return '✦ QUICK IDEA\n';
}

export function parseTags(rawValue: string) {
  return Array.from(
    new Set(
      rawValue
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    )
  );
}

export function stringifyTags(tags: string[]) {
  return tags.join(', ');
}

export function getDocumentPreview(noteText: string) {
  const compact = noteText.replace(/\s+/g, ' ').trim();
  if (!compact) return 'Empieza a desarrollar esta idea desde el documento.';
  return compact.length > 120 ? `${compact.slice(0, 120)}...` : compact;
}

export function extractTimestampMarkers(noteText: string): StudioMarker[] {
  const lines = noteText.split('\n');
  const markers: StudioMarker[] = [];

  lines.forEach((line, lineIndex) => {
    const match = line.match(/[─-]{6,}\s*(\d{2}):(\d{2})\s*[─-]{6,}/);
    if (!match) return;

    const minutes = Number(match[1]);
    const seconds = Number(match[2]);
    const absoluteSeconds = minutes * 60 + seconds;

    markers.push({
      id: `marker-${lineIndex}-${absoluteSeconds}`,
      label: formatSecondsToClock(absoluteSeconds),
      lineIndex,
      seconds: absoluteSeconds,
      text: line.trim(),
    });
  });

  return markers;
}

export function insertTextAtSelection(
  currentValue: string,
  selection: TextSelection,
  insertion: string
) {
  const nextValue = `${currentValue.slice(0, selection.start)}${insertion}${currentValue.slice(
    selection.end
  )}`;
  const nextCaret = selection.start + insertion.length;

  return {
    selection: {
      end: nextCaret,
      start: nextCaret,
    },
    value: nextValue,
  };
}

export function wrapSelectedText(
  currentValue: string,
  selection: TextSelection,
  prefix: string,
  suffix: string
) {
  const selectedText = currentValue.slice(selection.start, selection.end) || 'highlight';
  const nextValue = `${currentValue.slice(0, selection.start)}${prefix}${selectedText}${suffix}${currentValue.slice(selection.end)}`;
  const nextCaret = selection.start + prefix.length + selectedText.length + suffix.length;

  return {
    selection: {
      end: nextCaret,
      start: nextCaret,
    },
    value: nextValue,
  };
}

export function applyToolbarAction(params: {
  action: StudioToolbarAction;
  currentSeconds: number;
  selection: TextSelection;
  value: string;
}) {
  switch (params.action) {
    case 'timestamp':
      return insertTextAtSelection(
        params.value,
        params.selection,
        `\n${buildTimestampLine(params.currentSeconds)}\n`
      );
    case 'mark':
      return insertTextAtSelection(params.value, params.selection, `\n${buildMarkLine()}\n`);
    case 'idea':
      return insertTextAtSelection(params.value, params.selection, `\n${buildQuickIdeaBlock()}`);
    case 'highlight':
      return wrapSelectedText(params.value, params.selection, '==', '==');
    default:
      return {
        selection: params.selection,
        value: params.value,
      };
  }
}

export function buildTextExport(document: StudioDocument) {
  const parts = [
    document.title,
    document.description ? `\n${document.description}` : '',
    document.tags.length ? `\nTags: ${document.tags.join(', ')}` : '',
    '\n',
    document.noteText,
  ];

  return parts.join('\n').trim();
}

export function buildMarkdownExport(document: StudioDocument) {
  const tagLine = document.tags.length ? document.tags.map((tag) => `\`${tag}\``).join(' ') : '';

  return [
    `# ${document.title}`,
    document.description ? `\n${document.description}` : '',
    tagLine ? `\n${tagLine}` : '',
    '\n---\n',
    document.noteText,
  ]
    .join('\n')
    .trim();
}
