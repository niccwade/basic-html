//TIME PLAYER BAR DOES NOT UPDATE WITH TIME PLAYING AND TIMES DO NOT CHANGE

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
 var currentSoundFile = null;
var currentVolume = 50;
var $playPauseSelector = $('.main-controls .play-pause'); 


var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(function(){
        changeSong("previous");
    });
    $nextButton.click(function(){
        changeSong("next");
    });
    $playPauseSelector.click(togglePlayFromPlayerBar);
    setupSeekBars();
});

var setCurrentTimeInPlayerBar = function(currentTime) {
    var $currentTimeElement = $('.seek-control .current-time');
    $currentTimeElement.text(currentTime);
};

var setTotalTimeInPlayerBar = function(totalTime) {
    var $totalTimeElement = $('.seek-control .total-time');
    $totalTimeElement.text(totalTime);
};

var filterTimeCode = function(timeInSeconds){
    var seconds = Number.parseFloat(timeInSeconds);
    var wholeSeconds = Math.floor(seconds);
    var minutes = Math.floor(wholeSeconds / 60);
    var remainingSeconds = wholeSeconds % 60;
    
    var output = minutes + ':';
    
    if(remainingSeconds < 10){
        output += '0';
    }
    
    output += remainingSeconds;
    return output;
}

var seek = function(time){
    if(currentSoundFile){
        currentSoundFile.setTime(time);
    }
};

var updateSeekBarWhileSongPlays = function() {
    if(currentSoundFile) {
        currentSoundFile.bind('timeupdate', function(event){
            var currentTime = this.getTime();
            var songLength = this.getDuration();
            var seekBarFillRatio = this.getTime() /this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
            console.log("I should be getting here");
            setCurrentTimeInPlayerBar(filterTimeCode(currentTime));
        });
    }
        console.log("I am getting to the bottom of updateSeekBarWhileSongPlays");
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio){
   var offsetXPercent = seekBarFillRatio * 100;
    
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
    console.log("I am getting to the bottom of updateSeekPercentage");

};

var setupSeekBars = function() {
   var $seekBars = $('.player-bar .seek-bar');
    $seekBars.click(function(event){
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        var seekBarFillRatio = offsetX / barWidth;
        
        if($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);
        }
        updateSeekPercentage($(this), seekBarFillRatio);
        console.log("I am getting to the bottom of setupSeekBars");
    });
    
    $seekBars.find('.thumb').mousedown(function(event){
        var $seekBar = $(this).parent();
        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
            
            if($(this).parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());
            } else {
                setVolume(seekBarFillRatio);
            }
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
        
        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
    });
};

var togglePlayFromPlayerBar = function() {
    if(currentSoundFile.isPaused() && $($playPauseSelector).html() == playerBarPlayButton){
        var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber)
        currentlyPlayingCell.html(pauseButtonTemplate);
        $playPauseSelector.html(playerBarPauseButton);
        currentSoundFile.play();
    }else if(currentSoundFile && $($playPauseSelector).html() == playerBarPauseButton){
        var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber)
        currentlyPlayingCell.html(playButtonTemplate);
        $playPauseSelector.html(playerBarPlayButton);
        currentSoundFile.pause();
    }
};

var setVolume = function(volume){
    if(currentSoundFile){
        currentSoundFile.setVolume(volume);
    }
    currentVolume = volume;
};

var changeSong = function(direction) {
    var lastSongNumber;
    var currentSongIndex;
    
    if(direction == "next"){
    var getLastSongNumber = function (index) {
        return index === 0 ? currentAlbum.songs.length : index;
    };
    
    currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;
    
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    var $nextSongNumberCell = $(getSongNumberCell(currentlyPlayingSongNumber));
    $nextSongNumberCell.html(pauseButtonTemplate);
        
    } else{
    var getLastSongNumber = function (index) {
        return index === (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
    currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;
   
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    var $previousSongNumberCell = $(getSongNumberCell(currentlyPlayingSongNumber));
    $previousSongNumberCell.html(pauseButtonTemplate);
}
    
    updatePlayerBarSong();
    lastSongNumber = getLastSongNumber(currentSongIndex);
    var $lastSongNumberCell = $(getSongNumberCell(lastSongNumber));
    $lastSongNumberCell.html(lastSongNumber);
};

var setSong = function(songNumber) {
    if(currentSoundFile){
        currentSoundFile.stop();
    }
    
    currentlyPlayingSongNumber= parseInt(songNumber);
    currentSongFromAlbum= currentAlbum.songs[songNumber - 1];
    
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: ['mp3'],
        preload: true
    });
    setVolume(currentVolume);
};

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var createSongRow = function (songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
        +   '   <td class="song-item-number" data-song-number="' + songNumber + '" >' + songNumber + '</td>'
        +   '   <td class="song-item-title">' + songName + '</td>'
        +   '   <td class="song-itme-duration">' + filterTimeCode(songLength) + '</td>'
        + '</tr>';
    var $row = $(template);
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};


var clickHandler = function () {
    var songNumber = parseInt($(this).attr('data-song-number'));

    if (currentlyPlayingSongNumber !== null) {
        var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber)
        currentlyPlayingCell.html(currentlyPlayingSongNumber);
    }

    if (currentlyPlayingSongNumber !== songNumber) {  
        var $volumeFill = $('.volume .fill');
        var $volumeThumb = $('.volume .thumb');
        $volumeFill.width(currentVolume + '%');
        $volumeThumb.css({left: currentVolume + '%'});
        
        $(this).html(pauseButtonTemplate);
        setSong(songNumber);
        currentSoundFile.play();
        updateSeekBarWhileSongPlays();
        updatePlayerBarSong();
    } else if (currentlyPlayingSongNumber === songNumber) {        
        if(currentSoundFile.isPaused()){
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
            $(this).html(pauseButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPauseButton);
        } else{
            currentSoundFile.pause();
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
        }

    };
};
    
var onHover = function (event) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberCell.attr('data-song-number'));

    if (songNumber !== currentlyPlayingSongNumber) {
        songNumberCell.html(playButtonTemplate);
    }
};
    
var offHover = function (event) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberCell.attr('data-song-number'));
    if (songNumber !== currentlyPlayingSongNumber) {
        songNumberCell.html(songNumber);
    }
};

var setCurrentAlbum = function (album) {
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumsongList = $('.album-view-song-list');
    
    $albumTitle.text(album.name);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
 
    $albumsongList.empty();
 
    for (i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
        $albumsongList.append($newRow);
    }
};

var trackIndex = function (album, song) {
    return album.songs.indexOf(song);
};

var updatePlayerBarSong = function () {
    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    setTotalTimeInPlayerBar(filterTimeCode(currentSongFromAlbum.length));
    console.log("I am getting to the bottom of: updatePlayerBarSong" );
};