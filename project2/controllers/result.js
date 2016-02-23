var express = require("express");
var request = require('request');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: false}));

router.get('/artist/:id', function(req,res) {
	var id = req.params.id;
		request(
		'http://api.songkick.com/api/3.0/artists/'+ id +'/calendar.json?apikey=MOgnRVGp6ax4p3IT',
		function(error, response, body) {
			if (!error && response.statusCode == 200) {
				body = JSON.parse(body);
				var artistEventData = [];
				if (body.resultsPage.results.event) {
					artistEventData = body.resultsPage.results.event.map(function(event) {
					return {eventName: event.displayName, 
						eventLocation: event.location.city,
						eventDate: event.start.date, 
						eventTime: event.start.time,
						eventId: event.id
					}
				})
				} else {
					res.send('This artist is not on tour!');
				}
			};
			res.render('artistresult.ejs', { eventData: artistEventData })
		});
});

// var artistEventData = body.resultsPage.results.event.map(function(artist) {
					// return { eventName: artist.series.displayname, eventLocation: artist.location 
						// res.render('artistresult.ejs', { artistEventData: artistEventData });
							// res.send(artistEventData);

module.exports = router;
