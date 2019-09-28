<?php
define("GPACKAGE",'dungeonrl');

class MapController extends controller
{
    public $map = [];
    public $mapRev = [];
    public $rows = 25;
    public $columns = 25;
    public $steps = 240;
    public $tpm = 35;
    public $fClosedSpace = 1;
    public $nClosedSpace = 2;
    public $fDirection = 0;
    public $startPos = [0,0];
    public $items = [];
    public $region = [];
    public $itemType;
    public $itemTypeN;
    public $objects = [];
    public $objectType;
    public $objectTypeN;
    public $monsters = [];
    public $monsterType;
    public $monsterTypeN;
    public $taskType;
    public $taskTypeN;
    public $groundObjects=[];
    public $level = 1;
    public $player = null;
    public $entries = [];
    public $levelTurns = 0;
    public $gameId;
    public $levelTask = [];
    public $room = [];
    public $door = [];
    public $playerItem = null;
    private $gamePath;

    function __construct ()
    {
      include_once __DIR__."/models/Game.php";
      view::set('style_css_path', gila::base_url().'src/'.GPACKAGE.'/style.css?v=9');
      view::set('unit_js_path', gila::base_url().'src/'.GPACKAGE.'/unit.js?v=9');
      view::set('game_js_path', gila::base_url().'src/'.GPACKAGE.'/gameplay.js?v=10');

        //self::admin();
        $this->gameId = $_COOKIE['gameId'] ?? null;

        if($this->gameId!==null) {

          for ($i=0; $i<$this->rows; $i++) {
              for ($j=0; $j<$this->columns; $j++) {
                  $this->setTile($j,$i,'#');
                  $this->mapRev[$j][$i] = 0;
              }
          }
          $this->monsterType = json_decode(file_get_contents($this->gamePath().'monsters.json'),true);
          $this->itemType = json_decode(file_get_contents($this->gamePath().'items.json'),true);
          $this->monsterTypeN = count($this->monsterType);
          $this->itemTypeN = count($this->itemType);
          $this->objectType = json_decode(file_get_contents('src/'.GPACKAGE.'/data/objects.json'),true);
          $this->objectTypeN = count($this->objectType);
          $this->taskType = json_decode(file_get_contents('src/'.GPACKAGE.'/data/tasks.json'),true);
          $this->taskTypeN = count($this->taskType);

          if(isset($_REQUEST['level'])) {
              usleep(300000);
          }

          $this->level = $_COOKIE['level'] ?? 1;
          $this->steps += $this->level*10;
          $ext = $this->level<10 ? $this->level : 10;
          $this->rows += $ext;
          $this->columns += $ext;

          $file = LOG_PATH.'/games/'.$this->gameId.'/@.json';
          if(file_exists($file)) {
            $this->player = json_decode(file_get_contents($file),true);
          }
        }
  
        if($this->player == null && $this->gameId!==null) {
          $this->player = $this->newPlayer($this->gameId);
        }
        if($this->player['hp']>$this->player['maxhp']) $this->player['hp']=$this->player['maxhp'];
        //session::unsetKey('player');
        //session::unsetKey('level');
    }

    function share()
    {
        ?>
        <meta property="og:url"                content="<?=gila::base()?>" />
        <meta property="og:type"               content="article" />
        <meta property="og:title"              content="<?=$this->player['name']?>" />
        <meta property="og:description"        content="A big hero. You will be missed" />
        <meta property="og:image"              content="<?=gila::base()?>/assets/screenshot/<?=$this->gameId?>-end.jpg" />
        <meta http-equiv="Refresh" content="0; url=<?=gila::base()?>">
        <?php
        // fb:app_id
        // https://facebook.com/sharer/sharer.php?u=...
    }

    function updateAction()
    {
      include_once __DIR__."/models/Game.php";
      if(isset($_REQUEST['player']) && $this->gameId!=null) {
        $newLevel = $_REQUEST['level'] ?? $this->level;
        $playerData = json_decode($_REQUEST['player'],true);
        // find the start position from using the previous level
        if($this->level != $newLevel) {
          if($this->level < $newLevel) $entryType = 'upstairs';
          if($this->level > $newLevel) $entryType = 'downstairs';
          $entryType = $_REQUEST['entryType'] ?? $entryType ?? 'upstairs';
          setcookie('entryType', $entryType, time() + (86400 * 30), "/");
        } else {
          setcookie('entryType', null, time() -1000, "/");
        }
        setcookie('level', $newLevel, time() + (86400 * 30), "/");
        Game::moveLevel($this->gameId, $newLevel, $playerData['gameTurn']);
        $file = $this->gamePath().'level'.$this->level.'.json';

        file_put_contents($file, $_REQUEST['levelMap']);
        file_put_contents($this->gamePath().'@.json', json_encode($playerData));
        //usleep(100000);
        echo '{"msg":"ok","level":"'.$newLevel.'"}'; 
      }
    }

    function saveGame ($map, $player) {
      $file = $this->gamePath().'level'.$this->level.'.json';
      file_put_contents($file, $map);
      file_put_contents($this->gamePath().'@.json', $player);
    }

    function gamedataAction($gid, $file)
    {
      echo file_get_contents($this->gamePath($gid).$file);
    }

    function permadeathAction()
    {
      $this->updateAction();
      Game::endgame($_COOKIE['gameId']);
      setcookie('finishedGame', $_COOKIE['gameId'], time() + (86400 * 30), "/");
      setcookie('gameId',null, time() -1000, "/");
      setcookie('player',null, time() -1000, "/");
    }

    function gameAction($gameId = null)
    {
      $pnk = new gTable('game');
      $game = $pnk->getRow(['id'=>$gameId]);
      $pnk = new gTable('playerclass');
      $playerclass = $pnk->getRow(['id'=>$game['class_id']]);
      view::set('game', $game);
      view::set('playerclass', $playerclass);
      $this->loadLevel($gameId, $game['level']);
      $file = LOG_PATH.'/games/'.$gameId.'/@.json';
      $this->player = json_decode(file_get_contents($file),true);
      $this->player["sprite"] = ['player', (int)$class['spriteX'], (int)$class['spriteY']];
      view::renderFile('game.php',GPACKAGE);
    }

    function feedbackAction($gameId = null) {
      if($gameId==$_COOKIE['finishedGame'] &&
        gForm::verifyToken('feedback',$_REQUEST['token'])) {
          include __DIR__."/models/Game.php";
          Game::feedback($gameId, $_REQUEST['feedback']);
        }
    }

    function gamePath($id = null) {
        if( $id!= null) return gila::dir(LOG_PATH.'/games/'.$id.'/');
      return gila::dir(LOG_PATH.'/games/'.$this->gameId.'/');
    }

    function indexAction ()
    {
      view::set('gameId', $this->gameId);
      view::renderFile('index.php',GPACKAGE);
    }

    function playAction ($gameId=null)
    {
      $this->gameId = $_COOKIE['gameId'];
      if($this->gameId === null) {
        view::renderFile('index.php',GPACKAGE);
        return;
      }

      $pnk = new gTable('game');
      $game = $pnk->getRow(['id'=>$this->gameId]);
      $pnk = new gTable('playerclass');
      $class = $pnk->getRow(['id'=>$game['class_id']]);
      $this->playerItem = $class['item'] ? explode(',',$class['item']) : null;
      $this->player["sprite"] = ['player', (int)$class['spriteX'], (int)$class['spriteY']];
      $this->player["gameTurn"] = $game['game_turns'];

      if(!$this->loadLevel()) {
        $this->dungeon ();
        $this->player['x'] = $this->startPos[0];
        $this->player['y'] = $this->startPos[1];
      }
      //$this->cave ();
      view::renderFile('play.php',GPACKAGE);
    }

    function entryPos($entryType) {
      $entryTile = ['upstairs'=>'<', 'downstairs'=>'>'][$entryType] ?? null;
      if($entryTile) foreach($this->map as $x=>$row) {
        foreach($row as $y=>$tile) {
          if($tile == $entryTile) return [$x, $y];
        }
      }
      return $this->randPos();
    }

    function loadLevel($gameId = null, $level=null) {
      if($gameId==null) $gameId = $this->gameId;
      if($level==null) $level = $this->level;
      $file = LOG_PATH.'/games/'.$gameId.'/level'.$level.'.json';

      if(!file_exists($file)) return false;
      $levelMap = json_decode(file_get_contents($file), true);
      $this->map = [];
      for($i=0; $i<$levelMap['mapSize'][0]; $i++) {
          $this->map[$i] = [];
        for($j=0; $j<$levelMap['mapSize'][1]; $j++) {
            $this->map[$i][$j] = $levelMap['mapString'][$i*$levelMap['mapSize'][0] + $j];
        }
      }

      $this->mapRev = $levelMap['mapRev'];
      $this->monsters = $levelMap['monsters'];
      $this->items = $levelMap['items'];
      $this->objects = $levelMap['objects'];
      $this->levelTurns = $levelMap['turns'];
      $this->groundObjects = $levelMap['groundObjects'];
      $this->mapItems = $levelMap['mapItems'] ?? [];
      if($_COOKIE['entryType']) {
        $this->startPos = $this->entryPos($_COOKIE['entryType']);
        $this->player['x'] = $this->startPos[0];
        $this->player['y'] = $this->startPos[1];
      }
      return true;
    }

    function newAction ()
    {
      view::renderFile('new.php',GPACKAGE);
    }

    function createAction()
    {
      include_once __DIR__."/models/Game.php";
      $gameId = Game::create($_REQUEST['name'], $_REQUEST['classId']);
      setcookie('level', 1, time() + (86400 * 30), "/");
      setcookie('gameId', $gameId, time() + (86400 * 30), "/");
    }

    function dungeon()
    {
      include __DIR__."/models/MapDungeon.php";
      $dungeon = new MapDungeon($this->rows, $this->columns);
      $dungeon->createDungeon();
      $this->entries = $dungeon->entries;
      $this->startPos = $dungeon->startpoint;
      $this->map = $dungeon->map;
      $this->mapRev = $dungeon->mapRev;

      if($this->level>1) $this->map[$dungeon->startpoint[0]][$dungeon->startpoint[1]] = '<';

      $roomN = count($dungeon->room);
      $this->room = $dungeon->room;
      $this->door = $dungeon->door;
      $this->voronoi = $dungeon->voronoi;


      foreach($dungeon->secretDoor as $secret) if($this->map[$secret[0]][$secret[1]]=='#') {
        $this->setTile($secret[0],$secret[1],'.');
      }
      foreach($dungeon->openDoor as $secret) if($this->map[$secret[0]][$secret[1]]=='#') {
        $this->setTile($secret[0],$secret[1],'.');
      }

      for($i=1; $i<$roomN; $i++) if($i!=$dungeon->maxLevelRoom) {

        if(rand(0,8)>0) {

          $box = $dungeon->room[$i];
          if($box[2]*$box[3]<5) if(rand(0,6)==0) {
            $msg='This room is so small that almost gives you claustrophobia';
            $this->region[] = ['box'=>$box, 'description'=>$msg];
          }
          if($box[2]*$box[3]>16) if(rand(0,40)==0) {
            $msg='You hear the sounds of water dripping and echoing';
            $this->region[] = ['box'=>$box, 'description'=>$msg];
          }

          $pos = $this->randPosRoom($dungeon->room[$i]);
          // Floor
          if(rand(0,1)==0) $this->addGroundObject($pos, [
            "Rocks #1","Rocks #2","Rocks #3","Rocks #4",
            "Rocks #5","Rocks #6","Rocks #7","Rocks #8",
            "Blood #1","Blood #2","Ground #1","Ground #2",
            "Object1","Object2","Object3","Object4","Firelogs","Firecamp",
            "Blood1","Blood2","Blood3","Blood4",
            "Skull #1","Skull #2","Skull #3","Skull #4","Skull #5","Skull #6",
            "Bones #1","Bones #2","Bones #3","Bones #4","Bones #5","Bones #6"
          ]);
        }
      }

      $this->levelTask['room'] = [];
      for($i=0; $i<$roomN; $i++) if(!isset($this->levelTask['room'][$i])) {
        do{
          $taskIndex = rand(0, $this->taskTypeN-1);
          $steps = $this->canAddTaskAtRoom($taskIndex, $i, $roomN);
        }while($steps===false);
        $this->addTask($taskIndex, $steps);
      }

      $ex = $this->level<3 ? 0 : ($this->level<6 ? 1 : ($this->level<10 ? 2 : 3));
      $_i = rand(3,4+$ex)-$this->levelTask['spawnedMonsters']+$ex;
      for($i=0;$i<$_i;$i++) $this->spawnMonster($this->randPos());

      if($this->level>4) $this->addItemByName($this->randPos(), 'Candle');
      if($this->level==1) $this->addItemByType($this->randPos(), explode(',',$this->playerItem)[0]);
      if($this->level%3==0) $this->addItemByType($this->randPos(), $this->playerItem);

      for($i=0;$i<3-$this->levelTask['spawnedItems'];$i++) if(count($this->player['inventory'])<5) {
        $this->addRandomItem();
        $this->spawnMonster($this->randPos());
      }

      //foreach($this->taskType as $k=>$task) if($k<1) if(rand(0,1)<2) {
      //foreach($this->roomask[taskType as $k=>$task) if($k<1) if(rand(0,1)<2) {
      //    $stepRoomX=0;
      //}

    }

    function addTask($taskIndex, $stepRooms) {
      $this->levelTask['spawnedItems'] = 0;
      $this->levelTask['spawnedMonsters'] = 0;
      foreach($this->taskType[$taskIndex] as $i=>$step) {
        $stepRoomX = $stepRooms[$i];
        $room = $this->room[$stepRoomX];
        if(isset($step['item'])) {
          $itemName = $this->fromList($step['item']);
          $this->addItemByName($this->randPosRoom($room), $itemName);
        }
        if(isset($step['monsters'])) foreach($step['monsters'] as $mName) {
          $pos = $this->randPosRoom($room);
          $this->spawnMonster($pos, $mName);
        }
        if(isset($step['spawn'])) for($i=0; $i<$step['spawn']; $i++) {
          $pos = $this->randPosRoom($room);
          $this->spawnMonster($pos);
          $this->levelTask['spawnedMonsters']++;
        }
        if(isset($step['door_object'])) if($this->canAddDoor($this->door[$stepRoomX][0])) {
          $doorType = $this->findObjectType($step['door_object']);
          $this->addObject($this->door[$stepRoomX][0], $doorType);
          if(isset($step['open_from'])) {
            if($step['open_from']=='previous_object') {
              $this->objects[count($this->objects)-2]['open_object'] = count($this->objects)-1;
            }
          }
        }
        if(isset($step['door1_object'])) if($this->canAddDoor($this->door[$stepRoomX][1])) {
          $doorType = $this->findObjectType($step['door1_object']);
          $this->addObject($this->door[$stepRoomX][1], $doorType);
          if(isset($step['open_from'])) {
            if($step['open_from']=='previous_object') {
              $this->objects[count($this->objects)-2]['open_object'] = count($this->objects)-1;
            }
          }
        }
        if(isset($step['room_tile'])) {
          $this->roomVoronoiTile($this->room[$stepRoomX], $step['room_tile']);
        }
        if(isset($step['step_tile'])) {
            $p1 = $this->door[$stepRoomX][0];
            $p2 = $this->door[$stepRoomX][1];
            $x = $p1[0]; $y = $p1[0];
            if($p1[0]==$p2[0]) $y = rand($p1[1], $p2[1]); else $x = rand($p1[0], $p2[0]); 
            $this->map[$x][$y] = $step['step_tile'];
        }
        //if(isset($step['wall_tile'])) {
        //  $this->roomVoronoiTile($this->room[$stepRoomX], $step['room_tile']);
        //}
        if(isset($step['room_object'])) {
          $pos = $this->randPosRoom($room);
          $this->addObject($pos, $this->findObjectType($step['room_object']));
        }
        if(isset($step['ground_objects'])) {
          foreach($step['ground_objects'] as $key=>$objName) {
            $pos = $this->randPosRoom($room);
            $this->addGroundObject($pos, $objName);
          }
        }
        if(isset($step['block_object'])) {
          $objName = $this->fromList($step['block_object']);
          $objType = $this->findObjectType($objName);
          $args = [];
          if(isset($step['object_item'])) {
            if($itemName = $this->fromList($step['object_item'])) if(count($this->player['inventory'])<5) {
              //$this->levelTask['spawnedItems']++;
              $args = ['item'=>$itemName];
            }
          }
          $res = $this->addBlockObject($room, $objType, $args);
        }
        if(isset($step['room_desc'])) {
          $this->region[] = ['box'=>$room, 'description'=>$step['room_desc']];
        }
      }
    }

    function canAddDoor($pos) {
      if($this->isBlocked($pos)) return false;
      if($this->map[$pos[0]][$pos[1]-1]=='#' && $this->map[$pos[0]][$pos[1]+1]=='#') return true;
      if($this->map[$pos[0]-1][$pos[1]]=='#' && $this->map[$pos[0]+1][$pos[1]]=='#') return true;
      return false;
    }

    function canAddTaskAtRoom($taskIndex, $roomIndex, $roomN) {
      $stepRoomX = [];
      $_tasks = count($this->taskType[$taskIndex]);
      
      foreach($this->taskType[$taskIndex] as $j=>$taskStep) {
        if($stepRoomX[$j-1]==$roomN-1) return false;
        if($j>0) {
          $stepRoomX[] = rand($stepRoomX[$j-1]+1, $roomN-1);
        } else $stepRoomX[] = $roomIndex;

        if(isset($this->levelTask['room'][$stepRoomX[$j]])) return false;
        foreach($taskStep as $index=>$value) {
          if($_room = $this->levelTask['room'][$stepRoomX[$j]]) {
            if($index=='block_object' && ($_room[2]<3 || $_room[3]<3)) {
              return false;
            }
            if(isset($_room[$index])) {
              return false;
            }
          }
        }
        
      }

      foreach($stepRoomX as $i=>$roomIndex) {
        if(!isset($this->levelTask['room'][$roomIndex])) {
          $this->levelTask['room'][$roomIndex] = [];
        }
        $this->levelTask['room'][$roomIndex] = array_merge(
          $this->levelTask['room'][$roomIndex], $this->taskType[$taskIndex][$i]
        );
      }
      //$this->levelTask['task'][] = $taskType[$taskIndex];
      return $stepRoomX;
    }

    function fromList($list)
    {
      return is_array($list) ? $list[rand(0,count($list)-1)]: $list;
    }

    function cave ()
    {
        $pos = [
            rand(10,$this->columns-11),
            rand(10,$this->rows-11)
        ];
        $this->startPos = $pos;

        $direction = $this->randDirection();
        for ($step=0; $step<$this->steps; $step++) {
            if(rand(0,$this->fDirection)==0) $direction = $this->randDirection();
            $pos[0] +=$direction[0];
            $pos[1] +=$direction[1];
            if($this->inMap($pos)) {
                if($this->forCavePath($pos)) {
                    if($this->getTile($pos[0],$pos[1])=='.') $step--;
                    $this->setTile($pos[0],$pos[1],'.');
                    if(floor($step/$this->tpm)>count($this->monsters)) {
                       $this->spawnMonster($pos);
                    }
                } else {
                    if($this->getTile($pos[0],$pos[1])=='#') {
                        $pos[0] -=$direction[0];
                        $pos[1] -=$direction[1];
                    }
                    $step--;
                }
            } else {
                $step--;
                $pos[0] -=$direction[0];
                $pos[1] -=$direction[1];
            }
        }

        $this->startPos = $this->getSouthernPos();
        $pos = $this->getNorthernPos();
        //if($this->level>1) $this->setTilePos($this->startPos,'S');
        if($this->level<12) $this->setTilePos($pos,'N');

        $this->addItemByName($this->randPos(),"Potion of Healing");
        if(rand(0, 1)>0) $this->addItemByName($this->randPos(),"Arrow");
        $this->addItemByName($this->randPos(),"Arrow");
        $this->addItemByName($this->randPos(),"Arrow");
        if($this->level%2==0) {
          $this->addItemByName($this->randPos(),"Attack Upgrade");
        } else {
          $this->addItemByName($this->randPos(),"Armor Upgrade");
        }
        for($i=0;$i<30;$i++) {
          $this->addGroundObject($this->randPos(),[
            "Ground #1","Ground #2","Ground #3","Ground #4",
            "Rocks #1","Rocks #2","Rocks #3","Rocks #4",
            "Ground #5","Ground #6","Ground #7","Ground #8",
            "Rocks #5","Rocks #6","Rocks #7","Rocks #8",
            "Floors #1","Floors #2","Floors #3","Floors #4",
            "Floors #5","Floors #6","Floors #7","Floors #8"
          ]);
        }
        //if($this->level % 2 == 1) {
            do{
        		$rtype = rand(0, $this->itemTypeN-1);
        	}while($rtype==3 || $rtype==4 || $rtype==5 || $rtype==6);
            $this->addItem($this->randPos(), $rtype);
        //}
        view::renderFile('play.php',GPACKAGE);
    }

    function getNorthernPos() {
      for($y=1; $y<$this->rows-2;$y++) {
        for($x=1; $x<$this->columns-2;$x++) {
          if(!$this->isBlocked([$x,$y])) return [$x,$y];
        }
      }
    }
    function getSouthernPos() {
      for($y=$this->rows-2; $y>2;$y--) {
        for($x=1; $x<$this->columns-2;$x++) {
          if(!$this->isBlocked([$x,$y])) return [$x,$y];
        }
      }
    }
    function setTilePos($x,$tile) {
        $this->setTile($x[0],$x[1],$tile);
    }
    function setTile($x,$y,$tile) {
        $this->map[$x][$y] = $tile;
    }
    function getTile($x,$y) {
        return $this->map[$x][$y];
    }

    function randDirection() {
        $x = rand(0,3);
        switch ($x) {
            case 0:
                return [1,0];
                break;
            case 1:
                return [0,1];
                break;
            case 2:
                return [-1,0];
                break;
            case 3:
                return [0,-1];
                break;
        }
    }

    function countTiles($start,$end,$tile) {
        $n = 0;
        for($x=$start[0]; $x<$end[0]+1; $x++) {
            for($y=$start[1]; $y<$end[1]+1; $y++) {
                if($this->getTile($x,$y)==$tile) $n++;
            }
        }
        return $n;
    }

    function inMap($point) {
        if($point[0]<1) return false;
        if($point[1]<1) return false;
        if($point[0]>($this->columns-2)) return false;
        if($point[1]>($this->rows-2)) return false;
        return true;
    }
    function forCavePath($point) {
        if($point[0]<6) if(rand(0,1)==0) return false;
        if($point[1]<6) if(rand(0,1)==0) return false;
        if($point[0]>($this->columns-8)) if(rand(0,1)==0) return false;
        if($point[1]>($this->rows-8)) if(rand(0,1)==0) return false;

        if($point[0]<4) if(rand(0,4)>0) return false;
        if($point[1]<4) if(rand(0,4)>0) return false;
        if($point[0]>($this->columns-5)) if(rand(0,4)>0) return false;
        if($point[1]>($this->rows-5)) if(rand(0,4)>0) return false;

        //if($this->countTiles([$point[0]-1,$point[1]-1], [$point[0]+1,$point[1]+1], '.') > $this->nClosedSpace)
        //    if(rand(0,$this->fClosedSpace)>0) return false;

        if($this->countTiles([$point[0]-2,$point[1]-2], [$point[0]+2,$point[1]+2], '.') > 8)
            if(rand(0,5)>0) return false;
        
        
        return true;
    }
    function randMonster($pos) {
      $minLevel = $this->level;
      do{
        $type = rand(0,$this->monsterTypeN-1);
        $minLevel--;
      } while($this->monsterType[$type]['level'] > $this->level);
//        || $this->monsterType[$type]['level'] < $minLevel);
      return $this->newMonster($pos,$type);
    }
    function newMonster($pos, $type) {
      $level = $this->monsterType[$type]['level'] ?? 5;
      $maxhp = $level<8 ? 16+$level : 24;
      return [
          "x"=>$pos[0],"y"=>$pos[1],"type"=>$type,
          "hp"=>$maxhp,"maxhp"=>$maxhp,"turnTime"=>0
      ];
    }
    function spawnMonster($pos, $name=null) {
        if(!$this->isBlocked($pos)) {
          if($name==null) {
            $this->monsters[] = $this->randMonster($pos);
          } else {
            if($type = $this->findMonsterType($name)) {
              $this->monsters[] = $this->newMonster($pos, $type);
            }
          }
        }
    }
    function isBlocked($pos) {
      $x = $pos[0]; $y = $pos[1];
      if($this->getTile($x,$y)=='#') return true;
      if($this->getTile($x,$y)=='C') return true;
      if($this->getTile($x,$y)==' ') return true;
      if($this->getTile($x,$y)=='>') return true;
      if($this->getTile($x,$y)=='<') return true;
      foreach($this->monsters as $m) {
        if($m[0]==$x && $m[1]==$y) return true;
      }
      foreach($this->objects as $obj) {
        if($obj['x']==$x && $obj['y']==$y) return true;
      }
      return false;
    }
    function randPos($box = null) {
      $pos=[];
      do{
          $pos[0] = rand(1, $this->columns-2);
          $pos[1] = rand(1, $this->rows-2);
      }while($this->isBlocked($pos));
      return $pos;
    }
    function randPosRoom($r) {
      $pos=[];
      do {
          $pos[0] = rand($r[0], $r[0]+$r[2]-1);
          $pos[1] = rand($r[1], $r[1]+$r[3]-1);
      } while($this->isBlocked($pos));
      return $pos;
    }
    function addObject($pos,$type,$args = []) {
      $newobj = ["x"=>$pos[0], "y"=>$pos[1], "type"=>$type];
      if(isset($args['items'])) foreach($args['items'] as $iname) {
          $newobj['items'] = [0,0,self::findItemType($iname)];
      }
      $this->objects[] = $newobj;
    }

    function addBlockObject($room, $type, $args = []) {
      $p = [
        [$room[0], $room[1]],
        [$room[0]+$room[2]-1, $room[1]],
        [$room[0], $room[1]+$room[3]-1],
        [$room[0]+$room[2]-1, $room[1]+$room[3]-1],
        [$room[0]+floor($room[2]/2), $room[1]+floor($room[3]/2)]
      ];

      foreach($p as $pos) {
        $otherobj=false;
        foreach($this->objects as $object) {
          if($object['x']==$pos[0] && $object['y']==$pos[1]) $otherobj=true;
        }
        if($otherobj) continue;
        if($this->map[$pos[0]][$pos[1]]!='.') continue;
        $pathN = $this->countPathTile($pos[0], $pos[1], 1, 1, '.');
        if($pathN==4 || $pathN==9) {
          $newobj = ["x"=>$pos[0], "y"=>$pos[1], "type"=>$type];
          if(isset($args['item'])) {
            $newobj['item'] = $this->findItemType($args['item']);
          }
          $this->objects[] = $newobj;
          return true;
        }
      }

      return false;
    }

    function findObjectType($name) {
      if(is_numeric($name)) return $name;
      foreach($this->objectType as $i=>$ot) {
          if($ot['name'] == $name) return $i;
      }
      return null;
    }
    function findItemType($name) {
      if(is_numeric($name)) return $name;
      foreach($this->itemType as $i=>$it) {
          if($it['name'] == $name) return $i;
      }
      return null;
    }
    function findMonsterType($name) {
      if(is_numeric($name)) return $name;
      foreach($this->monsterType as $i=>$im) {
          if($im['name'] == $name) return $i;
      }
      return null;
    }
    function addItem($pos, $type) {
      $data = [$pos[0], $pos[1], $type];
      if(isset($this->itemType[$type]['hp'])) $data[] = $this->itemType[$type]['hp'];
      $this->items[] = $data;
    }
    function addItemByName($pos,$name) {
      $type = $this->findItemByName($name);
      $this->addItem($pos, $type);
    }
    function findItemByName($name) {
      $type = 0;
      if(is_array($name)) {
        $i = rand(0,count($name)-1);
        $name = $name[$i];
      }
      foreach($this->itemType as $i=>$it) {
          if($it['name'] == $name) $type = $i;
      }
      return $type;
    }
    function addItemByType($pos, $types) {
      $type = $this->findItemByType($types);
      $this->addItem($pos, $type);
    }
    function findItemByType($type) {
      if(is_array($type)) {
        $i = rand(0,count($type)-1);
        $type = $type[$i];
      }
      $tries = 0;
      do {
        $tries++;
        $rtype = rand(0, $this->itemTypeN-1);
      } while($this->itemType[$rtype]['type']!=$type && $tries<200);
      return $rtype;
    }
    function addRandomItem() {
      $this->addItem($this->randPos(), $this->randomItemType());
    }
    function randomItemType() {
      do {
        $rtype = rand(0, $this->itemTypeN-1);
      } while($this->itemType[$rtype]['name'][0]=='+');
      return $rtype;
    }
    function addGroundObject($pos, $name) {
      $type = 0;
      if(is_array($name)) {
        $d = count($name)-1;
        if($d-5>$this->level) $d = $this->level+5;
        $i = rand(0,$d);
        $name = $name[$i];
      }
      foreach($this->objectType as $i=>$ot) {
          if($ot['name'] == $name) $type = $i;
      }
      $this->groundObjects[] = ['x'=>$pos[0], 'y'=>$pos[1], 'type'=>$type];
    }
    function randItem($pos) {
        //do{
            $type = rand(0,$this->itemTypeN-1);
        //}while(abs($this->monsterType[$type]['level'] - $this->level)>1);
        $this->addItem($pos, $type);
    }
    function roomVoronoiTile($pos, $t) {
      $sx=$pos[0];$sy=$pos[1];$w=$pos[2];$h=$pos[3];
      $v = $this->voronoi[$sx+floor($w/2)][$sy+floor($h/2)];

      for ($x = 0; $x < $w; $x++) {
        for ($y = 0; $y < $h; $y++) {
          if($this->map[$sx+$x][$sy+$y]=='.' && $this->voronoi[$sx+$x][$sy+$y]==$v) $this->map[$sx+$x][$sy+$y] = $t;
        }
      }
    }
    function roomTile($pos, $t) {
      $this->replaceTile($pos[0], $pos[1], $pos[2], $pos[3], $t, '.');
    }
    function boxTile($sx, $sy, $w, $h, $t)
    {
      for ($x = 0; $x < $w; $x++) {
        for ($y = 0; $y < $h; $y++) {
          $this->map[$sx+$x][$sy+$y] = $t;
        }
      }
    }
    function replaceTile($sx, $sy, $w, $h, $t, $prv='.')
    {
      for ($x = 0; $x < $w; $x++) {
        for ($y = 0; $y < $h; $y++) {
          if($this->map[$sx+$x][$sy+$y]==$prv) $this->map[$sx+$x][$sy+$y] = $t;
        }
      }
    }
    function countPathTile($sx, $sy, $w, $h)
    {
      $n = 0;
      for ($x = -1; $x < $w+1; $x++) {
        for ($y = -1; $y < $h+1; $y++) {
          //if($sx+$x<0 || $sx+$x>=$this->map_width) return 100;
          //if($sy+$y<0 || $sy+$y>=$this->map_height) return 100;
          if(!in_array($this->map[$sx+$x][$sy+$y], ['C','#',' '])){
            $n++;
          }
        }
      }
      return $n;
    }

    function newPlayer($gameId) {
      $pnk = new gTable('game');
      $game = $pnk->getRow(['id'=>$gameId]);
      $pnk = new gTable('playerclass');
      $playerclass = $pnk->getRow(['id'=>$game['class_id']]);

      $stat = [
        "name"=> $game['name'],
        "className"=> $playerclass['name'],
          "hp" => 24,
          "maxhp" => 24,
          "attack" => 0,
          "strength"=> 0,
          "dexterity"=> 0,
          "intelligence"=> 0,
          "armor" => 0,
          "arrows" => 0,
          "shield" => 0,
          "abilities" => [],
          "inventory" => [],
          "status" => [],
          "lore" => ['items'=>[]],
          "gameTurn" => 0
      ];

      //$i = $playerclass['item'] ? explode(',',$playerclass['item']) : []; 
      //for($j=0;$j<2;$j++) if(isset($i[$j])) {
      //  $type=$this->findItemByName('Candle');
      //  if(($eff = $this->itemType[$type]['effect'] ?? null) && $eff[0]=='+') {
      //    @$stat[substr($eff,1)]++;
      //  } else {
      //    $stat['inventory'][] = ['itemType'=>$type, 'stock'=>1];
      //  }
      //}
      $stat['arrows'] = 6;
      
      if($playerclass['name']=='Hobbit') {
          $stat['strength']-=1;
          $stat['hp']-=4;
          $stat['maxhp']-=4;
          $stat['dexterity']+=2;
          $stat['abilities'][] = "DetectTraps";
          //$stat['abilities'][] = "LockPick";
      }
      if($playerclass['name']=='Ranger') {
        $stat['arrows'] = 6;
      }
      if($playerclass['name']=='Orc') {
        $stat['strength']++;
        $stat['intelligence']--;
        $stat['abilities'][] = "Darkvision";
        $stat['resist'][] = "poison";
        $stat['resist'][] = "disease";
      }
      if($playerclass['name']=='Dwarf') {
        $stat['strength']++;
        $stat['dexterity']--;
        $stat['abilities'][] = "Darkvision";
        $stat['resist'][] = "poison";
      }
      if($playerclass['name']=='Sorcerer') {
          $stat['strength']--;
          $stat['intelligence']++;
      }
      return $stat;
    }

}

