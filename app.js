const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
let currentTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
const resumeBtn = document.getElementById("resumeBtn");
  const resumeMenu = document.getElementById("resumeMenu");

  resumeBtn.addEventListener("click", () => {
    resumeMenu.classList.toggle("hidden");
  });

  // Close dropdown when clicked outside
  document.addEventListener("click", (e) => {
    if (!resumeBtn.contains(e.target) && !resumeMenu.contains(e.target)) {
      resumeMenu.classList.add("hidden");
    }
  });
function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    themeIcon.className = 'bx bx-sun';
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    themeIcon.className = 'bx bx-moon';
    localStorage.setItem('theme', 'light');
  }
}
applyTheme(currentTheme);

themeToggle.addEventListener('click', () => {
  currentTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
  applyTheme(currentTheme);
});



// MOBILE NAV
const mobileOpen = document.getElementById('mobileOpen');
const mobileNav = document.getElementById('mobileNav');
mobileOpen?.addEventListener('click', ()=> mobileNav.classList.toggle('hidden'));

// GSAP ANIMATIONS
gsap.registerPlugin(ScrollTrigger);

gsap.from('#hero h1', { y: 40, opacity: 0, duration: 0.9 });
gsap.from('#hero p', { y: 20, opacity: 0, duration: 0.8, delay: .2 });
gsap.from('#hero img', { scale: .95, opacity: 0, duration: 1, delay: .2 });

gsap.utils.toArray('.project-card').forEach(card => {
  gsap.from(card, {
    scrollTrigger: { trigger: card, start: 'top 80%' },
    y: 40, opacity: 0, duration: .8, ease: 'power2.out'
  });
});

gsap.utils.toArray('#about, #skills, #projects, #contact').forEach(section => {
  gsap.from(section.querySelector('h2, h3'), {
    scrollTrigger: { trigger: section, start: 'top 85%' },
    y: 20, opacity: 0, duration: .6
  });
});

// --------- Likes & Comments logic (localStorage) ---------
function storageKey(projectId){ return `portfolio_${projectId}`; }

function getData(projectId){
  const raw = localStorage.getItem(storageKey(projectId));
  if(!raw) return { likes:0, comments:[] };
  try{ return JSON.parse(raw); } catch(e){ return { likes:0, comments:[] }; }
}
function saveData(projectId, data){ localStorage.setItem(storageKey(projectId), JSON.stringify(data)); }

document.querySelectorAll('.project-card').forEach(card=>{
  const pid = card.dataset.id; // project1, project2, project3
  const likeBtn = card.querySelector('.like-btn');
  const likeCount = card.querySelector('.like-count');
  const cToggle = card.querySelector('.comment-toggle');
  const commentsWrap = card.querySelector('.comments');
  const existingComments = card.querySelector('.existing-comments');
  const commentInput = card.querySelector('.comment-input');
  const commentSend = card.querySelector('.comment-send');

  // init UI
  const data = getData(pid);
  likeCount.textContent = data.likes || 0;
  if(data.comments && data.comments.length){
    existingComments.innerHTML = data.comments.map(c => `<div class="p-2 rounded bg-[#081018]">${escapeHtml(c)}</div>`).join('');
  }

  // like action (toggle simple + increment)
  likeBtn.addEventListener('click', ()=>{
    const d = getData(pid);
    d.likes = (d.likes || 0) + 1;
    saveData(pid, d);
    likeCount.textContent = d.likes;
    likeBtn.classList.add('liked');
    // small pop animation
    gsap.fromTo(likeBtn, { scale:0.9 }, { scale:1.05, duration:0.15, yoyo:true, repeat:1 });
  });

  // comment toggle
  cToggle.addEventListener('click', ()=> commentsWrap.classList.toggle('hidden'));

  // send comment
  commentSend.addEventListener('click', ()=>{
    const text = commentInput.value.trim();
    if(!text) return;
    const d = getData(pid);
    d.comments = d.comments || [];
    d.comments.push(text);
    saveData(pid, d);
    existingComments.insertAdjacentHTML('beforeend', `<div class="p-2 rounded bg-[#081018]">${escapeHtml(text)}</div>`);
    commentInput.value = '';
  });
});

// escape helper
function escapeHtml(str){
  return str.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}

// -------- Contact Form (frontend only) --------
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
contactForm?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = document.getElementById('cname').value.trim();
  const email = document.getElementById('cemail').value.trim();
  const message = document.getElementById('cmessage').value.trim();
  if(!name || !email || !message){ formStatus.textContent = 'Please fill all fields.'; return; }
  // open mailto (user's default mail client)
  const subject = encodeURIComponent(`Message from portfolio: ${name}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${name} <${email}>`);
  window.location.href = `mailto:himanshuyadav9015830677@gmail.com?subject=${subject}&body=${body}`;
  formStatus.textContent = 'Opening email client...';
});
