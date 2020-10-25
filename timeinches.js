var onlyMiles;
var miUnits = false;
var fullWidth = true;

window.onload = function(){
  document.getElementById("scrollButton").style.visibility = "hidden";
  setTimeout( () => { document.getElementById("scrollButton").style.visibility = "visible"; } , 1000);
  changeSize();
  document.getElementById("BODY").style.height = document.getElementById("bgImg").height + "px";
  document.documentElement.scrollTop = 0;
  let currentTime = moment();
  let timeControl = document.getElementById("startTime");
  timeControl.value = moment(currentTime).format("HH:mm");
  let dateControl = document.getElementById("startDate");
  dateControl.value = moment(currentTime).format("YYYY-MM-DD");
  let maxDate = currentTime.clone();
  let minDate = currentTime.clone();
  document.getElementById("startDate").max = maxDate.add((( 13.4 * 5280 * 12 ) / 24 ), "days").format("YYYY-MM-DD");
  document.getElementById("startDate").min = minDate.subtract((( 13.4 * 5280 * 12 ) / 24 ), "days").format("YYYY-MM-DD");
  calculate();
}

function changeSize() {
  document.getElementById("BODY").style.height = document.getElementById("bgImg").height + "px";
  calculate();
  let windowRatio = window.innerHeight / window.innerWidth;
  let thing = document.getElementById("deathImg");
  if ( windowRatio < 1 ) {
    thing.src = "Angel-Of-Death_FULL.jpg";
  } else {
    thing.src = "Angel-Of-Death_4x3.jpg";
  }
  setTimeout( () => { resizeDeathOverlay(); } , 250);
}

function resizeDeathOverlay() {
  let things = document.getElementById("deathImg");
  if (fullWidth) {
    if ( things.height < window.innerHeight ) {
      things.style.width = "auto";
      things.style.height = "100vh";
      fullWidth = false;
    }
  } else {
    if ( things.width < window.innerWidth ) {
      things.style.width = "100vw";
      things.style.height = "auto";
      fullWidth = true;
    }
  }
}

function hideScrollButton() {
  let scrollButton = document.getElementById("scrollButton");
  scrollButton.classList.remove("show");
  scrollButton.classList.add("hide");
}

function showScrollButton() {
  let scrollButton = document.getElementById("scrollButton");
  scrollButton.classList.remove("hide");
  scrollButton.classList.add("show");
}

function scrollPage() {
  let percent = Math.round(( onlyMiles / 13.4 ) * document.documentElement.scrollHeight - window.innerHeight / 2);
  window.scrollTo( 0, percent );
}

function scrollButtonVisible() {
    let scrollButton = document.getElementById("scrollButton");
    let percentScrolled = ( onlyMiles / 13.4 ) * document.documentElement.scrollHeight;
    if ((( this.scrollY >= percentScrolled ) || ( percentScrolled >= ( this.scrollY + window.innerHeight ))) && ( percentScrolled > 0 )) {
      document.getElementById("hiddenTimeInches").style.visibility = "visible";
    } else {
      document.getElementById("hiddenTimeInches").style.visibility = "hidden";
    }
    if ( percentScrolled === 0 ) {
      hideScrollButton();
    } else if (( percentScrolled === ( this.scrollY + window.innerHeight )) && ( onlyMiles === 13.4)) {
      //this hides the scroll button at the bottom of the page
      hideScrollButton();
    } else if (( this.scrollY >= percentScrolled ) || ( percentScrolled >= ( this.scrollY + window.innerHeight ))) {
      //this is if percentScrolled is above or below the viewport
      showScrollButton();
    } else if (( this.scrollY >= ( document.documentElement.scrollHeight - ( 1.1 * window.innerHeight ))) && !( percentScrolled < ( 0.9 * document.documentElement.scrollHeight ))) {
      //behavior at the bottom
      hideScrollButton();
    } else if (( this.scrollY > window.innerHeight )
    && ( percentScrolled > window.innerHeight )
    && !((( percentScrolled - this.scrollY ) <= ( 0.9 * window.innerHeight ))
    && (( percentScrolled - this.scrollY ) >= ( 0.1 * window.innerHeight )))) {
      //checks if the percent scrolled is in the middle 80% of the window
      showScrollButton();
    } else {
      hideScrollButton();
    }
}

function retrieveDateTime() {
    return moment(document.getElementById("startDate").value + ' ' + document.getElementById("startTime").value);
}

function manhattanPercentage() {
    if ( onlyMiles > 13.4 ) {
        onlyMiles = 13.4;
    }
    let overlay = document.getElementById("overlay");
    let miniOverlay = document.getElementById("miniOverlay");
    let setValue = "0 0 1467.8105 " + ( onlyMiles / 13.4 ) * 5957.7212;
    overlay.setAttribute("viewBox", setValue);
    miniOverlay.setAttribute("viewBox", setValue);
}

function moveDattedLine() {
    let percent = ( onlyMiles / 13.4 ) * document.getElementById("bgImg").height
    let offsetWords = document.getElementById("timeInches").clientHeight;
    let offsetLine = 4;
    let wordPosition = (( percent - offsetWords ) <= 0 ) ? offsetWords : ( percent - offsetWords );
    if ( wordPosition >= ( document.getElementById("bgImg").height - offsetWords )) {
      wordPosition = document.getElementById("bgImg").height - ( 2 * offsetWords );
    }
    document.getElementById("timeInches").style.top = wordPosition + "px";
    document.getElementById("timeInches").style.marginLeft = ( 40 * ( onlyMiles / 13.4 )) + 10 + "vw";
    document.getElementById("dottedLine").style.top = (( percent + offsetLine > document.getElementById("bgImg").height ) ? ( document.getElementById("bgImg").height - offsetLine ) : percent ) + "px";
}

function calculate() {
    let currentTime = moment();
    let hours = moment.duration(currentTime.diff(retrieveDateTime())).asHours();
    let negative = "";
    let output;
    if ( isNaN(hours) ) {
        document.getElementById("timeInches").innerHTML = "[input invalid]";
        document.getElementById("hiddenTimeInches").innerHTML = "[input invalid]";
    } else {
        if ( Math.sign(hours) === -1 ) {
            hours = hours * (-1);
            negative = "-";
        }
        let years = parseFloat((( hours / 24 ) / 365 ).toFixed(3));
        onlyMiles = parseFloat((hours / ( 5280 * 12 )).toFixed(4));
        if ( onlyMiles > 13.4 ) {
          onlyMiles = 13.4;
        }
        let inches = hours % 12;
        let feet = (( hours - inches ) / 12) % 5280;
        let miles = (( hours - inches ) / 12 - feet ) / 5280;
        inches = Math.round( inches * 10 ) / 10;
        if ( inches === 12 ) {
            feet += 1;
            inches = 0;
        }
        if ( feet === 5280 ) {
            miles += 1;
            feet = 0;
        }
        if (( negative === "-" ) && (( miles + feet + inches ) < 0.1 )) {
            negative = "";
        }
        if ( miles > 0 ) {
            miUnits = true;
        } else {
            miUnits = false;
        }
        if ( miUnits ) {
            output = onlyMiles + "mi";
        } else {
          if (miles > 0) {
              output = miles + "mi " + feet + "ft " + inches + "in";
          } else {
              if (feet > 0) {
                  output = feet + "ft " + inches + "in";
              } else {
                  output = inches + "in";
              }
          }
        }
        if (( miles + feet + inches ) >= 0.1 ) {
          document.getElementById("timeInches").innerHTML = negative + output + " | " + negative + years + "yrs";
          document.getElementById("hiddenTimeInches").innerHTML = negative + output + " | " + negative + years + "yrs";
        } else {
          document.getElementById("timeInches").innerHTML = "";
          document.getElementById("hiddenTimeInches").innerHTML = "";
        }
        moveDattedLine();
        manhattanPercentage();
        scrollButtonVisible();
        if ( onlyMiles === 13.4 ) {
          document.getElementById("deathOverlay").style.visibility =  "visible";

        } else {
          document.getElementById("deathOverlay").style.visibility =  "hidden";
        }
    }
}
