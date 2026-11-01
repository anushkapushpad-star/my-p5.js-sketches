let synth, drone, reverb, filter, vol;
let isStarted = false;
let currentBright = 100;
let currentVolume = -20;
let currentPitchShift = 0;

function setup() {
  createCanvas(800, 600);
  angleMode(DEGREES);
  colorMode(HSB, 360, 100, 100, 100);
}

function mouseMoved() {
  if (!isStarted) startAudio();
  updateAudio();
}

function mousePressed() {
  if (!isStarted) startAudio();
}

function updateAudio() {
  if (!isStarted) return;

  let volVal = map(mouseY, height, 0, -60, 0);
  if (mouseY > height - 10) volVal = -Infinity;
  currentVolume = volVal;
  if (vol) vol.volume.rampTo(currentVolume, 0.3);

  currentPitchShift = map(mouseX, 0, width, -12, 12);
}

async function startAudio() {
  if (isStarted) return;
  isStarted = true;

  await Tone.start();

  reverb = new Tone.Reverb({ decay: 6, wet: 0.7 }).toDestination();
  filter = new Tone.Filter(2000, 'lowpass').connect(reverb);
  vol = new Tone.Volume(-20).connect(filter);

  drone = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sine' },
    envelope: { attack: 2, decay: 1, sustain: 0.8, release: 4 },
    volume: -6
  }).connect(vol);

  synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.5, decay: 0.8, sustain: 0.4, release: 2 },
    volume: -8
  }).connect(vol);

  drone.triggerAttack(['C2', 'G2', 'E3']);
  Tone.Transport.bpm.value = 52;

  let step = 0;
  const allNotes = [
    'C2','D2','E2','G2','A2',
    'C3','D3','E3','G3','A3',
    'C4','D4','E4','G4','A4',
    'C5','D5','E5','G5','A5'
  ];

  Tone.Transport.scheduleRepeat((time) => {
    let centerIdx = Math.floor(map(mouseX, 0, width, 2, allNotes.length - 3));
    centerIdx = constrain(centerIdx, 2, allNotes.length - 3);
    let offset = (step % 5) - 2;
    let noteIdx = constrain(centerIdx + offset, 0, allNotes.length - 1);
    let note = allNotes[noteIdx];

    synth.triggerAttackRelease(note, '2n', time);
    filter.frequency.rampTo(map(mouseY, height, 0, 300, 5000), 0.5);

    if (step % 4 === 0) {
      drone.releaseAll();
      if (mouseX < width / 3) {
        drone.triggerAttack(['C2', 'G2', 'Eb3']);
      } else if (mouseX < (width * 2) / 3) {
        drone.triggerAttack(['C3', 'G3', 'E4']);
      } else {
        drone.triggerAttack(['C4', 'G4', 'E5']);
      }
    }
    step++;
  }, '2n');

  Tone.Transport.start();
}

function draw() {
  background(40, 20, 92);
  noStroke();

  let hueShift = map(mouseX, 0, width, 0, 360);
  let bright   = map(mouseY, 0, height, 100, 30);
  currentBright = bright;

  if (isStarted) updateAudio();

  function c(h, s, b) {
    return color((h + hueShift) % 360, s, b * (bright / 100));
  }

  // ---- SQUARE 1 (0,0) ----
  push();
  fill(c(80, 40, 75)); square(0, 0, 200);
  translate(100, 100); rectMode(CENTER);
  fill(c(50, 85, 90));  rotate(3);  ellipse(0, -5, 185, 170);
  fill(c(0, 80, 85));   rotate(-4); ellipse(-3, 3, 155, 148);
  fill(c(20, 70, 55));  rotate(3);  ellipse(3, 0, 120, 128);
  fill(c(0, 85, 78));   rotate(-4); ellipse(0, 4, 88, 95);
  fill(c(220, 80, 70)); rotate(2);  ellipse(-4, 2, 52, 44);
  pop();

  // ---- SQUARE 2 (200,0) ----
  push();
  fill(c(290, 45, 65)); rect(190, 0, 210, 200);
  translate(295, 100);
  fill(c(65, 70, 78));  rotate(-5); ellipse(0, 0, 185, 172);
  fill(c(25, 85, 85));  rotate(4);  ellipse(-3, 4, 152, 145);
  fill(c(220, 75, 68)); rotate(-5); ellipse(4, -3, 118, 125);
  fill(c(30, 80, 72));  rotate(4);  ellipse(-3, 3, 78, 68);
  fill(c(220, 70, 60)); rotate(-3); ellipse(3, -2, 42, 50);
  pop();

  // ---- SQUARE 3 (400,0) ----
  push();
  fill(c(200, 20, 18)); square(400, 0, 210);
  translate(505, 105); rectMode(CENTER);
  fill(c(260, 55, 65)); rotate(2);  rect(0, 0, 175, 168, 55);
  fill(c(45, 90, 88));  rotate(-4); ellipse(0, 0, 145, 155);
  fill(c(0, 85, 72));   rotate(3);  rect(0, 0, 110, 118, 45);
  fill(c(225, 78, 68)); rotate(-3); rect(0, 0, 78, 88, 30);
  fill(c(0, 85, 68));   rotate(2);  ellipse(3, -3, 52, 45);
  pop();

  // ---- SQUARE 4 (600,0) ----
  push();
  fill(c(195, 35, 35)); square(600, 0, 200);
  translate(700, 100); rectMode(CENTER);
  fill(c(0, 80, 78));   rotate(1);  rect(0, 0, 172, 178, 65);
  fill(c(200, 20, 22)); rotate(-2); rect(0, 0, 142, 148, 50);
  fill(c(225, 72, 65)); rotate(2);  rect(0, 0, 105, 112, 40);
  fill(c(45, 88, 85));  rotate(-3); ellipse(3, -3, 65, 72);
  fill(c(30, 15, 88));  rotate(2);  ellipse(0, 2, 38, 35);
  fill(c(10, 75, 72));  rotate(-1); ellipse(2, 0, 14, 12);
  pop();

  // ---- SQUARE 5 (0,200) ----
  push();
  fill(c(280, 50, 65)); square(0, 200, 200);
  translate(100, 300);
  fill(c(0, 82, 78));   rotate(-4); ellipse(0, 0, 185, 172);
  fill(c(50, 75, 82));  rotate(5);  ellipse(-4, 3, 152, 142);
  fill(c(0, 78, 75));   rotate(-5); ellipse(3, -3, 118, 128);
  fill(c(35, 25, 92));  rotate(4);  ellipse(-3, 3, 70, 62);
  fill(c(130, 65, 55)); rotate(-3); ellipse(2, -2, 35, 28);
  pop();

  // ---- SQUARE 6 (200,200) ----
  push();
  fill(c(168, 45, 68)); square(200, 200, 210);
  translate(305, 305); rectMode(CENTER);
  fill(c(25, 80, 82));  rotate(5);  ellipse(5, -6, 188, 172);
  fill(c(130, 68, 62)); rotate(-6); ellipse(-4, 5, 158, 145);
  fill(c(225, 75, 70)); rotate(5);  ellipse(5, -4, 122, 115);
  fill(c(0, 82, 75));   rotate(-5); ellipse(-4, 5, 88, 98);
  fill(c(225, 80, 65)); rotate(4);  ellipse(3, -3, 48, 55);
  pop();

  // ---- SQUARE 7 (400,200) ----
  push();
  fill(c(45, 75, 82)); square(400, 200, 200);
  translate(500, 300);
  fill(c(25, 82, 85));  rotate(3);  ellipse(4, -5, 185, 172);
  fill(c(45, 78, 88));  rotate(-5); ellipse(-5, 4, 155, 145);
  fill(c(220, 72, 68)); rotate(4);  ellipse(4, -3, 118, 128);
  fill(c(0, 80, 72));   rotate(-4); ellipse(-3, 4, 82, 72);
  fill(c(220, 75, 62)); rotate(3);  ellipse(2, -2, 45, 52);
  pop();

  // ---- SQUARE 8 (600,200) ----
  push();
  fill(c(210, 40, 52)); square(600, 200, 200);
  translate(700, 300);
  fill(c(30, 25, 78));  rotate(2);  ellipse(3, -4, 185, 172);
  fill(c(215, 68, 65)); rotate(-4); ellipse(-3, 3, 155, 145);
  fill(c(20, 18, 25));  rotate(3);  ellipse(3, -3, 122, 115);
  fill(c(0, 82, 78));   rotate(-4); ellipse(-2, 3, 88, 95);
  fill(c(35, 20, 88));  rotate(3);  ellipse(3, -2, 52, 45);
  fill(c(45, 88, 85));  rotate(-2); ellipse(-2, 2, 28, 22);
  pop();

  // ---- SQUARE 9 (0,400) ----
  push();
  fill(c(15, 75, 68)); square(0, 400, 200);
  translate(100, 500);
  fill(c(130, 68, 55)); rotate(3);  ellipse(4, -5, 185, 172);
  fill(c(330, 62, 72)); rotate(-5); ellipse(-4, 4, 152, 142);
  fill(c(115, 65, 58)); rotate(4);  ellipse(3, -3, 118, 110);
  fill(c(215, 72, 72)); rotate(-4); ellipse(-3, 3, 72, 82);
  pop();

  // ---- SQUARE 10 (200,400) ----
  push();
  fill(c(225, 72, 65)); square(200, 400, 200);
  translate(300, 500); rectMode(CENTER);
  fill(c(0, 78, 72));   rotate(1);  rect(0, 0, 175, 172, 35);
  fill(c(225, 72, 65)); rotate(-1); rect(0, 0, 158, 155, 30);
  fill(c(0, 80, 68));   rotate(-2); rect(0, 2, 148, 145, 28);
  fill(c(168, 62, 58)); rotate(2);  rect(-1, 1, 112, 108, 22);
  fill(c(300, 68, 48)); rotate(-1); rect(1, 0, 85, 82, 18);
  fill(c(35, 15, 85));  rotate(1);  rect(0, 1, 52, 50, 12);
  pop();

  // ---- SQUARE 11 (400,400) ----
  push();
  fill(c(45, 82, 85)); square(400, 400, 210);
  translate(505, 505); rectMode(CENTER);
  fill(c(0, 82, 78));   rotate(2);  ellipse(4, -5, 182, 168);
  fill(c(45, 85, 88));  rotate(-3); ellipse(-3, 4, 162, 150);
  fill(c(20, 78, 78));  rotate(4);  ellipse(3, -3, 148, 138);
  fill(c(45, 82, 85));  rotate(-4); ellipse(-3, 3, 115, 108);
  fill(c(300, 72, 55)); rotate(3);  ellipse(2, -2, 72, 78);
  pop();

  // ---- SQUARE 12 (600,400) ----
  push();
  fill(c(0, 72, 68)); square(600, 400, 210);
  translate(705, 505); rectMode(CENTER);
  fill(c(120, 68, 42)); rotate(4);  ellipse(5, -6, 192, 175);
  fill(c(0, 72, 68));   rotate(-5); ellipse(-4, 5, 168, 155);
  fill(c(275, 62, 58)); rotate(6);  ellipse(5, -4, 155, 142);
  fill(c(45, 82, 82));  rotate(-7); ellipse(-5, 5, 118, 105);
  fill(c(168, 58, 58)); rotate(5);  ellipse(-12, 7, 88, 72);
  fill(c(15, 78, 72));  rotate(4);  ellipse(-3, 5, 52, 65);
  pop();

  // ---- HUD ----
  colorMode(RGB);
  fill(255, 255, 255, 160);
  noStroke();
  rect(10, height - 30, 310, 22, 5);
  fill(40);
  textSize(11);
  textAlign(LEFT, CENTER);
  let volPercent = constrain(Math.round(map(mouseY, height, 0, 0, 100)), 0, 100);
  text(`Volume: ${volPercent}%   |   Pitch: ${mouseX < width/3 ? 'Low ◀' : mouseX < (width*2)/3 ? '▶ Mid ◀' : '▶ High'}`, 18, height - 19);
  colorMode(HSB, 360, 100, 100, 100);
}
