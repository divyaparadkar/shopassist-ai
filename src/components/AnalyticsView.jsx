import React from 'react';
import { BarChart3, Database, Tag, Activity, CheckCircle, Shield, Sparkles, Layers } from 'lucide-react';

export default function AnalyticsView({ intents }) {
  const totalPatterns = intents.reduce((acc, curr) => acc + curr.patterns.length, 0);
  const totalResponses = intents.reduce((acc, curr) => acc + curr.responses.length, 0);
  const contextualIntents = intents.filter(i => !!i.context_set).length;

  return (
    <div className="analytics-container">
      {/* Metric Cards Row */}
      <div className="metrics-grid">
        <div className="metric-card glass-panel">
          <div className="metric-top flex-center-gap">
            <Tag size={20} className="accent-icon" />
            <span className="metric-title">Total Intent Tags</span>
          </div>
          <span className="metric-value">{intents.length}</span>
          <span className="metric-sub">Structured Intent Classes</span>
        </div>

        <div className="metric-card glass-panel">
          <div className="metric-top flex-center-gap">
            <Database size={20} className="accent-icon" />
            <span className="metric-title">Training Patterns</span>
          </div>
          <span className="metric-value">{totalPatterns}</span>
          <span className="metric-sub">Avg ~{(totalPatterns / (intents.length || 1)).toFixed(1)} patterns/tag</span>
        </div>

        <div className="metric-card glass-panel">
          <div className="metric-top flex-center-gap">
            <Sparkles size={20} className="accent-icon" />
            <span className="metric-title">Bot Responses</span>
          </div>
          <span className="metric-value">{totalResponses}</span>
          <span className="metric-sub">Varied NLG Responses</span>
        </div>

        <div className="metric-card glass-panel">
          <div className="metric-top flex-center-gap">
            <Layers size={20} className="accent-icon" />
            <span className="metric-title">Contextual Intents</span>
          </div>
          <span className="metric-value">{contextualIntents}</span>
          <span className="metric-sub">Multi-turn Dialog State Handlers</span>
        </div>
      </div>

      {/* Main Charts & Breakdown Section */}
      <div className="analytics-grid">
        <div className="chart-card glass-panel">
          <div className="chart-header flex-center-gap">
            <BarChart3 size={18} className="accent-icon" />
            <h3>Pattern Volume by Intent Tag</h3>
          </div>
          <div className="intent-bars-list">
            {intents.map(intent => {
              const maxP = Math.max(...intents.map(i => i.patterns.length), 1);
              const pct = (intent.patterns.length / maxP) * 100;
              return (
                <div key={intent.tag} className="intent-bar-row">
                  <span className="bar-tag-label">{intent.tag}</span>
                  <div className="bar-container">
                    <div className="bar-fill" style={{ width: `${pct}%` }}></div>
                  </div>
                  <span className="bar-count">{intent.patterns.length} patterns</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="chart-card glass-panel">
          <div className="chart-header flex-center-gap">
            <Activity size={18} className="accent-icon" />
            <h3>NLP Matching Engine Architecture</h3>
          </div>
          <div className="architecture-specs">
            <div className="spec-item">
              <strong>Classifier Algorithm:</strong>
              <p>Hybrid TF-IDF Cosine Similarity + N-Gram Jaccard Distance + Regex Entity Extraction</p>
            </div>

            <div className="spec-item">
              <strong>Confidence Threshold:</strong>
              <p>22% Similarity Score (Sub-threshold inputs trigger fallback dialog with quick suggestion chips)</p>
            </div>

            <div className="spec-item">
              <strong>Context Engine:</strong>
              <p>Stateful Context Management (e.g., <code>awaiting_order_id</code> transitions on order & cancellation intents)</p>
            </div>

            <div className="spec-item">
              <strong>Entity Recognition:</strong>
              <p>Automatic detection of 6-digit Order IDs, <code>ORD-XXXX</code> identifiers, carrier tracking numbers, and cancellation triggers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
