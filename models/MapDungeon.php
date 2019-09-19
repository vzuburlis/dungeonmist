<?php

class MapDungeon
{
  public $mapHeight = 36;
  public $mapWidth = 36;
  public $map = [];
  public $mapRev = [];
  public $room = [];
  public $door = [];
  public $maxLevel = 0;
  public $maxLevelRoom = 0;
  public $startpoint = [];
  public $secretDoor=[];
  public $openDoor=[];
  public $entries=[];
  public $voronoi = [];
  public $dir = [[0,-1],[1,0],[0,1],[-1,0]]; // up right down left

    function __construct($w, $h) {
      $this->mapHeight = (int)$h;
      $this->mapWidth = (int)$w;
    }

    function createDungeon()
    {
      do{
        $this->room = [];
        $this->door = [];
        $this->secretDoor = [];
        $this->openDoor = [];
        $this->map = [];
        $this->mapRev = [];
        $this->maxLevel = 0;
        $this->maxLevelRoom = 0;
        for ($x = 0; $x < $this->mapWidth; $x++) {
          for ($y = 0; $y < $this->mapHeight; $y++) {
            $this->map[$x][$y] = '#';
            $this->mapRev[$x][$y] = 0;
          }
        }
        $startx = rand(3, $this->mapWidth-5);
        $starty = rand(3, $this->mapHeight-5);
        $this->startpoint = [$startx, $starty];
        $this->addFirstRoom($startx-2, $starty-2, 4, 4);
      }while(count($this->room)<8);
      //$this->map[$this->startpoint[0]][$this->startpoint[1]] = '<';
      $lastroom = $this->room[$this->maxLevelRoom];
      $endx = rand($lastroom[0], $lastroom[0]+$lastroom[2]-1);
      $endy = rand($lastroom[1], $lastroom[1]+$lastroom[3]-1);
      $this->map[$endx][$endy] = '>';
      $this->entries = [
        'upstairs'=> [$starx, $starty],
        'downstairs'=> [$endx, $endy]
      ];

      $this->createVoronoi();
      for($i=0; $i<4; $i++) if(rand(0,2)==0) {
        $g = $this->getVoronoiGroup(rand(0,$this->mapWidth-1),rand(0,$this->mapHeight-1));
        $tile = [' ',' ','='][rand(0,1)];
        $old = null;
        if($tile==' ') $old='#';
        $this->setTileByVoronoi($tile, $g, $old);
      }

    }

    function addFirstRoom($sx, $sy, $w, $h)
    {
      $tries=0;
      $this->boxTileB($sx,$sy,$w,$h,'.','#');
      $this->room[] = [$sx,$sy,$w,$h];
      $this->door[] = [];
      $done = 0;
      do{
        $tries++;
        $rd = rand(0, 3);
        switch($rd) {
          case 0: $res=$this->addLinkRoom($sx+$this->dice($w), $sy-1, $rd); break; 
          case 1: $res=$this->addLinkRoom($sx+$w, $sy+$this->dice($h), $rd); break; 
          case 2: $res=$this->addLinkRoom($sx+$this->dice($w), $sy+$h, $rd); break; 
          case 3: $res=$this->addLinkRoom($sx-1, $sy+$this->dice($h), $rd); break; 
        }
        if($res) $done++;
      } while($done==0 || $tries<6);
      //exit;
    }

    function addLinkRoom($lx, $ly, $d, $roomLevel=1)
    {
      //if(count($this->room)>12) return false;
      $roomN = count($this->room)-1;
      // link
      $sx=$lx;
      $sy=$ly;
      $length = rand(0,rand(0,6));
      $w = $this->dir[$d][0]*$length + ($this->dir[$d][0]==0?1:0);
      $h = $this->dir[$d][1]*$length + ($this->dir[$d][1]==0?1:0);
      if($this->dir[$d][0]>0) $sx++;
      if($this->dir[$d][1]>0) $sy++;
      $nx = $sx+$w-1;
      $ny = $sy+$h-1;
      if($this->dir[$d][0]>0) $nx++;
      if($this->dir[$d][1]>0) $ny++;
      if($w<0) { $sx+=$w; $w=abs($w); } 
      if($h<0) { $sy+=$h; $h=abs($h); }

      if(!$this->freeFromTile($sx, $sy, $w, $h, '.')) return false;

      $rw = rand(2,3)+rand(0,3);
      $rh = rand(2,3)+rand(0,3);
    
      $rsx=$nx;
      $rsy=$ny;
      if($this->dir[$d][0]<0)  $rsx-=$rw;
      if($this->dir[$d][1]<0)  $rsy-=$rh;
      if($this->dir[$d][0]>0)  $rsx++;
      if($this->dir[$d][1]>0)  $rsy++;
      if($this->dir[$d][0]!=0) $rsy-=$this->dice($rh);
      if($this->dir[$d][1]!=0) $rsx-=$this->dice($rw);
      if(!$this->freeFromTile($rsx, $rsy, $rw, $rh, '.')) return false;

      $this->boxTileB($rsx, $rsy, $rw, $rh, '.', '#');
      $this->boxTileB($sx, $sy, $w, $h, '.', '#');
      if($roomLevel>$this->maxLevel) {
        $this->maxLevel = $roomLevel;
        $this->maxLevelRoom = $roomN+1;
      }

      // create shortcuts
      $_y = intval($rsy+$rh/2);
      $_x = intval($rsx+$rw/2);
      $pos = [
        ['pos'=>[$rsx-1,$_y], 'con'=>[$rsx, $_y]],
        ['pos'=>[$rsx+$rw+1,$_y], 'con'=>[$rsx+$rw, $_y]],
        ['pos'=>[$_x,$rsy-1], 'con'=>[$_x, $rsy]],
        ['pos'=>[$_x,$rsy+$rh+1], 'con'=>[$_x, $rsy+$rh]]
      ];
      foreach($pos as $p) {
        if(!$this->isBlocked($p['pos'])) {
          if($room = $this->getRoom($p['pos'])) {
            if(abs($room-$roomN-1)<8) {
              $this->openDoor[] = $p['con'];
            } else {
              $this->secretDoor[] = $p['con'];
            }
          }
        }
      }

      $this->map[$nx][$ny] = '.';
      $this->map[$lx][$ly] = '.';
      $this->door[] = [[$nx,$ny], [$lx,$ly]];
      $this->room[] = [$rsx, $rsy, $rw, $rh];

      $tries=0;
      $done=0;
      do {
        $tries++;
        $rd = rand(0,3);
        $res=false;
        switch($rd) {
          case 0: $res=$this->addLinkRoom($rsx+$this->dice($rw), $rsy-1, $rd, $roomLevel+1); break; 
          case 1: $res=$this->addLinkRoom($rsx+$rw, $rsy+$this->dice($rh), $rd, $roomLevel+1); break; 
          case 2: $res=$this->addLinkRoom($rsx+$this->dice($rw), $rsy+$rh, $rd, $roomLevel+1); break; 
          case 3: $res=$this->addLinkRoom($rsx-1, $rsy+$this->dice($rh), $rd, $roomLevel+1); break; 
        }
        if($res) $done++;
      } while($done<3 && $tries<10);
      return true;
    }

    function dice($a, $b=0)
    {
      return rand(0, $a-1)+$b;
    }

    function freeFromTile($sx, $sy, $w, $h, $t)
    {
      for ($x = -1; $x < $w+1; $x++) {
        for ($y = -1; $y < $h+1; $y++) {
          if($this->inMap([$sx+$x, $sy+$y])==false) return false;
          if($this->map[$sx+$x][$sy+$y]==$t) {
            return false;
          }
        }
      }
      return true;
    }
  
    function roomTile($box, $t)
    {
      $this->boxTile($pos[0], $pos[1], $pos[2], $pos[3], $t);
    }
  
    function boxTile($sx, $sy, $w, $h, $t)
    {
      for ($x = 0; $x < $w; $x++) {
        for ($y = 0; $y < $h; $y++) {
          $this->map[$sx+$x][$sy+$y] = $t;
        }
      }
    }
  
    function boxTileB($sx, $sy, $w, $h, $t, $tb)
    {
      $this->boxTile($sx-1, $sy-1, $w+2, $h+2, $tb);
      $this->boxTile($sx, $sy, $w, $h, $t);
    }
  
    function isTile($pos, $tile)
    {
      if($this->inMap($pos)) if($this->map[$pos[0]][$pos[1]]==$tile) return true;
      return false;
    }

    function getRoom($pos)
    {
      foreach($this->room as $k=>$room) {
        if($room[0]<=$pos[0] && $room[1]<=$pos[1]
          && $room[2]>=$pos[0]-$room[0] && $room[3]>=$pos[1]-$room[1]) {
            return $k;
          }
      }
      return null;
    }

    function isBlocked($pos)
    {
      if($this->map[$pos[0]][$pos[1]]!='.') return true;
      return false;
    }
  
    function inMap($p)
    {
      if($p[0] < 1) return false;
      if($p[1] < 1) return false;
      if($p[0] > $this->mapWidth-2) return false;
      if($p[1] > $this->mapHeight-2) return false;
      return true;
    }

    function createVoronoi()
    {
      $this->voronoi = [];
      $this->voronoiPoint = [];
      $n=0;
      $marginx = 3+floor(0.5*$this->mapWidth%6);
      $marginy = 3+floor(0.5*$this->mapHeight%6);

      for($i=$marginx; $i<$this->mapWidth; $i+=6) {
        for($j=$marginy; $j<$this->mapHeight; $j+=6) {
          $this->voronoiPoint[] = [rand($i-3,$i+3), rand($j-3,$j+3)];
          $n++;
        }
      }
      
      for($i=0; $i<$this->mapWidth; $i++){
        $this->voronoi[$i] = [];
        for($j=0; $j<$this->mapHeight; $j++){
          $this->voronoi[$i][$j] = $this->getVoronoiGroup($i,$j);
        }
      }
    }

  function setTileByVoronoi($tile, $group, $oldTile=null) {
    for($i=1; $i<$this->mapWidth-1; $i++){
      for($j=0; $j<$this->mapHeight-1; $j++){
        if($group==$this->voronoi[$i][$j] &&
          ($oldTile==null || $this->map[$i][$j]==$oldTile)) $this->map[$i][$j] = $tile;
      }
    }
  }

  function getVoronoiGroup($x,$y, $default=null) {
    $dist = 10000;
    $return = $default;
    foreach($this->voronoiPoint as $group=>$p) {
      $manhattan_distance = abs($x-$p[0])+abs($y-$p[1]);
      if($manhattan_distance<$dist) {
        $dist = $manhattan_distance;
        $return = $group;
      }
    }
    return $return;
  }

}
