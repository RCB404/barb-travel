(function(){
"use strict";
const country=document.body.dataset.country||"romania";
const configs={"romania": {"view": [45.9, 24.9], "zoom": 7, "locations": [["București", 44.4268, 26.1025], ["Arad", 46.1667, 21.3167], ["Timișoara", 45.7489, 21.2087], ["Deta", 45.4116, 21.2225], ["Lugoj", 45.6886, 21.9031], ["Bocșa", 45.3708, 21.7097], ["Reșița", 45.3, 21.8833], ["Deva", 45.8667, 22.9], ["Alba Iulia", 46.0667, 23.5833], ["Sibiu", 45.7983, 24.1256], ["Orșova", 44.7214, 22.3936], ["Drobeta Turnu Severin", 44.6369, 22.6597], ["Târgu Jiu", 45.0456, 23.2745], ["Craiova", 44.3302, 23.7949], ["Pitești", 44.8565, 24.8692], ["Ploiești", 44.9469, 26.0364]]}, "austria": {"view": [47.5, 14.5], "zoom": 7, "locations": [["Viena", 48.2082, 16.3738], ["St. Pölten", 48.2, 15.6167], ["Linz", 48.3064, 14.2861], ["Graz", 47.0707, 15.4395], ["Salzburg", 47.8095, 13.055], ["Innsbruck", 47.2692, 11.4041], ["Klagenfurt", 46.6247, 14.3053]]}, "germania": {"view": [51.2, 10.4], "zoom": 6, "locations": [["Berlin", 52.52, 13.405], ["München", 48.1351, 11.582], ["Hamburg", 53.5511, 9.9937], ["Frankfurt am Main", 50.1109, 8.6821], ["Stuttgart", 48.7758, 9.1829], ["Köln", 50.9375, 6.9603], ["Düsseldorf", 51.2277, 6.7735], ["Dortmund", 51.5136, 7.4653], ["Nürnberg", 49.4521, 11.0767], ["Hannover", 52.3759, 9.732], ["Leipzig", 51.3397, 12.3731], ["Dresden", 51.0504, 13.7373], ["Bremen", 53.0793, 8.8017], ["Essen", 51.4556, 7.0116], ["Mannheim", 49.4875, 8.466], ["Karlsruhe", 49.0069, 8.4037], ["Freiburg", 47.999, 7.8421], ["Ulm", 48.4011, 9.9876], ["Duisburg", 51.4344, 6.7623], ["Erfurt", 50.9848, 11.0299], ["Passau", 48.5667, 13.4319], ["Heilbronn", 49.1403, 9.22]]}, "belgia": {"view": [50.5, 4.5], "zoom": 7, "locations": [["Bruxelles", 50.8503, 4.3517], ["Anvers", 51.2194, 4.4025], ["Gent", 51.0543, 3.7174], ["Brugge", 51.2093, 3.2247], ["Liège", 50.6326, 5.5797], ["Charleroi", 50.4114, 4.4447], ["Leuven", 50.8798, 4.7005], ["Namur", 50.4674, 4.8718]]}, "olanda": {"view": [52.1, 5.3], "zoom": 7, "locations": [["Amsterdam", 52.3676, 4.9041], ["Rotterdam", 51.9225, 4.4792], ["Eindhoven", 51.4416, 5.4697], ["Utrecht", 52.0907, 5.1214], ["'s-Hertogenbosch", 51.6978, 5.3037], ["Haga", 52.0705, 4.3007], ["Groningen", 53.2194, 6.5665], ["Arnhem", 51.9851, 5.8987], ["Tilburg", 51.5555, 5.0913], ["Breda", 51.5719, 4.7683]]}};
const cfg=configs[country]||configs.romania;
const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>Array.from(c.querySelectorAll(s));
const dropdown=$(".dropdown"), button=$(".dropbtn");
function closeMenu(){if(!dropdown||!button)return;dropdown.classList.remove("active");button.setAttribute("aria-expanded","false")}
if(dropdown&&button){
 button.addEventListener("click",e=>{e.stopPropagation();const open=dropdown.classList.toggle("active");button.setAttribute("aria-expanded",String(open))});
 document.addEventListener("click",e=>{if(!e.target.closest(".dropdown"))closeMenu()});
 document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu()});
 window.addEventListener("scroll",closeMenu,{passive:true});
}
function initPopup(){
 const popup=$("#popup-oras"), title=$("#oras-nume"), close=$("#close-popup");
 if(!popup||!title)return;
 $$(".oras-card").forEach(el=>el.addEventListener("click",()=>{title.textContent=el.dataset.oras||"Oraș";popup.classList.remove("hidden");close?.focus()}));
 const hide=()=>popup.classList.add("hidden");
 close?.addEventListener("click",hide);
 popup.addEventListener("click",e=>{if(e.target===popup)hide()});
 document.addEventListener("keydown",e=>{if(e.key==="Escape")hide()});
}
function initMap(){
 if(!window.L||!document.getElementById("route-map"))return;
 const markerSvg='<svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41"><path fill="#009999" d="M12.5 0C5.9 0 .6 5.3.6 11.9c0 8.3 10.4 18.3 11.4 19.3.3.3.8.3 1.1 0 1-1 11.4-11 11.4-19.3C24.4 5.3 19.1 0 12.5 0z"/><circle cx="12.5" cy="12.5" r="5.2" fill="#fff"/></svg>';
 const icon=L.icon({iconUrl:"data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(markerSvg),iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34]});
 const map=L.map("route-map",{center:cfg.view,zoom:cfg.zoom,scrollWheelZoom:false,zoomAnimation:false,fadeAnimation:false,markerZoomAnimation:false});
 L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap contributors",maxZoom:19}).addTo(map);
 const layer=L.featureGroup().addTo(map);
 cfg.locations.forEach(([name,lat,lon])=>L.marker([lat,lon],{icon}).bindPopup('<div class="popup-actions"><strong>'+name+'</strong><a href="tel:+40759967696" class="btn call">Sună acum</a><a href="https://wa.me/40759967696" target="_blank" rel="noopener" class="btn reserve">WhatsApp</a></div>').addTo(layer));
 requestAnimationFrame(()=>requestAnimationFrame(()=>{map.invalidateSize();const b=layer.getBounds();if(b.isValid())map.fitBounds(b,{padding:[25,25],maxZoom:cfg.zoom,animate:false})}));
}
function boot(){initPopup();initMap()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();