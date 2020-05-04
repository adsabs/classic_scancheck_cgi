// File:        thumbnail.js
//
// Project:     ADS Historical Literature project
//
// Description: JavaScript code for Thumbnail/Image frame on main session
//              window.

group      = "%(group)s";
journal    = "%(journal)s";
volume     = "%(volume)s";

imageno    = %(imageno)s;
startimage = %(startimage)s;
nimages    = %(nimages)s;
rows       = %(rows)s;
columns    = %(columns)s;

mode       = "%(mode)s";

imgscript  = 'nph-build_image';
imgscript  = 't2png'
//imgpath    = 'http://adsbit.harvard.edu/cgi-bin/'+imgscript;
imgpath    = 'http://articles.adsabs.harvard.edu/cgi-bin/'+imgscript;
//imgpath    = 'http://adsduo.cfa.harvard.edu/cgi-bin/'+imgscript;
//imgpath    = 'http://adsset.cfa.harvard.edu/scans/cgi-bin/'+imgscript;
var bckgs  = new Object();

bckgs['1'] = 'black';
bckgs['F'] = '#000099';
bckgs['B'] = '#000099';
bckgs['P'] = '#009900';
bckgs['I'] = '#990000';

endimage   = startimage + rows * columns - 1;

if (endimage > nimages) {
  endimage = nimages;
}

function getimgno() {
   // returns currently displayed imageno in single image mode or
   // first image number if in thumbnail mode
   if ( imageno == -1 ) {
       return startimage;
   } else { 
       return imageno;
   }
}

function update_pagenumbers() {
   // update all page numbers
   // call after a page number change
   if (imageno == -1 ) {
     for (imgno = startimage; imgno < endimage+1;imgno++) {
        eval('document.f1.pageimg'+imgno+'.value=parent.getpagenumber('+imgno+')');
     }
   } 
}

function goNext() {
   // Navigation command. Goes to next image ( in single image mode ) or
   // next thumbnail page ( if in thumbnail mode ) 
    start_next = startimage + rows * columns;

    if ( imageno == -1 ) {
       if ( start_next > nimages ) {
          return;
       } 

       nexturl  = document.URL.replace(/startimage=\d*/,'startimage='+start_next);
    } else {
       if (imageno == nimages) {
         return;
       }
       nexturl  = document.URL.replace(/imageno=\-?\d*/,'imageno='+eval(imageno+1));
    }
    location.replace(nexturl);
}

function goPrev() {
   // Navigation command. Goes to previous image ( in single image mode ) or
   // previous thumbnail page ( if in thumbnail mode ) 
   
    if ( imageno == -1 ) {
        if ( startimage == 1) {
            return;
        }
        start_prev = startimage - rows * columns;

        if ( start_prev < 1 ) {
            start_prev = 1;
        } 
        prevurl  = document.URL.replace(/startimage=\d*/,'startimage='+start_prev);
    } else {
        prevurl  = document.URL.replace(/imageno=\-?\d*/,'imageno='+eval(imageno-1));
    }
        
    location.replace(prevurl);
}

function goContents() {
   // Navigation command. Shows thumbnail window. This command only 
   // available in single image mode.

    if (imageno == -1) {
        return;
    }

    startimg  = imageno;
    thumbsurl = document.URL.replace(/imageno=\d*/,'imageno=-1');
    thumbsurl = thumbsurl.replace(/startimage=\d*/,'startimage='+startimg);
    location.replace(thumbsurl);
}

function goFirst() {
   // Navigation command. Goes to first image or first thumbnail page
   // depending on mode

    if (imageno == -1) {
       lasturl  = document.URL.replace(/startimage=\d*/,'startimage='+1);
    } else {
       lasturl  = document.URL.replace(/imageno=\-?\d*/,'imageno='+1);
    }
    location.replace(lasturl);
}

function goLast() {
   // Navigation command. Goes to last image or last thumbnail page
   // depending on mode

    if (imageno == -1) {
       start_last = nimages - rows * columns + 1; 
       if (start_last < 1 ) {
           return;
       }

       lasturl  = document.URL.replace(/startimage=\d*/,'startimage='+start_last);
    } else {
       lasturl  = document.URL.replace(/imageno=\-?\d*/,'imageno='+nimages);
    }
    location.replace(lasturl);
}

// DOCUMENT WRITE
//  ( does not fit in template model )

function navigation() {
    // Writes down navigation links

    if (imageno == -1) {
       if ( startimage == 1 ) {
            prevlink = "&nbsp;";
       } else {
            prevlink = "<A HREF=javascript:goPrev();>&lt;Prev</A>"; 
       }
        
       start_next = startimage + rows * columns;
    } else {
       if ( imageno == 1 ) {
            prevlink = "&nbsp;";
       } else {
            prevlink = "<A HREF=javascript:goPrev();>&lt;Prev</A>"; 
       }
       imgurl  = document.URL;
       ocrurl = imgurl.replace("hThumbnails","hOCR_scans")
       ocrurl8= ocrurl + "&addpages=8"
       start_next = startimage + 1;
    }

    if ( start_next > nimages ) {
        nextlink = "&nbsp;";
    } else {
        nextlink = "<A HREF=javascript:goNext();>Next&gt;</A>"; 
    }

    firstlink = "<A HREF=javascript:goFirst();>First</A>"; 
    lastlink  = "<A HREF=javascript:goLast();>Last</A>"; 

    document.write("<TABLE WIDTH=100%%><TR><TD>\n");
    document.write("<FORM ACTION='#' NAME=f3>\n");
		document.write("<TABLE>\n");

    // journal volume
    document.write("<TR><TD>\nJournal:</TD>\n");
    document.write("<TD BGCOLOR=\"#ececdd\"><B><FONT COLOR=navy>");
    document.write(journal+"</B></FONT>");
    document.write("</TD><TD>\nVolume:\n");
    document.write("</TD><TD BGCOLOR=\"#ececdd\"><B><FONT COLOR=navy>");
    document.write(volume+"</B></FONT>\n");
    document.write("</TD></TR>\n");

    // image number
    if ( mode == 'pages' ) {
       document.write("<TR><TD>\nCurrent Image:</TD>\n");
       document.write("<TD BGCOLOR=\"#ececdd\" COLSPAN=3><B><FONT COLOR=navy>");
       if (imageno == -1) {
          document.write(startimage + "-" + endimage + " / " + nimages); 
       } else {
          document.write(imageno +  " / " + nimages); 
       }
       document.write("</B></FONT>");
       document.write("</TD></TR>\n");
    } else { 
       if ( imageno != -1 ) {
          pageno = parent.getpagenumber(imageno);
       } else { 
          pageno = parent.getpagenumber(startimage);
       }
       document.write("<TR><TD VALIGN=top>Current Page:</TD>\n");
       document.write("<TD VALIGN=top BGCOLOR=\"#ececdd\" COLSPAN=3>\n");
       document.write("<B><FONT COLOR=navy>&nbsp;&nbsp;\n");
       document.write(pageno +  " (" + nimages + ")"); 
       document.write("</TD></TR>\n");
    }


    // navigation bar
    if ( imageno == -1 ) {
       document.write("<TR><TD>&nbsp;</TD>\n");
    } else {
       document.write("<TR><TD>&nbsp;</TD>\n");
       document.write("<TR><TD><A HREF=javascript:goContents();>Thumbnails</A></TD>\n");
//			 if (journal == 'MNRAS')
//			   document.write("<TR><TD><A HREF="+ocrurl+" TARGET=_new>OCR Text</A></TD>\n"); //
       document.write("<TR><TD><A HREF=\"#foo\" onClick=\"window.open(ocrurl,'ocrWindow','WIDTH=640,HEIGHT=480,scrollbars');\">OCR Text</A></TD>\n");
       document.write("<TR><TD><A HREF=\"#foo\" onClick=\"window.open(ocrurl8,'ocrWindow','WIDTH=640,HEIGHT=480,scrollbars');\">OCR Text (+8)</A></TD>\n");
    }
    document.write("</TD><TD>"+prevlink+"\n</TD>");
    document.write("</TD><TD> | "+nextlink+"\n</TD>");
    document.write("</TD><TD> [ "+firstlink+" | "+lastlink+" ] \n</TD>");
    document.write("</TD><TD>&nbsp;</TD>\n");
    document.write("</TR></TABLE></FORM>\n");
    document.write("</TD>");
    document.write("<TD ALIGN=right VALIGN=top>");
    
    document.write("<TABLE WIDTH=100%%>");
    document.write("<TR>");
    document.write("</TR><TR>");
    document.write("</TR>");
    document.write("</TABLE>");

    document.write("</TD></TR></TABLE>");

    
}

function footer() {
    // Writes down navigation links

    if (imageno == -1) {
       if ( startimage == 1 ) {
            prevlink = "&nbsp;";
       } else {
            prevlink = "<A HREF=javascript:goPrev();>&lt;Prev</A>"; 
       }
        
       start_next = startimage + rows * columns;
    } else {
       if ( imageno == 1 ) {
            prevlink = "&nbsp;";
       } else {
            prevlink = "<A HREF=javascript:goPrev();>&lt;Prev</A>"; 
       }
       start_next = startimage + 1;
    }


    if ( start_next > nimages ) {
        nextlink = "&nbsp;";
    } else {
        nextlink = "<A HREF=javascript:goNext();>Next&gt;</A>"; 
    }

    document.write("<DIV ALIGN=right><TABLE>\n");

    // navigation bar
    if ( imageno == -1 ) {
       document.write("");
    } else {
       document.write("<TR><TD><A HREF=javascript:goContents();>Thumbnails</A></TD>\n");
    }
    document.write("<TD>"+prevlink+"\n</TD>");
    document.write("<TD> | "+nextlink+"\n</TD>");
    document.write("<TD>&nbsp;</TD>\n");
    document.write("</TR></TABLE></DIV>\n");

}

function showOneThumbnail(imgno) {
   //  Writes down HTML code for one thumbnail image.
   //

   filename = parent.getfilename(imgno-1);
   pageno   = parent.getpagenumber(imgno);
   source   = parent.getsource(imgno);
   pagetype = parent.getpagetype(imgno);
   filepath='/'+group+'/'+journal+'/'+volume+'/200/'+filename;

   imgkwds = 'bg=%%23ffffff&db_key=AST&bits=3&scale=8' ;
   imgcgi  = imgpath+'?'+imgkwds+'&'+filepath;
 
   bckg = bckgs[pagetype];

   document.write("<a href=\"javascript:loadImage("+imgno+");\"><img src=\""+imgcgi+"\" width=\"140\" border=\"1\"></a>");
   document.write("<br><center>");
   if ( mode == "pages" ) {
      document.write("<font color=\""+bckg+"\" size=\"-1\">Img:&nbsp;"+imgno+"</font>&nbsp;Page: ");
      document.write("<input type=\"text\" size=\"10\" value="+pageno); 
      document.write(" name=pageimg"+imgno+" onChange=\"parent.pageChange("+imgno+",document.f1.pageimg"+imgno+".value,'page');\" ></font>");
   } else {
      document.write("<font color=\""+bckg+"\">Img:&nbsp;"+imgno+"</font>&nbsp;");
      if ( source ) {
      document.write("<br><font color=\""+bckg+"\" size=-1>Source CD: "+source+"</font>&nbsp;");
      }
   }
   document.write("</center>");
}

function jumpImage() {
   // loads page. Triggered when changed in image field
   alert(document.form1.imageno.value);
   parent.thumb.loadImage(document.form1.imageno.value);
   document.form1.imageno.focus();
}

function loadImage(imgn) {
   //  Loads one image in frame
   //

    if (imgn > nimages || imgn < 1) {
       return;
    }
    imgurl  = document.URL.replace(/imageno=\-?\d*/,'imageno='+imgn);
    location.replace(imgurl);
		ocrurl = imgurl.replace("hThumbnails","hOCR_scans")
}

function goImage(imgn) {
    if (imgn > nimages || imgn < 1) {
       return;
    }

    if (imageno == -1) {
       gourl  = document.URL.replace(/startimage=\d*/,'startimage='+imgn);
    } else {
       gourl  = document.URL.replace(/imageno=\-?\d*/,'imageno='+imgn);
    }
    location.replace(gourl);
}

function buildImage() {
   //  Writes down HTML in single image mode
   //

   filename=parent.getfilename(imageno-1);
   filepath='/'+group+'/'+journal+'/'+volume+'/200/'+filename;

   imgkwds = escape('bg=#ffffff&db_key=257&bits=3&res=100');
   imgcgi  = imgpath+'?'+imgkwds+'&'+filepath;
  
   pagetype    = parent.getpagetype(imageno);

   parent.setpage(imageno);
   bckg = bckgs[pagetype];
   imgstr = "<table cellpadding=\"1\" cellspacing=\"0\"><tr><td bgcolor=\""+bckg+"\">"
   imgstr = imgstr + "<img src=\""+imgcgi+"\">";
   imgstr = imgstr + "</td></tr></table>";
   document.write(imgstr);
}

function buildThumbs() {
   //  Writes down HTML for a thumbnail mode window
   //

    document.write("<form name=\"f1\"><table>\n");
    for (row=0;row<rows;row++) {
       document.write("<tr>\n");
       for (column=0;column<columns;column++) {
         document.write("<td align=center>\n");
         imgno = startimage + column + row * columns 
	 if (imgno > nimages) break;
	 showOneThumbnail(imgno);
         document.write("</td>\n");
       }
       document.write("</tr>\n");
    }
    document.write("</table></form>\n");
    parent.setpage(startimage);
}

function loadMe() {
    // Builds HTML code for thumbnail window.
    // template model does not fit in this case. All document
    // is created by the JavaScript code

    navigation();

    journal = escape(journal).replace('+','%%2B');
    if (imageno == -1) {
       buildThumbs(); 
    } else {
       buildImage();
    }

    footer();

    document.write("</body></html>");
}
