function actualizaGraficas(instrumentacion) {
  var scheme = document.location.protocol == "https:" ? "wss" : "ws";
  var port = document.location.port ? (":" + document.location.port) : "";
  var wsURL = scheme + "://" + document.location.hostname + port+"/ws";
  var socket = new Ws(wsURL)
  socket.OnConnect(function () {
    console.log("Status: Connected");
    //  output.innerHTML += "Status: Connected\n";
  });
  socket.OnDisconnect(function () {
    console.log("Status: Disconnected");
  //    output.innerHTML += "Status: Disconnected\n";
  });

  var data = [],
  totalPoints = 300 , min = 0, max = 20;
  $.ajax({
    url: "https://biv.mx/instrumento?instrumento="+instrumentacion,
    dataType : "json",
    type : "get",
    async : true,
    beforeSend : function (){},
    complete : function (){}, 
    success : function (resp){
      if(resp.success==1)
      {
      	$("."+instrumentacion+"_Value").attr("openValor",resp.open);
        min=8888888;//resp.min;
        max=0;//resp.max;
        var k =resp.rate.length-1-totalPoints;
        for(k=k;k<resp.rate.length;k++)
        {
          if(resp.rate[k].C>max)
          {
            max=resp.rate[k].C;
          }
          if(resp.rate[k].C<min)
          {
            min=resp.rate[k].C;
          }
        }
        if (data.length > 0)
        {
          data = data.slice(1);
        }
        var j=resp.rate.length-1-totalPoints;
        
        while (data.length < totalPoints) {
          data.push(resp.rate[j].C);
          j++;
        }
        var updateInterval = 1500;
        if ($("#"+instrumentacion).length) {
      		var plot = $.plot("#"+instrumentacion, [getData(instrumentacion)], {series: {shadowSize: 0 },xaxis: {show: false},grid: {borderWidth: 0,labelMargin: 10,hoverable: true,clickable: true,mouseActiveRadius: 6,}  });
      function update() {
      	plot = $.plot("#"+instrumentacion, [getData(instrumentacion)], {series: {shadowSize: 0 },xaxis: {show: false},grid: {borderWidth: 0,labelMargin: 10,hoverable: true,clickable: true,mouseActiveRadius: 6,}  });
        //plot.setData([getData(instrumentacion)]);
        // Since the axes don't change, we don't need to call plot.setupGrid()
        plot.draw();
        setTimeout(update, updateInterval);
      }
      update();
    }
      }//if del ajax main
    }
  });    
  socket.On("chat", function (msg) {
    var array = JSON.parse(msg);
    //output.innerHTML += array[0].C + "\n";
    if (data.length > 0)
    {
      data = data.slice(1);
    }
    var j = 0;
    while (data.length < totalPoints) {
      data.push(array[0].C);
      var open = parseFloat($("."+instrumentacion+"_Value").attr("openValor"));
      var pcent = (1 - array[0].C / open)*100;
      pcent = -1*Math.round(pcent * 100) / 100;
      $("."+instrumentacion+"_Value").html(array[0].C);
      $("."+instrumentacion+"_Span").html(pcent+"%");
      if(open>array[0].C) {
        $("."+instrumentacion+"_Value").removeClass("verde");
        $("."+instrumentacion+"_Value").addClass("rojo");
        $("."+instrumentacion+"_Span").removeClass("verde");
        $("."+instrumentacion+"_Span").addClass("rojo");
      } else {
        $("."+instrumentacion+"_Value").removeClass("rojo");
        $("."+instrumentacion+"_Value").addClass("verde");
        $("."+instrumentacion+"_Span").removeClass("rojo");
        $("."+instrumentacion+"_Span").addClass("verde");
      }
      j--;
    }///while
  });
  function getData(instrumentacion) {
    socket.Emit("chat", instrumentacion);
    /*
    $.ajax({
      url: "https://biv.mx/instrumentoLite?instrumento="+instrumentacion,
      dataType : "json",
      type : "get",
      async : true,
      beforeSend : function (){},
      complete : function (){}, 
      success : function (resp){
        if(resp.success==1)
        {
          if (data.length > 0)
          {
            data = data.slice(1);
          }
          var j=resp.rate.length-1;
          while (data.length < totalPoints) {
            data.push(resp.rate[j].C);
            var open = parseFloat($("."+instrumentacion+"_Value").attr("openValor"));
            var pcent = (1 - resp.rate[j].C / open)*100;
            pcent = -1*Math.round(pcent * 100) / 100;
            $("."+instrumentacion+"_Value").html(resp.rate[j].C);
            $("."+instrumentacion+"_Span").html(pcent+"%");
            
            if(open>resp.rate[j].C) {
            	$("."+instrumentacion+"_Value").removeClass("verde");
            	$("."+instrumentacion+"_Value").addClass("rojo");
            	$("."+instrumentacion+"_Span").removeClass("verde");
            	$("."+instrumentacion+"_Span").addClass("rojo");
            } else {
            	$("."+instrumentacion+"_Value").removeClass("rojo");
            	$("."+instrumentacion+"_Value").addClass("verde");
            	$("."+instrumentacion+"_Span").removeClass("rojo");
            	$("."+instrumentacion+"_Span").addClass("verde");
            }
            j--;
          }
        }
      }
    });  
    */
    var res = [];
    for (var i = 0; i < data.length; ++i) {
    if(data[i]>max)
      {
        max=data[i];
      }
      if(data[i]<min)
      {
        min=data[i];
      }
      res.push([i, data[i]])
    }
    return res;
  }
}
actualizaGraficas("EURUSD");
actualizaGraficas("USDMXN");
$(document).on("click", ".card", function (){
	var ins = $(this).attr("ins");
	$.ajax({
	    url: "https://biv.mx/instrumento?instrumento="+ins,
	    dataType : "json",
	    type : "get",
	    async : true,
	    beforeSend : function (){},
	    complete : function (){}, 
	    success : function (resp){
	     	if(resp.success==1)
	     	{
	     		var valor = resp.rate[resp.rate.length-1].C;
	     		var dia = resp.open;
	     		var pcent = (1 - valor / dia)*100;
            	pcent = -1*Math.round(pcent * 100) / 100;
            	var classPcent = "verde";
            	if(pcent<0) {classPcent="rojo";}
            	
            	var semana = resp.week;
	     		var pcentsemana = (1 - valor / semana)*100;
            	pcentsemana = -1*Math.round(pcentsemana * 100) / 100;
            	var classPcentSemana = "verde";
            	if(pcentsemana<0) {classPcentSemana="rojo";}

            	var mes = resp.month;
	     		var pcent_mes = (1 - valor / mes)*100;
            	pcent_mes = -1*Math.round(pcent_mes * 100) / 100;
            	var classPcentMes = "verde";
            	if(pcent_mes<0) {classPcentMes="rojo";}

            	var trimestre = resp.quarter;
	     		var pcent_trimestre = (1 - valor / trimestre)*100;
            	pcent_trimestre = -1*Math.round(pcent_trimestre * 100) / 100;
            	var classPcentTrimestre = "verde";
            	if(pcent_trimestre<0) {classPcentTrimestre="rojo";}

            	var semestre = resp.half;
	     		var pcent_semestre = (1 - valor / semestre)*100;
            	pcent_semestre = -1*Math.round(pcent_semestre * 100) / 100;
            	var classPcentSemestre = "verde";
            	if(pcent_semestre<0) {classPcentSemestre="rojo";}

            	var anio = resp.year;
	     		var pcent_anio = (1 - valor / anio)*100;
            	pcent_anio = -1*Math.round(pcent_anio * 100) / 100;
            	var classPcentAnio = "verde";
            	if(pcent_anio<0) {classPcentAnio="rojo";}

            	var anioPrincipio = resp.current;
	     		var pcent_anioPrincipio = (1 - valor / anioPrincipio)*100;
            	pcent_anioPrincipio = -1*Math.round(pcent_anioPrincipio * 100) / 100;
            	var classPcentAnioPrincipio = "verde";
            	if(pcent_anioPrincipio<0) {classPcentAnioPrincipio="rojo";}
            	
				var up = resp.up;
				var down = resp.down;
        //<tr><td>Desde el principio del año</td><td class="'+classPcentAnioPrincipio+'">'+pcent_anioPrincipio+'%</td></tr>
	     	 swal({
	     		title: '<strong>'+ins+'</strong>',
					html: '<table style="width: 100%;"><tbody><tr><td><h4 style="float:left;" class="font-weight-normal '+ins+'_Value"></h4><h6 class="'+ins+'_Span"></h6><br><table style="width: 50%;" class="table table-hover"><tbody><tr><td>Día</td><td class="'+classPcent+'">'+pcent+'%</td></tr><tr><td>Semana</td><td class="'+classPcentSemana+'">'+pcentsemana+'%</td></tr><tr><td>Mes</td><td class="'+classPcentMes+'">'+pcent_mes+'%</td></tr><tr><td>Trimestre</td><td class="'+classPcentTrimestre+'">'+pcent_trimestre+'%</td></tr><tr><td>Semestre</td><td class="'+classPcentSemestre+'">'+pcent_semestre+'%</td></tr><tr><td>Año</td><td class="'+classPcentAnio+'">'+pcent_anio+'%</td></tr></tbody></table></td><td><div class="d-flex justify-content-between"><small>Sentir alcista</small><small>'+up+'%</small></div><div class="progress progress-lg mt-2"><div class="progress-bar bg-success" role="progressbar" style="width: '+up+'%" aria-valuenow="'+up+'" aria-valuemin="0" aria-valuemax="100"></div></div><br><br><div class="d-flex justify-content-between"><small>Sentir bajista</small><small>'+down+'%</small></div><div class="progress progress-lg mt-2"><div class="progress-bar bg-danger" role="progressbar" style="width: '+down+'%" aria-valuenow="'+down+'" aria-valuemin="0" aria-valuemax="100"></div></div><br><br><div class="form-group"><label style="float: left;">Importe en dólares:</label><div class="input-group"><div class="input-group-prepend"><span class="input-group-text bg-primary text-white">$</span></div><input type="text" class="form-control soloNumeros" id="importeAInvertir" aria-label="Cantidad en dólares"><div class="input-group-append"></div></div></div><br><div class="form-group"><label style="float: left;">Apalancamiento:</label><select id="apalancamiento"><option value="500">1:500</select><label style="float: right;">Comisión: 0.02%</label></div><br><div class="form-check form-check-flat form-check-primary"><label class="form-check-label" style="float: left;"><input type="checkbox" id="takeProfit" class="form-check-input">Cerrar con ganancias<i class="input-helper"></i></label><input type="number" id="inputTakeProfit" class="soloNumeros" value="5" min="100" max="200" step="1"></div><br><div class="form-check form-check-flat form-check-primary"><label class="form-check-label" style="float: left;"><input type="checkbox" id="stopLoss" class="form-check-input">Cerrar con pérdidas<i class="input-helper"></i></label><input type="number" id="inputStopLoss" class="soloNumeros" value="5" min="100" max="200" step="1"></div><br><div class="template-demo"><button type="button" id="vender" class="btn btn-danger btn-icon-text"><i class="mdi mdi-arrow-down btn-icon-prepend"></i>Vender</button><button type="button" id="comprar" class="btn btn-success btn-icon-text"><i class="mdi mdi-arrow-up btn-icon-prepend"></i>Comprar</button></div></td></tr></tbody></table>',
					showCloseButton: true,
          showConfirmButton: false,
					width: '80%',
					background : '#111',
          onOpen: () => {
            
            $("#swal2-content").css("color","#FFF");
            $("#inputTakeProfit").InputSpinner();
            $("#inputStopLoss").InputSpinner();
          }
 
			    });
         

	      }
	  	}
	});
});
$(document).on("keydown","#soloNumeros", function(e) {
  //46 es punto
if ($.inArray(e.keyCode, [ 8, 9, 27, 13, 110, 190]) !== -1 ||
        (e.keyCode == 65 && e.ctrlKey === true) || 
        (e.keyCode >= 35 && e.keyCode <= 39)) {
             return;
    }
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
});

$(document).on("keydown",".soloNumeros", function(e) {
  //46 es punto
if ($.inArray(e.keyCode, [ 8, 9, 27, 13, 110, 190]) !== -1 ||
        (e.keyCode == 65 && e.ctrlKey === true) || 
        (e.keyCode >= 35 && e.keyCode <= 39)) {
             return;
    }
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
});
var tt = 't';
var regresa = "https://biv.mx/login";
var loader= '<div class="content-wrapper"><div class="row"><div class="col-md-12 col-sm-12 grid-margin stretch-card"><div class="loader-demo-box"><div class="jumping-dots-loader"><span></span><span></span><span></span></div></div></div></div></div>';
function cargaPerfil() {
  $("#main-panel").html(loader);
  var cad = '';
  $.ajax({
    url: "https://biv.mx/perfil",
    dataType : "json",
    data : {t : tt},
    type : "post",
    async : true,
    beforeSend : function (){},
    complete : function (){}, 
    success : function (resp){
      if(resp.success==1)
      {
        cad=cad+'<div class="content-wrapper"><div class="row"><div class="col-md-12 col-sm-12 grid-margin stretch-card"><div class="card" style="cursor:auto;"><div class="card-body"><h4 class="card-title">Datos de la cuenta</h4><p class="card-description">Para cumplir con los requisitos legales y normativos existentes, necesitamos verificar lo siguiente:</p><div class="template-demo"><table class="table table-striped"><tbody>';
        var palabra = 'danger';
        var tacha = '?';
        var otraTabla = false;
        if(parseInt(resp.dniVerificado) == 1)
        {
          palabra = 'success';
          tacha = '<i class="mdi mdi-check"></i>';
        } else {otraTabla = true;}
        cad=cad+'<tr><td>Nombre:</td><td>'+resp.nombre+'</td><td class="text-right"><div class="badge badge-pill badge-'+palabra+'">'+tacha+'</div></td></tr>'      
        palabra = 'danger';
        tacha = '?';
        if(parseInt(resp.confirmado) == 1)
        {
          palabra = 'success';
          tacha = '<i class="mdi mdi-check"></i>';
        } else {otraTabla = true;}
        cad=cad+'<tr><td>Correo:</td><td>'+resp.correo+'</td><td class="text-right"><div class="badge badge-pill badge-'+palabra+'">'+tacha+'</div></td></tr>'
        palabra = 'danger';
        tacha = '?';
        if(parseInt(resp.direccionVerificado) == 1)
        {
          palabra = 'success';
          tacha = '<i class="mdi mdi-check"></i>';
        } else {otraTabla = true;}
        cad=cad+'<tr><td>Dirección:</td><td>'+resp.direccion+'</td><td class="text-right"><div class="badge badge-pill badge-'+palabra+'">'+tacha+'</div></td></tr>'
        palabra = 'danger';
        tacha = '?';
        if(parseInt(resp.telefonoVerificado) == 1)
        {
          palabra = 'success';
          tacha = '<i class="mdi mdi-check"></i>';
        } else {otraTabla = true;}
        cad=cad+'<tr><td>Celular:</td><td>'+resp.telefono+'</td><td class="text-right"><div class="badge badge-pill badge-'+palabra+'">'+tacha+'</div></td></tr>'
        palabra = 'danger';
        tacha = '?';
        if(parseInt(resp.CLABEVerificado) == 1)
        {
          palabra = 'success';
          tacha = '<i class="mdi mdi-check"></i>';
        } else {otraTabla = true;}
        cad=cad+'<tr><td>CLABE:</td><td>'+resp.CLABE+'</td><td class="text-right"><div class="badge badge-pill badge-'+palabra+'">'+tacha+'</div></td></tr>'
        var deboTelefono = false;

        cad=cad+'</tbody></table></div></div></div></div></div>';
        if(otraTabla)
        {
          cad=cad+'<div class="row"><div class="col-md-12 col-sm-12 grid-margin stretch-card"><div class="card" style="cursor:auto;"><div class="card-body"><h4 class="card-title">Confirmación de la cuenta</h4><p class="card-description">Suba los documentos que a continuación se le solicita:</p><div class="template-demo"><table class="table table-striped"><tbody>'
          var tipo = 1;//1 es dni
          if(parseInt(resp.dniVerificado) == 0)//no tiene
          {
            cad=cad+'<tr><td>Documento de identificación</td><td><div class="preview" data-toggle="tooltip" data-placement="top" title="Debe ser un documento de identidad expedido por el gobierno, puede ser INE, pasaporte, licencia de conducir, dni u otro, donde se aprecie claramente el nombre completo. Su documento debe ser de buena calidad: le sugerimos que lo haga con su teléfono móvil o con una cámara digital. Su documento no debe de haber expirado."><i class="icon-info" style="color: white;font-size: 28px;"></i></div></td><td class="text-right"><div class="form-group"><label> </label><form tipo="'+tipo+'" enctype="multipart/form-data" action="https://biv.mx/uploadFile" method="POST"><input type="file" multiple tipo="'+tipo+'" id="inputSubirDNI" name="img[]" class="file-upload-default"><input type="hidden" value="'+tt+'" name="t"><input type="hidden" value="'+tipo+'" name="tipo"><div class="input-group col-xs-12"><input type="text" tipo="'+tipo+'" name="nombre" class="form-control file-upload-info" disabled="" placeholder=""><span class="input-group-append"><button id="buttonSubirDNI" tipo="'+tipo+'" class="file-upload-browse btn btn-primary" type="button">Cargar</button></form></span></div></div></td></tr>'      
          } else{
            if(parseInt(resp.dniVerificado) == 2)//pendiente de revisión
            {
              cad=cad+'<tr><td>Documento de identificación</td><td colspan="2"><div class="badge badge-warning badge-pill">Pendiente de revisión</div></td></tr>'      
            }
          }
          tipo = 2;//2 es direccion
          if(parseInt(resp.direccionVerificado) == 0)//no tiene
          {
            cad=cad+'<tr><td>Comprobante de domicilio</td><td><div class="preview" data-toggle="tooltip" data-placement="top" title="El documento debe: Mostrar su nombre y dirección, no tener una antigüedad mayor de 3 meses, incluir todo el documento"><i class="icon-info" style="color: white;font-size: 28px;"></i></div></td><td class="text-right"><div class="form-group"><label> </label><form tipo="'+tipo+'" enctype="multipart/form-data" action="https://biv.mx/uploadFile" method="POST"><input type="file" multiple tipo="'+tipo+'" id="inputSubirDNI" name="img[]" class="file-upload-default"><input type="hidden" value="'+tt+'" name="t"><input type="hidden" value="'+tipo+'" name="tipo"><div class="input-group col-xs-12"><input type="text" tipo="'+tipo+'" name="nombre" class="form-control file-upload-info" disabled="" placeholder=""><span class="input-group-append"><button id="buttonSubirDNI" tipo="'+tipo+'" class="file-upload-browse btn btn-primary" type="button">Cargar</button></form></span></div></div></td></tr>';
          } else{
            if(parseInt(resp.direccionVerificado) == 2)//pendiente de revisión
            {
              cad=cad+'<tr><td>Comprobante de domicilio</td><td colspan="2"><div class="badge badge-warning badge-pill">Pendiente de revisión</div></td></tr>';
            }
          }
          tipo = 3;//3 es CLABE
          if(parseInt(resp.CLABEVerificado) == 0)//no tiene
          {
            cad=cad+'<tr><td>Comprobante de CLABE interbancaria</td><td><div class="preview" data-toggle="tooltip" data-placement="top" title="El documento debe: Mostrar su nombre, y CLABE, no tener una antigüedad mayor de 3 meses, incluir todo el documento."><i class="icon-info" style="color: white;font-size: 28px;"></i></div></td><td class="text-right"><div class="form-group"><label> </label><form tipo="'+tipo+'" enctype="multipart/form-data" action="https://biv.mx/uploadFile" method="POST"><input type="file" multiple tipo="'+tipo+'" id="inputSubirDNI" name="img[]" class="file-upload-default"><input type="hidden" value="'+tt+'" name="t"><input type="hidden" value="'+tipo+'" name="tipo"><div class="input-group col-xs-12"><input type="text" tipo="'+tipo+'" name="nombre" class="form-control file-upload-info" disabled="" placeholder=""><span class="input-group-append"><button id="buttonSubirDNI" tipo="'+tipo+'" class="file-upload-browse btn btn-primary" type="button">Cargar</button></form></span></div></div></td></tr>';
          } else{
            if(parseInt(resp.CLABEVerificado) == 2)//pendiente de revisión
            {
              cad=cad+'<tr><td>Comprobante de CLABE interbancaria</td><td colspan="2"><div class="badge badge-warning badge-pill">Pendiente de revisión</div></td></tr>';
            }
          }
          tipo = 4;//4 es celular
          if(parseInt(resp.telefonoVerificado) == 0)//no tiene
          {
            deboTelefono = true;
            cad=cad+'<tr><td>Escribe tu número de celular</td><td><input type="tel" id="phone"/></td><td><button id="confirmarConSMS" class="btn btn-success">Confirmar con SMS</button></td></tr>';
          } else{
            if(parseInt(resp.telefonoVerificado) == 2)//pendiente de revisión
            {
              cad=cad+'<tr><td>Celular</td><td colspan="2"><div class="badge badge-warning badge-pill">Pendiente de revisión</div></td></tr>';
            }
          }
          cad=cad+'</tbody></table></div></div></div></div></div>';
        }        
        cad=cad+'</div>';
        $("#main-panel").html(cad);
        if(deboTelefono){
          var input = document.getElementById("phone");
          iti = window.intlTelInput(input, {
            initialCountry: "auto",
             customPlaceholder: function(selectedCountryPlaceholder, selectedCountryData) {
                return "1234567890";
              },
            geoIpLookup: function(callback) {
              $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
                var countryCode = (resp && resp.country) ? resp.country : "";
                callback(countryCode);
                setTimeout(function() {
                  $("#phone").attr("placeholder","1234567890");
                  $("#phone").attr("maxlength","10");
                  $("#phone").addClass("soloNumeros");  
                },1000);
                
              });
            },
            utilsScript: "https://biv.mx/static/biv_tel/js/utils.js?1537727621611" // just for formatting/placeholders etc
          });
        }
        var Tooltip = $.fn.tooltip.Constructor;
        // add customClass option to Bootstrap Tooltip
        $.extend(Tooltip.Default, {
          customClass: ''
        });
        var _show = Tooltip.prototype.show;
        Tooltip.prototype.show = function() {
          // invoke parent method
          _show.apply(this, Array.prototype.slice.apply(arguments));
          if (this.config.customClass) {
            var tip = this.getTipElement();
            $(tip).addClass(this.config.customClass);
          }
        };
        $('[data-toggle="tooltip"]').tooltip();
      } 
      else
      {
        if(resp.success==0)
        {
          window.location = regresa;
        }
      }
    }
  });
}

$(document).on("click", "#confirmarConSMS", function (){
  var number = iti.getNumber(intlTelInputUtils.numberFormat.E164);
   var n = number.includes("+");
  if(!n){
    Swal({
      title: "<small>Confirmación de número</small>!",
      text: '<span style="color:#000000">Por favor, escribe el número completo.<span>',
      html: '<span style="color:#000000">Por favor, escribe el número completo.<span>',
      type: 'info',
      title: '',
      showConfirmButton: true,
    })
    return;
  }
   
  number = number.trim();
   $.ajax({
    url: "https://biv.mx/sendSMS",
    dataType : "json",
    data : {t : tt, phone : number},
    type : "post",
    async : true,
    beforeSend : function (){},
    complete : function (){}, 
    success : function (resp){
      if(resp.success==1)
      {
        Swal({
          text: '<span style="color:#000000">Escribe tu número de confirmación:<span>',
          html: '<span style="color:#000000">Escribe tu número de confirmación:<span>',
            input: 'text',
          inputAttributes: {
            autocapitalize: 'off',
            id : 'soloNumeros',
            maxlength : 6
          },
          showCancelButton: false,
          confirmButtonText: 'Confirmar'
        }).then((result) => {
          if (result.value) {
            $.ajax({
                url: "https://biv.mx/confirmSMS",
                dataType : "json",
                type : "post",
                data : {t : tt, valor : result.value, phone : number},
                async : true,
                beforeSend : function (){},
                complete : function (){}, 
                success : function (resp){
                    if(resp.success==1)
                    {
                        Swal({
                          type: 'success',
                          title: 'Se ha confirmado tu número '+number,
                          showConfirmButton: false,
                          timer: 2500
                        })
                        cargaPerfil();
                    }
                }
            });
          }
        })//swal final
      }
    }
  });
});
$(document).on("click", "#perfilMenu", function (){
  cargaPerfil();
});
$(document).on("click", ".file-upload-browse", function (){
  var file = $(this).parent().parent().parent().find('.file-upload-default');
  file.trigger('click');
});
$(document).on("change", ".file-upload-default", function (){
  var tipo = $(this).attr("tipo");
  $('.form-control[tipo="'+tipo+'"]').val($('.file-upload-default[tipo="'+tipo+'"]').val().replace(/C:\\fakepath\\/i, ''));
  //submit form
  $($('form[tipo="'+tipo+'"]')[0]).bind('ajax:complete', function() {       
    //cargaPerfil();
  });
   var form1 = $('form[tipo="'+tipo+'"]')[0];

       var data = new FormData(form1);

  
 
  $.ajax({
    url: "https://biv.mx/uploadFile",
    data : data,
    enctype: 'multipart/form-data',
    dataType : "json",
    type : "post",
    async : false,
    cache: false,
    contentType: false,
    processData: false,
    beforeSend : function (){},
    complete : function (){
      cargaPerfil();
    }, 
    success : function (resp){
      
    }
  });
  //$(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
});
var iti;
$(document).ready(function() {
  var t = parseInt($("#ti").html());
  tt = $("#t").html();
  if(t==1)
  {
    $("#labelAccount").html("Real");
    var string = numeral(parseFloat($("#fr").html())).format('$0,0.00');
    $("#fondo").html(string );
    $("#labelAccount").removeClass("badge-outline-danger");
    $("#labelAccount").addClass("badge-outline-success");
  } else{
    $("#labelAccount").html("Demo");
    var string = numeral(parseFloat($("#fd").html())).format('$0,0.00');
    $("#fondo").html(string);
    $("#labelAccount").removeClass("badge-outline-success");
    $("#labelAccount").addClass("badge-outline-danger");
  }
});  