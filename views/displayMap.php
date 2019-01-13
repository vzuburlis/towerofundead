<?php
$play_url = 'towerofundead/play';
$update_url = 'towerofundead/update';
$tile_folder = gila::base_url()."src/towerofundead/tile/";
$dl_folder = gila::base_url()."src/towerofundead/DawnLike/";
?>

<head>
    <base href="<?=gila::base_url()?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"> 
    <?=view::script("lib/gila.min.js")?>
    <?=view::script("src/towerofundead/unit.js")?>
    <?=view::script("src/towerofundead/map.js")?>
    <link href="https://fonts.googleapis.com/css?family=Berkshire+Swash" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Bangers" rel="stylesheet">
    <link href="src/towerofundead/style.css" rel="stylesheet">
</head>
<!--
    Credits
    player and items: DawnLike (DragonDePlatino) 
-->

<body style="background:#000;overflow: hidden;">
    <div id="main">
      
      <canvas id="map" ontouch="clickOnMap(event,this)" onclick="clickOnMap(event,this)"></canvas>
      
      <div id="controls">
        <table>
        <tr>
          <td>
          <td>
          <svg class="dir-btn" viewBox="0 0 28 28" onclick="keyPress(38)">
		  <line x1="4" y1="19" x2="15" y2="8" style="stroke:#929292;stroke-width:3"></line>
		  <line x1="24" y1="19" x2="14" y2="8" style="stroke:#929292;stroke-width:3"></line>
          </svg>
          <td>
        <tr>
          <td>
          <svg class="dir-btn" viewBox="0 0 28 28" onclick="keyPress(37)">
		  <line y1="4" x1="19" y2="15" x2="8" style="stroke:#929292;stroke-width:3"></line>
		  <line y1="24" x1="19" y2="14" x2="8" style="stroke:#929292;stroke-width:3"></line>
          </svg>
          <td>
          <td>
          <svg class="dir-btn" viewBox="0 0 28 28" onclick="keyPress(39)">
		  <line y1="4" x1="9" y2="15" x2="20" style="stroke:#929292;stroke-width:3"></line>
		  <line y1="24" x1="9" y2="14" x2="20" style="stroke:#929292;stroke-width:3"></line>
          </svg>
        <tr>
        <td>
        <td>
        <svg class="dir-btn" viewBox="0 0 28 28" onclick="keyPress(40)">
		  <line x1="4" y1="9" x2="15" y2="20" style="stroke:#929292;stroke-width:3"></line>
		  <line x1="24" y1="9" x2="14" y2="20" style="stroke:#929292;stroke-width:3"></line>
          </svg>
        <td>
        </table>
      </div>
      <div></div>
      </div>
      <p id="msgBox"></p>
      <div id="statBox">
        <div>Level <?=$c->level?></div>
        <div><img src="<?=$tile_folder?>attack.png"> <span id="pAttack"><span></div>
        <div><img src="<?=$tile_folder?>armor.png"> <span id="pArmor"><span></div>
        <div><img src="<?=$tile_folder?>key.png" id="pKey"> </div>
        <div id="show-u-command"><span> [u] Use Potion</span></div>
      </div>
      <div id="play-btn-container">
          <a href="<?=$play_url?>" class="play-btn">Play Again</a>
          <br><br>
          <p>Enjoyed the game? Follow me on <a target="_blank" href="https://twitter.com/zuburlis">twitter</a> and get notified for new releases and game features.</p>
      </div>

      <div id="commands">
      <img src="<?=$tile_folder?>potion.png" class="com-btn" onclick="keypressPlay(85)">
      <img src="<?=$tile_folder?>downstairs.png" class="com-btn com-down" onclick="keypressPlay(32)">
      </div>

      <div id="use-menu">
        <div id="use-menu--title">Use Item <span onclick="keypressUse(27)" style="font-family:courier new;font-size:0.8em">[x]</span></div>
        <div id="use-menu--list"></div>
      </div>
</body>


<script>
var monsterType = <?=json_encode($c->monsterType)?>;
//var map = <?=json_encode($c->map)?>;
var mapWidth = <?=$c->columns?>;
var mapHeight = <?=$c->rows?>;
mapGen = mapClass();
mapGen.createBSP();
var map = mapGen.map;
var mapRev = <?=json_encode($c->mapRev)?>;
var monsters_data = <?=json_encode($c->monsters)?>;
var monsters = [];
var items = <?=json_encode($c->items)?>;
var objects = Array();

let randDoor = Math.floor(Math.random() * (mapGen.door.length-2))
for(let i=0; i<mapGen.door.length; i++) {
    if(Math.floor(Math.random()*4) > 0) {
        t=0;
        if(Math.floor(Math.random()*2) > 0) t=i%6;
        if(i>randDoor && i>mapGen.door.length-5) {
            roomWithKey = mapGen.door[randDoor][2]
            r = mapGen.room[roomWithKey]
            items.push([r.sx+r.x/2, r.sy+r.y/2, 5]);
            t=6
            randDoor = mapGen.door.length
        }
        objects.push({x:mapGen.door[i][0], y:mapGen.door[i][1], type:t});
    }
}

for (let i=0; i<monsters_data.length; i++) {
    monsters.push(unitClass(monsters_data[i]));
}
for(let i=0; i<monsters.length; i++) {
    p = randomPos();
    monsters[i].x = p.x;
    monsters[i].y = p.y;
} 
for(let i=0; i<items.length; i++) {
    p = randomPos();
    items[i][0] = p.x;
    items[i][1] = p.y;
} 
for(let i=0; i<10; i++) {
    p = randomPos();
    objects.push({x:p.x,y:p.y,type:(Math.floor(Math.random()*6)+7)});
} 
var startpoint = <?=json_encode($c->startPos[0])?>;
startpoint = mapGen.startpoint;
var canvas = document.getElementById("map");
var itemImg = [];
var statusImg = [];
var itemType = <?=json_encode($c->itemType)?>;
var objectType = <?=json_encode($c->objectType)?>;
var timeBit = 0;
renderWidth = 14;
renderHeight = 7;
var clientWidth = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;
if(clientWidth<500) renderWidth = 10;

canvas.width = 32*renderWidth*2+32;
canvas.height = 32*renderHeight*2+32;
context = canvas.getContext("2d");
context.translate(0.5, 0.5);
//context.scale(2,2);

pathImage = new Image();
//pathImage.src = "<?=$dl_folder?>Objects/Floor.png";
pathImage.src = "<?=$tile_folder?>floor3.png";
wallImage = new Image();
//wallImage.src = "<?=$dl_folder?>Objects/Wall.png";
wallImage.src = "<?=$tile_folder?>wall.png";
upsImg = new Image();
upsImg.src = "<?=$tile_folder?>upstairs.png"; //oneway_up_1
downsImg = new Image();
downsImg.src = "<?=$tile_folder?>downstairs.png"; //oneway_down_1
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
    ['key','Items/Key.png'],
]
for(let i=0;i<itemImgPath.length;i++) {
    itemImg[itemImgPath[i][0]] = new Image();
    itemImg[itemImgPath[i][0]].src = "<?=$dl_folder?>"+itemImgPath[i][1];
}
itemImg['gauze'] = new Image();
itemImg['gauze'].src = "<?=$tile_folder?>gauze.png";
statusImg['strength'] = new Image();
statusImg['strength'].src = "<?=gila::base_url()?>src/towerofundead/status/strength.png";
statusImg['speed'] = new Image();
statusImg['speed'].src = "<?=gila::base_url()?>src/towerofundead/status/speed.png";
statusImg['bleeding'] = new Image();
statusImg['bleeding'].src = "<?=gila::base_url()?>src/towerofundead/status/bleeding.png";
statusImg['bless'] = new Image();
statusImg['bless'].src = "<?=gila::base_url()?>src/towerofundead/status/bless.png";
statusImg['curse'] = new Image();
statusImg['curse'].src = "<?=gila::base_url()?>src/towerofundead/status/curse.png";
statusImg['confuze'] = new Image();
statusImg['confuze'].src = "<?=gila::base_url()?>src/towerofundead/status/confuze.png";

var timeBit = 0;

player = unitClass({
    context: canvas.getContext("2d"),
    width: 32,
    height: 32,
    x: startpoint[0],
    y: startpoint[1],
    hp: <?=$c->player['hp']?>,
    maxhp: 20,
    attack: <?=$c->player['attack']?>,
    armor: <?=$c->player['armor']?>,
    status: <?=$c->player['status']?>,
    inventory: <?=$c->player['inventory']?>
});
window.focus();

function moveDown() {
    let fm=new FormData()
        fm.append('hp', player.hp);
        fm.append('attack', player.attack);
        fm.append('armor', player.armor);
        fm.append('inventory', JSON.stringify(player.inventory));
        fm.append('status', JSON.stringify(player.status));
        fm.append('level', <?=$c->level+1?>);
        g.ajax({
            url: '<?=gila::base_url()?><?=$update_url?>',
            data: fm,
            method: 'post',
            fn: function(){
              window.location.href = '<?=$play_url?>?level'
            }
        })
}
function moveUp() {
    let fm=new FormData()
        fm.append('hp', player.hp);
        fm.append('attack', player.attack);
        fm.append('armor', player.armor);
        fm.append('inventory', JSON.stringify(player.inventory));
        fm.append('status', JSON.stringify(player.status));
        fm.append('level', <?=$c->level+1?>);
        g.ajax({
            url: '<?=gila::base_url()?><?=$update_url?>',
            data: fm,
            method: 'post',
            fn: function(){
              window.location.href = '<?=$play_url?>?level'
            }
        })
}

function moveAnimation(dx,dy) {
    if(dx==0 && dy==1) player.spritey=0
    if(dx==0 && dy==-1) player.spritey=3
    if(dx==-1 && dy==0) player.spritey=1
    if(dx==1 && dy==0) player.spritey=2
    gameScene = 'wait'
    player.spritex=1
    player.x +=dx*0.25
    player.y +=dy*0.25
    renderMap2()

    setTimeout(function(){
        player.spritex=2
        player.x +=dx*0.25
        player.y +=dy*0.25
        renderMap2()
    },40)
    setTimeout(function(){
        player.spritex=3
        player.x +=dx*0.25
        player.y +=dy*0.25
        renderMap2()
    },80)
    setTimeout(function(){
        player.spritex=0
        player.x +=dx*0.25
        player.y +=dy*0.25
        gameScene='play'
        runTurn();
        renderMap2()
    },120)
}

function randomPos() {
    do{
        x = Math.floor(Math.random()*mapWidth)
        y = Math.floor(Math.random()*mapHeight)
    }while(blockedPos(x,y))
    return {x:x,y:y}
}
function blockedPos(x,y) {
    if(map[x][y]!='.') return true;
    for(let i=0; i<monsters.length; i++) {
        if(x==monsters[i].x && y==monsters[i].y) return true;
    }
    for(let i=0; i<objects.length; i++) {
        if(x==objects[i].x && y==objects[i].y) return true;
    }
    return false;
}

</script>

<?=view::script("src/towerofundead/gameplay.js")?>

<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-130027935-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-130027935-1');
</script>

