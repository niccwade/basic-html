var albumPicasso = {
    name: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
         {name: 'Blue', length: '4:26'},
         { name: 'Green', length: '3:14' },
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
    return template;
};

     var albumTitle = document.getElementsByClassName('album-view-title')[0];
     var albumArtist = document.getElementsByClassName('album-view-artist')[0];
     var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
     var albumImage = document.getElementsByClassName('album-cover-art')[0];
     var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

var setCurrentAlbum = function(album){
     albumTitle.firstChild.nodeValue = album.name;
     albumArtist.firstChild.nodeValue = album.artist;
     albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
     albumImage.setAttribute('src', album.albumArtUrl);
 
     albumSongList.innerHTML = '';
 
     for (i = 0; i < album.songs.length; i++) {
         albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
     } 
};
var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';

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
            event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
        }
    });
    for(var i=0; i< songRows.length; i++){
        songRows[i].addEventListener('mouseleave', function(event){
            this.children[0].innerHTML = this.children[0].getAttribute('data-song-number');
        });
    }
 };


