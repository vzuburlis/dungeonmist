<?php
$ppath = gila::base_url().'src/'.GPACKAGE.'/';
$tile_folder = gila::base_url()."src/".GPACKAGE."/tile/";
$dl_folder = gila::base_url()."src/".GPACKAGE."/DawnLike/";
$play_url = GPACKAGE.'/play';
$feedback_url = GPACKAGE.'/feedback';
$pnk = new gTable('playerclass');
$classes = $pnk->getRows();
$text = "R.I.P. {$game['name']} you wil alwayws be remember. A true hero that fought the ";
?>
<style>
body{
    font-family: courier new;
    text-align: center;
    color: white;
    /*background: url(<?=gila::base_url()?>src/<?=GPACKAGE?>/images/bg.png) no-repeat center center fixed;*/
    background-color: black;
    background-size: cover;
}
#game-title{
    font-family: 'Berkshire Swash', cursive;
    font-size: 3em;
    padding: 30px 0;
}
.form-label {
  font-family: 'Berkshire Swash', cursive;
  font-size: 1.5em;
}
#about-game{
    padding: 4em 0;
}
#main {
    padding: 10px;
    background: rgba(0,0,0,0.5);
    max-width:1000px;
    margin: auto;
}
.play-btn {
    text-transform: uppercase;
    padding:1em 2em;
    font-size:1.5em;
    font-weight:bold;
    border-radius:0.5em;
    border: 2px solid #ecc148;
    color: #ecc148;
}
.play-btn:hover {
    color: white;
    background: #ecc148;
}
button{
    font-size: 3em;
}


.class-card {
  margin:1em;
  padding: 8px;
  border: 2px solid transparent;
  display: inline-block;
  width: 64px;
  height: 64px;
}
.class-selected {
  border: 2px solid aliceblue;
}
.class-avatar {
  transform: scale(3);
  margin: 15px;
}
</style>
<head>
    <base href="<?=gila::base_url()?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta property="og:url"         content="https://caveofcenbeald.com/dungeonrl/game/" />
    <meta property="og:type"        content="website" />
    <meta property="og:title"       content="Dungeon Roguelike" />
    <meta property="og:description" content="<?=$game['name']?> reached level <?=$game['level']?> in the dungeos." />
    <meta property="og:image"       content="https://caveofcenbeald.com/src/dungeonrl/images/bg.png" />

    <?=view::css("lib/gila.min.css")?>
    <?=view::script("lib/gila.min.js")?>
    <?=view::script($unit_js_path)?>
    <link href="https://fonts.googleapis.com/css?family=Berkshire+Swash" rel="stylesheet">
</head>


<body>
  <div id="main">
    <div id="game-title"><?=$game['name']?></div>
    <div class="form-label">Level <?=$game['level']?> <?=$playerclass['name']?></div>
    <div class="form-label">Turns Played: <?=floor($game['game_turns']/10)?></div>

    <br>
    <a href="#" class="g-btn">Share on Facebook</a>
    <a href="#" class="g-btn">Share on Twitter</a>
    <br>

    <?php
    if(session::key('finishedGame')==$game['id']) {
      echo '<br><br><div style="max-width:800px;padding:5px;border:1px solid #444;text-align:left;margin:auto">';
      echo "<p>Comments (What did you enjoy most in the game, what could be approved or what more you love to see)";
      echo '<textarea class="g-input fullwidth"></textarea>';
      echo '<button class="g-btn" onclick="sendFeedback(this.value,\'';
      echo gForm::getToken('feedback');
      echo '\')">Send Feedback</button>';
      echo '</div>';
    }
    ?>

<br><br><br><br><br><a href="<?=GPACKAGE.'/new'?>" class="play-btn">New Game</a>
<!--canvas id="map"></canvas>
<canvas id="minimap"></canvas-->
</body>

<!-- Global site tag (gtag.js) - Google Analytics -->
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>

<script>
function sendFeedback(feedback, token) {
  let fm=new FormData()
  fm.append('feedback', feedback);
  fm.append('token', token);
  g.ajax({
      url: '<?=gila::base_url()?><?=$feedback_url?>/',
      data: fm,
      method: 'post',
      fn: function(){
        window.location.href = '<?=$play_url?>?level=<?=$c->level+1?>' // &entryType=random|fallen?
      }
  })
  //g.post()
}

</script>
<?=view::script($game_js_path)?>

<?php if(gila::base_url()!='http://localhost/gilacms/') { ?>
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-130027935-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-130027935-1');
</script>
<?php } ?>
