import React from 'react';

/** The Odaa-tree + mountains crest used in the header and as section watermarks. */
export function OdaaMark({ variant = 'header', className = '' }: { variant?: 'header' | 'watermark'; className?: string }) {
  const wm = variant === 'watermark';
  return (
    <svg className={className} viewBox="0 0 240 220" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M44 22C88 46 152 46 196 22C174 52 146 60 120 60C94 60 66 52 44 22Z" />
      <path d="M88 54C94 78 74 144 38 198L92 198C76 190 82 152 92 104C98 76 114 58 134 56Z" />
      <path d="M146 66C174 82 186 138 206 198L166 198C184 188 176 142 168 106C164 86 154 74 146 66Z" />
      <ellipse cx="128" cy="128" rx="46" ry="64" fill="none" stroke="currentColor" strokeWidth={wm ? 3.5 : 5.5} />
      <circle cx="146" cy="108" r={wm ? 21 : 18} opacity={wm ? 0.55 : 0.5} />
      <path d="M85 139Q112 128 140 137Q158 142 172 134V160H85Z" opacity={wm ? 0.45 : 0.4} />
      <path d="M84 121C82 112 93 105 106 105C119 105 130 112 128 121C119 123 93 123 84 121Z" />
      <path d="M106 152V121M106 132L96 121M106 130L116 121" stroke="currentColor" strokeWidth={wm ? 3 : 4.5} strokeLinecap="round" fill="none" />
      {wm && <path d="M85 151Q110 141 132 151Q152 159 172 147V182Q128 192 85 179Z" opacity="0.7" />}
    </svg>
  );
}
