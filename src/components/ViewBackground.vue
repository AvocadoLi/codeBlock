<template>
  <div class="background-container">
    <canvas ref="canvasRef" class="dot-canvas"></canvas>
    <div class="relative z-3">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const canvasRef = ref<HTMLCanvasElement | null>(null);
const mouseX = ref(0);
const mouseY = ref(0);
let animationFrameId: number | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let dots: { 
  x: number, 
  y: number, 
  size: number, 
  originalSize: number, 
  brightness: number, 
  flickerSpeed: number,
  restCounter: number, // 休息计数器
  targetBrightness: number // 目标亮度
}[] = [];

const DOT_SPACING = 20; // 点之间的间距
const DOT_RADIUS = 1; // 默认点的半径
const HIGHLIGHT_RADIUS = 200; // 高亮效果的半径
const MAX_DOT_SIZE = 5; // 最大点的大小
const FLICKER_CHANCE = 0.006; // 每帧点开始闪烁的概率（降低）
const MIN_BRIGHTNESS = 0.3; // 最小亮度
const MAX_BRIGHTNESS = 1.0; // 最大亮度
const CONTINUE_FLICKER_CHANCE = 0.8; // 完成一次闪烁后继续闪烁的概率（降低）
const REST_DURATION = 20; // 闪烁后休息的帧数（增加到约2秒）
const TRANSITION_SPEED = 0.01; // 亮度过渡速度（降低）

// 监听鼠标移动事件
const handleMouseMove = (event: MouseEvent) => {
  mouseX.value = event.clientX;
  mouseY.value = event.clientY;
}

// 初始化画布和点阵
const initCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  
  // 设置画布大小为窗口大小
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // 创建点阵数组
  dots = [];
  const cols = Math.ceil(canvas.width / DOT_SPACING);
  const rows = Math.ceil(canvas.height / DOT_SPACING);
  
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const initialBrightness = Math.random() * (MAX_BRIGHTNESS - MIN_BRIGHTNESS) + MIN_BRIGHTNESS;
      dots.push({
        x: i * DOT_SPACING,
        y: j * DOT_SPACING,
        size: DOT_RADIUS,
        originalSize: DOT_RADIUS,
        brightness: initialBrightness,
        targetBrightness: initialBrightness, // 初始目标亮度与当前亮度相同
        flickerSpeed: 0, // 闪烁速度，0表示不闪烁
        restCounter: Math.floor(Math.random() * REST_DURATION) // 随机初始休息时间
      });
    }
  }
  
  // 开始动画循环
  animate();
}

// 处理窗口大小变化
const handleResize = () => {
  if (canvasRef.value) {
    canvasRef.value.width = window.innerWidth;
    canvasRef.value.height = window.innerHeight;
    initCanvas();
  }
}

// 动画循环
const animate = () => {
  if (!ctx || !canvasRef.value) return;
  
  // 清除画布
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  
  // 更新和绘制每个点
  dots.forEach(dot => {
    // 计算点到鼠标的距离
    const dx = dot.x - mouseX.value;
    const dy = dot.y - mouseY.value;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 根据距离计算点的大小
    if (distance < HIGHLIGHT_RADIUS) {
      // 距离越近，点越大
      const scale = 1 - distance / HIGHLIGHT_RADIUS;
      dot.size = dot.originalSize + (MAX_DOT_SIZE - dot.originalSize) * scale;
    } else {
      // 恢复原始大小
      dot.size = dot.originalSize;
    }
    
    // 处理休息状态
    if (dot.restCounter > 0) {
      dot.restCounter--;
      // 如果休息结束，有机会开始新的闪烁
      if (dot.restCounter === 0) {
        if (Math.random() < FLICKER_CHANCE * 5) {
          // 设置新的目标亮度
          dot.targetBrightness = Math.random() < 0.5 ? 
            MAX_BRIGHTNESS : 
            MIN_BRIGHTNESS;
          dot.flickerSpeed = TRANSITION_SPEED;
        } else {
          // 继续休息
          dot.restCounter = Math.floor(Math.random() * REST_DURATION) + REST_DURATION / 2;
        }
      }
    }
    // 随机决定是否开始闪烁（仅当不在休息状态且当前不在闪烁时）
    else if (dot.flickerSpeed === 0 && Math.random() < FLICKER_CHANCE) {
      // 设置新的目标亮度
      dot.targetBrightness = Math.random() < 0.5 ? 
        MAX_BRIGHTNESS : 
        MIN_BRIGHTNESS;
      dot.flickerSpeed = TRANSITION_SPEED;
    }
    
    // 平滑过渡到目标亮度
    if (dot.flickerSpeed !== 0) {
      // 如果当前亮度接近目标亮度
      if (Math.abs(dot.brightness - dot.targetBrightness) < TRANSITION_SPEED) {
        dot.brightness = dot.targetBrightness;
        
        // 到达目标亮度后，决定下一步
        if (Math.random() < CONTINUE_FLICKER_CHANCE) {
          // 设置新的目标亮度（反向）
          dot.targetBrightness = dot.targetBrightness === MAX_BRIGHTNESS ? 
            MIN_BRIGHTNESS : 
            MAX_BRIGHTNESS;
        } else {
          // 停止闪烁并进入休息状态
          dot.flickerSpeed = 0;
          dot.restCounter = Math.floor(Math.random() * REST_DURATION) + REST_DURATION;
        }
      } else {
        // 平滑过渡
        if (dot.brightness < dot.targetBrightness) {
          dot.brightness += dot.flickerSpeed;
        } else {
          dot.brightness -= dot.flickerSpeed;
        }
      }
    }
    
    // 设置点的颜色（根据亮度）
    const brightness = Math.floor(dot.brightness * 255);
    ctx!.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
    
    // 绘制点
    ctx?.beginPath();
    ctx?.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
    ctx?.fill();
  });
  
  // 继续下一帧动画
  animationFrameId = requestAnimationFrame(animate);
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('resize', handleResize);
  initCanvas();
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('resize', handleResize);
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
})
</script>

<style lang="scss" scoped>
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: black;
  z-index: 1;
}

.dot-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}
</style>