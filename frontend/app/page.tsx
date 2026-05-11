<<<<<<< HEAD
"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    Pi: any;
  }
}

export default function Page() {
  const [piReady, setPiReady] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://safepi-botj.onrender.com";

  async function authenticatePi() {
    try {
      if (typeof window === "undefined") return;

      const Pi = window.Pi;

      if (!Pi) {
        console.log(
          "Pi SDK NOT detected — open inside Pi Browser."
        );
        setLoading(false);
        return;
      }

      console.log("Initializing Pi SDK...");

      Pi.init({
        version: "2.0",
        sandbox: false,
      });

      console.log("Authenticating user...");

      const auth = await Pi.authenticate(
        ["username", "payments"],
        (payment: any) => {
          console.log("Incomplete payment found:", payment);
        }
      );

      console.log("User authenticated:", auth);

      setUsername(auth.user.username);
      setPiReady(true);

      // Validate auth on backend
      const res = await fetch(
        `${BACKEND_URL}/api/auth/pi`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessToken: auth.accessToken,
          }),
        }
      );

      const data = await res.json();

      console.log("Backend auth response:", data);
    } catch (err) {
      console.error("Pi Auth Error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    authenticatePi();
  }, []);

  async function handlePayment() {
    try {
      if (typeof window === "undefined") return;

      const Pi = window.Pi;

      if (!Pi || !piReady) {
        alert(
          "Pi SDK not ready. Open inside Pi Browser."
        );
        return;
      }

      console.log("Starting Pi payment...");

      const paymentData = {
        amount: 0.1,
        memo: "SafePi Premium Scan",
        metadata: {
          orderId: `SP-${Date.now()}`,
        },
      };

      const paymentCallbacks = {
        onReadyForServerApproval: async (
          paymentId: string
        ) => {
          console.log(
            "Approving payment:",
            paymentId
          );

          const res = await fetch(
            `${BACKEND_URL}/api/create-payment`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                paymentId,
              }),
            }
          );

          const data = await res.json();

          console.log("Approval response:", data);
        },

        onReadyForServerCompletion: async (
          paymentId: string,
          txid: string
        ) => {
          console.log(
            "Completing payment:",
            paymentId,
            txid
          );

          const res = await fetch(
            `${BACKEND_URL}/api/complete-payment`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                paymentId,
                txid,
              }),
            }
          );

          const data = await res.json();

          console.log("Completion response:", data);
        },

        onCancel: (paymentId: string) => {
          console.warn(
            "Payment cancelled:",
            paymentId
          );
        },

        onError: (
          error: any,
          payment: any
        ) => {
          console.error(
            "Payment error:",
            error,
            payment
          );
        },
      };

      const payment = await Pi.createPayment(
        paymentData,
        paymentCallbacks
      );

      console.log("Payment created:", payment);
    } catch (error) {
      console.error(
        "Payment creation error:",
        error
      );
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 24,
        background: "#ffffff",
      }}
    >
      <h1
        style={{
          fontSize: 42,
          fontWeight: "bold",
        }}
      >
        SafePi
      </h1>

      <p
        style={{
          marginTop: 10,
          color: "#555",
        }}
      >
        AI-powered Pi Network scam detection
      </p>

      <div style={{ marginTop: 30 }}>
        {loading ? (
          <p>Authenticating with Pi...</p>
        ) : piReady ? (
          <div>
            <p>
              Signed in as{" "}
              <strong>@{username}</strong>
            </p>
          </div>
        ) : (
          <button
            onClick={authenticatePi}
            style={{
              padding: "12px 22px",
              background: "#6b21a8",
              color: "white",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Sign In with Pi
          </button>
        )}
      </div>

      <section style={{ marginTop: 50 }}>
        <h2
          style={{
            fontSize: 28,
            fontWeight: "bold",
          }}
        >
          Premium Scan
        </h2>

        <p style={{ marginTop: 10 }}>
          Test payment amount:
          <strong> 0.1 π</strong>
        </p>

        <button
          onClick={handlePayment}
          disabled={!piReady}
          style={{
            padding: "12px 22px",
            background: "purple",
            color: "white",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontSize: "18px",
            marginTop: "20px",
            opacity: piReady ? 1 : 0.5,
          }}
        >
          Pay 0.1 π
        </button>
      </section>
    </main>
  );
}
=======
tsx "use client";  import { useEffect, useState } from "react";  export default function Page() {   const [piReady, setPiReady] = useState(false);   const [username, setUsername] = useState("");   const [loading, setLoading] = useState(true);    const BACKEND_URL =     process.env.NEXT_PUBLIC_BACKEND_URL ||     "https://safepi-botj.onrender.com";    async function authenticatePi() {     try {       if (typeof window === "undefined") return;        const Pi = (window as any).Pi;        if (!Pi) {         console.log(           "Pi SDK NOT detected — open inside Pi Browser."         );         return;       }        console.log("Initializing Pi SDK...");        await Pi.init({         version: "2.0",         sandbox: false,       });        console.log("Authenticating user...");        const auth = await Pi.authenticate(         ["username", "payments"],         (incomplete: any) => {           console.log(             "Incomplete payment found:",             incomplete           );         }       );        console.log("User authenticated:", auth);        setUsername(auth.user.username);       setPiReady(true);        // send token to backend for validation       await fetch(`${BACKEND_URL}/api/auth/pi`, {         method: "POST",         headers: {           "Content-Type": "application/json",         },         body: JSON.stringify({           accessToken: auth.accessToken,         }),       });      } catch (err) {       console.error("Pi Auth Error:", err);     } finally {       setLoading(false);     }   }    useEffect(() => {     authenticatePi();   }, []);    async function handlePayment() {     if (typeof window === "undefined") return;      const Pi = (window as any).Pi;      if (!piReady || !Pi) {       alert(         "Pi SDK not ready yet. Please open this app inside Pi Browser."       );       return;     }      console.log("Starting Pi payment...");      const paymentData = {       amount: 0.1,       memo: "SafePi Premium Scan",       metadata: {         orderId: "SP-0001",       },     };      const paymentCallbacks = {       onReadyForServerApproval: async (         paymentId: string       ) => {         console.log(           "Server approval needed:",           paymentId         );          const res = await fetch(           `${BACKEND_URL}/api/create-payment`,           {             method: "POST",             headers: {               "Content-Type": "application/json",             },             body: JSON.stringify({ paymentId }),           }         );          const data = await res.json();          console.log("Approval response:", data);       },        onReadyForServerCompletion: async (         paymentId: string,         txid: string       ) => {         console.log(           "Server completion:",           paymentId,           txid         );          const res = await fetch(           `${BACKEND_URL}/api/complete-payment`,           {             method: "POST",             headers: {               "Content-Type": "application/json",             },             body: JSON.stringify({               paymentId,               txid,             }),           }         );          const data = await res.json();          console.log("Completion response:", data);       },        onCancel: (paymentId: string) => {         console.warn(           "Payment Cancelled:",           paymentId         );       },        onError: (error: string, payment: any) => {         console.error(           "Payment Error:",           error,           payment         );       },     };      try {       const payment = await Pi.createPayment(         paymentData,         paymentCallbacks       );        console.log(         "Client payment created:",         payment       );     } catch (error) {       console.error(         "Payment creation error:",         error       );     }   }    return (     <main       style={{         minHeight: "100vh",         padding: 24,         background: "#ffffff",       }}     >       <h1         style={{           fontSize: 42,           fontWeight: "bold",         }}       >         SafePi       </h1>        <p         style={{           marginTop: 10,           color: "#555",         }}       >         AI-powered Pi Network scam detection       </p>        <div style={{ marginTop: 30 }}>         {loading ? (           <p>Authenticating with Pi...</p>         ) : piReady ? (           <div>             <p>               Signed in as{" "}               <strong>@{username}</strong>             </p>           </div>         ) : (           <button             onClick={authenticatePi}             style={{               padding: "12px 22px",               background: "#6b21a8",               color: "white",               borderRadius: "10px",               border: "none",               cursor: "pointer",               fontSize: "16px",             }}           >             Sign In with Pi           </button>         )}       </div>        <section style={{ marginTop: 50 }}>         <h2           style={{             fontSize: 28,             fontWeight: "bold",           }}         >           Premium Scan         </h2>          <p style={{ marginTop: 10 }}>           Test payment amount:           <strong> 0.1 π</strong>         </p>          <button           onClick={handlePayment}           style={{             padding: "12px 22px",             background: "purple",             color: "white",             borderRadius: "10px",             border: "none",             cursor: "pointer",             fontSize: "18px",             marginTop: "20px",           }}         >           Pay 0.1 π         </button>       </section>     </main>   ); } 
>>>>>>> e0be12e3b665341351e0fc65e345efa6aea383ea
