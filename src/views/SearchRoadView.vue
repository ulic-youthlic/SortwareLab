<template>
  <div class="pathfinding-container">
    <!-- 头部区域 -->
    <div class="header">
      <div class="logo-area">
        <div class="logo-icon">🗺️</div>
        <div class="logo-text">
          <h1>智能寻路系统</h1>
          <p>智能路径规划 · 动态避障 · 效率优化</p>
        </div>
      </div>
<!--      <div class="user-area">-->
<!--        <div class="user-info">-->
<!--          <h3>玩家: {{ username }}</h3>-->
<!--          <p>当前状态: {{ navigationStatus }}</p>-->
<!--        </div>-->
<!--        <div class="user-avatar">-->
<!--          {{ avatarInitials }}-->
<!--        </div>-->
<!--      </div>-->
      <el-button class="back-button" type="primary" circle @click="goToMain">
        <el-icon><ArrowLeft /></el-icon>
      </el-button>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 地图展示区 -->
      <div class="map-container">
        <div class="map-title">
          <h2>🗺️ 地图导航视图</h2>
          <div class="map-actions">
            <select v-model="selectedMap" class="setting-control">
              <option v-for="map in maps" :key="map.id" :value="map.id">{{ map.name }}</option>
            </select>
          </div>
        </div>
        <div class="map-display">
          <div class="map-grid"></div>
          <div class="player"></div>
          <div class="target"></div>
          <div class="path-line" :style="pathStyle"></div>
          <div
              v-for="(obstacle, index) in obstacles"
              :key="index"
              class="obstacle"
              :style="{
              width: obstacle.width + 'px',
              height: obstacle.height + 'px',
              top: obstacle.top + 'px',
              left: obstacle.left + 'px'
            }"
          ></div>
        </div>
      </div>

      <!-- 控制面板 -->
      <div class="control-panel">
        <div class="panel-title">
          ⚙️ 寻路控制中心
        </div>

        <div class="status-card">
          <div class="status-indicator" :class="{ 'active': isNavigationEnabled }"></div>
          <h3>自动寻路状态</h3>
          <p>{{ isNavigationEnabled ? '运行中' : '已停用' }}</p>
        </div>

        <div class="switch-container">
          <label class="toggle-switch">
            <input type="checkbox" v-model="isNavigationEnabled" @change="toggleNavigation">
            <span class="slider"></span>
          </label>
          <div class="switch-label">
            {{ isNavigationEnabled ? '自动寻路已开启' : '自动寻路已关闭' }}
            <span>{{ isNavigationEnabled ? '系统正在规划路径中' : '点击开关启用自动寻路' }}</span>
          </div>
        </div>

        <div class="settings-panel">
          <h3 class="settings-title">
            ⚙️ 寻路设置
          </h3>

          <div class="setting-item">
            <label class="setting-label">路径规划策略</label>
            <select v-model="pathStrategy" class="setting-control">
              <option value="shortest">最短路径优先</option>
              <option value="safest">最安全路径优先</option>
              <option value="balanced">平衡路径</option>
            </select>
          </div>

          <div class="setting-item">
            <label class="setting-label">寻路速度</label>
            <input type="range" min="1" max="10" v-model="navigationSpeed" class="setting-control">
            <div class="slider-value">
              速度: {{ navigationSpeed }}/10
            </div>
          </div>

          <div class="setting-item">
            <label class="setting-label">避障灵敏度</label>
            <input type="range" min="1" max="10" v-model="obstacleSensitivity" class="setting-control">
            <div class="slider-value">
              灵敏度: {{ obstacleSensitivity }}/10
            </div>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">⚡</div>
            <h4>平均寻路时间</h4>
            <p>{{ isNavigationEnabled ? '0.8s' : '--' }}</p>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <h4>避障成功率</h4>
            <p>{{ isNavigationEnabled ? '98.7%' : '--' }}</p>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🔄</div>
            <h4>路径优化率</h4>
            <p>{{ isNavigationEnabled ? '+42%' : '--' }}</p>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🏃</div>
            <h4>移动效率提升</h4>
            <p>{{ isNavigationEnabled ? '+35%' : '--' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <div class="footer">
      <p>© 2023 FPS游戏智能系统 | 智能寻路模块 v1.5.2 | 最后更新: {{ lastUpdate }}</p>
    </div>
  </div>
</template>

<script>
import {ArrowLeft} from "@element-plus/icons-vue";
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
const router = useRouter();
const route = useRoute();
const username = ref(route.params.username || '游戏玩家');
export default {
  name: 'PathfindingView',
  components: {ArrowLeft},
  data() {
    return {
      username: "GamePlayer123",
      avatarInitials: "GP",
      isNavigationEnabled: false,
      navigationStatus: "未激活",
      pathStrategy: "balanced",
      navigationSpeed: 7,
      obstacleSensitivity: 8,
      selectedMap: "desert",
      maps: [
        { id: "desert", name: "沙漠地图" },
        { id: "city", name: "城市地图" },
        { id: "jungle", name: "丛林地图" },
        { id: "snow", name: "雪地地图" }
      ],
      obstacles: [
        { width: 120, height: 80, top: 100, left: 250 },
        { width: 100, height: 180, top: 220, left: 450 },
        { width: 180, height: 60, top: 300, left: 150 }
      ],
      lastUpdate: "2025-06-14"
    };
  },
  computed: {
    pathStyle() {
      if (!this.isNavigationEnabled) {
        return {
          display: 'none'
        };
      }

      const startX = 20;
      const startY = 50;
      const endX = 80;
      const endY = 30;

      // 计算路径长度和角度
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

      return {
        width: `${length}%`,
        top: `${startY}%`,
        left: `${startX}%`,
        transform: `rotate(${angle}deg)`,
        display: 'block'
      };
    }
  },
  methods: {
    toggleNavigation() {
      this.navigationStatus = this.isNavigationEnabled ? "运行中" : "未激活";

      // 这里可以添加API调用逻辑
      console.log(`自动寻路已${this.isNavigationEnabled ? '开启' : '关闭'}`);
    }
  }
};

const goToMain = () => {
  router.push(`/${username.value}/main`);
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
}

.pathfinding-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: 30px;
  display: flex;
  flex-direction: column;
  background:
      radial-gradient(circle at 20% 30%, rgba(20, 25, 45, 0.9) 0%, rgba(10, 15, 30, 0.95) 100%),
      linear-gradient(to bottom, #0f1420, #0a0e17);
  background-size: cover;
  color: #e0e7ff;
}

/* 头部导航 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  margin-bottom: 30px;
  border-bottom: 1px solid rgba(80, 120, 200, 0.3);
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo-icon {
  font-size: 32px;
  color: #45aaf2;
}

.logo-text h1 {
  font-size: 26px;
  font-weight: 700;
  background: linear-gradient(to right, #a0c0ff, #70a0ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 1px;
}

.logo-text p {
  font-size: 14px;
  color: #a0b0d0;
  letter-spacing: 1px;
  margin-top: 4px;
}

.user-area {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info {
  text-align: right;
}

.user-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #e0e7ff;
}

.user-info p {
  font-size: 13px;
  color: #8090c0;
  margin-top: 3px;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a6fcb, #45aaf2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
}

/* 主内容区 */
.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  margin-bottom: 40px;
  flex: 1;
}

@media (max-width: 900px) {
  .main-content {
    grid-template-columns: 1fr;
  }
}

.map-container {
  background: rgba(25, 35, 60, 0.7);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(100, 150, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.map-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(100, 150, 255, 0.2);
}

.map-title h2 {
  font-size: 20px;
  font-weight: 600;
  color: #e0e0ff;
  display: flex;
  align-items: center;
  gap: 10px;
}

.map-display {
  height: 400px;
  background: rgba(10, 15, 30, 0.6);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.map-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
      linear-gradient(rgba(80, 100, 180, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(80, 100, 180, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

.player {
  position: absolute;
  width: 16px;
  height: 16px;
  background: #0acf83;
  border-radius: 50%;
  border: 2px solid white;
  top: 50%;
  left: 20%;
  transform: translate(-50%, -50%);
  z-index: 10;
  box-shadow: 0 0 10px #0acf83;
}

.target {
  position: absolute;
  width: 16px;
  height: 16px;
  background: #ff6b6b;
  border-radius: 50%;
  border: 2px solid white;
  top: 30%;
  left: 80%;
  transform: translate(-50%, -50%);
  z-index: 10;
  box-shadow: 0 0 10px #ff6b6b;
}

.path-line {
  position: absolute;
  height: 4px;
  background: #45aaf2;
  transform-origin: left center;
  z-index: 5;
  box-shadow: 0 0 5px #45aaf2;
}

.obstacle {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.control-panel {
  background: rgba(25, 35, 60, 0.7);
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(100, 150, 255, 0.2);
}

.panel-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 25px;
  color: #e0e0ff;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(100, 150, 255, 0.2);
}

.status-card {
  background: rgba(25, 35, 60, 0.7);
  border-radius: 12px;
  padding: 25px;
  text-align: center;
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(100, 150, 255, 0.2);
}

.status-indicator {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  margin: 0 auto 20px;
  position: relative;
  border: 4px solid #ff4949;
  transition: all 0.5s ease;
}

.status-indicator.active {
  border-color: #13ce66;
}

.status-indicator::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  border-radius: 50%;
  background: rgba(255, 73, 73, 0.2);
  box-shadow: 0 0 20px rgba(255, 73, 73, 0.3);
  transition: all 0.5s ease;
}

.status-indicator.active::before {
  background: rgba(19, 206, 102, 0.2);
  box-shadow: 0 0 20px rgba(19, 206, 102, 0.3);
}

.status-card h3 {
  font-size: 22px;
  margin-bottom: 10px;
  color: #e0e0ff;
}

.status-card p {
  font-size: 18px;
  color: #70a0ff;
  font-weight: 500;
}

.switch-container {
  background: rgba(20, 25, 45, 0.6);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(100, 150, 255, 0.2);
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 80px;
  height: 40px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ff4949;
  transition: .4s;
  border-radius: 40px;
  box-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
}

.slider:before {
  position: absolute;
  content: "";
  height: 32px;
  width: 32px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #13ce66;
  box-shadow: 0 0 10px rgba(19, 206, 102, 0.5);
}

input:checked + .slider:before {
  transform: translateX(40px);
}

.switch-label {
  margin-left: 20px;
  font-size: 18px;
  font-weight: 500;
  color: #e0e0ff;
  display: flex;
  flex-direction: column;
}

.switch-label span {
  font-size: 14px;
  color: #a0b0d0;
  margin-top: 5px;
}

.settings-panel {
  margin-top: 30px;
}

.settings-title {
  font-size: 18px;
  margin-bottom: 20px;
  color: #e0e0ff;
  display: flex;
  align-items: center;
  gap: 10px;
}

.setting-item {
  margin-bottom: 20px;
}

.setting-label {
  display: block;
  margin-bottom: 10px;
  color: #e0e0ff;
  font-weight: 500;
}

.setting-control {
  width: 100%;
  height: 40px;
  background: rgba(20, 25, 45, 0.6);
  border: 1px solid rgba(100, 150, 255, 0.3);
  border-radius: 8px;
  padding: 0 15px;
  color: #e0e0ff;
  font-size: 16px;
}

.slider-value {
  text-align: center;
  margin-top: 5px;
  color: #a0b0d0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 30px;
}

.stat-card {
  background: rgba(25, 35, 60, 0.7);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  border: 1px solid rgba(100, 150, 255, 0.2);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(64, 96, 192, 0.3);
  border-color: #70a0ff;
}

.stat-icon {
  font-size: 28px;
  margin-bottom: 15px;
  color: #70a0ff;
}

.stat-card h4 {
  font-size: 16px;
  margin-bottom: 10px;
  color: #d0d8ff;
}

.stat-card p {
  font-size: 24px;
  font-weight: 700;
  color: #70a0ff;
}

/* 页脚 */
.footer {
  text-align: center;
  padding: 30px 0 10px;
  color: #8090c0;
  font-size: 14px;
  border-top: 1px solid rgba(80, 120, 200, 0.2);
  margin-top: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .user-area {
    justify-content: center;
    width: 100%;
  }

  .user-info {
    text-align: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>