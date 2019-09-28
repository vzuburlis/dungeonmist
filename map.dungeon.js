_wall = '#'

function mapClass (options) {
    var that = {};
    that.map_height = 36;
    that.map_width = 36;
    that.map = [];
    that.room = [];
    that.door = [];
    that.hiddenDoor = [];
    that.startpoint = [];
    that.lastRoom = null;
    that.midDoor = 0;
    that.midRoom = 0;
    that.startRoom = 2;
    that.dir = [[0,-1],[1,0],[0,1],[-1,0]]; // up right down left
    that.map = []
    that.roomN=0;

    that.createDungeon = function() {
      that.map = new Array(that.map_width);
      for (let x = 0; x < that.map_width; x++) {
        that.map[x] =new Array(that.map_height);
        for (let y = 0; y < that.map_height; y++) {
          that.map[x][y] = ' ';
        }
      }
      that.startpoint = [that.map_width/2+2, that.map_height/2+2]
      that.addFirstRoom(that.map_width/2, that.map_height/2, 4, 4);
      that.map[that.startpoint[0]][that.startpoint[1]] = '<'
      lastroom = that.room[that.room.length-1]
      that.map[lastroom[0]][lastroom[1]] = '>'
    }

    that.addFirstRoom = function(sx, sy, w, h) {
        var tries=0
        let rd = 2;

        that.boxTileB(sx,sy,w,h,'.',_wall)
        that.room.push([sx,sy,w,h])
        do{
          tries++
          rd = that.dice(4)
          switch(rd) {
            case 0: that.addLinkRoom(sx+that.dice(w), sy-1, rd); break; 
            case 1: that.addLinkRoom(sx+w, sy+that.dice(h), rd); break; 
            case 2: that.addLinkRoom(sx+that.dice(w), sy+h, rd); break; 
            case 3: that.addLinkRoom(sx-1, sy+that.dice(h), rd); break; 
          }
        }while(tries<10)
    }

    that.addLinkRoom = function(lx, ly, d) {
      if(that.room.length>12) return false
      // link
      var sx=lx;
      var sy=ly;
      var length=that.dice(3)+that.dice(3)
      var w = that.dir[d][0]*length + (that.dir[d][0]==0?1:0);
    
      var h = that.dir[d][1]*length + (that.dir[d][1]==0?1:0);
      if(that.dir[d][0]>0) sx++;
      if(that.dir[d][1]>0) sy++;
      var nx = sx+w-1;
      var ny = sy+h-1;
      if(that.dir[d][0]>0) nx++;
      if(that.dir[d][1]>0) ny++;
      if(w<0) { sx+=w; w=Math.abs(w); } 
      if(h<0) { sy+=h; h=Math.abs(h); }
      if(that.countTile(sx,sy,w,h,'.',d)>0) return
    
      let rw = that.dice(4,2);
      let rh = that.dice(4,2);
    
      var rsx=nx;
      var rsy=ny;
      if(that.dir[d][0]<0)  rsx-=rw
      if(that.dir[d][1]<0)  rsy-=rh
      if(that.dir[d][0]>0)  rsx++
      if(that.dir[d][1]>0)  rsy++
      if(that.dir[d][0]!=0) rsy-=that.dice(rh)
      if(that.dir[d][1]!=0) rsx-=that.dice(rw)
      if(that.countTile(rsx,rsy,rw,rh,'.',0)>0) {
        return;
      }
      that.boxTileB(rsx,rsy,rw,rh,'.',_wall)
      that.boxTileB(sx,sy,w,h,'.',_wall);
    
      if(that.dice(2)) that.door.push([nx,ny]);
      if(that.dice(2)) that.door.push([lx,ly]);
      that.map[nx][ny]='.';
      that.map[lx][ly]='.';

      that.room.push([rsx,rsy,rw,rh])
      var tries=0
      let rd = 2;
      do{
      tries++
      rd = that.dice(4)
      switch(rd) {
        case 0: that.addLinkRoom(rsx+that.dice(rw), rsy-1, rd); break; 
        case 1: that.addLinkRoom(rsx+w, rsy+that.dice(rh), rd); break; 
        case 2: that.addLinkRoom(rsx+that.dice(rw), rsy+rh, rd); break; 
        case 3: that.addLinkRoom(rsx-1, rsy+that.dice(rh), rd); break; 
      }
      
      }while(tries<10)
    
      return true
    }

    that.dice = function(a, b=0) {
      return Math.floor(Math.random()*a)+b
    }


    that.countTile = function(sx, sy, w, h, t,d) {
      n = 0;
      for (let x = -1; x < w+1; x++) {
        for (let y = -1; y < h+1; y++) {
          if(sx+x<0 || sx+x>=that.map_width) return 100;
          if(sy+y<0 || sy+y>=that.map_height) return 100;
          if(that.map[sx+x][sy+y]!='#') if(that.map[sx+x][sy+y]!=' ') n++;
        }
      }
      return n;
    }

    that.boxTile = function(sx, sy, w, h, t) {
      for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
          that.map[sx+x][sy+y]=t
        }
      }
    }

    that.boxTileB = function(sx, sy, w, h, t, tb) {
      that.boxTile(sx-1, sy-1, w+2, h+2, tb)
      that.boxTile(sx, sy, w, h, t)
    }

    return that;
}
