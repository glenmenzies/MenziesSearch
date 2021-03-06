/*

	utiliy functions for the calendar.

*/
function cleanString(x) {
	var tempStatusString
	var re1 = /'/
	var re2 = /"/
	tempStatusString = x.replace(re1, "\\x27")
	tempStatusString = tempStatusString.replace(re2, "\\x22")
	return tempStatusString
}

function abrowser() {
	var agent = navigator.userAgent.toLowerCase();
	this.major = parseInt(navigator.appVersion,10);
	this.minor = parseFloat(navigator.appVersion);
	this.ns  = ((agent.indexOf('mozilla')!=-1) && ((agent.indexOf('spoofer')==-1) && (agent.indexOf('compatible') == -1)));
	this.ns2 = (this.ns && (this.major == 3));
	this.ns3 = (this.ns && (this.major == 3));
	this.ns4 = (this.ns && (this.major >= 4));
	this.ie   = (agent.indexOf("msie") != -1);
	this.ie3  = (this.ie && (this.major == 2));
	this.ie4  = (this.ie && (this.major >= 4));
	this.op3 = (agent.indexOf("opera") != -1);
	this.win9x = (this.ie && (agent.indexOf("windows 9") >= 0 || agent.indexOf("win 9") >= 0))	
	this.isSupportedbyWTReports = ((this.ns || this.ie) && this.major >= 4)
}

var theirbrowser = new abrowser()

var gPrevMonthLink
var gWeekCount		= 0
var gLastWeekHref
var gLastDayLink, gLastDayHref
var gLastMonthLink, gLastMonthHref 
var gLastYearLink, gLastYearHref 
var gLastQtrLink, gLastQtrHref
var gLinkCount		= 1

var gImgLabelCount	= 1

var YEARLY_REPORTTYPE	= "200"
var QUARTERLY_REPORTTYPE = "201"
var WEEKLY_REPORTTYPE	= "202"
var MONTHLY_REPORTTYPE	= "203"
var DAILY_REPORTTYPE	= "204"

// derive the word ax page from the toc
function ViewAsWord()
{
	var headExt, headDirExt
	var reportNameRoot,reportPathRoot
	var reportExt, reportname, wordPath

	reportname		= parent.frames.toc.location.href
	headExt			= reportname.lastIndexOf(".")
	headDirExt		= reportname.lastIndexOf("/")
	headTypeExt		= reportname.lastIndexOf("_")
	reportNameRoot	= reportname.substring(headDirExt+1,headTypeExt)
	reportPathRoot	= reportname.substring(0,headDirExt+1)
	reportExt		= reportname.substring(headExt,reportname.length)

	wordPath = reportPathRoot + "ax" + reportNameRoot +  reportExt
	if (reportNameRoot.indexOf('i') != 0 )
	{
		parent.frames.hiddenax.location.href = wordPath
	}
}
// derive the word ax page from the toc
function ViewAsExcel()
{
	var headExt, headDirExt
	var reportNameRoot,reportPathRoot
	var reportExt, reportname, wordPath

	reportname		= parent.frames.toc.location.href
	headExt			= reportname.lastIndexOf(".")
	headDirExt		= reportname.lastIndexOf("/")
	headTypeExt		= reportname.lastIndexOf("_")
	reportNameRoot	= reportname.substring(headDirExt+1,headTypeExt)
	reportPathRoot	= reportname.substring(0,headDirExt+1)
	reportExt		= reportname.substring(headExt,reportname.length)

	wordPath = reportPathRoot + "axe" + reportNameRoot +  reportExt
	if (reportNameRoot.indexOf('i') != 0 )
	{
		parent.frames.hiddenax.location.href = wordPath
	}
}

function getMonthAsString(month)
{
	var iMonth = parseInt(month,10);
	switch(iMonth)
	{
		case 0: return "00";
		case 1: return "01";
		case 2: return "02";
		case 3: return "03";
		case 4: return "04";
		case 5: return "05";
		case 6: return "06";
		case 7: return "07";
		case 8: return "08";
		case 9: return "09";
		case 10: return "10";	
		case 11: return "11";
	}
}

function LoadProfileStartPages()
{
	lastrep			= ""
	parent.dem_chapter	= ""
	//show stats, but stay at old loc if it exists
	if (oldyear)
		BuildReportCalendar(oldyear, oldmonth, "", "", "" )
	else
		BuildReportCalendar(thelastyear, thelastmonth, "", "", "")		
	frames.toc.location.href  = tocPage
	frames.main.location.href = sumPage

}

function FindPrevYearWithReports(year){

	var pyi = Years.indexOf(year) - 4

	if (pyi >= 0){
		prevyear = Years.substring(pyi,(pyi+4))
	}
	else{
		prevyear = "";
	}	
	return (prevyear)
}

function FindNextYearWithReports(year){
	
	var nyi = Years.indexOf(year) + 4
	if (nyi <= (Years.length - 1)){
		nextyear = Years.substring(nyi,(nyi+4))
	}
	else{
		nextyear = ""
	}	
	return (nextyear)
}

function FindPrevMonthWithReports(year,month){

	var hitmonth = getMonthAsString(month)
	var prevmonth
	var pmi 
	var i = 0
	var l

	while( i <= (YearMonth[year].length -1) ) {

		if (YearMonth[year].substring(i,(i+2)) == hitmonth ){
			pmi = i
			i = YearMonth[year].length
		}
		else
			i += 2
	}
			
	pmi -= 2;

	if (pmi >= 0 ){
		
		prevmonth = YearMonth[year].substring(pmi,(pmi+2))
	}
	else{
		year = FindPrevYearWithReports(year)
		if (year != ""){
			l = YearMonth[year].length - 1
			prevmonth = YearMonth[year].substring(l-1,l+1)
		}
		else
		   	prevmonth = ""
	}
		
	PrevYear = year
	PrevMonth = prevmonth
}

function FindNextMonthWithReports(year,month){

	var hitmonth = getMonthAsString(month)
	var nmi 
	var nextmonth
	var i  = 0

	while( i <= (YearMonth[year].length -1) ) {
		if (YearMonth[year].substring(i,(i+2)) == hitmonth ){
			nmi = i
			i = YearMonth[year].length
		}
		else
			i += 2
	}
	
	nmi += 2;
	if (nmi <= (YearMonth[year].length - 1)){
		nextmonth = YearMonth[year].substring(nmi,(nmi+2))
	}
	else{
		year = FindNextYearWithReports(year)
		if (year != "")
			nextmonth = YearMonth[year].substring(0,2)
		else
		   	nextmonth = ""
	}	
	NextYear = year
	NextMonth = nextmonth
}
function MonthOfTheYearByWeek(year,week){

	var month = JAN
	var theweek = WeekOfTheYear(year,month,1,0)
	
	while (theweek < week && month < DEC)
	{
		month++
		theweek = WeekOfTheYear(year,month,1,0)
		
	}
	
	if (theweek >= week)
		month = month -1
	return(month)
}
function MonthOfTheYearByQuarter(year,quarter){


	var amonth	 = JAN
	var squarter = -1

	switch( parseInt(quarter,10) )
	{
		case 1:	
			squarter = JAN
			break
		case 2:
			squarter = APR
			break
		case 3:
			squarter = JUL
			break
		case 4:
			squarter = OCT
			break

		default:

	}
	if ( squarter >= JAN )
	{
		// If the quarter has months already reported on we're done
		for (var amonth=squarter; amonth <= squarter + 2; amonth++)
		{
			if (YearMonth[year])
				if(ismonth(year,amonth))
					return
		}

		// since no dwm reports fell in this quarter add them all
		for (var amonth=squarter; amonth <= squarter + 2; amonth++)
		{
			incorporatemonth(year, getMonthAsString(amonth))
		}
	}
}


function WeekOfTheYear2(year,month,date,day){

	var monthDays = new montharr(31, 28, 31, 30, 31, 30, 31, 31, 30,31, 30, 31);
	var NewYearsDate = new Date
	var newYearsDay 
	var currentweeksunday = 0
	var nextweeksunday    = 0
	var nextmonth = 0
	var nDays
	var numsundays

	if (month == 0) 
		return (1)
	NewYearsDate.setDate(1)
	NewYearsDate.setMonth( nextmonth )
	if (year > 1999)
		NewYearsDate.setYear(year)
	else
		NewYearsDate.setYear(year - 1900)
	newYearsDay = NewYearsDate.getDay();
	nextweeksunday = (7 - newYearsDay) + 1
	numsundays = 2

	while( nextmonth < month  ){
		
		if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0))
			monthDays[1] = 29;
		nDays = monthDays[nextmonth];
		nextweeksunday += 7
		currentweeksunday = nextweeksunday
		nextweeksunday = (nextweeksunday % nDays)
		if (nextweeksunday == 0)
			nextweeksunday = nDays
		if (nextweeksunday < currentweeksunday){
			nextmonth++	
			if (nextmonth < month)
				numsundays++			
		}
		else
			numsundays++

	}

	return(numsundays)
}

function WeekOfTheYear(year,month,date,day){

	var monthDays = new montharr(31, 28, 31, 30, 31, 30, 31, 31, 30,31, 30, 31);
	var NewYearsDate = new Date
	var newYearsDay 
	var currentweekstart = 0
	var nextweekstart    = 0
	var nextmonth = 0
	var nDays
	var numstarts

	if (month == 0) 
		return (1)
	NewYearsDate.setDate(1)
	NewYearsDate.setMonth( nextmonth )
	if (year > 1999)
		NewYearsDate.setYear(year)
	else
		NewYearsDate.setYear(year - 1900)
	newYearsDay = NewYearsDate.getDay();
	var idays = weekstart - newYearsDay
	if (idays < 0)
	{
	 	nextweekstart  = 7 + idays + 1
	}
	else
	{
		nextweekstart = weekstart - newYearsDay + 1
	}
	numstarts = 2

	while( nextmonth < month  ){
		
		if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0))
			monthDays[1] = 29;
		nDays = monthDays[nextmonth];
		nextweekstart += 7
		currentweekstart = nextweekstart
		nextweekstart = (nextweekstart % nDays)
		if (nextweekstart == 0)
			nextweekstart = nDays
		if (nextweekstart < currentweekstart){
			nextmonth++	
			if (nextmonth < month)
				numstarts++			
		}
		else
			numstarts++

	}

	return(numstarts)
}
function ismonth(year,month){

	var smonth = getMonthAsString(month)
	if (YearMonth[year])
	{
		var i=0
		var mon = YearMonth[year].substring(i,(i+2))

		while( i <= (YearMonth[year].length -1) &&  parseInt(mon,10) <= parseInt(smonth,10)) 
		{
			if ( mon == smonth)
				return true
			i +=2
			mon = YearMonth[year].substring(i,(i+2))	
		}
	}
	return false
		
	
}

function incorporatemonth(year,month){

	var smonth = getMonthAsString(month)
	if (YearMonth[year])
	{
		var i=0
		var mon = YearMonth[year].substring(i,(i+2))

		while( i <= (YearMonth[year].length -1) &&  parseInt(mon,10) <= parseInt(smonth,10)) 
		{
			if ( mon == smonth)
				return
			i +=2
			mon = YearMonth[year].substring(i,(i+2))	
		}
		if (parseInt(mon,10) > parseInt(smonth,10))
			YearMonth[year] = YearMonth[year].substring(0,i) + smonth + YearMonth[year].substring(i,YearMonth[year].length)
		else
			YearMonth[year] += smonth
	}
	else
		YearMonth[year] = smonth
}


// Normalize the report types to months
// ------------------------------------


function ConvertWeeksToMonths(){

	var year, week, month, formatmonth = ""

	for (var pW in ReportWeek)
	{	
		year = pW.substring(0,4)
		week = pW.substring(6,pW.length)
		month = MonthOfTheYearByWeek(year,week)
		if (parseInt(month,10) < 10)
			formatmonth = "0" + month
		else
			formatmonth = month
		incorporatemonth(year,formatmonth )
	}

}
function ConvertMonthsToMonths(){

	var year, month, formatmonth = ""

	for (var pM in ReportMonth)
	{	
		year  = pM.substring(0,4)
		month = pM.substring(6,8)
		month = parseInt(month,10) - 1
		if (month < 10)
			formatmonth = "0" + month
		else
			formatmonth = month
		incorporatemonth(year,formatmonth )
	}

}
function ConvertQuartersToMonths(){

	var year, quarter, month, formatmonth = ""

	for (var pQ in ReportQuarter)
	{	
		year = pQ.substring(0,4)
		quarter = pQ.substring(6,pQ.length)
		MonthOfTheYearByQuarter(year,quarter)
	}

}
function ConvertYearsToMonths()
{
	var is = 0
	var ie = is + 4
	var syear

	if (Years)
	{
		while(ie <= Years.length)
		{
			syear = Years.substring(is,ie);
			// if no dwmq reports fall in this year add them all

			if (!YearMonth[syear])
				YearMonth[syear]= FULLYEAR
			is += 4
			ie = is + 4
		}
	}
	LoadMostRecentReport()


}
function montharr(m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11){

	this[0] = m0
	this[1] = m1
	this[2] = m2
	this[3] = m3
	this[4] = m4
	this[5] = m5
	this[6] = m6
	this[7] = m7
	this[8] = m8
	this[9] = m9
	this[10] = m10
	this[11] = m11
}

function loadwtreport(reportname, reptype, value )
{
	parent.currep	= "std"
	parent.lastrep = ""
	var reportTOC
	var reportBody
	var headExt, headDirExt
	var reportNameRoot,reportPathRoot
	var reportExt

	headExt			= reportname.lastIndexOf(".")
	headDirExt		= reportname.lastIndexOf("/")
	reportNameRoot = reportname.substring(headDirExt+1,headExt)
	reportPathRoot = reportname.substring(0,headDirExt+1)
	reportExt      = reportname.substring(headExt,reportname.length)

	reportTOC  = reportPathRoot + reportNameRoot + "_t" +  reportExt
	reportBody = reportPathRoot + reportNameRoot + "_01_b" +  reportExt

	frames.toc.location.href  = reportTOC
	frames.main.location.href  = reportBody
	if (oldyear)
		BuildReportCalendar(oldyear, oldmonth, olddate, reptype, value )

}

var gOldYear, gOldMonth, gOldDate, gOldht, gOldhd, gOldQuarter, gOldWeek

//
// Based on sample code from "javascript.internet.com"
// original code generated on one static calendar with no weeks, months, 
// quarters, years or months
//
function BuildReportCalendar(theyear, themonth, thedate, ht, hd)
{

	var CC			= ""
	var CB			= ""
	var TOP_HTML	= ""
	var	BODY_HTML	= ""
	var PMCC		= ""
	var NMCC		= ""
	var MSCC		= ""
	var YSCC		= ""
	var MDESC		= ""
	var YDESC		= ""
	var bHomePage	= false
	var pMonth, nMonth, pyear, nyear, nyear, pDays, numweeksbefore, firstDay, startDay, testMe, nDays
	var pskipyear, nskipyear, formMonth, formQuarter
	var PostCalendarPadding, nextMonthday, prevMonthday

	var WeekString	= new Array();
	var DateBGString = new Array();
	for (var i = 0; i <=31; i++ ) 
		DateBGString[i] = ""
	var tempBGColor
	var tempString
	var startcolumn
	var thequarter
	var bCheckWeek = false

	if (thedate == "" && ht == "" && hd == "")
	{
		bHomePage = true
	}
	if ( ! hd ) {
		if ( ( theyear == gOldYear) && (themonth == gOldMonth) ) {
			ht	= gOldht
			hd	= gOldhd
		}
		if ( ( theyear == gOldYear) && (gOldht == WEEKLY_REPORTTYPE))
			bCheckWeek = true

		if ( ( theyear == gOldYear) && (gOldht == QUARTERLY_REPORTTYPE ) && 
			 ( Math.floor((themonth) / 3) == gOldQuarter) ) {
			ht = gOldht
			hd = gOldhd
		}
		if ( ( theyear == gOldYear) && (gOldht == YEARLY_REPORTTYPE) ) {
			ht = gOldht
			hd = gOldhd
		}
	} else {
		gOldYear	= theyear
		gOldQuarter = Math.floor((themonth) / 3)
		gOldMonth	= themonth
		gOldDate	= thedate
		gOldht		= ht
		gOldhd		= hd
	}
	oldyear		= parseInt(theyear,10)
	oldmonth	= parseInt(themonth,10)
	hd			= parseInt(hd,10)
	if ( ! thedate )
	{
		thedate		= 0
	}
	olddate			= parseInt(thedate,10)
	var monthDays	= new montharr(31, 28, 31, 30, 31, 30, 31, 31, 30,31, 30, 31)
	var thisDay		= -1
	var numweeks	= 1
	var backyears	= 0
	var fordyears	= 0
	var today		= new Date()
	var year		= today.getYear()
	var	month		= today.getMonth()
	var	day			= today.getDate()

	// create integers
	theyear  = parseInt(theyear,10)
	themonth = parseInt(themonth,10)
	thedate  = parseInt(thedate,10)
	thequarter = Math.floor((themonth) / 3)
		
	// find the next and previous reports
	FindPrevMonthWithReports(theyear,themonth)
	FindNextMonthWithReports(theyear,themonth)
	pyear	= PrevYear
	nyear	= NextYear
	pMonth	= PrevMonth
	nMonth	= NextMonth

	// used for calc of prevous/next "real" months
	pyearReal	= theyear
	nyearReal	= theyear
	pskipyear	= theyear - 1
	nskipyear	= theyear + 1
	pMonthReal	= themonth - 1
	nMonthReal	= themonth + 1
	if (pMonthReal == -1)
	{
		pMonthReal = 11
		pyearReal = theyear - 1
	}
	if (nMonthReal == 12)
	{
		nMonthReal = 0
		nyearReal = theyear + 1
	}
	// today's date:
	if (year <= 99)
	{
		 year  = year + 1900
	}
	month = today.getMonth()
	day	  = today.getDate()
	if (thedate)
	{
		today.setDate(thedate)
	}
	else
	{	
		today.setDate(1)
	}
	today.setMonth(themonth)
	if (theyear > 1999)
	{
		today.setYear(theyear)
	}
	else
	{
		today.setYear(theyear - 1900)
	}
	// set flag if viewable month contains today's date.
	if (theyear == year && themonth == month)
	{
		thisDay = day
	}
	// check for leap year (Feb days)
	if (((theyear % 4 == 0) && (theyear % 100 != 0)) || (theyear % 400 == 0))
	{
		monthDays[1] = 29
	}
	nDays		= monthDays[themonth]
	firstDay	= today
	firstDay.setDate(1);
	startDay	= firstDay.getDay()
	
	CC += "<center><table width='168'  border='0' cellpadding='1' cellspacing='0'>"
	CC += "<tr><td nowrap valign='center' align='left'>&nbsp;\n"

	MDESC =  monthNames.substring(themonth * 3,(themonth + 1) * 3) 
	YDESC =  theyear 

	// previous report link
	if (pMonth)
	{
		gPrevMonthLink = 1
		PMCC += "<a href=\"JavaScript:parent.BuildReportCalendar(" + pyear + "," + pMonth + "," + thedate + ")\" onMouseOver=\"status='" + PreviousMonth + "';return true;\" onMouseOut=\"status='';return true;\">"
			 + "<img hspace=0 vspace=0 valign=top border=0 src=\"images/prvrepnav.gif\">"
			 + "</a>"
	}
	else 
	{
		if ( YearMonth[theyear].length > 2 ) 
			PMCC += "<img border=0 height=15 width=15 src=\"images/clear.gif\">"
	}
	
	// next report link
	if (nMonth)
	{
		NMCC += "<a href=\"JavaScript:parent.BuildReportCalendar(" + nyear + "," + nMonth + "," + thedate + ")\" onMouseOver=\"status='" + NextMonth + "';return true;\" onMouseOut=\"status='';return true;\">"
			 + "<img hspace=0 vspace=0 valign=top border=0 src=\"images/nxtrepnav.gif\" >"
			 + "</a>"
	}
	else 
	{
		if ( YearMonth[theyear].length > 2 ) 
			NMCC += "<img border=0 height=15 width=15 src=\"images/clear.gif\">"
	}

	// fill combobox with month names for current year.
	MSCC	+= "<select width=4 name='selMonth' onChange=\"parent.BuildReportCalendar(X.selYear.options[X.selYear.selectedIndex].value,X.selMonth.options[X.selMonth.selectedIndex].value," + thedate + ")\" onMouseOver=\"status='" + selectMonthStatus + "';return true;\" onMouseOut=\"status='';return true;\">"
	intmonth = parseInt(themonth,10)

	for (i=0; i < YearMonth[theyear].length - 1; i+=2)
	{
		j = YearMonth[theyear].substring(i,i+2)
		j = parseInt(j,10)
		if ( j == intmonth )
		{
			MSCC += "<option selected value=" + j + ">" + monthNames.substring(j * 3,(j + 1) * 3) 
		}
		else
		{
			MSCC += "<option value=" + j + ">" + monthNames.substring(j * 3,(j + 1) * 3) 
		}
	}

	MSCC += "</select>"
	
	// fill combobox with years that contain reports
	YSCC += "<select width=4 name='selYear' onChange=\"parent.BuildReportCalendar(X.selYear.options[X.selYear.selectedIndex].value,parent.YearMonth[X.selYear.options[X.selYear.selectedIndex].value].substring(0,2)," + thedate + ")\" onMouseOver=\"status='" + selectYearStatus + "';return true;\" onMouseOut=\"status='';return true;\">"

	for (i=0; i < Years.length - 1; i+=4)
	{
		j = Years.substring(i,i+4)
		j = parseInt(j,10)
		if ( j == theyear)
		{
			YSCC += "<option selected value=" + j + ">" + j 
		}
		else
		{
			YSCC += "<option value=" +j + ">" + j 
		}
	}

	YSCC += "</select>"
	
	if (theirbrowser.win9x && theirbrowser.ie)
	{
		// no listboxes
		CC += PMCC + MDESC + "&nbsp;" + NMCC + YDESC + "&nbsp;&nbsp;"
	}
	else
	{
		CC += PMCC + MSCC + NMCC + YSCC
	}

	
	CC += "</td><td align='absmiddle' colspan='3' align='right'>"

	if (!bHomePage && bMsEnabled)
	{
		CC += "<a href=\"JavaScript:parent.LaunchOffice('word');\" onMouseOver=\"status='" + jsViewMSWordReport + "'; return true\" onMouseOut=\"status='';return true;\">"
		CC += "<img name='wordreport' alt=\"" + jsViewMSWordReport + "\" vspace='1' border=0 src=\"images/wordx.gif\">"
		CC += "</a>&nbsp;"
		CC += "<a href=\"JavaScript:parent.LaunchOffice('excel');\" onMouseOver=\"status='" + jsViewMSExcelReport + "'; return true\" onMouseOut=\"status='';return true;\">"
		CC += "<img name='excelreport' alt=\"" + jsViewMSExcelReport + "\" vspace='1' border=0 src=\"images/excelx.gif\">"
		CC += "</a>"
	}
	CC += "&nbsp;<a href='JavaScript:parent.LoadProfileStartPages();' onMouseOver=\"status='" + ProfileStats + "'; return true\" onMouseOut=\"status='';return true;\">"
	CC += "<img alt='" + ProfileStats + "' vspace='1' border=0 src='images/info.gif'>"
	CC += "</a>&nbsp;</td></tr>"
	CC += "<tr><td>&nbsp;</td><tr>"
	CC += "</table>"

	CB += "<center>"

	// -----------------------------------------------
	// Top Column for Month

	CB += "<table border=0 cellspacing=0 cellpadding=0 width=210><tr>"
	CB += "<td width='20'>&nbsp;</td>";
	textonly = false
	tempBGColor = ""
	if (ht == MONTHLY_REPORTTYPE && hd == (themonth+1))	{
		textonly	= true
		tempBGColor = " bgcolor='#fdcb03'"
		for ( i = 1; i <= 31; i++ ) { 
			DateBGString[i] = " bgcolor='#fdcb03'"
		}
	}
	CB += "<td " + tempBGColor + " width='170' align='CENTER'>"
	CB += CheckForReport(MONTHLY_REPORTTYPE, theyear, 0, themonth, 0, 0, textonly)
	CB += "</td>"

	CB += "<td width='20'>&nbsp;</td>"
	CB += "</tr></table>"
	// -----------------------------------------------

	// Table to wrap middle tables with, so that following elements will display below, and
	// not keep wrapping to the right. 
	CB += "<table border=0 cellspacing=0 cellpadding=0 width=210><tr><td>"
	
	CB += "<table align=left cellspacing=0 cellpadding=0>"
	CB += "<tr>"
	CB += "<td >"
	CB += "	<table border=0 cellspacing=1 >"
	CB += "	<tr ><td width=17 height=15>&nbsp;</td></tr>"
	CB += "	<tr ><td width=17 height=15>&nbsp;</td></tr>"
	CB += "	<tr ><td width=17 height=15>&nbsp;</td></tr>"
	CB += "	<tr ><td width=17 height=15>&nbsp;</td></tr>"
	CB += "	<tr ><td width=17 height=15>&nbsp;</td></tr>"
	CB += "	</table>"
	CB += "</td>"
	CB += "</tr>"
	CB += "</table>"

	CB += "<table class='calendarbg' align='left' border='0' width='170' cellspacing='0' cellpadding='0'>"
	CB += "<tr><td width='100%'>"
	CB += " <table width='100%' border='0' cellspacing='1' cellpadding='1'>"

	CB += "<!-------------- weekday titles--------------->"
	CB += "<tr class='calendarheader'>"
	CB += "<td width='14%' height=15 align='center'>" + day0 + "</td>"
	CB += "<td width='14%' height=15 align='center'>" + day1 + "</td>"
	CB += "<td width='14%' height=15 align='center'>" + day2 + "</td>"
	CB += "<td width='14%' height=15 align='center'>" + day3 + "</td>"
	CB += "<td width='14%' height=15 align='center'>" + day4 + "</td>"
	CB += "<td width='14%' height=15 align='center'>" + day5 + "</td>"
	CB += "<td width='14%' height=15 align='center'>" + day6 + "</td>"
	//CB += "<td class='calendarblankdays' width='*' align='center'>" + WeekColumnLabel + "</td>"
	CB += "</tr>"
	CB += "<!-- -----------------days of the month: (links if applicable)-------- -->\n"
	CB += "<tr class='calendardays'>"
	column		= 0
	numweeks	=1
	// check if the previous month was contained in a leap year.
	if (((pskipyear % 4 == 0) && (pskipyear % 100 != 0)) || (pskipyear % 400 == 0))
	{
		monthDays[1] = 29
	}
	pDays		= monthDays[pMonthReal]
	var idays	= (startDay-weekstart) 
	if (idays < 0)
	{
		idays = 7 + idays
	}

	for (i=0; i < idays; i++) 
	{
		if (i == 0 ) {
			numweeks= numweeks - 1
		}
		prevMonthday = pDays - (idays - (i+1))
		CB += "<td class='calendarpadddays' height=15 width='14%' align='center'>" + prevMonthday + "</td>"
		column++
	}

	// -----------------------------------------------
	// Determine Availability of Week Reports, generate strings to insert later, 
	//	and set background color for appropriate date cells
	
	numweeksbefore = WeekOfTheYear(theyear,themonth,i,0) 
	if ( bCheckWeek) {
		if ( ( gOldWeek >= numweeksbefore) && ( gOldWeek < numweeksbefore + 6 ) ) {
			ht = gOldht
			hd = parseInt(gOldhd, 10)
		}
	}

	for (i = 7 - column; i < nDays + 7; i += 7) {
		textonly = false
		tempBGColor = ""
		if (ht == WEEKLY_REPORTTYPE && hd == (numweeks + numweeksbefore)) {
			gOldWeek = hd
			textonly	= true
			tempBGColor	= " bgcolor='#fdcb03'"
			for ( j = i - 6; j <= i; j++ ) {
				DateBGString[j] = " bgcolor='#fdcb03'"
			}
		}
		tempString = "<td " + tempBGColor + " height=15 width='20' align='center'>"
		tempString += CheckForReport(WEEKLY_REPORTTYPE, theyear, 0,themonth, (numweeks + numweeksbefore), 0, textonly)
		tempString += "&nbsp;</td>"
		WeekString[WeekString.length] = tempString
		numweeks += 1
	}

	// -----------------------------------------------
	// Fill the viewable month with current month's dates and create links to reports

	for (i=1; i<=nDays; i++) 
	{
		textonly = false
		if (ht == DAILY_REPORTTYPE && hd == i) {
			textonly = true
			tempBGColor = " bgcolor='#fdcb03'"
		} else {
			tempBGColor = DateBGString[i]			
		}

		CB += "<td width='14%' " + tempBGColor + " height=15 align='center'>"
		CB += CheckForReport(DAILY_REPORTTYPE, theyear, 0,themonth, 0, i, textonly)
		CB += "</td>"
		column++

		if (column == 7) {
			CB += "</tr>"
			CB += "<tr class='calendardays'>"
			column = 0
		}
	}

	// -----------------------------------------------
	// fill the viewable month with over-lapping dates from next month add least week if required
	PostCalendarPadding = nDays % 7
	if (column != 0) {
		nextMonthday = 1
		while( column < 7  ) {
			CB += "<td class='calendarpadddays' height=15 width='14%' align='center' >" + nextMonthday + "</td>"
			column +=1
			nextMonthday +=1
		}
	}

	CB += "</tr>"
	CB += "</table>"
	CB += "</table>" // End of background table

	CB += "<table class='calendarblankbg' align='left' border='0' cellspacing='0' cellpadding='0'>"
	CB += "<tr><td width='100%'>"
	CB += " <table border='0' cellspacing='1' cellpadding='" + (theirbrowser.ie ? "1" : "0") + "'>"
	CB += "	<tr valign=middle ><td height=15>&nbsp;</td></tr>"
	
	for ( i = 0; i < WeekString.length; i++ ) {
		CB += "	<tr valign=middle>" + WeekString[i] + "</tr>"
	}
	
	CB += "	</table>"
	CB += "</td>"
	CB += "</tr>"
	CB += "</table>"

	CB += "</td></tr></table>"

	// --------------------------
	// Handle Yearly Report

	CB += "<table width='210' border='0' cellpadding=0><tr>"
	CB += "<td width='20'>&nbsp;</td>";
	textonly = false
	tempBGColor = ""
	if (ht == YEARLY_REPORTTYPE && hd == theyear)
	{
		textonly	= true
		tempBGColor	= " bgcolor='#fdcb03'"
	}
	CB += "<td " + tempBGColor + "width='85' ALIGN='CENTER'>"	
	CB += CheckForReport(YEARLY_REPORTTYPE, theyear, 0, 0, 0, 0, textonly)
	CB += "</td>"

	// --------------------------
	// Handle Quarterly Report

	textonly = false
	tempBGColor = ""
	
	if (ht == QUARTERLY_REPORTTYPE && hd == (thequarter + 1) ) {
		//alert (" thequarter = " + thequarter)
		textonly	= true
		tempBGColor = " bgcolor='#fdcb03'"
	}
	CB += "<td " + tempBGColor + "width='85' ALIGN='CENTER'>"
	//thequarter = Math.floor((themonth) / 3)
	
	CB += CheckForReport(QUARTERLY_REPORTTYPE, theyear, thequarter + 1, 0, 0, 0, textonly)
	CB += "</td>"

	CB += "<td width='20'>&nbsp;</td>"
	CB += "</tr></table>"
	CC += "</center>"

	if (bfirst || theirbrowser.ns4)
	{
		if (theirbrowser.ie)
		{
			TOP_HTML	= START_CMD + CC + END_CMD
			BODY_HTML	= START_CALBODY + CB + END_CALBODY
		}
		else
		{
			TOP_HTML	= CC 
			BODY_HTML	= CB 
		}
		bfirst = false
		parent.frames.month.document.open()
		parent.frames.month.document.writeln(START_HTML + TOP_HTML + BODY_HTML + END_HTML)
		parent.frames.month.document.close()
	}
	else
	{
		parent.frames.month.document.all.calcommand.innerHTML	= CC
		parent.frames.month.document.all.calbody.innerHTML		= CB
	}

	parent.iscalendarloaded = true
}
function my_resize()
{
	if (theirbrowser.ns)
		parent.location.reload(true)
}
function ShowLnk(lnk, color)
{
	if (theirbrowser.ns) return
	if(lnk)
	{
			lnk.style.color = color
			lnk.style.textDecoration = 'underline'
	}

}
function HideLnk(lnk, color)
{
	if (theirbrowser.ns) return
	if(lnk)
	{
			lnk.style.color = color
			lnk.style.textDecoration = 'none'
	}
}
function CheckForReport(reporttype, theyear, thequarter,themonth, theweek, thedate, textonly)
{
	var lookup, classname, reportname, statusMessage, statusString
	var formatYear    = theyear
	var formatQuarter = thequarter
	var formatMonth   = parseInt(themonth,10)  + 1
	var formatWeek    = parseInt(theweek,10)
	var formatDate    = parseInt(thedate,10)
	var formatDate    = parseInt(thedate,10)
	var ReadMonth     = themonth + 1

	if (formatYear==2006)
		formatWeek = formatWeek - 1
		theweek = formatWeek
	if (thedate < 10)
		formatDate = "0"  + formatDate
	if (formatWeek < 10)
		formatWeek = "0"  + formatWeek
	if (formatMonth < 10)
		formatMonth = "0" + formatMonth
	if (formatQuarter < 10)
		formatQuarter = "0" + formatQuarter

	with ( frames.month.document )
	{
		if (reporttype == YEARLY_REPORTTYPE)
		{
			lookup			= theyear + ".y" + formatYear
			statusMessage	= formatYear
			reportname		= ReportYear[lookup]

			if (reportname)
			{
				var datatype = reportname.substring(reportname.length-4,reportname.length)
				gLastYearLink	= gLinkCount++
				if(datatype == "html")
				{
					classname="static" 
					statusString = ""
					gLastYearHref = "JavaScript:parent.loadwtreport('" + reportname + "','" + reporttype + "','" + theyear + "')"
				}
				else
				{
					classname="ondemand" 
					reportname	= reportname.substring(0,reportname.length-10)
					reportdesc	= reporttype + ":" + statusMessage
					statusString = "On Demand"
					gLastYearHref = "JavaScript:parent.SetObj('" + reportname + "','" + reportdesc + "','" + reporttype + "','" + theyear + "')"
				}
				
				if (textonly)
					classname = "sel" + classname
				
				HTM_LINK	= "<a class='" + classname + "' href=\"" + gLastYearHref + ";\" onMouseOver=\"status='" 
					+ statusString + " " + cleanString(YEARLY_REPORT) + ":" + statusMessage + 
					"';return true;\" onMouseOut=\"status='';return true;\">" + formatYear + "</a>"
			}
			else
			{
				HTM_LINK = "<font color='#a1a1a1'>" + formatYear + "</font>"
			}
		}

		if (reporttype == QUARTERLY_REPORTTYPE)
		{
			lookup			= formatYear + ".q" + formatQuarter
			statusMessage	= QAbb + formatQuarter + ", " + formatYear
			reportname		= ReportQuarter[lookup]
			if (reportname)
			{
				var datatype = reportname.substring(reportname.length-4,reportname.length)
				gLastQtrLink	= gLinkCount++
				if(datatype == "html")
				{
					classname="static" 
					if (textonly)
						classname="selstatic"
					gLastQtrHref = "JavaScript:parent.loadwtreport('" + reportname + "','" + reporttype + "','" + formatQuarter + "')"
					HTM_LINK = "<a class='"+classname+"' href=\"" + gLastQtrHref + "\" onMouseOver=\"status='" + reporttype + ":" + statusMessage + "';return true;\" onMouseOut=\"status='';return true;\">" + QAbb + thequarter + "</a>"
				}
				else
				{
					classname="ondemand" 
					if (textonly)
						classname="selondemand"
					reportname	= reportname.substring(0,reportname.length-10)
					reportdesc	= reporttype + ":" + statusMessage
					gLastQtrHref = "JavaScript:parent.SetObj('" + reportname + "','" + reportdesc + "','" + reporttype + "','" + formatQuarter + "')"
					HTM_LINK	= "<a class='"+classname+"' href=\"" + gLastQtrHref + ";\" onMouseOver=\"status='On demand " + cleanString(QUARTERLY_REPORT) + ":" + statusMessage + "';return true;\" onMouseOut=\"status='';return true;\">" + QAbb + thequarter + "</a>"
				}
			
			}
			else
			{
				HTM_LINK = "<font color='#a1a1a1'>" + QAbb + thequarter + "</font>"
			}
		}

		if (reporttype == MONTHLY_REPORTTYPE)
		{
			lookup			= formatYear + ".m" + formatMonth
			statusMessage	= ReadMonth + "/" + formatYear
			reportname		= ReportMonth[lookup]
			if (reportname)
			{
				var datatype = reportname.substring(reportname.length-4,reportname.length)
				gLastMonthLink	= gLinkCount++
				if(datatype == "html")
				{
					classname="static" 
					if (textonly)
						classname="selstatic"
					gLastMonthHref = "JavaScript:parent.loadwtreport('" + reportname + "','" + reporttype + "','" + formatMonth + "')"
					HTM_LINK	= "<a class='"+classname+"' href=\"" + gLastMonthHref + "\" onMouseOver=\"status='" + reporttype + ":" + statusMessage + "';return true;\" onMouseOut=\"status='';return true;\">" + LongMonth[themonth] + "</a>"
				}
				else
				{
					classname="ondemand" 
					if (textonly)
						classname="selondemand"
					reportname	= reportname.substring(0,reportname.length-10)
					reportdesc	= reporttype + ":" + statusMessage
					gLastMonthHref = "JavaScript:parent.SetObj('" + reportname + "','" + reportdesc + "','" + reporttype + "','" + formatMonth + "')"
					HTM_LINK	= "<a class='"+classname+"' href=\"" + gLastMonthHref + "\" onMouseOver=\"status='On demand " + cleanString(MONTHLY_REPORT) + ":" + statusMessage + "';return true;\" onMouseOut=\"status='';return true;\">" + LongMonth[themonth] + "</a>"
				}
				
			}
			else
			{
				HTM_LINK =  "<font color='#a1a1a1'>" + LongMonth[themonth] + "</font>"
			}
		}

		if (reporttype == WEEKLY_REPORTTYPE)
		{
			lookup			= formatYear + ".w" + formatWeek
			statusMessage	= " " + theweek + " " + formatYear
			reportname		= ReportWeek[lookup]

			if (reportname) {

				var datatype = reportname.substring(reportname.length-4,reportname.length)
				gWeekCount++

				if (datatype == "html") {
					classname="static" 
					statusString = ""
					gLastWeekHref = "JavaScript:parent.loadwtreport('" + reportname + "','" + reporttype + "','" + formatWeek + "')"
				} else {
					classname="ondemand" 
					reportname	= reportname.substring(0,reportname.length-10)
					reportdesc	= reporttype + ":" + statusMessage
					statusString = "On demand"
					gLastWeekHref = "JavaScript:parent.SetObj('" + reportname + "','" + reportdesc + "','" + reporttype + "','" + formatWeek + "')"
				}

				if (textonly)
					classname = "sel" + classname

				HTM_LINK	= "<a class='" + classname + "' href=\"" + gLastWeekHref + ";\" " 
					+ "onMouseOver=\"imgover(" + gImgLabelCount + "); status='" 
					+ statusString + " " + cleanString(WEEKLY_REPORT) + ":" + statusMessage 
					+ "';return true;\" onMouseOut=\"imgout(" + gImgLabelCount + "); status='';return true;\"><img name='_img" + gImgLabelCount + "' border=0 alt='Week " 
					+ theweek + "' src='images/tri_left.gif'></a>"
					gImgLabelCount++
			} else {
			
				HTM_LINK =  "<font color='#000000'><img border=0 src='images/tri_left1b.gif'>&nbsp;</font>"
			
			}
		}


		if (reporttype == DAILY_REPORTTYPE)
		{
			var day			= false
			statusMessage	= ReadMonth + "/" + thedate + "/" + formatYear
			lookup			= formatYear + "" +  formatMonth
			if ( ReportDay[lookup] )
			{
				entiremonth = ReportDay[lookup]
				slink		= entiremonth.indexOf(formatDate + ".")
				if (slink > 0)
				{
					day = true
					slink = entiremonth.substring(slink,entiremonth.length)
				}
			}
			HTM_LINK	= ""
			var daylink = formatYear + "/m" + formatMonth + "/d" + formatDate + "/d"

			if (day)
			{	
				var elink		= slink.indexOf(",")
				var replink		= daylink + slink.substring(0,elink)
				var datatype	= replink.substring(replink.length-4,replink.length)
				gLastDayLink	= gLinkCount++
				
				if (datatype == "html")	{
					classname="static" 
					if (textonly)
						classname="selstatic"
					statusString = ""
					gLastDayHref = "JavaScript:parent.loadwtreport('" + replink + "','" + reporttype + "','" + thedate + "')"

				} else {
					classname="ondemand" 
					replink		= replink.substring(0,replink.length-10)
					reportdesc	= reporttype + ":" + statusMessage
					statusString = "On demand"
					gLastDayHref = "JavaScript:parent.SetObj('" + replink + "','" + reportdesc + "','" + reporttype + "','" + thedate + "')"
				}

				if (textonly)
					classname = "sel" + classname

				HTM_LINK	= "<a class='" + classname + "' href=\"" + gLastDayHref + ";\" onMouseOver=\"status='" 
					+ statusString + " " + cleanString(DAILY_REPORT) + ":" + statusMessage 
					+ "';return true;\" onMouseOut=\"status='';return true;\">" + thedate + "</a>"

			} else {

				HTM_LINK += "<font color='#a1a1a1'>" + thedate + "</font>"

			}

			HTM_LINK += ""
		}

	}

	return HTM_LINK

}

function LoadMostRecentReport()
{	
	if (Years)
	{
		thelastyear		= Years.substring((Years.length-4), Years.length)
		possmonth		= YearMonth[thelastyear]
		thelastmonth	= possmonth.substring((possmonth.length-2), possmonth.length)		
		BuildReportCalendar(thelastyear, thelastmonth, "", "", "")		
		SelectLastLink()
	}
	else
	{
		with (frames.month.document)
		{
			open()
			var b = "<html>"
					+ "<title>Report Calendar</title>"
					+ "<head>"
					+ '<LI' + 'NK REL="styl' + 'esheet" TYPE="te' + 'xt/css" HREF="style_sheets/' + parent.stylesheet + '">'
					+ "</head>"
					+ "<body bgcolor=#FFFFFF>"
					+ "<center><br><br><table width='100%' border='0' cellpadding='0' cellspacing='1'>"
					+ "<tr><td class='datatablenormalbold' nowrap align=center>" + noReports + "</td></tr>"
					+ "</table></center>"
			write(b)
			close()
			show_status()
		}
	}
}

function SelectLastLink()
{
	var lastLink, lastHref

	//	This is a little strange, because the links are generated in the order:
	//		Weeks/Month/Days/Year/Qtr
	//	but are displayed in the order
	//		Month/Days/Weeks/Year/Qtr
	//	and we select them in the order
	//		Last Day/Last Week/Month/Qtr/Year
	
	lastLink = gLastDayLink
	lastHref = gLastDayHref

	if ( ! lastLink && gWeekCount) { 
		lastLink = gWeekCount + ( gLastMonthLink ? 1 : 0 )
		lastHref = gLastWeekHref
	}

	if ( ! lastLink ) { 
		lastLink = gLastMonthLink || gLastQtrLink || gLastYearLink
		lastHref = gLastMonthHref || gLastQtrHref || gLastYearHref
	}

	// Account for previous month link in top area of form. If there is only
	// one month of data, this link won't be there.
	if ( gPrevMonthLink ) {
		lastLink += 1
	}
		
	if (lastLink) {
		with (frames.month.document)
		{
			if( theirbrowser.ie4 )
				links[lastLink].click()
			else
			{
				// This originally used the links[lastLink].href value, but the links array isn't available the
				// the first time a Netscape 4.x user loads the page.
				var func = lastHref
								
				if ( func) 
					eval(func)
			}
		}
	}
}
