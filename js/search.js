
$(function() {
  $('#search-form').submit(function(e) {
    $('#loader').show();
    e.preventDefault();
    
  })
});

function search() {
  var myArray = ['AIzaSyBM-j14MHRgeS7Sviove7laYV4pfY2zvO8', 'AIzaSyCRVbzOOPDS7zfXkz3hRcQ-wPT557m6yvI'];
//'AIzaSyAEcxLMHrlz_Kkd2pPIMVd6kow01FFBE8E', 
var rand = myArray[Math.floor(Math.random() * myArray.length)];
  
  //Clear any previous results 
  $('#results').html('');
  $('#btn-cnt').html(''); 
  
  //Get form input
  var q = $('#query').val();
  
  //Run GET Request   on API
  $.get(
    "https://www.googleapis.com/youtube/v3/search",{
      part: 'snippet, id',
      q: q,
      type: 'video',
      key: rand }, 
      function(data) {
        var nextPageToken = data.nextPageToken;
        var prevPageToken = data.prevPageToken;
        var pageInfo = data.pageInfo;
        
        //Log data
        console.log(data);  
        
        $.each(data.items, function(i, item) {
            //Get output
            var output = getOutput(item);
            
            //Display results
            $('#results').append(output); 
        });
        
        var buttons = getButtons(prevPageToken,nextPageToken, pageInfo);
        
        //Display buttons
        $('#results').prepend(buttons);
        $('#btn-cnt').append(buttons);
      }
  );  
}

//Build Output
  function getOutput(item) {
    var videoId = item.id.videoId;
    var title = item.snippet.title;
    var description = item.snippet.description;
    var thumb = item.snippet.thumbnails.high.url;
    var channelTitle = item.snippet.channelTitle;
    var videoDate = item.snippet.publishedAt;
    
    //Build Output String
    $('#loader').hide();
    var output = '<div class="row">' + 
    '<div class="col-sm-2">' +  
      '<a href="player.html?id=' + videoId + '"><img class="img-fluid" src="' + thumb + '"></a>' +
    '</div>' +
    '<div class="col-sm-10">' + 
      '<h4><a href="player.html?id=' + videoId + '">' + title + '</a></h4>' +
      '<small>By <span class="cTitle">' + channelTitle + '</span> 업로드일: '+ videoDate + '</small>' +
    '</div>' +
    '</div>';
    return output;
      
  }

//Build the Buttons
  function getButtons(prevPageToken,nextPageToken,pageInfo) {
    
    $('#btn-cnt').html(''); 
    var btnoutput;
    var q = $('#query').val();
    if(!prevPageToken) {
      btnoutput = '<div class="button-container">' + 
      '<span class="total-results"><label>결과 :</label>' + pageInfo.totalResults + '</span>' +
      '<button id="next-button" class="btn animated-button thar-three" data-token="' +  nextPageToken + '" data-query="' + q +'"' +
      'onclick="nextPage();">다음</button><div class="clearfix"></div></div>';
      console.log(nextPageToken);
    } else {
      console.log(nextPageToken);
      btnoutput = '<div class="button-container">' +
      '<span class="total-results"><label>결과 :</label>' + pageInfo.totalResults + '</span>' +
      '<button id="next-button" class="btn  animated-button thar-three" data-token="' +   nextPageToken + '" data-query="' + q +'"' +
      'onclick="nextPage();">다음</button>' +
      '<button id="prev-button" class="btn  animated-button thar-four" data-token="' +  prevPageToken + '" data-query="' + q +'"' +
      'onclick="prevPage();">이전</button>' +
      '<div class="clearfix"></div></div>';
    }
    return btnoutput;
  }

function nextPage() {
  
  var myArray = ['AIzaSyBM-j14MHRgeS7Sviove7laYV4pfY2zvO8', 'AIzaSyCRVbzOOPDS7zfXkz3hRcQ-wPT557m6yvI'];
//'AIzaSyAEcxLMHrlz_Kkd2pPIMVd6kow01FFBE8E', 
var rand = myArray[Math.floor(Math.random() * myArray.length)];
    
    var token = $('#next-button').data('token');
    var q = $('#next-button').data('query');
    //Clear any previous results 
  $('#results').html('');
  $('#btn-cnt').html(''); 
  
  //Get form input
  q = $('#query').val();
  
  //Run GET Request   on API
  $.get(
    "https://www.googleapis.com/youtube/v3/search",{
      part: 'snippet, id',
      q: q,
      pageToken: token,
      type: 'video',
      key: rand}, 
      function(data) {
        var nextPageToken = data.nextPageToken;
        var prevPageToken = data.prevPageToken;
        var pageInfo = data.pageInfo;
        //Log data
        console.log(data);  
        
        $.each(data.items, function(i, item) {
            //Get output
            var output = getOutput(item);
            
            //Display results
            $('#results').append(output); 
        });
        
        var buttons = getButtons(prevPageToken,nextPageToken,pageInfo);
        
        //Display buttons
        $('#results').prepend(buttons);
        $('#btn-cnt').append(buttons);
      }
    );
      
}

function prevPage() {
  
   var myArray = ['AIzaSyBM-j14MHRgeS7Sviove7laYV4pfY2zvO8', 'AIzaSyCRVbzOOPDS7zfXkz3hRcQ-wPT557m6yvI'];
//'AIzaSyAEcxLMHrlz_Kkd2pPIMVd6kow01FFBE8E', 
var rand = myArray[Math.floor(Math.random() * myArray.length)];
    
    var token = $('#prev-button').data('token');
    var q = $('#prev-button').data('query');
    //Clear any previous results 
  $('#results').html('');
  $('#btn-cnt').html(''); 
  
  //Get form input
  q = $('#query').val();
  
  //Run GET Request   on API
  $.get(
    "https://www.googleapis.com/youtube/v3/search",{
      part: 'snippet, id',
      q: q,
      pageToken: token,
      type: 'video',
      key: rand}, 
      function(data) {
        var nextPageToken = data.nextPageToken;
        var prevPageToken = data.prevPageToken;
        var pageInfo = data.pageInfo;
        //Log data
        console.log(data);  
        
        $.each(data.items, function(i, item) {
            //Get output
            var output = getOutput(item);
            
            //Display results
            $('#results').append(output); 
        });
        
        var buttons = getButtons(prevPageToken,nextPageToken,pageInfo);
        
        //Display buttons
        $('#results').prepend(buttons);
        $('#btn-cnt').append(buttons);
      }
    );
      
}