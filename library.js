// Replace 'YOUR_ACCESS_TOKEN' with the actual access token obtained from Spotify OAuth
const clientId = '96cc031004a7414097ce16cec85c07e4';
const redirectUri = 'http://localhost/spotify/library.html'; // Must be set in your Spotify Developer Dashboard
const apiUrl = 'https://api.spotify.com/v1/me/playlists';

$(document).ready(function () {
    $('#loginButton').on('click', function () {
        loginToSpotify();
    });
});

 // Function to handle the Spotify login flow
 function loginToSpotify() {
    const scopes = 'user-library-read';
    const redirectUrl = encodeURIComponent(redirectUri);
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scopes}&response_type=token`;
}

 // Function to extract access token from the URL fragment
 function getAccessTokenFromUrl() {
    const fragment = new URLSearchParams(window.location.hash.substr(1));
    return fragment.get('access_token');
}

const accessToken = getAccessTokenFromUrl();

// Function to display playlists and their tracks
function displayPlaylists(url) {
  $.ajax({
    url: url,
    headers: {
      'Authorization': 'Bearer ' + accessToken,
    },
    success: function (response) {
      const playlistContainer = $('#playlist-container');

      response.items.forEach(function (playlist) {
        const playlistName = playlist.name;

        // Create a container for each playlist
        const playlistElement = $('<div class="playlist"></div>').css({
          backgroundColor: '#6141ac',
          textAlign: 'center',
          padding: '10px',
          margin: '10px'
        });
      
        // Append the playlist name to the playlist container
        playlistElement.append('<p style="font-weight: bold; font-size: 3em; color: white;">' + playlistName + '</p>');
      
        // Append the playlist container to the main container
        playlistContainer.append(playlistElement);
      
        // Display tracks for each playlist
        displayPlaylistTracks(playlist.id, playlistElement);
      });

      // Check if there are more playlists to fetch
      if (response.next) {
        // Recursively call the function to fetch the next set of playlists
        displayPlaylistsAndTracks(response.next);
      }
    },
    error: function (error) {
      console.error('Error fetching playlists:', error);
    }
  });
}

// Function to display tracks for a playlist
function displayPlaylistTracks(playlistId, playlistElement) {
    const tracksUrl = 'https://api.spotify.com/v1/playlists/' + playlistId + '/tracks';
    $.ajax({
      url: tracksUrl,
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      },
      success: function (response) {
        const tracksContainer = $('<div class="tracks"></div>').css({
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly'
        });
        
        response.items.forEach(function (track) {
          const trackName = track.track.name;
          const trackImage = track.track.album.images[0].url; // Get the first image 
        
          // Create a container for each track
          const trackElement = $('<div class="track"></div>').css({
            flex: '1 0 20%',
            maxWidth: '20%',
            textAlign: 'center',
            marginBottom: '20px'
          });
        
          // Append the track name and image to the track container
          trackElement.append('<p>' + trackName + '</p>');
          trackElement.append('<img src="' + trackImage + '" alt="' + trackName + '" style="width: 100%; height: auto;">');
        
          // Append the track container to the tracks container
          tracksContainer.append(trackElement);
        });
        
        // Append the tracks container to the playlist container
        playlistElement.append(tracksContainer);
      },
      error: function (error) {
        console.error('Error fetching playlist tracks:', error);
      }
    });
  }

// Start fetching playlists
displayPlaylists(apiUrl);