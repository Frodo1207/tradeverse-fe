// Wallet Detection and Connection Utilities

export const WALLET_TYPES = {
    METAMASK: 'MetaMask',
    OKX: 'OKX Wallet',
    COINBASE: 'Coinbase Wallet',
    BINANCE: 'Binance Wallet',
    TRUST: 'Trust Wallet',
    PHANTOM: 'Phantom (Solana)',
};

export const WALLET_ICONS = {
    [WALLET_TYPES.METAMASK]: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMjAgMzIwIj48cGF0aCBmaWxsPSIjRjY4NTEyIiBkPSJNMjc0LjkgMTY3LjFMMjkxLjYgOTYuM2wtODMuMi0yOS4xLTguNCA1NC40eiIvPjxwYXRoIGZpbGw9IiNFMjcxNUEiIGQ9Ik00NS4xIDE2Ny4xbC0xNi43LTcwLjggODMuMi0yOS4xIDguNCA1NC40eiIvPjxwYXRoIGZpbGw9IiNGNjg1MTIiIGQ9Ik0xMDYuOCA0Ny45TDEzMy4xIDBIMTg2LjlMMjEzLjIgNDcuOSAxNjAgOTEuMnoiLz48cGF0aCBmaWxsPSIjRjY4NTEyIiBkPSJNMjMxLjkgMjE2LjRMMjE3LjYgMTM0LjUgMjc0LjkgMTY3LjF6Ii8+PHBhdGggZmlsbD0iI0Y2ODUxMiIgZD0iTTg4LjEgMjE2LjRMMTAyLjQgMTM0LjUgNDUuMSAxNjcuMXoiLz48cGF0aCBmaWxsPSIjNzYzNzM3IiBkPSJNMTYwIDMwMi4ybDQ1LjUtNTIuNy02LjMtNjIuNi0zOS4yIDM5LjJ6Ii8+PHBhdGggZmlsbD0iIzc2MzczNyIgZD0iTTE2MCAzMDIuMmwtNDUuNS01Mi43IDYuMy02Mi42IDM5LjIgMzkuMnoiLz48L3N2Zz4=',
    [WALLET_TYPES.OKX]: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik02IDhoNHYxNkg2Vjh6bTggMGg0djE2aC00Vjh6bTggMGg0djE2aC00Vjh6Ii8+PC9zdmc+',
    [WALLET_TYPES.COINBASE]: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHBhdGggZmlsbD0iIzAwNTJGRiIgZD0iTTE2IDBhMTYgMTYgMCAxIDAgMTYgMTZAMTYgMTYgMCAwIDAtMTYgMHptNiAxNmEyIDIgMCAxIDEtMiAyIDIgMiAwIDAgMSAyLTJ6Ii8+PC9zdmc+',
    [WALLET_TYPES.BINANCE]: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHBhdGggZmlsbD0iI0YwQjkwQiIgZD0iTTE2IDZsLTYgNCA2IDQgNi00LTYtNHptMCAxMmwtNiA0IDYgNCA2LTQtNi00eiIvPjwvc3ZnPg==',
    [WALLET_TYPES.TRUST]: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHBhdGggZmlsbD0iIzMzNzVCQiIgZD0iTTE2IDBsLTE2IDZ2MTBjMCA5IDggMTYgMTYgMTYgOCAwIDE2LTcgMTYtMTZWNkwxNiAweiIvPjwvc3ZnPg==',
    [WALLET_TYPES.PHANTOM]: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5NiA5NiI+PHBhdGggZmlsbD0iIzVGMjVGRiIgZD0iTTgwLjYgNDAuM2MtLjYtMTIuOC04LjUtMjUuMS0yMC44LTI5LjQtMTIuMy00LjMtMjYuMy0uNi0zNC45IDguNi04LjYgOS4yLTEwLjkgMjIuOS01LjggMzQuNCA1LjEgMTEuNSAxNy4zIDE4LjIgMjkuOCAxNi41IDEyLjUtMS43IDIyLjYtMTEuMSAyMS43LTIzLjd6bS01NS4xIDYuMmMwLTIuNSAyLTIuNSA0LjktMi41IDIuOSAwIDQuOSAwIDQuOSAyLjUgMCAyLjUtMiAyLjUtNC45IDIuNS0yLjkgMC00LjkgMC00LjktMi41em0yNC41IDBjMC0yLjUgMi0yLjUgNC45LTIuNSAyLkgMCA0LjkgMCA0LjkgMi41IDAgMi41LTIgMi41LTQuOSAyLjUtMi45IDAtNC45IDAtNC45LTIuNXoiLz48L3N2Zz4=',
};

// EIP-6963: Store discovered providers
let discoveredProviders = [];

// Listen for EIP-6963 announcements
if (typeof window !== 'undefined') {
    window.addEventListener('eip6963:announceProvider', (event) => {
        const providerDetail = event.detail;
        if (!discoveredProviders.find(p => p.info.uuid === providerDetail.info.uuid)) {
            discoveredProviders.push(providerDetail);
        }
    });
    // Trigger discovery
    window.dispatchEvent(new Event('eip6963:requestProvider'));
}

export const detectAvailableWallets = () => {
    const wallets = [];
    const seen = new Set();

    const addWallet = (name, icon, provider, detected = true, downloadUrl = '', type = 'evm') => {
        // Use a unique key for deduplication (name + type)
        const key = `${name}-${type}`;
        if (!seen.has(key)) {
            wallets.push({ name, icon, provider, detected, downloadUrl, type });
            seen.add(key);
        }
    };

    // 1. EIP-6963 Discovery (Best for avoiding conflicts)
    discoveredProviders.forEach(detail => {
        let icon = detail.info.icon;
        // Override with official Base64 icon if available (to fix broken/blocked icons)
        const nameLower = detail.info.name.toLowerCase();
        if (nameLower.includes('phantom')) icon = WALLET_ICONS[WALLET_TYPES.PHANTOM];
        else if (nameLower.includes('metamask')) icon = WALLET_ICONS[WALLET_TYPES.METAMASK];
        else if (nameLower.includes('okx')) icon = WALLET_ICONS[WALLET_TYPES.OKX];
        else if (nameLower.includes('trust')) icon = WALLET_ICONS[WALLET_TYPES.TRUST];
        else if (nameLower.includes('binance')) icon = WALLET_ICONS[WALLET_TYPES.BINANCE];
        else if (nameLower.includes('coinbase')) icon = WALLET_ICONS[WALLET_TYPES.COINBASE];

        addWallet(detail.info.name, icon, detail.provider, true, '', 'evm');
    });

    // 2. Legacy EVM Detection (Fallback)
    // Only add if not already found via EIP-6963 to avoid duplicates
    if (window.ethereum) {
        if (window.ethereum.isMetaMask && !seen.has(`${WALLET_TYPES.METAMASK}-evm`)) {
            addWallet(WALLET_TYPES.METAMASK, '🦊', window.ethereum, true, '', 'evm');
        }
        if (window.ethereum.isCoinbaseWallet && !seen.has(`${WALLET_TYPES.COINBASE}-evm`)) {
            addWallet(WALLET_TYPES.COINBASE, '🔵', window.ethereum, true, '', 'evm');
        }
    }

    // 3. Specific Globals (OKX, Binance)
    if (window.okxwallet && !seen.has(`${WALLET_TYPES.OKX}-evm`)) {
        addWallet(WALLET_TYPES.OKX, '⭕', window.okxwallet, true, '', 'evm');
    }

    if (window.BinanceChain && !seen.has(`${WALLET_TYPES.BINANCE}-evm`)) {
        addWallet(WALLET_TYPES.BINANCE, '🟡', window.BinanceChain, true, '', 'evm');
    }

    // 4. Solana Support (Phantom)
    // Check for Phantom specifically
    const getPhantom = () => {
        if ('phantom' in window) {
            const provider = window.phantom?.solana;
            if (provider?.isPhantom) return provider;
        }
        // Fallback to window.solana
        if (window.solana?.isPhantom) return window.solana;
        return null;
    };

    const phantomProvider = getPhantom();
    if (phantomProvider) {
        addWallet(WALLET_TYPES.PHANTOM, WALLET_ICONS[WALLET_TYPES.PHANTOM], phantomProvider, true, '', 'solana');
    }

    // 5. Add Uninstalled Options
    if (!seen.has(`${WALLET_TYPES.METAMASK}-evm`)) {
        addWallet(WALLET_TYPES.METAMASK, WALLET_ICONS[WALLET_TYPES.METAMASK], null, false, 'https://metamask.io/download/', 'evm');
    }
    if (!seen.has(`${WALLET_TYPES.PHANTOM}-solana`)) {
        addWallet(WALLET_TYPES.PHANTOM, WALLET_ICONS[WALLET_TYPES.PHANTOM], null, false, 'https://phantom.app/', 'solana');
    }

    return wallets;
};

export const connectWallet = async (provider, type = 'evm') => {
    if (!provider) throw new Error('No provider available');

    try {
        if (type === 'solana') {
            // Solana Connection
            const resp = await provider.connect();
            return resp.publicKey.toString();
        } else {
            // EVM Connection
            const accounts = await provider.request({ method: 'eth_requestAccounts' });
            return accounts[0];
        }
    } catch (error) {
        console.error("Wallet connection error:", error);
        throw error;
    }
};

export const ensureEvmChain = async (provider, chain) => {
    if (!provider || typeof provider.request !== 'function') throw new Error('No provider available');
    if (!chain?.chainId) throw new Error('Missing chainId');

    const current = await provider.request({ method: 'eth_chainId' });
    if (String(current).toLowerCase() === String(chain.chainId).toLowerCase()) return;

    try {
        await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chain.chainId }]
        });
    } catch (err) {
        const code = err?.code ?? err?.data?.originalError?.code;
        if (code === 4902 && chain?.addEthereumChainParams) {
            await provider.request({
                method: 'wallet_addEthereumChain',
                params: [chain.addEthereumChainParams]
            });
            await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: chain.chainId }]
            });
            return;
        }
        throw err;
    }
};

export const signMessage = async (provider, address, message, type = 'evm') => {
    if (!provider) throw new Error('No provider available');

    try {
        if (type === 'solana') {
            const encodedMessage = new TextEncoder().encode(message);
            const signedMessage = await provider.signMessage(encodedMessage, "utf8");
            const signatureBytes = signedMessage?.signature ?? signedMessage;
            const bytes = signatureBytes instanceof Uint8Array ? signatureBytes : Uint8Array.from(signatureBytes);

            let binary = '';
            for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
            return btoa(binary);
        } else {
            return await provider.request({
                method: 'personal_sign',
                params: [message, address]
            });
        }
    } catch (error) {
        console.error("Signing error:", error);
        throw error;
    }
};
