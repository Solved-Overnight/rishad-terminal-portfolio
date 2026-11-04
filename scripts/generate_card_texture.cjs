const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const QRCode = require('qrcode');
const path = require('path');

async function generateCardTexture() {
  const width = 2048;
  const height = 2048;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Scale context x2 for 2048x2048 high resolution text rendering
  ctx.scale(2, 2);

  // Background
  ctx.fillStyle = '#0a0a0c';
  ctx.fillRect(0, 0, 1024, 1024);

  // Helper rounded rect
  function roundRect(ctx, x, y, w, h, radius, fill, stroke, strokeWidth = 1) {
    ctx.beginPath();
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

  // Load Rishad2 Avatar
  let avatarImg;
  try {
    avatarImg = await loadImage(path.join(__dirname, '../img/Rishad2.jpg'));
  } catch (e) {
    try {
      avatarImg = await loadImage(path.join(__dirname, '../img/Rishad.jpg'));
    } catch (err) {
      avatarImg = await loadImage(path.join(__dirname, '../public/id_photo.png'));
    }
  }

  // Generate QR Code as high-res canvas buffer
  const qrCanvas = createCanvas(200, 200);
  await QRCode.toCanvas(qrCanvas, 'https://rishadhabib.me/', {
    width: 200,
    margin: 0,
    color: {
      dark: '#ffffff',
      light: '#18181b'
    }
  });

  // ==========================================
  // FRONT FACE (Left Half: 0..512, 0..1024)
  // ==========================================
  const ox = 0; // offset x

  // Card Background with smooth dark radial/linear gradient
  const grad = ctx.createLinearGradient(ox + 0, 0, ox + 512, 1024);
  grad.addColorStop(0, '#1c1c22');
  grad.addColorStop(0.4, '#121216');
  grad.addColorStop(1, '#08080a');
  ctx.fillStyle = grad;
  ctx.fillRect(ox, 0, 512, 1024);

  // Top Clip Cutout Slot
  roundRect(ctx, ox + 221, -15, 70, 35, 12, '#050507', '#282830', 2);

  // 1. Top Left Badge 'R'
  roundRect(ctx, ox + 45, 50, 54, 54, 12, '#18181f', 'rgba(255, 255, 255, 0.3)', 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px "Fira Code", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('R', ox + 45 + 27, 50 + 27);

  // 2. Top Right Text 'm.rishad'
  ctx.fillStyle = '#e4e4e7';
  ctx.font = 'bold 22px "Fira Code", monospace';
  ctx.textAlign = 'right';
  ctx.fillText('m.rishad', ox + 467, 77);

  // 3. Center Profile Photo (Using Rishad2.jpg, fitted cleanly)
  const pw = 290;
  const ph = 290;
  const px = ox + (512 - pw) / 2;
  const py = 150;
  const pr = 22;

  ctx.save();
  roundRect(ctx, px, py, pw, ph, pr, null, null);
  ctx.clip();
  ctx.drawImage(avatarImg, px, py, pw, ph);
  ctx.restore();

  // Photo border overlay
  roundRect(ctx, px, py, pw, ph, pr, null, 'rgba(255, 255, 255, 0.25)', 2);

  // 4. Name 'M. Rishad' (Ultra clear and bold)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 48px "Fira Code", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('M. Rishad', ox + 256, 492);

  // 5. Role Badge 'AI & ML Engineer'
  const roleText = 'AI & ML Engineer';
  ctx.font = 'bold 20px "Fira Code", monospace';
  const textWidth = ctx.measureText(roleText).width;
  const pillW = textWidth + 48;
  const pillH = 42;
  const pillX = ox + 256 - pillW / 2;
  const pillY = 525;

  roundRect(ctx, pillX, pillY, pillW, pillH, 21, '#0f3813', '#329d3c', 2);
  ctx.fillStyle = '#3bf822';
  ctx.fillText(roleText, ox + 256, pillY + 21);

  // 6. Divider Line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ox + 45, 628);
  ctx.lineTo(ox + 467, 628);
  ctx.stroke();

  // 7. Footer Section
  // Left: JOIN DATE / Oct 2023
  ctx.textAlign = 'left';
  ctx.fillStyle = '#a1a1aa';
  ctx.font = 'bold 15px "Fira Code", monospace';
  ctx.fillText('JOIN DATE', ox + 45, 665);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 26px "Fira Code", monospace';
  ctx.fillText('Oct 2023', ox + 45, 700);

  // Middle: QR Code
  const qrBoxSize = 72;
  const qrX = ox + 256 - qrBoxSize / 2;
  const qrY = 648;
  roundRect(ctx, qrX, qrY, qrBoxSize, qrBoxSize, 14, '#18181b', 'rgba(255, 255, 255, 0.25)', 2);
  ctx.drawImage(qrCanvas, qrX + 8, qrY + 8, 56, 56);

  // Right: Barcode & ID: 948382
  const bx = ox + 372;
  const by = 648;
  ctx.fillStyle = '#FFFFFF';
  // Draw minimalist barcode lines
  const barHeights = [28, 20, 28, 28, 16, 28, 20, 28, 28, 16, 28, 28, 20, 28, 28, 16, 28, 20];
  let currX = bx;
  for (let i = 0; i < barHeights.length; i++) {
    const w = (i % 3 === 0) ? 3 : 1.5;
    ctx.fillRect(currX, by + (28 - barHeights[i]) / 2, w, barHeights[i]);
    currX += w + 2.5;
  }

  ctx.textAlign = 'right';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 19px "Fira Code", monospace';
  ctx.fillText('ID: 948382', ox + 467, 700);


  // ==========================================
  // BACK FACE (Right Half: 512..1024, 0..1024)
  // ==========================================
  const bxOffset = 512;

  // Background
  const backGrad = ctx.createLinearGradient(bxOffset, 0, bxOffset + 512, 1024);
  backGrad.addColorStop(0, '#18181e');
  backGrad.addColorStop(0.5, '#101014');
  backGrad.addColorStop(1, '#08080a');
  ctx.fillStyle = backGrad;
  ctx.fillRect(bxOffset, 0, 512, 1024);

  // Top Clip Notch
  roundRect(ctx, bxOffset + 221, -15, 70, 35, 12, '#050507', '#282830', 2);

  // Magnetic Stripe
  ctx.fillStyle = '#0a0a0d';
  ctx.fillRect(bxOffset, 70, 512, 90);

  // Back Header / Monogram
  roundRect(ctx, bxOffset + 45, 200, 52, 52, 10, '#1c1c24', 'rgba(255,255,255,0.25)', 1.5);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 30px "Fira Code", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('R', bxOffset + 71, 226);

  ctx.textAlign = 'left';
  ctx.font = 'bold 22px "Fira Code", monospace';
  ctx.fillText('MONIRUZZAMAN RISHAD', bxOffset + 115, 218);
  ctx.fillStyle = '#3bf822';
  ctx.font = 'bold 15px "Fira Code", monospace';
  ctx.fillText('AI & ML ENGINEER', bxOffset + 115, 240);

  // Divider
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.beginPath();
  ctx.moveTo(bxOffset + 45, 280);
  ctx.lineTo(bxOffset + 467, 280);
  ctx.stroke();

  // Contact Info Section
  const infoY = 320;
  const items = [
    { label: 'EMAIL', val: 'hello@rishadhabib.me' },
    { label: 'GITHUB', val: 'github.com/Solved-Overnight' },
    { label: 'LINKEDIN', val: 'linkedin.com/in/mzrishad' },
    { label: 'WEBSITE', val: 'https://rishadhabib.me' }
  ];

  items.forEach((item, idx) => {
    const y = infoY + idx * 60;
    ctx.fillStyle = '#a1a1aa';
    ctx.font = 'bold 13px "Fira Code", monospace';
    ctx.fillText(item.label, bxOffset + 45, y);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 17px "Fira Code", monospace';
    ctx.fillText(item.val, bxOffset + 45, y + 22);
  });

  // Security Hologram Chip
  const chipX = bxOffset + 377;
  const chipY = 320;
  const chipG = ctx.createLinearGradient(chipX, chipY, chipX + 85, chipY + 65);
  chipG.addColorStop(0, '#d4af37');
  chipG.addColorStop(0.5, '#fff2a1');
  chipG.addColorStop(1, '#aa820a');
  roundRect(ctx, chipX, chipY, 85, 65, 8, chipG, '#967200', 1.5);

  // Bottom Notice
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = 'bold 13px "Fira Code", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PROPERTY OF M. RISHAD • AUTHORIZED ACCESS ONLY', bxOffset + 256, 760);

  // Save output to file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(__dirname, '../public/card_texture.png'), buffer);
  console.log('Successfully generated high-res /public/card_texture.png!');
}

generateCardTexture().catch(console.error);
