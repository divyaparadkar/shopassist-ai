import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Search, 
  Code, 
  Play, 
  Tag, 
  Sparkles, 
  FileText,
  Save,
  Download,
  Upload
} from 'lucide-react';
import { classifyIntent } from '../utils/nlpEngine';

export default function StudioView({ intents, setIntents, onExportJson }) {
  const [selectedTag, setSelectedTag] = useState(intents[0]?.tag || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [testInput, setTestInput] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [showAddIntentModal, setShowAddIntentModal] = useState(false);

  // New Intent Form
  const [newTag, setNewTag] = useState('');
  const [newPatterns, setNewPatterns] = useState('');
  const [newResponses, setNewResponses] = useState('');
  const [newContextSet, setNewContextSet] = useState('');

  // Edit current intent
  const currentIntent = intents.find(i => i.tag === selectedTag) || intents[0];
  const [editPatterns, setEditPatterns] = useState(currentIntent?.patterns.join('\n') || '');
  const [editResponses, setEditResponses] = useState(currentIntent?.responses.join('\n') || '');
  const [editContextSet, setEditContextSet] = useState(currentIntent?.context_set || '');

  const handleSelectIntent = (intent) => {
    setSelectedTag(intent.tag);
    setEditPatterns(intent.patterns.join('\n'));
    setEditResponses(intent.responses.join('\n'));
    setEditContextSet(intent.context_set || '');
  };

  const handleSaveIntentEdits = () => {
    const updatedPatterns = editPatterns.split('\n').map(p => p.trim()).filter(Boolean);
    const updatedResponses = editResponses.split('\n').map(r => r.trim()).filter(Boolean);

    setIntents(prev => prev.map(i => {
      if (i.tag === selectedTag) {
        return {
          ...i,
          patterns: updatedPatterns,
          responses: updatedResponses,
          context_set: editContextSet.trim()
        };
      }
      return i;
    }));

    alert(`Saved changes for intent "${selectedTag}"!`);
  };

  const handleCreateIntent = (e) => {
    e.preventDefault();
    if (!newTag.trim()) return;

    const tagSlug = newTag.trim().toLowerCase().replace(/\s+/g, '_');
    if (intents.some(i => i.tag === tagSlug)) {
      alert("An intent with this tag already exists!");
      return;
    }

    const patternsArr = newPatterns.split('\n').map(p => p.trim()).filter(Boolean);
    const responsesArr = newResponses.split('\n').map(r => r.trim()).filter(Boolean);

    const created = {
      tag: tagSlug,
      patterns: patternsArr.length > 0 ? patternsArr : ["Sample question"],
      responses: responsesArr.length > 0 ? responsesArr : ["Sample response"],
      context_set: newContextSet.trim()
    };

    setIntents(prev => [...prev, created]);
    setSelectedTag(tagSlug);
    setNewTag('');
    setNewPatterns('');
    setNewResponses('');
    setNewContextSet('');
    setShowAddIntentModal(false);
  };

  const handleDeleteIntent = (tagToDelete) => {
    if (intents.length <= 1) {
      alert("Cannot delete the last remaining intent.");
      return;
    }
    if (confirm(`Are you sure you want to delete the "${tagToDelete}" intent?`)) {
      const remaining = intents.filter(i => i.tag !== tagToDelete);
      setIntents(remaining);
      setSelectedTag(remaining[0].tag);
    }
  };

  const handleRunTest = () => {
    if (!testInput.trim()) return;
    const res = classifyIntent(testInput, intents);
    setTestResult(res);
  };

  const filteredIntents = intents.filter(i => {
    const q = searchTerm.toLowerCase();
    return i.tag.toLowerCase().includes(q) || 
           i.patterns.some(p => p.toLowerCase().includes(q)) ||
           i.responses.some(r => r.toLowerCase().includes(q));
  });

  return (
    <div className="studio-container">
      {/* Sidebar: Intent List */}
      <div className="studio-sidebar glass-panel">
        <div className="sidebar-header">
          <h3>Intents Dataset ({intents.length})</h3>
          <button 
            className="btn-primary-sm flex-center-gap"
            onClick={() => setShowAddIntentModal(true)}
          >
            <Plus size={14} /> Add Intent
          </button>
        </div>

        <div className="search-box">
          <Search size={14} />
          <input 
            type="text" 
            placeholder="Filter intents or patterns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="intent-list">
          {filteredIntents.map(intent => (
            <div 
              key={intent.tag}
              className={`intent-item ${selectedTag === intent.tag ? 'selected' : ''}`}
              onClick={() => handleSelectIntent(intent)}
            >
              <div className="intent-item-top">
                <span className="intent-tag flex-center-gap">
                  <Tag size={12} /> {intent.tag}
                </span>
                <span className="pattern-count">{intent.patterns.length} patterns</span>
              </div>
              <p className="intent-preview-pattern">"{intent.patterns[0]}"</p>
              {intent.context_set && (
                <span className="context-pill">context: {intent.context_set}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Studio Workspace */}
      <div className="studio-main glass-panel">
        {currentIntent ? (
          <div className="editor-view">
            <div className="editor-header">
              <div>
                <h2>Intent: <span className="accent-text" style={{ color: '#ec4899' }}>{currentIntent.tag}</span></h2>
                <span className="editor-sub">💡 Easy Guide: Add example training lines on the left and bot responses on the right.</span>
              </div>

              <div className="flex-center-gap">
                <button className="btn-danger-outline flex-center-gap" onClick={() => handleDeleteIntent(currentIntent.tag)}>
                  <Trash2 size={16} /> Delete Tag
                </button>
                <button className="btn-primary flex-center-gap" onClick={handleSaveIntentEdits}>
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </div>

            <div className="editor-grid">
              {/* Patterns Editor */}
              <div className="editor-box">
                <div className="box-header flex-center-gap">
                  <Code size={16} className="accent-icon" />
                  <label>Training Patterns (One phrase per line)</label>
                </div>
                <textarea 
                  className="code-textarea"
                  rows={10}
                  value={editPatterns}
                  onChange={(e) => setEditPatterns(e.target.value)}
                  placeholder="Enter example phrases users might type..."
                />
                <span className="box-help">These sample phrases train the NLP similarity classifier.</span>
              </div>

              {/* Responses Editor */}
              <div className="editor-box">
                <div className="box-header flex-center-gap">
                  <FileText size={16} className="accent-icon" />
                  <label>Bot Responses (One response per line)</label>
                </div>
                <textarea 
                  className="code-textarea"
                  rows={10}
                  value={editResponses}
                  onChange={(e) => setEditResponses(e.target.value)}
                  placeholder="Enter bot responses (ShopBot selects one at random)..."
                />
                <span className="box-help">Multiple responses add natural variety to ShopBot's voice.</span>
              </div>
            </div>

            {/* Context Config */}
            <div className="context-config-row">
              <label>Set Context State (Optional):</label>
              <input 
                type="text"
                className="input-field"
                placeholder="e.g. awaiting_order_id"
                value={editContextSet}
                onChange={(e) => setEditContextSet(e.target.value)}
              />
              <span className="field-hint">When triggered, sets session state for multi-turn conversations.</span>
            </div>

            {/* Live Model Tester Console */}
            <div className="tester-console glass-panel">
              <div className="tester-header flex-center-gap">
                <Sparkles size={18} className="accent-icon" />
                <h3>Live NLP Intent Tester Console</h3>
              </div>

              <div className="tester-input-row">
                <input 
                  type="text" 
                  className="input-field"
                  placeholder="Type a test phrase (e.g. 'Can I pay with Apple Pay?', 'Where is package #123456?')..."
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRunTest()}
                />
                <button className="btn-primary flex-center-gap" onClick={handleRunTest}>
                  <Play size={16} /> Run Classifier
                </button>
              </div>

              {testResult && (
                <div className="test-results-panel">
                  <div className="result-top-summary">
                    <div>
                      <span>Predicted Intent: </span>
                      <strong className="predicted-tag">{testResult.intent}</strong>
                    </div>
                    <div>
                      <span>Confidence Score: </span>
                      <strong className="confidence-num">{Math.round(testResult.confidence * 100)}%</strong>
                    </div>
                    {testResult.matchedPattern && (
                      <div>
                        <span>Closest Pattern: </span>
                        <em>"{testResult.matchedPattern}"</em>
                      </div>
                    )}
                  </div>

                  <div className="scores-breakdown flex-column">
                    <span className="scores-title">Intent Ranking Breakdown:</span>
                    {testResult.scores.map(s => (
                      <div key={s.tag} className="score-bar-row">
                        <span className="score-tag-name">{s.tag}</span>
                        <div className="score-track">
                          <div 
                            className="score-fill" 
                            style={{ width: `${Math.round(s.score * 100)}%` }}
                          ></div>
                        </div>
                        <span className="score-val">{Math.round(s.score * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="empty-studio-state">Select an intent to view and edit training patterns.</div>
        )}
      </div>

      {/* Add New Intent Modal */}
      {showAddIntentModal && (
        <div className="modal-backdrop">
          <div className="modal-card glass-panel">
            <div className="modal-header">
              <h3>Create New Intent</h3>
              <button className="close-btn" onClick={() => setShowAddIntentModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateIntent}>
              <div className="form-group">
                <label>Intent Tag (Unique identifier):</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. promo_codes, gift_cards"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Training Patterns (One per line):</label>
                <textarea 
                  className="code-textarea" 
                  rows={4}
                  placeholder="Do you have discount codes?&#10;Where to apply promo code?"
                  value={newPatterns}
                  onChange={(e) => setNewPatterns(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Responses (One per line):</label>
                <textarea 
                  className="code-textarea" 
                  rows={4}
                  placeholder="Promo codes can be entered at checkout step 2!"
                  value={newResponses}
                  onChange={(e) => setNewResponses(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Context Set (Optional):</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. awaiting_promo_code"
                  value={newContextSet}
                  onChange={(e) => setNewContextSet(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddIntentModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Intent</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
