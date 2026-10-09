import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Recommendations.css";

function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [currentPattern, setCurrentPattern] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRecommendations();
  }, []);

  async function fetchRecommendations() {
    const token = localStorage.getItem("neoncode_token");

    if (!token) {
      setError(
        "Please login to view your recommendations."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5001/api/recommendations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to load recommendations."
        );
        return;
      }

      const problems = data.recommendations || [];

      setRecommendations(problems);

      /*
        The recommendation engine is now pattern-based.
        The first recommendation is the strongest match,
        so its topic is used as the current pattern.
      */
      if (problems.length > 0) {
        setCurrentPattern(
          problems[0].topic || "DSA"
        );
      } else {
        setCurrentPattern("");
      }

    } catch (error) {
      console.error(
        "Recommendations request failed:",
        error
      );

      setError(
        "Cannot connect to the backend. Make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  }

  function getPlatformIcon(platform) {
    if (platform === "LeetCode") {
      return "LC";
    }

    if (platform === "Codeforces") {
      return "CF";
    }

    if (platform === "CSES") {
      return "CS";
    }

    return "CP";
  }

  function getDifficultyClass(difficulty) {
    if (!difficulty) {
      return "";
    }

    return difficulty.toLowerCase();
  }

  return (
    <div className="recommendations-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="recommendations-header">

        <Link
          to="/dashboard"
          className="recommendations-logo"
        >
          <span>&gt;_</span>
          NEONCODE
        </Link>

        <nav className="recommendations-nav">

          <Link to="/dashboard">
            DASHBOARD
          </Link>

          <Link to="/review">
            CODE REVIEW
          </Link>

          <Link to="/history">
            HISTORY
          </Link>

          <span className="active">
            RECOMMENDATIONS
          </span>

        </nav>

        <div className="recommendations-status">
          <span></span>
          AI ENGINE ONLINE
        </div>

      </header>


      {/* =========================
          MAIN
      ========================= */}

      <main className="recommendations-main">

        {/* TITLE */}

        <section className="recommendations-title">

          <div>

            <p className="recommendations-label">
              &gt; PERSONALIZED_ENGINE
            </p>

            <h1>
              Practice <span>Smarter.</span>
            </h1>

            <p className="recommendations-description">
              Real problems selected from LeetCode,
              Codeforces and CSES based on your latest
              code-review pattern and difficulty level.
            </p>

          </div>

          <div className="engine-status">

            <div className="engine-ring">
              AI
            </div>

            <div>

              <small>
                RECOMMENDATION ENGINE
              </small>

              <strong>
                {loading
                  ? "ANALYZING"
                  : error
                  ? "ERROR"
                  : "ACTIVE"}
              </strong>

            </div>

          </div>

        </section>


        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <section className="recommendation-note">

            <div className="note-icon">
              !
            </div>

            <div>

              <p className="recommendations-label">
                &gt; ENGINE_ERROR
              </p>

              <p>
                {error}
              </p>

            </div>

          </section>
        )}


        {/* =========================
            CURRENT PATTERN
        ========================= */}

        <section className="weak-section">

          <div className="section-heading">

            <p>
              &gt; CURRENT_PATTERN
            </p>

            <span>
              LATEST CODE REVIEW
            </span>

          </div>


          <div className="weak-grid">

            {loading ? (

              <div className="weak-card">

                <div className="weak-top">

                  <span>
                    ANALYZING PATTERN
                  </span>

                  <strong>
                    ...
                  </strong>

                </div>

                <div className="progress-bar">

                  <div
                    style={{
                      width: "65%",
                    }}
                  />

                </div>

                <p>
                  NEONCODE is identifying the
                  problem-solving pattern in your
                  latest code review.
                </p>

              </div>

            ) : currentPattern ? (

              <div className="weak-card">

                <div className="weak-top">

                  <span>
                    {currentPattern.toUpperCase()}
                  </span>

                  <strong>
                    FOCUS
                  </strong>

                </div>

                <div className="progress-bar">

                  <div
                    style={{
                      width: "100%",
                    }}
                  />

                </div>

                <p>
                  Recommendations are focused on
                  strengthening your {currentPattern.toLowerCase()}
                  problem-solving skills.
                </p>

              </div>

            ) : (

              <div className="weak-card">

                <div className="weak-top">

                  <span>
                    NO PATTERN
                  </span>

                  <strong>
                    --
                  </strong>

                </div>

                <div className="progress-bar">

                  <div
                    style={{
                      width: "0%",
                    }}
                  />

                </div>

                <p>
                  Submit a code review so NEONCODE
                  can identify your current DSA pattern.
                </p>

              </div>

            )}

          </div>

        </section>


        {/* =========================
            RECOMMENDED PROBLEMS
        ========================= */}

        <section className="problems-section">

          <div className="section-heading">

            <p>
              &gt; RECOMMENDED_PROBLEMS
            </p>

            <span>
              {loading
                ? "..."
                : `${recommendations.length} PROBLEMS`}
            </span>

          </div>


          <div className="problems-list">

            {loading ? (

              <article className="problem-card">

                <div className="problem-platform">

                  <span className="platform-icon">
                    AI
                  </span>

                  <span>
                    RECOMMENDATION ENGINE
                  </span>

                </div>


                <div className="problem-info">

                  <div className="problem-title">

                    <span className="problem-number">
                      ...
                    </span>

                    <h3>
                      Finding the right problems...
                    </h3>

                  </div>

                  <p>
                    NEONCODE is analyzing your review
                    history and selecting problems for you.
                  </p>

                </div>

              </article>

            ) : recommendations.length > 0 ? (

              recommendations.map(
                (problem, index) => (

                  <article
                    className="problem-card"
                    key={`${problem.platform}-${problem.title}-${index}`}
                  >

                    {/* PLATFORM */}

                    <div className="problem-platform">

                      <span className="platform-icon">
                        {getPlatformIcon(
                          problem.platform
                        )}
                      </span>

                      <span>
                        {problem.platform.toUpperCase()}
                      </span>

                    </div>


                    {/* PROBLEM */}

                    <div className="problem-info">

                      <div className="problem-title">

                        <span className="problem-number">
                          #{String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <h3>
                          {problem.title}
                        </h3>

                      </div>


                      <div className="problem-meta">

                        <span>
                          {problem.topic}
                        </span>

                        {problem.subtopic && (
                          <span>
                            {problem.subtopic}
                          </span>
                        )}

                        {problem.difficulty && (
                          <span
                            className={`difficulty ${getDifficultyClass(
                              problem.difficulty
                            )}`}
                          >
                            {problem.difficulty}
                          </span>
                        )}

                      </div>


                      <p>
                        {problem.reason}
                      </p>

                    </div>


                    {/* RATING / DIFFICULTY */}

                    <div className="problem-rating">

                      <small>
                        {problem.platform ===
                        "Codeforces"
                          ? "RATING"
                          : "DIFFICULTY"}
                      </small>

                      <strong>
                        {problem.platform ===
                        "Codeforces"
                          ? problem.rating
                            ? problem.rating
                            : "-"
                          : problem.difficulty || "-"}
                      </strong>

                    </div>


                    {/* ORIGINAL PROBLEM */}

                    <a
                      href={problem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="solve-btn"
                    >
                      VIEW PROBLEM →
                    </a>

                  </article>

                )
              )

            ) : (

              <div className="recommendation-note">

                <div className="note-icon">
                  AI
                </div>

                <div>

                  <p className="recommendations-label">
                    &gt; NO_RECOMMENDATIONS
                  </p>

                  <p>
                    Submit code reviews first so
                    NEONCODE can build your personalized
                    problem list.
                  </p>

                </div>

              </div>

            )}

          </div>

        </section>


        {/* =========================
            HOW IT WORKS
        ========================= */}

        <section className="recommendation-note">

          <div className="note-icon">
            AI
          </div>

          <div>

            <p className="recommendations-label">
              &gt; RECOMMENDATION_PIPELINE
            </p>

            <p>
              NEONCODE analyzes your latest code review
              to identify the problem-solving pattern.
              It then ranks real problems from LeetCode,
              Codeforces and CSES, prioritizing the most
              relevant problems across Easy, Medium and
              Hard difficulty levels.
            </p>

          </div>

        </section>


        {/* =========================
            FOOTER
        ========================= */}

        <footer className="recommendations-footer">

          <span>
            NEONCODE // RECOMMENDATION ENGINE
          </span>

          <span>
            SOURCES:{" "}
            <b>
              LC + CSES + CF
            </b>
          </span>

        </footer>

      </main>

    </div>
  );
}

export default Recommendations;