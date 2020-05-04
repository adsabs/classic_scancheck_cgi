// File:          session.js
//
// Project:       ADS Historical Literature project 
//
// Description:   JavaScript code for main frame container of a session
//

  // Session MetaData ( from python script )

isloaded = 0;

%(jsdata)s

  // Data for roman number conversion
var renumber    = /([\d]+)/;
var nbplus      = /(\d*)(\D+)(\d+)/;
var reroman     = /([ivxlcdmIVXLCDM]*)/;

vrom = 'ivxlcdm';
drom = [1,5,10,50,100,500,1000];

roml = ['m','cm','d','cd','c','xc','l','xl','x','ix','v','iv','i'];
romn = [1000,900,500,400,100,90,50,40,10,9,5,4,1];

function loaded() {
   isloaded = 1;
}

function getcurrent() {
   // find currently displayed image number ( from thumbnail frame )
   return thumb.getimgno();
}

function getcurrentpage() {
   return getpagenumber(thumb.getimgno());
}

function gotoPage(pageno) {
   imgno = getimagenumber(pageno);
   thumb.goImage(imgno);
}

function gomark() {
   imgno = getlastmark();
   thumb.goImage(imgno);
}

function getlastmark() {
   for (i=0;i<pages.length;i++) {
       if (userpages[i]) { 
            last = i+1;
       }
   }
   return last;
}

function baseURL() {
   // utility function to get the root path of current document URL
   baseurl = document.URL.split('?')[0];
   lidx    = baseurl.lastIndexOf('/');
   baseurl = baseurl.substr(0,lidx+1);

   return baseurl;
}

function changeSession() {
   document.location = baseURL() + 'hLogin.py' + '?id=' + sessid; 
}

function getfilename(imgno) {
    return (files[imgno]);
}

function getthfilename(imgno) {
    return (thfiles[imgno]);
}

function fileChange(imageno,name,cpright) {

    filenames[imageno-1] = name;
    copyrights[imageno-1] = cpright;
    saveFileInfo( imageno, name, cpright )

//    last = getlastmark();//
//    paging.setlast(last);//
}

function pageChange(imageno,newpageno) {

   // 
   // page types: 
   //    1 - body
   //    I - insert
   //    P - plate
   //    F - front
   //    B - back
   //    other - ignore

   // fill up pages array

    ptype  = paging.gettype() 

    userpages[imageno-1] = newpageno;
    usertypes[imageno-1] = ptype;

    renumPages()

    savePage( imageno, newpageno, ptype ) 

    last = getlastmark();
    paging.setlast(last);
}

function saveFileInfo(name,cpr) {
    currentimg = getcurrent();
    sessid = 'FileNaming';
    alert(sessid);
    pars   = '?id='       + sessid             +
             '&command='  + 'saveFileInfo'      +
             '&filename='    + escape(name) +
             '&phase='   + '1'            +
             '&copyright='  + escape(cpr)

//    newurl = baseURL()+'saveInfo.py';
//    statusbar.location = newurl+pars;

}
function savePage(imgno, pageno, ptype) {
    pars   = '?id='      + sessid         +
             '&command=' + 'savePage'     + 
             '&imageno=' + escape(imgno)  + 
             '&pageno='  + escape(pageno) +
             '&phase='   + '1'            +
             '&pagetype='+ escape(ptype)

    newurl = baseURL()+'saveInfo.py';
    statusbar.location = newurl+pars;
}

function saveInfo(artno,start,end,author,title,abst,keyword,comments) {
    pars   = '?id='       + sessid          +
             '&db='       + db              + 
             '&command='  + 'saveInfo'      + 
             '&artno='    + artno           + 
             '&fpage='    + escape(start)   + 
             '&lpage='    + escape(end)     +
             '&authors='  + escape(author)  +
             '&title='    + escape(title)   +
             '&abstract=' + escape(abst)    +
             '&keyword='  + escape(keyword) +
             '&phase='    + '1'             +
             '&comment='  + escape(comments)

    newurl = baseURL()+'saveInfo.py';
    statusbar.location = newurl+pars;

    // contents.up2date()

}

function restoreInfo() {
    pars   = '?id='       + sessid          +
             '&db='       + db              + 
             '&command='  + 'restoreInfo'   + 
             '&phase='    + '1'

    newurl = baseURL()+'saveInfo.py'
    statusbar.location = newurl+pars;
}

function updatecontents() {
    contents.up2date()
}

function saveComment(comment) {
    currentimg = getcurrent();

    pars   = '?id='       + sessid             +
             '&command='  + 'saveComment'      + 
             '&image='    + escape(currentimg) + 
             '&phase='    + '1'             +
             '&comment='  + escape(comment)

    newurl = baseURL()+'saveInfo.py';
    statusbar.location = newurl+pars;

}

function showComment2() {
    currentimg = getcurrent();
                                                                                                                            
    pars   = '?id='       + sessid             +
             '&command='  + 'showComment'      +
             '&image='    + escape(currentimg) +
             '&phase='    + '2'
                                                                                                                            
    newurl = baseURL()+'showInfo.py';
    alert(newurl+pars);
}

function showComment() {
    currentimg = getcurrent();

    pars   = '?id='       + sessid             +
             '&command='  + 'showComment'      +
             '&image='    + escape(currentimg) +
             '&phase='    + '2'

    newurl = baseURL()+'showInfo.py';
    CommentsWindow = window.open(newurl+pars,"Comments","height=300,width=300,menubar=no,status=no,scrollbars=yes");
}

function delArticle(artno) {
    pars   = '?id='       + sessid       +
             '&db='       + db           +
             '&command='  + 'delArticle' + 
             '&phase='    + '1'          +
             '&artno='    + artno

    newurl = baseURL()+'saveInfo.py';
    statusbar.location = newurl+pars;

    contents.up2date();
}

function setArticle(artno,start,end,author,title,abst,keyword,comments) {
    paging.setArticle(artno,start,end,author,title,abst,keyword,comments);
}

function renumPages() {
    pagetype = '1'
    pageno   = 0;

    for (i=0;i<pages.length;i++) {
       if (userpages[i]) { 
            if (userpages[i] != 'IGNORE') {
               pageno   = userpages[i]; 
               pagetype = usertypes[i];
            }
       } else {
            pageno   = addOneToPage(pageno);
       }
       pages[i] = pageno;
       types[i] = pagetype;
    }

    // update page numbers
    thumb.update_pagenumbers();
}

function get_contents() {
   // returns contents --> authors, title and keywords
   //
   var ret = [authors,titles,keywords];
   return ret;
}

function getpagenumber(imageno) {
   // returns pagenumber for imageno
   return pages[imageno-1];
}

function getsource(imageno) {
   // returns source for imageno
   return sources[imageno-1];
}

function getpagetype (imageno) {
   return types[imageno-1];
}

function getimagenumber (pageno) {
   // returns imagenumber for pageno
   for (i=0;i<pages.length;i++) {
       if ( pages[i] == pageno ) { 
           return i+1;
       }
   }
   return 0;
}

function ignore(imgno, reason, comment) {

  if ( reason == 'dup' ) {
      comment = 'duplicated';
  }

  userpages[imgno-1] = 'IGNORE';
  usertypes[imgno-1] = comment;

  renumPages()

  savePage( imgno, 'IGNORE', comment );
}

function roman2int(rr) {
   // converts roman number to integer number
   rr = rr.toLowerCase();

   // i do not do any check. Ok. I should 

   ret = 0;
   val = drom[vrom.indexOf(rr.substr(0,1))];

   for (chr=1;chr<rr.length;chr++) {
        nextval = drom[vrom.indexOf(rr.substr(chr,1))];              
        if ( val < nextval ) {
            ret = ret - val;
        } else {
            ret = ret + val;
        }
        val = nextval;
   }
   ret = ret+val;
   return ret;
}

function int2roman(ii) {
   // converts int number to roman number
   ret = ""
   for ( j=0;j<romn.length;j++) {
      while (ii >= romn[j]) {
          ret = ret + roml[j]
          ii = ii - romn[j];
      }  
   }
   return ret;
}

function addOneToRoman(rr) {
   // increments roman number by one

   if ( rr != rr.toLowerCase())  {
     isupper = 1;
   } else {
     isupper = 0;
   }

   intval = roman2int(rr)+1;
   romval = int2roman(intval);
  
   if (isupper) {
      romval = romval.toUpperCase(romval);
   }

   return romval;
}

function addOneToPage(page_nb) {

   // increments page_nb. Considers three cases: pure number, roman number
   // and anything finishing with a number.

   page_nb = ''+page_nb;

   mat = page_nb.match(nbplus)
   if (mat != null && mat[0].length) {
       newnb = parseInt(mat[3]) + 1;
       return mat[1]+mat[2]+newnb;
   }

   mat = page_nb.match(renumber);
   if (mat != null && mat[0].length) {
       newnb = parseInt(page_nb) + 1;
       return ""+newnb;
   }

   mat = page_nb.match(reroman);
   if (mat != null && mat[0].length && mat[1] == page_nb) {
      return addOneToRoman(mat[1]);
   } 

   return page_nb;
}

function setpage(page) {
  if ( thumb.mode == 'pages' ) {
      paging.setpage(page);
  }
  if ( thumb.mode == 'xpages' ) {
      paging.setpage(page);
  }
}

function finishpages() {
  pars   = '?id='      + sessid   
  newurl = baseURL()+'hTransition.py';
  this.location = newurl+pars;
}

function endSession() {
  pars   = '?id='      + sessid  + 
           '&db='       + db
  newurl = baseURL()+'hEndSession.py';
  this.location = newurl+pars;
}

