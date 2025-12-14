let stopSpriteSheet, walkSpriteSheet, jumpSpriteSheet, pushSpriteSheet, toolSpriteSheet, newCharacterSpriteSheet, newCharacterSpriteSheet2, touchCharacter3SpriteSheet, smileCharacter2SpriteSheet, fallDownChar2SpriteSheet;
let stopAnimation = [];
let walkAnimation = [];
let jumpAnimation = [];
let pushAnimation = [];
let toolAnimation = [];
let newCharacterAnimation = [];
let smileCharacter2Animation = [];
let fallDownChar2Animation = [];
let newCharacterAnimation2 = [];
let touchCharacter3Animation = [];

let x, y, newCharX, newCharY, newChar2X, newChar2Y;
let speed = 5;
let direction = 1; // 1 for right, -1 for left
let isWalking = false;
let isJumping = false;
let isPushing = false;
let jumpFrame = 0;
let pushFrame = 0;
let startY;
const JUMP_HEIGHT = 150; // 角色跳躍的高度

let tools = []; // 儲存所有發射出去的武器

const stopFrameInfo = { count: 3, width: 295, height: 114 };
const walkFrameInfo = { count: 11, width: 2228, height: 254 };
const jumpFrameInfo = { count: 16, width: 2000, height: 110 };
const pushFrameInfo = { count: 12, width: 1750, height: 110 };
const toolFrameInfo = { count: 17, width: 965, height: 130 };
const newCharacterFrameInfo = { count: 4, width: 347, height: 118 };
const newCharacter2FrameInfo = { count: 9, width: 770, height: 130 };
const touchCharacter3FrameInfo = { count: 12, width: 1955, height: 130 };
const smileCharacter2FrameInfo = { count: 15, width: 1870, height: 169 };
const fallDownChar2FrameInfo = { count: 8, width: 975, height: 82 };

let inputElement;
let char2Dialog = "";
let isInteractingWithChar2 = false;
let isChar2Falling = false;
let char2FallFrame = 0;

function preload() {
  // 預先載入圖片精靈檔案
  stopSpriteSheet = loadImage('1/stop/111.png');
  walkSpriteSheet = loadImage('1/walk/111.png');
  jumpSpriteSheet = loadImage('1/jump/111.png');
  pushSpriteSheet = loadImage('1/push/111.png');
  toolSpriteSheet = loadImage('1/tool/111.png');
  newCharacterSpriteSheet = loadImage('2/stop/111.png');
  newCharacterSpriteSheet2 = loadImage('3/stop/111.png');
  smileCharacter2SpriteSheet = loadImage('2/smile/111.png');
  touchCharacter3SpriteSheet = loadImage('3/touch/111.png');
  fallDownChar2SpriteSheet = loadImage('2/fall-down/111.png');
}

function setup() {
  // 建立一個佔滿整個視窗的畫布
  createCanvas(windowWidth, windowHeight);
  x = width / 2;
  y = height / 2;
  startY = y; // 儲存初始的Y軸位置
  // 設定新角色的初始位置，使其獨立於主要角色
  newCharX = x - 150;
  newCharY = y;
  // 設定第二個新角色的初始位置
  newChar2X = x + 150;
  newChar2Y = y;

  // 建立文字輸入框並初始隱藏
  inputElement = createInput('');
  inputElement.position(-1000, -1000); // 先移到畫面外
  inputElement.size(150);
  inputElement.changed(handleInput); // 按下 Enter 後觸發

  // 從站立圖片精靈中切割出每一個影格
  let stopFrameWidth = stopFrameInfo.width / stopFrameInfo.count;
  for (let i = 0; i < stopFrameInfo.count; i++) {
    let frame = stopSpriteSheet.get(i * stopFrameWidth, 0, stopFrameWidth, stopFrameInfo.height);
    stopAnimation.push(frame);
  }

  // 從走路圖片精靈中切割出每一個影格
  let walkFrameWidth = walkFrameInfo.width / walkFrameInfo.count;
  for (let i = 0; i < walkFrameInfo.count; i++) {
    let frame = walkSpriteSheet.get(i * walkFrameWidth, 0, walkFrameWidth, walkFrameInfo.height);
    walkAnimation.push(frame);
  }

  // 從跳躍圖片精靈中切割出每一個影格
  let jumpFrameWidth = jumpFrameInfo.width / jumpFrameInfo.count;
  for (let i = 0; i < jumpFrameInfo.count; i++) {
    let frame = jumpSpriteSheet.get(i * jumpFrameWidth, 0, jumpFrameWidth, jumpFrameInfo.height);
    jumpAnimation.push(frame);
  }

  // 從攻擊圖片精靈中切割出每一個影格
  let pushFrameWidth = pushFrameInfo.width / pushFrameInfo.count;
  for (let i = 0; i < pushFrameInfo.count; i++) {
    let frame = pushSpriteSheet.get(i * pushFrameWidth, 0, pushFrameWidth, pushFrameInfo.height);
    pushAnimation.push(frame);
  }

  // 從武器圖片精靈中切割出每一個影格
  let toolFrameWidth = toolFrameInfo.width / toolFrameInfo.count;
  for (let i = 0; i < toolFrameInfo.count; i++) {
    let frame = toolSpriteSheet.get(i * toolFrameWidth, 0, toolFrameWidth, toolFrameInfo.height);
    toolAnimation.push(frame);
  }

  // 從新角色圖片精靈中切割出每一個影格
  let newCharacterFrameWidth = newCharacterFrameInfo.width / newCharacterFrameInfo.count;
  for (let i = 0; i < newCharacterFrameInfo.count; i++) {
    let frame = newCharacterSpriteSheet.get(i * newCharacterFrameWidth, 0, newCharacterFrameWidth, newCharacterFrameInfo.height);
    newCharacterAnimation.push(frame);
  }

  // 從角色2的微笑圖片精靈中切割出每一個影格
  // 此圖片精靈有兩行，需要特別處理
  let smileCharacter2FrameWidth = smileCharacter2FrameInfo.width / smileCharacter2FrameInfo.count;
  const framesInFirstRow = 8;
  const frameHeight = smileCharacter2FrameInfo.height / 2; // 假設兩行等高
  for (let i = 0; i < smileCharacter2FrameInfo.count; i++) {
    let sx = (i % framesInFirstRow) * smileCharacter2FrameWidth;
    let sy = (i < framesInFirstRow) ? 0 : frameHeight;
    let frame = smileCharacter2SpriteSheet.get(sx, sy, smileCharacter2FrameWidth, frameHeight);
    smileCharacter2Animation.push(frame);
  }

  // 從角色2的倒下圖片精靈中切割出每一個影格
  let fallDownChar2FrameWidth = fallDownChar2FrameInfo.width / fallDownChar2FrameInfo.count;
  for (let i = 0; i < fallDownChar2FrameInfo.count; i++) {
    let frame = fallDownChar2SpriteSheet.get(i * fallDownChar2FrameWidth, 0, fallDownChar2FrameWidth, fallDownChar2FrameInfo.height);
    fallDownChar2Animation.push(frame);
  }

  // 從第二個新角色圖片精靈中切割出每一個影格
  let newCharacter2FrameWidth = newCharacter2FrameInfo.width / newCharacter2FrameInfo.count;
  for (let i = 0; i < newCharacter2FrameInfo.count; i++) {
    let frame = newCharacterSpriteSheet2.get(i * newCharacter2FrameWidth, 0, newCharacter2FrameWidth, newCharacter2FrameInfo.height);
    newCharacterAnimation2.push(frame);
  }

  // 從角色3的觸碰圖片精靈中切割出每一個影格
  let touchCharacter3FrameWidth = touchCharacter3FrameInfo.width / touchCharacter3FrameInfo.count;
  for (let i = 0; i < touchCharacter3FrameInfo.count; i++) {
    let frame = touchCharacter3SpriteSheet.get(i * touchCharacter3FrameWidth, 0, touchCharacter3FrameWidth, touchCharacter3FrameInfo.height);
    touchCharacter3Animation.push(frame);
  }
}

function draw() {
  // 設定背景顏色
  background('#faedcd');
  imageMode(CENTER);

  // --- 角色2 (左邊角色) 的繪製與互動邏輯 ---
  const interactionThreshold = 120; // 判定互動的距離
  let distanceToChar2 = abs(x - newCharX);
  let char2CurrentFrame;

  if (isChar2Falling) {
    // 播放倒下動畫
    let frameIndex = floor(char2FallFrame);
    char2CurrentFrame = fallDownChar2Animation[frameIndex];
    char2FallFrame += 0.2; // 控制倒下動畫速度
    if (char2FallFrame >= fallDownChar2Animation.length) {
      isChar2Falling = false;
      char2FallFrame = 0;
    }
  } else {
    // 正常狀態下的互動邏輯
    if (distanceToChar2 < interactionThreshold) {
      if (!isInteractingWithChar2) { // 剛進入互動範圍
        isInteractingWithChar2 = true;
        char2Dialog = "需要我解答嗎？";
      }
      // 播放微笑動畫
      let frameIndex = floor(frameCount * 0.15) % smileCharacter2Animation.length;
      char2CurrentFrame = smileCharacter2Animation[frameIndex];

      // 顯示對話文字
      push(); // 保存當前繪圖設定
      const dialogWidth = textWidth(char2Dialog);
      const dialogPadding = 10;
      const dialogY = newCharY - 85;
      // 繪製對話框背景
      rectMode(CENTER);
      fill('#ffffff'); // 設定背景顏色為白色
      noStroke(); // 不要邊框
      rect(newCharX, dialogY, dialogWidth + dialogPadding * 2, 20 + dialogPadding);
      // 繪製文字
      fill(0); // 設定文字顏色為黑色
      textAlign(CENTER, CENTER);
      text(char2Dialog, newCharX, dialogY);
      pop(); // 恢復繪圖設定

      // 顯示輸入框
      inputElement.position(x - inputElement.width / 2, y - 100);

    } else {
      if (isInteractingWithChar2) { // 剛離開互動範圍
        isInteractingWithChar2 = false;
        char2Dialog = ""; // 清空對話
        inputElement.position(-1000, -1000); // 隱藏輸入框
      }
      // 播放站立動畫
      let frameIndex = floor(frameCount * 0.1) % newCharacterAnimation.length;
      char2CurrentFrame = newCharacterAnimation[frameIndex];
    }
  }

  push();
  translate(newCharX, newCharY);
  image(char2CurrentFrame, 0, 0);
  pop();

  // --- 角色3的繪製與互動邏輯 ---
  const proximityThreshold = 100; // 判定為「接近」的距離
  let distance = abs(x - newChar2X); // 計算角色1和角色3的水平距離
  let char3CurrentFrame;

  if (distance < proximityThreshold) {
    // 如果很接近，播放觸碰動畫
    let frameIndex = floor(frameCount * 0.2) % touchCharacter3Animation.length;
    char3CurrentFrame = touchCharacter3Animation[frameIndex];
  } else {
    // 如果不接近，播放原本的站立動畫
    let frameIndex = floor(frameCount * 0.1) % newCharacterAnimation2.length;
    char3CurrentFrame = newCharacterAnimation2[frameIndex];
  }

  push();
  translate(newChar2X, newChar2Y);
  if (x < newChar2X) {
    scale(-1, 1); // 翻轉使其朝右
  } else {
    scale(1, 1); // 保持預設朝左
  }
  image(char3CurrentFrame, 0, 0);
  pop();


  // 更新並繪製所有武器
  updateAndDrawTools();
  
  if (isJumping) {
    // 播放跳躍動畫
    let frameIndex = floor(jumpFrame);
    let currentFrame = jumpAnimation[frameIndex];

    // 第13張圖片的索引是12
    const apexFrame = 12; 
    if (frameIndex < apexFrame) {
      // 在到達最高點之前，角色向上移動
      y = startY - JUMP_HEIGHT * sin(map(frameIndex, 0, apexFrame, 0, HALF_PI));
    } else {
      // 到達最高點後，角色向下移動
      y = (startY - JUMP_HEIGHT) + JUMP_HEIGHT * cos(map(frameIndex, apexFrame, jumpAnimation.length - 1, 0, HALF_PI));
    }

    push();
    translate(x, y);
    scale(direction, 1);
    image(currentFrame, 0, 0);
    pop();

    jumpFrame += 0.5; // 控制跳躍動畫速度
    if (jumpFrame >= jumpAnimation.length) {
      isJumping = false;
      y = startY;
    }
  } else if (isPushing) {
    // 播放攻擊動畫
    let frameIndex = floor(pushFrame);
    let currentFrame = pushAnimation[frameIndex];
    push();
    translate(x, y);
    scale(direction, 1);
    image(currentFrame, 0, 0);
    pop();

    pushFrame += 0.5; // 控制攻擊動畫速度
    if (pushFrame >= pushAnimation.length) {
      isPushing = false;
      // 動畫結束後，產生一個新的武器
      tools.push({
        x: x + (50 * direction), // 從角色前方發射
        y: y,
        direction: direction,
        speed: 10,
        frame: 0
      });
    }

  } else if (isWalking) {
    if (keyIsDown(RIGHT_ARROW)) {
      direction = 1;
      x += speed;
    } else if (keyIsDown(LEFT_ARROW)) {
      direction = -1;
      x -= speed;
    }
    // 播放走路動畫
    let frameIndex = floor(frameCount * 0.2) % walkAnimation.length;
    let currentFrame = walkAnimation[frameIndex];
    push();
    translate(x, y);
    scale(direction, 1); // 根據方向翻轉圖片
    image(currentFrame, 0, 0);
    pop();
  } else {
    // 播放站立動畫
    let frameIndex = floor(frameCount * 0.1) % stopAnimation.length;
    let currentFrame = stopAnimation[frameIndex];
    push();
    translate(x, y);
    scale(direction, 1); // 保持上次的方向
    image(currentFrame, 0, 0);
    pop();
  }
}

function updateAndDrawTools() {
  for (let i = tools.length - 1; i >= 0; i--) {
    let tool = tools[i];
    tool.x += tool.speed * tool.direction;

    // 播放武器動畫
    let frameIndex = floor(tool.frame) % toolAnimation.length;
    let currentFrame = toolAnimation[frameIndex];

    push();
    translate(tool.x, tool.y);
    scale(tool.direction, 1);
    image(currentFrame, 0, 0);
    pop();

    tool.frame += 0.5; // 控制武器動畫速度

    // 檢查武器是否擊中角色2
    let distanceToChar2 = dist(tool.x, tool.y, newCharX, newCharY);
    if (distanceToChar2 < 50 && !isChar2Falling) { // 50是碰撞偵測的半徑
      isChar2Falling = true; // 觸發角色2倒下
      tools.splice(i, 1); // 移除武器
      continue; // 繼續下一個迴圈，避免後續的越界判斷出錯
    }

    // 如果武器超出畫布範圍，就將其移除
    if (tool.x > width + 100 || tool.x < -100) {
      tools.splice(i, 1);
    }
  }
}

function keyPressed() {
  if (keyCode === DOWN_ARROW && !isJumping && !isPushing) { // 向下鍵發射武器
    isPushing = true;
    isWalking = false;
    pushFrame = 0;
  } else if (keyCode === UP_ARROW && !isJumping && !isPushing) {
    isJumping = true;
    jumpFrame = 0;
  } else if (!isPushing && (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW)) {
    isWalking = true;
  }
}

function keyReleased() {
  if (!isJumping && !isPushing && (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW)) {
    isWalking = false;
  }
}

function windowResized() {
  // 當視窗大小改變時，重新調整畫布大小
  resizeCanvas(windowWidth, windowHeight);
}

function handleInput() {
  if (isInteractingWithChar2) {
    const inputText = inputElement.value();
    char2Dialog = inputText + ", 歡迎你";
    inputElement.value(''); // 清空輸入框
  }
}
