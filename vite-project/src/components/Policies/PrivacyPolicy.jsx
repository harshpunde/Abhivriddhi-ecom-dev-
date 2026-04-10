import React from 'react';
import './PolicyLayout.css';

const PrivacyPolicy = () => {
  return (
    <div className="policy-container">
      <div className="policy-content">
        <h1 className="policy-title">Privacy Policy</h1>
        <h2 className="company-name">Abhivriddhi Organics</h2>

        <p>
          Abhivriddhi Organics values your privacy and is committed to protecting any personal information you share with us. By using our website, you agree to the terms outlined in this policy.
        </p>

        <section>
          <h3>Information Confidentiality</h3>
          <p>
            Any personal information provided by you, including your name, contact details, or other relevant information, will be kept confidential and used solely for the purpose of processing your requests, improving our services, and enhancing your experience with us. We do not sell or misuse your personal information. However, it may be shared with trusted partners or service providers strictly for business operations or if required by law.
          </p>
        </section>

        <section>
          <h3>Usage Data & Improvements</h3>
          <p>
            We may collect and analyze general usage data of our website to improve functionality and user experience. This data does not personally identify you and may be used for internal insights or shared in aggregate form.
          </p>
        </section>

        <section>
          <h3>Communication Consent</h3>
          <p>
            When you interact with our website such as filling out forms, placing orders, or contacting us you consent to receive communication from us via email, phone, SMS, or WhatsApp. This may include transactional updates as well as occasional promotional messages, in accordance with applicable laws, even if your number is registered under DND.
          </p>
        </section>

        <section>
          <h3>Cookies</h3>
          <p>
            Our website may use cookies to enhance your browsing experience and improve functionality. These cookies do not access personal data from your device and are used only to make your interaction with the website smoother.
          </p>
        </section>

        <section>
          <h3>Security Policy</h3>
          <p>
            While we take reasonable steps to protect your information, we cannot guarantee absolute security due to the nature of internet-based systems. Abhivriddhi Organics shall not be held responsible for any unauthorized access beyond our control.
          </p>
        </section>

        <p>
          We reserve the right to update this privacy policy at any time to reflect changes in our practices or legal requirements. Continued use of the website implies your acceptance of such updates.
        </p>

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

export default PrivacyPolicy;
