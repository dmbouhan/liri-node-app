require("dotenv").config({ path: ".env" });

var keys = require("./keys.js");

var Spotify = require("node-spotify-api");

var spotify = new Spotify(keys.spotify);

var axios = require("axios");

var moment = require("moment");

var fs = require("file-system");

var userInput = process.argv[2];
var userQuery = process.argv.slice(3).join(" ");

function userCommand(userInput, userQuery) {

    switch (userInput) {
        case "concert-this":
            concert();
            break;

        case "spotify-this-song":
            music();
            break;

        case "movie-this":
            movie();
            break;

        case "do-what-it-says":
            random();
            break;
    }

}

userCommand(userInput, userQuery);

// Bands In Town function
function concert() {

    //queryUrl for bandsintown
    var bandUrl = "https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=codingbootcamp";

    axios.get(bandUrl).then(function (response) {
        console.log("\nVenue Name: " + response.data[0].venue.name);
        console.log("\nLocation: " + response.data[0].venue.city + " " + response.data[0].venue.country);
        console.log("\nDate: " + moment((response.data[0].datetime)).format("MM/DD/YYYY"));
    })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("error", error.message);
            }
        });
}

// Spotify function
function music() {

    if(!userQuery) {
        userQuery = "the sign ace of base"
    };

    spotify
        .search({ type: "track", query: userQuery, limit: 1 })
        .then(function (response) {
            console.log("\nArtist: " + response.tracks.items[0].artists[0].name);
            console.log("\nSong Title: " + response.tracks.items[0].name);
            console.log("\nSong Link: " + response.tracks.items[0].external_urls.spotify);
            console.log("\nAlbum Title: " + response.tracks.items[0].album.name);
        })
        .catch(function (err) {
            console.log(err);
        });
}

// OMDB function
function movie() {

    if (!userQuery) {
        userQuery = "mr nobody";
    };

    // Then run a request with axios to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + userQuery + "&y=&plot=short&apikey=trilogy";

    axios.get(queryUrl).then(function (response) {
        console.log("\nTitle: " + response.data.Title);
        console.log("\nRelease Year: " + response.data.Year);
        console.log("\nRating: " + response.data.Ratings[1].Value);
        console.log("\nProduced in: " + response.data.Country);
        console.log("\nLanguage: " + response.data.Language);
        console.log("\nPlot: " + response.data.Plot);
        console.log("\nStarring: " + response.data.Actors);
    })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
        });
}

function random() {

    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");

        userInput = dataArr[0];
        userQuery = dataArr[1];

        userCommand(userInput, userQuery);
    });
};