<div id="controls" style="width:10em;height:10em">
<?php if(!isset($_COOKIE['ref']) || $_COOKIE['ref']!=='kongregate') { ?>
  <svg width="100%" height="100%" viewBox="0 0 120 120" >
    <path d="M0 47 L4 43 L43 43 L43 4 L47 0 L73 0 L77 4 L77 43 L116 43 L120 47 L120 73 L116 77 L77 77 L77 116 L73 120 L47 120 L43 116 L43 77 L4 77 L0 73 L0 47"
    style="stroke:#929292;stroke-width:2;stroke-opacity:0.5" fill="none" />
    <path d="M11 60 L32 60"
    style="stroke:#929292;stroke-width:2;stroke-opacity:0.5" fill="none" />
    <path d="M109 60 L86 60"
    style="stroke:#929292;stroke-width:2;stroke-opacity:0.5" fill="none" />
    <path d="M60 11 L60 32"
    style="stroke:#929292;stroke-width:2;stroke-opacity:0.5" fill="none" />
    <path d="M60 109 L60 86"
    style="stroke:#929292;stroke-width:2;stroke-opacity:0.5" fill="none" />
  </svg>

  <table style="width:100%;height:100%;position:absolute;top:0;left:0"
    onclick="event.preventDefault()">
  <tr>
    <td><div onclick="event.preventDefault()"></div>
    <td><div ontouchstart="keyPress(38)"></div>
    <td><div onclick="event.preventDefault()"></div>
  <tr>
    <td><div ontouchstart="keyPress(37)"></div>
    <td><div ontouchstart="keyPress(90)"></div>
    <td><div ontouchstart="keyPress(39)"></div>
  <tr>
    <td><div onclick="event.preventDefault()"></div>
    <td><div ontouchstart="keyPress(40)"></div>
    <td><div onclick="event.preventDefault()"></div>
  </table>
<?php } ?>
</div>

<div id="controls-commands">
  e Equip &nbsp;&nbsp;u Use&nbsp;&nbsp;? Help
</div>


<p id="msgBox"></p>
<div id="statBox">
 <div style="display:inline-flex">
  <div class="com-btn" style="background: rgba(0, 0, 0, 0)
  url('src/dungeonrl/DawnLike/Characters/Player0.png') repeat scroll
  -<?=$c->player['sprite'][1]*16?>px -<?=$c->player['sprite'][2]*16?>px;
  width: 16px; height: 16px; transform: scale(3); vertical-align:middle;
  margin: 16px 32px 32px 16px;"
  onclick="keypressPlay('e')"></div>
  <div id="playerName">
    <?=$c->player['name']?><br><span id="pXP" style="font-family:'Retro Gaming';"></span>
  </div>
  
 </div>
 <br><div id="statBoxStats" style="display:flex; flex-direction:column;">
  <div>
    <div class="stat--img" style="background: rgba(0, 0, 0, 0)
        url('src/dungeonrl/DawnLike/gold.png') repeat scroll -0px -0px;">
    </div> <span id="pGold"></span>
  </div>
  <div id="eWeapon" style="display:none">
    <div id="eWeaponImg" class="stat--img"></div> <span id="pAttack">0<span>
  </div>
  <div id="eShield" style="display:none">
    <div id="eShieldImg" class="stat--img"></div> <span id="pShield">0<span>
  </div>
  <div id="eArmor" style="display:none">
    <div id="eArmorImg" class="stat--img"></div> <span id="pArmor">0<span>
  </div>
 </div>
</div>

<div id="levelBox" style="position:absolute; right:0; text-align:right">
  <div style="display:inline-flex">
   <div>Level <?=$c->level?></div>
   <div class="com-btn" style="background: rgba(0, 0, 0, 0)
   url('src/dungeonrl/tile/minimap.png') repeat scroll
   -0px -0px; margin: 16px 24px 32px 32px;
   width: 16px; height: 16px; transform: scale(3); vertical-align:middle"
   onclick="toggleMinimap()" style="vertical-align:middle"></div>
  </div>
  <br>
  <div style="text-align: right;">
    <img src="<?=$tile_folder?>key.png" id="pKey">
    <br><img src="<?=$tile_folder?>chest_key.png" id="pChestKey">
  </div>
</div>

<div id="btnTabsM" style="z-index:1001;display:none">
  <div class="com-btn" style="background: rgba(0, 0, 0, 0)
    url('src/dungeonrl/DawnLike/Characters/Player0.png') repeat scroll
    -<?=$c->player['sprite'][1]*16?>px -<?=$c->player['sprite'][2]*16?>px;
    width: 16px; height: 16px; transform: scale(3); vertical-align:middle;
    margin: 32px 32px 16px 32px;"
    onclick="setGameMenuKey('e')"></div>
  <div class="com-btn" style="background: rgba(0, 0, 0, 0)
    url('src/dungeonrl/DawnLike/Basic.png') repeat scroll
    -0px -64px;
    width: 16px; height: 16px; transform: scale(3); vertical-align:middle;
    margin: 32px 32px 16px 32px;"
    onclick="setGameMenuKey('u')"></div>
  <div class="com-btn" style="background: rgba(0, 0, 0, 0)
    url('src/dungeonrl/DawnLike/Objects/Effect0.png') repeat scroll
    -0px -400px;
    width: 16px; height: 16px; transform: scale(3); vertical-align:middle;
    margin: 32px 32px 16px 32px;"
    onclick="setGameMenuKey('t')"></div>
  <div class="com-btn" style="background: rgba(0, 0, 0, 0)
    url('src/dungeonrl/DawnLike/status.png') repeat scroll
    -48px -0px;
    width: 16px; height: 16px; transform: scale(3); vertical-align:middle;
    margin: 32px 32px 16px 32px;"
    onclick="setGameMenuKey('\\')"></div>
</div>

<div id="play-btn-container">
  <a href="<?=$game_url?>/<?=$c->gameId?>" class="play-btn">Continue</a>
</div>

<div id="commands">
  <div class="mobi-btn">
  <div class="div-com com-btn mobi-btn" id="btnCancelM" style="background:red;display:none" onclick="keyPress(27)">
    <img src="<?=$tile_folder?>../images/close.svg" style="width:100%">
  </div>
  <div class="div-com com-btn mobi-btn" id="btnCancel" style="background:red;display:none" onclick="keypressTarget(27)">
    <img src="<?=$tile_folder?>../images/close.svg" style="width:100%">
  </div>
  <div class="div-com com-btn mobi-btn" id="btnCancelD" style="background:red;display:none" onclick="keypressDirection(27)">
    <img src="<?=$tile_folder?>../images/close.svg" style="width:100%">
  </div>
  </div>
  <div id="btnUse">
    <div class="com-btn" style="background: rgba(0, 0, 0, 0)
    url('src/dungeonrl/DawnLike/Items/Chest0.png') repeat scroll
    -0px -32px;
    width: 16px; height: 16px; transform: scale(4); vertical-align:middle;
    margin: 16px 32px 32px 16px;"
    onclick="keypressPlay('u')"></div>
    <!--img src="<?=$tile_folder?>potion.png" class="com-btn" onclick="keypressPlay('u')"-->
  </div>
  <div id="btnAction">
    <div class="com-btn" style="background: rgba(0, 0, 0, 0)
    url('src/dungeonrl/DawnLike/status.png') repeat scroll
    -48px -0px;
    width: 16px; height: 16px; transform: scale(4); vertical-align:middle;
    margin: 16px 32px 48px 16px;"
    onclick="keypressPlay('\\')"></div>
    <!--img src="<?=$status_folder?>speed.png" class="com-btn" onclick="keypressPlay('\\')"-->
  </div>
  <div class="div-com" id="btnArrows">
    <div class="com-btn" style="background: rgba(0, 0, 0, 0)
    url('src/dungeonrl/DawnLike/Items.png') repeat scroll
    -0px -32px;
    width: 16px; height: 16px; transform: scale(4); vertical-align:middle;
    margin: 16px 32px 48px 16px;"
    onclick="throwArrow()"></div>
    <!--img src="<?=$tile_folder?>arrow.png" class="com-btn" onclick="throwArrow()"-->
    <span id="pArrows" class="pSpan"><span>
  </div>
</div>

<img src="<?=$tile_folder?>downstairs.png" class="com-btn com-down"
  style="display: none; position: absolute; right: 6em; bottom: 1em;"
  onclick="keypressPlay(' ')">
<div class="div-com com-btn mobi-btn" onclick="keypressTarget(32)"
  id="btnCheck" style="display: none; position: absolute; right: 6em; bottom: 1em; background:lightgreen;">
  <img src="<?=$tile_folder?>../images/check-mark.svg" style="width:100%">
</div>

<div id="description-menu" class="menu">
  <div class="menu--title"><span onclick="keyPress(27)" class="close">
    <img src="<?=$tile_folder?>../images/close.svg">
  </span></div>
  <div id="description-menu--list" class="menu--list"></div>
</div>

<div id="throw-menu" class="menu">
  <div class="menu--title">Throw Item<span onclick="keyPress(27)" class="close">
    <img src="<?=$tile_folder?>../images/close.svg">
  </span></div>
  <div id="throw-menu--list" class="menu--list"></div>
</div>

<div id="game-menu" class="menu">
  <div class="menu--title"><span onclick="keyPress(27)" class="close">
    <img src="<?=$tile_folder?>../images/close.svg">
  </span></div>
  <div id="game-menu--list" class="menu--list"></div>
</div>

<div id="use-menu" class="menu">
  <div id="use-menu--title" class="menu--title">Use Item <span onclick="keypressUse(27)" class="close">
    <img src="<?=$tile_folder?>../images/close.svg">
  </span></div>
  <div id="use-menu--list" class="menu--list"></div>
</div>

<div id="pick-menu" class="menu">
  <div id="pick-menu--title" class="menu--title">Pick Item <span onclick="keypressPick(27)" class="close">
    <img src="<?=$tile_folder?>../images/close.svg">
  </span></div>
  <div id="pick-menu--list" class="menu--list"></div>
</div>

<div id="equip-menu" class="menu">
  <div id="equip-menu--title" class="menu--title">Equipment <span onclick="keypressEquip(27)" class="close">
    <img src="<?=$tile_folder?>../images/close.svg">
  </span></div>
  <div id="equip-menu--list" class="menu--list"></div>
</div>

<div id="action-menu" class="menu">
  <div id="action-menu--title" class="menu--title">Actions <span onclick="closeActionMenu();" class="close">
    <img src="<?=$tile_folder?>../images/close.svg">
  </span></div>
  <div id="action-menu--list" class="menu--list">
  <div class="menu-item" onclick="keypressPlay('h')">h <span class="item-name">Search</span></div>
  <div class="menu-item" onclick="keypressPlay('Z')">Z <span class="item-name">Rest</span></div>
  <div class="menu-item" onclick="keypressPlay('j')">j <span class="item-name">Jump</span></div>
  <div class="menu-item" onclick="keypressPlay('k')">k <span class="item-name">Kick</span></div>
  <div class="menu-item" onclick="keypressPlay('t')">t <span class="item-name">Throw weapon</span></div>
  <div class="menu-item" onclick="keypressPlay('l')">l <span class="item-name">Look around</span></div>
  <div class="menu-item" onclick="keypressPlay('V')">V <span class="item-name">View from next tile</span></div>
  </div>
</div>

<div id="help-menu">
  <div id="help-menu--title" class="menu--title">Commands <span onclick="closeHelpMenu();" class="close">
    <img src="<?=$tile_folder?>../images/close.svg">
  </span></div>
  <div id="help-menu--list">
    <table>
      <tr><td>e&nbsp;<td>Equip weapon/armor
      <tr><td>u&nbsp;<td>Use item
      <tr><td>z&nbsp;<td>Wait for one turn
      <tr><td>Z&nbsp;<td>Rest and regenerate some health
      <tr><td>h&nbsp;<td>Search for hidden doors or traps
      <tr><td>j&nbsp;<td>Jump
      <tr><td>k&nbsp;<td>Kick
      <tr><td>f&nbsp;<td>Fire arrow
      <tr><td>t&nbsp;<td>Throw weapon
      <tr><td>l&nbsp;<td>Look around
      <tr><td>V&nbsp;<td>View from next tile
    </table>
  </div>
  <div class="menu--title">Game Tips</div>
    <p>Find your way to the next level, you dont have to fight every monster. On deadends search for hidden doors. Use candle or lamp to light the path in the darkest levels.</p>
  </div>
</div>
