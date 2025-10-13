(function () {
  // Nu afișa pe pagina politicii (opțional)
  if (location.pathname.toLowerCase().includes("politica-confidentialitate"))
    return;

  function getCookie(name) {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1];
  }
  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie =
      name +
      "=" +
      value +
      ";expires=" +
      d.toUTCString() +
      ";path=/;SameSite=Lax";
  }

  // Citește decizia din localStorage sau cookie
  var decision = null;
  try {
    decision = localStorage.getItem("cookiesAccepted");
  } catch (e) {}
  if (!decision) decision = getCookie("cookiesAccepted");

  // Dacă există decizie, nu mai afișa
  if (decision === "yes" || decision === "no") return;

  // Injectează stil + HTML
  var css = `
  .cookie-banner{position:fixed;left:0;right:0;bottom:0;z-index:9999;display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;padding:14px 16px;background:rgba(0,0,0,.85);color:#fff;font:14px/1.5 Poppins,system-ui,sans-serif}
  .cookie-banner p{margin:0;flex:1 1 70%}
  .cookie-banner a{color:#7de0e0;text-decoration:underline}
  .cookie-buttons{display:flex;gap:10px}
  .cookie-buttons button{background:#009999;border:0;color:#fff;padding:8px 14px;border-radius:6px;cursor:pointer;transition:.2s}
  .cookie-buttons button:hover{background:#007777}
  .cookie-buttons .btn-ghost{background:transparent;outline:1px solid #7de0e0;color:#7de0e0}
  @media (max-width:600px){.cookie-banner{flex-direction:column;text-align:center}}
  `;
  var style = document.createElement("style");
  style.innerHTML = css;
  document.head.appendChild(style);

  var banner = document.createElement("div");
  banner.className = "cookie-banner";
  banner.innerHTML = `
    <p>Folosim cookie-uri pentru analiză și reclame Google. Poți accepta sau refuza.
      <a href="/politica-confidentialitate.html">Află mai multe</a>.
    </p>
    <div class="cookie-buttons">
      <button id="cookie-accept">Accept</button>
      <button id="cookie-reject" class="btn-ghost">Refuz</button>
    </div>
  `;
  document.body.appendChild(banner);

  function updateConsent(granted) {
    try {
      if (typeof gtag === "function") {
        gtag("consent", "update", {
          ad_storage: granted ? "granted" : "denied",
          analytics_storage: granted ? "granted" : "denied",
          personalization_storage: granted ? "granted" : "denied",
        });
      }
    } catch (e) {}
  }

  function storeDecision(val) {
    try {
      localStorage.setItem("cookiesAccepted", val);
    } catch (e) {}
    setCookie("cookiesAccepted", val, 365);
  }

  document
    .getElementById("cookie-accept")
    .addEventListener("click", function () {
      storeDecision("yes");
      updateConsent(true);
      banner.remove();
    });
  document
    .getElementById("cookie-reject")
    .addEventListener("click", function () {
      storeDecision("no");
      updateConsent(false);
      banner.remove();
    });
})();
