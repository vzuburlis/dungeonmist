<script>
var gameStatus = 'loading'
g.get('<?=$gamedata_url?>/<?=$c->gameId?>/monsters.json', function(data) {
  monsterType = JSON.parse(data);
  assetLoaded('monsters');
})
g.get('<?=$gamedata_url?>/<?=$c->gameId?>/items.json', function(data) {
  itemType = JSON.parse(data);
  if(player.gameTurn==0) if(player.weapon==null) for(i in player.inventory) {
    e = itemType[player.inventory[i].itemType]
    if(typeof e.type!='undefined' && e.type=='weapon') player.wield('weapon', i);
  }
  updateStats();
  assetLoaded('items');
})
g.get('<?=$ppath?>data/itemEnchantments.json?v=1012', function(data) {
  itemEnchantment = JSON.parse(data);
  assetLoaded('itemEnchantments');
})
g.get('<?=$ppath?>data/objects.json?v=1012', function(data) {
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
var lightmap = [];
var map = <?=json_encode($c->map)?>;

var mapRev = <?=json_encode($c->mapRev)?>;
var mapItems = <?=json_encode($c->mapItems ?? [])?>;
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

if(canvas!==null) {
  canvas.width = 32*renderWidth*2+32;
  canvas.height = 32*renderHeight*2+32;
  minicanvas.width = mapWidth*8;
  minicanvas.height = mapHeight*8;
  context = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;
  ctxMini = minicanvas.getContext("2d");
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
    xp: <?=($c->player['xp'] ?? 0)?>,
    gold: <?=($c->player['gold'] ?? 0)?>,
    attack: <?=($c->player['attack'] ?? 0)?>,
    armor: <?=$c->player['armor']?>,
    arrows: <?=$c->player['arrows']?>,
    shield: <?=$c->player['shield']?>,
    strength: <?=($c->player['strength'] ?? 0)?>,
    dexterity: <?=($c->player['dexterity'] ?? 0)?>,
    intelligence: <?=($c->player['intelligence'] ?? 0)?>,
    abilities: <?=json_encode($c->player['abilities'] ?? [])?>,
    resist: <?=json_encode($c->player['resist'] ?? [])?>,
    status: <?=json_encode($c->player['status'] ?? [])?>,
    inventory: <?=json_encode($c->player['inventory'] ?? [])?>,
    los: <?=($c->level<7 ? 7-$c->level : rand(0,1))?>,
    sprite: <?=json_encode($c->player['sprite'])?>,
    weapon: <?=$c->player['weapon'] ?? 'null'?>,
    eArmor: <?=$c->player['eArmor'] ?? 'null'?>,
    eShield: <?=$c->player['eShield'] ?? 'null'?>,
    lore: <?=json_encode($c->player['lore'] ?? ['items'=>[]])?>,
    gameTurn: <?=$c->player['gameTurn'] ?? '0'?>,
    turnsToRest: <?=$c->player['turnsToRest'] ?? '0'?>,
    name: '<?=$c->player['name'] ?>',
    className: '<?=$c->player['className'] ?>'
});
window.focus();
</script>
