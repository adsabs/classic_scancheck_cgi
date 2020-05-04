// File:         pagenumber.js
//
// Project:      ADS Historical Literature project
//
// Description:  JavaScript routines for page numbering frame
//

function test(value) {
    alert(value);
}

function getCurrent() {
   //  call on document load. sets page to current
   //
   last    = parent.getlastmark();
   setlast(last);

   current = parent.getcurrent();
   if (current != -1 ) {
       setpage(current);
   }
}

function loadImage() {
   // loads page. Triggered when changed in image field
   parent.thumb.loadImage(document.form1.imageno.value);
//   document.form1.imageno.focus();
}

function settype(imgno) {
   pagetype = parent.getpagetype(imgno);

   for ( ii =0; ii< document.form1.pagetype.length;ii++) {
       if (document.form1.pagetype[ii].value == pagetype) {
            document.form1.pagetype[ii].checked = true;
       } else {
            document.form1.pagetype[ii].checked = false;
       }
   }
}

function gettype() {
   ptype = '1'
   for ( ii =0; ii< document.form1.pagetype.length;ii++) {
       if (document.form1.pagetype[ii].checked) {
            ptype =  document.form1.pagetype[ii].value;
            break;
       }
   }
   return ptype
}

function pagechange() {

   // saves new page settings. Triggered when change occur in page number
   // form field

   imgno    = document.form1.imageno.value;
   pageno   = document.form1.pageno.value;

   parent.pageChange(imgno,pageno);
}

function setpage(value) {
   // sets image number and page number form fields
   imgno    = value;
   pageno   = parent.getpagenumber(value);

   document.form1.imageno.value  = imgno;
   document.form1.pageno.value   = pageno;

   settype(imgno);
}

function ignore() {
  imgno   = document.form1.imageno.value; 
  for ( ii =0; ii< document.form1.ignorereason.length;ii++) {
    if (document.form1.ignorereason[ii].checked) {
      reason  = document.form1.ignorereason[ii].value; 
      break;
    }
  }
  comment = document.form1.ignorecomment.value; 
  parent.ignore(imgno,reason,comment);
}

function savecomment() {
  comm  = document.form1.pagecomment.value; 
  parent.saveComment(comm);
}

function showcomment() {
  alert(parent.sessid);
}

function gomark() {
  parent.gomark();
}

function setlast(imgno) {
  document.form1.lastimg.value = imgno; 
}

function endnumbering() {
  parent.finishpages();
}
