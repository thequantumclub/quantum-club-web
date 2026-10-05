"use client";

import { useState, useEffect, use } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, QrCode } from "lucide-react";
import { featuredEvent, upcomingEvents, pastEvents } from "@/data/config";
import { generatePaymentDetails, submitPayment } from "./actions";
import { createClient } from "@/utils/supabase/client";
import QRCode from "react-qr-code";

// UPI UTR numbers are 12 digits; submitPayment rejects anything else
const UTR_LENGTH = 12;

export default function RegistrationPage({ params }: { params: Promise<{ id: string }> }) {
  const allEvents = [featuredEvent, ...upcomingEvents, ...pastEvents];
  const { id } = use(params);
  const event = allEvents.find((e) => e.id === id);
  const router = useRouter();

  if (!event) {
    notFound();
  }

  const isPastEvent = pastEvents.some((e) => e.id === event.id);

  const [step, setStep] = useState<"loading" | "form" | "payment" | "success">("loading");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [paymentData, setPaymentData] = useState<{
    amount: number;
    upiUrl: string;
  } | null>(null);

  const [utr, setUtr] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [isLaunchingUPI, setIsLaunchingUPI] = useState(false);
  const [upiError, setUpiError] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push(`/login?next=/events/${id}/register`);
      } else {
        setAccountEmail(session.user.email ?? "");
        setStep("form");
      }
    };
    checkAuth();
  }, [id, router]);

  if (!event) {
    notFound();
  }

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg("Please provide your name and phone number.");
      return;
    }
    if (quantity < 1 || quantity > 10) {
      setErrorMsg("Please select a valid quantity (1-10).");
      return;
    }
    
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await generatePaymentDetails(event.id, quantity);
      if (res.success) {
        setPaymentData({
          amount: res.exactAmount!,
          upiUrl: res.upiUrl!
        });
        setStatus("idle");
        setStep("payment");
      } else {
         setStatus("error");
         setErrorMsg("Failed to generate payment details.");
      }
    } catch (err: any) {
      console.error("Payment details error:", err);
      setStatus("error");
      setErrorMsg(err.message || "Failed to proceed to payment.");
    }
  };

  const handleUPIClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLaunchingUPI || !paymentData) return;
    
    setIsLaunchingUPI(true);
    setUpiError("");

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/.test(navigator.userAgent);

    window.location.href = paymentData.upiUrl;
    
    const checkVisibility = () => {
        if (document.hidden) {
            setIsLaunchingUPI(false);
            document.removeEventListener("visibilitychange", checkVisibility);
        }
    };
    document.addEventListener("visibilitychange", checkVisibility);

    setTimeout(() => {
      if (!document.hidden) {
        setIsLaunchingUPI(false);
        if (isIOS) {
          setUpiError("No UPI app detected. Please use the QR code on a desktop or another device, or scan it directly from a UPI app on this phone.");
        } else if (isAndroid) {
          setUpiError("No compatible UPI app found. Please install a UPI app (like GPay, PhonePe, Paytm) or use another device to scan the QR code.");
        } else {
          setUpiError("Could not launch UPI app. Please use a UPI-supported device or scan the QR code.");
        }
      }
      document.removeEventListener("visibilitychange", checkVisibility);
    }, 2500);
  };

  const utrComplete = utr.length === UTR_LENGTH;
  const utrRemaining = UTR_LENGTH - utr.length;

  const onSubmitPayment = async () => {
    if (!utrComplete) {
      setErrorMsg(`Please enter all ${UTR_LENGTH} digits of your UTR number.`);
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");

    try {
      if (paymentData) {
        const res = await submitPayment(event.id, quantity, paymentData.amount, utr, customerName, customerPhone);
        if (!res.success) {
          setStatus("error");
          setErrorMsg(res.error || "Failed to submit payment. Please try again.");
          return;
        }
      }
      setStatus("idle");
      setStep("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg("Failed to submit payment details. Please try again.");
    }
  };

  if (isPastEvent) {
    return (
      <div className="pt-32 pb-24 bg-brand-black min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6 max-w-lg text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">Event Concluded</h1>
          <p className="text-gray-400 mb-8">
            Registration is closed because this event has already taken place. Check out our upcoming events!
          </p>
          <Link href="/#events" className="btn-primary inline-block">
            VIEW UPCOMING EVENTS
          </Link>
        </div>
      </div>
    );
  }

  if (step === "loading") {
    return (
      <div className="pt-32 pb-24 bg-brand-black min-h-screen flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="pt-32 pb-24 bg-brand-black min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6 max-w-lg text-center">
          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-yellow-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">Payment Submitted!</h1>
          <p className="text-gray-400 mb-8">
            Your payment is currently pending verification. Once an admin verifies your payment, your tickets will automatically appear in your account.
          </p>
          {accountEmail && (
            <p className="text-sm text-gray-400 mb-8 -mt-4">
              To see your tickets, sign in with <span className="text-white font-medium">{accountEmail}</span>
            </p>
          )}
          
          <Link 
            href="/my-tickets"
            className="btn-accent inline-flex items-center gap-2 px-8 py-3 w-full justify-center text-lg mb-6 shadow-lg shadow-brand-violet/20"
          >
            VIEW TICKETS &rarr;
          </Link>

          <Link 
            href="/"
            className="inline-block text-gray-500 hover:text-white transition-colors underline"
          >
            RETURN TO HOME
          </Link>
        </div>
      </div>
    );
  }

  if (step === "payment" && paymentData) {
    return (
      <div className="pt-24 pb-24 bg-brand-black min-h-screen">
        <div className="container mx-auto px-6 md:px-12 max-w-lg">
          <div className="p-8 md:p-12 glass-panel rounded-3xl border border-white/5 text-center">
            <div className="mb-6 border-b border-white/10 pb-6">
              <h1 className="text-2xl font-bold mb-2 text-white">Complete Payment</h1>
              <p className="text-gray-400 text-sm">Tickets: {quantity >= 8 ? <><span className="text-white font-bold">{quantity + Math.floor(quantity / 8)}</span> <span className="text-green-400 font-bold text-xs ml-1">(Includes {Math.floor(quantity / 8)} FREE)</span></> : <span className="text-white font-bold">{quantity}</span>}</p>
            </div>

            <div className="mb-8">
              <p className="text-gray-400 mb-2">Total Amount due {quantity >= 6 && quantity < 8 && <span className="text-blue-400 text-xs ml-1 font-semibold">(10% OFF)</span>}</p>
              <div className="text-5xl font-bold text-brand-violet">₹{paymentData.amount.toFixed(2)}</div>
            </div>

            {/* QR Code (Visible on all devices) */}
            <div className="flex flex-col items-center mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-sm text-gray-300 mb-4 flex items-center gap-2">
                <QrCode className="w-4 h-4" /> Scan with any UPI app
              </p>
              <div className="p-4 bg-white rounded-xl">
                 <QRCode value={paymentData.upiUrl} size={180} />
              </div>
            </div>

            {/* Mobile UPI Intent Button */}
            <div className="md:hidden mb-8">
              {upiError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-left">
                  {upiError}
                </div>
              )}
              <button 
                onClick={handleUPIClick}
                disabled={isLaunchingUPI}
                className="btn-accent w-full flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLaunchingUPI ? "Opening UPI app..." : "PAY WITH UPI"}
              </button>
              <p className="text-xs text-gray-400 mt-3">If you don't have a UPI app installed, please complete the payment on another device.</p>
            </div>

            <div className="border-t border-white/10 pt-8 text-left">
              <h3 className="font-semibold mb-4 text-white">Payment Verification</h3>
              <p className="text-sm text-gray-400 mb-4">After paying, please enter your UTR / Reference number below to confirm your booking.</p>
              
              {status === "error" && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={UTR_LENGTH}
                      value={utr}
                      onChange={(e) => setUtr(e.target.value.replace(/\D/g, "").slice(0, UTR_LENGTH))}
                      aria-describedby="utr-hint"
                      className={`w-full bg-black/50 border rounded-xl px-4 py-3 pr-12 text-white focus:outline-none transition-colors ${
                        utrComplete ? "border-green-500/60 focus:border-green-500" : "border-white/10 focus:border-brand-silver"
                      }`}
                      placeholder="Enter 12-digit UTR number"
                    />
                    {utrComplete && (
                      <CheckCircle2 aria-hidden="true" className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                    )}
                  </div>
                  <p id="utr-hint" aria-live="polite" className={`text-xs mt-2 ${utrComplete ? "text-green-400" : "text-gray-400"}`}>
                    {utrComplete
                      ? `All ${UTR_LENGTH} digits entered`
                      : utr.length > 0
                        ? `${utrRemaining} digit${utrRemaining === 1 ? "" : "s"} remaining`
                        : "Find the 12-digit UTR in your UPI app's payment details."}
                  </p>
                </div>
                <button 
                  onClick={onSubmitPayment}
                  disabled={status === "loading"}
                  className="w-full px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all border border-white/10 disabled:opacity-50"
                >
                  {status === "loading" ? "SUBMITTING..." : "SUBMIT PAYMENT DETAILS"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 bg-brand-black min-h-screen">
      <div className="container mx-auto px-6 md:px-12 max-w-lg">
        <Link 
          href={`/events/${event.id}`}
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to event
        </Link>

        <div className="p-8 md:p-12 glass-panel rounded-3xl border border-white/5">
          <div className="mb-8 border-b border-white/10 pb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Select Tickets</h1>
            <p className="text-brand-violet font-semibold text-lg">{event.title}</p>
            {accountEmail && (
              <p className="text-sm text-gray-400 mt-3">
                Booking as <span className="text-white font-medium">{accountEmail}</span>. Your tickets will be in this account.
              </p>
            )}
          </div>

          {status === "error" && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleProceedToPayment} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="customerName" className="text-sm font-medium text-gray-300">Full Name *</label>
              <input 
                id="customerName" 
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-silver transition-colors"
                placeholder="John Doe"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="customerPhone" className="text-sm font-medium text-gray-300">Phone Number *</label>
              <input 
                id="customerPhone" 
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-silver transition-colors"
                placeholder="9876543210"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-300">Number of Tickets</label>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-end">
                  <span className="text-[10px] sm:text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded uppercase tracking-wider">💥 10% OFF ON 6-7</span>
                  <span className="text-[10px] sm:text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded uppercase tracking-wider">🎁 1 FREE FOR EVERY 8</span>
                </div>
              </div>
              <input 
                id="quantity" 
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-silver transition-colors"
              />
              {quantity >= 6 && quantity < 8 && (
                <p className="text-sm text-blue-400 font-bold mt-2">
                  ✓ 10% Discount Applied!
                </p>
              )}
              {quantity >= 8 && (
                <p className="text-sm text-green-400 font-bold mt-2">
                  ✓ Includes +{Math.floor(quantity / 8)} FREE bonus ticket{Math.floor(quantity / 8) > 1 ? 's' : ''} (Total: {quantity + Math.floor(quantity / 8)})
                </p>
              )}
            </div>

            <button 
              type="submit"
              disabled={status === "loading"}
              className="btn-primary w-full mt-8 disabled:opacity-50"
            >
              {status === "loading" ? "PROCEED TO PAYMENT..." : "PROCEED TO PAYMENT"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
