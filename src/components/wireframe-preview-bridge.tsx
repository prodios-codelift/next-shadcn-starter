'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { WireframePreviewClientRpc } from '@/lib/wireframe-rpc';

export function WireframePreviewBridge() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rpcRef = useRef<WireframePreviewClientRpc>(null);

  useEffect(
    function connectWireframePreviewRpc() {
      const rpc = new WireframePreviewClientRpc({
        getLocation: currentLocation,
        navigate: (location) => router.push(location),
        back: () => router.back(),
        forward: () => router.forward(),
      });

      rpcRef.current = rpc;
      rpc.start();

      return () => {
        rpc.stop();
        if (rpcRef.current === rpc) rpcRef.current = null;
      };
    },
    [router]
  );

  useEffect(
    function publishRouteChange() {
      rpcRef.current?.notifyLocationChanged(currentLocation());
    },
    [pathname, searchParams]
  );

  useEffect(function publishHashChanges() {
    function handleHashChange() {
      rpcRef.current?.notifyLocationChanged(currentLocation());
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return null;
}

function currentLocation() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}
