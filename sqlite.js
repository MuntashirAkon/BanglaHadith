/**
 * Created by Muntashir Akon on 3/29/2016.
 */

function popout(url,name,height,width){
    if(height!=undefined&&width!=undefined){
        height='height='+height;width=',width='+width+',';
    }else if(height==="100%"&&width==="100%"){
        height='height='+$(window).height();width=',width='+$(window).width()+',';}else{height="";width="";
    }
    var newWindow=window.open(url,name,height+width+',resizable=false');
    if(window.focus){
        newWindow.focus();
    }
}


var Hadith = function(){
    var img_src = "https://raw.githubusercontent.com/mujtahid-akon/English-to-Bangla-Dictionary/master/images/";
    var db;
    var keyword;
    var book_id;
    var section_id;
    this.db_connect = function(array){  // connect db
        var uInt8Array = new Uint8Array(array);
        db = new SQL.Database(uInt8Array);
    };
    this.show_result = function(word, bypass){ // by HadithId, Book, Section, [Chapter.] Hadith
        keyword = word.trim();
        //keyword = keyword.replace(/[^A-Za-z0-9\-\s\']/g, "");
        var result_set = $(".result_set");
        result_set.html("");
        if (!bypass){
            // By HadithId
            var result = db.exec("SELECT COUNT(*) FROM hadithmain WHERE HadithID=" + keyword);
            if(result[0].values[0][0]){
                result_set.append("<h3>হাদীস</h3>");
                this.get_hadith(keyword);
            }
            // By Book
            result = db.exec("SELECT BookID, BookNameBD FROM hadithbook WHERE BookNameBD LIKE '%" + keyword + "%'");
            if(result[0].values[0][0]) {
                result_set.append("<h3>Books</h3>");
                result = result[0].values;
                for (var i = 0; i < result.length; i++) {
                    result_set.append("<a class='result' onclick='hd.get_sections(" + result[i][0] + ")' href='#'>" + result[i][1] + "</a>");
                }
            }

            //var name = db.exec("SELECT entry FROM dic_entries WHERE entry LIKE '" + keyword + "%' LIMIT 1");
            // contents is now [{columns:['col1','col2',...], values:[[first row], [second row], ...]}]
            //keyword = name[0].values[0][0];
            //this.show_image();
        }else{
            //this.show_image(true);
        }
        //this.show_suggestions();
    };/*
    this.show_image = function(replace_input){
        if (replace_input) $('#keyword').val(keyword);
        if (keyword != "") $("#result").attr("src", img_src + keyword);
        else $("#result").attr("alt", "Word Doesn't Exist");
    };
    this.show_suggestions = function(){
        var suggestions = db.exec("SELECT entry FROM dic_entries WHERE entry LIKE '" + keyword.charAt(0) + "%'");
        suggestions = suggestions[0].values;
        // First delete all of the suggestions
        $("#suggestion").html("");
        var selectedClass = "";
        for(var i = 0; i < suggestions.length; i++){
            selectedClass = (suggestions[i][0] == keyword) ? " selected" : "";
            $("#suggestion").html("<div class='word" + selectedClass + "' onclick=\"$('#keyword').val($(this).html());dict.show_result($(this).html());$('#otd').hide()\">" + suggestions[i][0] + "</div>");
        }
        // Scroll to the selected query
        $("#suggestion").scrollTop($("#suggestion .selected").index()*20);
    };*/
    this.get_books = function(){
        var books = db.exec("SELECT BookID, BookNameBD FROM hadithbook WHERE 1");
        books = books[0].values;
        $("#books").append("<option selected disabled>বই সমূহ</option>");
        for(var i = 0; i < books.length; i++)
            $("#books").append("<option value=" + books[i][0] + ">" + books[i][1] + "</option>");
    };
    this.get_sections = function(bookId){
        book_id = bookId;
        var sections = db.exec("SELECT SectionID, SectionBD FROM hadithsection WHERE BookID=" + book_id);
        sections = sections[0].values;
        $("#sections").html("");
        for(var i = 0; i < sections.length; i++)
            $("#sections").append("<div class='word' id='section-" + sections[i][0] + "' onclick='hd.get_hadiths(" + sections[i][0] + ");'>" + sections[i][1] + "</div>");
        this.get_hadiths(sections[0][0]);
    };/*
    this.get_chapters = function(sectionId){
        section_id = sectionId;
        var chapters = db.exec("SELECT chapID, ChapterBG FROM hadithchapter WHERE BookID="+ book_id +" AND SectionID=" + section_id);
        console.log("Debug: \nBook: " + book_id + "\nSection: " + section_id + "\nChapters: " + chapters);
        chapters = chapters[0].values;
        // First delete all of the suggestions
        $("#chapters").html("");
        for(var i = 0; i < chapters.length; i++){
            $("#chapters").append("<div class='word' id='chapter-" + chapters[i][0] + "' onclick='hd.get_hadiths(" + chapters[i][0] + ");'>" + chapters[i][1] + "</div>");
        }
        // show default
        this.get_hadiths(chapters[0][0]);
    };*/
    this.get_hadiths = function(section_id){
        // select and go top
        $("#sections .selected").removeClass("selected");
        $("#section-" + section_id).addClass("selected");
        $("#sections").scrollTop($("#sections .selected").index()*20);
        var hadiths = db.exec("SELECT HadithID, HadithNo, ArabicHadith, BanglaHadith, HadithNote, HadithStatus  FROM hadithmain WHERE BookID=" + book_id + " AND SectionID=" + section_id);
        hadiths = hadiths[0].values;
        $("#result_set").html("");
        $("#title").html("<h2>" + $("#section-" + section_id).html() + "</h2>");
        $(".result_set").height($(window).height()-$("#title").height()-85);
        for(var i = 0; i < hadiths.length; i++){
            if(hadiths[i][2] == null) hadiths[i][2] = "";
            $("#result_set").append("<div id='hadith-" + hadiths[i][0] + "' class='result' onclick='hd.set_hadith(" + hadiths[i][0] + ")'>" +
                "<a class='hadith-container' href='#hadith-" + hadiths[i][0] + "'>" +
                "<div class='arabic'>" + hadiths[i][2]+ "</div>" +
                "<div class='bangla'>" + hadiths[i][3] + "</div>" +
                "</a>" +
                "<div class='sharer'>" +
                    "<span class='add-space'><img class='icon' src='https://fbstatic-a.akamaihd.net/rsrc.php/v2/yQ/r/7GFXgco-uzw.png' onclick='popout(\"https://www.facebook.com/sharer/sharer.php?app_id=162752990790570&sdk=joey&u=http%3A%2F%2Fmuntashirakon.github.io%2FBanglaHadith%2F%23hadith-" + hadiths[i][0] + "&display=popup&ref=plugin&src=share_button\", \"Share on Facebook\",320,480);'></span>" +
                    "<span class='add-space'><img class='icon' src='https://g.twimg.com/dev/documentation/image/Twitter_logo_blue_16.png' onclick='popout(\"https://twitter.com/intent/tweet?url=http%3A%2F%2Fmuntashirakon.github.io%2FBanglaHadith%2F%23hadith-" + hadiths[i][0] + "&original_referer=http%3A%2F%2Fmuntashirakon.github.io%2FBanglaHadith%2F\", \"Share on Twitter\",320,480);'></span>" +
                    "<span class='add-space'><img class='icon' src='https://developers.google.com/+/images/branding/g+138.png' onclick='popout(\"https://plus.google.com/share?url=http%3A%2F%2Fmuntashirakon.github.io%2FBanglaHadith%2F%23hadith-" + hadiths[i][0] + "\", \"Share on Google Plus\",320,480);'></span>" +
                    "<span><img class='icon' src='https://lh5.ggpht.com/UBlRm4P7TJ8GAxA53sAGZJMrL2tPzRbdDe0nk4aw_7ktdh_hYGhUuvjtx8xC4Uk8uyWr=w300' onclick='$(\"#share-" + hadiths[i][0] + "\").toggle();'></span>" +
                    "<div style='display: none;' id='share-" + hadiths[i][0] + "'><input class='form-control' type='text' value='http://muntashirakon.github.io/BanglaHadith/#hadith-" + hadiths[i][0] +"' onClick='this.select()' /></div>" +
                "</div>" +
                "</div>");
        }
    };
    this.get_hadith = function(hadith_id){
        var hadith;
        if(hadith_id === undefined) // generate a random hadith
            hadith = db.exec("SELECT HadithID, HadithNo, ArabicHadith, BanglaHadith, HadithNote, HadithStatus FROM hadithmain WHERE BookID!=15 ORDER BY RANDOM() LIMIT 1");
        else
            hadith = db.exec("SELECT HadithID, HadithNo, ArabicHadith, BanglaHadith, HadithNote, HadithStatus FROM hadithmain WHERE HadithID=" + hadith_id);
        hadith = hadith[0].values;
        if(hadith[0][2] == null) hadith[0][2] = "";
        $("#result_set").append("<a id='hadith-" + hadith[0][0] + "' class='result' href='#hadith-" + hadith[0][0] + "'>" +
            "<div class='arabic'>" + hadith[0][2]+ "</div>" +
            "<div class='bangla'>" + hadith[0][3] + "</div>" +
            "</a>");
        return hadith[0][0]; // Hadith ID
    };
    this.set_hadith = function(hadith_id){
        $(".result").removeClass("selected");
        $("#hadith-" + hadith_id).addClass("selected");
    };
    this.get_url = function(){  // returns 0 if false and HadithId if otherwise
        var url = document.documentURI;
        url = url.split('#');
        if(url[1] == undefined) return 0;
        url = url[1];
        url = url.replace("hadith-", "");
        $("#title").html("");
        return this.get_hadith(url);
    };
    this.gen_hotd = function(){
        var cookie = new Cookie();
        var today = (new Date()).getDay();
        var otd;
        //db = this.db_connect();
        if(cookie.get("d") == today) {
            otd = cookie.get("hotd");
            this.get_hadith(otd);
        }else{
            var expire = 24*60*60;
            otd = this.get_hadith();
            cookie.set("hotd", otd, expire);
            cookie.set("d", today, expire);
        }
    };
};

var Cookie = function(){
    this.set = function(name, value, expire) {
        var d = new Date();
        d.setTime(d.getTime() + (expire*1000));
        expire = "expires="+d.toUTCString();
        document.cookie = name + "=" + value + "; " + expire;
    };
    this.get = function(name) {
        name = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    };
};


var hd = new Hadith();
//dict.db_connect();
$(document).ready(function(){
    var nav_height =  $(".navbar-fixed-top").height() + 5;
    $("#container").css("padding-top", nav_height);
    var w_height = $(window).height();
    $("#sections").height(w_height-nav_height-$("#books").height()-8);
    $(".result_set").height($(window).height()-$("#title").height()-85);
    //$("#suggestion").width($("#keyword").width());
    
    var db_src = "/hadith/hadith.db";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', db_src, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
        hd.db_connect(this.response);
        hd.get_books();
        if(hd.get_url() == 0) hd.gen_hotd();
        else $(".result_set").height($(window).height()-76);
        // have to set after hd.get_books();
        $("#sections").width($("#books").width());
    };
    xhr.send();
});
