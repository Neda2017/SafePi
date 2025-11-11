'use client';
import { useState } from 'react';
import axios from 'axios';
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://safepi.onrender.com';
const PI_APP_ID = process.env.NEXT_PUBLIC_PI_APP_ID || 'safeedfafd9724';
declare global { interface Window { Pi?: any } }

export default function Home() {
  const [status, setStatus] = useState<string>('Ready');
  const signIn = async () => {
    try {
      if (!window.Pi) { setStatus('Pi SDK not available. Open in Pi Browser.'); return; }
      const scopes = ['payments','username','payments'];
      const auth = await window.Pi.authenticate(scopes, (p:any)=>console.log('incomplete',p));
      setStatus('Signed in as ' + (auth?.user?.username || 'unknown'));
    } catch (e:any) { console.error(e); setStatus('Sign-in failed: ' + (e?.message||'error')); }
  };
  const pay = async () => {
    try {
      if (!window.Pi) { setStatus('Pi SDK not available. Open in Pi Browser.'); return; }
      await window.Pi.createPayment({ amount: 0.1, memo: 'SafePi Demo Purchase', metadata: { ts: Date.now() } }, {
        onReadyForServerApproval: async (paymentId:string)=>setStatus('Approving on server...'),
        onReadyForServerCompletion: async (paymentId:string, txid:string)=>{
          setStatus('Completing on server...'); await axios.post(`${BACKEND}/payments/complete`, { paymentId, txid });
          setStatus('Payment completed ✅');
        },
        onCancel: (_id:string)=>setStatus('Payment cancelled.'),
        onError: (err:any)=>setStatus('Payment error: '+(err?.message||'')),
      });
    } catch (e:any) { console.error(e); setStatus('Payment failed: ' + (e?.message||'')); }
  };
  return (<main style={{ padding: '2rem' }}>
    <h1>SafePi</h1><p>Status: {status}</p>
    <div style={{ display:'flex', gap:'1rem', marginTop:'1rem' }}>
      <button onClick={signIn}>Sign in with Pi</button>
      <button onClick={pay}>Pay 0.1 π</button>
    </div>
    <p style={{ marginTop:'1rem' }}>Backend: <code>{BACKEND}</code> • App ID: <code>{PI_APP_ID}</code></p>
  </main>);
}