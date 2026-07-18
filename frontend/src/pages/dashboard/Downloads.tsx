import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiDownload, FiTrash2 } from 'react-icons/fi';
import { commerceApi } from '@/services/commerce.api';
import { formatDate } from '@/utils/format';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import ConfirmDownloadModal from '@/components/ui/ConfirmDownloadModal';

const Downloads = () => {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const [pending, setPending] = useState<{ url: string; name: string } | null>(null);
  const [downloading, setDownloading] = useState(false);

  const load = () => {
    commerceApi.myDownloads().then(({ data }) => setDownloads(data.downloads || [])).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const triggerDownload = async (url: string, filename: string) => {
    setDownloading(true);
    try {
      const res = await fetch(url, { mode: 'cors' });
      if (!res.ok) throw new Error('download failed');
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = filename || url.split('/').pop() || 'download';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
    } catch {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noreferrer';
      a.download = '';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      setDownloading(false);
    }
  };

  const confirmDownload = () => {
    if (!pending) return;
    triggerDownload(pending.url, pending.name);
    setPending(null);
  };

  const remove = async (id: string) => {
    try {
      setRemoving(id);
      await commerceApi.deleteDownload(id);
      toast.success('Removed from your downloads');
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setRemoving(null);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Downloads</h1>
      {downloads.length === 0 ? (
        <div className="card py-16 text-center text-slate-500">
          No downloads yet. <Link to="/courses" className="text-brand-600">Browse courses</Link>
        </div>
      ) : (
        <div className="card divide-y divide-slate-100 dark:divide-slate-800">
          {downloads.map((d) => (
            <div key={d._id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <FiDownload className="text-brand-500" />
                <div>
                  <p className="font-medium">{d.product?.title || 'Resource'}</p>
                  <p className="text-xs capitalize text-slate-500">{d.product?.type} • {formatDate(d.createdAt)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {d.downloadUrl ? (
                  <Button variant="ghost" className="px-3 py-1.5 text-sm" onClick={() => setPending({ url: d.downloadUrl, name: d.product?.title || 'download' })}>
                    <FiDownload /> Download
                  </Button>
                ) : (
                  <span className="text-xs text-slate-400">No file</span>
                )}
                <button
                  onClick={() => remove(d._id)}
                  disabled={removing === d._id}
                  aria-label="Remove from downloads"
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-900/20"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDownloadModal
        open={!!pending}
        filename={pending?.name}
        onClose={() => setPending(null)}
        onConfirm={confirmDownload}
        loading={downloading}
      />
    </div>
  );
};

export default Downloads;
