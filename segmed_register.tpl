<!DOCTYPE html>
<html lang="es">

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>SEGMED | Registrarse</title>
  <!-- plugins:css -->
  <link rel="stylesheet" href="../static/vendors/iconfonts/mdi/font/css/materialdesignicons.min.css">
  <link rel="stylesheet" href="../static/vendors/css/vendor.bundle.base.min.css">
  <!--link rel="stylesheet" href="../static/segmed/vendors/css/vendor.bundle.addons.min.css"-->
  <!-- endinject -->
  <!-- plugin css for this page -->
  <!-- End plugin css for this page -->
  <!-- inject:css -->
  <!-- Global site tag (gtag.js) - Google Analytics -->
    <!--script async src="https://www.googletagmanager.com/gtag/js?id=UA-122664219-2"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-122664219-2');
    </script>
    <script>
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '501947937219968',
      cookie     : true,
      xfbml      : true,
      version    : 'v4.0'
    });
      
    FB.AppEvents.logPageView();   
      
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/es_LA/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
</script-->

  <link rel="stylesheet"
        "../static/segmed/css/vertical-layout-dark/style.min.css"
   href="../static/segmed/css/vertical-layout-dark/style.min.css">
  <!-- endinject -->
  <style type="text/css">
    .pass-graybar{height:5px;background-color:#ccc;position:relative}.pass-colorbar{ height:5px;background-image:url(passwordstrength.jpg);position:absolute;top:0;left:0}.pass-percent,.pass-text{font-size:1em}.pass-percent{margin-right:5px}
  </style>
  <link rel="shortcut icon" href="../static/segmed/favicon.ico">
</head>

<body>
  <div class="container-scroller">
    <div class="container-fluid page-body-wrapper full-page-wrapper">
      <div class="content-wrapper d-flex align-items-stretch auth auth-img-bg">
        <div class="row flex-grow">
          <div class="col-lg-6 d-flex align-items-center justify-content-center">
            <div class="auth-form-transparent text-left p-3">
              <div class="brand-logo">
                <img src="../static/segmedw.png" style="width: 250px;" alt="logo" id="logo" > 
              </div>
              <h4>Register</h4>
              <div class="text-center mt-4 font-weight-light">
                  Already account? <a href="/segmed.ai" style="color:#FFF !important;" class="text-primary">Login</a>
                </div>
              <h6 class="font-weight-light"></h6>
              <form class="pt-3">
                <div class="form-group">
                  <label>Name</label>
                  <div class="input-group">
                    <div class="input-group-prepend bg-transparent">
                      <span class="input-group-text bg-transparent border-right-0">
                        <i class="mdi mdi-account-outline text-primary"></i>
                      </span>
                    </div>
                    <input type="text" id="alias" class="form-control form-control-lg border-left-0" placeholder="Full name">
                  </div>
                </div>
                <div class="form-group">
                  <label>Email</label>
                  <div class="input-group">
                    <div class="input-group-prepend bg-transparent">
                      <span class="input-group-text bg-transparent border-right-0">
                        <i class="mdi mdi-email-outline text-primary"></i>
                      </span>
                    </div>
                    <input type="email" id="correo" class="form-control form-control-lg border-left-0" placeholder="email">
                  </div>
                </div>
                <div class="form-group">
                  <label>Password</label>
                  <div class="input-group">
                    <div class="input-group-prepend bg-transparent">
                      <span class="input-group-text bg-transparent border-right-0">
                        <i class="mdi mdi-lock-outline text-primary"></i>
                      </span>
                    </div>
                    <input type="password" class="form-control form-control-lg border-left-0" id="exampleInputPassword" placeholder="Password" style="min-width: 80%;">                        
                  </div>
                </div>
                <div class="form-group">
                  <label>Confirm Password</label>
                  <div class="input-group">
                    <div class="input-group-prepend bg-transparent">
                      <span class="input-group-text bg-transparent border-right-0">
                        <i class="mdi mdi-lock-outline text-primary"></i>
                      </span>
                    </div>
                    <input type="password" class="form-control form-control-lg border-left-0" id="exampleInputPassword2" placeholder="Confirm password" style="min-width: 80%;">                        
                  </div>
                </div>

                <!--div class="form-group">
                  <label>¿Tienes código promocional? Úsalo aquí</label>
                  <div class="input-group">
                    <div class="input-group-prepend bg-transparent">
                      <span class="input-group-text bg-transparent border-right-0">
                        <i class="mdi mdi-star text-primary"></i>
                      </span>
                    </div>
                    <input type="email" id="codigoPromocional" class="form-control form-control-lg border-left-0" placeholder="Código Promocional">
                  </div>
                </div-->
                
                <!--div class="mb-4">
                  <div class="form-check">
                    <label class="form-check-label text-muted">
                      <input type="checkbox" id="terminos" class="form-check-input" style="transform: scale(2);opacity:1;">
                      Acepto los <a href="https://der.mx/static/terminos_y_condiciones.pdf" target="_blank">Términos y Condiciones</a>
                    </label>
                  </div>
                </div-->
                <div class="mt-3">
                  <a id="registrarse" class="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" href="javascript:;">Sign in</a>
                </div>
                <div class="text-center mt-4 font-weight-light">
                </div>
               
              </form>
            </div>
          </div>
          <div class="col-lg-6 register-half-bg d-flex flex-row" style="background:url('../static/segmed_sample.png');background-repeat: no-repeat;background-position: center;">
            <p class="text-white font-weight-medium text-center flex-grow align-self-end">Copyright &copy; 2020  All rights reserved.</p>
          </div>
        </div>
      </div>
      <!-- content-wrapper ends -->
    </div>
    <!-- page-body-wrapper ends -->
  </div>
  <!-- container-scroller -->
  <!-- plugins:js -->
  <!--script src="../static/segmed/vendors/js/vendor.bundle.base.min.js"></script-->
  
<!--script src="https://cdn.jsdelivr.net/npm/sweetalert2@8"></script-->

  <!--script src="../static/segmed/vendors/js/vendor.bundle.addons.min.js"></script-->
  <!-- endinject -->
  <!-- inject:js -->
  <script type="text/javascript" src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/sweetalert2@7.29.2/dist/sweetalert2.all.min.js"></script>
  <!--script src="../static/segmed/js/off-canvas.min.js"></script>
  <script src="../static/segmed/js/hoverable-collapse.min.js"></script>
  <script src="../static/segmed/js/template.min.js"></script>
  <script src="../static/segmed/js/settings.min.js"></script>
  <script src="../static/segmed/js/todolist.min.js"></script>
  <script src="../static/segmed/sha512.min.js"></script>
  <script src="../static/segmed/password.min.js"></script-->
  <script src="../static/sha512.min.js"></script>
  <script type="text/javascript">
   /*var ver = $("#verificar").html().trim();
   if(ver!=""){
    $("#invi").css("display","block");
   }
    
    $('#exampleInputPassword').password({
      shortPass: 'El password es muy corto',
      badPass: 'Débil; trata de combinar letras y números',
      goodPass: 'Más o menos, trata de combinar letras y números',
      strongPass: 'Buen password',
      containsUsername: 'El password contiene el alias',
      enterPass: 'Escribe password',
      showPercent: false,
      showText: true, // shows the text tips
      animate: true, // whether or not to animate the progress bar on input blur/focus
      animateSpeed: 'fast', // the above animation speed
      username: $("#alias"), // select the username field (selector or jQuery instance) for better password checks
      usernamePartialMatch: true, // whether to check for username partials
      minimumLength: 8 // minimum password length (below this threshold, the score is 0)
    });
    */
    $(document).on("click", "#registrarse", function (){
      var alias = $("#alias").val().trim();
      if(alias=="")
      {
        Swal({
          type: 'warning',
          title: '<span style="color:#333;">Must write your full name</span>',
          showConfirmButton: false,
          timer: 5500
        });
        return;
      }
      var correo = $("#correo").val().trim();
      if(correo=="")
      {
        Swal({
          type: 'warning',
          title: '<span style="color:#333;">Must write your email</span>',
          showConfirmButton: false,
          timer: 5500
        });
        return;
      }
      var pass = $("#exampleInputPassword").val().trim();
      var pass2 = $("#exampleInputPassword2").val().trim();
      if(pass.length<8)
      {
        Swal({
          type: 'warning',
          title: '<span style="color:#333;">Min 8 characters</span>',
          showConfirmButton: false,
          timer: 7500
        });
        return;
      }
      if(pass=="")
      {
        Swal({
          type: 'warning',
          title: '<span style="color:#333;">Must write your password</span>',
          showConfirmButton: false,
          timer: 5500
        });
        return;
      }
      if(pass2=="")
      {
        Swal({
          type: 'warning',
          title: '<span style="color:#333;">Must confirm your password</span>',
          showConfirmButton: false,
          timer: 5500
        });
        return;
      }
      if(pass2!=pass)
      {
        Swal({
          type: 'warning',
          title: '<span style="color:#333;">The password does not match</span>',
          showConfirmButton: false,
          timer: 5500
        });
        return;
      }
      
      pass=sha512(pass);
     

     // var codigoPromocional = $("#codigoPromocional").val().trim();
     /*var ver = $("#verificar").html().trim();
     var idUsuario = 0;
     if(ver!=""){
      idUsuario = $("#invi").attr("idUsuario");
     }*/
      /*var opcion = "";
      ver = $("#opcion").html().trim();
      if(ver!=""){
        opcion =$("#opcion").html().trim();
      }
      var cad1 = "";
      ver = $("#cad1").html().trim();
      if(ver!=""){
        cad1 =$("#cad1").html().trim();
      }*/
      
      

      var param ={
        alias : alias,
        correo : correo,
        pass : pass
      } 
      $.ajax({
        url: "/segmed.ai/register",
        data : param,
        dataType : "json",
        type : "post",
        async : true,
        beforeSend : function (){},
        complete : function (){}, 
        success : function (resp){
          if(resp.success==2)
          {
            Swal({
              type: 'warning',
              title: '<span style="color:#333;">Already exist email, please enter another email</span>',
              showConfirmButton: false,
              timer: 5500
            });
          }
          if(resp.success==3)
          {
            Swal({
              type: 'warning',
              title: '<span style="color:#333;">Already exist email, please enter another email</span>',
              showConfirmButton: false,
              timer: 5500
            });
          }
          if(resp.success==-15)
          {
            Swal({
              type: 'warning',
              title: '<span style="color:#333;">El código promocional '+codigoPromocional+' no es válido, o ha sido usado el máximo número de veces permitido. Si deseas obtener un código promocional, solicitalo al correo: <a href="mailto:soporte@der.mx">soporte@der.mx</a></span>',
              showConfirmButton: false,
              timer: 17500
            });
          }
          if(resp.success==-1)
          {
            //swal('Ya existe ese alias, favor de elegir otro');
          }
          if(resp.success==1)
          {
             Swal({
              type: 'success',
              title: '<span style="color:#333;">Success, please login.</span>',
              showConfirmButton: true
            }).then(function () {
                window.location="/segmed.ai/";
            });
          }
        }
      });
    });

function checkLoginState() {
/*  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });*/
}
function statusChangeCallback(response) {
  console.log(response);
  if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();
    } else {
       Swal({
        type: 'warning',
        title: '<span style="color:#333;">Por favor, inicia sesión en facebook para poder registrarte usando Facebook</span>',
        showConfirmButton: false,
        timer: 17500
      });   
    }
}

/*function testAPI() {
    FB.api('/me', function(response) {
      console.log(response);
      var alias = response.first_name+"_"+response.id.substring(0,7);
      var email = response.email;
      var id = response.id;



      var ver = $("#verificar").html().trim();
      var idUsuario = 0;
      if(ver!=""){
        idUsuario = $("#invi").attr("idUsuario");
      }
      var opcion = "";
      ver = $("#opcion").html().trim();
      if(ver!=""){
        opcion =$("#opcion").html().trim();
      }
      var cad1 = "";
      ver = $("#cad1").html().trim();
      if(ver!=""){
        cad1 =$("#cad1").html().trim();
      }
      var param ={
        alias : alias,
        correo : email,
        nombre : response.first_name+" "+response.last_name,
        idf : response.id,
        idUsuario : idUsuario,
        cad1 : cad1,
        opcion : opcion
      } 
      $.ajax({
        url: "https://der.mx/registrarseConFacebook",
        data : param,
        dataType : "json",
        type : "post",
        async : true,
        beforeSend : function (){},
        complete : function (){}, 
        success : function (resp){
          if(resp.success==2)
          {
            Swal({
              type: 'warning',
              title: '<span style="color:#333;">Ya existe ese alias, favor de elegir otro</span>',
              showConfirmButton: false,
              timer: 5500
            });
          }
          if(resp.success==3)
          {
            Swal({
              type: 'warning',
              title: '<span style="color:#333;">Ya existe ese correo registrado, favor de elegir otro</span>',
              showConfirmButton: false,
              timer: 5500
            });
          }
          if(resp.success==-15)
          {
            Swal({
              type: 'warning',
              title: '<span style="color:#333;">El código promocional '+codigoPromocional+' no es válido, o ha sido usado el máximo número de veces permitido. Si deseas obtener un código promocional, solicitalo al correo: <a href="mailto:soporte@der.mx">soporte@der.mx</a></span>',
              showConfirmButton: false,
              timer: 17500
            });
          }
          if(resp.success==-1)
          {
            //swal('Ya existe ese alias, favor de elegir otro');
          }
          if(resp.success==1)
          {
             Swal({
              type: 'success',
              title: '<span style="color:#333;">Tu cuenta ha sido creada!</span>',
              showConfirmButton: true
            }).then(function () {
                //window.location="https://der.mx/login";
                window.location="https://der.mx/home";
            });
          }
        }
      });

    },  {"fields":"email,first_name,last_name,id"});
  }*/
  </script>
  <!-- endinject <option>USA</option>
                    <option>United Kingdom</option>
                    <option>India</option>
                    <option>Germany</option>
                    <option>Argentina</option>
                    <option>Bolivia</option>
                    <option>Brasil</option>
                    <option>Chile</option>
                    <option>Colombia</option>
                    <option>Ecuador</option>
                    <option>Perú</option>
                    <option>Uruguay</option>
                    <option>Otro</option>
                   -->
                   <!--span style="display: none;" id="opcion">{{.opcion}}</span>
                   <span style="display: none;" id="cad1">{{.cad1}}</span-->
                   <script type="text/javascript">
                     /*var cad1 = $("#cad1").html().trim();
                     if(cad1.length>0) {
                      $("#invi").html('Regístrate<span id="verificar"></span>');
                     }*/
                   </script>
                   
</body>

</html>
