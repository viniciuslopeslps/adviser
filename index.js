const PORT = 3000;
const express = require("express");
const request = require('request');
const moment = require('moment');

const TOKEN = "cd004f4c385c06e11ed3a44a7aae9acc";
const GENRES_URL = "https://api.themoviedb.org/3/genre/movie/list?api_key=" + TOKEN + "&language=pt-BR";
let currentDate = moment(new Date()).format("yyyy-MM-dd");
let currentYear = moment(new Date()).format("yyyy");

const GENRES_MOVIES_URL = "https://api.themoviedb.org/3/discover/movie?api_key=" + TOKEN +
    "&language=pt-BR&sort_by=popularity.desc&include_adult=true&include_video=false&page=&primary_release_date.gte=" + currentDate + "&year=" + currentYear;

const CITIES_STATE = "https://api-content.ingresso.com/v0/states/";
const MOVIES_CITIES = "https://api-content.ingresso.com/v0/events/city/"
const app = express();

app.get('/genres', (req, res) => {

    request(GENRES_URL, (error, response, body) => {
        if (error) {
            res.status(500);
            return res.json({
                message: "Ops! Something is not ok!"
            });
        }
        return res.send(body);
    });
});

app.get('/genres/:id', (req, res) => {

    request(GENRES_MOVIES_URL + "&genre=" + req.params.id, (error, response, body) => {
        if (error) {
            res.status(500);
            return res.json({
                message: "Ops! Something is not ok!"
            });
        }

        let movies = body.results.map(function (movie) {
            return {
                "title": movie.title,
                "id": movie.id
            }
        });

        return res.send(movies);
    });
});

app.get('/cities/:state', (req, res) => {

    request(CITIES_STATE + req.params.state, (error, response, body) => {
        if (error) {
            res.status(500);
            return res.json({
                message: "Ops! Something is not ok!"
            });
        }

        return res.send(body);
    });
});

app.get('/movies/:cityId', (req, res) => {

    request(MOVIES_CITIES + req.params.cityId + "/partnership/CINEMARK", (error, response, body) => {
        if (error) {
            res.status(500);
            return res.json({
                message: "Ops! Something is not ok!"
            });
        }

        return res.send(body);
    });
});

app.listen(PORT, () => {
    console.log(`Server started on port` + port);
});