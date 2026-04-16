import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import App from './App';

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID ?? 'clxxxxxxxxxxxxxxxxxxxxxxx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ['wallet', 'email'],
        appearance: {
          theme: 'light',
          accentColor: '#000000',
        },
        defaultChain: {
          id: 8453,
          name: 'Base',
          network: 'base',
          nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
          rpcUrls: {
            default: { http: ['https://mainnet.base.org'] },
            public: { http: ['https://mainnet.base.org'] },
          },
          blockExplorers: {
            default: { name: 'Basescan', url: 'https://basescan.org' },
          },
        },
        supportedChains: [
          {
            id: 8453,
            name: 'Base',
            network: 'base',
            nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
            rpcUrls: {
              default: { http: ['https://mainnet.base.org'] },
              public: { http: ['https://mainnet.base.org'] },
            },
            blockExplorers: {
              default: { name: 'Basescan', url: 'https://basescan.org' },
            },
          },
        ],
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
);
