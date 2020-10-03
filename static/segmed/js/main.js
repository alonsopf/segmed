var port = document.location.port ? (":" + document.location.port) : "";
var scheme = document.location.protocol == "https:" ? "wss" : "ws";
var wsURL = scheme + "://" + document.location.hostname + port+"/ws";
var socket = new Ws(wsURL);
var giovanny = new Array();
var alopmar = 0;
var rolando = 0;

function connect() {
  socket = new Ws(wsURL);  

  socket.conn.onerror = function(e) {
    setTimeout(function() {
      connect();
    }, 1000);
  };
  
  socket.OnConnect(function () {
    console.log("Status: Connected");
    refresh();
  });
  socket.OnDisconnect(function () {
    console.log("Status: Disconnected");
    setTimeout(function() {
      connect();
    }, 1000);
  });
  var i;
  clear();
  for(i=0;i<giovanny.length;i++)
  {
    actualizaGraficas(giovanny[i]);
  }
  socket.On("openPositionList", function (msg) {
  setTimeout(function(){refresh();},1500);
  console.log("open");
    var array = JSON.parse(msg);
    if(array.Success==0){window.location="https://biv.mx/login";}
    var string = numeral(array.Disponible).format('$0,0.00');
    $("#fondo").html(string);
    var v = array.GanPer;
    var cPoner = "verde";
    var cQuitar = "rojo";
    if(v<0){
      cPoner = "rojo";
      cQuitar = "verde";
    }
    if(notifications!=array.NotificacionList)
    {
      notifications = array.NotificacionList;
      var aver3 = Object.keys(notifications);
      var i, cadN = '';
      var nuevos = 0;
      for(i=0;i<aver3.length;i++)
      {
        var C_V = notifications[aver3[i]].C_V;
        var GanPer = notifications[aver3[i]].GanPer;
        var Instrumento = notifications[aver3[i]].Instrumento;
        var Motivo = notifications[aver3[i]].Motivo;
        var Visto = notifications[aver3[i]].Visto;
        if(Visto=="0"){nuevos++;}
        var Fecha = notifications[aver3[i]].Fecha;
        var colorS = "bg-success"
        var iClass = '<i class="ti-stats-up"></i>';
        if(Motivo.trim()=="") {
          Motivo = "Cierre manual";
        }
        if(Motivo.substring(0,4)=="Dete" || Motivo.substring(0,4)=="Fond")
        {
          colorS = "bg-danger";
          iClass = '<i class="ti-stats-down"></i>';
        }
        var fechaS = time2TimeAgo(parseInt(Fecha));
        var pal = "compra";
        if(C_V!="C")
        {
          pal="venta";
        }
        cadN = cadN +'<a class="dropdown-item preview-item" href="javascript:;">'+
                '<div class="preview-thumbnail">'+
                  '<div class="preview-icon '+colorS+'">'+iClass+''+
                  '</div>'+
                '</div>'+
                '<div class="preview-item-content mano operCerradasClick">'+
                  '<h6 class="preview-subject font-weight-medium">'+Motivo+' de '+pal+' '+Instrumento+'</h6>'+
                  '<p class="font-weight-light small-text mb-0">'+fechaS+'</p>'+
                '</div>'+
              '</a>';
              if(i<aver3.length-2)
              {
                cadN=cadN+'<div class="dropdown-divider"></div>';
              }
        $("#notificationDropdown3").html(cadN);
      }
      if(nuevos==0){nuevos="";}
      $("#count").html(nuevos);
    }
    if(array.EsTorneo==1)
    {
      var aliasAUX = alias+" ("+array.Lugar+")"
      $("#alias").html(aliasAUX);
    }
    var tam = parseInt($("#ti").html());
     
     if(array.EsTorneoGlobal==1)
    {
      if(tam==1)
      {
        $(".CTDR").html("&nbsp;&nbsp;&nbsp;&nbsp;Cambiar a Torneo");
        
      }else{
        $("#labelAccount").html("Torneo");
      }
    } else {
      if(tam==1)
      {
        $(".CTDR").html("&nbsp;&nbsp;&nbsp;&nbsp;Cambiar a Demo");
      }else {
        $("#labelAccount").html("Demo");
      }
    }
    string = numeral(array.GanPer).format('$0,0.00');
    $("#ganper").html(string);
    $("#ganper").removeClass(cQuitar);
    $("#ganper").addClass(cPoner);
    if($("#right-sidebar").hasClass("open") && rolando == 0)
    {
      var palabra = "Compra";
      if(array.AbiertasList[carlosRochaGlobal].C_V=="V"){palabra="Venta"};
      var ins =array.AbiertasList[carlosRochaGlobal].Ins;
      var minInv = parseFloat(array.AbiertasList[carlosRochaGlobal].GananciasPerdidas);//Importe?
      var SLTP = Math.abs(minInv * 0.3);
      var maxSLTP = SLTP * 100;
      var SLTP2 = SLTP;
      var hayTK = "checked";
      var TK_V = array.AbiertasList[carlosRochaGlobal].TK_Value;
      if(array.AbiertasList[carlosRochaGlobal].TK!="1"){hayTK="";TK_V=minInv+SLTP;}
      var haySL = "checked";
      var SL_V = array.AbiertasList[carlosRochaGlobal].SL_Value;
      if(array.AbiertasList[carlosRochaGlobal].SL!="1"){haySL="";SL_V=minInv-SLTP;}      
      if(alopmar==1)
      {
        var cadTK = '<div class="form-check form-check-flat form-check-primary"><label class="form-check-label" style="float: left;"><input type="checkbox" '+hayTK+' id="takeProfit-'+ins+'" class="form-check-input">Cerrar con ganancias $<i class="input-helper"></i></label><input type="number" id="inputTakeProfit-'+ins+'" class="soloNumeros" value="'+TK_V+'" min="'+TK_V+'" max="'+(TK_V+SLTP)+'" step="1"></div><br><div class="form-check form-check-flat form-check-primary"><label class="form-check-label" style="float: left;"><input type="checkbox" '+haySL+' id="stopLoss-'+ins+'" class="form-check-input">Cerrar con pérdidas $<i class="input-helper"></i></label><input type="number" id="inputStopLoss-'+ins+'" class="soloNumeros" value="'+SL_V+'" min="'+(SL_V-SLTP)+'" max="'+SL_V+'" step="1"></div><br>';
        var cadAux = '<i class="settings-close mdi mdi-close"></i><ul class="nav nav-tabs" id="setting-panel" role="tablist"><li class="nav-item"><a href="javascript:;" class="nav-link">'+palabra+'&nbsp;&nbsp;&nbsp;<b>'+ins+'</b></a></li></ul><div class="tab-content" id="setting-content">'+cadTK+'</div><br><br><center><button type="button" class="btn btn-outline-secondary btn-icon-text" ins="'+ins+'" carlosRocha="'+carlosRochaGlobal+'" id="editarButtonPos">Editar</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-outline-danger btn-icon-text" id="closeEdit">Cancelar</button></center>';
        $("#right-sidebar").html(cadAux);
        $("#inputTakeProfit-"+ins).InputSpinner(configSpinnerTK);
        $("#inputStopLoss-"+ins).InputSpinner(configSpinnerSL);
        rolando = 1;  
      }
      var cotApertura = array.AbiertasList[carlosRochaGlobal].PrecioApertura;
      var cotVigente = array.AbiertasList[carlosRochaGlobal].PrecioActual;
      var cPoner2 = "verde";
      var importeString = numeral(minInv).format('$0,0.00')+" x "+array.AbiertasList[carlosRochaGlobal].Apalancamiento;
      if(parseFloat(array.AbiertasList[carlosRochaGlobal].GananciasPerdidas)<0){cPoner2="rojo";}
      var ganPerAux = numeral(parseFloat(array.AbiertasList[carlosRochaGlobal].GananciasPerdidas)).format('$0,0.00');

      if(alopmar==2)
      {
        var cadAux = '<i class="settings-close mdi mdi-close"></i><ul class="nav nav-tabs" id="setting-panel" role="tablist"><li class="nav-item"><a href="javascript:;" class="nav-link">'+palabra+'&nbsp;&nbsp;&nbsp;<b>'+ins+'</b></a></li></ul><div class="tab-content" id="setting-content"><center><table class="table"><tbody><tr><td>Cot. Apertura</td><td>'+cotApertura+'</td></tr><tr><td>Cot. Vigente</td><td id="actualizaCot">'+cotVigente+'</td></tr><tr><td>Importe</td><td>'+importeString+'</td></tr><tr><td>Gan/Pér netas</td><td class="'+cPoner2+'" id="cambiaColor">'+ganPerAux+'</td></tr></tbody></table></center></div><br><br><center><button type="button" class="btn btn-outline-secondary btn-icon-text" ins="'+ins+'" carlosRocha="'+carlosRochaGlobal+'" id="cerrarButtonPos">Cerrar Posici&oacute;n</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-outline-danger btn-icon-text" id="closeEdit">Cancelar</button></center>';
        $("#right-sidebar").html(cadAux);
        rolando = 1;  
      }
    }
    if($("#operAbiertas").length >= 1) {
      var i, carlosRocha=Object.keys(array.AbiertasList),cad='<div class="table-responsive"><table class="table table-striped"><thead><tr>'+
                          '<th>Instrumento</th>'+
                          '<th>P. Aper.</th>'+
                          '<th>Creado en</th>'+
                          '<th>Importe</th>'+
                          '<th>Com.</th>'+
                          '<th>Puntos</th>'+
                          '<th>L&iacute;mites</th>'+
                          '<th>Gan/Pér</th>'+
                          '<th>Editar</th>'+
                          '<th>Cerrar</th>'+
                        '</tr></thead><tbody>';
      var ver2 = $("#operAbiertas").html().trim();
     
      for(i=0;i<carlosRocha.length;i++)
      {
        var palabra = "Compra";
        var classGA = "cambiaGanPer";
        string = numeral(parseFloat(array.AbiertasList[carlosRocha[i]].Importe)).format('$0,0.00');
        cPoner = "verde";
        if(parseFloat(array.AbiertasList[carlosRocha[i]].GananciasPerdidas)<0){cPoner="rojo";}
        var CG = numeral(parseFloat(array.AbiertasList[carlosRocha[i]].TK_Value)).format('$0,0.00');
        if(array.AbiertasList[carlosRocha[i]].TK!="1"){CG="-"};
        var CP = numeral(parseFloat(array.AbiertasList[carlosRocha[i]].SL_Value)).format('$0,0.00');
        if(array.AbiertasList[carlosRocha[i]].SL!="1"){CP="-"};
        if(array.AbiertasList[carlosRocha[i]].C_V=="V"){palabra="Venta"};
        cad=cad+'<tr><td>'+palabra+'<br><br><b>'+array.AbiertasList[carlosRocha[i]].Alias+'</b></td><td>'+array.AbiertasList[carlosRocha[i]].PrecioApertura+'</td>'+
'<td>'+array.AbiertasList[carlosRocha[i]].UnixEntrada+'</td>'+
'<td>'+numeral(parseFloat(array.AbiertasList[carlosRocha[i]].Importe)).format('$0,0.00')+' x '+array.AbiertasList[carlosRocha[i]].Apalancamiento+'</td>'+
'<td>'+numeral(parseFloat(array.AbiertasList[carlosRocha[i]].Comm)).format('$0,0.00')+'</td><td>'+array.AbiertasList[carlosRocha[i]].PuntosGenerados+' generados<br><br>'+array.AbiertasList[carlosRocha[i]].PuntosCobrados+' cobrados</td>'+
'<td>Cerrar con Gan. '+CG+'<br><br>Cerrar con Pér. '+CP+'</td>'+
'<td><span ins="'+array.AbiertasList[carlosRocha[i]].Ins+'" class="ganPerActual">'+numeral(parseFloat(array.AbiertasList[carlosRocha[i]].GananciasPerdidas)).format('$0,0.00')+'</span><br><br>Actual: <span ins="'+array.AbiertasList[carlosRocha[i]].Ins+'" class="actual">'+array.AbiertasList[carlosRocha[i]].PrecioActual+'</span></td>'+
'<td><button carlosRocha="'+carlosRocha[i]+'" ganper="'+parseFloat(array.AbiertasList[carlosRocha[i]].GananciasPerdidas)+'" type="button" class="btn btn-primary btn-rounded btn-fw editPos '+classGA+'">Editar</button></td>'+
'<td><button carlosRocha="'+carlosRocha[i]+'" ganper="'+parseFloat(array.AbiertasList[carlosRocha[i]].GananciasPerdidas)+'" type="button" class="btn btn-warning btn-rounded btn-fw closePos '+classGA+'">Cerrar</button></td>'+
        '</tr>';
        if(ver2!='<div class="jumping-dots-loader"><span></span><span></span><span></span></div>'){
          $('.actual[ins="'+array.AbiertasList[carlosRocha[i]].Ins+'"]').html(array.AbiertasList[carlosRocha[i]].PrecioActual);
          
          var string5 = numeral(parseFloat(array.AbiertasList[carlosRocha[i]].GananciasPerdidas)).format('$0,0.00');
          
          $('.ganPerActual[ins="'+array.AbiertasList[carlosRocha[i]].Ins+'"]').html( string5 );
          var coo = "red";
          if(cPoner=="verde") {
            coo = "green";
          }
          $('.ganPerActual[ins="'+array.AbiertasList[carlosRocha[i]].Ins+'"]').css("color",coo);
          $('.cambiaGanPer[carlosRocha="'+carlosRocha[i]+'"]').attr("ganper",parseFloat(array.AbiertasList[carlosRocha[i]].GananciasPerdidas));
        }

        if(carlosRocha[i]==carlosRochaGlobal){
          $("#actualizaCot").html(array.AbiertasList[carlosRocha[i]].PrecioActual);
          $("#cambiaColor").removeClass("verde");
          $("#cambiaColor").removeClass("rojo");
          $("#cambiaColor").addClass(cPoner);
          $("#cambiaColor").html(numeral(parseFloat(array.AbiertasList[carlosRocha[i]].GananciasPerdidas)).format('$0,0.00'));
        }
      }
      cad=cad+'</tbody></table></div>';
       if(ver2=='<div class="jumping-dots-loader"><span></span><span></span><span></span></div>'){
        $("#operAbiertas").html(cad);   
       }
      
      
    }
    if($("#operCerradas").length >= 1) {
      var i, carlosRocha=Object.keys(array.CerradasList);
       for(i=0;i<carlosRocha.length;i++)
          {
            for(j=i;j<carlosRocha.length;j++)
            {
              if(parseInt(array.CerradasList[carlosRocha[i]].UnixUnixCerrada) < parseInt(array.CerradasList[carlosRocha[j]].UnixUnixCerrada))
              {
                var aux = carlosRocha[i];
                carlosRocha[i] = carlosRocha[j];
                carlosRocha[j] = aux;
              }

            }
          }
      var cad='<div class="table-responsive"><table class="table table-striped"><thead><tr>'+
                          '<th>Instrumento</th>'+
                          '<th>Precios</th>'+
                          '<th>Tiempo</th>'+
                          '<th>Importe</th>'+
                          '<th>Com.</th>'+
                          '<th>Puntos</th>'+
                          '<th>Gan/Pér</th>'+
                          '<th style="text-align:center;">Motivo<br>de<br>Cierre</th>'+
                        '</tr></thead><tbody>';
      for(i=0;i<carlosRocha.length;i++)
      {
        var palabra = "Compra";
        string = numeral(parseFloat(array.CerradasList[carlosRocha[i]].Importe)).format('$0,0.00');
        cPoner = "verde";
        if(parseFloat(array.CerradasList[carlosRocha[i]].GananciasPerdidas)<0){cPoner="rojo";}
        var CG = numeral(parseFloat(array.CerradasList[carlosRocha[i]].TK_Value)).format('$0,0.00');
        if(array.CerradasList[carlosRocha[i]].TK!="1"){CG="-"};
        var CP = numeral(parseFloat(array.CerradasList[carlosRocha[i]].SL_Value)).format('$0,0.00');
        if(array.CerradasList[carlosRocha[i]].SL!="1"){CP="-"};
        if(array.CerradasList[carlosRocha[i]].C_V=="V"){palabra="Venta"};
        cad=cad+'<tr><td>'+palabra+'<br><br><b>'+array.CerradasList[carlosRocha[i]].Alias+'</b></td><td>P. Apertura: '+array.CerradasList[carlosRocha[i]].PrecioApertura+'<br><br>P. Cierre: '+array.CerradasList[carlosRocha[i]].PrecioCierre+'</td>'+
'<td>'+array.CerradasList[carlosRocha[i]].UnixEntrada+'<br><br>'+array.CerradasList[carlosRocha[i]].UnixCerrada+'</td>'+
'<td>'+numeral(parseFloat(array.CerradasList[carlosRocha[i]].Importe)).format('$0,0.00')+' x '+array.CerradasList[carlosRocha[i]].Apalancamiento+'</td>'+
'<td>'+numeral(parseFloat(array.CerradasList[carlosRocha[i]].Comm)).format('$0,0.00')+'</td><td>'+array.CerradasList[carlosRocha[i]].PuntosGenerados+' generados<br><br>'+array.CerradasList[carlosRocha[i]].PuntosCobrados+' cobrados</td>'+
'<td class="'+cPoner+'">'+numeral(parseFloat(array.CerradasList[carlosRocha[i]].GananciasPerdidas)).format('$0,0.00')+'</td>'+
'<td>'+array.CerradasList[carlosRocha[i]].MotivoCierre+'</td>'+
        '</tr>';
      }
      cad=cad+'</tbody></table></div>';
      var ver = $("#operCerradas").html();
      if (ver!=cad) {
        $("#operCerradas").html(cad);  
      }
      
    }
  });
}
connect();
$(document).on("click", ".closePos", function (){
  $("#right-sidebar").html('<div class="jumping-dots-loader" style="margin-top:100%;"><span></span><span></span><span></span></div>');
  alopmar = 2;
  rolando = 0;
  carlosRochaGlobal = $(this).attr("carlosRocha");
  if(!$("#right-sidebar").hasClass("open"))
  {
    $("#right-sidebar").addClass("open");    
  }
});


$(document).on("click", "#notificationDropdown2", function (){
  $.ajax({
    url: "https://biv.mx/marcaVisto",
    dataType : "json",
    type : "post",
    async : true,
    data : {t:tt},
    beforeSend : function (){},
    complete : function (){$("body").css("cursor","default");}, 
    success : function (resp){}
  });
});
function actualizaGraficas(instrumentacion) {
  var data = [],
  totalPoints = 300 , min = 0, max = 20;
  var dataDT = [];
  var dataDT_Format = [];
  var insSaneado = instrumentacion;//.replace("/","");
  $.ajax({
    url: "https://biv.mx/instrumento?instrumento="+insSaneado,//API
    dataType : "json",
    type : "get",
    async : true,
    beforeSend : function (){},
    complete : function (){$("body").css("cursor","default");}, 
    success : function (resp){
      if(resp.success==1)
      {
        //$("."+insSaneado+"_Value").attr("openValor",resp.day.Data[0]);
        $("."+insSaneado+"_Value").attr("openValor",resp.open);
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
          dataDT = dataDT.slice(1);
          dataDT_Format = dataDT_Format.slice(1);
        }
        var j=resp.rate.length-1-totalPoints;
        
        while (data.length < totalPoints) {
          data.push(resp.rate[j].C);
          dataDT.push(resp.rate[j].Dt);
          dataDT_Format.push(timeConverter(resp.rate[j].Dt));
          j++;
        }
        /*
        var k =resp.rate.Data.length-1-totalPoints;
        for(k=k;k<resp.rate.Data.length;k++)
        {
          if(resp.rate.Data[k]>max)
          {
            max=resp.rate.Data[k];
          }
          if(resp.rate.Data[k]<min)
          {
            min=resp.rate.Data[k];
          }
        }
        if (data.length > 0)
        {
          data = data.slice(1);
        }
        var j=resp.rate.Data.length-1-totalPoints;
        
        while (data.length < totalPoints) {
          data.push(resp.rate.Data[j]);
          j++;
        }
        */
        //xaxis, mode : 'time',timeBase: "seconds"
        var updateInterval = 1500;
        if ($("#"+insSaneado).length) {
      		var plot = $.plot("#"+insSaneado, [getData(insSaneado)], {series: {shadowSize: 0 },xaxis: {show: false},grid: {borderWidth: 0,labelMargin: 10,hoverable: true,clickable: true,mouseActiveRadius: 6,}  });
      function update() {
      	plot = $.plot("#"+insSaneado, [getData(insSaneado)], {series: {shadowSize: 0 },xaxis: {show: false},grid: {borderWidth: 0,labelMargin: 10,hoverable: true,clickable: true,mouseActiveRadius: 6,}  });
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
  socket.On(instrumentacion, function (msg) {
    var array = JSON.parse(msg);
    if(array[0].Dt!=dataDT[dataDT.length-1])
    {
      if (data.length > 0)
      {
        data = data.slice(1);
      }
      var j = 0;
      var insSaneado = instrumentacion//;.replace("/","");
      cargaAnim(insSaneado+"_Value", 1.0);
      var open = parseFloat($("."+insSaneado+"_Value").attr("openValor"));
      while (data.length < totalPoints) {
        data.push(array[0].C);
        dataDT.push(array[0].Dt);
        dataDT_Format.push(timeConverter(array[0].Dt));
        var pcent = (1 - array[0].C / open)*100;
        pcent = -1*Math.round(pcent * 100) / 100;
        $("."+insSaneado+"_Value").html(array[0].C);
        $("."+insSaneado+"_Span").html(pcent+"%");
        if(open>array[0].C) {
          $("."+insSaneado+"_Value").removeClass("verde");
          $("."+insSaneado+"_Value").addClass("rojo");
          $("."+insSaneado+"_Span").removeClass("verde");
          $("."+insSaneado+"_Span").addClass("rojo");
        } else {
          $("."+insSaneado+"_Value").removeClass("rojo");
          $("."+insSaneado+"_Value").addClass("verde");
          $("."+insSaneado+"_Span").removeClass("rojo");
          $("."+insSaneado+"_Span").addClass("verde");
        }
        j--;
      }///while  
    } else {
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
    }
    
  });
  
  function getData(instrumentacion) {
    if(socket.conn.readyState==1)
    {
      socket.Emit(instrumentacion, instrumentacion);
    }
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
      //res.push([dataDT_Format[i], data[i]])
    }
    return res;
  }
}

function timeConverter(UNIX_timestamp){
  var a = new Date((UNIX_timestamp-0) * 1000);//ya tiene su timezone!
  var year = a.getFullYear();
  var month = parseInt(a.getMonth())+1;
  var mes=""+month;
  if(month<10)
  {
    mes="0"+month;
  }
  var date = parseInt(a.getDate());
  var hour = a.getHours();
  var minute = parseInt(a.getMinutes());
  var minutos = ""+minute;
  if(minute<10)
  {
    minutos="0"+minute
  }

  var dia = ""+date;
  if(date<10)
  {
    dia="0"+date
  }
  var time = year + '-' + mes + '-' + dia + '   '+hour+':'+minutos;
  return time;
}

function clear() {
  checkCash();
  var id = window.setTimeout(function() {}, 0);
  while (id--) {
    window.clearTimeout(id); // will do nothing if no timeout with id is present
  }
}
$(document).on("click", ".cardOpenPosition", function (){
	var ins = $(this).attr("ins");
  var alias = $(this).attr("alias");
  var insSaneado = ins.replace("/","");
  ins = insSaneado;
	$.ajax({
	    url: "https://biv.mx/instrumento?instrumento="+insSaneado,
	    dataType : "json",
	    type : "get",
	    async : true,
	    beforeSend : function (){},
	    complete : function (){$("body").css("cursor","default");}, 
	    success : function (resp){
	     	if(resp.success==1)
	     	{
	     		var valor = resp.rate[resp.rate.length-1].C;
	     		var dia = resp.open;
	     		var pcent = (1 - valor / dia)*100;
            	pcent = -1*Math.round(pcent * 100) / 100;
            	var classPcent = "verde";
            	if(pcent<0) {classPcent="rojo";}
           /* 	
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
              */
        var comm = resp.FixComm;
				var up = resp.up;
				var down = resp.down;
        var apalancamiento = resp.apalancamiento;
        var limitRateDistance = resp.limitRateDistance;
        var defaultSLTPDistance = resp.defaultSLTPDistance;
        var defaultLimitCoef = resp.defaultLimitCoef;

        var minInv = resp.minInv;
        var SLTP = minInv*defaultLimitCoef;
        var maxSLTP = SLTP * 100;
        var SLTP2 = SLTP *2;
        var typeIns = resp.typeIns;
        var i=0, cadApalancamiento = '';
        for(i=0;i<apalancamiento.length;i++){if(apalancamiento[i]==100){cadApalancamiento = cadApalancamiento + '<option value="'+apalancamiento[i]+'" selected>1:'+apalancamiento[i]+'</option>';}else{cadApalancamiento = cadApalancamiento + '<option value="'+apalancamiento[i]+'">1:'+apalancamiento[i]+'</option>';  }          }
          //<table style="width: 50%;" class="table table-hover"><tbody><tr><td>Día</td><td class="'+classPcent+'">'+pcent+'%</td></tr></td>
          //<tr><td>Semana</td><td class="'+classPcentSemana+'">'+pcentsemana+'%</td></tr><tr><td>Mes</td><td class="'+classPcentMes+'">'+pcent_mes+'%</td></tr><tr><td>Trimestre</td><td class="'+classPcentTrimestre+'">'+pcent_trimestre+'%</td></tr><tr><td>Semestre</td><td class="'+classPcentSemestre+'">'+pcent_semestre+'%</td></tr><tr><td>Año</td><td class="'+classPcentAnio+'">'+pcent_anio+'%</td></tr></tbody></table>
        //<tr><td>Desde el principio del año</td><td class="'+classPcentAnioPrincipio+'">'+pcent_anioPrincipio+'%</td></tr>
        //<tr><td width="45%"><div class="d-flex justify-content-between"><small>Sentir alcista</small><small>'+up+'%</small></div><div class="progress progress-lg mt-2"><div class="progress-bar bg-success" role="progressbar" style="width: '+up+'%" aria-valuenow="'+up+'" aria-valuemin="0" aria-valuemax="100"></div></div></td><td width="10%">&nbsp;</td><td width="45%"><div class="d-flex justify-content-between"><small>Sentir bajista</small><small>'+down+'%</small></div><div class="progress progress-lg mt-2"><div class="progress-bar bg-danger" role="progressbar" style="width: '+down+'%" aria-valuenow="'+down+'" aria-valuemin="0" aria-valuemax="100"></div></div></td></tr>
        //<h4 style="float:left;" class="font-weight-normal '+ins+'_Value"></h4><h6 class="'+ins+'_Span"></h6><br>
	     	Swal({
	     		title: '<strong>'+alias+'</strong>',
					html: '<table style="width: 100%;"><tbody><tr><td><div class="form-group"><label style="float: left;">Importe en pesos (MXN):</label><div class="input-group"><div class="input-group-prepend"><span class="input-group-text bg-primary text-white">$</span></div><input type="number" class="form-control soloNumeros" ins="'+ins+'" defaultLimitCoef="'+defaultLimitCoef+'" min="'+minInv+'" id="importeAInvertir" aria-label="Cantidad en pesos" value="'+minInv+'"><div class="input-group-append"></div></div></div><br><div class="form-group"><label style="float: left;">Apalancamiento:</label><select id="apalancamiento">'+cadApalancamiento+'</select><label style="float: right;">Comisión: <span id="comm">'+comm+'</span>%&nbsp;<span id="commEnPesos"></span></label></div><br><div class="form-check form-check-flat form-check-primary"><label class="form-check-label" style="float: left;"><input type="checkbox" id="takeProfit-'+ins+'" class="form-check-input">Cerrar con ganancias $<i class="input-helper"></i></label><input type="number" id="inputTakeProfit-'+ins+'" class="soloNumeros" value="'+SLTP+'" min="'+SLTP+'" max="'+maxSLTP+'" step="1"></div><br><div class="form-check form-check-flat form-check-primary"><label class="form-check-label" style="float: left;"><input type="checkbox" id="stopLoss-'+ins+'" class="form-check-input">Cerrar con pérdidas $<i class="input-helper"></i></label><input type="number" id="inputStopLoss-'+ins+'" class="soloNumeros" value="'+SLTP2+'" min="'+SLTP2+'" max="'+minInv+'" step="1"></div><br><div class="template-demo"><button type="button" id="vender" tipo="V" ins="'+ins+'" minimo="'+minInv+'" sltp="'+SLTP+'" typeIns="'+typeIns+'" class="btn btn-danger btn-icon-text posicionButton"><i class="mdi mdi-arrow-down btn-icon-prepend"></i>Vender</button><button type="button" id="comprar" tipo="C" ins="'+ins+'" minimo="'+minInv+'" sltp="'+SLTP+'" typeIns="'+typeIns+'" class="btn btn-success btn-icon-text posicionButton"><i class="mdi mdi-arrow-up btn-icon-prepend"></i>Comprar</button></div></td></tr></tbody></table>',
					showCloseButton: true,
          showConfirmButton: false,
					width: '80%',
					background : '#111',
          onOpen: () => {         
            $("#swal2-content").css("color","#FFF");
            calcApa();
            $("#inputTakeProfit-"+ins).InputSpinner(configSpinnerTK);
            $("#inputStopLoss-"+ins).InputSpinner(configSpinnerSL);//min="'+SLTP+'" max="'+maxSLTP+'"
          }
			   });
	     }
	  }
	});
});

$(document).on("click",".anaTecnico", function(e) {
  var ins = $(this).attr("ins");
  var alias = $(this).attr("alias");
  var insPrima = ins;
 /* if(ins=="Bitcoin"){insPrima="BITSTAMP:BTCUSD";}
  if(ins=="Litecoin"){insPrima="OKCOIN:LTCUSD";}
  */
  var cad = '<div class="tradingview-widget-container"><div id="technical-analysis"></div><div class="tradingview-widget-copyright"><a href="https://es.tradingview.com/symbols/'+ins+'/" rel="noopener" target="_blank"><span class="blue-text">'+ins+' gráfico</span></a> por TradingView</div></div>';
  swal({
    title: '<strong>Análisis técnico de '+alias+'</strong>',
    html: cad,
    showCloseButton: true,
    showConfirmButton: true,
    width: '80%',
    background : '#111',
    onOpen: () => {        
      new TradingView.widget({
        "container_id": "technical-analysis",
        "width": 998,
        "height": 610,
        "symbol": insPrima,
        "interval": "D",
        "timezone": "exchange",
        "theme": "Dark",
        "style": "1",
        "toolbar_bg": "#f1f3f6",
        "withdateranges": true,
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "save_image": true,
        "studies": [
          "ROC@tv-basicstudies",
          "StochasticRSI@tv-basicstudies",
          "MASimple@tv-basicstudies"
        ],
        "show_popup_button": true,
        "popup_width": "1000",
        "popup_height": "650",
        "news" : [
          "headlines"
        ],
        "locale": "es"
      });
    }//on open
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



$(document).on("change","#importeAInvertir", function(e) {
  calcApa();
  var min = parseInt($(this).attr("min"));
  var val = parseInt($(this).val());
  if(val<min){
    $(this).val(min);
  }
  
  var ins = $(this).attr("ins");
  var defaultLimitCoef = parseFloat($(this).attr("defaultLimitCoef"));
  var valor = parseFloat($(this).val());
  var SLTP = valor*defaultLimitCoef;
  var SLTP2 = SLTP * 2;
  var maxSLTP = SLTP * 100;
  $("#inputTakeProfit-"+ins).attr("min",SLTP);
  $("#inputTakeProfit-"+ins).attr("max",maxSLTP);
  $("#inputTakeProfit-"+ins).val(SLTP);
  $("#inputStopLoss-"+ins).attr("min",SLTP2);
  $("#inputStopLoss-"+ins).attr("max",maxSLTP);
  $("#inputStopLoss-"+ins).val(SLTP2);
  
});

$(document).on("click","#editRFC", function(e) {
  var rfc = $("#rfc").html();
  var cad = '<input type="text" class="form-control" id="rfcInput" placeholder="rfc" maxlength="13" style="width: 300px;display: inline;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <button type="button" class="btn btn-dark btn-rounded" id="guardarRFC"><i class="ti-save"></i> &nbsp;&nbsp;&nbsp;&nbsp;   Guardar</button>';
  $("#rfc").html(cad);
});


$(document).on("click","#editCLABE", function(e) {
  var rfc = $("#rfc").html();
  var cad = '<input type="text" class="form-control" id="CLABEInput" placeholder="CLABE" maxlength="18" style="width: 300px;display: inline;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <button type="button" class="btn btn-dark btn-rounded" id="guardarCLABE"><i class="ti-save"></i> &nbsp;&nbsp;&nbsp;&nbsp;   Guardar</button>';
  $("#tdCLABE").html(cad);
});


$(document).on("click","#guardarCLABE", function(e) {
  var CLABE = $("#CLABEInput").val().trim().toUpperCase();
  if(CLABE.length==18)
  {
    $.ajax({
      url: "https://biv.mx/saveCLABE",
      dataType : "json",
      data : {t : tt, CLABE: CLABE},
      type : "post",
      async : true,
      beforeSend : function (){},
      complete : function (){$("body").css("cursor","default");}, 
      success : function (resp){
        if(resp.success==1)
        {
          cargaPerfil();
        }
      }
    });
  }
  else
  {
    Swal({
      type: 'warning',
      title: '<span style="color:#333333;">La longitud de la CLABE debe de ser 18 caracteres.</span>',
      showConfirmButton: false,
      timer: 10000
    });
  }
});

$(document).on("click","#guardarRFC", function(e) {
  var rfc = $("#rfcInput").val().trim().toUpperCase();
  if(rfc.length==12 || rfc.length==13)
  {
    $.ajax({
      url: "https://biv.mx/saveRFC",
      dataType : "json",
      data : {t : tt, rfc: rfc},
      type : "post",
      async : true,
      beforeSend : function (){},
      complete : function (){$("body").css("cursor","default");}, 
      success : function (resp){
        if(resp.success==1)
        {
          cargaPerfil();
        }
      }
    });
  }
  else
  {
    Swal({
      type: 'warning',
      title: '<span style="color:#333333;">La longitud del rfc debe de ser 12 ó 13 caracteres.</span>',
      showConfirmButton: false,
      timer: 10000
    });
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
var loader= '<div class="content-wrapper"><center><div class="row"><div class="col-md-12 col-sm-12 grid-margin stretch-card"><div style="width: 100%;"><table style="width: 100%;text-align: center;"><tbody><tr><td><div class="jumping-dots-loader"><span></span><span></span><span></span></div></td></tr></tbody></table></div></div></div></center></div>';
function cargaPerfil() {
  clear();
  $("#main-panel").html(loader);
  var cad = '';
  $.ajax({
    url: "https://biv.mx/perfil",
    dataType : "json",
    data : {t : tt},
    type : "post",
    async : true,
    beforeSend : function (){},
    complete : function (){$("body").css("cursor","default");}, 
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
        cad=cad+'<tr><td>Nombre:</td><td>'+resp.nombre+'</td><td class="text-right"><div class="badge badge-pill badge-'+palabra+'">'+tacha+'</div></td></tr>';
        palabra = 'danger';
        tacha = '?';
        if(parseInt(resp.confirmado) == 1)
        {
          palabra = 'success';
          tacha = '<i class="mdi mdi-check"></i>';
        } else {otraTabla = true;}
        cad=cad+'<tr><td>Correo:</td><td>'+resp.correo+'</td><td class="text-right"><div class="badge badge-pill badge-'+palabra+'">'+tacha+'</div></td></tr>';
        palabra = 'danger';
        tacha = '?';
        if(parseInt(resp.direccionVerificado) == 1)
        {
          palabra = 'success';
          tacha = '<i class="mdi mdi-check"></i>';
        } else {otraTabla = true;}
        cad=cad+'<tr><td>Dirección:</td><td>'+resp.direccion+'</td><td class="text-right"><div class="badge badge-pill badge-'+palabra+'">'+tacha+'</div></td></tr>';
        palabra = 'danger';
        tacha = '?';
        if(parseInt(resp.telefonoVerificado) == 1)
        {
          palabra = 'success';
          tacha = '<i class="mdi mdi-check"></i>';
        } else {otraTabla = true;}
        cad=cad+'<tr><td>Celular:</td><td>'+resp.telefono+'</td><td class="text-right"><div class="badge badge-pill badge-'+palabra+'">'+tacha+'</div></td></tr>';
        palabra = 'danger';
        tacha = '?';
        if(parseInt(resp.CLABEVerificado) == 1)
        {
          palabra = 'success';
          tacha = '<i class="mdi mdi-check"></i>';
        } else {otraTabla = true;}
        cad=cad+'<tr><td>CLABE:</td><td id="tdCLABE">'+resp.CLABE+'</td><td class="text-right"><button type="button" class="btn btn-dark btn-icon-text" id="editCLABE">Editar<i class="mdi mdi-file-check btn-icon-append"></i></button></td></tr>';

        cad=cad+'<tr><td>RFC:</td><td id="rfc">'+resp.rfc+'</td><td class="text-right"><button type="button" class="btn btn-dark btn-icon-text" id="editRFC">Editar<i class="mdi mdi-file-check btn-icon-append"></i></button></td></tr>';
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
          tipo = 5;//5 es correo
          if(parseInt(resp.confirmado) == 0)//no tiene
          {
            cad=cad+'<tr><td>Confirmar correo electrónico</td><td><div class="preview" data-toggle="tooltip" data-placement="top" title="Presiona el botón para que le llegue un correo electrónico, el cuál deberá dar click al enlace del correo para confirmar su dirección de correo."><i class="icon-info" style="color: white;font-size: 28px;"></i></div></td><td class="text-right"><div class="form-group"><button id="reconfirmarCorreo" tipo="'+tipo+'" class="btn btn-primary" type="button">Mandar correo</button></div></td></tr>';
          } else{
            /*if(parseInt(resp.confirmado) == 2)//pendiente de revisión
            {
              cad=cad+'<tr><td>Comprobante de CLABE interbancaria</td><td colspan="2"><div class="badge badge-warning badge-pill">Pendiente de revisión</div></td></tr>';
            }*/
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
refresh();
}

$(document).on("click", "#reconfirmarCorreo", function (){
  $.ajax({
    url: "https://biv.mx/reconfirmarCorreo",
    dataType : "json",
    data : {t : tt},
    type : "post",
    async : true,
    beforeSend : function (){},
    complete : function (){$("body").css("cursor","default");}, 
    success : function (resp){
      if(resp.success==1)
      {
        Swal({
            type: 'success',
            title: '<span style="color:#333;">El correo ha sido enviado</span>',
            showConfirmButton: false,
            timer: 5500
          });
      }
      if(resp.success==-1)
      {
        Swal({
            type: 'warning',
            title: '<span style="color:#333;">Hubo un problema para mandar el correo</span>',
            showConfirmButton: false,
            timer: 5500
          });
      }
    }
  });

});

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
    complete : function (){$("body").css("cursor","default");}, 
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
                complete : function (){$("body").css("cursor","default");}, 
                success : function (resp){
                    if(resp.success==1)
                    {
                        Swal({
                          type: 'success',
                          title: '<span style="color:#333;">Se ha confirmado tu número '+number+'</span>',
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
$(document).on("click", ".operCerradasClick", function (){
  cargaPortafolio(1);
});
$(document).on("click", "#perfilMenu", function (){
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $(".navbar-toggler")[1].click();
  }
  
  cargaPerfil();
});
$(document).on("click", "#faq", function (){
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $(".navbar-toggler")[1].click();
  }
  clear();//'<div class="row">'+'<div class="col-12">'+
  var cadMain = '<div class="content-wrapper" id="main2"></div>';
  $("#main-panel").html(cadMain);
  
var cad = '';
              cad=cad+'<div class="row">'+
                '<div class="col-12 grid-margin">'+
                  '<div class="card">'+
                    '<div class="faq-block card-body">'+
                      '<div class="container-fluid py-2">'+
                        '<h5 class="mb-0">Depósitos<br><br><br></h5>'+
                      '</div>'+
                      '<div id="accordion-1" class="accordion">'+
                        '<div class="card">'+
                          '<div class="card-header" id="headingOne">'+
                            '<h5 class="mb-0">'+
                              '<a data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">'+
                                '¿De qué forma puedo realizar un depósito?'+
                              '</a>'+
                            '</h5>'+
                          '</div>'+
                          '<div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion-1">'+
                            '<div class="card-body">'+
                              'Solamente mediante transferencias electrónicas SPEI.'+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                        '<div class="card">'+
                          '<div class="card-header" id="headingTwo2">'+
                            '<h5 class="mb-0">'+
                              '<a data-toggle="collapse" data-target="#collapseTwo2" aria-expanded="true" aria-controls="collapseTwo2">'+
                                '¿Cuánto tiempo se tardan en acreditar mi depósito?'+
                              '</a>'+
                            '</h5>'+
                          '</div>'+
                          '<div id="collapseTwo2" class="collapse show" aria-labelledby="headingTwo2" data-parent="#accordion-1">'+
                            '<div class="card-body">'+
                              'En menos de 24 horas hábiles'+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                        '<div class="card">'+
                          '<div class="card-header" id="headingTwo">'+
                            '<h5 class="mb-0">'+
                              '<a data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">'+
                                '¿Dan factura CFDI?'+
                              '</a>'+
                            '</h5>'+
                          '</div>'+
                          '<div id="collapseTwo" class="collapse show" aria-labelledby="headingTwo" data-parent="#accordion-1">'+
                            '<div class="card-body">'+
                              'Sí, una vez acreditado tu depósito, en la sección de Historial de depósitos, puedes hacer tu facturación en línea. Previamente, en la sección de tu Perfil, deberás subir la documentación requerida e indicar tu RFC.'+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                        '<div class="card">'+
                          '<div class="card-header" id="headingTwo3">'+
                            '<h5 class="mb-0">'+
                              '<a data-toggle="collapse" data-target="#collapseTwo3" aria-expanded="true" aria-controls="collapseTwo3">'+
                                '¿Es seguro utilizar la plataforma BIV en línea?'+
                              '</a>'+
                            '</h5>'+
                          '</div>'+
                          '<div id="collapseTwo3" class="collapse show" aria-labelledby="headingTwo3" data-parent="#accordion-1">'+
                            '<div class="card-body">'+
                              'Toda nuestra plataforma está encriptada, usando la tecnología SSL, por lo que todos los datos sensibles están seguros, encriptados de extremo a extremo.'+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                        '<div class="card">'+
                          '<div class="card-header" id="headingTwo4">'+
                            '<h5 class="mb-0">'+
                              '<a data-toggle="collapse" data-target="#collapseTwo4" aria-expanded="true" aria-controls="collapseTwo4">'+
                                '¿Puedo hacer un depósito usando cuenta bancaria que no esté a mi nombre?'+
                              '</a>'+
                            '</h5>'+
                          '</div>'+
                          '<div id="collapseTwo4" class="collapse show" aria-labelledby="headingTwo4" data-parent="#accordion-1">'+
                            '<div class="card-body">'+
                              'No, los recursos deben de provenir de una cuenta que esté a tu nombre.'+
                            '</div>'+//.card-body
                          '</div>'+//.collapse
                        '</div>'+//.card
                      '</div>'+//.accordion
                    '</div>'+//faq.block
                  '</div>'+//.card
                '</div>'+//.col12
                '</div>';//row
$("#main2").html(cad);
cad='';
                cad=cad+'<div class="row">'+
                 '<div class="col-12 grid-margin">'+
                  '<div class="card">'+
                    '<div class="faq-block card-body">'+
                      '<div class="container-fluid py-2">'+
                        '<h5 class="mb-0">Retiros<br><br><br></h5>'+
                      '</div>'+
                      '<div id="accordion-2" class="accordion">'+
                        '<div class="card">'+
                          '<div class="card-header" id="heading1">'+
                            '<h5 class="mb-0">'+
                              '<a data-toggle="collapse" data-target="#collapse1" aria-expanded="true" aria-controls="collapse1">'+
                                '¿De qué forma puedo realizar un retiro?'+
                              '</a>'+
                            '</h5>'+
                          '</div>'+
                          '<div id="collapse1" class="collapse show" aria-labelledby="heading1" data-parent="#accordion-2">'+
                            '<div class="card-body">'+
                              'Puedes usar transferencias electrónicas SPEI.'+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                        '<div class="card">'+
                          '<div class="card-header" id="heading2">'+
                            '<h5 class="mb-0">'+
                              '<a data-toggle="collapse" data-target="#collapse2" aria-expanded="true" aria-controls="collapse2">'+
                                '¿Cuánto tiempo se tarda el retiro en que esté en mi cuenta?'+
                              '</a>'+
                            '</h5>'+
                          '</div>'+
                          '<div id="collapse2" class="collapse show" aria-labelledby="heading2" data-parent="#accordion-2">'+
                            '<div class="card-body">'+
                              'En menos de 12 horas hábiles.'+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                         '<div class="card">'+
                          '<div class="card-header" id="heading3">'+
                            '<h5 class="mb-0">'+
                              '<a data-toggle="collapse" data-target="#collapse3" aria-expanded="true" aria-controls="collapse3">'+
                                '¿Puedo usar una cuenta diferente a la que use para depositar, para retirar dinero?'+
                              '</a>'+
                            '</h5>'+
                          '</div>'+
                          '<div id="collapse3" class="collapse show" aria-labelledby="heading3" data-parent="#accordion-2">'+
                            '<div class="card-body">'+
                              'No. Por cuestiones de seguridad siempre se efectua el retiro a la cuenta que se usó para depositar. Se podrá retirar en una cuenta diferente, siempre y cuando se certifique que la otra cuenta está también a tu nombre.'+
                            '</div>'+
                          '</div>'+
                        '</div>'
                      '</div>'+
                    '</div>'+
                  '</div>'+
                '</div>'+
                '</div>';
                $("#main2").append(cad);
                cad='';
                cad=cad+'<div class="row">'+
                 '<div class="col-12 grid-margin">'+
                  '<div class="card">'+
                    '<div class="faq-block card-body">'+
                      '<div class="container-fluid py-2">'+
                        '<h5 class="mb-0">Inversiones<br><br><br></h5>'+
                      '</div>'+
                      '<div id="accordion-4" class="accordion">'+
                        '<div class="card">'+
                          '<div class="card-header" id="heading4">'+
                            '<h5 class="mb-0">'+
                              '<a data-toggle="collapse" data-target="#collapse41" aria-expanded="true" aria-controls="collapse41">'+
                                '¿Qué es cerrar con ganancias (take profit)?'+
                              '</a>'+
                            '</h5>'+
                          '</div>'+
                          '<div id="collapse41" class="collapse show" aria-labelledby="heading4" data-parent="#accordion-4">'+
                            '<div class="card-body">'+
                              'Cuando tu posición llegue a la ganancia en pesos seleccionada, se cerrará automáticamente.'+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                        '<div class="card">'+
                          '<div class="card-header" id="heading2">'+
                            '<h5 class="mb-0">'+
                              '<a data-toggle="collapse" data-target="#collapse42" aria-expanded="true" aria-controls="collapse42">'+
                                '¿Qué es cerrar con pérdidas (stop loss)?'+
                              '</a>'+
                            '</h5>'+
                          '</div>'+
                          '<div id="collapse42" class="collapse show" aria-labelledby="heading4" data-parent="#accordion-4">'+
                            '<div class="card-body">'+
                              'Cuando tu posición llegue a la pérdida en pesos seleccionada, se cerrará automáticamente.'+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                         '<div class="card">'+
                          '<div class="card-header" id="heading3">'+
                            '<h5 class="mb-0">'+
                              '<a data-toggle="collapse" data-target="#collapse43" aria-expanded="true" aria-controls="collapse43">'+
                                '¿Existen saldos negativos para mi cuenta?'+
                              '</a>'+
                            '</h5>'+
                          '</div>'+
                          '<div id="collapse43" class="collapse show" aria-labelledby="heading4" data-parent="#accordion-4">'+
                            '<div class="card-body">'+
                              'No. El mínimo saldo es 0. Hay protección para saldos negativos.'+
                            '</div>'+
                          '</div>'+
                        '</div>'
                      '</div>'+
                    '</div>'+
                  '</div>'+
                '</div>'+
                '</div>';
                $("#main2").append(cad);
                cad='';
                cad=cad+'<div class="row">'+
                 '<div class="col-12 grid-margin">'+
                  '<div class="card">'+
                    '<div class="faq-block card-body">'+
                      '<div class="container-fluid py-2">'+
                        '<h5 class="mb-0">Puntos<br><br><br></h5>'+
                      '</div>'+
                      '<div id="accordion-3" class="accordion">'+
                        '<div class="card">'+
                          '<div class="card-header" id="heading31">'+
                            '<h5 class="mb-0">'+
                              '<a data-toggle="collapse" data-target="#collapse31" aria-expanded="true" aria-controls="collapse31">'+
                                '¿Para qué sirven los puntos?'+
                              '</a>'+
                            '</h5>'+
                          '</div>'+
                          '<div id="collapse31" class="collapse show" aria-labelledby="heading31" data-parent="#accordion-3">'+
                            '<div class="card-body">'+
                              'Los puntos pueden ser canjeados por saldo en tu cuenta con BIV. Cada punto vale $10 MXN. O bien, canjearlo por alguno de los productos que se ofrecen en la página.'+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                        '<div class="card">'+
                          '<div class="card-header" id="heading32">'+
                            '<h5 class="mb-0">'+
                              '<a data-toggle="collapse" data-target="#collapse32" aria-expanded="true" aria-controls="collapse32">'+
                                '¿Cómo puedo obtener puntos?'+
                              '</a>'+
                            '</h5>'+
                          '</div>'+
                          '<div id="collapse32" class="collapse show" aria-labelledby="heading32" data-parent="#accordion-3">'+
                            '<div class="card-body">'+
                              'Cada operación dentro de BIV te genera puntos, mientras mayor sea el importe a invertir, más puntos obtedrás.'+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                         '<div class="card">'+
                          '<div class="card-header" id="heading33">'+
                            '<h5 class="mb-0">'+
                              '<a data-toggle="collapse" data-target="#collapse33" aria-expanded="true" aria-controls="collapse33">'+
                                '¿Puedo retirar el dinero obtenido del canje de los puntos?'+
                              '</a>'+
                            '</h5>'+
                          '</div>'+
                          '<div id="collapse33" class="collapse show" aria-labelledby="heading33" data-parent="#accordion-3">'+
                            '<div class="card-body">'+
                              '¡Por supuesto! Puedes retirarlo en cualquier momento.'+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                      '</div>'+
                    '</div>'+
                  '</div>'+
                '</div>'+
              '</div>';
              $("#main2").append(cad);
              cad='';
        //cad=cad+'</div>';//'</div>'+'</div>'+
  refresh();
});
function cargaPortafolio(tipoPortafolio) {
  clear();
  var active0 = "active show";
  var active1 = "";
  if(tipoPortafolio==1){
    active0="";
    active1="active show";
  }
  $("#main-panel").html('<div class="content-wrapper">'+
          '<div class="row">'+
            '<div class="col-md-12 grid-margin stretch-card">'+
              '<div class="card">'+
                '<div class="card-body">'+
                  '<h4 class="card-title"></h4>'+
                  '<p class="card-description"></p>'+
                  '<ul class="nav nav-tabs" role="tablist">'+
                    '<li class="nav-item">'+
                      '<a class="nav-link '+active0+'" id="home-tab" data-toggle="tab" href="#open-1" role="tab" aria-controls="open-1" aria-selected="true">Operaciones abiertas</a>'+
                    '</li>'+
                    '<li class="nav-item">'+
                      '<a class="nav-link '+active1+'" id="profile-tab" data-toggle="tab" href="#close-2" role="tab" aria-controls="close-2" aria-selected="false">Operaciones cerradas</a>'+
                    '</li>'+
                  '</ul>'+
                  '<div class="tab-content">'+
                    '<div class="tab-pane fade '+active0+'" id="open-1" role="tabpanel" aria-labelledby="home-tab">'+
                      '<div class="media" id="operAbiertas"><div class="jumping-dots-loader"><span></span><span></span><span></span></div></div>'+
                    '</div>'+
                    '<div class="tab-pane fade '+active1+'" id="close-2" role="tabpanel" aria-labelledby="profile-tab">'+
                       '<div class="media" id="operCerradas"><div class="jumping-dots-loader" ><span></span><span></span><span></span></div>'+
                      '</div>'+
                    '</div>'+
                  '</div>'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</div>');
  refresh();
}
$(document).on("click", "#portafolioMenu", function (){
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $(".navbar-toggler")[1].click();
  }
  cargaPortafolio(0);//0 abiertas, 1 cerradas
});
 



$(document).on("click", ".facturarDeposito", function (){
  $(this).attr("disabled", "disabled");
  var match = $(this).attr("match");
  var ide = $(this).attr("ide");
  var tipo = $(this).attr("tipo");
  $.ajax({
      url: "https://biv.mx/facturar",
      dataType : "json",
      data : {t : tt, match : match, ide: ide, tipo:tipo},
      type : "post",
      async : true,
      beforeSend : function (){},
      complete : function (){$("body").css("cursor","default");}, 
      success : function (resp){
        if(resp.success==1)
        {
           window.open(
              "/" + resp.pdf,
              '_blank'
            );
        }
        if(resp.success==0)
        {
           Swal({
            type: 'warning',
            title: '<span style="color:#333333;">No se puede facturar con los datos proporcionados.</span>',
            showConfirmButton: false,
            timer: 10000
          });
        }
        if(resp.success==-10)
        {
           Swal({
            type: 'warning',
            title: '<span style="color:#333333;">Este registro ya se encuentra facturado.</span>',
            showConfirmButton: false,
            timer: 10000
          });
        }
        if(resp.success==-11)
        {
           Swal({
            type: 'warning',
            title: '<span style="color:#333333;">No se puede facturar porque el pago lleva más de 30 días naturales.</span>',
            showConfirmButton: false,
            timer: 10000
          });
        }
        if(resp.success==-12)
        {
           Swal({
            type: 'warning',
            title: '<span style="color:#333333;">Por favor, primero escriba su rfc en la sección de perfil.</span>',
            showConfirmButton: false,
            timer: 10000
          });
        }
        if(resp.success==-15)
        {
           Swal({
            type: 'warning',
            title: '<span style="color:#333333;">Por favor, primero confirme su email en la sección de perfil, esto se hace dando click a un correo que le llegará.</span>',
            showConfirmButton: false,
            timer: 10000
          });
        }
        if(resp.success==-20)
        {
           Swal({
            type: 'warning',
            title: '<span style="color:#333333;">Error en facturación, favor de contactar por correo a <a href="mailto:soporte@biv.mx?Subject=Facturacion%20'+ide+'%20'+match+'%20'+tipo+'" target="_top">soporte@biv.mx</a></span>',
            showConfirmButton: false,
            timer: 10000
          });
        }
      }
    });
});
/*
 $("#retirarPP").keydown(function () {
    // Save old value.
    if (!$(this).val() || (parseInt($(this).val()) <= valorMaximo && parseInt($(this).val()) >= 0.01))
    $(this).data("old", $(this).val());
  });
  $("#retirarPP").keyup(function () {
    // Check correct, else revert back to old value.
    if (!$(this).val() || (parseInt($(this).val()) <= valorMaximo && parseInt($(this).val()) >= 0.01))
      ;
    else
      $(this).val($(this).data("old"));
  });*/
var valorMaximo=1;


$(document).on("click", "#retirarSPEI", function (){
  $(this).attr("disabled","disabled");
  $("body").css("cursor","wait");
  var cantidad = parseFloat($("#cantidadARetirar_SPEI").val().trim());
  cantidad = Math.round(cantidad * 100) / 100;
  $.ajax({
    url: "https://biv.mx/retirarSPEI",
    dataType : "json",
    data : {t : tt, cantidad : cantidad},
    type : "post",
    async : true,
    beforeSend : function (){},
    complete : function (){$("body").css("cursor","default");}, 
    success : function (resp){
      $("#retirarSPEI").removeAttr("disabled");
      if(resp.success==1)
      {
        Swal({
          type: 'success',
          title: '<span style="color:#333333;">Su transferencia ha sido procesada, verá la trasnferencia reflejada en un lapso de 24 horas.</span>',
          showConfirmButton: false,
          timer: 10000
        });
      }
      if(resp.success==-1)
      {
        Swal({
          type: 'warning',
          title: '<span style="color:#333333;">Fondos insuficientes, revisa que la cantidad que quieres retirar es igual o menor al saldo de tu cuenta.</span>',
          showConfirmButton: false,
          timer: 10000
        });
      }
    }
  });
});

$(document).on("click", "#retirarPP", function (){
  var cantidad = parseFloat($("#cantidadARetirar").val().trim());
  cantidad = Math.round(cantidad * 100) / 100;
  $(this).attr("disabled","disabled");
  $("body").css("cursor","wait");
  $.ajax({
    url: "https://biv.mx/retirarPayPal",
    dataType : "json",
    data : {t : tt, cantidad : cantidad},
    type : "post",
    async : true,
    beforeSend : function (){},
    complete : function (){$("body").css("cursor","default");}, 
    success : function (resp){
      $("#retirarPP").removeAttr("disabled");
      if(resp.success==1)
      {
        Swal({
          type: 'success',
          title: '<span style="color:#000000;">Retiro en proceso, se le enviará un correo electrónico cuando esté completado.</span>',
          showConfirmButton: false,
          timer: 10000
        });
      }
      if(resp.success==-1)
      {
        Swal({
          type: 'warning',
          title: '<span style="color:#333333;">Error en validación, favor de contactar por correo a <a href="mailto:soporte@biv.mx?Subject=Validacion%20'+tt+'%20'+cantidad+'%20" target="_top">soporte@biv.mx</a></span>',
          showConfirmButton: false,
          timer: 10000
        });
      }
    }
  });
});
$(document).on("click", "#retirar", function (){
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $(".navbar-toggler")[1].click();
  }
  clear();
  var t = parseInt($("#ti").html());
  if(t!=1)
  {
    var cad = '<div class="content-wrapper">'+
          '<div class="row">'+
            '<div class="col-md-12 grid-margin stretch-card">'+
              '<div class="card">'+
                '<div class="card-body">'+
                  '<h4 class="card-title">Fondo demo</h4>'+
                  '<p class="card-description">'+
                    'En el Modo de demostración no existe retiro de recursos.'+
                  '</p>'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</div>';
        $("#main-panel").html(cad);
  }
  if(t==1)
  {
    var cad = '<div class="content-wrapper">'+
          '<div class="row">'+
            '<div class="col-md-12 grid-margin stretch-card">'+
              '<div class="card">'+
                '<div class="card-body">'+
                  '<h4 class="card-title">Retiro de recursos</h4>'+
                  '<p class="card-description">'+
                    ''+
                  '</p>'+
                   '<ul class="nav nav-tabs" role="tablist">'+
                    '<!--li class="nav-item">'+
                      '<a class="nav-link active show" id="home-tab" data-toggle="tab" href="#paypal-2" role="tab" aria-controls="open-1" aria-selected="true">Mercado Pago</a>'+
                    '</li-->'+
                    '<li class="nav-item">'+
                      '<a class="nav-link active show" id="profile-tab" data-toggle="tab" href="#spei-4" role="tab" aria-controls="spei-4" aria-selected="false">SPEI</a>'+
                    '</li>'+
                    '<li class="nav-item">'+
                      '<a class="nav-link" id="profile-tab" data-toggle="tab" href="#historial-5" role="tab" aria-controls="historial-5" aria-selected="false">Historial</a>'+
                    '</li>'+
                  '</ul>'+
                  '<div class="tab-content">'+
                    '<!--div class="tab-pane fade active show" id="paypal-2" role="tabpanel" aria-labelledby="home-tab">'+
                      '<div class="media">'+
                        '<div class="jumping-dots-loader"><span></span><span></span><span></span></div>'+
                      '</div>'+
                    '</div-->'+
                    '<div class="tab-pane fade active show" id="spei-4" role="tabpanel" aria-labelledby="profile-tab">'+
                      '<div class="media">'+
                        '<div class="jumping-dots-loader"><span></span><span></span><span></span></div>'+
                      '</div>'+
                    '</div>'+
                    '<div class="tab-pane fade" id="historial-5" role="tabpanel" aria-labelledby="profile-tab">'+
                       '<div class="media" id="historialDeRetiros"><div class="jumping-dots-loader" ><span></span><span></span><span></span></div>'+
                    '</div>'+
                  '</div>'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</div>';
    $("#main-panel").html(cad);
    $.ajax({
      url: "https://biv.mx/revisarPayPalSPEI",
      dataType : "json",
      data : {t : tt},
      type : "post",
      async : true,
      beforeSend : function (){},
      complete : function (){$("body").css("cursor","default");}, 
      success : function (resp){
        if(resp.success==1)
        {
          if(resp.tienePaypal==0)
          {
            var cad = '<div class="col-md-12 grid-margin"><div class="card"><div class="card-body"><h4 class="card-title" style="font-size:22px;">Retiro usando MercadoPago</h4><p style="font-size:20px;" class="card-description">Para usar el retiro usando Paypal, se debe validar la cuenta, haciendo un depósito usando Paypal.<br>Siempre tratamos de pagar los retiros de recurso usando las mismas fuentes de depósitos, esto por cuestiones de seguridad.</p></div></div></div>';
            $("#paypal-2").html(cad);
          }
          if(resp.tieneSPEI==0)
          {
            var cad = '<div class="col-md-12 grid-margin"><div class="card"><div class="card-body"><h4 class="card-title" style="font-size:22px;">Retiro usando SPEI</h4><p style="font-size:20px;" class="card-description">Para usar el retiro usando Transferencia electrónica, se debe validar la CLABE, en la sección de perfil.</p></div></div></div>';
            $("#spei-4").html(cad);
          }
          if(resp.tienePaypal==1)
          {
            var max = $("#fondo").html().trim();
            max = max.replace("$","");
            max = max.replace(",","");
            max = max.replace(",","");
            valorMaximo = max;
            var cad = '<div class="col-md-12 grid-margin"><div class="card"><div class="card-body"><h4 class="card-title" style="font-size:22px;">Retiro usando MercadoPago</h4><p style="font-size:20px;" class="card-description">El retiro se efectuará al correo registrado en tu cuenta de BIV. El retiro puede verse reflejado en un máximo de 24 horas hábiles.</p><div class="form-group"><div class="input-group"><div class="input-group-prepend"><span class="input-group-text bg-primary text-white">$</span></div><input type="number" class="form-control soloNumeros" max="'+max+'" id="cantidadARetirar" placeholder="Cantidad a retirar"/><div class="input-group-append"><button class="btn btn-sm btn-primary" type="button" id="retirarPP">Retirar</button></div></div></div></div></div></div>';
            $("#paypal-2").html(cad);
          }
          if(resp.tieneSPEI==1)
          {
            var max = $("#fondo").html().trim();
            max = max.replace("$","");
            max = max.replace(",","");
            max = max.replace(",","");
            valorMaximo = max;
            var cad = '<div class="col-md-12 grid-margin"><div class="card"><div class="card-body"><h4 class="card-title" style="font-size:22px;">Retiro usando SPEI</h4><p style="font-size:20px;" class="card-description">El retiro se efectuará a la CLABE: <span class="text-twitter">'+resp.CLABE+'</span> El retiro puede verse reflejado en un máximo de 24 horas hábiles.</p><div class="form-group"><div class="input-group"><div class="input-group-prepend"><span class="input-group-text bg-primary text-white">$</span></div><input type="number" class="form-control soloNumeros" max="'+max+'" id="cantidadARetirar_SPEI" placeholder="Cantidad a retirar"/><div class="input-group-append"><button class="btn btn-sm btn-primary" type="button" id="retirarSPEI">Retirar</button></div></div></div></div></div></div>';
            $("#spei-4").html(cad);
          }
          if(resp.tienePosicionesAbiertas==1)
          {
            var cad = '<div class="col-md-12 grid-margin"><div class="card"><div class="card-body"><h4 class="card-title" style="font-size:22px;">Retiros</h4><p style="font-size:20px;" class="card-description">Para retirar dinero es necesario tener todas las posiciones cerradas.</p></div></div></div>';
            $("#paypal-2").html(cad);
            $("#spei-4").html(cad);
          }
          
        }
      }
    });
    $.ajax({
      url: "https://biv.mx/historialDeRetiros",
      dataType : "json",
      data : {t : tt},
      type : "post",
      async : true,
      beforeSend : function (){},
      complete : function (){$("body").css("cursor","default");}, 
      success : function (resp){
        if(resp.success==1)
        {
          var aver2 = Object.keys(resp.historial);
          var i, j;
          //operCerradas
          var cad='<div class="table-responsive"><table class="table table-striped"><thead><tr>'+
                      '<th>Tipo</th>'+
                      '<th>Cantidad</th>'+
                      '<th>Fecha</th>'+
                      '<th>Status</th>'+
                    '</tr></thead><tbody>';
          for(i=0;i<aver2.length;i++)
          {
            for(j=i;j<aver2.length;j++)
            {
              if(parseInt(resp.historial[aver2[i]].UnixEntrada) < parseInt(resp.historial[aver2[j]].UnixEntrada))
              {
                var aux = aver2[i];
                aver2[i] = aver2[j];
                aver2[j] = aux;
              }

            }
          }
          for(i=0;i<aver2.length;i++)
          {
            var string = numeral(parseFloat(resp.historial[aver2[i]].AMOUNT)).format('$0,0.00');
            var palabra = "Pagada";
            if(resp.historial[aver2[i]].Status=="0")
            {
              palabra = "En proceso";
            }
            cad=cad+'<tr><td>'+resp.historial[aver2[i]].Tipo+'</td><td>'+string+'</td><td>'+resp.historial[aver2[i]].TimeEntrada+'</td><td>'+palabra+'</td></tr>';
          }
          cad=cad+'</tbody></table></div>';
          $("#historialDeRetiros").html(cad);
        }
      }
    });
  }
  refresh();
});

$(document).on("click", ".canjeaPuntosProducto", function (){
   var puntos = $("#puntosDisponibles").attr("puntos").trim().replace(".00","");
  if(puntos=="0")
  {
    Swal({
      type: 'warning',
      title: '<span style="color:#000000;">No tienes suficientes puntos para canjear.</span>',
      showConfirmButton: false,
      timer: 7000
    });
    return;
  }
  var puntosNecesarios = parseInt($(this).attr("puntos"));
  if(parseInt(puntos)<puntosNecesarios)
  {
    Swal({
      type: 'warning',
      title: '<span style="color:#000000;">Necesitas '+puntosNecesarios+' puntos para canjear este producto.</span>',
      showConfirmButton: false,
      timer: 10000
    });
    return;
  }
  var idProducto = parseInt($(this).attr("idProducto"));
  var titulo = $(this).attr("titulo");
  $.ajax({
    url: "https://biv.mx/canjeaPuntosProducto",
    dataType : "json",
    data : {t : tt, idProducto : idProducto},
    type : "post",
    async : true,
    beforeSend : function (){},
    complete : function (){$("body").css("cursor","default");}, 
    success : function (resp) {
      if(resp.success==1)
      {
        Swal({
          type: 'success',
          title: '<span style="color:#000000;">'+resp.pustosCobrados+' puntos usados para adquirir: '+titulo+'</span>',
          showConfirmButton: false,
          timer: 10000
        });
        canjeDePuntos();
      }
      if(resp.success==-11)
      {
        Swal({
          type: 'warning',
          title: '<span style="color:#000000;">El producto ya no está disponible.</span>',
          showConfirmButton: false,
          timer: 10000
        });
      }
      if(resp.success==-12)
      {
        Swal({
          type: 'warning',
          title: '<span style="color:#000000;">No tienes suficientes puntos para este producto.</span>',
          showConfirmButton: false,
          timer: 10000
        });
      }
      if(resp.success==-14)
      {
        Swal({
          type: 'warning',
          title: '<span style="color:#000000;">Tu nombre no ha sido verificado, favor de subir tu documento de identificación en la sección de perfil.</span>',
          showConfirmButton: false,
          timer: 10000
        });
      }
      if(resp.success==-15)
      {
        Swal({
          type: 'warning',
          title: '<span style="color:#000000;">Tu dirección no ha sido verificada, favor de subir tu comprobante de domicilio en la sección de perfil.</span>',
          showConfirmButton: false,
          timer: 10000
        });
      }
      if(resp.success==-16)
      {
        Swal({
          type: 'warning',
          title: '<span style="color:#000000;">Por favor, primero confirme su email en la sección de perfil, esto se hace dando click a un correo que le llegará.</span>',
          showConfirmButton: false,
          timer: 10000
        });
      }
      if(resp.success==0)
      {
        Swal({
          type: 'warning',
          title: '<span style="color:#000000;">Ocurrió un error.</span>',
          showConfirmButton: false,
          timer: 10000
        });
      }
    }
  });
});
$(document).on("click", "#canjearPuntos", function (){
  var puntos = $("#presicionPuntos").attr("puntos").trim().replace(".00","");
  if(puntos=="0")
  {
    Swal({
      type: 'warning',
      title: '<span style="color:#000000;">No tienes puntos para canjear.</span>',
      showConfirmButton: false,
      timer: 10000
    });
    return;
  }
  if(parseInt(puntos)<10)
  {
    Swal({
      type: 'warning',
      title: '<span style="color:#000000;">El mínimo de puntos para canjear es 10.</span>',
      showConfirmButton: false,
      timer: 10000
    });
    return;
  }
  $.ajax({
    url: "https://biv.mx/canjearPuntos",
    dataType : "json",
    data : {t : tt, puntos : puntos},
    type : "post",
    async : true,
    beforeSend : function (){},
    complete : function (){$("body").css("cursor","default");}, 
    success : function (resp) {
      if(resp.success==1)
      {
        Swal({
          type: 'success',
          title: '<span style="color:#000000;">'+resp.pustosCobrados+' puntos acreditados.</span>',
          showConfirmButton: false,
          timer: 10000
        });
        canjeDePuntos();
      }
      if(resp.success==0)
      {
        Swal({
          type: 'warning',
          title: '<span style="color:#000000;">Ocurrió un error.</span>',
          showConfirmButton: false,
          timer: 10000
        });
      }
    }
  });
});
function canjeDePuntos() {
  clear();
  var cad = '<div class="content-wrapper">'+
          '<div class="row">'+
            '<div class="col-md-12 grid-margin stretch-card">'+
              '<div class="card">'+
                '<div class="card-body">'+
                  '<h4 class="card-title">Puntos</h4>'+
                  '<p class="card-description">'+
                    'Canjeo de puntos'+
                  '</p>'+
                   '<ul class="nav nav-tabs" role="tablist">'+
                    '<li class="nav-item">'+
                      '<a class="nav-link active show" id="profile-tab" data-toggle="tab" href="#canjeo-4" role="tab" aria-controls="spei-4" aria-selected="false">Canjeo de puntos</a>'+
                    '</li>'+
                    '<li class="nav-item">'+
                      '<a class="nav-link" id="profile-tab" data-toggle="tab" href="#historial-puntos" role="tab" aria-controls="historial-5" aria-selected="false">Historial</a>'+
                    '</li>'+
                  '</ul>'+
                  '<div class="tab-content">'+
                    '<div class="tab-pane fade active show" id="canjeo-4" role="tabpanel" aria-labelledby="profile-tab">'+
                     '<div class="row">'+
            '<div class="col-md-12 grid-margin stretch-card">'+
              '<div class="card">'+
                '<div class="card-body" id="contenido"><div class="jumping-dots-loader" ><span></span><span></span><span></span></div>'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</div>'+
          '<div id="contenidoAdicional"></div>'+
                    '</div>'+
                    '<div class="tab-pane fade" id="historial-puntos" role="tabpanel" aria-labelledby="profile-tab">'+
                       '<div class="media" id="historialDeCanjeoDePuntos"><div class="jumping-dots-loader" ><span></span><span></span><span></span></div>'+
                    '</div>'+
                  '</div>'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</div>';
  var t = parseInt($("#ti").html());
  var titulo = "";
   /*cad = '<div class="content-wrapper">'+
          '<div class="row">'+
            '<div class="col-md-12 grid-margin stretch-card">'+
              '<div class="card">'+
                '<div class="card-body" id="contenido"><div class="jumping-dots-loader" ><span></span><span></span><span></span></div>'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</div>'+
          '<div id="contenidoAdicional"></div>'+
        '</div>';*/
  $("#main-panel").html(cad);
  $.ajax({
    url: "https://biv.mx/saldoPuntos",
    dataType : "json",
    data : {t : tt},
    type : "post",
    async : true,
    beforeSend : function (){},
    complete : function (){$("body").css("cursor","default");}, 
    success : function (resp) {
      if(resp.success==1)
      {
        var aver2 = Object.keys(resp.productos);
        var i;
        var cadAdicional = '';
        var requi = "Nombre y dirección verificados";
        for (i=0; i < aver2.length; i++) {
          if((i%3)==0) {
            cadAdicional = cadAdicional+'<div class="row">';
          }
          if(resp.productos[aver2[i]].Requisitos=="1,4"){
            requi="Nombre y correo electrónico verificados";
          }
          cadAdicional = cadAdicional+'<div class="col-md-4 grid-margin grid-margin-md-0 stretch-card"><div class="card"><div class="card-body text-center"><div class="mb-4"><img src="https://biv.mx/static/'+resp.productos[aver2[i]].Foto+'" class="img-lg rounded-circle mb-2" alt="profile image"><h4>'+resp.productos[aver2[i]].Titulo+'</h4><p class="text-muted mb-0">Requisitos: '+requi+'</p></div><p class="mt-4 card-text">'+resp.productos[aver2[i]].Descripci+'</p><button class="btn btn-info btn-sm mt-3 mb-4 canjeaPuntosProducto" titulo="'+resp.productos[aver2[i]].Titulo+'" puntos="'+resp.productos[aver2[i]].PuntosProducto+'" idProducto="'+resp.productos[aver2[i]].IdProducto+'">Obtener por '+resp.productos[aver2[i]].PuntosProducto+' puntos</button></div></div></div>';

          if((i%3)==2) {
            cadAdicional = cadAdicional+'</div>';
          }
        }
        $("#contenidoAdicional").html(cadAdicional);
        cadAdicional = '';
        aver2 = Object.keys(resp.historial);
        var j;
        for (i=0; i < aver2.length; i++) {
           for (j=i+i; j < aver2.length; j++) {
             if(parseInt(resp.historial[aver2[i]].Unix) < parseInt(resp.historial[aver2[j]].Unix))
                  {
                    var aux = aver2[i];
                    aver2[i] = aver2[j];
                    aver2[j] = aux;
                  }

           }
        }
        cadAdicional='<div class="table-responsive"><table class="table table-striped"><thead><tr>'+
                          '<th>Producto</th>'+
                          '<th>Puntos</th>'+
                          '<th>Status</th>'+
                          '<th>Fecha</th>'+
                          '<th>Guia</th>'+
                        '</tr></thead><tbody>';
             
        for (i=0; i < aver2.length; i++) {
          if(resp.historial[aver2[i]].Mercancia=="Efectivo"){
            cadAdicional=cadAdicional+'<tr><td>Efectivo</td><td>'+resp.historial[aver2[i]].Puntos+'</td><td>Pagado</td><td>'+resp.historial[aver2[i]].Fecha+'</td><td></td></tr>';  
          } else {
            var sta = "En Proceso";
            if(resp.historial[aver2[i]].Status=="1")
            {
              sta = "Enviado";
            }
            cadAdicional=cadAdicional+'<tr><td>'+resp.historial[aver2[i]].Mercancia+'</td><td>'+resp.historial[aver2[i]].Puntos+'</td><td>'+sta+'</td><td>'+resp.historial[aver2[i]].Fecha+'</td><td>'+resp.historial[aver2[i]].Guia+' '+resp.historial[aver2[i]].Empresa+'</td></tr>';              
          }          
        }
        cadAdicional=cadAdicional+'</tbody></table></div>';
        $("#historialDeCanjeoDePuntos").html(cadAdicional);
        var string = numeral(parseFloat(resp.valorPunto)*10).format('$0,0.00');
        var puntos = resp.puntosDisponibles;
        var puntos10 = parseInt(puntos/10);
        var puntos20 = puntos10 * 2;
        var puntos30 = puntos10 * 3;
        var puntos40 = puntos10 * 4;
        var puntos50 = puntos10 * 5;
        var puntos60 = puntos10 * 6;
        var puntos70 = puntos10 * 7;
        var puntos80 = puntos10 * 8;
        var puntos90 = puntos10 * 9;
        //if(puntos50==5){puntos50=10;}
        if(puntos50<10){puntos50=0;}
        var string2 = numeral(parseFloat(puntos50)*resp.valorPunto).format('$0,0.00');
        var cad =  '<h4 class="card-title">Canjear puntos</h4>'+
                  '<p class="card-description" >'+
                    'Cada 10 puntos pueden ser canjeados por '+string+' MXN. Usted tiene <span class="text-twitter" id="puntosDisponibles" puntos="'+resp.puntosDisponibles+'">'+resp.puntosDisponibles+'</span> puntos disponibles. ¿Cuántos puntos desea canjear?.<br><br><div class="text-twitter" id="presicionPuntos" puntos="'+puntos50+'">'+puntos50+' puntos son '+string2+'</div>'+
                  '</p>';
if(resp.puntosDisponibles>0 && puntos50>0){
              cad=cad+'<div class="mt-5 pt-4 w-75 mx-auto">'+
                        '<div id="soft-limit" class="ul-slider slider-success mb-5 mt-5"></div>'+
                      '</div>'+
                  '<br><br><br><form class="forms-sample">'+
                    '<button type="button" class="btn btn-primary mr-2" id="canjearPuntos">Canjear puntos por efectivo</button>'+
                  '</form>'; 
} else {
  cad=cad+'<p class="card-description" >'+
                    'El mínimo de puntos para canjear es 10 puntos.'+
                  '</p>';
}
        $("#contenido").html(cad);
        if(resp.puntosDisponibles>0 && puntos50>0)
        {
          var softSlider = document.getElementById('soft-limit');
          noUiSlider.create(softSlider, {
            start: [puntos50],
            tooltips: true,
            connect: true,
            range: {
              min: 10,
              max: puntos
            },
            step: 10,
            pips: {
              mode: 'values',
              values: [0, puntos10, puntos20, puntos30, puntos40, puntos50, puntos60, puntos70, puntos80, puntos90, puntos],
              density: 10
            }
          });
          var directionField = document.getElementById('presicionPuntos');
          softSlider.noUiSlider.on('update', function (values, handle) {
            var puntosSeleccionados = values[handle];
            var string2 = numeral(parseFloat(puntosSeleccionados)*resp.valorPunto).format('$0,0.00');
            $("#presicionPuntos").html(puntosSeleccionados+' puntos son '+string2);
            $("#presicionPuntos").attr("puntos",puntosSeleccionados);
          });
        }
      }
    }
  });
  refresh();
}
$(document).on("click", "#puntos", function (){
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $(".navbar-toggler")[1].click();
  }
  canjeDePuntos();
});

$(document).on("click", ".verFactura", function (){
  var uuid = $(this).attr("UUID");
  window.open(
    "static/facturas/"+uuid+".pdf",
    '_blank'
  );
});


$(document).on("click", "#depositar", function (){
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $(".navbar-toggler")[1].click();
  }
  clear();
  var t = parseInt($("#ti").html());
  if(t!=1)
  {
    var cad = '<div class="content-wrapper">'+
          '<div class="row">'+
            '<div class="col-md-12 grid-margin stretch-card">'+
              '<div class="card">'+
                '<div class="card-body">'+
                  '<h4 class="card-title">Fondo demo</h4>'+
                  '<p class="card-description">'+
                    'Fondo de demostración, ¿Desea resetear el fondo de demostración a $10,000.00 (Diez mil 00/100 MXN)? Esto cerrará todas sus operaciones abiertas.'+
                  '</p>'+
                  '<form class="forms-sample">'+
                    '<button type="button" class="btn btn-primary mr-2" id="retearFondoDemo">Resetear fondo demo</button>'+
                  '</form>'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</div>';
        $("#main-panel").html(cad);
  }
  if(t==1)
  {
    $.ajax({
      url: "https://biv.mx/ext",
      dataType : "json",
      data : {t : tt},
      type : "post",
      async : true,
      beforeSend : function (){},
      complete : function (){$("body").css("cursor","default");}, 
      success : function (resp){}
    });
    var cad = '<div class="content-wrapper">'+
          '<div class="row">'+
            '<div class="col-md-12 grid-margin stretch-card">'+
              '<div class="card">'+
                '<div class="card-body">'+
                  '<h4 class="card-title">Depositar</h4>'+
                  '<p class="card-description">'+
                    ''+
                  '</p>'+
                   '<div class="form-group">'+
                          '<label for="cantidadDeposito">Cantidad:</label>'+
                          '<select class="form-control" style="font-size: 20px;" id="cantidadDeposito">'+
                          '<option selected value="500">$500</option>'+
                            '<option value="1000">$1,000</option>'+
                            '<option value="2000">$2,000</option>'+
                            '<option value="3000">$3,000</option>'+
                            '<option value="4000">$4,000</option>'+
                            '<option value="5000">$5,000</option>'+
                            '<option value="6000">$6,000</option>'+
                            '<option value="8000">$8,000</option>'+
                            '<option value="10000">$10,000</option>'+
                            '<option value="15000">$15,000</option>'+
                            '<option value="20000">$20,000</option>'+
                            '<option value="30000">$30,000</option>'+
                            '<option value="40000">$40,000</option>'+
                            '<option value="60000">$60,000</option>'+
                            '<option value="80000">$80,000</option>'+
                            '<option value="100000">$100,000</option>'+
                            '<option value="150000">$150,000</option>'+
                            '<option value="200000">$200,000</option>'+
                            '<option value="300000">$300,000</option>'+
                            '<option value="400000">$400,000</option>'+
                            '<option value="500000">$500,000</option>'+
                            '<option value="600000">$600,000</option>'+
                            '<option value="700000">$700,000</option>'+
                            '<option value="800000">$800,000</option>'+
                            '<option value="900000">$900,000</option>'+
                          '</select>'+
                        '</div>'+
                  '<ul class="nav nav-tabs" role="tablist">'+
                    '<!--li class="nav-item">'+
                      '<a class="nav-link active show" id="home-tab" data-toggle="tab" href="#paypal-1" role="tab" aria-controls="open-1" aria-selected="true">MercadoPago</a>'+
                    '</li-->'+
                    '<li class="nav-item">'+
                      '<a class="nav-link active show" id="profile-tab" data-toggle="tab" href="#spei-3" role="tab" aria-controls="spei-3" aria-selected="false">SPEI</a>'+
                    '</li>'+
                    '<!--li class="nav-item">'+
                      '<a class="nav-link" id="profile-tab" data-toggle="tab" href="#oxxo-2" role="tab" aria-controls="oxxo-2" aria-selected="false">Efectivo</a>'+
                    '</li-->'+
                    '<li class="nav-item">'+
                      '<a class="nav-link" id="profile-tab" data-toggle="tab" href="#historial-2" role="tab" aria-controls="historial-2" aria-selected="false">Historial</a>'+
                    '</li>'+
                  '</ul>'+
                  '<div class="tab-content">'+
                    '<!--div class="tab-pane fade active show" id="paypal-1" role="tabpanel" aria-labelledby="home-tab">'+
                      '<div class="media">'+
                        '<div class="form-group"><center><div id="paypal-button-container"></div></center></div>'+
                      '</div>'+
                    '</div-->'+
                    '<div class="tab-pane fade active show" id="spei-3" role="tabpanel" aria-labelledby="profile-tab">'+
                       '<div class="col-md-12 grid-margin stretch-card">'+
              '<div class="card">'+
                '<div class="card-body">'+
                  '<h4 class="card-title">Instrucciones:</h4>'+
                  '<p class="card-description">Selecciona una cantidad, después genera una referencia y haz una transferencia por <span id="cantidadSPEI">$500.00</span> a la CLABE:  <span class="text-twitter">044597253000774021</span> usando la referencia generada.</p><div class="card-wrapper"><button type="button" id="generateSPEI_reference" class="btn btn-primary mr-2">Genera referencia</button></div><br><br><br><center><span id="referenciaSPEI"></span></center>'+
                '</div>'+
              '</div>'+
            '</div>'+
                    '</div>'+
                    '<!--div class="tab-pane fade" id="oxxo-2" role="tabpanel" aria-labelledby="profile-tab">'+
                       '<center><select id="providers"></select><br><br><div class="d-flex flex-row flex-wrap" style="margin-left: 33%;" id="contentProvider"></div><br><button type="button" id="payOxxo" class="btn btn-primary mr-2">Cargar saldo pagando en:</button></center>'+
                    '</div-->'+
                    '<div class="tab-pane fade" id="historial-2" role="tabpanel" aria-labelledby="profile-tab">'+
                       '<div class="media" id="historialDepositos"><div class="jumping-dots-loader" ><span></span><span></span><span></span></div>'+
                    '</div>'+
                  '</div>'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</div>';
        $("#main-panel").html(cad);
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
          $("#cantidadDeposito").css("color","#000");
        }

         $.ajax({
          url: "https://biv.mx/providers",
          dataType : "json",
          data : {t : tt},
          type : "post",
          async : true,
          beforeSend : function (){},
          complete : function (){$("body").css("cursor","default");}, 
          success : function (resp){
            var pro = '';
            var i;
            for(i=0;i<resp.providers.length;i++)
            {
              var transaction_limit = parseFloat(resp.providers[i].transaction_limit);
              var limit_per_transaction = parseFloat(resp.providers[i].limit_per_transaction);
              var limite = transaction_limit;
              if(limit_per_transaction<transaction_limit)
              {
                limite = limit_per_transaction;
              }
              limite = transaction_limit;
              var commission = parseFloat(resp.providers[i].commission);
              pro=pro+'<option commission="'+commission+'" limite="'+limite+'" image="'+resp.providers[i].image_medium+'" availability="'+resp.providers[i].availability+'" value="'+resp.providers[i].internal_name+'" name="'+resp.providers[i].name+'">'+resp.providers[i].name+'</option>';
            }
            $("#providers").html(pro);
            i=0;
            var image = resp.providers[i].image_medium
            var name = resp.providers[i].name;
            var availability = resp.providers[i].availability;
            var commission = parseFloat(resp.providers[i].commission);
            var cadAdicional = '';
            if(commission>0)
            {
              cadAdicional=cadAdicional+'<br>Comisión: $'+commission;
            }
            var transaction_limit = parseFloat(resp.providers[i].transaction_limit);
            var limit_per_transaction = parseFloat(resp.providers[i].limit_per_transaction);
            var limite = transaction_limit;
            if(limit_per_transaction<transaction_limit)
            {
              limite = limit_per_transaction;
            }
            limite = transaction_limit;
            var nombreReal = resp.providers[i].internal_name;
            var string = numeral(parseFloat(limite)).format('$0,0.00');
            var cad = '<img src="'+image+'" alt="'+name+'"><div class="ml-3"><h6>'+name+'</h6><p class="text-muted">'+availability+'</p><p class="mt-2 text-primary">Límite: '+string+' '+cadAdicional+'</p></div></div>';
            $("#contentProvider").html(cad);
            $("#payOxxo").html("Cargar saldo pagando en: "+name);
            
          }
        });
        actualizaPayPal();
        
        $.ajax({
          url: "https://biv.mx/historialDepositos",
          dataType : "json",
          data : {t : tt},
          type : "post",
          async : true,
          beforeSend : function (){},
          complete : function (){$("body").css("cursor","default");}, 
          success : function (resp){
            if(resp.success==1)
            {
              var aver2 = Object.keys(resp.historial);
              var i, j;
              //operCerradas
              var cad='<div class="table-responsive"><table class="table table-striped"><thead><tr>'+
                          '<th>Tipo</th>'+
                          '<th>Cantidad</th>'+
                          '<th>Fecha</th>'+
                          '<th>Factura</th>'+
                        '</tr></thead><tbody>';
              for(i=0;i<aver2.length;i++)
              {
                for(j=i;j<aver2.length;j++)
                {
                  if(parseInt(resp.historial[aver2[i]].UnixEntrada) < parseInt(resp.historial[aver2[j]].UnixEntrada))
                  {
                    var aux = aver2[i];
                    aver2[i] = aver2[j];
                    aver2[j] = aux;
                  }

                }
              }
              for(i=0;i<aver2.length;i++)
              {
                var string = numeral(parseFloat(resp.historial[aver2[i]].AMOUNT)).format('$0,0.00');
                if(resp.historial[aver2[i]].UUID==""){
                  cad=cad+'<tr><td>'+resp.historial[aver2[i]].Tipo+'</td><td>'+string+'</td><td>'+resp.historial[aver2[i]].TimeEntrada+'</td><td><button type="button" tipo="'+resp.historial[aver2[i]].Tipo+'" ide="'+resp.historial[aver2[i]].ID+'" match="'+resp.historial[aver2[i]].MatchFacturacion+'" class="btn btn-outline-secondary btn-icon-text facturarDeposito"><i class="mdi mdi-file-check btn-icon-prepend"></i>Facturar</button></td></tr>';  
                } else{
                  cad=cad+'<tr><td>'+resp.historial[aver2[i]].Tipo+'</td><td>'+string+'</td><td>'+resp.historial[aver2[i]].TimeEntrada+'</td><td><button type="button" tipo="'+resp.historial[aver2[i]].Tipo+'" ide="'+resp.historial[aver2[i]].ID+'" UUID="'+resp.historial[aver2[i]].UUID+'" class="btn btn-outline-primary btn-icon-text verFactura"><i class="mdi mdi-file-check btn-icon-prepend"></i>Ver factura</button></td></tr>';
                }
                
              }
              cad=cad+'</tbody></table></div>';
              $("#historialDepositos").html(cad);
            }
          }
        });
  } //if
  refresh();
});
//var can;
function actualizaPayPal() {
   var can = parseInt($("#cantidadDeposito").val());
/*if(can==4000){
  $("#paypal-button-container").html(`<a mp-mode="dftl" href="https://www.mercadopago.com/mlm/checkout/start?pref_id=425387166-32a133f2-782c-46e1-8edc-b77196116137" name="MP-payButton" class='blue-ar-l-rn-none'>Pagar</a><script type="text/javascript">(function(){function $MPC_load(){window.$MPC_loaded !== true && (function(){var s = document.createElement("script");s.type = "text/javascript";s.async = true;s.src = document.location.protocol+"//secure.mlstatic.com/mptools/render.js";var x = document.getElementsByTagName('script')[0];x.parentNode.insertBefore(s, x);window.$MPC_loaded = true;})();}window.$MPC_loaded !== true ? (window.attachEvent ?window.attachEvent('onload', $MPC_load) : window.addEventListener('load', $MPC_load, false)) : null;})();</script>`);
}*/
/*
        paypal.Button.render({
          env: 'production', // sandbox | production
          style: {
            layout: 'vertical',  // horizontal | vertical
            size:   'medium',    // medium | large | responsive
            shape:  'rect',      // pill | rect
            color:  'gold'       // gold | blue | silver | white | black
          },
          funding: {
            allowed: [
              paypal.FUNDING.CARD,
              paypal.FUNDING.CREDIT
            ],
            disallowed: []
          },
          commit: true,
          client: {
            sandbox: 'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R',
            production: 'AducYgBtpfS2Wqeo4H_FOG49ATcN-NgwihMagurtmrDo6CVqGZjtme7iy5VnYI-pK5bOqMrb9Bn1q9iW'
          },
          payment: function (data, actions) {
            return actions.payment.create({
              payment: {
                transactions: [
                {
                  amount: {
                    total: can,
                    currency: 'MXN'
                    }
                }]
              }
            });
          },
          onAuthorize: function (data, actions) {
              return actions.payment.execute().then(function() {
                $.ajax({
                  url: "https://biv.mx/deppp",
                  dataType : "json",
                  data : {t : tt, can:can, orderID : data.orderID, payerID : data.payerID, paymentID : data.paymentID, paymentToken : data.paymentToken},
                  type : "post",
                  async : true,
                  beforeSend : function (){},
                  complete : function (){$("body").css("cursor","default");}, 
                  success : function (resp){
                    Swal({
                      type: 'success',
                      title: '<span style="color:#000000;">Recarga de saldo acreditada.</span>',
                      showConfirmButton: false,
                      timer: 25000
                    });
                  }
                });
          });
          }//on authorize
        }, '#paypal-button-container');  
        */

}
$(document).on("change", "#cantidadDeposito", function (){
  var can = parseInt($(this).val());
  var string = numeral(parseFloat(can)).format('$0,0.00');
  $("#cantidadSPEI").html(string);
  actualizaPayPal();
});


$(document).on("change", "#providers", function (){
  var image = $("#providers option:selected").attr("image");
  var name = $("#providers option:selected").attr("name");
  var availability = $("#providers option:selected").attr("availability");
  var commission = parseFloat($("#providers option:selected").attr("commission"));
  var cadAdicional = '';
  if(commission>0)
  {
    cadAdicional=cadAdicional+'<br>Comisión: $'+commission;
  }
  var limite = $("#providers option:selected").attr("limite");
  var nombreReal = $("#providers").val();
  var string = numeral(parseFloat(limite)).format('$0,0.00');
  var cad = '<img src="'+image+'" alt="'+name+'"><div class="ml-3"><h6>'+name+'</h6><p class="text-muted">'+availability+'</p><p class="mt-2 text-primary">Límite: '+string+' '+cadAdicional+'</p></div></div>';
  $("#contentProvider").html(cad);
  $("#payOxxo").html("Cargar saldo pagando en: "+name);
});


                    

$(document).on("click", "#generateSPEI_reference", function (){
  var can = parseInt($("#cantidadDeposito").val());
  $("body").css("cursor","wait");
  $("#generateSPEI_reference").attr("disabled","disabled");
  $.ajax({
      url: "https://biv.mx/generateSPEI_reference",
      dataType : "json",
      data : {t : tt, can : can},
      type : "post",
      async : true,
      beforeSend : function (){},
      complete : function (){$("body").css("cursor","default");}, 
      success : function (resp){
        if(resp.success==1)
        {
          $("#referenciaSPEI").html("Referencia: "+resp.reference);
          $("body").css("cursor","default");
          $("#generateSPEI_reference").removeAttr("disabled");
        }
      }
    });
});
$(document).on("click", "#payOxxo", function (){
  var name = $("#providers option:selected").attr("name");
  var image = $("#providers option:selected").attr("image");
  var nombreReal = $("#providers").val();
  var limite = parseFloat($("#providers option:selected").attr("limite"));
  var string = numeral(parseFloat(limite)).format('$0,0.00');
   var can = parseInt($("#cantidadDeposito").val());
   if(can>limite)
   {
    Swal({
      type: 'warning',
      title: '<span style="color:#000000;">Lo sentimos, el límite de pago en '+name+' es '+string+'</span>',
      showConfirmButton: true
    });
    return;
   }
   $("body").css("cursor","wait");
  $("#payOxxo").attr("disabled","disabled");
  
   $.ajax({
      url: "https://biv.mx/payOxxo",
      dataType : "json",
      data : {t : tt, can : can, nombreReal : nombreReal},
      type : "post",
      async : true,
      beforeSend : function (){},
      complete : function (){$("body").css("cursor","default");}, 
      success : function (resp){
        if(resp.success==1)
        {
          var type = resp["reference"]["type"];
          $("body").css("cursor","default");
          $("#payOxxo").removeAttr("disabled");
          if(type=="error")
          {
            var message = resp["reference"]["message"];
            Swal({
              type: 'warning',
              title: '<span style="color:#000000;">'+message+'</span>',
              showConfirmButton: true
            });
          }
          else
          {
            if(type=="charge.pending")
            {
              var description = resp["reference"]["instructions"]["description"];
              var note_confirmation = resp["reference"]["instructions"]["note_confirmation"];
              var note_expiration_date = resp["reference"]["instructions"]["note_expiration_date"];
              var note_extra_comition = resp["reference"]["instructions"]["note_extra_comition"];
              var step_1 = resp["reference"]["instructions"]["step_1"];
              var step_2 = resp["reference"]["instructions"]["step_2"];
              var step_3 = resp["reference"]["instructions"]["step_3"];

              var bank_account_holder_name = resp["reference"]["instructions"]["details"]["bank_account_holder_name"];
              var bank_account_number = resp["reference"]["instructions"]["details"]["bank_account_number"];
              var bank_name = resp["reference"]["instructions"]["details"]["bank_name"];
              var bank_reference = resp["reference"]["instructions"]["details"]["bank_reference"];
              var trs = '<tr><td colspan="2"><br></td></tr><tr><td colspan="2">'+note_confirmation+'</td></tr>';
              trs = trs + '<tr><td colspan="2"><br></td></tr>';
              trs = trs + '<tr><td colspan="2">'+note_expiration_date+'</td></tr>';
              trs = trs + '<tr><td colspan="2"><br></td></tr>';
              trs = trs + '<tr><td colspan="2">'+note_extra_comition+'</td></tr>';
              trs = trs + '<tr><td colspan="2"><br></td></tr>';
              trs = trs + '<tr><td colspan="2">Instrucciones: '+step_1+'</td></tr>';
              trs = trs + '<tr><td colspan="2"><br></td></tr>';
              trs = trs + '<tr><td colspan="2" style="text-align: center;background-color: #dfdfe9;border-radius: 3px;padding: .5rem .9375rem;font-size:24px;">'+step_2+'</td></tr>';
              trs = trs + '<tr><td colspan="2"><br></td></tr>';
              trs = trs + '<tr><td colspan="2">'+step_3+'</td></tr>';
              trs = trs + '<tr><td colspan="2"><br></td></tr>';
              trs = trs + '<tr><td colspan="2">Una vez procesado el pago, por compropago, volver a entrar a https://biv.mx/login </td></tr>';
              trs = trs + '<tr><td colspan="2"><br></td></tr>';
              trs = trs + '<tr><td colspan="2"><br></td></tr>';
              trs = trs + '<tr><td colspan="2">Pago procesado por: <img src="https://biv.mx/static/biv_home_files/compropago.png" width="134px" height="25px"/></td></tr>';
              trs = trs + '<tr><td colspan="2"><br></td></tr>';
              trs = trs + '<tr><td colspan="2"><br></td></tr>';
              trs = trs + '<tr><td colspan="2"><button type="button" id="printOxxo" class="btn btn-info btn-icon-text">Imprimir<i class="mdi mdi-printer btn-icon-append"></i></button></td></tr>';
              Swal({
                type: 'success',//width="170px" height="79px"
                title: '<table id="print" width="100%" style="color:#3C3C3C;font-size: 16px;text-align: center;"><tbody><tr><td><img src="'+image+'" /></td><td>'+description+'</td></tr>'+trs+'</tbody></table>',
                showConfirmButton: true,
                width: '80%'
              });

            }
          }
        }
      }
    });  
});
$(document).on("click", "#printOxxo", function (){
  $.print("#print" /*, options*/);
});
$(document).on("click", "#payTarjeta", function (){
  var nameCard = $("#nameCard").val().trim();
  
  var successResponseHandler = function(token) {
      var can = parseInt($("#cantidadDeposito").val());
      $.ajax({
        url: "https://biv.mx/payTarjeta",
        dataType : "json",
        data : {t : tt, can : can, token : token.id, nameCard : nameCard },
        type : "post",
        async : true,
        beforeSend : function (){},
        complete : function (){$("body").css("cursor","default");}, 
        success : function (resp){
          if(resp.success==1)
          {
          }
        }
      });
  };
  var errorResponseHandler = function(error) {
    alert(error);
  };
  if(nameCard.length==0)
  {
    Swal({
        type: 'warning',
        title: '<span style="color:#000000;">Favor de escribir el nombre de la tarjeta.</span>',
        showConfirmButton: true
      });
    return;
  }
  var cardNumber = $("#cardNumber").val().trim();
  if(cardNumber.length==0)
  {
    Swal({
        type: 'warning',
        title: '<span style="color:#000000;">Favor de escribir el número de la tarjeta.</span>',
        showConfirmButton: true
      });
    return;
  }
  
  var cvv = $("#cvv").val().trim();
  if(cvv.length!=3)
  {
    Swal({
        type: 'warning',
        title: '<span style="color:#000000;">Favor de escribir el CVV de la tarjeta.</span>',
        showConfirmButton: true
      });
    return;
  }
  var expiry = $("#expiry").val().trim();
  var aa = expiry.split("/");
  var month = aa[0].trim();
  if(aa.length<2)
  {
    Swal({
        type: 'warning',
        title: '<span style="color:#000000;">Favor de completar la fecha de expiración de la tarjeta.</span>',
        showConfirmButton: true
      });
    return;
  }
  var anio = aa[1].trim();
  if(!Conekta.card.validateNumber(cardNumber))
  {
    Swal({
        type: 'warning',
        title: '<span style="color:#000000;">Favor de confirmar el número de tarjeta.</span>',
        showConfirmButton: true
      });
    return;
  }

  var tokenParams = {
    "card": {
      "number": cardNumber,
      "name": nameCard,
      "exp_year": anio,
      "exp_month": month,
      "cvc": cvv
    }  
  };
  Conekta.Token.create(tokenParams, successResponseHandler, errorResponseHandler);
});

$(document).on("click", "#cierraSesion", function (){
  $.ajax({
    url: "https://biv.mx/cierraSesion",
    dataType : "json",
    data : {t : tt},
    type : "post",
    async : true,
    beforeSend : function (){},
    complete : function (){window.location="https://biv.mx/login";$("body").css("cursor","default");}, 
    success : function (resp){
      //if(resp.success==1){window.location="https://biv.mx/login";}
    }
  });   
});

$(document).on("click", "#retearFondoDemo", function (){
  $.ajax({
    url: "https://biv.mx/retearFondoDemo",
    dataType : "json",
    data : {t : tt},
    type : "post",
    async : true,
    beforeSend : function (){},
    complete : function (){$("body").css("cursor","default");}, 
    success : function (resp){
      if(resp.success==1)
      {
        Swal({
          type: 'success',
          title: '<span style="color:#333;">Se ha reseteado el fondo de demostración.</span>',
          showConfirmButton: false,
          timer: 2500
        });
      }
    }
  });   
});
function time2TimeAgo(ts) {
    var d=new Date();
    var nowTs = Math.floor(d.getTime()/1000);
    var seconds = nowTs-ts;
    // more that two days
    if (seconds > 2*86400) {
      var dias = Math.floor(seconds/86400);
       return "hace "+dias+" días";
    }
    // a day
    if (seconds > 24*3600) {
       return "ayer";
    }
    if (seconds > 3600) {
      var horas = Math.floor(seconds/3600);
       return "hace "+horas+" horas";
    }
    //if (seconds > 1800) {return "hace media hora";}
    if (seconds > 60) {
       return "hace "+Math.floor(seconds/60) + " minutos";
    }
    if (seconds <= 60) {
       return "justo ahora";
    }
}
var alias, notifications;
function refresh() {if(socket.conn.readyState==1){socket.Emit("openPositionList","openPositionList");}}

$(document).on("click", ".settings-close", function (){
  $("#right-sidebar").removeClass("open");    
});


$(document).on("click", "#cerrarButtonPos", function (){
  var ins = $(this).attr("ins");
  var carlosRocha = $(this).attr("carlosRocha");
  $.ajax({
    url: "https://biv.mx/cerrarPos",
    dataType : "json",
    data : {t : tt, ins: ins, carlosRocha : carlosRocha},
    type : "post",
    async : true,
    beforeSend : function (){},
    complete : function (){$("body").css("cursor","default");}, 
    success : function (resp){
      if(resp.success==1)
      {
        $("#right-sidebar").removeClass("open");
      }
    }
  });
     
});


$(document).on("click", "#closeEdit", function (){
  $("#right-sidebar").removeClass("open");    
});

$(document).on("click", "#editarButtonPos", function (){
  var ins = $(this).attr("ins");
  var carlosRocha = $(this).attr("carlosRocha");
  var inputTakeProfit = $("#inputTakeProfit-"+ins).val();
  var stopLoss = $("#inputStopLoss-"+ins).val();  
  inputTakeProfit = inputTakeProfit.replace(",","");
  inputTakeProfit = inputTakeProfit.replace(",","");
  stopLoss = stopLoss.replace(",","");
  stopLoss = stopLoss.replace(",","");
  var debo_takeProfit = document.getElementById('takeProfit-'+ins).checked;
  var debo_stopLoss = document.getElementById('stopLoss-'+ins).checked;
  var TK = "0", SL = "0";
  if(debo_takeProfit){TK="1";}
  if(debo_stopLoss){SL="1";}
  
  $.ajax({
    url: "https://biv.mx/editarPos",
    dataType : "json",
    data : {TK:TK, SL:SL, inputTakeProfit : inputTakeProfit, stopLoss : stopLoss, t : tt, ins: ins, carlosRocha : carlosRocha},
    type : "post",
    async : true,
    beforeSend : function (){},
    complete : function (){$("body").css("cursor","default");}, 
    success : function (resp){
      if(resp.success==1)
      {
        $("#right-sidebar").removeClass("open");
      }
    }
  });
});
$(document).on("click", ".editPos", function (){
  $("#right-sidebar").html('<div class="jumping-dots-loader" style="margin-top:100%;"><span></span><span></span><span></span></div>');
  alopmar = 1;
  rolando = 0;
  carlosRochaGlobal = $(this).attr("carlosRocha");
  if(!$("#right-sidebar").hasClass("open"))
  {
    $("#right-sidebar").addClass("open");    
  }
});
var loader2= '<div class="jumping-dots-loader" style="margin-top:100%;"><span></span><span></span><span></span></div>';
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
var carlosRochaGlobal=0;
function getInstruments() {
  $.ajax({
    url: "https://biv.mx/listaRelated",
    dataType : "json",
    type : "get",
    async : true,
    data : {symbol: "USDJPY"},
    beforeSend : function (){},
    complete : function (){$("body").css("cursor","default");}, 
    success : function (resp){
      if(resp.success==1)
      {
        var aver2 = Object.keys(resp.list.Instruments);
        var i, cad='<div class="content-wrapper">';
        var max = 10;
        for(i=0;i<aver2.length && i<max;i++)
        {
          //var ins = resp.list[aver2[i]].Ins;
          var ins = resp.list.Instruments[aver2[i]].Symbol;
          var insSaneado = ins.replace("/","");
          if(i%2==0)
          {
            cad=cad+'<div class="row">';
          }
          var anaTecnico = '<button type="button" ins="'+ins+'" class="btn btn-primary btn-icon-text anaTecnico" style="padding: 10px;margin-bottom: 10px;"><i class="ti-stats-up"></i>Análisis técnico</button>';
          //<div class="jumping-dots-loader"><span></span><span></span><span></span></div>
          cad=cad+' <div class="col-lg-6 grid-margin stretch-card"><div class="card" style="cursor:default;" ins="'+ins+'"><div class="card-body"><h3 class="card-title">'+ins+'<span class="derecha"></span><span class="'+insSaneado+'_Span derecha"></span></h3>'+anaTecnico+' <button type="button" class="btn btn-info btn-icon-text cardOpenPosition" ins="'+ins+'" style="float:right;padding: 10px;"><i class="mdi mdi-play btn-icon-append"></i>Abrir posición</button><h4 class="font-weight-normal '+insSaneado+'_Value"></h4><br><br><br><div class="flot-chart-container"><div id="'+insSaneado+'" class="flot-chart"><div class="jumping-dots-loader"><span></span><span></span><span></span></div></div></div></div></div></div>';
          if(i%2==1)
          {
            cad=cad+'</div>';
          }
        }
        $("#main-panel").html(cad);
        for(i=0;i<aver2.length && i<max;i++)
        {
          var ins = resp.list.Instruments[aver2[i]].Symbol;
          //var ins = resp.list[aver2[i]].Ins;  
          actualizaGraficas(ins);
        }
      }
    }
  });
}

function cargaConjunto(palabraClave) {
  clear();
  $("#main-panel").html(loader);
  var cad = '';
  $.ajax({
    url: "https://biv.mx/lista",
    dataType : "json",
    type : "get",
    async : true,
    data : {t:tt} ,
    beforeSend : function (){},
    complete : function (){$("body").css("cursor","default");}, 
    success : function (resp){
      if(resp.success==1)
      {
        var aver2 = Object.keys(resp.list.Instruments);
        var i, cad='<div class="content-wrapper">';
        var max = 1000;
        var montiel = new Array();
        for(i=0;i<aver2.length && i<max;i++)
        {
          var type = resp.list.Instruments[aver2[i]].Type;
          if(type==palabraClave)
          {
            montiel.push(aver2[i]);
          }
        }
        for(i=0;i<montiel.length && i<max;i++)
        {
          var ins = resp.list.Instruments[montiel[i]].Symbol;
          var alias = resp.list.Instruments[montiel[i]].Alias;
          var insSaneado = ins.replace("/","");
          var Tecnico = resp.list.Instruments[montiel[i]].Tecnico;
          if(i%2==0)
          {
            cad=cad+'<div class="row">';
          }
          var fav = '<a href="javascript:;" ins="'+ins+'" tipo="0" class="favorito"><i class="fa fa-star-o"></i></a>';
          if(resp.list.Instruments[montiel[i]].Favorite=="1")
          {
              fav = '<a href="javascript:;" ins="'+ins+'" tipo="1" class="favorito"><i class="fa fa-star"></i></a>';
          }
          var anaTecnico = '<button type="button" alias="'+alias+'" ins="'+Tecnico+'" class="btn btn-primary btn-icon-text anaTecnico" style="padding: 10px;margin-bottom: 10px;"><i class="ti-stats-up"></i>Análisis técnico</button>';
          if(Tecnico==""){
            anaTecnico="";
          }
          cad=cad+' <div class="col-lg-6 grid-margin stretch-card"><div class="card" style="cursor:default;" ins="'+ins+'"><div class="card-body"><h3 class="card-title">'+fav+' '+alias+'<span class="derecha"></span><span class="'+insSaneado+'_Span derecha"></span></h3>'+anaTecnico+' <button type="button" class="btn btn-info btn-icon-text cardOpenPosition" alias="'+alias+'" ins="'+ins+'" style="float:right;padding: 10px;"><i class="mdi mdi-play btn-icon-append"></i>Abrir posición</button><h4 class="font-weight-normal '+insSaneado+'_Value"></h4><br><br><br><div class="flot-chart-container"><div id="'+insSaneado+'" class="flot-chart"><div class="jumping-dots-loader"><span></span><span></span><span></span></div></div></div></div></div></div>';
          if(i%2==1)
          {
            cad=cad+'</div>';
          }
        }
        $("#main-panel").html(cad);
        giovanny = new Array();
        for(i=0;i<montiel.length && i<max;i++)
        {
          var ins = resp.list.Instruments[montiel[i]].Symbol;
          actualizaGraficas(ins);
          giovanny.push(ins);
        }
      }
    }
  });
  refresh();
}

function cargaFavoritos() {
  clear();
  $("#main-panel").html(loader);
  var cad = '';
  $.ajax({
    url: "https://biv.mx/lista",
    dataType : "json",
    type : "get",
    async : true,
    data : {t:tt} ,
    beforeSend : function (){},
    complete : function (){$("body").css("cursor","default");}, 
    success : function (resp){
      if(resp.success==1)
      {
        var aver2 = Object.keys(resp.list.Instruments);
        var i, cad='<div class="content-wrapper">';
        var max = 1000;
        var montiel = new Array();
        insArray = new Array();
        for(i=0;i<aver2.length && i<max;i++)
        {
          if(resp.list.Instruments[aver2[i]].Alias==resp.list.Instruments[aver2[i]].Symbol)
          {
            insArray.push(resp.list.Instruments[aver2[i]].Symbol);
          }
          else {
           insArray.push(resp.list.Instruments[aver2[i]].Symbol+" - "+resp.list.Instruments[aver2[i]].Alias); 
          }
          var type = resp.list.Instruments[aver2[i]].Favorite;
          if(type=="1")
          {
            montiel.push(aver2[i]);
          }
        }
        for(i=0;i<montiel.length && i<max;i++)
        {
          var ins = resp.list.Instruments[montiel[i]].Symbol;
          var alias = resp.list.Instruments[montiel[i]].Alias;
          var Tecnico = resp.list.Instruments[montiel[i]].Tecnico;
          var insSaneado = ins.replace("/","");
          if(i%2==0)
          {
            cad=cad+'<div class="row">';
          }
          var fav = '<a href="javascript:;" ins="'+ins+'" tipo="0" class="favorito"><i class="fa fa-star-o"></i></a>';
          if(resp.list.Instruments[montiel[i]].Favorite=="1")
          {
              fav = '<a href="javascript:;" ins="'+ins+'" tipo="1" class="favorito"><i class="fa fa-star"></i></a>';
          }
          var anaTecnico = '<button type="button"  alias="'+alias+'" ins="'+Tecnico+'" class="btn btn-primary btn-icon-text anaTecnico" style="padding: 10px;margin-bottom: 10px;"><i class="ti-stats-up"></i>Análisis técnico</button>';
          if(Tecnico==""){
            anaTecnico="";
          }
          cad=cad+' <div class="col-lg-6 grid-margin stretch-card"><div class="card" style="cursor:default;" ins="'+ins+'"><div class="card-body"><h3 class="card-title">'+fav+' '+alias+'<span class="derecha"></span><span class="'+insSaneado+'_Span derecha"></span></h3>'+anaTecnico+' <button type="button" class="btn btn-info btn-icon-text cardOpenPosition" alias="'+alias+'" ins="'+ins+'" style="float:right;padding: 10px;"><i class="mdi mdi-play btn-icon-append"></i>Abrir posición</button><h4 class="font-weight-normal '+insSaneado+'_Value"></h4><br><br><br><div class="flot-chart-container"><div id="'+insSaneado+'" class="flot-chart"><div class="jumping-dots-loader"><span></span><span></span><span></span></div></div></div></div></div></div>';
          if(i%2==1)
          {
            cad=cad+'</div>';
          }
        }
        $("#main-panel").html(cad);
        giovanny = new Array();
        for(i=0;i<montiel.length && i<max;i++)
        {
          var ins = resp.list.Instruments[montiel[i]].Symbol;
          actualizaGraficas(ins);
          giovanny.push(ins);
        }
        $('#searchInput').typeahead({
          hint: true,
          highlight: true,
          minLength: 1
        }, {
          name: 'instrumentos',
          source: substringMatcher(insArray)
        });
        
      }
    }
  });
  refresh();
}

function cargaAlzaBaja(tipoAlzaBaja) {
  clear();
  $("#main-panel").html(loader);
  var cad = '';
  $.ajax({
    url: "https://biv.mx/lista",
    dataType : "json",
    type : "get",
    async : true,
    data : {t:tt} ,
    beforeSend : function (){},
    complete : function (){$("body").css("cursor","default");}, 
    success : function (resp){
      if(resp.success==1)
      {
        var aver2 = Object.keys(resp.list.Instruments);
        var i, cad='<div class="content-wrapper">';
        var max = 1000;
        var montiel = new Array();
        var gerryWa = new Array();
        var ricardonetpay = new Array();
        var instrumentos = new Array();
        insArray = new Array();
        for(i=0;i<aver2.length && i<max;i++)
        {
          if(resp.list.Instruments[aver2[i]].Alias==resp.list.Instruments[aver2[i]].Symbol)
          {
            insArray.push(resp.list.Instruments[aver2[i]].Symbol);
          } else {
           insArray.push(resp.list.Instruments[aver2[i]].Symbol+" - "+resp.list.Instruments[aver2[i]].Alias); 
          }
          
          var rate = resp.list.Instruments[aver2[i]].Rate;
          var openRate = resp.list.Instruments[aver2[i]].OpenRateDay;
          var pcent = ((rate * 100) / openRate) - 100;
          gerryWa.push(pcent);
          ricardonetpay.push(rate);
          instrumentos.push(aver2[i]);
        }
        var j;
        for(i=0;i<aver2.length-1;i++)
        {
          for(j=i+1;j<aver2.length;j++)
          {
            if(tipoAlzaBaja==1)//a la alza
            {
              if(gerryWa[i]<gerryWa[j])
              {
                var aux1 = gerryWa[i];
                gerryWa[i] = gerryWa[j];
                gerryWa[j] = aux1;
                aux1 = ricardonetpay[i];
                ricardonetpay[i] = ricardonetpay[j];
                ricardonetpay[j] = aux1;
                aux1 = instrumentos[i];
                instrumentos[i] = instrumentos[j];
                instrumentos[j] = aux1;
              }  
            }
            if(tipoAlzaBaja==0)//a la baja
            {
              if(gerryWa[i]>gerryWa[j])
              {
                var aux1 = gerryWa[i];
                gerryWa[i] = gerryWa[j];
                gerryWa[j] = aux1;
                aux1 = ricardonetpay[i];
                ricardonetpay[i] = ricardonetpay[j];
                ricardonetpay[j] = aux1;
                aux1 = instrumentos[i];
                instrumentos[i] = instrumentos[j];
                instrumentos[j] = aux1;
              }  
            }
          }
        }
        max = 10;
        for(i=0;i<gerryWa.length && i<max;i++)
        {
            montiel.push(instrumentos[i]);
        }
        for(i=0;i<montiel.length && i<max;i++)
        {
          var ins = resp.list.Instruments[montiel[i]].Symbol;
          var Tecnico = resp.list.Instruments[montiel[i]].Tecnico;
          var displayName = resp.list.Instruments[montiel[i]].Alias;
          var insSaneado = ins;//.replace("/","");
          if(i%2==0)
          {
            cad=cad+'<div class="row">';
          }
          var fav = '<a href="javascript:;" ins="'+ins+'" tipo="0" class="favorito"><i class="fa fa-star-o"></i></a>';
          if(resp.list.Instruments[montiel[i]].Favorite=="1")
          {
              fav = '<a href="javascript:;" ins="'+ins+'" tipo="1" class="favorito"><i class="fa fa-star"></i></a>';
          }
           var anaTecnico = '<button type="button"  alias="'+displayName+'" ins="'+Tecnico+'" class="btn btn-primary btn-icon-text anaTecnico" style="padding: 10px;margin-bottom: 10px;"><i class="ti-stats-up"></i>Análisis técnico</button>';
          if(Tecnico==""){
            anaTecnico="";
          }
          cad=cad+' <div class="col-lg-6 grid-margin stretch-card"><div class="card" style="cursor:default;" ins="'+ins+'"><div class="card-body"><h3 class="card-title">'+fav+' '+displayName+'<span class="derecha"></span><span class="'+insSaneado+'_Span derecha"></span></h3>'+anaTecnico+' <button type="button" class="btn btn-info btn-icon-text cardOpenPosition" alias="'+displayName+'"  ins="'+ins+'" style="float:right;padding: 10px;"><i class="mdi mdi-play btn-icon-append"></i>Abrir posición</button><h4 class="font-weight-normal '+insSaneado+'_Value"></h4><br><br><br><div class="flot-chart-container"><div id="'+insSaneado+'" class="flot-chart"><div class="jumping-dots-loader"><span></span><span></span><span></span></div></div></div></div></div></div>';
          if(i%2==1)
          {
            cad=cad+'</div>';
          }
        }
        $("#main-panel").html(cad);
        giovanny = new Array();
        for(i=0;i<montiel.length && i<max;i++)
        {
          var ins = resp.list.Instruments[montiel[i]].Symbol;
          actualizaGraficas(ins);
          giovanny.push(ins);
        }
        $('#searchInput').typeahead({
          hint: true,
          highlight: true,
          minLength: 1
        }, {
          name: 'instrumentos',
          source: substringMatcher(insArray)
        });
      }
    }
  });
  refresh();
}
function cargaAnim(clase, num) {
  var arr = $("."+clase);
  if (arr.length>=2){
    var eleme1 = $("."+clase)[1];  
    $(eleme1).css("background-color","rgba(255,255,255,"+num+")");
  }
  var eleme = $("."+clase)[0];
  $(eleme).css("background-color","rgba(255,255,255,"+num+")");
  setTimeout(function () {
    if(num>=0.1) {
      num=num-0.1;
      cargaAnim(clase, num);
    } else {
      $(eleme).css("background-color","transparent");
      if (arr.length>=2){
        $(eleme1).css("background-color","transparent");
      }
    }
  },100);
}
function cargaUnInstrumento(instrumento) {
  clear();
  $("#main-panel").html(loader);
  var cad = '';
  $.ajax({
    url: "https://biv.mx/lista",
    dataType : "json",
    type : "get",
    async : true,
    data : {t:tt} ,
    beforeSend : function (){},
    complete : function (){$("body").css("cursor","default");}, 
    success : function (resp){
      if(resp.success==1)
      {
        var aver2 = Object.keys(resp.list.Instruments);
        var i, cad='<div class="content-wrapper">';
        var max = 1000;
        var montiel = new Array();
        insArray = new Array();
        for(i=0;i<aver2.length && i<max;i++)
        {
          var type = resp.list.Instruments[aver2[i]].Symbol;
          if(type==instrumento)
          {
            montiel.push(aver2[i]);
          }
        }
        for(i=0;i<montiel.length && i<max;i++)
        {
          var ins = resp.list.Instruments[montiel[i]].Symbol;
          var alias = resp.list.Instruments[montiel[i]].Alias;
          var Tecnico = resp.list.Instruments[montiel[i]].Tecnico;
          var insSaneado = ins.replace("/","");
          if(i%2==0)
          {
            cad=cad+'<div class="row">';
          }
          var fav = '<a href="javascript:;" ins="'+ins+'" tipo="0" class="favorito"><i class="fa fa-star-o"></i></a>';
          if(resp.list.Instruments[montiel[i]].Favorite=="1")
          {
              fav = '<a href="javascript:;" ins="'+ins+'" tipo="1" class="favorito"><i class="fa fa-star"></i></a>';
          }
          var anaTecnico = '<button type="button" alias="'+alias+'" ins="'+Tecnico+'" class="btn btn-primary btn-icon-text anaTecnico" style="padding: 10px;margin-bottom: 10px;"><i class="ti-stats-up"></i>Análisis técnico</button>';
          if(Tecnico==""){
            anaTecnico="";
          }
          cad=cad+' <div class="col-lg-6 grid-margin stretch-card"><div class="card" style="cursor:default;" ins="'+ins+'"><div class="card-body"><h3 class="card-title">'+fav+' '+alias+'<span class="derecha"></span><span class="'+insSaneado+'_Span derecha"></span></h3>'+anaTecnico+' <button type="button" class="btn btn-info btn-icon-text cardOpenPosition" alias="'+alias+'" ins="'+ins+'" style="float:right;padding: 10px;"><i class="mdi mdi-play btn-icon-append"></i>Abrir posición</button><h4 class="font-weight-normal '+insSaneado+'_Value"></h4><br><br><br><div class="flot-chart-container"><div id="'+insSaneado+'" class="flot-chart"><div class="jumping-dots-loader"><span></span><span></span><span></span></div></div></div></div></div></div>';
          if(i%2==1)
          {
            cad=cad+'</div>';
          }
        }
        $("#main-panel").html(cad);
        giovanny = new Array();
        for(i=0;i<montiel.length && i<max;i++)
        {
          var ins = resp.list.Instruments[montiel[i]].Symbol;
          actualizaGraficas(ins);
          giovanny.push(ins);
        }
      }
    }
  });
  refresh();
}

$('#searchInput').bind('typeahead:select', function(ev, suggestion) {
  var instrumento = suggestion.split(" ")[0];
  cargaUnInstrumento(instrumento);
});
$(document).on("click", "#currency", function (){
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $(".navbar-toggler")[1].click();
  }
  cargaConjunto("CURRENCY");
});

$(document).on("click", "#crypto", function (){
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $(".navbar-toggler")[1].click();
  }
  cargaConjunto("CRYPTO");
});

$(document).on("click", "#indexes", function (){
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $(".navbar-toggler")[1].click();
  }
  cargaConjunto("INDEX");
});

$(document).on("click", "#energetics", function (){
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $(".navbar-toggler")[1].click();
  }
  cargaConjunto("ENERGETICS");
});

$(document).on("click", "#metal", function (){
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $(".navbar-toggler")[1].click();
  }
  cargaConjunto("METAL");
});

$(document).on("click", "#stock", function (){
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $(".navbar-toggler")[1].click();
  }
  cargaConjunto("BOND");
});

$(document).on("click", "#agriculture", function (){
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $(".navbar-toggler")[1].click();
  }
  cargaConjunto("AGRICULTURE");
});

$(document).on("click", "#etf", function (){
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $(".navbar-toggler")[1].click();
  }
  cargaConjunto("etf");
});

$(document).on("click", "#favoritosMenu", function (){
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $(".navbar-toggler")[1].click();
  }
  $.ajax({
    url: "https://biv.mx/cargaInicio",
    dataType : "json",
    data : {t : tt},
    type : "post",
    async : true,
    beforeSend : function (){},
    complete : function (){$("body").css("cursor","default");}, 
    success : function (resp){
      if(resp.success==1)
      {
        cargaFavoritos();
      }
      if(resp.success==-2)
      {
        cargaAlzaBaja(1);
      }
    }
  });
});

$(document).on("click", "#alAlza", function (){
  cargaAlzaBaja(1);
});

$(document).on("click", "#alaBaja", function (){
  cargaAlzaBaja(0);
});







$(document).on("click", ".favorito", function (){
  var ins = $(this).attr("ins").trim();
  var tipo = $(this).attr("tipo").trim();
  if(tipo == "0" )
  {
    $(this).attr("tipo","1");
    $(this).html('<i class="fa fa-star"></i>');
  }
  else
  {
    $(this).attr("tipo","0");
    $(this).html('<i class="fa fa-star-o"></i>'); 
  }
  $.ajax({
    url: "https://biv.mx/marcaFavorito",
    dataType : "json",
    data : {ins:ins,t : tt},
    type : "post",
    async : true,
    beforeSend : function (){},
    complete : function (){$("body").css("cursor","default");}, 
    success : function (resp){
      if(resp.success==1)
      {
       
      }
      else
      {
        
      }
    }
  });
});

function calcApa() {
  var importeAInvertir = parseFloat($("#importeAInvertir").val());
  var apa = parseInt($("#apalancamiento").val());
  var comm  = parseFloat($("#comm").html());
  var pesos = importeAInvertir*apa*(comm/100);
  pesos = Math.round(pesos * 100) / 100;
  var string = numeral(parseFloat(pesos)).format('$0,0.00');
  $("#commEnPesos").html("en pesos: "+string);
}

$(document).on("change", "#apalancamiento", function (){
  calcApa();
});
$(document).on("click", ".posicionButton", function (){
  var minInv=$(this).attr("minimo");
  var sltp=parseInt($(this).attr("sltp"));
  var sltp2=sltp*2;
  var typeIns = $(this).attr("typeIns");
  var ins=$(this).attr("ins");
  var tipo=$(this).attr("tipo");
  var apalancamiento = $("#apalancamiento").val();
  var comm  = $("#comm").html();
  var importeAInvertir = $("#importeAInvertir").val();
  var inputTakeProfit = $("#inputTakeProfit-"+ins).val();
  var stopLoss = $("#inputStopLoss-"+ins).val();  
  var debo_takeProfit = document.getElementById('takeProfit-'+ins).checked;
  var debo_stopLoss = document.getElementById('stopLoss-'+ins).checked;
  var TK = "0", SL = "0";
  if(debo_takeProfit){TK="1";}
  if(debo_stopLoss){SL="1";}
  $.ajax({
    url: "https://biv.mx/openPosition",
    dataType : "json",
    data : {ins:ins, typeIns : typeIns,TK: TK, SL : SL, t : tt, tipo: tipo, apalancamiento : apalancamiento, comm : comm, importeAInvertir : importeAInvertir, inputTakeProfit : inputTakeProfit, stopLoss : stopLoss},
    type : "post",
    async : true,
    beforeSend : function (){},
    complete : function (){$("body").css("cursor","default");}, 
    success : function (resp){
      if(resp.success==1)
      {
        Swal.close();
        Swal({
          type: 'success',
          title: '<span style="color:#333;">Se ha abierto su operación.</span>',
          showConfirmButton: false,
          timer: 7500
        });
      }
      else
      {
        if(resp.success==-1)
        {
          var string3 = numeral(parseFloat(minInv)).format('$0,0.00');
          Swal({
            type: 'warning',
            title: '<span style="color:#333;">Revisa tus datos de posición antes de abrirla, el mínimo de inversión es de '+string3+', para cerrar con ganancias, el mínimo de ganancias es de: $'+sltp+', para cerrar con pérdidas, el mínimo de pérdidas es de $'+sltp2+'.</span>',
            showConfirmButton: false,
            timer: 3500
          });
        }
        if(resp.success==-2)
        {
          var string3 = numeral(parseFloat(resp.disponible)).format('$0,0.00');
          var string4 = numeral(parseFloat(resp.solicitado)).format('$0,0.00');
          Swal({
            type: 'warning',
            title: '<span style="color:#333;">Saldos insuficientes para abrir la operación, tienes: '+string3+' y necesitas: '+string4+'</span>',
            showConfirmButton: false,
            timer: 7500
          });
        }
      }
    }
  });
}); 

$(document).on("click", ".cambiaTipo", function (){
  $.ajax({
    url: "https://biv.mx/tipoCuenta",
    dataType : "json",
    data : {t : tt},
    type : "post",
    async : true,
    beforeSend : function (){},
    complete : function (){$("body").css("cursor","default");}, 
    success : function (resp){
      if(resp.success==1)
      {
        window.location="https://biv.mx/home";
      }
      else
      {
        window.location="https://biv.mx/login"; 
      }
    }
  });
}); 
function checkCash() {
  $.ajax({
    url: "https://biv.mx/checkCash",
    dataType : "json",
    data : {t : tt},
    type : "post",
    async : true,
    beforeSend : function (){},
    complete : function (){$("body").css("cursor","default");}, 
    success : function (resp){
      if(resp.success==1)
      {
        var amount = resp.amount;
        var string = numeral(parseFloat(amount)).format('$0,0.00');
        Swal({
          type: 'success',
          title: '<span style="color:#333;">Se ha registrado su recarga por '+string+' por '+resp.tienda+'.</span>',
          showConfirmButton: false,
          timer: 7500
        });
      }
    }
  });
}
function cargaInicio(){
  $.ajax({
    url: "https://biv.mx/cargaInicio",
    dataType : "json",
    data : {t : tt},
    type : "post",
    async : true,
    beforeSend : function (){},
    complete : function (){$("body").css("cursor","default");}, 
    success : function (resp){
      if(resp.success==1)
      {
        cargaFavoritos();
      }
      if(resp.success==-2)
      {
        cargaAlzaBaja(1);
      }
    }
  });
}
var substringMatcher = function(strs) {
    return function findMatches(q, cb) {
      var matches, substringRegex;
      matches = [];
      var substrRegex = new RegExp(q, 'i');
      for (var i = 0; i < strs.length; i++) {
        if (substrRegex.test(strs[i])) {
          matches.push(strs[i]);
        }
      }
      cb(matches);
    };
  };
var insArray;
var configSpinnerTK = {
    decrementButton: "<strong>-</strong>", // button text
    incrementButton: "<strong>+</strong>", // ..
    groupClass: "soloNumeros TKClass", // css class of the resulting input-group
    buttonsClass: "btn-outline-secondary",
    buttonsWidth: "2.5rem",
    textAlign: "center",
    autoDelay: 500, // ms holding before auto value change
    autoInterval: 100, // speed of auto value change
    boostThreshold: 10, // boost after these steps
    boostMultiplier: "auto", // you can also set a constant number as multiplier
    locale: null // the locale for number rendering; if null, the browsers language is used
}
var configSpinnerSL = {
    decrementButton: "<strong>-</strong>", // button text
    incrementButton: "<strong>+</strong>", // ..
    groupClass: "soloNumeros SLClass", // css class of the resulting input-group
    buttonsClass: "btn-outline-secondary",
    buttonsWidth: "2.5rem",
    textAlign: "center",
    autoDelay: 500, // ms holding before auto value change
    autoInterval: 100, // speed of auto value change
    boostThreshold: 10, // boost after these steps
    boostMultiplier: "auto", // you can also set a constant number as multiplier
    locale: null // the locale for number rendering; if null, the browsers language is used
}

$(document).ready(function() {
  var t = parseInt($("#ti").html());
  tt = $("#t").html();
  alias = $("#alias").html().trim();
  insArray = new Array();
  if(t==1)
  {
    $("#labelAccount").html("Real");
    $(".CTDR").html("&nbsp;&nbsp;&nbsp;&nbsp;Cambiar a Torneo");
    var string = numeral(parseFloat($("#fr").html())).format('$0,0.00');
    //$("#fondo").html(string );
    $("#labelAccount").removeClass("badge-outline-danger");
    $("#labelAccount").addClass("badge-outline-success");
  } else{
    $("#labelAccount").html("Torneo");
    $(".CTDR").html("&nbsp;&nbsp;&nbsp;&nbsp;Cambiar a Real");
    var string = numeral(parseFloat($("#fd").html())).format('$0,0.00');
    //$("#fondo").html(string);
    $("#labelAccount").removeClass("badge-outline-success");
    $("#labelAccount").addClass("badge-outline-danger");
  }
 // Conekta.setPublicKey("key_NrgsVZkLXBqar2RfNsWBz2Q");
  //Conekta.setLanguage("es");
  cargaInicio();
  checkCash();
});  