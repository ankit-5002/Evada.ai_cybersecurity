"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Home, RotateCcw } from "lucide-react";
import { ErrorMotionGraphic } from "./ErrorMotionGraphic";
import { EVADA_ERROR_DEFINITIONS, type EvadaErrorKind } from "@/lib/error-map";

type ErrorAction = {
  href?: string;
  label: string;
  onClick?: () => void;
};

type ErrorScreenProps = {
  kind: EvadaErrorKind;
  title?: string;
  description?: string;
  eyebrow?: string;
  code?: string;
  reference?: string;
  detail?: string;
  mode?: "public" | "workspace";
  primaryAction?: ErrorAction;
  secondaryAction?: ErrorAction;
};

function ActionControl({ action, primary = false }: Readonly<{ action: ErrorAction; primary?: boolean }>) {
  const className = primary
    ? "evada-error-action evada-error-action-primary"
    : "evada-error-action evada-error-action-secondary";
  const Icon = action.onClick ? RotateCcw : action.href === "/" ? Home : primary ? ArrowRight : ArrowLeft;
  const content = (
    <>
      {primary ? null : <Icon className="h-4 w-4" aria-hidden="true" />}
      <span>{action.label}</span>
      {primary ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
    </>
  );

  if (action.href) {
    return (
      <Link href={action.href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={className} onClick={action.onClick}>
      {content}
    </button>
  );
}

export function ErrorScreen({
  kind,
  title,
  description,
  eyebrow,
  code,
  reference,
  detail,
  mode = "public",
  primaryAction,
  secondaryAction,
}: Readonly<ErrorScreenProps>) {
  const definition = EVADA_ERROR_DEFINITIONS[kind];
  const resolvedCode = code || definition.code;

  return (
    <main className={`evada-error-screen evada-error-screen-${mode}`} data-error-kind={kind}>
      <div className="evada-error-screen-grid" aria-hidden="true" />
      <div className="evada-error-screen-scan" aria-hidden="true" />

      <header className="evada-error-brand">
        <Link href="/" aria-label="Go to EVADA home" className="evada-error-brand-link">
          <Image src="/logos/logo.png" alt="EVADA" width={178} height={44} priority />
        </Link>
        <span className="evada-error-channel">
          <span aria-hidden="true" />
          Secure recovery channel
        </span>
      </header>

      <section className="evada-error-content" aria-labelledby="evada-error-title">
        <ErrorMotionGraphic code={resolvedCode} kind={kind} />

        <div className="evada-error-copy">
          <p className="evada-error-eyebrow">{eyebrow || definition.eyebrow}</p>
          <h1 id="evada-error-title">{title || definition.title}</h1>
          <p className="evada-error-description">{description || definition.description}</p>
          {detail ? <p className="evada-error-detail">{detail}</p> : null}

          {primaryAction || secondaryAction ? (
            <div className="evada-error-actions">
              {primaryAction ? <ActionControl action={primaryAction} primary /> : null}
              {secondaryAction ? <ActionControl action={secondaryAction} /> : null}
            </div>
          ) : null}

          <div className="evada-error-meta" aria-label="Error diagnostic information">
            <span>{definition.signal}</span>
            {reference ? <span>Reference {reference}</span> : <span>EVADA CONTROL PLANE</span>}
          </div>
        </div>
      </section>

      <footer className="evada-error-footer">
        <span>Identity protected</span>
        <span>Tenant data unchanged</span>
      </footer>
    </main>
  );
}
