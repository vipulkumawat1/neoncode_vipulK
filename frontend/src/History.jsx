import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./History.css";

function History() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    const token = localStorage.getItem("neoncode_token");

    if (!token) {
      setError("Please login to view your review history.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5001/api/review/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid server response.");
      }

      if (!response.ok) {
        setError(
          data.message || "Failed to load review history."
        );
        return;
      }

      if (!Array.isArray(data.reviews)) {
        setError("Invalid review history received from server.");
        return;
      }

      const formattedReviews = data.reviews.map((review) => ({
        id: review._id,
        title: `${review.topic} Review`,
        language:
          review.language === "cpp"
            ? "C++17"
            : review.language === "javascript"
            ? "JavaScript"
            : review.language === "python"
            ? "Python"
            : "Java",
        topic: review.topic,
        difficulty: "-",
        score: review.score,
        date: new Date(review.createdAt).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            year: "numeric",
          }
        ),
        status: review.correctness?.status || "REVIEW",
      }));

      setReviews(formattedReviews);
    } catch (error) {
      console.error("History request failed:", error);

      setError(
        error.message === "Invalid server response."
          ? "The server returned an invalid response."
          : "Cannot connect to the backend. Make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredReviews = reviews.filter((review) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      review.title.toLowerCase().includes(searchText) ||
      review.topic.toLowerCase().includes(searchText) ||
      review.language.toLowerCase().includes(searchText);

    const matchesFilter =
      filter === "ALL" ||
      review.language === filter;

    return matchesSearch && matchesFilter;
  });

  const totalReviews = reviews.length;

  const averageScore =
    totalReviews > 0
      ? (
          reviews.reduce(
            (sum, review) => sum + review.score,
            0
          ) / totalReviews
        ).toFixed(1)
      : "0.0";

  const correctReviews = reviews.filter(
    (review) => review.status === "CORRECT"
  ).length;

  const uniqueTopics = new Set(
    reviews.map((review) => review.topic)
  ).size;

  return (
    <div className="history-page">

      <header className="history-header">

        <Link to="/dashboard" className="history-logo">
          <span>&gt;_</span>
          NEONCODE
        </Link>

        <nav className="history-nav">
          <Link to="/dashboard">
            DASHBOARD
          </Link>

          <Link to="/review">
            CODE REVIEW
          </Link>

          <Link to="/history" className="active">
            HISTORY
          </Link>

          <Link to="/recommendations">
            RECOMMENDATIONS
          </Link>
        </nav>

        <div className="history-status">
          <span></span>
          SYSTEM ONLINE
        </div>

      </header>

      <main className="history-main">

        <section className="history-title">

          <div>
            <div className="history-label">
              // YOUR REVIEW LOG
            </div>

            <h1>
              CODE <span>HISTORY</span>
            </h1>

            <p className="history-description">
              Every review you've submitted, tracked in one
              place. Revisit your code, scores, and areas
              where you can improve.
            </p>
          </div>

          <Link
            to="/review"
            className="new-review-btn"
          >
            NEW REVIEW →
          </Link>

        </section>

        <section className="history-stats">

          <div className="history-stat">
            <span>TOTAL REVIEWS</span>
            <strong>{totalReviews}</strong>
          </div>

          <div className="history-stat">
            <span>AVERAGE SCORE</span>
            <strong>{averageScore}/10</strong>
          </div>

          <div className="history-stat">
            <span>CORRECT REVIEWS</span>
            <strong>{correctReviews}</strong>
          </div>

          <div className="history-stat">
            <span>TOPICS COVERED</span>
            <strong>{uniqueTopics}</strong>
          </div>

        </section>

        <section className="history-controls">

          <div className="history-search">
            <span>&gt;_</span>

            <input
              type="text"
              placeholder="Search reviews..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              disabled={loading}
            />
          </div>

          <div className="history-filters">

            {[
              "ALL",
              "C++17",
              "Java",
              "Python",
              "JavaScript",
            ].map((language) => (
              <button
                key={language}
                type="button"
                className={
                  filter === language
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  setFilter(language)
                }
                disabled={loading}
              >
                {language}
              </button>
            ))}

          </div>

        </section>

        <section className="history-list">

          <div className="history-list-header">
            <span>REVIEW</span>
            <span>TOPIC</span>
            <span>SCORE</span>
            <span>DATE</span>
            <span>ACTION</span>
          </div>

          {loading ? (

            <div className="history-empty">

              <div className="empty-icon">
                ...
              </div>

              <h3>
                LOADING REVIEWS
              </h3>

              <p>
                Fetching your review history.
              </p>

            </div>

          ) : error ? (

            <div className="history-empty">

              <div className="empty-icon">
                !
              </div>

              <h3>
                UNABLE TO LOAD HISTORY
              </h3>

              <p>
                {error}
              </p>

              <button
                type="button"
                className="new-review-btn"
                onClick={fetchHistory}
              >
                RETRY →
              </button>

            </div>

          ) : filteredReviews.length > 0 ? (

            filteredReviews.map((review) => (

              <div
                className="history-row"
                key={review.id}
              >

                <div className="history-problem">

                  <div className="problem-icon">
                    &lt;/&gt;
                  </div>

                  <div>

                    <strong>
                      {review.title}
                    </strong>

                    <small>
                      {review.language}
                      {" • "}
                      {review.difficulty}
                    </small>

                  </div>

                </div>

                <div className="history-topic">
                  <span>
                    {review.topic}
                  </span>
                </div>

                <div className="history-score">

                  <strong>
                    {review.score}
                  </strong>

                  <small>
                    /10
                  </small>

                </div>

                <div className="history-date">
                  {review.date}
                </div>

                <Link
                  to={`/review?history=${review.id}`}
                  className="view-review-btn"
                >
                  VIEW →
                </Link>

              </div>

            ))

          ) : (

            <div className="history-empty">

              <div className="empty-icon">
                ?
              </div>

              <h3>
                NO REVIEWS FOUND
              </h3>

              <p>
                Try another search or create
                a new code review.
              </p>

              <Link
                to="/review"
                className="new-review-btn"
              >
                START REVIEW →
              </Link>

            </div>

          )}

        </section>

        <footer className="history-footer">

          <span>
            NEONCODE // REVIEW ENGINE
          </span>

          <span>
            ALL SYSTEMS <b>OPERATIONAL</b>
          </span>

        </footer>

      </main>

    </div>
  );
}

export default History;