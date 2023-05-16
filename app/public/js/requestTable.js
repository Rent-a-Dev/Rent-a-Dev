function showHideAvailability(id) {
  let row = document.getElementById(id);
  if (row.classList.contains('hiddenRow')) {
    row.classList.remove('hiddenRow');
    row.classList.add('visibleRow');
  }
  else {
    row.classList.remove('visibleRow');
    row.classList.add('hiddenRow');
  }
}

function configurePage() {
  let isApproveRequestsPage = '<%=isApproveRequests%>';
  let columns = document.getElementsByClassName('availabilityColumn');
  let columnName = document.getElementById("teamLead");

  if (isApproveRequestsPage) {
    columnName.innerHTML = 'Requested by';
    for (const column of columns) {
      column.classList.add('visibleColumn');
    }
  }
  else {
    columnName.innerHTML = 'Team Lead';
    for (const column of columns) {
      column.classList.add('hiddenColumn');
    }
  }
}

function approveRequest(id) {
  console.log("approved request with id " + id);
}

function rejectRequest(id) {
  console.log("rejected request with id " + id);
}

configurePage();