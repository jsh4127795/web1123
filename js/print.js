/**
 * print.js
 * 4종 입체도형의 A4 표준 규격 1:1 벡터 SVG 전개도 도안 생성 및 인쇄 관리자
 */

export const PRINT_TEMPLATES = {
  cube: {
    title: '정육면체 (Cube) 당김 전개도 도안',
    scaleNotice: 'A4 용지 (100% 실제 크기 인쇄 권장 / 여백 없음 설정)',
    getSVG: () => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" class="w-full h-auto bg-white p-4">
        <!-- 배경 및 인쇄 가이드 그리드 -->
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="800" height="1100" fill="url(#grid)" />

        <!-- 헤더 안내 -->
        <text x="400" y="50" font-family="sans-serif" font-size="22" font-weight="bold" fill="#0f172a" text-anchor="middle">
          [STEAM 수학 교구] 당기는 정육면체(Pull-String Cube) 전개도 도안
        </text>
        <text x="400" y="80" font-family="sans-serif" font-size="14" fill="#64748b" text-anchor="middle">
          ■ 실선(빨강): 오리는 선 | ╌ 점선(파랑): 접는 선(스코어링) | ● 검은 원: 타공 펀칭 위치 (지름 3~5mm)
        </text>

        <!-- 정육면체 십자형/계단형 도안 (한 변 120px = 약 4cm 규격) -->
        <g id="cube-net" transform="translate(160, 140)">
          <!-- 면 1 (중앙 밑면 - 고정면) -->
          <rect x="160" y="160" width="160" height="160" fill="#fef9c3" stroke="#2563eb" stroke-dasharray="6,4" stroke-width="2"/>
          <text x="240" y="245" font-family="sans-serif" font-size="16" font-weight="bold" fill="#854d0e" text-anchor="middle">1. 기준 밑면 (바닥 고정)</text>

          <!-- 면 2 (앞면) -->
          <rect x="160" y="320" width="160" height="160" fill="#ffedd5" stroke="#ef4444" stroke-width="2.5"/>
          <text x="240" y="405" font-family="sans-serif" font-size="16" font-weight="bold" fill="#9a3412" text-anchor="middle">2. 앞면</text>

          <!-- 면 3 (뒷면) -->
          <rect x="160" y="0" width="160" height="160" fill="#ffedd5" stroke="#2563eb" stroke-dasharray="6,4" stroke-width="2"/>
          <text x="240" y="85" font-family="sans-serif" font-size="16" font-weight="bold" fill="#9a3412" text-anchor="middle">3. 뒷면</text>

          <!-- 면 6 (윗면 / 뚜껑 - 뒷면 위) -->
          <rect x="160" y="-160" width="160" height="160" fill="#fef9c3" stroke="#ef4444" stroke-width="2.5"/>
          <text x="240" y="-75" font-family="sans-serif" font-size="16" font-weight="bold" fill="#854d0e" text-anchor="middle">6. 윗면 (뚜껑)</text>

          <!-- 면 4 (왼쪽면) -->
          <rect x="0" y="160" width="160" height="160" fill="#dcfce7" stroke="#ef4444" stroke-width="2.5"/>
          <text x="80" y="245" font-family="sans-serif" font-size="16" font-weight="bold" fill="#166534" text-anchor="middle">4. 왼쪽면</text>

          <!-- 면 5 (오른쪽면) -->
          <rect x="320" y="160" width="160" height="160" fill="#dcfce7" stroke="#ef4444" stroke-width="2.5"/>
          <text x="400" y="245" font-family="sans-serif" font-size="16" font-weight="bold" fill="#166534" text-anchor="middle">5. 오른쪽면</text>

          <!-- 타공 펀치 구멍들 (꼭짓점 안쪽 20px) -->
          <!-- 바닥면 4개 모서리 구멍 -->
          <circle cx="180" cy="180" r="8" fill="#0f172a" />
          <circle cx="300" cy="180" r="8" fill="#0f172a" />
          <circle cx="180" cy="300" r="8" fill="#0f172a" />
          <circle cx="300" cy="300" r="8" fill="#0f172a" />

          <!-- 각 날개 끝 타공 구멍 -->
          <circle cx="20" cy="180" r="8" fill="#0f172a" />
          <circle cx="20" cy="300" r="8" fill="#0f172a" />
          <circle cx="460" cy="180" r="8" fill="#0f172a" />
          <circle cx="460" cy="300" r="8" fill="#0f172a" />
          <circle cx="180" cy="460" r="8" fill="#0f172a" />
          <circle cx="300" cy="460" r="8" fill="#0f172a" />
          <circle cx="180" cy="-140" r="8" fill="#0f172a" />
          <circle cx="300" cy="-140" r="8" fill="#0f172a" />

          <!-- 당김줄 PULL 손잡이 라벨 -->
          <g transform="translate(180, 520)">
            <rect x="0" y="0" width="120" height="40" rx="8" fill="#ef4444" />
            <text x="60" y="26" font-family="sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">PULL 실 손잡이</text>
          </g>
        </g>
      </svg>
    `
  },

  prism: {
    title: '삼각기둥 (Triangular Prism) 당김 전개도 도안',
    scaleNotice: 'A4 용지 (100% 실제 크기 인쇄 권장 / 여백 없음 설정)',
    getSVG: () => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" class="w-full h-auto bg-white p-4">
        <text x="400" y="50" font-family="sans-serif" font-size="22" font-weight="bold" fill="#0f172a" text-anchor="middle">
          [STEAM 수학 교구] 당기는 삼각기둥(Pull-String Triangular Prism) 도안
        </text>
        <text x="400" y="80" font-family="sans-serif" font-size="14" fill="#64748b" text-anchor="middle">
          ■ 실선(빨강): 오리는 외곽선 | ╌ 점선(파랑): 접는 선 | ● 검은 원: 타공 구멍
        </text>

        <g transform="translate(180, 180)">
          <!-- 중앙 직사각형 밑면 (폭 140, 높이 220) -->
          <rect x="140" y="120" width="140" height="220" fill="#e0f2fe" stroke="#2563eb" stroke-dasharray="6,4" stroke-width="2"/>
          <text x="210" y="235" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0369a1" text-anchor="middle">중앙 옆면 (고정)</text>

          <!-- 좌측 직사각형 옆면 -->
          <rect x="0" y="120" width="140" height="220" fill="#bae6fd" stroke="#ef4444" stroke-width="2.5"/>
          <text x="70" y="235" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0369a1" text-anchor="middle">왼쪽 옆면</text>

          <!-- 우측 직사각형 옆면 -->
          <rect x="280" y="120" width="140" height="220" fill="#bae6fd" stroke="#ef4444" stroke-width="2.5"/>
          <text x="350" y="235" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0369a1" text-anchor="middle">오른쪽 옆면</text>

          <!-- 위쪽 정삼각형 밑면 -->
          <polygon points="140,120 280,120 210,0" fill="#7dd3fc" stroke="#ef4444" stroke-width="2.5"/>
          <line x1="140" y1="120" x2="280" y2="120" stroke="#2563eb" stroke-dasharray="6,4" stroke-width="2"/>
          <text x="210" y="80" font-family="sans-serif" font-size="14" font-weight="bold" fill="#075985" text-anchor="middle">위 삼각형</text>

          <!-- 아래쪽 정삼각형 밑면 -->
          <polygon points="140,340 280,340 210,460" fill="#7dd3fc" stroke="#ef4444" stroke-width="2.5"/>
          <line x1="140" y1="340" x2="280" y2="340" stroke="#2563eb" stroke-dasharray="6,4" stroke-width="2"/>
          <text x="210" y="380" font-family="sans-serif" font-size="14" font-weight="bold" fill="#075985" text-anchor="middle">아래 삼각형</text>

          <!-- 타공점 -->
          <circle cx="210" cy="18" r="8" fill="#0f172a" />
          <circle cx="210" cy="442" r="8" fill="#0f172a" />
          <circle cx="18" cy="138" r="8" fill="#0f172a" />
          <circle cx="18" cy="322" r="8" fill="#0f172a" />
          <circle cx="402" cy="138" r="8" fill="#0f172a" />
          <circle cx="402" cy="322" r="8" fill="#0f172a" />
        </g>
      </svg>
    `
  },

  cylinder: {
    title: '원기둥 (Cylinder) 수치 증명 전개도 도안',
    scaleNotice: 'A4 용지 (가로 18cm, 높이 9cm, 반지름 2.5cm 정밀 도안)',
    getSVG: () => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" class="w-full h-auto bg-white p-4">
        <text x="400" y="50" font-family="sans-serif" font-size="22" font-weight="bold" fill="#0f172a" text-anchor="middle">
          [STEAM 수학 교구] 당기는 원기둥(Cylinder) 수치 공식 도안
        </text>
        <text x="400" y="80" font-family="sans-serif" font-size="14" fill="#64748b" text-anchor="middle">
          원둘레 공식: 2 × π × 2.5cm = 15.71cm | 실제 가로: 18cm (오버랩 2.29cm)
        </text>

        <g transform="translate(60, 220)">
          <!-- 옆면 직사각형 (가로 680px ≈ 18cm, 세로 340px ≈ 9cm) -->
          <rect x="0" y="100" width="680" height="340" fill="#fae8ff" stroke="#ef4444" stroke-width="2.5"/>

          <!-- 15.71cm 원둘레 경계선 -->
          <line x1="593" y1="100" x2="593" y2="440" stroke="#a855f7" stroke-dasharray="6,4" stroke-width="2"/>
          <text x="296" y="270" font-family="sans-serif" font-size="20" font-weight="bold" fill="#7e22ce" text-anchor="middle">
            밑면 원둘레 결합 구간 (가로 15.71cm)
          </text>

          <!-- 2.29cm 오버랩 겹침 구간 -->
          <rect x="593" y="100" width="87" height="340" fill="#e9d5ff" opacity="0.6"/>
          <text x="636" y="270" font-family="sans-serif" font-size="14" font-weight="bold" fill="#6b21a8" text-anchor="middle" transform="rotate(90, 636, 270)">
            오버랩 마진 2.29cm
          </text>

          <!-- 위쪽 밑면 원 (반지름 약 80px ≈ 2.5cm) -->
          <circle cx="200" cy="18" r="82" fill="#f3e8ff" stroke="#ef4444" stroke-width="2.5"/>
          <line x1="120" y1="100" x2="280" y2="100" stroke="#2563eb" stroke-dasharray="6,4" stroke-width="2"/>
          <text x="200" y="22" font-family="sans-serif" font-size="14" font-weight="bold" fill="#7e22ce" text-anchor="middle">
            윗 밑면 (r = 2.5cm)
          </text>

          <!-- 아래쪽 밑면 원 -->
          <circle cx="200" cy="522" r="82" fill="#f3e8ff" stroke="#ef4444" stroke-width="2.5"/>
          <line x1="120" y1="440" x2="280" y2="440" stroke="#2563eb" stroke-dasharray="6,4" stroke-width="2"/>
          <text x="200" y="526" font-family="sans-serif" font-size="14" font-weight="bold" fill="#7e22ce" text-anchor="middle">
            아래 밑면 (r = 2.5cm)
          </text>

          <!-- 타공 펀치 구멍들 -->
          <circle cx="20" cy="120" r="8" fill="#0f172a" />
          <circle cx="20" cy="420" r="8" fill="#0f172a" />
          <circle cx="580" cy="120" r="8" fill="#0f172a" />
          <circle cx="580" cy="420" r="8" fill="#0f172a" />
        </g>
      </svg>
    `
  },

  dome: {
    title: '별 모양 다각뿔 돔 (Star Dome) 방사형 도안',
    scaleNotice: 'A4 용지 (정육각형 밑면 및 6개 방사형 삼각형 날개)',
    getSVG: () => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" class="w-full h-auto bg-white p-4">
        <text x="400" y="50" font-family="sans-serif" font-size="22" font-weight="bold" fill="#0f172a" text-anchor="middle">
          [STEAM 수학 교구] 별 모양 돔(Star Dome) 방사형 전개도
        </text>
        <text x="400" y="80" font-family="sans-serif" font-size="14" fill="#64748b" text-anchor="middle">
          수직 인장력으로 꼭짓점이 한곳에 모여 지오데식 돔을 형성하는 전개도
        </text>

        <g transform="translate(400, 480)">
          <!-- 중앙 정육각형 (R = 100) -->
          <polygon points="
            100,0 50,86.6 -50,86.6 -100,0 -50,-86.6 50,-86.6
          " fill="#d1fae5" stroke="#2563eb" stroke-dasharray="6,4" stroke-width="2"/>
          <text x="0" y="6" font-family="sans-serif" font-size="16" font-weight="bold" fill="#065f46" text-anchor="middle">중앙 밑면</text>

          <!-- 6개 방사형 삼각형 날개 (각각 바깥으로 뻗음, 날개 길이 180) -->
          <!-- 날개 1 -->
          <polygon points="100,0 50,86.6 190,140" fill="#a7f3d0" stroke="#ef4444" stroke-width="2.5"/>
          <circle cx="180" cy="132" r="8" fill="#0f172a"/>

          <!-- 날개 2 -->
          <polygon points="50,86.6 -50,86.6 0,250" fill="#a7f3d0" stroke="#ef4444" stroke-width="2.5"/>
          <circle cx="0" cy="238" r="8" fill="#0f172a"/>

          <!-- 날개 3 -->
          <polygon points="-50,86.6 -100,0 -190,140" fill="#a7f3d0" stroke="#ef4444" stroke-width="2.5"/>
          <circle cx="-180" cy="132" r="8" fill="#0f172a"/>

          <!-- 날개 4 -->
          <polygon points="-100,0 -50,-86.6 -190,-140" fill="#a7f3d0" stroke="#ef4444" stroke-width="2.5"/>
          <circle cx="-180" cy="-132" r="8" fill="#0f172a"/>

          <!-- 날개 5 -->
          <polygon points="-50,-86.6 50,-86.6 0,-250" fill="#a7f3d0" stroke="#ef4444" stroke-width="2.5"/>
          <circle cx="0" cy="-238" r="8" fill="#0f172a"/>

          <!-- 날개 6 -->
          <polygon points="50,-86.6 100,0 190,-140" fill="#a7f3d0" stroke="#ef4444" stroke-width="2.5"/>
          <circle cx="180" cy="-132" r="8" fill="#0f172a"/>
        </g>
      </svg>
    `
  }
};
