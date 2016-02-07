var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
 var currentSoundFile = null;
var currentVolume = 80;
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

var seek = function(time){
    if(currentSoundFile){
        currentSoundFile.setTime(time);
    }
};

var updateSeekBarWhileSongPlays = function() {
    if(currentSoundFile) {
        currentSoundFile.bind('timeupdate', function(event){
            var seekBarFillRatio = this.getTime() /this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
    }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio){
   var offsetXPercent = seekBarFillRatio * 100;
    
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
   var $seekBars = $('.player-bar .seek-bar');
    $seekBars.click(function(event){
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        var seekBarFillRatio = offsetX/barWidth;
        
        if($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);
        }
        updateSeekPercentage($(this), seekBarFillRatio);
    });
    
    $seekBars.find('.thumb').mousedown(function(event){
        var $seekBar = $(this).parent();
        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX/barWidth;
            
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
        +   '   <td class="song-itme-duration">' + songLength + '</td>'
        + '</tr>';
    var $row = $(template);
    $row.find('.song-item-number').click(clickHandler);
    console.log($row.find('.song-item-number'));
    $row.hover(onHover, offHover);
    return $row;
};


var clickHandler = function () {
    var songNumber = parseInt($(this).attr('data-song-number'));
    console.log("songNumber right in clickHandler" + songNumber);

    if (currentlyPlayingSongNumber !== null) {
        console.log("The currentlyPlaying song number is not null, it is: " + currentlyPlayingSongNumber);
        var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber)
        console.log("currentlyPlayingCell is: " + currentlyPlayingCell);
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
        updatePlayerBarSong();
    } else if (currentlyPlayingSongNumber === songNumber) {        
        if(currentSoundFile.isPaused()){
            currentSoundFile.play();
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
};