var request = require('request');

var inquirer = require('inquirer');

var twitter = require('twitter');

var spotify = require('spotify');

var omdb = require('omdb');

var fs = require('fs');

var mm = require('musicmetadata');

var random = require('./random.txt');

var keys;

var commands; 

keys = require('./keys.js');

commands = {
	type: "list",
	message: 'Choose a command from the options below.',
	choices: ["Show me my last 20 tweets", "Give me some song info.", "Tell me about a certain movie.", "Do what it says."],
	name: "commandChoices"
};
inquirer.prompt(commands).then(function(input){
	if(input.commandChoices === commands.choices[0]){
		var client = new twitter({
			consumer_key: keys.twitterKeys.consumer_key,
			consumer_secret: keys.twitterKeys.consumer_secret,
			access_token_key: keys.twitterKeys.access_token_key,
			access_token_secret: keys.twitterKeys.access_token_secret
		});

		var params = {screen_name: 'zachthebird'};
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			console.log('================================================================================================================================');
			console.log("\n      "+tweets[0].text)
			for(var i=1; i<19; i++){
				console.log("\n      "+tweets[i].text);
			}
			console.log("\n      "+tweets[19].text+'\n'+'\n================================================================================================================================\n')
		} else { 
			console.log(error)
		}
	});
	}
	if(input.commandChoices === commands.choices[1]){
		var songQ = {
			type: "input",
			message: "What song would you like to look up?",
			name: "songQuestion"
		}
		inquirer.prompt(songQ).then(function(songTitle){
			spotify.search({type: 'track', query: songTitle.songQuestion, limit:1},function(err, data){
				if(err){
					console.log("      Error occurred: " + err);
					return;
				} else { 
					console.log('================================================================================================================================');
					console.log('\n      The artist is: '+data.tracks.items[0].artists[0].name+'\n')
					console.log('      '+data.tracks.items[0].name+' appears on the album: '+data.tracks.items[0].album.name+'\n');
					console.log('      And you can listen to a preview of the song at the link below:\n');
					console.log('      '+data.tracks.items[0].preview_url+'\n');
					console.log('================================================================================================================================\n');
				}
			})
		})
	}
	if(input.commandChoices === commands.choices[2]){
		var movieQ = {
			type: "input",
			message: "What movie are you thinking of?",
			name: "movieQuestion"
		}
		inquirer.prompt(movieQ).then(function(movieTitle){
			omdb.get({ title: movieTitle.movieQuestion, type: 'movie' }, true, function(err, movie) {
			    if(err) {
			        return console.error(err);
			    }
			 
			    if(!movie) {
			        return console.log('\n      Movie not found!');
			    }
				console.log('================================================================================================================================');
			    console.log('\n      %s (%d) %d/10', movie.title, movie.year, movie.imdb.rating);
			    console.log('\n      '+movie.plot+'\n');
			    console.log('================================================================================================================================\n');
			});
		})
	}
	if(input.commandChoices === commands.choices[3]){
		fs.readFile( './random.txt', 'utf8', function(err, data){
			if(err){
				console.log(err);
			};
			var arg1 = data.slice(1, 18);
			console.log('================================================================================================================================');
			console.log('\n      Your random command is: \''+arg1+'\'\n');
			var arg2 = data.slice(20, (data.length-2));
			console.log('      And the command is being run with the argument: \''+arg2+'\'');
			if(arg1 === 'spotify-this-song'){
				spotify.search({type: 'track', query: arg2, limit:1},function(err, data){
					if(err){
						console.log("Error occurred: " + err);
						return;
					} else { 
						console.log('\n      The artist is: '+data.tracks.items[0].artists[0].name+'\n')
						console.log('      '+data.tracks.items[0].name+' appears on the album: '+data.tracks.items[0].album.name+'\n');
						console.log('      And you can listen to a preview of the song at the link below:\n');
						console.log('      '+data.tracks.items[0].preview_url+'\n');
						console.log('================================================================================================================================\n');
					}
				})
			}
		})

		
		
	}
})