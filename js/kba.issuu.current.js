/* global $ moment */
var i, arg, argFolders, argPublications, signature, sigFormula, documentStates, documentSortBy, published, cover, title, titleData, description, descriptionData, folderSortBy, row,
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


$("#stackSort").on("change", loadLists);
$("#stackOrder").on("change", loadLists);

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
    access: "public",
    action: "issuu.documents.list",
    documentSortBy: "publishDate",
    documentStates: "A", // A, F, P
    format: format,
    resultOrder: "desc", // "asc"; || "desc";
    pageSize: pageQty, //default is 10; 30 is max to return
    responseParams: "" // "description,documentId,folders,name,orgDocName,pageCount,publicationId,publishDate,title,tags,views";
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
    for (i = 0; i < itemsListed; i++) {
      divID = "current-issue_Journal_Journal";
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

      pageCount = document.createElement('p');
      pageCount.innerHTML = '<span class="bold">Pages:</span> ' + pageCountData;

      $(publicationsWrap).append(listingBlockEl);
      $(listingBlockEl).append(divOutWrap);
      $(divOutWrap).append(divWrap);
      $(divWrap).append(cover);
      (divWrap).append(divMeta);
      $(divMeta).append(title);
      $(divMeta).append(description);
      $(divMeta).append(documentId);
      $(divMeta).append(pageCount);

      $(divMeta).append(' <b>Published:</b> ' + published + '<br><br>');
      $(divWrap).append(archiveBlock);
      $(archiveBlock).append(archives);
    }
    $(listingBlock + '-folder').show();
    $(publicationsWrap).show();
    $(listingBlock).show();

  }, "json");
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
  qty = $('#publication-count').val();
  $(listingBlock + '-folder').hide().empty();
  $(listingBlock + '-bookmarks').hide().empty();
  $(publicationsWrap).empty();
  $(pageBlock).hide().empty();

  //folderSort = $('#stackSort').val();
  //resultOrder = $('#stackOrder').val();
  pageSize = 1;
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

  getPublications(start, pageSize);
}

/* ************************************* */
/*           Document Ready              */
/*    Runs code once page is loaded      */
/* ************************************* */
$(document).ready(function () {
  var qty;
  //qty = $('#publication-wrap').val();
  //alert(qty);

  loadLists();

});
