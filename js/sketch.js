// 単一の粒子の特性を記述するクラス
class Particle {
// 粒子の座標、半径、速度を設定
  constructor() {
    this.x = random(0, width);
    this.y = random(0, height);
    this.r = random(1, 8);
    this.xSpeed = random(-2, 2);
    this.ySpeed = random(-1, 1.5);
  }

  // 粒子を作成
  createParticle(accentColor) {
    noStroke();
    let particleColor = color(accentColor)
    particleColor.setAlpha(128);
    fill(particleColor);
    circle(this.x, this.y, this.r);
  }

  // 粒子の動きを設定
  moveParticle() {
    if(this.x < 0 || this.x > width)
      this.xSpeed *= -1;
    if(this.y < 0 || this.y > height)
      this.ySpeed *= -1;
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    this.r = 10 * noise(this.x * 0.01, this.y * 0.01);
  }

  // 一定の距離を下回った粒子同士を線で繋ぐ
  joinParticles(particles, accentColor) {
    particles.forEach(element =>{
      let dis = dist(this.x,this.y,element.x,element.y);
      if (dis < 85) {
        let lineColor = color(accentColor);
        lineColor.setAlpha(15);
        stroke(lineColor);
        line(this.x,this.y,element.x,element.y);
      }
    });
  }
}

// 粒子を格納するための配列
let particles = [];

// このキャンバスを表示させるHTML要素を取得
const container = document.getElementById('top-image');

function setup() {
  // HTML要素の幅と高さを取得し、それをキャンバスの大きさとする
  let canvas = createCanvas(container.clientWidth, container.clientHeight);

  // キャンバスの親要素を設定
  canvas.parent('top-image');

  // 背景として表示
  canvas.style('z-index','-1');

  // 画面幅を使い、表示させる粒子の数を決定
  for (let i = 0; i < width / 10; i++) {
    particles.push(new Particle());
  }
}

function windowResized() {
  resizeCanvas(container.clientWidth, container.clientHeight);
}

function draw() {
  // theme.cssの色を取得
  const keyGray = getComputedStyle(document.documentElement).getPropertyValue('--key-gray').trim(); // 背景色
  const keyAccent = getComputedStyle(document.documentElement).getPropertyValue('--key-accent').trim(); // アクセントカラー

  background(keyGray);
  // 生成された粒子の数だけ繰り返し
  for (let i = 0; i < particles.length; i++) {
    particles[i].createParticle(keyAccent);
    particles[i].moveParticle();
    particles[i].joinParticles(particles.slice(i), keyAccent);
  }
}
