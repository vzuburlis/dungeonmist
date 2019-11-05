/******** Load Images ********* */
itemImg=[];
var itemImgPath = [
  ['basic','Basic.png'],
  ['door','Door.png'],
  ['items','Items.png'],
  ['shortwep','Items/ShortWep.png'],
  ['medwep','Items/MedWep.png'],
  ['staff','staff.png'],
  ['armor','Items/Armor.png'],
  ['floor','Objects/Floor.png'],
  ['tile','Objects/Tile.png'],
  ['player0','Characters/Player0.png'],
  ['player1','Characters/Player1.png'],
  ['playerR0','Characters/PlayerR0.png'],
  ['playerR1','Characters/PlayerR1.png'],
  ['pit0','Pit0.png'],
  ['pit1','Pit1.png'],
  ['sparks','sparks.png'],
  ['rodent0','Characters/Rodent0.png'],
  ['rodent1','Characters/Rodent1.png'],
  ['pest0','Characters/Pest0.png'],
  ['pest1','Characters/Pest1.png'],
  ['decor0','Objects/Decor0.png'],
  ['decor1','Objects/Decor1.png'],
  ['ground0','Objects/Ground0.png'],
  ['effect0','Objects/Effect0.png'],
  ['effect1','Objects/Effect1.png'],
  ['key','Items/Key.png'],
  ['gauze','../tile/gauze.png'],
  ['light','Items/Light.png'],
  ['status','status.png'],
  ['undead0','Characters/Undead0.png'],
  ['undead1','Characters/Undead1.png'],
  ['obj','objects.png'],
  ['reptile0','Characters/Reptile0.png'],
  ['reptile1','Characters/Reptile1.png'],
  ['bird0','Characters/Avian0.png'],
  ['bird1','Characters/Avian1.png']
  //['rock','Items/Rock.png'],
]
for(let i=0;i<itemImgPath.length;i++) {
    itemImg[itemImgPath[i][0]] = new Image();
    itemImg[itemImgPath[i][0]].src = _download_path_+itemImgPath[i][1];
}

tileFiles = {
  "wall":"wallnn1.png", "ups":"upstairs.png", "downs":"downstairs.png",
  "sign":"sign.png"
}
for(i in tileFiles) {
  tileImg[i] = new Image();
  tileImg[i].src = _tile_path_+tileFiles[i];
}

var statusSprite = {
  'strength':[7,0],
  'speed':[3,0],
  'bleeding':[0,0],
  'bless':[1,0],
  'curse':[5,0],
  'confuze':[2,0],
  'light':[4,0],
  'poison':[6,0]
}

/****** Game Functions ******* */
var showMinimap = false;
if(document.body.clientWidth>800) showMinimap = true;
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
    url = itemImg[itemType[e.itemType].sprite[0]].src
    px = itemType[e.itemType].sprite[1]*16
    py = itemType[e.itemType].sprite[2]*16
    eWeaponImg.style.background = "rgba(0, 0, 0, 0) url('"+url+"') repeat scroll -"+px+"px -"+py+"px"
  } else eWeapon.style.display = 'none';

  if(player.eArmor!=null) {
    e = player.inventory[player.eArmor]
    pArmor.innerHTML = '['+player.armor+' '+e.hp+'/'+itemType[e.itemType].hp;
    eArmor.style.display = 'inline-block';
    url = itemImg[itemType[e.itemType].sprite[0]].src
    px = itemType[e.itemType].sprite[1]*16
    py = itemType[e.itemType].sprite[2]*16
    eArmorImg.style.background = "rgba(0, 0, 0, 0) url('"+url+"') repeat scroll -"+px+"px -"+py+"px"
  } else eArmor.style.display = 'none';

  if(player.eShield!=null) {
    e = player.inventory[player.eShield]
    pShield.innerHTML = '( '+e.hp+'/'+itemType[e.itemType].hp;
    eShield.style.display = 'inline-block';
    url = itemImg[itemType[e.itemType].sprite[0]].src
    px = itemType[e.itemType].sprite[1]*16
    py = itemType[e.itemType].sprite[2]*16
    eShieldImg.style.background = "rgba(0, 0, 0, 0) url('"+url+"') repeat scroll -"+px+"px -"+py+"px"
  } else eShield.style.display = 'none';

  pArrows.innerHTML = player.arrows;
  pGold.innerHTML = player.gold
  //if(player.skillPoints>0) {
  //  skillPoint.style.display = 'inline-block'
  //} else {
  //  skillPoint.style.display = 'none'
  //}
  //pXP.innerHTML = 'Level '+player.level+' ('+player.xp+'/'+player.levelXP()+')';
  if(player.arrows>0) btnArrows.style.display='inline-block'; else btnArrows.style.display='none';
  if(mapItems.includes('key')) document.getElementById("pKey").style.display = 'inline-block'
  if(mapItems.includes('chest_key')) document.getElementById("pChestKey").style.display = 'inline-block'
}

function updateIlluminateMap() {
  for (i=0; i< mapHeight; i++) {
    for (j=0; j< mapWidth; j++) {
      lightmap[j][i] = 0;
      if(map[j][i]=='l' || map[j][i]==',') lightmap[j][i] = 1;
    }
  }
  for (i=0; i<groundObjects.length; i++) {
    if(typeof objectType[groundObjects[i].type].illuminate!='undefined') {
      illuminateMap(i+10, groundObjects[i].x, groundObjects[i].y, objectType[groundObjects[i].type].illuminate, true);
    }
  }
  for (i=0; i<objects.length; i++) {
    if(typeof objectType[objects[i].type].illuminate!='undefined') {
      illuminateMap(i+10, objects[i].x, objects[i].y, objectType[objects[i].type].illuminate, true);
    }
  }
}

var tiles = {
    'C': {'sprite':['pit0',4,0]},
    '#': {'sprite':['pit0',4,2]},
    ' ': {'sprite':['pit0',1,2]},
    '.': {'sprite':['pit0',2,2]},
    ';': {'sprite':['pit0',1,1]},
    ',': {'sprite':['pit0',0,2]},
    ':': {'sprite':['pit0',1,2]},
    'l': {'sprite':['pit0',2,0],'sprite2':['pit0',3,3]},
    'g': {'sprite':['pit0',0,0],'sprite2':['pit1',0,0]},
    'b': {'sprite':['pit0',1,0],'sprite2':['pit1',1,0]},
    '=': {'sprite':['pit0',3,0],'sprite2':['pit1',3,0]},
    '-': {'sprite':['pit0',3,1],'sprite2':['pit1',3,1]},
    //'<': {'sprite':['pit0',4,2],'spriteOver':['pit1',3,1]}, //tileImg['ups']
    //'>': {'sprite':['pit0',3,1]}, //tileImg['downs']
    //'N': {'sprite':['pit0',2,2],'spriteOver':['pit1',3,1]} // tileImg['sign']
}

function illuminateMap(n, x, y, d, source=false) {
  if(d==0) return;
  if(!inMap(x,y)) return;
  if(n>9 && lightmap[x][y]==n) return;
  lightmap[x][y]=n;
  if(map[x][y]=='#' && source==false) return;
  illuminateMap(n, x+1, y, d-1);
  illuminateMap(n, x, y+1, d-1);
  illuminateMap(n, x-1, y, d-1);
  illuminateMap(n, x, y-1, d-1);
  illuminateMap(n, x+1, y+1, d-1);
  illuminateMap(n, x-1, y+1, d-1);
  illuminateMap(n, x-1, y-1, d-1);
  illuminateMap(n, x+1, y-1, d-1);
}
function renderMap2() {
    renderMap()
}
function renderMap(view=true) {
  context.globalAlpha = 1;
  context.fillStyle="#000000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  if(view) for (i=0; i< mapHeight; i++) {
    for (j=0; j< mapWidth; j++) {
      if (mapRev[j][i]>1) {
        mapRev[j][i] = 1;
      }
    }
  }

  if(view) player.view();


  for (i=player.y-renderHeight; i<=player.y+renderHeight; i++) {
    for (j=player.x-renderWidth; j<=player.x+renderWidth; j++) {
      if (inMap(j,i)) if (mapRev[j][i]>0) {
        context.globalAlpha = globalAlphaByMapRev(j,i)

        t = map[j][i]
        if(typeof tiles[t]!='undefined') {
          randBit = Math.floor(Math.random()*2)
          if(typeof tiles[t].sprite2!='undefined' && randBit==1) {
              drawSprite(j,i, itemImg[tiles[t].sprite2[0]], tiles[t].sprite2[1], tiles[t].sprite2[2]);
          } else {
              drawSprite(j,i, itemImg[tiles[t].sprite[0]], tiles[t].sprite[1], tiles[t].sprite[2]);
          }
        }

        if (map[j][i]=='<') {
          drawImage(j,i, tileImg['wall']);
          drawImage(j,i, tileImg['ups']);
        }
        if (map[j][i]=='N' || map[j][i]=='S') {
          drawImage(j,i, tileImg['path']);
          drawImage(j,i, tileImg['sign']);
        }
        if (map[j][i]=='>') { drawImage(j,i, tileImg['downs']); }

      }
    }
  }

  context.globalAlpha = 1;

  renderGroundObjects();

  for (i=0; i<groundObjects.length; i++) {
    x = groundObjects[i].x
    y = groundObjects[i].y
    if(inMap(x,y)) if(mapRev[x][y]>0) {
      context.globalAlpha = globalAlphaByMapRev(x,y)
        if(typeof objectType[groundObjects[i].type]!='undefined') {
            _t = objectType[groundObjects[i].type].sprite
        }
        if(typeof objectType[groundObjects[i].type].animated == 'undefined') {
            drawSprite(x,y, itemImg[_t[0]],  _t[1], _t[2]);
        } else {
            if(timeBit == 0 && mapRev[x][y]>1) {
                drawSprite(x,y, itemImg[_t[0]+'0'], _t[1], _t[2]);
            } else {
                drawSprite(x,y, itemImg[_t[0]+'1'],  _t[1], _t[2]);
            }
        }
    }
  }
  context.globalAlpha = 1;

  for (i=0; i<items.length; i++) if(items[i].carrier==null) {
    x = items[i][0]
    y = items[i][1]
    if(typeof mapRev[x]=='undefined') console.log('x: '+x)
    if(typeof mapRev[x][y]=='undefined') console.log('y: '+y)
    if(mapRev[x][y]>1) {
        if(typeof itemType[items[i][2]]!='undefined') {
            _t = itemType[items[i][2]].sprite
          drawItem(x,y, itemImg[_t[0]], _t[1], _t[2]);
        } else console.log(items[i][2])
    }
  }

  for (i=0; i<objects.length; i++) {
    x = objects[i].x
    y = objects[i].y
    if(inMap(x,y)) if(mapRev[x][y]>0) {
        if(typeof objectType[objects[i].type]!='undefined') {
          if(typeof objectType[objects[i].type].hidden!='undefined' &&
          typeof objects[i].detected=='undefined') continue;
          _t = objectType[objects[i].type].sprite
          if(typeof objectType[objects[i].type].tile!='undefined') {
            context.globalAlpha = 1;
            context.fillStyle="#000000";
            context.fillRect((x-player.x+renderWidth)*32, (y-player.y+renderHeight)*32, 32, 32);
            //context.clearRect((x-player.x+renderWidth)*32, (y-player.y+renderHeight)*32, 32, 32);
          }
        }
        context.globalAlpha = globalAlphaByMapRev(x,y)
        if(typeof objectType[objects[i].type].animated != 'undefined') {
          if(timeBit == 0 && mapRev[x][y]>1) {
            drawSprite(x,y, itemImg[_t[0]+'0'], _t[1], _t[2]);
          } else {
            drawSprite(x,y, itemImg[_t[0]+'1'], _t[1], _t[2]);
          }
        } else {
          drawSprite(x,y, itemImg[_t[0]],  _t[1], _t[2]);
        }
    }
  }

  context.globalAlpha = 1;
  visibleMonsterIds = visibleMonsters();

  for (i of visibleMonsterIds) {
    if(typeof monsters[i].seen == 'undefined') {
      logMsg('You see a '+monsterType[monsters[i].type].name)
      monsters[i].seen=1
    }
    x = monsters[i].x
    y = monsters[i].y
    monsters[i].seen = [x,y]
    _sprite = monsterType[monsters[i].type].sprite[0]
    _x = monsterType[monsters[i].type].sprite[1]
    _y = monsterType[monsters[i].type].sprite[2]
    if(timeBit == 0) {
      drawSprite(x,y, itemImg[_sprite+'0'], _x, _y);
    } else {
      drawSprite(x,y, itemImg[_sprite+'1'], _x, _y);
    }
    if(typeof monsterType[monsters[i].type].flying=='undefined' ||
      monsterType[monsters[i].type].flying==false) {
        if (map[x][y]=='=') drawImageB(x,y, itemImg['pit0'], 3, 0);
        if (map[x][y]=='-') drawImageB(x,y, itemImg['pit0'], 3, 1);
      }
    drawLifebar(x,y,monsters[i].hp,monsters[i].maxhp);
  }

  for (i in monsters) if(monsters[i].hp>0) if(typeof monsters[i].seen !== 'undefined') {
    context.globalAlpha = 0.4;
    x = monsters[i].seen[0]
    y = monsters[i].seen[1]
    if(mapRev[x][y]==1) {
      _sprite = monsterType[monsters[i].type].sprite[0]
      _x = monsterType[monsters[i].type].sprite[1]
      _y = monsterType[monsters[i].type].sprite[2]
      drawSprite(x,y, itemImg[_sprite+'1'], _x, _y);
    }
  }

  for(r in regions) {
    if(typeof regions[r].fog!='undefined') {
      fog = regions[r].fog
      context.globalAlpha = 0.2
      if(inBox(player.x, player.y, regions[r].box)) {
        for (i=player.y-renderHeight; i<=player.y+renderHeight; i++) {
          for (j=player.x-renderWidth; j<=player.x+renderWidth; j++) {
            if (inMap(j,i)) if (mapRev[j][i]>1) {
              drawSprite(j, i, itemImg[fog[0]], fog[1], fog[2]);
            }
          }
        }
      } else {
        for (i=player.y-renderHeight; i<=player.y+renderHeight; i++) {
          for (j=player.x-renderWidth; j<=player.x+renderWidth; j++) {
            if (inMap(j,i)) if (mapRev[j][i]>1) {
              if(inBox(j, i, regions[r].box)) {
                drawSprite(j, i, itemImg[fog[0]], fog[1], fog[2]);
              }
            }
          }
        }
      }

    }
  }

  context.globalAlpha = 1;
  player.render();
  if (map[player.x][player.y]=='=') drawImageB(player.x,player.y, itemImg['pit0'], 3, 0);
  if (map[player.x][player.y]=='-') drawImageB(player.x,player.y, itemImg['pit0'], 3, 1);
  drawLifebar(player.x,player.y,player.hp,player.maxhp);

  for (i of visibleMonsterIds) {
    drawStatus(monsters[i]);
  }

  drawStatus(player);

  drawSelectRect();

  if(showMinimap==true) {
    renderMiniMap();
  }
}

function renderGroundObjects() {
    return

  for (i=0; i<objects.length; i++) if(objectType[objects[i].type].ground==true) {
      renderObject(i)
  }
}

function renderObject(i) {
    x = objects[i].x
    y = objects[i].y
    if(inMap(x,y)) if(mapRev[x][y]>0) {
      context.globalAlpha = globalAlphaByMapRev(x,y)
        if(typeof objectType[objects[i].type]!='undefined') {
          if(typeof objectType[objects[i].type].hidden=='undefined' ||
          typeof objects[i].detected!='undefined') {
            _t = objectType[objects[i].type].sprite
            if(typeof objectType[objects[i].type].tile!='undefined') {
              context.clearRect((x-player.x+renderWidth)*32, (y-player.y+renderHeight)*32, 32, 32);
            }
          }
        }
        if(typeof objectType[objects[i].type].animated == 'undefined') {
            drawSprite(x,y, itemImg[_t[0]],  _t[1], _t[2]);
        } else {
            if(timeBit == 0 && mapRev[x][y]>1) {
                drawSprite(x,y, itemImg[_t[0]+'0'], _t[1], _t[2]);
            } else {
                drawSprite(x,y, itemImg[_t[0]+'1'],  _t[1], _t[2]);
            }
        }
    }
}


function globalAlphaByMapRev(j,i) {
  if (mapRev[j][i] == 5) return 1;
  if (mapRev[j][i] == 4) return 0.9;
  if (mapRev[j][i] == 3) return 0.8;
  if (mapRev[j][i] == 2) return 0.7;
  return 0.3;
}

function renderMiniMap() {
  ctxMini.clearRect(0, 0, minicanvas.width, minicanvas.height);
  for (y=0; y< mapHeight; y++) {
    for (x=0; x< mapWidth; x++) if (mapRev[x][y]>0) {
      tile = map[x][y]
      ctxMini.fillStyle = "#000088";
      if(tile=='#') ctxMini.fillStyle = "#888800";
      if(tile=='C') ctxMini.fillStyle = "#888800";
      if(tile=='.') ctxMini.fillStyle = "#bbcf66";
      if(tile==';') ctxMini.fillStyle = "#bbcf66";
      if(tile==':') ctxMini.fillStyle = "#333333";
      if(tile=='l') ctxMini.fillStyle = "#d34533";
      if(tile=='g') ctxMini.fillStyle = "#6da92c";
      if(tile=='b') ctxMini.fillStyle = "#726f5f";
      if(tile=='=') ctxMini.fillStyle = "#6dc3cb";//"#0000cc";
      if(tile=='-') ctxMini.fillStyle = "#7db93c";
      if(tile==',') ctxMini.fillStyle = "#5d9322";
      if(tile==' ') ctxMini.fillStyle = "#000000";
      ctxMini.fillRect(x*8, y*8, 8, 8);
      if(x==player.x && y==player.y) {
        ctxMini.fillStyle = "#ffffff";
        drawCircle(ctxMini, x, y);
      }
    }
  }
  ctxMini.fillStyle = "#ff0000";
  for (i of visibleMonsterIds) {
    x = monsters[i].x
    y = monsters[i].y
    drawCircle(ctxMini, x, y);
  }
  for (i=0; i<objects.length; i++) if(mapRev[objects[i].x][objects[i].y]>0) {
    if(typeof objectType[objects[i].type].reveal_to!='undefined') {
      if(typeof objects[i].detected=='undefined' || objects[i].detected==false) {
        if(typeof objectType[objects[i].type].tile!='undefined') {
          tile = objectType[objects[i].type].tile
          if(tile=='#') ctxMini.fillStyle = "#888800";
          ctxMini.fillRect(objects[i].x*8, objects[i].y*8, 8, 8);
        } else if(typeof objectType[objects[i].type].block!='undefined') {
          ctxMini.fillStyle = "#888800";
          ctxMini.fillRect(objects[i].x*8+1, objects[i].y*8+1, 6, 6);
        }
      }
    } else if(typeof objectType[objects[i].type].block!='undefined') {
      ctxMini.fillStyle = "#888800";
      ctxMini.fillRect(objects[i].x*8+1, objects[i].y*8+1, 6, 6);
    }
  }

}

function drawCircle(ctx, x, y) {
  ctx.beginPath();
  ctx.arc(x*8+4, y*8+4, 4, 0, Math.PI*2, false);
  ctx.closePath();
  ctx.fill();
}

function drawStatus(unit) {
    let x = (unit.x-player.x+renderWidth)*32+16-unit.status.length*8
    let y = (unit.y-player.y+renderHeight)*32-16
    for(let i=0; i<unit.status.length; i++) {
      if(typeof statusSprite[unit.status[i].effect]!='undefined') {
        context.drawImage(
          itemImg['status'],
          statusSprite[unit.status[i].effect][0]*16,
          statusSprite[unit.status[i].effect][1]*16,
          16, 16,
          x + i*16, y,
          16, 16);
      }
    }
}

function drawLifebar(x,y,hp,maxhp) {
    if(hp==maxhp) return
    x = x-player.x+renderWidth
    y = y-player.y+renderHeight+1
    context.fillStyle="#FF0000";
    context.fillRect(x * 32, y * 32-3, 32, 3); 
    context.fillStyle="#00FF00";
    context.fillRect(x * 32, y * 32-3, 32*hp/maxhp, 3); 
}
function drawImage (x,y,image) {
  x = x-player.x+renderWidth
  y = y-player.y+renderHeight
  try {
    context.drawImage(
      image,
      0, 0,
      16, 16,
      x * 32, y * 32,
      32, 32);
  } catch {
    console.error("drawimage: image not found")
  }
};
function drawImageB (x,y,image,sx=0,sy=0) {
  x = x-player.x+renderWidth
  y = y-player.y+renderHeight
  try {
    context.drawImage(
      image,
      sx*16, sy*16+11,
      16, 5,
      x * 32, y * 32+22,
      32.5, 10.5);
  } catch {
    console.error("drawimage: image not found")
  }
};
function drawSprite (x,y,image,sx=0,sy=0) {
  x = x-player.x+renderWidth
  y = y-player.y+renderHeight
  try {
    context.drawImage(
      image,
      sx*16, sy*16,
      16, 16,
      x * 32, y * 32,
      32, 32);
  } catch {
    console.error("drawimage: image not found")
  }
};
function drawItem (x,y,image,sx=0,sy=0) {
  x = x-player.x+renderWidth
  y = y-player.y+renderHeight
  try {
    context.drawImage(
      image,
      sx*16, sy*16,
      16, 16,
      x * 32+4, y * 32+4,
      24, 24);
  } catch {
    console.error("drawimage: image not found")
  }
};

function inMap (x,y) {
  if(x<0) return false;
  if(y<0) return false;
  if(x> mapWidth -1) return false;
  if(y> mapHeight -1) return false;
  return true;
}
function inBox (x,y,r) {
  if(x<r[0]) return false;
  if(y<r[1]) return false;
  if(x>r[0]+r[2]-1) return false;
  if(y>r[1]+r[3]-1) return false;
  return true;
}
function countTiles(sx,sy,w,h,tile) {
  n = 0
  for (i=sx; i<sx+w; i++) {
    for (j=sy; j<sy+h; j++) if(inMap(i,j)) if(map[i][j]==tile) n++
  }
  return n
}
function blockTiles(sx,sy,w,h,tile) {
  for (let i=sx; i<sx+w; i++) {
    for (let j=sy; j<sy+h; j++) if(inMap(i,j)) if(map[i][j]!=tile) return false
  }
  return true
}
function getObject(x,y) {
  for(oi=0;oi<objects.length;oi++) {
      if(objects[oi].x==x && objects[oi].y==y) return objects[oi];
  }
  return null;
}
function findObjectType(name,d=null) {
  for(let i=0;i<objectType.length;i++) {
      if(objectType[i].name==name) return i;
  }
  console.error("Could not find objectType "+name);
  return d;
}
function revealMap() {
  for (let i=0; i<mapHeight; i++) {
    for (let j=0; j<mapWidth; j++) if(map[j][i]!='#' || !blockTiles(j-1,i-1,3,3,'#')){
        mapRev[j][i] = 1;
    }
  }
}

function getMonster(x,y) {
    for (i=0; i<monsters.length; i++) if(monsters[i].hp>0) {
      if (x == monsters[i].x && y == monsters[i].y) return i;
    }
    return -1;
}
function getItem(x,y) {
    for (i=0; i<items.length; i++) if(items[i].carrier==null) {
      if (x == items[i][0] && y == items[i][1]) return i;
    }
    return -1;
}
function findItemType(name,d=null) {
  for(let i=0;i<itemType.length;i++) {
      if(itemType[i].name==name) return i;
  }
  console.error("Could not find itemType "+name);
  return d;
}

function logMsg(msg, block=false) {
  if(block) {
    msg = '<span style="color:yellow">'+msg+'</span>';
  } else if(msg.includes('<span')==false) msg = '<span>'+msg+'</span>';
  if(gameStatus=='rest') gameStatus='play';
  logMessages.push([player.gameTurn, msg, block])
  document.getElementById("msgBox").innerHTML += '<br>'+msg;
}

function setGameStatus(v) {
    gameStatus=v;
    btnCancel.style.display = 'none'
    btnCancelD.style.display = 'none'
    btnCancelM.style.display = 'none'
    btnTabsM.style.display = 'none'
    btnCheck.style.display = 'none'
    btnAction.style.display = 'none'
    btnUse.style.display = 'none'
    btnArrows.style.display = 'none'
    useMenu=document.getElementById("use-menu")
    equipMenu=document.getElementById("equip-menu")
    actionMenu=document.getElementById("action-menu")
    helpMenu=document.getElementById("help-menu")
    descriptionMenu=document.getElementById("description-menu")
    throwMenu=document.getElementById("throw-menu")
    gameMenu=document.getElementById("game-menu")
    useMenu.style.display = 'inline-block'
    equipMenu.style.display = 'inline-block'
    actionMenu.style.display = 'inline-block'
    helpMenu.style.display = 'inline-block'
    gameMenu.style.display = 'inline-block'
    descriptionMenu.style.display = 'inline-block'
    throwMenu.style.display = 'inline-block'
    if(v=='play') {
      btnAction.style.display = 'inline-block'
      btnUse.style.display = 'inline-block'
      if(player.arrows>0) btnArrows.style.display='inline-block';
    }
    if(v=='target' || v=='select-target') {
        btnCancel.style.display = 'inline-block'
        btnCheck.style.display = 'inline-block'
        useMenu.style.display = 'none'
        equipMenu.style.display = 'none'
        actionMenu.style.display = 'none'
        helpMenu.style.display = 'none'
        gameMenu.style.display = 'none'
        descriptionMenu.style.display = 'none'
        throwMenu.style.display = 'none'
    }
    if(v=='select-direction') {
      btnCancelD.style.display = 'inline-block'
    }
    if(v=='help-menu'||v=='equip-menu'||v=='action-menu'||v=='use-menu'
    ||v=='description-menu'||v=='throw-menu'||v=='game-menu'||v=='sell-menu') {
      btnCancelM.style.display = 'inline-block'
    }
    if(v=='equip-menu'||v=='action-menu'||v=='use-menu'
    ||v=='throw-menu') {
      btnTabsM.style.display = 'flex'
    }
}

function btnContinue() {
  setGameStatus('play');
  document.getElementById("msgBox").innerHTML='';
  renderMap()
}

function status(params) {
    var that = {};
    that.timeleft = 1000
    that.effect = params.effect
}

var turnPlayed = false;

document.dblclick = function(e) { 
    e.preventDefault();
}

document.onkeydown = function (e) {
    turnPlayed = false
    e = e || window.event;
    keyPress(e);
}

function keyPress (e) {
  value = gameStatus;
  if(Number.isInteger(e)==false) {
    code = e.keyCode
    if(value == 'play' || value == 'action-menu') {
      code = e.key
    }
  } else code = e
  activeGame = true;
  if (value == 'play') keypressPlay(code);
  if (value == 'target') keypressTarget(code);
  if (value == 'use-menu') keypressUse(code);
  if (value == 'sell-menu') keypressSell(code);
  if (value == 'throw-menu') keypressThrow(code);
  if (value == 'equip-menu') keypressEquip(code);
  if (value == 'action-menu') keypressAction(code);
  if (value == 'select-target') keypressTarget(code);
  if (value == 'select-direction') keypressDirection(code);
  if (value == 'pause' && code == '32') {
    setGameStatus('play');
    document.getElementById("msgBox").innerHTML='';
  }
  if (value == 'help-menu') {
    if(code==27 || code==88) {
      popup = document.getElementById("help-menu")
      popup.style.visibility = 'hidden'
      setGameStatus('play');
    }
  }
  if (value == 'game-menu') {
    if(code==27 || code==88) {
      popup = document.getElementById("game-menu")
      popup.style.visibility = 'hidden'
      setGameStatus('play');
    }
  }
  if (value == 'description-menu') {
    if(code==27 || code==88) {
      popup = document.getElementById("description-menu")
      popup.style.visibility = 'hidden'
      setGameStatus('target');
    }
  }

  if(turnPlayed == true) {
    runTurn();
    renderMap();
  }
}

function setGameMenuKey (code) {
  useMenu=document.getElementById("use-menu")
  equipMenu=document.getElementById("equip-menu")
  actionMenu=document.getElementById("action-menu")
  helpMenu=document.getElementById("help-menu")
  descriptionMenu=document.getElementById("description-menu")
  throwMenu=document.getElementById("throw-menu")
  gameMenu=document.getElementById("game-menu")
  useMenu.style.visibility = 'hidden'
  equipMenu.style.visibility = 'hidden'
  actionMenu.style.visibility = 'hidden'
  helpMenu.style.visibility = 'hidden'
  gameMenu.style.visibility = 'hidden'
  descriptionMenu.style.visibility = 'hidden'
  throwMenu.style.visibility = 'hidden'
  setGameStatus('play')
  keypressPlay(code)
}

function closeActionMenu() {
  popup = document.getElementById("action-menu")
  popup.style.visibility = 'hidden'
  if(gameStatus=='action-menu') setGameStatus('play')
}
function closeHelpMenu() {
  popup = document.getElementById("help-menu")
  popup.style.visibility = 'hidden'
  setGameStatus('play')
}

function keypressSell (code) {
  if(code==27 || code==88) {
    popup = document.getElementById("game-menu")
    popup.style.visibility = 'hidden'
    setGameStatus('play');
    return
  }
  if(code>64 && code<81) {
    let i = comToItem[code]
    if(i < player.inventory.length) {
        setGameStatus('play');
        _itemType = player.inventory[i].itemType
        _type = itemType[_itemType]
        _price = 1
        logMsg("You sold the " + getItemName(_itemType) + ' for ' + _price + ' gold');
        popup = document.getElementById("game-menu")
        popup.style.visibility = 'hidden'
        turnPlayed = true;
    }
  }
}

function keypressEquip (code) {
    if(code==27 || code==88) {
        popup = document.getElementById("equip-menu")
        popup.style.visibility = 'hidden'
        setGameStatus('play');
        return
    }
    if(code>64 && code<81) {
        i = comToItem[code]
        if(i < player.inventory.length) {
            setGameStatus('play');
            _itemType = player.inventory[i].itemType
            _type = itemType[_itemType]
            if(_type.type!='weapon' && _type.type!='armor' && _type.type!='shield' && _type.type!='spellbook') {
              player.inventory[i].stock--
              if(player.inventory[i].stock==0) player.deleteFromInv(i);
            }

            if(_type.type=='weapon') {
              if(i==player.weapon) {
                player.unwield('weapon')
                logMsg("You hand the " + getItemName(_itemType));
              } else {
                player.wield('weapon', i)
                logMsg("You wield the " + getItemName(_itemType));
              }
            } else if(_type.type=='armor') {
              if(i==player.eArmor) {
                player.unwield('eArmor')
                logMsg("You take off the " + getItemName(_itemType));
              } else {
                player.wield('eArmor', i)
                logMsg("You wear the " + getItemName(_itemType));
              }
            } else if(_type.type=='shield') {
              if(i==player.eShield) {
                player.unwield('eShield')
                logMsg("You hide the " + getItemName(_itemType));
              } else {
                player.wield('eShield', i)
                logMsg("You wield the " + getItemName(_itemType));
              }
            }

            updateStats()
            popup = document.getElementById("equip-menu")
            popup.style.visibility = 'hidden'
            turnPlayed = true;
        }
    }
}

function keypressUse (code) {
    if(code==27 || code==88) {
        popup = document.getElementById("use-menu")
        popup.style.visibility = 'hidden'
        setGameStatus('play');
        return
    }
    if(code>64 && code<81) {
        let i = comToItem[code]
        if(i < player.inventory.length) {
            setGameStatus('play');
            _itemType = player.inventory[i].itemType
            _type = itemType[_itemType]
            if(_type.type!='weapon' && _type.type!='shield' && _type.type!='armor' && _type.type!='spellbook') {
              player.inventory[i].stock--
              if(player.inventory[i].stock==0) player.deleteFromInv(i);
            }

            if(_type.type=='potion') {
              _idf = player.identify('items',_itemType)
              logMsg("You drink the " + getItemName(_itemType), _idf);
              if(_type.effect_time>0) {
                player.addStatus(_type.effect, _type.effect_time)
                player.addEffect(_type.effect)
              }
              player.spellEffect(_type.effect, _type)
            } else if(_type.type=='scroll'){
              _idf = player.identify('items',_itemType)
              logMsg("You read the " + getItemName(_itemType), _idf);
              if(_type.effect_time>0 && _type.target=='self') {
                player.addStatus(_type.effect, _type.effect_time)
                player.addEffect(_type.effect)
              }
              player.spellEffect(_type.effect, _type)
            } else if(_type.type=='spellbook') {
              if(player.intelligence<1
                  && Math.floor(Math.random()*(3-player.intelligence))<1) {
                logMsg("You fail to spell the " + getItemName(_itemType), true);
              } else {
                logMsg("You spell the " + getItemName(_itemType));
                if(_type.effect_time>0 && _type.target=='self') {
                  player.addStatus(_type.effect, _type.effect_time)
                  player.addEffect(_type.effect)
                }
                player.spellEffect(_type.effect, _type)
              }
              player.inventory[i].hp--
              if(player.inventory[i].hp==0) player.inventory[i].stock--
              if(player.inventory[i].stock==0) player.deleteFromInv(i);
            } else if(_type.type=='light') {
              logMsg("You light the " + getItemName(_itemType));
              if(_type.effect_time>0) player.addStatus(_type.effect, _type.effect_time)
            } else {
              logMsg("You use the " + getItemName(_itemType));
              player.addEffect(_type.effect)
            }


            updateStats()
            popup = document.getElementById("use-menu")
            popup.style.visibility = 'hidden'
            turnPlayed = true;
        }
    }
}

function keypressThrow (code) {
  if(code==27 || code==88) {
      popup = document.getElementById("throw-menu")
      popup.style.visibility = 'hidden'
      setGameStatus('play');
      return
  }
  if(code>64 && code<81) {
      let i = comToItem[code]
      if(i < player.inventory.length) {
        setGameStatus('play');
        _itemType = player.inventory[i].itemType
        _type = itemType[_itemType]
        if(_type.type!='weapon' && _type.type!='shield' && _type.type!='armor' && _type.type!='spellbook') {
          player.inventory[i].stock--
          if(player.inventory[i].stock==0) player.deleteFromInv(i);
        }

        if(_type.type!='weapon' && _type.type!='missile') {
          alert('you  shouldnt be able to choose that')
        }
        //_idf = player.identify('items',_itemType)
        //logMsg("You throw the " + getItemName(_itemType), _idf);
        setGameStatus('select-target')
        document.body.style.cursor = 'crosshair'
        targetx=player.x
        targety=player.y
        renderMap()
        logMsg('Select a target to fire');
        selectMissile = i
        selectTarget.action = function() {
          player.throwItem(targetx, targety, selectMissile)
        }

        popup = document.getElementById("throw-menu")
        popup.style.visibility = 'hidden'
        turnPlayed = true;
      }
  }
}

function keypressTarget (code) {
  if(gameStatus != 'select-target' && gameStatus != 'target') return;

  if (code == '38' || code == '87') { // up arrow
    moveTarget(0, -1);
  }
  else if (code == '40' || code == '83') { // down arrow
    moveTarget(0, 1);
  }
  else if (code == '37' || code == '65') { // left arrow
    moveTarget(-1, 0);
  }
  else if (code == '39' || code == '68') { // right arrow
    moveTarget(1, 0);
  }
  else if (code == '84' || code == '27') { // t
    targetx=null
    targety=null
    renderMap();
    setGameStatus('play');
  } else if (code == '32' || code == '13') { // space
    if(typeof selectTarget.action != 'undefined') {
      if(selectTarget.action()!==true) {
        delete selectTarget.action;
      }
    } else {
      targetx=null
      targety=null
      renderMap();
      setGameStatus('play');
    }
  } else return;

  revealTile(targetx,targety);

  renderMap();
}

function revealTile(x,y) {
  if(obj = getObject(x,y)) {
    if(typeof obj.detected=='undefined') {
      if(typeof objectType[obj.type].reveal_to!='undefined'
      || typeof objectType[obj.type].hidden!='undefined') {
        obj.detected=true
        obj.type = findObjectType(objectType[obj.type].reveal_to, obj.type);
        logMsg("You find a "+objectType[obj.type].name);
      }
    }
  }
}

var selectDirection = null
function keypressDirection (code) {
  if(gameStatus != 'select-direction') return;

  else if (code == '27') { // esc
    targetx=null
    targety=null
    setGameStatus('play');
    renderMap();
    return
  }
  else if (code == '38' || code == '87') { // up arrow
    selectDirection=0;
  }
  else if (code == '40' || code == '83') { // down arrow
    selectDirection=2;
  }
  else if (code == '37' || code == '65') { // left arrow
    selectDirection=3;
  }
  else if (code == '39' || code == '68') { // right arrow
    selectDirection=1;
  } else return;

  if(typeof selectTarget.action != 'undefined') {
    if(selectTarget.action()) {
      delete selectTarget.action;
      gameStatus='play'
    } else {
      return
    }
  }

  renderMap()
}

function drawSelectRect() {
  if(typeof targetx=='undefined' || targetx==null) return;
  x=targetx
  y=targety
  if(!inMap(x,y)) return;
  context.beginPath();
  context.lineWidth = "1";
  context.strokeStyle = "#ffffaa";
  if(gameStatus=='target') {
    context.strokeStyle = "#aaffaa";
    x = getTargetName(x,y)+' [select]'
    document.getElementById("msgBox").innerHTML = x//'<span>'+x+'</span>';
  }
  x = targetx-player.x+renderWidth
  y = targety-player.y+renderHeight
  context.rect(x*32, y*32, 32, 32);
  context.stroke();
}

function getTargetName(x,y) {
  mi = getMonster(x,y)
  if(obj = getObject(x,y)) {
    x = objectType[obj.type].name
  } else if(mi >-1) {
    x = monsterType[monsters[mi].type].name;
  } else 
  switch(map[x][y]) {
    case '.': x='Path';break;
    case '#': x='Wall';break;
    case ' ': x='Void';break;
    case 'l': x='Lava';break;
    case '=': x='Water';break;
    case ';': x='Ant sand';break;
  }
  return x
}

function getTargetDesriptions(x,y) {
  desc = []
  mi = getMonster(x,y)
  if(mi >-1) {
    d=[]
    monster = monsterType[monsters[mi].type]
    if(monsters[mi].hasAttr('size',1)) d.push("is small")
    if(monsters[mi].hasAttr('flying')) d.push("is flying")
    if(monsters[mi].hasAttr('resist','fire')) d.push("resists fire")
    if(monsters[mi].hasAttr('resist','shock')) d.push("resists shock")
    if(monsters[mi].hasAttr('specialAttack', 'poison')) d.push("is venomus")
    if(monsters[mi].hasAttr('specialAttack', 'bleeding')) d.push("with sharp teeth")
    if(monsters[mi].hasAttr('specialAttack', 'curse')) d.push("brings bad luck")
    if(d.length>0) {
      d='It '+d.join();
    } else d='';
    if(typeof monster.description!='undefined') d=monster.description+'<br>'+d
    desc.push({
      name: monster.name,
      sprite: monster.sprite,
      description: d
    })
  }
  if(obj = getObject(x,y)) {
    object = objectType[obj.type]
    desc.push({
      name: object.name,
      sprite: object.sprite,
      description: object.description
    })
  }
  name=null
  switch(map[x][y]) {
    case '.': name='Path';d='A solid ground wheere you can move';break;
    case '#': name='Wall';d='A wall build with rocks, its unbreakable.';break;
    case ' ': name='Void';d='The darkness of the dungeon does not let you see the of bottom of these big holes';break;
    case 'l': name='Lava';d='The magma of heavy materials. You can walk on it but it burns your feet';break;
    case '=': name='Water';d='You can swim on water but very slow';break;
    case ';': name='Ant sand';d='Ants have brought this sand from very log distances. It emits its own light';break;
  }
  if(name!=null) desc.push({
    name: name, description: d
  })

  return desc
}

function moveTarget(dx, dy) {
  x = targetx+dx;
  y = targety+dy;
  if(!inMap(x,y)) return;
  if(mapRev[x][y]<2) return;
  targetx+=dx;
  targety+=dy;
}

function keypressAction (code) {
  if(code==27 || code==88 || code=='Escape') {
    popup = document.getElementById("action-menu")
    popup.style.visibility = 'hidden'
    setGameStatus('play')
    return
  }
  if(code=='h'||code=='j'||code=='k'||code=='l'||code=='t'||code=='r'||code=='Z'||code=='V') {
    closeActionMenu();
    keypressPlay (code)
  }
}

function keypressPlay (code) {
  if(player.hp<0) return;
  if(gameStatus != 'play' && gameStatus != 'action-menu') return;
  if(typeof playerWalk!='undefined') clearInterval(playerWalk);
  targetx=null;
  targety=null;

    if (code == 'ArrowUp' || code == '38' || code == '87' || code == 'w') { // up arrow
        player.move(0,-1);
    }
    else if (code == 'ArrowDown' || code == '40' || code == '83' || code == 's') { // down arrow
        player.move(0,1);
    }
    else if (code == 'ArrowLeft' || code == '37' || code == '65' || code == 'a') { // left arrow
       player.move(-1,0);
    }
    else if (code == 'ArrowRight' || code == '39' || code == '68' || code == 'd') { // right arrow
       player.move(1,0);
    }
    else if (code == '82' || code=='Z' || code=='r') { // rest
      closeActionMenu();
      setGameStatus('rest')
      let turns_rested=0
      if(player.turnsToRest<50) {
        logMsg('You dont feel tired');
        setGameStatus('play');
        renderMap();
        return;
      }
      if(player.turnsToRest>2400) player.turnsToRest = 2400
      do {
          runTurn();
          player.turnsToRest-=50 //rest 5 times faster
          turns_rested++
      } while (player.turnsToRest>0 && gameStatus == "rest") // || new message
      setGameStatus('play');
      if(player.turnsToRest<1) logMsg('You are rested and ready to continue')
      x = Math.floor(turns_rested/6)
      player.addHP(x)
      renderMap();
    }
    else if (code=='z') { // z
      player.move(0,0);
    }
    else if (code==74 || code == 'j') { // j
      closeActionMenu();
      setGameStatus('select-direction');
      if(targetx==null) {
        targetx=player.x
        targety=player.y
      }
      logMsg('Select a direction to jump');
      selectTarget.action = player.jump;
      renderMap()
    }
    else if (code == 'V') { // V
      closeActionMenu();
      setGameStatus('select-direction');
      selectDirection = null
      if(targetx==null) {
        targetx=player.x
        targety=player.y
      }
      logMsg('Select a direction');
      selectTarget.action = function() {
        dir = [[0,-1],[1,0],[0,1],[-1,0]]
        dx = dir[selectDirection][0]
        dy = dir[selectDirection][1]
        if(blockedPos(player.x+dx,player.y+dy)) {
          logMsg('Cannot see from there')
          return false
        }
        runTurn()
        player.view(player.x+dx, player.y+dy)
        renderMap(false)
        setTimeout(function(){
          setGameStatus('play')
        }, 100)
        delete selectTarget.action
        return false;
      }
      renderMap()
    }
    else if (code == '75' || code=='k') { // k
      closeActionMenu();
      setGameStatus("select-direction")
      if(targetx==null) {
        targetx=player.x
        targety=player.y
      }
      logMsg('Select a direction to kick');
      selectTarget.action = player.kick;
      renderMap()
    }
    else if (code == '76' || code=='l') { // l
      closeActionMenu();
      setGameStatus('target');
      if(targetx==null) {
        targetx=player.x
        targety=player.y
      }
      selectTarget.action = function(){
        desc = getTargetDesriptions(targetx, targety)
        popup = document.getElementById("description-menu")
        list = document.getElementById("description-menu--list")
        list.innerHTML = ""
        for(i in desc) {
          if(typeof desc[i].description!='undefined') {
            description = '<br>'+desc[i].description
          } else description = ''
          list.innerHTML += '<p>'+desc[i].name+description+'</p>'
        }
        popup.style.visibility = "visible"
        setGameStatus('description-menu');
        return true
      }
      logMsg('Select target');
      renderMap()
    }
    else if (code == 'f' || code == '70') { // f
      throwArrow();
    }
    else if (code == ' ' || code == '32') { // space
       player.moveLevel();
    }
    else if (code == '85' || code=='u') { // u
      // i 73
      popup = document.getElementById("use-menu")
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
        list.innerHTML += '<div class="menu-item" onclick="keypressUse('+(com)+')">&#'+(com+32)+'; <div class="item-img" style="background: url(\''+src+'\') -'+sx+' -'+sy+';"></div> <span class="item-name">'+getItemName(_itemType)+hp+_nx+'</span></div>'
        com++
      }
      popup.style.visibility = "visible"
      setGameStatus('use-menu')
    }
    else if (code == '84' || code=='t') { // t
      closeActionMenu();
      popup = document.getElementById("throw-menu")
      list = document.getElementById("throw-menu--list")
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
        if(_type.type!='weapon' && _type.type!='missile') continue;
        comToItem[com] = i

        if(typeof _type.hp!='undefined') {
          hp=' '+player.inventory[i].hp+'/'+_type.hp
        } else hp=''
        _nx = ''
        if(typeof player.inventory[i].stock!='undefined') {
          if(player.inventory[i].stock>1) _nx = ' x'+player.inventory[i].stock
        }
        if(_nx!='' && hp!='') console.error(getItemName(_itemType)+' uses hp and stock')

        if(player.weapon==i || player.eArmor==i || player.eShield==i) itemClass=' green'; else itemClass='';
        if(typeof _type.hp!='undefined') {
          hp=' '+player.inventory[i].hp+'/'+_type.hp+''
        } else hp=''
        _enc = null
        if(typeof player.inventory[i].enchantment!='undefined') _enc = player.inventory[i].enchantment
        list.innerHTML += '<div class="menu-item" onclick="keypressThrow('+(com)+')">&#'+(com+32)+'; <div class="item-img" style="background: url(\''+src+'\') -'+sx+' -'+sy+';"></div> <span class="item-name'+itemClass+'">'+getItemName(_itemType)+hp+_nx+'</span></div>'
        com++
      }
      popup.style.visibility = "visible"
      setGameStatus('throw-menu')
    }
    else if (code == '72' || code == 'h') { // h
      closeActionMenu();
      logMsg('You are searching around.')
      for(x=player.x-4; x<player.x+5; x++) {
        for(y=player.y-4; y<player.y+5; y++) {
          if(inMap(x,y) && mapRev[x][y]>1) {
            found = revealTile(x,y)
          }
        }
      }
      renderMap()
      runTurn()
    }
    else if (code == '69' || code=='e') { // e
      popup = document.getElementById("equip-menu")
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
        list.innerHTML += '<div class="menu-item" onclick="keypressEquip('+(com)+')">&#'+(com+32)+'; <div class="item-img" style="background: url(\''+src+'\') -'+sx+' -'+sy+';"></div> <span class="item-name'+itemClass+'">'+getItemFullName(player.inventory[i], _enc)+hp+'</span></div>'
        com++;
      }
      popup.style.visibility = "visible"
      setGameStatus('equip-menu')
    }
    else if (code == '220' || code=='\\') { // \
      popup = document.getElementById("action-menu")
      popup.style.visibility = "visible"
      setGameStatus('action-menu')
    }
    else if (code == '76' || code=='L') { // \
      popup = document.getElementById("game-menu")
      list = document.getElementById("game-menu--list")
      sounds = []
      for (i=0; i<monsters.length; i++) if(monsters[i].hp>0){
        x = monsters[i].x
        y = monsters[i].y
        msound = monsters[i].getAttr('sounds')
        if(msound!==null) sounds.push(msound[0])
      }
    
      if(sounds.length==0) {
        list.innerHTML = "This level is too quiet"
      } else {
        list.innerHTML = "You listen to " + sounds.join()
      }
      popup.style.visibility = "visible"
      setGameStatus('game-menu')
    }
    else if (code == '191' || code == '?') { // ? help
      popup = document.getElementById("help-menu")
      popup.style.visibility = "visible"
      setGameStatus('help-menu')
    }

}

selectTarget = [];

function createSellMenu(){
  closeActionMenu();
  document.getElementById("game-menu--title").innerHTML = 'Sell'
  popup = document.getElementById("game-menu")
  list = document.getElementById("game-menu--list")
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
    comToItem[com] = i

    if(typeof _type.hp!='undefined') {
      hp=' '+player.inventory[i].hp+'/'+_type.hp
    } else hp=''
    _nx = ''
    if(typeof player.inventory[i].stock!='undefined') {
      if(player.inventory[i].stock>1) _nx = ' x'+player.inventory[i].stock
    }
    if(_nx!='' && hp!='') console.error(getItemName(_itemType)+' uses hp and stock')

    if(player.weapon==i || player.eArmor==i || player.eShield==i) itemClass=' green'; else itemClass='';
    if(typeof _type.hp!='undefined') {
      hp=' '+player.inventory[i].hp+'/'+_type.hp+''
    } else hp=''
    _enc = null
    if(typeof player.inventory[i].enchantment!='undefined') _enc = player.inventory[i].enchantment
    list.innerHTML += '<div class="menu-item" onclick="keypressSell('+(com)+')">&#'+(com+32)+'; <div class="item-img" style="background: url(\''+src+'\') -'+sx+' -'+sy+';"></div> <span class="item-name'+itemClass+'">'+getItemName(_itemType)+hp+_nx
    list.innerHTML += '<br>$$</span></div>'
    com++
  }
  popup.style.visibility = "visible"
  setGameStatus('sell-menu')
}

function mousemoveOnMap(e, canva) {
  if(player.hp<0) return
  if(gameStatus != 'play' && gameStatus != 'select-target' && gameStatus != 'target') return
  x = e.clientX - canva.offsetLeft; 
  y = e.clientY - canva.offsetTop;
  targetx_ = player.x+Math.round(x/32);
  targety_ = player.y+Math.round(y/32);
  if(!inMap(targetx_,targety_)) return;
  if(mapRev[targetx_][targety_]<2) return
  if(typeof targetx=='undefined' || targetx_!=targetx || targety_!=targety) {
    targetx = targetx_;
    targety = targety_;
    renderMap();
  }
}

function clickOnMap(e, canva) {
  if(player.hp<0) return
  if(gameStatus != 'play' && gameStatus != 'select-target') return
  x = e.clientX - canva.offsetLeft; 
  y = e.clientY - canva.offsetTop;
  targetx = player.x+Math.round(x/32);
  targety = player.y+Math.round(y/32);
  if(mapRev[targetx][targety]<2) return
  if(typeof playerWalk!='undefined') clearInterval(playerWalk)

  if(gameStatus == 'play') {
    startPlayerWalk();
  } else {
    if(typeof selectTarget.action != 'undefined') {
      if(selectTarget.action()!==true) {
        delete selectTarget.action;
      }
    } else {
      setGameStatus('play');
    }
  }
}

function startPlayerWalk() {
  setGameStatus('wait')
  playerWalk = setInterval(function() {
    if(gameStatus != 'wait') {
      clearInterval(playerWalk)
      return;
    }
    _x = player.x
    _y = player.y
    dx=spaceship(targetx, player.x)
    dy=spaceship(targety, player.y)
    if(Math.abs(dy)>Math.abs(dx)) {
        if(dy==0 || player.move(0,dy)==false) {
          if(gameStatus == 'wait') if(player.move(dx,0)==false) {
            setGameStatus('play')
            clearInterval(playerWalk)
          }
        }
    } else {
        if(dx==0 || player.move(dx,0)==false) {
          if(gameStatus == 'wait') if(player.move(0,dy)==false) {
            setGameStatus('play')
            clearInterval(playerWalk)
          }
        }
    }
    if(player.x==_x && player.y==_y) {
      setGameStatus('play')
      clearInterval(playerWalk)
    }
    runTurn();
    renderMap();
    if(visibleMonsters().length>0 || (player.x==targetx && player.y==targety)) {
      setGameStatus('play')
      clearInterval(playerWalk)
    }
  },50)
}

function visibleMonsters() {
  let vm
  let i = 0
  vm = Array()
  for (i=0; i<monsters.length; i++) if(monsters[i].hp>0){
    x = monsters[i].x
    y = monsters[i].y
    if(mapRev[x][y]>1 || monsters[i].hasStatus('tracked')) vm.push(i);
  }
  return vm
}

function runTurn() {
  do{
    for(let i=0;i<monsters.length;i++) if(monsters[i].hp>0) {
      monsters[i].turnTime += 10
      monsters[i].turn()
      if(monsters[i].turnTime > 99) {
        monsters[i].turnTime -= 100
        monsters[i].monsterPlay()
      }
    }
    player.turnTime += 10+player.speed
    player.turn()
    levelTurns++
  }while(player.turnTime < 100)
  player.turnTime -= 100
}


setInterval(function() {
  if(gameStatus=='play') {
    updateIlluminateMap();
    if(timeBit == 0) timeBit = 1; else timeBit = 0;
    renderMap();
  } else if(gameStatus=='game-over') {
    window.location.href = gameOverLocation;
  }
}, 500);

activeGame = true;

setInterval(function() {
  if(activeGame==true) {
    autoSave()
  }
}, 5000);


function moveAnimation(dx,dy) {
  if(dx==0 && dy==1) player.spritey=0
  if(dx==0 && dy==-1) player.spritey=3
  if(dx==-1 && dy==0) player.spritey=1
  if(dx==1 && dy==0) player.spritey=2
  setGameStatus('wait')
  player.spritex=1
  player.x +=dx*0.25
  player.y +=dy*0.25
  renderMap2()

  setTimeout(function(){
      player.spritex=2
      player.x +=dx*0.25
      player.y +=dy*0.25
      renderMap2()
  },40)
  setTimeout(function(){
      player.spritex=3
      player.x +=dx*0.25
      player.y +=dy*0.25
      renderMap2()
  },80)
  setTimeout(function(){
      player.spritex=0
      player.x +=dx*0.25
      player.y +=dy*0.25
      gameStatus='play'
      runTurn();
      renderMap2()
  },120)
}

function randomPos() {
  do{
      x = Math.floor(Math.random()*mapWidth)
      y = Math.floor(Math.random()*mapHeight)
  }while(blockedPos(x,y))
  return {x:x,y:y}
}
function blockedPos(x,y) {
  if(map[x][y]!='.') return true;

  for(let i=0; i<monsters.length; i++) {
      if(x==monsters[i].x && y==monsters[i].y) return true;
  }

  for(let i=0; i<objects.length; i++) {
      if(x==objects[i].x && y==objects[i].y) return true;
  }
  return false;
}

function throwArrow() {
  if(player.arrows>0) {
    player.spellEffect('arrow')
  }
}

function getItemName(_itemType) {
  _type = itemType[_itemType]
  if(typeof _type.lorem!='undefined') if(!player.identified('items',_itemType)) return _type.lorem;
  return _type.name
}

function getItemFullName(_item, enchantment) {
  _itemType = player.inventory[i].itemType
  name = getItemName(_itemType)
  if(typeof enchantment!='undefined') if(player.identified('enchantment',enchantment)) {
    return name+' '+itemEnchantment[enchantment][0];
  }
  if(typeof _item.attack!='undefined') name+=' +'+_item.attack
  if(typeof _item.armor!='undefined') name+=' ['+_item.armor
  return name
}

popValues = Array()

function animatePop(x,y,value,color="yellow") {
  return;
  setGameStatus('animatePop')
  x = (x-player.x+renderWidth)*32+16
  y = (y-player.y+renderHeight)*32
  ctx = context
  ctx.font = "bold 11pt Monospace";
  ctx.textAlign = "center";
  ctx.fillStyle = '#440000';
  ctx.fillText(value, x+1, y+1);
  ctx.fillStyle = color;
  ctx.fillText(value, x, y);
  for(let i=1;i<3;i++) {
    setTimeout(function(){
      ctx.font = "bold 11pt Monospace";
      ctx.fillStyle = '#440000';
      ctx.fillText(value, x+1, y+1);
      ctx.fillStyle = color;
      ctx.fillText(value, x, y);
    }, i*90);
    setTimeout(function(){
      renderMap()
      if(gameStatus=='animatePop') setGameStatus('play')
    }, 270);
  }
}



function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

