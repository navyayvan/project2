var express = require("express");
var request = require('request');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../models');
router.use(bodyParser.urlencoded({extended: false}));

router.get('/search', function(req,res) {
	res.render('search.ejs');
});

router.post("/artist", function(req, res) {
	var searchArtist = req.body.searchartist;
	console.log(searchArtist);
	request(
		'http://api.songkick.com/api/3.0/search/artists.json?query='+ searchArtist +'&apikey=' + process.env.API_KEY,
		function(error, response, body) {
			// console.log(response)
			if (!error && response.statusCode == 200) {
				console.log(body);
				body = JSON.parse(body);
				// res.json (body)
				// var artistresult = body.resultsPage.results.artist.map(function(artist){
				// 	return artist.displayName;
				// });
				// console.log(artistresult);
				// var artistId = body.resultsPage.results.artist.map(function(artist){
				// 	return artist.id;
				// });
				var artistData = body.resultsPage.results.artist.map(function(artist){
					return {name: artist.displayName, id:artist.id }
				})
			res.render('result.ejs', {artistData: artistData, searchArtist: searchArtist});
			}else{
				//error handling here
				// res.send(response)
			}
		});

});

// router.post("/venue", function(req, res) {
// 	var searchVenue = req.body.searchvenue;
// 	request(
// 		'http://api.songkick.com/api/3.0/search/venues.json?query=' + searchVenue + '&apikey=MOgnRVGp6ax4p3IT',
// 		function(error, response, body) {
// 			if (!error && response.statusCode == 200) {
// 				res.send(body);
// 			}
// 		}
// 	)
// });

router.post('/rsvp/:id', function(req,res) {
    var id = req.params.id;
    var date = req.body.date;
    var venue = req.body.venue;
    var location = req.body.location;
    var name = req.body.name;
    var api_id = req.body.api_id;
    db.user.findById(req.session.userId).then(function(user) {
      db.event.findOrCreate( 
        { where: {name: name, date: date, venue: venue, location:location, api_id: api_id }})
      .spread(function(event) {
        db.usersEvents.create(
          {userId: user.id, eventId: event.id}
        ).then(function() {
          res.redirect('/profile');
        })
      })
    })
});



module.exports = router;
