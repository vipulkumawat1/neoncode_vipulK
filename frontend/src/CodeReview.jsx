import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import "./CodeReview.css";

function CodeReview() {
  const [searchParams] = useSearchParams();

  const [language, setLanguage] = useState("cpp");

  const [code, setCode] = useState(`#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int solve(vector<int>& nums) {
        int ans = 0;

        for (auto x : nums) {
            ans += x;
        }

        return ans;
    }
};`);

  const [analyzing, setAnalyzing] = useState(false);
  const [loadingReview, setLoadingReview] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [review, setReview] = useState(null);
  const [error, setError] = useState("");

  // =========================
  // LOAD HISTORICAL REVIEW
  // =========================

  useEffect(() => {
    const historyId = searchParams.get("history");

    if (!historyId) {
      return;
    }

    fetchHistoricalReview(historyId);
  }, [searchParams]);

  async function fetchHistoricalReview(historyId) {
    const token = localStorage.getItem("neoncode_token");

    if (!token) {
      setError("Please login to view this review.");
      return;
    }

    setLoadingReview(true);
    setShowReview(false);
    setReview(null);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5001/api/review/history/${historyId}`,
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
        throw new Error("Invalid server response");
      }

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to load the saved review."
        );
        return;
      }

      const savedReview = data.review;

      if (!savedReview) {
        setError("Saved review could not be found.");
        return;
      }

      setCode(savedReview.code);
      setLanguage(savedReview.language);

      setReview({
        score: savedReview.score,
        correctness: savedReview.correctness,
        timeComplexity: savedReview.timeComplexity,
        spaceComplexity: savedReview.spaceComplexity,
        topic: savedReview.topic,
        strengths: savedReview.strengths,
        suggestions: savedReview.suggestions,
        bugs: savedReview.bugs,
        summary: savedReview.summary,
      });

      setShowReview(true);
    } catch (error) {
      console.error(
        "Historical review request failed:",
        error
      );

      setError(
        "Cannot connect to the backend. Make sure the backend server is running."
      );
    } finally {
      setLoadingReview(false);
    }
  }

  // =========================
  // CLEAR
  // =========================

  const handleClear = () => {
    if (analyzing || loadingReview) {
      return;
    }

    setCode("");
    setShowReview(false);
    setReview(null);
    setError("");
  };

  // =========================
  // LANGUAGE CHANGE
  // =========================

  const handleLanguageChange = (newLanguage) => {
    if (analyzing || loadingReview) {
      return;
    }

    setLanguage(newLanguage);
    setShowReview(false);
    setReview(null);
    setError("");
  };

  // =========================
  // ANALYZE CODE
  // =========================

  const handleAnalyze = async () => {
    if (analyzing || loadingReview) {
      return;
    }

    if (!code.trim()) {
      setError(
        "Please write some code before starting the AI review."
      );
      return;
    }

    const token = localStorage.getItem("neoncode_token");

    if (!token) {
      setError("Please login before analyzing code.");
      return;
    }

    setAnalyzing(true);
    setShowReview(false);
    setReview(null);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5001/api/review",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            code,
            language,
          }),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!response.ok) {
        setError(
          data.message ||
            "Code review failed. Please try again."
        );
        return;
      }

      if (!data.review) {
        setError(
          "The AI returned an incomplete review. Please try again."
        );
        return;
      }

      setReview(data.review);
      setShowReview(true);
    } catch (error) {
      console.error(
        "Review request failed:",
        error
      );

      setError(
        "Cannot connect to the backend. Make sure the backend server is running."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="review-page">

      {/* =========================
          TOP BAR
      ========================= */}

      <header className="review-topbar">

        <Link
          to="/dashboard"
          className="review-logo"
        >
          <span>&gt;_</span>
          NEONCODE
        </Link>

        <div className="review-center">
          CODE REVIEW
          <span>● LOCAL SESSION</span>
        </div>

        <div className="review-actions">

          <select
            value={language}
            onChange={(e) =>
              handleLanguageChange(
                e.target.value
              )
            }
            disabled={
              analyzing ||
              loadingReview
            }
          >
            <option value="cpp">C++17</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="javascript">
              JavaScript
            </option>
          </select>

          <button
            type="button"
            className="clear-btn"
            onClick={handleClear}
            disabled={
              analyzing ||
              loadingReview
            }
          >
            CLEAR
          </button>

          <button
            type="button"
            className="analyze-btn"
            onClick={handleAnalyze}
            disabled={
              analyzing ||
              loadingReview
            }
          >
            {loadingReview
              ? "LOADING..."
              : analyzing
              ? "ANALYZING..."
              : "ANALYZE CODE →"}
          </button>

        </div>

      </header>


      {/* =========================
          MAIN
      ========================= */}

      <main className="review-main">

        {/* =========================
            CODE EDITOR
        ========================= */}

        <div className="editor-header">

          <div className="editor-file">

            <span className="file-dot"></span>

            {language === "cpp" &&
              "solution.cpp"}

            {language === "java" &&
              "Solution.java"}

            {language === "python" &&
              "solution.py"}

            {language === "javascript" &&
              "solution.js"}

          </div>

          <div className="editor-info">

            {language === "cpp" && "C++17"}

            {language === "java" && "Java"}

            {language === "python" && "Python"}

            {language === "javascript" &&
              "JavaScript"}

            &nbsp; • &nbsp; UTF-8

          </div>

        </div>


        <div className="real-editor">

          <Editor
            height="650px"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(value) =>
              setCode(value || "")
            }
            options={{
              fontSize: 14,

              minimap: {
                enabled: true,
              },

              automaticLayout: true,

              wordWrap: "on",

              padding: {
                top: 20,
              },

              scrollBeyondLastLine: false,

              smoothScrolling: true,

              cursorBlinking: "smooth",

              tabSize: 4,

              insertSpaces: true,

              readOnly:
                loadingReview,
            }}
          />

        </div>


        {/* =========================
            STATUS BAR
        ========================= */}

        <div className="editor-statusbar">

          <div>

            <span className="online-dot"></span>

            {loadingReview
              ? "LOADING SAVED REVIEW..."
              : analyzing
              ? "AI ANALYSIS IN PROGRESS..."
              : showReview
              ? "ANALYSIS COMPLETE"
              : "READY TO ANALYZE"}

          </div>

          <div>

            {language === "cpp" && "C++17"}

            {language === "java" && "Java"}

            {language === "python" && "Python"}

            {language === "javascript" &&
              "JavaScript"}

            &nbsp; | &nbsp; UTF-8

          </div>

        </div>


        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="review-error">
            <strong>!</strong>
            <span>{error}</span>
          </div>
        )}


        {/* =========================
            LOADING MESSAGE
        ========================= */}

        {(analyzing ||
          loadingReview) && (
          <div className="review-loading">

            <div className="review-loading-icon">
              AI
            </div>

            <div>

              <p>
                {loadingReview
                  ? "LOADING SAVED REVIEW"
                  : "AI ANALYSIS IN PROGRESS"}
              </p>

              <span>
                {loadingReview
                  ? "Retrieving your previous code review..."
                  : "NEONCODE is analyzing your code. This may take a few moments."}
              </span>

            </div>

          </div>
        )}

      </main>


      {/* =========================
          AI REVIEW
      ========================= */}

      {showReview && review && (

        <section className="ai-review">

          <div className="ai-review-header">

            <div>

              <p className="ai-label">
                &gt; NEURAL_ANALYSIS_COMPLETE
              </p>

              <h2>
                AI Code Review
              </h2>

              <p className="ai-subtitle">
                Analysis generated from your submitted solution.
              </p>

            </div>


            <div className="review-score">

              <span>SCORE</span>

              <strong>
                {review.score}
              </strong>

              <small>
                /10
              </small>

            </div>

          </div>


          {/* =========================
              SUMMARY CARDS
          ========================= */}

          <div className="review-summary-grid">

            <div className="review-card success-card">

              <span className="review-card-label">
                CORRECTNESS
              </span>

              <strong>

                {review.correctness?.status ===
                "CORRECT"
                  ? "✓ CORRECT"
                  : "⚠ REVIEW"}

              </strong>

              <p>
                {review.correctness?.explanation}
              </p>

            </div>


            <div className="review-card">

              <span className="review-card-label">
                TIME COMPLEXITY
              </span>

              <strong>
                {review.timeComplexity?.value}
              </strong>

              <p>
                {review.timeComplexity?.explanation}
              </p>

            </div>


            <div className="review-card">

              <span className="review-card-label">
                SPACE COMPLEXITY
              </span>

              <strong>
                {review.spaceComplexity?.value}
              </strong>

              <p>
                {review.spaceComplexity?.explanation}
              </p>

            </div>


            <div className="review-card topic-card">

              <span className="review-card-label">
                DETECTED TOPIC
              </span>

              <strong>
                {review.topic}
              </strong>

              <p>
                Primary DSA category detected from your solution.
              </p>

            </div>

          </div>


          {/* =========================
              DETAILS
          ========================= */}

          <div className="review-details-grid">

            <div className="review-detail-panel">

              <p className="ai-label">
                &gt; CODE_QUALITY
              </p>

              <h3>
                What you're doing well
              </h3>

              <ul>

                {review.strengths?.length > 0 ? (
                  review.strengths.map(
                    (item, index) => (
                      <li key={index}>
                        ✓ {item}
                      </li>
                    )
                  )
                ) : (
                  <li>
                    No strengths were returned.
                  </li>
                )}

              </ul>

            </div>


            <div className="review-detail-panel">

              <p className="ai-label">
                &gt; OPTIMIZATION
              </p>

              <h3>
                Suggestions
              </h3>

              <ul>

                {review.suggestions?.length > 0 ? (
                  review.suggestions.map(
                    (item, index) => (
                      <li key={index}>
                        → {item}
                      </li>
                    )
                  )
                ) : (
                  <li>
                    No optimization suggestions.
                  </li>
                )}

              </ul>

            </div>


            <div className="review-detail-panel">

              <p className="ai-label">
                &gt; BUG_SCAN
              </p>

              <h3>
                Potential issues
              </h3>


              <div className="bug-status">

                <span>

                  {review.bugs?.length === 0
                    ? "✓"
                    : "⚠"}

                </span>

                {review.bugs?.length === 0
                  ? "No critical bugs detected"
                  : `${review.bugs.length} potential issue(s) detected`}

              </div>


              {review.bugs?.length > 0 && (

                <ul>

                  {review.bugs.map(
                    (bug, index) => (
                      <li key={index}>
                        {bug}
                      </li>
                    )
                  )}

                </ul>

              )}

            </div>

          </div>


          {/* =========================
              AI SUMMARY
          ========================= */}

          <div className="ai-summary">

            <div className="summary-icon">
              AI
            </div>

            <div>

              <p className="ai-label">
                &gt; AI_SUMMARY
              </p>

              <p className="summary-text">
                {review.summary}
              </p>

            </div>

          </div>


          {/* =========================
              BOTTOM ACTIONS
          ========================= */}

          <div className="review-actions-bottom">

            <Link
              to="/history"
              className="secondary-review-btn"
            >
              ← BACK TO HISTORY
            </Link>

            <Link
              to="/recommendations"
              className="dashboard-review-btn"
            >
              PRACTICE RECOMMENDED PROBLEMS →
            </Link>

            <Link
              to="/review"
              className="dashboard-review-btn"
            >
              NEW REVIEW →
            </Link>

          </div>

        </section>

      )}

    </div>
  );
}

export default CodeReview;