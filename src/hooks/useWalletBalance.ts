import { useEffect, useState } from 'react';
import { getWalletBalance } from '@/lib/payments';

export function useWalletBalance() {
  const [balance, setBalance] = useState(getWalletBalance);

  useEffect(() => {
    const sync = () => setBalance(getWalletBalance());
    window.addEventListener('storage', sync);
    window.addEventListener('duvisas-wallet', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('duvisas-wallet', sync);
    };
  }, []);

  return balance;
}
