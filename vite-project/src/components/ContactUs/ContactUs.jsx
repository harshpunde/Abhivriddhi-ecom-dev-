import React from 'react';
import { Headset, Map, Clock } from 'lucide-react';
import './ContactUs.css';

export default function ContactUs() {
  return (
    <div className="contact-container">
      {/* ─── Hero Section ─────────────────────────────────────────── */}
      <div className="contact-hero">
        <h1>Contact Us</h1>
        <p className="hero-subtitle">
          We're here to help you with any questions or concerns.
        </p>
      </div>

      <div className="contact-info-grid">
        {/* ─── Customer Support ────────────────────────────────────── */}
        <div className="info-card">
          <div className="icon-wrapper">
            <div className="icon-bg-inner">
              <div className="icon-box">
                <Headset size={42} strokeWidth={1.5} />
              </div>
            </div>
          </div>
          <div className="info-content">
            <h2>Customer Support</h2>
            <p className="highlight">+91 95752 15387</p>
            <p>abhivriddhiorganics@gmail.com</p>
          </div>
        </div>

        {/* ─── Office Address ──────────────────────────────────────── */}
        <div className="info-card">
          <div className="icon-wrapper">
            <div className="icon-bg-inner">
              <div className="icon-box">
                <Map size={42} strokeWidth={1.5} />
              </div>
            </div>
          </div>
          <div className="info-content">
            <h2>Office Address</h2>
            <p>Betul, Andaman Islands</p>
            <p>India — 462002</p>
          </div>
        </div>

        {/* ─── Working Hours ───────────────────────────────────────── */}
        <div className="info-card">
          <div className="icon-wrapper">
            <div className="icon-bg-inner">
              <div className="icon-box">
                <Clock size={42} strokeWidth={1.5} />
              </div>
            </div>
          </div>
          <div className="info-content">
            <h2>Working Hours</h2>
            <p>Mon - Sat: 9:00 AM - 6:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
