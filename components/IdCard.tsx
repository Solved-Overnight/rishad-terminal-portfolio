import * as THREE from 'three';
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint, useRapier, RigidBodyProps } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { useControls, Leva, folder } from 'leva';
import QRCode from 'qrcode';
import { useTheme } from '../contexts/ThemeContext';
import { Theme } from '../utils/themes';

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

function useDynamicCardTexture(baseMap: THREE.Texture | null, theme: Theme) {
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
    (ctx as any).textRendering = 'geometricPrecision';
    (ctx as any).fontKerning = 'normal';

    const colors = theme.colors;
    const isDark = theme.isDark !== false;

    const drawCard = (avatarImg?: HTMLImageElement, qrCanvas?: HTMLCanvasElement) => {
      ctx.save();
      ctx.clearRect(0, 0, W, H);
      ctx.scale(2, 2); // Render at 2x crisp 4K resolution
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      (ctx as any).textRendering = 'geometricPrecision';

      // Draw base baked texture atlas if available
      if (baseMap && baseMap.image) {
        ctx.drawImage(baseMap.image as CanvasImageSource, 0, 0, 2048, 2048);
      } else {
        ctx.fillStyle = isDark ? '#08080b' : '#ffffff';
        ctx.fillRect(0, 0, 2048, 2048);
      }

      // Helper rounded rect
      function roundRect(x: number, y: number, w: number, h: number, radius: number, fill: string | CanvasGradient | CanvasPattern | null, stroke: string | null, strokeWidth = 1) {
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
      if (isDark) {
        grad.addColorStop(0, colors.dim);
        grad.addColorStop(1, colors.bg);
      } else {
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(1, colors.bg);
      }
      ctx.fillStyle = grad;
      ctx.fillRect(ox, 0, cardW, cardH);

      // Top Clip Cutout Slot
      roundRect(ox + 442, -30, 140, 70, 24, '#FF8C00', '#FF8C00', 4);

      // 1. Top Left Badge & Monogram
      roundRect(ox + 90, 100, 108, 108, 24, colors.dim, `${colors.primary}80`, 4);
      ctx.fillStyle = colors.primary;
      ctx.font = '700 68px "Fira Code", monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('R', ox + 144, 154);

      // 2. Top Right Text '@mzrishad'
      ctx.fillStyle = colors.textDim;
      ctx.font = '700 44px "Fira Code", monospace, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText('@mzrishad', ox + 934, 154);

      // 3. Center Profile Photo Container
      const pw = 580;
      const ph = 580;
      const px = ox + (cardW - pw) / 2;
      const py = 250;
      const pr = 44;

      roundRect(px, py, pw, ph, pr, colors.dim, null);
      if (avatarImg) {
        ctx.save();
        roundRect(px, py, pw, ph, pr, null, null);
        ctx.clip();
        drawCoverImage(avatarImg, px, py, pw, ph);
        ctx.restore();
      }
      roundRect(px, py, pw, ph, pr, null, `${colors.primary}66`, 4);

      // 4. Name 'M. Rishad'
      ctx.fillStyle = colors.text;
      ctx.font = '700 96px "Fira Code", monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('M. Rishad', ox + 512, 960);

      // 5. Role Badge 'AI & ML Engineer'
      const roleText = 'AI & ML Engineer';
      ctx.font = '700 42px "Fira Code", monospace, sans-serif';
      const textMetrics = ctx.measureText(roleText);
      const textWidth = textMetrics.width;
      const pillW = textWidth + 80;
      const pillH = 80;
      const pillX = ox + 512 - pillW / 2;
      const pillY = 1030;

      roundRect(pillX, pillY, pillW, pillH, 40, `${colors.primary}22`, colors.primary, 4);
      ctx.fillStyle = colors.primary;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(roleText, ox + 512, pillY + pillH / 2);

      // 6. Divider Line
      ctx.strokeStyle = `${colors.primary}33`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(ox + 90, 1220);
      ctx.lineTo(ox + 934, 1220);
      ctx.stroke();

      // 7. Footer Section
      // Left: JOIN DATE / Oct 2023
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = colors.textDim;
      ctx.font = '700 28px "Fira Code", monospace, sans-serif';
      ctx.fillText('JOIN DATE', ox + 90, 1275);

      ctx.fillStyle = colors.text;
      ctx.font = '700 52px "Fira Code", monospace, sans-serif';
      ctx.fillText('Oct 2023', ox + 90, 1340);

      // Center: QR Code
      const qrBoxSize = 144;
      const qrX = ox + 512 - qrBoxSize / 2;
      const qrY = 1250;
      roundRect(qrX, qrY, qrBoxSize, qrBoxSize, 20, isDark ? '#05060a' : '#FFFFFF', `${colors.primary}80`, 3);
      if (qrCanvas) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(qrCanvas, qrX + 10, qrY + 10, 124, 124);
        ctx.imageSmoothingEnabled = true;
      }

      // Right: Barcode & ID
      const bx = ox + 740;
      const by = 1250;
      ctx.fillStyle = isDark ? '#FFFFFF' : '#000000';
      const barHeights = [50, 36, 50, 50, 28, 50, 36, 50, 50, 28, 50, 50, 36, 50, 50, 28, 50, 36, 50];
      let currX = bx;
      ctx.imageSmoothingEnabled = false;
      for (let i = 0; i < barHeights.length; i++) {
        const w = (i % 3 === 0) ? 6 : (i % 2 === 0 ? 4 : 2);
        ctx.fillRect(Math.round(currX), Math.round(by + (50 - barHeights[i]) / 2), w, barHeights[i]);
        currX += w + 4;
      }
      ctx.imageSmoothingEnabled = true;

      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = colors.text;
      ctx.font = '700 36px "Fira Code", monospace, sans-serif';
      ctx.fillText('ID: 948382', ox + 934, 1340);


      // ==========================================
      // BACK FACE (UV Rect: x:1024, y:0, w:1024, h:1550)
      // ==========================================
      const bxOffset = 1024;

      // Background
      const backGrad = ctx.createLinearGradient(bxOffset, 0, bxOffset + 1024, cardH);
      if (isDark) {
        backGrad.addColorStop(0, colors.dim);
        backGrad.addColorStop(1, colors.bg);
      } else {
        backGrad.addColorStop(0, '#ffffff');
        backGrad.addColorStop(1, colors.bg);
      }
      ctx.fillStyle = backGrad;
      ctx.fillRect(bxOffset, 0, 1024, cardH);

      // Top Clip Cutout Slot
      roundRect(bxOffset + 442, -30, 140, 70, 24, '#F28C28', '#FF8C00', 4);

      // Magnetic Stripe
      ctx.fillStyle = isDark ? '#050608' : '#1f2937';
      ctx.fillRect(bxOffset, 100, 1024, 180);

      // Back Monogram & Header
      roundRect(bxOffset + 90, 360, 108, 108, 24, colors.dim, `${colors.primary}80`, 4);
      ctx.fillStyle = colors.primary;
      ctx.font = '700 64px "Fira Code", monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('R', bxOffset + 144, 360 + 54);

      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = colors.text;
      ctx.font = '700 44px "Fira Code", monospace, sans-serif';
      ctx.fillText('MONIRUZZAMAN RISHAD', bxOffset + 230, 390);
      ctx.fillStyle = colors.primary;
      ctx.font = '700 32px "Fira Code", monospace, sans-serif';
      ctx.fillText('AI & ML ENGINEER', bxOffset + 230, 435);

      // Divider
      ctx.strokeStyle = `${colors.primary}33`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(bxOffset + 90, 510);
      ctx.lineTo(bxOffset + 934, 510);
      ctx.stroke();

      // Contact Info
      const infoY = 580;
      const items = [
        { label: 'EMAIL', val: 'mzrishad.info@gmail.com' },
        { label: 'GITHUB', val: 'github.com/Solved-Overnight' },
        { label: 'LINKEDIN', val: 'linkedin.com/in/mzrishad' },
        { label: 'WEBSITE', val: 'https://mzrishad.is-a.dev' }
      ];

      items.forEach((item, idx) => {
        const y = infoY + idx * 120;
        ctx.fillStyle = colors.textDim;
        ctx.font = '700 28px "Fira Code", monospace, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.label, bxOffset + 90, y);

        ctx.fillStyle = colors.text;
        ctx.font = '700 34px "Fira Code", monospace, sans-serif';
        ctx.fillText(item.val, bxOffset + 90, y + 38);
      });

      // Hologram Chip
      const chipX = bxOffset + 740;
      const chipY = 580;
      const chipW = 180;
      const chipH = 140;
      const chipG = ctx.createLinearGradient(chipX, chipY, chipX + chipW, chipY + chipH);
      chipG.addColorStop(0, '#e5c07b');
      chipG.addColorStop(0.5, '#ffd700');
      chipG.addColorStop(1, '#b8860b');
      roundRect(chipX, chipY, chipW, chipH, 16, chipG, '#967200', 3);

      // Bottom Notice
      ctx.fillStyle = colors.textDim;
      ctx.font = '700 26px "Fira Code", monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PROPERTY OF M. RISHAD • AUTHORIZED ACCESS ONLY', bxOffset + 512, 1460);

      ctx.restore();
    };

    // Draw initial layout
    drawCard();

    // Create THREE CanvasTexture (Disable mipmapping to keep text 100% razor-sharp)
    const tex = new THREE.CanvasTexture(canvas);
    tex.flipY = false;
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = 16;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    setTexture(tex);

    // Generate High-DPI QR Code and load photo
    const qrCanvas = document.createElement('canvas');
    qrCanvas.width = 600;
    qrCanvas.height = 600;

    let qrReady = false;
    let imgReady = false;

    const qrUrl = (typeof window !== 'undefined' && window.location.origin && window.location.origin.startsWith('http')) 
      ? window.location.origin 
      : 'https://mzrishad.is-a.dev/';

    QRCode.toCanvas(qrCanvas, qrUrl, {
      width: 600,
      margin: 1,
      color: { dark: isDark ? '#ffffff' : '#000000', light: isDark ? '#05060a' : '#ffffff' },
      errorCorrectionLevel: 'H'
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

    // Trigger update once Google Fonts Fira Code is fully loaded into DOM
    if (typeof document !== 'undefined' && (document as any).fonts) {
      (document as any).fonts.ready.then(() => {
        updateTexture();
      });
    }

  }, [baseMap, theme]);

  return texture;
}

function useBandTexture(theme: Theme) {
  const [bandTex, setBandTex] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    // 4K Ultra-crisp lanyard texture
    const W = 4096;
    const H = 256;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    const isDark = theme.isDark !== false;
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      (ctx as any).textRendering = 'geometricPrecision';

      // Lanyard strap background
      ctx.fillStyle = isDark ? '#111827' : '#e5e7eb';
      ctx.fillRect(0, 0, W, H);

      // Top & bottom accent edges on strap
      ctx.fillStyle = theme.colors.primary;
      ctx.fillRect(0, 0, W, 8);
      ctx.fillRect(0, H - 8, W, 8);

      // Repeating text
      ctx.fillStyle = isDark ? '#FFFFFF' : theme.colors.text;
      ctx.font = '700 96px "Fira Code", monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const text = 'SOLVED OVERNIGHT';
      const numRepeats = 3;
      const step = W / numRepeats;

      for (let i = 0; i < numRepeats; i++) {
        const cx = step * i + step / 2;
        ctx.fillText(text, cx, H / 2 + 4);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = 16;
    tex.needsUpdate = true;
    setBandTex(tex);
  }, [theme]);

  return bandTex;
}

export default function IdCard({ isMobile = false }: { isMobile?: boolean }) {
  const { currentTheme } = useTheme();
  const [isMobileDevice, setIsMobileDevice] = useState(isMobile);
  const [sensorPermission, setSensorPermission] = useState<'granted' | 'prompt' | 'unsupported'>('prompt');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileDevice(isMobile || (typeof window !== 'undefined' && window.innerWidth < 768));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobile]);

  useEffect(() => {
    if (typeof window === 'undefined' || !isMobileDevice) return;
    
    // Check if DeviceOrientation permission API exists (iOS 13+)
    if (typeof (DeviceOrientationEvent as any)?.requestPermission === 'function') {
      setSensorPermission('prompt');
    } else if (typeof window.DeviceOrientationEvent !== 'undefined' || typeof window.DeviceMotionEvent !== 'undefined') {
      // Android and standard browsers without explicit permission prompt
      setSensorPermission('granted');
    } else {
      setSensorPermission('unsupported');
    }
  }, [isMobileDevice]);

  const requestSensorAccess = async () => {
    if (typeof (DeviceOrientationEvent as any)?.requestPermission === 'function') {
      try {
        const res = await (DeviceOrientationEvent as any).requestPermission();
        if (res === 'granted') {
          setSensorPermission('granted');
        } else {
          setSensorPermission('unsupported');
        }
      } catch {
        setSensorPermission('unsupported');
      }
    } else {
      setSensorPermission('granted');
    }
  };

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
      lightformerIntensity: { value: 4, min: 0, max: 20, step: 0.5, label: 'Lightformer Intensity' },
    })
  });

  return (
    <div 
      className="w-full h-full relative flex items-center justify-center bg-transparent"
      onTouchStart={() => {
        if (isMobileDevice && sensorPermission === 'prompt') {
          requestSensorAccess();
        }
      }}
    >
      <Leva hidden />

      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 12], fov: 25 }}
      >
        <ambientLight intensity={ambientIntensity} />
        <Physics debug={debugColliders} interpolate gravity={[0, gravityY, 0]} timeStep={1 / 60}>
          <Band
            theme={currentTheme}
            isMobile={isMobileDevice}
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

const _vec = new THREE.Vector3();
const _ang = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _p0 = new THREE.Vector3();
const _p1 = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _hookLocal0 = new THREE.Vector3(0, 1.36, -0.05);
const _hookLocal1 = new THREE.Vector3(0, 1.56, -0.05);

const strapWidthCallback = (p: number) => Math.min(1, 0.22 + p * 3.8);

function Band({
  theme,
  isMobile = false,
  maxSpeed = 50,
  minSpeed = 10,
  clearcoat = 1,
  clearcoatRoughness = 0.15,
  roughness = 0.3,
  metalness = 0.2
}: {
  theme: Theme;
  isMobile?: boolean;
  maxSpeed?: number;
  minSpeed?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  roughness?: number;
  metalness?: number;
}) {
  const { world } = useRapier();
  const band = useRef<any>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);

  // Mobile gravity vectors
  const currentGravity = useRef(new THREE.Vector3(0, -40, 0));
  const targetGravity = useRef(new THREE.Vector3(0, -40, 0));

  const segmentProps: RigidBodyProps = { type: 'dynamic', canSleep: false, colliders: false, angularDamping: 3, linearDamping: 3 };
  const { nodes, materials } = useGLTF('https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb') as any;
  const texture = useTexture('https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg');
  
  // Use ultra-crisp dynamic code-rendered canvas texture responsive to theme
  const cardTexture = useDynamicCardTexture(materials?.base?.map || null, theme);
  const customBandTexture = useBandTexture(theme);

  const { width, height } = useThree((state) => state.size);
  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3()
    ]);
    c.curveType = 'centripetal';
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

  // Mobile Gravity Sensor (DeviceOrientation & DeviceMotion)
  useEffect(() => {
    if (!isMobile) return;

    let active = true;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!active) return;
      if (e.gamma === null && e.beta === null) return;

      // gamma: left-to-right tilt in degrees (-90 to +90)
      // beta: front-to-back tilt in degrees (-180 to +180)
      const gamma = Math.max(-75, Math.min(75, e.gamma ?? 0));
      const beta = Math.max(-30, Math.min(120, e.beta ?? 55));

      // Baseline handheld reading angle: ~55 degrees
      const deltaBeta = Math.max(-60, Math.min(60, beta - 55));

      const radGamma = (gamma * Math.PI) / 180;
      const radBeta = (deltaBeta * Math.PI) / 180;

      // Handle orientation angle (portrait vs landscape)
      const orientationAngle = (window.screen?.orientation?.angle || (window as any).orientation || 0);

      let gx = 45 * Math.sin(radGamma);
      let gy = -Math.max(15, 45 * Math.cos(radGamma));

      if (orientationAngle === 90) {
        const temp = gx;
        gx = -gy;
        gy = -temp;
      } else if (orientationAngle === -90 || orientationAngle === 270) {
        const temp = gx;
        gx = gy;
        gy = temp;
      }

      const gz = 35 * Math.sin(radBeta);

      targetGravity.current.set(gx, gy, gz);
    };

    const handleMotion = (e: DeviceMotionEvent) => {
      if (!active) return;
      if (e.acceleration) {
        const ax = e.acceleration.x ?? 0;
        const ay = e.acceleration.y ?? 0;
        const az = e.acceleration.z ?? 0;
        // If user shakes/jerks phone, add inertia impulse opposing movement
        if (Math.abs(ax) > 1.2 || Math.abs(ay) > 1.2 || Math.abs(az) > 1.2) {
          targetGravity.current.x -= Math.max(-25, Math.min(25, ax * 2.8));
          targetGravity.current.z -= Math.max(-25, Math.min(25, az * 2.8));
        }
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    window.addEventListener('devicemotion', handleMotion, { passive: true });

    return () => {
      active = false;
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [isMobile]);

  useFrame((state, delta) => {
    // Mobile Gravity Sensor Dynamic World Gravity Update
    if (isMobile && world) {
      const smoothFactor = 1 - Math.exp(-12 * Math.min(delta, 0.05));
      currentGravity.current.lerp(targetGravity.current, smoothFactor);

      world.gravity.x = currentGravity.current.x;
      world.gravity.y = currentGravity.current.y;
      world.gravity.z = currentGravity.current.z;

      // If tilted or phone moved, keep physics bodies active so they swing freely
      const lateralG = Math.abs(currentGravity.current.x) + Math.abs(currentGravity.current.z);
      if (lateralG > 0.5) {
        [card, j1, j2, j3].forEach((ref) => ref.current?.wakeUp());
      }
    }

    if (dragged) {
      _vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      _dir.copy(_vec).sub(state.camera.position).normalize();
      _vec.add(_dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: _vec.x - dragged.x,
        y: _vec.y - dragged.y,
        z: _vec.z - dragged.z
      });
    }

    if (fixed.current && card.current && j1.current && j2.current) {
      // Smoothly interpolate physics joints j1, j2 with frame-rate independent exponential damping
      [j1, j2].forEach((ref) => {
        const trans = ref.current.translation();
        if (!ref.current.lerped) {
          ref.current.lerped = new THREE.Vector3().copy(trans);
        }
        const dist = ref.current.lerped.distanceTo(trans);
        const speed = Math.max(minSpeed, Math.min(maxSpeed, minSpeed + dist * 35));
        const alpha = 1 - Math.exp(-speed * Math.min(delta, 0.05));
        ref.current.lerped.lerp(trans, alpha);
      });

      // Rigid anchor points inside and at the top exit of the metal hook
      const cardPos = card.current.translation();
      const cardRot = card.current.rotation();

      // Canonicalize quaternion (ensures w >= 0 to avoid antipodal sign flips)
      let qx = cardRot.x;
      let qy = cardRot.y;
      let qz = cardRot.z;
      let qw = cardRot.w;
      if (qw < 0) {
        qx = -qx;
        qy = -qy;
        qz = -qz;
        qw = -qw;
      }
      _q.set(qx, qy, qz, qw);

      _p0.copy(_hookLocal0).applyQuaternion(_q).add(cardPos);
      _p1.copy(_hookLocal1).applyQuaternion(_q).add(cardPos);

      // Smoothly update catmull curve points: from hook, through joints, to fixed top
      curve.points[0].copy(_p0);
      curve.points[1].copy(_p1);
      curve.points[2].copy(j2.current.lerped || j2.current.translation());
      curve.points[3].copy(j1.current.lerped || j1.current.translation());
      curve.points[4].copy(fixed.current.translation());

      if (band.current?.geometry) {
        band.current.geometry.setPoints(curve.getPoints(32), strapWidthCallback);
      }

      // Smoothly restore card orientation when released
      if (!dragged) {
        _ang.copy(card.current.angvel());
        card.current.setAngvel({ 
          x: _ang.x * 0.98, 
          y: _ang.y * 0.98 - qy * 1.6, 
          z: _ang.z * 0.98 - qz * 0.6 
        });
      }
    }
  });

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 16;
  if (materials?.base?.map) {
    materials.base.map.anisotropy = 16;
  }
  if (materials?.metal) {
    materials.metal.polygonOffset = true;
    materials.metal.polygonOffsetFactor = -1;
    materials.metal.polygonOffsetUnits = -1;
  }

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0, -1.0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} sensor />
        </RigidBody>
        <RigidBody position={[0, -2.0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} sensor />
        </RigidBody>
        <RigidBody position={[0, -3.0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} sensor />
        </RigidBody>
        <RigidBody position={[0, -4.45, 0.05]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
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
            onPointerDown={(e: any) => {
              e.target.setPointerCapture(e.pointerId);
              _vec.copy(card.current.translation());
              drag(new THREE.Vector3().copy(e.point).sub(_vec));
            }}>
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
          lineWidth={0.85}
        />
      </mesh>
    </>
  );
}

