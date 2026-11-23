/**
 * bundle.js - Standalone High-Precision Geometry & Folding Engine
 * 4종 도형(정육면체, 삼각기둥, 원기둥, 별모양 돔)의 초정밀 피벗 접힘 및 인터랙티브 학습 통합 엔진
 * (No ES Modules, 100% file:// CORS Free)
 */

(function () {
  'use strict';

  // ==========================================
  // 1. A4 벡터 인쇄용 SVG 템플릿
  // ==========================================
  const PRINT_TEMPLATES = {
    cube: {
      title: '정육면체 (Cube) 당김 전개도 도안',
      scaleNotice: 'A4 용지 (100% 실제 크기 인쇄 권장 / 여백 없음 설정)',
      getSVG: () => `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" class="w-full h-auto bg-white p-4">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="800" height="1100" fill="url(#grid)" />
          <text x="400" y="50" font-family="sans-serif" font-size="22" font-weight="bold" fill="#0f172a" text-anchor="middle">
            [STEAM 수학 교구] 당기는 정육면체(Pull-String Cube) 전개도 도안
          </text>
          <text x="400" y="80" font-family="sans-serif" font-size="14" fill="#64748b" text-anchor="middle">
            ■ 실선(빨강): 오리는 선 | ╌ 점선(파랑): 접는 선(스코어링) | ● 검은 원: 타공 펀칭 위치 (지름 3~5mm)
          </text>
          <g transform="translate(160, 140)">
            <rect x="160" y="160" width="160" height="160" fill="#fef9c3" stroke="#2563eb" stroke-dasharray="6,4" stroke-width="2"/>
            <text x="240" y="245" font-family="sans-serif" font-size="16" font-weight="bold" fill="#854d0e" text-anchor="middle">1. 기준 밑면 (바닥 고정)</text>
            <rect x="160" y="320" width="160" height="160" fill="#ffedd5" stroke="#ef4444" stroke-width="2.5"/>
            <text x="240" y="405" font-family="sans-serif" font-size="16" font-weight="bold" fill="#9a3412" text-anchor="middle">2. 앞면</text>
            <rect x="160" y="0" width="160" height="160" fill="#ffedd5" stroke="#2563eb" stroke-dasharray="6,4" stroke-width="2"/>
            <text x="240" y="85" font-family="sans-serif" font-size="16" font-weight="bold" fill="#9a3412" text-anchor="middle">3. 뒷면</text>
            <rect x="160" y="-160" width="160" height="160" fill="#fef9c3" stroke="#ef4444" stroke-width="2.5"/>
            <text x="240" y="-75" font-family="sans-serif" font-size="16" font-weight="bold" fill="#854d0e" text-anchor="middle">6. 윗면 (뚜껑)</text>
            <rect x="0" y="160" width="160" height="160" fill="#dcfce7" stroke="#ef4444" stroke-width="2.5"/>
            <text x="80" y="245" font-family="sans-serif" font-size="16" font-weight="bold" fill="#166534" text-anchor="middle">4. 왼쪽면</text>
            <rect x="320" y="160" width="160" height="160" fill="#dcfce7" stroke="#ef4444" stroke-width="2.5"/>
            <text x="400" y="245" font-family="sans-serif" font-size="16" font-weight="bold" fill="#166534" text-anchor="middle">5. 오른쪽면</text>
            <circle cx="180" cy="180" r="8" fill="#0f172a" />
            <circle cx="300" cy="180" r="8" fill="#0f172a" />
            <circle cx="180" cy="300" r="8" fill="#0f172a" />
            <circle cx="300" cy="300" r="8" fill="#0f172a" />
            <circle cx="20" cy="180" r="8" fill="#0f172a" />
            <circle cx="20" cy="300" r="8" fill="#0f172a" />
            <circle cx="460" cy="180" r="8" fill="#0f172a" />
            <circle cx="460" cy="300" r="8" fill="#0f172a" />
            <circle cx="180" cy="460" r="8" fill="#0f172a" />
            <circle cx="300" cy="460" r="8" fill="#0f172a" />
            <circle cx="180" cy="-140" r="8" fill="#0f172a" />
            <circle cx="300" cy="-140" r="8" fill="#0f172a" />
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
            <rect x="140" y="120" width="140" height="220" fill="#e0f2fe" stroke="#2563eb" stroke-dasharray="6,4" stroke-width="2"/>
            <text x="210" y="235" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0369a1" text-anchor="middle">중앙 옆면 (고정)</text>
            <rect x="0" y="120" width="140" height="220" fill="#bae6fd" stroke="#ef4444" stroke-width="2.5"/>
            <text x="70" y="235" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0369a1" text-anchor="middle">왼쪽 옆면</text>
            <rect x="280" y="120" width="140" height="220" fill="#bae6fd" stroke="#ef4444" stroke-width="2.5"/>
            <text x="350" y="235" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0369a1" text-anchor="middle">오른쪽 옆면</text>
            <polygon points="140,120 280,120 210,0" fill="#7dd3fc" stroke="#ef4444" stroke-width="2.5"/>
            <line x1="140" y1="120" x2="280" y2="120" stroke="#2563eb" stroke-dasharray="6,4" stroke-width="2"/>
            <text x="210" y="80" font-family="sans-serif" font-size="14" font-weight="bold" fill="#075985" text-anchor="middle">위 삼각형</text>
            <polygon points="140,340 280,340 210,460" fill="#7dd3fc" stroke="#ef4444" stroke-width="2.5"/>
            <line x1="140" y1="340" x2="280" y2="340" stroke="#2563eb" stroke-dasharray="6,4" stroke-width="2"/>
            <text x="210" y="380" font-family="sans-serif" font-size="14" font-weight="bold" fill="#075985" text-anchor="middle">아래 삼각형</text>
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
            <rect x="0" y="100" width="680" height="340" fill="#fae8ff" stroke="#ef4444" stroke-width="2.5"/>
            <line x1="593" y1="100" x2="593" y2="440" stroke="#a855f7" stroke-dasharray="6,4" stroke-width="2"/>
            <text x="296" y="270" font-family="sans-serif" font-size="20" font-weight="bold" fill="#7e22ce" text-anchor="middle">
              밑면 원둘레 결합 구간 (가로 15.71cm)
            </text>
            <rect x="593" y="100" width="87" height="340" fill="#e9d5ff" opacity="0.6"/>
            <text x="636" y="270" font-family="sans-serif" font-size="14" font-weight="bold" fill="#6b21a8" text-anchor="middle" transform="rotate(90, 636, 270)">
              오버랩 마진 2.29cm
            </text>
            <circle cx="200" cy="18" r="82" fill="#f3e8ff" stroke="#ef4444" stroke-width="2.5"/>
            <line x1="120" y1="100" x2="280" y2="100" stroke="#2563eb" stroke-dasharray="6,4" stroke-width="2"/>
            <text x="200" y="22" font-family="sans-serif" font-size="14" font-weight="bold" fill="#7e22ce" text-anchor="middle">
              윗 밑면 (r = 2.5cm)
            </text>
            <circle cx="200" cy="522" r="82" fill="#f3e8ff" stroke="#ef4444" stroke-width="2.5"/>
            <line x1="120" y1="440" x2="280" y2="440" stroke="#2563eb" stroke-dasharray="6,4" stroke-width="2"/>
            <text x="200" y="526" font-family="sans-serif" font-size="14" font-weight="bold" fill="#7e22ce" text-anchor="middle">
              아래 밑면 (r = 2.5cm)
            </text>
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
            <polygon points="100,0 50,86.6 -50,86.6 -100,0 -50,-86.6 50,-86.6" fill="#d1fae5" stroke="#2563eb" stroke-dasharray="6,4" stroke-width="2"/>
            <text x="0" y="6" font-family="sans-serif" font-size="16" font-weight="bold" fill="#065f46" text-anchor="middle">중앙 밑면</text>
            <polygon points="100,0 50,86.6 190,140" fill="#a7f3d0" stroke="#ef4444" stroke-width="2.5"/>
            <circle cx="180" cy="132" r="8" fill="#0f172a"/>
            <polygon points="50,86.6 -50,86.6 0,250" fill="#a7f3d0" stroke="#ef4444" stroke-width="2.5"/>
            <circle cx="0" cy="238" r="8" fill="#0f172a"/>
            <polygon points="-50,86.6 -100,0 -190,140" fill="#a7f3d0" stroke="#ef4444" stroke-width="2.5"/>
            <circle cx="-180" cy="132" r="8" fill="#0f172a"/>
            <polygon points="-100,0 -50,-86.6 -190,-140" fill="#a7f3d0" stroke="#ef4444" stroke-width="2.5"/>
            <circle cx="-180" cy="-132" r="8" fill="#0f172a"/>
            <polygon points="-50,-86.6 50,-86.6 0,-250" fill="#a7f3d0" stroke="#ef4444" stroke-width="2.5"/>
            <circle cx="0" cy="-238" r="8" fill="#0f172a"/>
            <polygon points="50,-86.6 100,0 190,-140" fill="#a7f3d0" stroke="#ef4444" stroke-width="2.5"/>
            <circle cx="180" cy="-132" r="8" fill="#0f172a"/>
          </g>
        </svg>
      `
    }
  };

  // ==========================================
  // 2. 텍스처 및 판넬 생성 헬퍼
  // ==========================================
  function createFaceTexture(text, subText, bgColor, textColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bgColor || '#ffffff';
    ctx.fillRect(0, 0, 512, 512);

    ctx.lineWidth = 14;
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(7, 7, 498, 498);

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 8]);
    const holeOffset = 45;
    const holeRadius = 18;
    [[holeOffset, holeOffset], [512 - holeOffset, holeOffset], [holeOffset, 512 - holeOffset], [512 - holeOffset, 512 - holeOffset]].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, holeRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#f8fafc';
      ctx.fill();
    });
    ctx.setLineDash([]);

    ctx.fillStyle = textColor || '#1e293b';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 68px -apple-system, sans-serif';
    ctx.fillText(text, 256, subText ? 210 : 256);

    if (subText) {
      ctx.font = 'bold 36px -apple-system, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(subText, 256, 310);
    }

    const texture = new THREE.CanvasTexture(canvas);
    if (THREE.sRGBEncoding) texture.encoding = THREE.sRGBEncoding;
    return texture;
  }

  function createPanelMesh(width, height, textureOrColor) {
    const geom = new THREE.PlaneGeometry(width, height);
    let mat;
    if (typeof textureOrColor === 'string' || textureOrColor instanceof THREE.Texture) {
      mat = new THREE.MeshStandardMaterial({
        map: textureOrColor,
        side: THREE.DoubleSide,
        roughness: 0.6,
        metalness: 0.05
      });
    } else {
      mat = new THREE.MeshStandardMaterial({
        color: textureOrColor,
        side: THREE.DoubleSide,
        roughness: 0.5,
        metalness: 0.05
      });
    }

    const mesh = new THREE.Mesh(geom, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const wireGeom = new THREE.EdgesGeometry(geom);
    const wireMat = new THREE.LineBasicMaterial({ color: 0x1e293b, linewidth: 2 });
    mesh.add(new THREE.LineSegments(wireGeom, wireMat));
    return mesh;
  }

  // ==========================================
  // 3. 4종 초정밀 3D 모델 정의
  // ==========================================

  // 3.1 정육면체 (Cube) - 6면 계층 피벗 결합
  function createCubeModel() {
    const group = new THREE.Group();
    const S = 2.4;
    const half = S / 2;

    const texBase = createFaceTexture('밑면 (Base)', '1번 면 (고정)', '#fef08a');
    const texFront = createFaceTexture('앞면', '2번 면', '#fed7aa');
    const texBack = createFaceTexture('뒷면', '3번 면 (마주봄)', '#fed7aa');
    const texLeft = createFaceTexture('왼쪽면', '4번 면', '#bbf7d0');
    const texRight = createFaceTexture('오른쪽면', '5번 면 (마주봄)', '#bbf7d0');
    const texTop = createFaceTexture('윗면 (Top)', '6번 면 (마주봄)', '#fef08a');

    // 1. 밑면 (바닥 고정, xz 평면)
    const baseMesh = createPanelMesh(S, S, texBase);
    baseMesh.rotation.x = -Math.PI / 2;
    baseMesh.position.set(0, 0.01, 0);
    group.add(baseMesh);

    // 2. 앞면 (앞쪽 모서리 z = +half 에 피벗)
    const pivotFront = new THREE.Group();
    pivotFront.position.set(0, 0.01, half);
    const meshFront = createPanelMesh(S, S, texFront);
    meshFront.rotation.x = -Math.PI / 2;
    meshFront.position.set(0, 0, half);
    pivotFront.add(meshFront);
    group.add(pivotFront);

    // 3. 뒷면 (뒤쪽 모서리 z = -half 에 피벗)
    const pivotBack = new THREE.Group();
    pivotBack.position.set(0, 0.01, -half);
    const meshBack = createPanelMesh(S, S, texBack);
    meshBack.rotation.x = -Math.PI / 2;
    meshBack.position.set(0, 0, -half);
    pivotBack.add(meshBack);
    group.add(pivotBack);

    // 4. 왼쪽면 (왼쪽 모서리 x = -half 에 피벗)
    const pivotLeft = new THREE.Group();
    pivotLeft.position.set(-half, 0.01, 0);
    const meshLeft = createPanelMesh(S, S, texLeft);
    meshLeft.rotation.x = -Math.PI / 2;
    meshLeft.position.set(-half, 0, 0);
    pivotLeft.add(meshLeft);
    group.add(pivotLeft);

    // 5. 오른쪽면 (오른쪽 모서리 x = +half 에 피벗)
    const pivotRight = new THREE.Group();
    pivotRight.position.set(half, 0.01, 0);
    const meshRight = createPanelMesh(S, S, texRight);
    meshRight.rotation.x = -Math.PI / 2;
    meshRight.position.set(half, 0, 0);
    pivotRight.add(meshRight);
    group.add(pivotRight);

    // 6. 윗면 (뒷면 끝 모서리 로컬 z = -S 에 종속 피벗)
    const pivotTop = new THREE.Group();
    pivotTop.position.set(0, 0, -S);
    const meshTop = createPanelMesh(S, S, texTop);
    meshTop.rotation.x = -Math.PI / 2;
    meshTop.position.set(0, 0, -half);
    pivotTop.add(meshTop);
    pivotBack.add(pivotTop);

    // 당김줄 (실선)
    const stringGeom = new THREE.BufferGeometry();
    const stringLine = new THREE.Line(stringGeom, new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 3 }));
    group.add(stringLine);

    // PULL 손잡이
    const pullTab = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.04, 0.38), new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
    pullTab.position.set(0, 0.02, half + S + 0.4);
    group.add(pullTab);

    const update = (t) => {
      const angle = (Math.PI / 2) * t;

      // 앞/뒤/좌/우 90도 기립
      pivotFront.rotation.x = angle;
      pivotBack.rotation.x = -angle;
      pivotLeft.rotation.z = -angle;
      pivotRight.rotation.z = angle;

      // 윗면 뚜껑 90도 추가 접힘 (상자 닫힘)
      pivotTop.rotation.x = -angle;

      // 손잡이 당김 이동
      pullTab.position.z = (half + S + 0.4) + t * 0.9;

      // 실 경로 (타공점을 잇는 3D 끈의 텐션 조임)
      const curY = 0.05 + t * (S - 0.1);
      const curHalf = half * (1 - 0.05 * t);
      const stringPts = [
        new THREE.Vector3(0, 0.02, pullTab.position.z),
        new THREE.Vector3(0, 0.02, half + S * (1 - t)),
        new THREE.Vector3(-curHalf, curY, curHalf),
        new THREE.Vector3(curHalf, curY, curHalf),
        new THREE.Vector3(curHalf, curY, -curHalf),
        new THREE.Vector3(-curHalf, curY, -curHalf),
        new THREE.Vector3(-curHalf, curY, curHalf),
        new THREE.Vector3(0, 0.02, pullTab.position.z)
      ];
      stringGeom.setFromPoints(stringPts);
    };

    return {
      group,
      update,
      meta: {
        id: 'cube',
        name: '정육면체 / 직육면체 (Cube)',
        grade: '초등 5학년 2학기 5단원 (직육면체)',
        faces: 6,
        edges: 12,
        vertices: 8,
        euler: '8 - 12 + 6 = 2',
        opposingPairs: [
          { pair: ['밑면 (1번)', '윗면 (6번)'], color: '#fef08a' },
          { pair: ['앞면 (2번)', '뒷면 (3번)'], color: '#fed7aa' },
          { pair: ['왼쪽면 (4번)', '오른쪽면 (5번)'], color: '#bbf7d0' }
        ],
        description: '바닥 밑면을 고정하고 실을 당기면 4개의 옆면이 동시에 90° 기립하고 윗면 뚜껑이 닫혀 완벽한 직육면체/정육면체가 완성됩니다. 마주보는 3쌍의 평행면을 직관적으로 증명합니다.'
      }
    };
  }

  // 3.2 삼각기둥 (Triangular Prism) - 60도 및 90도 정밀 트러스 결합
  function createPrismModel() {
    const group = new THREE.Group();
    const A = 2.4;
    const H = 2.8;
    const halfA = A / 2;
    const halfH = H / 2;
    const triH = (Math.sqrt(3) / 2) * A;

    // 1. 중앙 직사각형 옆면 (바닥 고정)
    const baseMesh = createPanelMesh(A, H, createFaceTexture('중앙 옆면', '바닥 고정면', '#bae6fd'));
    baseMesh.rotation.x = -Math.PI / 2;
    baseMesh.position.set(0, 0.01, 0);
    group.add(baseMesh);

    // 2. 왼쪽 직사각형 옆면 (모서리 x = -halfA 피벗)
    const pivotLeft = new THREE.Group();
    pivotLeft.position.set(-halfA, 0.01, 0);
    const meshLeft = createPanelMesh(A, H, createFaceTexture('왼쪽 옆면', '지붕면', '#7dd3fc'));
    meshLeft.rotation.x = -Math.PI / 2;
    meshLeft.position.set(-halfA, 0, 0);
    pivotLeft.add(meshLeft);
    group.add(pivotLeft);

    // 3. 오른쪽 직사각형 옆면 (모서리 x = +halfA 피벗)
    const pivotRight = new THREE.Group();
    pivotRight.position.set(halfA, 0.01, 0);
    const meshRight = createPanelMesh(A, H, createFaceTexture('오른쪽 옆면', '지붕면', '#7dd3fc'));
    meshRight.rotation.x = -Math.PI / 2;
    meshRight.position.set(halfA, 0, 0);
    pivotRight.add(meshRight);
    group.add(pivotRight);

    // 정삼각형 밑면 메쉬 생성 헬퍼
    function createTriangleMesh(label) {
      const shape = new THREE.Shape();
      shape.moveTo(-halfA, 0);
      shape.lineTo(halfA, 0);
      shape.lineTo(0, triH);
      shape.closePath();

      const geom = new THREE.ShapeGeometry(shape);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        side: THREE.DoubleSide,
        roughness: 0.5
      });
      const mesh = new THREE.Mesh(geom, mat);
      const wire = new THREE.LineSegments(new THREE.EdgesGeometry(geom), new THREE.LineBasicMaterial({ color: 0x082f49, linewidth: 2 }));
      mesh.add(wire);
      return mesh;
    }

    // 4. 앞쪽 정삼각형 밑면 (z = +halfH 모서리 피벗)
    const pivotFront = new THREE.Group();
    pivotFront.position.set(0, 0.01, halfH);
    const frontTri = createTriangleMesh('앞 밑면');
    frontTri.rotation.x = -Math.PI / 2;
    pivotFront.add(frontTri);
    group.add(pivotFront);

    // 5. 뒤쪽 정삼각형 밑면 (z = -halfH 모서리 피벗)
    const pivotBack = new THREE.Group();
    pivotBack.position.set(0, 0.01, -halfH);
    const backTri = createTriangleMesh('뒤 밑면');
    backTri.rotation.x = -Math.PI / 2;
    backTri.rotation.z = Math.PI;
    pivotBack.add(backTri);
    group.add(pivotBack);

    // 당김줄
    const stringGeom = new THREE.BufferGeometry();
    const stringLine = new THREE.Line(stringGeom, new THREE.LineBasicMaterial({ color: 0xd90429, linewidth: 3 }));
    group.add(stringLine);

    // PULL 탭
    const pullTab = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.04, 0.35), new THREE.MeshStandardMaterial({ color: 0xd90429 }));
    pullTab.position.set(0, 0.02, halfH + triH + 0.4);
    group.add(pullTab);

    const update = (t) => {
      const sideAngle = (Math.PI / 3) * t;
      pivotLeft.rotation.z = -sideAngle;
      pivotRight.rotation.z = sideAngle;

      const triAngle = (Math.PI / 2) * t;
      pivotFront.rotation.x = triAngle;
      pivotBack.rotation.x = -triAngle;

      pullTab.position.z = (halfH + triH + 0.4) + t * 0.8;

      const apexY = triH * Math.sin(triAngle);
      const stringPts = [
        new THREE.Vector3(0, 0.02, pullTab.position.z),
        new THREE.Vector3(0, 0.02, halfH + triH * (1 - t)),
        new THREE.Vector3(0, Math.max(0.05, apexY), halfH),
        new THREE.Vector3(0, Math.max(0.05, apexY), -halfH),
        new THREE.Vector3(0, 0.02, -halfH - triH * (1 - t)),
        new THREE.Vector3(0, 0.02, pullTab.position.z)
      ];
      stringGeom.setFromPoints(stringPts);
    };

    return {
      group,
      update,
      meta: {
        id: 'prism',
        name: '삼각기둥 (Triangular Prism)',
        grade: '초등 6학년 1학기 2단원 (각기둥과 각뿔)',
        faces: 5,
        edges: 9,
        vertices: 6,
        euler: '6 - 9 + 5 = 2',
        opposingPairs: [
          { pair: ['앞 밑면 (정삼각형)', '뒤 밑면 (정삼각형)'], color: '#0284c7' }
        ],
        description: '외력에 가장 강한 트러스 구조의 기초 도형입니다. 3개의 직사각형 옆면이 60°로 맞물리고 2개의 삼각형 밑면이 90°로 세워져 단단한 3차원 삼각기둥을 형성합니다.'
      }
    };
  }

  // 3.3 원기둥 (Cylinder) - 실제 치수 가로 18cm, 높이 9cm, 반지름 2.5cm 비례
  function createCylinderModel() {
    const group = new THREE.Group();

    const R = 0.85;
    const H = 2.4;
    const perimeter = 2 * Math.PI * R;
    const totalW = perimeter * (18 / 15.71);
    const overlapW = totalW - perimeter;

    const segX = 80;
    const planeGeom = new THREE.PlaneGeometry(totalW, H, segX, 1);
    const origPositions = planeGeom.attributes.position.clone();

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f3e8ff';
    ctx.fillRect(0, 0, 1024, 512);

    const overlapRatio = overlapW / totalW;
    const mainRatio = 1 - overlapRatio;
    ctx.fillStyle = '#ede9fe';
    ctx.fillRect(0, 0, 1024 * mainRatio, 512);
    ctx.fillStyle = '#ddd6fe';
    ctx.fillRect(1024 * mainRatio, 0, 1024 * overlapRatio, 512);

    ctx.lineWidth = 6;
    ctx.strokeStyle = '#7c3aed';
    ctx.strokeRect(6, 6, 1012, 500);

    ctx.fillStyle = '#5b21b6';
    ctx.font = 'bold 44px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('옆면 직사각형 (가로 18cm × 높이 9cm)', 1024 * mainRatio / 2, 210);

    ctx.font = '32px -apple-system, sans-serif';
    ctx.fillStyle = '#6d28d9';
    ctx.fillText('원둘레 15.71cm = 2 × π × 2.5cm', 1024 * mainRatio / 2, 290);

    ctx.fillStyle = '#4c1d95';
    ctx.font = 'bold 26px -apple-system, sans-serif';
    ctx.fillText('오버랩 2.29cm', 1024 * (mainRatio + overlapRatio / 2), 256);

    const sideTex = new THREE.CanvasTexture(canvas);
    if (THREE.sRGBEncoding) sideTex.encoding = THREE.sRGBEncoding;

    const sideMat = new THREE.MeshStandardMaterial({
      map: sideTex,
      side: THREE.DoubleSide,
      roughness: 0.5,
      metalness: 0.05
    });
    const sideMesh = new THREE.Mesh(planeGeom, sideMat);
    sideMesh.position.set(0, H / 2, 0);
    group.add(sideMesh);

    const discGeom = new THREE.CircleGeometry(R, 40);
    const discMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, side: THREE.DoubleSide, roughness: 0.5 });

    const pivotBottom = new THREE.Group();
    pivotBottom.position.set(0, 0.01, 0);
    const meshBottom = new THREE.Mesh(discGeom, discMat);
    meshBottom.rotation.x = -Math.PI / 2;
    meshBottom.position.set(0, 0, R);
    pivotBottom.add(meshBottom);
    group.add(pivotBottom);

    const pivotTop = new THREE.Group();
    pivotTop.position.set(0, H, 0);
    const meshTop = new THREE.Mesh(discGeom, discMat);
    meshTop.rotation.x = -Math.PI / 2;
    meshTop.position.set(0, 0, -R);
    pivotTop.add(meshTop);
    group.add(pivotTop);

    const stringGeom = new THREE.BufferGeometry();
    const stringLine = new THREE.Line(stringGeom, new THREE.LineBasicMaterial({ color: 0x7e22ce, linewidth: 3 }));
    group.add(stringLine);

    const pullTab = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.04, 0.35), new THREE.MeshStandardMaterial({ color: 0x7e22ce }));
    pullTab.position.set(0, 0.02, 2.6);
    group.add(pullTab);

    const update = (t) => {
      const pos = planeGeom.attributes.position;
      const orig = origPositions;

      for (let i = 0; i < pos.count; i++) {
        const ox = orig.getX(i);
        const oy = orig.getY(i);

        const theta = (ox / perimeter) * (Math.PI * 2);

        const flatX = ox;
        const flatZ = 0;

        const cylX = R * Math.sin(theta);
        const cylZ = -R * (1 - Math.cos(theta));

        pos.setXYZ(i, (1 - t) * flatX + t * cylX, oy, (1 - t) * flatZ + t * cylZ);
      }
      pos.needsUpdate = true;
      planeGeom.computeVertexNormals();

      const discAngle = (Math.PI / 2) * t;
      pivotBottom.rotation.x = -discAngle;
      pivotTop.rotation.x = -discAngle;

      meshBottom.position.z = R * (1 - t) - R * t;
      meshTop.position.z = -R;

      pullTab.position.z = 2.6 + t * 0.8;

      const stringPts = [
        new THREE.Vector3(0, 0.02, pullTab.position.z),
        new THREE.Vector3(R * Math.cos(t * Math.PI), 0.1, -R * t),
        new THREE.Vector3(R * Math.cos(t * Math.PI), H - 0.1, -R * t),
        new THREE.Vector3(-R * Math.cos(t * Math.PI), H - 0.1, -R * t),
        new THREE.Vector3(-R * Math.cos(t * Math.PI), 0.1, -R * t),
        new THREE.Vector3(0, 0.02, pullTab.position.z)
      ];
      stringGeom.setFromPoints(stringPts);
    };

    return {
      group,
      update,
      meta: {
        id: 'cylinder',
        name: '원기둥 (Cylinder - 수치 증명형)',
        grade: '초등 6학년 2학기 6단원 (원기둥, 원뿔, 구)',
        faces: 3,
        edges: 2,
        vertices: 0,
        euler: '곡면 입체 (2 × π × r = 원둘레 공식 적용)',
        formula: '옆면 직사각형 가로 = 2 × π × r (원둘레)',
        description: '평면 직사각형 종이가 실의 인장력에 의해 둥글게 말리면서 원형 밑면을 감싸는 원리를 증명합니다. 이론상 원둘레(15.71cm)와 종이가 겹치는 오버랩 마진(2.29cm)의 차이를 시각화합니다.'
      }
    };
  }

  // 3.4 별 모양 다각뿔 돔 (Star Dome) - 방사형 날개 수직 수렴
  function createStarDomeModel() {
    const group = new THREE.Group();
    const N = 6;
    const baseR = 1.2;
    const wingH = 2.2;

    const baseShape = new THREE.Shape();
    for (let i = 0; i < N; i++) {
      const angle = (i / N) * Math.PI * 2;
      const x = baseR * Math.cos(angle);
      const z = baseR * Math.sin(angle);
      if (i === 0) baseShape.moveTo(x, z);
      else baseShape.lineTo(x, z);
    }
    baseShape.closePath();

    const baseGeom = new THREE.ShapeGeometry(baseShape);
    const baseMesh = new THREE.Mesh(baseGeom, new THREE.MeshStandardMaterial({ color: 0x34d399, side: THREE.DoubleSide, roughness: 0.5 }));
    baseMesh.rotation.x = -Math.PI / 2;
    baseMesh.position.set(0, 0.01, 0);
    group.add(baseMesh);

    const wingPivots = [];
    const sideLen = 2 * baseR * Math.sin(Math.PI / N);
    const halfSide = sideLen / 2;

    const wingShape = new THREE.Shape();
    wingShape.moveTo(-halfSide, 0);
    wingShape.lineTo(halfSide, 0);
    wingShape.lineTo(0, wingH);
    wingShape.closePath();
    const wingGeom = new THREE.ShapeGeometry(wingShape);
    const wingMat = new THREE.MeshStandardMaterial({ color: 0x6ee7b7, side: THREE.DoubleSide, roughness: 0.5 });
    const wireGeom = new THREE.EdgesGeometry(wingGeom);
    const wireMat = new THREE.LineBasicMaterial({ color: 0x064e3b, linewidth: 2 });

    for (let i = 0; i < N; i++) {
      const midAngle = ((i + 0.5) / N) * Math.PI * 2;
      const rMid = baseR * Math.cos(Math.PI / N);
      const px = rMid * Math.cos(midAngle);
      const pz = rMid * Math.sin(midAngle);

      const pivot = new THREE.Group();
      pivot.position.set(px, 0.01, pz);
      pivot.rotation.y = -midAngle + Math.PI / 2;

      const wingMesh = new THREE.Mesh(wingGeom, wingMat);
      wingMesh.rotation.x = -Math.PI / 2;
      wingMesh.add(new THREE.LineSegments(wireGeom, wireMat));

      pivot.add(wingMesh);
      group.add(pivot);
      wingPivots.push(pivot);
    }

    const stringGeom = new THREE.BufferGeometry();
    group.add(new THREE.Line(stringGeom, new THREE.LineBasicMaterial({ color: 0xe11d48, linewidth: 3 })));

    const pullRing = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.03, 16, 32), new THREE.MeshStandardMaterial({ color: 0xe11d48 }));
    pullRing.rotation.x = Math.PI / 2;
    pullRing.position.set(0, 0.1, 0);
    group.add(pullRing);

    const update = (t) => {
      const foldAngle = 1.25 * t;
      wingPivots.forEach(pivot => {
        pivot.rotation.x = -foldAngle;
      });

      const apexHeight = 0.1 + (wingH * Math.sin(foldAngle) * 0.95);
      pullRing.position.y = apexHeight + (1 - t) * 0.5 + 0.2;

      const stringPts = [];
      wingPivots.forEach(pivot => {
        const tipPos = new THREE.Vector3(0, 0, wingH);
        pivot.children[0].localToWorld(tipPos);
        stringPts.push(tipPos);
        stringPts.push(pullRing.position.clone());
      });
      stringGeom.setFromPoints(stringPts);
    };

    return {
      group,
      update,
      meta: {
        id: 'dome',
        name: '별 모양 다각뿔 돔 (Star Pyramid & Dome)',
        grade: '초등 6학년 STEAM 창의 융합 (지오데식 돔의 기초)',
        faces: 7,
        edges: 12,
        vertices: 7,
        euler: '7 - 12 + 7 = 2',
        description: '중앙 다각형 둘레에 배치된 이등변삼각형 날개들이 실의 수직 인장력에 의해 상단 한 점으로 모여 환상적인 3D 돔(Dome)과 텐트 구조를 이룹니다.'
      }
    };
  }

  // ==========================================
  // 4. 3D WebGL 시뮬레이터 관리 클래스
  // ==========================================
  class PolyhedronSimulator {
    constructor(canvasContainerId) {
      this.container = document.getElementById(canvasContainerId);
      if (!this.container) throw new Error(`Container #${canvasContainerId} not found`);

      this.progress = 0;
      this.currentModel = null;
      this.currentShapeId = 'cube';
      this.isWireframe = false;
      this.activePaintColor = null;

      this.initScene();
      this.initLights();
      this.initControls();
      this.initHelpers();
      this.initRaycaster();

      this.loadShape('cube');
      this.animate();

      window.addEventListener('resize', () => this.onResize());
    }

    initScene() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xf8fafc);

      const width = this.container.clientWidth;
      const height = this.container.clientHeight || 500;

      this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      this.camera.position.set(4.5, 4.8, 6.0);

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      if (THREE.sRGBEncoding) {
        this.renderer.outputEncoding = THREE.sRGBEncoding;
      }

      this.container.appendChild(this.renderer.domElement);
    }

    initLights() {
      this.scene.add(new THREE.AmbientLight(0xffffff, 0.88));

      const dirLight = new THREE.DirectionalLight(0xffffff, 1.25);
      dirLight.position.set(9, 14, 9);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.bias = -0.0005;
      this.scene.add(dirLight);

      const fillLight = new THREE.DirectionalLight(0xe0e7ff, 0.45);
      fillLight.position.set(-9, 7, -9);
      this.scene.add(fillLight);
    }

    initControls() {
      const ControlsClass = THREE.OrbitControls || window.OrbitControls;
      this.controls = new ControlsClass(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.08;
      this.controls.maxPolarAngle = Math.PI / 2 + 0.05;
      this.controls.minDistance = 2;
      this.controls.maxDistance = 20;
      this.controls.target.set(0, 0.8, 0);
    }

    initHelpers() {
      const grid = new THREE.GridHelper(16, 32, 0x94a3b8, 0xe2e8f0);
      grid.position.y = 0;
      this.scene.add(grid);

      const floor = new THREE.Mesh(new THREE.PlaneGeometry(32, 32), new THREE.ShadowMaterial({ opacity: 0.12 }));
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -0.005;
      floor.receiveShadow = true;
      this.scene.add(floor);
    }

    initRaycaster() {
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();

      this.renderer.domElement.addEventListener('pointerdown', (e) => {
        if (!this.activePaintColor) return;
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        if (this.currentModel && this.currentModel.group) {
          const intersects = this.raycaster.intersectObjects(this.currentModel.group.children, true);
          for (const hit of intersects) {
            if (hit.object.isMesh && hit.object.material && hit.object.geometry && !hit.object.geometry.type.includes('Torus') && !hit.object.geometry.type.includes('Box')) {
              hit.object.material = hit.object.material.clone();
              hit.object.material.color.set(this.activePaintColor);
              hit.object.material.map = null;
              hit.object.material.needsUpdate = true;
              break;
            }
          }
        }
      });
    }

    loadShape(shapeId) {
      if (this.currentModel) {
        this.scene.remove(this.currentModel.group);
        this.currentModel = null;
      }

      this.currentShapeId = shapeId;

      switch (shapeId) {
        case 'cube':
          this.currentModel = createCubeModel();
          break;
        case 'prism':
          this.currentModel = createPrismModel();
          break;
        case 'cylinder':
          this.currentModel = createCylinderModel();
          break;
        case 'dome':
          this.currentModel = createStarDomeModel();
          break;
        default:
          this.currentModel = createCubeModel();
      }

      this.scene.add(this.currentModel.group);
      this.setProgress(this.progress);
      return this.currentModel.meta;
    }

    setProgress(t) {
      this.progress = Math.max(0, Math.min(1, t));
      if (this.currentModel && typeof this.currentModel.update === 'function') {
        this.currentModel.update(this.progress);
      }
    }

    setCameraView(viewType) {
      switch (viewType) {
        case 'top':
          this.camera.position.set(0, 9.2, 0.001);
          this.controls.target.set(0, 0, 0);
          break;
        case 'front':
          this.camera.position.set(0, 1.8, 7.5);
          this.controls.target.set(0, 1, 0);
          break;
        case 'iso':
        default:
          this.camera.position.set(4.5, 4.8, 6.0);
          this.controls.target.set(0, 0.8, 0);
          break;
      }
      this.controls.update();
    }

    toggleWireframe() {
      this.isWireframe = !this.isWireframe;
      if (this.currentModel && this.currentModel.group) {
        this.currentModel.group.traverse((obj) => {
          if (obj.isMesh && obj.material) {
            obj.material.wireframe = this.isWireframe;
          }
        });
      }
      return this.isWireframe;
    }

    setPaintColor(color) {
      this.activePaintColor = color;
    }

    onResize() {
      if (!this.container) return;
      const width = this.container.clientWidth;
      const height = this.container.clientHeight || 500;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }

    animate() {
      requestAnimationFrame(() => this.animate());
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    }
  }

  // ==========================================
  // 5. 메인 애플리케이션 클래스 (UI 및 학습 태스크 바인딩)
  // ==========================================
  class App {
    constructor() {
      this.simulator = null;
      this.isPlaying = false;
      this.playSpeed = 0.008;
      this.animId = null;
      this.hasTriggeredConfetti = false;

      // 도형별 퀴즈 데이터
      this.quizzes = {
        cube: {
          question: '정육면체 전개도에서 "밑면 (1번 면)"과 마주보는(평행한) 면은 몇 번 면일까요?',
          options: ['2번 (앞면)', '3번 (뒷면)', '6번 (윗면 / 뚜껑)', '4번 (왼쪽면)'],
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
          options: ['바닥 각 모서리', '중앙 상단 한 점 (정점 / Apex)', '바깥쪽 사방으로 펼쳐짐', '서로 엇갈림'],
          correct: 1,
          explain: '정답입니다! 수직 당김줄에 의해 모든 삼각형 날개의 꼭짓점이 상단 한 점으로 모여 3D 돔을 형성합니다.'
        }
      };

      this.init();
    }

    init() {
      this.simulator = new PolyhedronSimulator('webgl-container');

      this.pullSlider = document.getElementById('pull-slider');
      this.pullValueDisplay = document.getElementById('pull-value-display');
      this.playPauseBtn = document.getElementById('btn-play-pause');
      this.resetBtn = document.getElementById('btn-reset');
      this.speedBtn = document.getElementById('btn-speed');

      this.bindSimulatorControls();
      this.bindShapeTabs();
      this.bindCameraViews();
      this.bindCoachingModes();
      this.bindPrintModal();
      this.bindChecklist();

      this.updateShapeInfo('cube');
    }

    bindSimulatorControls() {
      this.pullSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.updateProgress(val / 100);
        if (this.isPlaying) this.togglePlay(false);
      });

      this.playPauseBtn.addEventListener('click', () => {
        this.togglePlay(!this.isPlaying);
      });

      this.resetBtn.addEventListener('click', () => {
        this.togglePlay(false);
        this.updateProgress(0);
        this.hasTriggeredConfetti = false;
      });

      let isSlow = false;
      this.speedBtn.addEventListener('click', () => {
        isSlow = !isSlow;
        this.playSpeed = isSlow ? 0.003 : 0.008;
        this.speedBtn.textContent = isSlow ? '0.5x 슬로우' : '1.0x 표준';
      });

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
        window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
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

      document.getElementById('hud-faces').textContent = meta.faces;
      document.getElementById('hud-edges').textContent = meta.edges;
      document.getElementById('hud-vertices').textContent = meta.vertices;
      document.getElementById('hud-euler').textContent = meta.euler;

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

      this.loadQuiz(this.simulator.currentShapeId);

      const stepBtns = document.querySelectorAll('.observe-step-btn');
      stepBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const step = parseFloat(btn.dataset.step);
          this.updateProgress(step);
        });
      });

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

  // DOM 준비 시 앱 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.app = new App();
    });
  } else {
    window.app = new App();
  }

})();
