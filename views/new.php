<?php
$ppath = gila::base_url().'src/'.GPACKAGE.'/';
$play_url = GPACKAGE.'/play';
$pnk = new gTable('playerclass');
$classes = $pnk->getRows(null);
?>
<link href="<?=$style_css_path?>" rel="stylesheet">
<style>
body{
    font-family: courier new;
    text-align: center;
    color: white;
    background: url(<?=gila::base_url()?>src/<?=GPACKAGE?>/images/dm-guerrero.jpg) no-repeat center center fixed;
    background-color: black;
    background-size: cover;
}
.form-label {
  font-family: 'Berkshire Swash', cursive;
  font-size: 1.5em;
}
#about-game{
    padding: 4em 0;
}
#main {
    padding: 10px;
    max-width: 1000px;
    margin: auto;
    height:100%;
}

</style>
<head>
    <base href="<?=gila::base_url()?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?=view::css("lib/gila.min.css")?>
    <?=view::script("lib/gila.min.js")?>
    <link href="https://fonts.googleapis.com/css?family=Berkshire+Swash" rel="stylesheet">
</head>


<body>
  <div id="maindiv">
    <div id="newgame-title">Character Creation</div>
    <?php if(session::user_id()==0){ ?>
    <div class="alert">In order to save your game you have to 
      <a href="<?=gila::base_url("login")?>">login with your account</a></div>
    <?php } ?>
    <div class="row">
      <div class="gm-8 class-panel">
        <div id="class-selection" style="text-align:center">
          <div v-for="(playerclass,index) in classes" :class="[selectedClass==index ? 'class-selected' : '', 'class-card']" @click="selectedClass=index">
            <div class="class-avatar" :style="classImgStyle(playerclass)"></div>
          </div>
        </div>
        <div id="class-description" v-if="selectedClass!==null">
          <div class="form-label">{{classes[selectedClass].name}}</div>
          <p>{{classes[selectedClass].description}}</p>
        </div>
      </div>
      
      <div class="gm-4">
        <label class="g-form form-label">Character name:</label>
        <input class="g-input" v-model="name"><br><br>
        <button @click="rollName()" class="play-btn"><b>Roll Name</b></button>
        <a href="<?=gila::url('dungeonrl')?>" class="play-btn">Main Menu</a>
        <button @click="startgame()" class="play-btn" :disabled="name==''"><b>Start Game</b></button>
      </div>

    </div>
  </div>
</body>

<?=view::script("src/dungeonrl/vue.min.js")?>
<script>
var nameFr = [
  ['An','Al','B','C','D','Ch','Dr','En','El','G','In','L','M','Os','P','Q','Ur','R','S','W','Z'],
  ['a','e','i','o','u','au','asi','arian','eldo','ou','anier','ogyr','elia','elon'],
  ['ra','ren','la','len','lus','us','rel','kus','gusa','na','nos','ll','th','nir']
]

var app = new Vue({
  el: '#maindiv',
  data: {
    classes: <?=json_encode($classes)?>,
    name: '',
    selectedClass: 0
  },
  methods: {
    classImgStyle: function(playerclass) {
      style = 'background:url("'+playerclass.spriteImg+'") '
      style += '-'+(playerclass.spriteX*16)+'px -'+(playerclass.spriteY*16)+'px; width:16px; height:16px'
      return style 
    },
    startgame: function() {
        classId = this.classes[this.selectedClass].id
        params = 'classId='+classId+'&name='+this.name
        url = '<?=gila::base_url()?><?=GPACKAGE?>/create'
        g.post(url, params, function(data){
          window.location = '<?=gila::base_url()?><?=GPACKAGE?>/play'
        })
    },
    roll: function() {
      this.selectedClass = Math.floor(Math.random()*this.classes.length)
      this.rollName()
    },
    rollName: function() {
      this.name = ''
      for(i in nameFr) {
        this.name += nameFr[i][Math.floor(Math.random()*nameFr[i].length)]
      }
    }
  },
  mounted: function(){
    this.roll()
  }
});

</script>

<?php if(gila::base_url()!='http://localhost/gilacms/') { ?>
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-130027935-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-130027935-1');
</script>
<?php } ?>
