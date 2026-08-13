import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type ReactNode,
  type ButtonHTMLAttributes,
  type ChangeEvent,
} from 'react';
import { Calendar } from 'lucide-react';

/* ---------- TextInput ---------- */
export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }>(
  ({ className = '', invalid, ...props }, ref) => (
    <input
      ref={ref}
      className={`vb-input ${invalid ? '!border-brand-blue ring-1 ring-brand-blue/20' : ''} ${className}`}
      {...props}
    />
  )
);
TextInput.displayName = 'TextInput';

function isValidYmd(y: string, m: string, d: string) {
  const yi = Number(y);
  const mi = Number(m);
  const di = Number(d);
  if (!yi || mi < 1 || mi > 12 || di < 1 || di > 31) return false;
  const dt = new Date(yi, mi - 1, di);
  return dt.getFullYear() === yi && dt.getMonth() === mi - 1 && dt.getDate() === di;
}

function isoToDisplay(iso: string) {
  if (!iso) return '';
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  return iso;
}

function displayToIso(display: string): string | null {
  const cleaned = display.trim();
  if (!cleaned) return '';
  const dmy = cleaned.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmy) {
    const d = dmy[1].padStart(2, '0');
    const m = dmy[2].padStart(2, '0');
    const y = dmy[3];
    return isValidYmd(y, m, d) ? `${y}-${m}-${d}` : null;
  }
  const ymd = cleaned.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (ymd) return isValidYmd(ymd[1], ymd[2], ymd[3]) ? `${ymd[1]}-${ymd[2]}-${ymd[3]}` : null;
  return null;
}

function formatTyping(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/* ---------- DateInput: type manually (DD/MM/YYYY) + calendar picker ---------- */
export const DateInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', value, defaultValue, onChange, onBlur, disabled, name, id, ...props }, ref) => {
    const pickerRef = useRef<HTMLInputElement>(null);
    const controlled = value !== undefined;
    const initial = isoToDisplay(String(value ?? defaultValue ?? ''));
    const [text, setText] = useState(initial);

    useEffect(() => {
      if (controlled) setText(isoToDisplay(String(value ?? '')));
    }, [controlled, value]);

    const emit = (iso: string, el: HTMLInputElement) => {
      if (!onChange) return;
      const event = {
        ...new Event('change', { bubbles: true }),
        target: { ...el, value: iso, name: name ?? '' },
        currentTarget: { ...el, value: iso, name: name ?? '' },
      } as unknown as ChangeEvent<HTMLInputElement>;
      onChange(event);
    };

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
      const next = formatTyping(e.target.value);
      setText(next);
      const iso = displayToIso(next);
      if (iso !== null) emit(iso, e.target);
    };

    const handlePickerChange = (e: ChangeEvent<HTMLInputElement>) => {
      const iso = e.target.value;
      setText(isoToDisplay(iso));
      emit(iso, e.target);
    };

    const openPicker = () => {
      const el = pickerRef.current;
      if (!el || disabled) return;
      try {
        el.showPicker?.();
      } catch {
        el.click();
      }
    };

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          placeholder="DD/MM/YYYY"
          name={name}
          id={id}
          disabled={disabled}
          value={text}
          onChange={handleTextChange}
          onBlur={(e) => {
            const iso = displayToIso(text);
            if (iso) setText(isoToDisplay(iso));
            onBlur?.(e);
          }}
          className={`vb-input pr-9 ${className}`}
          autoComplete="off"
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={openPicker}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded text-sub hover:text-brand-blue disabled:opacity-40"
          aria-label="Open calendar"
        >
          <Calendar className="w-3.5 h-3.5" />
        </button>
        <input
          ref={pickerRef}
          type="date"
          tabIndex={-1}
          disabled={disabled}
          value={displayToIso(text) || ''}
          onChange={handlePickerChange}
          className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden"
          aria-hidden
        />
      </div>
    );
  }
);
DateInput.displayName = 'DateInput';

/* ---------- SelectInput ---------- */
type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode };
export const SelectInput = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', children, ...props }, ref) => (
    <div className="relative">
      <select ref={ref} className={`vb-input appearance-none pr-7 ${className}`} {...props}>
        {children}
      </select>
      <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-sub" viewBox="0 0 12 12" fill="none">
        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
);
SelectInput.displayName = 'SelectInput';

/* ---------- Checkbox ---------- */
export function Checkbox({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: ReactNode;
  disabled?: boolean;
}) {
  return (
    <label className={`inline-flex items-center gap-2 text-[12px] text-ink ${disabled ? 'opacity-60' : 'cursor-pointer'}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded-[3px] border border-[#D5D9DE] accent-brand-blue cursor-pointer"
      />
      {label && <span>{label}</span>}
    </label>
  );
}

/* ---------- Label / FormField ---------- */
export function FormField({
  label,
  required,
  children,
  className = '',
  hint,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  hint?: string;
}) {
  return (
    <div className={className}>
      <label className="vb-label">
        {label} {required && <span className="text-brand-blue">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[10px] text-sub">{hint}</p>}
    </div>
  );
}

/* ---------- Buttons ---------- */
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode };
export function PrimaryButton({ className = '', children, ...props }: BtnProps) {
  return (
    <button className={`vb-btn bg-gradient-to-b from-brand-blue to-brand-dark text-white hover:from-brand-dark hover:to-brand-dark ${className}`} {...props}>
      {children}
    </button>
  );
}
export function CyanButton({ className = '', children, ...props }: BtnProps) {
  return (
    <button className={`vb-btn bg-gradient-to-b from-cyan-500 to-cyan-600 text-white hover:to-cyan-700 ${className}`} {...props}>
      {children}
    </button>
  );
}
export function GreenButton({ className = '', children, ...props }: BtnProps) {
  return (
    <button className={`vb-btn bg-gradient-to-b from-emerald-500 to-emerald-600 text-white hover:to-emerald-700 ${className}`} {...props}>
      {children}
    </button>
  );
}
export function PurpleButton({ className = '', children, ...props }: BtnProps) {
  return (
    <button className={`vb-btn bg-gradient-to-b from-brand-blue to-brand-dark text-white hover:to-brand-dark ${className}`} {...props}>
      {children}
    </button>
  );
}
export function GrayButton({ className = '', children, ...props }: BtnProps) {
  return (
    <button className={`vb-btn bg-gradient-to-b from-[#6B747D] to-[#525A62] text-white hover:to-[#3F4650] ${className}`} {...props}>
      {children}
    </button>
  );
}
export function OutlineButton({ className = '', children, ...props }: BtnProps) {
  return (
    <button className={`vb-btn bg-white border border-[#D5D9DE] text-ink hover:bg-gray-50 ${className}`} {...props}>
      {children}
    </button>
  );
}
