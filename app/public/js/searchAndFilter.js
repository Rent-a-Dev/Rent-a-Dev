let searchAndFilter = document.getElementById('search-and-filter');

function hideFilters() {
  if (window.innerWidth < 600) {
    searchAndFilter.style.display = 'none';
  } else {
    searchAndFilter.style.display = 'flex';
  }
};

hideFilters();

window.onresize = hideFilters;