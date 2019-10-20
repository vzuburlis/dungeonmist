<?php

gila::controller('dungeonrl','dungeonrl/MapController','MapController');

gila::content('playerclass','dungeonrl/tables/playerclass.php');
gila::content('game','dungeonrl/tables/game.php');
gila::content('monster','dungeonrl/tables/monster.php');
gila::content('item','dungeonrl/tables/item.php');

view::setViewFile('login.php', 'dungeonrl');
view::setViewFile('register.php', 'dungeonrl');
view::setViewFile('login-register-success.php', 'dungeonrl');
