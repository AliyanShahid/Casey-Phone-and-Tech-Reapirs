import Link from "next/link";

export function CaseyLogo({
  href = "/",
  compact = false,
  admin = false
}: {
  href?: string;
  compact?: boolean;
  admin?: boolean;
}) {
  const content = (
    <>
      <span className={`casey-logo-mark ${compact ? "compact-mark" : ""}`} aria-hidden="true">
        <svg className="casey-logo-icon" viewBox="0 0 96 96" role="img">
          <circle cx="48" cy="48" r="48" fill="#1E1E24" />
          <rect
            x="34"
            y="24"
            width="28"
            height="48"
            rx="10"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="4"
          />
          <path d="M51 36L40 54H48L44 68L58 47H50L51 36Z" fill="#A3E635" />
        </svg>
      </span>
      <span className={`casey-logo-text ${compact ? "compact-text" : ""}`}>
        <strong>CASEY</strong>
        <small>{admin ? "ADMIN" : "PHONE & TECH REPAIRS"}</small>
      </span>
    </>
  );

  if (compact) {
    return <span className="casey-logo compact">{content}</span>;
  }

  return (
    <Link href={href} className="casey-logo" aria-label="Casey Phone & Tech Repairs home">
      {content}
    </Link>
  );
}
