<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>SEGMED</title>
  <link rel="stylesheet" href="../static/vendors/iconfonts/mdi/font/css/materialdesignicons.min.css">
  <link rel="stylesheet" href="../static/vendors/css/vendor.bundle.base.min.css">
  <link rel="stylesheet" href="../static/vendors/css/vendor.bundle.addons.min.css">
  <link rel="stylesheet" href="../static/vendors/iconfonts/simple-line-icon/css/simple-line-icons.css">
  <link rel="stylesheet" href="../static/vendors/iconfonts/ti-icons/css/themify-icons.css">
  <link rel="stylesheet" href="../static/vendors/iconfonts/font-awesome/css/font-awesome.min.css">
  <link rel="stylesheet" href="../static/segmed/css/vertical-layout-dark/style.min.css">
  <link rel="stylesheet" href="../static/biv_tel/css/intlTelInput.min.css">
  <link rel="shortcut icon" href="../static/segmed/favicon.ico">
  <style type="text/css">
.col-item
{
    border: 1px solid #E1E1E1;
    border-radius: 10px;
    background: #FFF;
}
.col-item:hover
{ 
  box-shadow: 0px 2px 5px -1px #000;
  -moz-box-shadow: 0px 2px 5px -1px #000;
  -webkit-box-shadow: 0px 2px 5px -1px #000;
  -webkit-border-radius: 0px;
  -moz-border-radius: 0px;
  border-radius: 10px;   
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;   
  border-bottom:2px solid #52A1D5;        
}
.col-item .photo img
{
    margin: 0 auto;
    width: 100%;
    padding: 1px;
    border-radius: 10px 10px 0 0 ;
}

.col-item .info
{
    padding: 10px;
    border-radius: 0 0 5px 5px;
    margin-top: 1px;
}

.col-item .price
{
    /*width: 50%;*/
    float: left;
    margin-top: 5px;
}

.col-item .price h5
{
    line-height: 20px;
    margin: 0;
}

.price-text-color
{
    color: #219FD1;
}

.col-item .info .rating
{
    color: #777;
}

.col-item .rating
{
    /*width: 50%;*/
    float: left;
    font-size: 17px;
    text-align: right;
    line-height: 52px;
    margin-bottom: 10px;
    height: 52px;
}

.col-item .separator
{
    border-top: 1px solid #E1E1E1;
}

.clear-left
{
    clear: left;
}

.col-item .separator p
{
    line-height: 20px;
    margin-bottom: 0;
    margin-top: 10px;
    text-align: center;
}

.col-item .separator p i
{
    margin-right: 5px;
}
.col-item .btn-add
{
    width: 50%;
    float: left;
}

.col-item .btn-add
{
    border-right: 1px solid #E1E1E1;
    
}

.col-item .btn-details
{
    width: 50%;
    float: left;
    padding-left: 10px;
}
.controls
{
    margin-top: 20px;
}
[data-slide="prev"]
{
    margin-right: 10px;
}

/*
Hover the image
*/
.post-img-content
{
    height: 196px;
    position: relative;
}
.post-img-content img
{
    position: absolute;
    padding: 1px;
    border-radius: 10px 10px 0 0 ;
}
.post-title{
    display: table-cell;
    vertical-align: bottom;
    z-index: 2;
    position: relative;
}
.post-title b{
    background-color: rgba(51, 51, 51, 0.58);
    display: inline-block;
    margin-bottom: 5px;
    margin-left: 2px;
    color: #FFF;
    padding: 10px 15px;
    margin-top: 10px;
    font-size: 12px;
}
.post-title b:first-child{
    font-size: 14px;
}
.round-tag{
    width: 60px;
    height: 60px;
    border-radius: 50% 50% 50% 0;
    border: 4px solid #FFF;
    background: #37A12B;
    position: absolute;
    bottom: 0px;
    padding: 15px 6px;
    font-size: 17px;
    color: #FFF;
    font-weight: bold;
}
    /*   */
    .card-description {
      font-size: 18px !important;
    }
    .card-title {
      font-size: 20px !important;
    }


    .font-weight-normal{
      width: min-content;
    }
    .mano {
      cursor: pointer;
    }
  .card {
    cursor: default;
  }
    .demo-container {
        width: 100%;
        max-width: 350px;
        margin: 50px auto;
    }
    form.cardCredit {
        margin: 30px;
    }
    input.cardCredit {
        width: 200px;
        margin: 10px auto;
        display: block;
    }
    h3.card-title {
      font-size: :20px !important;
    }
    .swal2-title {
      color:#FFF !important;
    }
    .iti-flag {background-image: url("../static/biv_tel/img/flags.png");}

    @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
      .iti-flag {background-image: url("../static/biv_tel/img/flags@2x.png");}
    }
    .dropdown .dropdown-toggle:after {
      margin-left: 99%;
      margin-top: -43%;
    }
    .fa {
      font-size: 18px;
    }
    #count {
      width: 20px;
      height: 20px;
      color: #000;
    }
  </style>
</head>
<body>
  <div class="container-scroller">
    <nav class="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
      <div class="navbar-menu-wrapper d-flex align-items-stretch justify-content-between">
        <!--ul class="navbar-nav mr-lg-2 d-none d-lg-flex">
          <li class="nav-item nav-toggler-item">
            <button class="navbar-toggler align-self-center" type="button" data-toggle="minimize">
              <span class="mdi mdi-menu"></span>
            </button>
          </li>
          <li class="nav-item nav-search d-none d-lg-flex">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="search">
                  <i class="mdi mdi-magnify"></i>
                </span>
              </div>
              <input type="text" class="form-control typeahead" placeholder="buscar" id="searchInput" aria-label="search" aria-describedby="search">
            </div>
          </li>
        </ul-->
        <div class="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
          <a class="navbar-brand brand-logo" href="javascript:;"><img src="../static/segmedw.png" alt="logo"/></a>
          <a class="navbar-brand brand-logo-mini" href="javascript:;"><img src="../static/segmedw.png" alt="logo"/></a>
        </div>
        <ul class="navbar-nav navbar-nav-right" id="notificationDropdown">
          <li class="nav-item dropdown">
            <a class="nav-link count-indicator dropdown-toggle" id="notificationDropdown2" href="javascript:;" data-toggle="dropdown">
              <i class="mdi mdi-bell-outline mx-0"></i>
              <span class="count" id="count"></span>
            </a>
            <div class="dropdown-menu dropdown-menu-right navbar-dropdown preview-list"  id="notificationDropdown3" aria-labelledby="notificationDropdown2">
             </div>
          </li>
          <li class="nav-item nav-profile dropdown">
            <a class="nav-link dropdown-toggle" href="javascript:;" data-toggle="dropdown" id="profileDropdown">
              <!--img src="https://via.placeholder.com/30x30" alt="profile"/-->
              <table style="margin-top: 20px;text-align: center;"><tbody><tr><td> <span class="nav-profile-name" id="alias" style="display: block;"></span></td>
<td><div class="badge verde badge-pill" id="fondo" ></div></td>
<td><div class="badge badge-pill" id="ganper"></div></td>
              </tr>
              <tr><td>
              <!--div class="badge badge-outline-success badge-pill" id="labelAccount">Real</div--></td>
            </tr></tbody></table>
            </a>
            <div class="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="profileDropdown">
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="/segmed.ai/" id="cierraSesion">
                <i class="mdi mdi-logout text-primary"></i>
                Log out
              </a>
            </div>
          </li>
          <li class="nav-item nav-toggler-item-right d-lg-none">
            <button class="navbar-toggler align-self-center" type="button" data-toggle="offcanvas">
              <span class="mdi mdi-menu"></span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
    <!-- partial -->
    <div class="container-fluid page-body-wrapper">
      <div id="right-sidebar" class="settings-panel">
        <div class="jumping-dots-loader" style="margin-top:100%;"><span></span><span></span><span></span></div>
      </div>
      <nav class="sidebar sidebar-offcanvas" id="sidebar">
        <ul class="nav">
          <!--li class="nav-item">
            <a class="nav-link" id="perfilMenu" href="javascript:;">
              <i class="mdi mdi-account menu-icon"></i>
              <span class="menu-title">Perfil</span>
            </a>
          </li-->
          <li class="nav-item">
            <a class="nav-link" id="viewImagesMenu" href="javascript:;">
              <i class="mdi mdi-briefcase menu-icon"></i>
              <span class="menu-title">View images</span>
            </a>
          </li>

       
          

        </ul>
      </nav>
      <!-- partial -->
      <div id="main-panel" class="main-panel">
        <div class="content-wrapper"><center><div class="row"><div class="col-md-12 col-sm-12 grid-margin stretch-card"><div style="width: 100%;"><table style="width: 100%;text-align: center;"><tbody><tr><td><div class="jumping-dots-loader"><span></span><span></span><span></span></div></td></tr></tbody></table></div></div></div></center></div>
      </div>
      <!-- main-panel ends -->
    </div>
    <!-- page-body-wrapper ends -->
  </div>
  <!-- container-scroller -->
  <!--script src="../static/vendors/js/vendor.bundle.base.min.js"></script>
  <script src="../static/vendors/js/vendor.3.js"></script>
  <script src="../static/segmed/js/off-canvas.min.js"></script>
  <script src="../static/segmed/js/hoverable-collapse.min.js"></script>
  <script src="../static/segmed/js/template.min.js"></script>
  <script src="../static/segmed/js/settings.min.js"></script>
  <script src="../static/segmed/js/todolist.min.js"></script-->
  <script type="text/javascript" src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/sweetalert2@7.29.2/dist/sweetalert2.all.min.js"></script>
  <script src="../static/segmed/js/dashboard.js"></script>
  <!--script src="//cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/numeral.min.js"></script-->
  <script src="../static/segmed/js/bootstrap-input-spinner.js"></script>
  <script src="../static/biv_tel/js/intlTelInput.min.js"></script>
  <script src="../static/segmed/card/card.js"></script>
 
  <script src="../static/segmed/main_admin.js"></script>
</body>
</html>