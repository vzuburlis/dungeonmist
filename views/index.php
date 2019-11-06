<?php
$ppath = gila::base_url().'src/'.GPACKAGE.'/';
$playgame_url = GPACKAGE.'/play';
$newgame_url = GPACKAGE.'/new';
?>
<link href="<?=$style_css_path?>" rel="stylesheet">
<style>
body{
  font-family: courier new;
  text-align: center;
  color: white;
  background: url(<?=gila::base_url()?>src/<?=GPACKAGE?>/images/dm-guerrero.jpg) no-repeat center center fixed;
  background-color: black;
  background-size: cover;
}
</style>

<head>
    <base href="<?=gila::base_url()?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"> 
    <meta property="og:url"         content="https://dungeonmist.com/play/" />
    <meta property="og:type"        content="website" />
    <meta property="og:title"       content="Dungeon Mist" />
    <meta property="og:description" content="A free roguelike browser game" />
    <meta property="og:image"       content="https://dungeonmist.com/src/dungeonrl/images/bg.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?=view::css("lib/gila.min.css")?>
    <?=view::script("lib/gila.min.js")?>
    <link href="https://fonts.googleapis.com/css?family=Berkshire+Swash" rel="stylesheet">
</head>


<body>
    <div id="game-title">Dungeon Mist</div>
    <div id="main">
      <div v-if="!guiview">
        <?=($gameId ? '<a href="'.$playgame_url.'" class="play-btn">Continue</a><br>' : '')?>
        <a href="<?=$newgame_url?>" class="play-btn" id="newgamebtn">New Game</a><br>
        <span @click="guiview='hof'" class="play-btn">Hall of Fame</span><br>
        <span @click="guiview='commands'" class="play-btn">Commands</span><br>
        <span @click="guiview='credits'" class="play-btn">Credits</span><br>
      </div>
      <div v-if="guiview">
        <span @click="guiview=null" class="play-btn">Menu</span>
        <a href="<?=$newgame_url?>" class="play-btn">New Game</a>
      </div>
      <div v-if="guiview=='hof'">
        <h2>Hall of Fame</h2>
        <?php 
        global $db;
        $gameT = new gTable('game');
        $res = $gameT->getRows([
          'end_time'=>['gt'=>0]
        ], [
          'select'=>['name', 'level', 'game_time'],
          'limit'=>8,
          'orderby'=>['level'=>'desc','id'=>'desc']
        ]);
        ?>
        <table class="hof-table">
          <tr><th>Name<th>Level<th>Game Time (min)
          <?php foreach($res as $game) {
            echo "<tr><td>{$game['name']}<td>{$game['level']}<td>{$game['game_time']}</tr>";
          } ?>
        </table>

<?=view::script('lib/vue/vue.min.js')?>
<?php
view::script('src/core/assets/admin/content.js');
view::script('src/core/lang/content/'.gila::config('language').'.js');
?>


<?php
$pnk = new gTable('game');
$t = $pnk->getTable();
?>

<div id="vue-table">
  <g-table gtype="game" ref="gtable"></g-table>
</div>

      </div>
      <div v-if="guiview=='commands'">
        <h2>Instructions</h2>
        <table class="com-table">
          <tr><th>arrow keys<br>w, a, s, d</th>
            <td> Move one tile. If step on a monster your character hits it.</td></tr>
          <tr><th>[space]</th><td> Go to next floor by stairs</td></tr>
          <tr><th>e</th><td> Equip weapon/armor</td></tr>
          <tr><th>u</th><td> Use an item</td></tr>
          <tr><th>h</th><td> Search for hidden doors/traps</td></tr>
          <tr><th>j</th><td> Jump over a tile or a small monster</td></tr>
          <tr><th>k</th><td> Kick a small monster or an object</td></tr>
          <tr><th>f</th><td> Fire arrow</td></tr>
          <tr><th>z</th><td> Pass your turn</td></tr>
          <tr><th>Z</th><td> Rest</td></tr>
          <tr><th>\</th><td> Actions menu</td></tr>
        </table>
      </div>
      <div v-if="guiview=='credits'">
        <h2>Development</h2>
        <p>Vasilis Zoumpourlis (<a target="_blank" href="https://twitter.com/zuburlis">twitter</a>)</p>
        <h2>Graphics</h2>
        <p>Tileset DawnLike by DragonDePlatino (<a target="_blank" href="https://twitter.com/DragonDePlatino">twitter</a>)</p>
        <p>Cover image by Juanele Tamal (<a target="_blank" href="https://twitter.com/juanele_tamal">twitter</a>)</p>
        <br>
        <p>
          If you enjoy this game, join <a target="_blank" href="https://www.facebook.com/dungeonmist">facebook page</a> to get notified for new releases.
        </p>
      </div>
      <br>
      <br>

    </div>
</body>

<!-- Global site tag (gtag.js) - Google Analytics -->
<?=view::script("src/dungeonrl/vue.min.js")?>
<script>
var app = new Vue({
  el: '#main',
  data: {
    guiview: null
  }
});

</script>

<?php if(gila::base_url()!='http://localhost/gilacms/') { ?>
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-130027935-1"></script>
<script>
  if(window.self !== window.top) newgamebtn.href += '?ref='+document.domain
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-130027935-1');
</script>
<?php } ?>
