const PORT = 3000;
const express = require("express");
const request = require('request-promise');
const moment = require('moment');

const TOKEN = "cd004f4c385c06e11ed3a44a7aae9acc";
const GENRES_URL = "https://api.themoviedb.org/3/genre/movie/list?api_key=" + TOKEN + "&language=pt-BR";
let currentDate = moment(new Date()).format("yyyy-MM-dd");
let currentYear = moment(new Date()).format("yyyy");
const STATE_URL = "https://api-content.ingresso.com/v0/states";
const CITY_URL = "https://api-content.ingresso.com/v0/events/city/";

const app = express();
app.set('view engine', 'ejs');

app.set('views', './app/views');

app.use('/public', express.static(__dirname + '/public'));


app.get('/', (req, res) => {

    try {
        request(GENRES_URL)
            .then(genres => {
                request(STATE_URL, (error, response, body) => {

                    let cities = [];
                    let states = JSON.parse(body);
                    states.forEach(state => {
                        state.cities.forEach(element => {
                            cities.push({
                                "id": element.id,
                                "urlKey": element.urlKey,
                                "name": element.name,
                            })
                        });
                    });
                    res.render('index', { genres: JSON.parse(genres).genres, cities: cities });
                });
            });

    } catch (err) {
        res.render('index', { genres: [], cities: [] });
    }

});


app.get('/advise', (req, res) => {
    let movies = [];
    try {
        const cityId = req.query.cityId;

        request(CITY_URL + cityId, (error, response, body) => {

            const genre = req.query.genre;
            let items = JSON.parse(body);

            items.forEach(state => {
                if (state.genres.indexOf(genre) !== -1) {
                    movies.push({
                        "title": state.title,
                        "city": state.city,
                        "id": state.id
                    });
                }
            });
            res.render('movies', { movies: movies });
        });

    } catch (err) {
        res.render('movies', { movies: movies });
    }
});

app.listen(PORT, () => {
    console.log(`Server started on port` + PORT);
});