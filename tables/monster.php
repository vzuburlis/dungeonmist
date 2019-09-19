<?php

return [
  'name'=>'rlmonster',
  'title'=> 'Monsters',
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
    'spriteImg'=>[
      'qtype'=>'VARCHAR(120)',
      //'display'=>"dv='<div style=\"background: rgba(0, 0, 0, 0) url(\''+cv+'\') repeat scroll -'+(16*parseInt(rv[3]))+'px -'+(16*parseInt(rv[4]))+'px; width: 16px; height: 16px;transform:scale(1.8)\"></div>'",// 'list'=>false,
      'type'=>'media'
    ],
    'name'=>[
      'qtype'=>'VARCHAR(120) NOT NULL'
    ],
    'spriteX'=>[
      'qtype'=>'TINYINT DEFAULT 0', 'show'=>false
    ],
    'spriteY'=>[
      'qtype'=>'TINYINT DEFAULT 0', 'show'=>false
    ],
    'description'=>[
      'qtype'=>'TEXT',
      'type'=>'textarea'
    ],
    'level'=>[
      'qtype'=>'TINYINT DEFAULT 0'
    ],
    'class'=>[
      'qtype'=>'VARCHAR(1)',
      'options'=>['z'=>'Undead', 'h'=>'Humanoid', 'r'=>'Rodent', 'b'=>'Flying', 'i'=>'Insect', 'w'=>'Crawling']
    ],
    'items'=>[
      'qtype'=>'VARCHAR(200)'
    ],
    'abilities'=>[
      'qtype'=>'VARCHAR(200)'
    ]
  ]
];
