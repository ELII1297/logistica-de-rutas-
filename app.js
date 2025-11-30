// Coordenadas (puedes cambiarlas)
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

// Agregar marcador + ruta + lista debajo del mapa
function agregarRuta(nombre) {
    const c = clientes[nombre];

    L.marker([c.lat, c.lng]).addTo(mapa).bindPopup(nombre);

    puntosRuta.push([c.lat, c.lng]);

    actualizarLinea();
    actualizarDistancia();
    agregarALista(nombre);
}

// Dibujar línea
function actualizarLinea() {
    if (polyline) mapa.removeLayer(polyline);
    polyline = L.polyline(puntosRuta, { color: "blue" }).addTo(mapa);
    mapa.fitBounds(polyline.getBounds());
}

// Mostrar lista debajo del mapa
function agregarALista(nombre) {
    let li = document.createElement("li");
    li.textContent = nombre;
    lista.appendChild(li);
}

// Distancia total
function actualizarDistancia() {
    let d = 0;
    for (let i = 0; i < puntosRuta.length - 1; i++) {
        d += mapa.distance(puntosRuta[i], puntosRuta[i + 1]) / 1000;
    }
    document.getElementById("distancia").innerText =
        "Distancia total: " + d.toFixed(2) + " km";
}

// Limpiar todo
function limpiarRuta() {
    puntosRuta = [];
    lista.innerHTML = "";
    if (polyline) mapa.removeLayer(polyline);
    document.getElementById("distancia").innerText = "Distancia total: 0 km";
}

// PWA service worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
}
