import { FileText } from 'lucide-react';

// A static sample transcript rendered as a paper document — the hero's
// "show the product" visual. Pure HTML/CSS, prerenders, no images.
const SAMPLE_LINES = [
  { t: '00:00', text: 'Welcome back — today we’re looking at how photosynthesis actually works.' },
  { t: '00:14', text: 'Plants take in carbon dioxide through tiny pores called stomata.' },
  { t: '00:31', text: 'Inside the chloroplast, light energy splits water molecules apart.', hl: true },
  { t: '00:52', text: 'That releases the oxygen we breathe — a by-product of the process.' },
  { t: '01:10', text: 'The energy gets stored as glucose, which fuels the whole plant.' },
  { t: '01:27', text: 'So the equation is: carbon dioxide plus water, powered by light…' },
];

const TranscriptPaperCard = () => (
  <div className="relative select-none" aria-hidden="true">
    <div className="paper-doc-behind"></div>
    <div className="paper-doc p-6 sm:p-7">
      {/* Document header */}
      <div className="flex items-start gap-3 border-b border-border pb-4 mb-4">
        <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg gradient-bg">
          <FileText className="w-4.5 h-4.5 text-background" />
        </div>
        <div className="min-w-0">
          <p className="font-display font-semibold text-sm leading-snug truncate">
            How Photosynthesis Works — Biology Basics
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 font-mono">
            1,842 words · English · TXT SRT VTT PDF DOCX
          </p>
        </div>
      </div>

      {/* Transcript lines: mono timestamps in a margin column */}
      <div className="space-y-2.5">
        {SAMPLE_LINES.map((line) => (
          <div key={line.t} className="flex gap-3 items-baseline">
            <span className="font-mono text-[11px] text-muted-foreground flex-shrink-0 w-11 text-right">
              {line.t}
            </span>
            <span className={`text-[13px] leading-relaxed ${line.hl ? 'gradient-text' : 'text-foreground/90'}`}>
              {line.text}
            </span>
          </div>
        ))}
      </div>

      {/* Faded tail suggests the document continues */}
      <div className="mt-3 space-y-2" style={{ maskImage: 'linear-gradient(to bottom, black, transparent)' }}>
        <div className="flex gap-3 items-center">
          <span className="w-11 flex-shrink-0"></span>
          <div className="h-2 rounded bg-muted w-4/5"></div>
        </div>
        <div className="flex gap-3 items-center">
          <span className="w-11 flex-shrink-0"></span>
          <div className="h-2 rounded bg-muted w-3/5"></div>
        </div>
      </div>
    </div>
  </div>
);

export default TranscriptPaperCard;
