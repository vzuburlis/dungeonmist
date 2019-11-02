<?php if($c->level%2==0 && $c->level<20) { //if($_COOKIE['amads']=='true') { ?>
<div style="position:absolute;right:0;left:0;top:0;bottom:0;background:rgba(0,0,0,0.95);
  text-align:center;z-index: 1100;padding: 0;" id="admenu">
  <div class="centered" style="max-height:100%;">
    <p style="margin-bottom: -15px;">You can support my game by buying from these links:</p>
    <div id="amzn-assoc-ad-18fde7bd-012f-4d52-9b3f-adf64d4c48bf" style="max-height: 50%;"></div>
    <script async src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=18fde7bd-012f-4d52-9b3f-adf64d4c48bf"></script>
    <br>
    <span onclick="admenu.style.display='none';setGameStatus('play')" class="play-btn">Continue</span>
  </div>
</div>
<?php } ?>
