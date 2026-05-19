import React from 'react';
import { type Product } from '../types';

interface BarcodeLabelProps {
  product: Product;
  showPrice?: boolean;
}

const BarcodeLabel: React.FC<BarcodeLabelProps> = ({ product, showPrice = true }) => {
  const sku = product.barcode || product.id.slice(0, 12).toUpperCase();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Barcode+39&display=swap');
        @media print {
          body * { visibility: hidden !important; }
          .barcode-label-print, .barcode-label-print * { visibility: visible !important; }
          .barcode-label-print { position: fixed; top: 0; left: 0; }
          @page { margin: 0; size: 62mm 38mm; }
        }
      `}</style>

      <div className="barcode-label-print border-2 border-slate-300 rounded-lg p-3 bg-white max-w-[220px] font-mono select-none">
        {/* Store Name */}
        <div className="text-center mb-1">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">FiroFits</p>
          <p className="text-[8px] text-slate-400">Bespoke Tailoring & Boutique</p>
        </div>

        {/* Barcode Visual */}
        <div className="text-center my-1">
          <p style={{ fontFamily: "'Libre Barcode 39', monospace", fontSize: '36px', lineHeight: 1, letterSpacing: 0, color: '#000' }}>
            *{sku}*
          </p>
          <p className="text-[9px] text-slate-500 font-mono tracking-widest">{sku}</p>
        </div>

        {/* Product Details */}
        <div className="border-t border-dashed border-slate-200 pt-2 mt-1">
          <p className="text-[10px] font-bold text-slate-900 truncate text-center">{product.name}</p>
          {product.productCategory && (
            <p className="text-[8px] text-slate-400 text-center uppercase tracking-wider">{product.productCategory}</p>
          )}
          {showPrice && (
            <p className="text-[11px] font-black text-slate-900 text-center mt-1 font-mono">
              Rs. {product.price.toLocaleString()}
            </p>
          )}
          <p className="text-[8px] text-slate-300 text-center mt-0.5">
            Stock: {product.stock !== undefined ? product.stock : '∞'}
          </p>
        </div>
      </div>
    </>
  );
};

export const printBarcodeLabel = (product: Product) => {
  const printWindow = window.open('', '_blank', 'width=400,height=300');
  if (!printWindow) return;
  const sku = product.barcode || product.id.slice(0, 12).toUpperCase();
  printWindow.document.write(`
    <!DOCTYPE html><html><head>
      <title>Label: ${product.name}</title>
      <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+39&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: monospace; width: 62mm; }
        .label { border: 1px solid #ccc; padding: 6px; text-align: center; }
        .store { font-size: 9px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; }
        .barcode { font-family: 'Libre Barcode 39', monospace; font-size: 40px; line-height: 1; }
        .sku { font-size: 8px; letter-spacing: 0.15em; color: #666; }
        .name { font-size: 9px; font-weight: 700; margin-top: 4px; }
        .price { font-size: 11px; font-weight: 900; margin-top: 2px; }
        .divider { border-top: 1px dashed #ccc; margin: 4px 0; }
      </style>
    </head><body>
      <div class="label">
        <p class="store">FiroFits</p>
        <div class="divider"></div>
        <p class="barcode">*${sku}*</p>
        <p class="sku">${sku}</p>
        <div class="divider"></div>
        <p class="name">${product.name}</p>
        <p class="price">Rs. ${product.price.toLocaleString()}</p>
      </div>
      <script>window.onload = () => { window.print(); window.close(); }<\/script>
    </body></html>
  `);
  printWindow.document.close();
};

export default BarcodeLabel;
