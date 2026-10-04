import { siteConfig } from "@/data/config";

export default function TermsAndConditions() {
  return (
    <div className="pt-32 pb-24 bg-brand-black min-h-screen text-brand-white">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-4">
            Terms & <span className="metallic-text">Conditions</span>
          </h1>
          <p className="text-brand-gray">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-widest prose-a:text-brand-violet">
          <p>
            Welcome to {siteConfig.name}! These terms and conditions outline the rules and regulations for the use of our website and attendance at our events.
          </p>
          <p>
            By accessing this website and booking a ticket, we assume you accept these terms and conditions. Do not continue to use our services if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h2 className="text-2xl mt-8 mb-4 border-b border-white/10 pb-2">1. Ticket Booking and Verification</h2>
          <ul>
            <li>All ticket purchases are subject to verification. A booking is only considered confirmed once the payment (UTR) has been manually verified by our team.</li>
            <li>Submission of a UTR does not instantly guarantee a ticket. If a UTR is invalid, duplicated, or payment is not received, the booking will be rejected.</li>
            <li>Once verified, a unique QR code is generated per ticket. This QR code acts as your sole entry pass.</li>
          </ul>

          <h2 className="text-2xl mt-8 mb-4 border-b border-white/10 pb-2">2. Event Entry</h2>
          <ul>
            <li>Your QR code will be scanned at the venue entrance. A QR code can only be scanned and claimed <strong>once</strong>.</li>
            <li>Any attempt to duplicate, share, or reuse a claimed QR code will result in denied entry.</li>
            <li>Right of admission is reserved by {siteConfig.name} and the venue management.</li>
          </ul>

          <h2 className="text-2xl mt-8 mb-4 border-b border-white/10 pb-2">3. Cancellations and Refunds</h2>
          <ul>
            <li>Tickets once purchased are generally non-refundable unless the event is officially cancelled by the organizers.</li>
            <li>If an event is rescheduled, your ticket will remain valid for the new date. If you cannot attend the new date, refund requests will be handled on a case-by-case basis.</li>
          </ul>

          <h2 className="text-2xl mt-8 mb-4 border-b border-white/10 pb-2">4. Code of Conduct</h2>
          <p>
            Attendees are expected to behave respectfully towards artists, staff, and other guests. {siteConfig.name} maintains a zero-tolerance policy for harassment, discrimination, or illegal activities. Violators will be escorted out without a refund.
          </p>

          <h2 className="text-2xl mt-8 mb-4 border-b border-white/10 pb-2">5. Liability</h2>
          <p>
            {siteConfig.name} and its venue partners are not responsible for any personal injury, loss, or damage to personal property that occurs during the event. Attendees assume all risks associated with attendance.
          </p>

          <h2 className="text-2xl mt-8 mb-4 border-b border-white/10 pb-2">6. Media Consent</h2>
          <p>
            By attending our events, you consent to being photographed and filmed. These media assets may be used for promotional purposes on our website and social media channels.
          </p>

          <h2 className="text-2xl mt-8 mb-4 border-b border-white/10 pb-2">7. Contact Information</h2>
          <p>
            If you have any queries regarding any of our terms, please contact us.
          </p>
        </div>
      </div>
    </div>
  );
}
