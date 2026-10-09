import { Link } from "react-router-dom";
import "./App.css";

function Landing() {
  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">

        <div className="logo">
          <span className="logo-symbol">&gt;_</span>
          NEONCODE
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>

          <Link to="/login" className="login-btn">
            LOGIN
          </Link>

          <Link to="/register" className="signup-btn">
            GET STARTED
          </Link>
        </div>

      </nav>


      {/* HERO */}
      <main>

        <section className="hero">

          <div className="hero-content">

            <div className="status">
              <span className="status-dot"></span>
              NEURAL ENGINE // ONLINE
            </div>

            <h1>
              WRITE.
              <br />
              <span>DEBUG.</span>
              <br />
              MASTER.
            </h1>

            <p className="hero-text">
              AI-powered code intelligence for DSA & competitive programming.
              <br />
              Get instant feedback on correctness, complexity, bugs, and optimization.
            </p>

            <div className="hero-buttons">

              <Link to="/login" className="primary-btn">
                START ANALYSIS <span>→</span>
              </Link>

              <a href="#features" className="secondary-btn">
                VIEW INTELLIGENCE
              </a>

            </div>

            <div className="terminal-line">
              <span>$</span> analyzing_your_next_solution...
              <span className="cursor">_</span>
            </div>

          </div>


          {/* TERMINAL VISUAL */}
          <div className="hero-visual">

            <div className="glow"></div>

            <div className="terminal-window">

              <div className="terminal-header">

                <div className="terminal-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <div className="terminal-title">
                  NEONCODE://NEURAL_REVIEW
                </div>

              </div>


              <div className="terminal-body">

                <div className="code-line">
                  <span className="line-number">01</span>
                  <span className="purple">class</span>{" "}
                  <span className="cyan">Solution</span> {"{"}
                </div>

                <div className="code-line">
                  <span className="line-number">02</span>
                  &nbsp;&nbsp;<span className="purple">public:</span>
                </div>

                <div className="code-line">
                  <span className="line-number">03</span>
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="cyan">int</span> solve(
                  <span className="cyan">vector</span>&lt;
                  <span className="cyan">int</span>&gt;& nums) {"{"}
                </div>

                <div className="code-line">
                  <span className="line-number">04</span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="purple">int</span> ans = 0;
                </div>

                <div className="code-line">
                  <span className="line-number">05</span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="comment">// optimize solution</span>
                </div>

                <div className="code-line">
                  <span className="line-number">06</span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span className="purple">return</span> ans;
                </div>

                <div className="code-line">
                  <span className="line-number">07</span>
                  &nbsp;&nbsp;&nbsp;&nbsp;{"}"}
                </div>

                <div className="code-line">
                  <span className="line-number">08</span>
                  {"}"}
                </div>


                <div className="review-box">

                  <div className="review-header">
                    <span className="green">●</span>
                    ANALYSIS COMPLETE
                  </div>

                  <div className="review-stats">

                    <div>
                      <small>SCORE</small>
                      <strong>
                        8.7<span>/10</span>
                      </strong>
                    </div>

                    <div>
                      <small>TIME</small>
                      <strong>O(n)</strong>
                    </div>

                    <div>
                      <small>SPACE</small>
                      <strong>O(1)</strong>
                    </div>

                  </div>

                  <div className="review-message">
                    <span>&gt;</span> Solution is efficient.
                    <br />
                    <span>&gt;</span> Minor optimization suggested.
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* FEATURES */}
        <section className="features" id="features">

          <div className="section-label">
            &gt; SYSTEM_CAPABILITIES
          </div>

          <h2>
            YOUR CODE.
            <br />
            <span>UNDER THE MICROSCOPE.</span>
          </h2>


          <div className="feature-grid">

            <div className="feature-card">

              <div className="feature-number">01</div>

              <div className="feature-icon">
                {"</>"}
              </div>

              <h3>AI CODE REVIEW</h3>

              <p>
                Get intelligent analysis of correctness, bugs,
                complexity and code quality.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-number">02</div>

              <div className="feature-icon">
                {"[]"}
              </div>

              <h3>DSA ANALYTICS</h3>

              <p>
                Track your performance across Arrays, DP,
                Graphs, Trees and more.
              </p>

            </div>


            <div className="feature-card">

              <div className="feature-number">03</div>

              <div className="feature-icon">
                AI
              </div>

              <h3>PERSONALIZED AI</h3>

              <p>
                Discover your weak areas and get targeted
                practice recommendations.
              </p>

            </div>

          </div>

        </section>


        {/* CTA */}
        <section className="cta">

          <div className="section-label">
            &gt; READY_TO_EXECUTE
          </div>

          <h2>
            STOP GUESSING.
            <br />
            <span>START IMPROVING.</span>
          </h2>

          <Link to="/register" className="primary-btn">
            INITIALIZE NEONCODE <span>→</span>
          </Link>

        </section>

      </main>


      {/* FOOTER */}
      <footer>

        <div>
          NEONCODE // AI DSA COMPANION
        </div>

        <div>
          SYSTEM STATUS: <span>ONLINE</span>
        </div>

      </footer>

    </div>
  );
}

export default Landing;