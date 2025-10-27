document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("nav a");
  const currentPath = window.location.pathname;

  let activeFound = false;
  links.forEach(link => {
    if (currentPath === link.getAttribute("href")) {
      link.classList.add("active");
      activeFound = true;
    }
    link.addEventListener("click", () => {
      links.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  if (!activeFound) links[0].classList.add("active"); 

  fetch('api/ve/weekly-stats')
    .then(res => res.json())
    .then(data => {
      const labels = data.map(item => 'Tuần ' + item.week.toString().slice(-2));
      const values = data.map(item => item.totalTickets);

      const ctx = document.getElementById('ticketChart').getContext('2d');

      new Chart(ctx, {
        data: {
          labels: labels,
          datasets: [
            {
              type: 'bar',
              label: 'Số lượng vé',
              data: values,
              backgroundColor: 'rgba(0, 123, 255, 0.8)',
              borderColor: 'rgba(0, 123, 255, 1)',
              borderWidth: 1.5,
              borderRadius: 6,
              order: 2
            },
            {
              type: 'line',
              label: 'Xu hướng',
              data: values,
              borderColor: '#ff3b30',
              borderWidth: 3,
              tension: 0.3,
              fill: false,
              pointBackgroundColor: '#ff3b30',
              pointRadius: 5,
              order: 1
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#222',
                font: { size: 14, weight: '600' }
              }
            },
            title: {
              display: true,
              text: ' Số lượng vé bán ra theo từng tuần',
              color: '#111',
              font: { size: 18, weight: 'bold' }
            },
            tooltip: {
              backgroundColor: 'rgba(0,0,0,0.8)',
              titleFont: { size: 14, weight: 'bold' },
              bodyFont: { size: 13 },
              padding: 10,
              cornerRadius: 6
            }
          },
          scales: {
            x: {
              ticks: { color: '#333', font: { size: 13 } },
              grid: { display: false }
            },
            y: {
              beginAtZero: true,
              ticks: { color: '#333', font: { size: 13 }, stepSize: 1 },
              grid: { color: 'rgba(200,200,200,0.2)' }
            }
          },
          animation: {
            duration: 900,
            easing: 'easeOutQuart'
          }
        }
      });
    })
    .catch(err => console.error('Lỗi khi tải thống kê vé:', err));
});