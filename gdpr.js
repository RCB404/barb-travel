document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("cookie-banner");
  const btnAccept = document.getElementById("accept-cookies");
  const btnReject = document.getElementById("reject-cookies");
  const STORAGE_KEY = "brb_cookie_consent"; // 'accepted' | 'rejected'

  // === helper ===
  const hideBanner = () => {
    if (!banner) return;
    banner.classList.add("is-hidden");
    banner.style.display = "none";
    banner.style.pointerEvents = "none";
    document.body.style.removeProperty("overflow"); // deblochează scroll
  };

  const applyConsent = (state) => {
    if (typeof gtag === "function") {
      const granted = state === "accepted" ? "granted" : "denied";
      gtag("consent", "update", {
        ad_storage: granted,
        analytics_storage: granted,
        personalization_storage: granted,
      });
      if (state === "accepted") loadGAOnce();
    }
  };

  const loadGAOnce = () => {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;
    const GA_ID = "G-XXXXXXX"; // pune ID-ul tău real
    gtag("config", GA_ID, { anonymize_ip: true });
  };

  const persistAndClose = (state) => {
    localStorage.setItem(STORAGE_KEY, state);
    applyConsent(state);
    hideBanner();
  };

  // === init ===
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "accepted" || saved === "rejected") {
    applyConsent(saved);
    hideBanner();
  } else {
    if (banner) {
      banner.style.display = "flex";
      banner.style.pointerEvents = "auto";
      // dacă vrei să blochezi scroll cât e deschis:
      // document.body.style.overflow = 'hidden';
    }
  }

  // === events ===
  if (btnAccept) {
    btnAccept.addEventListener("click", (e) => {
      e.preventDefault();
      persistAndClose("accepted");
    });
  }
  if (btnReject) {
    btnReject.addEventListener("click", (e) => {
      e.preventDefault();
      persistAndClose("rejected");
    });
  }
});
