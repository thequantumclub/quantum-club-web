"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { verifyTicket, claimTicket } from "./actions";
import { CheckCircle2, XCircle, AlertTriangle, Scan, Ticket, User, IndianRupee, RefreshCw } from "lucide-react";

export default function QRScannerPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ticketData, setTicketData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [claimStatus, setClaimStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [claimError, setClaimError] = useState<string | null>(null);
  const [justClaimed, setJustClaimed] = useState(false);

  useEffect(() => {
    // Only initialize if we don't have a result yet
    if (scanResult) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        aspectRatio: 1.0,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        // Pause scanner to prevent multiple rapid fires (may fail if scanning an image)
        try {
          scanner.pause(true);
        } catch (e) {
          console.warn("Scanner could not pause, likely using image file:", e);
        }
        setScanResult(decodedText);
        handleVerification(decodedText, scanner);
      },
      (error) => {
        // Ignored, happens constantly during scanning
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [scanResult]);

  const handleVerification = async (qrToken: string, scannerInstance?: any) => {
    setLoading(true);
    setError(null);
    setTicketData(null);
    setClaimStatus("idle");
    setClaimError(null);
    setJustClaimed(false);

    try {
      const res = await verifyTicket(qrToken);
      if (res.error) {
        setError(res.error);
      } else {
        setTicketData(res.ticket);
      }
    } catch (err: any) {
      setError("An unexpected error occurred verifying the ticket.");
    } finally {
      setLoading(false);
      // Clean up the scanner UI completely since we have a result
      if (scannerInstance) {
         scannerInstance.clear().catch(console.error);
      } else {
         // Attempt to clear if we don't have the exact instance reference
         const elem = document.getElementById("qr-reader");
         if (elem) elem.innerHTML = "";
      }
    }
  };

  const handleClaim = async () => {
    if (!ticketData) return;
    
    setClaimStatus("loading");
    setClaimError(null);

    try {
      const res = await claimTicket(ticketData.id);
      if (res.error) {
        setClaimError(res.error);
        setClaimStatus("error");
      } else {
        setClaimStatus("success");
        setJustClaimed(true);
        // Update local state to reflect the claim
        setTicketData({
          ...ticketData,
          status: "CLAIMED",
          claimed_at: res.claimed_at
        });
      }
    } catch (err) {
      setClaimError("Failed to communicate with server.");
      setClaimStatus("error");
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setTicketData(null);
    setError(null);
    setClaimStatus("idle");
    setClaimError(null);
    setJustClaimed(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Scan className="w-8 h-8 text-brand-violet" />
          QR Scanner
        </h1>
        {scanResult && (
          <button 
            onClick={resetScanner}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Scan Another
          </button>
        )}
      </div>

      {!scanResult && (
        <div className="glass-panel rounded-3xl p-6 border border-white/5 overflow-hidden">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-white mb-2">Scan Ticket</h2>
            <p className="text-sm text-gray-400">Position the customer's QR code within the frame.</p>
          </div>
          {/* html5-qrcode mounts here */}
          <div id="qr-reader" className="mx-auto overflow-hidden rounded-2xl bg-black [&>div]:border-none [&_video]:rounded-2xl w-full"></div>
        </div>
      )}

      {loading && (
        <div className="p-12 glass-panel rounded-3xl border border-white/5 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-brand-violet border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white font-bold">Verifying Secure Ticket...</p>
        </div>
      )}

      {error && !loading && (
        <div className="p-8 glass-panel rounded-3xl border border-red-500/30 bg-red-500/10 text-center mx-auto max-w-sm">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Invalid Ticket</h2>
          <p className="text-red-400 mb-6 whitespace-pre-line text-sm break-all">{error}</p>
          <button onClick={resetScanner} className="btn-primary w-full max-w-xs">
            SCAN AGAIN
          </button>
        </div>
      )}

      {ticketData && !loading && (
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
          {/* Header Banner */}
          <div className={`p-6 text-center ${
            ticketData.status === 'ACTIVE' || justClaimed
              ? 'bg-green-500/20 border-b border-green-500/30' 
              : 'bg-red-500/20 border-b border-red-500/30'
          }`}>
            {ticketData.status === 'ACTIVE' ? (
              <>
                <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-3" />
                <h2 className="text-3xl font-bold text-green-400 tracking-tight">VALID TICKET</h2>
              </>
            ) : justClaimed ? (
              <>
                <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-3" />
                <h2 className="text-3xl font-bold text-green-400 tracking-tight">SUCCESSFULLY CLAIMED!</h2>
              </>
            ) : (
              <>
                <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-3" />
                <h2 className="text-3xl font-bold text-red-400 tracking-tight">ALREADY CLAIMED</h2>
              </>
            )}
          </div>

          {/* Ticket Details */}
          <div className="p-8 space-y-6 bg-black/40">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Event</p>
              <p className="text-xl font-bold text-white flex items-center gap-2">
                <Ticket className="w-5 h-5 text-brand-violet" /> {ticketData.event_title}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-6">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Customer</p>
                <p className="font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-silver" /> {ticketData.customer_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Amount Paid</p>
                <p className="font-bold text-white flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-brand-silver" /> {ticketData.amount.toFixed(2)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Ticket Number</p>
                <p className="font-mono text-lg font-bold text-brand-silver tracking-widest">{ticketData.ticket_number}</p>
              </div>
            </div>

            {ticketData.status === 'CLAIMED' && ticketData.claimed_at && (
              <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-sm text-gray-400">
                  <strong className="text-white">Claimed on:</strong> {new Date(ticketData.claimed_at).toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">
                  <strong className="text-white">Claimed by:</strong> {ticketData.claimed_by}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 bg-black/60 border-t border-white/5">
            {ticketData.status === 'ACTIVE' ? (
              <div className="space-y-4">
                {claimError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
                    {claimError}
                  </div>
                )}
                <button 
                  onClick={handleClaim}
                  disabled={claimStatus === 'loading'}
                  className="w-full py-4 bg-brand-violet hover:bg-brand-violet/80 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(110,86,207,0.4)] hover:shadow-[0_0_30px_rgba(110,86,207,0.6)] disabled:opacity-50"
                >
                  {claimStatus === 'loading' ? 'CLAIMING...' : 'CLAIM TICKET'}
                </button>
              </div>
            ) : (
              <button onClick={resetScanner} className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors">
                SCAN NEXT TICKET
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
