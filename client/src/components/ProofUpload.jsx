import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Upload, CheckCircle } from 'lucide-react';

export default function ProofUpload({ drawId }) {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Max 5MB.');
      return;
    }

    setUploading(true);
    try {
      // Convert to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      await api.post(`/draws/${drawId}/upload-proof`, { proofUrl: base64 });
      toast.success('Proof uploaded! Awaiting admin review.');
      setUploaded(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (uploaded) return (
    <div className="mt-3 flex items-center gap-2 text-primary text-sm">
      <CheckCircle size={14} /> Proof submitted — awaiting review
    </div>
  );

  return (
    <div className="mt-3">
      <p className="text-slate-400 text-xs mb-2">
        Upload proof of your scores (screenshot from your golf app)
      </p>
      <label className={`flex items-center gap-2 cursor-pointer bg-card border border-border hover:border-primary rounded-xl px-4 py-2.5 text-sm text-slate-400 hover:text-white transition-colors w-fit ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
        <Upload size={14} />
        {uploading ? 'Uploading...' : 'Upload Screenshot'}
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </label>
    </div>
  );
}