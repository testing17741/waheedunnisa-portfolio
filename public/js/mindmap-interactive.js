/**
 * Interactive Mind Map & Pedagogy Framework Demonstrator
 * Visualizes the 3-stage experiential learning framework for STEM microbiology education.
 */

(function () {
  'use strict';

  const stagesData = [
    {
      id: 'stage-1',
      stepNum: 'PHASE 01',
      title: 'Pre-Laboratory Conceptual Mapping',
      shortDesc: 'Replaces rote recipe-following with pre-bench visual diagrams connecting metabolic pathways to bench steps.',
      badge: 'Pre-Bench Activity',
      metric: '42% decrease in preliminary preparation time',
      focusArea: 'Cognitive Chunking & Schema Activation',
      details: [
        'Students complete structured mind maps mapping the biological mechanism (e.g. bacterial cell wall synthesis) to the staining reagents (crystal violet, Gram\'s iodine, decolorizer, safranin).',
        'Pre-lab inquiry questions target common conceptual pitfalls before handling live bacterial cultures.',
        'Eliminates passive bench observation by priming students with a clear mental model of the expected bacterial physiology.'
      ]
    },
    {
      id: 'stage-2',
      stepNum: 'PHASE 02',
      title: 'Active Bench Inquiry & Aseptic Execution',
      shortDesc: 'Students apply visual decision trees during live experiments to troubleshoot unexpected culture anomalies.',
      badge: 'Bench Implementation',
      metric: '38% reduction in procedural bench contamination',
      focusArea: 'Hands-on Procedural Mastery',
      details: [
        'Laboratory manuals provide branch-point decision trees rather than linear text paragraphs.',
        'When observing atypical colony morphologies or contamination, students trace phenotypic keys to isolate causes.',
        'Continuous formative validation by peers and teaching assistants reinforces proper aseptic handling.'
      ]
    },
    {
      id: 'stage-3',
      stepNum: 'PHASE 03',
      title: 'Formative Synthesis & Long-Term Recall',
      shortDesc: 'Concept reinforcement through interactive micro-quizzes and structured reflection worksheets.',
      badge: 'Evaluation & Retention',
      metric: 'Statistically significant gain in 60-day conceptual retention',
      focusArea: 'Assessment & Curriculum Impact',
      details: [
        'Post-lab exit evaluations assess analytical reasoning rather than mechanical memorization of procedures.',
        'Visual mind map revision loops allow students to integrate observations into broader syllabus topics (e.g., environmental waste ensilage).',
        'Directly incorporated into the published B.Sc. Semester II practical handbook (My Rays Publishing House).'
      ]
    }
  ];

  function initMindMap() {
    const stageCards = document.querySelectorAll('.stage-card');
    const detailPanel = document.getElementById('mindmap-detail-panel');
    if (!stageCards.length || !detailPanel) return;

    function renderStage(index) {
      const data = stagesData[index];
      if (!data) return;

      stageCards.forEach((c, i) => {
        if (i === index) {
          c.classList.add('active');
          c.setAttribute('aria-selected', 'true');
        } else {
          c.classList.remove('active');
          c.setAttribute('aria-selected', 'false');
        }
      });

      detailPanel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
          <div>
            <span class="badge badge-accent" style="margin-bottom: 0.35rem;">${escapeHtml(data.badge)}</span>
            <h4 class="mindmap-detail-title" style="margin-bottom: 0.25rem;">${escapeHtml(data.title)}</h4>
            <span style="font-size: var(--text-xs); color: var(--color-text-muted); font-weight: 500;">
              Focus: ${escapeHtml(data.focusArea)}
            </span>
          </div>
          <div style="text-align: right; background: var(--color-primary-subtle); padding: 0.35rem 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--color-border);">
            <div style="font-size: var(--text-xs); color: var(--color-primary); font-weight: 700;">Measured Outcome</div>
            <div style="font-size: var(--text-xs); font-weight: 600; color: var(--color-text);">${escapeHtml(data.metric)}</div>
          </div>
        </div>
        <ul style="list-style: square; padding-left: 1.25rem; font-size: var(--text-sm); color: var(--color-text-muted); line-height: 1.6; display: flex; flex-direction: column; gap: 0.35rem;">
          ${data.details.map(d => `<li>${escapeHtml(d)}</li>`).join('')}
        </ul>
      `;
    }

    stageCards.forEach((card, idx) => {
      card.addEventListener('click', () => renderStage(idx));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          renderStage(idx);
        }
      });
    });

    // Default select first stage
    renderStage(0);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  document.addEventListener('DOMContentLoaded', initMindMap);
})();
