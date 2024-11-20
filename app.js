const API_KEY = "at_ZmZUgJ3yC0hXHE3um0ISVPAjuVw0M";

let lat = 0;
let lng = 0;
let marker = null;

const map = L.map("map", { zoomControl: false }).setView([lat, lng], 15);
L.tileLayer("https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
  maxZoom: 18,
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  attribution: '© Google Maps'
}).addTo(map);

const icon = L.icon({
  iconUrl: "./images/icon-location.svg",
  iconSize: [38, 50],
  iconAnchor: [22, 50],
});

const populateOutput = (outpData) => {
  const ipOutput = document.getElementById("ipAddr");
  const locOutput = document.getElementById("locOutput");
  const tzOutput = document.getElementById("tzOutput");
  const ispOutput = document.getElementById("ispOutput");
  const ipInput = document.getElementById("ipInput");

  ipOutput.innerText = outpData.ip;
  locOutput.innerText = `${outpData.location.city}, ${outpData.location.postalCode}`;
  tzOutput.innerText = `UTC ${outpData.location.timezone}`;
  ispOutput.innerText = outpData.isp;
  ipInput.value = outpData.ip;

  lat = outpData.location.lat;
  lng = outpData.location.lng;

  map.setView([lat, lng], 15);

  if (marker) {
    marker.setLatLng([lat, lng]);
  } else {
    marker = L.marker([lat, lng], { icon: icon }).addTo(map);
  }

  marker.bindPopup(`Location: ${outpData.location.city}`);
};

const showLoadingState = () => {
  document.getElementById("ipAddr").innerText = "Loading...";
  document.getElementById("locOutput").innerText = "Loading...";
  document.getElementById("tzOutput").innerText = "Loading...";
  document.getElementById("ispOutput").innerText = "Loading...";
};

const fetchData = (url) => {
  showLoadingState();
  return fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error("Error fetching the IP Address");
    }
    return res.json();
  });
};

const fetchOwnIp = () => {
  const urlIP = `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=${API_KEY}`;
  fetchData(urlIP)
    .then((data) => {
      populateOutput(data);
    })
    .catch((error) => {
      console.error(error);
      alert("Failed to fetch data. Please try again later.");
    });
};

const fetchFromDomain = (domain) => {
  const urlDomain = `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=${API_KEY}&domain=${domain}`;
  fetchData(urlDomain)
    .then((data) => {
      populateOutput(data);
    })
    .catch((error) => {
      console.error(error);
      alert("Failed to fetch data. Please try again later.");
    });
};

const fetchFromIp = (ip) => {
  const urlIp = `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=${API_KEY}&ipAddress=${ip}`;
  fetchData(urlIp)
    .then((data) => {
      populateOutput(data);
    })
    .catch((error) => {
      console.error(error);
      alert("Failed to fetch data. Please try again later.");
    });
};

const goBtn = document.getElementById("goBtn");

goBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const input = document.getElementById("ipInput").value.trim();

  if (!input) {
    alert("Please enter an IP address or domain.");
    return;
  }

  const isValidDomain = /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(input);
  const isValidIP =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      input
    );

  if (isValidDomain) {
    fetchFromDomain(input);
  } else if (isValidIP) {
    fetchFromIp(input);
  } else {
    alert("Please enter a valid IP address or domain.");
  }
});

document.addEventListener("DOMContentLoaded", fetchOwnIp);