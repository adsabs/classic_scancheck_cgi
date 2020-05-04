#!/usr/bin/env python
#!/usr/local/bin/python
#  

from WebPage import WebPage, read_webform

def_template     = 'pagenumber_template'
def_script       = 'pagenumber.js'

class PageNumberWindow(WebPage):

   def __init__(self,title,template=None,script=None,cnf={},**kw):
       self.template     = template     or def_template
       self.script       = script       or def_script

       WebPage.__init__(self,title=title,
                             template=self.template,script=self.script)

       self.update(kw)
       self.update(cnf)

try:
    print PageNumberWindow(title="PageNumberWindow window",cnf=read_webform())
except KeyError:
    print WebPage(title='Error in template',contents='Cannot build page.Sorry')
except:
    print """Content-type:   text/html

""" 
