$(document).ready(function() {
    let offset = 0;
    const resultsContainer = $('#resultsContainer'); // Define resultsContainer outside of the function
    const token = 'BQD0aLxmyQ-QcBjCIkD_3n-CXzM6F_Kcw78JzorWQyKWaQdB4-KEjoFeVfxuv_wntm8QXw6djwlnXRJW3CrnXRiorQ_Q7MrZU9swDJ3TnD5ajHVQ2PHHLRh8YwRF-iMRt8Jljo63aBL3Ep1DdSBGz0VBGxigtqtnOuktYfvIAxWlAwPKe_dKBke5tLOSJ1Jm7xN1YS59sXgVNknGnsCDWhDj40pVZsP0';
    
    function searchTracks() {
        const searchInput = $('#searchInput').val();
        const limit = 20;
        // Spotify API endpoint for track search with offset
        const endpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchInput)}&type=track&offset=${offset}&limit=${limit}`;

        // Make an AJAX request using jQuery
        $.ajax({
            url: endpoint,
            method: 'GET',
            dataType: 'json',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(data) {
                const tracks = data.tracks.items;

                // Display results
                tracks.forEach(track => {
                    const trackInfo = `${track.name} by ${track.artists.map(artist => artist.name).join(', ')}`;
                    // Create an image element
                    const imageElement = $('<img>').attr('src', track.album.images[0].url).attr('alt', 'Track Image').css('width', '50px');
                    // Create a paragraph element for the track information
                    const resultItem = $('<p>').text(trackInfo);
                     // Add a click event listener to play the song
                     resultItem.click(function() {
                        // Open a new tab and navigate to the streaming page with the track URI as a query parameter
                        window.open(track.external_urls.spotify, '_blank');
                    });

                    // Append both the image and track information to the results container
                    resultsContainer.append(resultItem, imageElement);
                });
                totalResults += tracks.length; // Update total results
                offset = totalResults; // Calculate the next offset
            },
            error: function(error) {
                console.error('Error:', error);
            }
        });
    }

    // Attach the searchTracks function to the click event of the button
    $('#searchButton').on('click', function() {
        resultsContainer.empty(); // clear result
        offset = 0;
        totalResults = 0;
        searchTracks();
    });

    // Implement infinite scrolling
    resultsContainer.scroll(function() {
        if (resultsContainer.scrollTop() + resultsContainer.height() >= resultsContainer[0].scrollHeight - 50) {
            searchTracks(); // Load more results when scrolling near the bottom
        }
    });
});
