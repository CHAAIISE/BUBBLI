'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NFTAvatar } from '@/components/nft-avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOOD_STYLES } from '@/lib/mood-styles';
import { Loader2, ArrowLeft } from 'lucide-react';

interface SocialNFT {
  tokenId: number;
  owner: string;
  mood: number;
  moodName: string;
  message: string;
  lastUpdated: string;
}

export default function SocialPage() {
  const router = useRouter();
  const [nfts, setNfts] = useState<SocialNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllNFTs = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://server-nft.onrender.com/api';
        const response = await fetch(`${apiUrl}/nfts?limit=100`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch NFTs');
        }

        const data = await response.json();
        
        if (data.success) {
          // Trier par tokenId croissant (ordre de création)
          const sortedNfts = data.nfts.sort((a: SocialNFT, b: SocialNFT) => a.tokenId - b.tokenId);
          setNfts(sortedNfts);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching NFTs:', err);
        setError(err instanceof Error ? err.message : 'Failed to load NFTs');
      } finally {
        setLoading(false);
      }
    };

    fetchAllNFTs();
  }, []);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950 p-4 pb-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading NFTs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950 p-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <Card className="p-6 text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
            <Button 
              onClick={() => router.back()}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950 p-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Social Feed
          </h1>
          <Card className="p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No NFTs have been minted yet.</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Be the first to mint a Bubblo NFT!</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950 p-4 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Social Feed
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover all {nfts.length} Bubblo NFTs created by the community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nfts.map((nft) => {
            const moodStyle = MOOD_STYLES[nft.mood as keyof typeof MOOD_STYLES];
            
            return (
              <Card
                key={nft.tokenId}
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex flex-col items-center gap-3">
                  {/* NFT Avatar */}
                  <div className="w-32 h-32">
                    <NFTAvatar mood={nft.mood} />
                  </div>

                  {/* Token ID */}
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      Bubblo #{nft.tokenId}
                    </p>
                  </div>

                  {/* Mood Badge */}
                  <Badge
                    style={{
                      backgroundColor: moodStyle.headColor,
                      color: '#fff',
                    }}
                    className="text-sm font-semibold"
                  >
                    {moodStyle.name}
                  </Badge>

                  {/* Message */}
                  {nft.message && (
                    <div className="w-full text-center">
                      <p className="text-sm text-gray-700 dark:text-gray-300 italic line-clamp-2 px-2">
                        "{nft.message}"
                      </p>
                    </div>
                  )}

                  {/* Owner Address */}
                  <div className="w-full text-center border-t pt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Owner
                    </p>
                    <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                      {truncateAddress(nft.owner)}
                    </p>
                  </div>

                  {/* Last Updated */}
                  <div className="w-full text-center">
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Updated {new Date(nft.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
