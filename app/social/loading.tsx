import { Loader2 } from 'lucide-react';

export default function SocialLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950 p-4 pb-24 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading community NFTs...</p>
      </div>
    </div>
  );
}
