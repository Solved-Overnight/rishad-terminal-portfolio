import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';

interface EmployeeCardProps {
  id: string;
  name: string;
  role: string;
  avatar: string;
  joinDate: string;
  company: string;
  qrValue: string;
  barcode: string;
}

export default function EmployeeIDCard({
  id = '948382',
  name = 'M. Rishad',
  role = 'AI & ML Engineer',
  avatar = '/img/Rishad2.jpg',
  joinDate = 'Oct 2023',
  company = 'm.rishad',
  qrValue = 'https://rishadhabib.me/',
  barcode = '948382'
}: Partial<EmployeeCardProps>) {
  const qrRef = useRef<HTMLCanvasElement>(null);
  const barcodeRef = useRef<SVGSVGElement>(null);

  const effectiveQrUrl = (typeof window !== 'undefined' && window.location.origin && window.location.origin.startsWith('http'))
    ? window.location.origin
    : (qrValue || 'https://rishadhabib.me/');

  useEffect(() => {
    if (qrRef.current) {
      QRCode.toCanvas(qrRef.current, effectiveQrUrl, {
        width: 48,
        margin: 0,
        color: {
          dark: '#ffffff',
          light: '#18181b'
        },
        errorCorrectionLevel: 'M'
      });
    }

    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, barcode, {
        format: 'CODE128',
        width: 1.5,
        height: 24,
        displayValue: false,
        background: 'transparent',
        lineColor: '#a1a1aa'
      });
    }
  }, [qrValue, barcode]);

  return (
    <div className="group relative w-[340px] select-none font-mono">
      {/* Card */}
      <div
        className="relative overflow-hidden rounded-[24px] border border-white/10 shadow-2xl transition-all duration-350 ease-out hover:-translate-y-1.5 hover:shadow-[0_35px_70px_rgba(0,0,0,0.6)]"
        style={{
          background: 'linear-gradient(160deg, #18181b 0%, #111113 50%, #0a0a0c 100%)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
        }}
      >
        {/* Glossy overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-25" style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 40%, transparent 100%)'
        }} />

        {/* Clip Slot */}
        <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2">
          <div className="flex h-7 w-[64px] items-center justify-center rounded-[12px] border border-white/10 bg-[#08080a] shadow-md">
            <div className="h-3 w-1 rounded-full bg-[#333]" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center px-6 pt-8 pb-6">
          {/* Top Section */}
          <div className="flex w-full items-center justify-between">
            {/* Left Badge - 'R' Monogram */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-[#16161a]">
              <span className="text-lg font-bold text-white">R</span>
            </div>

            {/* Right Tag */}
            <span className="text-xs font-semibold tracking-wider text-zinc-300">{company}</span>
          </div>

          {/* Profile Image */}
          <div className="mt-5 h-[185px] w-[185px] overflow-hidden rounded-2xl border border-white/15 shadow-xl">
            <img
              src={avatar}
              alt={name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Name */}
          <h1 className="mt-4 text-center text-[26px] font-extrabold text-white tracking-tight">
            {name}
          </h1>

          {/* Role Badge */}
          <div className="mt-2.5">
            <span className="inline-flex items-center rounded-full bg-[#14441c] border border-[#2c8a35] px-4 py-1 text-xs font-bold text-[#4af626] tracking-wide">
              {role}
            </span>
          </div>

          {/* Divider */}
          <div className="mt-5 w-full">
            <div className="h-px w-full bg-white/15" />
          </div>

          {/* Bottom Section */}
          <div className="mt-3.5 flex w-full items-end justify-between pb-0.5">
            {/* Join Date */}
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-300">Join Date</span>
              <span className="mt-0.5 text-sm font-bold text-white">{joinDate}</span>
            </div>

            {/* QR Code */}
            <div 
              onClick={() => window.open(effectiveQrUrl, '_blank')}
              className="flex flex-col items-center p-1 bg-[#18181b] rounded-xl border border-white/15 cursor-pointer hover:border-terminal-primary hover:scale-105 transition-all"
              title={`Scan or click to open: ${effectiveQrUrl}`}
            >
              <canvas ref={qrRef} className="rounded" />
            </div>

            {/* Barcode */}
            <div className="flex flex-col items-end">
              <svg ref={barcodeRef} className="h-5 w-auto opacity-90" />
              <span className="mt-0.5 text-[11px] font-bold text-zinc-200">ID: {id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
