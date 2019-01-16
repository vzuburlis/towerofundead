function mapClass (options) {
    var that = {};
    that.maxrows = 35;
    that.maxcolumns = 35;
    that.rows = 22;
    that.columns = 22;
    that.map = [];
    that.room = [];
    that.door = [];
    that.startpoint = [];
    that.lastRoom = null;
    that.midDoor = 0;
    that.midRoom = 0;
    that.startRoom = 2;

    that.createBSP = function () {
        // Binary Space Partitioning 
        let leaf = {
            x: that.columns,
            y: that.rows,
            sx: 0,
            sy: 0
          }
    
        for (let x=0; x<that.maxcolumns; x++) {
          that.map[x] = []
          for (let y=0; y<that.maxrows; y++) {
            that.map[x][y] = '#'
          }
        }

        that.bspLeaf(leaf,0,'x')

        for(let i=0; i<that.door.length; i++) {
            that.map[that.door[i][0]][that.door[i][1]] = '.'
        }

        r = that.room[that.startRoom]
        x = Math.floor(r.sx+r.x/2)
        y = Math.floor(r.sy+r.y/2)
        that.map[x][y] = '>'
        that.startpoint = [x,y]
        that.stepFrom(2)
        r = that.room[that.room.length-1]
        x = Math.floor(r.sx+r.x/2)
        y = Math.floor(r.sy+r.y/2)
        that.map[x][y] = '<'
    };

    that.stepFrom = function(room) {
      for(let i=0; i<that.room[room].links; i++) {
        that.room[room].links[i]
      }
    }

    that.bspLeaf = function(l,n,d) {
        if (Math.floor(Math.random()*5) == 0) r=false; else r=true;
        that.lastRoom = null

        if(l.y > l.x) {
          if(l.y > 8) {
            hy = 3+Math.floor(Math.random() * (l.y-6));
            l.c1 = {x:l.x, y:hy+1, sx:l.sx, sy:l.sy}
            l.c2 = {x:l.x, y:(l.y-hy), sx:l.sx, sy:l.sy+hy}
            that.bspLeaf(l.c1,0,'v')
            if(d=='x') that.midRoom = that.room.length-1
            if(d=='x') that.midDoor = that.door.length-1
            that.bspLeaf(l.c2,1,'v')
          } else {
            that.drawLeaf(l,n,d)
          }
        } else {
          if(l.x > 8) {
            hx = 3+Math.floor(Math.random() * (l.x-6));
            l.c1 = {x:hx+1, y:l.y, sx:l.sx, sy:l.sy}
            l.c2 = {x:(l.x-hx), y:l.y, sx:l.sx+hx, sy:l.sy}
            that.bspLeaf(l.c1,0,'h')
            if(d=='x') that.midRoom = that.room.length-1
            if(d=='x') that.midDoor = that.door.length-1
            that.bspLeaf(l.c2,1,'h')
          } else {
            that.drawLeaf(l,n,d)
          }
        }

        that.addConnection(l,n,d)
        that.lastRoom = null
    }

    that.addDoor = function(x,y) {
      l = that.map[x-1][y]
      d = that.map[x][y+1]
      if(l==that.map[x+1][y]) if(d==that.map[x][y-1]) if(l!=d) if(l=='.'||l=='#') if(d=='.'||d=='#') {
        return true
      }
      return false
    }

    that.drawLeaf = function(l,n,d) { // leaf, index, direction
      l.links = []
      that.room.push(l)
      for (x=l.sx+1;x<l.x+l.sx-1;x++) {
        for (y=l.sy+1;y<l.y+l.sy-1;y++) {
          that.map[x][y] = '.'
        }
      }
      that.lastRoom = that.room.length-1
    }

    that.drawBox = function(sx,ex,sy) {
      
    }

    that.addConnection = function(l,n,d) {
        if(n==1) {
          if(d=='h') {
            do {
              y = l.sy+1+Math.floor(Math.random()*(l.y-2))
              x = l.sx
            }while(that.addDoor(x,y)==false);
            room1 = that.findRoom(x-1,y)
            room2 = that.findRoom(x+1,y)
          }
          if(d=='v') {
            do {
              x = l.sx+1+Math.floor(Math.random()*(l.x-2))
              y = l.sy
            }while(that.addDoor(x,y)==false);
            room1 = that.findRoom(x,y-1)
            room2 = that.findRoom(x,y+1)
          }
          r=null
          if(room1<room2) r=room1; else r=room2;
          that.room[room1].links.push(room2)
          that.room[room2].links.push(room1)
          that.door.push([x,y,r,d])
          that.door[that.door.length-1].r1 = room1
          that.door[that.door.length-1].r2 = room2
        }
    }

    that.findRoom = function(x,y) {
      for(let i=0;i<that.room.length;i++) {
        sx=that.room[i].sx
        sy=that.room[i].sy
        if(x>=sx && x<that.room[i].x+sx && y>=sy && y<that.room[i].y+sy) return i;
      }
      return -1;
    }

    return that;
}
