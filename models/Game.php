<?php

class Game {

  static function loadMap() {
      $map = [];
      return $map;
  }

  static function create($name, $class) {
    global $db;
    $db->query('INSERT INTO rlgame(`user_id`, `name`, `class_id`, `level`, `start_time`,`feedback`)
      VALUES(?,?,?,1,?);', [
      session::user_id(), $name, $class, time()//, $_COOKIE['ref']??''
    ]);
    $gameId = $db->insert_id;
    //$monsterType = json_decode(file_get_contents('src/'.GPACKAGE.'/data/monsters.json'),true);
    $itemType = json_decode(file_get_contents('src/'.GPACKAGE.'/data/items.json'),true);
    $itemType = self::shuffleItems($itemType, "scroll");
    $itemType = self::shuffleItems($itemType, "potion", true);
    $itemType = self::nameLoremItems($itemType, "Scroll of ");
    $path = gila::dir(LOG_PATH.'/games/'.$gameId.'/');
    //file_put_contents($path.'monsters.json', json_encode($monsterType));
    file_put_contents($path.'items.json', json_encode($itemType));

    return $gameId;
  }

  static function moveLevel($gameId, $newLevel, $turns=null) {
    global $db;
    $db->query("UPDATE rlgame set `level`=? WHERE `level`<? AND id=?;",
      [$newLevel,$newLevel,$gameId]);
    if($turns) {
      $db->query("UPDATE rlgame set `game_turns`=? WHERE id=?;", [intval($turns), $gameId]);
    }
  }

  static function endgame($gameId) {
    global $db;
    $db->query("UPDATE rlgame set `end_time`=? WHERE id=?;", [time(), $gameId]);
  }

  static function feedback($gameId, $feedback) {
    global $db;
    $db->query("UPDATE rlgame set `feedback`=? WHERE id=?;", [$feedback, $gameId]);
  }

  static function nameLoremItems($items, $prefix) {
    $p = ["leo","diam","sollicitudin","tempor","id","nunc","consequat","interdum","varius","sit","amet","eget","velit","aliquet","sagittis","id","consectetur","purus","ut","faucibus","ut","ornare","lectus","sit","amet","est","placerat","in","egestas","erat","nec","ullamcorper","sit","amet","risus","nullam","eget","felis","eget","sem","viverra","eget","sit","amet","tellus","orci","nulla","pellentesque","dignissim","enim","sit","amet","venenatis","fringilla","ut","morbi","tincidunt","augue","interdum","velit","euismod","in","velit","laoreet","id","donec","neque","justo","nec","ultrices","dui","sapien","adipiscing","at","in","tellus","integer","feugiat","scelerisque","suspendisse","faucibus","interdum","posuere","lorem"];
    $names = [];
    foreach($items as $i=>$item) if(strpos($item['name'], $prefix)===0) {
      do {
        $name=''; $word='';
        do {
          $word = $p[rand(0,count($p)-1)];
          if(strpos($name, $word)===false) $name .= $word.' ';
        } while(strlen($name)<10);
      } while(in_array($name, $names));
      $name = trim($name);
      $names[] = $name; 
      $items[$i]['lorem'] = $prefix.ucwords($name);
    }
    return $items;
  }

  static function shuffleItems($items, $type, $lorem=false) {
      // shuffle items by type
    $itemN = count($items);
    foreach($items as $i=>$item) if(isset($item['type']) && $item['type']==$type) {
      do{
          $new = rand(0, $itemN-1);
      } while(!isset($items[$new]['type']) || $items[$new]['type']!=$type || $new==$i);
      $tmp = $item;
      $items[$i]['sprite'] = $items[$new]['sprite'];
      $items[$new]['sprite'] = $tmp['sprite'];
      if($lorem) {
        $items[$i]['lorem'] = $items[$new]['lorem'];
        $items[$new]['lorem'] = $tmp['lorem'];
      }
    }
    return $items;
  }


}
