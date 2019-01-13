<?php
$play_url = 'towerofundead/play';
?>
<style>
body{
    font-family: courier new;
    text-align: center;
    color: white;
    background: url(<?=gila::base_url()?>src/<?=GPACKAGE?>/images/bg.png) no-repeat center center fixed;
    background-color: black;
    background-size: cover;
}

#game-title{
    font-family: 'Berkshire Swash', cursive;
    font-size: 4em;
    padding: 80px 0;
}
#about-game{
    padding: 4em 0;
}

#main {
    padding: 10px;
    background: rgba(0,0,0,0.5);
}
#msgBox{ top:0;}
#statBox { bottom:0; display:grid; grid-template-columns:1fr 1fr 1fr 1fr;font-size:24px}
#statBox img { width: 32px; height:32px;}
#statBox span { padding: 4px; }
.play-btn {
    text-transform: uppercase;
    padding:1em 2em;
    font-size:1.5em;
    font-weight:bold;
    border-radius:0.5em;
    border: 2px solid #8888b4;
    color: #8888b4;
}
.play-btn:hover {
    color: white;
    background: #8888b4;
}
button{
    font-size: 3em;
}
</style>
<head>
    <base href="<?=gila::base_url()?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?=view::css("lib/gila.min.css")?>
    <?=view::script("lib/gila.min.js")?>
    <link href="https://fonts.googleapis.com/css?family=Berkshire+Swash" rel="stylesheet">
</head>
<!--
    Credits
    monsters: Henrique Lazarini
    player and items: DawnLike (DragonDePlatino) 
-->

<body>
    <div id="main">
      <div id="game-title">Tower Of The Undead</div>
      <a href="<?=$play_url?>" class="play-btn">Play</a>
      <div id="about-game">
        <p>Your church send you in a small mountain village to investigate the rumors for undead creatures.</p>
        <p>The people speaked to you about the disappearances of their livestok and the bodies from the cemetery.</p>
        <p>All clews shows an abandoded tower at the difficult area of the mountain. With no fear you enter to solve the mystery once and for all</p>
        <h3>Quest</h3>
        <p>Your mission is to clear all floor until level 10. Level maps are generated randomly and You have to slay all creatures in any floor before you continue to the next.</p>
        <h3>Instructions</h3>
        <strong>[Directional Keys]</strong> Move one tile. If step on a monster your character hits it.<br>
        <strong>[space]</strong> Go to next floor by stairs<br>
        <strong>[u]</strong> Use an item<br>
        <h3>Credits</h3>
        <p>Tileset: DawnLike (<a target="_blank" href="https://twitter.com/DragonDePlatino">DragonDePlatino</a>)</p>
        <p>
          If you enjoy this game, follow me on <a target="_blank" href="https://twitter.com/zuburlis">twitter</a> to get notified for new releases of roguelikes.
        </p>

      </div>
      <a href="<?=$play_url?>?v=2" class="play-btn">Play</a>
      <br>
      <br>
      <br>
      <br>
      <div style="display:none">
        <img src="<?=$tile_folder?>floor2.png">
        <img src="<?=$tile_folder?>wall.png">
        <img src="<?=$tile_folder?>player.png">
        <img src="<?=$tile_folder?>upstairs.png">
        <img src="<?=$tile_folder?>downstairs.png">
        <img src="<?=gila::base_url()?>src/towerofundead/DawnLike/Items/ShortWep.png">
        <img src="<?=gila::base_url()?>src/towerofundead/DawnLike/Items/Potion.png">
        <img src="<?=gila::base_url()?>src/towerofundead/DawnLike/Items/Armor.png">
      </div>
    </div>
</body>

<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-130027935-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-130027935-1');
</script>
<script>
      var itemImg = [];
      itemImgPath = [
        ['shortwep','Items/ShortWep.png'],
        ['rock','Items/Rock.png'],
        ['armor','Items/Armor.png'],
        ['potion','Items/Potion.png'],
        ['shortwep','Items/ShortWep.png'],
        ['scroll','Items/Scroll.png'],
        ['door0','Objects/Door0.png'],
        ['door1','Objects/Door1.png'],
        ['chest0','Items/Chest0.png'],
        ['chest','Items/Chest1.png'],
        ['undead0','Characters/Undead0.png'],
        ['undead1','Characters/Undead1.png'],
        ['player0','Characters/Player0.png'],
        ['player1','Characters/Player1.png'],
        ['decor0','Objects/Decor0.png'],
        ['ground0','Objects/Ground0.png'],
    ]
    for(let i=0;i<itemImgPath.length;i++) {
        itemImg[itemImgPath[i][0]] = new Image();
        itemImg[itemImgPath[i][0]].src = "<?=$dl_folder?>"+itemImgPath[i][1];
    }

</script>