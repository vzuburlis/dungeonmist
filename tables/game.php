<?php

return [
  'name'=>'rlgame',
  'title'=> 'Games',
  'id'=>'id',
  'tools'=>['add','csv'],
  'commands'=> ['edit','delete'],
  'pagination'=>25,
  'permissions'=>[
    'create'=>['admin'],
    'update'=>['admin'],
    'delete'=>['admin']
  ],
  'fields'=>[
    'id'=> [
      'title'=>'ID',
      'create'=>false,'edit'=>false
    ],
    'user_id'=>[
      'qtype'=>'INT DEFAULT 0'
    ],
    'class_id'=>[
      'qtype'=>'INT DEFAULT 0',
      'type'=>'select',
      'qoptions'=>'SELECT id,`name` FROM rlplayerclass'
    ],
    'name'=>[
      'qtype'=>'VARCHAR(120) NOT NULL'
    ],
    'level'=>[
      'qtype'=>'INT DEFAULT 1'
    ],
    'game_turns'=>[
      //'qcolumn'=>'FORMAT(game_turns/10,0)',
      'qtype'=>'INT DEFAULT 0'
    ],
    'start_time'=>[
      'qtype'=>'INT DEFAULT NULL',
      'edit'=>false
    ],
    'end_time'=>[
      'qtype'=>'INT DEFAULT NULL',
      'list'=>false
    ],
    'game_time'=>[
      'qcolumn'=>'(CASE WHEN end_time IS NULL THEN 0 ELSE FORMAT((end_time-start_time)/60,1) END)'
    ],
    'rating'=>[
      'qtype'=>'TINYINT DEFAULT 1',
      'list'=>false
    ],
    'feedback'=>[
      'qtype'=>'VARCHAR(500)'
    ]
  ]
];
