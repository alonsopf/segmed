var eventWill;
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    eventWill = "touchstart";
} else {
    eventWill = "click";
}
function searchByWord(word, page) {
	$.ajax({
        url: "/segmed.ai/searchByWord",
        dataType : "json",
        data : {word: word,page:page},
        type : "post",
        async : true,
        beforeSend : function (){
        },
        complete : function (){
        }, 
        success : function (resp) {
        	var cad = '<div class="content-wrapper"><div class="row"><div class="col-12 col-md-12 col-sm-12 grid-margin stretch-card"><div class="card"><div class="card-body"><h3>Search: '+word+'  page: '+page+'</h3></div></div></div></div><div class="row">';
        	var keys = Object.keys(resp.Photos);
        	for(i=0;i<keys.length;i++) {
				var desc = resp.Photos[keys[i]].Description;
				if(desc==""){desc="No title";} 
				var status = resp.Photos[keys[i]].Status;
				if(status=="0"){
					cad=cad+'<div class="col-4 col-md-4 col-sm-4 grid-margin stretch-card"><div class="card"><div class="card-body"><h4 class="card-title">'+desc+'</h4><p class="card-description">'+resp.Photos[keys[i]].Likes+' 👍</p><button idUnsplash="'+resp.Photos[keys[i]].UnsplashID+'" src="'+resp.Photos[keys[i]].Url+'" idImg="'+resp.Photos[keys[i]].ID+'" type="button" status="0" style="float:right;" class="btn btn-success btn-icon-text like"><i class="icon-like btn-icon-prepend"></i>I like it</button><br><br><img width="100%" src="'+resp.Photos[keys[i]].Url+'"></div></div></div>';	
				} else {
					cad=cad+'<div class="col-4 col-md-4 col-sm-4 grid-margin stretch-card"><div class="card"><div class="card-body"><h4 class="card-title">'+desc+'</h4><p class="card-description">'+resp.Photos[keys[i]].Likes+' 👍</p><button idUnsplash="'+resp.Photos[keys[i]].UnsplashID+'" src="'+resp.Photos[keys[i]].Url+'" idImg="'+resp.Photos[keys[i]].ID+'" type="button" status="1" style="float:right;" class="btn btn-warning btn-icon-text like"><i class="icon-dislike btn-icon-prepend"></i> dislike it</button><br><br><img width="100%" src="'+resp.Photos[keys[i]].Url+'"></div></div></div>';
				}
        		
        	}
        	var limitRight = parseInt(page) + 2;
        	if(limitRight>resp.TotalPages) {
        		limitRight=resp.TotalPages;
        	}
        	var limitLeft = parseInt(page) - 2;
        	if(limitLeft<1) {
        		limitLeft=1;
        	}
        	var i;
        	cad=cad+'<ul class="pagination d-flex justify-content-center pagination-success">';
        	add = ' style="display:none;" ';
        	if(limitLeft>1) {
        		add = "";
        	}
        	cad=cad+'<li class="page-item" id="moveLeftLi" '+add+'><a class="page-link" id="moveLeft" href="javasript:;"><i class="mdi mdi-chevron-left"></i></a></li>';
        	for(i=limitLeft;i<=limitRight;i++) {
        		add = "";
        		if(i==parseInt(page)) {
        			add = " active";
        		}
        		cad=cad+'<li class="page-item"><a word="'+word+'" page="'+i+'" class="page-link changePage '+add+'" href="javasript:;">'+i+'</a></li>';
        	}
        	add = ' style="display:none;" ';
        	
        	if(limitRight<resp.TotalPages) {
        		add = "";
        	}
        	cad=cad+'<li class="page-item" TotalPages="'+resp.TotalPages+'" id="moveRightLi" '+add+'><a class="page-link" id="moveRight" href="#"><i class="mdi mdi-chevron-right"></i></a></li>';        
            cad=cad+'</ul>  </div></div>';
        	$("#main-panel").html(cad);
       }
   });	
}
$(document).on(eventWill,".like", function(e) {
	var idUnsplash = $(this).attr("idImg");
	var urlImg = $(this).attr("src");
	var status = $(this).attr("status");
	var UnsplashID = $(this).attr("idUnsplash");
	
	var save = $(this);
	$.ajax({
        url: "/segmed.ai/like",
        dataType : "json",
        data : {idUnsplash: idUnsplash,urlImg:urlImg, status : status, UnsplashID : UnsplashID},
        type : "post",
        async : true,
        beforeSend : function (){
        },
        complete : function (){
        }, 
        success : function (resp) {
        	if(status=="0") {
        		status = "1";
        	} else {
        		status = "0";
        	}
        	$(save).attr("status",status);
        	if(status=="1") {
        		$(save).attr("class","btn btn-warning like");
        		$(save).html('<i class="icon-dislike btn-icon-prepend"></i> dislike it');
        	} else {
        		$(save).attr("class","btn btn-success like");
        		$(save).html('<i class="icon-like btn-icon-prepend"></i>I like it');
        	}
        }
    });
});

$(document).on(eventWill,".changePage", function(e) {
	searchByWord($(this).attr("word"),$(this).attr("page"));
});

$(document).on(eventWill,"#moveLeft", function(e) {
	var array = $(".changePage");
	var currentPage = 0;
	$("#moveRightLi").css("display","none");
	for(var i=0;i<$(array).length;i++) {
		currentPage = parseInt($($(array)[i]).html());
		if(currentPage>1){
			currentPage--;
		} else {
			$("#moveLeftLi").css("display","none");
		}
		$($(array)[i]).html(currentPage);
		$($(array)[i]).attr("page",currentPage);
	}
});
$(document).on(eventWill,"#moveRightLi", function(e) {
	var TotalPages = parseInt($(this).attr("TotalPages"));
	var array = $(".changePage");
	var currentPage = 0;
	$("#moveLeftLi").css("display","none");
	for(var i=0;i<$(array).length;i++) {
		currentPage = parseInt($($(array)[i]).html());
		if(currentPage<TotalPages){
			currentPage++
		} else {
			$("#moveRightLi").css("display","none");
		}
		$($(array)[i]).html(currentPage);
		$($(array)[i]).attr("page",currentPage);
	}
});
$(document).on(eventWill,"#searchMedicalMenu", function(e) {
	searchByWord("medical","1");
});

$(document).on(eventWill,"#searchDisabilityMenu", function(e) {
	searchByWord("disability","1");
});
$(document).on(eventWill,"#searchXRayMenu", function(e) {
	searchByWord("x ray","1");
});

$(document).on(eventWill,"#searchNurseMenu", function(e) {
	searchByWord("nurse","1");
});
function downloadFromAWS() {
	var array = $(".loadingImg");
	if($(array).length>0) {
		var first = $($(array)[0]);
		$.ajax({
	        url: "/segmed.ai/downloadImg",
	        dataType : "json",
	        data : {S3url: $(first).attr("S3url")},
	        type : "post",
	        async : true,
	        beforeSend : function (){
	        },
	        complete : function (){
	        }, 
	        success : function (resp) {
	        	$(first).attr("src","data:image/jpeg;base64,"+resp.Base64);
	        	$(first).attr("class","alreadyDownload");
	        	downloadFromAWS();
	        }
	    });
	}
}

function chargeImages(idUsuario) {
	$.ajax({
        url: "/segmed.ai/getImgUser",
        dataType : "json",
        data : {},
        type : "post",
        async : true,
        beforeSend : function (){
        },
        complete : function (){
        }, 
        success : function (resp) {
        	var cad = '', i=0; keys = Object.keys(resp.Img);
        	for(i=0;i<keys.length;i++) {        		
        		cad=cad+'<div class="col-4 col-md-4 col-sm-4 grid-margin stretch-card"><div class="card"><div class="card-body"><table><tbody><tr><td><button src="" idUnsplash="'+resp.Img[keys[i]].UnsplashID+'" idImg="'+resp.Img[keys[i]].IdImage+'" type="button" status="1" style="float:right;" class="btn btn-warning btn-icon-text like"><i class="icon-dislike btn-icon-prepend"></i> dislike it</button></td></tr><tr><td> <img style="width:100%;min-width: 250px;" class="loadingImg" S3url="'+resp.Img[keys[i]].S3url+'" src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==" /></td></tr></tbody></table></div></div></div>';	
        	}
        	$("#wrapper-images").html(cad);
        	downloadFromAWS();
     	}
     });
}

function viewImagesFavorites() {
	$("#main-panel").html('<div class="content-wrapper"><div class="row"><div class="col-12 col-md-12 col-sm-12 grid-margin stretch-card"><div class="card"><div class="card-body"><br><div id="wrapper-images"></div></div></div></div></div></div>');
    chargeImages();
}
$(document).on(eventWill,"#favoritesMenu", function(e) {
	viewImagesFavorites();
});

searchByWord("medical","1");