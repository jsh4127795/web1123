/**
 * simulator.js
 * Three.js 씬 관리, 카메라 제어, 모델 로드 및 실시간 PULL 슬라이더 인터랙션 엔진
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import {
  createCubeModel,
  createPrismModel,
  createCylinderModel,
  createStarDomeModel
} from './models.js';

export class PolyhedronSimulator {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container) throw new Error(`Container #${canvasContainerId} not found`);

    this.progress = 0; // 0 (평면) ~ 1 (완전 접힘)
    this.currentModel = null;
    this.currentShapeId = 'cube';
    this.isWireframe = false;
    this.activePaintColor = null; // 색칠하기 모드

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
    this.scene.background = new THREE.Color(0xf8fafc); // 소프트 슬레이트 백그라운드

    const width = this.container.clientWidth;
    const height = this.container.clientHeight || 500;

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(4, 5, 6);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    this.container.appendChild(this.renderer.domElement);
  }

  initLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(8, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.0005;
    this.scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xe0e7ff, 0.4);
    fillLight.position.set(-8, 6, -8);
    this.scene.add(fillLight);
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.05; // 바닥 아래로 안 내려가게
    this.controls.minDistance = 2;
    this.controls.maxDistance = 20;
    this.controls.target.set(0, 0.8, 0);
  }

  initHelpers() {
    // 바닥 그리드 (책상 또는 스케치북 지지대 느낌)
    const grid = new THREE.GridHelper(14, 28, 0x94a3b8, 0xe2e8f0);
    grid.position.y = 0;
    this.scene.add(grid);

    // 그림자 수신용 바닥 평면
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.12 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.005;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  initRaycaster() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.renderer.domElement.addEventListener('pointerdown', (e) => {
      if (!this.activePaintColor) return; // 색칠 모드가 아니면 통과

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
            hit.object.material.map = null; // 단색으로 칠하기
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
      case 'top': // 2D 평면 전개도 뷰
        this.camera.position.set(0, 8.5, 0.001);
        this.controls.target.set(0, 0, 0);
        break;
      case 'front': // 정면 뷰
        this.camera.position.set(0, 1.8, 7);
        this.controls.target.set(0, 1, 0);
        break;
      case 'iso': // 기본 입체 뷰
      default:
        this.camera.position.set(4, 4.5, 5.5);
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
