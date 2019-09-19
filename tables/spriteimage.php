<?php

return [
  'name'=>'rlspriteimage',
  'fields'=>[
    'name'=>[
      'qtype'=>'VARCHAR(30) NOT NULL'
    ],
    'image'=>[
      'qtype'=>'VARCHAR(120) NOT NULL',
      'type'=>
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
  ]
];
