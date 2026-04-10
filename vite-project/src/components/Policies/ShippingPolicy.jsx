import React from 'react';
import './PolicyLayout.css';

const ShippingPolicy = () => {
  return (
    <div className="policy-container">
      <div className="policy-content">
        <h1 className="policy-title">Shipping Policy</h1>
        <h2 className="company-name">Abhivriddhi Organics</h2>

        <p>
          We aim to deliver your orders with care and efficiency. Our team ensures that each package is handled with the utmost respect for the quality of products you expect from Abhivriddhi Organics.
        </p>

        <section>
          <h3>Free Shipping</h3>
          <p>
            Free shipping is available on orders above ₹999 across serviceable locations listed on our website. For orders below this amount, standard shipping charges apply as calculated at checkout.
          </p>
        </section>

        <section>
          <h3>Processing & Dispatch</h3>
          <p>
            Orders are typically processed and dispatched within 24 hours of confirmation. Once your order leaves our facility, you will receive tracking details via your preferred communication method.
          </p>
        </section>

        <section>
          <h3>Delivery Timelines</h3>
          <p>
            Delivery timelines may vary based on location, with an estimated delivery window of 1 to 3 days for most major cities. Regional areas might take slightly longer depending on the logistics network.
          </p>
        </section>

        <section>
          <h3>Next-Day Delivery</h3>
          <p>
            For select cities, next-day delivery may be available for orders placed before [Insert Cut-off Time]. Orders placed after the cut-off time will be processed on the next working day.
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

export default ShippingPolicy;
