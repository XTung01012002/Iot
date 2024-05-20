"use strict";
let sortDirection = {
  idsensor: true,
  temperature: true,
  humidity: true,
  light: true,
  wind: true,
  created_at: true
};


async function fetchData() {
  try {
      const response = await fetch('http://localhost:2002/data_sensor/getall'); // Thay URL_API_CUA_BAN bằng URL thật của API
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}

function paginate(data, pageSize) {
  let pages = [];
  for (let i = 0; i < data.length; i += pageSize) {
      pages.push(data.slice(i, i + pageSize));
  }
  console.log(pages);
  return pages;

}

function createPagination(pages) {
  const paginationContainer = document.getElementById('pagination');
  paginationContainer.innerHTML = '';

  pages.forEach((_, index) => {
      const pageButton = document.createElement('button');
      pageButton.textContent = index + 1;
      pageButton.addEventListener('click', () => {
          displayPage(pages, index);
          updateActiveButton(index);
      });
      paginationContainer.appendChild(pageButton);
  });
}

function updateActiveButton(activeIndex) {
  const buttons = document.querySelectorAll('#pagination button');
  buttons.forEach((button, index) => {
      button.classList.toggle('active', index === activeIndex);
  });
}

function displayPage(pages, pageIndex) {
  const dataContainer = document.getElementById('dataRows');
  dataContainer.innerHTML = '';
  if (pages === 0) {
    // Nếu không có dữ liệu, hiển thị thông báo "No Data"
    const newRow = document.createElement('tr');
    newRow.innerHTML = '<td colspan="5">No Data</td>'; // colspan="5" để căn giữa cột
    dataContainer.appendChild(newRow);
  } else {
    // Nếu có dữ liệu, hiển thị dữ liệu như bình thường
    pages[pageIndex].forEach(item => {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td>${item.idsensor}</td>
        <td>${item.temperature}°C</td>
        <td>${item.humidity}%</td>
        <td>${item.light} Lux</td>
        <td>${item.wind}</td>
        <td>${item.created_at}</td>
      `;
      dataContainer.appendChild(newRow);
    });
  }
}

function sortTable(column) {
  fetchData().then(data => {
    const sortedData = data.sort((a, b) => {
      let aValue = a[column];
      let bValue = b[column];
      
      // Nếu là cột 'temperature', 'humidity' hoặc 'light', chuyển đổi giá trị thành số
      if (column === 'temperature') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else if (column === 'humidity' || column === 'light' || column === 'idsensor') {
        aValue = parseInt(aValue);
        bValue = parseInt(bValue);
      }
      if (aValue < bValue) return sortDirection[column] ? -1 : 1;
      if (aValue > bValue) return sortDirection[column] ? 1 : -1;
      return 0;
    });
    sortDirection[column] = !sortDirection[column];

    const pageSize = 8; // Số lượng mục trên mỗi trang
    const pages = paginate(sortedData, pageSize);
    createPagination(pages);
    displayPage(pages, 0); // Hiển thị trang đầu tiên mặc định
    updateActiveButton(0); // Đặt nút đầu tiên là nút active
  });
}

fetchData().then(data => {
  const pageSize = 8  ; // Số lượng mục trên mỗi trang
  const pages = paginate(data, pageSize);
  createPagination(pages);
  displayPage(pages, 0); // Hiển thị trang đầu tiên mặc định
  updateActiveButton(0); // Đặt nút đầu tiên là nút active
});

document.getElementById('searchButton').addEventListener('click', function() {
  const filter = document.getElementById('filterSelect').value;
  const value = document.getElementById('searchInput').value;
  console.log(value);
  console.log(filter);
  console.log("hi");
  if (filter ) {
    async function fetchData1() {
      try {
          const response = await fetch(`http://localhost:2002/data_sensor/getsearch?filter=${encodeURIComponent(filter)}&value=${encodeURIComponent(value)}`); // Thay URL_API_CUA_BAN bằng URL thật của API
          const data = await response.json();
          return data;
      } catch (error) {
        const pages =0;
        displayPage(pages,0);
        createPagination(pages);
          
      } 
    }
    fetchData1().then(data => {
      const pageSize = 8; // Số lượng mục trên mỗi trang
      const pages = paginate(data, pageSize);
      createPagination(pages);
      displayPage(pages, 0); // Hiển thị trang đầu tiên mặc định
      updateActiveButton(0); // Đặt nút đầu tiên là nút active
    });
}});



// Toggle dropdown menus
Array.from(document.getElementsByClassName("menu is-menu-main")).forEach(function(menu) {
  Array.from(menu.getElementsByClassName("has-dropdown-icon")).forEach(function(item) {
      item.addEventListener("click", function(event) {
          var dropdownIcon = event.currentTarget.getElementsByClassName("dropdown-icon")[0].getElementsByClassName("mdi")[0];
          event.currentTarget.parentNode.classList.toggle("is-active");
          dropdownIcon.classList.toggle("mdi-plus");
          dropdownIcon.classList.toggle("mdi-minus");
      });
  });
});

// Toggle mobile navigation
Array.from(document.getElementsByClassName("jb-aside-mobile-toggle")).forEach(function(item) {
  item.addEventListener("click", function(event) {
      var icon = event.currentTarget.getElementsByClassName("icon")[0].getElementsByClassName("mdi")[0];
      document.documentElement.classList.toggle("has-aside-mobile-expanded");
      icon.classList.toggle("mdi-forwardburger");
      icon.classList.toggle("mdi-backburger");
  });
});

// Toggle navbar menu
Array.from(document.getElementsByClassName("jb-navbar-menu-toggle")).forEach(function(item) {
  item.addEventListener("click", function(event) {
      var icon = event.currentTarget.getElementsByClassName("icon")[0].getElementsByClassName("mdi")[0];
      var targetId = event.currentTarget.getAttribute("data-target");
      document.getElementById(targetId).classList.toggle("is-active");
      icon.classList.toggle("mdi-dots-vertical");
      icon.classList.toggle("mdi-close");
  });
});

// Open modals
Array.from(document.getElementsByClassName("jb-modal")).forEach(function(item) {
  item.addEventListener("click", function(event) {
      var targetId = event.currentTarget.getAttribute("data-target");
      document.getElementById(targetId).classList.add("is-active");
      document.documentElement.classList.add("is-clipped");
  });
});

// Close modals
Array.from(document.getElementsByClassName("jb-modal-close")).forEach(function(item) {
  item.addEventListener("click", function(event) {
      event.currentTarget.closest(".modal").classList.remove("is-active");
      document.documentElement.classList.remove("is-clipped");
  });
});

// Dismiss notifications
Array.from(document.getElementsByClassName("jb-notification-dismiss")).forEach(function(item) {
  item.addEventListener("click", function(event) {
      event.currentTarget.closest(".notification").classList.add("is-hidden");
  });
});

  
