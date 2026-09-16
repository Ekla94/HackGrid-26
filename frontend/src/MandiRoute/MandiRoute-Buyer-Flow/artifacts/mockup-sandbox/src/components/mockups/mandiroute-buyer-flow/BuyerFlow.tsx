import { useRef, useState, type ChangeEvent, type CSSProperties, type KeyboardEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BadgeIndianRupee,
  Banknote,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  CloudSun,
  FileCheck2,
  FileText,
  Fingerprint,
  Gavel,
  HandCoins,
  Handshake,
  KeyRound,
  Landmark,
  LockKeyhole,
  MapPin,
  PackageCheck,
  ReceiptIndianRupee,
  RefreshCw,
  Route,
  ScanLine,
  Scale,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sprout,
  Store,
  Truck,
  UsersRound,
  WalletCards,
  Wheat,
} from "lucide-react";

type FlowScreen =
  | "welcome"
  | "login"
  | "otp"
  | "kyc"
  | "dashboard"
  | "rfq"
  | "bids"
  | "qc"
  | "settlement";

type BuyerRole = "farmer" | "buyer";
type QcDecision = "approve" | "deduct";

const screens: FlowScreen[] = [
  "welcome",
  "login",
  "otp",
  "kyc",
  "dashboard",
  "rfq",
  "bids",
  "qc",
  "settlement",
];

const screenLabels = [
  "Portal",
  "Sign in",
  "OTP",
  "Verify",
  "Desk",
  "RFQ",
  "Bids",
  "QC",
  "Settle",
];

const farmerScreenLabels = [
  "Portal",
  "Sign in",
  "OTP",
  "Verify",
  "Farm desk",
  "Lot",
  "Offers",
  "Proof",
  "Payout",
];

const gold = "#d4aa57";
const goldBright = "#f3cf7a";
const ink = "#121511";
const panel = "#1b2119";
const panelRaised = "#22291f";
const olive = "#889a6b";
const parchment = "#f4ecd9";
const muted = "#a7ad99";
const red = "#d58365";

const baseInputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "#111610",
  border: "1px solid rgba(212,170,87,.22)",
  borderRadius: 14,
  padding: "13px 14px",
  color: parchment,
  fontSize: 14,
  fontFamily: "inherit",
  outline: "none",
};

const iconBoxStyle: CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: 12,
  display: "grid",
  placeItems: "center",
  background: "rgba(212,170,87,.11)",
  color: goldBright,
  flexShrink: 0,
};

function IconBadge({
  icon: Icon,
  tone = "gold",
}: {
  icon: typeof Wheat;
  tone?: "gold" | "olive" | "green" | "red";
}) {
  const tones = {
    gold: { bg: "rgba(212,170,87,.12)", color: goldBright },
    olive: { bg: "rgba(136,154,107,.15)", color: "#bdc99f" },
    green: { bg: "rgba(97,147,101,.16)", color: "#a8d2a5" },
    red: { bg: "rgba(213,131,101,.14)", color: "#e5a38d" },
  };
  const active = tones[tone];
  return (
    <span style={{ ...iconBoxStyle, background: active.bg, color: active.color }}>
      <Icon size={18} strokeWidth={1.8} />
    </span>
  );
}

function StatusPill({
  children,
  tone = "gold",
}: {
  children: React.ReactNode;
  tone?: "gold" | "green" | "olive" | "red";
}) {
  const colors = {
    gold: { bg: "rgba(212,170,87,.13)", color: "#e7c879", border: "rgba(212,170,87,.22)" },
    green: { bg: "rgba(100,157,103,.14)", color: "#add4a8", border: "rgba(100,157,103,.25)" },
    olive: { bg: "rgba(136,154,107,.14)", color: "#c0cb9d", border: "rgba(136,154,107,.23)" },
    red: { bg: "rgba(213,131,101,.13)", color: "#e6a18d", border: "rgba(213,131,101,.24)" },
  };
  const color = colors[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 9px",
        borderRadius: 999,
        border: `1px solid ${color.border}`,
        background: color.bg,
        color: color.color,
        fontSize: 10,
        letterSpacing: ".06em",
        textTransform: "uppercase",
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function PrimaryButton({
  children,
  onClick,
  icon = ArrowRight,
  disabled = false,
  variant = "gold",
}: {
  children: React.ReactNode;
  onClick: () => void;
  icon?: typeof ArrowRight;
  disabled?: boolean;
  variant?: "gold" | "outline" | "quiet";
}) {
  const Icon = icon;
  const isGold = variant === "gold";
  const isQuiet = variant === "quiet";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        minHeight: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        borderRadius: 15,
        border: isGold ? "1px solid rgba(243,207,122,.55)" : `1px solid ${isQuiet ? "rgba(255,255,255,.1)" : "rgba(212,170,87,.32)"}`,
        background: isGold ? "linear-gradient(135deg, #e5ba61, #b17b35)" : isQuiet ? "rgba(255,255,255,.045)" : "transparent",
        color: isGold ? "#17170f" : parchment,
        fontSize: 13,
        fontWeight: 800,
        letterSpacing: ".01em",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        boxShadow: isGold ? "0 10px 24px rgba(177,123,53,.2)" : "none",
        transition: "transform .18s ease, opacity .18s ease",
      }}
    >
      {children}
      <Icon size={17} strokeWidth={2.2} />
    </button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Go back"
      onClick={onClick}
      style={{
        width: 35,
        height: 35,
        borderRadius: 11,
        border: "1px solid rgba(255,255,255,.1)",
        background: "rgba(255,255,255,.04)",
        color: parchment,
        display: "grid",
        placeItems: "center",
        cursor: "pointer",
      }}
    >
      <ArrowLeft size={16} />
    </button>
  );
}

function Header({
  title,
  eyebrow,
  onBack,
  current,
  role = "buyer",
}: {
  title: string;
  eyebrow: string;
  onBack?: () => void;
  current: FlowScreen;
  role?: BuyerRole;
}) {
  const activeIndex = screens.indexOf(current);
  const labels = role === "farmer" ? farmerScreenLabels : screenLabels;
  return (
    <header style={{ padding: "18px 20px 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
        {onBack ? <BackButton onClick={onBack} /> : <div style={{ width: 35 }} />}
        <div style={{ textAlign: "center", minWidth: 0 }}>
          <div style={{ color: gold, fontSize: 9, fontWeight: 800, letterSpacing: ".2em", textTransform: "uppercase" }}>
            {eyebrow}
          </div>
          <div style={{ marginTop: 5, color: parchment, fontSize: 14, fontWeight: 750 }}>{title}</div>
        </div>
        <div style={{ width: 35, height: 35, display: "grid", placeItems: "center", color: muted }}>
          <CloudSun size={18} strokeWidth={1.5} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, marginTop: 18 }}>
        {screens.map((step, index) => (
          <span
            key={step}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 4,
              background: index <= activeIndex ? gold : "rgba(255,255,255,.11)",
              opacity: index === activeIndex ? 1 : index < activeIndex ? 0.72 : 0.45,
            }}
          />
        ))}
      </div>
      <div style={{ marginTop: 8, color: muted, fontSize: 10, textAlign: "right" }}>
        {labels[activeIndex] ?? labels[0]} · {Math.max(activeIndex + 1, 1)} of {screens.length}
      </div>
    </header>
  );
}

function SectionTitle({ kicker, title, body }: { kicker: string; title: string; body?: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ color: gold, fontSize: 10, textTransform: "uppercase", letterSpacing: ".17em", fontWeight: 800 }}>{kicker}</div>
      <h1 style={{ margin: "8px 0 0", color: parchment, fontSize: 27, lineHeight: 1.08, letterSpacing: "-.04em", fontWeight: 760 }}>{title}</h1>
      {body ? <p style={{ margin: "10px 0 0", color: muted, fontSize: 13, lineHeight: 1.6 }}>{body}</p> : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  suffix,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  suffix?: string;
}) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", marginBottom: 8, color: "#bec3b1", fontSize: 11, fontWeight: 700 }}>{label}</span>
      <span style={{ position: "relative", display: "block" }}>
        <input
          style={{ ...baseInputStyle, paddingRight: suffix ? 70 : 14 }}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          type={type}
        />
        {suffix ? <span style={{ position: "absolute", right: 14, top: 14, color: gold, fontSize: 11, fontWeight: 800 }}>{suffix}</span> : null}
      </span>
    </label>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  detail,
  tone = "gold",
}: {
  icon: typeof Wheat;
  label: string;
  value: string;
  detail: string;
  tone?: "gold" | "olive" | "green";
}) {
  return (
    <div style={{ padding: 14, borderRadius: 17, background: panelRaised, border: "1px solid rgba(255,255,255,.065)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <IconBadge icon={Icon} tone={tone} />
        <ChevronRight size={15} color="#76806b" />
      </div>
      <div style={{ marginTop: 16, color: muted, fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700 }}>{label}</div>
      <div style={{ marginTop: 5, color: parchment, fontSize: 22, fontWeight: 760, letterSpacing: "-.03em" }}>{value}</div>
      <div style={{ marginTop: 4, color: tone === "green" ? "#a6ca9b" : muted, fontSize: 11 }}>{detail}</div>
    </div>
  );
}

function ListRow({
  icon: Icon,
  title,
  detail,
  right,
  tone = "gold",
}: {
  icon: typeof Wheat;
  title: string;
  detail: string;
  right?: React.ReactNode;
  tone?: "gold" | "olive" | "green" | "red";
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
      <IconBadge icon={Icon} tone={tone} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: parchment, fontSize: 12, fontWeight: 700 }}>{title}</div>
        <div style={{ marginTop: 3, color: muted, fontSize: 10 }}>{detail}</div>
      </div>
      {right}
    </div>
  );
}

function ScreenShell({
  children,
  current,
  title,
  eyebrow,
  onBack,
  role = "buyer",
}: {
  children: React.ReactNode;
  current: FlowScreen;
  title: string;
  eyebrow: string;
  onBack?: () => void;
  role?: BuyerRole;
}) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100%",
        maxWidth: 440,
        margin: "0 auto",
        background: `radial-gradient(circle at 93% 6%, rgba(136,154,107,.12), transparent 30%), ${ink}`,
        color: parchment,
        fontFamily: "'Plus Jakarta Sans', 'DM Sans', ui-sans-serif, system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      <Header title={title} eyebrow={eyebrow} current={current} onBack={onBack} role={role} />
      <main style={{ padding: "20px 20px 28px" }}>{children}</main>
    </div>
  );
}

function RoleTile({
  selected,
  onClick,
  icon: Icon,
  title,
  body,
  tag,
}: {
  selected: boolean;
  onClick: () => void;
  icon: typeof Wheat;
  title: string;
  body: string;
  tag: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: "relative",
        width: "100%",
        textAlign: "left",
        padding: 16,
        borderRadius: 18,
        border: selected ? "1px solid rgba(227,185,95,.78)" : "1px solid rgba(255,255,255,.1)",
        background: selected ? "linear-gradient(145deg, rgba(212,170,87,.16), rgba(27,33,25,.93))" : "rgba(255,255,255,.035)",
        color: parchment,
        cursor: "pointer",
        boxShadow: selected ? "inset 0 0 0 1px rgba(243,207,122,.08), 0 12px 30px rgba(0,0,0,.17)" : "none",
        transition: "transform .18s ease, border-color .18s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <IconBadge icon={Icon} tone={selected ? "gold" : "olive"} />
        <span style={{ color: selected ? goldBright : "#6f7867", fontSize: 10, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>{tag}</span>
      </div>
      <div style={{ marginTop: 16, fontSize: 15, fontWeight: 800 }}>{title}</div>
      <div style={{ marginTop: 6, color: muted, fontSize: 11, lineHeight: 1.45 }}>{body}</div>
      {selected ? (
        <span style={{ position: "absolute", right: 14, bottom: 14, width: 20, height: 20, borderRadius: "50%", background: gold, color: ink, display: "grid", placeItems: "center" }}>
          <Check size={12} strokeWidth={3} />
        </span>
      ) : null}
    </button>
  );
}

function WelcomeScreen({
  role,
  setRole,
  onStart,
}: {
  role: BuyerRole;
  setRole: (role: BuyerRole) => void;
  onStart: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100%",
        maxWidth: 440,
        margin: "0 auto",
        background: ink,
        color: parchment,
        fontFamily: "'Plus Jakarta Sans', 'DM Sans', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          minHeight: 318,
          padding: "28px 22px 24px",
          position: "relative",
          overflow: "hidden",
          backgroundImage: `linear-gradient(180deg, rgba(18,21,17,.09), ${ink} 96%), url("/__mockup/images/khetinex-wheat-dock.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 28, height: 28, borderRadius: 9, display: "grid", placeItems: "center", background: "rgba(18,21,17,.78)", border: "1px solid rgba(243,207,122,.38)" }}>
              <Wheat size={15} color={goldBright} />
            </span>
            <span style={{ fontSize: 13, letterSpacing: ".13em", textTransform: "uppercase", fontWeight: 800 }}>KhetiNex</span>
          </div>
          <StatusPill tone="olive">Institutional trade rail</StatusPill>
        </div>
        <div>
          <div style={{ color: goldBright, fontSize: 10, textTransform: "uppercase", letterSpacing: ".18em", fontWeight: 800 }}>Harvest to enterprise</div>
          <h1 style={{ maxWidth: 330, margin: "10px 0 0", fontSize: 37, lineHeight: .99, letterSpacing: "-.065em", fontWeight: 800 }}>Move grain with more certainty.</h1>
          <p style={{ maxWidth: 320, margin: "14px 0 0", color: "#c7c7ae", fontSize: 12, lineHeight: 1.55 }}>A verified route for India’s crop buyers, processors and export desks.</p>
        </div>
      </div>
      <div style={{ padding: "6px 20px 28px" }}>
        <div style={{ color: gold, fontSize: 10, textTransform: "uppercase", letterSpacing: ".17em", fontWeight: 800 }}>Choose your portal</div>
        <h2 style={{ margin: "8px 0 6px", color: parchment, fontSize: 21, letterSpacing: "-.04em" }}>Where are you trading from?</h2>
        <p style={{ margin: 0, color: muted, fontSize: 12, lineHeight: 1.5 }}>Your workspace is tuned to the way your team buys and moves produce.</p>
        <div style={{ display: "grid", gap: 10, marginTop: 20 }}>
          <RoleTile selected={role === "farmer"} onClick={() => setRole("farmer")} icon={UsersRound} title="Farmer / FPO" body="List harvests, respond to bids and track mandi collections." tag="Supply side" />
          <RoleTile selected={role === "buyer"} onClick={() => setRole("buyer")} icon={Store} title="Buyer / Trader" body="Source at scale, verify lots and settle with a clean audit trail." tag="Demand side" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "16px 0 18px", color: muted, fontSize: 10 }}>
          <ShieldCheck size={14} color={gold} />
          GSTIN-led onboarding with role-based controls
        </div>
        <PrimaryButton onClick={onStart} icon={ArrowRight}>
          {role === "buyer" ? "Enter buyer workspace" : "Enter farmer workspace"}
        </PrimaryButton>
        <div style={{ marginTop: 16, color: "#6f776b", fontSize: 10, textAlign: "center" }}>Trusted across regulated agri trade corridors</div>
      </div>
    </div>
  );
}

function LoginScreen({
  corporateId,
  setCorporateId,
  mobile,
  setMobile,
  onNext,
  onBack,
}: {
  corporateId: string;
  setCorporateId: (value: string) => void;
  mobile: string;
  setMobile: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <ScreenShell current="login" title="Buyer login" eyebrow="Secure access" onBack={onBack}>
      <div style={{ paddingTop: 22 }}>
        <SectionTitle kicker="01 / Identity" title="Welcome to the buyer desk." body="Use your registered corporate credentials. We will send a one-time passcode to the authorised mobile." />
        <div style={{ display: "grid", gap: 15, padding: 17, borderRadius: 20, background: panel, border: "1px solid rgba(255,255,255,.07)" }}>
          <Field label="Corporate ID / GSTIN" value={corporateId} onChange={setCorporateId} placeholder="27AABCM1234C1Z7" />
          <Field label="Authorised mobile" value={mobile} onChange={setMobile} placeholder="+91 98 7654 3210" type="tel" />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2, color: muted, fontSize: 10 }}>
            <LockKeyhole size={14} color={gold} />
            Access is encrypted and logged for your trade desk.
          </div>
        </div>
        <div style={{ marginTop: 18 }}>
          <PrimaryButton onClick={onNext} disabled={!corporateId || mobile.length < 8}>
            Send verification code
          </PrimaryButton>
        </div>
        <button type="button" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%", marginTop: 16, background: "none", border: 0, color: olive, fontSize: 11, cursor: "pointer" }}>
          <KeyRound size={13} /> Need help signing in?
        </button>
      </div>
    </ScreenShell>
  );
}

function FarmerLoginScreen({
  farmerId,
  setFarmerId,
  mobile,
  setMobile,
  onNext,
  onBack,
}: {
  farmerId: string;
  setFarmerId: (value: string) => void;
  mobile: string;
  setMobile: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <ScreenShell current="login" title="Farmer login" eyebrow="Secure access" onBack={onBack} role="farmer">
      <div style={{ paddingTop: 22 }}>
        <SectionTitle
          kicker="01 / Identity"
          title="Bring your harvest to market."
          body="Sign in with your Kisan ID, FPO code or registered mobile. We will keep the proof and payout trail together."
        />
        <div style={{ display: "grid", gap: 15, padding: 17, borderRadius: 20, background: panel, border: "1px solid rgba(255,255,255,.07)" }}>
          <Field label="Kisan ID / FPO code" value={farmerId} onChange={setFarmerId} placeholder="KISAN-MP-20841" />
          <Field label="Registered mobile" value={mobile} onChange={setMobile} placeholder="+91 98 7654 3210" type="tel" />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2, color: muted, fontSize: 10 }}>
            <LockKeyhole size={14} color={gold} />
            Your quality proof and payout instructions stay tied to this identity.
          </div>
        </div>
        <div style={{ marginTop: 18 }}>
          <PrimaryButton onClick={onNext} disabled={!farmerId || mobile.length < 8}>
            Send verification code
          </PrimaryButton>
        </div>
        <button type="button" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%", marginTop: 16, background: "none", border: 0, color: olive, fontSize: 11, cursor: "pointer" }}>
          <KeyRound size={13} /> Need help signing in?
        </button>
      </div>
    </ScreenShell>
  );
}

function OtpScreen({
  otp,
  setOtp,
  onNext,
  onBack,
  role,
}: {
  otp: string[];
  setOtp: (otp: string[]) => void;
  onNext: () => void;
  onBack: () => void;
  role: BuyerRole;
}) {
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const updateDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  };
  const handleKey = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };
  const complete = otp.every(Boolean);
  const farmer = role === "farmer";
  return (
    <ScreenShell current="otp" title={farmer ? "Farmer identity check" : "Two-factor check"} eyebrow="02 / Authentication" onBack={onBack} role={role}>
      <div style={{ paddingTop: 22 }}>
        <SectionTitle
          kicker="One-time passcode"
          title={farmer ? "Confirm it’s really your farm desk." : "Confirm it’s really your trade desk."}
          body={`We sent a six-digit code to the mobile ending in 3210. It expires in 01:48.`}
        />
        <div style={{ display: "flex", gap: 7, marginTop: 26 }}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                if (element) inputRefs.current[index] = element;
              }}
              inputMode="numeric"
              aria-label={`OTP digit ${index + 1}`}
              value={digit}
              onChange={(event: ChangeEvent<HTMLInputElement>) => updateDigit(index, event.target.value)}
              onKeyDown={(event) => handleKey(index, event)}
              style={{
                ...baseInputStyle,
                width: "calc((100% - 35px) / 6)",
                height: 57,
                padding: 0,
                textAlign: "center",
                fontSize: 22,
                fontWeight: 800,
                color: digit ? goldBright : parchment,
                borderColor: digit ? "rgba(227,185,95,.68)" : "rgba(212,170,87,.22)",
              }}
            />
          ))}
        </div>
        <div style={{ marginTop: 17, padding: 14, borderRadius: 15, background: "rgba(136,154,107,.08)", border: "1px solid rgba(136,154,107,.18)", display: "flex", alignItems: "center", gap: 9, color: "#c2caab", fontSize: 11, lineHeight: 1.45 }}>
          <Smartphone size={16} color={olive} />
           {farmer ? "Two-factor authentication protects your crop listings, offers and payouts." : "Two-factor authentication protects bids, escrow and settlement actions."}
        </div>
        <div style={{ marginTop: 22 }}>
          <PrimaryButton onClick={onNext} disabled={!complete}>
            Verify and continue
          </PrimaryButton>
        </div>
        <button type="button" onClick={() => setOtp(["", "", "", "", "", ""])} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%", marginTop: 16, background: "none", border: 0, color: olive, fontSize: 11, cursor: "pointer" }}>
          <RefreshCw size={13} /> Resend code
        </button>
      </div>
    </ScreenShell>
  );
}

function KycScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [checks, setChecks] = useState({ license: true, apmc: true, gst: true });
  const allComplete = Object.values(checks).every(Boolean);
  const items = [
    { key: "license" as const, icon: FileCheck2, title: "Mandi trade license", detail: "ML–MH–PUNE–092841 · Valid to 31 Mar 2026" },
    { key: "apmc" as const, icon: Landmark, title: "APMC trader code", detail: "PUN–TRD–4418 · Pune Agricultural Produce Market" },
    { key: "gst" as const, icon: BadgeCheck, title: "GST registration", detail: "27AABCM1234C1Z7 · Maharashtra" },
  ];
  return (
    <ScreenShell current="kyc" title="Verify your desk" eyebrow="03 / KYC" onBack={onBack}>
      <div style={{ paddingTop: 22 }}>
        <SectionTitle kicker="Institutional verification" title="Your route is almost open." body="We use three checks to keep every lot, bid and release accountable to the right organisation." />
        <div style={{ display: "grid", gap: 10 }}>
          {items.map((item) => {
            const complete = checks[item.key];
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={item.key}
                onClick={() => setChecks((current) => ({ ...current, [item.key]: !current[item.key] }))}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: 14,
                  textAlign: "left",
                  borderRadius: 17,
                  background: complete ? "rgba(100,157,103,.1)" : panel,
                  border: `1px solid ${complete ? "rgba(100,157,103,.28)" : "rgba(255,255,255,.1)"}`,
                  color: parchment,
                  cursor: "pointer",
                }}
              >
                <span style={{ ...iconBoxStyle, background: complete ? "rgba(100,157,103,.17)" : "rgba(255,255,255,.05)", color: complete ? "#acd2a5" : muted }}>
                  <Icon size={18} />
                </span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontSize: 12, fontWeight: 800 }}>{item.title}</span>
                  <span style={{ display: "block", marginTop: 4, color: muted, fontSize: 10, lineHeight: 1.35 }}>{item.detail}</span>
                </span>
                <span style={{ width: 22, height: 22, display: "grid", placeItems: "center", borderRadius: "50%", background: complete ? "#77a66f" : "transparent", border: complete ? "0" : "1px solid rgba(255,255,255,.2)", color: ink }}>
                  {complete ? <Check size={14} strokeWidth={3} /> : null}
                </span>
              </button>
            );
          })}
        </div>
        <div style={{ margin: "17px 0 20px", padding: 14, borderRadius: 16, background: panel, border: "1px solid rgba(255,255,255,.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: goldBright, fontSize: 11, fontWeight: 800 }}>
            <Fingerprint size={15} /> Verified organisation
          </div>
          <div style={{ marginTop: 7, color: muted, fontSize: 10, lineHeight: 1.45 }}>Maharashtra Grain Merchants Pvt. Ltd. · Pune, Maharashtra</div>
        </div>
        <PrimaryButton onClick={onNext} disabled={!allComplete} icon={ShieldCheck}>Open buyer workspace</PrimaryButton>
        <div style={{ marginTop: 13, color: "#6f776b", textAlign: "center", fontSize: 10 }}>Tap a check to review its verification record.</div>
      </div>
    </ScreenShell>
  );
}

function FarmerKycScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [checks, setChecks] = useState({ identity: true, farm: true, bank: true });
  const allComplete = Object.values(checks).every(Boolean);
  const items = [
    { key: "identity" as const, icon: BadgeCheck, title: "Kisan identity", detail: "KISAN–MP–20841 · Aadhaar-linked profile" },
    { key: "farm" as const, icon: ScanLine, title: "Farm or FPO record", detail: "18.4 acres · Sehore district · Crop history synced" },
    { key: "bank" as const, icon: Banknote, title: "Payout account", detail: "Account ending 2048 · UPI and bank transfer enabled" },
  ];
  return (
    <ScreenShell current="kyc" title="Verify your farm" eyebrow="03 / Proof" onBack={onBack} role="farmer">
      <div style={{ paddingTop: 22 }}>
        <SectionTitle
          kicker="Supply-side verification"
          title="Make every lot easier to trust."
          body="These checks connect your field record, quality proof and payout account before you list a crop."
        />
        <div style={{ display: "grid", gap: 10 }}>
          {items.map((item) => {
            const complete = checks[item.key];
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={item.key}
                onClick={() => setChecks((current) => ({ ...current, [item.key]: !current[item.key] }))}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: 14,
                  textAlign: "left",
                  borderRadius: 17,
                  background: complete ? "rgba(100,157,103,.1)" : panel,
                  border: `1px solid ${complete ? "rgba(100,157,103,.28)" : "rgba(255,255,255,.1)"}`,
                  color: parchment,
                  cursor: "pointer",
                }}
              >
                <span style={{ ...iconBoxStyle, background: complete ? "rgba(100,157,103,.17)" : "rgba(255,255,255,.05)", color: complete ? "#acd2a5" : muted }}>
                  <Icon size={18} />
                </span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontSize: 12, fontWeight: 800 }}>{item.title}</span>
                  <span style={{ display: "block", marginTop: 4, color: muted, fontSize: 10, lineHeight: 1.35 }}>{item.detail}</span>
                </span>
                <span style={{ width: 22, height: 22, display: "grid", placeItems: "center", borderRadius: "50%", background: complete ? "#77a66f" : "transparent", border: complete ? "0" : "1px solid rgba(255,255,255,.2)", color: ink }}>
                  {complete ? <Check size={14} strokeWidth={3} /> : null}
                </span>
              </button>
            );
          })}
        </div>
        <div style={{ margin: "17px 0 20px", padding: 14, borderRadius: 16, background: panel, border: "1px solid rgba(255,255,255,.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: goldBright, fontSize: 11, fontWeight: 800 }}>
            <Fingerprint size={15} /> Verified grower profile
          </div>
          <div style={{ marginTop: 7, color: muted, fontSize: 10, lineHeight: 1.45 }}>Ramesh Patel · Sehore, Madhya Pradesh · Wheat + soybean</div>
        </div>
        <PrimaryButton onClick={onNext} disabled={!allComplete} icon={ShieldCheck}>Open farmer workspace</PrimaryButton>
        <div style={{ marginTop: 13, color: "#6f776b", textAlign: "center", fontSize: 10 }}>Tap a check to review its record.</div>
      </div>
    </ScreenShell>
  );
}

function DashboardScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <ScreenShell current="dashboard" title="Buyer command desk" eyebrow="04 / Overview" onBack={onBack}>
      <div style={{ paddingTop: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 18 }}>
          <div>
            <div style={{ color: gold, fontSize: 10, textTransform: "uppercase", letterSpacing: ".16em", fontWeight: 800 }}>Good morning, Meera</div>
            <div style={{ marginTop: 6, color: parchment, fontSize: 20, fontWeight: 760, letterSpacing: "-.04em" }}>Let’s place a clean order.</div>
          </div>
          <div style={{ width: 37, height: 37, borderRadius: "50%", display: "grid", placeItems: "center", background: "rgba(212,170,87,.15)", border: "1px solid rgba(212,170,87,.25)", color: goldBright, fontSize: 12, fontWeight: 800 }}>MG</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Metric icon={Gavel} label="Active RFQs" value="04" detail="+2 this week" />
          <Metric icon={Truck} label="Pending arrivals" value="18" detail="312 qtl in transit" tone="olive" />
          <Metric icon={WalletCards} label="Escrow balance" value="₹18.4L" detail="₹6.2L releasing today" tone="green" />
          <Metric icon={Wheat} label="Inventory need" value="1,240" detail="qtl · next 14 days" tone="olive" />
        </div>
        <div style={{ marginTop: 17, padding: 16, borderRadius: 19, background: "linear-gradient(125deg, rgba(212,170,87,.14), rgba(27,33,25,.75))", border: "1px solid rgba(212,170,87,.2)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
              <IconBadge icon={Sparkles} />
              <div>
                <div style={{ color: parchment, fontSize: 12, fontWeight: 800 }}>Market pulse</div>
                <div style={{ marginTop: 3, color: muted, fontSize: 10 }}>Indore · Soybean · 11:40 IST</div>
              </div>
            </div>
            <StatusPill tone="green">+2.4%</StatusPill>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 16 }}>
            <span style={{ color: parchment, fontSize: 25, fontWeight: 800, letterSpacing: "-.04em" }}>₹4,810</span>
            <span style={{ color: muted, fontSize: 11 }}>per qtl · mandi median</span>
          </div>
          <div style={{ marginTop: 12, height: 33, display: "flex", alignItems: "end", gap: 4 }}>
            {[17, 22, 15, 25, 22, 31, 27, 33, 28, 35, 32, 39, 37, 42].map((height, index) => (
              <span key={index} style={{ flex: 1, height, borderRadius: 4, background: index > 9 ? gold : "rgba(212,170,87,.27)" }} />
            ))}
          </div>
        </div>
        <div style={{ marginTop: 19, color: gold, fontSize: 10, textTransform: "uppercase", letterSpacing: ".16em", fontWeight: 800 }}>Needs your attention</div>
        <div style={{ marginTop: 4 }}>
          <ListRow icon={Scale} title="Arrival QC due today" detail="Lot MH-PN-2408 · 82 qtl wheat" tone="olive" right={<StatusPill tone="gold">2h left</StatusPill>} />
          <ListRow icon={FileText} title="Term sheet awaiting signature" detail="RFQ-1042 · Soybean · 3 bids" right={<ChevronRight size={16} color={muted} />} />
        </div>
        <div style={{ marginTop: 21 }}>
          <PrimaryButton onClick={onNext} icon={ArrowRight}>Post a new RFQ</PrimaryButton>
        </div>
      </div>
    </ScreenShell>
  );
}

function FarmerDashboardScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <ScreenShell current="dashboard" title="Farmer command desk" eyebrow="04 / Farm desk" onBack={onBack} role="farmer">
      <div style={{ paddingTop: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 18 }}>
          <div>
            <div style={{ color: gold, fontSize: 10, textTransform: "uppercase", letterSpacing: ".16em", fontWeight: 800 }}>Good morning, Ramesh</div>
            <div style={{ marginTop: 6, color: parchment, fontSize: 20, fontWeight: 760, letterSpacing: "-.04em" }}>Your next lot is looking strong.</div>
          </div>
          <div style={{ width: 37, height: 37, borderRadius: "50%", display: "grid", placeItems: "center", background: "rgba(212,170,87,.15)", border: "1px solid rgba(212,170,87,.25)", color: goldBright, fontSize: 12, fontWeight: 800 }}>RP</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Metric icon={Sprout} label="Active crop lots" value="03" detail="1 ready to list" />
          <Metric icon={Wheat} label="Projected harvest" value="248" detail="qtl · next 21 days" tone="olive" />
          <Metric icon={Handshake} label="Offers in range" value="05" detail="₹2,340 / qtl median" tone="green" />
          <Metric icon={WalletCards} label="Payout pending" value="₹6.8L" detail="2 contracts active" tone="olive" />
        </div>
        <div style={{ marginTop: 17, padding: 16, borderRadius: 19, background: "linear-gradient(125deg, rgba(212,170,87,.14), rgba(27,33,25,.75))", border: "1px solid rgba(212,170,87,.2)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
              <IconBadge icon={Sparkles} />
              <div>
                <div style={{ color: parchment, fontSize: 12, fontWeight: 800 }}>Field signal</div>
                <div style={{ marginTop: 3, color: muted, fontSize: 10 }}>Wheat · Block C · Sentinel-2 scan</div>
              </div>
            </div>
            <StatusPill tone="green">Healthy</StatusPill>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 16 }}>
            <span style={{ color: parchment, fontSize: 25, fontWeight: 800, letterSpacing: "-.04em" }}>0.84</span>
            <span style={{ color: muted, fontSize: 11 }}>NDVI health score</span>
          </div>
          <div style={{ marginTop: 12, height: 5, borderRadius: 9, background: "rgba(255,255,255,.08)", overflow: "hidden" }}>
            <span style={{ display: "block", width: "84%", height: "100%", borderRadius: 9, background: "linear-gradient(90deg, #82985f, #d4aa57)" }} />
          </div>
        </div>
        <div style={{ marginTop: 19, color: gold, fontSize: 10, textTransform: "uppercase", letterSpacing: ".16em", fontWeight: 800 }}>Needs your attention</div>
        <div style={{ marginTop: 4 }}>
          <ListRow icon={Gavel} title="New buyer offer" detail="Maharashtra Grain Merchants · 80 qtl wheat" tone="olive" right={<StatusPill tone="gold">Review</StatusPill>} />
          <ListRow icon={Route} title="Pickup window confirmed" detail="Nashik APMC · 20 Jun · 06:30 IST" right={<ChevronRight size={16} color={muted} />} />
        </div>
        <div style={{ marginTop: 21 }}>
          <PrimaryButton onClick={onNext} icon={ArrowRight}>List a crop lot</PrimaryButton>
        </div>
      </div>
    </ScreenShell>
  );
}

function RfqScreen({
  commodity,
  setCommodity,
  quantity,
  setQuantity,
  maxPrice,
  setMaxPrice,
  moisture,
  setMoisture,
  onNext,
  onBack,
}: {
  commodity: string;
  setCommodity: (value: string) => void;
  quantity: string;
  setQuantity: (value: string) => void;
  maxPrice: string;
  setMaxPrice: (value: string) => void;
  moisture: string;
  setMoisture: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <ScreenShell current="rfq" title="Create RFQ" eyebrow="05 / Source" onBack={onBack}>
      <div style={{ paddingTop: 20 }}>
        <SectionTitle kicker="Demand brief" title="Tell the mandi what you need." body="Publish a clear buying window. Verified lots will flow into your live bid room." />
        <div style={{ display: "grid", gap: 15, padding: 17, borderRadius: 20, background: panel, border: "1px solid rgba(255,255,255,.07)" }}>
          <label>
            <span style={{ display: "block", marginBottom: 8, color: "#bec3b1", fontSize: 11, fontWeight: 700 }}>Commodity</span>
            <select value={commodity} onChange={(event) => setCommodity(event.target.value)} style={{ ...baseInputStyle, appearance: "none" }}>
              <option value="Soybean">Soybean</option>
              <option value="Wheat">Wheat</option>
              <option value="Tur">Tur dal</option>
              <option value="Maize">Maize</option>
            </select>
          </label>
          <Field label="Required quantity" value={quantity} onChange={setQuantity} placeholder="500" type="number" suffix="quintals" />
          <Field label="Maximum landed price" value={maxPrice} onChange={setMaxPrice} placeholder="4,850" type="number" suffix="₹ / qtl" />
          <Field label="Acceptable moisture" value={moisture} onChange={setMoisture} placeholder="12" type="number" suffix="%" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 9, margin: "15px 0 20px", color: muted, fontSize: 10 }}>
          <MapPin size={14} color={gold} /> Delivery cluster · Pune APMC + 80 km
          <button type="button" style={{ marginLeft: "auto", border: 0, background: "none", color: goldBright, fontSize: 10, fontWeight: 700, cursor: "pointer" }}>Edit</button>
        </div>
        <PrimaryButton onClick={onNext} disabled={!commodity || !quantity || !maxPrice || !moisture} icon={Gavel}>Publish RFQ</PrimaryButton>
        <div style={{ marginTop: 13, color: "#6f776b", textAlign: "center", fontSize: 10 }}>Your ceiling price stays private until the bid room opens.</div>
      </div>
    </ScreenShell>
  );
}

function FarmerLotScreen({
  crop,
  setCrop,
  quantity,
  setQuantity,
  askingPrice,
  setAskingPrice,
  harvestDate,
  setHarvestDate,
  onNext,
  onBack,
}: {
  crop: string;
  setCrop: (value: string) => void;
  quantity: string;
  setQuantity: (value: string) => void;
  askingPrice: string;
  setAskingPrice: (value: string) => void;
  harvestDate: string;
  setHarvestDate: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <ScreenShell current="rfq" title="List a crop lot" eyebrow="05 / Supply" onBack={onBack} role="farmer">
      <div style={{ paddingTop: 20 }}>
        <SectionTitle kicker="Verified crop listing" title="Give buyers a lot they can act on." body="Add the harvest details once. Quality proof and buyer offers stay connected to this lot." />
        <div style={{ display: "grid", gap: 15, padding: 17, borderRadius: 20, background: panel, border: "1px solid rgba(255,255,255,.07)" }}>
          <label>
            <span style={{ display: "block", marginBottom: 8, color: "#bec3b1", fontSize: 11, fontWeight: 700 }}>Crop</span>
            <select value={crop} onChange={(event) => setCrop(event.target.value)} style={{ ...baseInputStyle, appearance: "none" }}>
              <option value="Wheat">Wheat</option>
              <option value="Soybean">Soybean</option>
              <option value="Maize">Maize</option>
              <option value="Tur dal">Tur dal</option>
            </select>
          </label>
          <Field label="Expected quantity" value={quantity} onChange={setQuantity} placeholder="80" type="number" suffix="quintals" />
          <Field label="Target price" value={askingPrice} onChange={setAskingPrice} placeholder="2,340" type="number" suffix="₹ / qtl" />
          <Field label="Ready from" value={harvestDate} onChange={setHarvestDate} placeholder="20 Jun 2025" suffix="date" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 9, margin: "15px 0 20px", color: muted, fontSize: 10 }}>
          <CalendarDays size={14} color={gold} /> Sehore collection cluster · pickup supported
          <button type="button" style={{ marginLeft: "auto", border: 0, background: "none", color: goldBright, fontSize: 10, fontWeight: 700, cursor: "pointer" }}>Edit</button>
        </div>
        <PrimaryButton onClick={onNext} disabled={!crop || !quantity || !askingPrice || !harvestDate} icon={Gavel}>Publish crop lot</PrimaryButton>
        <div style={{ marginTop: 13, color: "#6f776b", textAlign: "center", fontSize: 10 }}>Your verified field record appears beside the lot for buyers.</div>
      </div>
    </ScreenShell>
  );
}

type Bid = {
  id: string;
  name: string;
  location: string;
  quantity: string;
  price: string;
  moisture: string;
  eta: string;
  tone: "gold" | "olive" | "green";
};

const bids: Bid[] = [
  { id: "MH-28", name: "KisanSetu FPO", location: "Washim, Maharashtra", quantity: "180 qtl", price: "₹4,720", moisture: "11.4%", eta: "Tomorrow · 08:30", tone: "gold" },
  { id: "MP-14", name: "Narmada Agro Traders", location: "Dewas, Madhya Pradesh", quantity: "240 qtl", price: "₹4,790", moisture: "10.8%", eta: "18 Jun · 12:00", tone: "green" },
  { id: "MH-31", name: "Sahyadri Harvest Co.", location: "Satara, Maharashtra", quantity: "120 qtl", price: "₹4,680", moisture: "12.1%", eta: "Tomorrow · 16:45", tone: "olive" },
];

function BidsScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [selected, setSelected] = useState(bids[0].id);
  const [counterOpen, setCounterOpen] = useState(false);
  const [counter, setCounter] = useState("4,700");
  const [counterSent, setCounterSent] = useState(false);
  const activeBid = bids.find((bid) => bid.id === selected) ?? bids[0];
  return (
    <ScreenShell current="bids" title="Live bid room" eyebrow="06 / Discover" onBack={onBack}>
      <div style={{ paddingTop: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <SectionTitle kicker="RFQ-1048 · Soybean" title="Three lots are in range." body="Select a term sheet to review quality, route and commercial terms." />
          <StatusPill tone="green">Live 02:18:40</StatusPill>
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {bids.map((bid) => {
            const chosen = bid.id === selected;
            return (
              <button
                type="button"
                key={bid.id}
                onClick={() => {
                  setSelected(bid.id);
                  setCounterSent(false);
                }}
                style={{
                  width: "100%",
                  padding: 15,
                  textAlign: "left",
                  borderRadius: 18,
                  border: chosen ? "1px solid rgba(227,185,95,.7)" : "1px solid rgba(255,255,255,.08)",
                  background: chosen ? "linear-gradient(145deg, rgba(212,170,87,.14), rgba(27,33,25,.9))" : panel,
                  color: parchment,
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <IconBadge icon={bid.tone === "green" ? PackageCheck : Store} tone={bid.tone} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 800 }}>{bid.name}</div>
                    <div style={{ marginTop: 3, color: muted, fontSize: 10 }}>{bid.location} · {bid.quantity}</div>
                  </div>
                  <span style={{ width: 20, height: 20, borderRadius: "50%", border: chosen ? "5px solid #d4aa57" : "1px solid rgba(255,255,255,.25)", background: chosen ? "rgba(18,21,17,.8)" : "transparent" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr", gap: 9, marginTop: 15, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,.07)" }}>
                  <div><div style={{ color: muted, fontSize: 9, textTransform: "uppercase", letterSpacing: ".08em" }}>Offer</div><div style={{ marginTop: 4, color: goldBright, fontSize: 14, fontWeight: 800 }}>{bid.price}</div></div>
                  <div><div style={{ color: muted, fontSize: 9, textTransform: "uppercase", letterSpacing: ".08em" }}>Moisture</div><div style={{ marginTop: 4, color: parchment, fontSize: 12, fontWeight: 700 }}>{bid.moisture}</div></div>
                  <div><div style={{ color: muted, fontSize: 9, textTransform: "uppercase", letterSpacing: ".08em" }}>Arrival</div><div style={{ marginTop: 4, color: parchment, fontSize: 10, fontWeight: 700 }}>{bid.eta}</div></div>
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: 14, padding: 14, borderRadius: 17, background: "rgba(136,154,107,.08)", border: "1px solid rgba(136,154,107,.18)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#d1d7bb", fontSize: 11, fontWeight: 800 }}><FileText size={15} color={olive} /> Selected term sheet · {activeBid.id}</div>
          <div style={{ marginTop: 5, color: muted, fontSize: 10 }}>Escrow hold ₹2.12L · digital delivery receipt · APMC-compliant invoice</div>
        </div>
        {counterOpen ? (
          <div style={{ display: "flex", alignItems: "end", gap: 9, marginTop: 12 }}>
            <div style={{ flex: 1 }}><Field label={`Counter ${activeBid.name}`} value={counter} onChange={setCounter} suffix="₹ / qtl" /></div>
            <button type="button" onClick={() => { setCounterOpen(false); setCounterSent(true); }} style={{ height: 46, padding: "0 14px", borderRadius: 13, border: "1px solid rgba(212,170,87,.35)", background: "rgba(212,170,87,.12)", color: goldBright, fontSize: 11, fontWeight: 800, cursor: "pointer" }}>Send</button>
          </div>
        ) : null}
        {counterSent ? <div style={{ marginTop: 10, color: "#afd2a4", fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}><CheckCircle2 size={14} /> Counter sent · awaiting seller response</div> : null}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.25fr", gap: 10, marginTop: 18 }}>
          <PrimaryButton onClick={() => setCounterOpen((open) => !open)} icon={RefreshCw} variant="outline">{counterOpen ? "Close counter" : "Counter offer"}</PrimaryButton>
          <PrimaryButton onClick={async () => { await handleGenerateContract("KisanSetu FPO", "Maharashtra Grain Merchants", "Soybean", 180); onNext(); }} icon={ArrowRight}>Accept term sheet</PrimaryButton>
        </div>
      </div>
    </ScreenShell>
  );
}

const farmerOffers = [
  { id: "RFQ-1042", name: "Maharashtra Grain Merchants", location: "Pune, Maharashtra", quantity: "80 qtl", price: "₹2,380", pickup: "20 Jun · 06:30", tone: "gold" as const },
  { id: "RFQ-1047", name: "Narmada Foods Pvt. Ltd.", location: "Indore, Madhya Pradesh", quantity: "120 qtl", price: "₹2,315", pickup: "22 Jun · 08:00", tone: "green" as const },
  { id: "RFQ-1038", name: "Sahyadri Staples", location: "Nashik, Maharashtra", quantity: "60 qtl", price: "₹2,290", pickup: "21 Jun · 10:15", tone: "olive" as const },
];

function FarmerOffersScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [selected, setSelected] = useState(farmerOffers[0].id);
  const [counterOpen, setCounterOpen] = useState(false);
  const [counter, setCounter] = useState("2,360");
  const [counterSent, setCounterSent] = useState(false);
  const activeOffer = farmerOffers.find((offer) => offer.id === selected) ?? farmerOffers[0];
  return (
    <ScreenShell current="bids" title="Buyer offers" eyebrow="06 / Choose" onBack={onBack} role="farmer">
      <div style={{ paddingTop: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <SectionTitle kicker="Lot WHT–SEH–042" title="Your harvest is in range." body="Review verified buyer terms, then accept or send a counter offer." />
          <StatusPill tone="green">05 offers</StatusPill>
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {farmerOffers.map((offer) => {
            const chosen = offer.id === selected;
            return (
              <button
                type="button"
                key={offer.id}
                onClick={() => {
                  setSelected(offer.id);
                  setCounterSent(false);
                }}
                style={{
                  width: "100%",
                  padding: 15,
                  textAlign: "left",
                  borderRadius: 18,
                  border: chosen ? "1px solid rgba(227,185,95,.7)" : "1px solid rgba(255,255,255,.08)",
                  background: chosen ? "linear-gradient(145deg, rgba(212,170,87,.14), rgba(27,33,25,.9))" : panel,
                  color: parchment,
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <IconBadge icon={offer.tone === "green" ? PackageCheck : Store} tone={offer.tone} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 800 }}>{offer.name}</div>
                    <div style={{ marginTop: 3, color: muted, fontSize: 10 }}>{offer.location} · {offer.quantity}</div>
                  </div>
                  <span style={{ width: 20, height: 20, borderRadius: "50%", border: chosen ? "5px solid #d4aa57" : "1px solid rgba(255,255,255,.25)", background: chosen ? "rgba(18,21,17,.8)" : "transparent" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 9, marginTop: 15, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,.07)" }}>
                  <div><div style={{ color: muted, fontSize: 9, textTransform: "uppercase", letterSpacing: ".08em" }}>Offer</div><div style={{ marginTop: 4, color: goldBright, fontSize: 14, fontWeight: 800 }}>{offer.price}</div></div>
                  <div><div style={{ color: muted, fontSize: 9, textTransform: "uppercase", letterSpacing: ".08em" }}>Pickup</div><div style={{ marginTop: 4, color: parchment, fontSize: 10, fontWeight: 700 }}>{offer.pickup}</div></div>
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: 14, padding: 14, borderRadius: 17, background: "rgba(136,154,107,.08)", border: "1px solid rgba(136,154,107,.18)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#d1d7bb", fontSize: 11, fontWeight: 800 }}><FileText size={15} color={olive} /> Selected buyer · {activeOffer.id}</div>
          <div style={{ marginTop: 5, color: muted, fontSize: 10 }}>Escrow funded · digital pickup receipt · quality terms visible before acceptance</div>
        </div>
        {counterOpen ? (
          <div style={{ display: "flex", alignItems: "end", gap: 9, marginTop: 12 }}>
            <div style={{ flex: 1 }}><Field label={`Counter ${activeOffer.name}`} value={counter} onChange={setCounter} suffix="₹ / qtl" /></div>
            <button type="button" onClick={() => { setCounterOpen(false); setCounterSent(true); }} style={{ height: 46, padding: "0 14px", borderRadius: 13, border: "1px solid rgba(212,170,87,.35)", background: "rgba(212,170,87,.12)", color: goldBright, fontSize: 11, fontWeight: 800, cursor: "pointer" }}>Send</button>
          </div>
        ) : null}
        {counterSent ? <div style={{ marginTop: 10, color: "#afd2a4", fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}><CheckCircle2 size={14} /> Counter sent · awaiting buyer response</div> : null}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.25fr", gap: 10, marginTop: 18 }}>
          <PrimaryButton onClick={() => setCounterOpen((open) => !open)} icon={RefreshCw} variant="outline">{counterOpen ? "Close counter" : "Counter offer"}</PrimaryButton>
          <PrimaryButton onClick={async () => { await handleGenerateContract("Ramesh Patel", "Maharashtra Grain Merchants", "Wheat", 80); onNext(); }} icon={ArrowRight}>Accept buyer</PrimaryButton>
        </div>
      </div>
    </ScreenShell>
  );
}

function QcScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [decision, setDecision] = useState<QcDecision>("approve");
  const [weight, setWeight] = useState("178.6");
  const [moisture, setMoisture] = useState("11.8");
  const [deduction, setDeduction] = useState("1,842");
  const deductions = decision === "deduct";
  return (
    <ScreenShell current="qc" title="Inward quality check" eyebrow="07 / Receive" onBack={onBack}>
      <div style={{ paddingTop: 20 }}>
        <SectionTitle kicker="Lot MH-28 · KisanSetu FPO" title="Inspect before you release." body="Record the weighbridge reading and grade against the term sheet agreed in the bid room." />
        <div style={{ display: "flex", alignItems: "center", gap: 11, padding: 14, borderRadius: 17, background: panelRaised, border: "1px solid rgba(255,255,255,.07)" }}>
          <div style={{ width: 62, height: 62, borderRadius: 14, background: "linear-gradient(145deg, rgba(212,170,87,.34), rgba(212,170,87,.06))", display: "grid", placeItems: "center" }}><Wheat size={26} color={goldBright} /></div>
          <div style={{ flex: 1 }}><div style={{ color: parchment, fontSize: 13, fontWeight: 800 }}>Soybean · Grade FAQ</div><div style={{ marginTop: 5, color: muted, fontSize: 10 }}>Expected 180 qtl · ₹4,720 / qtl · Pune APMC</div></div>
          <StatusPill tone="gold">Dock 04</StatusPill>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
          <Field label="Weighbridge weight" value={weight} onChange={setWeight} suffix="qtl" />
          <Field label="Moisture reading" value={moisture} onChange={setMoisture} suffix="%" />
        </div>
        <div style={{ marginTop: 17, color: gold, fontSize: 10, textTransform: "uppercase", letterSpacing: ".16em", fontWeight: 800 }}>Inspection verdict</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginTop: 9 }}>
          <button type="button" onClick={() => setDecision("approve")} style={{ minHeight: 82, borderRadius: 16, border: decision === "approve" ? "1px solid rgba(112,170,110,.65)" : "1px solid rgba(255,255,255,.09)", background: decision === "approve" ? "rgba(100,157,103,.13)" : panel, color: parchment, cursor: "pointer" }}>
            <CheckCircle2 size={20} color={decision === "approve" ? "#add4a8" : muted} />
            <div style={{ marginTop: 7, fontSize: 11, fontWeight: 800 }}>Approve lot</div>
            <div style={{ marginTop: 3, color: muted, fontSize: 9 }}>Within agreed terms</div>
          </button>
          <button type="button" onClick={() => setDecision("deduct")} style={{ minHeight: 82, borderRadius: 16, border: decision === "deduct" ? "1px solid rgba(213,131,101,.7)" : "1px solid rgba(255,255,255,.09)", background: decision === "deduct" ? "rgba(213,131,101,.12)" : panel, color: parchment, cursor: "pointer" }}>
            <Scale size={20} color={decision === "deduct" ? "#e5a38d" : muted} />
            <div style={{ marginTop: 7, fontSize: 11, fontWeight: 800 }}>Deduct & approve</div>
            <div style={{ marginTop: 3, color: muted, fontSize: 9 }}>Apply quality adjustment</div>
          </button>
        </div>
        {deductions ? <div style={{ marginTop: 13 }}><Field label="Quality deduction" value={deduction} onChange={setDeduction} suffix="₹" /></div> : null}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 17, color: muted, fontSize: 10 }}><ClipboardCheck size={14} color={gold} /> Inspection log · Meera G. · 18 Jun 2025, 11:44 IST</div>
        <div style={{ marginTop: 20 }}><PrimaryButton onClick={onNext} icon={ReceiptIndianRupee}>{deductions ? "Apply deduction & continue" : "Approve & create receipt"}</PrimaryButton></div>
      </div>
    </ScreenShell>
  );
}

function FarmerProofScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [scan, setScan] = useState(false);
  return (
    <ScreenShell current="qc" title="Proof of quality" eyebrow="07 / Certify" onBack={onBack} role="farmer">
      <div style={{ paddingTop: 20 }}>
        <SectionTitle kicker="Lot WHT–SEH–042 · Wheat" title="Give the buyer a clear signal." body="A quick field and grain check turns your listing into a verified, easier-to-settle lot." />
        <div style={{ padding: 16, borderRadius: 20, background: "linear-gradient(145deg, rgba(212,170,87,.14), rgba(27,33,25,.88))", border: "1px solid rgba(212,170,87,.25)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <IconBadge icon={ScanLine} />
            <div style={{ flex: 1 }}>
              <div style={{ color: parchment, fontSize: 13, fontWeight: 800 }}>BioTrace field scan</div>
              <div style={{ marginTop: 4, color: muted, fontSize: 10 }}>Block C · Sentinel-2 imagery · synced 11:36 IST</div>
            </div>
            <StatusPill tone="green">{scan ? "Captured" : "Ready"}</StatusPill>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginTop: 17 }}>
            <div style={{ padding: 12, borderRadius: 14, background: "rgba(18,21,17,.6)", border: "1px solid rgba(255,255,255,.08)" }}><div style={{ color: muted, fontSize: 9, textTransform: "uppercase", letterSpacing: ".08em" }}>Crop health</div><div style={{ marginTop: 5, color: goldBright, fontSize: 20, fontWeight: 800 }}>0.84</div><div style={{ marginTop: 3, color: "#add4a8", fontSize: 10 }}>Healthy</div></div>
            <div style={{ padding: 12, borderRadius: 14, background: "rgba(18,21,17,.6)", border: "1px solid rgba(255,255,255,.08)" }}><div style={{ color: muted, fontSize: 9, textTransform: "uppercase", letterSpacing: ".08em" }}>Moisture estimate</div><div style={{ marginTop: 5, color: goldBright, fontSize: 20, fontWeight: 800 }}>11.6%</div><div style={{ marginTop: 3, color: "#add4a8", fontSize: 10 }}>Within buyer range</div></div>
          </div>
          <button type="button" onClick={() => setScan(true)} style={{ width: "100%", marginTop: 15, minHeight: 44, borderRadius: 13, border: "1px solid rgba(212,170,87,.32)", background: "rgba(212,170,87,.1)", color: goldBright, fontSize: 11, fontWeight: 800, cursor: "pointer" }}>
            {scan ? "Field proof captured" : "Capture field proof"}
          </button>
        </div>
        <div style={{ marginTop: 17, color: gold, fontSize: 10, textTransform: "uppercase", letterSpacing: ".16em", fontWeight: 800 }}>Diagnostic result</div>
        <div style={{ marginTop: 9 }}>
          <ListRow icon={BadgeCheck} title="Grade FAQ · Clean grain" detail="Visual inspection passed · no visible damage signal" tone="green" right={<Check size={16} color="#a8d2a5" />} />
          <ListRow icon={CloudSun} title="Harvest window" detail="Ready from 20 Jun · forecast remains dry" tone="olive" right={<StatusPill tone="olive">Stable</StatusPill>} />
          <ListRow icon={Truck} title="Pickup route" detail="Sehore farm → Pune APMC · 640 km" right={<StatusPill tone="gold">Planned</StatusPill>} />
        </div>
        <div style={{ marginTop: 20 }}>
          <PrimaryButton onClick={onNext} disabled={!scan} icon={PackageCheck}>Create verified lot</PrimaryButton>
        </div>
        <div style={{ marginTop: 13, color: "#6f776b", textAlign: "center", fontSize: 10 }}>The buyer sees this proof before accepting your offer.</div>
      </div>
    </ScreenShell>
  );
}

function SettlementScreen({ onBack }: { onBack: () => void }) {
  const [released, setReleased] = useState(false);
  return (
    <ScreenShell current="settlement" title="Settlement centre" eyebrow="08 / Complete" onBack={onBack}>
      <div style={{ paddingTop: 20 }}>
        {!released ? (
          <>
            <SectionTitle kicker="Escrow milestone" title="Release the lot. Close the loop." body="The QC record is ready. Release the balance to the seller and generate the digital delivery receipt." />
            <div style={{ padding: 17, borderRadius: 20, background: "linear-gradient(145deg, rgba(212,170,87,.14), rgba(27,33,25,.9))", border: "1px solid rgba(212,170,87,.25)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div><div style={{ color: muted, fontSize: 10, textTransform: "uppercase", letterSpacing: ".12em" }}>Release amount</div><div style={{ marginTop: 7, color: goldBright, fontSize: 30, fontWeight: 800, letterSpacing: "-.06em" }}>₹8,42,992</div></div>
                <IconBadge icon={CircleDollarSign} />
              </div>
              <div style={{ display: "grid", gap: 9, marginTop: 17, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,.1)" }}>
                 <div style={{ display: "flex", justifyContent: "space-between", color: muted, fontSize: 11 }}><span>178.6 qtl × ₹4,720</span><span style={{ color: parchment }}>₹8,43,392</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", color: muted, fontSize: 11 }}><span>QC adjustment</span><span style={{ color: "#add4a8" }}>− ₹1,420</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", color: muted, fontSize: 11 }}><span>Escrow fee</span><span style={{ color: parchment }}>₹400</span></div>
              </div>
            </div>
            <div style={{ marginTop: 14, display: "grid", gap: 9 }}>
              <ListRow icon={ShieldCheck} title="Escrow funded" detail="Milestone 1 of 1 · funds secured" tone="green" right={<Check size={16} color="#a8d2a5" />} />
              <ListRow icon={PackageCheck} title="Digital delivery receipt" detail="DR–MH28–180625 · QC approved" tone="olive" right={<Check size={16} color="#a8d2a5" />} />
              <ListRow icon={FileText} title="Tax invoice" detail="Ready to generate · GST 27AABCM1234C1Z7" right={<StatusPill tone="gold">Ready</StatusPill>} />
            </div>
            <div style={{ marginTop: 20 }}><PrimaryButton onClick={() => setReleased(true)} icon={Banknote}>Release escrow & generate invoice</PrimaryButton></div>
            <div style={{ marginTop: 13, color: "#6f776b", textAlign: "center", fontSize: 10 }}>This action is protected by your verified trade desk identity.</div>
          </>
        ) : (
          <div style={{ paddingTop: 24, textAlign: "center" }}>
            <div style={{ width: 78, height: 78, margin: "0 auto", borderRadius: "50%", display: "grid", placeItems: "center", background: "rgba(100,157,103,.16)", border: "1px solid rgba(130,190,122,.45)", color: "#b8dfad", boxShadow: "0 0 0 11px rgba(100,157,103,.045)" }}><CheckCircle2 size={39} strokeWidth={1.6} /></div>
            <div style={{ marginTop: 26, color: gold, fontSize: 10, textTransform: "uppercase", letterSpacing: ".18em", fontWeight: 800 }}>Settlement complete</div>
            <h1 style={{ margin: "10px auto 0", maxWidth: 330, color: parchment, fontSize: 29, lineHeight: 1.06, letterSpacing: "-.055em" }}>One clean handoff, recorded.</h1>
            <p style={{ margin: "13px auto 0", maxWidth: 300, color: muted, fontSize: 12, lineHeight: 1.55 }}>₹8,42,992 has been released to KisanSetu FPO. Your invoice and delivery receipt are ready to share.</p>
            <div style={{ marginTop: 25, padding: 16, textAlign: "left", borderRadius: 18, background: panel, border: "1px solid rgba(100,157,103,.2)" }}>
              <ListRow icon={Banknote} title="Escrow released" detail="18 Jun 2025 · 11:48 IST" tone="green" right={<StatusPill tone="green">Paid</StatusPill>} />
              <ListRow icon={ReceiptIndianRupee} title="Invoice INV–MH28–180625" detail="Download or send to finance" tone="olive" right={<ChevronRight size={16} color={muted} />} />
              <ListRow icon={FileCheck2} title="Delivery receipt DR–MH28–180625" detail="Stored in your audit trail" right={<ChevronRight size={16} color={muted} />} />
            </div>
            <button type="button" onClick={() => setReleased(false)} style={{ marginTop: 19, border: 0, background: "none", color: olive, fontSize: 11, cursor: "pointer" }}>View settlement summary again</button>
          </div>
        )}
      </div>
    </ScreenShell>
  );
}

function FarmerPayoutScreen({ onBack }: { onBack: () => void }) {
  const [released, setReleased] = useState(false);
  return (
    <ScreenShell current="settlement" title="Payout centre" eyebrow="08 / Complete" onBack={onBack} role="farmer">
      <div style={{ paddingTop: 20 }}>
        {!released ? (
          <>
            <SectionTitle kicker="Escrow milestone" title="Turn a good lot into a clean payout." body="Your buyer accepted the quality proof. Release the delivery milestone and keep the receipt in your records." />
            <div style={{ padding: 17, borderRadius: 20, background: "linear-gradient(145deg, rgba(212,170,87,.14), rgba(27,33,25,.9))", border: "1px solid rgba(212,170,87,.25)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div><div style={{ color: muted, fontSize: 10, textTransform: "uppercase", letterSpacing: ".12em" }}>Payout amount</div><div style={{ marginTop: 7, color: goldBright, fontSize: 30, fontWeight: 800, letterSpacing: "-.06em" }}>₹1,90,400</div></div>
                <IconBadge icon={HandCoins} />
              </div>
              <div style={{ display: "grid", gap: 9, marginTop: 17, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,.1)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: muted, fontSize: 11 }}><span>80 qtl × ₹2,380</span><span style={{ color: parchment }}>₹1,90,400</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", color: muted, fontSize: 11 }}><span>Route support</span><span style={{ color: "#add4a8" }}>Included</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", color: muted, fontSize: 11 }}><span>Escrow fee</span><span style={{ color: parchment }}>₹240</span></div>
              </div>
            </div>
            <div style={{ marginTop: 14, display: "grid", gap: 9 }}>
              <ListRow icon={ShieldCheck} title="Buyer funds secured" detail="Milestone 1 of 1 · Maharashtra Grain Merchants" tone="green" right={<Check size={16} color="#a8d2a5" />} />
              <ListRow icon={PackageCheck} title="Digital delivery receipt" detail="DR–WHT42–200625 · quality proof attached" tone="olive" right={<Check size={16} color="#a8d2a5" />} />
              <ListRow icon={BadgeIndianRupee} title="Payout account" detail="Account ending 2048 · release ready" right={<StatusPill tone="gold">Ready</StatusPill>} />
            </div>
            <div style={{ marginTop: 20 }}><PrimaryButton onClick={() => setReleased(true)} icon={Banknote}>Release payout & receipt</PrimaryButton></div>
            <div style={{ marginTop: 13, color: "#6f776b", textAlign: "center", fontSize: 10 }}>This action is protected by your verified farmer identity.</div>
          </>
        ) : (
          <div style={{ paddingTop: 24, textAlign: "center" }}>
            <div style={{ width: 78, height: 78, margin: "0 auto", borderRadius: "50%", display: "grid", placeItems: "center", background: "rgba(100,157,103,.16)", border: "1px solid rgba(130,190,122,.45)", color: "#b8dfad", boxShadow: "0 0 0 11px rgba(100,157,103,.045)" }}><CheckCircle2 size={39} strokeWidth={1.6} /></div>
            <div style={{ marginTop: 26, color: gold, fontSize: 10, textTransform: "uppercase", letterSpacing: ".18em", fontWeight: 800 }}>Payout complete</div>
            <h1 style={{ margin: "10px auto 0", maxWidth: 330, color: parchment, fontSize: 29, lineHeight: 1.06, letterSpacing: "-.055em" }}>Your harvest has a paper trail.</h1>
            <p style={{ margin: "13px auto 0", maxWidth: 300, color: muted, fontSize: 12, lineHeight: 1.55 }}>₹1,90,160 is scheduled to account ending 2048. The receipt and quality proof are ready to share.</p>
            <div style={{ marginTop: 25, padding: 16, textAlign: "left", borderRadius: 18, background: panel, border: "1px solid rgba(100,157,103,.2)" }}>
              <ListRow icon={Banknote} title="Payout released" detail="20 Jun 2025 · 11:48 IST" tone="green" right={<StatusPill tone="green">Paid</StatusPill>} />
              <ListRow icon={ReceiptIndianRupee} title="Delivery receipt DR–WHT42–200625" detail="Share with your FPO or accountant" tone="olive" right={<ChevronRight size={16} color={muted} />} />
              <ListRow icon={FileCheck2} title="Quality proof certificate" detail="Stored in your crop record" right={<ChevronRight size={16} color={muted} />} />
            </div>
            <button type="button" onClick={() => setReleased(false)} style={{ marginTop: 19, border: 0, background: "none", color: olive, fontSize: 11, cursor: "pointer" }}>View payout summary again</button>
          </div>
        )}
      </div>
    </ScreenShell>
  );
}


export function BuyerFlow() {
  const [contractData, setContractData] = useState(null);
  
  const handleGenerateContract = async (fpo, buyer, crop, tons) => {
    try {
      const res = await fetch("http://localhost:8000/api/contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fpo, buyer, crop, tons: parseInt(tons) || 50 })
      });
      const data = await res.json();
      setContractData(data.contract);
      console.log("Contract generated:", data.contract);
    } catch (e) {
      console.error("API Error:", e);
    }
  };

  const [screen, setScreen] = useState<FlowScreen>("welcome");
  const [role, setRole] = useState<BuyerRole>("buyer");
  const [corporateId, setCorporateId] = useState("27AABCM1234C1Z7");
  const [farmerId, setFarmerId] = useState("KISAN-MP-20841");
  const [mobile, setMobile] = useState("+91 98 7654 3210");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [commodity, setCommodity] = useState("Soybean");
  const [quantity, setQuantity] = useState("500");
  const [maxPrice, setMaxPrice] = useState("4,850");
  const [moisture, setMoisture] = useState("12");
  const [farmerCrop, setFarmerCrop] = useState("Wheat");
  const [harvestQuantity, setHarvestQuantity] = useState("80");
  const [askingPrice, setAskingPrice] = useState("2,340");
  const [harvestDate, setHarvestDate] = useState("20 Jun 2025");

  const back = () => {
    const index = screens.indexOf(screen);
    if (index > 0) setScreen(screens[index - 1]);
  };

  if (screen === "welcome") {
    return <WelcomeScreen role={role} setRole={setRole} onStart={() => setScreen("login")} />;
  }
  if (screen === "login") {
    if (role === "farmer") {
      return <FarmerLoginScreen farmerId={farmerId} setFarmerId={setFarmerId} mobile={mobile} setMobile={setMobile} onNext={() => setScreen("otp")} onBack={back} />;
    }
    return <LoginScreen corporateId={corporateId} setCorporateId={setCorporateId} mobile={mobile} setMobile={setMobile} onNext={() => setScreen("otp")} onBack={back} />;
  }
  if (screen === "otp") {
    return <OtpScreen otp={otp} setOtp={setOtp} onNext={() => setScreen("kyc")} onBack={back} role={role} />;
  }
  if (screen === "kyc") {
    if (role === "farmer") {
      return <FarmerKycScreen onNext={() => setScreen("dashboard")} onBack={back} />;
    }
    return <KycScreen onNext={() => setScreen("dashboard")} onBack={back} />;
  }
  if (screen === "dashboard") {
    if (role === "farmer") {
      return <FarmerDashboardScreen onNext={() => setScreen("rfq")} onBack={back} />;
    }
    return <DashboardScreen onNext={() => setScreen("rfq")} onBack={back} />;
  }
  if (screen === "rfq") {
    if (role === "farmer") {
      return <FarmerLotScreen crop={farmerCrop} setCrop={setFarmerCrop} quantity={harvestQuantity} setQuantity={setHarvestQuantity} askingPrice={askingPrice} setAskingPrice={setAskingPrice} harvestDate={harvestDate} setHarvestDate={setHarvestDate} onNext={() => setScreen("bids")} onBack={back} />;
    }
    return <RfqScreen commodity={commodity} setCommodity={setCommodity} quantity={quantity} setQuantity={setQuantity} maxPrice={maxPrice} setMaxPrice={setMaxPrice} moisture={moisture} setMoisture={setMoisture} onNext={() => setScreen("bids")} onBack={back} />;
  }
  if (screen === "bids") {
    if (role === "farmer") {
      return <FarmerOffersScreen onNext={() => setScreen("qc")} onBack={back} />;
    }
    return <BidsScreen onNext={() => setScreen("qc")} onBack={back} />;
  }
  if (screen === "qc") {
    if (role === "farmer") {
      return <FarmerProofScreen onNext={() => setScreen("settlement")} onBack={back} />;
    }
    return <QcScreen onNext={() => setScreen("settlement")} onBack={back} />;
  }
  if (role === "farmer") {
    return <FarmerPayoutScreen onBack={back} />;
  }
  return <SettlementScreen onBack={back} />;
}