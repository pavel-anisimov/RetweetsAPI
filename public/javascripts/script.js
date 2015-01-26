(function(){
	'use strict';

	$.prototype.getTweets = function(obj){

		var $this = $(this),
			posting;

		posting = $.post( "./api", obj);

		posting.success(function( res, req ) {

			if(obj.max_id === undefined || obj.refresh === true) {
				$this.data('starting', res.first_id);
			}

			res.retweets.forEach(function(jsonTweet){

				var $div = '<div class="tweet" data-name="' + jsonTweet.name + '" data-id="' + jsonTweet.id + '">'
					+ '<div class="head"><div class="icon" style="background-image: url( ' + jsonTweet.icon + ')"></div>'
					+ '<div class="retweeted"><span>' + jsonTweet.retweeted + '</span></div>'
					+ '<div class="name"><span>' + jsonTweet.name + '</span></div><div class="screen_name">'
					+ '<span>@' + jsonTweet.screen_name + '</span><span> • ' + dateFormat(jsonTweet.created_at)
					+ '</span></div></div><div class="body"><div class="message">' + jsonTweet.text + '</div></div></div>';

				if(obj.starting === undefined) {
					$this.append($.parseHTML( $div ));
				}
				else {
					$this.prepend($.parseHTML( $div ));
				}

			});

			if(res.retweets.length <  obj.min && obj.starting === undefined) {
				$this.getTweets({
					screen_name: obj.screen_name,
					count: 10,
					min: obj.min - res.retweets.length,
					max_id: res.last_id
				});
			}

		}).fail(function() {

			$this.append($.parseHTML( '<p>Failed to load tweets from @' + obj.accounts[obj.index] + '</p>' ));
			console.log('Request failed.');

		}).always(function(res) {
			console.log('Request completed');
		});

	};

	function dateFormat(date){
		var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			date = new Date(date);

		return  months[date.getMonth()] + ' ' + date.getDate();
	}

})();

$(function(){
	'use strict';

	var vals = {
			screen_name: 'twitter',
			count: 10,
			min: 10,
			max_id: undefined,
			starting: undefined

		},
		$tweetBlock = $('.tweetBlock');

	function PopulateTweets(callback) {
		if ($tweetBlock !== undefined) {
			$tweetBlock.attr('id', vals.screen_name).getTweets(vals);
		}

		callback(vals);
	}

	PopulateTweets(function(val, starting){

		console.log('Since', starting);

		setInterval(function() {
			$tweetBlock.getTweets({
				screen_name: vals.screen_name,
				count: vals.count,
				min: vals.min,
				max_id: vals.max_id,
				starting: $tweetBlock.data('starting'),
				refresh: true
			});
		}, 60 * 1000);
	});

	$tweetBlock.delegate('.tweet', 'click', function(){
		var id   = $(this).data('id'),
			name = $(this).data('name');
		window.location.href = 'https://twitter.com/' + name + '/status/' + id;
	});

});