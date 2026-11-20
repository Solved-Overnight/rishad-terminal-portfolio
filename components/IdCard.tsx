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
      const crispText = isDark ? '#F8FAFC' : '#09090B';
      const crispSubText = isDark ? '#CBD5E1' : '#334155';
      const crispCardTop = isDark ? '#12151E' : '#FFFFFF';
      const crispCardBottom = isDark ? '#07090E' : '#F1F5F9';

      // Card Background Gradient
      const grad = ctx.createLinearGradient(ox, 0, ox + cardW, cardH);
      grad.addColorStop(0, crispCardTop);
      grad.addColorStop(0.55, isDark ? '#0B0E15' : '#F8FAFC');
      grad.addColorStop(1, crispCardBottom);
      ctx.fillStyle = grad;
      ctx.fillRect(ox, 0, cardW, cardH);

      // Top Clip Cutout Slot
      roundRect(ox + 442, -26, 140, 68, 22, isDark ? '#050608' : '#1E293B', '#FF8C00', 6);

      // 1. Top Left Badge & Monogram
      roundRect(ox + 84, 96, 112, 112, 24, isDark ? '#161B26' : '#E2E8F0', colors.primary, 5);
      ctx.fillStyle = colors.primary;
      ctx.font = '800 68px "Fira Code", monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('R', ox + 140, 154);

      // 2. Top Right Text '@mzrishad'
      ctx.fillStyle = crispSubText;
      ctx.font = '700 42px "Fira Code", monospace, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText('@mzrishad', ox + 940, 152);

      // 3. Center Profile Photo Container
      const pw = 572;
      const ph = 572;
      const px = ox + (cardW - pw) / 2;
      const py = 252;
      const pr = 44;

      roundRect(px, py, pw, ph, pr, isDark ? '#111622' : '#E2E8F0', null);
      if (avatarImg) {
        ctx.save();
        roundRect(px, py, pw, ph, pr, null, null);
        ctx.clip();
        drawCoverImage(avatarImg, px, py, pw, ph);
        ctx.restore();
      }
      roundRect(px - 4, py - 4, pw + 8, ph + 8, pr + 4, null, colors.primary, 6);
      roundRect(px + 2, py + 2, pw - 4, ph - 4, pr - 2, null, isDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.18)', 2);

      // 4. Name 'M. Rishad'
      ctx.fillStyle = crispText;
      ctx.font = '800 96px "Inter", "Segoe UI", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('M. Rishad', ox + 512, 954);

      // 5. Role Badge 'AI & ML Engineer'
      const roleText = 'AI & ML Engineer';
      ctx.font = '700 42px "Inter", "Segoe UI", system-ui, sans-serif';
      const textMetrics = ctx.measureText(roleText);
      const textWidth = textMetrics.width;
      const pillW = textWidth + 96;
      const pillH = 82;
      const pillX = ox + 512 - pillW / 2;
      const pillY = 1030;

      roundRect(pillX, pillY, pillW, pillH, 41, `${colors.primary}26`, colors.primary, 5);
      ctx.fillStyle = colors.primary;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(roleText, ox + 512, pillY + pillH / 2 + 1);

      // 6. Crisp Divider Line
      ctx.strokeStyle = `${colors.primary}99`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(ox + 84, 1212);
      ctx.lineTo(ox + 940, 1212);
      ctx.stroke();

      // 7. Footer Section
      // Left: JOIN DATE / Oct 2023
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = crispSubText;
      ctx.font = '700 28px "Inter", "Segoe UI", system-ui, sans-serif';
      ctx.fillText('JOIN DATE', ox + 84, 1272);

      ctx.fillStyle = crispText;
      ctx.font = '800 50px "Inter", "Segoe UI", system-ui, sans-serif';
      ctx.fillText('Oct 2023', ox + 84, 1342);

      // Center: QR Code
      const qrBoxSize = 148;
      const qrX = ox + 512 - qrBoxSize / 2;
      const qrY = 1248;
      roundRect(qrX, qrY, qrBoxSize, qrBoxSize, 20, isDark ? '#05060A' : '#FFFFFF', colors.primary, 5);
      if (qrCanvas) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(qrCanvas, qrX + 12, qrY + 12, 124, 124);
        ctx.imageSmoothingEnabled = true;
      }

      // Right: Barcode & ID
      const bx = ox + 738;
      const by = 1254;
      ctx.fillStyle = crispText;
      const barHeights = [52, 38, 52, 52, 30, 52, 38, 52, 52, 30, 52, 52, 38, 52, 52, 30, 52, 38, 52];
      let currX = bx;
      ctx.imageSmoothingEnabled = false;
      for (let i = 0; i < barHeights.length; i++) {
        const w = (i % 3 === 0) ? 7 : (i % 2 === 0 ? 5 : 3);
        ctx.fillRect(Math.round(currX), Math.round(by + (52 - barHeights[i]) / 2), w, barHeights[i]);
        currX += w + 4;
      }
      ctx.imageSmoothingEnabled = true;

      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = crispText;
      ctx.font = '700 36px "Fira Code", monospace, sans-serif';
      ctx.fillText('ID: 948382', ox + 940, 1344);


      // ==========================================
      // BACK FACE (UV Rect: x:1024, y:0, w:1024, h:1550)
      // ==========================================
      const bxOffset = 1024;

      // Background
      const backGrad = ctx.createLinearGradient(bxOffset, 0, bxOffset + 1024, cardH);
      backGrad.addColorStop(0, crispCardTop);
      backGrad.addColorStop(0.55, isDark ? '#0B0E15' : '#F8FAFC');
      backGrad.addColorStop(1, crispCardBottom);
      ctx.fillStyle = backGrad;
      ctx.fillRect(bxOffset, 0, 1024, cardH);

      // Top Clip Cutout Slot
      roundRect(bxOffset + 442, -26, 140, 68, 22, isDark ? '#050608' : '#1E293B', '#FF8C00', 6);

      // Magnetic Stripe
      ctx.fillStyle = isDark ? '#040507' : '#1E293B';
      ctx.fillRect(bxOffset + 29, 106, 1024 - 58, 176);
      ctx.strokeStyle = `${colors.primary}66`;
      ctx.lineWidth = 3;
      ctx.strokeRect(bxOffset + 29, 106, 1024 - 58, 176);

      // Back Monogram & Header
      roundRect(bxOffset + 84, 356, 112, 112, 24, isDark ? '#161B26' : '#E2E8F0', colors.primary, 5);
      ctx.fillStyle = colors.primary;
      ctx.font = '800 66px "Fira Code", monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('R', bxOffset + 140, 356 + 58);

      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = crispText;
      ctx.font = '800 42px "Inter", "Segoe UI", system-ui, sans-serif';
      ctx.fillText('MONIRUZZAMAN RISHAD', bxOffset + 226, 390);
      ctx.fillStyle = colors.primary;
      ctx.font = '700 32px "Fira Code", monospace, sans-serif';
      ctx.fillText('AI & ML ENGINEER', bxOffset + 226, 438);

      // Divider
      ctx.strokeStyle = `${colors.primary}99`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(bxOffset + 84, 512);
      ctx.lineTo(bxOffset + 940, 512);
      ctx.stroke();

      // Contact Info
      const infoY = 584;
      const items = [
        { label: 'EMAIL', val: 'mzrishad.info@gmail.com' },
        { label: 'GITHUB', val: 'github.com/Solved-Overnight' },
        { label: 'LINKEDIN', val: 'linkedin.com/in/mzrishad' },
        { label: 'WEBSITE', val: 'https://mzrishad.is-a.dev' }
      ];

      items.forEach((item, idx) => {
        const y = infoY + idx * 124;
        ctx.fillStyle = crispSubText;
        ctx.font = '700 28px "Inter", "Segoe UI", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.label, bxOffset + 84, y);

        ctx.fillStyle = crispText;
        ctx.font = '700 34px "Fira Code", monospace, sans-serif';
        ctx.fillText(item.val, bxOffset + 84, y + 40);
      });

      // Hologram Chip with crisp contact lines
      const chipX = bxOffset + 744;
      const chipY = 584;
      const chipW = 180;
      const chipH = 140;
      const chipG = ctx.createLinearGradient(chipX, chipY, chipX + chipW, chipY + chipH);
      chipG.addColorStop(0, '#f3d38b');
      chipG.addColorStop(0.5, '#ffd700');
      chipG.addColorStop(1, '#b8860b');
      roundRect(chipX, chipY, chipW, chipH, 18, chipG, '#8a6400', 5);
      ctx.strokeStyle = 'rgba(70,45,0,0.45)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(chipX + 56, chipY + 4);
      ctx.lineTo(chipX + 56, chipY + chipH - 4);
      ctx.moveTo(chipX + 124, chipY + 4);
      ctx.lineTo(chipX + 124, chipY + chipH - 4);
      ctx.moveTo(chipX + 4, chipY + chipH / 2);
      ctx.lineTo(chipX + chipW - 4, chipY + chipH / 2);
      ctx.stroke();

      // Bottom Notice
      ctx.fillStyle = crispSubText;
      ctx.font = '700 26px "Fira Code", monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PROPERTY OF M. RISHAD • AUTHORIZED ACCESS ONLY', bxOffset + 512, 1456);

      ctx.restore();
    };

    // Draw initial layout
    drawCard();

    // Create THREE CanvasTexture with mipmapping enabled for razor-sharp text & borders at all scales
    const tex = new THREE.CanvasTexture(canvas);
    tex.flipY = false;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
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

    // Trigger update once Google Fonts Inter & Fira Code are fully loaded into DOM
    if (typeof document !== 'undefined' && (document as any).fonts) {
      (document as any).fonts.ready.then(() => {
        updateTexture();
      });
    }

    return () => {
      tex.dispose();
    };

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
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = 16;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    setBandTex(tex);

    return () => {
      tex.dispose();
    };
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
      clearcoatRoughness: { value: 0.08, min: 0, max: 1, step: 0.02, label: 'Clearcoat Roughness' },
      roughness: { value: 0.25, min: 0, max: 1, step: 0.05, label: 'Roughness' },
      metalness: { value: 0.16, min: 0, max: 1, step: 0.05, label: 'Metalness' },
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
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.06,
        }}
        dpr={[1.5, 2.5]}
        camera={{ position: [0, 0, 12], fov: 25 }}
      >
        <ResponsiveCamera />
        <ambientLight intensity={ambientIntensity} />
        <directionalLight position={[2, 3, 8]} intensity={0.45} />
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
        <Environment blur={0.6}>
          <Lightformer intensity={lightformerIntensity * 0.66} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={lightformerIntensity} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={lightformerIntensity} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={lightformerIntensity * 3.33} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    if (!size.width || !size.height) return;
    const aspect = size.width / size.height;
    // Frame the hanging 3D card crisply across narrow 20% panes and wide panes
    const targetZ = aspect < 0.55
      ? Math.min(13.2, Math.max(10.6, 1.85 / Math.max(0.24, aspect * 0.44)))
      : Math.max(9.8, Math.min(11.8, 11.4 - (aspect - 0.55) * 1.2));
    camera.position.set(0, -0.22, targetZ);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
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

  // Mobile Gravity & Movement Sensor (DeviceOrientation & DeviceMotion)
  useEffect(() => {
    if (!isMobile) return;

    let active = true;

    // Filter states for orientation
    let smoothGamma = 0;
    let smoothBeta = 0;

    // High-pass & moving average filter states for linear acceleration
    let lastRawX = 0;
    let lastRawY = 0;
    let lastRawZ = 0;
    let lastAx = 0;
    let lastAy = 0;
    let lastAz = 0;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!active) return;
      if (e.gamma === null && e.beta === null) return;

      // gamma: left-to-right tilt in degrees (-90 to +90)
      // beta: front-to-back tilt in degrees (-180 to +180)
      const targetGamma = Math.max(-80, Math.min(80, e.gamma ?? 0));
      const rawBeta = Math.max(-30, Math.min(130, e.beta ?? 50));

      // Handheld viewing resting baseline angle: ~50 degrees
      const targetDeltaBeta = Math.max(-65, Math.min(65, rawBeta - 50));

      // Exponential moving average filter (EMA) to eliminate sensor twitch/jitter
      smoothGamma += (targetGamma - smoothGamma) * 0.15;
      smoothBeta += (targetDeltaBeta - smoothBeta) * 0.15;

      const radGamma = (smoothGamma * Math.PI) / 180;
      const radBeta = (smoothBeta * Math.PI) / 180;

      // Screen rotation orientation angle (portrait vs landscape)
      const orientationAngle = (window.screen?.orientation?.angle || (window as any).orientation || 0);

      // Stable gravitational scale for physics world
      const gMagnitude = 38;
      let gx = gMagnitude * Math.sin(radGamma) * 0.85;
      let gy = -Math.max(16, gMagnitude * Math.cos(radGamma));

      if (orientationAngle === 90) {
        const temp = gx;
        gx = -gy;
        gy = -temp;
      } else if (orientationAngle === -90 || orientationAngle === 270) {
        const temp = gx;
        gx = gy;
        gy = temp;
      }

      const gz = gMagnitude * Math.sin(radBeta) * 0.5;
      targetGravity.current.set(gx, gy, gz);
    };

    const handleMotion = (e: DeviceMotionEvent) => {
      if (!active || !card.current) return;

      let ax = 0;
      let ay = 0;
      let az = 0;

      if (e.acceleration && e.acceleration.x !== null) {
        ax = e.acceleration.x ?? 0;
        ay = e.acceleration.y ?? 0;
        az = e.acceleration.z ?? 0;
      } else if (e.accelerationIncludingGravity && e.accelerationIncludingGravity.x !== null) {
        const rawX = e.accelerationIncludingGravity.x ?? 0;
        const rawY = e.accelerationIncludingGravity.y ?? 0;
        const rawZ = e.accelerationIncludingGravity.z ?? 0;
        // High-pass filter to extract dynamic movement acceleration
        ax = rawX - lastRawX;
        ay = rawY - lastRawY;
        az = rawZ - lastRawZ;
        lastRawX = rawX * 0.82;
        lastRawY = rawY * 0.82;
        lastRawZ = rawZ * 0.82;
      }

      // Smooth sensor spikes
      ax = lastAx * 0.3 + ax * 0.7;
      ay = lastAy * 0.3 + ay * 0.7;
      az = lastAz * 0.3 + az * 0.7;
      lastAx = ax;
      lastAy = ay;
      lastAz = az;

      const mag = Math.sqrt(ax * ax + ay * ay + az * az);

      // Deadzone: ignore micro-tremors and breathing (< 0.6 m/s²)
      if (mag < 0.6) return;

      // 1. Move phone a little: badge moves a little (subtle sway & inertia)
      if (mag < 3.8) {
        card.current.wakeUp();
        j3.current?.wakeUp();
        j2.current?.wakeUp();
        j1.current?.wakeUp();

        const smallMoveScale = 0.005;
        card.current.applyImpulse({
          x: -ax * smallMoveScale,
          y: -ay * smallMoveScale * 0.3,
          z: -az * smallMoveScale * 0.8
        }, true);

        card.current.applyTorqueImpulse({
          x: -az * smallMoveScale * 0.3,
          y: ax * smallMoveScale * 0.4,
          z: -ax * smallMoveScale * 0.2
        }, true);
      }
      // 2. Shake phone: vigorously shakes and throws the card
      else {
        card.current.wakeUp();
        j3.current?.wakeUp();
        j2.current?.wakeUp();
        j1.current?.wakeUp();

        const shakePower = Math.min(22, mag - 3.2);
        // Non-linear scaling throws the card dynamically when shaken hard
        const shakeImpulse = 0.014 + Math.pow(shakePower, 1.25) * 0.006;

        card.current.applyImpulse({
          x: -ax * shakeImpulse,
          y: -ay * shakeImpulse * 0.6,
          z: -az * shakeImpulse * 1.2
        }, true);

        // Strong dynamic torque throwing/flipping the badge on its strap
        card.current.applyTorqueImpulse({
          x: -az * shakeImpulse * 0.9,
          y: (Math.sign(ax) || 1) * shakePower * 0.02,
          z: -ax * shakeImpulse * 0.7
        }, true);
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
      // Silky smooth interpolation towards target gravity (eliminates abrupt jumps)
      const smoothFactor = 1 - Math.exp(-7 * Math.min(delta, 0.05));
      currentGravity.current.lerp(targetGravity.current, smoothFactor);

      world.gravity.x = currentGravity.current.x;
      world.gravity.y = currentGravity.current.y;
      world.gravity.z = currentGravity.current.z;

      [card, j1, j2, j3].forEach((ref) => ref.current?.wakeUp());
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
                  envMapIntensity={0.95}
                  clearcoat={clearcoat}
                  clearcoatRoughness={clearcoatRoughness}
                  roughness={roughness}
                  metalness={metalness}
                  ior={1.5}
                  reflectivity={0.9}
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

