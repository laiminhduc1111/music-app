const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const playBtn = $('.btn-toggle-play')
const cdThumb = $('.cd-thumb')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const random = $('.btn-random')
const audio = $("#audio")
const btnRepeat = $(".btn-repeat")
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom:false,
    isRepeat :false,
    song: [
        {
            name: 'Nevada',
            singer: 'Victone',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Lớn rồi còn khóc nhè',
            singer: 'Ngô Lan Hương',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'Người Kế Nhiệm',
            singer: 'Anh Khoa',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Cô Ấy Của Anh',
            singer: 'Bảo Anh',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg'
        }
        ,
        {
            name: 'Ngày Mai Người Ta Lấy Chồng',
            singer: 'Thành Đạt',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg'
        }
        ,
        {
            name: 'Kẻ Viết Ngôn Tình',
            singer: 'Châu Khải Phong',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpg'
        }
    ],
    render: function () {
        const htmls = this.song.map((song,index) => {
            return `
            <div class="song ${index ===this.currentIndex ? 'active' : ''}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.song[this.currentIndex]
            }
        })
    },
    loadCurrentSong: function () {
        const heading = $('header h2')
      
        const audio = $('#audio')
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },
    handleEvents: function () {
        const _this = this
        const cd = $('.cd')
        const cdWidth = cd.offsetWidth
        //xử lý cd quay và dừng
      const cdThumbAnimate =  cdThumb.animate([
            {transform :'rotate(360deg)'}
        ],{
            duration: 10000,
            iterations :Infinity
        })
        cdThumbAnimate.pause()
        //xử lý phóng to thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newWidth = cdWidth - scrollTop

            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0
            cd.style.opacity = newWidth / cdWidth
        }
        //Xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()

            }

        }
        //khi song đc play
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        //khi song đc pause
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        //khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
           if(audio.duration){
            const progressPercent  =  Math.floor(audio.currentTime / audio.duration * 100)
            progress.value =progressPercent
           }
        }
        //xử lý khi tua song
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }
        //khi next Song
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
           
            audio.play()
         _this.render()
        }
        //khi prev Song
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
        }

        btnRepeat.onclick = function(){
            _this.isRepeat=!_this.isRepeat
            this.classList.toggle('active',_this.isRepeat)
        }
        //xử lý random bật tắt
        random.onclick = function(){
            _this.isRandom = !_this.isRandom
            this.classList.toggle('active',_this.isRandom)
           
        }
        //xử lý song khi audio ended
        audio.onended = function () {
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
          
        }
    },
    nextSong : function(){
        this.currentIndex++
        if(this.currentIndex >= this.song.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    playRandomSong:function(){
        let newIndex
        do {
           newIndex = Math.floor(Math.random()*this.song.length)
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong()
    },
    prevSong : function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.song.length - 1
        }
        this.loadCurrentSong()
    },
    start: function () {
        //định nghĩa các thuộc tính cho object
        this.defineProperties()
        //lắng nghe sử  lý các sự kiện
        this.handleEvents()
        //tải thông tin bài hát đầu tiên khi chạy ứng dụng
        this.loadCurrentSong()
        //render play list
        this.render();
    }
}

app.start()