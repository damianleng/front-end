$(document).ready(function () {
  let offset = 0;
  const resultsContainer = $("#resultsContainer"); // Define resultsContainer outside of the function
  const token =
    "BQA811NzSbuRgcHEFYMJB1u9vcnvfN-aa2riTUnAExiuTC3jOTrFpw-6Xy0pdmuyykRTs_svuNVr4k9iF9w4Dz0rtOi2hZkRsCWQH9Pz5V31FljPYrdU6KwF7Cz8XcamWqr5fGcXK5-ECFRyIiVZOdPr_fa5M6Ct4yfAefUM0_0tRKbO4K9k3GJRDoz7cTdMin5-wxPGOJbaljh0gYK6z245K4UO";

  function searchTracks() {
    const searchInput = $("#searchInput").val();
    const limit = 25;
    // Spotify API endpoint for track search with offset
    const endpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      searchInput
    )}&type=track&offset=${offset}&limit=${limit}`;

    // Make an AJAX request using jQuery
    $.ajax({
      url: endpoint,
      method: "GET",
      dataType: "json",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      success: function (data) {
        const tracks = data.tracks.items;

        // Create a table element
        const table = $("<table>").addClass("resultTable");

        tracks.forEach((track) => {
          const trackInfo = `${track.name} by ${track.artists
            .map((artist) => artist.name)
            .join(", ")}`;

          // Create an image element
          const imageElement = $("<img>")
            .attr("src", track.album.images[0].url)
            .attr("alt", "Track Image")
            .css("width", "50px");

          // Create a row for the track
          const row = $("<tr>");

          // Create cells for the image, track name, and artist name
          const imageCell = $("<td>").append(imageElement);
          const trackCell = $("<td>").text(track.name);
          const artistCell = $("<td>").text(
            track.artists.map((artist) => artist.name).join(", ")
          );

          // Append cells to the row
          row.append(imageCell, trackCell, artistCell);

          // Add a click event listener to play the song
          row.click(function () {
            window.open(track.external_urls.spotify, "_blank");
          });

          // Append the row to the table
          table.append(row);
        });

        // Append the table to the results container
        resultsContainer.append(table);

        offset += tracks.length;
      },
      error: function (error) {
        console.error("Error:", error);
      },
    });
  }

  // Attach the searchTracks function to the click event of the button
  $("#searchButton").on("click", function () {
    resultsContainer.empty(); // clear result
    offset = 0;
    totalResults = 0;
    searchTracks();
  });

  // Implement infinite scrolling
  resultsContainer.scroll(function () {
    if (
      resultsContainer.scrollTop() + resultsContainer.height() >=
      resultsContainer[0].scrollHeight - 50
    ) {
      searchTracks(); // Load more results when scrolling near the bottom
    }
  });
});
