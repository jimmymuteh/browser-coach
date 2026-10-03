// === 1. PREDICTION ENGINE ===
const predictGoal = (sleep, water, steps) => {
  const sleepScore = Math.min(sleep / 8.0, 1.0) * 35;   // 35% weight
  const waterScore = Math.min(water / 10.0, 1.0) * 25;  // 25% weight
  const stepsScore = Math.min(steps / 12000, 1.0) * 40; // 40% weight

  const totalScore  = sleepScore + waterScore + stepsScore;
  const hitGoal     = totalScore >= 60;

  const distance    = Math.abs(totalScore - 60);
  const confidence  = Math.min(0.50 + distance * 0.012, 0.95);

  return { hitGoal, confidence, score: Math.round(totalScore) };
};

// === 2. COACHING MATRIX ===
const COACHING = {
  "111": ["Strong inputs, strong output. Baseline is locked in.", "Keep this pattern consistent."],
  "110": ["Hit the goal despite low water. Sleep is the primary driver.", "Close the hydration gap tomorrow."],
  "101": ["Water carried today despite low sleep.", "Fix sleep tonight. Low sleep has hidden costs."],
  "100": ["Goal hit through willpower, not system. Willpower runs out.", "Fix the foundation: sleep first, water second."],
  "011": ["Inputs were solid but the goal was missed.", "Audit your schedule. Do not cut sleep or water."],
  "010": ["Sleep is solid but hydration is low, and the goal was missed.", "Add two glasses of water tomorrow."],
  "001": ["Low sleep is the lead variable. Water is fine.", "Get to bed 45 minutes earlier tonight."],
  "000": ["Both inputs are below threshold and the goal was missed.", "Reset tonight: 8 hours sleep minimum, 10 glasses water."],
};

const getCoaching = (sleep, water, hitGoal) => {
  const key = `${hitGoal ? 1 : 0}${sleep >= 7 ? 1 : 0}${water >= 8 ? 1 : 0}`;
  return COACHING[key].join(" ");
};

// === 3. SESSION HISTORY LOG ===
const sessionLog = [];

const logEntry = (sleep, water, steps, hitGoal, confidence, score) => {
  const entry = {
    id: sessionLog.length + 1,
    time: new Date().toLocaleTimeString(),
    sleep, water, steps, hitGoal, confidence, score
  };
  sessionLog.push(entry);
  return entry;
};

const renderHistory = () => {
  const tableEl = document.querySelector('#historyTable');
  if (!tableEl) return;

  if (!sessionLog.length) {
    tableEl.innerHTML = '<tr><td colspan="6" style="color:#8b949e;text-align:center;padding:1rem;">No entries yet.</td></tr>';
    return;
  }
  tableEl.innerHTML = sessionLog.map(e => {
    const outcomeColor = e.hitGoal ? "#4ecca3" : "#f5a623";
    const outcome = e.hitGoal ? "HIT" : "MISS";
    return `<tr>
      <td style="color:#8b949e;font-size:0.8rem;">${e.time}</td>
      <td>${e.sleep}h</td>
      <td>${e.water} gl</td>
      <td>${e.steps.toLocaleString()}</td>
      <td style="color:${outcomeColor};font-weight:700;">${outcome}</td>
      <td style="color:#a0a0b0;">${(e.confidence * 100).toFixed(0)}%</td>
    </tr>`;
  }).join('');
};

// === 4. FORM EVENT LISTENERS ===
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#coachForm');
  const display = document.querySelector('#coachDisplay');

  if (form && display) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const sleep = parseFloat(document.querySelector('#inSleep').value);
      const water = parseInt(document.querySelector('#inWater').value);
      const steps = parseInt(document.querySelector('#inSteps').value);

      if (isNaN(sleep) || isNaN(water) || isNaN(steps)) {
        display.className = 'ai-response idle';
        display.innerHTML = '<div class="label-sm">Error</div><div class="coaching">All three fields are required.</div>';
        return;
      }

      const result = predictGoal(sleep, water, steps);
      const coaching = getCoaching(sleep, water, result.hitGoal);
      const outcome = result.hitGoal ? "HIT GOAL" : "MISS GOAL";
      const confPct = (result.confidence * 100).toFixed(0);

      // Log entry into history
      logEntry(sleep, water, steps, result.hitGoal, result.confidence, result.score);
      renderHistory();

      // Display UI prediction output
      display.className = `ai-response ${result.hitGoal ? "hit" : "miss"}`;
      display.innerHTML = `
        <div class="label-sm">Prediction</div>
        <div class="prediction">${outcome} (${confPct}% confidence • score: ${result.score}/100)</div>
        <div class="label-sm" style="margin-top:0.8rem;">Coaching</div>
        <div class="coaching">${coaching}</div>
      `;
    });
  }

  renderHistory();
});
