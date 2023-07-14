const wrapper = document.querySelector('.wrapper');
const musicImg = wrapper.querySelector('.image-area img');
const musicName = wrapper.querySelector('.song-details .name');
const musicArtist = wrapper.querySelector('.song-details .artist');
const playPauseBtn = wrapper.querySelector('.play-pause');
const repeatBtn = wrapper.querySelector('#repeat-plist');
const prevBtn = wrapper.querySelector('#prev');
const nextBtn = wrapper.querySelector('#next');
const progressBar = wrapper.querySelector('.progress-bar');
const progressArea = wrapper.querySelector('.progress-area');
const mainAudio = wrapper.querySelector('#main-audio');
const musicList = wrapper.querySelector('.music-list');
const moreMusicBtn = wrapper.querySelector('#more-music');
const closeMoreMusicBtn = wrapper.querySelector('#close');

const showHideImage = wrapper.querySelector('#showHide-image');
const musicImgArea = wrapper.querySelector('.image-area');

const showMenuBtn = wrapper.querySelector('#show-menu');
const closeShowMenuBtn = wrapper.querySelector('#close-menu');
const colorMenu = wrapper.querySelector('.color-menu')


let showHideImgBtn = showHideImage.setAttribute('onclick', 'showHideImg()');

function showHideImg(){
    if(musicImgArea.classList.contains('image-area-hide')){
        musicImgArea.classList.remove('image-area-hide');
        musicImgArea.classList.add('image-area');
        showHideImage.innerText = 'expand_more';
        showHideImage.setAttribute('title', 'Hide Image');
    }else{
        musicImgArea.classList.remove('image-area');
        musicImgArea.classList.add('image-area-hide');
        showHideImage.innerText = 'expand_less';
        showHideImage.setAttribute('title', 'Show Image');
    }
}

showMenuBtn.addEventListener('click', () => {
    colorMenu.classList.toggle('show');
})
closeShowMenuBtn.addEventListener('click', () => {
    showMenuBtn.click();
})

const setTheme = (theme) => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
}

const getTheme = () =>{
    const theme = localStorage.getItem('theme');
    theme && setTheme(theme);
    
    const idOption = "#"+localStorage.getItem('theme');
    const optionSelected = wrapper.querySelector(idOption);       
    optionSelected.selected = true;
}

getTheme();

document.getElementById('color-scheme').addEventListener('change', function() {
    setTheme(this.value);
});

let musicIndex = Math.floor(Math.random() * allMusic.length + 1);
let isMusicPaused = true;

window.addEventListener('load', () => {
    loadMusic(musicIndex);
    playingSong();
})

function loadMusic(index) {
    musicName.innerHTML = allMusic[index - 1].name;
    musicArtist.innerHTML = allMusic[index - 1].artist;
    musicImg.src = `images/${allMusic[index - 1].src}.jpg`;
    mainAudio.src = `songs/${allMusic[index - 1].src}.mp3`;
}

function playMusic (){
    wrapper.classList.add('paused');
    playPauseBtn.querySelector('i').innerText='pause';
    mainAudio.play();
}

function pauseMusic (){
    wrapper.classList.remove('paused');
    playPauseBtn.querySelector('i').innerText='play_arrow';
    mainAudio.pause();
}

function prevMusic (){
    musicIndex--;
    if(musicIndex < 1){
        musicIndex = allMusic.length;
    }
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

function nextMusic (){
    musicIndex++;
    if(musicIndex > allMusic.length){
        musicIndex = 1;
    }
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

playPauseBtn.addEventListener('click', () => {
    const isMusicPlay =wrapper.classList.contains('paused');

    isMusicPlay ? pauseMusic() : playMusic();
    playingSong();
})

nextBtn.addEventListener('click', () => {
    nextMusic();
});

prevBtn.addEventListener('click', () => {
    prevMusic();
})  

mainAudio.addEventListener('timeupdate', () => {

    progressArea.value = (mainAudio.currentTime / mainAudio.duration) * 100;
    progressBar.style.width = `${progressArea.value}%`;

    let musicCurrentTime = wrapper.querySelector('.current-time');
    let musicDuration = wrapper.querySelector('.max-duration');

    mainAudio.addEventListener('loadeddata', () => {
        let mainAdDuration = mainAudio.duration;

        let minutesTot = Math.floor(mainAdDuration / 60);
        let secondsTot = Math.floor(mainAdDuration % 60);
        if(secondsTot < 10){
            secondsTot = `0${secondsTot}`;
        }
        musicDuration.innerHTML = `${minutesTot}:${secondsTot}`;
    })

    mainAudio.addEventListener('timeupdate', () => {
        let mainAdCurrentTime = mainAudio.currentTime;
        let minutes = Math.floor(mainAdCurrentTime / 60);
        let seconds = Math.floor(mainAdCurrentTime % 60);
        if(seconds < 10){
            seconds = `0${seconds}`;
        }
        musicCurrentTime.innerHTML = `${minutes}:${seconds}`;
    })
})

progressArea.addEventListener('click', (e) => {
    let progressWidth = progressArea.clientWidth;
    let clickOffsetX = e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickOffsetX / progressWidth) * songDuration;
    playMusic();
    playingSong();
})

repeatBtn.addEventListener('click', () => {
    let getText = repeatBtn.innerText;
    switch(getText){
        case 'repeat':
            repeatBtn.innerText = 'repeat_one';
            repeatBtn.setAttribute('title', 'Song Looped');
            break;
        case 'repeat_one':
            repeatBtn.innerText = 'shuffle';
            repeatBtn.setAttribute('title', 'Playback Shuffled');
            break;
        case 'shuffle':
            repeatBtn.innerText = 'repeat';
            repeatBtn.setAttribute('title', 'Playlist Looped');
            break;
    }
})

mainAudio.addEventListener('ended', () => {
    let getText = repeatBtn.innerText;
    switch(getText){
        case 'repeat':
            nextMusic();
            break;
        case 'repeat_one':
            mainAudio.currentTime = 0;
            playMusic();
            break;
        case 'shuffle':
            let randomIndex = Math.floor(Math.random() * allMusic.length + 1);
            do{
                randomIndex = Math.floor(Math.random() * allMusic.length + 1);
            }while(musicIndex === randomIndex);
            musicIndex = randomIndex;
            loadMusic(musicIndex);
            playMusic();
            playingSong();
            break;
    }
})

moreMusicBtn.addEventListener('click', () => {
    musicList.classList.toggle('show');
})

closeMoreMusicBtn.addEventListener('click', () => {
    moreMusicBtn.click();
})

const ulTag = wrapper.querySelector('#playing-list');

for(let i = 0; i < allMusic.length; i++){
    let liTag = `
        <li li-index= "${i +1}">
            <div class="row">
                <span>${allMusic[i].name}</span>
                <p>${allMusic[i].artist}</p>
            </div>
            <span id="${allMusic[i].src}" class="audio-duration" ></span>
            <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
        </li>    `;

    ulTag.insertAdjacentHTML('beforeend', liTag);

    let liAudioDurationTag = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener('loadeddata', () => {
        let liAudioDuration = liAudioTag.duration;
        let minutes = Math.floor(liAudioDuration / 60);
        let seconds = Math.floor(liAudioDuration % 60);
        if(seconds < 10){
            seconds = `0${seconds}`;
        }
        liAudioDurationTag.innerText = `${minutes}:${seconds}`;
        liAudioDurationTag.setAttribute(`t-duration`, `${minutes}:${seconds}`);
    })
}

function playingSong(){
    const alLiTag = ulTag.querySelectorAll('li');
    
    for (let index = 0; index < alLiTag.length; index++) {
        let audioTag = alLiTag[index].querySelector(`.audio-duration`);        
        if(alLiTag[index].classList.contains('playing')){
            alLiTag[index].classList.remove('playing'); 
            let addDuration = audioTag.getAttribute(`t-duration`);
            audioTag.innerText = addDuration;
        }       
        if(alLiTag[index].getAttribute('li-index') == musicIndex){            
            alLiTag[index].classList.add('playing');
            audioTag.innerText = "Playing"
        }
        alLiTag[index].setAttribute("onclick", "clicked(this)")
    }
}

function clicked(element){
    musicIndex = parseInt(element.getAttribute('li-index'));
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}


