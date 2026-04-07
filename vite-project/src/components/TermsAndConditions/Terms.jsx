import React from "react";
import "./Terms.css";

const Terms = () => {
  return (
    <div className="terms-container">
      <div className="terms-content">
        <h1 className="terms-title">Terms & Condition</h1>
        <h2 className="company-name">Abhivriddhi Organics</h2>

        <p>
          Welcome to our website. By accessing or using this website, you agree
          to be bound by the following terms and conditions, which govern your
          relationship with Abhivriddhi Organics in connection with this
          platform.
        </p>

        <p>
          The terms “we”, “us”, and “our” refer to Abhivriddhi Organics, having
          its registered office at [Insert Registered Address], with company
          registration number [Insert Registration Number]. The term “you”
          refers to any user or visitor of this website.
        </p>

        <p>
          All content on this website is provided for general information and
          use. While we strive to ensure accuracy and relevance, we make no
          warranties or guarantees regarding the completeness, reliability, or
          suitability of the information. Your use of any content or products is
          at your own discretion and risk.
        </p>

        <p>
          The design, layout, content, and overall appearance of this website
          are the intellectual property of Abhivriddhi Organics and may not be
          reproduced or used without prior written consent.
        </p>

        <p>
          By interacting with our website whether through browsing, placing
          orders, or submitting your details you consent to receive
          communication from us via email, phone, SMS, or WhatsApp. This may
          include transactional updates as well as occasional promotional
          messages, in accordance with applicable laws.
        </p>

        <p>
          Any information voluntarily shared by you, including your name,
          contact details, or email, will be used solely to respond to your
          queries, process orders, and improve your experience with us. While
          you may browse the website anonymously, submitting your information
          implies consent to be contacted.
        </p>

        <p>
          Unauthorized use of this website may give rise to legal action under
          applicable laws. Abhivriddhi Organics shall not be held liable for any
          direct or indirect damages arising from the use of this website or
          reliance on its content.
        </p>

        <p>
          These terms shall be governed by the laws of India, and any disputes
          shall be subject to the jurisdiction of courts in [Insert City/State].
        </p>

        <p className="contact">
          For any queries, you may contact us at:
          <br />
          <strong>Email:</strong>{" "}
          <a href="mailto:abhivriddhiorganics@gmail.com">
            abhivriddhiorganics@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default Terms;