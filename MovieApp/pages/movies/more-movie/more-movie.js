//获取/utils/util.js中的函数
var util = require("../../../utils/util.js");

//获取app.js中的全局变量
var app = getApp();

Page({

data:{
          "navigateTitle":"",
          "movies":[],
          "requestUrl": "",
          "totalCount":0,
          "isEmpty":true
},

onLoad:function(options){
          //获取从movies.wxml传来的category值
          var category=options.category;
          this.setData({
            "navigateTitle": category
          });

          //根据不同的category值来请求不同的豆瓣api Url
          var dataUrl="";
          switch (category){
            case "正在热映":
              dataUrl = app.globalData.doubanBase +"/v2/movie/in_theaters";
              break;
            case "即将上映":
              dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
              break;
            case "豆瓣TOP250":
              dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
              break;
          }
          this.setData({
            "requestUrl":dataUrl
          });
          util.http(dataUrl, this.processDoubanData);
},

//将从豆瓣获取的数据处理成我们需要的格式
processDoubanData: function (moviesDouban){
          var movies = [];

          for (var idx in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[idx];
            var title = subject.title;
            if (title.length >= 0) {
              title = title.substring(0, 6) + "...";
            }
            var temp = {
              "title": title,
              "average": subject.rating.average,
              "coverageUrl": subject.images.large,
              "movieId": subject.id,
              "stars": util.convertToStarsArray(subject.rating.stars)
            };
            movies.push(temp);
            }
            
            //将这次获取到的movies添加到之前的movies上
            var totalMovies=[];
            if(!this.data.isEmpty){
                totalMovies=this.data.movies.concat(movies);
            }else{
                totalMovies=movies;
                this.setData({
                  "isEmpty":false
                });
            }
            this.setData({
              "movies": totalMovies,
              "totalCount":this.data.totalCount+20
            });
            //隐藏正在加载图标
            wx.hideNavigationBarLoading();
},

//上划加载
onReachBottom:function(){
            var nextUrl=this.data.requestUrl+"?start="+this.data.totalCount+"&count=20";
            util.http(nextUrl, this.processDoubanData);
            //显示正在加载
            wx.showNavigationBarLoading();
},

//下拉刷新
onPullDownRefresh:function(){
            var refreshUrl = this.data.requestUrl + "?start=0&count=20";
            this.setData({
              "movies": [],
              "isEmpty": true
            });
            util.http(refreshUrl, this.processDoubanData);
            //显示正在加载
            wx.showNavigationBarLoading();
},


//动态的展示navigationBar上的文字
onReady: function () {
            wx.setNavigationBarTitle({
              title: this.data.navigateTitle
            })
},

//点击电影区域，跳转到电影详情页面
onMovieTap: function (event) {
  var movieId = event.currentTarget.dataset.movieid;
  wx.navigateTo({
    url: "../movie-detail/movie-detail?id=" + movieId
  })
},
  
})