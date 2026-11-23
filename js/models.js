/**
 * models.js
 * 4종 입체도형(정육면체, 삼각기둥, 원기둥, 별모양 다각뿔 돔)의 3D 지오메트리,
 * 계층적 피벗(Pivot) 폴딩 메커니즘, 실(String) 경로 및 수학적 메타데이터 정의
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

// 공통 재질 및 색상 팔레트
export const COLORS = {
  cube: {
    base: 0xffd166,
    face1: 0xffd166,
    face2: 0xf4a261,
    face3: 0xe76f51,
    face4: 0x2a9d8f,
    face5: 0x264653,
    highlight: 0xef476f,
    string: 0x2b2d42
  },
  prism: {
    base: 0x90e0ef,
    sides: 0x48cae4,
    triangles: 0x0096c7,
    string: 0xd90429
  },
  cylinder: {
    side: 0xe0aaff,
    caps: 0xc77dff,
    overlap: 0x9d4edd,
    string: 0x3a0ca3
  },
  dome: {
    base: 0x52b788,
    wings: 0x74c69d,
    apex: 0x40916c,
    string: 0xe63946
  }
};

/**
 * 텍스처 헬퍼: 면에 번호 및 라벨을 그려 캔버스 텍스처로 반환
 */
function createFaceTexture(text, subText = '', bgColor = '#ffffff', textColor = '#1e293b') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = bgColor;
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

  ctx.fillStyle = textColor;
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
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * 모서리 와이어 및 면 메쉬를 만드는 헬퍼
 */
function createPanelMesh(width, height, textureOrColor, doubleSided = true) {
  const geom = new THREE.PlaneGeometry(width, height);
  let mat;
  if (typeof textureOrColor === 'string' || textureOrColor instanceof THREE.Texture) {
    mat = new THREE.MeshStandardMaterial({
      map: textureOrColor,
      side: doubleSided ? THREE.DoubleSide : THREE.FrontSide,
      roughness: 0.6,
      metalness: 0.05
    });
  } else {
    mat = new THREE.MeshStandardMaterial({
      color: textureOrColor,
      side: doubleSided ? THREE.DoubleSide : THREE.FrontSide,
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

// 1. 정육면체 (Cube)
export function createCubeModel() {
  const group = new THREE.Group();
  const S = 2.4;
  const half = S / 2;

  const texBase = createFaceTexture('밑면 (Base)', '1번 면 (고정)', '#fef08a');
  const texFront = createFaceTexture('앞면', '2번 면', '#fed7aa');
  const texBack = createFaceTexture('뒷면', '3번 면 (마주봄)', '#fed7aa');
  const texLeft = createFaceTexture('왼쪽면', '4번 면', '#bbf7d0');
  const texRight = createFaceTexture('오른쪽면', '5번 면 (마주봄)', '#bbf7d0');
  const texTop = createFaceTexture('윗면 (Top)', '6번 면 (마주봄)', '#fef08a');

  const baseMesh = createPanelMesh(S, S, texBase);
  baseMesh.rotation.x = -Math.PI / 2;
  baseMesh.position.set(0, 0.01, 0);
  group.add(baseMesh);

  const pivotFront = new THREE.Group();
  pivotFront.position.set(0, 0.01, half);
  const meshFront = createPanelMesh(S, S, texFront);
  meshFront.rotation.x = -Math.PI / 2;
  meshFront.position.set(0, 0, half);
  pivotFront.add(meshFront);
  group.add(pivotFront);

  const pivotBack = new THREE.Group();
  pivotBack.position.set(0, 0.01, -half);
  const meshBack = createPanelMesh(S, S, texBack);
  meshBack.rotation.x = -Math.PI / 2;
  meshBack.position.set(0, 0, -half);
  pivotBack.add(meshBack);
  group.add(pivotBack);

  const pivotLeft = new THREE.Group();
  pivotLeft.position.set(-half, 0.01, 0);
  const meshLeft = createPanelMesh(S, S, texLeft);
  meshLeft.rotation.x = -Math.PI / 2;
  meshLeft.position.set(-half, 0, 0);
  pivotLeft.add(meshLeft);
  group.add(pivotLeft);

  const pivotRight = new THREE.Group();
  pivotRight.position.set(half, 0.01, 0);
  const meshRight = createPanelMesh(S, S, texRight);
  meshRight.rotation.x = -Math.PI / 2;
  meshRight.position.set(half, 0, 0);
  pivotRight.add(meshRight);
  group.add(pivotRight);

  const pivotTop = new THREE.Group();
  pivotTop.position.set(0, 0, -S);
  const meshTop = createPanelMesh(S, S, texTop);
  meshTop.rotation.x = -Math.PI / 2;
  meshTop.position.set(0, 0, -half);
  pivotTop.add(meshTop);
  pivotBack.add(pivotTop);

  const stringGeom = new THREE.BufferGeometry();
  const stringLine = new THREE.Line(stringGeom, new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 3 }));
  group.add(stringLine);

  const pullTab = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.04, 0.38), new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
  pullTab.position.set(0, 0.02, half + S + 0.4);
  group.add(pullTab);

  const update = (t) => {
    const angle = (Math.PI / 2) * t;
    pivotFront.rotation.x = angle;
    pivotBack.rotation.x = -angle;
    pivotLeft.rotation.z = -angle;
    pivotRight.rotation.z = angle;
    pivotTop.rotation.x = -angle;

    pullTab.position.z = (half + S + 0.4) + t * 0.9;

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

// 2. 삼각기둥 (Triangular Prism)
export function createPrismModel() {
  const group = new THREE.Group();
  const A = 2.4;
  const H = 2.8;
  const halfA = A / 2;
  const halfH = H / 2;
  const triH = (Math.sqrt(3) / 2) * A;

  const baseMesh = createPanelMesh(A, H, createFaceTexture('중앙 옆면', '바닥 고정면', '#bae6fd'));
  baseMesh.rotation.x = -Math.PI / 2;
  baseMesh.position.set(0, 0.01, 0);
  group.add(baseMesh);

  const pivotLeft = new THREE.Group();
  pivotLeft.position.set(-halfA, 0.01, 0);
  const meshLeft = createPanelMesh(A, H, createFaceTexture('왼쪽 옆면', '지붕면', '#7dd3fc'));
  meshLeft.rotation.x = -Math.PI / 2;
  meshLeft.position.set(-halfA, 0, 0);
  pivotLeft.add(meshLeft);
  group.add(pivotLeft);

  const pivotRight = new THREE.Group();
  pivotRight.position.set(halfA, 0.01, 0);
  const meshRight = createPanelMesh(A, H, createFaceTexture('오른쪽 옆면', '지붕면', '#7dd3fc'));
  meshRight.rotation.x = -Math.PI / 2;
  meshRight.position.set(halfA, 0, 0);
  pivotRight.add(meshRight);
  group.add(pivotRight);

  function createTriangleMesh(label) {
    const shape = new THREE.Shape();
    shape.moveTo(-halfA, 0);
    shape.lineTo(halfA, 0);
    shape.lineTo(0, triH);
    shape.closePath();

    const geom = new THREE.ShapeGeometry(shape);
    const mat = new THREE.MeshStandardMaterial({ color: 0x0284c7, side: THREE.DoubleSide, roughness: 0.5 });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geom), new THREE.LineBasicMaterial({ color: 0x082f49, linewidth: 2 })));
    return mesh;
  }

  const pivotFront = new THREE.Group();
  pivotFront.position.set(0, 0.01, halfH);
  const frontTri = createTriangleMesh('앞 밑면');
  frontTri.rotation.x = -Math.PI / 2;
  pivotFront.add(frontTri);
  group.add(pivotFront);

  const pivotBack = new THREE.Group();
  pivotBack.position.set(0, 0.01, -halfH);
  const backTri = createTriangleMesh('뒤 밑면');
  backTri.rotation.x = -Math.PI / 2;
  backTri.rotation.z = Math.PI;
  pivotBack.add(backTri);
  group.add(pivotBack);

  const stringGeom = new THREE.BufferGeometry();
  const stringLine = new THREE.Line(stringGeom, new THREE.LineBasicMaterial({ color: 0xd90429, linewidth: 3 }));
  group.add(stringLine);

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

// 3. 원기둥 (Cylinder)
export function createCylinderModel() {
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
  sideTex.colorSpace = THREE.SRGBColorSpace;

  const sideMesh = new THREE.Mesh(planeGeom, new THREE.MeshStandardMaterial({ map: sideTex, side: THREE.DoubleSide, roughness: 0.5 }));
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
  group.add(new THREE.Line(stringGeom, new THREE.LineBasicMaterial({ color: 0x7e22ce, linewidth: 3 })));

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

// 4. 별 모양 다각뿔 돔 (Star Dome)
export function createStarDomeModel() {
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
