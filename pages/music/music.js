// pages/music/music.js

var utils = require("../../utils/utils.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
      musicList: [],
      musicTitle: "",
      musicDesc: "",
      musicPic: "",
      dataUrl: '',
      title: '',
      coverImgUrl: '',
      playing: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options.category);
      
      var url = "";
      switch(options.category){
          case "今日推荐":
            url = "https://www.wwtliu.com/sxtstu/music/baidu/list.php?type=24&count=10&offset=0";
            break;

          case "朋友圈歌曲":
              url = "https://www.wwtliu.com/sxtstu/music/baidu/list.php?type=25&count=10&offset=0";
              break;

          case "新歌榜":
              url = "https://www.wwtliu.com/sxtstu/music/baidu/list.php?type=1&count=10&offset=0";
              break;

          case "热歌榜":
              url = "https://www.wwtliu.com/sxtstu/music/baidu/list.php?type=2&count=10&offset=0";
              break;

          case "摇滚榜":
              url = "https://www.wwtliu.com/sxtstu/music/baidu/list.php?type=11&count=10&offset=0";
              break;
      }

      utils.http(url, this.callback, null, null);

      wx.showLoading({
          title: '玩命加载中',
      })
  },

  callback: function (data) {

      wx.hideLoading();

      console.log(data);

      this.setData({
          musicList: data.song_list,
          musicTitle: data.billboard.name,
          musicDesc: data.billboard.comment,
          musicPic: data.billboard.pic_s192,
      })
  },

  // 点击歌曲
  playHandler: function (event){
      var mid = event.currentTarget.dataset.musicid;
      console.log(mid);
      utils.http("https://www.wwtliu.com/sxtstu/music/baidu/play.php?mid=" + mid, this.getMusicinfo, null, null);
  },

  // 获取歌曲的信息,用来播放
  getMusicinfo: function (data){
     this.setData({
        dataUrl: data.bitrate.show_link,
        title: data.songinfo.title,
        coverImgUrl: data.songinfo.pic_small
     })

    // 调用播放功能
     this.play();
  },
  

  // 播放功能
  play: function (){
      var that = this;
      wx.playBackgroundAudio({
          dataUrl: this.data.dataUrl,
          title: this.data.title,
          coverImgUrl: this.data.coverImgUrl,
          complete: function (){
              that.setData({
                  playing: true
              })
          }
      })

      
  },
  
  // 暂停功能
  pause: function (){
      wx.pauseBackgroundAudio();
      this.setData({
          playing: false
      })
  }
})