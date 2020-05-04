#!/usr/bin/env python
#!/usr/local/bin/python
#  
import sys
sys.path.append('/proj/ads/soft/python/lib/site-packages')
from WebPage import WebPage, read_webform
import ads

import re, os

def_template = 'thumbnail_template'
def_script   = 'thumbnail.js'

class ThumbnailWindow(WebPage):

   #
   # CLASS defaults
   #
   def_imgpath      = ads.bitmapdir
   def_top          = 'ToP'
   def_rows         = 3
   def_columns      = 5

   def __init__(self,title,template=None,script=None,cnf={},**kw):

       templatefile = template or def_template
       scriptfile   = script   or def_script

       WebPage.__init__(self,title=title,template=templatefile,script=scriptfile)
       self.pars  = cnf
       self.update(kw)
       self.update(self.pars)

       if not self.has_key('startimage'):
           self['startimage'] = 1

       if not self.has_key('nimages'):
           self['nimages'] = 0

       if not self.has_key('rows'):
           self['rows']    = self.def_rows
       if not self.has_key('columns'):
           self['columns'] = self.def_columns
       if not self.has_key('imgpath'):
           self['imgpath'] = self.def_imgpath

#
# end class Thumbnail
#

if __name__ == '__main__':
   if len(sys.argv) == 1:
       print ThumbnailWindow(title="Preservation Project",cnf=read_webform())
   else:
       print ThumbnailWindow(title="Preservation Project",cnf={'group':'seri','journal':'A+A..','volume':'0002','imageno':'-1','rows':'4'})

