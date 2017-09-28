/* global $ moment */
var i, arg, argFolders, argPublications, signature, sigFormula, documentStates, documentSortBy, published, cover, title, titleData, description, descriptionData, folderSortBy, row,
  action, keywordRequire, keywordExclude, allowEmpty, itemName, format, pageSize, startIndex, URI, URIlink, full_url, str, volume, itemImage, access, responseParams, resultOrder, divOutWrap, divWrap, divMeta, name, nameData, orgDocName, pageCount, bookmarkId;


/* ***************************************** */
/*          Global Variables/Constants       */
/* ***************************************** */
const apiKey = 'xvzi2sp3ho8bsfa9lgh9lc04xukltas4';  /* please use your own at: https://issuu.com/home/settings/apikey */
const apiSecret = 'ughisr4bnhm1yus5ohlw1mhwx31wwgge'; /* please use your own at: https://issuu.com/home/settings/apikey */
const endpoint = 'https://api.issuu.com/1_0?';
const publisher = 'KSBar';
const pageBlock = '#pages'; // the ID of the pagination //pagination(total, items, page)
const listingBlock = '#stream-list';
const publicationsWrap = '#publications-wrap';
format = 'json'; // 'json' || 'xml'
access = '';
keywordRequire, keywordExclude = [], [];
keywordRequire = ['Journal'];
keywordExclude = ['Public'];
allowEmpty = true; // true || false

/* ************************************* */
/*           Bookmarks Listing           */
/* ************************************* */
/* https://developers.issuu.com/managing-your-publications/folders/list/ */
function bookmarkImage(folderId, start, qty) {
  console.log("Bookmarks: " + folderId);
  var current;
  for (row in folderId) {
    current = folderId[row];

    //console.log("folderItem (bookmarks): " + current);
    requestCovers(current);
  }
}

function requestCovers(folderItem) {
  //console.log("requestCovers: " + folderItem);
  arg = {
    apiKey: apiKey,
    action: "issuu.bookmarks.list",
    access: "public",
    format: format,
    pageSize: 4, //default is 10; 30 is max to return (how many items to return)
    resultOrder: "desc", // asc || desc
    bookmarkSortBy: "name",
    startIndex: 0,
    folderId: folderItem,
    responseParams: "" //"created,description,bookmarkId,items,name,username"
  };

  URIlink = getSignature(arg);
  //console.log("requestCovers2: " + folderItem);
  getData(URIlink, folderItem);
}


function getData(URIlink, folderId) {
  var folderIdNew, coverSet, i, centerer, hoverer, count, divID, descriptionData, description, divFolder, name, itemsData, nameData, createdData, usernameData, documentIdData, items, itemCount;
  folderIdNew = folderId;

  $.get(URIlink).done(function (data) {
    //console.log("requestCovers3: " + folderIdNew);
    console.log("API Bookmarks Data:");
    console.log(data);
    //return (data);
    i = arg.pageSize;
    centerer = document.createElement('span');
    centerer.setAttribute('class', 'centerer');
    hoverer = document.createElement('span');
    hoverer.setAttribute('class', 'hoverer');
    coverSet = document.createElement('span');
    coverSet.setAttribute('class', 'cover-wrap ready');
    coverSet.setAttribute('id', 'img' + folderIdNew);
    count = data.rsp._content.result.totalCount;
    if (count < i && count > 0) {
      i = count;
    }
    for (i -= 1; i >= 0; i--) {

      title = data.rsp._content.result._content[i].bookmark.title;
      createdData = data.rsp._content.result._content[i].bookmark.created;
      usernameData = data.rsp._content.result._content[i].bookmark.username;
      descriptionData = data.rsp._content.result._content[i].bookmark.description;
      items = data.rsp._content.result._content[i].bookmark.items;
      documentIdData = data.rsp._content.result._content[i].bookmark.documentId;
      divFolder = $('[data-stack-wrap="' + folderIdNew + '"]');
      divID = "bookmark-" + documentIdData;
      //console.log('totalCount = ' + data.rsp._content.result.totalCount);
      //console.log('stackid = ' + folderIdNew);
      //console.log('title = ' + title);

      cover = document.createElement('img');
      cover.src = 'https://image.issuu.com/' + documentIdData + '/jpg/page_1_thumb_large.jpg';
      cover.setAttribute('class', 'cover-tn cover-' + i);
      cover.setAttribute('id', divID);

      //$(centerer).append(hoverer);
      //$(hoverer).append(cover);

      $(coverSet).append(cover);
      $(cover).wrap('<span class="centerer">').wrap('<span class="hoverer">');
      $(divFolder).append(coverSet);

    }

  }, "json");
}

/* ************************************* */
/*           Listing Folders             */
/* ************************************* */
/* https://developers.issuu.com/managing-your-publications/folders/list/ */
function getFolders(arg) {
  var x, el, itemGroup, divID, folderId, descriptionData, description, folderName, name, createdData, usernameData, folderString, items, itemCount;
  itemImage = [];
  itemName = [];

  pageSize = arg.pageSize;
  URIlink = getSignature(arg);
  $.get(URIlink).done(function (data) {
    console.log("API Folder Data:");
    console.log(data);
    var count = data.rsp._content.result.totalCount;

    if (pageSize > count) {
      pageSize = count;
    }
    console.log('pageSize = ' + pageSize);
    console.log('count = ' + count);
    for (i = 0; i < pageSize; i++) {
      divID = "#issuu-div-folder-" + i;

      folderName = data.rsp._content.result._content[i].folder.name;
      createdData = data.rsp._content.result._content[i].folder.created;
      usernameData = data.rsp._content.result._content[i].folder.username;
      descriptionData = data.rsp._content.result._content[i].folder.description;
      items = data.rsp._content.result._content[i].folder.items;
      folderString = data.rsp._content.result._content[i].folder.folderId;

      createdData = moment(createdData).format("MMMM Do, YYYY");
      divOutWrap = document.createElement('div');
      divOutWrap.setAttribute('id', folderString); //divID
      divOutWrap.setAttribute('class', 'publication');
      divOutWrap.setAttribute('data-stackid', folderString);
      divWrap = document.createElement('div');
      // divWrap.setAttribute('id', divID);
      divWrap.setAttribute('class', 'publication-content');
      divWrap.setAttribute('data-stack-wrap', folderString);
      divMeta = document.createElement('div');
      divMeta.setAttribute('class', 'metadata padding');

      title = document.createElement('h3');
      title.setAttribute('class', 'title');
      title.innerHTML = '<a href="https://issuu.com/' + usernameData + '/stacks/' + trim(folderString) + '" target="_blank">' + folderName + '</a>';
      description = document.createElement('p');
      description.setAttribute('class', 'description');
      if (!descriptionData || descriptionData === undefined) {
        description.innerHTML = '<i>No description provided</i>';
      }
      else {
        description.innerHTML = descriptionData;
      }

      itemImage.push(folderString);
      itemName.push(folderName);
      /* Example: itemImage([item, desc, cost, itemNum]); */
      //console.log('itemImage1: ');
      console.log(items);
      var filter = folderName.includes(keywordRequire);
      var exclude0 = folderName.includes(keywordExclude[0]);
      var exclude1 = folderName.includes(keywordExclude[1]);
      console.log(folderName +
        '\nRequired: ' + filter +
        '\nExclude 0: ' + exclude0 +
        '\nExclude 1: ' + exclude1);
      var test = filter == true && (exclude0 === false) && (exclude1 === false);
      console.log(test);
      //if (items !== 0) {
      if (test === true) {
        $(listingBlock + '-folder').append(divOutWrap);
        $(divOutWrap).append(divWrap);

        $(divWrap).append(divMeta);
        $(divMeta).append(title);
        $(divMeta).append(' <b>Created:</b> ' + createdData + '<br>');
        if (items == 1) {
          $(divMeta).append(items + ' item');
        }
        else {
          $(divMeta).append(items + ' items');
        }
        $(divMeta).append(description);
      }
      //}
    }
    console.log('items: ' + items);
    if (items !== 0) {
      console.log('itemName: ' + itemName);
      bookmarkImage.apply(this, [itemImage]);
    }
    // making array of objects for dropdown menu

    itemGroup = [];
    for (x = 0; x < itemName.length; x++) {
      el = {
        'value': itemImage[x],
        'text': itemName[x]
      };
      // pushing objects into array
      itemGroup.push(el);
    }
    // sending array of objects to create dropdown menu
    volumeOption.apply(this, [itemGroup]); // ([itemGroup] with brackets sends entire array)
  }, "json");
}

/* ************************************* */
/*         Create Options List           */
/* ************************************* */
/* https://stackoverflow.com/questions/6601952/programmatically-create-select-list */
function volumeOption(folder) {
  //console.log('folder: ' + folder);
  var sel = $('<select>').attr('id', 'pub-options').attr('style', 'margin: 0 0 10px;').prependTo(publicationsWrap);
  $(folder).each(function () {
    sel.append($("<option>").attr('value', this.val).text(this.text));
  });
}

/* ************************************* */
/*         Listing Publications          */
/* ************************************* */
/* http://developers.issuu.com/signing-requests/ */

function getPublications(start, pageQty, pageNum) {
  $(pageBlock).empty();
  $(publicationsWrap).empty();

  arg = {
    apiKey: apiKey,
    startIndex: start,
    access: access,
    action: 'issuu.documents.list',
    documentSortBy: 'publishDate',
    documentStates: 'A', // A, F, P
    format: format,
    resultOrder: 'desc', // "asc"; || "desc";
    pageSize: pageQty, //default is 10; 30 is max to return
    responseParams: "" // "description,documentId,folders,name,orgDocName,pageCount,publicationId,publishDate,title,tags,views";
  };

  URIlink = getSignature(arg);

  var itemsListed = arg.pageSize;

  $.get(URIlink).done(function (data) {
    console.log("API Publication data:");
    console.log(data);
    var pagesDiv, totalCount, divID, tags, username, documentIdData, documentId, folderString, folderId, pageCountData, pubDate1, pubDate2, pubDate3, pubDate4, pubDate5, pubDate6;

    totalCount = data.rsp._content.result.totalCount;
    console.log('totalCount: ' + totalCount);

    pagesDiv = document.createElement('a');
    //pagesDiv.setAttribute('href', 'http://www.ksbar.org/');
    folderId = [];
    for (i = 0; i < itemsListed; i++) {
      divID = "#issuu-div-pub" + i;
      nameData = data.rsp._content.result._content[i].document.name;
      published = data.rsp._content.result._content[i].document.publishDate;
      pageCountData = data.rsp._content.result._content[i].document.pageCount;
      titleData = data.rsp._content.result._content[i].document.title;
      descriptionData = data.rsp._content.result._content[i].document.description;
      documentIdData = data.rsp._content.result._content[i].document.documentId;
      folderString = data.rsp._content.result._content[i].document.folders;
      //categoryData = data.rsp._content.result._content[i].document.category;
      username = data.rsp._content.result._content[i].document.username;
      startIndex = data.rsp._content.result.startIndex;

      pubDate1 = published.toString();
      pubDate2 = published.substring(0, 10);
      pubDate3 = moment(published).format('MMMM Do, YYYY, h:mm:ss a'); // May 12th 2017, 5:04:42 pm
      pubDate4 = moment.tz(published, 'US/Central').format('MMMM Do, YYYY');
      pubDate5 = moment(published).add(0, 'days').calendar();
      published = pubDate4;

      var listingBlockEl = document.createElement('div');
      listingBlockEl.setAttribute('class', 'stream-list');
      divOutWrap = document.createElement('div');
      divOutWrap.setAttribute('id', divID);
      divOutWrap.setAttribute('class', 'publication');
      divWrap = document.createElement('div');
      // divWrap.setAttribute('id', divID);
      divWrap.setAttribute('class', 'publication-content');
      divMeta = document.createElement('div');
      divMeta.setAttribute('class', 'metadata');
      cover = document.createElement('img');
      cover.src = 'https://image.issuu.com/' + documentIdData + '/jpg/page_1.jpg';
      cover.setAttribute('class', 'cover');
      cover.setAttribute('style', '');

      name = document.createElement('p');
      name.innerHTML = nameData;

      title = document.createElement('h3');
      title.setAttribute('class', 'title');
      title.innerHTML = ' <a href="https://issuu.com/' + username + '/docs/' + nameData + '" target="_blank">' + titleData + '</a>';

      description = document.createElement('p');
      description.setAttribute('class', 'description');
      description.innerHTML = descriptionData;

      pageCount = document.createElement('span');
      pageCount.innerHTML = pageCountData;

      $(publicationsWrap).append(listingBlockEl);
      $(listingBlockEl).append(divOutWrap);
      $(divOutWrap).append(divWrap);
      $(divWrap).append(cover);
      $(divWrap).append(divMeta);
      $(divMeta).append(title);
      $(divMeta).append(description);
      $(divMeta).append(documentId);
      $(documentId).append(pageCount);

      $(divMeta).append(' <b>Published:</b> ' + published + '<br><br>');
      $(divMeta).append(' <b>Tags:</b> ' + tags + '<br>');

      if (!folderString || folderString === undefined) {
        //folderId = '';
      }
      else {
        $(divMeta).append(' <b>Folders:</b>');
        for (var x = 0; x < folderString.length; x++) {
          $(divMeta).append('<a href="https://issuu.com/' + username + '/stacks/' + trim(folderString[x]) + '" target="_blank">' + folderString[x] + '</a>');
        }
        tags = [];
      }
    }
    $(listingBlock + '-folder').show();
    $(publicationsWrap).show();
    $(listingBlock).show();

    pageNum = startIndex / pageSize;
    console.log('pageNum = ' + pageNum);
    pagination(totalCount, itemsListed, pageNum);

    $('.page-nav').click(function (e) {
      //e.preventDefault(); // Enable if you don't want page to jump to top.
      var page = $(this).data('page-nav') * pageSize;
      getPublications(page, pageSize);
    });
  }, "json");
}


/* ************************************* */
/*             Add Pagination            */
/* ************************************* */
function pagination(total, items, page) {
  var className, pageDataSelector;
  console.log('page = ' + page);
  i = 0;
  if (total > (items * i)) {
    $(pageBlock).append('<a href="#publications" data-page-nav="0" id="pg0" class="page-nav">&laquo;</a>');

    for (i; total > (items * i); i++) {
      if (page === i) {
        className = 'page-nav active';
      }
      else {
        className = 'page-nav';
      }
      pageDataSelector = 'data-page-nav="' + i + '"';
      $(pageBlock).append('<a href="#publications" ' + pageDataSelector + ' id="pg' + i + '" class="' + className + '">' + i + '</a>');
    }
    $(pageBlock).append('<a href="#publications" data-page-nav="' + i + '" id="pg' + i + '" class="' + className + '">&raquo;</a>');
  }
  $(pageBlock).show();
}

/* ************************************* */
/*            Get RSS Feed               */
/*       Gets RSS feed using API         */
/* ************************************* */
function getFeed(arg) {
  URIlink = 'https://feed.issuu.com/folder/' + arg + '/rss20.jsonp';
  $.ajax({
    url: URIlink
  }).done(function (data) {
    document.geElementById('#rss - example').append(data);
  });
}

/* ************************************* */
/*            Search Docs                */
/*       Searches Doc using API          */
/* ************************************* */
$(function () {
  $('form[name=searchDocs]').submit(function (e) {
    e.preventDefault(); // 
    var formData = $('form[name=new_post]').serialize();
    $.ajax({
      type: 'GET',
      dataType: 'jsonp',
      url: 'https://search.issuu.com/api/2_0/document?callback=?',
      data: formData,
      jsonpCallback: 'localJsonpCallback',
      /* success: function (json) {
        alert('Success ' + json);
      },
      error: function (json) {
        alert('Error ');
      } */
    });

    function localJsonpCallback(json) {
      if (!json.Error) {
        $('#resultForm').submit();
      }
      else {
        $('#loading').hide();
        $('#userForm').show();
        alert(json.Message);
      }
    }
  });

  $('form[name=searchDocs]').submit(function () {
    $.get($(this).attr('action'), $(this).serialize(), function (json) {
      alert(json);
    }, 'json');
    return false;
  });
});

/* ************************************* */
/*            Get Signature              */
/*      Gets signature for API call      */
/* ************************************* */
function getSignature(arg) {
  const ordered = {}; // cont instead of var
  Object.keys(arg).sort().forEach(function (key) {
    ordered[key] = arg[key];
  });

  sigFormula = apiSecret;
  URI = endpoint;

  $.each(ordered, function (key, value) {
    sigFormula += key + value;
    URI += '&' + key + "=" + value;
  });

  signature = $.md5(sigFormula);
  URI += "&signature=" + signature;
  //console.log("URI Folder " + URI);
  return URI;
}

/* ************************************* */
/*            Trim String                */
/*      removes dashes from string       */
/* ************************************* */
function trim(str) {
  return str.toString().replace(/-/g, '');
}

/* ************************************* */
/*             Load Lists                */
/*                                       */
/* ************************************* */
function loadLists(qty) {
  var folderSort, resultOrder, start;

  $(listingBlock + '-folder').hide().empty();
  $(listingBlock + '-bookmarks').hide().empty();
  $(publicationsWrap).empty();
  $(pageBlock).hide().empty();

  qty = $('#publication-count').val();
  access = $('#access').val(); // private || public
  folderSort = $('#stackSort').val();
  resultOrder = $('#stackOrder').val();
  pageSize = qty;
  start = 0;
  //alert(pageSize);
  argFolders = {
    apiKey: apiKey,
    action: "issuu.folders.list",
    //access: "public", // public || private
    format: format,
    pageSize: pageSize, //default is 10; 30 is max to return
    resultOrder: resultOrder, // asc || desc
    folderSortBy: folderSort,
    startIndex: start,
    responseParams: '' //"created,description,folderId,items,name,username"
  };

  //var folderId = 'b55bebcd-a8e8-455b-8683-36c3dc7dc08a'; // Journals
  //folderId = '6c8bcc48-8239-400c-a429-e9702dfaca60'; //Journal 2017

  getFolders(argFolders);
  getPublications(start, pageSize);
  //getFeed(folderId);
}

/* ************************************* */
/*           Document Ready              */
/*    Runs code once page is loaded      */
/* ************************************* */
$(document).ready(function () {
  var qty;
  //qty = $('#publication-wrap').val();
  //alert(qty);
  $("#stackSort").on("change", loadLists);
  $("#stackOrder").on("change", loadLists);
  $("#publication-count").on("change", loadLists);
  $("#pub-options").on("change", loadLists);
  loadLists();
});
