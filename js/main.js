
var searchVideoTest = {};

var myArray = ['AIzaSyAEcxLMHrlz_Kkd2pPIMVd6kow01FFBE8E', 'AIzaSyBM-j14MHRgeS7Sviove7laYV4pfY2zvO8', 'AIzaSyCRVbzOOPDS7zfXkz3hRcQ-wPT557m6yvI'];
var rand = myArray[Math.floor(Math.random() * myArray.length)];

searchVideoTest.Common = {
  customKey: rand,
  maxResults: 50,
  searches: [],

  init: function () {

    this.defaultVideos();

    $(".btn-submit").on("click", function () {

      var query = $(".searchBox").val();

      searchVideoTest.Common.recent(query);
      searchVideoTest.Common.clearList('list');
      searchVideoTest.Common.callingAPI(query);

      return false;
    });

    this.bindButtons();
  },

  // Call API
  callingAPI: function (query, token) {

    $.get(
    "https://www.googleapis.com/youtube/v3/search",
    {
      part: 'snippet, id',
      q: query,
      type: 'video',
      maxResults: searchVideoTest.Common.maxResults,
      key: this.customKey },


    function (data) {

      if (data) {

        $('#nextBtn').data('token', data.nextPageToken);
        $('#nextBtn').show();

        searchVideoTest.Common.displayList(data);
        searchVideoTest.Common.relatedVideos(data.items[0].id.videoId);

      }
    });

  },

  // Load most popular videos by default
  defaultVideos: function () {

    $.get(
    "https://www.googleapis.com/youtube/v3/videos",
    {
      part: 'snippet, id',
      chart: 'mostPopular',
      regionCode: 'us',
      type: 'video',
      maxResults: searchVideoTest.Common.maxResults,
      key: this.customKey },


    function (data) {

      if (data) {

        // $('#prevtBtn').data('token', data.prevPageToken);

        $('#nextBtn').data('token', data.nextPageToken);
        $('#nextBtn').show();

        searchVideoTest.Common.displayList(data);
        searchVideoTest.Common.relatedVideos(data.items[0].id.videoId);

      }
    });

  },

  // Clear video list 
  clearList: function (what) {

    $("." + what).find(".eachResult").fadeOut("fast");
  },

  // Create list of videos
  searchResult: function (data, where) {

    for (var i = 0; i < data.items.length; i++) {if (window.CP.shouldStopExecution(0)) break;

      var eachVideo = data.items[i].snippet;

      var imgThumb = "<img src=\"" + eachVideo.thumbnails.medium.url + "\" class=\"img-responsive videoThumbnail\">";
      var title = eachVideo.title;
      var channel = eachVideo.channelTitle;

      if (typeof data.items[i].id === 'string') {

        var videoId = data.items[i].id;

      } else {

        var videoId = data.items[i].id.videoId;
      }

      var videoList = "<li class=\"eachResult clearfix\" id=\"" + videoId + "\" > " +
      "<div class=\"col-sm-4\">" + imgThumb + "</div>" +
      "<div class=\"col-sm-8\" id=\"textContainer\"> " +
      "<dl>" +
      "<dt>" + title + "</dt> " +
      "<dd>" + channel + "</dd> " +
      "</dl> " +
      "</div>" +
      "</li>";

      $("." + where).append(videoList);
    }window.CP.exitedLoop(0);

    $(".eachResult").on("click", function () {

      var videoId = $(this).attr("id");
      location.href = 'player.html?id=' + videoId;

    });
  },

  // show result box
  displayList: function (data) {

    $(".videosList").show();
    this.searchResult(data, 'videosList');
  },

  // Next videos
  nextPrevVid: function (btn) {

    var token = $('#' + btn).data('token');
    var query = $(".searchBox").val();

    $.get(
    "https://www.googleapis.com/youtube/v3/search",
    {
      part: 'snippet, id',
      type: 'video',
      q: query,
      pageToken: token,
      maxResults: searchVideoTest.Common.maxResults,
      key: searchVideoTest.Common.customKey },


    function (data) {

      searchVideoTest.Common.clearList('videosList');
      searchVideoTest.Common.displayList(data);

      if (btn === 'nextBtn') {

        $('#prevBtn').show();

      } else if (data.prevPageToken === undefined) {
        $('#prevBtn').hide();
      }

      $('#prevBtn').data('token', data.prevPageToken);
      $('#nextBtn').data('token', data.nextPageToken);

    });

  },

  // Buttons on click
  bindButtons: function () {

    $('#prevBtn').on('click', function () {
      searchVideoTest.Common.nextPrevVid('prevBtn');
    });

    $('#nextBtn').on('click', function () {
      searchVideoTest.Common.nextPrevVid('nextBtn');
    });
  },

  // Creates related videos list
  relatedVideos: function (videoId) {

    $.get(
    "https://www.googleapis.com/youtube/v3/search",
    {
      part: 'snippet',
      relatedToVideoId: videoId,
      type: 'video',
      maxResults: 5,
      key: searchVideoTest.Common.customKey },


    function (data) {

      searchVideoTest.Common.searchResult(data, 'relatedVideos');
      $('.relatedVideos .col-sm-4').addClass('col-xs-4');
      $('.relatedVideos .col-sm-8').addClass('col-xs-8');
    });

  },

  // creates recent searches list
  recent: function (query) {

    if (this.searches.length < 5) {

      $('.recent').html('');

      if ($.inArray(query, this.searches) === -1) {
        this.searches.push(query);
      }

      for (var i = 0; i < this.searches.length; i++) {if (window.CP.shouldStopExecution(1)) break;

        var eachSearch = this.searches[i];

        var recentList = "<li data-token='" + eachSearch + "'>" + eachSearch + "</li>";

        $(".recent").append(recentList);
      }window.CP.exitedLoop(1);

      $(".recent li").on("click", function () {

        $('.searchBox').val($(this).data('token'));
        $(".btn-submit").trigger('click');
      });
    }
  },

  // perform animation on video play
  playVideo: function (videoId) {

    $('.modal').addClass('on');

    $("#videoFrame").attr("src", "https://www.youtube.com/embed/" + videoId);

    $(".on").on("click", function () {
      $("#videoFrame").attr('src', '');
      $('.modal').removeClass('on');
    });
  } };


{
  $(document).ready(function () {
    searchVideoTest.Common.init();
  });
}