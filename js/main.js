const glow = document.querySelector('.glow');
const hero = document.querySelector('.hero');
if (glow && hero) {
	hero.addEventListener('mousemove', (e) => {
		const rect = hero.getBoundingClientRect();
		const x = e.clientX - rect.left - rect.width / 2;
		const y = e.clientY - rect.top - rect.height / 2;
		const maxOffset = 18;
		const offsetX = Math.max(-maxOffset, Math.min(maxOffset, x / 20));
		const offsetY = Math.max(-maxOffset, Math.min(maxOffset, y / 20));
		glow.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
	});
	hero.addEventListener('mouseleave', () => {
		glow.style.transform = 'translate(-50%, -50%)';
	});
}

const yrEl = document.getElementById('yr');
if (yrEl) yrEl.textContent = new Date().getFullYear();

const glitchEl = document.querySelector('.glitch');
if (glitchEl && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
	function scheduleGlitch() {
		const delay = 3500 + Math.random() * 4500;
		setTimeout(() => {
			glitchEl.classList.add('glitching');
			setTimeout(() => glitchEl.classList.remove('glitching'), 180);
			scheduleGlitch();
		}, delay);
	}
	scheduleGlitch();
}

const railFill = document.getElementById('railFill');
const railNodes = document.querySelectorAll('.rail-node');
const sections = document.querySelectorAll('main .section');

function updateRail() {
	const scrollTop = window.scrollY;
	const docHeight = document.documentElement.scrollHeight - window.innerHeight;
	const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
	if (railFill) railFill.style.height = `${Math.min(100, Math.max(0, progress))}%`;

	let activeId = sections[0]?.id;
	sections.forEach((sec) => {
		const rect = sec.getBoundingClientRect();
		if (rect.top <= window.innerHeight * 0.5) activeId = sec.id;
	});
	railNodes.forEach((node) => {
		node.classList.toggle('active', node.getAttribute('href') === `#${activeId}`);
	});
}
window.addEventListener('scroll', updateRail, { passive: true });
window.addEventListener('resize', updateRail);
updateRail();

const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
	const io = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('in-view');
				io.unobserve(entry.target);
			}
		});
	}, { threshold: 0.15 });
	revealEls.forEach((el) => io.observe(el));
} else {
	revealEls.forEach((el) => el.classList.add('in-view'));
}

const statusOrder = { Ongoing: 0, Paused: 1, Finished: 2, Abandoned: 3, Unknown: 4 };

let projects = [];
let activeFilter = 'all';

const cardsList = document.getElementById('cardsList');
const cardsFilter = document.getElementById('cardsFilter');

fetch('projects.json')
	.then((res) => res.json())
	.then((data) => {
		projects = data.slice().sort((a, b) => (statusOrder[a.status] ?? 5) - (statusOrder[b.status] ?? 5));
		renderFilters();
		renderCards();
	})
	.catch((err) => console.error('Failed to load projects.json', err));

function renderFilters() {
	if (!cardsFilter) return;
	const categories = ['all', ...new Set(projects.map((p) => p.category).filter(Boolean))];
	cardsFilter.innerHTML = '';

	categories.forEach((cat) => {
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'filter-btn' + (cat === activeFilter ? ' active' : '');
		btn.textContent = cat === 'all' ? 'All' : cat.charAt(0) + cat.slice(1).toLowerCase();
		btn.addEventListener('click', () => {
			activeFilter = cat;
			cardsFilter.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
			btn.classList.add('active');
			renderCards();
		});
		cardsFilter.appendChild(btn);
	});
}

function renderCards() {
	if (!cardsList) return;
	const list = activeFilter === 'all' ? projects : projects.filter((p) => p.category === activeFilter);
	cardsList.innerHTML = '';

	list.forEach((p) => {
		const li = document.createElement('li');
		li.className = 'card';
		const statusClass = (p.status || '').toLowerCase();

		const inner = `
			<span class="card-tag">${p.category || 'Code'}</span>
			<h3 class="card-title">${p.title}</h3>
			<p class="card-desc">${p.desc}</p>
			<span class="card-status ${statusClass}">${p.status || 'Unknown'}</span>
		`;

		if (p.link) {
			li.classList.add('has-link');
			li.innerHTML = `<a class="card-link" href="${p.link}" target="_blank" rel="noopener noreferrer">${inner}</a>`;
		} else {
			li.innerHTML = inner;
		}
		cardsList.appendChild(li);
	});
}
