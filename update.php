<?php

$pnk = new gTable('src/dungeonrl/tables/playerclass.php');
$pnk->update();

$pnk = new gTable('src/dungeonrl/tables/monster.php');
$pnk->update();

$pnk = new gTable('src/dungeonrl/tables/item.php');
$pnk->update();

$pnk = new gTable('src/dungeonrl/tables/game.php');
$pnk->update();
