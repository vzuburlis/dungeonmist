<?php
$ppath = gila::base_url().'src/'.GPACKAGE.'/';
$tile_folder = gila::base_url()."src/".GPACKAGE."/tile/";
$status_folder = gila::base_url()."src/".GPACKAGE."/status/";
$dl_folder = gila::base_url()."src/".GPACKAGE."/DawnLike/";
$play_url = GPACKAGE.'/play';
$new_url = GPACKAGE.'/new';
$game_url = GPACKAGE.'/game';
$update_url = GPACKAGE.'/update';
$gamedata_url = GPACKAGE.'/gamedata';
$permadeath_url = GPACKAGE.'/permadeath';
?>

<head>
    <base href="<?=gila::base_url()?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"> 
    <meta property="og:url"         content="https://dungeonmist.com/play/" />
    <meta property="og:type"        content="website" />
    <meta property="og:title"       content="Dungeon Mist" />
    <meta property="og:description" content="A free roguelike browser game" />
    <meta property="og:image"       content="https://dungeonmist.com/src/dungeonrl/images/bg.png" />
    <?=view::script("lib/gila.min.js")?>
    <?=view::script($unit_js_path)?>
    <link href="https://fonts.googleapis.com/css?family=Berkshire+Swash" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Bangers" rel="stylesheet">
    <link href="<?=$style_css_path?>" rel="stylesheet">
</head>

<body style="background:#000;overflow: hidden; padding:0;margin:4px;"  scroll="no">
  <canvas id="map" onmousemove="mousemoveOnMap(event,this)"
   ontouch="clickOnMap(event,this)"
   onclick="clickOnMap(event,this)"></canvas>
  <canvas id="minimap"></canvas>
  <?php include_once(__DIR__.'/play.controls.php')?>
</body>

<?php //include_once(__DIR__.'/adpopup.php') ?>

<?php include __DIR__.'/loadData.php'?>
<script>
canvas.focus();
var gameLevel = <?=$c->level?>;
//window.frameElement
//  ? 'embedded in iframe or object'
//  : 'not embedded or cross-origin'

merchantInventory = [
  {itemType:9, hp:12, attack:2},
  {itemType:0},{itemType:2},{itemType:3},{itemType:4},
  {itemType:<?=$c->findItemType("Scroll of Map")?>}
]

function moveLevel(direction=null) {
  fm = dataToUpdate()
  if(direction!==null) {
    fm.append('level', <?=$c->level?>-direction[2]);
  }

  setGameStatus('wait')
  g.ajax({
      url: '<?=gila::base_url()?><?=$update_url?>',
      data: fm,
      method: 'post',
      fn: function() {
        window.location.href = '<?=$play_url?>'
      }
  })
}

function autoSave() {
  fm = dataToUpdate()

  g.ajax({
      url: '<?=gila::base_url()?><?=$update_url?>',
      data: fm,
      method: 'post',
      fn: function() {
        setTimeout(function(){
          activeGame = false;
        }, 5000)
      }
  })
}

function dataToUpdate() {
  let fm=new FormData()
  fm.append('player', JSON.stringify(player));
  fm.append('level', <?=$c->level?>);
  mapSize = [mapWidth, mapHeight]

  fm.append('levelMap', JSON.stringify({
    mapSize: mapSize,
    mapRev: mapRev,
    mapItems: mapItems,
    monsters: monsters,
    items: items,
    region: regions,
    groundObjects: groundObjects,
    objects: objects,
    turns: levelTurns
  }));
  return fm
}

function permaDeath() {
  setGameStatus('wait')
  g.ajax({
    url: '<?=gila::base_url()?><?=$permadeath_url?>',
    data: dataToUpdate(),
    method: 'post',
    fn: function(){
      document.getElementById('play-btn-container').style.display = "block"
      var dataURL = canvas.toDataURL();
      let fm=new FormData()
      fm.append('imgBase64', dataURL);
      g.ajax({
        url: "<?=gila::base_url()?>dungeonrl/saveBase64/<?=$c->gameId?>",
        data: fm,
        method: 'post', fn:function(){}
      })
    }
  })
}

var _download_path_ = "<?=$dl_folder?>";
var _tile_path_ = "<?=$tile_folder?>";
var _status_path_ = "<?=$ppath?>status/";
</script>

<?=view::script($game_js_path)?>
