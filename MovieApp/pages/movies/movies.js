//获取/utils/util.js中的函数
var util = require("../../utils/util.js");

//获取app.js中的全局变量
var app = getApp();

Page({

  // 这里最好先写上3个空的对象，因为onLoad里面虽然会对data进行setData()，但是注意是在success（）里面异步调用的
  // 所以会导致onLoad函数很快调用完毕，至于3个setData()什么时候能对data赋值上就不能保证了
  // 而wxml页面对data的获取是在onLoad函数调用结束，所以如果不写下面3个wxml页面马上要用到的data中的对象的话，有可能wxml要用到data中的3个对象，而此时异步方法还没有执行结束
  data:{
    "inTheaters":{},
    "comingSoon":{},
    "top250":{},
    "containerShow":true,
    "searchPanelShow":false,
    "searchResult":{}
  },

  onLoad: function () {
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters"+"?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";

    this.getMovieListData(inTheatersUrl,"inTheaters","正在热映");
    this.getMovieListData(comingSoonUrl,"comingSoon","即将上映");
    this.getMovieListData(top250Url,"top250","豆瓣TOP250");
  },

  getMovieListData: function (url,settedKey,categoryTitle) {
    var that=this;
    wx.request({
      url: url,
      method: "GET",
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        that.processDoubanData(res.data, settedKey, categoryTitle);
      },
      fail: function (error) {
      }
    })
  },
  
  //将从豆瓣获取的数据处理成我们需要的格式
  processDoubanData: function (moviesDouban, settedKey, categoryTitle){
      var movies=[];
      for(var idx in moviesDouban.subjects){
        var subject = moviesDouban.subjects[idx];
        var title=subject.title;
        if(title.length>=0){
            title=title.substring(0,6)+"...";
        }
        var temp={
            "title":title,
            "average":subject.rating.average,
            "coverageUrl":subject.images.large,
            "movieId":subject.id,
            "stars": util.convertToStarsArray(subject.rating.stars) 
        };
        movies.push(temp);
      }

      var readyData={};
      readyData[settedKey]={
        "categoryTitle":categoryTitle,
        "movies":movies
      };
      this.setData(readyData);
  },

  //点击更多按钮，跳转到更多页面
  onMoreTap:function(event){
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category='+category,
    })
  },

  //页面上方的搜索Input的获得焦点事件
  onBindFocus: function (event){
    this.setData({
      "containerShow": false,
      "searchPanelShow": true
    });
  },

  //点击搜索栏里的关闭的点击事件
  onCancelImgTap: function (event){
    this.setData({
      "containerShow": true,
      "searchPanelShow": false
    });
  },

  //在搜索栏中输入内容后从豆瓣获取数据
  onBindConfirm:function(event){
    //获取用户输入的input里的值
    var text=event.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    this.getMovieListData(searchUrl, "searchResult", "");
  },


  //点击电影区域，跳转到电影详情页面
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: "movie-detail/movie-detail?id=" + movieId
    })
  },

})