import './About.css';

function About() {
  return (
    <section className="about" id="about">
      <div className="about-container">
        <div className="section-label">
          <span className="label-dot"></span>
          About Parth Mavani
        </div>
        <h2 className="section-heading">
          Passionate about building<br />
          <span className="heading-accent">scalable full-stack applications</span>
        </h2>

        <div className="about-content">
          <div className="about-text">
            <p>
              Hello! I am <strong>Parth Mavani</strong> (Student ID: <strong>24IT050</strong>), an Information Technology 
              undergraduate student at <strong>CSPIT, CHARUSAT University</strong>. I specialize in full-stack JavaScript 
              development across the MERN stack (MongoDB, Express, React, Node.js).
            </p>
            <p>
              My hands-on coursework encompasses comprehensive backend engineering: designing normalized and performant 
              database schemas with Mongoose ODM, securing REST endpoints via JWT and bcrypt encryption, optimizing 
              query latency with in-memory caching layers (node-cache), and architecting asynchronous, non-blocking 
              background event pipelines using Node.js native <code>EventEmitter</code>.
            </p>
            <p>
              I take pride in writing clean, documented, and resilient code with robust error-handling pipelines, 
              responsive interfaces, and seamless user experiences.
            </p>
          </div>

          <div className="about-stats">
            <div className="stat-card">
              <span className="stat-number">10</span>
              <span className="stat-label">Lab Practicals</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">8+</span>
              <span className="stat-label">Technologies</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">100%</span>
              <span className="stat-label">Async Non-blocking</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">24IT050</span>
              <span className="stat-label">Student Roll No</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
