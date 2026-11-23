/**
 * app.js
 * 메인 인터랙티브 UI 제어, 이벤트 바인딩, 학습 모드 및 DIY 가이드 컨트롤러
 */

import { PolyhedronSimulator } from './simulator.js';
import { PRINT_TEMPLATES } from './print.js';

class App {
  constructor() {
    this.simulator = null;
    this.isPlaying = false;
    this.playSpeed = 0.008; // 기본 재생 속도
    this.animId = null;
    this.hasTriggeredConfetti = false;

    // 퀴즈 데이터
    this.quizzes = {
      cube: {
        question: '정육면체 전개도에서 "밑면 (1번 면)"과 마주보는(평행한) 면은 몇 번 면일까요?',
        options: ['2번 (앞면)', '3번 (뒷면)', '6번 (윗면)', '4번 (왼쪽면)'],
        correct: 2,
        explain: '정답입니다! 6번(윗면)은 밑면과 마주보며 서로 절대 만나지 않는 평행 관계를 이룹니다.'
      },
      prism: {
        question: '삼각기둥 전개도를 접을 때 서로 마주보고 평행을 이루는 면의 모양은 무엇일까요?',
        options: ['정사각형 2개', '직사각형 3개', '합동인 삼각형 2개', '사다리꼴 2개'],
        correct: 2,
        explain: '정답입니다! 삼각기둥은 위/아래 2개의 합동인 삼각형 밑면이 서로 평행합니다.'
      },
      cylinder: {
        question: '밑면 반지름이 2.5cm인 원기둥 전개도에서, 옆면 직사각형의 이론상 가로 길이는 약 얼마일까요?',
        options: ['12.5cm', '15.71cm (2 × π × 2.5)', '18.0cm', '9.0cm'],
        correct: 1,
        explain: '정답입니다! 옆면 직사각형 가로는 밑면 원의 둘레(2πr ≈ 15.71cm)와 정확히 일치해야 합니다.'
      },
      dome: {
        question: '방사형 별 모양 전개도에서 삼각형 날개들의 꼭짓점들이 실을 당기면 어디로 모일까요?',
        options: ['바닥 각 모서리', '중앙 상단 한 점 (정점/Apex)', '바깥쪽 사방으로 펼쳐짐', '서로 엇갈림'],
        correct: 1,
        explain: '정답입니다! 수직 당김줄에 의해 모든 삼각형 날개의 꼭짓점이 상단 한 점으로 모여 3D 돔을 형성합니다.'
      }
    };

    this.init();
  }

  init() {
    // 1. 3D 시뮬레이터 초기화
    this.simulator = new PolyhedronSimulator('webgl-container');

    // 2. DOM 요소 캐싱
    this.pullSlider = document.getElementById('pull-slider');
    this.pullValueDisplay = document.getElementById('pull-value-display');
    this.playPauseBtn = document.getElementById('btn-play-pause');
    this.resetBtn = document.getElementById('btn-reset');
    this.speedBtn = document.getElementById('btn-speed');

    // 3. 이벤트 바인딩
    this.bindSimulatorControls();
    this.bindShapeTabs();
    this.bindCameraViews();
    this.bindCoachingModes();
    this.bindPrintModal();
    this.bindChecklist();

    // 초기 상태 반영
    this.updateShapeInfo('cube');
  }

  bindSimulatorControls() {
    // 슬라이더 조작
    this.pullSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      this.updateProgress(val / 100);
      if (this.isPlaying) this.togglePlay(false);
    });

    // 자동 재생 / 정지
    this.playPauseBtn.addEventListener('click', () => {
      this.togglePlay(!this.isPlaying);
    });

    // 처음으로 리셋
    this.resetBtn.addEventListener('click', () => {
      this.togglePlay(false);
      this.updateProgress(0);
      this.hasTriggeredConfetti = false;
    });

    // 배속 조절 (1x <-> 0.5x 슬로우모션)
    let isSlow = false;
    this.speedBtn.addEventListener('click', () => {
      isSlow = !isSlow;
      this.playSpeed = isSlow ? 0.003 : 0.008;
      this.speedBtn.textContent = isSlow ? '0.5x 슬로우' : '1.0x 표준';
      this.speedBtn.className = isSlow 
        ? 'px-3 py-1.5 text-xs font-semibold bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition' 
        : 'px-3 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition';
    });

    // PULL 당김 탭 제스처 (화면 내 인터랙티브 손잡이 버튼 클릭/드래그 지원)
    const pullInteractiveBtn = document.getElementById('btn-pull-trigger');
    if (pullInteractiveBtn) {
      pullInteractiveBtn.addEventListener('click', () => {
        let cur = parseFloat(this.pullSlider.value);
        cur = cur >= 100 ? 0 : Math.min(100, cur + 25);
        this.updateProgress(cur / 100);
      });
    }
  }

  updateProgress(progress) {
    this.pullSlider.value = Math.round(progress * 100);
    this.pullValueDisplay.textContent = `${Math.round(progress * 100)}%`;
    this.simulator.setProgress(progress);

    // 100% 완결 시 축하 팡파르 (최초 1회)
    if (progress >= 0.99 && !this.hasTriggeredConfetti) {
      this.triggerConfetti();
      this.hasTriggeredConfetti = true;
    } else if (progress < 0.9) {
      this.hasTriggeredConfetti = false;
    }
  }

  togglePlay(play) {
    this.isPlaying = play;
    this.playPauseBtn.innerHTML = this.isPlaying
      ? `<svg class="w-4 h-4 mr-1 inline" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>일시정지`
      : `<svg class="w-4 h-4 mr-1 inline" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>실 당기기 자동재생`;

    if (this.isPlaying) {
      const loop = () => {
        if (!this.isPlaying) return;
        let cur = parseFloat(this.pullSlider.value) / 100;
        cur += this.playSpeed;
        if (cur > 1) {
          cur = 1;
          this.updateProgress(cur);
          this.togglePlay(false);
          return;
        }
        this.updateProgress(cur);
        this.animId = requestAnimationFrame(loop);
      };
      this.animId = requestAnimationFrame(loop);
    } else {
      if (this.animId) cancelAnimationFrame(this.animId);
    }
  }

  triggerConfetti() {
    if (typeof window.confetti === 'function') {
      window.confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  bindShapeTabs() {
    const tabs = document.querySelectorAll('.shape-tab-btn');
    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const shapeId = btn.dataset.shape;
        tabs.forEach(b => {
          b.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
          b.classList.add('bg-white', 'text-slate-700', 'hover:bg-slate-50');
        });
        btn.classList.remove('bg-white', 'text-slate-700', 'hover:bg-slate-50');
        btn.classList.add('bg-blue-600', 'text-white', 'shadow-md');

        this.updateProgress(0);
        this.updateShapeInfo(shapeId);
        this.loadQuiz(shapeId);
      });
    });
  }

  updateShapeInfo(shapeId) {
    const meta = this.simulator.loadShape(shapeId);
    if (!meta) return;

    document.getElementById('hud-shape-title').textContent = meta.name;
    document.getElementById('hud-grade-badge').textContent = meta.grade;
    document.getElementById('hud-desc').textContent = meta.description;

    // 수학 정보 카드
    document.getElementById('hud-faces').textContent = meta.faces;
    document.getElementById('hud-edges').textContent = meta.edges;
    document.getElementById('hud-vertices').textContent = meta.vertices;
    document.getElementById('hud-euler').textContent = meta.euler;

    // 마주보는 면 리스트
    const pairsContainer = document.getElementById('hud-opposing-pairs');
    if (pairsContainer) {
      if (meta.opposingPairs && meta.opposingPairs.length > 0) {
        pairsContainer.innerHTML = meta.opposingPairs.map(p => `
          <div class="flex items-center justify-between text-xs py-1 px-2.5 rounded bg-slate-50 border border-slate-200">
            <span class="font-medium text-slate-700">${p.pair[0]} ↔ ${p.pair[1]}</span>
            <span class="w-3.5 h-3.5 rounded-full border border-slate-300" style="background-color: ${p.color}"></span>
          </div>
        `).join('');
        document.getElementById('hud-opposing-section').classList.remove('hidden');
      } else {
        document.getElementById('hud-opposing-section').classList.add('hidden');
      }
    }

    // 원기둥 전용 수치 증명 위젯 표시 여부
    const cylWidget = document.getElementById('cylinder-proof-widget');
    if (cylWidget) {
      if (shapeId === 'cylinder') {
        cylWidget.classList.remove('hidden');
      } else {
        cylWidget.classList.add('hidden');
      }
    }
  }

  bindCameraViews() {
    document.getElementById('btn-view-iso').addEventListener('click', () => {
      this.simulator.setCameraView('iso');
    });
    document.getElementById('btn-view-top').addEventListener('click', () => {
      this.simulator.setCameraView('top');
    });
    document.getElementById('btn-view-front').addEventListener('click', () => {
      this.simulator.setCameraView('front');
    });
    document.getElementById('btn-toggle-wireframe').addEventListener('click', (e) => {
      const isWire = this.simulator.toggleWireframe();
      e.currentTarget.classList.toggle('bg-blue-100', isWire);
      e.currentTarget.classList.toggle('text-blue-700', isWire);
    });
  }

  bindCoachingModes() {
    // 4단계 코칭 서브 탭
    const modeTabs = document.querySelectorAll('.coaching-tab-btn');
    const modePanels = document.querySelectorAll('.coaching-panel');

    modeTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        modeTabs.forEach(b => {
          b.classList.remove('border-blue-600', 'text-blue-600', 'font-bold');
          b.classList.add('border-transparent', 'text-slate-500');
        });
        btn.classList.add('border-blue-600', 'text-blue-600', 'font-bold');
        btn.classList.remove('border-transparent', 'text-slate-500');

        modePanels.forEach(p => p.classList.add('hidden'));
        const panel = document.getElementById(`panel-${target}`);
        if (panel) panel.classList.remove('hidden');
      });
    });

    // 1단계: 퀴즈 로드
    this.loadQuiz(this.simulator.currentShapeId);

    // 2단계: 관찰 슬로우 스텝 버튼들
    const stepBtns = document.querySelectorAll('.observe-step-btn');
    stepBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const step = parseFloat(btn.dataset.step);
        this.updateProgress(step);
      });
    });

    // 4단계: 창작 색칠 팔레트
    const colorSwatches = document.querySelectorAll('.color-swatch');
    colorSwatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        colorSwatches.forEach(s => s.classList.remove('ring-4', 'ring-blue-500'));
        swatch.classList.add('ring-4', 'ring-blue-500');
        const color = swatch.dataset.color;
        this.simulator.setPaintColor(color);
      });
    });
  }

  loadQuiz(shapeId) {
    const quiz = this.quizzes[shapeId] || this.quizzes.cube;
    const qContainer = document.getElementById('quiz-container');
    if (!qContainer) return;

    qContainer.innerHTML = `
      <p class="text-sm font-semibold text-slate-800 mb-3">${quiz.question}</p>
      <div class="space-y-2">
        ${quiz.options.map((opt, idx) => `
          <button class="quiz-opt-btn w-full text-left px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-blue-400 transition" data-idx="${idx}">
            ${idx + 1}. ${opt}
          </button>
        `).join('')}
      </div>
      <div id="quiz-feedback" class="mt-3 hidden p-3 rounded-lg text-xs leading-relaxed"></div>
    `;

    const optBtns = qContainer.querySelectorAll('.quiz-opt-btn');
    const feedback = qContainer.querySelector('#quiz-feedback');

    optBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const chosen = parseInt(btn.dataset.idx, 10);
        feedback.classList.remove('hidden');
        if (chosen === quiz.correct) {
          btn.classList.add('bg-emerald-100', 'border-emerald-500', 'text-emerald-800');
          feedback.className = 'mt-3 p-3 rounded-lg text-xs leading-relaxed bg-emerald-50 text-emerald-800 border border-emerald-200';
          feedback.innerHTML = `🎉 <strong>정답입니다!</strong> ${quiz.explain}`;
          this.triggerConfetti();
        } else {
          btn.classList.add('bg-rose-100', 'border-rose-400', 'text-rose-800');
          feedback.className = 'mt-3 p-3 rounded-lg text-xs leading-relaxed bg-rose-50 text-rose-800 border border-rose-200';
          feedback.innerHTML = `💡 <strong>아쉬워요!</strong> 실을 직접 당겨 3D로 완성해보며 정답을 확인해보세요.`;
        }
      });
    });
  }

  bindPrintModal() {
    const modal = document.getElementById('print-modal');
    const openBtn = document.getElementById('btn-open-print');
    const closeBtn = document.getElementById('btn-close-print');
    const executePrintBtn = document.getElementById('btn-execute-print');
    const previewContainer = document.getElementById('print-preview-container');

    if (!modal || !openBtn) return;

    openBtn.addEventListener('click', () => {
      const shapeId = this.simulator.currentShapeId;
      const tpl = PRINT_TEMPLATES[shapeId] || PRINT_TEMPLATES.cube;

      document.getElementById('print-modal-title').textContent = tpl.title;
      document.getElementById('print-modal-notice').textContent = tpl.scaleNotice;
      previewContainer.innerHTML = tpl.getSVG();
      modal.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    executePrintBtn.addEventListener('click', () => {
      window.print();
    });
  }

  bindChecklist() {
    const checkboxes = document.querySelectorAll('.diy-checklist-item');
    checkboxes.forEach((cb, idx) => {
      const saved = localStorage.getItem(`diy-cb-${idx}`);
      if (saved === 'true') cb.checked = true;

      cb.addEventListener('change', () => {
        localStorage.setItem(`diy-cb-${idx}`, cb.checked);
      });
    });
  }
}

// 앱 실행
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
