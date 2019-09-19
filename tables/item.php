<?php

return [
  'name'=>'rlitem',
  'title'=> 'Items',
  'id'=>'id',
  'tools'=>['add','csv'],
  'commands'=> ['edit','delete'],
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
    'name'=>[
      'qtype'=>'VARCHAR(120) NOT NULL'
    ],
    'spriteImg'=>[
      'qtype'=>'VARCHAR(120)',
      'type'=>'media'
    ],
    'spriteX'=>[
      'qtype'=>'TINYINT DEFAULT 0'
    ],
    'spriteY'=>[
      'qtype'=>'TINYINT DEFAULT 0'
    ],
    'description'=>[
      'qtype'=>'TEXT',
      'type'=>'textarea'
    ],
    'level'=>[
      'qtype'=>'TINYINT DEFAULT 1'
    ],
    'type'=>[
      'qtype'=>'VARCHAR(1)',
      'options'=>['/'=>'weapon', '!'=>'potion', '['=>'Armor', ')'=>'Shield', '?'=>'Scroll', ']'=>'Spellbook']
    ],
    'hp'=>[
      'qtype'=>'TINYINT DEFAULT 0'
    ],
    'effect'=>[
      'qtype'=>'VARCHAR(20)',
      'options'=>['-','heal','poison','lighting','confuze','blind']
    ],
    'effect_time'=>[
      'qtype'=>'TINYINT DEFAULT 0'
    ],
    'target'=>[
      'qtype'=>'VARCHAR(10)',
      'options'=>['-','self','enemies','select']
    ],
    'class'=>[
      'qtype'=>'VARCHAR(10)',
      'options'=>['-'=>'-','z'=>'undead','o'=>'orc']
    ],
    'rarity'=>[
      'qtype'=>'TINYINT DEFAULT 1'
    ]
  ]
];
