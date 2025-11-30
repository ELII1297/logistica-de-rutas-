
const clientes = {
    "Carlos Medina": { lat: 25.6866, lng: -100.3161 },
    "Lucía Torres": { lat: 25.6700, lng: -100.3100 },
    "Mario Pérez": { lat: 25.6500, lng: -100.2800 }
};

let mapa = L.map('map').setView([25.67, -100.31], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapa);

let puntosRuta = [];
let polyline = null;
let lista = document.getElementById("lista-seleccionados");



function agregarRuta(nombre) {
    const c = clientes[nombre];

    L.marker([c.lat, c.lng]).addTo(mapa).bindPopup(nombre);
    puntosRuta.push([c.lat, c.lng]);

    actualizarLinea();
    actualizarDistancia();
    agregarALista(nombre);
}



function actualizarLinea() {
    if (polyline) mapa.removeLayer(polyline);
    polyline = L.polyline(puntosRuta, { color: "blue" }).addTo(mapa);

    if (puntosRuta.length > 1) {
        mapa.fitBounds(polyline.getBounds());
    }
}



function agregarALista(nombre) {
    let li = document.createElement("li");
    li.textContent = nombre;
    lista.appendChild(li);
}



function actualizarDistancia() {
    let d = 0;
    for (let i = 0; i < puntosRuta.length - 1; i++) {
        d += mapa.distance(puntosRuta[i], puntosRuta[i + 1]) / 1000;
    }
    document.getElementById("distancia").innerText =
        "Distancia total: " + d.toFixed(2) + " km";
}



function limpiarRuta() {
    puntosRuta = [];
    lista.innerHTML = "";
    if (polyline) mapa.removeLayer(polyline);
    document.getElementById("distancia").innerText = "Distancia total: 0 km";
}



if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("./sw.js")
        .then(() => console.log("SW registrado"))
        .catch(err => console.log("Error SW:", err));
}



let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    const btn = document.getElementById("btn-instalar");
    btn.style.display = "block";

    console.log("PWA lista para instalar");
});

function instalarPWA() {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(choice => {
        if (choice.outcome === "accepted") {
            console.log("Usuario instaló la app");
        } else {
            console.log("Usuario canceló la instalación");
        }
    });

    deferredPrompt = null;
}

