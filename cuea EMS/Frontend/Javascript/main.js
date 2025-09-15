function loadContent(page) {
  const content = document.getElementById('main-content');
  const fullPath = 'Dashboard/' + page;

  fetch(fullPath)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then(data => {
      content.innerHTML = data;

      // Load only for calendar
      if (page === 'Calendar.html') {
        loadCSS('/Frontend/Css/Calendar.css');
        loadScript('/Frontend/Javascript/calendar.js');
      } else {
        removeCSS('/Frontend/Css/Calendar.css');
      }
    })
    .catch(err => {
      console.error('❌ Fetch error:', err);
      content.innerHTML = "<p>Failed to load content.</p>";
    });
}

function loadCSS(href) {
  if (!document.querySelector(`link[href="${href}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
}

function removeCSS(href) {
  const link = document.querySelector(`link[href="${href}"]`);
  if (link) link.remove();
}

function loadScript(src) {
  if (!document.querySelector(`script[src="${src}"]`)) {
    const script = document.createElement('script');
    script.src = src;
    script.defer = false;
    script.onload = () => console.log(`✅ Loaded ${src}`);
    script.onerror = () => console.error(`❌ Failed to load ${src}`);
    document.body.appendChild(script);
  }
}
