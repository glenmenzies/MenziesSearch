// copyright (c)	webtrends corp., 1999.  all rights reserved.
function BrowserInfo() {
	var agent = navigator.userAgent.toLowerCase();
	this.major = parseInt(navigator.appVersion);
	this.minor = parseFloat(navigator.appVersion);
	this.ns  = ((agent.indexOf('mozilla')!=-1) && ((agent.indexOf('spoofer')==-1) && (agent.indexOf('compatible') == -1)));
	this.ns2 = (this.ns && (this.major == 3));
	this.ns3 = (this.ns && (this.major == 3));
	this.ns4 = (this.ns && (this.major >= 4));
	this.ie   = (agent.indexOf("msie") != -1);
	this.ie3  = (this.ie && (this.major == 2));
	this.ie4  = (this.ie && (this.major >= 4));
	this.op3 = (agent.indexOf("opera") != -1);
}
var browserinfo = new BrowserInfo()
var	maxChapters     = 0
var gbFirst			= true;
var bExpanded		= false;						// is tree initially expanded completely
var bLoaded			= false;						// tree is ready
var width			= 260;
var height			= 20;
var MaxItems		= VOLUMES.length + ITEMS.length
var listX			= 5								// start x of list
var listY			= 32							// start y of list
var bgColor			= "";
<!-- browser info object
// resize and list functions
if(!window.saveInnerWidth) 
{
  window.onresize = resize;
  window.saveInnerWidth = window.innerWidth;
  window.saveInnerHeight = window.innerHeight;
}

function resize() {
	
    if (saveInnerWidth < window.innerWidth || 
        saveInnerWidth > window.innerWidth || 
        saveInnerHeight > window.innerHeight || 
        saveInnerHeight < window.innerHeight ) 
    {
        window.history.go(0);
    }
}

var _id = 0, _pid = 0, _lid = 0, _pLayer;
var _mLists = new Array();
document.lists = _mLists;

// adapted DevEdge Online sample code :author Michael Bostock 

function List(visible, width, height, bgColor) {
  this.setIndent = setIndent;
  this.addItem = addItem;
  this.addList = addList;
  this.build = build;
  this.rebuild = rebuild;
  this.setFont = _listSetFont;
  this._writeList = _writeList;
  this._showList = _showList;
  this._updateList = _updateList;
  this._updateParent = _updateParent;
  this.onexpand = null; this.postexpand = null;
  this.lists = new Array(); 
  this.items = new Array(); 
  this.types = new Array(); 
  this.strs = new Array();  
  this.x = 0;
  this.y = 0;
  this.visible = visible;
  this.id = _id;
  this.i = 18;
  this.space = true;
  this.pid = 0;
  this.fontIntro = false;
  this.fontOutro = false;
  this.width = width; 
  this.height = height;
  this.parLayer = false;
  this.built = false;
  this.shown = false;
  this.needsUpdate = false;
  this.needsRewrite = false;
  this.parent = null;
  this.l = 0;
  if(bgColor) this.bgColor = bgColor;
  else this.bgColor = null;
  _mLists[_id++] = this;
}
function _listSetFont(i,j) {
  this.fontIntro = i;
  this.fontOutro = j;
}
function setIndent(indent) { this.i = indent; if(this.i < 0) { this.i = 0; this.space = false;} this.space = false; }
function setClip(layer, l, r, t, b) {
  if(browserinfo.ns4) {
    layer.clip.left = l; layer.clip.right = r;
    layer.clip.top = t;  layer.clip.bottom = b;
  } else {
    layer.style.pixelWidth = r-l;
    layer.style.pixelHeight = b-t;
    layer.style.clip = "rect("+t+","+r+","+b+","+l+")";
  }
}
function _writeList() {
  var layer, str, clip, end;

  for(var i = 0; i < this.types.length; i++) 
  { 
    layer = this.items[i];
    if(browserinfo.ns4) 
		layer.visibility = "hidden";
    else 
		layer.style.visibility = "hidden";
    str = "";
    if(browserinfo.ns4) 
		layer.document.open();
    str += "<form name=reptoc><TABLE  WIDTH="+this.width+" BORDER=0 CELLPADDING=0 CELLSPACING=0><TR>";
    if(this.types[i] == "list") 
	{
		str += "<TD WIDTH=21 VALIGN=MIDDLE><A HREF=\"javascript:expand("+this.lists[i].id+");\"><IMG BORDER=0 SRC=\"" + imagepath + "/true.gif\" NAME=\"_img"+this.lists[i].id+"\"></A></TD>";
		_pid++;
		end		= ""
		var classTag = "class='tocsection'"
      } 
	else 
	{
		var classTag = "class='tocchapter'"
		end		= ""
	}   
   
    if(this.l>0 && this.i>0) 
		str += "<TD WIDTH="+this.l*this.i+" >&nbsp;</TD>";
    str += "<TD " + classTag + " HEIGHT="+(this.height-1)+" WIDTH="+(this.width-15-this.l*this.i)+" VALIGN=MIDDLE ALIGN=LEFT>";
  	self.status = tocCaption + ": " + ITEMS[i+1].adesc
    if(this.fontIntro) 
		str += this.fontIntro;
    str += this.strs[i];
    if(this.fontOutro) 
		str += this.fontOutro;
    str += "</TD><TD>"+end+"</TD></TABLE></form>";
	if(browserinfo.ns4) 
	{
	  layer.document.writeln(str);
	  layer.document.close();
	} 
	else 
	{
		layer.innerHTML = str;
    }
	if(this.types[i] == "list" && this.lists[i].visible)
	{
      this.lists[i]._writeList();
	}
  }
  this.built = true;
  this.needsRewrite = false;
  self.status = '';
}
function _showList() {
  var layer;
  for(var i = 0; i < this.types.length; i++) { 
    layer = this.items[i];
    setClip(layer, 0, this.width, 0, this.height-1);
    if(browserinfo.ie4) {
		/*
      if(layer.oBgColor) layer.style.backgroundColor = layer.oBgColor;
      else layer.style.backgroundColor = this.bgColor;
	  */
    } else {
 		/*
     if(layer.oBgColor) layer.document.bgColor = layer.oBgColor;
      else layer.document.bgColor = this.bgColor;
 	  */
   }
    if(this.types[i] == "list" && this.lists[i].visible)
      this.lists[i]._showList();
  }
  this.shown = true;
  this.needsUpdate = false;
}
function _updateList(pVis, x, y) {
  var currTop = y, layer;
  for(var i = 0; i < this.types.length; i++) { 
    layer = this.items[i];
    if(this.visible && pVis) {
      if(browserinfo.ns4) {
	layer.visibility = "visible";
	layer.top = currTop;
	layer.left = x;
      } else {
	layer.style.visibility = "visible";
	layer.style.pixelTop = currTop;
	layer.style.pixelLeft = x;
      }
      currTop += this.height;
    } else {
      if(browserinfo.ns4) layer.visibility = "hidden";
      else layer.style.visibility = "hidden";
    }
    if(this.types[i] == "list") {
      if(this.lists[i].visible) {
        if(!this.lists[i].built || this.lists[i].needsRewrite) this.lists[i]._writeList();
        if(!this.lists[i].shown || this.lists[i].needsUpdate) this.lists[i]._showList();
        if(browserinfo.ns4) layer.document.images[0].src = imagepath + "/true.gif";
	else eval('document.images._img'+this.lists[i].id+'.src = imagepath + "/true.gif"');
      } else {
	if(browserinfo.ns4) layer.document.images[0].src = imagepath + "/false.gif";
	else eval('document.images._img'+this.lists[i].id+'.src = imagepath + "/false.gif"');
      }
      if(this.lists[i].built)
        currTop = this.lists[i]._updateList(this.visible && pVis, x, currTop);
    }
  }
  return currTop;
}
function _updateParent(pid, l) {
  var layer;
  if(!l) l = 0;
  this.pid = pid;
  this.l = l;
  for(var i = 0; i < this.types.length; i++)
    if(this.types[i] == "list")
      this.lists[i]._updateParent(pid, l+1);
}
var iLstExp =1
function expand(i) {

	if (iLstExp != -1 && iLstExp != i)
	{
		  _mLists[iLstExp].visible = !_mLists[iLstExp].visible;
		  if(_mLists[iLstExp].onexpand != null) _mLists[iLstExp].onexpand(_mLists[iLstExp].id);
		  _mLists[_mLists[iLstExp].pid].rebuild();
		  if(_mLists[iLstExp].postexpand != null) _mLists[iLstExp].postexpand(_mLists[iLstExp].id);

	}
	if (iLstExp != i)
	{
		iLstExp = i
	}
	else
	{
		iLstExp = -1
	}
	
  _mLists[i].visible = !_mLists[i].visible;
  if(_mLists[i].onexpand != null) _mLists[i].onexpand(_mLists[i].id);
  _mLists[_mLists[i].pid].rebuild();
  if(_mLists[i].postexpand != null) _mLists[i].postexpand(_mLists[i].id);
}
function build(x, y) {
  this._updateParent(this.id);
  this._writeList();
  this._showList();
  this._updateList(true, x, y);
  this.x = x; this.y = y;
}
function rebuild() { this._updateList(true, this.x, this.y); }
function addItem(str, bgColor, layer) {
  var testLayer = false;
  if(!document.all) document.all = document.layers;
  if(!layer) {
    if(browserinfo.ie4 || !this.parLayer) testLayer = eval('document.all.lItem'+_lid);
    else {
      _pLayer = this.parLayer;
      testLayer = eval('_pLayer.document.layers.lItem'+_lid);
    }
    if(testLayer) layer = testLayer;
    else {
      if(browserinfo.ns4) {
	if(this.parLayer) layer = new Layer(this.width, this.parLayer);
	else layer = new Layer(this.width);
      } else return;
    }
  }
  if(bgColor) layer.oBgColor = bgColor;
  this.items[this.items.length] = layer;
  this.types[this.types.length] = "item";
  this.strs[this.strs.length] = str;
  _lid++;
}
function addList(list, str, bgColor, layer) {
  var testLayer = false;
  if(!document.all) document.all = document.layers;
  if(!layer) {
    if(browserinfo.ie4 || !this.parLayer) testLayer = eval('document.all.lItem'+_lid);
    else {
      _pLayer = this.parLayer;
      testLayer = eval('_pLayer.document.layers.lItem'+_lid);
    }
    if(testLayer) layer = testLayer;
    else {
      if(browserinfo.ns4) {
	if(this.parLayer) layer = new Layer(this.width, this.parLayer);
	else layer = new Layer(this.width);
      } else return;
    }
  }
  if(bgColor) layer.oBgColor = bgColor;
  this.lists[this.items.length] = list;
  this.items[this.items.length] = layer;
  this.types[this.types.length] = "list";
  this.strs[this.strs.length] = str;
  list.parent = this;
  _lid++;
}

document.vlinkColor = document.linkColor
document.alinkColor = document.linkColor
document.linkColor	= document.linkColor

var onit		= new Image()
var ofit		= new Image()
var cursel		= new Image()
onit.src		= imagepath + "/tocarw.gif" 
ofit.src		= imagepath + "/tocclr.gif"  
cursel.src		= imagepath + "/tocsel.gif" 
var curlink		= null
var prvlink		= null
var prvlnk		= null

// List initialization
var subvar = new Array()
var image = 0
var vol   = 0
var sublist = null
var  l = new List(true, width, height, bgColor);
l.setFont("","");


function imgover(id,lnk){

 	if(lnk && !browserinfo.ns)
	{
		if(lnk != prvlnk)
		{
			//lnk.style.color = '$hovLnkColor'
			//lnk.style.textDecoration = 'underline'
		}
	}
 	if (browserinfo.ns){	
		var objstr = "document.layers[" + id + "].document.reptoc.wt" + id
		img = eval(objstr) 
	}
	else{
		img = eval("document.wt" + id) 
	}
    if (curlink && img == curlink)
      img.src = cursel.src  
    else
      img.src = onit.src
}

function imgout(id,lnk){

	if(lnk && !browserinfo.ns)
	{
		if(lnk != prvlnk)
		{
			//lnk.style.color = '$regLnkColor'
			//lnk.style.textDecoration = 'none'
		}
	}
	var img
  	if (browserinfo.ns){
		var objstr = "document.layers[" + id + "].document.reptoc.wt" + id
		img = eval(objstr) 
	}
	else
		img = eval("document.wt" + id) 

	if (curlink && img == curlink)
		img.src = cursel.src
    else
		img.src = ofit.src
}


function currentVol(iSection)
{
	if (prvlink)
		prvlink.src = ofit.src

	if (!_mLists[iSection].visible)
	{
		expand(iSection)
	}
	
}
function current(id, bVolume, lnk)
{
	if(prvlnk && !browserinfo.ns)
	{
		if (prvlnk != lnk)
		{
			//prvlnk.style.color ='$regLnkColor'
			//lnk.style.textDecoration = 'none'
		}	
	}
	if (lnk && !browserinfo.ns)
	{
		prvlnk = lnk
		lnk.style.color ='blue'
	}
  	if (browserinfo.ns4){		
		var objstr = "document.layers[" + id + "].document.reptoc.wt" + id
		img = eval(objstr) 
	}
	else
		img = eval("document.wt" + id) 

	if (img && img != curlink){
		curlink = img
		if ( !bVolume )
			curlink.src = cursel.src
		if (prvlink)
			prvlink.src = ofit.src
		prvlink = curlink
	}
}

function subnode(numElements)
{

	if (gbFirst)
		bexpand = true
	else
		bexpand = bExpanded
	this.list			= new List(bexpand, width, height, bgColor);
	this.numElements	= numElements
	gbFirst = false
}

function initsublist()
{
	sublist = new subnode(0)
    sublist.list.setIndent(0);
    sublist.list.setFont("","");
 	cursublist = sublist
    return sublist
}

function addsubitem(reportlink,reportdesc)
{	
	image++
	cursublist.numElements++
    cursublist.list.addItem("<nobr><img src='" + imagepath + "/clear.gif' width=9 height=1 border=0 >"
		+ "<img name=wt" + image + " src='" + imagepath + "/tocclr.gif' border=0>"
		+ "<a href='" + reportlink + "' class='tocchapter' TARGET='main' onClick='current(" + image + ",1,this);return true;' "
		+ "onMouseOver='imgover(" + image + ",this);return true;' onMouseOut='imgout(" + image + ",this);return true;'>"
		+ "&nbsp;" + reportdesc + "</a></nobr>"
		);

}

function addvolume(vollink,voldesc)
{
	vol++
	image++
	l.addList(cursublist.list, "<nobr><A href='" + vollink + "' class='tocsection' target='main' onClick='currentVol("+vol+");return true;'>&nbsp;" + voldesc + "</a>");
}

function init()
{

   var item = 0

   for (var volume = 1; volume <= (VOLUMES.length-1); volume++)
   {
		subvar[vol] = initsublist();

		for (var chapters=1; chapters <= CHAPTERS[volume]; chapters++)
		{
			item++
			subvar[vol] = addsubitem(ITEMS[item].alink, ITEMS[item].adesc)
			if (maxChapters < chapters)
			{
				maxChapters = chapters
			}
		}

		addvolume(VOLUMES[volume].alink, VOLUMES[volume].adesc)
   }

  maxChapters += volume
  l.build(listX,listY);
  bLoaded = true
}

var DOWN = 0;
var UP   = 1;
var gTimerId;
if (document.layers)
{
	var scrollintver = 300
}
else
{
	var scrollintver = 100

}
function stopmove()
{
	clearInterval( gTimerId )
}
function move(iDirection)
{
	if (iDirection == DOWN)
	{
		down()
	}
	else
	{
		up()
	}
}
function down()
{
	var d
	listY	+=50
	l.y		= listY

	if (document.layers)
	{
		l._updateList(true,listX,listY);
	}
	else
	{
		for (var i=0; i <= MaxItems; i++)
		{
			d = eval("document.all.lItem" + i)
			d.style.pixelTop	+=20
		}
	}
}
function up()
{
	var d
	listY	-=50
	l.y		= listY

	if (document.layers)
	{
			l._updateList(true,listX,listY);
	}
	else
	{
		for (var i=0; i <= MaxItems; i++)
		{
			d = eval("document.all.lItem" + i)
			d.style.pixelTop	-=20
		}
	}
}

function buildtoctitleframe(str)
{
	with(top.frames.toctitle.document)
	{
		open()
		var page = '<html><head>' 
		+ '<LI' + 'NK REL="styl' + 'esheet" TYPE="te' + 'xt/css" HREF="' + stylePath + '/style.css">'
		+ '</head><body topmargin="1" leftmargin="1">' + str + '</body></html>'
		write(page)
		close()
	}
}
function myvoid(){}
var SpacerHeight	= 1000
//var contrl		= "&nbsp;<a href='javascript:top.frames.toc.down()'><img src='scrup.gif' border=0></a>&nbsp;</a><a href='javascript:top.frames.toc.up()'><img src='scrdown.gif' border=0></a>"
if (browserinfo.ns)
{
//	tocCaption += contrl
}

var TOC_HTML

TOC_HTML = '<style TYPE="text/css">\n'
TOC_HTML += '#spacer		{ margin-top:0;position: absolute; height:' + SpacerHeight  + ';z-index: 0}\n'

for (var i=0; i <= MaxItems; i++)
{
	TOC_HTML += '#lItem' + i + ' { position:absolute; }\n'
}

TOC_HTML += '</style>\n'
TOC_HTML += '<body marginHeight=1 marginWidth=2 onLoad="init();">\n'
TOC_HTML += '<div  ID="spacer"><b>' + tocCaption + '</b></div>\n'

for (var i=0; i <= MaxItems; i++)
{
	TOC_HTML += '<div ID="lItem' + i + '" name="lItem' + i + '"></div>\n'
}

document.writeln( TOC_HTML )

