/*
File: main.js
Author: Lean Junio
Date: Jan 2017
Purpose: Grab twitch data using AJAX from the twitch api provided

Logic:
1. Grab the necessary data from the JSON using the api
2. If successful, check for the account status
3. if online, take the game as well as the game stream 'status' (because the status is actually the video being streamed) and append it to the online list
4. If offline, only display '<channel> is offline'
5. Add a placeholder notification if the channel does not exist
*/

var accounts = ["GeoffStorbeck", "terakilobyte", "Habathcx", "RobotCaleb", "Comster404", "Brunofin", "thomasballinger", "noobs2ninjas", "Beohoff", "MedryBW", "FreeCodeCamp", "ESL_SC2"];
var notExisting_Accounts_Message = new Array(12); // Ending message for each array depending if it exists or not

$(document).ready(function() {

  for (var i = 0; i < accounts.length; i++) {
    check(i);
  }

  function check(i) {
    // Check if user exists (when channel does not exist, error happens)
    $.ajax({
      type: 'GET',
      dataType: 'JSON',
      async: false,
      url: 'https://api.twitch.tv/kraken/channels/' + accounts[i] + '?client_id=sm628vw65lx4t5kbefe5ggehyqtsam',
      success: function(exists) {
        notExisting_Accounts_Message[i] = ''; // Since the account exists, no status message needed
      },
      error: function(nonExisting) {
        notExisting_Accounts_Message[i] = ' - This channel does not exist';
      }
    });

    // Checks if the user is offline or online
    $.ajax({
      type: 'GET',
      dataType: 'JSON',
      url: 'https://api.twitch.tv/kraken/streams/' + accounts[i] + '?client_id=sm628vw65lx4t5kbefe5ggehyqtsam',
      success: function(data) {
        var streamName = data._links.self.replace("https://api.twitch.tv/kraken/streams/", "");
        var link = 'http://www.twitch.tv/' + streamName;
        var printLink = '<h6><a href="' + link + '">' + streamName + '</a>';

        if (data.stream === null) {           // If offline
          $("#tab-1, #tab-3").append(printLink + notExisting_Accounts_Message[i]).css('color', '#EDEDED');
        }
 
        else {        // If Online 
          var game = data.stream.channel.game;
          var status = data.stream.channel.status;
          var streamGame = ' - ' + game + ': ' + status + '</h6>';
          $("#tab-1, #tab-2").append(printLink + streamGame).css('color', '#EDEDED');
        }
      }
    });

    // Add classes to lists for optimization
    $('ul.tabs li').click(function() {
      var tab_id = $(this).attr('data-tab');
      $('ul.tabs li').removeClass('current');
      $('.tab-content').removeClass('current');
      $(this).addClass('current');
      $("#" + tab_id).addClass('current');
    })
  }

})