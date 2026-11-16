/**
 * 기획예산처 (Ministry of Planning and Budget) 대국민 포털 인터랙티브 스크립트
 */

document.addEventListener("DOMContentLoaded", () => {
  initAccessibility();
  initTicker();
  initCoreMissions();
  initBudgetCycle();
  initBudgetChart();
  initTaxCalculator();
  initCitizenProposal();
  initGlossary();
  initFAQ();
  initQuiz();
  initMobileMenu();
});

/* --------------------------------------------------------------------------
 * 1. 접근성 도구 (글자 크기 & 고대비 모드)
 * -------------------------------------------------------------------------- */
function initAccessibility() {
  const fontSizes = ["font-sm", "font-md", "font-lg", "font-xl"];
  let currentFontIdx = 1; // 기본 font-md

  const btnFontDec = document.getElementById("btn-font-dec");
  const btnFontReset = document.getElementById("btn-font-reset");
  const btnFontInc = document.getElementById("btn-font-inc");
  const btnContrast = document.getElementById("btn-contrast-toggle");
  const fontIndicator = document.getElementById("font-size-indicator");

  function updateFontSize() {
    document.body.classList.remove(...fontSizes);
    document.body.classList.add(fontSizes[currentFontIdx]);
    if (fontIndicator) {
      const percentages = ["90%", "100%", "115%", "130%"];
      fontIndicator.textContent = percentages[currentFontIdx];
    }
  }

  if (btnFontDec) {
    btnFontDec.addEventListener("click", () => {
      if (currentFontIdx > 0) {
        currentFontIdx--;
        updateFontSize();
      }
    });
  }

  if (btnFontReset) {
    btnFontReset.addEventListener("click", () => {
      currentFontIdx = 1;
      updateFontSize();
    });
  }

  if (btnFontInc) {
    btnFontInc.addEventListener("click", () => {
      if (currentFontIdx < fontSizes.length - 1) {
        currentFontIdx++;
        updateFontSize();
      }
    });
  }

  if (btnContrast) {
    btnContrast.addEventListener("click", () => {
      document.body.classList.toggle("high-contrast");
      const isHigh = document.body.classList.contains("high-contrast");
      btnContrast.setAttribute("aria-pressed", isHigh ? "true" : "false");
      btnContrast.innerHTML = isHigh
        ? `<i data-lucide="sun" class="w-4 h-4"></i><span>표준화면</span>`
        : `<i data-lucide="eye" class="w-4 h-4"></i><span>고대비</span>`;
      if (window.lucide) lucide.createIcons();
    });
  }
}

/* --------------------------------------------------------------------------
 * 2. 실시간 롤링 뉴스 티커
 * -------------------------------------------------------------------------- */
function initTicker() {
  const tickerEl = document.getElementById("gov-ticker-text");
  if (!tickerEl) return;

  const notices = [
    "📢 2026년도 대한민국 정부 예산안 677.4조 원 확정 편성",
    "💡 국민이 직접 낸 아이디어! 2026 국민참여예산 1,250억 원 반영",
    "🛡️ 나랏돈 낭비 신고 접수 중 (지출 절약 기여 시 최대 6억 원 성과금)",
    "📊 예비타당성조사 4.8조 원 심사 효율화로 불요불급 재정지출 차단",
    "🌱 미래 세대를 위한 지속가능한 재정준칙 법제화 추진"
  ];

  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % notices.length;
    tickerEl.style.opacity = "0";
    setTimeout(() => {
      tickerEl.textContent = notices[idx];
      tickerEl.style.opacity = "1";
    }, 300);
  }, 4000);
}

/* --------------------------------------------------------------------------
 * 3. 5대 핵심 업무 탭 렌더링 및 전환
 * -------------------------------------------------------------------------- */
function initCoreMissions() {
  const tabContainer = document.getElementById("mission-tabs-nav");
  const contentContainer = document.getElementById("mission-tab-content");
  if (!tabContainer || !contentContainer) return;

  // 탭 버튼 생성
  PORTAL_DATA.coreMissions.forEach((mission, i) => {
    const btn = document.createElement("button");
    btn.className = `tab-btn px-5 py-3 rounded-xl font-medium text-sm lg:text-base flex items-center gap-2 border transition-all ${
      i === 0 ? "active bg-blue-50 border-blue-200 text-blue-700" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
    }`;
    btn.innerHTML = `<i data-lucide="${mission.icon}" class="w-4 h-4 text-blue-600"></i> ${mission.title}`;
    btn.addEventListener("click", () => selectMission(mission.id, btn));
    tabContainer.appendChild(btn);
  });

  function selectMission(missionId, activeBtn) {
    document.querySelectorAll(".tab-btn").forEach(b => {
      b.classList.remove("active", "bg-blue-50", "border-blue-200", "text-blue-700");
      b.classList.add("bg-white", "border-slate-200", "text-slate-700");
    });
    activeBtn.classList.add("active", "bg-blue-50", "border-blue-200", "text-blue-700");
    activeBtn.classList.remove("bg-white", "border-slate-200", "text-slate-700");

    const item = PORTAL_DATA.coreMissions.find(m => m.id === missionId);
    if (!item) return;

    contentContainer.innerHTML = `
      <div class="bg-white rounded-2xl p-6 lg:p-8 border border-slate-200 shadow-sm animate-fadeIn">
        <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <i data-lucide="check-circle" class="w-3.5 h-3.5"></i> ${item.badge}
          </span>
          <span class="text-xs text-slate-400 font-mono">기획예산처 공식 업무 영역</span>
        </div>

        <h3 class="text-2xl lg:text-3xl font-extrabold text-slate-900 mb-2">${item.title}</h3>
        <p class="text-base lg:text-lg text-blue-600 font-semibold mb-6">${item.subTitle}</p>

        <!-- 알기 쉬운 일상 비유 박스 -->
        <div class="analogy-box p-4 lg:p-5 rounded-xl mb-6">
          <div class="flex items-start gap-3">
            <div class="p-2 bg-blue-500 text-white rounded-lg shadow-sm shrink-0 mt-0.5">
              <i data-lucide="lightbulb" class="w-5 h-5"></i>
            </div>
            <div>
              <h4 class="text-xs font-bold text-blue-900 tracking-wider uppercase mb-1">쉽게 이해하는 일상 속 비유</h4>
              <p class="text-slate-800 font-medium text-sm lg:text-base leading-relaxed">"${item.analogy}"</p>
            </div>
          </div>
        </div>

        <p class="text-slate-600 mb-6 leading-relaxed text-sm lg:text-base">${item.summary}</p>

        <!-- 세부 업무 내용 그리드 -->
        <h4 class="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <i data-lucide="layers" class="w-4 h-4 text-slate-500"></i> 무엇을 구체적으로 담당하나요?
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          ${item.details.map(d => `
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors">
              <h5 class="font-bold text-slate-900 text-sm mb-1.5">${d.title}</h5>
              <p class="text-xs text-slate-600 leading-relaxed">${d.desc}</p>
            </div>
          `).join("")}
        </div>

        <!-- 국민 체감 혜택 -->
        <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
          <div class="p-2 bg-emerald-600 text-white rounded-lg shrink-0 mt-0.5">
            <i data-lucide="sparkles" class="w-4 h-4"></i>
          </div>
          <div>
            <h4 class="text-xs font-bold text-emerald-900 mb-0.5">일반 국민에게 어떤 혜택으로 돌아오나요?</h4>
            <p class="text-emerald-800 text-sm font-medium leading-relaxed">${item.publicBenefit}</p>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) lucide.createIcons();
  }

  // 초기 로드: 첫 번째 탭 활성화
  const firstBtn = tabContainer.querySelector(".tab-btn");
  if (firstBtn) selectMission(PORTAL_DATA.coreMissions[0].id, firstBtn);
}

/* --------------------------------------------------------------------------
 * 4. 1년 예산 여정 타임라인 렌더링
 * -------------------------------------------------------------------------- */
function initBudgetCycle() {
  const container = document.getElementById("budget-cycle-container");
  if (!container) return;

  container.innerHTML = PORTAL_DATA.budgetCycle.map((cycle, idx) => `
    <div class="relative bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div class="mb-3">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
            ${cycle.step}
          </span>
          <span class="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
            ${cycle.month}
          </span>
        </div>
        <h4 class="font-bold text-slate-900 text-base mb-1">${cycle.title}</h4>
        <div class="text-xs text-slate-500 font-medium mb-3 flex items-center gap-1">
          <i data-lucide="user-check" class="w-3.5 h-3.5 text-slate-400"></i> 주체: <strong class="text-slate-700">${cycle.actor}</strong>
        </div>
        <p class="text-xs text-slate-600 leading-relaxed mb-3">${cycle.desc}</p>
      </div>

      <div class="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-1.5 bg-slate-50 -mx-5 -mb-5 p-3 rounded-b-2xl">
        <i data-lucide="file-check" class="w-4 h-4 text-emerald-600 shrink-0"></i>
        <span class="line-clamp-1 font-medium text-slate-700" title="${cycle.keyOutput}">산출물: ${cycle.keyOutput}</span>
      </div>
    </div>
  `).join("");
}

/* --------------------------------------------------------------------------
 * 5. 한눈에 보는 나라살림 Chart.js 차트 & 세부 탐색
 * -------------------------------------------------------------------------- */
let budgetChart = null;

function initBudgetChart() {
  const canvas = document.getElementById("budgetDonutChart");
  const detailBox = document.getElementById("budget-detail-card");
  if (!canvas || !detailBox) return;

  const labels = PORTAL_DATA.budgetBreakdown.map(b => b.name);
  const dataValues = PORTAL_DATA.budgetBreakdown.map(b => b.amount);
  const colors = PORTAL_DATA.budgetBreakdown.map(b => b.color);

  const ctx = canvas.getContext("2d");
  budgetChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [{
        data: dataValues,
        backgroundColor: colors,
        hoverOffset: 12,
        borderWidth: 2,
        borderColor: "#ffffff"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const item = PORTAL_DATA.budgetBreakdown[context.dataIndex];
              return ` ${item.name}: ${item.amount}조 원 (${item.percentage}%)`;
            }
          }
        }
      },
      onClick: (evt, activeEls) => {
        if (activeEls.length > 0) {
          const index = activeEls[0].index;
          updateBudgetDetail(index);
        }
      }
    }
  });

  // 커스텀 레전드 생성
  const legendContainer = document.getElementById("budget-chart-legend");
  if (legendContainer) {
    legendContainer.innerHTML = PORTAL_DATA.budgetBreakdown.map((item, idx) => `
      <button class="legend-btn text-left p-2.5 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center justify-between text-xs lg:text-sm group" data-idx="${idx}">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full shrink-0" style="background-color: ${item.color}"></span>
          <span class="font-medium text-slate-800 group-hover:text-blue-700">${item.name}</span>
        </div>
        <div class="text-right font-mono">
          <strong class="text-slate-900">${item.amount}조</strong>
          <span class="text-slate-400 text-xs ml-1">(${item.percentage}%)</span>
        </div>
      </button>
    `).join("");

    legendContainer.querySelectorAll(".legend-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.idx, 10);
        updateBudgetDetail(idx);
      });
    });
  }

  function updateBudgetDetail(index) {
    const item = PORTAL_DATA.budgetBreakdown[index];
    if (!item) return;

    detailBox.innerHTML = `
      <div class="animate-fadeIn">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2.5">
            <span class="p-2.5 rounded-xl text-white shadow-sm" style="background-color: ${item.color}">
              <i data-lucide="${item.icon}" class="w-5 h-5"></i>
            </span>
            <div>
              <span class="text-xs text-slate-400">분야별 상세 내역</span>
              <h4 class="text-xl font-extrabold text-slate-900">${item.name}</h4>
            </div>
          </div>
          <div class="text-right">
            <div class="text-2xl font-black text-blue-700 font-mono">${item.amount}조 원</div>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">전체 지출의 ${item.percentage}%</span>
          </div>
        </div>

        <p class="text-slate-600 text-sm leading-relaxed mb-4">${item.desc}</p>

        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
          <h5 class="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
            <i data-lucide="check-circle-2" class="w-4 h-4 text-blue-600"></i> 주요 실제 추진 사업 예시
          </h5>
          <p class="text-xs lg:text-sm text-slate-700 leading-relaxed font-medium">
            ${item.example}
          </p>
        </div>

        <div class="text-xs text-slate-400 flex items-center justify-between">
          <span>* 2026 회계연도 정부 총지출(677.4조 원) 기준</span>
          <span class="text-blue-600 font-medium">자료: 기획예산처 열린재정</span>
        </div>
      </div>
    `;

    // 활성 레전드 스타일 표시
    document.querySelectorAll(".legend-btn").forEach(b => {
      b.classList.remove("border-blue-500", "bg-blue-50", "ring-2", "ring-blue-200");
    });
    const targetLegend = document.querySelector(`.legend-btn[data-idx="${index}"]`);
    if (targetLegend) {
      targetLegend.classList.add("border-blue-500", "bg-blue-50", "ring-2", "ring-blue-200");
    }

    if (window.lucide) lucide.createIcons();
  }

  // 기본적으로 첫 번째(보건복지고용) 세부내용 표시
  updateBudgetDetail(0);
}

/* --------------------------------------------------------------------------
 * 6. '내 세금은 어디에 쓰일까?' 영수증 시뮬레이터
 * -------------------------------------------------------------------------- */
function initTaxCalculator() {
  const salaryInput = document.getElementById("salary-input");
  const btnCalculate = document.getElementById("btn-calc-tax");
  const quickBtns = document.querySelectorAll(".quick-salary-btn");
  const receiptContainer = document.getElementById("tax-receipt-output");

  if (!salaryInput || !btnCalculate || !receiptContainer) return;

  // 퀵 버튼 클릭 시 연봉 자동 입력 및 계산
  quickBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const val = btn.dataset.val;
      salaryInput.value = val;
      calculateTaxReceipt(parseInt(val, 10));
    });
  });

  btnCalculate.addEventListener("click", () => {
    const val = parseInt(salaryInput.value, 10);
    if (isNaN(val) || val <= 0) {
      alert("올바른 연봉 금액을 입력해 주세요. (예: 5000)");
      salaryInput.focus();
      return;
    }
    calculateTaxReceipt(val);
  });

  // 근로소득세 간이 계산식 (일반 표준공제 감안한 1인 기준 근사치)
  function estimateAnnualTax(annualSalaryWon) {
    if (annualSalaryWon <= 20000000) return Math.round(annualSalaryWon * 0.015);
    if (annualSalaryWon <= 35000000) return Math.round(annualSalaryWon * 0.032);
    if (annualSalaryWon <= 50000000) return Math.round(annualSalaryWon * 0.048);
    if (annualSalaryWon <= 75000000) return Math.round(annualSalaryWon * 0.075);
    if (annualSalaryWon <= 100000000) return Math.round(annualSalaryWon * 0.115);
    return Math.round(annualSalaryWon * 0.16);
  }

  function calculateTaxReceipt(salaryInManwon) {
    const salaryWon = salaryInManwon * 10000;
    const estimatedTax = estimateAnnualTax(salaryWon);
    const userName = document.getElementById("tax-user-name")?.value.trim() || "대한민국 국민";

    const rows = PORTAL_DATA.budgetBreakdown.map(item => {
      const allocatedWon = Math.round(estimatedTax * (item.percentage / 100));
      return {
        name: item.name,
        percentage: item.percentage,
        amount: allocatedWon,
        icon: item.icon
      };
    });

    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;

    receiptContainer.innerHTML = `
      <div class="tax-receipt p-6 lg:p-8 rounded-xl max-w-md mx-auto animate-fadeIn relative">
        <div class="receipt-jagged-top"></div>

        <div class="text-center pb-4 border-b-2 border-dashed border-slate-300 mb-4">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-2">
            <i data-lucide="receipt" class="w-3.5 h-3.5 text-blue-600"></i> 대한민국 2026 나라살림 영수증
          </div>
          <h4 class="text-xl font-extrabold text-slate-900 tracking-tight">${userName} 님의 소중한 세금</h4>
          <p class="text-xs text-slate-500 mt-1">발급일자: ${dateStr} | 관리기관: 기획예산처</p>
        </div>

        <div class="bg-blue-50 p-3.5 rounded-lg border border-blue-100 mb-5 flex items-center justify-between">
          <div>
            <span class="text-xs text-blue-800 font-medium">연봉 기준 (${salaryInManwon.toLocaleString()}만 원)</span>
            <div class="text-xs text-blue-600">추정 연간 소득세 총액</div>
          </div>
          <div class="text-xl font-black text-blue-900 font-mono">
            ${estimatedTax.toLocaleString()} 원
          </div>
        </div>

        <div class="space-y-2.5 mb-5 pb-5 border-b border-dashed border-slate-300">
          <div class="text-xs font-bold text-slate-400 flex justify-between px-1 uppercase tracking-wider">
            <span>국가 지출 항목</span>
            <span>배분 금액 (비중)</span>
          </div>
          ${rows.map(r => `
            <div class="flex items-center justify-between text-xs lg:text-sm py-1 px-1 hover:bg-slate-50 rounded transition-colors">
              <span class="font-medium text-slate-700 flex items-center gap-1.5">
                <i data-lucide="${r.icon}" class="w-3.5 h-3.5 text-blue-500"></i> ${r.name}
              </span>
              <span class="font-mono text-slate-900 font-semibold">
                ${r.amount.toLocaleString()} 원 <small class="text-slate-400 font-normal">(${r.percentage}%)</small>
              </span>
            </div>
          `).join("")}
        </div>

        <div class="text-center text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <p class="font-semibold text-blue-800 mb-1">"국민 여러분이 납부해주신 소중한 세금입니다."</p>
          <p class="text-slate-500">아이들의 학교, 부모님의 기초연금, 든든한 국방과 지하철로 다시 환원되어 국민의 삶을 지킵니다.</p>
        </div>

        <div class="flex gap-2">
          <button onclick="window.print()" class="w-full py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors">
            <i data-lucide="printer" class="w-3.5 h-3.5"></i> 이 영수증 인쇄 / PDF 저장
          </button>
        </div>

        <div class="receipt-jagged-bottom"></div>
      </div>
    `;

    if (window.lucide) lucide.createIcons();
  }

  // 기본 샘플(연봉 5000만원) 자동 렌더링
  calculateTaxReceipt(5000);
}

/* --------------------------------------------------------------------------
 * 7. 국민참여예산 제안 체험 시뮬레이터
 * -------------------------------------------------------------------------- */
function initCitizenProposal() {
  const form = document.getElementById("citizen-proposal-form");
  const modal = document.getElementById("proposal-simulation-modal");
  const modalClose = document.getElementById("proposal-modal-close");
  const storiesContainer = document.getElementById("proposal-stories-container");

  // 우수 채택 사례 렌더링
  if (storiesContainer) {
    storiesContainer.innerHTML = PORTAL_DATA.successStories.map(story => `
      <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-400 transition-all flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between text-xs mb-2">
            <span class="font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
              ${story.proposer}
            </span>
            <span class="font-mono font-bold text-slate-800">예산: ${story.budget}</span>
          </div>
          <h4 class="font-extrabold text-slate-900 text-base mb-2">${story.title}</h4>
          <p class="text-xs text-slate-600 leading-relaxed mb-4">${story.effect}</p>
        </div>
        <div class="text-xs font-semibold text-emerald-600 flex items-center gap-1">
          <i data-lucide="check-circle" class="w-3.5 h-3.5"></i> 실제 국가예산 채택 및 전국 시행 완료
        </div>
      </div>
    `).join("");
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("prop-title")?.value.trim();
      const category = document.getElementById("prop-category")?.value;
      const budget = document.getElementById("prop-budget")?.value;
      const desc = document.getElementById("prop-desc")?.value.trim();

      if (!title || !desc) {
        alert("사업 제안 제목과 구체적인 내용을 입력해 주세요.");
        return;
      }

      openProposalModal(title, category, budget, desc);
    });
  }

  if (modalClose) {
    modalClose.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

  function openProposalModal(title, category, budget, desc) {
    if (!modal) return;
    modal.classList.remove("hidden");

    const modalBody = document.getElementById("proposal-modal-body");
    const serial = `PR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    modalBody.innerHTML = `
      <div class="text-center mb-6">
        <div class="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
          <i data-lucide="check" class="w-7 h-7"></i>
        </div>
        <span class="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          접수번호: ${serial}
        </span>
        <h4 class="text-xl font-black text-slate-900 mt-2">국민참여예산 제안서가 정상 접수되었습니다!</h4>
        <p class="text-xs text-slate-500 mt-1">기획예산처 및 관련 주무부처로 즉시 전자 이송되어 심사를 시작합니다.</p>
      </div>

      <div class="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs mb-6 space-y-1.5">
        <div class="flex justify-between">
          <strong class="text-slate-600">제안 제목:</strong>
          <span class="font-bold text-slate-900">${title}</span>
        </div>
        <div class="flex justify-between">
          <strong class="text-slate-600">선택 분야:</strong>
          <span class="text-slate-800">${category}</span>
        </div>
        <div class="flex justify-between">
          <strong class="text-slate-600">추정 소요 예산:</strong>
          <span class="text-blue-700 font-bold">${budget}</span>
        </div>
      </div>

      <h5 class="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
        <i data-lucide="git-commit" class="w-4 h-4 text-blue-600"></i> 내 제안의 향후 심사 및 채택 프로세스
      </h5>

      <div class="space-y-3 mb-6">
        <div class="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
          <span class="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">1</span>
          <div>
            <h6 class="font-bold text-emerald-900 text-xs">적격성 자가진단 및 부처 검토 (4~5월)</h6>
            <p class="text-slate-600 text-xs">기획예산처 빅데이터 시스템에서 기존 사업과의 중복 여부 및 법령 저촉 여부를 확인합니다.</p>
          </div>
        </div>

        <div class="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
          <span class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">2</span>
          <div>
            <h6 class="font-bold text-blue-900 text-xs">국민참여예산단 민관 합동 심사 (6~7월)</h6>
            <p class="text-slate-600 text-xs">민간 전문가와 일반 국민 심사단 2,000명이 사업의 필요성과 파급력을 심층 평가합니다.</p>
          </div>
        </div>

        <div class="flex items-start gap-3 p-3 rounded-lg bg-purple-50 border border-purple-200">
          <span class="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold shrink-0">3</span>
          <div>
            <h6 class="font-bold text-purple-900 text-xs">대국민 온라인 투표 및 정부안 반영 (8월)</h6>
            <p class="text-slate-600 text-xs">온국민 소통 포털을 통한 온라인 투표를 거쳐 9월 국회 제출 예산안에 정식 반영됩니다!</p>
          </div>
        </div>
      </div>

      <div class="text-center">
        <button onclick="document.getElementById('proposal-simulation-modal').classList.add('hidden')" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors">
          확인 완료 (체험 닫기)
        </button>
      </div>
    `;

    if (window.lucide) lucide.createIcons();
  }
}

/* --------------------------------------------------------------------------
 * 8. 알기 쉬운 재정 용어사전 (실시간 검색 및 카테고리 필터)
 * -------------------------------------------------------------------------- */
function initGlossary() {
  const container = document.getElementById("glossary-list-container");
  const searchInput = document.getElementById("glossary-search-input");
  const filterPills = document.querySelectorAll(".glossary-filter-pill");

  if (!container) return;

  let currentCategory = "전체";
  let searchKeyword = "";

  function renderGlossary() {
    const filtered = PORTAL_DATA.glossary.filter(item => {
      const matchCat = (currentCategory === "전체" || item.category === currentCategory);
      const matchSearch = searchKeyword === "" || 
        item.term.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.oneLine.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.explanation.toLowerCase().includes(searchKeyword.toLowerCase());
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200">
          <i data-lucide="search-x" class="w-10 h-10 text-slate-300 mx-auto mb-2"></i>
          <p class="text-slate-600 font-bold text-sm">검색 결과가 없습니다.</p>
          <p class="text-slate-400 text-xs mt-1">다른 키워드로 검색하거나 필터를 '전체'로 변경해 보세요.</p>
        </div>
      `;
      if (window.lucide) lucide.createIcons();
      return;
    }

    container.innerHTML = filtered.map(item => `
      <div class="gov-card p-5 lg:p-6 bg-white flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between text-xs mb-3">
            <span class="px-2.5 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-100">
              ${item.category}
            </span>
            <span class="text-slate-400 text-xs">난이도: ${item.difficulty}</span>
          </div>

          <h4 class="text-lg font-black text-slate-900 mb-0.5">${item.term}</h4>
          <span class="text-xs font-mono text-slate-400 mb-3 block">${item.termEn}</span>

          <div class="p-3 bg-amber-50 rounded-xl border border-amber-100 mb-3 text-xs text-amber-900 font-medium leading-relaxed">
            💡 <strong>1줄 요약:</strong> ${item.oneLine}
          </div>

          <p class="text-xs lg:text-sm text-slate-600 leading-relaxed">${item.explanation}</p>
        </div>
      </div>
    `).join("");

    if (window.lucide) lucide.createIcons();
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchKeyword = e.target.value.trim();
      renderGlossary();
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener("click", () => {
      filterPills.forEach(p => {
        p.classList.remove("active", "bg-blue-600", "text-white");
        p.classList.add("bg-white", "text-slate-600", "border-slate-200");
      });
      pill.classList.add("active", "bg-blue-600", "text-white");
      pill.classList.remove("bg-white", "text-slate-600", "border-slate-200");

      currentCategory = pill.dataset.cat;
      renderGlossary();
    });
  });

  renderGlossary();
}

/* --------------------------------------------------------------------------
 * 9. 자주 묻는 질문 (FAQ) 아코디언
 * -------------------------------------------------------------------------- */
function initFAQ() {
  const container = document.getElementById("faq-accordion-container");
  if (!container) return;

  container.innerHTML = PORTAL_DATA.faq.map((item, idx) => `
    <div class="faq-item border border-slate-200 rounded-xl bg-white overflow-hidden transition-all">
      <button class="faq-trigger w-full p-4 lg:p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm lg:text-base hover:bg-slate-50 transition-colors">
        <span class="flex items-center gap-2.5">
          <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center shrink-0">Q</span>
          ${item.q}
        </span>
        <i data-lucide="chevron-down" class="faq-icon w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200"></i>
      </button>
      <div class="faq-body hidden px-5 pb-5 text-xs lg:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
        ${item.a}
      </div>
    </div>
  `).join("");

  container.querySelectorAll(".faq-trigger").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const body = item.querySelector(".faq-body");
      const icon = item.querySelector(".faq-icon");
      const isHidden = body.classList.contains("hidden");

      // 다른 열린 아코디언 닫기
      container.querySelectorAll(".faq-body").forEach(b => b.classList.add("hidden"));
      container.querySelectorAll(".faq-icon").forEach(i => i.style.transform = "rotate(0deg)");

      if (isHidden) {
        body.classList.remove("hidden");
        icon.style.transform = "rotate(180deg)";
      }
    });
  });
}

/* --------------------------------------------------------------------------
 * 10. 어린이 & 청소년 나라살림 퀴즈
 * -------------------------------------------------------------------------- */
function initQuiz() {
  const container = document.getElementById("quiz-card-container");
  if (!container) return;

  let currentQuizIdx = 0;
  let correctCount = 0;

  function renderQuizQuestion() {
    if (currentQuizIdx >= PORTAL_DATA.quiz.length) {
      // 퀴즈 완료 및 수료증 팝업
      renderQuizCertificate();
      return;
    }

    const q = PORTAL_DATA.quiz[currentQuizIdx];
    container.innerHTML = `
      <div class="p-6 lg:p-8 bg-white rounded-2xl border border-slate-200 text-center animate-fadeIn">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-3">
          <i data-lucide="help-circle" class="w-3.5 h-3.5"></i> 문제 ${currentQuizIdx + 1} / ${PORTAL_DATA.quiz.length}
        </div>
        <h4 class="text-xl lg:text-2xl font-extrabold text-slate-900 mb-6 max-w-xl mx-auto leading-snug">
          ${q.question}
        </h4>

        <div class="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
          <button class="quiz-option p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 hover:border-blue-500 font-black text-2xl text-blue-600 transition-all flex flex-col items-center justify-center gap-1 shadow-sm" data-choice="true">
            <span>⭕ O (맞다)</span>
          </button>
          <button class="quiz-option p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 hover:border-red-500 font-black text-2xl text-red-500 transition-all flex flex-col items-center justify-center gap-1 shadow-sm" data-choice="false">
            <span>❌ X (틀리다)</span>
          </button>
        </div>

        <div id="quiz-feedback-box" class="hidden max-w-md mx-auto p-4 rounded-xl text-xs lg:text-sm text-left mb-4"></div>

        <button id="btn-quiz-next" class="hidden px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all mx-auto">
          다음 문제 풀기 ➡️
        </button>
      </div>
    `;

    const feedbackBox = document.getElementById("quiz-feedback-box");
    const btnNext = document.getElementById("btn-quiz-next");

    container.querySelectorAll(".quiz-option").forEach(btn => {
      btn.addEventListener("click", () => {
        const choice = btn.dataset.choice === "true";
        const isCorrect = (choice === q.answer);

        container.querySelectorAll(".quiz-option").forEach(b => b.disabled = true);

        if (isCorrect) {
          correctCount++;
          btn.classList.add("correct");
          feedbackBox.className = "max-w-md mx-auto p-4 rounded-xl text-xs lg:text-sm text-left mb-4 bg-emerald-50 border border-emerald-200 text-emerald-900";
          feedbackBox.innerHTML = `
            <strong class="font-bold flex items-center gap-1.5 mb-1 text-emerald-700">
              <i data-lucide="check-circle" class="w-4 h-4"></i> 정답입니다! 짝짝짝 👏
            </strong>
            <p>${q.explanation}</p>
          `;
        } else {
          btn.classList.add("wrong");
          feedbackBox.className = "max-w-md mx-auto p-4 rounded-xl text-xs lg:text-sm text-left mb-4 bg-red-50 border border-red-200 text-red-900";
          feedbackBox.innerHTML = `
            <strong class="font-bold flex items-center gap-1.5 mb-1 text-red-600">
              <i data-lucide="x-circle" class="w-4 h-4"></i> 아쉽지만 틀렸습니다!
            </strong>
            <p>${q.explanation}</p>
          `;
        }

        feedbackBox.classList.remove("hidden");
        btnNext.classList.remove("hidden");
        if (window.lucide) lucide.createIcons();
      });
    });

    btnNext.addEventListener("click", () => {
      currentQuizIdx++;
      renderQuizQuestion();
    });

    if (window.lucide) lucide.createIcons();
  }

  function renderQuizCertificate() {
    container.innerHTML = `
      <div class="p-6 lg:p-10 bg-gradient-to-b from-amber-50 to-white rounded-2xl border-2 border-amber-300 text-center shadow-lg animate-fadeIn max-w-xl mx-auto">
        <div class="w-16 h-16 bg-amber-400 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
          <i data-lucide="award" class="w-8 h-8"></i>
        </div>
        <span class="text-xs font-bold text-amber-800 tracking-wider uppercase">CERTIFICATE OF COMPLETION</span>
        <h4 class="text-2xl font-black text-slate-900 mt-1 mb-2">대한민국 명예 예산지킴이 위촉장</h4>
        <p class="text-xs text-slate-600 mb-6">
          총 ${PORTAL_DATA.quiz.length}문제 중 <strong class="text-blue-700 font-bold">${correctCount}문제</strong>를 맞히셨습니다! <br>
          대한민국의 소중한 나라살림을 바르게 이해하고 지키는 훌륭한 민주시민이 되셨음을 인증합니다.
        </p>

        <div class="bg-white p-4 rounded-xl border border-amber-200 text-xs text-slate-500 mb-6">
          <p class="font-bold text-slate-800">기획예산처 어린이·청소년 재정 아카데미</p>
          <p class="mt-1 font-mono">${new Date().toLocaleDateString("ko-KR")}</p>
        </div>

        <button onclick="location.reload()" class="px-6 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-sm transition-all">
          처음부터 다시 풀기 🔄
        </button>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
  }

  renderQuizQuestion();
}

/* --------------------------------------------------------------------------
 * 11. 모바일 햄버거 메뉴 토글 & 부드러운 스크롤
 * -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const menuContainer = document.getElementById("mobile-menu-container");

  if (toggleBtn && menuContainer) {
    toggleBtn.addEventListener("click", () => {
      menuContainer.classList.toggle("hidden");
    });

    menuContainer.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        menuContainer.classList.add("hidden");
      });
    });
  }

  // 스크롤 시 내비게이션 바 그림자 처리
  window.addEventListener("scroll", () => {
    const nav = document.querySelector(".main-nav");
    if (nav) {
      if (window.scrollY > 20) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    }
  });
}
