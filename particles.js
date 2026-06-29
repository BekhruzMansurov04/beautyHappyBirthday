/* =========================
   PARTICLE SYSTEM (OPTIMIZED)
========================= */

const heartContainer = document.getElementById("heart-container");
const petalContainer = document.getElementById("petal-container");
const fireflyContainer = document.getElementById("firefly-container");

/* =========================
   SAFE LIMITS (IMPORTANT)
========================= */

let heartCount = 0;
let petalCount = 0;
const MAX_HEARTS = 40;
const MAX_PETALS = 30;

/* =========================
   HEART PARTICLES (CONTROLLED)
========================= */

function createHeart() {

    if (!heartContainer) return;
    if (heartCount > MAX_HEARTS) return;

    const heart = document.createElement("div");
    heart.innerHTML = "💖";

    heart.style.position = "absolute";
    heart.style.left = Math.random() * window.innerWidth + "px";
    heart.style.bottom = "-20px";

    heart.style.fontSize = (12 + Math.random() * 22) + "px";
    heart.style.opacity = 0.9;
    heart.style.pointerEvents = "none";
    heart.style.filter = "drop-shadow(0 0 8px hotpink)";
    heart.style.animation = "floatHeart 6s linear forwards";

    heartContainer.appendChild(heart);
    heartCount++;

    setTimeout(() => {
        heart.remove();
        heartCount--;
    }, 6000);
}

/* SAFE INTERVAL */
setInterval(createHeart, 400);

/* =========================
   FALLING PETALS (CONTROLLED)
========================= */

function createPetal() {

    if (!petalContainer) return;
    if (petalCount > MAX_PETALS) return;

    const petal = document.createElement("div");
    petal.innerHTML = "🌸";

    petal.style.position = "absolute";
    petal.style.left = Math.random() * window.innerWidth + "px";
    petal.style.top = "-30px";

    petal.style.fontSize = (10 + Math.random() * 16) + "px";
    petal.style.opacity = 0.8;
    petal.style.pointerEvents = "none";
    petal.style.animation = "fallPetal 7s linear forwards";

    petalContainer.appendChild(petal);
    petalCount++;

    setTimeout(() => {
        petal.remove();
        petalCount--;
    }, 7000);
}

setInterval(createPetal, 500);

/* =========================
   FIREFLIES (LIMITED + LIGHTWEIGHT)
========================= */

class Firefly {
    constructor() {

        this.el = document.createElement("div");
        this.el.className = "firefly";

        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;

        this.speedX = (Math.random() - 0.5) * 1.2;
        this.speedY = (Math.random() - 0.5) * 1.2;

        this.el.style.left = this.x + "px";
        this.el.style.top = this.y + "px";

        fireflyContainer?.appendChild(this.el);
    }

    update() {

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > window.innerWidth) this.speedX *= -1;
        if (this.y < 0 || this.y > window.innerHeight) this.speedY *= -1;

        this.el.style.left = this.x + "px";
        this.el.style.top = this.y + "px";
    }
}

const fireflies = [];

/* reduce for mobile performance */
const FLY_COUNT = window.innerWidth < 768 ? 12 : 22;

for (let i = 0; i < FLY_COUNT; i++) {
    fireflies.push(new Firefly());
}

function animateFireflies() {
    for (let f of fireflies) f.update();
    requestAnimationFrame(animateFireflies);
}

animateFireflies();

/* =========================
   BUTTERFLIES (FIXED + LIMITED)
========================= */

function createButterfly() {

    const b = document.createElement("div");
    b.innerHTML = "🦋";

    b.style.position = "absolute";
    b.style.fontSize = "20px";
    b.style.pointerEvents = "none";

    let x = Math.random() * window.innerWidth;
    let y = Math.random() * window.innerHeight;

    let angle = 0;

    document.body.appendChild(b);

    function move() {

        angle += 0.03;

        x += Math.cos(angle) * 1.5;
        y += Math.sin(angle * 2) * 1.5;

        b.style.left = x + "px";
        b.style.top = y + "px";

        requestAnimationFrame(move);
    }

    move();
}

/* LIMITED SPAWN (NO OVERLOAD) */
setTimeout(() => {
    createButterfly();
}, 4000);

/* =========================
   CSS ANIMATIONS
========================= */

const style = document.createElement("style");

style.innerHTML = `

@keyframes floatHeart {
    0% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
    100% {
        transform: translateY(-120vh) scale(1.4);
        opacity: 0;
    }
}

@keyframes fallPetal {
    0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: translateY(120vh) rotate(360deg);
        opacity: 0;
    }
}

.firefly {
    position: absolute;
    width: 6px;
    height: 6px;
    background: yellow;
    border-radius: 50%;
    box-shadow: 0 0 8px yellow;
    animation: glow 2s infinite alternate;
}

@keyframes glow {
    from { opacity: 0.3; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1.2); }
}

`;

document.head.appendChild(style);