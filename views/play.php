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
    <meta property="og:url"         content="https://caveofcenbeald.com/dungeonrl/play/" />
    <meta property="og:type"        content="website" />
    <meta property="og:title"       content="Dungeon Roguelike" />
    <meta property="og:description" content="A free roguelike browser game" />
    <meta property="og:image"       content="https://caveofcenbeald.com/src/dungeonrl/images/bg.png" />
    <?=view::script("lib/gila.min.js")?>
    <?=view::script($unit_js_path)?>
    <link href="https://fonts.googleapis.com/css?family=Berkshire+Swash" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Bangers" rel="stylesheet">
    <link href="<?=$style_css_path?>" rel="stylesheet">
</head>

<body style="background:#000;overflow: hidden;">
  <div id="main">
    <canvas id="map" onmousemove="mousemoveOnMap(event,this)" ontouch="clickOnMap(event,this)" onclick="clickOnMap(event,this)"></canvas>
    <canvas id="minimap"></canvas>
    <?php include_once(__DIR__.'/play.controls.php')?>
  </div>
</body>


<?php include __DIR__.'/loadData.php'?>
<script>
var gameLevel = <?=$c->level?>;

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
  mapString = ''
  for(i=0;i<mapWidth;i++) for(j=0;j<mapHeight;j++) mapString += map[i][j]
  mapSize = [mapWidth, mapHeight]

  fm.append('levelMap', JSON.stringify({
    //map: map,
    mapString: mapString,
    mapSize: mapSize,
    mapRev: mapRev,
    mapItems: mapItems,
    monsters: monsters,
    items: items,
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
    }
  })
}

var showMinimap = false;
if(screen.width>800) showMinimap = true;
function toggleMinimap() {
  if(showMinimap) {
    showMinimap = false
    ctxMini.clearRect(0, 0, minicanvas.width, minicanvas.height);
  } else {
    showMinimap = true
    renderMiniMap()
  }
}

function updateStats() {
  if(player.weapon!=null) {
    e = player.inventory[player.weapon]
    damage = player.meleeDamage()
    pAttack.innerHTML = damage+' '+e.hp+'/'+itemType[e.itemType].hp;
    if(damage>0) pAttack.innerHTML = '+'+pAttack.innerHTML
    eWeapon.style.display = 'inline-block';
  } else eWeapon.style.display = 'none';

  if(player.eArmor!=null) {
    e = player.inventory[player.eArmor]
    pArmor.innerHTML = '['+player.armor+' '+e.hp+'/'+itemType[e.itemType].hp;
    eArmor.style.display = 'inline-block';
  } else eArmor.style.display = 'none';

  if(player.eShield!=null) {
    e = player.inventory[player.eShield]
    pShield.innerHTML = '( '+e.hp+'/'+itemType[e.itemType].hp;
    eShield.style.display = 'inline-block';
  } else eShield.style.display = 'none';

  pArrows.innerHTML = player.arrows;
  pGold.innerHTML = player.gold;
  if(player.arrows>0) btnArrows.style.display='inline-block'; else btnArrows.style.display='none';
  if(mapItems.includes('key')) document.getElementById("pKey").style.display = 'inline-block'
  if(mapItems.includes('chest_key')) document.getElementById("pChestKey").style.display = 'inline-block'
}
updateStats();

</script>

<?=view::script($game_js_path)?>
