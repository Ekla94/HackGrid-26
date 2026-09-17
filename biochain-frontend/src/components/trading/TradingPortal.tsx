import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  CloudSun,
  FileCheck2,
  KeyRound,
  Landmark,
  MapPin,
  ReceiptIndianRupee,
  RefreshCw,
  Scale,
  ShieldCheck,
  Sprout,
  Store,
  Truck,
  WalletCards,
  Wheat,
} from "lucide-react";
import { generateContract } from "../../services/api";

export type FlowScreen =
  | "welcome"
  | "login"
  | "otp"
  | "kyc"
  | "dashboard"
  | "rfq"
  | "bids"
  | "qc"
  | "settlement";

export type BuyerRole = "farmer" | "buyer";
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

const gold = "var(--tp-gold)";
const goldBright = "var(--tp-gold-bright)";
const ink = "var(--tp-ink)";
const panel = "var(--tp-panel)";
const panelRaised = "var(--tp-panel-raised)";
const olive = "var(--tp-olive)";
const parchment = "var(--tp-parchment)";
const muted = "var(--tp-muted)";

const baseInputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 46,
  borderRadius: 14,
  border: "1px solid var(--tp-border)",
  background: "var(--tp-input-bg)",
  color: parchment,
  padding: "0 14px",
  fontSize: 13,
  fontWeight: 650,
  outline: "none",
  boxSizing: "border-box",
};

function IconBadge({
  icon: Icon,
  tone = "gold",
}: {
  icon: typeof Wheat;
  tone?: "gold" | "olive" | "green" | "red";
}) {
  const tones = {
    gold: { bg: "var(--tp-tone-gold-bg)", color: "var(--tp-tone-gold-color)", border: "var(--tp-tone-gold-border)" },
    olive: { bg: "var(--tp-tone-olive-bg)", color: "var(--tp-tone-olive-color)", border: "var(--tp-tone-olive-border)" },
    green: { bg: "var(--tp-tone-green-bg)", color: "var(--tp-tone-green-color)", border: "var(--tp-tone-green-border)" },
    red: { bg: "var(--tp-tone-red-bg)", color: "var(--tp-tone-red-color)", border: "var(--tp-tone-red-border)" },
  };
  const toneStyle = tones[tone];
  return (
    <span
      style={{
        width: 36,
        height: 36,
        borderRadius: 12,
        display: "grid",
        placeItems: "center",
        background: toneStyle.bg,
        border: `1px solid ${toneStyle.border}`,
        color: toneStyle.color,
        flexShrink: 0,
      }}
    >
      <Icon size={17} strokeWidth={2.1} />
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
    gold: { bg: "var(--tp-pill-gold-bg)", color: "var(--tp-pill-gold-color)", border: "var(--tp-pill-gold-border)" },
    green: { bg: "var(--tp-pill-green-bg)", color: "var(--tp-pill-green-color)", border: "var(--tp-pill-green-border)" },
    olive: { bg: "var(--tp-pill-olive-bg)", color: "var(--tp-pill-olive-color)", border: "var(--tp-pill-olive-border)" },
    red: { bg: "rgba(213,131,101,.13)", color: "var(--tp-tone-red-color)", border: "rgba(213,131,101,.24)" },
  };
  const color = colors[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 9px",
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
        minHeight: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        borderRadius: 14,
        border: isGold ? "1px solid rgba(243,207,122,.55)" : `1px solid ${isQuiet ? "rgba(255,255,255,.1)" : "rgba(212,170,87,.32)"}`,
        background: isGold ? "var(--tp-gold)" : isQuiet ? "rgba(255,255,255,.045)" : "transparent",
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
      <Icon size={16} strokeWidth={2.2} />
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
        width: 34,
        height: 34,
        borderRadius: 10,
        border: "1px solid var(--tp-border)",
        background: "var(--tp-border-light)",
        color: parchment,
        display: "grid",
        placeItems: "center",
        cursor: "pointer",
      }}
    >
      <ArrowLeft size={15} />
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
        {onBack ? <BackButton onClick={onBack} /> : <div style={{ width: 34 }} />}
        <div style={{ textAlign: "center", minWidth: 0 }}>
          <div style={{ color: gold, fontSize: 9, fontWeight: 800, letterSpacing: ".2em", textTransform: "uppercase" }}>
            {eyebrow}
          </div>
          <div style={{ marginTop: 4, color: parchment, fontSize: 14, fontWeight: 750 }}>{title}</div>
        </div>
        <div style={{ width: 34, height: 34, display: "grid", placeItems: "center", color: muted }}>
          <CloudSun size={17} strokeWidth={1.5} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, marginTop: 16 }}>
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
      <div style={{ marginTop: 6, color: muted, fontSize: 10, textAlign: "right" }}>
        {labels[activeIndex] ?? labels[0]} · {Math.max(activeIndex + 1, 1)} of {screens.length}
      </div>
    </header>
  );
}

function SectionTitle({ kicker, title, body }: { kicker: string; title: string; body?: string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ color: gold, fontSize: 10, textTransform: "uppercase", letterSpacing: ".17em", fontWeight: 800 }}>{kicker}</div>
      <h1 style={{ margin: "6px 0 0", color: parchment, fontSize: 24, lineHeight: 1.15, letterSpacing: "-.03em", fontWeight: 800 }}>{title}</h1>
      {body ? <p style={{ margin: "8px 0 0", color: muted, fontSize: 13, lineHeight: 1.5 }}>{body}</p> : null}
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
      <span style={{ display: "block", marginBottom: 6, color: "#bec3b1", fontSize: 11, fontWeight: 700 }}>{label}</span>
      <span style={{ position: "relative", display: "block" }}>
        <input
          style={{ ...baseInputStyle, paddingRight: suffix ? 64 : 14 }}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          type={type}
        />
        {suffix ? <span style={{ position: "absolute", right: 12, top: 13, color: gold, fontSize: 11, fontWeight: 800 }}>{suffix}</span> : null}
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
    <div style={{ padding: 14, borderRadius: 16, background: panelRaised, border: "1px solid rgba(255,255,255,.065)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <IconBadge icon={Icon} tone={tone} />
        <ChevronRight size={14} color="#76806b" />
      </div>
      <div style={{ marginTop: 14, color: muted, fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700 }}>{label}</div>
      <div style={{ marginTop: 4, color: parchment, fontSize: 20, fontWeight: 780, letterSpacing: "-.03em" }}>{value}</div>
      <div style={{ marginTop: 3, color: tone === "green" ? "#a6ca9b" : muted, fontSize: 11 }}>{detail}</div>
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
    <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 0", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
      <IconBadge icon={Icon} tone={tone} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: parchment, fontSize: 12, fontWeight: 700 }}>{title}</div>
        <div style={{ marginTop: 2, color: muted, fontSize: 10 }}>{detail}</div>
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
    <div className="w-full min-h-[90vh] flex flex-col items-center justify-center p-2 sm:p-6 bg-stone-50 dark:bg-black transition-colors duration-500">
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          borderRadius: 24,
          background: `radial-gradient(circle at 93% 6%, rgba(136,154,107,.12), transparent 30%), ${ink}`,
          border: "1px solid rgba(212,170,87,.22)",
          color: parchment,
          fontFamily: "'Plus Jakarta Sans', 'DM Sans', ui-sans-serif, system-ui, sans-serif",
          boxShadow: "0 25px 60px -15px rgba(0,0,0,0.8), 0 0 40px rgba(212,170,87,0.05)",
          overflow: "hidden",
        }}
      >
        <Header title={title} eyebrow={eyebrow} current={current} onBack={onBack} role={role} />
        <main style={{ padding: "18px 20px 24px" }}>{children}</main>
      </div>
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
        width: "100%",
        padding: 16,
        borderRadius: 18,
        border: selected ? "1px solid rgba(227,185,95,.8)" : "1px solid rgba(255,255,255,.07)",
        background: selected ? "linear-gradient(145deg, rgba(212,170,87,.14), rgba(27,33,25,.9))" : panel,
        color: parchment,
        textAlign: "left",
        display: "flex",
        alignItems: "flex-start",
        gap: 13,
        cursor: "pointer",
        transition: "border .2s ease, transform .2s ease",
      }}
    >
      <IconBadge icon={Icon} tone={selected ? "gold" : "olive"} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 750 }}>{title}</span>
          <StatusPill tone={selected ? "gold" : "olive"}>{tag}</StatusPill>
        </div>
        <p style={{ margin: "6px 0 0", color: muted, fontSize: 12, lineHeight: 1.45 }}>{body}</p>
      </div>
    </button>
  );
}

// 1. Welcome Screen
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
    <ScreenShell current="welcome" title="Choose your corridor" eyebrow="01 / Gateway">
      <div style={{ paddingTop: 10 }}>
        <SectionTitle
          kicker="KhetiNex Exchange"
          title="Direct farmgate trade with escrow protection."
          body="Settle bulk agri commodities with verified FPOs, AI quality inspection, and automated bank disbursement."
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 11, margin: "20px 0 22px" }}>
          <RoleTile
            selected={role === "buyer"}
            onClick={() => setRole("buyer")}
            icon={Store}
            title="Institutional Buyer"
            body="Sustainably source certified lots, lock forward contracts, and release milestone escrows on delivery."
            tag="Corporate"
          />
          <RoleTile
            selected={role === "farmer"}
            onClick={() => setRole("farmer")}
            icon={Sprout}
            title="Farmer Producer Org"
            body="List harvest lots, review guaranteed corporate bids, and receive instant DBT payout on weighbridge."
            tag="FPO / Kisan"
          />
        </div>
        <PrimaryButton onClick={onStart}>Enter Trading Desk</PrimaryButton>
      </div>
    </ScreenShell>
  );
}

// 2. Buyer Login Screen
function LoginScreen({
  corporateId,
  setCorporateId,
  mobile,
  setMobile,
  onNext,
  onBack,
}: {
  corporateId: string;
  setCorporateId: (v: string) => void;
  mobile: string;
  setMobile: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <ScreenShell current="login" title="Authorized signatory" eyebrow="02 / Authentication" onBack={onBack}>
      <div style={{ paddingTop: 10 }}>
        <SectionTitle
          kicker="Corporate Desk"
          title="Sign in to your trading mandate."
          body="Use your registered corporate identifier and mobile number linked to the GST portal."
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 14, margin: "20px 0 22px" }}>
          <Field label="Corporate GSTIN / CIN" value={corporateId} onChange={setCorporateId} placeholder="27AABCM1234C1Z7" suffix="Verified" />
          <Field label="Authorized Mobile Number" value={mobile} onChange={setMobile} placeholder="+91 98 7654 3210" type="tel" suffix="SMS" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, borderRadius: 14, background: "var(--tp-tone-olive-bg)", border: "1px solid var(--tp-tone-olive-border)", marginBottom: 20 }}>
          <ShieldCheck size={18} color={olive} />
          <span style={{ color: muted, fontSize: 11 }}>256-bit encrypted corporate session with biometric 2FA</span>
        </div>
        <PrimaryButton onClick={onNext} icon={KeyRound}>Generate One-Time Passcode</PrimaryButton>
      </div>
    </ScreenShell>
  );
}

// 2b. Farmer Login Screen
function FarmerLoginScreen({
  farmerId,
  setFarmerId,
  mobile,
  setMobile,
  onNext,
  onBack,
}: {
  farmerId: string;
  setFarmerId: (v: string) => void;
  mobile: string;
  setMobile: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <ScreenShell current="login" title="Kisan identification" eyebrow="02 / Authentication" onBack={onBack} role="farmer">
      <div style={{ paddingTop: 10 }}>
        <SectionTitle
          kicker="FPO Desk"
          title="Enter your registered Kisan ID."
          body="Sign in using your FPO member badge or registered Aadhaar-linked mobile."
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 14, margin: "20px 0 22px" }}>
          <Field label="Kisan Registration / FPO ID" value={farmerId} onChange={setFarmerId} placeholder="KISAN-MP-20841" suffix="Active" />
          <Field label="Mobile Number" value={mobile} onChange={setMobile} placeholder="+91 98 7654 3210" type="tel" suffix="OTP" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, borderRadius: 14, background: "var(--tp-tone-olive-bg)", border: "1px solid var(--tp-tone-olive-border)", marginBottom: 20 }}>
          <Sprout size={18} color={olive} />
          <span style={{ color: muted, fontSize: 11 }}>Sehore Cluster FPO · Government e-NAM synchronized</span>
        </div>
        <PrimaryButton onClick={onNext} icon={KeyRound}>Send Verification Code</PrimaryButton>
      </div>
    </ScreenShell>
  );
}

// 3. OTP Screen
function OtpScreen({
  otp,
  setOtp,
  generatedOtp,
  onNext,
  onBack,
  onResend,
  role = "buyer",
}: {
  otp: string[];
  setOtp: (otp: string[]) => void;
  generatedOtp: string;
  onNext: () => void;
  onBack: () => void;
  onResend: () => void;
  role?: BuyerRole;
}) {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  // Focus first empty box on load
  useEffect(() => {
    const firstEmpty = otp.findIndex((val) => !val);
    const target = firstEmpty === -1 ? 0 : firstEmpty;
    inputRefs.current[target]?.focus();
  }, []);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeString = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const handleChange = (index: number, val: string) => {
    // Restrict strictly to digits
    const clean = val.replace(/\D/g, "");
    if (!clean && val !== "") return;

    const char = clean.slice(-1);
    const next = [...otp];
    next[index] = char;
    setOtp(next);

    // Auto-advance to next input box if a digit was entered
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Only allow numbers and navigation keys
    if (
      !/^[0-9]$/.test(e.key) &&
      !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    ) {
      e.preventDefault();
      return;
    }

    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If current box is already empty, move to previous box and clear it
        e.preventDefault();
        const next = [...otp];
        next[index - 1] = "";
        setOtp(next);
        inputRefs.current[index - 1]?.focus();
      } else {
        const next = [...otp];
        next[index] = "";
        setOtp(next);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...otp];
    for (let i = 0; i < 6; i++) {
      next[i] = pasted[i] || "";
    }
    setOtp(next);
    const targetIndex = Math.min(pasted.length, 5);
    inputRefs.current[targetIndex]?.focus();
  };

  const handleAutoFill = () => {
    const code = (generatedOtp || "842915").split("");
    setOtp(code);
    inputRefs.current[5]?.focus();
  };

  return (
    <ScreenShell current="otp" title="Two-factor verification" eyebrow="03 / Security" onBack={onBack} role={role}>
      <div style={{ paddingTop: 10 }}>
        <SectionTitle
          kicker="Security Token"
          title="Enter the 6-digit confirmation code."
          body="A verification token was dispatched to your registered device."
        />

        {/* Real SMS notification banner */}
        <div style={{
          background: "var(--tp-tone-green-bg)",
          border: "1px solid var(--tp-tone-green-border)",
          borderRadius: 14,
          padding: "12px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          margin: "16px 0 12px",
          color: parchment,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>📲</span>
            <div>
              <div style={{ fontWeight: 700, color: "var(--tp-tone-green-color)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                SMS Code Dispatched:
              </div>
              <div style={{ marginTop: 2, fontSize: 13, color: "var(--tp-parchment)" }}>
                Your KhetiNex OTP is: <strong style={{ letterSpacing: "0.2em", color: "var(--tp-tone-green-color)", fontWeight: 800, fontSize: 16 }}>{generatedOtp || "842915"}</strong>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAutoFill}
            style={{
              background: "var(--tp-tone-green-color)",
              color: "#ffffff",
              border: "none",
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 11,
              fontWeight: 800,
              cursor: "pointer",
              whiteSpace: "nowrap"
            }}
          >
            Auto-fill
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, margin: "20px 0 24px", justifyContent: "center" }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={otp[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              placeholder="·"
              style={{
                width: 44,
                height: 52,
                borderRadius: 13,
                border: otp[i] ? "2px solid var(--tp-tone-green-color)" : "1px solid var(--tp-tone-gold-border)",
                background: "var(--tp-input-bg)",
                color: "var(--tp-tone-green-color)",
                fontSize: 22,
                fontWeight: 800,
                textAlign: "center",
                outline: "none",
                transition: "all 0.15s ease",
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", color: muted, fontSize: 11, marginBottom: 22 }}>
          <span>Code expires in {timeString}</span>
          <button 
            type="button" 
            onClick={() => {
              setTimeLeft(300);
              onResend();
            }}
            style={{ color: "var(--tp-tone-green-color)", background: "none", border: "none", fontWeight: 700, cursor: "pointer" }}
          >
            Resend SMS
          </button>
        </div>
        <PrimaryButton onClick={onNext} icon={CheckCircle2}>Authorize & Verify Identity</PrimaryButton>
      </div>
    </ScreenShell>
  );
}

// 4. Buyer KYC Screen
function KycScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <ScreenShell current="kyc" title="Compliance verification" eyebrow="04 / KYC" onBack={onBack}>
      <div style={{ paddingTop: 10 }}>
        <SectionTitle
          kicker="Corporate Mandate"
          title="Regulatory clearances active."
          body="Trading limits enabled for institutional forward procurement across registered APMC corridors."
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "18px 0 22px" }}>
          <ListRow icon={BadgeCheck} title="GSTIN & PAN Clearance" detail="Active · 27AABCM1234C1Z7" tone="green" right={<StatusPill tone="green">Verified</StatusPill>} />
          <ListRow icon={Store} title="APMC Unified License" detail="Maharashtra Mandi Board License #4892" tone="gold" right={<StatusPill tone="gold">Active</StatusPill>} />
          <ListRow icon={Landmark} title="Escrow Partner Bank" detail="HDFC Custody Account · 9821...04" tone="olive" right={<StatusPill tone="olive">Linked</StatusPill>} />
          <ListRow icon={FileCheck2} title="FSSAI Quality Standard" detail="Wholesale Grain Category · Valid 2028" tone="green" right={<StatusPill tone="green">Cleared</StatusPill>} />
        </div>
        <PrimaryButton onClick={onNext}>Open Commodity Trading Desk</PrimaryButton>
      </div>
    </ScreenShell>
  );
}

// 4b. Farmer KYC Screen
function FarmerKycScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <ScreenShell current="kyc" title="Kisan compliance" eyebrow="04 / KYC" onBack={onBack} role="farmer">
      <div style={{ paddingTop: 10 }}>
        <SectionTitle
          kicker="Cluster Verification"
          title="FPO membership credentials confirmed."
          body="Direct bank transfer account and land holdings are synchronized with BioChain registry."
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "18px 0 22px" }}>
          <ListRow icon={BadgeCheck} title="Aadhaar e-KYC" detail="UIDAI Verified · Ramesh Patil" tone="green" right={<StatusPill tone="green">Verified</StatusPill>} />
          <ListRow icon={MapPin} title="Land 7/12 Records" detail="Sehore Survey #142 · 6.5 Acres" tone="gold" right={<StatusPill tone="gold">Mapped</StatusPill>} />
          <ListRow icon={Landmark} title="DBT Bank Account" detail="SBI Sehore Branch · ****4821" tone="olive" right={<StatusPill tone="olive">Active</StatusPill>} />
          <ListRow icon={Sprout} title="FPO Shareholder Status" detail="KisanSetu Member #8842 · Good Standing" tone="green" right={<StatusPill tone="green">Eligible</StatusPill>} />
        </div>
        <PrimaryButton onClick={onNext}>Open Farm Management Desk</PrimaryButton>
      </div>
    </ScreenShell>
  );
}

// 5. Buyer Dashboard Screen
function DashboardScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <ScreenShell current="dashboard" title="Institutional desk" eyebrow="05 / Trading Desk" onBack={onBack}>
      <div style={{ paddingTop: 10 }}>
        <SectionTitle kicker="Market Session" title="Daily procurement overview." body="Live spot tickers, active forward lots, and transit escrow balances." />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "16px 0" }}>
          <Metric icon={WalletCards} label="Escrow Balance" value="₹42.50L" detail="Secured in Custody" tone="gold" />
          <Metric icon={Truck} label="In Transit" value="380 MT" detail="2 Fleets Arriving" tone="olive" />
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ color: gold, fontSize: 10, textTransform: "uppercase", letterSpacing: ".15em", fontWeight: 800 }}>Live Mandi Spot Tickers</div>
          <div style={{ marginTop: 8 }}>
            <ListRow icon={Wheat} title="Soybean (FAQ)" detail="Indore APMC · ₹4,850/qtl" right={<span style={{ color: "var(--tp-tone-green-color)", fontSize: 11, fontWeight: 700 }}>+2.4%</span>} tone="gold" />
            <ListRow icon={Wheat} title="Sharbati Wheat" detail="Sehore Mandi · ₹2,340/qtl" right={<span style={{ color: "var(--tp-tone-green-color)", fontSize: 11, fontWeight: 700 }}>+0.8%</span>} tone="olive" />
            <ListRow icon={Wheat} title="Nashik Red Onion" detail="Lasalgaon · ₹1,520/qtl" right={<span style={{ color: "var(--tp-tone-red-color)", fontSize: 11, fontWeight: 700 }}>-1.1%</span>} tone="red" />
          </div>
        </div>
        <div style={{ marginTop: 22 }}>
          <PrimaryButton onClick={onNext}>Create Commodity RFQ</PrimaryButton>
        </div>
      </div>
    </ScreenShell>
  );
}

// 5b. Farmer Dashboard Screen
function FarmerDashboardScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <ScreenShell current="dashboard" title="Kisan trading desk" eyebrow="05 / Farm Desk" onBack={onBack} role="farmer">
      <div style={{ paddingTop: 10 }}>
        <SectionTitle kicker="Harvest Season" title="Manage your harvest lots." body="Track active inquiries, escrow deposits, and real-time mandi rates." />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "16px 0" }}>
          <Metric icon={Sprout} label="Ready Crop" value="80 MT" detail="Wheat (Sharbati)" tone="green" />
          <Metric icon={ReceiptIndianRupee} label="Escrow Secured" value="₹18.72L" detail="Awaiting Dispatch" tone="gold" />
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ color: gold, fontSize: 10, textTransform: "uppercase", letterSpacing: ".15em", fontWeight: 800 }}>Active Harvest Batches</div>
          <div style={{ marginTop: 8 }}>
            <ListRow icon={Wheat} title="Sharbati Wheat · Batch #04" detail="80 MT · Moisture 11.4% · Certified" right={<StatusPill tone="green">Ready</StatusPill>} tone="green" />
            <ListRow icon={Wheat} title="Yellow Soybean · Batch #02" detail="120 MT · Harvest in 14 days" right={<StatusPill tone="olive">Growing</StatusPill>} tone="olive" />
          </div>
        </div>
        <div style={{ marginTop: 22 }}>
          <PrimaryButton onClick={onNext}>List New Harvest Lot</PrimaryButton>
        </div>
      </div>
    </ScreenShell>
  );
}

// 6. Buyer RFQ Screen
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
  setCommodity: (v: string) => void;
  quantity: string;
  setQuantity: (v: string) => void;
  maxPrice: string;
  setMaxPrice: (v: string) => void;
  moisture: string;
  setMoisture: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <ScreenShell current="rfq" title="Forward RFQ" eyebrow="06 / Demand" onBack={onBack}>
      <div style={{ paddingTop: 10 }}>
        <SectionTitle kicker="Buyer Order" title="Specify lot requirements." body="Broadcast request-for-quote to verified FPO clusters with escrow deposit guarantee." />
        <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "16px 0 20px" }}>
          <Field label="Commodity" value={commodity} onChange={setCommodity} suffix="Grade A" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Target Quantity" value={quantity} onChange={setQuantity} suffix="MT" />
            <Field label="Max Target Price" value={maxPrice} onChange={setMaxPrice} suffix="₹ / qtl" />
          </div>
          <Field label="Max Permissible Moisture" value={moisture} onChange={setMoisture} suffix="% Max" />
        </div>
        <div style={{ padding: 12, borderRadius: 14, background: "rgba(212,170,87,.08)", border: "1px solid rgba(212,170,87,.2)", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
            <span style={{ color: muted }}>Estimated Order Valuation:</span>
            <span style={{ color: goldBright, fontWeight: 800 }}>₹24,25,000</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginTop: 4 }}>
            <span style={{ color: muted }}>Advance Escrow (30%):</span>
            <span style={{ color: parchment, fontWeight: 700 }}>₹7,27,500</span>
          </div>
        </div>
        <PrimaryButton onClick={onNext}>Broadcast RFQ to FPO Clusters</PrimaryButton>
      </div>
    </ScreenShell>
  );
}

// 6b. Farmer Lot Screen
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
  setCrop: (v: string) => void;
  quantity: string;
  setQuantity: (v: string) => void;
  askingPrice: string;
  setAskingPrice: (v: string) => void;
  harvestDate: string;
  setHarvestDate: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <ScreenShell current="rfq" title="List harvest lot" eyebrow="06 / Supply" onBack={onBack} role="farmer">
      <div style={{ paddingTop: 10 }}>
        <SectionTitle kicker="Farmer Listing" title="Publish available harvest." body="Set your asking price and pickup readiness for institutional buyers." />
        <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "16px 0 20px" }}>
          <Field label="Harvest Crop" value={crop} onChange={setCrop} suffix="Sharbati" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Available Quantity" value={quantity} onChange={setQuantity} suffix="MT" />
            <Field label="Asking Price" value={askingPrice} onChange={setAskingPrice} suffix="₹ / qtl" />
          </div>
          <Field label="Ready for Dispatch Date" value={harvestDate} onChange={setHarvestDate} suffix="Date" />
        </div>
        <div style={{ padding: 12, borderRadius: 14, background: "var(--tp-tone-green-bg)", border: "1px solid var(--tp-tone-green-border)", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
            <span style={{ color: muted }}>Mandi Benchmark Rate:</span>
            <span style={{ color: "var(--tp-tone-green-color)", fontWeight: 800 }}>₹2,310 / qtl</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginTop: 4 }}>
            <span style={{ color: muted }}>Premium over Mandi:</span>
            <span style={{ color: goldBright, fontWeight: 700 }}>+₹30 / qtl (BioChain Certified)</span>
          </div>
        </div>
        <PrimaryButton onClick={onNext}>Publish Lot to Deal Room</PrimaryButton>
      </div>
    </ScreenShell>
  );
}

// 7. Buyer Bids & Term Sheet Screen
function BidsScreen({
  onNext,
  onBack,
  onGenerateContract,
}: {
  onNext: () => void;
  onBack: () => void;
  onGenerateContract: (fpo: string, buyer: string, crop: string, tons: number) => Promise<void>;
}) {
  const [selectedBid, setSelectedBid] = useState("KisanSetu FPO");
  const [isDrafting, setIsDrafting] = useState(false);

  const bids = [
    { name: "KisanSetu FPO", location: "Sehore, MP", rate: "₹4,720 / qtl", tons: 180, tone: "green" as const },
    { name: "Malwa Agri Consortium", location: "Dewas, MP", rate: "₹4,750 / qtl", tons: 150, tone: "gold" as const },
    { name: "Satpura Farmer Company", location: "Hoshangabad, MP", rate: "₹4,810 / qtl", tons: 170, tone: "olive" as const },
  ];

  const handleAccept = async () => {
    setIsDrafting(true);
    try {
      await onGenerateContract(selectedBid, "Maharashtra Grain Merchants", "Soybean", 180);
      onNext();
    } finally {
      setIsDrafting(false);
    }
  };

  return (
    <ScreenShell current="bids" title="Matching FPO lots" eyebrow="07 / Bid Room" onBack={onBack}>
      <div style={{ paddingTop: 10 }}>
        <SectionTitle kicker="Live Counter-Bids" title="Select optimal FPO lot." body="3 verified FPOs responded with confirmed moisture test certificates." />
        <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "16px 0 20px" }}>
          {bids.map((b) => (
            <button
              type="button"
              key={b.name}
              onClick={() => setSelectedBid(b.name)}
              style={{
                padding: 14,
                borderRadius: 16,
                border: selectedBid === b.name ? "1px solid rgba(212,170,87,.8)" : "1px solid rgba(255,255,255,.07)",
                background: selectedBid === b.name ? "linear-gradient(145deg, rgba(212,170,87,.14), rgba(27,33,25,.9))" : panel,
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 750, color: parchment }}>{b.name}</span>
                <span style={{ color: goldBright, fontWeight: 800, fontSize: 14 }}>{b.rate}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6, fontSize: 11, color: muted }}>
                <span>{b.location}</span>
                <span style={{ color: "var(--tp-tone-green-color)" }}>{b.tons} MT available</span>
              </div>
            </button>
          ))}
        </div>

        <div style={{ padding: 14, borderRadius: 16, background: "var(--tp-input-bg)", border: "1px solid var(--tp-tone-gold-border)", marginBottom: 20 }}>
          <div style={{ color: gold, fontSize: 10, textTransform: "uppercase", letterSpacing: ".15em", fontWeight: 800 }}>Forward Term Sheet</div>
          <div style={{ marginTop: 8, fontSize: 11, color: muted, lineHeight: 1.6 }}>
            <div>Seller: <strong style={{ color: parchment }}>{selectedBid}</strong></div>
            <div>Commodity: <strong style={{ color: parchment }}>Soybean · 180 Metric Tons</strong></div>
            <div>Escrow Terms: <strong style={{ color: "var(--tp-tone-green-color)" }}>30% Advance Escrow Lock · 70% Weighbridge Release</strong></div>
          </div>
        </div>

        <PrimaryButton onClick={handleAccept} disabled={isDrafting}>
          {isDrafting ? "Drafting Smart Contract..." : "Accept Term Sheet & Generate Contract"}
        </PrimaryButton>
      </div>
    </ScreenShell>
  );
}

// 7b. Farmer Offers Screen
function FarmerOffersScreen({
  onNext,
  onBack,
  onGenerateContract,
}: {
  onNext: () => void;
  onBack: () => void;
  onGenerateContract: (fpo: string, buyer: string, crop: string, tons: number) => Promise<void>;
}) {
  const [selectedBuyer, setSelectedBuyer] = useState("Maharashtra Grain Merchants");
  const [isDrafting, setIsDrafting] = useState(false);

  const buyers = [
    { name: "Maharashtra Grain Merchants", location: "Pune APMC", offer: "₹2,360 / qtl", pickup: "Farmgate Pickup", tone: "green" as const },
    { name: "AgriFoods Processing Ltd", location: "Mumbai Terminal", offer: "₹2,340 / qtl", pickup: "Rail Freight", tone: "gold" as const },
  ];

  const handleAccept = async () => {
    setIsDrafting(true);
    try {
      await onGenerateContract("Ramesh Patel", selectedBuyer, "Wheat", 80);
      onNext();
    } finally {
      setIsDrafting(false);
    }
  };

  return (
    <ScreenShell current="bids" title="Buyer inquiries" eyebrow="07 / Inquiries" onBack={onBack} role="farmer">
      <div style={{ paddingTop: 10 }}>
        <SectionTitle kicker="Institutional Buyers" title="Review purchase offers." body="Direct procurement bids received for your 80 MT Wheat lot." />
        <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "16px 0 20px" }}>
          {buyers.map((b) => (
            <button
              type="button"
              key={b.name}
              onClick={() => setSelectedBuyer(b.name)}
              style={{
                padding: 14,
                borderRadius: 16,
                border: selectedBuyer === b.name ? "1px solid rgba(212,170,87,.8)" : "1px solid rgba(255,255,255,.07)",
                background: selectedBuyer === b.name ? "linear-gradient(145deg, rgba(212,170,87,.14), rgba(27,33,25,.9))" : panel,
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 750, color: parchment }}>{b.name}</span>
                <span style={{ color: goldBright, fontWeight: 800, fontSize: 14 }}>{b.offer}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6, fontSize: 11, color: muted }}>
                <span>{b.location}</span>
                <span style={{ color: "var(--tp-tone-green-color)" }}>{b.pickup}</span>
              </div>
            </button>
          ))}
        </div>

        <div style={{ padding: 14, borderRadius: 16, background: "var(--tp-input-bg)", border: "1px solid var(--tp-tone-gold-border)", marginBottom: 20 }}>
          <div style={{ color: gold, fontSize: 10, textTransform: "uppercase", letterSpacing: ".15em", fontWeight: 800 }}>Guaranteed Escrow Lock</div>
          <div style={{ marginTop: 6, fontSize: 11, color: muted, lineHeight: 1.5 }}>
            Buyer escrow funds will be locked in HDFC custodian account before truck leaves your farm.
          </div>
        </div>

        <PrimaryButton onClick={handleAccept} disabled={isDrafting}>
          {isDrafting ? "Drafting Contract..." : "Accept Buyer & Generate Forward Contract"}
        </PrimaryButton>
      </div>
    </ScreenShell>
  );
}

// 8. Buyer QC Screen
function QcScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [decision, setDecision] = useState<QcDecision>("approve");
  const [weight, setWeight] = useState("178.6");
  const [moisture, setMoisture] = useState("11.8");
  const [deduction, setDeduction] = useState("1,842");

  return (
    <ScreenShell current="qc" title="Quality inspection" eyebrow="08 / QC Desk" onBack={onBack}>
      <div style={{ paddingTop: 10 }}>
        <SectionTitle kicker="Inward Gate Check" title="Verify lot parameters." body="Cross-check physical weighbridge reading and lab moisture test against forward contract specifications." />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "14px 0" }}>
          <Field label="Weighbridge Reading" value={weight} onChange={setWeight} suffix="MT" />
          <Field label="Moisture Test" value={moisture} onChange={setMoisture} suffix="%" />
        </div>

        <div style={{ marginTop: 12, marginBottom: 12 }}>
          <div style={{ color: gold, fontSize: 10, textTransform: "uppercase", letterSpacing: ".15em", fontWeight: 800, marginBottom: 8 }}>Inspection Verdict</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button
              type="button"
              onClick={() => setDecision("approve")}
              style={{
                padding: 12,
                borderRadius: 14,
                border: decision === "approve" ? "1px solid rgba(100,157,103,.8)" : "1px solid rgba(255,255,255,.08)",
                background: decision === "approve" ? "rgba(100,157,103,.15)" : panel,
                color: parchment,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--tp-tone-green-color)", fontWeight: 700, fontSize: 12 }}>
                <CheckCircle2 size={16} /> Approve Lot
              </div>
              <div style={{ fontSize: 10, color: muted, marginTop: 4 }}>Full Escrow Release</div>
            </button>

            <button
              type="button"
              onClick={() => setDecision("deduct")}
              style={{
                padding: 12,
                borderRadius: 14,
                border: decision === "deduct" ? "1px solid rgba(213,131,101,.8)" : "1px solid rgba(255,255,255,.08)",
                background: decision === "deduct" ? "rgba(213,131,101,.15)" : panel,
                color: parchment,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--tp-tone-red-color)", fontWeight: 700, fontSize: 12 }}>
                <Scale size={16} /> Apply Deductions
              </div>
              <div style={{ fontSize: 10, color: muted, marginTop: 4 }}>Quality Adjustment</div>
            </button>
          </div>
        </div>

        {decision === "deduct" && (
          <div style={{ marginBottom: 14 }}>
            <Field label="Quality Adjustment Amount" value={deduction} onChange={setDeduction} suffix="₹" />
          </div>
        )}

        <div style={{ padding: 12, borderRadius: 14, background: "var(--tp-tone-olive-bg)", border: "1px solid var(--tp-tone-olive-border)", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--tp-tone-green-color)", fontSize: 11, fontWeight: 700 }}>
            <ClipboardCheck size={16} /> BioChain Quality Hash Verified: 0x9f4a...28b1
          </div>
        </div>

        <PrimaryButton onClick={onNext} icon={ReceiptIndianRupee}>Authorize Escrow Release</PrimaryButton>
      </div>
    </ScreenShell>
  );
}

// 8b. Farmer Proof Screen (with Quick AI & Detailed B2B DMI Lot Audit)
function FarmerProofScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [auditMode, setAuditMode] = useState<"quick" | "structured">("structured");
  
  // Quick mode state
  const [description, setDescription] = useState("1000kg of clean Sharbati wheat ready at Sehore mandi dock, 11.2% moisture");
  
  // Structured B2B Questionnaire state
  const [crop, setCrop] = useState("wheat");
  const [variety, setVariety] = useState("Sharbati C-306");
  const [quantityMt, setQuantityMt] = useState("25.0");
  const [moisturePct, setMoisturePct] = useState("11.2");
  const [foreignMatterPct, setForeignMatterPct] = useState("0.4");
  const [damagedPct, setDamagedPct] = useState("0.8");
  const [storageType, setStorageType] = useState("covered_warehouse");
  const [harvestWeather, setHarvestWeather] = useState("dry_sunny");
  const [pesticideSafe, setPesticideSafe] = useState(true);
  const [packaging, setPackaging] = useState("50kg_new_jute");
  const [pickupLocation, setPickupLocation] = useState("Sehore APMC Terminal Gate 4");

  // Result state
  const [aiVerified, setAiVerified] = useState(false);
  const [isCompliant, setIsCompliant] = useState(false);
  const [verdict, setVerdict] = useState("");
  const [auditData, setAuditData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleQuickAnalyze = async () => {
    if (!description.trim()) {
      alert("Please describe your harvest lot.");
      return;
    }
    setIsAnalyzing(true);
    try {
      const res = await fetch("http://localhost:8000/api/biochain/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description })
      });
      const data = await res.json();
      setVerdict(data.verdict || "Harvest parameters analyzed.");
      setIsCompliant(Boolean(data.isVerified));
      setAuditData(null);
      setAiVerified(true);
    } catch (err) {
      console.error(err);
      setVerdict("Error connecting to AI Agent. Please verify your backend connection.");
      setIsCompliant(false);
      setAiVerified(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStructuredAudit = async () => {
    setIsAnalyzing(true);
    try {
      const payload = {
        crop,
        variety,
        quantity_mt: parseFloat(quantityMt) || 25.0,
        moisture_pct: parseFloat(moisturePct) || 11.2,
        foreign_matter_pct: parseFloat(foreignMatterPct) || 0.4,
        damaged_pct: parseFloat(damagedPct) || 0.8,
        storage_type: storageType,
        harvest_weather: harvestWeather,
        pesticide_safe: pesticideSafe,
        packaging,
        pickup_location: pickupLocation
      };
      const res = await fetch("http://localhost:8000/api/farmer/intake/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setAuditData(data);
      setVerdict(data.verdict);
      setIsCompliant(Boolean(data.isVerified));
      setAiVerified(true);
    } catch (err) {
      console.error(err);
      setVerdict("Error conducting DMI AGMARK statutory audit.");
      setIsCompliant(false);
      setAiVerified(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <ScreenShell current="qc" title="AI harvest proof" eyebrow="08 / Dispatch" onBack={onBack} role="farmer">
      <div style={{ paddingTop: 10 }}>
        <SectionTitle 
          kicker="DMI AGMARK Verification" 
          title="Harvest lot quality & traceability." 
          body="Structured intake of crop genetics, moisture, storage environment, and surroundings audited against statutory DMI schedules for B2B buyers." 
        />

        {/* Mode Selector Tabs */}
        {!aiVerified && (
          <div style={{ display: "flex", gap: 8, margin: "14px 0 16px", background: "var(--tp-panel)", padding: 4, borderRadius: 12, border: "1px solid var(--tp-border)" }}>
            <button
              type="button"
              onClick={() => setAuditMode("structured")}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 9,
                fontSize: 11,
                fontWeight: 800,
                border: "none",
                cursor: "pointer",
                background: auditMode === "structured" ? "var(--tp-tone-green-color)" : "transparent",
                color: auditMode === "structured" ? "#ffffff" : muted,
                transition: "all 0.2s"
              }}
            >
              📋 B2B Lot Audit (Recommended)
            </button>
            <button
              type="button"
              onClick={() => setAuditMode("quick")}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 9,
                fontSize: 11,
                fontWeight: 800,
                border: "none",
                cursor: "pointer",
                background: auditMode === "quick" ? "var(--tp-tone-green-color)" : "transparent",
                color: auditMode === "quick" ? "#ffffff" : muted,
                transition: "all 0.2s"
              }}
            >
              ⚡ Quick AI Text Description
            </button>
          </div>
        )}
        
        {!aiVerified ? (
          auditMode === "quick" ? (
            /* Quick Text Mode */
            <div style={{ marginTop: 8 }}>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isAnalyzing}
                placeholder="e.g. 1000kg of clean Sharbati wheat, 11.2% moisture, stored in pucca warehouse at Sehore mandi dock..."
                style={{
                  width: "100%",
                  height: 110,
                  borderRadius: 14,
                  border: "1px solid rgba(212,170,87,.3)",
                  background: "var(--tp-input-bg)",
                  color: parchment,
                  padding: 12,
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                  resize: "none",
                  opacity: isAnalyzing ? 0.6 : 1
                }}
              />
              <button
                type="button"
                onClick={handleQuickAnalyze}
                disabled={isAnalyzing}
                style={{
                  width: "100%",
                  marginTop: 12,
                  minHeight: 46,
                  borderRadius: 14,
                  background: isAnalyzing ? "var(--tp-border)" : "linear-gradient(135deg, #e5ba61, #b17b35)",
                  color: isAnalyzing ? muted : "#121511",
                  fontSize: 13,
                  fontWeight: 800,
                  border: "none",
                  cursor: isAnalyzing ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8
                }}
              >
                {isAnalyzing ? <><RefreshCw size={16} className="animate-spin" /> Analyzing DMI AGMARK Standards...</> : "Run Quick AI Assessment"}
              </button>
            </div>
          ) : (
            /* Structured B2B Questionnaire */
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 6 }}>
              {/* Tier 1: Commodity */}
              <div style={{ padding: 12, borderRadius: 14, background: "var(--tp-input-bg)", border: "1px solid var(--tp-border)" }}>
                <div style={{ fontSize: 10, textTransform: "uppercase", color: "var(--tp-tone-green-color)", fontWeight: 800, letterSpacing: ".1em", marginBottom: 8 }}>
                  Tier 1 · Commodity & Cultivar Specification
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  <div>
                    <label style={{ fontSize: 10, color: muted, display: "block", marginBottom: 4 }}>Crop Type</label>
                    <select
                      value={crop}
                      onChange={(e) => setCrop(e.target.value)}
                      style={{ width: "100%", height: 38, borderRadius: 10, background: "var(--tp-panel)", color: parchment, border: "1px solid var(--tp-border)", padding: "0 8px", fontSize: 12 }}
                    >
                      <option value="wheat">Wheat (Triticum aestivum)</option>
                      <option value="soybean">Soybean (Glycine max)</option>
                      <option value="tomato">Tomato (Table Fresh)</option>
                      <option value="onion">Rabi Onion (Nashik Red)</option>
                      <option value="rice">Paddy / Basmati Rice</option>
                      <option value="chana">Bengal Gram / Chickpea</option>
                      <option value="mustard">Mustard / Rapeseed</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: muted, display: "block", marginBottom: 4 }}>Variety / Cultivar</label>
                    <input
                      type="text"
                      value={variety}
                      onChange={(e) => setVariety(e.target.value)}
                      style={{ width: "100%", height: 38, borderRadius: 10, background: "var(--tp-panel)", color: parchment, border: "1px solid var(--tp-border)", padding: "0 10px", fontSize: 12, boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: muted, display: "block", marginBottom: 4 }}>Quantity (MT)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={quantityMt}
                      onChange={(e) => setQuantityMt(e.target.value)}
                      style={{ width: "100%", height: 38, borderRadius: 10, background: "var(--tp-panel)", color: parchment, border: "1px solid var(--tp-border)", padding: "0 10px", fontSize: 12, boxSizing: "border-box" }}
                    />
                  </div>
                </div>
              </div>

              {/* Tier 2: Physical Parameters */}
              <div style={{ padding: 12, borderRadius: 14, background: "var(--tp-input-bg)", border: "1px solid var(--tp-border)" }}>
                <div style={{ fontSize: 10, textTransform: "uppercase", color: "var(--tp-tone-green-color)", fontWeight: 800, letterSpacing: ".1em", marginBottom: 8 }}>
                  Tier 2 · Physical Quality Parameters (DMI Tolerances)
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  <div>
                    <label style={{ fontSize: 10, color: muted, display: "block", marginBottom: 4 }}>Moisture (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={moisturePct}
                      onChange={(e) => setMoisturePct(e.target.value)}
                      style={{ width: "100%", height: 38, borderRadius: 10, background: "var(--tp-panel)", color: parchment, border: "1px solid var(--tp-border)", padding: "0 8px", fontSize: 12, boxSizing: "border-box" }}
                    />
                    <span style={{ fontSize: 9, color: "var(--tp-tone-green-color)", marginTop: 2, display: "block" }}>DMI Limit: ≤12.0%</span>
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: muted, display: "block", marginBottom: 4 }}>Foreign Matter (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={foreignMatterPct}
                      onChange={(e) => setForeignMatterPct(e.target.value)}
                      style={{ width: "100%", height: 38, borderRadius: 10, background: "var(--tp-panel)", color: parchment, border: "1px solid var(--tp-border)", padding: "0 8px", fontSize: 12, boxSizing: "border-box" }}
                    />
                    <span style={{ fontSize: 9, color: "var(--tp-tone-green-color)", marginTop: 2, display: "block" }}>DMI Limit: ≤1.0%</span>
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: muted, display: "block", marginBottom: 4 }}>Damaged (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={damagedPct}
                      onChange={(e) => setDamagedPct(e.target.value)}
                      style={{ width: "100%", height: 38, borderRadius: 10, background: "var(--tp-panel)", color: parchment, border: "1px solid var(--tp-border)", padding: "0 8px", fontSize: 12, boxSizing: "border-box" }}
                    />
                    <span style={{ fontSize: 9, color: "var(--tp-tone-green-color)", marginTop: 2, display: "block" }}>DMI Limit: ≤2.0%</span>
                  </div>
                </div>
              </div>

              {/* Tier 3: Storage & Surroundings */}
              <div style={{ padding: 12, borderRadius: 14, background: "var(--tp-input-bg)", border: "1px solid var(--tp-border)" }}>
                <div style={{ fontSize: 10, textTransform: "uppercase", color: "var(--tp-tone-green-color)", fontWeight: 800, letterSpacing: ".1em", marginBottom: 8 }}>
                  Tier 3 · Farm Surroundings & Storage Facility
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div>
                    <label style={{ fontSize: 10, color: muted, display: "block", marginBottom: 4 }}>Storage Facility</label>
                    <select
                      value={storageType}
                      onChange={(e) => setStorageType(e.target.value)}
                      style={{ width: "100%", height: 38, borderRadius: 10, background: "var(--tp-panel)", color: parchment, border: "1px solid var(--tp-border)", padding: "0 8px", fontSize: 12 }}
                    >
                      <option value="covered_warehouse">Covered Pucca Warehouse</option>
                      <option value="grain_silo">Metal Grain Silo</option>
                      <option value="open_shed">Covered Plinth Shed</option>
                      <option value="bare_earth">Outdoor Tarpaulin Ground</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: muted, display: "block", marginBottom: 4 }}>Harvest Weather</label>
                    <select
                      value={harvestWeather}
                      onChange={(e) => setHarvestWeather(e.target.value)}
                      style={{ width: "100%", height: 38, borderRadius: 10, background: "var(--tp-panel)", color: parchment, border: "1px solid var(--tp-border)", padding: "0 8px", fontSize: 12 }}
                    >
                      <option value="dry_sunny">Dry & Sunny Weather</option>
                      <option value="humid">High Humidity</option>
                      <option value="rain_affected">Unseasonal Rain Ingress</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    id="pesticideCheck"
                    checked={pesticideSafe}
                    onChange={(e) => setPesticideSafe(e.target.checked)}
                    style={{ accentColor: "var(--tp-tone-green-color)", width: 16, height: 16 }}
                  />
                  <label htmlFor="pesticideCheck" style={{ fontSize: 11, color: parchment, cursor: "pointer" }}>
                    Complied with Pre-Harvest Interval (Zero harmful pesticide residues)
                  </label>
                </div>
              </div>

              {/* Tier 4: Packaging & Dispatch */}
              <div style={{ padding: 12, borderRadius: 14, background: "var(--tp-input-bg)", border: "1px solid var(--tp-border)" }}>
                <div style={{ fontSize: 10, textTransform: "uppercase", color: "var(--tp-tone-green-color)", fontWeight: 800, letterSpacing: ".1em", marginBottom: 8 }}>
                  Tier 4 · Packaging & Terminal Location
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 8 }}>
                  <div>
                    <label style={{ fontSize: 10, color: muted, display: "block", marginBottom: 4 }}>Packaging Type</label>
                    <select
                      value={packaging}
                      onChange={(e) => setPackaging(e.target.value)}
                      style={{ width: "100%", height: 38, borderRadius: 10, background: "var(--tp-panel)", color: parchment, border: "1px solid var(--tp-border)", padding: "0 8px", fontSize: 12 }}
                    >
                      <option value="50kg_new_jute">50kg New Jute/HDPE Bags</option>
                      <option value="sound_second_hand">Sound Reusable Bags</option>
                      <option value="loose_bulk">Loose Bulk in Trolley</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: muted, display: "block", marginBottom: 4 }}>Pickup Terminal / Gate</label>
                    <input
                      type="text"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      style={{ width: "100%", height: 38, borderRadius: 10, background: "var(--tp-panel)", color: parchment, border: "1px solid var(--tp-border)", padding: "0 10px", fontSize: 12, boxSizing: "border-box" }}
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStructuredAudit}
                disabled={isAnalyzing}
                style={{
                  width: "100%",
                  minHeight: 46,
                  borderRadius: 14,
                  background: isAnalyzing ? "var(--tp-border)" : "linear-gradient(135deg, #e5ba61, #b17b35)",
                  color: isAnalyzing ? muted : "#121511",
                  fontSize: 13,
                  fontWeight: 800,
                  border: "none",
                  cursor: isAnalyzing ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  marginTop: 4
                }}
              >
                {isAnalyzing ? <><RefreshCw size={16} className="animate-spin" /> Verifying against DMI Standards...</> : "Execute Statutory DMI AGMARK Audit"}
              </button>
            </div>
          )
        ) : (
          /* Certified Audit Result Presentation */
          <div style={{ marginTop: 14 }}>
            <div 
              style={{ 
                padding: 16, 
                borderRadius: 16, 
                background: isCompliant ? "var(--tp-tone-green-bg)" : "var(--tp-tone-red-bg)", 
                border: `1px solid ${isCompliant ? "var(--tp-tone-green-border)" : "var(--tp-tone-red-border)"}` 
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ marginTop: 2 }}>
                  {isCompliant ? <BadgeCheck size={26} color="var(--tp-tone-green-color)" /> : <Scale size={26} color="var(--tp-tone-red-color)" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ color: isCompliant ? "var(--tp-tone-green-color)" : "var(--tp-tone-red-color)", fontSize: 13, fontWeight: 800 }}>
                      {auditData ? auditData.dmiGrade : (isCompliant ? "DMI AGMARK Certified Grade-A" : "DMI AGMARK Quality Alert")}
                    </div>
                    {auditData && (
                      <span style={{ fontSize: 11, background: "var(--tp-panel)", padding: "2px 8px", borderRadius: 6, color: goldBright, fontFamily: "monospace" }}>
                        Score: {auditData.trustScore}/100
                      </span>
                    )}
                  </div>
                  
                  <div style={{ fontSize: 12, color: parchment, marginTop: 6, lineHeight: 1.6 }}>
                    {verdict}
                  </div>

                  {auditData && (
                    <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--tp-border)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 11 }}>
                      <div><span style={{ color: muted }}>Schedule Code:</span> <strong style={{ color: parchment }}>{auditData.stdCode}</strong></div>
                      <div><span style={{ color: muted }}>BioChain Cert:</span> <code style={{ color: goldBright }}>{auditData.certificateHash}</code></div>
                      <div><span style={{ color: muted }}>Storage Audit:</span> <strong style={{ color: parchment }}>{auditData.parametersSummary.storage}</strong></div>
                      <div><span style={{ color: muted }}>Chemical Safety:</span> <strong style={{ color: "var(--tp-tone-green-color)" }}>{auditData.parametersSummary.pesticideSafe}</strong></div>
                    </div>
                  )}

                  {auditData && auditData.deductionClauses && auditData.deductionClauses.length > 0 && (
                    <div style={{ marginTop: 10, background: "rgba(239, 68, 68, 0.1)", padding: "8px 10px", borderRadius: 8 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--tp-tone-red-color)", textTransform: "uppercase" }}>Contract Deduction Clauses:</div>
                      {auditData.deductionClauses.map((c: string, idx: number) => (
                        <div key={idx} style={{ fontSize: 11, color: parchment, marginTop: 2 }}>• {c}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAiVerified(false)}
              style={{
                background: "none",
                border: "none",
                color: "var(--tp-tone-green-color)",
                fontSize: 12,
                fontWeight: 700,
                marginTop: 10,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              ← Re-Audit Parameters / Edit Intake Data
            </button>
          </div>
        )}

        <div style={{ marginTop: 22 }}>
          <PrimaryButton 
            onClick={onNext} 
            icon={ArrowRight} 
            disabled={!isCompliant}
          >
            {isCompliant ? "Proceed to Payout Terminal" : "AGMARK Compliance Required to Proceed"}
          </PrimaryButton>
        </div>
      </div>
    </ScreenShell>
  );
}

// 9. Buyer Settlement Screen
function SettlementScreen({ onBack }: { onBack: () => void }) {
  return (
    <ScreenShell current="settlement" title="Escrow execution" eyebrow="09 / Settlement" onBack={onBack}>
      <div style={{ paddingTop: 10 }}>
        <SectionTitle kicker="Smart Contract Executed" title="Escrow disbursed to FPO." body="Automated bank transfer completed via RTGS/NEFT with BioChain cryptographic stamp." />
        <div style={{ padding: 16, borderRadius: 18, background: panelRaised, border: "1px solid var(--tp-border)", margin: "16px 0 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: muted, fontSize: 11 }}>Contract Status</span>
            <StatusPill tone="green">Fulfilled & Settled</StatusPill>
          </div>
          <div style={{ marginTop: 14, color: parchment, fontSize: 26, fontWeight: 800 }}>₹8,49,600</div>
          <div style={{ marginTop: 4, color: "var(--tp-tone-green-color)", fontSize: 11 }}>Disbursed to KisanSetu FPO Escrow</div>
          <div style={{ borderTop: "1px solid var(--tp-border)", marginTop: 14, paddingTop: 12, fontSize: 11, color: muted, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Advance Escrow (30%):</span><strong style={{ color: parchment }}>₹2,54,880 (Cleared)</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Delivery Release (70%):</span><strong style={{ color: parchment }}>₹5,94,720 (Cleared)</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>BioChain Tx:</span><code style={{ color: goldBright }}>0x7b3e...9a41</code></div>
          </div>
        </div>
        <PrimaryButton onClick={() => window.location.reload()} icon={RefreshCw} variant="outline">Start New Trade Mandate</PrimaryButton>
      </div>
    </ScreenShell>
  );
}

// 9b. Farmer Payout Screen
function FarmerPayoutScreen({ onBack }: { onBack: () => void }) {
  return (
    <ScreenShell current="settlement" title="Direct DBT payout" eyebrow="09 / Payout" onBack={onBack} role="farmer">
      <div style={{ paddingTop: 10 }}>
        <SectionTitle kicker="Payment Confirmation" title="Funds credited to bank account." body="Your payout has been transferred directly via automated e-mandate." />
        <div style={{ padding: 16, borderRadius: 18, background: panelRaised, border: "1px solid var(--tp-tone-green-border)", margin: "16px 0 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: muted, fontSize: 11 }}>DBT Bank Transfer</span>
            <StatusPill tone="green">Credited</StatusPill>
          </div>
          <div style={{ marginTop: 14, color: parchment, fontSize: 26, fontWeight: 800 }}>₹1,88,800</div>
          <div style={{ marginTop: 4, color: "var(--tp-tone-green-color)", fontSize: 11 }}>Account: SBI Sehore · ****4821</div>
          <div style={{ borderTop: "1px solid var(--tp-border)", marginTop: 14, paddingTop: 12, fontSize: 11, color: muted, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>UTR Number:</span><strong style={{ color: parchment }}>SBI9823471029</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>FPO Service Fee (1%):</span><strong style={{ color: parchment }}>-₹1,900</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Net Received:</span><strong style={{ color: goldBright }}>₹1,86,900</strong></div>
          </div>
        </div>
        <PrimaryButton onClick={() => window.location.reload()} icon={RefreshCw} variant="outline">Back to Farm Desk</PrimaryButton>
      </div>
    </ScreenShell>
  );
}

// Main Trading Portal Component
export default function TradingPortal({
  initialRole = "buyer",
  initialScreen = "welcome",
}: {
  initialRole?: BuyerRole;
  initialScreen?: FlowScreen;
}) {
  const [screen, setScreen] = useState<FlowScreen>(initialScreen);
  const [role, setRole] = useState<BuyerRole>(initialRole);
  const [corporateId, setCorporateId] = useState("27AABCM1234C1Z7");
  const [farmerId, setFarmerId] = useState("KISAN-MP-20841");
  const [mobile, setMobile] = useState("+91 98 7654 3210");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState("842915");
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

  const handleGenerateContract = async (fpo: string, buyer: string, crop: string, tons: number) => {
    try {
      await generateContract({ fpo, buyer, crop, tons: tons || 50 });
    } catch (e) {
      console.error("API Error generating contract:", e);
    }
  };

  const handleSendOtp = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/otp/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile })
      });
      const data = await res.json();
      if (data.demo_otp) {
        setGeneratedOtp(data.demo_otp);
        setOtp(["", "", "", "", "", ""]);
      }
    } catch (err) {
      console.error(err);
      const fallback = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(fallback);
      setOtp(["", "", "", "", "", ""]);
    } finally {
      setScreen("otp");
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      alert("Please enter the complete 6-digit confirmation code.");
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp: otpCode })
      });
      const data = await res.json();
      if (data.verified || otpCode === generatedOtp) {
        setScreen("kyc");
      } else {
        alert("Invalid OTP Code! Please enter the code shown in the SMS notification: " + generatedOtp);
      }
    } catch (err) {
      console.error(err);
      if (otpCode === generatedOtp) {
        setScreen("kyc");
      } else {
        alert("Invalid OTP Code! Please enter the code shown: " + generatedOtp);
      }
    }
  };

  // Screen Dispatcher
  if (screen === "welcome") {
    return <WelcomeScreen role={role} setRole={setRole} onStart={() => setScreen("login")} />;
  }
  if (screen === "login") {
    if (role === "farmer") {
      return (
        <FarmerLoginScreen
          farmerId={farmerId}
          setFarmerId={setFarmerId}
          mobile={mobile}
          setMobile={setMobile}
          onNext={handleSendOtp}
          onBack={back}
        />
      );
    }
    return (
      <LoginScreen
        corporateId={corporateId}
        setCorporateId={setCorporateId}
        mobile={mobile}
        setMobile={setMobile}
        onNext={handleSendOtp}
        onBack={back}
      />
    );
  }
  if (screen === "otp") {
    return (
      <OtpScreen
        otp={otp}
        setOtp={setOtp}
        generatedOtp={generatedOtp}
        onNext={handleVerifyOtp}
        onBack={back}
        onResend={handleSendOtp}
        role={role}
      />
    );
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
      return (
        <FarmerLotScreen
          crop={farmerCrop}
          setCrop={setFarmerCrop}
          quantity={harvestQuantity}
          setQuantity={setHarvestQuantity}
          askingPrice={askingPrice}
          setAskingPrice={setAskingPrice}
          harvestDate={harvestDate}
          setHarvestDate={setHarvestDate}
          onNext={() => setScreen("bids")}
          onBack={back}
        />
      );
    }
    return (
      <RfqScreen
        commodity={commodity}
        setCommodity={setCommodity}
        quantity={quantity}
        setQuantity={setQuantity}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        moisture={moisture}
        setMoisture={setMoisture}
        onNext={() => setScreen("bids")}
        onBack={back}
      />
    );
  }
  if (screen === "bids") {
    if (role === "farmer") {
      return <FarmerOffersScreen onNext={() => setScreen("qc")} onBack={back} onGenerateContract={handleGenerateContract} />;
    }
    return <BidsScreen onNext={() => setScreen("qc")} onBack={back} onGenerateContract={handleGenerateContract} />;
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
