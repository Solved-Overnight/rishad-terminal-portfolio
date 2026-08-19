import * as THREE from 'three';
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint, RigidBodyProps } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { useControls, Leva, folder } from 'leva';
import QRCode from 'qrcode';

extend({ MeshLineGeometry, MeshLineMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: any;
      meshLineMaterial: any;
    }
  }
}

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: any;
    meshLineMaterial: any;
  }
}

useGLTF.preload('https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb');
useTexture.preload('https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg');

function useDynamicCardTexture(baseMap: THREE.Texture | null) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const W = 4096;
    const H = 4096;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const drawCard = (avatarImg?: HTMLImageElement, qrCanvas?: HTMLCanvasElement) => {
      ctx.save();
      ctx.clearRect(0, 0, W, H);
      ctx.scale(2, 2); // Render at 2x HD crisp resolution
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw base baked texture atlas if available
      if (baseMap && baseMap.image) {
        ctx.drawImage(baseMap.image, 0, 0, 2048, 2048);
      } else {
        ctx.fillStyle = '#0a0a0c';
        ctx.fillRect(0, 0, 2048, 2048);
      }

      // Helper rounded rect
      function roundRect(x: number, y: number, w: number, h: number, radius: number, fill: string | null, stroke: string | null, strokeWidth = 1) {
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(x, y, w, h, radius);
        } else {
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + w - radius, y);
          ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
          ctx.lineTo(x + w, y + h - radius);
          ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
          ctx.lineTo(x + radius, y + h);
          ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.closePath();
        }
        if (fill) {
          ctx.fillStyle = fill;
          ctx.fill();
        }
        if (stroke) {
          ctx.strokeStyle = stroke;
          ctx.lineWidth = strokeWidth;
          ctx.stroke();
        }
      }

      // Helper to draw cover-cropped centered image with zoom to eliminate blank margins
      function drawCoverImage(img: HTMLImageElement, x: number, y: number, w: number, h: number, zoom = 1.18) {
        const imgAspect = img.width / img.height;
        const boxAspect = w / h;
        let sx = 0, sy = 0, sw = img.width, sh = img.height;
        if (imgAspect > boxAspect) {
          sw = img.height * boxAspect;
          sx = (img.width - sw) / 2;
        } else {
          sh = img.width / boxAspect;
          sy = (img.height - sh) / 2;
        }
        // Apply zoom to crop tighter into the image, completely removing top/left blank edges
        const zoomSw = sw / zoom;
        const zoomSh = sh / zoom;
        const zoomSx = sx + (sw - zoomSw) / 2;
        const zoomSy = sy + (sh - zoomSh) / 2;

        ctx.drawImage(img, zoomSx, zoomSy, zoomSw, zoomSh, x, y, w, h);
      }

      // ==========================================
      // FRONT FACE (UV Rect: x:0, y:0, w:1024, h:1546)
      // ==========================================
      const ox = 0;
      const cardW = 1024;
      const cardH = 1546;

      // Card Background Gradient
      const grad = ctx.createLinearGradient(ox, 0, ox + cardW, cardH);
      grad.addColorStop(0, '#1c1c24');
      grad.addColorStop(0.4, '#121218');
      grad.addColorStop(1, '#08080a');
      ctx.fillStyle = grad;
      ctx.fillRect(ox, 0, cardW, cardH);

      // Top Clip Cutout Slot - Vibrant Orange
      roundRect(ox + 442, -30, 140, 70, 24, '#ff5500', '#ff8800', 5);

      // 1. Top Left Badge 'R'
      roundRect(ox + 90, 100, 108, 108, 24, '#181822', 'rgba(255, 255, 255, 0.35)', 4);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 72px "Fira Code", monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('R', ox + 90 + 54, 100 + 54);

      // 2. Top Right Text 'm.rishad'
      ctx.fillStyle = '#e4e4e7';
      ctx.font = '700 44px "Fira Code", monospace, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText('m.rishad', ox + 934, 154);

      // 3. Center Profile Photo
      const pw = 580;
      const ph = 580;
      const px = ox + (cardW - pw) / 2;
      const py = 250;
      const pr = 44;

      // Dark background fill behind photo container
      roundRect(px, py, pw, ph, pr, '#141418', null);

      if (avatarImg) {
        ctx.save();
        roundRect(px, py, pw, ph, pr, null, null);
        ctx.clip();
        // Slightly bleed 4px past clip path to eliminate any edge gaps at top/left/right/bottom
        drawCoverImage(avatarImg, px - 4, py - 4, pw + 8, ph + 8);
        ctx.restore();
      }

      // Photo border overlay
      roundRect(px, py, pw, ph, pr, null, 'rgba(255, 255, 255, 0.35)', 4);

      // 4. Name 'M. Rishad' (Positioned lower as requested)
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 96px "Fira Code", monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('M. Rishad', ox + 512, 960);

      // 5. Role Badge 'AI & ML Engineer' (Positioned lower as requested, perfectly centered)
      const roleText = 'AI & ML Engineer';
      ctx.font = '700 42px "Fira Code", monospace, sans-serif';
      const textMetrics = ctx.measureText(roleText);
      const textWidth = textMetrics.width;
      const pillW = textWidth + 104;
      const pillH = 88;
      const pillX = ox + 512 - pillW / 2;
      const pillY = 1030;

      roundRect(pillX, pillY, pillW, pillH, 44, '#0d3311', '#2f9638', 4);
      ctx.fillStyle = '#3bf822';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(roleText, ox + 512, pillY + pillH / 2 + 14);

      // 6. Divider Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(ox + 90, 1220);
      ctx.lineTo(ox + 934, 1220);
      ctx.stroke();

      // 7. Footer Section
      // Left: JOIN DATE / Oct 2023
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '700 28px "Fira Code", monospace, sans-serif';
      ctx.fillText('JOIN DATE', ox + 90, 1275);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 52px "Fira Code", monospace, sans-serif';
      ctx.fillText('Oct 2023', ox + 90, 1340);

      // Center: QR Code
      const qrBoxSize = 144;
      const qrX = ox + 512 - qrBoxSize / 2;
      const qrY = 1250;
      roundRect(qrX, qrY, qrBoxSize, qrBoxSize, 28, '#18181b', 'rgba(255, 255, 255, 0.35)', 4);
      if (qrCanvas) {
        ctx.drawImage(qrCanvas, qrX + 16, qrY + 16, 112, 112);
      }

      // Right: Barcode & ID
      const bx = ox + 744;
      const by = 1250;
      ctx.fillStyle = '#FFFFFF';
      const barHeights = [56, 40, 56, 56, 32, 56, 40, 56, 56, 32, 56, 56, 40, 56, 56, 32, 56, 40];
      let currX = bx;
      for (let i = 0; i < barHeights.length; i++) {
        const w = (i % 3 === 0) ? 6 : 3;
        ctx.fillRect(currX, by + (56 - barHeights[i]) / 2, w, barHeights[i]);
        currX += w + 5;
      }

      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 38px "Fira Code", monospace, sans-serif';
      ctx.fillText('ID: 948382', ox + 934, 1340);


      // ==========================================
      // BACK FACE (UV Rect: x:1024, y:0, w:1024, h:1550)
      // ==========================================
      const bxOffset = 1024;

      // Background
      const backGrad = ctx.createLinearGradient(bxOffset, 0, bxOffset + 1024, cardH);
      backGrad.addColorStop(0, '#18181e');
      backGrad.addColorStop(0.5, '#101014');
      backGrad.addColorStop(1, '#08080a');
      ctx.fillStyle = backGrad;
      ctx.fillRect(bxOffset, 0, 1024, cardH);

      // Top Clip Cutout Slot
      roundRect(bxOffset + 442, -30, 140, 70, 24, '#050507', '#282830', 4);

      // Magnetic Stripe
      ctx.fillStyle = '#0a0a0d';
      ctx.fillRect(bxOffset, 100, 1024, 180);

      // Back Monogram & Header
      roundRect(bxOffset + 90, 360, 104, 104, 20, '#1c1c24', 'rgba(255,255,255,0.35)', 3);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 60px "Fira Code", monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('R', bxOffset + 142, 360 + 52);

      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = '700 44px "Fira Code", monospace, sans-serif';
      ctx.fillText('MONIRUZZAMAN RISHAD', bxOffset + 230, 392);
      ctx.fillStyle = '#3bf822';
      ctx.font = '700 30px "Fira Code", monospace, sans-serif';
      ctx.fillText('AI & ML ENGINEER', bxOffset + 230, 436);

      // Divider
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(bxOffset + 90, 510);
      ctx.lineTo(bxOffset + 934, 510);
      ctx.stroke();

      // Contact Info
      const infoY = 580;
      const items = [
        { label: 'EMAIL', val: 'hello@rishadhabib.me' },
        { label: 'GITHUB', val: 'github.com/Solved-Overnight' },
        { label: 'LINKEDIN', val: 'linkedin.com/in/mzrishad' },
        { label: 'WEBSITE', val: 'https://rishadhabib.me' }
      ];

      items.forEach((item, idx) => {
        const y = infoY + idx * 120;
        ctx.fillStyle = '#a1a1aa';
        ctx.font = '700 26px "Fira Code", monospace, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.label, bxOffset + 90, y);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '700 34px "Fira Code", monospace, sans-serif';
        ctx.fillText(item.val, bxOffset + 90, y + 36);
      });

      // Hologram Chip
      const chipX = bxOffset + 754;
      const chipY = 580;
      const chipG = ctx.createLinearGradient(chipX, chipY, chipX + 170, chipY + 130);
      chipG.addColorStop(0, '#d4af37');
      chipG.addColorStop(0.5, '#fff2a1');
      chipG.addColorStop(1, '#aa820a');
      roundRect(chipX, chipY, 170, 130, 16, chipG, '#967200', 3);

      // Bottom Notice
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '700 26px "Fira Code", monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PROPERTY OF M. RISHAD • AUTHORIZED ACCESS ONLY', bxOffset + 512, 1460);

      ctx.restore();
    };

    // Draw initial layout
    drawCard();

    // Create THREE CanvasTexture
    const tex = new THREE.CanvasTexture(canvas);
    tex.flipY = false;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = 16;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    setTexture(tex);

    // Generate QR Code and load photo
    const qrCanvas = document.createElement('canvas');
    qrCanvas.width = 600;
    qrCanvas.height = 600;

    let qrReady = false;
    let imgReady = false;

    const qrUrl = (typeof window !== 'undefined' && window.location.origin && window.location.origin.startsWith('http')) 
      ? window.location.origin 
      : 'https://rishadhabib.me/';

    QRCode.toCanvas(qrCanvas, qrUrl, {
      width: 600,
      margin: 0,
      color: { dark: '#ffffff', light: '#18181b' },
      errorCorrectionLevel: 'M'
    }).then(() => {
      qrReady = true;
      updateTexture();
    }).catch(console.error);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/id_photo.png';
    img.onload = () => {
      imgReady = true;
      updateTexture();
    };
    img.onerror = () => {
      // Fallback if id_photo is missing
      const fallbackImg = new Image();
      fallbackImg.crossOrigin = 'anonymous';
      fallbackImg.src = '/id_card_user_reference.png';
      fallbackImg.onload = () => {
        imgReady = true;
        updateTexture();
      };
    };

    function updateTexture() {
      drawCard(imgReady ? img : undefined, qrReady ? qrCanvas : undefined);
      tex.needsUpdate = true;
    }

  }, [baseMap]);

  return texture;
}

function useBandTexture() {
  const [bandTex] = useState<THREE.CanvasTexture>(() => {
    const W = 2048;
    const H = 128;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Dark sleek lanyard strap background
      ctx.fillStyle = '#0c0c12';
      ctx.fillRect(0, 0, W, H);

      // Subtle fabric weave pattern
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 2;
      for (let x = 0; x < W; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }

      // Top & bottom orange accent edges on strap
      ctx.fillStyle = '#ff5500';
      ctx.fillRect(0, 0, W, 4);
      ctx.fillRect(0, H - 4, W, 4);

      // Clean, well-spaced repeating text "SOLVED OVERNIGHT"
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 50px "Fira Code", monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const text = '✦  SOLVED OVERNIGHT  ✦';
      const numRepeats = 3;
      const step = W / numRepeats;

      for (let i = 0; i < numRepeats; i++) {
        const cx = step * i + step / 2;
        ctx.fillText(text, cx, H / 2 + 2);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 16;
    tex.needsUpdate = true;
    return tex;
  });

  return bandTex;
}

export default function IdCard() {
  const { debugColliders, gravityY, minSpeed, maxSpeed, clearcoat, clearcoatRoughness, roughness, metalness, ambientIntensity, lightformerIntensity } = useControls({
    'Physics & Colliders': folder({
      debugColliders: { value: false, label: 'Debug Colliders' },
      gravityY: { value: -40, min: -100, max: 0, step: 1, label: 'Gravity Y' },
      minSpeed: { value: 10, min: 1, max: 50, step: 1, label: 'Min Lerp Speed' },
      maxSpeed: { value: 50, min: 10, max: 150, step: 5, label: 'Max Lerp Speed' },
    }),
    'Card Material': folder({
      clearcoat: { value: 1, min: 0, max: 1, step: 0.05, label: 'Clearcoat' },
      clearcoatRoughness: { value: 0.15, min: 0, max: 1, step: 0.05, label: 'Clearcoat Roughness' },
      roughness: { value: 0.3, min: 0, max: 1, step: 0.05, label: 'Roughness' },
      metalness: { value: 0.2, min: 0, max: 1, step: 0.05, label: 'Metalness' },
    }),
    'Lighting': folder({
      ambientIntensity: { value: Math.PI, min: 0, max: 10, step: 0.1, label: 'Ambient Intensity' },
      lightformerIntensity: { value: 3, min: 0, max: 20, step: 0.5, label: 'Lightformer Intensity' },
    })
  });

  return (
    <div className="w-full h-full relative flex items-center justify-center bg-transparent">
      <Leva titleBar={{ title: '⚙️ ID Card Debug Panel' }} collapsed />
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', precision: 'highp' }}
        dpr={[1.5, 3]}
        camera={{ position: [0, 0, 12], fov: 25 }}
      >
        <ambientLight intensity={ambientIntensity} />
        <Physics debug={debugColliders} interpolate gravity={[0, gravityY, 0]} timeStep={1 / 60}>
          <Band
            minSpeed={minSpeed}
            maxSpeed={maxSpeed}
            clearcoat={clearcoat}
            clearcoatRoughness={clearcoatRoughness}
            roughness={roughness}
            metalness={metalness}
          />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={lightformerIntensity * 0.66} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={lightformerIntensity} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={lightformerIntensity} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={lightformerIntensity * 3.33} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({
  maxSpeed = 50,
  minSpeed = 10,
  clearcoat = 1,
  clearcoatRoughness = 0.15,
  roughness = 0.3,
  metalness = 0.2
}: {
  maxSpeed?: number;
  minSpeed?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  roughness?: number;
  metalness?: number;
}) {
  const band = useRef<any>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps: RigidBodyProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 2, linearDamping: 2 };
  const { nodes, materials } = useGLTF('https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb') as any;
  const texture = useTexture('https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg');
  
  // Use ultra-crisp dynamic code-rendered canvas texture
  const cardTexture = useDynamicCardTexture(materials?.base?.map || null);
  const customBandTexture = useBandTexture();

  const { width, height } = useThree((state) => state.size);
  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]);
    c.curveType = 'chordal';
    return c;
  });
  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, -0.05]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current && card.current && j1.current && j2.current) {
      // Fix jitter on physics joints j1, j2 without initial flick/stretching
      [j1, j2].forEach((ref) => {
        const trans = ref.current.translation();
        if (!ref.current.lerped) {
          ref.current.lerped = new THREE.Vector3().copy(trans);
        }
        const dist = ref.current.lerped.distanceTo(trans);
        if (dist > 0.6) {
          // Snap directly if initial drop or large offset to eliminate flicking
          ref.current.lerped.copy(trans);
        } else {
          const clampedDistance = Math.max(0.1, Math.min(1, dist));
          ref.current.lerped.lerp(trans, delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
        }
      });

      // Calculate exact world anchor on card for the top clip hole (accounting for card translation & rotation)
      const cardPos = card.current.translation();
      const cardRot = card.current.rotation();
      const q = new THREE.Quaternion(cardRot.x, cardRot.y, cardRot.z, cardRot.w);
      const clampWorldPos = new THREE.Vector3(0, 1.45, -0.05).applyQuaternion(q).add(cardPos);

      // Calculate catmull curve points anchored precisely to the clamp world position
      curve.points[0].copy(clampWorldPos);
      curve.points[1].copy(j2.current.lerped || j2.current.translation());
      curve.points[2].copy(j1.current.lerped || j1.current.translation());
      curve.points[3].copy(fixed.current.translation());
      if (band.current?.geometry) {
        band.current.geometry.setPoints(curve.getPoints(32));
      }

      // Tilt it back towards the screen smoothly
      ang.copy(card.current.angvel());
      const euler = new THREE.Euler().setFromQuaternion(q);
      card.current.setAngvel({ x: ang.x, y: ang.y - euler.y * 0.25, z: ang.z });
    }
  });

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 16;
  if (materials?.base?.map) {
    materials.base.map.anisotropy = 16;
  }

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0, -0.5, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -1.0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -1.5, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -2.95, 0.05]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: any) => {
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
              window.dispatchEvent(new CustomEvent('refocus-terminal'));
            }}
            onPointerDown={(e: any) => (e.target.setPointerCapture(e.pointerId), drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation()))))}>
            <mesh geometry={nodes.card.geometry}>
              {cardTexture && (
                <meshPhysicalMaterial
                  map={cardTexture}
                  map-anisotropy={16}
                  clearcoat={clearcoat}
                  clearcoatRoughness={clearcoatRoughness}
                  roughness={roughness}
                  metalness={metalness}
                />
              )}
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={true}
          depthWrite={false}
          transparent={true}
          resolution={[width, height]}
          useMap
          map={customBandTexture || texture}
          repeat={[-1.2, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}

