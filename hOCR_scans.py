#!/usr/bin/env python
#  
import sys
sys.path.append('/proj/ads/soft/python/lib/site-packages')
from WebPage import WebPage, read_webform
from ads.ToP_scancheck import ToP

import ads,os, sys, os.path, urllib

def_template     = 'ocr_template'
def_script       = 'status.js'

class StatusWindow(WebPage):

   def __init__(self,title,template=None,script=None,cnf={},**kw):
       self.template     = template or def_template
       self.script       = script   or def_script

       def_ocrpath      = ads.ocrtextdir
       def_imgpath      = ads.bitmapdir

       WebPage.__init__(self,title=title,template=self.template)

       self.pars  = cnf
       self.update(kw)
       self.update(cnf)

       if not self.has_key('journal'):
			             self['journal'] = 'MNRAS'
       if not self.has_key('ocrpath'):
			             self['ocrpath'] = def_ocrpath
       if not self.has_key('imgpath'):
			                    self['imgpath'] = def_imgpath
       if not self.has_key('group'):
			                    self['group'] = 'seri'
       if not self.has_key('addpages'):
                                     self['addpages'] = 0

       imgpath = os.path.join(self['imgpath'],self['group'],self['journal'],self['volume'])
       ocrpath = os.path.join(self['ocrpath'],'full',self['group'],self['journal'],self['volume'])
       altpath = os.path.join(ads.ads_articles,'lists',self['group'],self['journal'])

       if os.path.exists(os.path.join(imgpath,"ToP")):
           data = ToP(imgpath,topname="ToP")
       else:
           data = ToP(altpath,topname=self['journal']+self['volume']+".top")

       files = data[0]
       idx  = int(self['imageno']) - 1
       ocrfile = files[idx] + '.txt'
       ocrfile = os.path.join(ocrpath,ocrfile)
       try:
          file_exists = os.path.isfile(ocrfile)
          file_size   = os.path.getsize(ocrfile)
       except:
          file_exists = ''
          file_size   = 0
       addtxt = ''
       for i in range(int(self['addpages'])):
		idx = int(self['imageno']) + i
		try:
	            txtfile = files[idx] + '.txt'
		    txtfile = os.path.join(ocrpath,txtfile)
                    if os.path.isfile(txtfile) and os.path.getsize(txtfile) > 0:
                           addtxt += open(txtfile).read() 
                except:
                    continue

       message = "No OCR text available"

       if file_exists and file_size > 0:
         f = open(ocrfile)
         message = f.read() + addtxt

       self['background'] = '#ffffff'
       if not self.has_key('message'):
            self['message'] = message
       if not self.has_key('phase'):
            self['phase'] = '0'

def test():
    try:
       if len(sys.argv) == 1:
         print StatusWindow(title="ADS Historical Literature: OCR text",cnf=read_webform())
       else:
         print StatusWindow(title="Status window",cnf={'group':'seri','journal':'PA...','volume':'0012','imageno':'203','rows':'4','addpages':'1'})
    except KeyboardInterrupt:
        pass

if __name__ == '__main__':
   test()

