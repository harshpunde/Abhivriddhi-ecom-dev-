/**
 * Invoice Service — generates invoice data for both email (HTML) and API response.
 * PDF is generated on the frontend to avoid needing pdfkit installed.
 */

const generateInvoiceHTML = (order) => {
  const orderId = String(order._id).slice(-8).toUpperCase();
  const sa = order.shippingAddress || {};
  const date = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  const rows = (order.orderItems || []).map((item, i) => `
    <tr style="background:${i % 2 === 0 ? '#fff' : '#f8fafc'}">
      <td style="padding:10px 14px">${item.name}</td>
      <td style="padding:10px 14px;text-align:center">${item.quantity}</td>
      <td style="padding:10px 14px;text-align:right">₹${Number(item.price).toLocaleString('en-IN')}</td>
      <td style="padding:10px 14px;text-align:right;font-weight:700;color:#1a3d0c">₹${Number(item.price * item.quantity).toLocaleString('en-IN')}</td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice INV-${orderId} — Abhivriddhi Organics</title>
  <style>
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; background: #f1f5f9; padding: 20px; }
    .invoice { max-width: 800px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,.1); }
    .header { background: linear-gradient(135deg,#1a3d0c,#4a7c23); color: #fff; padding: 36px 40px; display: flex; justify-content: space-between; align-items: flex-start; }
    .logo h1 { font-size: 24px; margin-bottom: 6px; }
    .logo p { font-size: 12px; opacity: .8; }
    .invoice-label { text-align: right; }
    .invoice-label h2 { font-size: 36px; letter-spacing: 3px; margin-bottom: 6px; }
    .invoice-label p { font-size: 12px; opacity: .8; }
    .meta { background: #f0fdf4; padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; }
    .meta-item p { font-size: 12px; color: #64748b; margin-bottom: 2px; }
    .meta-item strong { font-size: 14px; color: #1e293b; }
    .badge { background: #4a7c23; color: #fff; padding: 6px 18px; border-radius: 6px; font-size: 13px; font-weight: 700; }
    .body { padding: 32px 40px; }
    .addresses { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
    .address-box { border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; }
    .address-box h3 { font-size: 11px; color: #4a7c23; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
    .address-box p { font-size: 13px; color: #374151; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    thead tr { background: #1a3d0c; }
    thead th { padding: 12px 14px; color: #fff; font-size: 12px; text-align: left; }
    thead th:last-child, thead th:nth-child(2), thead th:nth-child(3) { text-align: right; }
    thead th:nth-child(2) { text-align: center; }
    tbody td { font-size: 13px; color: #374151; border-bottom: 1px solid #f1f5f9; }
    .totals { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; margin-bottom: 32px; }
    .total-row { display: flex; gap: 40px; font-size: 13px; color: #64748b; }
    .total-grand { display: flex; gap: 40px; font-size: 16px; font-weight: 800; color: #fff; background: #4a7c23; padding: 12px 20px; border-radius: 8px; }
    .footer { background: #1a3d0c; color: #bbf7d0; text-align: center; padding: 20px; font-size: 12px; }
    .print-btn { display: block; text-align: center; margin: 20px auto; padding: 12px 32px; background: #4a7c23; color: #fff; border: none; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; }
  </style>
</head>
<body>
  <button class="no-print print-btn" onclick="window.print()">⬇️ Print / Save as PDF</button>
  <div class="invoice">
    <div class="header">
      <div class="logo">
        <h1>🫘 Abhivriddhi Organics</h1>
        <p>100% Organic • Gluten Free • Chemical Free</p>
      </div>
      <div class="invoice-label">
        <h2>INVOICE</h2>
        <p>INV-${orderId}</p>
      </div>
    </div>

    <div class="meta">
      <div class="meta-item"><p>Invoice No</p><strong>INV-${orderId}</strong></div>
      <div class="meta-item"><p>Order Date</p><strong>${date}</strong></div>
      <div class="meta-item"><p>Payment Method</p><strong>Razorpay</strong></div>
      <div class="badge">✓ PAID</div>
    </div>

    <div class="body">
      <div class="addresses">
        <div class="address-box">
          <h3>Bill To</h3>
          <p><strong>${sa.fullName || 'Customer'}</strong><br>
          ${sa.mobile || ''}<br>
          ${sa.addressLine || ''}<br>
          ${sa.city || ''}, ${sa.state || ''} — ${sa.pincode || ''}</p>
        </div>
        <div class="address-box">
          <h3>Ship To</h3>
          <p><strong>${sa.fullName || 'Customer'}</strong><br>
          ${sa.mobile || ''}<br>
          ${sa.addressLine || ''}<br>
          ${sa.city || ''}, ${sa.state || ''} — ${sa.pincode || ''}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Product Description</th>
            <th style="text-align:center">Qty</th>
            <th style="text-align:right">Unit Price</th>
            <th style="text-align:right">Total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <div class="totals">
        <div class="total-row"><span>Subtotal</span><span>₹${Number(order.totalAmount).toLocaleString('en-IN')}</span></div>
        <div class="total-row"><span>Shipping</span><span>FREE</span></div>
        <div class="total-row"><span>Tax</span><span>Included</span></div>
        <div class="total-grand"><span>Grand Total</span><span>₹${Number(order.totalAmount).toLocaleString('en-IN')}</span></div>
      </div>
    </div>

    <div class="footer">
      Thank you for shopping with Abhivriddhi Organics!<br>
      🌱 Pure • Natural • Traditional | support@abhivriddhiorganics.com
    </div>
  </div>
  
  <p class="no-print" style="text-align:center; font-size:12px; color:#94a3b8; margin-top:20px;">
    This is an electronically generated document. No signature is required.
  </p>
</body>
</html>`;
};

module.exports = { generateInvoiceHTML };
