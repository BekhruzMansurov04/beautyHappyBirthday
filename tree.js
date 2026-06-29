const canvas = document.getElementById("treeCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

/* =========================
   TREE DATA
========================= */

let branches = [];
let hearts = [];

let animationStarted = false;

/* =========================
   BRANCH CLASS
========================= */

class Branch {
    constructor(x, y, angle, length, depth) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.length = length;
        this.depth = depth;

        this.grown = 0;
        this.maxGrow = length;
        this.split = false;
    }

    update() {

        if (this.grown < this.maxGrow) {
            this.grown += 1.8; // smoother growth
        }

        // natural wind movement
        this.angle += Math.sin(Date.now() * 0.001 + this.depth) * 0.0015;
    }

    draw() {

        const endX = this.x + Math.cos(this.angle) * this.grown;
        const endY = this.y + Math.sin(this.angle) * this.grown;

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(endX, endY);

        ctx.strokeStyle = "#5a2a1a";
        ctx.lineWidth = Math.max(1, 6 - this.depth);

        ctx.shadowColor = "#ff4da6";
        ctx.shadowBlur = 6;

        ctx.stroke();

        // spawn hearts ONLY once
        if (
            this.grown >= this.maxGrow &&
            this.depth < 6 &&
            !this.split
        ) {
            this.split = true;
            spawnHeart(endX, endY);
        }
    }
}

/* =========================
   CREATE TREE
========================= */

function createTree() {

    branches = [];

    const startX = canvas.width / 2;
    const startY = canvas.height;

    branches.push(new Branch(startX, startY, -Math.PI / 2, 120, 0));
}

/* =========================
   BRANCH EXPANSION
========================= */

function growBranches() {

    let newBranches = [];

    for (let i = 0; i < branches.length; i++) {

        const b = branches[i];
        b.update();

        if (b.grown >= b.maxGrow && b.depth < 6 && !b.split) {

            b.split = true;

            const endX = b.x + Math.cos(b.angle) * b.length;
            const endY = b.y + Math.sin(b.angle) * b.length;

            const spread = Math.random() * 0.5 + 0.4;

            newBranches.push(
                new Branch(endX, endY, b.angle - spread, b.length * 0.75, b.depth + 1)
            );

            newBranches.push(
                new Branch(endX, endY, b.angle + spread, b.length * 0.75, b.depth + 1)
            );
        }
    }

    branches.push(...newBranches);
}

/* =========================
   HEART SYSTEM (LIMITED)
========================= */

function spawnHeart(x, y) {

    if (hearts.length > 80) return; // prevent lag

    hearts.push({
        x,
        y,
        size: 12 + Math.random() * 10,
        alpha: 1,
        vy: -0.6 - Math.random() * 0.5
    });
}

/* =========================
   DRAW HEARTS
========================= */

function drawHearts() {

    for (let i = hearts.length - 1; i >= 0; i--) {

        const h = hearts[i];

        ctx.font = `${h.size}px Arial`;
        ctx.fillStyle = `rgba(255, 0, 120, ${h.alpha})`;
        ctx.fillText("❤️", h.x, h.y);

        h.y += h.vy;
        h.alpha -= 0.01;

        if (h.alpha <= 0) {
            hearts.splice(i, 1);
        }
    }
}

/* =========================
   MAIN LOOP (FRAME CONTROL)
========================= */

let lastTime = 0;

function animate(time) {

    // limit FPS for mobile (30fps)
    if (time - lastTime < 33) {
        requestAnimationFrame(animate);
        return;
    }

    lastTime = time;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < branches.length; i++) {
        branches[i].draw();
    }

    growBranches();
    drawHearts();

    requestAnimationFrame(animate);
}

/* =========================
   START TREE
========================= */

window.startTree = function () {

    if (animationStarted) return;

    animationStarted = true;

    createTree();
    animate();
};