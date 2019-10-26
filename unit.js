var swingAudio = new Audio('src/dungeonrl/sfx/swing2.wav');
var blastAudio = new Audio('src/dungeonrl/sfx/blast.mp3');
var opendoorAudio = new Audio('src/dungeonrl/sfx/open_door.mp3');
var arrowAudio = new Audio('src/dungeonrl/sfx/arrow.mp3');
var fireballAudio = new Audio('src/dungeonrl/sfx/fireball.mp3');

//var bgAudio = new Audio('src/dungeonrl/loop.mp3');
//bgAudio.loop=true
//bgAudio.volume=0.1
//bgAudio.play()
focused = true
document.addEventListener("visibilitychange", onchange);
//function onchange (evt) {
//  focused = !focused;
//   if (!focused) {
//    bgAudio.pause()
//   } else {
//    bgAudio.play()
//  }
//}

var effectUserStats = {
  "speed": {"speed":5},
  "strength": {"attack":2, "armor":2},
  "bless": {"attack":1, "armor":1},
  "curse": {"attack":-1, "armor":-1},
  "poison": {"speed":-2, "maxhp":-8}
}
var effectUserStatus = {
    "bless": {"curse":0},
    "heal": {"bleeding":0},
    "stop-bleeding": {"bleeding":0},
    "stop-poison": {"poison":0}
}

function unitClass (options) {
    var that = {};

    that.turnsToRest =0;
    that.turnsToHeal =0;
    that.type = options.type;
    that.turnTime = 0;
    that.speed = 0;
    that.spritex = 0;
    that.spritey = 0;
    that.inventory = [];
    that.direction = -1;
    that.weapon = null;
    that.eArmor = null;
    that.eShield = null
    that.los = 7;
    that.audio = [];
    that.status = [];
    that.attack = 0;
    that.armor = 0;

    for(i in options) {
      that[i] = options[i]
    }
    
    that.turn = function () {
      if(that.hasStatus('bleeding')) {
        if(Math.floor(Math.random() * 80) == 0) {
          that.hp--
          objects.push({x:that.x,y:that.y,type:findObjectType('Blood1')});
        }
        if(that.hp<1) {
          logMsg("<span style='color:red'>You die from bleeding</span>");
          document.getElementById('play-btn-container').style.display = "block"
        }
      }
      for(let i=0;i<that.status.length;i++) {
          that.status[i].timeleft -= 10;
          if(that.status[i].timeleft < 0) {
              that.removeEffect(that.status[i].effect)
              that.status.splice(i,1);
          }
      }
      that.turnsToRest++
      that.turnsToHeal++
      if(that.turnsToHeal>300) {
        that.turnsToHeal=1
        that.addHP(1)
        if(that.hasAttr('regenerate')) that.addHP(1)
      }
      that.gameTurn++
    };

    that.render = function () {
       if(that.hasStatus('invisible')) context.globalAlpha = 0.5
       _y = that.sprite[2];
       if(that.direction==-1) {
        _sprite = "player"; _x = that.sprite[1];
       } else {
        _sprite = "playerR"; _x = 7-that.sprite[1];
       }
       if(timeBit == 0) {
         drawSprite(that.x,that.y, itemImg[_sprite+'0'], _x, _y);
       } else {
         drawSprite(that.x,that.y, itemImg[_sprite+'1'], _x, _y);
       }
       context.globalAlpha = 1;
    };

    that.move = function (dx, dy) {
        if(that.hasStatus('confuze')) if(Math.floor(Math.random() * 4)==0) {
            if(dx==0) {
                dy=0;
                if(Math.floor(Math.random() * 2)==0) dx=-1; else dx=1; 
            }
            if(dy==0) {
                dx=0;
                if(Math.floor(Math.random() * 2)==0) dx=-1; else dx=1; 
            }
        }

        if(dx==1 || dx==-1) that.direction = dx;

        document.getElementById("msgBox").innerHTML = "&nbsp;";
        if(logMessages.length>0) {
          lm = logMessages[logMessages.length-1]
          if(that.gameTurn<lm[0]+50 && lm[2]==true) {
            document.getElementById("msgBox").innerHTML = lm[1];
          }
        }

        mapRev[that.x+dx][that.y+dy]=1;

        mi = getMonster(that.x+dx,that.y+dy);
        if(mi > -1) {
          attack_points = 6 + Math.floor(Math.random() * 5) + that.meleeDamage();
            if(attack_points<0) attack_points = 0
            if(typeof monsters[mi].armor!='undefined') {
              attack_points -= monsters[mi].armor
              that.addItemHP(that.weapon, -1-monsters[mi].armor)
            } else that.addItemHP(that.weapon, -1)

            monsters[mi].hp-=attack_points;
            if(monsters[mi].hp<0) monsters[mi].hp==0;
            _logMsg = "You hit the "+monsters[mi].typeName()+' dealing '+attack_points+' damage'
            animatePop(monsters[mi].x, monsters[mi].y,'-'+attack_points, 'red')
            logMsg(_logMsg);
            //animateEffect(that.x+dx, that.y+dy, itemImg['effect0'], 4, 21, 2);

            if(that.weapon!=null) if(typeof that.inventory[that.weapon].enchantment!='undefined') {
              if(Math.floor(Math.random()*4)==0) {
                _i = that.inventory[that.weapon].enchantment
                _en = itemEnchantment[_i]
                if(typeof _en[1]!='undefined') {
                  if(_en[1]=='critical') attack_points = Math.floor(attack_points*1.5)
                  if(_en[1]=='curse') monsters[mi].addStatus("curse", 12)
                  if(_en[1]=='confuze') monsters[mi].addStatus("confuze", 6)
                  if(_en[1]=='draw-life') that.addHP(4)
                  if(_en[1]=='fire') {
                    animateEffect(monsters[mi].x, monsters[mi].y, itemImg['effect0'], 0, 21, 2);
                    attack_points += 4
                    if(monsters[mi].hasAttr('resist','fire')) {
                      logMsg('The '+monsters[mi].typeName()+' resists to fire')
                      attack_points = Math.floor(attack_points/2)
                    }
                    if(monsters[mi].hasAttr('weak','fire')) {
                      logMsg('The '+monsters[mi].typeName()+' is vulnerable to fire')
                      attack_points = Math.floor(attack_points*2)
                    }
                  }
                  if(_en[1]=='shock') {
                    animateEffect(monsters[mi].x, monsters[mi].y, itemImg['effect0'], 6, 21, 2);
                    attack_points += 2
                    monsters[mi].turnTime -= 50;
                    if(monsters[mi].hasAttr('resist','shock')) {
                      logMsg('The '+monsters[mi].typeName()+' resists to shock')
                      attack_points = Math.floor(attack_points/2)
                      monsters[mi].turnTime += 50;
                    }
                    if(monsters[mi].hasAttr('weak','shock')) {
                      logMsg('The '+monsters[mi].typeName()+' is vulnerable to shock')
                      attack_points = Math.floor(attack_points*2)
                    }
                  }
                  if(_en[1]=='holy' && monsters[mi].hasAttr("class", "z")) {
                    animateEffect(monsters[mi].x, monsters[mi].y, itemImg['effect0'], 6, 22, 2);
                    attack_points += 8
                  }

                  if(!player.identified('enchantment',_i)) {
                    if(typeof _en[2]!='undefined') {
                      logMsg(_en[2], true)
                    }
                    player.identify('enchantment',_i)
                  }
                }
              }
            }

            that.removeStatus('invisible')
            swingAudio.play();
            turnPlayed = true;
            return false;
        }

        obj = getObject(that.x+dx,that.y+dy)
        if(obj!=null) {
          objType = objectType[obj.type]
          if(objType.block==true && gameStatus=='wait'
            && (targetx!=that.x+dx || targety!=that.y+dy)) {
            setGameStatus('play')
            targetx=null
            targety=null
            renderMap();
            return false;
          }
          if(typeof objType.open_to!='undefined') {
            opendoorAudio.play()
            logMsg("You open the "+objType.name.toLowerCase());
            obj.type = findObjectType(objType.open_to, obj.type);
            if(typeof obj.hiddenMonster!='undefined' && obj.hiddenMonster!==null) {
              console.log(obj.hiddenMonster)
              _name = monsterType[obj.hiddenMonster].name
              logMsg("A "+_name+" jumps out from the "+objType.name.toLowerCase());
              monsters.push(unitClass({
                "x": that.x+dx, "y": that.y+dy, "type": obj.hiddenMonster,
                "hp": obj.hiddenMonsterMaxHP, "maxhp": obj.hiddenMonsterMaxHP,
                "turnTime": 0, "seen": 1
              }));
              delete obj.hiddenMonster
              renderMap();
              setGameStatus('play');
              return;
            }
            if(typeof obj.open_object!='undefined' && obj.open_object!==null) {
              opendoorAudio.play()
              logMsg("You open the "+objType.name.toLowerCase());
              gateType = objectType[objects[obj.open_object].type]
              if(typeof gateType.switch_to=='undefined') {
                console.error('object does not have switch_to')
              } else {
                objects[obj.open_object].type = findObjectType(gateType.switch_to)
              }
            }
            if(typeof obj.item!='undefined') if(obj.item!==null) {
              logMsg('You find a '+getItemName(obj.item))
              items.push([that.x, that.y, obj.item]);
              that.pickItem(items.length-1)
              obj.item=null;
            }
            setGameStatus('play');
          }
          if(typeof objType.switch_to!='undefined') {
            logMsg("You cannot open the gate. There must be a switch somewhere.");
          }
          if(typeof objType.unlock_to!='undefined') {
            if(mapItems.includes('key')) {
                opendoorAudio.play()
                obj.type = findObjectType(objType.unlock_to, obj.type);
                logMsg("You unlock the door");
            } else {
                logMsg("The door is locked. You need a key");
            }
          }
          if(typeof objType.chest_unlock_to!='undefined') {
            if(mapItems.includes('chest_key')) {
                opendoorAudio.play()
                obj.type = findObjectType(objType.chest_unlock_to, obj.type);
                logMsg("You unlock the chest");
            } else {
                logMsg("The chest is locked. You need a key");
            }
          }
          if(typeof objType.trap!='undefined'
              || typeof obj.trap!='undefined') if(typeof obj.detected=='undefined') {
            obj.detected=true
            if(that.hasAbility('DetectTraps') && Math.floor(Math.random() * 2)==0) {
              if(typeof objType.activate_to!='undefined') {
                logMsg("You detect a "+objType.activate_to, true);
              }
              renderMap();
              return false
            } else {
              if(typeof objType.activate_to!='undefined') {
                swingAudio.play()
                obj.type = findObjectType(objType.activate_to, obj.type);
                logMsg("You step in the "+objType.activate_to);
                _trap = objType.activate_to
                if(that.hp>8) that.addHP(-6,_trap); else that.addHP(-3,_trap);
              } else {
                if(typeof objType.trap!='undefined') {
                  _trap = objType.trap
                } else {
                  _trap = obj.trap
                }
                logMsg("You activate a "+_trap+" trap");
                if(typeof objType.block!='undefined' && objType.block==true) {
                  trapx = that.x; trapy = that.y;
                } else {
                  trapx = that.x+dx; trapy = that.y+dy;
                }
                if(_trap=="fire") {
                  setGameStatus('wait')
                  fireballAudio.play()
                  if(that.hp>8) that.addHP(-6,_trap); else that.addHP(-3,_trap);
                  animateEffect(trapx, trapy, itemImg['effect0'], 0, 21, 2);
                }
              }
            }
          }
          if(typeof objType.reveal_to!='undefined') if(typeof obj.detected=='undefined') {
            obj.detected=true
            obj.type = findObjectType(objType.reveal_to, obj.type);
            logMsg("You find a "+objType.name);
            renderMap();
          }
          if(objType.block==true) {
            if(typeof objType.close_to!='undefined') {
              obj.type = findObjectType(objType.close_to, obj.type);
              opendoorAudio.play()
              logMsg("You close the "+objectType[obj.type].name.toLowerCase());
            }
            setGameStatus('play')
            targetx=null
            targety=null
            renderMap();
            return false;
          }
        }

        iti = getItem(that.x+dx,that.y+dy);
        if(iti>-1) {
          that.pickItem(iti)
        }

        if(map[that.x+dx][that.y+dy]=='#' || map[that.x+dx][that.y+dy]=='C') {
          logMsg("The wall blocks your way");
          return false;
        }
        if(map[that.x+dx][that.y+dy]==' ') {
          logMsg("You dont want to fall in the void");
          return false;
        }
        if(map[that.x+dx][that.y+dy]=='l') {
          logMsg("The lava is burning your feet!");
          if(!that.hasAttr('flying') && !that.hasAttr('resist','fire')) that.addHP(-1, 'lava');
        }
        if(map[that.x+dx][that.y+dy]==':') {
          logMsg("It is very dark in here and hard to see in the distance");
        }
        if(map[that.x+dx][that.y+dy]=='=' || map[that.x+dx][that.y+dy]=='-') if(!that.hasAttr('flying')) {
          that.turnTime -= 50;
        }
        if(map[that.x+dx][that.y+dy]=='-') {
          if(!that.hasAttr('resist','disease')) {
            log_msg = "You cannot bear the smell of these waters"
            log_alert = false;
            if(Math.floor(Math.random() * 40)==0) {
              log_msg = "You vomit in the waters";
              log_alert = true;
              if(that.hp>12) {
                logMsg(log_msg)
                that.addHP(-4, "vomiting");
              } else {
                that.addStatus('confuze',6);
              }
            }
            logMsg(log_msg, log_alert);
          }
        }


        that.x += dx;
        that.y += dy;
        com_down = document.getElementsByClassName('com-down')[0]
        tile_direction = {
          '<': 'upstairs',
          '>': 'downstairs',
          'N': 'north',
          'S': 'south',
          'W': 'west',
          'E': 'east'
        }
        com_down.style.display = 'none'
        for(i in tile_direction) if(map[that.x][that.y]==i) {
            logMsg("Press [space] to go "+tile_direction[i]);
            com_down.style.display = 'block'
        }

        if(!obj) for(i in regions) if(inBox(that.x,that.y,regions[i].box)) {
          if(typeof regions[i].entered=='undefined' || regions[i].entered==0) {
            regions[i].entered=1;
            if(typeof regions[i].description!='undefined') logMsg(regions[i].description, true);
          }
        }

        turnPlayed = true;
        return true
    }


    that.meleeDamage = function () {
      extra = 0
      if(that.weapon!==null) {
        _type = that.inventory[that.weapon].itemType
        if(typeof itemType[_type].attackMod!='undefined') {
          mod = itemType[_type].attackMod
          extra += that[mod]
        }
      }
      return that.attack+extra;
    }
    that.throwDamage = function (i) {
      extra = 0
      _type = that.inventory[i].itemType
      if(typeof itemType[_type].attackMod!='undefined') {
        mod = itemType[_type].attackMod
        extra += that[mod]
      }
      return that.attack+extra;
    }

    that.arrowDamage = function () {
      return 5+Math.floor(Math.random() * 9)
    }

    that.diceAttack = function () {
        wa=0
        if(that.weapon!==null) {
            wa = itemType[that.inventory[that.weapon].type].attack
        }
        return 6 + Math.floor(Math.random() * 5) + that.attack +wa;
    }


    that.addItemHP = function (i, x) {
      if(i!=null) {
        that.inventory[i].hp +=x
        item = that.inventory[i]
        if(itemType[item.itemType].hp < item.hp) {
          that.inventory[i].hp = itemType[item.itemType].hp
        }
        if(0 > item.hp) {
          logMsg("Your "+getItemName(item.itemType)+" breaks!",true)
          that.removeItem(i)
          that.deleteFromInv(i)
        }
      }
      updateStats()
    }

    that.removeItem = function(i) {
      if(i!=null) {
        item = that.inventory[i]
        that.removeEffect(itemType[item.itemType].effect)
        if(that.weapon==i) that.weapon = null
        if(that.eArmor==i) that.eArmor = null
        if(that.eShield==i) that.eShield = null
      }
    }

    that.wield = function(spot, i) {
      that.unwield(spot)
      that[spot] = i
      item = that.inventory[i]
      if(typeof itemType[item.itemType].effect!='undefined') {
        that.addEffect(itemType[item.itemType].effect)
      }
      if(typeof item.armor!='undefined') {
        that.armor += item.armor
      }
      if(typeof item.attack!='undefined') {
        that.attack += item.attack
      }
    }
    that.unwield = function(spot) {
      if(that[spot]!=null) {
        item = that.inventory[that[spot]]
        if(typeof itemType[item.itemType].effect!='undefined') {
          that.removeEffect(itemType[item.itemType].effect)
        }
        if(typeof item.armor!='undefined') {
          that.armor -= item.armor
        }
        if(typeof item.attack!='undefined') {
          that.attack -= item.attack
        }
        that[spot] = null
      }
    }

    that.pickItem = function (iti) {
      let _type = items[iti][2]
      __type = itemType[_type].type
      _name = itemType[_type].name
      _data = {}
      for(i in items[iti]) if(!isNaN(i)) _data[i] = items[iti][i]
      _data.itemType = _type
      _data.stock = 1
      if(typeof items[iti][3]!='undefined') _data.hp = items[iti][3]
      if(typeof items[iti].attack!='undefined') _data.attack = items[iti].attack
      if(typeof items[iti].armor!='undefined') _data.armor = items[iti].armor
      logMsg("You pick up the "+getItemName(_type));
      if(typeof itemType[_type].autopick!='undefined') {
        if(typeof itemType[_type].mapItem!='undefined') {
          mapItems.push(itemType[_type].mapItem)
          updateStats()
        }
        else if(itemType[_type].effect=='+gold') {
          that.gold += itemType[_type].gold
          updateStats()
        }
        else if(itemType[_type].effect[0]=='+') {
          that.addEffect(itemType[_type].effect)
        }
      } else {
        if(__type=='potion'||__type=='scroll'|| typeof itemType[_type].stock!='undefined') {
          for(i in that.inventory) if(that.inventory[i].itemType==_type && that.inventory[i].stock<5) {
            that.inventory[i].stock++
            _data = null
          }
        } else {
          if(gameLevel>4) if(__type=='weapon'||__type=='armor'||__type=='shield') {
            if(Math.floor(Math.random()*8)==0) {
              _data.enchantment = Math.floor(Math.random()*itemEnchantment.length)
            }
          }
        }
        if(_data!==null) {
          that.inventory.push(_data)
        }
      }
      items.splice(iti, 1);
    }

    that.addHP = function (x, cause="", msg="You die") {
      that.hp += x
      if(that.hp > that.maxhp) that.hp = that.maxhp
      if(that.hp<1) {
        logMsg("<span style='color:red'>"+msg+"</span>", true);
        that.deathCause = cause
        permaDeath()
      }
    }

    that.addEffect = function (_effect) {
      if(_effect==null) return
      if(_effect[0]=="+") {
        that[_effect.substring(1)]++
      }
      if(_effect=="heal") {
        that.addHP(20)
      }

      if(typeof effectUserStats[_effect]!='undefined') {
          for(_stat in effectUserStats[_effect]) {
            that[_stat] += effectUserStats[_effect][_stat]
          }
      }
      if(typeof effectUserStatus[_effect]!='undefined') {
          for(_status in effectUserStatus[_effect]) {
            if(effectUserStatus[_effect][_status]==0) that.removeStatus(_status);
          }
      }

      if(_effect=="bless") {
        that.addHP(32)
      }

      if(that.hp>that.maxhp) that.hp=that.maxhp

      updateStats()
    }

    that.removeEffect = function (_effect) {
      if(_effect==null) return
      if(_effect[0]=="+") {
        that[_effect.substring(1)]--
      }
      if(typeof effectUserStats[_effect]!='undefined') {
        for(_stat in effectUserStats[_effect]) {
          that[_stat] -= effectUserStats[_effect][_stat]
        }
      }

      if(_effect=="poison") {
          that.hp+=6
      }
      updateStats()
    }

    that.spellEffect = function (_effect,_type) {
        if(_effect=="map-reveal") {
            revealMap()
        }
        if(_effect=="sucrifice-rnd") {
        	ri = Math.floor(Math.random() * monsters.length);
        	monsters[ri].hp = 0;
        }
        if(_effect=="track-all") {
          for (let i=0; i<monsters.length; i++) if(monsters[i].hp>0) {
              monsters[i].addStatus("tracked", 48)
              monsters[i].seen=1
          }
        }
        if(_effect=="dispell-magic") {
            that.removeStatus('curse')
            that.removeStatus('confuze')
            for (let i=0; i<monsters.length; i++) if(monsters[i].hp>0) {
                x = monsters[i].x
                y = monsters[i].y
                if(mapRev[x][y]>1 && monsterType[monsters[i].type].group=='skeleton') {
                    monsters[i].hp=0
                }
            }
        }
        if(_effect=="curse") {
            for (let i=0; i<monsters.length; i++) if(monsters[i].hp>0) {
                x = monsters[i].x
                y = monsters[i].y
                if(mapRev[x][y]>1) monsters[i].addStatus("curse", 48)
            }
        }
        if(_effect=="confuze") {
            for (let i=0; i<monsters.length; i++) if(monsters[i].hp>0) {
                x = monsters[i].x
                y = monsters[i].y
                if(mapRev[x][y]>1) {
                    monsters[i].addStatus("confuze", 12)
                }
            }
        }
        if(_effect=="burn") {
          setGameStatus('select-direction')
          renderMap()
          logMsg('Select a direction');
          selectTarget.action = function() {
            dir = [[0,-1],[1,0],[0,1],[-1,0]]
            dx = dir[selectDirection][0]
            dy = dir[selectDirection][1]
            //z = Math.floor(Math.random()*4)*2
            //zz = Math.floor(Math.random()*3)
            fireballAudio.play()
            animateEffect(that.x+dx, that.y+dy, itemImg['effect0'], 0, 21, 2);
            mi = getMonster(that.x+dx,that.y+dy);
            if(mi > -1) {
              damage = 7+Math.floor(Math.random()*7)+that.intelligence
              if(monsters[mi].hasAttr('resist','fire')) {
                logMsg('The '+monsters[mi].typeName()+' resists to fire')
                damage -= 6
              }
              if(monsters[mi].hasAttr('weak','fire')) {
                damage += 6
                logMsg('The '+monsters[mi].typeName()+' is vulnerable to fire')
              }
              monsters[mi].hp -= damage
            }
          }
        }
        if(_effect=="shock") {
          setGameStatus('select-direction')
          renderMap()
          logMsg('Select a direction');
          selectTarget.action = function() {
            dir = [[0,-1],[1,0],[0,1],[-1,0]]
            dx = dir[selectDirection][0]
            dy = dir[selectDirection][1]
            fireballAudio.play()
            animateEffect(that.x+dx, that.y+dy, itemImg['effect0'], 6, 21, 2);
            mi = getMonster(that.x+dx,that.y+dy);
            if(mi > -1) {
              damage = 5+Math.floor(Math.random()*(5+that.intelligence))
              if(monsters[mi].hasAttr('resist','shock')) {
                logMsg('The '+monsters[mi].typeName()+' is resists to shock')
                damage -= 5
              }
              if(monsters[mi].hasAttr('weak','shock')) {
                damage += 5
                logMsg('The '+monsters[mi].typeName()+' is vulnerable to shock')
              }
              monsters[mi].hp -= damage
              monsters[mi].turnTime -= 50
            }
          }
        }
        if(_effect=="damage") {
          visibleMonsterIds = visibleMonsters();
          for(mi of visibleMonsterIds) {
            mtype = monsterType[monsters[mi].type]
            if(typeof _type.class!='undefined')
            if(typeof mtype.class=='undefined' || mtype.class!=_type.class) continue;
            monsters[mi].hp -= 5+that.intelligence
          }
          renderMap()
          setGameStatus('play')
        }
        if(_effect=="lightning-strike") {
            lightMonsters = Array()
            for (let i=0; i<monsters.length; i++) if(monsters[i].hp>0) {
                x = monsters[i].x
                y = monsters[i].y
                if(mapRev[x][y]>1) {
                    lightMonsters.push(monsters[i])
                }
            }
            if(lightMonsters.length>0) {
                setGameStatus('wait')
                blastAudio.play()
                for(let i=0;i<10;i++) {
                    setTimeout(function(){
                        renderMap()
                        for(let mi=0;mi<lightMonsters.length;mi++) {
                            let x = lightMonsters[mi].x
                            let y = lightMonsters[mi].y
                            drawThunder(that.x, that.y, x, y)
                        }
                    }, i*100);
                }
                setTimeout(function(){
                    for(let mi=0;mi<lightMonsters.length;mi++) {
                        lightMonsters[mi].hp -= 5+that.intelligence
                    }
                    setGameStatus('play')
                }, 1000);
            }
        }
        if(_effect=="teleport") {
          setGameStatus('select-target')
          document.body.style.cursor = 'crosshair'
          targetx=that.x
          targety=that.y
          //drawSelectRect()
          renderMap()
          logMsg('Select a target to teleport');
          selectTarget.unit = this
          selectTarget.action = function() {
            selectTarget.unit.x = targetx
            selectTarget.unit.y = targety
            document.body.style.cursor = 'default'
            setGameStatus('play')
          }
        }
        if(_effect=="arrow") {
          setGameStatus('select-target')
          document.body.style.cursor = 'crosshair'
          targetx=player.x
          targety=player.y
          renderMap()
          logMsg('Select a target to fire');
          selectTarget.action = function() {
            document.body.style.cursor = 'default'
            setGameStatus('wait')
            arrowAudio.play()
            arrowColor = 0
            arrowColors = ['#ffffff','#f8f8f8','#eeeeee','#cccccc','#999999','#666666']
            dx =targetx-that.x
            dy =targety-that.y
            d = Math.round(Math.sqrt(dx*dx+dy*dy))
            for(let i=0;i<d;i++) {
              setTimeout(function(){
                renderMap()
                arrowColor++
                drawArrow(that.x, that.y, targetx, targety, i/d)
              }, i*60);
            }
            setTimeout(function(){
              monster = null
              for (let i=0; i<monsters.length; i++) if(monsters[i].hp>0) {
                x = monsters[i].x
                y = monsters[i].y
                if(mapRev[x][y]>1 && x==targetx && y==targety) {
                  monster = monsters[i]
                }
              }
              if(monster !== null) {
                monster.hp -= that.arrowDamage()
              }
              if(player.hasAbility('Archery') && player.arrows<12) {
                if(map[targetx][targety]=='#' || map[targetx][targety]=='C') {
                  logMsg('The arrow breaks')
                } else if(Math.floor(Math.random()*2)==0) {
                  items.push([targetx,targety,findItemType('Arrow')]);
                }
              }
              setGameStatus('play')
              runTurn()
              renderMap()
            }, 60*d);
          }
        }
        if(_effect=="heal") {
            that.addHP(16)+that.intelligence*2
        }
        updateStats()
    }

    that.throwItem = function (targetx, targety, thrownItem) {
      document.body.style.cursor = 'default'
      setGameStatus('wait')
      arrowAudio.play()
      if(that.weapon==thrownItem) that.unwield('weapon')
      dx =targetx-that.x
      dy =targety-that.y
      d = Math.round(Math.sqrt(dx*dx+dy*dy))
      for(let i=0;i<d;i++) {
        setTimeout(function(){
          renderMap()
          drawSpin(that.x, that.y, targetx, targety, i/d,i%2)
        }, i*60);
      }
      setTimeout(function(){
        monster = null
        for (let i=0; i<monsters.length; i++) if(monsters[i].hp>0) {
          x = monsters[i].x
          y = monsters[i].y
          if(mapRev[x][y]>1 && x==targetx && y==targety) {
            monster = monsters[i]
          }
        }
        if(monster !== null) {
          attack_points = 6 + Math.floor(Math.random() * 5) + that.throwDamage(thrownItem)
          monster.hp -= attack_points
        }
        if(that.inventory[thrownItem].hp>2) {
          that.inventory[thrownItem].hp-=3
          data = that.inventory[thrownItem]
          data[0] = targetx
          data[1] = targety
          data[2] = that.inventory[thrownItem].itemType
          data[3] = that.inventory[thrownItem].hp
          that.deleteFromInv(thrownItem)
          items.push(data)
        } else {
          that.addItemHP(thrownItem, -3)
        }
        if(!that.hasAbility('Throwing')) player.turnTime -= 50
        updateStats()
        setGameStatus('play')
        runTurn()
        renderMap()
      }, 60*d);
    }

    that.deleteFromInv = function (i) {
        if(that.weapon!=null && that.weapon>i) that.weapon--
        if(that.eArmor!=null && that.eArmor>i) that.eArmor--
        if(that.eShield!=null && that.eShield>i) that.eShield--
        that.inventory.splice(i,1)
    }

    that.kick = function () {
      dir = [[0,-1],[1,0],[0,1],[-1,0]]
      dx = dir[selectDirection][0]
      dy = dir[selectDirection][1]
      turnPlayed = true

      mi = getMonster(that.x+dx,that.y+dy);
      if(mi > -1) {
        attack_points = 4 + Math.floor(Math.random() * 4) + that.strength;
          if(attack_points<0) attack_points = 0
          monsters[mi].hp-=attack_points;
          if(monsters[mi].hp<0) monsters[mi].hp==0;
          logMsg("You kick the "+monsters[mi].typeName()+' dealing '+attack_points+' damage');
          that.removeStatus('invisible')
          swingAudio.play();
          if(!monsters[mi].hasAttr('flying'))
          if(!isBlocked(monsters[mi].x+dx, monsters[mi].y+dy)) {
            monsters[mi].x +=dx
            monsters[mi].y +=dy
            if(monsters[mi].hasAttr('size',1)) monsters[mi].turnTime -= 20
            monsters[mi].turnTime -= Math.floor(Math.random()*20)
            if(map[monsters[mi].x][monsters[mi].y]==' ') {
              logMsg('The '+monsters[mi].typeName()+' falls in the dark')
              monsters.splice(mi,1)
            }
          }
          //that.turnTime -= 10;
          setGameStatus('play')
          return
      }

      obj = getObject(that.x+dx,that.y+dy)
      if(obj!=null) {
        objType = objectType[obj.type]
        if(typeof objType.kick_to!='undefined') {
          logMsg('You kick the '+objType.name)
          obj.type = findObjectType(objType.kick_to, obj.type);
          swingAudio.play()
          setGameStatus('play')
          return
        }
      }

      logMsg('You kick on the air')
      setGameStatus('play')
    }

    that.jump = function() {
      dir = [[0,-1],[1,0],[0,1],[-1,0]]
      let dx = dir[selectDirection][0]
      let dy = dir[selectDirection][1]
      msg = 'You jump two steps'
      if(map[that.x+dx][that.y+dy]=='#' || map[that.x+dx][that.y+dy]=='C'
        ||  map[that.x+dx+dx][that.y+dy+dy]=='#' || map[that.x+dx+dx][that.y+dy+dy]=='C' || map[that.x+dx+dx][that.y+dy+dy]==' ') {
        logMsg('You cannot jump to this direction')
        return false
      }

      mi = getMonster(that.x+dx, that.y+dy)
      if(mi>-1) if(monsters[mi].hasAttr('size',1)) {
        msg = 'You jump over the '+monsterType[monsters[mi].type].name
      } else {
        msg = 'You cannot jump over the '+monsterType[monsters[mi].type].name
        return false
      }

      that.turnTime -= 100;
      runTurn()
      setGameStatus('play')
      logMsg(msg)
      that.x +=dx+dx
      that.y +=dy+dy

      return true
    }

    that.addStatus = function (_effect, _effect_time) {
      if(that.hasAttr('resist',_effect)) _effect_time = _effect_time/2

      for(let i=0; i<that.status.length; i++) {
      	if(that.status[i].effect == _effect) {
          if(that.status[i].timeleft<_effect_time*100) {
            that.status[i].timeleft = _effect_time*100
          }
          return;
        }
      }
        that.addEffect(_effect)
        that.status.push({timeleft:_effect_time*100,effect:_effect})
    }

    that.getAttr = function (attr) {
      if(typeof that[attr]!='undefined') {
        return that[attr];
      }
      if(typeof monsterType[that.type]!='undefined') if(typeof monsterType[that.type][attr]!='undefined') {
          return monsterType[that.type][attr];
      }
      return null;
    }
    that.hasAttr = function (attr, v=true) {
      if(typeof that[attr]!='undefined') {
        if(that[attr].includes(v)) return true;
      }
      if(typeof monsterType[that.type]!='undefined') if(typeof monsterType[that.type][attr]!='undefined') {
          if(monsterType[that.type][attr]===v || monsterType[that.type][attr].includes(v)) return true;
      }
      return false;
    }
    that.hasAbility = function (ability) {
      if(typeof that.abilities!='undefined') {
        if(that.abilities.includes(ability)) return true;
      }
      if(typeof that.type!='undefined') if(typeof monsterType[that.type].abilities!='undefined') {
        if(monsterType[that.type].abilities.includes(ability)) return true;
      }
      return false;
    }
    that.hasStatus = function (_effect) {
	    for(let i=0; i<that.status.length; i++) {
	    	if(that.status[i].effect == _effect) return true
	    }
	    return false
    }
    that.removeStatus = function (_effect) {
	    for(let i=0; i<that.status.length; i++) {
	    	if(that.status[i].effect == _effect) that.status.splice(i,1)
	    }
	    return false
    }

    that.monsterMove = function (dx, dy) {
        if(that.hasStatus('confuze')) if(Math.floor(Math.random() * 4)==0) {
          if(dx==0) {
              dy=0;
              if(Math.floor(Math.random() * 2)==0) dx=-1; else dx=1; 
          }
          if(dy==0) {
              dx=0;
              if(Math.floor(Math.random() * 2)==0) dx=-1; else dx=1; 
          }
        }
        _x = that.x+dx
        _y = that.y+dy

        if(isBlocked(_x,_y)) return;

        if(typeof monsterType[that.type].flying=='undefined') {
          if(map[that.x+dx][that.y+dy]=='l' && !that.hasAttr('resist','fire')) {
            that.hp -=1;
          }
        }
        if(map[that.x+dx][that.y+dy]=='=' || map[that.x+dx][that.y+dy]=='-') {
          if(that.hasAttr('fear', 'water')) return;
          if(!that.hasAttr('flying')) that.turnTime -= 50;
        }
        if(map[that.x+dx][that.y+dy]==' ') {
          if(!that.hasAttr('flying')) return;
        }


        if(player.x==_x && player.y==_y) {
            _mt = monsterType[that.type]
            if(_mt.level<8) {
              attack_points = Math.floor(_mt.level/2)+Math.floor(Math.random()*(_mt.level+1)) - player.armor;
            } else {
              attack_points = 6 + Math.floor(Math.random() * 5) + that.attack - player.armor;
            }

            if(attack_points<0) attack_points = 0;

            if(player.eShield!=null) {
              if(Math.floor(Math.random() * 8) == 0) {
                if(attack_points>1) {
                  player.addItemHP(player.eShield, -1)
                  updateStats()
                }
                if(player.hasAbility('Shield') || Math.floor(Math.random()*3)==0) {
                  logMsg("You block the attack of "+that.typeName());
                  return
                }
              }
            }

            if(player.eArmor!=null) {
              if(attack_points>player.armor) {
                player.addItemHP(player.eArmor, -player.armor)
              } else player.addItemHP(player.eArmor, -1)
            }

            if(player.dexterity>0) if(Math.floor(Math.random() * (11-player.dexterity))<1) {
              logMsg("The "+that.typeName()+' misses you');
              return
            }

            log_msg = "The "+that.typeName()+' hits you for '+attack_points+' damage'
            dmsg = "<span style='color:red'>The "+that.typeName()+' kills you</span>'
            player.addHP(-attack_points, that.typeName(), dmsg);
            animatePop(player.x, player.y, '-'+attack_points, 'red')
            if(player.hp>0) {
              if(Math.floor(Math.random() * 8)==0) {
                if(typeof _mt['specialAttack']!='undefined') {
                  _effect_time = 12+_mt.level*2;
                  if(_mt['specialAttack']=='bleeding') player.addStatus('bleeding',_effect_time)
                  if(_mt['specialAttack']=='confuze') player.addStatus('confuze',6+_mt.level)
                  if(_mt['specialAttack']=='curse') player.addStatus('curse',6+_mt.level)
                  if(_mt['specialAttack']=='blind') player.addStatus('blind',6+_mt.level)
                  if(_mt['specialAttack']=='poison') player.addStatus('poison',_effect_time*2)
                  if(_mt['specialAttack']=='fire') {
                    player.addHP(-3, that.typeName());
                    animateEffect(player.x, player.y, itemImg['effect0'], 0, 21, 2);
                  }
                }
              }
              if(Math.floor(Math.random() * 10)==0) {
                if(typeof _mt['specialAttack']!='undefined') {
                  if(_mt['specialAttack']=='critical') {
                    log_msg = "The "+that.typeName()+' hits you with critical attack'
                    player.addHP(-attack_points, that.typeName(), dmsg);
                    animatePop(player.x, player.y, '-'+attack_points, 'red')
                  }
                }
              }
            }
            logMsg(log_msg);
            return
        }
        that.x += dx;
        that.y += dy;
    }

    that.monsterPlay = function () {
        _x = that.x;
        _y = that.y;
        px = player.x;
        py = player.y;

        if(Math.abs(px-_x)<3 && Math.abs(py-_y)<3 && !player.hasStatus('invisible')) {
            dx = spaceship(px,_x)
            if(dx == 0) dy = spaceship(py,_y); else dy=0;
            if(map[_x+dx][_y+dy]=='#') [dx,dy] = [dy,dx]
            if(map[_x+dx][_y+dy]=='C') [dx,dy] = [dy,dx]
            if(map[_x+dx][_y+dy]==' ') [dx,dy] = [dy,dx]
            that.monsterMove(dx, dy);
        } else if(Math.floor(Math.random() * 2) == 0) { // random movement
            that.monsterMove(Math.floor(Math.random() * 3)-1, 0);
        } else {
            that.monsterMove(0, Math.floor(Math.random() * 3)-1);
        }
    }

    that.typeName = function () {
        return monsterType[that.type].name
    }

    that.moveLevel = function () {
      let tilePath = {
        '<':[0,0,1,'upstairs'],'>':[0,0,-1,'downstairs'],
        'N':[0,1,0,'north'],'S':[0,-1,0,'south'],
        'W':[-1,0,0,'west'],'E':[1,0,0,'east']
      }
      for(i in tilePath) if(map[that.x][that.y]==i) {
        logMsg('You go '+tilePath[i][3]+'...');
        gameScene = 'waiting';
        moveLevel(tilePath[i]);
      }
    }

    that.tileEffect = function() {

    }

    that.view = function (_x=null,_y=null) {
        if(_x==null) _x = Math.floor(that.x)
        if(_y==null) _y = Math.floor(that.y)
        _los = that.los+1
        if(_los<6 && that.hasStatus('light')) _los = 6
        if(_los<3 && that.hasAbility('Darkvision')) _los = 3
        if(that.hasStatus('blind')) return

        mapRev[_x][_y] = 4;
        for(i=_x-8; i<_x+9; i++) {
            for(j=_y-8; j<_y+9; j++) {
                diffx = i-_x;
                diffy = j-_y;

                if(Math.abs(diffy)>Math.abs(diffx)) {
                    dx = diffx / diffy;
                    dy = Math.sign(diffy);
                } else if (diffx!=0) {
                    dx = Math.sign(diffx);
                    dy = diffy / diffx;
                } else {
                    continue;
                }
                p = 0; loop = true;
                lastX = _x; lastY = _y;

                do {
                    p++;
                    x = Math.round(p*dx)+_x;
                    y = Math.round(p*dy)+_y;
                    if(!inMap(x,y)) break;
                    if(x!=lastX && y!=lastY) {
                      if(map[x][lastY]=='#' && map[lastX][y]=='#' && map[x][y]!='#') break;
                    }

                    if(inMap(x,y)) {
                      dist = Math.sqrt( Math.pow(p*dx, 2) + Math.pow(p*dy, 2) )
                      if(lightmap[x][y]>0 || dist<_los) {
                        mapRev[x][y] = 5;
                        if(dist>1) mapRev[x][y] = 4;
                        if(dist>2) mapRev[x][y] = 3;
                        if(dist>3) mapRev[x][y] = 2;
                        if(dist>4) loop=false;
                      }
                    } else loop=false;
                    for(oi=0;oi<objects.length;oi++) if(objectType[objects[oi].type].blocksight==true) {
                        if(objects[oi].x==x && objects[oi].y==y) loop=false;
                    }
                    lastX = x; lastY=y;

                  } while(loop && map[x][y]!='#' && map[x][y]!='C' && map[x][y]!=':' && p<5);
            }
        }
    }

    that.identify = function (category, i) {
      if(typeof that.lore[category]=='undefined') that.lore[category]=[];
      if(that.lore[category].includes(i)) return false
      that.lore[category].push(i)
      return true
    }

    that.identified = function (category, i) {
      if(typeof that.lore[category]=='undefined') return false;
      return that.lore[category].includes(i)
    }

    return that;
}

function spaceship(val1, val2) {
    if ((val1 === null || val2 === null) || (typeof val1 != typeof val2)) {
      return null;
    }
    if (val1 > val2) {
      return 1;
    } else if (val1 < val2) {
      return -1;
    }
    return 0;
}

function drawThunder(sx, sy, ex, ey) {
    dx =ex-sx
    dy =ey-sy
    let d = Math.sqrt(dx*dx+dy*dy)
    stepx = dx/d
    stepy = dy/d
    mx = sx-player.x+renderWidth
    my = sy-player.y+renderHeight
    context.strokeStyle='#ccccff';
    context.beginPath();
    context.moveTo(mx*32+16, my*32+16);
    for(let i=0.25;i<d;i+=0.25) {
        x = mx + i*stepx
        y = my + i*stepy
        context.lineTo(x*32+16+Math.random()*16, y*32+16+Math.random()*16);
    }
    context.lineTo((mx+dx)*32+16, (my+dy)*32+16);
    context.stroke(); 
}

function drawLine(sx, sy, ex, ey, color) {
  mx = sx-player.x+renderWidth
  my = sy-player.y+renderHeight
  context.strokeStyle=color;
  context.beginPath();
  context.moveTo(mx*32+16, my*32+16);
  context.lineTo((mx+ex-sx)*32+16, (my+ey-sy)*32+16);
  context.stroke(); 
}

function drawArrow(sx, sy, ex, ey, step) {
  dx =ex-sx
  dy =ey-sy
  let d = Math.sqrt(dx*dx+dy*dy)
  stepx = dx/d
  stepy = dy/d
  mx = sx-player.x+renderWidth
  my = sy-player.y+renderHeight
  context.strokeStyle='#452434';//ae6529
  context.beginPath();
  context.moveTo((mx+dx*step)*32+16, (my+dy*step)*32+16);
  context.lineTo((mx+dx*step+stepx)*32+16, (my+dy*step+stepy)*32+16);
  context.stroke(); 
}

function drawSpin(sx, sy, ex, ey, step, rot=0) {
  dx =ex-sx
  dy =ey-sy
  //let d = Math.sqrt(dx*dx+dy*dy)
  drawSprite(sx+dx*step,sy+dy*step, itemImg['effect'+rot], 0, 25);
}

function animateEffect(x, y, img, sx, sy, f, step=100) {
  let _x = x
  let _y = y
  let _img = img
  for(let i=0;i<f;i++) {
    setTimeout(function() {
      renderMap()
      drawSprite(_x, _y, _img, sx+i, sy)
    }, i*step);
  }
  setTimeout(function() {
    renderMap()
    setGameStatus('play')
  }, f*step);
}

function isBlocked(x, y) {
    if(isBlockedByTile(x,y)) return true
    if(getMonster(x,y)>-1) return true
    if(obj=getObject(x,y)) {
        objType = objectType[obj.type]
        if(objType.block==true) return true;
    }
    return false
}

function isBlockedByTile(x, y) {
  if(!inMap(x,y)) return true
  if(map[x][y]=='#' || map[x][y]=='C') return true
  return false
}

