/* global $ moment */
var i, argFolders, signature, sigFormula, title, keywordFilter, itemName, format, pageSize, URI, URIlink, itemImage, divOutWrap, divWrap, divMeta;

/* ***************************************** */
/*          Global Variables/Constants       */
/* ***************************************** */
const apiKey = '';  /* please use your own at: https://issuu.com/home/settings/apikey */
const apiSecret = ''; /* please use your own at: https://issuu.com/home/settings/apikey */
const endpoint = 'https://api.issuu.com/1_0?';
const pageBlock = '#pages'; // the ID of the pagination //pagination(total, items, page)
const listingBlock = '#stream-list';
const publicationsWrap = '#publications-wrap';
format = 'json'; // 'json' || 'xml'
keywordFilter = 'Journal';


/* ************************************* */
/*           Listing Folders             */
/* ************************************* */
/* https://developers.issuu.com/managing-your-publications/folders/list/ */
function getFolders(arg) {
  var descriptionData, description, folderName, createdData, usernameData, folderString, items;
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
      var filter = folderName.includes(keywordFilter);
      //if (items !== 0) {
      //if (filter == true) {
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
    //}
    $(listingBlock + '-folder').show();
    $(publicationsWrap).show();
    $(listingBlock).show();
  }, "json");
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

  folderSort = $('#stackSort').val();
  resultOrder = $('#stackOrder').val();
  pageSize = qty;
  start = 0;
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
  getFolders(argFolders);
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
/*           Document Ready              */
/*    Runs code once page is loaded      */
/* ************************************* */
$(document).ready(function () {
  var qty;
  qty = 25;
  loadLists(qty);
});
