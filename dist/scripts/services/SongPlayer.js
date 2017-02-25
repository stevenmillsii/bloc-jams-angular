(function(){
	function SongPlayer($rootScope, Fixtures) {
		var SongPlayer = {};
		
		SongPlayer.currentAlbum = Fixtures.getAlbum();
		
		/**
		* @desc Buzz object audio file
		* @type {object}
		*/
		var currentBuzzObject = null;
		
		/**
		* @function setSong
		* @desc Stops currently playing song and loads new audio file as currentBuzzObject
		* @param {Object} song
		*/
		
		var setSong = function(song) {
			if (currentBuzzObject) {
				currentBuzzObject.stop();
				SongPlayer.currentSong.playing = null;
			}
		
			currentBuzzObject = new buzz.sound(song.audioUrl, {
				formats: ['mp3'],
				preload: true
			});
			
			currentBuzzObject.bind('timeupdate', function() {
				$rootScope.$apply(function() {
					SongPlayer.currentTime = currentBuzzObject.getTime();
				});
			});
			
			SongPlayer.currentSong = song;
		
		};
		
		/**
		* @function playSong
		* @desc plays the currentBuzzObject and pauses the currentBuzzObject
		*/
		
		var playSong = function(song) {
				currentBuzzObject.play();
				song.playing = true;
			};
		
		/**
		* @function stops song
		*/
		var stopSong = function(song) {
			currentBuzzObject.stop();
			song.playing = null;
		};
		
		/**
		* @desc getting the index of the song.
		* @type function
		*/
		var getSongIndex = function(song) {
			return SongPlayer.currentAlbum.songs.indexOf(song);
		};
		
		 /**
		 * @desc Active song object from list of songs
		 * @type {Object}
		 */
		SongPlayer.currentSong = null;
		
		/**
		*@desc Current playback time (in seconds) of currently playing song
		*@type {number}
		*/
		SongPlayer.currentTime = null;
		
		 /**
		 * @function play
		 * @desc Play current or new song
		 * @param {Object} song
		 */
		SongPlayer.play = function(song) {
			song = song || SongPlayer.currentSong;
			if (SongPlayer.currentSong !== song) {
				setSong(song);
				playSong(song);
			} else if (SongPlayer.currentSong === song) {
				if (currentBuzzObject.isPaused()) {
					playSong(song);
				}
			}
		};
		
		 /**
		 * @function pause
		 * @desc Pause current song
		 * @param {Object} song
		 */
		SongPlayer.pause = function(song) {
			song = song || SongPlayer.currentSong;
			currentBuzzObject.pause();
			song.playing = false;
		};
		
		/**
		* @desc previous function
		*/
		SongPlayer.previous = function() {
			var currentSongIndex = getSongIndex(SongPlayer.currentSong);
			currentSongIndex--;
			
			if (currentSongIndex < 0) {
				currentBuzzObject.stop();
				SongPlayer.currentSong.playing = null;
			} else {
				var song = SongPlayer.currentAlbum.songs[currentSongIndex];
				setSong(song);
				playSong(song);
			}
		};
		
		/**
		* @function next
		*/
		SongPlayer.next = function() {
			var song;
			var currentSongIndex = getSongIndex(SongPlayer.currentSong);
			currentSongIndex++;
			
			if (currentSongIndex === SongPlayer.currentAlbum.songs.length) {
				song = SongPlayer.currentAlbum.songs[0];
			} else { 
				song = SongPlayer.currentAlbum.songs[currentSongIndex]; 
			}
			setSong(song);
			playSong(song);
		};
		
		/**
		* @function setCurrentTime
		* @desc Set current time (in seconds) of currently playing song
		* @param {number} time
		*/
		SongPlayer.setCurrentTime = function(time) {
			if (currentBuzzObject) {
				currentBuzzObject.setTime(time);
			}
		};
		
		return SongPlayer;
	}
	
	angular
		.module('blocJams')
		.factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();