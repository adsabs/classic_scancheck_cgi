#!/usr/bin/env python

from UserDict import UserDict

import urllib, os,cgi,sys,os.path

def_script_dir   = 'scripts/'
def_template_dir = 'templates/'

#
# Public function to get form fields into a local dictionary
#
def read_webform(): 
    """Returns a dictionary with values in form"""
    form = cgi.FieldStorage()
   
    dict = {}
    for key in form.keys():
         dict[key] = urllib.unquote( form[key].value )

    return dict

#
# Generic web page class
#
#   it takes care of default directories
#   template loading and checking
#
class WebPage(UserDict): 
    def __init__(self,template=None,title="",**kw):
       UserDict.__init__(self) 
       self.data['title'] = title
       self.data.update(kw)
       self.contents = ""
       self.template = template

       if not self.has_key('script_dir'):
            self['script_dir'] = def_script_dir

       if not self.has_key('template_dir'):
            self['template_dir'] = def_template_dir

       if template:
           templatefile = os.path.join(self['template_dir'],template)

           if os.access(templatefile,os.R_OK) and os.path.isfile(templatefile):
                templ_data = open(templatefile).read()
           else:
                templ_data = "No template for " + str(self.__class__)

           self['contents'] = templ_data
       elif kw.has_key('contents'):
           self['contents'] = kw['contents']
       else:
           self['contents'] = "<BODY>empty page</BODY>"

    def startpage(self): 
       startst = """Content-type: text/html
Cache-Control: private

<HTML>
<HEAD>
  <TITLE>
     %(title)s
  </TITLE>
""" 
       if self.has_key('script'):
           scriptfile = os.path.join(self['script_dir'],  self['script'])
           if os.access(scriptfile,os.R_OK) and os.path.isfile(scriptfile):
                startst += """
<SCRIPT>
        %s
</SCRIPT>""" % open(scriptfile).read()

       return startst + '\n\n'

    def endpage(self): 
       endst = """
</HTML>"""
       return endst

    def __str__(self):
       try:
          return (self.startpage() + self['contents'] + self.endpage()) % self
       except KeyError,msg:
          return str(WebPage(title='Template Error',contents='''
Possible error with template:
<br><br>
Error message: <b>%s</b>
''' % msg))
       except:
          return """Content-type:  text/html

<UL>
<BR><BR><B>
You hit a bug in the application. Inform ADS, please!
<BR><BR>
%s</B>
""" % str(sys.exc_info()[1].args)

if __name__ == '__main__':
    if len(sys.argv) == 1:
       print WebPage(title='Probando')
    else:
       #
       # test
       #
       bla = WebPage(title="Hello World")
       bla['contents'] = "<BODY>\n<H1>Hello World</H1>\n</BODY>"
