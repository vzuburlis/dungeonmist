<?php
$ppath = gila::base_url().'src/'.GPACKAGE.'/';
$tile_folder = gila::base_url()."src/".GPACKAGE."/tile/";
$dl_folder = gila::base_url()."src/".GPACKAGE."/DawnLike/";
$play_url = GPACKAGE.'/play';
$new_url = gila::base_url(GPACKAGE).'/new';
$feedback_url = GPACKAGE.'/feedback';
$pnk = new gTable('playerclass');
$classes = $pnk->getRows();
$text = "R.I.P. {$game['name']} you wil alwayws be remember. A true hero that fought the ";
$this_url = "https://dungeonmist.com/dungeonrl/game/".$game['id'];
$shot = "https://dungeonmist.com/assets/dwarf.png";
if(file_exists(SITE_PATH.'assets/endshot'.$game['id'].'.png')) {
  $shot = "https://dungeonmist.com/assets/endshot/".$game['id'].".png";
}

$description = $game['name']." reached level ".$game['level']." in the dungeons.";
if($deathCause) {
  $description = $game['name']." died from ".$deathCause." at level ".$game['level'].".";
}
?>

<link href="<?=$style_css_path?>" rel="stylesheet">
<style>
body{
    font-family: courier new;
    text-align: center;
    color: white;
    background-color: black;
    background-size: cover;
}
#game-title{
    font-family: 'Berkshire Swash', cursive;
    font-size: 3.5em;
    padding: 30px 0;
}
.form-label {
  /*font-family: 'Berkshire Swash', cursive;*/
  font-size: 1.3em;
}
#about-game{
    padding: 4em 0;
}
#main {
    padding: 10px;
    max-width:1000px;
    margin: auto;
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
.g-btn.bw{background:black;border:1px solid white;}
#equip-menu--list,#use-menu--list{max-width:450px; margin:auto}
</style>
<head>
    <base href="<?=gila::base_url()?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta property="og:url"         content="<?=$this_url?>" />
    <meta property="og:type"        content="website" />
    <meta property="og:title"       content="Dungeon Mist" />
    <meta property="og:description" content="<?=$description?>" />
    <meta property="og:image"       content="<?=$shot?>" />

    <meta property="twitter:description" content="<?=$description?>" />
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:image:src" content="<?=$shot?>" />

    <?=view::css("lib/gila.min.css")?>
    <?=view::script("lib/gila.min.js")?>
    <?=view::script($unit_js_path)?>
    <link href="https://fonts.googleapis.com/css?family=Berkshire+Swash" rel="stylesheet">
</head>


<body>
  <div id="main">
    <div id="game-title">R.I.P.</div>
    <div class="form-label"><?=$description?></div>
    <div class="form-label">Turns Played: <?=floor($game['game_turns']/10)?></div>
    <div class="form-label">Gold found: <?=$gold?></div>

    <br>
    <a href="https://www.facebook.com/sharer.php?u=<?=$this_url?>" class="g-btn bw">Share on Facebook</a>
    <a href="http://twitter.com/intent/tweet/?url=<?=$this_url?>" class="g-btn bw">Share on Twitter</a>
    <br><br><br>
    <div id="">
      <a href="<?=$new_url?>" class="play-btn">New Game</a>
      <br>
      <a href="<?=gila::base_url(GPACKAGE)?>" class="play-btn">Main Menu</a>
    </div>
    <img src="assets/endshot/<?=$game['id']?>.png" style="margin:auto">
    <h3>Equipment</h3>
    <div id="equip-menu--list"></div>
    <h3>Inventory</h3>
    <div id="use-menu--list"></div>
    <br><br><br>

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

}

itemType = <?=json_encode($c->itemType)?>;
itemEnchantment = <?=json_encode(file_get_contents($ppath."data/itemEnchantments.json"))?>;

itemImg=[];
itemImgPath = [
    ['obj','objects.png'],
    ['dungeon','dungeon.png'],
    ['shortwep','Items/ShortWep.png'],
    ['medwep','Items/MedWep.png'],
    ['rock','Items/Rock.png'],
    ['armor','Items/Armor.png'],
    ['potion','Items/Potion.png'],
    ['scroll','Items/Scroll.png'],
    ['door0','Objects/Door0.png'],
    ['door1','Objects/Door1.png'],
    ['trap','Objects/Trap1.png'],
    ['chest0','Items/Chest0.png'],
    ['chest1','Items/Chest1.png'],
    ['tile','Objects/Tile.png'],
    ['key','Items/Key.png'],
    ['gauze','../tile/gauze.png'],
    ['light','Items/Light.png'],
    ['shield','Items/Shield.png'],
    ['ammo','Items/Ammo.png'],
    ['staff','staff.png'],
    ['book','Items/Book.png'],
    ['pit0','Pit0.png'],
    ['pit1','Pit1.png'],
    ['gold','gold.png'],
]
for(let i=0;i<itemImgPath.length;i++) {
    itemImg[itemImgPath[i][0]] = new Image();
    itemImg[itemImgPath[i][0]].src = "<?=$dl_folder?>"+itemImgPath[i][1];
}

var player = <?=json_encode($c->player)?>;
list = document.getElementById("use-menu--list")
list.innerHTML = ""
com = 65
comToItem = []
for(i=0; i<player.inventory.length; i++) {
  if(typeof player.inventory[i].itemType=='undefined') continue
  _itemType = player.inventory[i].itemType
  if(typeof itemType[_itemType]=='undefined') continue
  _type = itemType[_itemType]
  src = itemImg[_type.sprite[0]].src
  sx = _type.sprite[1]*16+'px'
  sy = _type.sprite[2]*16+'px'
  if(_type.type=='weapon' || _type.type=='armor' || _type.type=='shield') continue;
  comToItem[com] = i
  if(typeof _type.hp!='undefined') {
    hp=' '+player.inventory[i].hp+'/'+_type.hp
  } else hp=''
  _nx = ''
  if(typeof player.inventory[i].stock!='undefined') {
    if(player.inventory[i].stock>1) _nx = ' x'+player.inventory[i].stock
  }
  if(_nx!='' && hp!='') console.error(getItemName(_itemType)+' uses hp and stock')
  list.innerHTML += '<div class="menu-item"><div class="item-img" style="background: url(\''+src+'\') -'+sx+' -'+sy+';"></div> &nbsp;&nbsp;<span class="item-name">'+getItemName(_itemType)+hp+_nx+'</span></div>'
  com++
}

list = document.getElementById("equip-menu--list")
list.innerHTML = ""
com = 65;
comToItem = [];
for(i=0; i<player.inventory.length; i++) {
  if(typeof player.inventory[i].itemType=='undefined') continue
  _itemType = player.inventory[i].itemType
  if(typeof itemType[_itemType]=='undefined') continue
  _type = itemType[_itemType]
  src = itemImg[_type.sprite[0]].src
  sx = _type.sprite[1]*16+'px'
  sy = _type.sprite[2]*16+'px'
  if(_type.type!='weapon' && _type.type!='armor' && _type.type!='shield') continue;
  comToItem[com] = i

  if(player.weapon==i || player.eArmor==i || player.eShield==i) itemClass=' green'; else itemClass='';
  if(typeof _type.hp!='undefined') {
    hp=' '+player.inventory[i].hp+'/'+_type.hp+''
  } else hp=''
  _enc = null
  if(typeof player.inventory[i].enchantment!='undefined') _enc = player.inventory[i].enchantment
  list.innerHTML += '<div class="menu-item" ><div class="item-img" style="background: url(\''+src+'\') -'+sx+' -'+sy+';"></div>  &nbsp;&nbsp;<span class="item-name'+itemClass+'">'+getItemFullName(_itemType,_enc)+hp+'</span></div>'
  com++;
}

function getItemName(_itemType) {
  _type = itemType[_itemType]
  return _type.name
}
function getItemFullName(_itemType, enchantment) {
  name = getItemName(_itemType)
  if(typeof enchantment!='undefined') if(typeof itemEnchantment[enchantment]!='undefined') {
    return name+' '+itemEnchantment[enchantment][0];
  }
  return name
}
</script>

<?php if(gila::base_url()!='http://localhost/gilacms/') { ?>
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-130027935-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-130027935-1');
</script>
<?php } ?>
