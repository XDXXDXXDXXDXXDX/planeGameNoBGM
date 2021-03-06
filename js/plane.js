/**
 * 子类 Plane 飞机
 * 1、继承 Element
 * 2、依赖 Bullet
 */
var Plane = function (opts) {
  var opts = opts || {};
  // 调用父类方法
  Element.call(this, opts);
  // 特有属性
  this.status = 'normal';
  this.icon = opts.icon;
  this.boomIcon = opts.boomIcon;
  this.boomCount = 0;
  // 子弹相关
  this.bullets = [];
  this.bulletSize = opts.bulletSize;
  this.bulletSpeed = opts.bulletSpeed;
  this.bulletIcon = opts.bulletIcon;
};

// 继承Element的方法
Plane.prototype = new Element();

//判断是否撞到飞机的方法
Plane.prototype.hasCrash = function(target) {
  var crash = false;
  // 判断四边是否都没有空隙
  if(target.status == 'normal') {
    if (!(this.x + this.width < target.x) &&
    !(target.x + target.width < this.x) &&
    !(this.y + this.height < target.y) &&
    !(target.y + target.height < this.y)) {
      // 物体碰撞了
      crash = true;
  }}
  return crash;
};

//爆炸中
Plane.prototype.booming = function() {
  this.status = 'booming';
  this.boomCount += 1;
  if (this.boomCount > 10) {
    this.status = 'boomed';
    clearInterval(this.shooting);
  }
}


//判断是否击中敌机的方法
Plane.prototype.hasHit = function(target) {
  var bullets = this.bullets;
  var hasHit = false;
  for (var j = bullets.length - 1; j >= 0; j--) {
    // 如果子弹击中的是目标对象的范围，则销毁子弹
    if (bullets[j].hasCrash(target)){
      // 清除子弹实例
      this.bullets.splice(j, 1);
      hasHit = true;
      break;
    }
  }
  return hasHit;
};

/**
 * 方法: setPosition 根据方向水平移动一个身为
 */
Plane.prototype.setPosition = function(newPlaneX, newPlaneY) {
  this.x = newPlaneX;
  this.y = newPlaneY;
  return this;
};

/**
 * 方法: startShoot 方法
 */
Plane.prototype.startShoot = function() {
  var self = this;
  var bulletWidth = this.bulletSize.width;
  var bulletHeight = this.bulletSize.height;
  this.shooting = setInterval(function() {
    
    // 创建子弹,子弹位置是居中射出
    var bulletX = self.x + self.width / 2 - bulletWidth / 2;
    var bulletY = self.y - bulletHeight;
    // 创建子弹
  
    self.bullets.push(new Bullet({
      x: bulletX,
      y: bulletY,
      width: bulletWidth,
      height: bulletHeight,
      speed: self.bulletSpeed,
      icon: self.bulletIcon,
    }));
  }, 200);
  
};

// 方法： drawBullets 画子弹
Plane.prototype.drawBullets = function() {
  var bullets = this.bullets;
  var i = bullets.length;
  while (i--) {
    var bullet = bullets[i];
  // 更新子弹的位置
    bullet.fly(); // 更新和绘制耦合在一起了
    // 如果子弹对象超出边界,则删除
    if (bullet.y <= 0) {
      //如果子弹实例下降到底部，则需要在drops数组中清除该子弹实例对象
      bullets.splice(i, 1);
    } else {
      // 未超出的则绘画子弹
      bullet.draw();
    }
  }
};

// 方法: draw 方法
Plane.prototype.draw = function() {
  // 绘制飞机
  switch(this.status) {
    case 'booming':
      context.drawImage(this.boomIcon, this.x, this.y, this.width, this.height);
      break;
    default:
      context.drawImage(this.icon, this.x, this.y, this.width, this.height);
      break;
  }
  // 绘制子弹
  this.drawBullets();
  return this;
};
