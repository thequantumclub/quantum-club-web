"use client";

import QRCode from "react-qr-code";

export default function QRCodeClient({ value }: { value: string }) {
  return (
    <div style={{ background: 'white', padding: '16px', borderRadius: '12px' }}>
      <QRCode value={value} size={200} level="H" />
    </div>
  );
}
