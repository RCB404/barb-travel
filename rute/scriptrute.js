// BRB-TRAVEL • RUTE
// Dropdown, secțiuni, o singură hartă Leaflet, popup oraș și navigare hash.

(function () {
  "use strict";

  // =====================================================
  // HELPERS
  // =====================================================

  const $ = (selector, context = document) =>
    context.querySelector(selector);

  const $$ = (selector, context = document) =>
    Array.from(context.querySelectorAll(selector));

  const getHashId = () =>
    (window.location.hash || "").replace("#", "").toLowerCase();

  const runAfterLayout = (callback) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(callback);
    });
  };

  // =====================================================
  // ELEMENTE DOM
  // =====================================================

  const navbar = $(".navbar");
  const dropdown = $(".navbar .dropdown");
  const dropbtn = dropdown
    ? $(".dropbtn", dropdown)
    : null;

  const dropdownMenu = dropdown
    ? $(".dropdown-content", dropdown)
    : null;

  const sections = $$("section.tara");

  // =====================================================
  // CONFIGURAȚIA DESTINAȚIILOR
  // =====================================================

  const mapConfigs = {
    romania: {
      name: "România",
      view: [45.9, 24.9],
      zoom: 7,
      locations: [
        { nume: "București", lat: 44.4268, lon: 26.1025 },
        { nume: "Arad", lat: 46.1667, lon: 21.3167 },
        { nume: "Timișoara", lat: 45.7489, lon: 21.2087 },
        { nume: "Deta", lat: 45.4116, lon: 21.2225 },
        { nume: "Lugoj", lat: 45.6886, lon: 21.9031 },
        { nume: "Bocșa", lat: 45.3708, lon: 21.7097 },
        { nume: "Reșița", lat: 45.3, lon: 21.8833 },
        { nume: "Deva", lat: 45.8667, lon: 22.9 },
        { nume: "Alba Iulia", lat: 46.0667, lon: 23.5833 },
        { nume: "Sibiu", lat: 45.7983, lon: 24.1256 },
        { nume: "Orșova", lat: 44.7214, lon: 22.3936 },
        {
          nume: "Drobeta Turnu Severin",
          lat: 44.6369,
          lon: 22.6597,
        },
        { nume: "Târgu Jiu", lat: 45.0456, lon: 23.2745 },
        { nume: "Craiova", lat: 44.3302, lon: 23.7949 },
        { nume: "Pitești", lat: 44.8565, lon: 24.8692 },
        { nume: "Ploiești", lat: 44.9469, lon: 26.0364 },
      ],
    },

    austria: {
      name: "Austria",
      view: [47.5, 14.5],
      zoom: 7,
      locations: [
        { nume: "Viena", lat: 48.2082, lon: 16.3738 },
        { nume: "St. Pölten", lat: 48.2, lon: 15.6167 },
        { nume: "Linz", lat: 48.3064, lon: 14.2861 },
        { nume: "Graz", lat: 47.0707, lon: 15.4395 },
        { nume: "Salzburg", lat: 47.8095, lon: 13.055 },
        { nume: "Innsbruck", lat: 47.2692, lon: 11.4041 },
        { nume: "Klagenfurt", lat: 46.6247, lon: 14.3053 },
      ],
    },

    germania: {
      name: "Germania",
      view: [51.2, 10.4],
      zoom: 6,
      locations: [
        { nume: "Berlin", lat: 52.52, lon: 13.405 },
        { nume: "München", lat: 48.1351, lon: 11.582 },
        { nume: "Hamburg", lat: 53.5511, lon: 9.9937 },
        {
          nume: "Frankfurt am Main",
          lat: 50.1109,
          lon: 8.6821,
        },
        { nume: "Stuttgart", lat: 48.7758, lon: 9.1829 },
        { nume: "Köln", lat: 50.9375, lon: 6.9603 },
        { nume: "Düsseldorf", lat: 51.2277, lon: 6.7735 },
        { nume: "Dortmund", lat: 51.5136, lon: 7.4653 },
        { nume: "Nürnberg", lat: 49.4521, lon: 11.0767 },
        { nume: "Hannover", lat: 52.3759, lon: 9.732 },
        { nume: "Leipzig", lat: 51.3397, lon: 12.3731 },
        { nume: "Dresden", lat: 51.0504, lon: 13.7373 },
        { nume: "Bremen", lat: 53.0793, lon: 8.8017 },
        { nume: "Essen", lat: 51.4556, lon: 7.0116 },
        { nume: "Mannheim", lat: 49.4875, lon: 8.466 },
        { nume: "Karlsruhe", lat: 49.0069, lon: 8.4037 },
        { nume: "Freiburg", lat: 47.999, lon: 7.8421 },
        { nume: "Ulm", lat: 48.4011, lon: 9.9876 },

        // Alte destinații existente în configurația anterioară
        { nume: "Duisburg", lat: 51.4344, lon: 6.7623 },
        { nume: "Halle", lat: 51.4821, lon: 11.9696 },
        { nume: "Erfurt", lat: 50.9848, lon: 11.0299 },
        { nume: "Passau", lat: 48.5667, lon: 13.4319 },
        { nume: "Jena", lat: 50.9271, lon: 11.5892 },
        { nume: "Magdeburg", lat: 52.1205, lon: 11.6276 },
        { nume: "Konstanz", lat: 47.6603, lon: 9.1758 },
        { nume: "Saarbrücken", lat: 49.2402, lon: 6.9969 },
        { nume: "Heilbronn", lat: 49.1403, lon: 9.22 },
        { nume: "Mainz", lat: 50.0, lon: 8.2711 },
        { nume: "Oldenburg", lat: 53.1435, lon: 8.2146 },
      ],
    },

    belgia: {
      name: "Belgia",
      view: [50.5, 4.5],
      zoom: 7,
      locations: [
        { nume: "Bruxelles", lat: 50.8503, lon: 4.3517 },
        { nume: "Anvers", lat: 51.2194, lon: 4.4025 },
        { nume: "Gent", lat: 51.0543, lon: 3.7174 },
        { nume: "Brugge", lat: 51.2093, lon: 3.2247 },
        { nume: "Liège", lat: 50.6326, lon: 5.5797 },
        { nume: "Charleroi", lat: 50.4114, lon: 4.4447 },
        { nume: "Leuven", lat: 50.8798, lon: 4.7005 },
        { nume: "Namur", lat: 50.4674, lon: 4.8718 },
      ],
    },

    olanda: {
      name: "Olanda",
      view: [52.1, 5.3],
      zoom: 7,
      locations: [
        { nume: "Amsterdam", lat: 52.3676, lon: 4.9041 },
        { nume: "Rotterdam", lat: 51.9225, lon: 4.4792 },
        { nume: "Eindhoven", lat: 51.4416, lon: 5.4697 },
        { nume: "Utrecht", lat: 52.0907, lon: 5.1214 },
        {
          nume: "'s-Hertogenbosch",
          lat: 51.6978,
          lon: 5.3037,
        },
        { nume: "Haga", lat: 52.0705, lon: 4.3007 },
        { nume: "Groningen", lat: 53.2194, lon: 6.5665 },
        { nume: "Arnhem", lat: 51.9851, lon: 5.8987 },
        { nume: "Tilburg", lat: 51.5555, lon: 5.0913 },
        { nume: "Breda", lat: 51.5719, lon: 4.7683 },
      ],
    },
  };

  // =====================================================
  // HARTA LEAFLET
  // =====================================================

  let routeMap = null;
  let markerLayer = null;
  let currentCountry = "romania";

  /**
   * Configurează iconița markerelor Leaflet.
   */
  function setupLeafletIcons() {
    if (!window.L) return;

    const markerSvg = `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="41"
        viewBox="0 0 25 41"
      >
        <path
          fill="#009999"
          d="M12.5 0C5.9 0 .6 5.3.6 11.9c0 8.3 10.4 18.3 11.4 19.3.3.3.8.3 1.1 0 1-1 11.4-11 11.4-19.3C24.4 5.3 19.1 0 12.5 0z"
        />
        <circle
          cx="12.5"
          cy="12.5"
          r="5.2"
          fill="#ffffff"
        />
      </svg>
    `;

    const markerDataUrl =
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(markerSvg);

    const markerIcon = L.icon({
      iconUrl: markerDataUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    L.Marker.prototype.options.icon = markerIcon;
  }

  /**
   * Creează o singură instanță Leaflet.
   */
  function createMap() {
    if (!window.L || routeMap) return;

    const mapElement = document.getElementById("route-map");

    if (!mapElement) {
      console.warn(
        'Containerul Leaflet cu id="route-map" nu există.'
      );
      return;
    }

    routeMap = L.map("route-map", {
      center: mapConfigs.romania.view,
      zoom: mapConfigs.romania.zoom,
      scrollWheelZoom: false,
    });

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }
    ).addTo(routeMap);

    markerLayer = L.featureGroup().addTo(routeMap);
  }

  /**
   * Creează conținutul popup-ului unui marker.
   */
  function createMarkerPopup(cityName) {
    return `
      <div class="popup-actions">
        <strong>${cityName}</strong>

        <a
          href="tel:+40759967696"
          class="btn call"
          rel="noopener"
        >
          Sună acum
        </a>

        <a
          href="https://wa.me/40759967696"
          class="btn reserve"
          target="_blank"
          rel="noopener"
        >
          WhatsApp
        </a>
      </div>
    `;
  }

  /**
   * Actualizează marker-ele hărții pentru țara selectată.
   */
  function updateMap(countryId) {
    if (!routeMap || !markerLayer) return;

    const config =
      mapConfigs[countryId] || mapConfigs.romania;

    currentCountry =
      mapConfigs[countryId] ? countryId : "romania";

    markerLayer.clearLayers();

    config.locations.forEach(({ nume, lat, lon }) => {
      const marker = L.marker([lat, lon]);

      marker.bindPopup(createMarkerPopup(nume));
      marker.addTo(markerLayer);
    });

    runAfterLayout(() => {
      routeMap.invalidateSize();

      if (config.locations.length > 1) {
        const bounds = markerLayer.getBounds();

        if (bounds.isValid()) {
          routeMap.fitBounds(bounds, {
            padding: [25, 25],
            maxZoom: config.zoom,
            animate: false,
          });

          return;
        }
      }

      routeMap.setView(
        config.view,
        config.zoom,
        { animate: false }
      );
    });
  }

  // =====================================================
  // SECȚIUNI ȚĂRI
  // =====================================================

  /**
   * Returnează un ID valid. România este fallback-ul.
   */
  function getValidSectionId(id) {
    const normalizedId = String(id || "").toLowerCase();

    return sections.some(
      (section) => section.id === normalizedId
    )
      ? normalizedId
      : "romania";
  }

  /**
   * Afișează doar țara selectată.
   */
  function showOnly(id, options = {}) {
    const {
      scrollToSection = false,
      updateHistory = false,
    } = options;

    const validId = getValidSectionId(id);

    sections.forEach((section) => {
      const isActive = section.id === validId;

      section.classList.toggle("active", isActive);
      section.setAttribute(
        "aria-hidden",
        isActive ? "false" : "true"
      );
    });

    updateMap(validId);

    if (updateHistory) {
      history.pushState(null, "", `#${validId}`);
    }

    if (scrollToSection) {
      const activeSection =
        document.getElementById(validId);

      if (activeSection) {
        activeSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }

  /**
   * Inițializează țara din URL.
   */
  function initFromHash() {
    const hashId = getHashId();
    const initialId = getValidSectionId(hashId);

    showOnly(initialId);
  }

  // =====================================================
  // DROPDOWN
  // =====================================================

  function closeDropdown() {
    if (!dropdown || !dropbtn) return;

    dropdown.classList.remove("active");
    dropbtn.setAttribute("aria-expanded", "false");
  }

  function initDropdown() {
    if (
      !navbar ||
      !dropdown ||
      !dropbtn ||
      !dropdownMenu
    ) {
      return;
    }

    dropbtn.setAttribute("aria-expanded", "false");

    dropbtn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const isOpen =
        dropdown.classList.toggle("active");

      dropbtn.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );
    });

    $$(".dropdown-content a", dropdown).forEach(
      (link) => {
        link.addEventListener("click", (event) => {
          const href =
            link.getAttribute("href") || "";

          const destinationId =
            href.split("#")[1]?.toLowerCase();

          if (
            !destinationId ||
            !mapConfigs[destinationId]
          ) {
            return;
          }

          event.preventDefault();

          showOnly(destinationId, {
            updateHistory: true,
            scrollToSection: true,
          });

          closeDropdown();
        });
      }
    );

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".dropdown")) {
        closeDropdown();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeDropdown();
      }
    });

    window.addEventListener(
      "scroll",
      closeDropdown,
      { passive: true }
    );
  }

  // =====================================================
  // NAVIGARE ÎNAPOI / ÎNAINTE
  // =====================================================

  function initHistoryNavigation() {
    const handleNavigation = () => {
      const destinationId =
        getValidSectionId(getHashId());

      showOnly(destinationId);
    };

    window.addEventListener(
      "popstate",
      handleNavigation
    );

    window.addEventListener(
      "hashchange",
      handleNavigation
    );
  }

  // =====================================================
  // POPUP ORAȘ
  // =====================================================

  function initCityPopup() {
    const popup = $("#popup-oras");
    const popupTitle = $("#oras-nume");
    const closeButton = $("#close-popup");

    if (!popup || !popupTitle) return;

    $$(".oras-card, .oras").forEach((cityElement) => {
      cityElement.addEventListener("click", () => {
        const cityName =
          cityElement.dataset.oras || "Oraș";

        popupTitle.textContent = cityName;
        popup.classList.remove("hidden");

        closeButton?.focus();
      });
    });

    function closePopup() {
      popup.classList.add("hidden");
    }

    closeButton?.addEventListener(
      "click",
      closePopup
    );

    popup.addEventListener("click", (event) => {
      if (event.target === popup) {
        closePopup();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        !popup.classList.contains("hidden")
      ) {
        closePopup();
      }
    });
  }

  // =====================================================
  // REDIMENSIONARE HARTĂ
  // =====================================================

  function initMapResize() {
    let resizeTimer = null;

    window.addEventListener(
      "resize",
      () => {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {
          if (!routeMap) return;

          runAfterLayout(() => {
            routeMap.invalidateSize();
            updateMap(currentCountry);
          });
        }, 150);
      },
      { passive: true }
    );
  }

  // =====================================================
  // BOOTSTRAP
  // =====================================================

  function boot() {
    setupLeafletIcons();
    createMap();
    initDropdown();
    initHistoryNavigation();
    initCityPopup();
    initMapResize();
    initFromHash();
  }

  /**
   * Așteaptă încărcarea DOM-ului și a bibliotecii Leaflet.
   */
  function startWhenReady() {
    const canStart = () =>
      document.readyState !== "loading" &&
      Boolean(window.L);

    if (canStart()) {
      boot();
      return;
    }

    let attempts = 0;
    const maximumAttempts = 50;

    const intervalId = setInterval(() => {
      attempts += 1;

      if (canStart()) {
        clearInterval(intervalId);
        boot();
        return;
      }

      if (attempts >= maximumAttempts) {
        clearInterval(intervalId);

        console.warn(
          "Leaflet nu s-a încărcat. Pagina continuă fără hartă."
        );

        initDropdown();
        initHistoryNavigation();
        initCityPopup();
        initFromHash();
      }
    }, 100);
  }

  startWhenReady();
})();