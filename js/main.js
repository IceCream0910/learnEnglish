
$( document ).ready(function() {
    search1();
    e.preventDefault();
});
    
    
function search1() {
  var myArray = ['AIzaSyBM-j14MHRgeS7Sviove7laYV4pfY2zvO8', 'AIzaSyCRVbzOOPDS7zfXkz3hRcQ-wPT557m6yvI'];
//'AIzaSyAEcxLMHrlz_Kkd2pPIMVd6kow01FFBE8E', 
var rand = myArray[Math.floor(Math.random() * myArray.length)];
  
  //Run GET Request   on API
  $.get(
    "https://www.googleapis.com/youtube/v3/search",{
      part: 'snippet, id',
      q: 'ted ed',
      type: 'video',
      maxResults: 30,
      key: rand }, 
      function(data) {
        
        //Log data
        console.log(data);  
        
        $.each(data.items, function(i, item) {
            //Get output
            var output = getOutput(item);
            
            //Display results
            $('#results').append(output); 
        });
        
        
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
    var output = '<div class="row" style="display:inline-block;">' + 
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