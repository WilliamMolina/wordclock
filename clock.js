// must use 'onload' to make sure webfonts are ready.
$(window).load(function(){
  
  var clock = $('#clock') // get our clock
    , width = clock.width() // find the width
    , progress = $('.progress') // process bar
    , interval = 300000 // 5 minutes 
    , midpoint = interval / 2 // half way 2.5 minutes
    , last_update = null; // we only want to refresh when we need to
    
  // this manually justifies by measuring neighbor elements and resizing
  clock.find('span.middle').each(function(){
    var el = $(this);
    el.width(width - (el.prev().width() + el.next().width() + 1));
  });

  clock.removeClass('hide'); // show clock now that we have fixed the positioning
  
  updateClock(); // update the clock face.
  
  setInterval(updateClock, 100); // check time ever 1/10 of a second.... from now until forever.
  
  
  // Functions Below
  
  
  function updateClock(){
    var ts = new Date() // current time
      , remainder = midpoint - (minutesMilli(ts) % midpoint) // find our remainder relative to the midpoint
      , offset = minutesMilli(ts) % interval // offset based on 5 mins
      , diff = 100 / midpoint * remainder; // percentage of the remainder relative to the midpoint (used for moving progress bar)
      
    diff = (offset > midpoint) ? 0 - diff : 100 - diff; // range = -100% to 100%

    progress.css({left: diff+'%'}); // update progress bar with new offset position
    
    check(simpleTime(ts));
  }
  
  function simpleTime(ts){
    var past = true // this is used to know if we are closer to the current hour
      , hour = ts.getHours()
      , min = decimalMinute(ts);

    min = Math.round(min / 5) * 5; // rounding the minutes to the closes 5 minutes

    if(hour > 12) hour -= 12; // coverting military time to 12hr time
    if(!hour) hour = 12; // if zero we know it is 12;

    if(min > 30) { // closer to the next hour
      min = 60 - min; // relative to next hour
      hour = (hour == 12) ? 1: hour+1; // increment to the next hour handle special case for 12
      if(min) past = false; // indicate we are closer to the next hour
    }
    
    return [hour, min, past];
  }
  
  function check(time){
    if(time.join() == last_update) return;
    last_update = time.join();
    refresh.apply(null, time);
  }
  
  function refresh(hour, min, past){
    
    clock.find('span').removeClass('active'); // clear all
    
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
  
  // converts the minutes of a `Date` instance to milliseconds
  function minutesMilli(ts){
    return ((ts.getMinutes() * 60) + ts.getSeconds()) * 1000 + ts.getMilliseconds();
  }
  
  // converts the minutes of a `Date` instance to a decimal minute
  function decimalMinute(ts){
    return ts.getMinutes() + (ts.getSeconds() / 60) + (ts.getMilliseconds() / 60 / 1000);
  }

});
