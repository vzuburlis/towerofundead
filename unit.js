var swingAudio = new Audio('src/towerofundead/swing2.wav');
var blastAudio = new Audio('src/towerofundead/blast.mp3');
var opendoorAudio = new Audio('src/towerofundead/open_door.mp3');

function unitClass (options) {
    var that = {};

    that.context = options.context;
    that.width = options.width;
    that.height = options.height;
    that.image = options.image;
    that.x = options.x;
    that.y = options.y;
    that.hp = options.hp;
    that.maxhp = options.maxhp;
    that.attack = options.attack;
    that.armor = options.armor;
    that.key=false
    that.type = options.type;
    that.turnTime = 0;
    that.speed = 0;
    that.spritex = 0;
    that.spritey = 0;
    that.inventory = [];
    that.direction = -1;
    if(typeof options.inventory!='undefined') that.inventory = options.inventory;
    that.status = [];
    if(typeof options.status!='undefined') that.status = options.status;
    
    that.turn = function () {
    	if(that.hasStatus('bleeding')) {
    		if(Math.floor(Math.random() * 20) == 0) {
    		  that.hp--
    		}
    		if(that.hp<1) {
	    		logMsg("<span style='color:red'>You die from bleeding</span>");
                document.getElementById('play-btn-container').style.display = "block"
    		}
    	}
        for(let i=0;i<that.status.length;i++) {
            that.status[i].timeleft -= 10;
            if(that.status[i].timeleft < 0) {
                that.removeEffect(that.status[i].effect)
                that.status.splice(i,1);
            }
        }
    };

    that.render = function () {
       if(that.hasStatus('invisible')) context.globalAlpha = 0.5
       _sprite = "player"
       _x = 0
       _y = 4
       if(timeBit == 0) {
         drawSprite(that.x,that.y, itemImg[_sprite+'0'], _x, _y);
       } else {
         drawSprite(that.x,that.y, itemImg[_sprite+'1'], _x, _y);
       }
       context.globalAlpha = 1;
    };

    that.move = function (dx, dy) {
        if(that.hasStatus('confuze')) if(Math.floor(Math.random() * 4)==0) {
            if(dx==0) {
                dy=0;
                if(Math.floor(Math.random() * 2)==0) dx=-1; else dx=1; 
            }
            if(dy==0) {
                dx=0;
                if(Math.floor(Math.random() * 2)==0) dx=-1; else dx=1; 
            }
        }

        if(dx==1 || dx==-1) that.direction = dx;
        document.getElementById("msgBox").innerHTML = "&nbsp;";
        if(map[that.x+dx][that.y+dy]=='#') {
            logMsg("The wall blocks your way");
            return false;
        }
        obj = getObject(that.x+dx,that.y+dy)
        if(obj!=null) {
            objType = objectType[obj.type]
            if(typeof objType.open_to!='undefined') {
                obj.type = findObjectType(objType.open_to, obj.type);
                opendoorAudio.play()
                logMsg("You open the door");
            }
            if(typeof objType.unlock_to!='undefined') {
                if(that.key==true) {
                    opendoorAudio.play()
                    obj.type = findObjectType(objType.unlock_to, obj.type);
                    logMsg("You unlock the door");
                } else {
                    logMsg("The door is locked. You need a key");
                }
            }
            if(objType.block==true) return false;
        }
        mi = getMonster(that.x+dx,that.y+dy);
        if(mi > -1) {
            attack_points = Math.floor(Math.random() * that.attack)+1;
            attack_points -= Math.floor(Math.random() * monsterType[monsters[mi].type].level)
            if(attack_points<0) attack_points = 0
            monsters[mi].hp-=attack_points;
            if(monsters[mi].hp<0) monsters[mi].hp==0;
            logMsg("You hit the "+monsters[mi].typeName()+' dealing '+attack_points+' damage');
            that.removeStatus('invisible')
            swingAudio.play();
            turnPlayed = true;
            return false;
        }
        iti = getItem(that.x+dx,that.y+dy);
        if(iti>-1) {
            _type = items[iti][2]
            _name = itemType[_type].name
            logMsg("You pick up the "+_name);
            items[iti].carrier = 1
            if(typeof itemType[_type].effect!='undefined' && itemType[_type].effect[0]=='+') {
                that.addEffect(itemType[_type].effect)
            } else {
                that.inventory.push({itemType:_type,stock:1})
            }
        }

        that.x += dx;
        that.y += dy;
        com_down = document.getElementsByClassName('com-down')[0]
        if(map[that.x][that.y]=='<') {
            logMsg("Press [space] to go upstairs");
            com_down.style.display = 'block'
        } else com_down.style.display = 'none'
        if(map[that.x][that.y]=='>') {
            logMsg("You are not thinking to go back");
        }
        turnPlayed = true;
			return true
        }

    that.addEffect = function (_effect) {
        if(_effect=="heal") {
            that.hp += 12
            if(that.hp > that.maxhp) that.hp = that.maxhp
            that.removeStatus('bleeding');
        }
        if(_effect=="stop-bleed") {
            that.removeStatus('bleeding');
        }
        if(_effect=="+attack") {
            that.attack++
        }
        if(_effect=="+armor") {
            that.armor++
        }
        if(_effect=="+key") {
            that.key=true
        }
        if(_effect=="speed") {
            that.speed += 5
        }
        if(_effect=="strength") {
            that.attack+=2
            that.armor+=2
        }
        if(_effect=="bless") {
            that.hp += 20
            if(that.hp > that.maxhp) that.hp = that.maxhp
            that.removeStatus('curse');
            that.attack+=1
            that.armor+=1
        }
        if(_effect=="curse") {
            that.attack-=1
            that.armor-=1
        }
        updateStats()
    }
    that.removeEffect = function (_effect) {
        if(_effect=="speed") {
            that.speed -= 5
        }
        if(_effect=="strength") {
            that.attack-=2
            that.armor-=2
        }
        if(_effect=="curse") {
            that.attack+=1
            that.armor+=1
        }
        if(_effect=="bless") {
            that.attack-=1
            that.armor-=1
        }
        updateStats()
    }
    that.spellEffect = function (_effect) {
        if(_effect=="map-reveal") {
            revealMap()
        }
        if(_effect=="sucrifice-rnd") {
        	ri = Math.floor(Math.random() * monsters.length);
        	monsters[ri].hp = 0;
        }
        if(_effect=="track-all") {
			for (let i=0; i<monsters.length; i++) if(monsters[i].hp>0) {
            	monsters[i].addStatus("tracked", 48)
			}
        }
        if(_effect=="dispell-magic") {
            that.removeStatus('curse')
            that.removeStatus('confuze')
			for (let i=0; i<monsters.length; i++) if(monsters[i].hp>0) {
                x = monsters[i].x
                y = monsters[i].y
                if(mapRev[x][y]>1 && monsterType[monsters[i].type].group=='skeleton') {
                    monsters[i].hp=0
                }
			}
        }
        if(_effect=="curse") {
			for (let i=0; i<monsters.length; i++) if(monsters[i].hp>0) {
                x = monsters[i].x
                y = monsters[i].y
                if(mapRev[x][y]>1) monsters[i].addStatus("curse", 48)
			}
        }
        if(_effect=="confuze") {
			for (let i=0; i<monsters.length; i++) if(monsters[i].hp>0) {
                x = monsters[i].x
                y = monsters[i].y
                if(mapRev[x][y]>1) {
                    monsters[i].addStatus("confuze", 12)
                }
            }
        }
        if(_effect=="lightning-strike") {
            lightMonsters = Array()
			for (let i=0; i<monsters.length; i++) if(monsters[i].hp>0) {
                x = monsters[i].x
                y = monsters[i].y
                if(mapRev[x][y]>1) {
                    lightMonsters.push(monsters[i])
                }
            }
            if(lightMonsters.length>0) {
                gameStatus='wait'
                blastAudio.play()
                for(let i=0;i<10;i++) {
                    setTimeout(function(){
                        renderMap()
                        for(let mi=0;mi<lightMonsters.length;mi++) {
                            let x = lightMonsters[mi].x
                            let y = lightMonsters[mi].y
                            drawThunder(that.x, that.y, x, y)
                        }
                    }, i*100);
                }
                setTimeout(function(){
                    for(let mi=0;mi<lightMonsters.length;mi++) {
                        lightMonsters[mi].hp -= 5
                    }
                    gameStatus='play'
                }, 1000);
            }
        }
        if(_effect=="track-all") {
			for (let i=0; i<monsters.length; i++) if(monsters[i].hp>0) {
            	monsters[i].addStatus("tracked", 48)
			}
        }
        if(_effect=="heal") {
            that.hp += 12
            if(that.hp > that.maxhp) that.hp = that.maxhp
        }
        updateStats()
    }

    that.addStatus = function (_effect, _effect_time) {
        if(_effect=='curse' || _effect=='confuze') if(that.hasStatus('bless')) return;

	    for(let i=0; i<that.status.length; i++) {
	    	if(that.status[i].effect == _effect) {
  		    	if(that.status[i].timeleft<_effect_time*100) {
  		    	  that.status[i].timeleft = _effect_time*100
  		    	}
  		    	return;
	    	}
	    }
        that.status.push({timeleft:_effect_time*100,effect:_effect})
    }
    that.hasStatus = function (_effect) {
	    for(let i=0; i<that.status.length; i++) {
	    	if(that.status[i].effect == _effect) return true
	    }
	    return false
    }
    that.removeStatus = function (_effect) {
	    for(let i=0; i<that.status.length; i++) {
	    	if(that.status[i].effect == _effect) that.status.split(i,1)
	    }
	    return false
    }

    that.monsterMove = function (dx, dy) {
        _x = that.x+dx
        _y = that.y+dy
        if(map[_x][_y]=='#') {
            return;
        }
        if(getMonster(_x,_y) > -1) {
            return;
        }
        obj = getObject(that.x+dx,that.y+dy)
        if(obj!=null) {
            objType = objectType[obj.type]
            if(objType.block==true) return;
        }

        if(player.x==_x && player.y==_y) {
            _mt = monsterType[that.type]
            attack_points = Math.floor(Math.random() * monsterType[that.type].level)+1;
            attack_points -= Math.floor(Math.random() * (player.armor+1))
            if(attack_points<0) attack_points = 0
            player.hp -= attack_points;
            if(Math.floor(Math.random() * 10)==0) {
              if(typeof _mt['special-attack']!='undefined') {
                if(_mt['special-attack']=='bleeding') player.addStatus('bleeding',20)
                if(_mt['special-attack']=='confuze') player.addStatus('confuze',10)
                if(_mt['special-attack']=='curse') player.addStatus('curse',20)
              }
            }
            if(player.hp<0) {
                logMsg("<span style='color:red'>The "+that.typeName()+' kills you</span>');
                document.getElementById('play-btn-container').style.display = "block"
            } else {
                logMsg("The "+that.typeName()+' hits you for '+attack_points+' damage');
            }
            return
        }
        that.x += dx;
        that.y += dy;
    }

    that.monsterPlay = function () {
        _x = that.x;
        _y = that.y;
        px = player.x;
        py = player.y;

        if(Math.abs(px-_x)<3 && Math.abs(py-_y)<3 && !player.hasStatus('invisible')) {
            dx = spaceship(px,_x)
            if(dx == 0) dy = spaceship(py,_y); else dy=0;
            if(map[_x+dx][_y+dy]=='#') [dx,dy] = [dy,dx]
            that.monsterMove(dx, dy);
        } else if(Math.floor(Math.random() * 2) == 0) { // random movement
            that.monsterMove(Math.floor(Math.random() * 3)-1, 0);
        } else {
            that.monsterMove(0, Math.floor(Math.random() * 3)-1);
        }
    }

    that.typeName = function () {
        return monsterType[that.type].name
    }

    that.moveDown = function () {
        if(map[that.x][that.y]!='>') return
        for (i=0; i<monsters.length; i++) if(monsters[i].hp>0) {
            logMsg("You have not done with the creatures of this level");
            return
        }
        logMsg('You go downstairs...');
        gameScene = 'waiting';
        moveDown();
    }
    that.moveUp = function () {
        if(map[that.x][that.y]!='<') return
        for (i=0; i<monsters.length; i++) if(monsters[i].hp>0) {
            logMsg("You have not done with the creatures of this floor");
            return
        }
        logMsg('You go upstairs...');
        gameScene = 'waiting';
        moveUp();
    }

    that.view = function () {
        _x = Math.floor(that.x)
        _y = Math.floor(that.y)
        mapRev[_x][_y] = 4;
        for(i=_x-4; i<_x+5; i++) {
            for(j=_y-4; j<_y+5; j++) {
                diffx = i-_x;
                diffy = j-_y;

                if(Math.abs(diffy)>Math.abs(diffx)) {
                    dx = diffx / diffy;
                    dy = Math.sign(diffy);
                } else if (diffx!=0) {
                    dx = Math.sign(diffx);
                    dy = diffy / diffx;
                } else {
                    continue;
                }
                p = 0; loop = true;
                do {
                    p++;
                    x = Math.round(p*dx)+_x;
                    y = Math.round(p*dy)+_y;
                    if(inMap(x,y)) {
                        dist = Math.sqrt( Math.pow(p*dx, 2) + Math.pow(p*dy, 2) )
                        mapRev[x][y] = 5;
                        if(dist>1) mapRev[x][y] = 4;
                        if(dist>2) mapRev[x][y] = 3;
                        if(dist>3) mapRev[x][y] = 2;
                        if(dist>4) loop=false;
                    } else loop=false;
                    for(oi=0;oi<objects.length;oi++) if(objectType[objects[oi].type].blocksight==true) {
                        if(objects[oi].x==x && objects[oi].y==y) loop=false;
                    }
                    
                } while(loop && map[x][y]!='#' && p<5);
            }
        }
    }

    return that;
}

function spaceship(val1, val2) {
    if ((val1 === null || val2 === null) || (typeof val1 != typeof val2)) {
      return null;
    }
    if (val1 > val2) {
      return 1;
    } else if (val1 < val2) {
      return -1;
    }
    return 0;
}

function drawThunder(sx, sy, ex, ey) {
    dx =ex-sx
    dy =ey-sy
    let d = Math.sqrt(dx*dx+dy*dy)
    stepx = dx/d
    stepy = dy/d
    mx = sx-player.x+renderWidth
    my = sy-player.y+renderHeight
    context.strokeStyle='#ccccff';
    context.beginPath();
    context.moveTo(mx*32+16, my*32+16);
    for(let i=0.25;i<d;i+=0.25) {
        x = mx + i*stepx
        y = my + i*stepy
        context.lineTo(x*32+16+Math.random()*16, y*32+16+Math.random()*16);
    }
    context.lineTo((mx+dx)*32+16, (my+dy)*32+16);
    context.stroke(); 
}


