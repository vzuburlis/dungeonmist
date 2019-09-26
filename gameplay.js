
function updateIlluminateMap() {
  for (i=0; i< mapHeight; i++) {
    for (j=0; j< mapWidth; j++) {
      lightmap[j][i] = 0;
      if(map[j][i]=='l' || map[j][i]==',') lightmap[j][i] = 1;
    }
  }
  for (i=0; i<groundObjects.length; i++) {
    if(typeof objectType[groundObjects[i].type].illuminate!='undefined') {
      illuminateMap(i+10, groundObjects[i].x, groundObjects[i].y, objectType[groundObjects[i].type].illuminate);
    }
  }
  for (i=0; i<objects.length; i++) {
    if(typeof objectType[objects[i].type].illuminate!='undefined') {
      illuminateMap(i+10, objects[i].x, objects[i].y, objectType[objects[i].type].illuminate);
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
    'l': {'sprite':['pit0',2,0],'sprite2':['pit1',2,0]},
    'g': {'sprite':['pit0',0,0],'sprite2':['pit1',0,0]},
    'b': {'sprite':['pit0',1,0],'sprite2':['pit1',1,0]},
    '=': {'sprite':['pit0',3,0],'sprite2':['pit1',3,0]},
    '-': {'sprite':['pit0',3,1],'sprite2':['pit1',3,1]},
    //'<': {'sprite':['pit0',4,2],'spriteOver':['pit1',3,1]}, //tileImg['ups']
    //'>': {'sprite':['pit0',3,1]}, //tileImg['downs']
    //'N': {'sprite':['pit0',2,2],'spriteOver':['pit1',3,1]} // tileImg['sign']
}

function illuminateMap(n, x, y, d) {
  if(d==0) return;
  if(!inMap(x,y)) return;
  if(n>9 && lightmap[x][y]==n) return;
  lightmap[x][y]=n;
  if(map[x][y]=='#') return;
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
function renderMap() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (i=0; i< mapHeight; i++) {
    for (j=0; j< mapWidth; j++) {
      if (mapRev[j][i]>1) {
        mapRev[j][i] = 1;
      }
    }
  }

  player.view();


  for (i=player.y-renderHeight; i<=player.y+renderHeight; i++) {
    for (j=player.x-renderWidth; j<=player.x+renderWidth; j++) {
        if (inMap(j,i)) if (mapRev[j][i]>0) {
          context.globalAlpha = globalAlphaByMapRev(j,i)

            t = map[j][i]
            if(typeof tiles[t]!='undefined') {
                if(typeof tiles[t].sprite2!='undefined' && timeBit==1) {
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
            context.clearRect((x-player.x+renderWidth)*32, (y-player.y+renderHeight)*32, 32, 32);
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

  context.globalAlpha = 1;
  player.render();
  if (map[player.x][player.y]=='=') drawImageB(player.x,player.y, itemImg['pit0'], 3, 0);
  if (map[player.x][player.y]=='-') drawImageB(player.x,player.y, itemImg['pit0'], 3, 1);
  drawLifebar(player.x,player.y,player.hp,player.maxhp);

  for (i of visibleMonsterIds) {
    drawStatus(monsters[i]);
  }

  drawStatus(player);

  //if(gameStatus=='select-target') {
    drawSelectRect();
  //}
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
      if(typeof statusImg[unit.status[i].effect]!='undefined') {
        context.drawImage(
           statusImg[unit.status[i].effect],
           0, 0,
           32, 32,
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

function logMsg(msg, block=false) {
  if(block) {
    msg = '<span style="color:yellow">'+msg+'</span>';
  } else msg += '<br>';
  if(gameStatus=='rest') gameStatus='play';
  logMessages.push([player.gameTurn, msg, block])
  document.getElementById("msgBox").innerHTML += msg;
}

function setGameStatus(v) {
    gameStatus=v;
    btnCancel.style.display = 'none'
    btnCancelD.style.display = 'none'
    btnCheck.style.display = 'none'
    useMenu=document.getElementById("use-menu")
    equipMenu=document.getElementById("equip-menu")
    actionMenu=document.getElementById("action-menu")
    useMenu.style.display = 'inline-block'
    equipMenu.style.display = 'inline-block'
    actionMenu.style.display = 'inline-block'
    if(v=='target' || v=='select-target') {
        btnCancel.style.display = 'inline-block'
        btnCheck.style.display = 'inline-block'
        useMenu.style.display = 'none'
        equipMenu.style.display = 'none'
        actionMenu.style.display = 'none'
    }
    if(v=='select-direction') {
        btnCancelD.style.display = 'inline-block'
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
    keyPress(e.keyCode);
}

function keyPress (code) {
  value = gameStatus;
  activeGame = true;
  if (value == 'play') keypressPlay(code);
  if (value == 'target') keypressTarget(code);
  if (value == 'use-menu') keypressUse(code);
  if (value == 'equip-menu') keypressEquip(code);
  //if (value == 'action-menu') keypressAction(code);
  if (value == 'select-target') keypressTarget(code);
  if (value == 'select-direction') keypressDirection(code);
  if (value == 'pause' && code == '32') {
    setGameStatus('play');
    document.getElementById("msgBox").innerHTML='';
  }

  if(turnPlayed == true) {
    runTurn();
    renderMap();
  }
}

function closeActionMenu() {
  popup = document.getElementById("action-menu")
  popup.style.visibility = 'hidden'
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
            if(_type.type!='weapon' && _type.type!='armor' && _type.type!='spellbook') {
              player.inventory[i].stock--
              if(player.inventory[i].stock==0) player.deleteFromInv(i);
            }

            if(_type.type=='weapon') {
              if(i==player.weapon) {
                player.removeWeapon()
                logMsg("You hand the " + getItemName(_itemType));
              } else {
                player.wieldWeapon(i)
                logMsg("You wield the " + getItemName(_itemType));
              }
            } else if(_type.type=='armor') {
              if(i==player.eArmor) {
                player.removeArmor()
                logMsg("You take off the " + getItemName(_itemType));
              } else {
                player.equipArmor(i)
                logMsg("You wear the " + getItemName(_itemType));
              }
            }
            // else {
            //  logMsg("You use the " + getItemName(_itemType));
            //  player.addEffect(_type.effect)
            //}

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
        i = comToItem[code]
        if(i < player.inventory.length) {
            setGameStatus('play');
            _itemType = player.inventory[i].itemType
            _type = itemType[_itemType]
            if(_type.type!='weapon' && _type.type!='armor' && _type.type!='spellbook') {
              player.inventory[i].stock--
              if(player.inventory[i].stock==0) player.deleteFromInv(i);
            }

            if(_type.sprite[0]=='potion') {
              player.identify('items',_itemType)
              logMsg("You drink the " + getItemName(_itemType));
              if(_type.effect_time>0) player.addStatus(_type.effect, _type.effect_time)
              player.addEffect(_type.effect)
            } else if(_type.sprite[0]=='book') {
              logMsg("You spell the " + getItemName(_itemType));
              if(_type.effect_time>0 && _type.target=='self') {
                player.addStatus(_type.effect, _type.effect_time)
                player.addEffect(_type.effect)
              }
              player.spellEffect(_type.effect, _type)
              player.inventory[i].hp--
              if(player.inventory[i].hp==0) player.inventory[i].stock--
              if(player.inventory[i].stock==0) player.deleteFromInv(i);
            } else if(_type.sprite[0]=='light') {
              logMsg("You light the " + getItemName(_itemType));
              if(_type.effect_time>0) player.addStatus(_type.effect, _type.effect_time)
              player.addEffect(_type.effect)
            } else if(_type.sprite[0]=='scroll'){
              player.identify('items',_itemType)
              logMsg("You read the " + getItemName(_itemType));
              if(_type.effect_time>0 && _type.target=='self') {
                player.addStatus(_type.effect, _type.effect_time)
                player.addEffect(_type.effect)
              }
              player.spellEffect(_type.effect, _type)
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
      selectTarget.action();
      delete selectTarget.action;
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
      obj.detected=true
      if(typeof objectType[obj.type].reveal_to!='undefined') {
        obj.type = findObjectType(objectType[obj.type].reveal_to, obj.type);
      }
      logMsg("You find a "+objectType[obj.type].name);
    }
  }
}

var selectDirection = null
function keypressDirection (code) {
  if(gameStatus != 'select-direction') return;

  else if (code == '27') { // esc
    targetx=null
    targety=null
    renderMap();
    setGameStatus('play');
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
    mi = getMonster(x,y)
    if(obj = getObject(x,y)) {
      x = objectType[obj.type].name
    } else if(mi >-1) {
      x = monsterType[monsters[mi].type].name;
    } else 
    switch(map[x][y]) {
      case '.': x='path';break;
      case '#': x='Wall';break;
      case ' ': x='Wall';break;
      case 'l': x='Lava';break;
      case '=': x='Water';break;
      case ';': x='Ant sand';break;
    }
    document.getElementById("msgBox").innerHTML = x;
  }
  x = targetx-player.x+renderWidth
  y = targety-player.y+renderHeight
  context.rect(x*32, y*32, 32, 32);
  context.stroke();
}

function moveTarget(dx, dy) {
  x = targetx+dx;
  y = targety+dy;
  if(!inMap(x,y)) return;
  if(mapRev[x][y]<2) return;
  targetx+=dx;
  targety+=dy;
}

function keypressPlay (code) {
    if(player.hp<0) return;
    if(gameStatus != 'play') return;
    if(typeof playerWalk!='undefined') clearInterval(playerWalk);
    targetx=null;
    targety=null;


    if (code == '38' || code == '87') { // up arrow
        player.move(0,-1);
    }
    else if (code == '40' || code == '83') { // down arrow
        player.move(0,1);
    }
    else if (code == '37' || code == '65') { // left arrow
       player.move(-1,0);
    }
    else if (code == '39' || code == '68') { // right arrow
       player.move(1,0);
    }
    else if (code == '90') { // z
      player.move(0,0);
    }
    else if (code == '82') { // r
      closeActionMenu();
      setGameStatus('rest')
      let turns_rested=0
      if(player.turnsToRest>1600) player.turnsToRest = 1600
      do {
          runTurn();
          player.turnsToRest-=50 //rest 5 times faster
          turns_rested++
      } while (player.turnsToRest>0 && gameStatus == "rest") // || new message
      setGameStatus('play');
      if(player.turnsToRest<1) logMsg('You are rested and ready to go on')
      x = Math.floor(turns_rested/3)
      player.addHP(x)
      renderMap();
    }
    else if (code == '74') { // j
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
    else if (code == '75') { // k
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
    else if (code == '84') { // t
      closeActionMenu();
      setGameStatus('target');
      if(targetx==null) {
        targetx=player.x
        targety=player.y
      }
      logMsg('Select target');
      renderMap()
    }
    else if (code == '70') { // f
      throwArrow();
    }
    else if (code == '32') { // space
       player.moveLevel();
    }
    else if (code == '85') { // u
      // i 73
      popup = document.getElementById("use-menu")
      list = document.getElementById("use-menu--list")
      list.innerHTML = ""
      com = 65
      comToItem = []
      for(i=0; i<player.inventory.length; i++) {
        _itemType = player.inventory[i].itemType
        _type = itemType[_itemType]
        src = itemImg[_type.sprite[0]].src
        sx = _type.sprite[1]*16+'px'
        sy = _type.sprite[2]*16+'px'
        if(_type.type=='weapon' || _type.type=='armor') continue;
        comToItem[com] = i

        if(typeof _type.hp!='undefined') {
          console.log(player.inventory[i].hp)
          hp=' '+player.inventory[i].hp+'/'+_type.hp
        } else hp=''
        list.innerHTML += '<div class="menu-item" onclick="keypressUse('+(com)+')">&#'+(com+32)+'; <div class="item-img" style="background: url(\''+src+'\') -'+sx+' -'+sy+';"></div> <span class="item-name">'+getItemName(_itemType)+hp+'</span></div>'
        com++
      }
      popup.style.visibility = "visible"
      setGameStatus('use-menu')
    }
    else if (code == '72') { // h
      logMsg('You are searching around.')
      for(x=player.x-4; x<player.y+5; x++) {
        for(y=player.y-4; y<player.y+5; y++) {
          if(inMap(x,y) && mapRev[x][y]>1) {
            found = revealTile(x,y)
          }
        }
      }
      renderMap()
      runTurn()
    }
    else if (code == '69') { // e
      popup = document.getElementById("equip-menu")
      list = document.getElementById("equip-menu--list")
      list.innerHTML = ""
      com = 65;
      comToItem = [];
      for(i=0; i<player.inventory.length; i++) {
        _itemType = player.inventory[i].itemType
        _type = itemType[_itemType]
        src = itemImg[_type.sprite[0]].src
        sx = _type.sprite[1]*16+'px'
        sy = _type.sprite[2]*16+'px'
        if(_type.type!='weapon' && _type.type!='armor') continue;
        comToItem[com] = i

        if(player.weapon==i || player.eArmor==i) itemClass=' green'; else itemClass='';
        if(typeof _type.hp!='undefined') {
          console.log(player.inventory[i].hp)
          hp=' '+player.inventory[i].hp+'/'+_type.hp+''
        } else hp=''
        _enc = null
        if(typeof player.inventory[i].enchantment!='undefined') _enc = player.inventory[i].enchantment
        list.innerHTML += '<div class="menu-item" onclick="keypressEquip('+(com)+')">&#'+(com+32)+'; <div class="item-img" style="background: url(\''+src+'\') -'+sx+' -'+sy+';"></div> <span class="item-name'+itemClass+'">'+getItemFullName(_itemType,_enc)+hp+'</span></div>'
        com++;
      }
      popup.style.visibility = "visible"
      setGameStatus('equip-menu')
    }
    else if (code == '220') { // \
       popup = document.getElementById("action-menu")
       popup.style.visibility = "visible"
    }

}

selectTarget = [];

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
      selectTarget.action();
      delete selectTarget.action;
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

autoSave()
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
  if(map[x][y]!='.' || map[x][y]!=':') return true;
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
    player.arrows--;
    player.spellEffect('arrow')
  }
}

function getItemName(_itemType) {
  _type = itemType[_itemType]
  if(typeof _type.lorem!='undefined') if(!player.identified('items',_itemType)) return _type.lorem;
  return _type.name
}

function getItemFullName(_itemType, enchantment) {
  name = getItemName(_itemType)
  if(typeof enchantment!='undefined') if(player.identified('enchantment',enchantment)) {
    return name+' '+itemEnchantment[enchantment][0];
  }
  return name
}