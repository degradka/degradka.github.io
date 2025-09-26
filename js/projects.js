const projectsPerPage = 8;
let currentPage = 1;
let projects = [];
fetch('projects.json').then((response) => response.json()).then((data) => {
	projects = data;
	renderProjects(currentPage);
	renderPagination();
}).catch((error) => {
	console.error('Failed to load projects.json', error);
});

function renderProjects(page = 1) {
	const start = (page - 1) * projectsPerPage;
	const end = start + projectsPerPage;
	const pageProjects = projects.slice(start, end);
	const container = document.getElementById('projects-list');
	container.innerHTML = '';

	pageProjects.forEach(p => {
		const li = document.createElement('li');
		// Check if project has a link
		if (p.link) {
			li.classList.add('project-card', 'has-link');
			li.innerHTML = `
				<a href="${p.link}" target="_blank" rel="noopener noreferrer" class="project-link">
					<span class="project-status ${p.status?.toLowerCase() || ''}">${p.status || 'Unknown'}</span>
					<div class="project-image-wrapper">
						<img class="project-image" src="${p.img}" alt="${p.title}" />
					</div>
					<h3 class="project-title">${p.title}</h3>
					<p class="project-desc">${p.desc}</p>
				</a>
			`;
		} else {
			li.classList.add('project-card');
			li.innerHTML = `
				<span class="project-status ${p.status?.toLowerCase() || ''}">${p.status || 'Unknown'}</span>
				<div class="project-image-wrapper">
					<img class="project-image" src="${p.img}" alt="${p.title}" />
				</div>
				<h3 class="project-title">${p.title}</h3>
				<p class="project-desc">${p.desc}</p>
			`;
		}
		container.appendChild(li);
	});
}

function renderPagination() {
	const totalPages = Math.ceil(projects.length / projectsPerPage);
	const pagination = document.getElementById('pagination');
	pagination.innerHTML = '';
	for(let i = 1; i <= totalPages; i++) {
		const btn = document.createElement('button');
		btn.textContent = i;
		btn.className = i === currentPage ? 'active' : '';
		btn.addEventListener('click', () => {
			currentPage = i;
			renderProjects(currentPage);
			renderPagination();
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		});
		pagination.appendChild(btn);
	}
}
renderProjects();
renderPagination();