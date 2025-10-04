import React from 'react'
import './HomePage.css'

function HomePage() {
  return (
    <div className="homepage">

      <div className="hero">
        <img src="/eduhubcoverimage.jpg" alt="Edu-Hub Banner" className="hero-img" />
        <h1>Edu-Hub</h1>
      </div>

      <div className="description-card">
        <p>
          Your journey to knowledge begins with us. Our platform offers a seamless enrollment
          process, competitive course rates, and quick approval. Start your enrollment today
          and get one step closer to enhancing your knowledge.
        </p>
      </div>

      <footer className="footer">
        <h3>Contact Us</h3>
        <p>Email: example@example.com</p>
        <p>Phone: 123-456-7890</p>
      </footer>

    </div>
  )
}

export default HomePage
