// Replace with your actual client ID and redirect URI
const clientId = "96cc031004a7414097ce16cec85c07e4";
const redirectUri = "http://localhost/spotify/mostListen.html";
const scopes = "user-top-read";

function loginToSpotify() {
  console.log("Logging in to Spotify"); // Add this line
  const redirectUrl = encodeURIComponent(redirectUri);
  window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scopes}&response_type=token`;
}

// Function to extract access token from the URL fragment
function getAccessTokenFromUrl() {
  const fragment = new URLSearchParams(window.location.hash.substr(1));
  return fragment.get("access_token");
}

const accessToken = getAccessTokenFromUrl();

fetch(
  "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=25",
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }
)
  .then((response) => {
    if (response.status === 401) {
      // Access token is invalid, redirect user to log in again
      loginToSpotify();
      return;
    }
    return response.json();
  })
  .then((data) => {
    if (data) {
      const tracks = data.items;
      let output =
        '<div style="display: flex; justify-content: center; flex-wrap: wrap;">';
      tracks.forEach((track) => {
        const imageUrl = track.album.images[0].url;
        output += `
          <div class="mostListen-track">
            <img src="${imageUrl}" class="mostListen-album" alt="Album cover">
            <p class="mostListen-info"><strong>${track.name}</strong> <br> by ${track.artists[0].name}</p>
          </div>
        `;
      });
      output += "</div>";
      document.getElementById("mostListen").innerHTML = output;
    }
  })
  .catch((error) => console.error(error));
