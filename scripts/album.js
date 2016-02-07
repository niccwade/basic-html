var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function () {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(function(){
        changeSong("previous");
    });
    $nextButton.click(function(){
        changeSong("next");
    });
});

//CHANGE SONG FUNCTION
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
    
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    
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
    
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    
    var $previousSongNumberCell = $(getSongNumberCell(currentlyPlayingSongNumber));
    $previousSongNumberCell.html(pauseButtonTemplate);
}
    
    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.name);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    lastSongNumber = getLastSongNumber(currentSongIndex);
    var $lastSongNumberCell = $(getSongNumberCell(lastSongNumber));
    $lastSongNumberCell.html(lastSongNumber);
};

var setSong = function(songNumber) {
    currentlyPlayingSongNumber= parseInt(songNumber);
    currentSongFromAlbum= currentAlbum.songs[songNumber - 1];
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

var count = 0;

var clickHandler = function () {
    count++;
    console.log("-----I clicked again, count is: " + count);
    var songNumber = parseInt($(this).attr('data-song-number'));
    console.log("songNumber right in clickHandler" + songNumber);

    if (currentlyPlayingSongNumber !== null) {
        console.log("The currentlyPlaying song number is not null, it is: " + currentlyPlayingSongNumber);
        var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber)
        console.log("currentlyPlayingCell is: " + currentlyPlayingCell);
        currentlyPlayingCell.html(currentlyPlayingSongNumber);
    }

    if (currentlyPlayingSongNumber !== songNumber) {
        console.log("currentlyPlayingSongNumber: " + currentlyPlayingSongNumber);
        console.log("songNumber: " + songNumber);
        $(this).html(pauseButtonTemplate);
        setSong(songNumber);
        updatePlayerBarSong();
    } else if (currentlyPlayingSongNumber === songNumber) {
        console.log("currentlyPlayingSongNumber: " + currentlyPlayingSongNumber);
        console.log("songNumber: " + songNumber);
        $(this).html(playButtonTemplate);
        console.log($(this));
        $('.main-controls .play-pause').html(playerBarPlayButton);
        currentlyPlayingSongNumber = null;
        currentSongFromAlbum = null;
        console.log("currentlyPlayingSongNumber: " + currentlyPlayingSongNumber);
        console.log("currentSongFromAlbum: " + currentSongFromAlbum);
        console.log("songNumber: " + songNumber);
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