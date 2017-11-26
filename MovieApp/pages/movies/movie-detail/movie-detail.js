//获取app.js中的数据
var app=getApp();

//获取/utils/util.js中的函数
var util = require("../../../utils/util.js");

Page({

  data: {
    "movie":{}
  },

  onLoad: function (options) {
          //获取从movie.js中传来的movieId
          var movieId=options.id;
          var url=app.globalData.doubanBase+"/v2/movie/subject/"+movieId;

          util.http(url, this.processDoubanData);
  },

  //将从豆瓣获取的数据处理成我们需要的格式
  processDoubanData: function (data) {
          if(!data){
            return;
          }
          //
          var director={
            avatar:"",
            name:"",
            id:""
          };
          if(data.directors[0]!=null){
            if (data.directors[0].avatars!=null){
              director.avatar = data.directors[0].avatars.large;
            }
            director.name = data.directors[0].name;
            director.id = data.directors[0].id;
          }
          //
          var movie={
            movieImg:data.images?data.images.large:"",
            country:data.countries[0],
            title:data.title,
            originalTitle:data.original_title,
            wishCount:data.wish_count,
            commentCount:data.comments_count,
            year:data.year,
            generes:data.genres.join("、"),
            stars:util.convertToStarsArray(data.rating.stars),
            score:data.rating.average,
            director:director,
            casts:util.convertToCastString(data.casts),
            castsInfo:util.convertToCastInfos(data.casts),
            summary:data.summary
          };
          //
          this.setData({
            movie:movie
          });
  },

  //点击背景图/悬浮的图片查看大图
  viewMoviePostImg:function(event){
          var src=event.currentTarget.dataset.src;
          wx.previewImage({
            current:src,
            urls: [src],
          })
  },
  
})