import React from 'react';
import './Makings.css';
import fieldGreen from '../../assets/makings/field_green.png';
import harvestScene from '../../assets/makings/harvest_scene.png';

const Makings = () => {
  return (
    <div className="makings-container">
      <div className="makings-content">

        {/* Hero Section */}
        <header className="makings-hero">
          <h1>Abhivriddhi Organics Makings</h1>
          <p>The Story of Abhivriddhi Organics</p>
        </header>

        {/* Section 1: Where It Began */}
        <section className="story-section">
          <div className="story-img-wrap">
            <img src={fieldGreen} alt="Green organic wheat field" />
          </div>
          <div className="story-text">
            <h2 className="side-title-right">Where It Began</h2>
            <p>
              Abhivriddhi Organics didn't start as a business idea it started as a concern at home.
            </p>
            <p>
              As everyday food became more processed and chemical-driven, the simple question arose:
              "Are we really eating the way we're meant to?"
            </p>
            <p>
              For a family rooted in farming, the answer felt obvious.
            </p>
            <p>
              The food we once grew and consumed was always pure, seasonal, and honest.
              Somewhere along the way, that changed.
            </p>
          </div>
        </section>

        {/* Section 2: The Turning Point */}
        <section className="story-section reverse">
          <div className="story-img-wrap">
            <img src={harvestScene} alt="Farmers harvesting wheat" />
          </div>
          <div className="story-text">
            <h2 className="side-title-left">The Turning Point</h2>
            <p>
              What began as a personal shift towards cleaner, more natural food soon became something bigger.
            </p>
            <p>
              Friends and family started noticing the difference not just in quality, but in how the food felt.
            </p>
            <p>
              There was a growing realization: good food had become either inaccessible or unnecessarily expensive.
            </p>
            <p>
              That gap needed to be filled.
            </p>
          </div>
        </section>

        {/* Section 3: Building from the Ground Up */}
        <section className="centered-section">
          <h2 className="decorative-title">Building from the Ground Up</h2>
          <div className="centered-text">
            <p>
              From a small village in Madhya Pradesh, Abhivriddhi Organics began with a simple commitment
              to grow and provide food the way it was always meant to be grown.
            </p>
            <p>
              No chemicals. No shortcuts. No compromise.
            </p>
            <p>
              What started at a small scale gradually grew through trust, word of mouth, and consistent
              quality—from serving a few households to becoming a dependable choice for many.
            </p>
          </div>
        </section>

        {/* Section 4: A Brand That Grows with Its People */}
        <section className="centered-section">
          <h2 className="decorative-title">A Brand That Grows with Its People</h2>
          <div className="centered-text">
            <p>
              Abhivriddhi Organics is not positioned as a luxury it is positioned as accessible purity.
            </p>
            <p>
              A brand that understands the needs of the modern Indian, especially the growing middle class,
              who seek better food, but without losing authenticity or affordability.
            </p>
            <p>
              It's about making clean, honest food a daily habit not a rare choice.
            </p>
          </div>
        </section>

        {/* Section 5: The Philosophy We Stand By */}
        <section className="centered-section philosophy-section">
          <h2 className="decorative-title">The Philosophy We Stand By</h2>
          <div className="centered-text">
            <p>At its core, Abhivriddhi Organics is guided by one belief:</p>
            <p className="quote-text">"Real health isn't a modern invention it's a forgotten heritage."</p>
            <p>Every product reflects this from how it's grown, to how it reaches your kitchen.</p>
          </div>
        </section>

        {/* Section 6: Vision */}
        <section className="centered-section">
          <h2 className="decorative-title">Vision</h2>
          <div className="centered-text">
            <p>
              To bring pure, honest, chemical-free food to every household while preserving
              farming traditions and supporting the hands that grow it.
            </p>
          </div>
        </section>

        {/* Section 7: Mission */}
        <section className="centered-section">
          <h2 className="decorative-title">Mission</h2>
          <div className="centered-text">
            <p>
              To deliver high-quality, naturally grown staples from our farms to your home
              with complete honesty, transparency, and a commitment to better living.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Makings;
