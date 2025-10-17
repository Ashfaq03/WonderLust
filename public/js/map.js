let mapToken = map_Token;
console.log(mapToken);

mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  style: "mapbox://styles/mapbox/streets-v12",
  zoom: 9, // starting zoom
});

// console.log(coordinates);
const el = document.createElement("div");
el.className = "marker";
const marker = new mapboxgl.Marker(el)
  .setLngLat(listing.geometry.coordinates) //listing.geometry.coordinates
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${listing.location}</h4><p>Exact location provided after booking.</p>`
    )
  )
  .addTo(map);
