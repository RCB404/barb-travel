document.addEventListener("DOMContentLoaded", function () {
  const dropdownButton = document.querySelector(".dropbtn");
  const dropdown = document.querySelector(".dropdown");
  const allSections = document.querySelectorAll("section.tara");

  function showOnly(id) {
    allSections.forEach((section) => {
      section.style.display = section.id === id ? "block" : "none";
    });

    // Fix: dacă există o hartă Leaflet pentru acea secțiune, o forțăm să se reafișeze
    const harta = document.getElementById(`harta-${id}`);
    if (harta && harta._leaflet_map) {
      setTimeout(() => {
        harta._leaflet_map.invalidateSize();
      }, 100);
    }
  }

  dropdownButton.addEventListener("click", function (e) {
    e.stopPropagation();
    dropdown.classList.toggle("active");
  });

  document.querySelectorAll(".dropdown-content a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").split("#")[1];
      showOnly(targetId);
      history.pushState(null, null, `#${targetId}`);
      dropdown.classList.remove("active");
    });
  });

  window.addEventListener("click", function (e) {
    if (!e.target.closest(".dropdown")) {
      dropdown.classList.remove("active");
    }
  });

  const hash = window.location.hash.substring(1);
  if (hash) {
    showOnly(hash);
  } else {
    allSections.forEach((section) => (section.style.display = "block"));
  }

  function initMap(mapId, coords, zoom, locations) {
    const map = L.map(mapId).setView(coords, zoom);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    locations.forEach(({ nume, lat, lon }) => {
      L.marker([lat, lon]).addTo(map).bindPopup(`
            <b>${nume}</b><br />
            <a href="tel:+40759967696" class="popup-btn">Sună acum</a><br />
            <a href="https://wa.me/40759967696" class="popup-btn">WhatsApp</a>
          `);
    });

    // Salvăm harta în element pentru acces ulterior
    document.getElementById(mapId)._leaflet_map = map;

    setTimeout(() => map.invalidateSize(), 300);
  }

  // === INIT HĂRȚI ===

  initMap("harta-romania", [45.9, 24.9], 7, [
    { nume: "București", lat: 44.4268, lon: 26.1025 },
    { nume: "Arad", lat: 46.1667, lon: 21.3167 },
    { nume: "Timișoara", lat: 45.7489, lon: 21.2087 },
    { nume: "Lugoj", lat: 45.6886, lon: 21.9031 },
    { nume: "Deva", lat: 45.8667, lon: 22.9 },
    { nume: "Reșița", lat: 45.3, lon: 21.8833 },
    { nume: "Bocșa", lat: 45.3708, lon: 21.7097 },
    { nume: "Orșova", lat: 44.7214, lon: 22.3936 },
    { nume: "Drobeta Turnu Severin", lat: 44.6369, lon: 22.6597 },
    { nume: "Sibiu", lat: 45.7983, lon: 24.1256 },
    { nume: "Târgu Jiu", lat: 45.0456, lon: 23.2745 },
    { nume: "Craiova", lat: 44.3302, lon: 23.7949 },
    { nume: "Pitești", lat: 44.8565, lon: 24.8692 },
    { nume: "Ploiești", lat: 44.9469, lon: 26.0364 },
    { nume: "Alba Iulia", lat: 46.0667, lon: 23.5833 },
    { nume: "Deta", lat: 45.4116, lon: 21.2225 },
  ]);

  initMap("harta-austria", [47.5, 14.5], 7, [
    { nume: "Viena", lat: 48.2082, lon: 16.3738 },
    { nume: "St. Pölten", lat: 48.2, lon: 15.6167 },
    { nume: "Linz", lat: 48.3064, lon: 14.2861 },
    { nume: "Graz", lat: 47.0707, lon: 15.4395 },
  ]);

  initMap("harta-germania", [51.2, 10.4], 6, [
    { nume: "Munchen", lat: 48.1351, lon: 11.582 },
    { nume: "Frankfurt", lat: 50.1109, lon: 8.6821 },
    { nume: "Stuttgart", lat: 48.7758, lon: 9.1829 },
    { nume: "Nurenberg", lat: 49.4521, lon: 11.0767 },
    { nume: "Dortmund", lat: 51.5136, lon: 7.4653 },
    { nume: "Köln", lat: 50.9375, lon: 6.9603 },
    { nume: "Essen", lat: 51.4556, lon: 7.0116 },
    { nume: "Duisburg", lat: 51.4344, lon: 6.7623 },
    { nume: "Freiburg", lat: 47.999, lon: 7.8421 },
    { nume: "Hamburg", lat: 53.5511, lon: 9.9937 },
    { nume: "Berlin", lat: 52.52, lon: 13.405 },
    { nume: "Leipzig", lat: 51.3397, lon: 12.3731 },
    { nume: "Halle", lat: 51.4821, lon: 11.9696 },
    { nume: "Erfurt", lat: 50.9848, lon: 11.0299 },
    { nume: "Passau", lat: 48.5667, lon: 13.4319 },
    { nume: "Jena", lat: 50.9271, lon: 11.5892 },
    { nume: "Magdeburg", lat: 52.1205, lon: 11.6276 },
    { nume: "Bremen", lat: 53.0793, lon: 8.8017 },
    { nume: "Hannover", lat: 52.3759, lon: 9.732 },
    { nume: "Konstanz", lat: 47.6603, lon: 9.1758 },
    { nume: "Saarbrücken", lat: 49.2402, lon: 6.9969 },
    { nume: "Mannheim", lat: 49.4875, lon: 8.466 },
    { nume: "Heilbronn", lat: 49.1403, lon: 9.22 },
    { nume: "Düsseldorf", lat: 51.2277, lon: 6.7735 },
    { nume: "Mainz", lat: 50.0, lon: 8.2711 },
    { nume: "Oldenburg", lat: 53.1435, lon: 8.2146 },
  ]);

  initMap("harta-belgia", [50.5, 4.5], 7, [
    { nume: "Bruxelles", lat: 50.8503, lon: 4.3517 },
    { nume: "Anvers", lat: 51.2194, lon: 4.4025 },
    { nume: "Gent", lat: 51.0543, lon: 3.7174 },
    { nume: "Charleroi", lat: 50.4114, lon: 4.4447 },
    { nume: "Liège", lat: 50.6326, lon: 5.5797 },
    { nume: "Bruges", lat: 51.2093, lon: 3.2247 },
  ]);

  initMap("harta-olanda", [52.1, 5.3], 7, [
    { nume: "Amsterdam", lat: 52.3676, lon: 4.9041 },
    { nume: "Rotterdam", lat: 51.9225, lon: 4.4792 },
    { nume: "Haga", lat: 52.0705, lon: 4.3007 },
    { nume: "Utrecht", lat: 52.0907, lon: 5.1214 },
    { nume: "Eindhoven", lat: 51.4416, lon: 5.4697 },
    { nume: "Groningen", lat: 53.2194, lon: 6.5665 },
  ]);
});
// Închide dropdown-ul când se dă click pe orice link din dropdown
document.querySelectorAll(".dropdown-content a").forEach((link) => {
  link.addEventListener("click", () => {
    const dropdown = document.querySelector(".dropdown");
    dropdown.classList.remove("active");
  });
});
window.addEventListener("scroll", () => {
  const dropdown = document.querySelector(".dropdown");
  dropdown.classList.remove("active");
});
document.querySelectorAll(".oras").forEach((item) => {
  item.addEventListener("click", () => {
    const oras = item.getAttribute("data-oras");
    document.getElementById("oras-nume").textContent = oras;
    document.getElementById("popup-oras").classList.remove("hidden");
  });
});

document.getElementById("close-popup").addEventListener("click", () => {
  document.getElementById("popup-oras").classList.add("hidden");
});
document.addEventListener("DOMContentLoaded", function () {
  const popup = document.getElementById("popup-oras");
  const popupTitle = document.getElementById("oras-nume");
  const closeBtn = document.getElementById("close-popup");

  document.querySelectorAll(".oras").forEach((oras) => {
    oras.style.cursor = "pointer";
    oras.addEventListener("click", () => {
      const orasName = oras.getAttribute("data-oras");
      popupTitle.textContent = orasName;
      popup.classList.remove("hidden");
    });
  });

  closeBtn.addEventListener("click", () => {
    popup.classList.add("hidden");
  });

  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.classList.add("hidden");
    }
  });
});
