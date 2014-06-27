// font dependent for measuing
// we have to make sure we wait for the webfont to be load before calculating
// or else everything is messed up.
$(window).load(function(){
  
  var clock = $('#clock') // get our clock
    , width = clock.width() // find the width
    , progress = $('.progress')
    , last_update = null;

  // this is dumb. css justify does not work on single lines.
  // this manually justifies by measuring neighbor elements and resizing
  clock.find('span.middle').each(function(){
    var el = $(this);
    el.width(width - (el.prev().width() + el.next().width()));
  });

  clock.removeClass('hide'); // show clock now that we have fixed the positioning
  
  updateClock(); // update the clock face.
  
  setInterval(updateClock, 100); // check time ever 1/10 of a second.... from now until forever.
  
  
  function updateClock(){
    // Get our bearings
    // deconcstruct the current time
    var ts = new Date() // current time
      , hour = ts.getHours() // hour 0-23
      , min = ts.getMinutes() // minutes 0-59
      , sec = ts.getSeconds() // seconds 0-59
      , milli = ts.getMilliseconds() // milliseconds 0-999
      
      , interval = 300000 // 5 minutes
      , midpoint = interval / 2 // half way 2.5 minutes
      , total_millis = ((min * 60) + sec) * 1000 + milli // convert the current minute offset to milliseconds
      , remainder = midpoint - (total_millis % midpoint) // find our remainder relative to the midpoint
      , offset = total_millis % interval // offset based on 5 mins
      , diff = 100 / midpoint * remainder; // percentage of the remainder relative to the midpoint (used for moving progress bar)
      
      
    remainder = (offset > midpoint) ? midpoint + remainder: remainder; // if we are past midpoint we need to add time for next update. else just use.
    
    // if offset is greater then midpoint we want a negative else subtract from 100 (percentages)
    // range = -100% to 100%
    diff = (offset > midpoint) ? 0 - diff : 100 - diff;
    //console.log(diff)
    progress.css({left: diff+'%'}); // update progress bar with new offset position
    
    // Update The clock face
    var past = true; // this is used to know if we are closer to the current hour
    
    // Recycling variable from above
    // coverting minutes to a decimal for seconds & milliseconds
    min += sec / 60;
    min += milli / 60 / 1000;
    min = Math.round(min / 5) * 5; // rounding the minutes to the closes 5 minutes

    if(hour > 12) hour -= 12; // coverting military time to 12hr time
    if(!hour) hour = 12; // if zero we know it is 12;

    if(min > 30) { // closer to the next hour
      min = 60 - min; // relative to next hour
      hour = (hour == 12) ? 1: hour+1; // increment to the next hour handle special case for 12
      if(min) past = false; // indicate we are closer to the next hour
    }
    
    var serialize = [hour, min, past].join(); // serialize our current time offset
    if(serialize !== last_update){ // check to see if the clock has changed since last update
      last_update = serialize; // cache current for next check
      refresh(hour, min, past); // refresh clock face
    }

  }
  
  function refresh(hour, min, past){
    clock.find('span').removeClass('active');
    
    show('it');
    show('h'+hour);
    show('t'+min);
    
    if(min && past) show('past');
    if(min && !past) show('to')
    if(min % 15) show('minutes');
    
    show('oclock');

  }
  
  function show(selector){
    clock.find('span.'+selector).addClass('active');
  }

});
