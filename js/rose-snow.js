(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'rose-snow';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.append(canvas);

    const context = canvas.getContext('2d', { alpha: true });
    if (!context) {
        canvas.remove();
        return;
    }

    const petals = [];
    const random = (min, max) => min + Math.random() * (max - min);
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let lastFrame = 0;
    let animationFrame = 0;

    const makePetal = (startAbove = false) => ({
        x: random(0, width),
        y: startAbove ? random(-height, -12) : random(-30, height),
        size: random(8, 14),
        fall: random(8, 16),
        drift: random(-9, 9),
        sway: random(5, 14),
        phase: random(0, Math.PI * 2),
        phaseSpeed: random(0.25, 0.8),
        spin: random(-1.2, 1.2),
        spinTimer: random(1.5, 4),
        windTimer: random(2, 5),
        angle: random(0, Math.PI * 2),
        opacity: random(0.48, 0.76),
        isGold: Math.random() < 0.24
    });

    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        const count = width < 600 ? 2 : Math.min(6, Math.max(3, Math.round(width / 280)));
        while (petals.length < count) petals.push(makePetal());
        petals.length = count;
    };

    const drawRose = petal => {
        context.save();
        context.translate(petal.x, petal.y);
        context.rotate(petal.angle);
        context.globalAlpha = petal.opacity;
        const size = petal.size;
        const fill = context.createLinearGradient(-size, -size, size, size);
        fill.addColorStop(0, petal.isGold ? '#fff1c9' : '#ffffff');
        fill.addColorStop(0.42, petal.isGold ? '#ead39a' : '#f7f4f0');
        fill.addColorStop(1, petal.isGold ? '#c8a960' : '#ddd7d2');

        context.beginPath();
        context.moveTo(0, size);
        context.bezierCurveTo(-size * 0.2, size * 0.72, -size * 0.92, size * 0.48, -size * 0.9, -size * 0.12);
        context.bezierCurveTo(-size * 0.92, -size * 0.7, -size * 0.38, -size * 1.05, size * 0.1, -size);
        context.bezierCurveTo(size * 0.56, -size * 1.08, size * 1.02, -size * 0.78, size * 0.82, -size * 0.3);
        context.bezierCurveTo(size * 0.68, size * 0.12, size * 0.35, size * 0.56, 0, size);
        context.closePath();
        context.fillStyle = fill;
        context.fill();
        context.strokeStyle = 'rgba(255, 255, 255, 0.78)';
        context.lineWidth = Math.max(0.45, size * 0.045);
        context.stroke();

        context.beginPath();
        context.moveTo(size * 0.04, size * 0.82);
        context.bezierCurveTo(-size * 0.18, size * 0.24, size * 0.42, -size * 0.28, size * 0.78, -size * 0.7);
        context.strokeStyle = 'rgba(255, 255, 255, 0.72)';
        context.lineWidth = Math.max(0.45, size * 0.06);
        context.lineCap = 'round';
        context.stroke();

        context.restore();
    };

    const render = timestamp => {
        if (document.hidden) {
            animationFrame = 0;
            return;
        }

        const delta = Math.min((timestamp - (lastFrame || timestamp)) / 1000, 0.05);
        lastFrame = timestamp;
        context.clearRect(0, 0, width, height);

        petals.forEach(petal => {
            petal.y += petal.fall * delta;
            petal.phase += delta * petal.phaseSpeed;
            petal.spinTimer -= delta;
            petal.windTimer -= delta;
            if (petal.spinTimer <= 0) {
                petal.spin = random(-1.2, 1.2);
                petal.spinTimer = random(1.5, 4);
            }
            if (petal.windTimer <= 0) {
                petal.drift = random(-9, 9);
                petal.windTimer = random(2, 5);
            }
            petal.angle += petal.spin * delta;
            petal.x += (petal.drift + Math.sin(petal.phase) * petal.sway) * delta;
            if (petal.x < -20) petal.x = width + 20;
            if (petal.x > width + 20) petal.x = -20;
            drawRose(petal);

            if (petal.y > height + 20) Object.assign(petal, makePetal(true));
        });

        animationFrame = window.requestAnimationFrame(render);
    };

    const start = () => {
        if (!animationFrame && !document.hidden && !reducedMotion.matches) {
            lastFrame = 0;
            animationFrame = window.requestAnimationFrame(render);
        }
    };

    const pause = () => {
        if (animationFrame) window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        lastFrame = 0;
        context.clearRect(0, 0, width, height);
    };

    resize();
    start();
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) pause();
        else start();
    });
    const handleMotionPreference = event => {
        if (event.matches) pause();
        else start();
    };
    if (typeof reducedMotion.addEventListener === 'function') {
        reducedMotion.addEventListener('change', handleMotionPreference);
    } else {
        reducedMotion.addListener(handleMotionPreference);
    }
})();
