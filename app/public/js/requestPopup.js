let start = document.getElementById('startDate');
let end = document.getElementById('endDate');

start.min = new Date().toISOString().split("T")[0];

start.addEventListener('change', function () {
  if (start.value) {

    if (new Date(start.value) < new Date()) {
      start.valueAsDate = new Date();
    }

    end.min = start.value;

    if (end.value && end.value < end.min) {
      end.value = end.min;
    }
  }

}, false);