#!/usr/bin/env python
#!/usr/local/bin/python
#  
import sys
import glob
sys.path.append('/proj/ads/soft/python/lib/site-packages')
from WebPage      import WebPage, read_webform
from ads.ToP_new  import ToP
import re,os,urllib
import ads

imgbase = ads.bitmapdir
artbase = ads.artdir
pubtypes= ['seri','elec','book','work','conf','proc','coll','rept','symp','proj']

#columns = 5
#rows    = 4

def_template     = 'bibstem_template'

def printjs(plist):
   string = str(plist)
   plist  = re.sub('None','\'\'',string)
   return plist

class Input(WebPage):

   def __init__(self,title,template=None,cnf={},**kw):
       self.template    = template  or def_template

       WebPage.__init__(self,title=title,template=self.template)

       self.update(kw)
       self.update(cnf)

class Session(WebPage):

   def __init__(self,title,template=None,cnf={},**kw):
       self.template    = template  or def_template

       script = 'session.js'

       WebPage.__init__(self,title=title, template=self.template,script=self.script)

       self.update(kw)
       self.update(cnf)

#       seld.__build()

#   def __build(self):
 
class Thumbnails(WebPage):

   def __init__(self,title,template=None,cnf={},**kw):
       self.template    = template  or def_template
       scriptfile = 'thumbnail.js'

       WebPage.__init__(self,title=title, template=self.template,script=scriptfile)
       self.pars  = cnf
       self.update(self.pars)
       self.update(kw)

if __name__ == '__main__':

  try:
     if len(sys.argv) == 1:
       cnf = read_webform()
     else:
       cnf = {'bibstem':'ade','columns':'3','rows':'3'}

     if cnf.has_key('imgdir'):
          data = ToP(cnf['imgdir'])

          files     = data[0]
          images    = data[1]
          pages     = data[2]
          types     = data[3]
          userpages = data[4]
          usertypes = data[5]

          total = len(files)
          self['jsdata'] = """
                files     = %s;
                images    = %s;
                pages     = %s;
                types     = %s;
                userpages = %s;
                usertypes = %s;
                startimg = 1;
             """ % (str(files),str(images),str(pages),str(types),
                   userpages and printjs(userpages) or "\"\"",
                   usertypes and printjs(usertypes) or "\"\"",
                   )

          foo = re.sub(imgbase+'/','',cnf['imgdir'])
          group,journal,volume = foo.split('/')
          kwds = { 'group'      : group,
                   'journal'    : journal,
                   'volume'     : volume,
                   'columns'    : columns,
                   'rows'       : rows,
                   'startimage' : 1,
                   'nimages'    : total,
                   'imageno'    : -1,
                   'mode'       : 'pages',
                 }

          print Session(title='Scans',template='session_template',thumbaction="hThumbnails.py?"+urllib.urlencode(kwds))

     elif cnf.has_key('volume'):
          show="no"
          vdir = os.path.join(cnf['jdir'],cnf['volume'])
          print Input(title="Check scans",template='scans_template',bibstem=cnf['bibstem'],volume=cnf['volume'],imgdir=vdir,group=cnf['group'],columns=cnf['columns'],rows=cnf['rows'],showsource=show)
     elif cnf.has_key('bibstem'):
          cnf['letters'] = ''
          if cnf['bibstem'] == 'ApJL':
#              cnf['bibstem'] = 'ApJ'
              cnf['letters'] = 'ApJL'
          if len(cnf['bibstem']) < 5:
             cnf['bibstem'] = cnf['bibstem'] + '.'*(5-len(cnf['bibstem']))
          copyfile = 'empty.gif'
          copydir = os.path.join(artbase,'config','copyright_letters')
          if os.path.exists(os.path.join(copydir,"%s.tiff"%cnf['bibstem'])):
		copyfile = "%s.gif" % cnf['bibstem']
          cnf['jdir'] = ''
          for pubtype in pubtypes:
             if cnf['bibstem'] == 'ApJL.':
                 dir = os.path.join(imgbase,pubtype,'ApJ..')
             else:
                 dir = os.path.join(imgbase,pubtype,cnf['bibstem'])
             if os.path.exists(dir):
               cnf['jdir'] = dir
               cnf['group'] = pubtype
          if not cnf['jdir']:
               cnf['bibstem'] = ''
               print Input(title="Scan Checking Facility",cnf=cnf,messg='Could not find bitmap directory for specified bibstem. Please try another bibstem...')
          else:
             volumes = os.listdir(cnf['jdir'])
             volumes.sort()
             if cnf['letters'] == 'ApJL':
                 volumes = filter(lambda b: int(b) > 147, 
                            filter(lambda a: re.search('^\d+$',a),
                            volumes))
             volbox = '<SELECT NAME=volume>'
             for volume in volumes: 
                 voldir = os.path.join(cnf['jdir'],volume)
                 if os.path.isdir(voldir):
                     volbox = volbox + '<OPTION value="' + volume + '">' + volume + '</OPTION>'
             volbox = volbox + '</SELECT>'
             print Input(title="Check volume",template='volume_template',bibstem=cnf['bibstem'],directory=cnf['jdir'],vollist=volbox,group=cnf['group'],cols=cnf['columns'],rows=cnf['rows'],copyright=copyfile)
     else:
          print Input(title="Scan Checking Facility", cnf=cnf,messg='')
  #except KeyError,msg:
  except KeyboardInterrupt:
     print WebPage(title='Error in template',contents='Cannot build page.Sorry')
     print msg

