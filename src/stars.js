export function startStarfield() {
  const canvas = document.createElement("canvas");
  canvas.id = "starfield";
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");

  let stars = [];
  let meteors = [];
  let spawnTimer = 0;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const count = Math.floor((canvas.width * canvas.height) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.3,
      a: 0.25 + Math.random() * 0.45,
    }));
  }

  function spawnMeteor() {
    const angle = Math.random() * (Math.PI / 3) + Math.PI / 6;
    const speed = 6 + Math.random() * 5;
    meteors.push({
      x: Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
      y: -20,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      len: 120 + Math.random() * 120,
    });
  }

  function frame(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const s of stars) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(226, 232, 240, ${s.a})`;
      ctx.fill();
    }

    spawnTimer -= 1;
    if (spawnTimer <= 0) {
      spawnMeteor();
      spawnTimer = 40 + Math.random() * 80;
    }

    meteors = meteors.filter((m) => m.life > 0 && m.y < canvas.height + 200);
    for (const m of meteors) {
      m.x += m.vx;
      m.y += m.vy;
      m.life -= 0.008;
      const dist = Math.hypot(m.vx, m.vy);
      const tailX = m.x - (m.vx / dist) * m.len;
      const tailY = m.y - (m.vy / dist) * m.len;
      const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
      grad.addColorStop(0, `rgba(34, 211, 238, ${m.life})`);
      grad.addColorStop(1, "rgba(34, 211, 238, 0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();
    }

    requestAnimationFrame(frame);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(frame);
}