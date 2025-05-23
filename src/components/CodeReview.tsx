import React, { useState } from 'react';
import './CodeReview.css'; // Assuming you have a CSS file for styling

interface ReviewResult {
  review: string;
  suggestions: string[];
}

const CodeReview: React.FC = () => {
  const [code, setCode] = useState('');
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const workerUrl = 'https://my-cloud-worker.sapphirewhite59.workers.dev';


  const handleReviewCode = async () => {
    setLoading(true);
    setError(null);
    setReviewResult(null);

    try {
      const response = await fetch(workerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data: ReviewResult = await response.json();
      setReviewResult(data);
    } catch (err: any) {
      console.error('Error reviewing code:', err);
      setError(`Failed to review code: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="code-review-container">
      <h1>代码审查工具</h1>
      <div className="input-section">
        <textarea
          placeholder="请粘贴您的代码在这里..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={15}
          cols={80}
        />
        <button onClick={handleReviewCode} disabled={loading || !code}>
          {loading ? '审查中...' : '审查代码'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {reviewResult && (
        <div className="review-results">
          <h2>审查结果</h2>
          <div className="review-summary">
            <h3>总结</h3>
            <p>{reviewResult.review}</p>
          </div>
          {reviewResult.suggestions && reviewResult.suggestions.length > 0 && (
            <div className="review-suggestions">
              <h3>改进建议</h3>
              <ul>
                {reviewResult.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeReview;

