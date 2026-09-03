import { CheckCircle, Clock, AlertTriangle, XCircle, FileEdit } from 'lucide-react';

export default function VerificationBadge({ status }) {
  switch (status) {
    case 'Terverifikasi':
    case 'verified':
      return (
        <span className="badge badge-verified flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Terverifikasi</span>
        </span>
      );
    case 'Menunggu Verifikasi':
    case 'pending':
      return (
        <span className="badge badge-pending pulse-badge flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30">
          <Clock className="w-3.5 h-3.5" />
          <span>Menunggu</span>
        </span>
      );
    case 'Perlu Perbaikan':
      return (
        <span className="badge bg-amber-500/20 text-amber-300 border border-amber-500/30">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Perlu Perbaikan</span>
        </span>
      );
    case 'Ditolak':
      return (
        <span className="badge badge-rejected">
          <XCircle className="w-3.5 h-3.5" />
          <span>Ditolak</span>
        </span>
      );
    case 'Draft':
    default:
      return (
        <span className="badge badge-draft">
          <FileEdit className="w-3.5 h-3.5" />
          <span>Draft</span>
        </span>
      );
  }
}
