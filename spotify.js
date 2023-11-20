const clientId = '665f61d7eddc4a70a4f41cb82a5279cf';
const redirectUri = 'http://localhost/spotify/stream.html'; // Must be set in your Spotify Developer Dashboard
const scopes = 'streaming';

$(document).ready(function () {
    $('#loginButton').on('click', function () {
        loginToSpotify();
    });
});

 // Function to handle the Spotify login flow
function loginToSpotify() {
    const redirectUrl = encodeURIComponent(redirectUri);
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scopes}&response_type=token`;
}


 // Function to extract access token from the URL fragment
 function getAccessTokenFromUrl() {
    const fragment = new URLSearchParams(window.location.hash.substr(1));
    return fragment.get('access_token');
}

window.onSpotifyWebPlaybackSDKReady = () => {
    const token = getAccessTokenFromUrl();
    console.log('Access Token:', token);
    const player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
    });


    let state;

    // listen to player state
    player.addListener('player_state_changed', (newState) => {
        // Update the music timeline based on the playback progress
        state = newState;
        updateMusicTimeline(newState.position, newState.duration);
        updateSongInfo(newState.track_window.current_track);
    });
     // Update the music timeline based on the playback progress
     function updateMusicTimeline(position, duration) {
        const progressPercentage = (position / duration) * 100;
        musicTimeline.value = progressPercentage;
    }

    // update song information
    function updateSongInfo(track){
            const albumImage = $('#albumImage');
            const songTitle = $('#songTitle');
            const artist = $('#artist');

            // Use .attr() to set the 'src' attribute
            albumImage.attr('src', track.album.images[0].url);
            songTitle.text(track.name);
            artist.text(track.artists.map(artist => artist.name).join(', '));
    }

    // listen to timeline input and get position of current
    $('#musicTimeline').on('input', function() {
        if (state) {
            const seekPosition = ($(this).val() / 100) * state.duration;
            player.seek(seekPosition).then(() => {
                //console.log('Seeked to', seekPosition);
            });
        }
    });

    // listen to volume control and set the new volume
    $('#volumeControl').on('input', function() {
        const newVolume = $(this).val() / 100;
        player.setVolume(newVolume).then(() => {
            //console.log('Volume changed to', newVolume);
        });
    });
    
      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        $('#ready').html('<p>Device is ready with ID: ' + device_id + '</p>');
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    player.addListener('initialization_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('authentication_error', ({ message }) => {
        console.error(message);
    });

    player.addListener('account_error', ({ message }) => {
        console.error(message);
    });

    // event listener when click for toggle track
    $('#togglePlay').click(function() {
        player.togglePlay();
    });
    
    // event lister when click for next track
    $('#skipForward').click(function() {
        player.nextTrack();
    });
    
    // event listener when click for previous track
    $('#skipBackward').click(function() {
        player.previousTrack();
    });

     player.connect();
}