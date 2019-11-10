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
    <?php event::fire('register.head')?>
    <link href="<?=gila::base_url('src/dungeonrl/style.css?v=5')?>" rel="stylesheet">
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
    <?php view::alerts()?>
    <div id="game-title">Dungeon Mist</div>
      <div class="gl-4 gm-6 wrapper" style="float:left">
        <div class="border-buttom-main_ text-align-center">
            <h3><?=__('Register')?></h3>
        </div>

        <form role="form" method="post" action="" class="g-form wrapper g-card bg-white">
            <label><?=__('Name')?></label>
            <div class="form-group">
                <input class="form-control fullwidth" name="name" autofocus required>
            </div>
            <label><?=__('Email')?></label>
            <div class="form-group">
                <input class="form-control fullwidth" name="email" type="email" required>
            </div>
            <label><?=__('Password')?></label>
            <div class="form-group ">
                <input class="form-control fullwidth" name="password" type="password" value="" required>
            </div>
            <?php event::fire('recaptcha.form')?>
            <input type="submit" class="btn btn-primary btn-block" value="<?=__('Register')?>">
        </form>
        <p>
            <a href="login"><?=__('Log In')?></a>
        </p>
    </div>

</body>

</html>