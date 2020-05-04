// File:          select.js
//
// Project:       ADS Historical Literature project
//
// Description:   JavaScript code for journal selection

function baseURL() {
   // utility function to find root path of current document address
   //
   baseurl = document.URL.split('?')[0];
   lidx    = baseurl.lastIndexOf('/');
   baseurl = baseurl.substr(0,lidx+1);

   return baseurl;
}

function createsession() {
   // creates a new session
   //
   user      = document.optform.user.value;
   group     = document.optform.group.value;
   journal   = document.optform.journal.value;
   volume    = document.optform.volume.value;
   rows      = document.optform.rows.value;
   columns   = document.optform.columns.value;

   newadds   = document.URL.split('?')[0]; 
   newadds   = newadds.replace('hSelectJournal.py','hNewSession.py')
   newadds   = newadds + "?user="+user+
                       "&group="+ group + 
                       "&journal=" + journal.replace('+','%%2B') + 
		       "&volume="  + volume + 
		       "&rows="    + rows + 
		       "&columns=" + columns; 

   document.location = newadds;
}

function closeSession(sessid) {
   // Ends a session. Call the hCloseSession that will mark it as
   // completed.
   newadds   = baseURL();
   newadds   = newadds + "hCloseSession.py?id=" + sessid;
   document.location = newadds;
}
