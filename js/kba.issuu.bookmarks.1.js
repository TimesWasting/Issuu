/* global $ moment */
var i, arg, argFolders, argPublications, totalCount, signature, sigFormula, documentStates, documentSortBy, published, cover, title, titleData, description, descriptionData, folderSortBy, row,
  action, keywordFilter, itemName, format, pageSize, startIndex, URI, URIlink, full_url, str, volume, itemImage, access, responseParams, resultOrder, divOutWrap, divWrap, divMeta, name, nameData, orgDocName, pageCount, bookmarkId;


/* ***************************************** */
/*          Global Variables/Constants       */
/* ***************************************** */
const apiKey = '78zlafx4x3pgyed8ebyeqz276s4p40lw';
const apiSecret = 'vf8ojy3rzn71r2af8ioqdycg1x8i4yr6';
const endpoint = 'https://api.issuu.com/1_0?';
const publisher = 'KSBar';
const pageBlock = '#pages'; // the ID of the pagination //pagination(total, items, page)
const listingBlock = '#stream-list';
const publicationsWrap = '#publications-wrap';
format = 'json'; // 'json' || 'xml'
keywordFilter = 'Journal';


/* ************************************* */
/*       Listing Bookmark Items          */
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
    //access: access, // public, || private,
    format: format,
    pageSize: 4, //default is 10; 30 is max to return (how many items to return)
    resultOrder: "desc", // asc || desc
    bookmarkSortBy: "name",
    startIndex: 0,
    folderId: folderItem,
    responseParams: '' //"created,description,bookmarkId,items,name,username"
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
    console.log('API Bookmarks Data: \n' + data);
    //return (data);

    centerer = document.createElement('span');
    centerer.setAttribute('class', 'centerer');
    hoverer = document.createElement('span');
    hoverer.setAttribute('class', 'hoverer');
    coverSet = document.createElement('span');
    coverSet.setAttribute('class', 'cover-wrap ready');
    coverSet.setAttribute('id', 'img' + folderIdNew);

    i = arg.pageSize;
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

  }, 'json');
}

/* **************************************** */
/*  Listing Publications From One Bookmark  */
/* **************************************** */
function getBookmarks(start, pageQty, folderItem) {
  $(pageBlock).empty();
  $(publicationsWrap).empty();

  arg = {
    apiKey: apiKey,
    action: 'issuu.bookmarks.list',
    access: access, // public, || private,
    format: format,
    pageSize: pageQty, //default is 10; 30 is max to return (how many items to return)
    resultOrder: 'desc', // asc || desc
    bookmarkSortBy: 'name',
    startIndex: 0,
    folderId: folderItem,
    responseParams: '' //'created,description,bookmarkId,items,name,username'
  };

  URIlink = getSignature(arg);

  var itemsListed = arg.pageSize;

  $.get(URIlink).done(function (data) {
    console.log("API Publication data:");
    console.log(data);
    var pagesDiv, totalCount, divID, category, username, documentIdData, documentId, folderString, folderId, pageCountData, pubDate1, pubDate2, pubDate3, pubDate4, pubDate5, pubDate6;

    pagesDiv = document.createElement('a');
    //pagesDiv.setAttribute('href', 'http://www.ksbar.org/');
    folderId = [];
    startIndex = data.rsp._content.result.startIndex;
    totalCount = data.rsp._content.result.totalCount;
    for (i = 0; i < totalCount; i++) {
      divID = "current-issue_Journal_Journal";
      nameData = data.rsp._content.result._content[i].bookmark.name;
      published = data.rsp._content.result._content[i].bookmark.publishDate;
      pageCountData = data.rsp._content.result._content[i].bookmark.pageCount;
      titleData = data.rsp._content.result._content[i].bookmark.title;
      descriptionData = data.rsp._content.result._content[i].bookmark.description;
      documentIdData = data.rsp._content.result._content[i].bookmark.documentId;
      folderString = data.rsp._content.result._content[i].bookmark.folders;
      //categoryData = data.rsp._content.result._content[i].bookmark.category;
      username = data.rsp._content.result._content[i].bookmark.username;

      published = moment.tz(published, 'US/Central').add(1, 'days').format('MMMM Do, YYYY');

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
      divMeta.setAttribute('style', 'flex-grow: 2; width: 100%;');
      cover = document.createElement('img');
      cover.src = 'https://image.issuu.com/' + documentIdData + '/jpg/page_1.jpg';
      cover.setAttribute('class', 'cover');
      cover.setAttribute('style', '');

      name = document.createElement('p');
      name.innerHTML = nameData;

      var archiveBlock = document.createElement('div');
      archiveBlock.setAttribute('style', 'display: inline-block; margin-right: 10px;');
      archiveBlock.setAttribute('class', '');

      var linkText = document.createTextNode('Archives');
      var archives = document.createElement('a');
      archives.setAttribute('class', 'btn btn-default pull-right');
      archives.setAttribute('target', '_blank');
      archives.appendChild(linkText);
      archives.href = '/page/journal_archives';
      //archives.innerHTML = '<a href="/page/journal_archives" target="_blank">Archives</a>';

      title = document.createElement('h3');
      title.setAttribute('class', 'title');
      title.innerHTML = '<a href="https://issuu.com/' + username + '/docs/' + nameData + '" target="_blank">' + titleData + '</a>';

      description = document.createElement('p');
      description.setAttribute('class', 'jrnl-description');
      description.innerHTML = descriptionData;

      // pageCount = document.createElement('p');
      // pageCount.innerHTML = '<span class="bold">Pages:</span> ' + pageCountData;

      $(publicationsWrap).append(listingBlockEl);
      $(listingBlockEl).append(divOutWrap);
      $(divOutWrap).append(divWrap);
      $(divWrap).append(cover);
      (divWrap).append(divMeta);
      $(divMeta).append(title);
      $(divMeta).append(description);
      $(divMeta).append(documentId);
      $(divMeta).append(pageCount);

      $(divMeta).append('<b>Published:</b> ' + published + '<br><br>');
      $(divWrap).append(archiveBlock);
      //$(archiveBlock).append(archives);
    }
    $(listingBlock + '-folder').show();
    $(publicationsWrap).show();
    $(listingBlock).show();

  }, 'json');
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
    totalCount = data.rsp._content.result.totalCount;

    if (pageSize > totalCount) {
      pageSize = totalCount;
    }
    console.log('pageSize = ' + pageSize);
    console.log('count = ' + totalCount);
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
      //console.log(itemImage);
      var filter = folderName.includes(keywordFilter);
      //if (items !== 0) {
      if (filter === true) {
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
    //volumeOption.apply(this, [itemGroup]); // ([itemGroup] with brackets sends entire array)
    $(listingBlock + '-folder').show();
    $(publicationsWrap).show();
    $(listingBlock).show();
  }, 'json');
}

/* ************************************* */
/*             Load Lists                */
/*                                       */
/* ************************************* */
function loadLists(qty) {
  var folderSort, resultOrder, start;
  qty = $('#publication-count').val();
  access = $('#access').val(); // private || public
  $(listingBlock + '-folder').hide().empty();
  $(listingBlock + '-bookmarks').hide().empty();
  $(publicationsWrap).empty();
  $(pageBlock).hide().empty();

  folderSort = $('#stackSort').val();
  resultOrder = $('#stackOrder').val();
  pageSize = qty;
  start = 0;
  //alert(pageSize);
  argFolders = {
    apiKey: apiKey,
    action: 'issuu.folders.list',
    access: access, // public || private
    format: format,
    pageSize: pageSize, //default is 10; 30 is max to return
    resultOrder: resultOrder, // asc || desc
    folderSortBy: folderSort,
    startIndex: start,
    responseParams: '' //"created,description,folderId,items,name,username"
  };
  console.log('Access: ' + access);
  //var folderId = 'b55bebcd-a8e8-455b-8683-36c3dc7dc08a'; // Journals
  //folderId = '6c8bcc48-8239-400c-a429-e9702dfaca60'; //Journal 2017

  getFolders(argFolders);
  //getPublications(start, pageSize);
  //getFeed(folderId);
}

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
  URI += '&signature=' + signature;
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
/*           Document Ready              */
/*    Runs code once page is loaded      */
/* ************************************* */
$(document).ready(function () {
  var qty, start, pageSize, folderItem;
  qty = 10;
  pageSize = $('#publication-count').val();
  start = 0;
  folderItem = '8deae91d-c394-4254-914e-3656ff604e5d'; // "All Journals"
  getBookmarks(start, pageSize, folderItem);
  loadLists(qty);

});
