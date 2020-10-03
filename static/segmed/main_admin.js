var eventWill;
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    eventWill = "touchstart";
} else {
    eventWill = "click";
}

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
        url: "/segmed.ai/getImg",
        dataType : "json",
        data : {idUsuario: idUsuario},
        type : "post",
        async : true,
        beforeSend : function (){
        },
        complete : function (){
        }, 
        success : function (resp) {
        	var cad = '', i=0; keys = Object.keys(resp.Img);
        	for(i=0;i<keys.length;i++) {
        		cad=cad+'<div class="col-4 col-md-4 col-sm-4 grid-margin stretch-card"><div class="card"><div class="card-body"> <img style="width:100%;min-width: 250px;" class="loadingImg" S3url="'+resp.Img[keys[i]].S3url+'" src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==" /> </div></div>';	
        	}
        	$("#wrapper-images").html(cad);
        	downloadFromAWS();
     	}
     });
}

function viewImagesMenu() {
	$("#main-panel").html('<div class="content-wrapper"><div class="row"><div class="col-12 col-md-12 col-sm-12 grid-margin stretch-card"><div class="card"><div class="card-body"><h3>Select a user</h3><select id="selectUser" style="font-size:18px;"></select><br><div id="wrapper-images"></div></div></div></div></div></div>');
	$.ajax({
        url: "/segmed.ai/listUsers",
        dataType : "json",
        data : {},
        type : "post",
        async : true,
        beforeSend : function (){
        },
        complete : function (){
        }, 
        success : function (resp) {
        	var cad = '', i = 0, keys = Object.keys(resp.Users);
        	var first = true;
        	var idUsuario = 0;
        	for(i=0;i<keys.length;i++) {
        		if(first){
        			first = false;
					idUsuario = resp.Users[keys[i]].IdUsuario;
        		}
        		cad=cad+'<option value="'+resp.Users[keys[i]].IdUsuario+'">'+resp.Users[keys[i]].Name+' '+resp.Users[keys[i]].Email+'</option>';
        	}
        	$("#selectUser").html(cad);
        	chargeImages(idUsuario);
        }
    });    
}

$(document).on("change","#selectUser", function(e) {
	chargeImages($(this).val());
});   

$(document).on(eventWill,"#viewImagesMenu", function(e) {
	viewImagesMenu();
});
viewImagesMenu();