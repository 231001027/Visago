import { useEffect, useRef, useState, type ReactNode } from 'react';
import { UploadCloud, Eye, Trash2, CheckCircle2, FileText } from 'lucide-react';
import { PrimaryButton, GreenButton, GrayButton } from './primitives';

function BlueBtn({ children, ...props }: { children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="vb-btn bg-gradient-to-b from-blue-500 to-blue-600 text-white hover:to-blue-700 !h-[30px] !px-3" {...props}>
      {children}
    </button>
  );
}
function RedBtn({ children, ...props }: { children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="vb-btn bg-gradient-to-b from-red-500 to-red-600 text-white hover:to-red-700 !h-[30px] !px-3" {...props}>
      {children}
    </button>
  );
}

export function FileUpload({
  label = 'GST Certificate / PAN Card Copy',
  status = '',
}: {
  label?: string;
  status?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const open = () => inputRef.current?.click();

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.files?.[0] ?? null;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(next);
    setPreviewUrl(next ? URL.createObjectURL(next) : null);
    e.target.value = '';
  };

  const viewFile = () => {
    if (!file || !previewUrl) return;
    window.open(previewUrl, '_blank', 'noopener,noreferrer');
  };

  const removeFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
  };

  return (
    <div>
      <label className="vb-label">{label}</label>
      <div className="border-2 border-dashed border-[#C6CCD3] rounded-[10px] bg-[#FBFCFD] px-4 py-6 flex flex-col items-center gap-3 text-center">
        <div className="w-11 h-11 rounded-full bg-brand-light flex items-center justify-center">
          <UploadCloud className="w-5 h-5 text-brand-blue" />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <BlueBtn type="button" onClick={open}>
            <UploadCloud className="w-3.5 h-3.5" /> Select File
          </BlueBtn>
          <GreenButton type="button" disabled={!file} onClick={viewFile} className="!h-[30px] !px-3">
            <Eye className="w-3.5 h-3.5" /> View File
          </GreenButton>
          <RedBtn type="button" disabled={!file} onClick={removeFile}>
            <Trash2 className="w-3.5 h-3.5" /> Remove File
          </RedBtn>
        </div>
        <p className="text-[11px] text-sub">Supports JPEG, JPG, PNG, PDF</p>
        {file ? (
          <div className="flex items-center gap-1.5 text-[11px] text-ink">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-medium">{file.name}</span>
          </div>
        ) : (
          <p className="text-[11px] text-sub italic">No file selected</p>
        )}
        {status && (
          <div className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" /> Status - {status}
          </div>
        )}
        <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={onPick} />
      </div>
    </div>
  );
}

export { PrimaryButton, GreenButton, GrayButton };
