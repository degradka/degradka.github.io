const glow = document.querySelector('.glow');
const container = document.querySelector('.container');
const h1 = document.querySelector('h1');
document.body.classList.add('loading');
container.addEventListener('mousemove', (e) => {
	const rect = h1.getBoundingClientRect();
	const x = e.clientX - rect.left - rect.width / 2;
	const y = e.clientY - rect.top - rect.height / 2;
	const maxOffset = 15;
	const offsetX = Math.max(-maxOffset, Math.min(maxOffset, x / 20));
	const offsetY = Math.max(-maxOffset, Math.min(maxOffset, y / 20));
	glow.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
	glow.style.background = `
		radial-gradient(circle at center, rgba(255, 122, 0, 0.6) 0%, transparent 70%),
		radial-gradient(circle at center, rgba(255, 122, 0, 0.3) 20%, transparent 90%)
	  `;
});
container.addEventListener('mouseleave', () => {
	glow.style.transform = 'translate(-50%, -50%)';
	glow.style.background = `
		radial-gradient(circle at center, rgba(255, 122, 0, 0.6) 0%, transparent 70%),
		radial-gradient(circle at center, rgba(255, 122, 0, 0.3) 20%, transparent 90%)
	  `;
});
window.addEventListener('load', () => {
	setTimeout(() => {
		document.body.classList.remove('loading');
	}, 1300); // slightly longer than animation duration (1.3s)
});
const canvas = document.createElement('canvas');
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.pointerEvents = 'none';
canvas.style.zIndex = '2';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const particles = [];
const particleCount = 30;
class Particle {
	constructor() {
		this.x = Math.random() * canvas.width;
		this.y = Math.random() * canvas.height;
		this.size = Math.random() * 2 + 1;
		this.speedX = Math.random() * 0.5 - 0.25;
		this.speedY = Math.random() * 0.5 - 0.25;
	}
	update() {
		this.x += this.speedX;
		this.y += this.speedY;
		if(this.x < 0 || this.x > canvas.width) this.speedX *= -1;
		if(this.y < 0 || this.y > canvas.height) this.speedY *= -1;
	}
	draw() {
		ctx.fillStyle = 'rgba(255, 122, 0, 0.3)';
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		ctx.fill();
	}
}
for(let i = 0; i < particleCount; i++) {
	particles.push(new Particle());
}

function animateParticles() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	particles.forEach(p => {
		p.update();
		p.draw();
	});
	requestAnimationFrame(animateParticles);
}
animateParticles();
window.addEventListener('resize', () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});