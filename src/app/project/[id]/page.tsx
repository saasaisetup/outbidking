'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ProjectRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  useEffect(() => {
    if (id) {
      router.replace(`/product/${encodeURIComponent(id)}`);
    } else {
      router.replace('/');
    }
  }, [id, router]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-[#ea6c52] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
