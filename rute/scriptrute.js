// BRB-TRAVEL • RUTE – JS (dropdown, secțiuni, hărți, popup)
(function () {
  "use strict";

  // ---------- helpers ----------
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const getHashId = () => (window.location.hash || "").slice(1);

  // ---------- elemente bază ----------
  const navbar = $(".navbar");
  const dropdown = $(".navbar .dropdown");
  const dropbtn = dropdown ? dropdown.querySelector(".dropbtn") : null;
  const dropdownMenu = dropdown ? dropdown.querySelector(".dropdown-content") : null;
  const sections = $$("section.tara");

  // ---------- config hărți (secțiune ↔ container + date) ----------
  const mapRegistry = {}; // { romania: true, ... } (creată)
  const mapConfigs = {
    romania: {
      mapId: "harta-romania",
      view: [45.9, 24.9],
      zoom: 7,
      locations: [
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
      ],
    },
    austria: {
      mapId: "harta-austria",
      view: [47.5, 14.5],
      zoom: 7,
      locations: [
        { nume: "Viena", lat: 48.2082, lon: 16.3738 },
        { nume: "St. Pölten", lat: 48.2, lon: 15.6167 },
        { nume: "Linz", lat: 48.3064, lon: 14.2861 },
        { nume: "Graz", lat: 47.0707, lon: 15.4395 },
      ],
    },
    germania: {
      mapId: "harta-germania",
      view: [51.2, 10.4],
      zoom: 6,
      locations: [
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
      ],
    },
    belgia: {
      mapId: "harta-belgia",
      view: [50.5, 4.5],
      zoom: 7,
      locations: [
        { nume: "Bruxelles", lat: 50.8503, lon: 4.3517 },
        { nume: "Anvers", lat: 51.2194, lon: 4.4025 },
        { nume: "Gent", lat: 51.0543, lon: 3.7174 },
        { nume: "Charleroi", lat: 50.4114, lon: 4.4447 },
        { nume: "Liège", lat: 50.6326, lon: 5.5797 },
        { nume: "Bruges", lat: 51.2093, lon: 3.2247 },
      ],
    },
    olanda: {
      mapId: "harta-olanda",
      view: [52.1, 5.3],
      zoom: 7,
      locations: [
        { nume: "Amsterdam", lat: 52.3676, lon: 4.9041 },
        { nume: "Rotterdam", lat: 51.9225, lon: 4.4792 },
        { nume: "Haga", lat: 52.0705, lon: 4.3007 },
        { nume: "Utrecht", lat: 52.0907, lon: 5.1214 },
        { nume: "Eindhoven", lat: 51.4416, lon: 5.4697 },
        { nume: "Groningen", lat: 53.2194, lon: 6.5665 },
      ],
    },
  };

  // ---------- afișare secțiuni + lazy-init Leaflet ----------
  function rAF2(fn) {
    requestAnimationFrame(() => requestAnimationFrame(fn));
  }

  function ensureMapFor(sectionId) {
    if (!window.L) return;
    const cfg = mapConfigs[sectionId];
    if (!cfg) return;

    const { mapId, view, zoom, locations } = cfg;
    const el = document.getElementById(mapId);
    if (!el) return;

    if (!mapRegistry[sectionId]) {
      // prima inițializare
      const map = L.map(mapId).setView(view, zoom);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      locations.forEach(({ nume, lat, lon }) => {
        L.marker([lat, lon]).addTo(map).bindPopup(`
          <div class="popup-actions">
            <b>${nume}</b><br/>
            <a href="tel:+40759967696" class="btn call" target="_blank" rel="noopener">Sună acum</a>
            <a href="https://wa.me/40759967696" class="btn reserve" target="_blank" rel="noopener">WhatsApp</a>
          </div>
        `);
      });

      el._leaflet_map = map;
      mapRegistry[sectionId] = true;
    }

    // revalidează după ce secțiunea e vizibilă
    if (el._leaflet_map) rAF2(() => el._leaflet_map.invalidateSize());
  }

  function showOnly(id) {
    const match = sections.find((s) => s.id === id);
    if (!match) {
      const ro = document.getElementById("romania");
      sections.forEach((s) => (s.style.display = s === ro ? "block" : "none"));
      if (ro) ensureMapFor("romania");
      return;
    }
    sections.forEach((s) => (s.style.display = s === match ? "block" : "none"));
    ensureMapFor(id);
  }

  function initFromHash() {
    const hash = getHashId();
    if (hash) {
      showOnly(hash);
    } else {
      const ro = document.getElementById("romania");
      sections.forEach((s) => (s.style.display = s === ro ? "block" : "none"));
      if (ro) ensureMapFor("romania");
    }
  }

  // ---------- dropdown logic ----------
  function initDropdown() {
    if (!navbar || !dropdown || !dropbtn || !dropdownMenu) return;
    let justOpened = false;

    dropbtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const open = dropdown.classList.toggle("active");
      dropbtn.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        justOpened = true;
        setTimeout(() => (justOpened = false), 350);
      }
    });

    // click pe link-urile din dropdown (#romania/#germania etc.)
    $$(".dropdown-content a", dropdown).forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href") || "";
        const hash = href.split("#")[1];
        if (!hash || hash.toLowerCase() === "rute") return;
        e.preventDefault();
        showOnly(hash);
        history.pushState(null, "", `#${hash}`);
        dropdown.classList.remove("active");
        dropbtn.setAttribute("aria-expanded", "false");
      });
    });

    window.addEventListener(
      "click",
      (e) => {
        if (!e.target.closest(".dropdown")) {
          dropdown.classList.remove("active");
          dropbtn.setAttribute("aria-expanded", "false");
        }
      },
      { passive: true }
    );

    window.addEventListener(
      "scroll",
      () => {
        if (!justOpened) {
          dropdown.classList.remove("active");
          dropbtn.setAttribute("aria-expanded", "false");
        }
      },
      { passive: true }
    );
  }

  // ---------- navigare hash ----------
  function initHistoryNavigation() {
    const onNavigate = () => {
      const id = getHashId();
      if (id) showOnly(id);
    };
    window.addEventListener("popstate", onNavigate);
    window.addEventListener("hashchange", onNavigate);
  }

  // ---------- setare globală icon (RELATIV din /rute/rute.js) ----------
  function setupLeafletIcons() {
    if (!window.L) return;
    // rute.js este în /rute/, imaginile sunt în /vendor/leaflet/images/
    const base = "../../vendor/leaflet/images/";
    L.Icon.Default.mergeOptions({
      iconUrl: `${base}marker-icon.png`,
      iconRetinaUrl: `${base}marker-icon-2x.png`,
      shadowUrl: `${base}marker-shadow.png`,
    });
  }

  // ---------- popup oraș (overlay personal) ----------
  function initCityPopup() {
    const popup = $("#popup-oras");
    const popupTitle = $("#oras-nume");
    const closeBtn = $("#close-popup");

    $$(".oras-card, .oras").forEach((item) => {
      item.style.cursor = "pointer";
      item.addEventListener("click", () => {
        const oras = item.getAttribute("data-oras") || "Oraș";
        if (popup && popupTitle) {
          popupTitle.textContent = oras;
          popup.classList.remove("hidden");
        }
      });
    });

    if (popup && closeBtn) {
      closeBtn.addEventListener("click", () => popup.classList.add("hidden"));
      popup.addEventListener("click", (e) => {
        if (e.target === popup) popup.classList.add("hidden");
      });
    }
  }

  // ---------- bootstrap ----------
  function boot() {
    setupLeafletIcons();
    initFromHash();
    initDropdown();
    initHistoryNavigation();
    initCityPopup();

    // revalidate on resize/orientation change
    window.addEventListener("resize", () => {
      const current = getHashId() || "romania";
      const cfg = mapConfigs[current];
      if (!cfg) return;
      const el = document.getElementById(cfg.mapId);
      if (el && el._leaflet_map) rAF2(() => el._leaflet_map.invalidateSize());
    });
  }

  // pornește când DOM + Leaflet sunt gata (cu retry scurt)
  function startWhenReady() {
    const ready = () => document.readyState !== "loading" && !!window.L;
    if (ready()) return boot();

    let tries = 0;
    const t = setInterval(() => {
      if (ready()) {
        clearInterval(t);
        boot();
      } else if (++tries > 20) {
        clearInterval(t);
        // rulează fără hărți, tot ai restul funcțional
        initFromHash();
        initDropdown();
        initHistoryNavigation();
        initCityPopup();
      }
    }, 100);
  }

  startWhenReady();
})();
