let sortDirection = {
  id: true,
  device: true,
  action: true,
  time: true,
};


async function fetchData() {
    try {
        const response = await fetch('http://localhost:2002/action_history/getall'); // Thay URL_API_CUA_BAN bằng URL thật của API
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
    pages[pageIndex].forEach(item => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
          <td>${item.id}</td>
          <td>${item.device}</td>
          <td>${item.action}</td>
          <td>${item.created_at}</td>
      `;
        dataContainer.appendChild(newRow);
    });
  }}
  
  fetchData().then(data => {
    const pageSize = 8; // Số lượng mục trên mỗi trang
    const pages = paginate(data, pageSize);
    createPagination(pages);
    displayPage(pages, 0); // Hiển thị trang đầu tiên mặc định
    updateActiveButton(0); // Đặt nút đầu tiên là nút active
  });


document.getElementById('searchButton').addEventListener('click', function() {
  const filter = document.getElementById('filterSelect').value;
  const value = document.getElementById('searchInput').value;
  if (filter ) {
    async function fetchData1() {
      try {
          const response = await fetch(`http://localhost:2002/action_history/getsearch?filter=${encodeURIComponent(filter)}&value=${encodeURIComponent(value)}
          `); // Thay URL_API_CUA_BAN bằng URL thật của API
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

function sortTable(column) {
  fetchData().then(data => {
    const sortedData = data.sort((a, b) => {
      let aValue = a[column];
      let bValue = b[column];
      
      // Nếu là cột 'temperature', 'humidity' hoặc 'light', chuyển đổi giá trị thành số
      if (column === 'id') {
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

