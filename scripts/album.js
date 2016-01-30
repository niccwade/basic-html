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
    return $(template);
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

var findParentByClassName = function(element, targetClass){
   var currentParent = element.parentElement;
    
    if(currentParent){
          while(currentParent.className && currentParent.className != targetClass){
        currentParent = currentParent.parentElement;
    }
        if(currentParent.className == targetClass){
            return currentParent;
        } else {
            alert("No parent with that class name found.")
        }
    } else {
        alert("No parent found.")
    }
};

var getSongItem = function(element) {
    switch (element.className) {
        case 'album-song-button':
        case 'ion-play':
        case 'ion-pause':
            return findParentByClassName(element, 'song-item-number');
        case 'album-view-song-item':
            return element.querySelector('.song-item-number');
        case 'song-item-title':
        case 'song-item-duration':
            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
        case 'song-item-number':
            return element;
        default:
            return;
    }  
};

var clickHandler = function(targetElement) {
    var songItem = getSongItem(targetElement); 
    
    if(currentlyPlayingSong === null){
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
        console.log(currentlyPlayingSong);
    } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')){
        songItem.innerHTML = playButtonTemplate;
        currentlyPlayingSong = null;
     } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
         var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
         currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
     }
 };

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var currentlyPlayingSong = null;

window.onload = function() {
    var index= 0; 
    var allAlbums = [albumPicasso, albumMarconi, albumWest];
    setCurrentAlbum(allAlbums[index]);
    albumImage.addEventListener("click", function(event){
        setCurrentAlbum(allAlbums[index]);
        index++;
        if(index == allAlbums.length){
            index = 0;
        }
    });
    songListContainer.addEventListener('mouseover', function(event){
        if(event.target.parentElement.className === 'album-view-song-item'){
            var songItem = getSongItem(event.target);
            if(songItem.getAttribute('data-song-number') !== currentlyPlayingSong){
                songItem.innerHTML = playButtonTemplate;
            }
        }
    });
    for(var i=0; i< songRows.length; i++){
        songRows[i].addEventListener('mouseleave', function(event){
            var songItem = getSongItem(event.target);
            var songItemNumber = songItem.getAttribute('data-song-number');
            if(songItemNumber !== currentlyPlayingSong){
                songItem.innerHTML = songItemNumber;
            }
        });
        songRows[i].addEventListener('click', function(event) {
             clickHandler(event.target);
         });
    }
 };