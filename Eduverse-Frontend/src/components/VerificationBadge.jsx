import { CheckCircle, Clock, AlertTriangle, XCircle, FileEdit } from 'lucide-react';

export default function VerificationBadge({ status }) {
  switch (status) {
    case 'Terverifikasi':
      return (
        <span className="badge badge-verified">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Terverifikasi</span>
        </span>
      );
    case 'Menunggu Verifikasi':
      return (
        <span className="badge badge-pending pulse-badge">
          <Clock className="w-3.5 h-3.5" />
          <span>Menunggu Verifikasi</span>
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
