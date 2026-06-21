/**
 * TestPilot — Shared App Module
 * Handles all state via localStorage so all 4 pages share the same data.
 */
const App = (() => {
  const KEYS = {
    SESSION: 'tp_session',
    TESTS:   'tp_tests',
  };

  // ──────────────────────────────────────────────
  // Session
  // ──────────────────────────────────────────────
  function getSession() {
    try { return JSON.parse(localStorage.getItem(KEYS.SESSION)) || {}; }
    catch { return {}; }
  }

  function saveSession(data) {
    localStorage.setItem(KEYS.SESSION, JSON.stringify(data));
  }

  // ──────────────────────────────────────────────
  // Tests
  // ──────────────────────────────────────────────
  function getTests() {
    try { return JSON.parse(localStorage.getItem(KEYS.TESTS)) || []; }
    catch { return []; }
  }

  function saveTests(tests) {
    localStorage.setItem(KEYS.TESTS, JSON.stringify(tests));
  }

  function addTest(title) {
    const tests = getTests();
    tests.push({
      id:      `tp_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
      title:   title,
      status:  'pending',
      notes:   '',
      created: Date.now(),
    });
    saveTests(tests);
  }

  function removeTest(id) {
    saveTests(getTests().filter(t => t.id !== id));
  }

  function markTest(id, status) {
    const tests = getTests();
    const t = tests.find(t => t.id === id);
    if (t) { t.status = status; t.markedAt = Date.now(); }
    saveTests(tests);
  }

  function updateTestNotes(id, notes) {
    const tests = getTests();
    const t = tests.find(t => t.id === id);
    if (t) t.notes = notes;
    saveTests(tests);
  }

  // ──────────────────────────────────────────────
  // Utilities
  // ──────────────────────────────────────────────
  function clearAll() {
    localStorage.removeItem(KEYS.SESSION);
    localStorage.removeItem(KEYS.TESTS);
    sessionStorage.removeItem('tp_cursor');
  }

  function statusLabel(status) {
    const map = { pass: 'Pass', fail: 'Fail', skip: 'Skip', pending: '—' };
    return map[status] || '—';
  }

  // Toast notification
  let _toastTimer = null;
  function toast(msg) {
    let el = document.getElementById('tp-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'tp-toast';
      el.className = 'tp-toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('tp-toast--show');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => el.classList.remove('tp-toast--show'), 2400);
  }

  // ──────────────────────────────────────────────
  // Default test cases (first visit)
  // ──────────────────────────────────────────────
  (function seedDefaults() {
    if (getTests().length === 0) {
      const defaults = [
        'App launches without crash',
        'Login with valid credentials',
        'Login with invalid credentials shows error',
        'Home screen loads within 2 seconds',
        'Navigation between all tabs works',
        'Form validation highlights required fields',
        'Offline mode shows appropriate message',
        'Logout clears session data',
      ];
      defaults.forEach(addTest);
    }
  })();

  return { getSession, saveSession, getTests, addTest, removeTest, markTest, updateTestNotes, clearAll, statusLabel, toast };
})();
