import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiDownload, FiArrowLeft } from 'react-icons/fi';
import { commerceApi } from '@/services/commerce.api';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import ConfirmDownloadModal from '@/components/ui/ConfirmDownloadModal';

const triggerDownload = async (url: string, filename: string) => {
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
  }
};

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [pending, setPending] = useState<{ url: string; name: string } | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!id) return;
    commerceApi
      .requestDownload(id)
      .then(({ data }) => setMeta(data))
      .catch((e: any) => {
        if (e.message?.includes('purchase')) setDenied(true);
        else toast.error(e.message || 'Unable to open this item');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const confirmDownload = () => {
    if (!pending) return;
    setDownloading(true);
    triggerDownload(pending.url, pending.name).finally(() => {
      setDownloading(false);
      setPending(null);
    });
  };

  if (loading) return <Spinner full />;

  if (denied) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-2 text-slate-500">You must purchase this product to view it.</p>
        <Link to={`/product/${id}`} className="btn-primary mt-6">View Product</Link>
      </div>
    );
  }

  if (!meta) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="text-slate-500">This item has no playable or downloadable content yet.</p>
        <button onClick={() => navigate('/dashboard/purchases')} className="btn-ghost mt-6">Back to Purchases</button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="btn-ghost px-3 py-1.5 text-sm">
          <FiArrowLeft /> Back
        </button>
        {meta.mediaType !== 'video' && meta.downloadUrl && (
          <Button onClick={() => setPending({ url: meta.downloadUrl, name: meta.title || 'download' })}>
            <FiDownload /> Download file
          </Button>
        )}
      </div>

      <h1 className="mb-4 text-xl font-bold">{meta.title || 'Your content'}</h1>

      {meta.mediaType === 'video' && meta.embedUrl ? (
        <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
          <iframe
            src={meta.embedUrl}
            title={meta.title || 'Player'}
            className="h-full w-full"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
      ) : meta.mediaType === 'image' && meta.embedUrl ? (
        <img src={meta.embedUrl} alt={meta.title || 'Resource'} className="mx-auto max-h-[70vh] rounded-2xl" />
      ) : meta.downloadUrl ? (
        <div className="card flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-slate-500">Your file is ready to download.</p>
          <Button onClick={() => setPending({ url: meta.downloadUrl, name: meta.title || 'download' })}>
            <FiDownload /> Download file
          </Button>
        </div>
      ) : (
        <div className="card py-16 text-center text-slate-500">No content available.</div>
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

export default Player;
