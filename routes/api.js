var express = require('express'),
	router = express.Router(),
	Twit = require('twit'),
	TwitAPI = new Twit({
		consumer_key:        'NiKlWXzjKW5yn8Qikr99z7CJr',
		consumer_secret:     'R2L7v09k1zn6gnCeJCWFwAhxVbKU1O9O8oqm2gBnT2i3hfRHQR',
		access_token:        '2935805221-OfCLCgzxci3BFU4qOMzrvQ913jkx0hUdXHEGHtn',
		access_token_secret: 'R4ykg8b27oHrJa9xTnWrJWzZG4TDnsfCj9U3dt9VfpTGT'
	});


router.post('/', function (req, res) {
	var arr = {}, body = req.body;

	TwitAPI.get('statuses/user_timeline', body,
		function(err, data, response) {
			if(!err) {


				if(body.starting === undefined)
					body.starting = 0;

				arr.retweets = [];
				arr.last_id = data[9] !== undefined ? data[9].id_str : undefined;
				arr.first_id = data[0] !== undefined ? data[0].id_str : undefined;

				if(arr.first_id > body.starting) {

					data.forEach(function (val, id, array) {
						if (val.retweeted_status !== undefined) {
							arr.retweets.push({
								id: val.id_str,
								created_at: val.created_at,
								text: val.text,
								url: 'https://twitter.com/twitter/status/' + val.id_str,
								name: val.retweeted_status.user.name,
								screen_name: val.retweeted_status.user.screen_name,
								retweeted: '@' + val.user.screen_name + ' retweeted:',
								icon: val.retweeted_status.user.profile_image_url
							});
						}
					});
				}
				else {
					arr.first_id = body.starting;
				}
			}

			res.json(arr);

		});
});

module.exports = router;
