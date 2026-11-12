import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ProductVariant } from '../types';
import { Move3d } from 'lucide-react';

interface Product3DViewerProps {
  currentVariant: ProductVariant;
  scrollProgress?: number; // 0 to 1
  onVariantChange?: (variant: ProductVariant) => void;
  onBuyClick?: () => void;
}

export const Product3DViewer: React.FC<Product3DViewerProps> = ({
  currentVariant,
  scrollProgress = 0,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // References for Three.js state
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const bodyMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const capMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const buttonHousingMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const windowFrameMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // Dynamic rotation state with silky damping
  const manualRotY = useRef(0);
  const manualRotX = useRef(0.20); // 11.5 degree downward viewing angle showing top grille & front
  const targetRotY = useRef(0);
  const targetRotX = useRef(0.20);
  const isDragging = useRef(false);
  const prevMouseX = useRef(0);
  const prevMouseY = useRef(0);

  // Update target rotation when page scrollProgress changes
  useEffect(() => {
    if (!isDragging.current) {
      // Exactly one continuous 360-degree rotation synchronized with scroll
      targetRotY.current = scrollProgress * Math.PI * 2 + manualRotY.current;
    }
  }, [scrollProgress]);

  // Update physical materials when variant changes
  useEffect(() => {
    const isBlack = currentVariant === 'black';

    if (bodyMaterialRef.current) {
      if (isBlack) {
        // Original dark metallic silver / gunmetal finish
        bodyMaterialRef.current.color.setHex(0x3e4147);
        bodyMaterialRef.current.metalness = 0.88;
        bodyMaterialRef.current.roughness = 0.20;
        bodyMaterialRef.current.clearcoat = 0.25;
      } else {
        // Original pearl white / silver finish
        bodyMaterialRef.current.color.setHex(0xf0f2f5);
        bodyMaterialRef.current.metalness = 0.48;
        bodyMaterialRef.current.roughness = 0.25;
        bodyMaterialRef.current.clearcoat = 0.35;
      }
    }

    if (capMaterialRef.current) {
      if (isBlack) {
        capMaterialRef.current.color.setHex(0x32353a);
        capMaterialRef.current.metalness = 0.85;
        capMaterialRef.current.roughness = 0.22;
      } else {
        capMaterialRef.current.color.setHex(0xf5f7fa);
        capMaterialRef.current.metalness = 0.42;
        capMaterialRef.current.roughness = 0.27;
      }
    }

    if (buttonHousingMaterialRef.current) {
      if (isBlack) {
        // Titanium silver-gray matte housing
        buttonHousingMaterialRef.current.color.setHex(0x5a5d64);
        buttonHousingMaterialRef.current.roughness = 0.35;
        buttonHousingMaterialRef.current.metalness = 0.40;
      } else {
        // Contrasting dark charcoal matte housing
        buttonHousingMaterialRef.current.color.setHex(0x222428);
        buttonHousingMaterialRef.current.roughness = 0.40;
        buttonHousingMaterialRef.current.metalness = 0.25;
      }
    }

    if (windowFrameMaterialRef.current) {
      if (isBlack) {
        windowFrameMaterialRef.current.color.setHex(0x4a4d53);
        windowFrameMaterialRef.current.metalness = 0.8;
      } else {
        windowFrameMaterialRef.current.color.setHex(0xe5e7eb);
        windowFrameMaterialRef.current.metalness = 0.4;
      }
    }
  }, [currentVariant]);

  // Scene Setup & Exact Physical Modeling
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080808);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // Professional product photography perspective (low distortion FOV 34)
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 50);
    camera.position.set(0, 0.25, 5.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment Reflections using RoomEnvironment
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch {
      const ambFallback = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambFallback);
    }

    // Professional 3-Point Studio Lighting Rig with Subtle Gold Accent
    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.5);
    keyLight.position.set(3.2, 4.0, 3.5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe8f0fe, 1.2);
    fillLight.position.set(-3.2, 2.2, 2.8);
    scene.add(fillLight);

    // Overhead gold-accented rim light accentuating the circular top grille
    const rimLight = new THREE.DirectionalLight(0xfff5e0, 2.2);
    rimLight.position.set(0, 4.5, -3.2);
    scene.add(rimLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x111111, 0.5);
    scene.add(hemiLight);

    // Central Model Group
    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;
    scene.add(modelGroup);

    // -------------------------------------------------------------
    // EXACT PRODUCT PHYSICAL RECONSTRUCTION
    // Proportions: Diameter = 72mm, Height = 165mm (Radius 0.72, Height 3.3)
    // -------------------------------------------------------------
    const bodyRadius = 0.72;
    const isBlack = currentVariant === 'black';

    // PBR Materials
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: isBlack ? 0x3e4147 : 0xf0f2f5,
      metalness: isBlack ? 0.88 : 0.48,
      roughness: isBlack ? 0.20 : 0.25,
      clearcoat: isBlack ? 0.25 : 0.35,
      clearcoatRoughness: 0.15,
    });
    bodyMaterialRef.current = bodyMaterial;

    const capMaterial = new THREE.MeshPhysicalMaterial({
      color: isBlack ? 0x32353a : 0xf5f7fa,
      metalness: isBlack ? 0.85 : 0.42,
      roughness: isBlack ? 0.22 : 0.27,
      clearcoat: 0.25,
    });
    capMaterialRef.current = capMaterial;

    const goldMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xc6a45b, // Luxury metallic gold (#C6A45B)
      metalness: 0.94,
      roughness: 0.16,
      clearcoat: 0.6,
      clearcoatRoughness: 0.1,
    });

    const champagneGrilleMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xc4a362,
      metalness: 0.86,
      roughness: 0.18,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.95,
    });

    const buttonHousingMaterial = new THREE.MeshStandardMaterial({
      color: isBlack ? 0x5a5d64 : 0x222428,
      roughness: isBlack ? 0.35 : 0.40,
      metalness: isBlack ? 0.40 : 0.25,
    });
    buttonHousingMaterialRef.current = buttonHousingMaterial;

    const windowFrameMaterial = new THREE.MeshStandardMaterial({
      color: isBlack ? 0x4a4d53 : 0xe5e7eb,
      metalness: isBlack ? 0.8 : 0.4,
      roughness: 0.3,
    });
    windowFrameMaterialRef.current = windowFrameMaterial;

    const seamMaterial = new THREE.MeshStandardMaterial({
      color: 0x18191b,
      roughness: 0.5,
      metalness: 0.2,
    });

    // 1. MAIN LOWER TANK CYLINDER (height: 2.15, y: -0.38)
    const tankHeight = 2.15;
    const tankGeo = new THREE.CylinderGeometry(bodyRadius, bodyRadius, tankHeight, 64, 1, false);
    const tankMesh = new THREE.Mesh(tankGeo, bodyMaterial);
    tankMesh.position.y = -0.38;
    tankMesh.castShadow = true;
    tankMesh.receiveShadow = true;
    modelGroup.add(tankMesh);

    // 2. HORIZONTAL SEPARATION SEAM (between cap and lower tank)
    const seamGeo = new THREE.CylinderGeometry(bodyRadius * 0.992, bodyRadius * 0.992, 0.024, 64);
    const seamMesh = new THREE.Mesh(seamGeo, seamMaterial);
    seamMesh.position.y = 0.70;
    modelGroup.add(seamMesh);

    // 3. UPPER CAP CYLINDER (height: 0.82, y: 1.11)
    const capHeight = 0.82;
    const capGeo = new THREE.CylinderGeometry(bodyRadius, bodyRadius, capHeight, 64, 1, false);
    const capMesh = new THREE.Mesh(capGeo, capMaterial);
    capMesh.position.y = 1.11;
    capMesh.castShadow = true;
    modelGroup.add(capMesh);

    // 4. LOWER BASE FILLET AND INSET PEDESTAL (cup-holder base)
    // Chamfered rounded fillet ring tapering down
    const filletGeo = new THREE.CylinderGeometry(bodyRadius, bodyRadius * 0.90, 0.20, 64);
    const filletMesh = new THREE.Mesh(filletGeo, bodyMaterial);
    filletMesh.position.y = -1.55;
    modelGroup.add(filletMesh);

    // Inset cup-holder foot ring
    const footGeo = new THREE.CylinderGeometry(bodyRadius * 0.89, bodyRadius * 0.88, 0.08, 64);
    const footMesh = new THREE.Mesh(footGeo, seamMaterial);
    footMesh.position.y = -1.69;
    modelGroup.add(footMesh);

    // 5. TOP RIM & DISTINCTIVE CIRCULAR VENTILATION GRILLE
    const topCapGroup = new THREE.Group();
    topCapGroup.position.y = 1.52;

    // Recessed dark interior plate beneath grille
    const interiorPlateGeo = new THREE.CylinderGeometry(bodyRadius * 0.95, bodyRadius * 0.95, 0.04, 48);
    const interiorPlate = new THREE.Mesh(
      interiorPlateGeo,
      new THREE.MeshStandardMaterial({ color: 0x111214, roughness: 0.6 })
    );
    topCapGroup.add(interiorPlate);

    // Outer circular bezel lip of cylinder top
    const outerBezelGeo = new THREE.TorusGeometry(bodyRadius * 0.94, 0.030, 16, 64);
    outerBezelGeo.rotateX(Math.PI / 2);
    const outerBezel = new THREE.Mesh(outerBezelGeo, champagneGrilleMaterial);
    outerBezel.position.y = 0.025;
    topCapGroup.add(outerBezel);

    // Central circular mist nozzle aperture (gold brass ring with inner chamfer)
    const nozzleOuterRadius = 0.18;
    const nozzleInnerRadius = 0.10;
    const nozzleRingGeo = new THREE.CylinderGeometry(nozzleOuterRadius, nozzleOuterRadius, 0.06, 32);
    const nozzleRing = new THREE.Mesh(nozzleRingGeo, goldMaterial);
    nozzleRing.position.y = 0.035;
    topCapGroup.add(nozzleRing);

    // Deep central nozzle orifice
    const orificeGeo = new THREE.CylinderGeometry(nozzleInnerRadius, nozzleInnerRadius, 0.08, 32);
    const orificeMesh = new THREE.Mesh(
      orificeGeo,
      new THREE.MeshBasicMaterial({ color: 0x050505 })
    );
    orificeMesh.position.y = 0.04;
    topCapGroup.add(orificeMesh);

    // Concentric mid-radius reinforcement ring (matching reference photo)
    const midRingGeo = new THREE.TorusGeometry(0.42, 0.018, 12, 48);
    midRingGeo.rotateX(Math.PI / 2);
    const midRing = new THREE.Mesh(midRingGeo, champagneGrilleMaterial);
    midRing.position.y = 0.028;
    topCapGroup.add(midRing);

    // 16 Exact Radial Faceted Grille Spokes with Snowflake V-branching
    const spokeCount = 16;
    for (let i = 0; i < spokeCount; i++) {
      const angle = (i / spokeCount) * Math.PI * 2;

      // Inner spoke segment: from central nozzle (r=0.18) to mid-ring (r=0.42)
      const innerLen = 0.24;
      const innerSpokeGeo = new THREE.BoxGeometry(0.024, 0.032, innerLen);
      const innerSpoke = new THREE.Mesh(innerSpokeGeo, champagneGrilleMaterial);
      const midDist = 0.18 + innerLen / 2;
      innerSpoke.position.set(
        Math.sin(angle) * midDist,
        0.03,
        Math.cos(angle) * midDist
      );
      innerSpoke.rotation.y = angle;
      topCapGroup.add(innerSpoke);

      // Outer V-fork branches: from mid-ring (r=0.42) to outer rim (r=0.68)
      // Bifurcated struts creating the authentic crystal snowflake ventilation motif
      const branchAngleOffset = 0.09;
      const branchLen = 0.28;
      const branchGeo = new THREE.BoxGeometry(0.020, 0.028, branchLen);

      // Branch 1
      const b1 = new THREE.Mesh(branchGeo, champagneGrilleMaterial);
      const bDist = 0.42 + branchLen / 2;
      b1.position.set(
        Math.sin(angle - branchAngleOffset) * bDist,
        0.028,
        Math.cos(angle - branchAngleOffset) * bDist
      );
      b1.rotation.y = angle - 0.24;
      topCapGroup.add(b1);

      // Branch 2
      const b2 = new THREE.Mesh(branchGeo, champagneGrilleMaterial);
      b2.position.set(
        Math.sin(angle + branchAngleOffset) * bDist,
        0.028,
        Math.cos(angle + branchAngleOffset) * bDist
      );
      b2.rotation.y = angle + 0.24;
      topCapGroup.add(b2);
    }
    modelGroup.add(topCapGroup);

    // 6. ORIGINAL FRONT POWER BUTTON & OVAL HOUSING
    const buttonGroup = new THREE.Group();
    buttonGroup.position.set(0, 1.15, bodyRadius * 0.985);

    // Oval / Stadium recessed housing
    const housingWidth = 0.38;
    const housingHeight = 0.17;
    const housingCenter = new THREE.BoxGeometry(housingWidth - housingHeight, housingHeight, 0.04);
    const housingCenterMesh = new THREE.Mesh(housingCenter, buttonHousingMaterial);
    buttonGroup.add(housingCenterMesh);

    // Rounded stadium caps
    const capSideGeo = new THREE.CylinderGeometry(housingHeight / 2, housingHeight / 2, 0.04, 24);
    capSideGeo.rotateX(Math.PI / 2);
    const capLeft = new THREE.Mesh(capSideGeo, buttonHousingMaterial);
    capLeft.position.x = -(housingWidth - housingHeight) / 2;
    buttonGroup.add(capLeft);

    const capRight = new THREE.Mesh(capSideGeo, buttonHousingMaterial);
    capRight.position.x = (housingWidth - housingHeight) / 2;
    buttonGroup.add(capRight);

    // Rectangular gold push button with rounded edges centered inside housing
    const btnGeo = new THREE.BoxGeometry(0.18, 0.095, 0.05);
    const btnMesh = new THREE.Mesh(btnGeo, goldMaterial);
    btnMesh.position.z = 0.015;
    buttonGroup.add(btnMesh);

    // Authentic subtle mist spray icon printed above button
    const iconCanvas = document.createElement('canvas');
    iconCanvas.width = 128;
    iconCanvas.height = 128;
    const iCtx = iconCanvas.getContext('2d')!;
    iCtx.strokeStyle = 'rgba(200, 205, 215, 0.85)';
    iCtx.lineWidth = 6;
    iCtx.lineCap = 'round';
    // 5 radiating fan lines
    for (let a = -0.55; a <= 0.55; a += 0.28) {
      iCtx.beginPath();
      iCtx.moveTo(64 + Math.sin(a) * 15, 85 - Math.cos(a) * 15);
      iCtx.lineTo(64 + Math.sin(a) * 50, 85 - Math.cos(a) * 50);
      iCtx.stroke();
    }
    const iconTex = new THREE.CanvasTexture(iconCanvas);
    const iconMat = new THREE.MeshBasicMaterial({
      map: iconTex,
      transparent: true,
      depthWrite: false,
    });
    const iconQuad = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.14), iconMat);
    iconQuad.position.set(0, 0.16, 0.015);
    buttonGroup.add(iconQuad);

    modelGroup.add(buttonGroup);

    // 7. LONG, NARROW TRANSPARENT WATER-LEVEL INSPECTION WINDOW
    // With authentic curved outline and lower fluted contour
    const windowGroup = new THREE.Group();
    windowGroup.position.set(0, -0.38, bodyRadius * 0.985);

    // Outer contour shape matching reference
    const winShape = new THREE.Shape();
    const halfW = 0.065;
    const topY = 0.72;
    const splitY = -0.65;
    const botY = -1.05;
    const flareW = 0.20;

    // Top semicircle arc
    winShape.absarc(0, topY, halfW, 0, Math.PI, false);
    // Left straight line down
    winShape.lineTo(-halfW, splitY);
    // Left curved flute flare reaching down to bottom edge
    winShape.quadraticCurveTo(-halfW * 1.1, splitY - 0.22, -flareW, botY);
    // Bottom edge
    winShape.lineTo(flareW, botY);
    // Right curved flute flare
    winShape.quadraticCurveTo(halfW * 1.1, splitY - 0.22, halfW, splitY);
    // Right straight line up
    winShape.lineTo(halfW, topY);

    const winExtrudeGeo = new THREE.ExtrudeGeometry(winShape, {
      depth: 0.035,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.015,
      bevelSegments: 4,
    });
    winExtrudeGeo.center();

    // Raised metallic frame contour
    const winFrameMesh = new THREE.Mesh(winExtrudeGeo, windowFrameMaterial);
    winFrameMesh.position.z = 0.008;
    windowGroup.add(winFrameMesh);

    // Inner translucent water-level inspection glass
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xe8f0f8,
      transmission: 0.75,
      roughness: 0.12,
      ior: 1.48,
      transparent: true,
      opacity: 0.82,
    });

    const innerWinShape = new THREE.Shape();
    const inHalfW = 0.045;
    const inTopY = 0.68;
    const inSplitY = -0.65;
    const inBotY = -0.98;
    const inFlareW = 0.15;

    innerWinShape.absarc(0, inTopY, inHalfW, 0, Math.PI, false);
    innerWinShape.lineTo(-inHalfW, inSplitY);
    innerWinShape.quadraticCurveTo(-inHalfW * 1.05, inSplitY - 0.20, -inFlareW, inBotY);
    innerWinShape.lineTo(inFlareW, inBotY);
    innerWinShape.quadraticCurveTo(inHalfW * 1.05, inSplitY - 0.20, inHalfW, inSplitY);
    innerWinShape.lineTo(inHalfW, inTopY);

    const innerGlassGeo = new THREE.ExtrudeGeometry(innerWinShape, {
      depth: 0.04,
      bevelEnabled: false,
    });
    innerGlassGeo.center();
    const glassMesh = new THREE.Mesh(innerGlassGeo, glassMaterial);
    glassMesh.position.z = 0.018;
    windowGroup.add(glassMesh);

    // Visible interior water level reflection column inside gauge
    const waterLevelMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 1.15, 0.02),
      new THREE.MeshStandardMaterial({
        color: 0xd0e8fa,
        roughness: 0.15,
        metalness: 0.2,
        transparent: true,
        opacity: 0.65,
      })
    );
    waterLevelMesh.position.set(0, -0.15, 0.005);
    windowGroup.add(waterLevelMesh);

    modelGroup.add(windowGroup);

    // 8. REAR USB POWER PORT & AUTHENTIC WHITE CABLE WITH USB-A CONNECTOR
    const rearPortGroup = new THREE.Group();
    rearPortGroup.position.set(0, 0.78, -bodyRadius * 0.985);

    // Recessed socket
    const socketGeo = new THREE.BoxGeometry(0.14, 0.07, 0.05);
    const socketMesh = new THREE.Mesh(socketGeo, seamMaterial);
    rearPortGroup.add(socketMesh);

    // White flexible cable emerging from rear socket and draping to the side
    const cableCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.55, -0.25, -0.35),
      new THREE.Vector3(1.15, -0.75, -0.05),
      new THREE.Vector3(1.48, -0.55, 0.25)
    );
    const cableGeo = new THREE.TubeGeometry(cableCurve, 40, 0.018, 12, false);
    const cableMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5f6f8,
      roughness: 0.35,
    });
    const cableMesh = new THREE.Mesh(cableGeo, cableMaterial);
    cableMesh.castShadow = true;
    rearPortGroup.add(cableMesh);

    // USB-A Terminal Plug
    const plugGroup = new THREE.Group();
    plugGroup.position.set(1.48, -0.55, 0.25);
    plugGroup.rotation.set(0.28, 0.85, -0.38);

    const plugBodyGeo = new THREE.BoxGeometry(0.11, 0.055, 0.22);
    const plugBody = new THREE.Mesh(plugBodyGeo, cableMaterial);
    plugGroup.add(plugBody);

    const plugShieldGeo = new THREE.BoxGeometry(0.085, 0.042, 0.12);
    const plugShield = new THREE.Mesh(
      plugShieldGeo,
      new THREE.MeshStandardMaterial({ color: 0xd8d8d8, metalness: 0.92, roughness: 0.18 })
    );
    plugShield.position.z = 0.15;
    plugGroup.add(plugShield);

    rearPortGroup.add(plugGroup);
    modelGroup.add(rearPortGroup);

    // 9. NATURAL CONTACT GROUNDING SHADOW
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d')!;
    const grad = sCtx.createRadialGradient(128, 128, 16, 128, 128, 120);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.70)');
    grad.addColorStop(0.35, 'rgba(0, 0, 0, 0.38)');
    grad.addColorStop(0.70, 'rgba(0, 0, 0, 0.10)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.74;
    scene.add(shadowPlane);

    // Window Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Smooth Animation Loop
    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (modelGroupRef.current) {
        // Smooth frame-rate independent exponential damping
        manualRotY.current += (targetRotY.current - manualRotY.current) * 0.085;
        manualRotX.current += (targetRotX.current - manualRotX.current) * 0.085;

        modelGroupRef.current.rotation.y = manualRotY.current;
        modelGroupRef.current.rotation.x = manualRotX.current;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
      }
    };
  }, [currentVariant]);

  // Simple Drag-to-Rotate Interaction (Only interaction permitted)
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    setHasInteracted(true);
    prevMouseX.current = e.clientX;
    prevMouseY.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - prevMouseX.current;
    const deltaY = e.clientY - prevMouseY.current;

    // Smooth 360 horizontal rotation and constrained natural vertical tilt
    targetRotY.current += deltaX * 0.008;
    targetRotX.current = Math.max(-0.05, Math.min(0.48, targetRotX.current + deltaY * 0.005));

    prevMouseX.current = e.clientX;
    prevMouseY.current = e.clientY;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none overflow-hidden bg-[#080808]">
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full h-[450px] sm:h-[540px] cursor-grab active:cursor-grabbing touch-none"
        title="Scroll down to rotate 360° or click and drag to inspect"
      />

      {/* Extremely Minimal Subtle Prompt Hint (fades out after first drag) */}
      {!hasInteracted && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs text-neutral-300 pointer-events-none transition-opacity duration-300">
          <Move3d className="w-3.5 h-3.5 text-[#C6A45B]" />
          <span>Scroll to rotate 360° · Drag to inspect</span>
        </div>
      )}
    </div>
  );
};
