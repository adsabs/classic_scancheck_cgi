
phase = %(phase)s;

function nextphase() {
   if ( phase == '2' ) {
      nexturl  = document.URL.replace(/phase=\d*/,'phase='+phase);
      location.replace(nexturl);
   }
   if ( phase == '3' ) {
      parent.updatecontents()
   }
}

