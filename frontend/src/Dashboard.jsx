import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageScore: 0,
    correctReviews: 0,
    topicsCovered: 0,
    problemsSolved: 0,
  });

  const [recentReviews, setRecentReviews] = useState([]);
  const [topics, setTopics] = useState([]);
  const [weakestTopic, setWeakestTopic] = useState(null);
  const [performanceReviews, setPerformanceReviews] = useState([]);
  const [userName, setUserName] = useState("Developer");

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingTopics, setLoadingTopics] = useState(true);

  const [statsError, setStatsError] = useState("");
  const [topicsError, setTopicsError] = useState("");

  useEffect(() => {
    loadUser();
    fetchDashboardStats();
    fetchTopicProficiency();
  }, []);

  function loadUser() {
    try {
      const storedUser = localStorage.getItem("neoncode_user");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        if (user?.name) {
          setUserName(user.name);
          return;
        }
      }

      const alternativeUser = localStorage.getItem("user");

      if (alternativeUser) {
        const user = JSON.parse(alternativeUser);

        if (user?.name) {
          setUserName(user.name);
        }
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  }

  async function fetchDashboardStats() {
    const token = localStorage.getItem("neoncode_token");

    if (!token) {
      setStatsError("Please login to view your dashboard.");
      setLoadingStats(false);
      return;
    }

    setLoadingStats(true);
    setStatsError("");

    try {
      const response = await fetch(
        "http://localhost:5001/api/review/stats",
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
        throw new Error(
          data.message || "Failed to load dashboard statistics."
        );
      }

      if (!data.stats) {
        throw new Error("Invalid dashboard data received from server.");
      }

      setStats(data.stats);

      const allReviews = [...(data.reviews || [])].sort(
        (a, b) =>
          new Date(a.createdAt) - new Date(b.createdAt)
      );

      setPerformanceReviews(allReviews);

      const formattedReviews = [...allReviews]
        .reverse()
        .slice(0, 4)
        .map((review) => ({
          id: review._id,
          problem: `${review.topic} Review`,
          topic: review.topic,
          score: Number(review.score).toFixed(1),
          complexity:
            review.timeComplexity?.value || "-",
          language:
            review.language === "cpp"
              ? "C++17"
              : review.language === "javascript"
              ? "JavaScript"
              : review.language === "python"
              ? "Python"
              : "Java",
        }));

      setRecentReviews(formattedReviews);
    } catch (error) {
      console.error("Dashboard stats request failed:", error);

      setStatsError(
        error.message === "Invalid server response."
          ? "The server returned an invalid response."
          : error.message ||
            "Cannot load dashboard statistics. Please try again."
      );
    } finally {
      setLoadingStats(false);
    }
  }

  async function fetchTopicProficiency() {
    const token = localStorage.getItem("neoncode_token");

    if (!token) {
      setTopicsError("Please login to view topic analysis.");
      setLoadingTopics(false);
      return;
    }

    setLoadingTopics(true);
    setTopicsError("");

    try {
      const response = await fetch(
        "http://localhost:5001/api/review/topics",
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
        throw new Error(
          data.message || "Failed to load topic analysis."
        );
      }

      if (!Array.isArray(data.topics)) {
        throw new Error("Invalid topic data received from server.");
      }

      setTopics(data.topics);
      setWeakestTopic(data.weakestTopic || null);
    } catch (error) {
      console.error("Topic request failed:", error);

      setTopicsError(
        error.message === "Invalid server response."
          ? "The server returned an invalid response."
          : error.message ||
            "Cannot load topic analysis. Please try again."
      );
    } finally {
      setLoadingTopics(false);
    }
  }

  function retryDashboard() {
    fetchDashboardStats();
    fetchTopicProficiency();
  }

  function formatChartDate(date) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate
      .toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      })
      .toUpperCase();
  }

  function getChartPoints() {
    if (performanceReviews.length === 0) {
      return [];
    }

    const reviews = performanceReviews.slice(-10);

    const width = 700;
    const height = 260;

    const paddingX = 10;
    const paddingY = 20;

    return reviews.map((review, index) => {
      const score = Math.max(
        0,
        Math.min(10, Number(review.score) || 0)
      );

      const x =
        reviews.length === 1
          ? width / 2
          : paddingX +
            (index / (reviews.length - 1)) *
              (width - paddingX * 2);

      const y =
        height -
        paddingY -
        (score / 10) *
          (height - paddingY * 2);

      return {
        x,
        y,
        score,
        date: review.createdAt,
      };
    });
  }

  function createSmoothPath(points) {
    if (points.length === 0) {
      return "";
    }

    if (points.length === 1) {
      return `M${points[0].x} ${points[0].y}`;
    }

    let path = `M${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const previous = points[i - 1];
      const current = points[i];

      const controlX =
        (previous.x + current.x) / 2;

      path += `
        C${controlX} ${previous.y},
         ${controlX} ${current.y},
         ${current.x} ${current.y}
      `;
    }

    return path;
  }

  function createAreaPath(points) {
    if (points.length === 0) {
      return "";
    }

    const linePath = createSmoothPath(points);

    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];

    return `
      ${linePath}
      L${lastPoint.x} 260
      L${firstPoint.x} 260
      Z
    `;
  }

  function getChartDates() {
    if (performanceReviews.length === 0) {
      return [];
    }

    const reviews = performanceReviews.slice(-5);

    return reviews.map((review) =>
      formatChartDate(review.createdAt)
    );
  }

  function getCurrentScore() {
    if (performanceReviews.length === 0) {
      return 0;
    }

    return Number(
      performanceReviews[
        performanceReviews.length - 1
      ].score
    ).toFixed(1);
  }

  const chartPoints = getChartPoints();
  const chartPath = createSmoothPath(chartPoints);
  const chartAreaPath = createAreaPath(chartPoints);
  const chartDates = getChartDates();

  const currentScore = getCurrentScore();

  const reviewsToday = performanceReviews.filter(
    (review) => {
      const reviewDate = new Date(review.createdAt);
      const today = new Date();

      return (
        reviewDate.getFullYear() === today.getFullYear() &&
        reviewDate.getMonth() === today.getMonth() &&
        reviewDate.getDate() === today.getDate()
      );
    }
  ).length;

  // Get YYYY-MM-DD for a date
  function getDateKey(date) {
    const year = date.getFullYear();
    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // Calculate current streak and last 10 days
  function getStreakData() {
    const activeDates = new Set();

    performanceReviews.forEach((review) => {
      const reviewDate = new Date(review.createdAt);

      if (!Number.isNaN(reviewDate.getTime())) {
        activeDates.add(getDateKey(reviewDate));
      }
    });

    const today = new Date();

    let currentStreak = 0;

    const checkDate = new Date(today);

    while (
      activeDates.has(
        getDateKey(checkDate)
      )
    ) {
      currentStreak++;

      checkDate.setDate(
        checkDate.getDate() - 1
      );
    }

    const lastTenDays = [];

    for (let i = 9; i >= 0; i--) {
      const date = new Date(today);

      date.setDate(
        today.getDate() - i
      );

      lastTenDays.push({
        date: getDateKey(date),
        active: activeDates.has(
          getDateKey(date)
        ),
      });
    }

    return {
      currentStreak,
      lastTenDays,
    };
  }

  const {
    currentStreak,
    lastTenDays,
  } = getStreakData();

  return (
    <div className="dashboard">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="dashboard-logo">
          <span>&gt;_</span>
          NEONCODE
        </div>

        <div className="sidebar-status">
          <span></span>
          SYSTEM ONLINE
        </div>

        <nav className="sidebar-nav">

          <a className="active" href="#">
            <span>▣</span>
            Dashboard
          </a>

          <Link to="/review">
            <span>⌘</span>
            Code Review
          </Link>

          <Link to="/history">
            <span>◷</span>
            History
          </Link>

          <Link to="/practice">
            <span>⚡</span>
            AI Practice
          </Link>

        </nav>

        <div className="sidebar-bottom">

          <div className="user-mini">

            <div className="avatar">
              {userName.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{userName}</strong>
              <small>NEONCODE USER</small>
            </div>

          </div>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem(
                "neoncode_token"
              );

              localStorage.removeItem(
                "neoncode_user"
              );

              localStorage.removeItem("user");

              window.location.href = "/login";
            }}
          >
            ⏻ LOGOUT
          </button>

        </div>

      </aside>


      {/* MAIN */}

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>

            <p className="dashboard-command">
              &gt; DASHBOARD / OVERVIEW
            </p>

            <h1>
              Welcome back,{" "}
              <span>{userName}.</span>
            </h1>

            <p className="header-description">
              Here's how your problem-solving skills are evolving.
            </p>

          </div>

          <Link
            to="/review"
            className="new-review-btn"
          >
            + NEW CODE REVIEW
          </Link>

        </header>


        {/* STATS ERROR */}

        {statsError && (
          <div className="review-error">

            <strong>!</strong>

            <span>{statsError}</span>

            <button
              type="button"
              className="practice-btn"
              onClick={fetchDashboardStats}
            >
              RETRY →
            </button>

          </div>
        )}


        {/* STAT CARDS */}

        <section className="stat-grid">

          <div className="stat-card">

            <div className="stat-top">
              <span>TOTAL REVIEWS</span>
              <b>01</b>
            </div>

            <strong>
              {loadingStats
                ? "..."
                : stats.totalReviews}
            </strong>

            <p>
              Your total AI code reviews
            </p>

          </div>


          <div className="stat-card">

            <div className="stat-top">
              <span>AVERAGE SCORE</span>
              <b>02</b>
            </div>

            <strong>
              {loadingStats
                ? "..."
                : stats.averageScore}

              {!loadingStats && (
                <span>/10</span>
              )}

            </strong>

            <p>
              Average score across reviews
            </p>

          </div>


          <div className="stat-card">

            <div className="stat-top">
              <span>PROBLEMS SOLVED</span>
              <b>03</b>
            </div>

            <strong>
              {loadingStats
                ? "..."
                : stats.problemsSolved}
            </strong>

            <p>
              Across{" "}
              <span className="highlight">
                {loadingStats
                  ? "..."
                  : stats.topicsCovered}{" "}
                topics
              </span>
            </p>

          </div>


          {/* DYNAMIC STREAK */}

          <div className="stat-card streak-card">

            <div className="stat-top">
              <span>CURRENT STREAK</span>
              <b>04</b>
            </div>

            <strong>
              {loadingStats
                ? "..."
                : currentStreak}
            </strong>

            <p>
              {loadingStats
                ? "Checking activity..."
                : currentStreak === 1
                ? "1 day active"
                : `${currentStreak} days active`}
            </p>

            <div className="streak-dots">

              {lastTenDays.map((day) => (
                <i
                  key={day.date}
                  className={
                    day.active
                      ? "active"
                      : ""
                  }
                  title={day.date}
                ></i>
              ))}

            </div>

          </div>

        </section>


        {/* CHART SECTION */}

        <section className="analytics-grid">

          {/* PERFORMANCE CHART */}

          <div className="panel performance-panel">

            <div className="panel-header">

              <div>

                <p className="panel-label">
                  &gt; PERFORMANCE_ANALYSIS
                </p>

                <h2>
                  Problem-solving trajectory
                </h2>

              </div>

              <div className="chart-filter">
                LAST REVIEWS
              </div>

            </div>

            <div className="chart-area">

              <div className="y-axis">
                <span>10</span>
                <span>8</span>
                <span>6</span>
                <span>4</span>
                <span>2</span>
              </div>

              <div className="chart">

                <div className="grid-line line-1"></div>
                <div className="grid-line line-2"></div>
                <div className="grid-line line-3"></div>
                <div className="grid-line line-4"></div>
                <div className="grid-line line-5"></div>

                {loadingStats ? (

                  <div className="chart-empty">
                    Loading performance data...
                  </div>

                ) : statsError ? (

                  <div className="chart-empty">
                    Unable to load performance data.
                  </div>

                ) : performanceReviews.length > 0 ? (

                  <svg
                    className="performance-line"
                    viewBox="0 0 700 260"
                    preserveAspectRatio="none"
                  >

                    <defs>

                      <linearGradient
                        id="areaGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >

                        <stop
                          offset="0%"
                          stopColor="#00ff66"
                          stopOpacity="0.25"
                        />

                        <stop
                          offset="100%"
                          stopColor="#00ff66"
                          stopOpacity="0"
                        />

                      </linearGradient>

                    </defs>

                    <path
                      className="chart-area-fill"
                      d={chartAreaPath}
                    />

                    <path
                      className="chart-path"
                      d={chartPath}
                    />

                    {chartPoints.map(
                      (point, index) => (
                        <circle
                          key={index}
                          cx={point.x}
                          cy={point.y}
                          r={
                            index ===
                            chartPoints.length - 1
                              ? 6
                              : 4
                          }
                        />
                      )
                    )}

                  </svg>

                ) : (

                  <div className="chart-empty">
                    Submit code reviews to build your
                    performance graph.
                  </div>

                )}

                {!loadingStats &&
                  !statsError &&
                  performanceReviews.length > 0 && (

                    <div className="chart-tooltip">

                      <span>
                        LATEST SCORE
                      </span>

                      <strong>
                        {currentScore}
                      </strong>

                      <small>
                        CURRENT
                      </small>

                    </div>

                  )}

              </div>

            </div>

            <div className="chart-days">

              {chartDates.length > 0 ? (

                chartDates.map(
                  (date, index) => (
                    <span key={index}>
                      {date}
                    </span>
                  )
                )

              ) : (

                <>
                  <span>--</span>
                  <span>--</span>
                  <span>--</span>
                  <span>--</span>
                  <span>--</span>
                </>

              )}

            </div>

          </div>


          {/* OVERALL SCORE */}

          <div className="panel score-panel">

            <p className="panel-label">
              &gt; OVERALL_RATING
            </p>

            <h2>
              AI assessment
            </h2>

            <div className="score-ring">

              <div className="score-ring-inner">

                <strong>
                  {loadingStats
                    ? "..."
                    : stats.averageScore}
                </strong>

                <span>
                  / 10
                </span>

              </div>

            </div>

            <div className="score-status">

              <span></span>

              {loadingStats
                ? "CALCULATING..."
                : statsError
                ? "UNAVAILABLE"
                : stats.averageScore >= 7
                ? "ABOVE AVERAGE"
                : stats.averageScore >= 5
                ? "DEVELOPING"
                : "NEEDS IMPROVEMENT"}

            </div>

            <p className="score-description">
              Your overall score is calculated from
              your submitted code reviews.
            </p>

          </div>

        </section>


        {/* TOPICS */}

        <section className="lower-grid">

          <div className="panel topics-panel">

            <div className="panel-header">

              <div>

                <p className="panel-label">
                  &gt; TOPIC_ANALYSIS
                </p>

                <h2>
                  DSA proficiency
                </h2>

              </div>

              {topics.length > 0 && (
                <span className="weak-label">
                  WEAK AREA DETECTED
                </span>
              )}

            </div>

            <div className="topics-list">

              {loadingTopics ? (

                <p>
                  Loading topic analysis...
                </p>

              ) : topicsError ? (

                <div className="history-empty">

                  <div className="empty-icon">
                    !
                  </div>

                  <h3>
                    TOPIC ANALYSIS UNAVAILABLE
                  </h3>

                  <p>
                    {topicsError}
                  </p>

                  <button
                    type="button"
                    className="practice-btn"
                    onClick={fetchTopicProficiency}
                  >
                    RETRY →
                  </button>

                </div>

              ) : topics.length > 0 ? (

                topics.map((topic) => (

                  <div
                    className="topic-row"
                    key={topic.name}
                  >

                    <div className="topic-name">

                      <span>
                        {topic.name}
                      </span>

                      <strong>
                        {topic.score}%
                      </strong>

                    </div>

                    <div className="topic-bar">

                      <div
                        className="topic-fill"
                        style={{
                          width: `${topic.score}%`,
                        }}
                      ></div>

                    </div>

                  </div>

                ))

              ) : (

                <p>
                  No topic data yet. Submit a code review
                  to start tracking your DSA proficiency.
                </p>

              )}

            </div>

          </div>


          {/* WEAK AREA */}

          <div className="panel weak-panel">

            <div className="weak-icon">
              !
            </div>

            <p className="panel-label">
              &gt; AI_RECOMMENDATION
            </p>

            {loadingTopics ? (

              <h2>
                Analyzing your topics...
              </h2>

            ) : topicsError ? (

              <>

                <h2>
                  Topic analysis unavailable.
                </h2>

                <p>
                  NEONCODE could not determine your
                  weakest topic right now.
                </p>

                <button
                  type="button"
                  className="practice-btn"
                  onClick={fetchTopicProficiency}
                >
                  RETRY →
                </button>

              </>

            ) : weakestTopic ? (

              <>

                <h2>
                  {weakestTopic.name} needs attention.
                </h2>

                <p>
                  Your average score in{" "}
                  {weakestTopic.name} problems is
                  <strong>
                    {" "}
                    {weakestTopic.score}%
                  </strong>
                  , making it your current weakest topic.
                </p>

                <Link
                  to="/practice"
                  className="practice-btn"
                >
                  TRAIN THIS TOPIC →
                </Link>

              </>

            ) : (

              <>

                <h2>
                  Start building your profile.
                </h2>

                <p>
                  Submit code reviews to let NEONCODE
                  identify your weakest DSA topics.
                </p>

                <Link
                  to="/review"
                  className="practice-btn"
                >
                  START REVIEW →
                </Link>

              </>

            )}

          </div>

        </section>


        {/* RECENT REVIEWS */}

        <section className="panel recent-panel">

          <div className="panel-header">

            <div>

              <p className="panel-label">
                &gt; RECENT_ACTIVITY
              </p>

              <h2>
                Latest code reviews
              </h2>

            </div>

            <Link to="/history">
              VIEW ALL →
            </Link>

          </div>

          <div className="submission-list">

            {loadingStats ? (

              <div className="submission-row">

                <div className="submission-problem">

                  <span>
                    ...
                  </span>

                  <div>

                    <strong>
                      Loading reviews...
                    </strong>

                    <small>
                      Fetching from MongoDB
                    </small>

                  </div>

                </div>

              </div>

            ) : statsError ? (

              <div className="submission-row">

                <div className="submission-problem">

                  <span>
                    !
                  </span>

                  <div>

                    <strong>
                      Reviews unavailable
                    </strong>

                    <small>
                      {statsError}
                    </small>

                  </div>

                </div>

                <button
                  type="button"
                  className="view-btn"
                  onClick={fetchDashboardStats}
                >
                  RETRY →
                </button>

              </div>

            ) : recentReviews.length > 0 ? (

              recentReviews.map(
                (submission, index) => (

                  <div
                    className="submission-row"
                    key={submission.id}
                  >

                    <div className="submission-problem">

                      <span>
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <div>

                        <strong>
                          {submission.problem}
                        </strong>

                        <small>
                          {submission.topic}
                          {" • "}
                          {submission.language}
                        </small>

                      </div>

                    </div>

                    <div className="submission-complexity">
                      {submission.complexity}
                    </div>

                    <div className="submission-score">

                      {submission.score}

                      <span>
                        /10
                      </span>

                    </div>

                    <Link
                      to={`/review?history=${submission.id}`}
                      className="view-btn"
                    >
                      VIEW →
                    </Link>

                  </div>

                )
              )

            ) : (

              <div className="submission-row">

                <div className="submission-problem">

                  <span>
                    --
                  </span>

                  <div>

                    <strong>
                      No reviews yet
                    </strong>

                    <small>
                      Submit your first code review
                    </small>

                  </div>

                </div>

                <Link
                  to="/review"
                  className="view-btn"
                >
                  START →
                </Link>

              </div>

            )}

          </div>

        </section>


        {/* GLOBAL RETRY */}

        {(statsError || topicsError) && (

          <div
            style={{
              marginTop: "20px",
              textAlign: "center",
            }}
          >

            <button
              type="button"
              className="practice-btn"
              onClick={retryDashboard}
            >
              RETRY DASHBOARD →
            </button>

          </div>

        )}

      </main>

    </div>
  );
}

export default Dashboard;