#!/usr/bin/env python
#!/usr/local/bin/python
#  
#  File: 
#
#  Project:
#
#  Description:
#
import sys
sys.path.append('/proj/ads/soft/python/lib/site-packages')
from WebPage import WebPage, read_webform
from ads.ToP_scancheck import ToP
import ads

import re, os, urllib, os.path, commands,time

#files with scan info from cddb files
infile = "%s/ImageLocations.dat" % ads.cddbdir
jrfile = "%s/PublicationNames.dat" % ads.cddbdir
 
getname = "/usr/bin/tiffinfo \"%s\" | egrep \"(DocumentName|ImageDescription)\""
#getname = "/usr/bin/tiffinfo \"%s\""

delay = 0.2

def_template = 'session_template'
def_script   = 'session.js'

def printjs(plist):
   string = str(plist)
   plist  = re.sub('None','\'\'',string)
   return plist

class Session(WebPage):
   def_imgpath      = ads.bitmapdir
   def_columns      = 5
   def_rows         = 4

   def __init__(self,title,script=None, template=None,cnf={},**kw):
       self.template     = template or def_template
       self.script       = script or def_script

       WebPage.__init__(self,title=title,template=self.template,script=self.script)

       # some defaults
       self['imgpath'] = self.def_imgpath

       cnf['letters'] = ''
       if cnf['journal'] == 'ApJL.':
           cnf['journal'] = 'ApJ..'
           cnf['letters'] = 'ApJL'

       self.update(kw)
       self.update(cnf)

#       if self.has_key('db') and self['db'] == 'ads':
#          self.metalist = MetaList( db='ads' )
#       else:
#          self['db'] = ''
#          self.metalist = MetaList()

#       session = self.metalist.checksession(self['id'])

#       self.update(session)
#       self.session = session

       self.__build()

   def __build(self):

       kwds = { 'group'      : self['group'],
                'journal'    : self['journal'],
                'volume'     : self['volume'],  
              }

       imgpath = os.path.join(self['imgpath'],
                              self['group'],
			      self['journal'],
			      self['volume']) 

       altpath = os.path.join(ads.ads_articles,'lists',self['group'],self['journal'])
       if os.path.exists(os.path.join(imgpath,"ToP")):
           data = ToP(imgpath,topname="ToP")
       else:
           data = ToP(altpath,topname=self['journal']+self['volume']+".top")

       files     = data[0]
       images    = data[1]
       pages     = data[2]
       types     = data[3]
       userpages = data[4]
       usertypes = data[5]
       sources = []
       if self['letters'] == 'ApJL':
           files = filter(lambda a: a[0] == 'L',files)
       if self['source'] == "on":
           for file in files:
               img_file = os.path.join(imgpath,'600',file)
               cmmd = getname % img_file
               res = os.popen(cmmd).read().strip()
               if res:
                  tags = res.split('\n')
                  if re.search('(Document|Description)',tags[8]):
                      img_source = re.sub('.*?:(.*?):.*',r'\1',tags[8])
                  else:
                      img_source = re.sub('.*?:(.*?):.*',r'\1',tags[7])
                  img_source = re.sub('\"','',img_source)
               else:
                  img_source = "Unknown"
               sources.append(img_source)

       if not files:
           self['jsdata'] = ""
           self['contents'] = "Cannot find ToP images for %s volume %s in <br><blockquote>%s</blockquote> <br>or<br> <blockquote>%s</blockquote>" % (self['journal'],self['volume'],imgpath,altpath + "/" + self['journal']+self['volume']+".top")
           return

       self['jsdata'] = """

   files     = %s;
   images    = %s;
   pages     = %s;
   types     = %s;
   userpages = %s;
   usertypes = %s;
   sources   = %s;

   startimg = 1;
""" % (str(files),str(images),str(pages),str(types),
          userpages and printjs(userpages) or "\"\"",
          usertypes and printjs(usertypes) or "\"\"",
          str(sources),
      )

       self['currentimg'] = 1
       
       total  = len(files)

       startimg   =  self['currentimg'] = 1 

       if not self.has_key('columns'):
          self['columns']  = self.def_columns
       if not self.has_key('rows'):
          self['rows']     = self.def_rows

       self['total']      = total

       kwds.update({
                  'columns'    : self['columns'],
                  'rows'       : self['rows'],
                  'startimage' : startimg,
                  'nimages'    : total,
                  'imageno'    : -1,
                  'mode'       : 'xpages',
                })
       self['thumbaction']   = "hThumbnails.py?"+urllib.urlencode(kwds)
       self['commandaction'] = "hPageNumber.py"

#
#  MAIN  
#
if __name__ == '__main__':
#  try:
#    if len(sys.argv) == 1:
#        print Session(title="Preservation Project",cnf=read_webform())
#    else:
#        import traceback
#        try:
#            print Session(title="Preservation Project",id=sys.argv[1])
#        except:
#            traceback.print_exc()
#  except KeyboardInterrupt:
#    pass
  cnf = {}
  try:
     if len(sys.argv) == 1:
       cnf = read_webform()
       cnf['journal'] = re.sub('\ ','+',cnf['journal'])
     else:
       #cnf = {'id':'ygXggJUWIG'}
       cnf = {'user':'swordfish'}
       #cnf = {}
#     cnf = {'group':'seri','journal':'O+T..','volume':'0001','source':'foo'}
     print Session(title="ADS Scan Checking Facility",cnf=cnf)

  except KeyboardInterrupt:
     print WebPage(title='Error in template',contents='Cannot build page.Sorry')
     print msg

