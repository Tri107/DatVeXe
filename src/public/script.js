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

      if (!activeFound) links[0].classList.add("active"); // mặc định /admin
    });