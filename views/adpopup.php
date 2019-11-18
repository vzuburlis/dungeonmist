<?php 
if($c->level%3==0 && $c->level<10) { //if($_COOKIE['amads']=='true') { ?>
<div style="position:absolute;right:0;left:0;top:0;bottom:0;background:rgba(0,0,0,0.95);
  text-align:center;z-index: 1100;padding: 0;overflow-y: scroll;" id="admenu">
  <div class="centered" style="max-height:100%;overflow-y: scroll;">
    <p style="margin-bottom: -15px;">You can support my game by buying from these links:</p>
    <div id="amzn-assoc-ad-18fde7bd-012f-4d52-9b3f-adf64d4c48bf"></div>
    <script async src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=18fde7bd-012f-4d52-9b3f-adf64d4c48bf"></script>
    <br>
    <span onclick="admenu.style.display='none';setGameStatus('play')" class="play-btn">Continue</span>
  </div>
</div>
<?php } ?>

<?php
if($c->level==1 && $c->player['level']==1) { ?>
<div style="position:absolute;right:0;left:0;top:0;bottom:0;background:rgba(0,0,0,0.95);
  text-align:center;z-index: 1100;padding: 0;" id="admenu">
  <div class="centered" style="max-height:100%;">
    <p>
    You are <?=$c->player['name']?> a skilled <?=$playerclass['name']?>, who village was destroyed from dragon Zesonurth the Tyrant. 
    Your quest for vengeance have led you to Misty Mountain, where rumors say that the dragon now rests in the deepest dungeons.
    </p>
    <br>
    <span onclick="admenu.style.display='none';setGameStatus('play')" class="play-btn">Continue</span>
  </div>
</div>
<?php }

/*
    <div id="applixir_vanishing_div" hidden><iframe id="applixir_parent allow=autoplay"></iframe>
    </div>
    <!-- The applixir SDK file has all required CSS and JavaScript resources (use current version)-->
    <script type='text/javascript' src="https://cdn.applixir.com/applixir.sdk3.0m.js"></script>
    <script type="application/javascript">
    invokeApplixirVideoUnit({zoneId: 2679});
    </script>
 */
?>
