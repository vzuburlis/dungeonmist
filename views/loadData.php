<script>
var gameStatus = 'loading'
g.get('<?=$gamedata_url?>/<?=$c->gameId?>/monsters.json?v=107', function(data){
  monsterType = JSON.parse(data);
  assetLoaded('monsters');
})
itemType = <?=json_encode($c->itemType)?>;
g.get('<?=$gamedata_url?>/<?=$c->gameId?>/items.json', function(data){
  assetLoaded('items');
})
g.get('<?=$ppath?>data/itemEnchantments.json?v=107', function(data){
  itemEnchantment = JSON.parse(data);
  assetLoaded('itemEnchantments');
})
g.get('<?=$ppath?>data/objects.json?v=107', function(data){
  objectType = JSON.parse(data);
  assetLoaded('objects');
})
assetsToLoad = ['monsters','items','objects','itemEnchantments'];
assetsLoaded = 0;
function assetLoaded(asset) {
  for(i in assetsToLoad) {
    if(assetsToLoad[i] == asset) {
      console.log('loaded ',assetsToLoad[i])
      assetsLoaded++;
    }
  }
  if(assetsToLoad.length>=assetsLoaded) gameStatus = 'play';
}

var mapWidth = <?=$c->columns?>;
var mapHeight = <?=$c->rows?>;
//mapGen = mapClass();
//mapGen.createDungeon();
//var map = mapGen.map;
var map = <?=json_encode($c->map)?>;;
var mapRev = <?=json_encode($c->mapRev)?>;
var mapItems = <?=json_encode($c->mapItems ?? [])?>;
var lightmap = [];
var logMessages = [];
for(i=0;i<mapWidth;i++) lightmap.push([]);
var regions = <?=json_encode($c->region)?>;
var monsters_data = <?=json_encode($c->monsters)?>;
var monsters = [];
var items = <?=json_encode($c->items)?>;
var objects = <?=json_encode($c->objects)?>;
var groundObjects = <?=json_encode($c->groundObjects)?>;
var levelTurns = <?=$c->levelTurns?>;

var gameOverLocation = '<?=$game_url?>/<?=$c->game_id?>';
addedKey = false


for (let i=0; i<monsters_data.length; i++) {
    monsters.push(unitClass(monsters_data[i]));
}

var startpoint = <?=json_encode($c->startPos)?>;
//startpoint = mapGen.startpoint;
var canvas = document.getElementById("map");
var minicanvas = document.getElementById("minimap");
var tileImg = [];
var itemImg = [];
var statusImg = [];
var timeBit = 0;
renderWidth = 13;
renderHeight = 8;
var clientWidth = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;
if(clientWidth<500) renderWidth = 10;

canvas.width = 32*renderWidth*2+32;
canvas.height = 32*renderHeight*2+32;
minicanvas.width = mapWidth*8;
minicanvas.height = mapHeight*8;
context = canvas.getContext("2d");
context.imageSmoothingEnabled = false;
ctxMini = minicanvas.getContext("2d");
//context.translate(0.5, 0.5);
//context.scale(2,2);

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
    //['tree','Objects/Tree0.png'],
    ['floor','Objects/Floor.png'],
    //['hills','Objects/Hill0.png'],
    ['tile','Objects/Tile.png'],
    ['undead0','Characters/Undead0.png'],
    ['undead1','Characters/Undead1.png'],
    ['player0','Characters/Player0.png'],
    ['player1','Characters/Player1.png'],
    ['playerR0','Characters/PlayerR0.png'],
    ['playerR1','Characters/PlayerR1.png'],
    ['rodent0','Characters/Rodent0.png'],
    ['rodent1','Characters/Rodent1.png'],
    ['pest0','Characters/Pest0.png'],
    ['pest1','Characters/Pest1.png'],
    ['bird0','Characters/Avian0.png'],
    ['bird1','Characters/Avian1.png'],
    ['decor0','Objects/Decor0.png'],
    ['decor1','Objects/Decor1.png'],
    ['ground0','Objects/Ground0.png'],
    ['effect0','Objects/Effect0.png'],
    ['key','Items/Key.png'],
    ['gauze','../tile/gauze.png'],
    ['light','Items/Light.png'],
    ['shield','Items/Shield.png'],
    ['ammo','Items/Ammo.png'],
    ['staff','staff.png'],
    ['book','Items/Book.png'],
    ['pit0','Pit0.png'],
    ['pit1','Pit1.png'],
]
for(let i=0;i<itemImgPath.length;i++) {
    itemImg[itemImgPath[i][0]] = new Image();
    itemImg[itemImgPath[i][0]].src = "<?=$dl_folder?>"+itemImgPath[i][1];
}

tileFiles = {
  "wall":"wallnn1.png", "path":"floor2.png", "darkpath":"darkpath.png", "ups":"upstairs.png", "downs":"downstairs.png",
  "sign":"sign.png", "water":"water.png"
}
for(i in tileFiles) {
  tileImg[i] = new Image();
  tileImg[i].src = "<?=$tile_folder?>"+tileFiles[i];
}

statusFiles = [
  'strength', 'speed', 'bleeding', 'bless', 'curse', 'confuze', 'light', 'poison'
]
for(i in statusFiles) {
  name = statusFiles[i]
  statusImg[name] = new Image();
  statusImg[name].src = "<?=$ppath?>status/"+name+".png";
}

var timeBit = 0;

player = unitClass({
    context: canvas.getContext("2d"),
    width: 32,
    height: 32,
    x: <?=$c->player['x']?>,
    y: <?=$c->player['y']?>,
    hp: <?=$c->player['hp']?>,
    maxhp: <?=$c->player['maxhp']?>,
    attack: <?=$c->player['attack']?>,
    armor: <?=$c->player['armor']?>,
    arrows: <?=$c->player['arrows']?>,
    shield: <?=$c->player['shield']?>,
    strength: <?=($c->player['strength'] ?? 0)?>,
    dexterity: <?=($c->player['dexterity'] ?? 0)?>,
    intelligence: <?=($c->player['intelligence'] ?? 0)?>,
    abilities: <?=json_encode($c->player['abilities'] ?? [])?>,
    status: <?=json_encode($c->player['status'] ?? [])?>,
    inventory: <?=json_encode($c->player['inventory'] ?? [])?>,
    los: <?=($c->level<7 ? 7-$c->level : rand(0,1))?>,
    sprite: <?=json_encode($c->player['sprite'])?>,
    weapon: <?=$c->player['weapon'] ?? 'null'?>,
    eArmor: <?=$c->player['eArmor'] ?? 'null'?>,
    eShield: <?=$c->player['eShield'] ?? 'null'?>,
    lore: <?=json_encode($c->player['lore'] ?? ['items'=>[]])?>,
    gameTurn: <?=$c->player['gameTurn'] ?? '0'?>,
    name: '<?=$c->player['name'] ?>',
    className: '<?=$c->player['className'] ?>'
});
window.focus();
</script>
