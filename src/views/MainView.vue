<template>
  <div class="main-container">
    <!-- 武器装饰 -->
    <div class="weapon-deco weapon-1">🔫</div>
    <div class="weapon-deco weapon-2">🔫</div>

    <!-- 头部区域 -->
    <div class="header">
      <div class="logo-area">
        <div class="logo-icon">🎯</div>
        <div class="logo-text">
          <h1>FPS游戏智能系统</h1>
          <p>精准分析 · 战术优化 · 竞技提升</p>
        </div>
      </div>

      <div class="user-area">
        <div class="user-info">
          <h3>玩家: {{ username }}</h3>
          <p>最后登录: {{ lastLogin }}</p>
        </div>
        <div class="user-avatar">
          {{ avatarInitials }}
        </div>
      </div>
    </div>

    <!-- 功能按钮区 -->
    <div class="section-title">
      <span>📋</span>
      <span>系统功能</span>
    </div>

    <div class="features-grid">
      <div class="feature-card" @click="navigateTo('/autoaim')">
        <div class="feature-icon">🔫</div>
        <h3>自动瞄准</h3>
        <p>辅助自动瞄准敌人并开火</p>
      </div>

      <div class="feature-card" @click="navigateTo('/tactics-library')">
        <div class="feature-icon">🗺️</div>
        <h3>智能寻路</h3>
        <p>根据地图或视觉信息自动探路</p>
      </div>

      <div class="feature-card" @click="navigateTo('/data')">
        <div class="feature-icon">📊</div>
        <h3>数据分析</h3>
        <p>游戏表现数据可视化</p>
      </div>

      <div class="feature-card" @click="navigateTo('/training')">
        <div class="feature-icon">🏋️</div>
        <h3>历史回放</h3>
        <p>可查看录制的历史回放</p>
      </div>
    </div>

    <!-- 页脚 -->
    <div class="footer">
      <p>© 2023 FPS游戏智能系统 | 版本 2.1.5 | 数据更新于 {{ lastUpdate }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const lastLogin = ref('2025-06-01 21:45');
    const lastUpdate = ref('2025-06-01 09:30');
    const avatarInitials = ref('GP');
    const route = useRoute();
    const username = ref(route.params.username || '');

    const navigateTo = (path) => {
      // 从 sessionStorage 获取用户名
      const currentUser = sessionStorage.getItem('username') || '';

      // 构造新路径: /{username}/path
      const userPath = `/${currentUser}${path}`;

      // 使用 router.push 导航到新路径
      router.push(userPath);
    }

    return {
      username,
      lastLogin,
      lastUpdate,
      avatarInitials,
      navigateTo
    };
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
}

.main-container {
  position: relative;
  width: 100%;
  max-width: 1200px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  background:
      radial-gradient(circle at 20% 30%, rgba(30, 30, 50, 0.8) 0%, rgba(10, 10, 20, 0.9) 100%),
      url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23161b22"/><path d="M0 0L100 100M100 0L0 100" stroke="%23222" stroke-width="0.5"/></svg>');
  background-size: cover;
  color: #e0e0ff;
}

/* 头部导航 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid rgba(80, 120, 200, 0.3);
  margin-bottom: 40px;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 15px;
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
  color: #a0c0ff;
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

/* 功能按钮区 */
.section-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #e0e7ff;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(80, 120, 200, 0.2);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
  flex: 1;
}

.feature-card {
  background: rgba(25, 35, 60, 0.7);
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(100, 150, 255, 0.2);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(64, 96, 192, 0.5);
  border-color: #70a0ff;
  background: rgba(30, 45, 75, 0.8);
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
}

.feature-card:nth-child(1)::before { background: linear-gradient(to right, #ff7eb3, #ff758c); }
.feature-card:nth-child(2)::before { background: linear-gradient(to right, #7ee8fa, #0acf83); }
.feature-card:nth-child(3)::before { background: linear-gradient(to right, #a18cd1, #fbc2eb); }
.feature-card:nth-child(4)::before { background: linear-gradient(to right, #6a85b6, #4b6cb7); }

.feature-icon {
  font-size: 64px;
  margin-bottom: 20px;
  background: linear-gradient(to right, #a0c0ff, #70a0ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1);
}

.feature-card h3 {
  font-size: 22px;
  margin-bottom: 15px;
  color: #e0e0ff;
}

.feature-card p {
  font-size: 15px;
  color: #a0b0d0;
  line-height: 1.5;
  max-width: 90%;
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

/* 武器装饰 */
.weapon-deco {
  position: fixed;
  font-size: 200px;
  opacity: 0.03;
  z-index: -1;
  pointer-events: none;
}

.weapon-1 {
  top: 15%;
  left: 5%;
  transform: rotate(-20deg);
}

.weapon-2 {
  bottom: 15%;
  right: 5%;
  transform: rotate(15deg);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .feature-card {
    padding: 30px 15px;
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .user-area {
    width: 100%;
    justify-content: center;
  }

  .user-info {
    text-align: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .logo-area {
    justify-content: center;
  }

  .weapon-deco {
    font-size: 150px;
  }
}

@media (max-width: 480px) {
  .main-container {
    padding: 20px 15px;
  }

  .feature-card {
    padding: 25px 15px;
  }

  .feature-icon {
    font-size: 48px;
  }

  .feature-card h3 {
    font-size: 20px;
  }
}
</style>