<?php

return [
  'name'=>'rlplayerclass',
  'title'=> 'Classes',
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
    'item'=>[
      'qtype'=>'VARCHAR(200)'
    ]
  ]
];
