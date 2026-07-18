import { FiDownload, FiShield } from 'react-icons/fi';
import Modal from './Modal';
import Button from './Button';

interface ConfirmDownloadModalProps {
  open: boolean;
  title?: string;
  filename?: string;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
}

const ConfirmDownloadModal = ({
  open,
  title = 'Download this file?',
  filename,
  onConfirm,
  onClose,
  loading,
}: ConfirmDownloadModalProps) => (
  <Modal open={open} onClose={onClose} title="Confirm Download" maxWidth="max-w-sm">
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-brand-500/10 text-brand-600">
        <FiShield className="h-7 w-7" />
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300">{title}</p>
      {filename && (
        <p className="w-full truncate rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-500 dark:bg-slate-800">
          {filename}
        </p>
      )}
      <p className="text-xs text-slate-400">
        The file will be saved to your device. Make sure you trust the source.
      </p>
      <div className="mt-2 flex w-full gap-3">
        <Button variant="ghost" onClick={onClose} className="flex-1" disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onConfirm} className="flex-1" loading={loading}>
          <FiDownload /> Download
        </Button>
      </div>
    </div>
  </Modal>
);

export default ConfirmDownloadModal;
