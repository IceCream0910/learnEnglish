function getParam(sname) {

    var params = location.search.substr(location.search.indexOf("?") + 1);

    var sval = "";

    params = params.split("&");

    for (var i = 0; i < params.length; i++) {

        temp = params[i].split("=");

        if ([temp[0]] == sname) { sval = temp[1]; }

    }

    return sval;

}

$(function() {
    function setAspectRatio() {
      $('iframe').each(function() {
        $(this).css('height', $(this).width() * 9/16);
      });
    }

    setAspectRatio();   
    $(window).resize(setAspectRatio);

    document.getElementById('player').src = "https://www.youtube.com/embed/"+getParam("id")+"?enablejsapi=1&cc_load_policy=3&modestbranding=0&autohide=1&autoplay=0&controls=0&rel=0&amp;fs=0&amp;showinfo=0";
});

$.ajax({
  type: "GET",
  url: "https://video.google.com/timedtext?type=track&v="+getParam("id")+"&id=0&lang=en",
  crossDomain: true,
}).done(function(data) {
  getCaption(data);
});

var parser, xmlDoc;
var HTML_captions = "";

// Parse the AJAX response and get the captions.
function getCaption(ajax_response) {
  try {

    parser = new DOMParser();
    xmlDoc = parser.parseFromString(ajax_response, "text/xml");
    //console.log(ajax_response);
    //console.log(xmlDoc.getElementsByTagName("transcript").length);

    if (xmlDoc.getElementsByTagName("transcript").length > 0) {
      // Loop the results of the xmlDoc:
      for (var i = 0; i < xmlDoc.getElementsByTagName("transcript")[0].childNodes.length; i++) {
        var startTime = ajax_response.getElementsByTagName("transcript")[0].childNodes[i].getAttribute('start');
        var endTime = parseFloat(startTime)+parseFloat(ajax_response.getElementsByTagName("transcript")[0].childNodes[i].getAttribute('dur'));
       HTML_captions += '<div class="youtube-transcript-card"><p><span class="youtube-marker" data-start="'+startTime+'" data-end="'+endTime+'">'+unescape(ajax_response.getElementsByTagName("transcript")[0].childNodes[i].innerHTML) +"<br>"+ "</span></p></div>";
      }
    } else {
      // Loop the results of the ajax_response;
      for (var i = 0; i < ajax_response.getElementsByTagName("transcript")[0].childNodes.length; i++) {
        var startTime = ajax_response.getElementsByTagName("transcript")[0].childNodes[i].getAttribute('start');
        var endTime = parseFloat(startTime)+parseFloat(ajax_response.getElementsByTagName("transcript")[0].childNodes[i].getAttribute('dur'));
        
        HTML_captions += '<div class="youtube-transcript-card"><p><span class="youtube-marker" data-start="'+startTime+'" data-end="'+endTime+'">'+unescape(ajax_response.getElementsByTagName("transcript")[0].childNodes[i].innerHTML) +"<br>"+ "</span></p></div>";
        
        
      }
    }

    document.getElementById("demo").innerHTML = "<i>Preparing captions...</i>";
    setTimeout(fillData(), 2000);

  } catch (err) {
    console.log(err);
    document.getElementById("demo").innerHTML = '<span style="margin-left:25%;">자막을 찾지 못했어요.</span><br><img src="https://m.xcite.com/media/wysiwyg/404_page/404-bg-small.gif" style="width:100%;">';
  }
}


// Fill the data "captions" in a HTML "div" control.
function fillData() {
  try {
    document.getElementById("demo").innerHTML = '<div id="youtube-transcript-#1" class="youtube-transcript">'+HTML_captions+'</div>';
  } catch (err) {
    console.log(err);
    document.getElementById("demo").innerHTML = ('오류가 발생했어요.');
    alert('오류가 발생했어요.');
  }

}




// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
          videoId: getParam("id"),
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}

var played = "play";
function onPlayerStateChange(event) {
  var Update;
  if (event.data == YT.PlayerState.PLAYING) { //재생중
    played = "play";
    $("#toggle").prop("checked", true);
    Update = setInterval(function() {
      UpdateMarkers()
    }, 100);
  }
  else { //정지
    played = "pause";
    $("#toggle").prop("checked", false);
    clearInterval(Update);
  }
}

// Sample Markers on Page
var MarkersInit = function(markers) {
  var elements = document.querySelectorAll('.youtube-marker');
  Array.prototype.forEach.call(elements, function(el, i) {
    var time_start = el.dataset.start;
    var time_end = el.dataset.end;
    var id = el.dataset.id;;
    if (id >= 1) {
      id = id - 1;
    } else {
      id = 0;
    }
    marker = {};
    marker.time_start = time_start;
    marker.time_end = time_end;
    marker.dom = el;
    if (typeof(markers[id]) === 'undefined') {
      markers[id] = [];
    }
    markers[id].push(marker);
  });
}

// On Ready
var markers = [];

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {

    // Init Markers
    MarkersInit(markers);

    // Register On Click Event Handler
    var elements = document.querySelectorAll('.youtube-marker');
    Array.prototype.forEach.call(elements, function(el, i) {
      el.onclick = function() {
        // Get Data Attribute
        var pos = el.dataset.start;
        // Seek
        player.seekTo(pos);
      }
    });
    
    

  } // Document Complete
}; // Document Ready State Change

function UpdateMarkers() {
  var current_time = player.getCurrentTime();
  var j = 0; // NOTE: to extend for several players
  markers[j].forEach(function(marker, i) {

    if (current_time >= marker.time_start && current_time < marker.time_end) {
      marker.dom.classList.add("youtube-marker-current");
      var c=document.getElementById('fallowCaption');
      if(c.checked) {
        var objDiv = document.getElementById("demo");
        var objEle = document.querySelector(".youtube-marker-current");
        objDiv.scroll({
  top: objEle.offsetTop-280,
  behavior: 'smooth'
});

      }
      
    } else {
      marker.dom.classList.remove("youtube-marker-current");
    }
  });
}

function playPause() {
  if(played == "play"){
    player.pauseVideo();
  } else {
    player.playVideo();
  }
}

function unescape(string) {
  return new DOMParser().parseFromString(string,'text/html').querySelector('html').textContent;
}