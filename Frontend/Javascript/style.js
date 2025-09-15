document.addEventListener('DOMContentLoaded', function() {
  const links = document.querySelectorAll('.sidebar ul li a');

  links.forEach(link => {
    link.addEventListener('click', function() {
      // Remove 'active' from all links
      links.forEach(l => l.classList.remove('active'));

      // Add 'active' to the clicked link
      this.classList.add('active');
    });
  });
});
function toggleDropdown(event) {
  event.preventDefault();

  const allDropdowns = document.querySelectorAll('.dropdown');
  allDropdowns.forEach(d => {
    if (d !== event.target.closest('.dropdown')) {
      d.classList.remove('open');
    }
  });

  const dropdown = event.target.closest('.dropdown');
  dropdown.classList.toggle('open');
}


