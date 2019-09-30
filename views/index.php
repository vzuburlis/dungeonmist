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
    background: url(<?=gila::base_url()?>src/<?=GPACKAGE?>/images/bg.png) no-repeat center center fixed;
    background-color: black;
    background-size: cover;
}
#game-title, h1, h2 ,h3 {
  font-family: 'Berkshire Swash', cursive;
}
#game-title{
    font-size: 4em;
    padding: 80px 0;
}

#main {
    padding: 10px;
    background: rgba(0,0,0,0.5);
}
#msgBox{ top:0;}
#statBox { bottom:0; display:grid; grid-template-columns:1fr 1fr 1fr 1fr;font-size:24px}
#statBox img { width: 32px; height:32px;}
#statBox span { padding: 4px; }
.play-btn {
  background: #579ca2;
  border-color:#579ca2;
}
.play-btn:hover {
    color: white;
    background: #579ca2;/*#ecc148;*/
}
.com-table, .hof-table {
  margin:auto; max-width:400px;
  border-collapse: collapse;
}
.hof-table td {
  text-align: center;
}
.com-table th, .com-table td, .hof-table td {
  min-width: 160px;
  border-top: 1px solid grey;
  padding: 8px 0;
}

button{
    font-size: 3em;
}
</style>
<head>
    <base href="<?=gila::base_url()?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?=view::css("lib/gila.min.css")?>
    <?=view::script("lib/gila.min.js")?>
    <link href="https://fonts.googleapis.com/css?family=Berkshire+Swash" rel="stylesheet">
</head>


<body>
    <div id="main">
      <div id="game-title">Dungeon Mist</div>
      <div v-if="!guiview">
        <?=($gameId ? '<a href="'.$playgame_url.'" class="play-btn">Continue</a><br>' : '')?>
        <a href="<?=$newgame_url?>" class="play-btn">New Game</a><br>
        <span @click="guiview='hof'" class="play-btn">Hall of Fame</span><br>
        <span @click="guiview='commands'" class="play-btn">Commands</span><br>
        <span @click="guiview='credits'" class="play-btn">Credits</span><br>
      </div>
      <div v-if="guiview=='hof'">
        <h2>Hall of Fame</h2>
        <?php 
        global $db;
        $gameT = new gTable('game');
        $res = $gameT->getRows(null, [
          'select'=>['name', 'level', 'game_time'],
          'limit'=>5,
          'orderby'=>['level'=>'desc','id'=>'desc']
        ]);
        ?>
        <table class="hof-table">
          <tr><th>Name<th>Level<th>Game Time (min)
          <?php foreach($res as $game) {
            echo "<tr><td>{$game['name']}<td>{$game['level']}<td>{$game['game_time']}</tr>";
          } ?>
        </table>
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
          <tr><th>r</th><td> Rest</td></tr>
          <tr><th>z</th><td> Pass your turn</td></tr>
        </table>
      </div>
      <div v-if="guiview=='credits'">
        <h2>Development</h2>
        <p>Vasilis Zoumpourlis (<a target="_blank" href="https://twitter.com/zuburlis">twitter</a>)</p>
        <h2>Graphics</h2>
        <p>Tileset DawnLike by DragonDePlatino (<a target="_blank" href="https://twitter.com/DragonDePlatino">twitter</a>)</p>
        <br>
        <p>
          If you enjoy this game, join <a target="_blank" href="https://www.facebook.com/dungeonmist">facebook page</a> to get notified for new releases.
        </p>
      </div>
      <br>
      <br>
      <div style="display:none">
        <img src="<?=$tile_folder?>floor2.png">
        <img src="<?=$tile_folder?>wall.png">
        <img src="<?=$tile_folder?>player.png">
        <img src="<?=$tile_folder?>upstairs.png">
        <img src="<?=$tile_folder?>downstairs.png">
        <img src="<?=gila::base_url()?>src/<?=GPACKAGE?>/DawnLike/Items/ShortWep.png">
        <img src="<?=gila::base_url()?>src/<?=GPACKAGE?>/DawnLike/Items/Potion.png">
        <img src="<?=gila::base_url()?>src/<?=GPACKAGE?>/DawnLike/Items/Armor.png">
      </div>
      <div v-if="guiview">
        <span @click="guiview=null" class="play-btn">Menu</span>
        <a href="<?=$newgame_url?>" class="play-btn">New Game</a>
      </div>
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

var itemImg = [];
itemImgPath = [
    ['player0','Characters/Player0.png'],
    ['player1','Characters/Player1.png'],
    ['shortwep','Items/ShortWep.png'],
    ['armor','Items/Armor.png'],
    ['potion','Items/Potion.png'],
    ['shortwep','Items/ShortWep.png'],
    ['scroll','Items/Scroll.png'],
    ['door0','Objects/Door0.png'],
    ['door1','Objects/Door1.png'],
    ['rock','Items/Rock.png'],
    ['chest0','Items/Chest0.png'],
    ['chest','Items/Chest1.png'],
    ['undead0','Characters/Undead0.png'],
    ['undead1','Characters/Undead1.png'],
    ['decor0','Objects/Decor0.png'],
    ['ground0','Objects/Ground0.png'],
]
for(let i=0;i<itemImgPath.length;i++) {
    itemImg[itemImgPath[i][0]] = new Image();
    itemImg[itemImgPath[i][0]].src = "<?=$dl_folder?>"+itemImgPath[i][1];
}

g.get('<?=$ppath?>data/monsters.json', function(data){
  monsterType = JSON.parse(data);
})
g.get('<?=$ppath?>data/items.json', function(data){
  itemType = JSON.parse(data);
})
g.get('<?=$ppath?>data/objects.json', function(data){
  objectType = JSON.parse(data);
})

</script>

<script async src="https://www.googletagmanager.com/gtag/js?id=UA-130027935-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-130027935-1');
</script>
