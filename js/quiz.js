// Bubbles Play & Learn Co. - Parent Milestone & Toy Recommendation Quiz

import { CURATED_BOXES, generateToySvg, renderProductMedia } from './products.js';
import { cartManager } from './cart.js';

export class ParentQuiz {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.step = 0;
    this.answers = {
      age: '2-3y',
      primaryGoal: 'motor',
      material: 'wood',
      screenGoal: 'screen-free'
    };
  }

  init() {
    if (!this.container) return;
    this.render();
  }

  nextStep() {
    this.step++;
    this.render();
  }

  prevStep() {
    if (this.step > 0) this.step--;
    this.render();
  }

  restart() {
    this.step = 0;
    this.render();
  }

  selectOption(key, value) {
    this.answers[key] = value;
    this.nextStep();
  }

  getRecommendedBox() {
    // Match based on age
    let box = CURATED_BOXES.find(b => b.ageRange === this.answers.age);
    if (!box) box = CURATED_BOXES[2]; // Default 2-3y
    return box;
  }

  render() {
    if (!this.container) return;

    if (this.step === 0) {
      this.container.innerHTML = `
        <div class="quiz-card welcome-card">
          <div class="quiz-badge">Montessori Play Guide</div>
          <h2>Find the Perfect Play Box for Your Child's Milestones</h2>
          <p>Answer 4 quick questions about your child's age, habits, and developmental goals to receive a personalized learning roadmap and curated box recommendation.</p>
          <div class="quiz-meta-stats">
            <span><i class="fas fa-clock"></i> Takes 60 seconds</span>
            <span><i class="fas fa-check-double"></i> Pediatrician & Educator Verified</span>
          </div>
          <button class="btn btn-primary btn-lg" onclick="window.parentQuiz.nextStep()">
            Start Milestone Quiz <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      `;
      return;
    }

    if (this.step === 1) {
      this.container.innerHTML = `
        <div class="quiz-card">
          <div class="quiz-step-tracker">Question 1 of 4</div>
          <h3 class="quiz-question">How old is your child right now?</h3>
          <div class="quiz-options-grid">
            <button class="quiz-option-btn ${this.answers.age === '0-12m' ? 'selected' : ''}" onclick="window.parentQuiz.selectOption('age', '0-12m')">
              <span class="quiz-opt-icon">🍼</span>
              <div class="quiz-opt-text">
                <strong>0–12 Months</strong>
                <small>Sensory, grasping, tummy time & high contrast</small>
              </div>
            </button>
            <button class="quiz-option-btn ${this.answers.age === '1-2y' ? 'selected' : ''}" onclick="window.parentQuiz.selectOption('age', '1-2y')">
              <span class="quiz-opt-icon">🌱</span>
              <div class="quiz-opt-text">
                <strong>1–2 Years</strong>
                <small>Walking, stacking, cause-and-effect exploration</small>
              </div>
            </button>
            <button class="quiz-option-btn ${this.answers.age === '2-3y' ? 'selected' : ''}" onclick="window.parentQuiz.selectOption('age', '2-3y')">
              <span class="quiz-opt-icon">🧩</span>
              <div class="quiz-opt-text">
                <strong>2–3 Years</strong>
                <small>Puzzles, sorting, counting, language expansion</small>
              </div>
            </button>
            <button class="quiz-option-btn ${this.answers.age === '3-4y' ? 'selected' : ''}" onclick="window.parentQuiz.selectOption('age', '3-4y')">
              <span class="quiz-opt-icon">🚀</span>
              <div class="quiz-opt-text">
                <strong>3–4 Years</strong>
                <small>STEAM construction, pre-math, curiosity & stories</small>
              </div>
            </button>
            <button class="quiz-option-btn ${this.answers.age === '4-5y' ? 'selected' : ''}" onclick="window.parentQuiz.selectOption('age', '4-5y')">
              <span class="quiz-opt-icon">🎓</span>
              <div class="quiz-opt-text">
                <strong>4–5 Years</strong>
                <small>Preschool ready, alphabet phonics, tripod handwriting</small>
              </div>
            </button>
          </div>
        </div>
      `;
      return;
    }

    if (this.step === 2) {
      this.container.innerHTML = `
        <div class="quiz-card">
          <div class="quiz-step-tracker">Question 2 of 4</div>
          <h3 class="quiz-question">What is your primary developmental focus right now?</h3>
          <div class="quiz-options-grid">
            <button class="quiz-option-btn" onclick="window.parentQuiz.selectOption('primaryGoal', 'sensory')">
              <span class="quiz-opt-icon">💆</span>
              <div class="quiz-opt-text">
                <strong>Calm Sensory Regulation</strong>
                <small>Soothing overstimulation, tactile focus & gentle touch</small>
              </div>
            </button>
            <button class="quiz-option-btn" onclick="window.parentQuiz.selectOption('primaryGoal', 'motor')">
              <span class="quiz-opt-icon">✍️</span>
              <div class="quiz-opt-text">
                <strong>Fine Motor & Hand Strength</strong>
                <small>Pincer grasp, finger isolation, tripod writing readiness</small>
              </div>
            </button>
            <button class="quiz-option-btn" onclick="window.parentQuiz.selectOption('primaryGoal', 'language')">
              <span class="quiz-opt-icon">🗣️</span>
              <div class="quiz-opt-text">
                <strong>Speech & Language Growth</strong>
                <small>Expanding vocabulary, phonics, naming & storytelling</small>
              </div>
            </button>
            <button class="quiz-option-btn" onclick="window.parentQuiz.selectOption('primaryGoal', 'steam')">
              <span class="quiz-opt-icon">📐</span>
              <div class="quiz-opt-text">
                <strong>Logic, Counting & Problem Solving</strong>
                <small>Number sense, puzzle building & spatial reasoning</small>
              </div>
            </button>
          </div>
          <button class="btn btn-link mt-3" onclick="window.parentQuiz.prevStep()">&larr; Back</button>
        </div>
      `;
      return;
    }

    if (this.step === 3) {
      this.container.innerHTML = `
        <div class="quiz-card">
          <div class="quiz-step-tracker">Question 3 of 4</div>
          <h3 class="quiz-question">What toy materials do you and your child prefer?</h3>
          <div class="quiz-options-grid">
            <button class="quiz-option-btn" onclick="window.parentQuiz.selectOption('material', 'wood')">
              <span class="quiz-opt-icon">🌳</span>
              <div class="quiz-opt-text">
                <strong>Handcrafted Natural Wood</strong>
                <small>Local Sri Lankan sustainable rubberwood & non-toxic oils</small>
              </div>
            </button>
            <button class="quiz-option-btn" onclick="window.parentQuiz.selectOption('material', 'montessori')">
              <span class="quiz-opt-icon">🏛️</span>
              <div class="quiz-opt-text">
                <strong>Authentic Montessori Materials</strong>
                <small>Self-correcting cylinders, sandpaper letters & counters</small>
              </div>
            </button>
            <button class="quiz-option-btn" onclick="window.parentQuiz.selectOption('material', 'steam')">
              <span class="quiz-opt-icon">🧲</span>
              <div class="quiz-opt-text">
                <strong>STEAM Magnetic & Construction</strong>
                <small>Vibrant magnetic tiles, tracks, and tactile mechanisms</small>
              </div>
            </button>
            <button class="quiz-option-btn" onclick="window.parentQuiz.selectOption('material', 'blend')">
              <span class="quiz-opt-icon">🌈</span>
              <div class="quiz-opt-text">
                <strong>Balanced Multi-Sensory Mix</strong>
                <small>Combination of wood, soft textiles, clay, and art paints</small>
              </div>
            </button>
          </div>
          <button class="btn btn-link mt-3" onclick="window.parentQuiz.prevStep()">&larr; Back</button>
        </div>
      `;
      return;
    }

    if (this.step === 4) {
      this.container.innerHTML = `
        <div class="quiz-card">
          <div class="quiz-step-tracker">Question 4 of 4</div>
          <h3 class="quiz-question">What is your playtime philosophy at home?</h3>
          <div class="quiz-options-grid">
            <button class="quiz-option-btn" onclick="window.parentQuiz.selectOption('screenGoal', 'screen-free')">
              <span class="quiz-opt-icon">🌿</span>
              <div class="quiz-opt-text">
                <strong>100% Screen-Free Independence</strong>
                <small>Encouraging deep focus, curiosity & calm solo play</small>
              </div>
            </button>
            <button class="quiz-option-btn" onclick="window.parentQuiz.selectOption('screenGoal', 'bonding')">
              <span class="quiz-opt-icon">👨‍👩‍👧</span>
              <div class="quiz-opt-text">
                <strong>Interactive Parent-Child Bonding</strong>
                <small>Guided activities, reading aloud & cooperative games</small>
              </div>
            </button>
            <button class="quiz-option-btn" onclick="window.parentQuiz.selectOption('screenGoal', 'school')">
              <span class="quiz-opt-icon">🎒</span>
              <div class="quiz-opt-text">
                <strong>Preschool Readiness</strong>
                <small>Focusing on confidence, pencil grip & school numeracy</small>
              </div>
            </button>
          </div>
          <button class="btn btn-link mt-3" onclick="window.parentQuiz.prevStep()">&larr; Back</button>
        </div>
      `;
      return;
    }

    // Results Step (Step 5)
    const box = this.getRecommendedBox();
    this.container.innerHTML = `
      <div class="quiz-results-card">
        <div class="match-badge"><i class="fas fa-magic"></i> 98% Developmental Match for Your Child!</div>
        <h2 class="result-title">We Recommend: ${box.title}</h2>
        <p class="result-tagline">${box.tagline}</p>

        <div class="result-details-split">
          <div class="result-visual">
            ${renderProductMedia(box)}
            <div class="price-chip">
              <span class="box-p">LKR ${box.price.toLocaleString()}</span>
              <span class="box-strike">LKR ${box.originalPrice.toLocaleString()}</span>
            </div>
            <div class="savings-tag">${box.savings}</div>
          </div>

          <div class="result-content">
            <h4>Why this box is perfect for your child's stage:</h4>
            <p>${box.description}</p>

            <h5>Key Milestones Targeted:</h5>
            <div class="milestone-badges-list">
              ${box.milestones.map(m => `<span class="m-badge"><i class="fas fa-check"></i> ${m}</span>`).join('')}
            </div>

            <h5>Curated Toys Inside this Box:</h5>
            <ul class="includes-checklist">
              ${box.includes.map(inc => `<li><i class="fas fa-star"></i> ${inc}</li>`).join('')}
            </ul>

            <div class="result-cta-group">
              <button class="btn btn-primary btn-lg" onclick="window.cartManager.addItem(window.parentQuiz.getRecommendedBox(), 1); window.openCartDrawer();">
                <i class="fas fa-shopping-basket"></i> Add Recommended Box to Cart (LKR ${box.price.toLocaleString()})
              </button>
              <button class="btn btn-outline" onclick="window.parentQuiz.restart()">
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
