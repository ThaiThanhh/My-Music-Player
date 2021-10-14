const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $(".btn-toggle-play")
const player =  $(".player")
const progress = $(".progress")
const prevBtn = $(".btn-prev") 
const nextBtn = $(".btn-next") 
const randomBtn = $(".btn-random")
const repeatBtn = $('.btn-repeat')
const playlist =  $('.playlist')
const app = {
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    currentIndex: 0,
    songs: [
        {
            name: 'Mình Yêu Nhau Đi',
            singer: 'Bích Phương',
            path: './assets/music/Minh-Yeu-Nhau-Di-Bich-Phuong.mp3',
            img: './assets/img/Minh-Yeu-Nhau-Di-Bich-Phuong.jpg'
        },
        {
            name: 'Năm Ấy',
            singer: 'Đức Phúc',
            path: './assets/music/NĂM ẤY.mp3',
            img: './assets/img/NĂM ẤY.jpg'
        },
        {
            name: 'Here I Am Again',
            singer: 'Yerin Baek',
            path: './assets/music/Here I Am Again.mp3',
            img: './assets/img/Here I Am Again.jpg'
        },
        {
            name: 'Cưới thôi',
            singer: 'Bray ft TAP',
            path: './assets/music/Cưới thôi.mp3',
            img: './assets/img/Cưới thôi.jpg'
        },
        {
            name: 'My Everything',
            singer: 'Tiên Tiên',
            path: './assets/music/My everything.mp3',
            img: './assets/img/My everything.jpg'
        },
        {
            name: 'Say You Do',
            singer: 'Tiên Tiên',
            path: './assets/music/Say you do.mp3',
            img: './assets/img/Say you do.jpg'
        },
        {
            name: 'Muộn Rồi Mà Sao Còn',
            singer: 'Sơn Tùng MTP',
            path: './assets/music/Muộn rồi mà sao còn.mp3',
            img: './assets/img/Muộn rồi mà sao còn.jpg'
        },
        {
            name: 'Liệu Giờ',
            singer: '2T',
            path: './assets/music/Liệu giờ.mp3',
            img: './assets/img/Liệu giờ.jpg'
        }
    ],
    //render songs
    render: function(){
        var htmls = this.songs.map((song, index) => {
            return ` <div class="song ${this.currentIndex == index ? "active" : ""}" data-index = "${index}">
            <div class="thumb"
                style="background-image: url('${song.img}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`
        }
        )
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function (){
        Object.defineProperty(this, 'currentSong', {
            get: function (){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function(){
        const cdWidth = cd.offsetWidth
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
        }
        //Xử lý CD quay, dừng
        const cdThumbAnimate =  cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000, //10s
            iterations: Infinity
        })
        cdThumbAnimate.pause()
        //Xử lý khi click play
        playBtn.onclick = function(){
            if (app.isPlaying){
                audio.pause()
            }
            else {
                audio.play()
            }
        }
        //Lắng nghe hành động play của song
        audio.onplay = function(){
            player.classList.add('playing')
            app.isPlaying = true
            cdThumbAnimate.play()
        }
        //Lắng nghe hành động pause của song
        audio.onpause = function(){
            player.classList.remove('playing')
            app.isPlaying = false
            cdThumbAnimate.pause()
        }
        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if (audio.duration){
                var progressPercent = Math.floor(100* audio.currentTime / audio.duration)
            }
            progress.value = progressPercent
        }
        //Hành động tua
        progress.onchange = function(e){
            const seekTime = e.target.value * audio.duration / 100
            audio.currentTime = seekTime
        }
        //hành động next song
        nextBtn.onclick = function(){
            if (app.isRandom){
                app.playRandomSong()
            }
            else {
                app.nextSong()
            }
            audio.play()
        }
        //Hành động prev song
        prevBtn.onclick = function(){
            if (app.isRandom){
                app.playRandomSong()
            }
            else {
                app.prevSong()
            }
            audio.play()
        }
        // hành động click vào random
        randomBtn.onclick = function(){
            if (!app.isRepeat){
                app.isRandom = !app.isRandom
                randomBtn.classList.toggle('active',app.isRandom)
            }
        }
        //Hành động click vào repeat
        repeatBtn.onclick = function(){
            if (!app.isRandom){
                app.isRepeat =!app.isRepeat
                repeatBtn.classList.toggle('active',app.isRepeat)
            }
        }
        // Khi end bài hát
        audio.onended =  function(){
            if (app.isRepeat){
                this.play()
            }
            else {
                nextBtn.click()
            }
        }
        //Lắng nghe hành động click vào playlist
        playlist.onclick = function(e){
            songNode = e.target.closest('.song:not(.active)')
            app.currentIndex = Number(songNode.dataset.index)
            app.loadCurrentSong()
            app.render()
            audio.play()
        }
    },
    //Next song
    nextSong: function(){
        if (this.currentIndex == this.songs.length - 1 ){
            this.currentIndex = 0
        }
        else {
            this.currentIndex++
        }
        this.loadCurrentSong()
        app.render()
        app.scrollToActiveSong()
    },
    //PrevSong
    prevSong: function(){
        if (this.currentIndex > 0){
            this.currentIndex--
        }
        this.loadCurrentSong()
        app.render()
        app.scrollToActiveSong()
    },
    playRandomSong: function(){
        var newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex == this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
        app.render()
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path
    },
    scrollToActiveSong: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        },300)
    },

    start: function(){
        //Định nghĩa các thuộc tính
        audio.volume = 0.4
        app.defineProperties()
        app.handleEvents()
        app.render()
        app.loadCurrentSong()
        
    }
}
app.start()