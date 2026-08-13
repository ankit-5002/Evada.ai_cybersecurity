"use client";

type WorkspaceSkeletonProps = {
  metrics?: number;
  rows?: number;
  rail?: boolean;
  detail?: boolean;
};

function Pulse({ className }: { className: string }) {
  return <span className={`block animate-pulse rounded-[6px] bg-slate-200/75 ${className}`} />;
}

export function WorkspaceSkeleton({ metrics = 4, rows = 6, rail = false, detail = false }: WorkspaceSkeletonProps) {
  return (
    <div className="grid min-w-0 gap-4" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading workspace data</span>
      <div className="flex items-start justify-between gap-4">
        <div className="grid w-full max-w-xl gap-2">
          <Pulse className="h-2.5 w-28" />
          <Pulse className="h-7 w-48 sm:w-64" />
          <Pulse className="h-3 w-full max-w-lg" />
        </div>
        <Pulse className="hidden h-10 w-28 sm:block" />
      </div>

      <div className={`grid gap-2.5 sm:grid-cols-2 ${metrics === 5 ? "xl:grid-cols-5" : "xl:grid-cols-4"}`}>
        {Array.from({ length: metrics }).map((_, index) => (
          <div key={index} className="flex h-[78px] items-center gap-3 rounded-[8px] border border-slate-200 bg-white p-3">
            <Pulse className="h-10 w-10 shrink-0" />
            <div className="grid flex-1 gap-2"><Pulse className="h-2.5 w-20" /><Pulse className="h-5 w-12" /></div>
          </div>
        ))}
      </div>

      {rail ? (
        <div className="overflow-hidden border-y border-slate-200 py-4">
          <div className="mb-3 flex items-center justify-between"><Pulse className="h-4 w-32" /><Pulse className="h-7 w-20" /></div>
          <div className="grid grid-flow-col auto-cols-[minmax(220px,1fr)] gap-2.5 overflow-hidden">
            {Array.from({ length: 4 }).map((_, index) => <Pulse key={index} className="h-24" />)}
          </div>
        </div>
      ) : null}

      {detail ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
          <div className="grid gap-3">
            <Pulse className="h-40 w-full" />
            <Pulse className="h-56 w-full" />
          </div>
          <div className="grid gap-3"><Pulse className="h-64 w-full" /><Pulse className="h-36 w-full" /></div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[8px] border border-slate-200 bg-white">
          <div className="flex gap-2 border-b border-slate-100 p-3"><Pulse className="h-10 flex-1" /><Pulse className="h-10 w-36" /><Pulse className="h-10 w-10" /></div>
          <div className="divide-y divide-slate-100 px-4">
            {Array.from({ length: rows }).map((_, index) => (
              <div key={index} className="grid h-16 grid-cols-[minmax(0,1.4fr)_minmax(120px,.8fr)_96px] items-center gap-5">
                <div className="grid gap-2"><Pulse className="h-3 w-2/3" /><Pulse className="h-2.5 w-1/2" /></div>
                <Pulse className="h-3 w-4/5" />
                <Pulse className="h-7 w-20" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function WorkspaceRowsSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="grid gap-2" role="status" aria-label="Loading records">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="grid min-h-14 animate-pulse grid-cols-[minmax(0,1fr)_96px_80px] items-center gap-4 rounded-[8px] bg-slate-50 px-3">
          <div className="grid gap-2">
            <span className="h-3 w-2/5 rounded bg-slate-200" />
            <span className="h-2.5 w-3/5 rounded bg-slate-100" />
          </div>
          <span className="h-6 rounded bg-slate-200" />
          <span className="h-8 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
}
