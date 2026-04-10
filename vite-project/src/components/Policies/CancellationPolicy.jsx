import React from 'react';
import './PolicyLayout.css';

const CancellationPolicy = () => {
  return (
    <div className="policy-container">
      <div className="policy-content">
        <h1 className="policy-title">Cancellation & Refund Policy</h1>
        <h2 className="company-name">Abhivriddhi Organics</h2>

        <p>
          At Abhivriddhi Organics, we aim to deliver products that reflect purity and quality. We understand that plans can change, so we have established the following policy for cancellations and refunds.
        </p>

        <section>
          <h3>Cancellation Policy</h3>
          <p>
            If you wish to cancel your order, you may do so anytime before it is dispatched or marked “out for delivery.” Once cancelled, the refund will be initiated to your original payment method and may take 5–7 business days to reflect. Orders that have already been shipped or are out for delivery cannot be cancelled.
          </p>
        </section>

        <section>
          <h3>Returns & Damage</h3>
          <p>
            As our products are consumable in nature, returns are only accepted in cases where the product delivered is damaged, defective, or incorrect. Any such concern must be reported within 24–48 hours of delivery by contacting us at our official email, along with order details and clear images of the product for verification.
          </p>
        </section>

        <section>
          <h3>Review & Approval</h3>
          <p>
            All return requests are subject to review and approval. Approved returns must be unused, unopened, and in their original packaging. Abhivriddhi Organics reserves the right to decline requests that do not meet these conditions.
          </p>
        </section>

        <div className="policy-contact">
          <p>
            For any queries, you may contact us at:<br />
            <strong>WhatsApp/Phone:</strong> [Insert Phone/WhatsApp]<br />
            <strong>Email:</strong> <a href="mailto:abhivriddhiorganics@gmail.com">abhivriddhiorganics@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy;
