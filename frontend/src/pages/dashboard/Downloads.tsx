import { useEffect, useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import { commerceApi } from '@/services/commerce.api';
import { formatDate } from '@/utils/format';
import Spinner from '@/components/ui/Spinner';

const Downloads = () => {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    commerceApi.myDownloads().then(({ data }) => setDownloads(data.downloads || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Downloads</h1>
      {downloads.length === 0 ? (
        <div className="card py-16 text-center text-slate-500">No downloads yet.</div>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Downloads;
