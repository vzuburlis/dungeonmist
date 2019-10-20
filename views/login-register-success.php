<!DOCTYPE html>
<html lang="en">

<head>
    <base href="<?=gila::base_url()?>">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title><?=gila::config('title')?> - <?=__('Register')?></title>

    <link href="lib/gila.min.css" rel="stylesheet">
    <link href="lib/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="src/dungeonrl/style.css" rel="stylesheet">
</head>
<style>
body{
  font-family: courier new;
  text-align: center;
  color: white;
  background: url(src/dungeonrl/images/dm-guerrero.jpg) no-repeat center center fixed;
  background-color: black;
  background-size: cover;
}
label {color:#000}
</style>

<body>
    <div id="game-title">Dungeon Mist</div>
        <div class="gl-4 wrapper" style="float:left">
            <div class="border-buttom-main_ text-align-center">
                <div style="width:16%;display:inline-block">
                    <i class="fa fa-5x fa-check" style="color:green"></i>
                </div>
                <h3><?=__('register_success')?></h3>
            </div>

            <a class="btn btn-success btn-block" href="<?=gila::url('login')?>"><?=__('Log In')?></a>
        </div>
    </div>

</body>

</html>
