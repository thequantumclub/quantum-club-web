import Link from "next/link";

export default function NotFound() {
  return (
    <div className="pt-32 pb-24 bg-brand-black min-h-[70vh] flex items-center justify-center">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-8xl font-black text-brand-silver/20 mb-4 tracking-tighter">404</h1>
        <h2 className="text-3xl font-bold mb-6 uppercase tracking-wider text-white">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The page or event you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          href="/"
          className="btn-primary inline-flex"
        >
          RETURN TO HOME
        </Link>
      </div>
    </div>
  );
}
