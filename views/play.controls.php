<div id="controls" style="width:10em;height:10em">
  <svg width="100%" height="100%" viewBox="0 0 120 120" >
    <!--path d="M0 40 L40 40 L40 0 L80 0 L80 40 L120 40 L120 80 L80 80 L80 120 L40 120 L40 80 L0 80 L0 40 A"
    style="stroke:#929292;stroke-width:1;stroke-opacity:0.5" fill="none" /-->
    <path d="M0 47 L4 43 L43 43 L43 4 L47 0 L73 0 L77 4 L77 43 L116 43 L120 47 L120 73 L116 77 L77 77 L77 116 L73 120 L47 120 L43 116 L43 77 L4 77 L0 73 L0 47 A"
    style="stroke:#929292;stroke-width:2;stroke-opacity:0.5" fill="none" />
    <path d="M11 60 L32 60 A"
    style="stroke:#929292;stroke-width:2;stroke-opacity:0.5" fill="none" />
    <path d="M109 60 L86 60 A"
    style="stroke:#929292;stroke-width:2;stroke-opacity:0.5" fill="none" />
    <path d="M60 11 L60 32 A"
    style="stroke:#929292;stroke-width:2;stroke-opacity:0.5" fill="none" />
    <path d="M60 109 L60 86 A"
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
  margin: 16px 32px 32px 16px"
  onclick="keypressPlay('e')"></div>
  <div id="playerName">
    <?=$c->player['name']?>
  </div>
 </div>
 <br><div style="display:flex; flex-direction:column;">
  <div><div style="background: rgba(0, 0, 0, 0)
        url('src/dungeonrl/DawnLike/gold.png') repeat scroll -0px -0px;
        width: 16px; height: 16px; transform: scale(2); vertical-align:middle;
        margin-left: 8px"
        style="vertical-align:middle"></div> <span id="pGold"></span></div>
  <div id="eWeapon"><img src="<?=$tile_folder?>attack.png"><span id="pAttack">0<span></div>
  <div id="eShield"><img src="<?=$tile_folder?>shield.png"><span id="pShield">0<span></div>
  <div id="eArmor"><img src="<?=$tile_folder?>armor.png"><span id="pArmor">0<span></div>
 </div>
</div>

<div id="levelBox" style="position:absolute; right:0;">
 <div style="display:inline-flex">
  <div>Level <?=$c->level?></div>
  <div class="com-btn" style="background: rgba(0, 0, 0, 0)
  url('src/dungeonrl/tile/minimap.png') repeat scroll
  -0px -0px; margin: 16px 24px 32px 32px;
  width: 16px; height: 16px; transform: scale(3); vertical-align:middle"
  onclick="toggleMinimap()" style="vertical-align:middle"></div>
 </div>
  <div style="text-align: right;">
    <img src="<?=$tile_folder?>key.png" id="pKey">
    <br><img src="<?=$tile_folder?>chest_key.png" id="pChestKey">
  </div>
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
    <img src="<?=$tile_folder?>potion.png" class="com-btn" onclick="keypressPlay('u')">
  </div>
  <div id="btnAction">
    <img src="<?=$status_folder?>speed.png" class="com-btn" onclick="keypressPlay('\\')">
  </div>
    <div class="div-com" id="btnArrows">
    <img src="<?=$tile_folder?>arrow.png" class="com-btn" onclick="throwArrow()">
    <span id="pArrows" class="pSpan"><span>
  </div>
</div>

<img src="<?=$tile_folder?>downstairs.png" class="com-btn com-down"
  style="display: none; position: absolute; right: 6em; bottom: 1em;"
  onclick="keypressPlay(' ')">
<div class="div-com com-btn" onclick="keypressTarget(32)"
  id="btnCheck" style="display: none; position: absolute; right: 6em; bottom: 1em; background:lightgreen;display:none">
  <img src="<?=$tile_folder?>../images/check-mark.svg" style="width:100%">
</div>

<div id="use-menu">
  <div id="use-menu--title">Use Item <span onclick="keypressUse(27)" class="close">
    <img src="<?=$tile_folder?>../images/close.svg">
  </span></div>
  <div id="use-menu--list"></div>
</div>

<div id="equip-menu">
  <div id="equip-menu--title">Equipment <span onclick="keypressEquip(27)" class="close">
    <img src="<?=$tile_folder?>../images/close.svg">
  </span></div>
  <div id="equip-menu--list"></div>
</div>

<div id="action-menu">
  <div id="action-menu--title">Actions <span onclick="closeActionMenu();" class="close">
    <img src="<?=$tile_folder?>../images/close.svg">
  </span></div>
  <div id="action-menu--list">
  <div class="menu-item" onclick="keypressPlay('h')">h <span class="item-name">Search</span></div>
  <div class="menu-item" onclick="keypressPlay('Z')">Z <span class="item-name">Rest</span></div>
  <div class="menu-item" onclick="keypressPlay('j')">j <span class="item-name">Jump</span></div>
  <div class="menu-item" onclick="keypressPlay('k')">k <span class="item-name">Kick</span></div>
  <div class="menu-item" onclick="keypressPlay('t')">t <span class="item-name">Target</span></div>
  </div>
</div>

<div id="help-menu">
  <div id="help-menu--title">Commands <span onclick="closeHelpMenu();" class="close">
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
    </table>
  </div>
  <div class="menu--title">Game Tips</div>
    <p>Find your way to the next level, you dont have to fight every monster. On deadends search for hidden doors. Use candle or lamp to light the path in the darkest levels.</p>
  </div>
</div>

<?php

/*
  <table>
  <tr>
    <td>
    <td>
      <svg class="dir-btn" viewBox="0 0 28 28" onclick="keyPress(38)">
        <line x1="4" y1="19" x2="15" y2="8" style="stroke:#929292;stroke-width:3"></line>
        <line x1="24" y1="19" x2="14" y2="8" style="stroke:#929292;stroke-width:3"></line>
      </svg>
    <td>
  <tr>
    <td>
      <svg class="dir-btn" viewBox="0 0 28 28" onclick="keyPress(37)">
        <line y1="4" x1="19" y2="15" x2="8" style="stroke:#929292;stroke-width:3"></line>
        <line y1="24" x1="19" y2="14" x2="8" style="stroke:#929292;stroke-width:3"></line>
      </svg>
    <td>
    <td>
      <svg class="dir-btn" viewBox="0 0 28 28" onclick="keyPress(39)">
        <line y1="4" x1="9" y2="15" x2="20" style="stroke:#929292;stroke-width:3"></line>
        <line y1="24" x1="9" y2="14" x2="20" style="stroke:#929292;stroke-width:3"></line>
      </svg>
  <tr>
    <td>
    <td>
      <svg class="dir-btn" viewBox="0 0 28 28" onclick="keyPress(40)">
        <line x1="4" y1="9" x2="15" y2="20" style="stroke:#929292;stroke-width:3"></line>
        <line x1="24" y1="9" x2="14" y2="20" style="stroke:#929292;stroke-width:3"></line>
      </svg>
    <td>
  </table>

*/
