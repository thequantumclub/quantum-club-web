import { siteConfig } from "@/data/config";

export default function PrivacyPolicy() {
  return (
    <div className="pt-32 pb-24 bg-brand-black min-h-screen text-brand-white">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-4">
            Privacy <span className="metallic-text">Policy</span>
          </h1>
          <p className="text-brand-gray">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-widest prose-a:text-brand-violet">
          <p>
            At {siteConfig.name}, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by {siteConfig.name} and how we use it.
          </p>

          <h2 className="text-2xl mt-8 mb-4 border-b border-white/10 pb-2">1. Information We Collect</h2>
          <p>
            When you register for an event, we collect personal information necessary to process your booking and ensure your entry. This includes:
          </p>
          <ul>
            <li><strong>Personal Identification Information:</strong> Name, Email Address, and Phone Number.</li>
            <li><strong>Payment Information:</strong> UTR / Reference numbers to verify your payment. We do not process or store direct banking or credit card details on our servers; transactions are handled securely via UPI.</li>
            <li><strong>Usage Data:</strong> We may collect information on how the website is accessed and used to improve our services.</li>
          </ul>

          <h2 className="text-2xl mt-8 mb-4 border-b border-white/10 pb-2">2. How We Use Your Information</h2>
          <p>We use the information we collect in various ways, including to:</p>
          <ul>
            <li>Provide, operate, and maintain our website and events.</li>
            <li>Process your ticket purchases and send you your QR codes.</li>
            <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the event.</li>
            <li>Send you emails or messages regarding your booking status.</li>
            <li>Find and prevent fraud.</li>
          </ul>

          <h2 className="text-2xl mt-8 mb-4 border-b border-white/10 pb-2">3. Data Security</h2>
          <p>
            We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. We use secure databases (Supabase) to store your information and ensure that our event scanning process is safe and secure.
          </p>

          <h2 className="text-2xl mt-8 mb-4 border-b border-white/10 pb-2">4. Third-Party Services</h2>
          <p>
            We may employ third-party companies and individuals to facilitate our service, to provide the service on our behalf, or to assist us in analyzing how our service is used. These third parties have access to your Personal Information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
          </p>

          <h2 className="text-2xl mt-8 mb-4 border-b border-white/10 pb-2">5. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <h2 className="text-2xl mt-8 mb-4 border-b border-white/10 pb-2">6. Contact Us</h2>
          <p>
            If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.
          </p>
        </div>
      </div>
    </div>
  );
}
