var albumPicasso = {
    name: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
         {name: 'Blue', length: '4:26'},
         {name: 'Green', length: '3:14' },
         { name: 'Red', length: '5:01' },
         { name: 'Pink', length: '3:21'},
         { name: 'Magenta', length: '2:15'}
    ]
};

var albumMarconi = {
     name: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'assets/images/album_covers/20.png',
     songs: [
         { name: 'Hello, Operator?', length: '1:01' },
         { name: 'Ring, ring, ring', length: '5:01' },
         { name: 'Fits in your pocket', length: '3:21'},
         { name: 'Can you hear me now?', length: '3:14' },
         { name: 'Wrong phone number', length: '2:15'}
     ]
 };

 var albumWest = {
     name: '808s & Heartbreak',
     artist: 'Kanye West',
     label: 'EM',
     year: '2008',
     albumArtUrl: 'assets/images/album_covers/808s_&_Heartbreak.png',
     songs: [
         { name: 'Say You Will', length: '6:17' },
         { name: 'Welcome to Heartbreak', length: '4:22' },
         { name: 'Heartless', length: '3:30'},
         { name: 'Amazing', length: '3:58' },
         { name: 'Love Lockdown', length: '4:30'},
         { name: 'Paranoid', length: '4:37'},
         { name: 'RoboCop', length: '4:34'},
         { name: 'Street Lights', length: '3:09'},
         { name: 'Bad News', length: '3:58'},
         { name: 'See You in My Nightmares', length: '4:18'},
         { name: 'Coldest Winter', length: '2:44'}
     ]
 };

var createSongRow = function(songNumber, songName, songLength){
    var template =
        '<tr class="album-view-song-item">'
    +   '   <td class="song-item-number" data-song-number=" ' + songNumber + ' " >' + songNumber + '</td>'
    +   '   <td class="song-item-title">' +songName + '</td>'
    +   '   <td class="song-itme-duration">' + songLength + '</td>'
    + '</tr>'
    ;
    var $row = $(template);
    
    var clickHandler = function(){
        var songNumber = $(this).attr('data-song-number');
        if(currentlyPlayingSong !== null){
            var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]');
            currentlyPlayingCell.html(currentlyPlayingSong);
        }
        if(currentlyPlayingSong !== songNumber){
            $(this).html(pauseButtonTemplate);
            currentlyPlayingSong = songNumber;
        } else if(currentlyPlayingSong === songNumber){
            $(this).html(playButtonTemplate);
            currentlyPlayingSong = null;
        }
    }; 
    
    var onHover = function(event){
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = songNumberCell.attr('data-song-number');
        
        if(songNumber !== currentlyPlayingSong){
            songNumberCell.html(playButtonTemplate);
        }
    };
    
    var offHover = function(event){
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');
        if(songNumber !== currentlyPlayingSong){
            songNumberCell.html(songNumber);
        }
    };
        
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var setCurrentAlbum = function(album){
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

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var currentlyPlayingSong = null;

$(document).ready(function(){
    var index = 0; 
    var allAlbums = [albumPicasso, albumMarconi, albumWest];
    setCurrentAlbum(allAlbums[index]);
    albumImage.addEventListener("click", function(event){
        setCurrentAlbum(allAlbums[index]);
        index++;
        if(index == allAlbums.length){
            index = 0;
        }
    });  
});