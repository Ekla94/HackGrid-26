import { useState, useEffect, useRef } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  CloudSun,
  Droplets,
  FileCheck2,
  KeyRound,
  Landmark,
  MapPin,
  ReceiptIndianRupee,
  RefreshCw,
  Scale,
  ShieldCheck,
  Sparkles,
  Sprout,
  Store,
  Truck,
  WalletCards,
  Warehouse,
  Wheat,
  Zap,
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

// 8b. Farmer Proof Screen (Interactive Guided DMI AGMARK Question Flow)
function FarmerProofScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  // Wizard state: 0: Crop & Volume, 1: Moisture Feel, 2: Cleanliness, 3: Grain Soundness, 4: Storage & Safety
  const [currentStep, setCurrentStep] = useState(0);

  // Farmer's Answers (pre-loaded with standard Grade-1 FAQ presets)
  const [crop, setCrop] = useState("wheat");
  const [variety, setVariety] = useState("Sharbati C-306");
  const [quantityMt, setQuantityMt] = useState("25.0");

  // Question 2: Moisture Feel
  // Options: "crisp" (11.2%), "standard" (11.8%), "soft" (13.0%), "damp" (14.8%)
  const [moistureChoice, setMoistureChoice] = useState<"crisp" | "standard" | "soft" | "damp">("crisp");

  // Question 3: Cleanliness / Foreign Matter
  // Options: "machine_cleaned" (0.4%), "hand_winnowed" (0.8%), "field_mix" (1.8%)
  const [cleanlinessChoice, setCleanlinessChoice] = useState<"machine_cleaned" | "hand_winnowed" | "field_mix">("machine_cleaned");

  // Question 4: Grain Soundness / Defect
  // Options: "sound_lustrous" (0.8%), "minor_broken" (1.6%), "damaged" (3.8%)
  const [grainHealthChoice, setGrainHealthChoice] = useState<"sound_lustrous" | "minor_broken" | "damaged">("sound_lustrous");

  // Question 5: Storage Surroundings & Safety
  const [storageChoice, setStorageChoice] = useState<"covered_warehouse" | "open_shed" | "bare_earth">("covered_warehouse");
  const [pesticideSafe, setPesticideSafe] = useState(true);
  const [packaging, setPackaging] = useState("50kg_new_jute");
  const [pickupLocation, setPickupLocation] = useState("Sehore APMC Terminal Gate 4");

  // Verification & Audit state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiVerified, setAiVerified] = useState(false);
  const [isCompliant, setIsCompliant] = useState(false);
  const [verdict, setVerdict] = useState("");
  const [auditData, setAuditData] = useState<any>(null);

  // RAG Knowledge Assistant State
  const [showRagAssistant, setShowRagAssistant] = useState(false);
  const [ragQuery, setRagQuery] = useState("");
  const [ragLoading, setRagLoading] = useState(false);
  const [ragResult, setRagResult] = useState<any>(null);
  const [showAllChunks, setShowAllChunks] = useState(false);

  const handleAskRag = async (q?: string) => {
    const text = q || ragQuery;
    if (!text.trim()) return;
    setRagLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/rag/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text, commodity: crop })
      });
      const data = await res.json();
      setRagResult(data);
    } catch (err) {
      console.error("RAG Query Error:", err);
      setRagResult({
        answer: "Grounded in DMI Schedule AGMARK-WHT-2004 Section 3.1: Statutory Fair Average Quality (FAQ) moisture ceiling is 12.0%. Snapping dry grains indicate Grade-1 compliance. Pro-rata weight deduction applies for 12.1-13.5%.",
        citations: ["DMI Schedule AGMARK-WHT-2004 Section 3.1"],
        retrieved_chunks: []
      });
    } finally {
      setRagLoading(false);
    }
  };

  // Map choices to statutory DMI numbers
  const getMappedParameters = () => {
    const moistureMap = { crisp: 11.2, standard: 11.8, soft: 13.0, damp: 14.8 };
    const foreignMatterMap = { machine_cleaned: 0.4, hand_winnowed: 0.8, field_mix: 1.8 };
    const damagedMap = { sound_lustrous: 0.8, minor_broken: 1.6, damaged: 3.8 };

    return {
      crop,
      variety,
      quantity_mt: parseFloat(quantityMt) || 25.0,
      moisture_pct: moistureMap[moistureChoice],
      foreign_matter_pct: foreignMatterMap[cleanlinessChoice],
      damaged_pct: damagedMap[grainHealthChoice],
      storage_type: storageChoice,
      harvest_weather: moistureChoice === "damp" ? "rain_affected" : "dry_sunny",
      pesticide_safe: pesticideSafe,
      packaging,
      pickup_location: pickupLocation
    };
  };

  const executeDmiAudit = async (customPayload?: any) => {
    setIsAnalyzing(true);
    try {
      const payload = customPayload || getMappedParameters();
      const res = await fetch("http://localhost:8000/api/farmer/intake/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setAuditData(data);
      setVerdict(data.verdict || "DMI AGMARK statutory evaluation completed.");
      setIsCompliant(Boolean(data.isVerified));
      setAiVerified(true);
    } catch (err) {
      console.error(err);
      setVerdict("DMI AGMARK Statutory Engine evaluated harvest lot under Schedule AGMARK-WHT-2004. Quality parameters within Grade-1 FAQ tolerance.");
      setIsCompliant(true);
      setAiVerified(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Fast-track: Sets Grade-1 FAQ parameters and executes immediately in 1 click
  const handleFastTrackFAQ = () => {
    setMoistureChoice("crisp");
    setCleanlinessChoice("machine_cleaned");
    setGrainHealthChoice("sound_lustrous");
    setStorageChoice("covered_warehouse");
    setPesticideSafe(true);

    const fastPayload = {
      crop: crop || "wheat",
      variety: variety || "Sharbati C-306",
      quantity_mt: parseFloat(quantityMt) || 25.0,
      moisture_pct: 11.2,
      foreign_matter_pct: 0.4,
      damaged_pct: 0.8,
      storage_type: "covered_warehouse",
      harvest_weather: "dry_sunny",
      pesticide_safe: true,
      packaging: "50kg_new_jute",
      pickup_location: pickupLocation || "Sehore APMC Mandi Terminal"
    };

    executeDmiAudit(fastPayload);
  };

  const stepsMeta = [
    { title: "Commodity", icon: Wheat },
    { title: "Moisture Feel", icon: Droplets },
    { title: "Cleanliness", icon: Sparkles },
    { title: "Grain Health", icon: ShieldCheck },
    { title: "Storage & Safety", icon: Warehouse },
  ];

  return (
    <ScreenShell current="qc" title="AI harvest proof" eyebrow="08 / Dispatch" onBack={onBack} role="farmer">
      <div style={{ paddingTop: 6 }}>
        <SectionTitle 
          kicker="DMI AGMARK Public Statutory Standard" 
          title="Guided Harvest Quality Proof" 
          body="Answer 5 simple questions about your produce. Calibrated directly to Directorate of Marketing & Inspection (DMI) statutory schedules." 
        />

        {/* 1-Tap Fast Track Banner (Helping farmer not think too much) */}
        {!aiVerified && (
          <div 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between", 
              gap: 12, 
              padding: "10px 14px", 
              borderRadius: 14, 
              background: "linear-gradient(135deg, rgba(229,186,97,0.15), rgba(100,157,103,0.18))", 
              border: "1px solid rgba(229,186,97,0.35)",
              margin: "12px 0 16px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(229,186,97,0.25)", display: "grid", placeItems: "center", color: goldBright }}>
                <Zap size={18} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: parchment }}>1-Tap Fast-Track Verification</div>
                <div style={{ fontSize: 10, color: muted }}>Standard clean, dry FAQ harvest? Auto-certify Grade-1 in 1 click.</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleFastTrackFAQ}
              disabled={isAnalyzing}
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                background: "linear-gradient(135deg, #e5ba61, #b17b35)",
                color: "#121511",
                fontSize: 11,
                fontWeight: 800,
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              {isAnalyzing ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
              Fast-Track FAQ
            </button>
          </div>
        )}

        {/* RAG Knowledge Assistant Drawer */}
        {!aiVerified && (
          <div style={{ marginBottom: 16 }}>
            <button
              type="button"
              onClick={() => setShowRagAssistant(!showRagAssistant)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 12,
                background: showRagAssistant ? "var(--tp-panel-raised)" : "var(--tp-panel)",
                border: "1px solid rgba(229,186,97,0.3)",
                color: parchment,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 12,
                fontWeight: 700
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <BookOpen size={16} color={goldBright} />
                <span>Ask DMI Statutory RAG Assistant</span>
                <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 6, background: "rgba(229,186,97,0.15)", color: goldBright, fontWeight: 800 }}>
                  Gazette Vector Store
                </span>
              </div>
              <span style={{ fontSize: 11, color: muted }}>{showRagAssistant ? "▲ Hide Assistant" : "▼ Ask Regulatory Law"}</span>
            </button>

            {showRagAssistant && (
              <div style={{ marginTop: 8, padding: 14, borderRadius: 14, background: "var(--tp-panel-raised)", border: "1px solid var(--tp-border)" }}>
                <div style={{ fontSize: 11, color: muted, marginBottom: 8 }}>
                  Ask questions about official DMI AGMARK grading schedules, moisture tolerances, or chemical safety rules:
                </div>

                {/* Quick RAG Prompt Chips */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                  {[
                    "What is statutory moisture limit?",
                    "What happens if moisture is 13%?",
                    "Explain Pre-Harvest Interval (PHI)",
                    "What is foreign matter tolerance?"
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        setRagQuery(chip);
                        handleAskRag(chip);
                      }}
                      style={{
                        fontSize: 10,
                        padding: "4px 10px",
                        borderRadius: 8,
                        background: "var(--tp-input-bg)",
                        border: "1px solid var(--tp-border)",
                        color: goldBright,
                        cursor: "pointer"
                      }}
                    >
                      ⚡ {chip}
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    value={ragQuery}
                    onChange={(e) => setRagQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAskRag();
                      }
                    }}
                    placeholder={`e.g. Can buyer reject ${crop} for moisture?`}
                    style={{
                      flex: 1,
                      height: 38,
                      borderRadius: 10,
                      background: "var(--tp-input-bg)",
                      color: parchment,
                      border: "1px solid var(--tp-border)",
                      padding: "0 12px",
                      fontSize: 12
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleAskRag()}
                    disabled={ragLoading}
                    style={{
                      padding: "0 16px",
                      height: 38,
                      borderRadius: 10,
                      background: "linear-gradient(135deg, #e5ba61, #b17b35)",
                      color: "#121511",
                      fontSize: 12,
                      fontWeight: 800,
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    {ragLoading ? <RefreshCw size={14} className="animate-spin" /> : <BookOpen size={14} />}
                    Ask RAG
                  </button>
                </div>

                {/* RAG Answer Display */}
                {ragResult && (
                  <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: "var(--tp-panel)", border: "1px solid rgba(100,157,103,0.3)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: "var(--tp-tone-green-color)", textTransform: "uppercase" }}>
                        Retrieved Statutory Gazette Grounding
                      </span>
                      {ragResult.citations && ragResult.citations[0] && (
                        <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "rgba(100,157,103,0.15)", color: "var(--tp-tone-green-color)", fontFamily: "monospace" }}>
                          {ragResult.citations[0]}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: parchment, lineHeight: 1.6, whiteSpace: "pre-line" }}>
                      {ragResult.answer}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step Indicator Pills */}
        {!aiVerified && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, marginBottom: 16 }}>
            {stepsMeta.map((s, idx) => {
              const Icon = s.icon;
              const isActive = currentStep === idx;
              const isPast = currentStep > idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentStep(idx)}
                  style={{
                    padding: "8px 4px",
                    borderRadius: 10,
                    border: isActive ? "1px solid var(--tp-tone-green-color)" : (isPast ? "1px solid rgba(100,157,103,0.3)" : "1px solid var(--tp-border)"),
                    background: isActive ? "var(--tp-tone-green-bg)" : (isPast ? "rgba(100,157,103,0.08)" : "var(--tp-panel)"),
                    color: isActive ? "var(--tp-tone-green-color)" : (isPast ? parchment : muted),
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                    transition: "all 0.2s"
                  }}
                >
                  <Icon size={14} />
                  <span style={{ fontSize: 9, fontWeight: 700, whiteSpace: "nowrap" }}>{s.title}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Wizard Question Flow */}
        {!aiVerified ? (
          <div style={{ background: "var(--tp-panel)", border: "1px solid var(--tp-border)", borderRadius: 16, padding: 16 }}>
            
            {/* Question 1: Commodity & Volume */}
            {currentStep === 0 && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".12em", color: gold, fontWeight: 800 }}>
                    Question 1 of 5 · Commodity & Variety
                  </span>
                  <span style={{ fontSize: 10, color: muted }}>DMI Standard Schedule Selection</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: parchment, marginBottom: 4 }}>
                  Which agricultural commodity are you dispatching?
                </div>
                <div style={{ fontSize: 11, color: muted, marginBottom: 14 }}>
                  Each commodity has a statutory DMI schedule governing Fair Average Quality (FAQ) tolerances.
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                  {[
                    { id: "wheat", name: "Wheat (Gehun)", variety: "Sharbati C-306 / Lokwan", std: "AGMARK-WHT-2004", icon: "🌾", desc: "Moisture cap: ≤12.0% · Damage: ≤2.0%" },
                    { id: "soybean", name: "Yellow Soybean", variety: "JS-335 / JS-9560", std: "AGMARK-SOY-2001", icon: "🫘", desc: "Moisture cap: ≤12.0% · Damage: ≤3.0%" },
                    { id: "tomato", name: "Fresh Tomato", variety: "Hybrid Table Fresh", std: "AGMARK-TOM-2008", icon: "🍅", desc: "Firm Calyx · Defect: ≤3.0%" },
                    { id: "onion", name: "Rabi Onion", variety: "Nashik Red Garwa", std: "AGMARK-ONN-2004", icon: "🧅", desc: "Dry neck cured · Defect: ≤2.0%" },
                    { id: "rice", name: "Paddy / Rice", variety: "Basmati / Pusa 1121", std: "AGMARK-PDY-2002", icon: "🍚", desc: "Moisture cap: ≤14.0% · Damage: ≤2.0%" },
                    { id: "chana", name: "Bengal Gram (Chana)", variety: "Desi Bold Chickpea", std: "AGMARK-CHN-2003", icon: "🥣", desc: "Moisture cap: ≤10.5% · Damage: ≤2.0%" },
                  ].map((item) => {
                    const selected = crop === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setCrop(item.id);
                          setVariety(item.variety);
                        }}
                        style={{
                          padding: 12,
                          borderRadius: 12,
                          textAlign: "left",
                          cursor: "pointer",
                          border: selected ? "2px solid var(--tp-tone-green-color)" : "1px solid var(--tp-border)",
                          background: selected ? "var(--tp-tone-green-bg)" : "var(--tp-input-bg)",
                          transition: "all 0.15s"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 20 }}>{item.icon}</span>
                          {selected && <CheckCircle2 size={16} color="var(--tp-tone-green-color)" />}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: parchment, marginTop: 4 }}>{item.name}</div>
                        <div style={{ fontSize: 10, color: gold, marginTop: 1 }}>{item.variety}</div>
                        <div style={{ fontSize: 9, color: muted, marginTop: 4, fontFamily: "monospace" }}>{item.std}</div>
                      </button>
                    );
                  })}
                </div>

                <div style={{ borderTop: "1px solid var(--tp-border)", paddingTop: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: parchment, marginBottom: 8 }}>Lot Quantity:</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {["10.0", "25.0", "50.0", "100.0"].map((qty) => (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => setQuantityMt(qty)}
                        style={{
                          flex: 1,
                          padding: "8px 0",
                          borderRadius: 8,
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: "pointer",
                          border: quantityMt === qty ? "1px solid var(--tp-tone-green-color)" : "1px solid var(--tp-border)",
                          background: quantityMt === qty ? "var(--tp-tone-green-bg)" : "var(--tp-panel-raised)",
                          color: quantityMt === qty ? "var(--tp-tone-green-color)" : parchment
                        }}
                      >
                        {qty} MT
                      </button>
                    ))}
                    <input
                      type="number"
                      step="0.5"
                      value={quantityMt}
                      onChange={(e) => setQuantityMt(e.target.value)}
                      style={{
                        width: 90,
                        height: 36,
                        borderRadius: 8,
                        background: "var(--tp-input-bg)",
                        color: parchment,
                        border: "1px solid var(--tp-border)",
                        padding: "0 8px",
                        fontSize: 12,
                        textAlign: "center"
                      }}
                      placeholder="Custom MT"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Question 2: Moisture Feel */}
            {currentStep === 1 && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".12em", color: gold, fontWeight: 800 }}>
                    Question 2 of 5 · Moisture & Physical Feel
                  </span>
                  <span style={{ fontSize: 10, color: "var(--tp-tone-green-color)", fontWeight: 700 }}>DMI Cap: ≤12.0%</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: parchment, marginBottom: 4 }}>
                  When you bite or press the grain, how does it feel?
                </div>
                <div style={{ fontSize: 11, color: muted, marginBottom: 14 }}>
                  No moisture meter needed. DMI benchmarks match physical tactile grain crispness.
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    {
                      id: "crisp",
                      title: "Bone Dry & Crisp",
                      sub: "Snaps sharply between teeth with clean crack. Zero doughy yield.",
                      badge: "Grade-1 Special FAQ (~11.2% Moisture)",
                      tagTone: "green",
                      dmiNote: "Well within 12.0% statutory cap. Eligible for 100% full payout with zero drying deduction."
                    },
                    {
                      id: "standard",
                      title: "Standard Dry",
                      sub: "Firm and hard to pinch. Feels dry and cool to hand touch.",
                      badge: "Grade-2 FAQ Compliant (~11.8% Moisture)",
                      tagTone: "green",
                      dmiNote: "Satisfies DMI statutory mandi intake guidelines. Safe for transit."
                    },
                    {
                      id: "soft",
                      title: "Slightly Soft / Cool",
                      sub: "Yields under firm thumbnail pressure. Needs 1-2 hours sun aeration.",
                      badge: "Borderline Moisture (~13.0% Moisture)",
                      tagTone: "gold",
                      dmiNote: "Exceeds standard 12.0% limit. Buyer applies minor weight adjustment (-1.5%)."
                    },
                    {
                      id: "damp",
                      title: "Damp / Sticky (Fresh Cut)",
                      sub: "Harvested fresh or moist. Cold, doughy feel.",
                      badge: "Non-Compliant (>14.5% Moisture)",
                      tagTone: "red",
                      dmiNote: "High risk of fungal heating. DMI rules require sun drying prior to weighbridge."
                    }
                  ].map((opt) => {
                    const selected = moistureChoice === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setMoistureChoice(opt.id as any);
                        }}
                        style={{
                          padding: 14,
                          borderRadius: 14,
                          textAlign: "left",
                          cursor: "pointer",
                          border: selected ? "2px solid var(--tp-tone-green-color)" : "1px solid var(--tp-border)",
                          background: selected ? "var(--tp-tone-green-bg)" : "var(--tp-input-bg)",
                          transition: "all 0.15s"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 13, fontWeight: 800, color: parchment }}>{opt.title}</span>
                          <span style={{ 
                            fontSize: 10, 
                            fontWeight: 700, 
                            padding: "2px 8px", 
                            borderRadius: 6,
                            background: opt.tagTone === "green" ? "rgba(100,157,103,0.2)" : (opt.tagTone === "gold" ? "rgba(229,186,97,0.2)" : "rgba(213,131,101,0.2)"),
                            color: opt.tagTone === "green" ? "var(--tp-tone-green-color)" : (opt.tagTone === "gold" ? goldBright : "var(--tp-tone-red-color)")
                          }}>
                            {opt.badge}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: parchment, marginTop: 4 }}>{opt.sub}</div>
                        <div style={{ fontSize: 10, color: muted, marginTop: 4 }}>⚖️ {opt.dmiNote}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Question 3: Cleanliness & Foreign Matter */}
            {currentStep === 2 && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".12em", color: gold, fontWeight: 800 }}>
                    Question 3 of 5 · Cleanliness & Refraction
                  </span>
                  <span style={{ fontSize: 10, color: "var(--tp-tone-green-color)", fontWeight: 700 }}>DMI Limit: ≤1.0%</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: parchment, marginBottom: 4 }}>
                  How clean is the lot from dust, straw, chaff, or stones?
                </div>
                <div style={{ fontSize: 11, color: muted, marginBottom: 14 }}>
                  Statutory DMI refraction standards measure organic impurities vs sound grain weight.
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    {
                      id: "machine_cleaned",
                      title: "Machine Graded & Sieved",
                      sub: "Passed through mechanical sieve/destoner. Zero visible stones or weed seeds.",
                      badge: "Grade-1 Special (<0.4% Foreign Matter)",
                      tagTone: "green",
                      dmiNote: "Benchmark cleanliness. Preferred by corporate flour mills and biscuit manufacturers."
                    },
                    {
                      id: "hand_winnowed",
                      title: "Hand Winnowed / Traditional Cleaned",
                      sub: "Winnowed against wind. Clean plump grains with negligible dust or fine chaff.",
                      badge: "FAQ Compliant (~0.8% Foreign Matter)",
                      tagTone: "green",
                      dmiNote: "Meets public statutory DMI APMC mandi intake standards without deduction."
                    },
                    {
                      id: "field_mix",
                      title: "Field Harvest Mix (Uncleaned)",
                      sub: "Straight from thresher. Contains noticeable straw pieces, pod husk, or dirt.",
                      badge: "Cleaning Surcharge (~1.8% Foreign Matter)",
                      tagTone: "gold",
                      dmiNote: "Exceeds 1.0% limit. Buyer applies ₹15/quintal mechanical sieving deduction."
                    }
                  ].map((opt) => {
                    const selected = cleanlinessChoice === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setCleanlinessChoice(opt.id as any)}
                        style={{
                          padding: 14,
                          borderRadius: 14,
                          textAlign: "left",
                          cursor: "pointer",
                          border: selected ? "2px solid var(--tp-tone-green-color)" : "1px solid var(--tp-border)",
                          background: selected ? "var(--tp-tone-green-bg)" : "var(--tp-input-bg)",
                          transition: "all 0.15s"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 13, fontWeight: 800, color: parchment }}>{opt.title}</span>
                          <span style={{ 
                            fontSize: 10, 
                            fontWeight: 700, 
                            padding: "2px 8px", 
                            borderRadius: 6,
                            background: opt.tagTone === "green" ? "rgba(100,157,103,0.2)" : "rgba(229,186,97,0.2)",
                            color: opt.tagTone === "green" ? "var(--tp-tone-green-color)" : goldBright
                          }}>
                            {opt.badge}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: parchment, marginTop: 4 }}>{opt.sub}</div>
                        <div style={{ fontSize: 10, color: muted, marginTop: 4 }}>⚖️ {opt.dmiNote}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Question 4: Grain Soundness & Defect */}
            {currentStep === 3 && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".12em", color: gold, fontWeight: 800 }}>
                    Question 4 of 5 · Grain Soundness & Defect
                  </span>
                  <span style={{ fontSize: 10, color: "var(--tp-tone-green-color)", fontWeight: 700 }}>DMI Limit: ≤2.0%</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: parchment, marginBottom: 4 }}>
                  Look closely at a handful of grains. How healthy are they?
                </div>
                <div style={{ fontSize: 11, color: muted, marginBottom: 14 }}>
                  DMI defect tolerances cover broken, weeviled, immature, or fungus-affected grains.
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    {
                      id: "sound_lustrous",
                      title: "Sound, Bold & Lustrous Grains",
                      sub: "Bright natural color, uniform bold grains, zero weevil boreholes, zero black spots.",
                      badge: "Grade-1 Premium (<0.8% Defects)",
                      tagTone: "green",
                      dmiNote: "Statutory Grade-1. Zero quality deduction on contract settlement."
                    },
                    {
                      id: "minor_broken",
                      title: "Occasional Broken or Shriveled Grains",
                      sub: "Minor broken grains from mechanical threshing. No live insects, no discoloration.",
                      badge: "FAQ Permissible (~1.6% Defects)",
                      tagTone: "green",
                      dmiNote: "Within permissible 2.0% statutory allowance. Standard commercial grade."
                    },
                    {
                      id: "damaged",
                      title: "Rain Damaged, Blackened, or Weeviled",
                      sub: "Dark tips, mold spots, or insect holes from unseasonal rain or pest exposure.",
                      badge: "Sub-Standard Alert (>3.5% Defects)",
                      tagTone: "red",
                      dmiNote: "Exceeds statutory allowance. Triggers lab spot-check and price penalty."
                    }
                  ].map((opt) => {
                    const selected = grainHealthChoice === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setGrainHealthChoice(opt.id as any)}
                        style={{
                          padding: 14,
                          borderRadius: 14,
                          textAlign: "left",
                          cursor: "pointer",
                          border: selected ? "2px solid var(--tp-tone-green-color)" : "1px solid var(--tp-border)",
                          background: selected ? "var(--tp-tone-green-bg)" : "var(--tp-input-bg)",
                          transition: "all 0.15s"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 13, fontWeight: 800, color: parchment }}>{opt.title}</span>
                          <span style={{ 
                            fontSize: 10, 
                            fontWeight: 700, 
                            padding: "2px 8px", 
                            borderRadius: 6,
                            background: opt.tagTone === "green" ? "rgba(100,157,103,0.2)" : "rgba(213,131,101,0.2)",
                            color: opt.tagTone === "green" ? "var(--tp-tone-green-color)" : "var(--tp-tone-red-color)"
                          }}>
                            {opt.badge}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: parchment, marginTop: 4 }}>{opt.sub}</div>
                        <div style={{ fontSize: 10, color: muted, marginTop: 4 }}>⚖️ {opt.dmiNote}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Question 5: Storage Surroundings & Chemical Safety */}
            {currentStep === 4 && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".12em", color: gold, fontWeight: 800 }}>
                    Question 5 of 5 · Storage & Chemical Safety
                  </span>
                  <span style={{ fontSize: 10, color: "var(--tp-tone-green-color)", fontWeight: 700 }}>Food Safety & Traceability</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: parchment, marginBottom: 4 }}>
                  Where was this lot stored, and was pesticide safety maintained?
                </div>
                <div style={{ fontSize: 11, color: muted, marginBottom: 14 }}>
                  Buyers require hygienic storage surroundings and compliance with Pre-Harvest Intervals (PHI).
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                  {[
                    {
                      id: "covered_warehouse",
                      title: "Covered Pucca Godown / Silo",
                      sub: "Elevated on wooden pallets with dry concrete floor. Complete protection from damp.",
                      badge: "Grade-1 Certified Storage",
                      tagTone: "green"
                    },
                    {
                      id: "open_shed",
                      title: "Covered Farm Shed on Raised Plinth",
                      sub: "Protected from rain by roof and tarpaulin flaps on raised earth plinth.",
                      badge: "Standard On-Farm Storage",
                      tagTone: "green"
                    },
                    {
                      id: "bare_earth",
                      title: "Open Yard on Ground under Tarpaulin",
                      sub: "Produce placed directly on soil. Vulnerable to ground moisture and night dew.",
                      badge: "Outdoor Ground Risk",
                      tagTone: "gold"
                    }
                  ].map((opt) => {
                    const selected = storageChoice === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setStorageChoice(opt.id as any)}
                        style={{
                          padding: 12,
                          borderRadius: 14,
                          textAlign: "left",
                          cursor: "pointer",
                          border: selected ? "2px solid var(--tp-tone-green-color)" : "1px solid var(--tp-border)",
                          background: selected ? "var(--tp-tone-green-bg)" : "var(--tp-input-bg)",
                          transition: "all 0.15s"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 13, fontWeight: 800, color: parchment }}>{opt.title}</span>
                          <span style={{ 
                            fontSize: 10, 
                            fontWeight: 700, 
                            padding: "2px 8px", 
                            borderRadius: 6,
                            background: opt.tagTone === "green" ? "rgba(100,157,103,0.2)" : "rgba(229,186,97,0.2)",
                            color: opt.tagTone === "green" ? "var(--tp-tone-green-color)" : goldBright
                          }}>
                            {opt.badge}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: parchment, marginTop: 4 }}>{opt.sub}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Pre-Harvest Interval Checkbox */}
                <div style={{ 
                  padding: 12, 
                  borderRadius: 12, 
                  background: "var(--tp-panel-raised)", 
                  border: "1px solid var(--tp-border)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  marginBottom: 12
                }}>
                  <input
                    type="checkbox"
                    id="pesticideCheckGuided"
                    checked={pesticideSafe}
                    onChange={(e) => setPesticideSafe(e.target.checked)}
                    style={{ accentColor: "var(--tp-tone-green-color)", width: 18, height: 18, marginTop: 2 }}
                  />
                  <div>
                    <label htmlFor="pesticideCheckGuided" style={{ fontSize: 12, fontWeight: 700, color: parchment, cursor: "pointer" }}>
                      Chemical Safety & Pre-Harvest Interval (PHI) Complied
                    </label>
                    <div style={{ fontSize: 10, color: muted, marginTop: 2 }}>
                      I confirm no pesticide spray within 15 days of harvest. Produce satisfies FSSAI/DMI Maximum Residue Limits (MRL).
                    </div>
                  </div>
                </div>

                {/* Packaging & Terminal */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 10, color: muted, display: "block", marginBottom: 4 }}>Standard Packaging</label>
                    <select
                      value={packaging}
                      onChange={(e) => setPackaging(e.target.value)}
                      style={{ width: "100%", height: 36, borderRadius: 8, background: "var(--tp-input-bg)", color: parchment, border: "1px solid var(--tp-border)", padding: "0 8px", fontSize: 11 }}
                    >
                      <option value="50kg_new_jute">50kg New Jute/HDPE Bags (Standard)</option>
                      <option value="sound_second_hand">Sound Reusable Bags</option>
                      <option value="loose_bulk">Loose Bulk in Trolley</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 10, color: muted, display: "block", marginBottom: 4 }}>Dispatch Terminal / APMC Gate</label>
                    <input
                      type="text"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      style={{ width: "100%", height: 36, borderRadius: 8, background: "var(--tp-input-bg)", color: parchment, border: "1px solid var(--tp-border)", padding: "0 10px", fontSize: 11, boxSizing: "border-box" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Controls */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--tp-border)" }}>
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    background: "var(--tp-input-bg)",
                    border: "1px solid var(--tp-border)",
                    color: parchment,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  <ArrowLeft size={14} /> Back
                </button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 10,
                    background: "var(--tp-tone-green-color)",
                    border: "none",
                    color: "#ffffff",
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  Next Question <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => executeDmiAudit()}
                  disabled={isAnalyzing}
                  style={{
                    padding: "10px 22px",
                    borderRadius: 12,
                    background: isAnalyzing ? "var(--tp-border)" : "linear-gradient(135deg, #e5ba61, #b17b35)",
                    color: isAnalyzing ? muted : "#121511",
                    fontSize: 13,
                    fontWeight: 800,
                    border: "none",
                    cursor: isAnalyzing ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }}
                >
                  {isAnalyzing ? <><RefreshCw size={16} className="animate-spin" /> Auditing against DMI Schedules...</> : <><ShieldCheck size={16} /> Execute DMI AGMARK Audit</>}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Official Certified Audit Presentation Card */
          <div style={{ marginTop: 8 }}>
            <div 
              style={{ 
                padding: 18, 
                borderRadius: 18, 
                background: isCompliant ? "var(--tp-tone-green-bg)" : "var(--tp-tone-red-bg)", 
                border: `1.5px solid ${isCompliant ? "var(--tp-tone-green-border)" : "var(--tp-tone-red-border)"}`,
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
              }}
            >
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: isCompliant ? "rgba(100,157,103,0.25)" : "rgba(213,131,101,0.25)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  {isCompliant ? <BadgeCheck size={26} color="var(--tp-tone-green-color)" /> : <AlertCircle size={26} color="var(--tp-tone-red-color)" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".15em", color: isCompliant ? "var(--tp-tone-green-color)" : "var(--tp-tone-red-color)", fontWeight: 800 }}>
                        Directorate of Marketing & Inspection (DMI) Statutory Certificate
                      </div>
                      <div style={{ color: parchment, fontSize: 16, fontWeight: 900, marginTop: 2 }}>
                        {auditData ? auditData.dmiGrade : (isCompliant ? "AGMARK Grade-1 (Special FAQ)" : "DMI AGMARK Quality Alert")}
                      </div>
                    </div>
                    {auditData && (
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 11, background: "var(--tp-panel)", padding: "4px 10px", borderRadius: 8, color: goldBright, fontFamily: "monospace", fontWeight: 800 }}>
                          Score: {auditData.trustScore}/100
                        </div>
                        <div style={{ fontSize: 9, color: muted, marginTop: 2 }}>Trust Verified</div>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ fontSize: 12, color: parchment, marginTop: 10, lineHeight: 1.6, padding: "10px 12px", background: "var(--tp-panel)", borderRadius: 10, border: "1px solid var(--tp-border)" }}>
                    {verdict}
                  </div>

                  {/* Certified Parameters Grid */}
                  <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 11 }}>
                    <div style={{ padding: "8px 10px", borderRadius: 8, background: "var(--tp-panel)", border: "1px solid var(--tp-border)" }}>
                      <span style={{ color: muted, display: "block", fontSize: 10 }}>Schedule Code:</span>
                      <strong style={{ color: parchment }}>{auditData?.stdCode || "AGMARK-WHT-2004"}</strong>
                    </div>
                    <div style={{ padding: "8px 10px", borderRadius: 8, background: "var(--tp-panel)", border: "1px solid var(--tp-border)" }}>
                      <span style={{ color: muted, display: "block", fontSize: 10 }}>BioChain Certificate Hash:</span>
                      <code style={{ color: goldBright, fontSize: 10 }}>{auditData?.certificateHash || "0xa2744473e62927ae"}</code>
                    </div>
                    <div style={{ padding: "8px 10px", borderRadius: 8, background: "var(--tp-panel)", border: "1px solid var(--tp-border)" }}>
                      <span style={{ color: muted, display: "block", fontSize: 10 }}>Moisture Compliance:</span>
                      <strong style={{ color: "var(--tp-tone-green-color)" }}>{auditData?.parametersSummary?.moisture || "11.2% (Limit: 12.0%)"}</strong>
                    </div>
                    <div style={{ padding: "8px 10px", borderRadius: 8, background: "var(--tp-panel)", border: "1px solid var(--tp-border)" }}>
                      <span style={{ color: muted, display: "block", fontSize: 10 }}>Refraction & Foreign Matter:</span>
                      <strong style={{ color: "var(--tp-tone-green-color)" }}>{auditData?.parametersSummary?.foreignMatter || "0.4% (Limit: 1.0%)"}</strong>
                    </div>
                    <div style={{ padding: "8px 10px", borderRadius: 8, background: "var(--tp-panel)", border: "1px solid var(--tp-border)" }}>
                      <span style={{ color: muted, display: "block", fontSize: 10 }}>Storage Facility:</span>
                      <strong style={{ color: parchment }}>{auditData?.parametersSummary?.storage || "Covered Warehouse"}</strong>
                    </div>
                    <div style={{ padding: "8px 10px", borderRadius: 8, background: "var(--tp-panel)", border: "1px solid var(--tp-border)" }}>
                      <span style={{ color: muted, display: "block", fontSize: 10 }}>Chemical PHI Safety:</span>
                      <strong style={{ color: "var(--tp-tone-green-color)" }}>{auditData?.parametersSummary?.pesticideSafe || "Compliant"}</strong>
                    </div>
                  </div>

                  {/* RAG Knowledge Grounding & Gazette Citations */}
                  <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 10, background: "var(--tp-panel)", border: "1px solid rgba(229,186,97,0.35)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <BookOpen size={14} color={goldBright} />
                        <span style={{ fontSize: 10, fontWeight: 800, color: goldBright, textTransform: "uppercase" }}>
                          RAG Statutory Grounding (Gazette of India)
                        </span>
                      </div>
                      <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "rgba(229,186,97,0.15)", color: goldBright, fontFamily: "monospace" }}>
                        {auditData?.ragGrounding?.citations?.[0] || "DMI Schedule AGMARK-WHT-2004 Section 3.1"}
                      </span>
                    </div>

                    <div style={{ fontSize: 11, color: parchment, marginTop: 6, lineHeight: 1.5 }}>
                      {auditData?.ragGrounding?.narrative || "Harvest lot verified using RAG against retrieved statutory DMI AGMARK schedules and FSSAI Pre-Harvest chemical interval standards."}
                    </div>

                    {auditData?.ragGrounding?.retrievedChunks && auditData.ragGrounding.retrievedChunks.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <button
                          type="button"
                          onClick={() => setShowAllChunks(!showAllChunks)}
                          style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            color: "var(--tp-tone-green-color)",
                            fontSize: 10,
                            fontWeight: 700,
                            cursor: "pointer"
                          }}
                        >
                          {showAllChunks ? "▲ Hide Retrieved Statutory Gazette Clauses" : `▼ View ${auditData.ragGrounding.retrievedChunks.length} Retrieved Statutory Gazette Clauses`}
                        </button>

                        {showAllChunks && (
                          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                            {auditData.ragGrounding.retrievedChunks.map((chunk: any, cIdx: number) => (
                              <div key={cIdx} style={{ padding: 8, borderRadius: 8, background: "var(--tp-panel-raised)", border: "1px solid var(--tp-border)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <strong style={{ fontSize: 10, color: gold }}>{chunk.title}</strong>
                                  <span style={{ fontSize: 9, color: "var(--tp-tone-green-color)", fontFamily: "monospace" }}>{chunk.citation}</span>
                                </div>
                                <div style={{ fontSize: 10, color: muted, marginTop: 3, lineHeight: 1.4 }}>
                                  {chunk.content}
                                </div>
                                <div style={{ fontSize: 9, color: parchment, marginTop: 4, display: "flex", justifyContent: "space-between" }}>
                                  <span>Statutory Limit: <strong>{chunk.statutory_limit}</strong></span>
                                  <span style={{ color: goldBright }}>{chunk.grade_impact}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {auditData?.deductionClauses && auditData.deductionClauses.length > 0 && (
                    <div style={{ marginTop: 10, background: "rgba(239, 68, 68, 0.1)", padding: "8px 10px", borderRadius: 8 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--tp-tone-red-color)", textTransform: "uppercase" }}>Noticeable Quality Clauses:</div>
                      {auditData.deductionClauses.map((c: string, idx: number) => (
                        <div key={idx} style={{ fontSize: 11, color: parchment, marginTop: 2 }}>• {c}</div>
                      ))}
                    </div>
                  )}

                  {isCompliant && (
                    <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: 8, background: "rgba(100,157,103,0.15)", border: "1px solid rgba(100,157,103,0.3)", display: "flex", alignItems: "center", gap: 8 }}>
                      <CheckCircle2 size={16} color="var(--tp-tone-green-color)" />
                      <span style={{ fontSize: 11, color: "var(--tp-tone-green-color)", fontWeight: 700 }}>
                        30% Advance Escrow Release Authorized for Payout
                      </span>
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
                marginTop: 12,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              ← Re-Answer Questions / Modify Harvest Parameters
            </button>
          </div>
        )}

        {/* Primary Action Button to Proceed */}
        <div style={{ marginTop: 20 }}>
          <PrimaryButton 
            onClick={onNext} 
            icon={ArrowRight} 
            disabled={!isCompliant}
          >
            {isCompliant ? "Proceed to Payout Terminal" : "Complete DMI AGMARK Verification to Proceed"}
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
