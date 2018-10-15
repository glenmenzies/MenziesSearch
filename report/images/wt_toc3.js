

var _id = 0, _pid = 0, _lid = 0, _pLayer;
var _mLists = new Array();
document.lists = _mLists;
var isNav4, isIE4;
var imageCounter = 0;
var checkboxCounter = 0;
//var incFlag = new Array();
var TOC3AdvMode	= false
var TOC3linkTarget = ""

if (parseInt(navigator.appVersion.charAt(0)) >= 4) {
  isNav4 = (navigator.appName == "Netscape") ? true : false;
  isIE4 = (navigator.appName.indexOf("Microsoft") != -1) ? true : false;
}

/** ------------------------------------------ **/

var onit		= new Image()
var ofit		= new Image()
var ofit2		= new Image()
var cursel		= new Image()
var cursel2		= new Image()
onit.src		= imagepath + "/toc_3b.gif" 
ofit.src		= imagepath + "/toc_3.gif"  
ofit2.src		= imagepath + "/tri_right.gif"
cursel.src		= imagepath + "/toc_3sel.gif" 
cursel2.src		= imagepath + "/tri_rightsel.gif"
var curlink		= null
var curlink2	= null
var curtextlink	= null

// --------------------------------------------------------------------------------------

function current(gImageID,nsLayerID, nsImageLayerID ) {
	var img, img2, textlink, objstr
	
	//alert ("in current(): [" + gImageID + "];[" + nsLayerID + "];[" + nsImageLayerID + "]")

	if (!parent.iscalendarloaded && !TOC3AdvMode) return

	if (isNav4) 
	{
		var objstr = "document.layers[" + (nsLayerID +1) + "].document.images[" + nsImageLayerID + "]" 
		img = eval(objstr) 
		var objstr = "document.layers[" + (nsLayerID +1) + "].document.images[" + (nsImageLayerID -1) + "]" 
		img2 = eval(objstr) 
	}
	else
	{
		img  = eval("document._img" + gImageID) 
		img2 = eval("document._img" + gImageID + "arrow")		
		textlink = eval("document.all._lnk" + gImageID)
		
		if ( curtextlink ) { 
			curtextlink.className = "tocchapter"
		}
		if ( textlink ) {
			textlink.className = "tocchaptersel"
			curtextlink = textlink
			//alert ("Set textlink.className to " + textlink.className)
		}

	}

	if (img && img != curlink){
		if ( curlink ) {
			curlink.src  = ofit.src
			curlink2.src = ofit2.src
		}
		img.src  = cursel.src
		img2.src = cursel2.src
		curlink  = img
		curlink2 = img2
	}
}

// --------------------------------------------------------------------------------------

function imgover(gImageID,nsLayerID, nsImageLayerID ) {

 	if (isNav4){	
		var objstr = "document.layers[" + (nsLayerID +1) + "].document.images[" + nsImageLayerID + "]" 
		img = eval(objstr);
	}
	else{
		img = eval("document._img" + gImageID) 
	}
    if ( img ) {
		if (curlink && img == curlink)
			img.src = cursel.src  
		else
			img.src = onit.src
	}
}

// --------------------------------------------------------------------------------------

function imgout(gImageID,nsLayerID, nsImageLayerID ){
	
	var img
	if (isNav4) { 
		var objstr = "document.layers[" + (nsLayerID +1) + "].document.images[" + nsImageLayerID + "]" 
		img = eval(objstr) 
	}
	else
		img = eval("document._img" + gImageID) 
	
	if ( img ) {
		if (curlink && img == curlink)
			img.src = cursel.src
		else
			img.src = ofit.src
	}
}

/** ------------------------------------------ **/
	

/**
 * resize.js 0.3 970811
 * by gary smith
 * js component for "reloading page onResize"
 */

if(!window.saveInnerWidth) {
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


/** ------------------------------------------ **/



// --------------------------------------------------------------------------------------

function List(visible, width, height, bgColor) {
	this.setIndent		= setIndent;
	this.addItem		= addItem;
	this.addList		= addList;
	this.build			= build;
	this.rebuild		= rebuild;
	this.selectFirst	= selectFirst;
	this.openFirst		= openFirst;
	this.setFont		= _listSetFont;
	this._writeList		= _writeList;
	this._showList		= _showList;
	this._updateList	= _updateList;
	this._updateParent	= _updateParent;
	this.onexpand		= null; 
	this.postexpand		= null;
	this.lists			= new Array(); // sublists
	this.items			= new Array(); // layers
	this.types			= new Array(); // type
	this.strs			= new Array();  // content
	this.linkStrings	= new Array();
	this.images			= new Array();
	this.imagesrc		= new Array();
	this.incflag		= new Array();
	this.objid			= new Array();
	//this.listincflag	= false;
	this.checkboxes2	= new Array();
	
	this.x = 0;
	this.y = 0;
	this.visible = visible;
	this.id = _id;
	//this.i = 18;
	this.i = 20;
	this.cellwidth = this.i;
	//this.space = true;
	this.space = false;
	this.pid = 0;
	this.fontIntro = false;
	this.fontOutro = false;
	this.width = width || 450;
	this.height = height || 18;
	this.parLayer = false;
	this.built = false;
	this.shown = false;
	this.needsUpdate = false;
	this.needsRewrite = false;
	this.parent = null;
	this.l = 0;
	if(bgColor) 
		this.bgColor = bgColor;
	else this.bgColor = null;
	_mLists[_id++] = this;
	//incFlag[_id++] =   (thisIncFlag) ? thisIncFlag : false;
}

// --------------------------------------------------------------------------------------

function openFirst() 
{
	this.selectFirst(true)
}
	
// --------------------------------------------------------------------------------------

function selectFirst(bDontOpen) 
{
	// If bDontOpen is set to true, only do open folders and do image select effect...

	var layer, thislink, bDone, layerName, layerNum;

	bDone = false

	if ( this.types[0] == "list" ) 
	{
		this.lists[0].visible = true
		this.rebuild()

		if ( this.lists[0].types[0] == "list" ) 
		{
			this.lists[0].lists[0].visible=true
			this.rebuild()
			layerName = this.lists[0].lists[0].items[0].id
		}
		else
		{
			layerName = this.lists[0].items[0].id
		}
	}

	layerNum = parseInt(layerName.substr(5)) 

	if ( bDontOpen ) { 
		current(layerName, layerNum, 1)
	}
	else {
		if ( isIE4) 
			var func = eval("document.all.lItem"+layerNum+".document.links[0].href")
		else
			var func = document.layers[layerNum+1].document.links[0].href

		if ( func ) {
			eval(func)
			//Do Image Select effect
			current(layerName, layerNum, 1)
		}
	}
}

// --------------------------------------------------------------------------------------

function _listSetFont(i,j) {
	this.fontIntro = i;
	this.fontOutro = j;
}

// --------------------------------------------------------------------------------------

function setIndent(indent) { 
	this.i = indent; 
	if(this.i < 0) { 
		this.i = 0; 
		this.space = false; 
	} 
}

// --------------------------------------------------------------------------------------

function cleanString(x) {
	var tempStatusString
	var re1 = /'/g
	var re2 = /"/g
	tempStatusString = x.replace(re1, "\\x27")
	tempStatusString = tempStatusString.replace(re2, "\\x22")
	return tempStatusString
}

// --------------------------------------------------------------------------------------

function setClip(layer, l, r, t, b) {
	if(isNav4) {
	    layer.clip.left = l; layer.clip.right = r;
	    layer.clip.top = t;  layer.clip.bottom = b;
	} else {
	    layer.style.pixelWidth = r-l;
	    layer.style.pixelHeight = b-t;
	    layer.style.clip = "rect("+t+","+r+","+b+","+l+")";
	}
}

// --------------------------------------------------------------------------------------

function _writeList(rootInRecursion) {
	self.status = "List: Writing list...";
	var layer, str, clip, tempImage, classTag, imgOverTag, imgTag;

	var jsDebug = 0;
	var debug = "";

  	for(var i = 0; i < this.types.length; i++) { 
		layer = this.items[i];
    	if(isNav4) layer.visibility = "hidden";
    	else layer.style.visibility = "hidden";
    	str = "";


    	if(isNav4) layer.document.open();
    	str += "<form name=reptoc>\n"
		str += "	<table width="+this.width+" nowrap border=0 cellpadding=0 cellspacing=0>\n"
		str += "		<tr>\n";

		if(this.types[i] == "list") {

	  		if(this.l>=0 && this.i>0) {
  				for (var j = 0; j < this.l; j++) {
					str += "		<td width=" + this.cellwidth + ">&nbsp;&nbsp;</td>\n"
				}
			}

			// Display layer for List (w/ folders)

			// add checkboxes for content editor
			if ( TOC3AdvMode ) {
				str += "		<td width=" + this.cellwidth + " nowrap valign=middle>\n"
					+  "			<input type=checkbox name=\"x" + this.objid[i] + "_include" + "\" " 
					+  ((this.incflag[i] > 0) ? "CHECKED" : "") + " value=\"Y|N\" onclick=\"parent.updatecontent(this)\">\n"
					+  "		</td>\n";
			}

			
			// add volume image
			str += "		<td width=" + this.cellwidth + " height='" + this.height + "' nowrap valign=middle>\n"
				+  "			<a target='_self' onmouseover='status=\"" + cleanString(this.strs[i]) + "\"; return true;' onmouseout='status=\"\"; return true;' href=\"javascript:expand("+this.lists[i].id+");\"><img border=0 src=\"" + imagepath + "/toc_2.gif\" name=\"_img"+ this.lists[i].id +"\"></a>\n"
				+  "		</td>\n";

      		_pid++;
      		classTag = "class='tocsection'"
    	
		} else {

	  		if(this.l>=0 && this.i>0) {
  				for (var j = 0; j < this.l - 1; j++) {
					str += "		<td width=" + this.cellwidth + ">&nbsp;&nbsp;</td>\n"
				}
			}

			imgTag			= this.items[i].id 

			// add marker for selected chapter
			str += "		<td width=" + this.cellwidth + ">\n"
			    +  "			<img border=0 name=_img" + imgTag + "arrow src=" + imagepath + "/tri_right.gif>\n"
				+  "		</td>\n"

			// Display layer for chapter (w/ doc icon)

			// add checkboxes for content editor
			if ( TOC3AdvMode ) {
				str += "		<td width=" + this.cellwidth + " nowrap valign=middle>\n"
					+  "			<input type=checkbox name=\"x" + this.objid[i] + "_include" + "\" " 
					+  ((this.incflag[i] > 0) ? "CHECKED" : "") + " value=\"Y|N\" onclick=\"parent.updatecontent(this)\">\n"
				    +  "		</td>\n";
			}

			imgOverTag		= "onMouseDown='current(\"" + imgTag + "\"," +  layer.name.substr(5) + ",1); return true;' "
			imgOverTag	   += "onMouseOver='status=\"" + cleanString(this.strs[i]) + "\"; imgover(\"" + imgTag + "\"," +  layer.name.substr(5) + ",1); return true;' "
			imgOverTag	   += "onMouseOut='status=\"\"; imgout(\"" + imgTag + "\"," +  layer.name.substr(5) + ",1); return true;'"

			classTag = "class='tocchapter'"
			
			// add chapter image
			str += "		<td width=" + this.cellwidth + " nowrap valign=middle>\n"
			    +  "			<a name=link" + imgTag + " " + TOC3linkTarget + " " + imgOverTag + " href='" + this.linkStrings[i] + "'><img name=_img" + imgTag + " border=0 src='" + imagepath + "/toc_3.gif'></a>\n"
				+  "		</td>\n"
 		}
 
 		str += "		<td " + classTag + " height='" + (this.height-1) + "' width="+ ( this.width - 15 - this.l*this.i)+" valign=middle align=left>\n";

    	if ( this.fontIntro ) 
			str += this.fontIntro;

    	// add chapter text
		if ( this.linkStrings[i] != "" ) 
			str += "			<a id=_lnk" + imgTag + " " + TOC3linkTarget + " " + classTag + " " + imgOverTag + " href='" + this.linkStrings[i] + "'>";

		// add volume text
		if ( this.types[i] == "list" ) {
			str += "			<a " + classTag + " target='_self' onmouseover='status=\"" + cleanString(this.strs[i]) + "\"; return true;' onmouseout='status=\"\"; return true;' href=\"javascript:expand("+this.lists[i].id+");\">"
		}

		// associated text
    	str += this.strs[i];

    	str += "</a>\n"

    	if ( this.fontOutro ) 
			str += this.fontOutro;

    	str += "		</td>\n"
			+  "	</table>\n"
			+  "</form>\n";

		if (jsDebug)
			debug += str;

		if(isNav4) {
      		layer.document.writeln(str);
      		layer.document.close();
    	}
		else
			layer.innerHTML = str;
    		
    	if(this.types[i] == "list" && this.lists[i].visible)
      		this.lists[i]._writeList(false);
  	}

	if (jsDebug)
	{
		var w = window.open(); 
		w.document.open("text/plain");
		w.document.write(debug); 
	}

  	this.built = true;
  	this.needsRewrite = false;
  	self.status = '';
}

// --------------------------------------------------------------------------------------

function _showList() {
	var layer;
	for(var i = 0; i < this.types.length; i++) { 
	    layer = this.items[i];
	    setClip(layer, 0, this.width, 0, this.height-1);
	    var bg = layer.oBgColor || this.bgColor;
	    if(isIE4) {
			if((bg == null) || (bg == "null")) 
				bg = "";
			layer.style.backgroundColor = bg;
		} else 
			layer.document.bgColor = bg;
		if(this.types[i] == "list" && this.lists[i].visible)
			this.lists[i]._showList();
	}
	this.shown = true;
	this.needsUpdate = false;
}

// --------------------------------------------------------------------------------------

function _updateList(pVis, x, y, rootInRecursion) {
	var currTop = y, layer;
	var tempImage;
	for(var i = 0; i < this.types.length; i++) { 
		layer = this.items[i];
		if(this.visible && pVis) {
			if(isNav4) {
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
			if(isNav4) layer.visibility = "hidden";
			else layer.style.visibility = "hidden";
		}
		if(this.types[i] == "list") {
			if(this.lists[i].visible) {
				if(!this.lists[i].built || this.lists[i].needsRewrite) this.lists[i]._writeList(false);
				if(!this.lists[i].shown || this.lists[i].needsUpdate) this.lists[i]._showList();

		        if(isNav4) layer.document.images[0].src = imagepath + "/toc_1.gif";
		        else eval('document.images._img'+this.lists[i].id+'.src = "' + imagepath + '/toc_1.gif"');
				
			} else {
		        if(isNav4) layer.document.images[0].src = imagepath + "/toc_2.gif";
		        else eval('document.images._img'+this.lists[i].id+'.src = "' + imagepath + '/toc_2.gif"');
      	
			}
      
			if(this.lists[i].built)
				currTop = this.lists[i]._updateList(this.visible && pVis, x, currTop);
		}
	}

	return currTop;
}

// --------------------------------------------------------------------------------------

function _updateParent(pid, l) {
  var layer;
  if(!l) l = 0;
  this.pid = pid;
  this.l = l;
  for(var i = 0; i < this.types.length; i++)
    if(this.types[i] == "list")
      this.lists[i]._updateParent(pid, l+1);
}

// --------------------------------------------------------------------------------------

function expand(i) {
	var j
	var initialState	= _mLists[i].visible
	
	if ( ! TOC3AdvMode ) 
	{
		if ( _mLists[i].l == 1) 
		{
			// Clicked on top-level Folder Entry
			for ( j = 0; j < _mLists[_mLists[i].pid].lists.length; j++ ) 
			{
				_mLists[_mLists[i].pid].lists[j].visible = false
				parent.frames.toc.scroll(0,0)
			}
		}
	}

	_mLists[i].visible = !initialState;
	if(_mLists[i].onexpand != null)	
		_mLists[i].onexpand(_mLists[i].id);

	_mLists[_mLists[i].pid].rebuild();
	if(_mLists[i].postexpand != null) 
		_mLists[i].postexpand(_mLists[i].id);
}

// --------------------------------------------------------------------------------------

function build(x, y) {
  this._updateParent(this.id);
  this._writeList(true);
  this._showList();
  this._updateList(true, x, y, true);
  this.x = x; this.y = y;
}

// --------------------------------------------------------------------------------------

function rebuild() { this._updateList(true, this.x, this.y, true); }

// --------------------------------------------------------------------------------------

function addItem(str, bgColor, layer, linkArg, thisIncFlag, thisObjID) {
	var testLayer = false;
	if(!document.all) 
		document.all = document.layers;
	if(!layer) {
	    if(isIE4 || !this.parLayer) 
			testLayer = eval('document.all.lItem'+_lid);
	    else {
			_pLayer = this.parLayer;
			testLayer = eval('_pLayer.document.layers.lItem'+_lid);
		}

		if(testLayer) 
			layer = testLayer;
		else {
			// Problem, HTML Div not generated
			if(isNav4) {
				if(this.parLayer) 
					layer = new Layer(this.width, this.parLayer);
				else 
					layer = new Layer(this.width);
			} 
			else 
				return;
		}
	}
	if(bgColor) 
		layer.oBgColor = bgColor;
	this.items[this.items.length] = layer;
	this.types[this.types.length] = "item";
	this.linkStrings[this.linkStrings.length] = linkArg ;
	this.incflag[this.incflag.length] = thisIncFlag
	this.objid[this.objid.length] = thisObjID
	this.strs[this.strs.length] = str;
	_lid++;
}

// --------------------------------------------------------------------------------------

function addList(list, str, bgColor, layer, thisIncFlag, thisObjID) {
	var testLayer = false;
	if(!document.all) 
		document.all = document.layers;
	if(!layer) {
		if(isIE4 || !this.parLayer) 
			testLayer = eval('document.all.lItem'+_lid);
		else {
			_pLayer = this.parLayer;
			testLayer = eval('_pLayer.document.layers.lItem'+_lid);
		}
		if(testLayer) 
			layer = testLayer;
		else {
			if(isNav4) {
				if(this.parLayer) 
					layer = new Layer(this.width, this.parLayer);
				else 
					layer = new Layer(this.width);
			} 
			else 
				return;
		}
	}
	if(bgColor) 
		layer.oBgColor = bgColor;
	this.lists[this.items.length] = list;
	this.items[this.items.length] = layer;
	this.types[this.types.length] = "list";
	this.linkStrings[this.linkStrings.length] = "";
	this.incflag[this.incflag.length] = thisIncFlag
	this.strs[this.strs.length] = str;
	this.objid[this.objid.length] = thisObjID
 
	  list.parent = this;
	_lid++;
}

// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------

