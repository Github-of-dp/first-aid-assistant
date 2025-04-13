async function sendMessage() {
    let userMessage = document.getElementById("userInput").value;
    if (!userMessage) return;

    let messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;

    let response = await fetch("http://localhost:3000/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
    });

    let data = await response.json();
    messagesDiv.innerHTML += `<p><strong>Bot:</strong> ${data.reply}</p>`;
    document.getElementById("userInput").value = "";
}

function startListening() {
    alert("Voice input is coming soon!");
}

function uploadImage() {
    alert("Image classification is coming soon!");
}

let map;

function initMap(lat, lon) {
    map = L.map("map").setView([lat, lon], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.marker([lat, lon])
        .addTo(map)
        .bindPopup("You are here!")
        .openPopup();
}

function findHospitals() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            initMap(lat, lon);

            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=hospitals+near+${lat},${lon}&limit=10`);
            const data = await response.json();

            data.forEach(place => {
                if (place.lat && place.lon) {
                    L.marker([place.lat, place.lon])
                        .addTo(map)
                        .bindPopup(`<strong>${place.display_name}</strong>`);
                }
            });
        }, () => {
            alert("Unable to get your location.");
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }

}