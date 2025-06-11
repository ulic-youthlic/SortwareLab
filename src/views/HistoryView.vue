<template>
  <div class="history-view">
    <!-- 头部区域 -->
    <div class="header">
      <div class="logo-area">
        <div class="crosshair"></div>
        <div class="logo-text">
          <h1>游戏历史回放系统</h1>
          <p>精彩瞬间 · 永恒记录 · 随时重温</p>
        </div>
      </div>
      <div class="user-area">
        <div class="user-info">
          <h3>玩家: {{ username }}</h3>
          <p>已存储 {{ recordings.length }} 个回放</p>
        </div>
      </div>
    </div>

    <!-- 回放控制区域 -->
    <div class="control-section">
      <div class="path-setting">
        <h3><el-icon><Folder /></el-icon> 回放存储路径</h3>
        <div class="path-input-group">
          <el-input
              v-model="storagePath"
              placeholder="请输入回放存储路径"
              class="path-input"
          >
            <template #prepend>
              <el-icon><FolderOpened /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" @click="savePath">
            <el-icon><Check /></el-icon>
            保存路径
          </el-button>
          <el-button @click="browsePath">
            <el-icon><FolderAdd /></el-icon>
            浏览文件夹
          </el-button>
        </div>
        <p class="path-hint">当前路径: {{ currentPath }}</p>
      </div>

      <div class="recording-control">
        <h3><el-icon><VideoCamera /></el-icon> 录制控制</h3>
        <div class="control-buttons">
          <el-switch
              v-model="isRecordingEnabled"
              active-text="启用自动录制"
              inactive-text="禁用自动录制"
              :active-value="true"
              :inactive-value="false"
              @change="toggleRecording"
              size="large"
              active-color="#13ce66"
          >
          </el-switch>

          <el-button
              type="primary"
              :icon="isRecording ? VideoPause : VideoPlay"
              :disabled="!isRecordingEnabled"
              @click="toggleRecordingStatus"
          >
            {{ isRecording ? '停止录制' : '开始录制' }}
          </el-button>
        </div>

        <div class="recording-status">
          <div class="status-indicator" :class="{ active: isRecording }"></div>
          <span>{{ recordingStatusText }}</span>
        </div>
      </div>
    </div>

    <!-- 回放列表 -->
    <div class="recordings-section">
      <h3><el-icon><Collection /></el-icon> 历史回放记录</h3>

      <div v-if="recordings.length === 0" class="no-recordings">
        <el-icon><DocumentDelete /></el-icon>
        <p>暂无历史回放记录</p>
      </div>

      <div v-else class="recordings-grid">
        <div
            v-for="recording in recordings"
            :key="recording.id"
            class="recording-card"
        >
          <div class="recording-thumbnail">
            <div class="thumbnail-overlay">
              <el-button
                  type="success"
                  circle
                  @click="playRecording(recording)"
              >
                <el-icon><VideoPlay /></el-icon>
              </el-button>
            </div>
          </div>

          <div class="recording-details">
            <h4>{{ recording.title }}</h4>
            <p class="recording-date">
              <el-icon><Clock /></el-icon>
              {{ formatDate(recording.date) }}
            </p>
            <p class="recording-duration">
              <el-icon><Timer /></el-icon>
              时长: {{ recording.duration }} 分钟
            </p>
            <p class="recording-map">
              <el-icon><MapLocation /></el-icon>
              地图: {{ recording.map }}
            </p>
            <div class="recording-actions">
              <el-button type="primary" text @click="playRecording(recording)">
                <el-icon><VideoPlay /></el-icon>
                播放
              </el-button>
              <el-button type="info" text @click="openFolder(recording)">
                <el-icon><FolderOpened /></el-icon>
                打开位置
              </el-button>
              <el-button type="danger" text @click="deleteRecording(recording)">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 播放器模态框 -->
    <el-dialog
        v-model="playerVisible"
        title="回放播放器"
        width="80%"
        top="5vh"
        :fullscreen="isFullscreen"
    >
      <div class="player-container">
        <div class="player-header">
          <h3>{{ currentRecording.title }}</h3>
          <div class="player-controls">
            <el-button type="info" circle @click="toggleFullscreen">
              <el-icon><FullScreen /></el-icon>
            </el-button>
            <el-button type="danger" circle @click="playerVisible = false">
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
        </div>
        <div class="video-container">
          <div class="video-placeholder">
            <el-icon class="play-icon"><VideoPlay /></el-icon>
            <p>正在播放: {{ currentRecording.title }}</p>
          </div>
          <div class="playback-controls">
            <el-slider v-model="playbackProgress" :step="1" />
            <div class="time-display">
              <span>{{ formatTime(currentTime) }}</span>
              <span>{{ formatTime(totalTime) }}</span>
            </div>
            <div class="control-buttons">
              <el-button circle>
                <el-icon><RefreshLeft /></el-icon>
              </el-button>
              <el-button type="success" circle>
                <el-icon><VideoPlay /></el-icon>
              </el-button>
              <el-button circle>
                <el-icon><RefreshRight /></el-icon>
              </el-button>
              <el-button circle>
<!--                <el-icon><Volume /></el-icon>-->
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 页脚 -->
    <div class="footer">
      <p>© 2023 FPS游戏智能系统 | 历史回放模块 v2.3.1 | 存储空间: {{ storageSpace }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  Folder, FolderOpened, VideoCamera, Collection,
  Clock, Timer, MapLocation, VideoPlay,
  Check, FolderAdd, FullScreen, Close,
  RefreshLeft, RefreshRight, Delete,
  DocumentDelete, VideoPause
} from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute } from 'vue-router';

const route = useRoute();
const username = ref(route.params.username || '游戏玩家');

// 路径设置
const storagePath = ref('');
const currentPath = ref('/Users/GamePlayer/Documents/GameReplays');
const isPathSaved = ref(false);

// 录制控制
const isRecordingEnabled = ref(false);
const isRecording = ref(false);
const recordingStatusText = computed(() => {
  if (!isRecordingEnabled.value) return '录制功能已禁用';
  return isRecording.value ? '正在录制...' : '准备录制';
});

// 回放列表
const recordings = ref([
  {
    id: 1,
    title: '荒漠迷城 5杀精彩时刻',
    date: '2023-10-18T14:25:00',
    duration: 8.5,
    map: '荒漠迷城',
    path: '/replays/replay001.mp4'
  },
  {
    id: 2,
    title: '炼狱小镇 最终回合',
    date: '2023-10-17T22:15:00',
    duration: 12.2,
    map: '炼狱小镇',
    path: '/replays/replay002.mp4'
  },
  {
    id: 3,
    title: '殒命大厦 ACE瞬间',
    date: '2023-10-16T19:45:00',
    duration: 6.3,
    map: '殒命大厦',
    path: '/replays/replay003.mp4'
  },
  {
    id: 4,
    title: '死亡游乐园 1v5残局',
    date: '2023-10-15T20:30:00',
    duration: 10.1,
    map: '死亡游乐园',
    path: '/replays/replay004.mp4'
  }
]);

// 播放器状态
const playerVisible = ref(false);
const isFullscreen = ref(false);
const currentRecording = ref(null);
const playbackProgress = ref(30);
const currentTime = ref(125);
const totalTime = ref(412);

// 存储空间
const storageSpace = computed(() => {
  const total = 50; // GB
  const used = 12.7; // GB
  return `${used.toFixed(1)}GB / ${total}GB (${Math.round((used/total)*100)}%)`;
});

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 格式化时间
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// 保存路径
const savePath = () => {
  if (!storagePath.value) {
    ElMessage.warning('请输入存储路径');
    return;
  }

  // 模拟保存到后端
  setTimeout(() => {
    currentPath.value = storagePath.value;
    isPathSaved.value = true;
    ElMessage.success('存储路径已更新');
  }, 500);
};

// 浏览文件夹
const browsePath = () => {
  // 在实际应用中，这里会调用系统文件选择对话框
  ElMessage.info('浏览文件夹功能需要桌面应用支持');
  storagePath.value = '/Users/GamePlayer/Documents/GameReplays';
};

// 切换录制功能
const toggleRecording = (enabled) => {
  if (enabled) {
    ElMessage.success('自动录制功能已启用');
  } else {
    if (isRecording.value) {
      isRecording.value = false;
      ElMessage.warning('录制已停止');
    }
    ElMessage.info('自动录制功能已禁用');
  }
};

// 切换录制状态
const toggleRecordingStatus = () => {
  isRecording.value = !isRecording.value;

  if (isRecording.value) {
    ElMessage.success('开始录制游戏回放');
    // 模拟添加新录制
    setTimeout(() => {
      recordings.value.unshift({
        id: recordings.value.length + 1,
        title: `新录制 ${formatDate(new Date())}`,
        date: new Date().toISOString(),
        duration: 0,
        map: '未知地图',
        path: '/replays/new_recording.mp4'
      });
    }, 1000);
  } else {
    ElMessage.info('录制已停止');
  }
};

// 播放回放
const playRecording = (recording) => {
  currentRecording.value = recording;
  playerVisible.value = true;
};

// 打开文件夹
const openFolder = (recording) => {
  ElMessage.info(`打开文件夹: ${recording.path}`);
  // 实际应用中会调用系统API打开文件管理器
};

// 删除回放
const deleteRecording = (recording) => {
  ElMessageBox.confirm(
      `确定要删除回放 "${recording.title}" 吗？此操作无法撤销。`,
      '删除回放',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }
  ).then(() => {
    recordings.value = recordings.value.filter(r => r.id !== recording.id);
    ElMessage.success('回放已删除');
  }).catch(() => {
    // 用户取消
  });
};

// 切换全屏
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};

onMounted(() => {
  // 初始化当前路径
  storagePath.value = currentPath.value;
});
</script>

<style scoped>
.history-view {
  position: relative;
  min-height: 100vh;
  background:
      radial-gradient(circle at 20% 30%, rgba(20, 25, 45, 0.9) 0%, rgba(10, 15, 30, 0.95) 100%),
      url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23121825"/><path d="M0 0L100 100M100 0L0 100" stroke="%23222" stroke-width="0.3"/></svg>');
  background-size: cover;
  padding: 30px;
  color: #e0e0ff;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  display: flex;
  flex-direction: column;
}

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

.crosshair {
  position: relative;
  width: 50px;
  height: 50px;
  background: rgba(100, 150, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.crosshair::before, .crosshair::after {
  content: '';
  position: absolute;
  background: #70a0ff;
  border-radius: 1px;
}

.crosshair::before {
  width: 100%;
  height: 3px;
  top: 50%;
  transform: translateY(-50%);
}

.crosshair::after {
  width: 3px;
  height: 100%;
  left: 50%;
  transform: translateX(-50%);
}

.logo-text h1 {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(to right, #a0c0ff, #70a0ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.logo-text p {
  font-size: 14px;
  color: #a0c0ff;
  letter-spacing: 1px;
  margin-top: 5px;
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
  color: #e0e0ff;
}

.user-info p {
  font-size: 14px;
  color: #70a0ff;
  margin-top: 5px;
  font-weight: 500;
}

.control-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.path-setting, .recording-control {
  background: rgba(25, 35, 60, 0.7);
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(100, 150, 255, 0.2);
}

.path-setting h3, .recording-control h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  margin-bottom: 20px;
  color: #a0c0ff;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(100, 150, 255, 0.2);
}

.path-input-group {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.path-input {
  flex: 1;
}

.path-hint {
  font-size: 14px;
  color: #8090c0;
  padding: 10px;
  background: rgba(30, 40, 70, 0.5);
  border-radius: 6px;
  margin-top: 15px;
}

.control-buttons {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 25px;
}

.recording-status {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(30, 40, 70, 0.5);
  border-radius: 8px;
}

.status-indicator {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #ff4949;
  box-shadow: 0 0 8px rgba(255, 73, 73, 0.5);
  transition: all 0.3s ease;
}

.status-indicator.active {
  background-color: #13ce66;
  box-shadow: 0 0 12px rgba(19, 206, 102, 0.7);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 0.7; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
}

.recordings-section {
  flex: 1;
  background: rgba(25, 35, 60, 0.7);
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(100, 150, 255, 0.2);
  margin-bottom: 30px;
}

.recordings-section h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  margin-bottom: 20px;
  color: #a0c0ff;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(100, 150, 255, 0.2);
}

.no-recordings {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #8090c0;
  text-align: center;
}

.no-recordings .el-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.recordings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
}

.recording-card {
  background: rgba(30, 40, 70, 0.5);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.recording-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(64, 96, 192, 0.4);
  border-color: rgba(100, 150, 255, 0.4);
}

.recording-thumbnail {
  height: 180px;
  background:
      linear-gradient(135deg, #4a6fcb, #45aaf2),
      url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%231d2c4d"/><path d="M0 0L100 100M100 0L0 100" stroke="%23255" stroke-width="1"/></svg>');
  background-size: cover;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.recording-card:hover .thumbnail-overlay {
  opacity: 1;
}

.recording-details {
  padding: 20px;
}

.recording-details h4 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #e0e0ff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recording-details p {
  font-size: 14px;
  color: #a0b0d0;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.recording-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(100, 150, 255, 0.2);
}

.player-container {
  background: rgba(20, 25, 40, 0.9);
  border-radius: 10px;
  overflow: hidden;
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: rgba(30, 40, 70, 0.7);
  border-bottom: 1px solid rgba(100, 150, 255, 0.2);
}

.player-header h3 {
  color: #e0e0ff;
  margin: 0;
}

.player-controls {
  display: flex;
  gap: 10px;
}

.video-container {
  position: relative;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
}

.video-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
      linear-gradient(135deg, #1a2a6c, #b21f1f, #1a2a6c),
      url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23161b22"/><path d="M0 0L100 100M100 0L0 100" stroke="%23222" stroke-width="0.5"/></svg>');
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.play-icon {
  font-size: 80px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;
}

.playback-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 15px;
  background: rgba(0, 0, 0, 0.7);
}

.time-display {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #a0b0d0;
  margin-top: 8px;
}

.control-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 15px;
}

.footer {
  text-align: center;
  padding: 30px 0 10px;
  color: #8090c0;
  font-size: 14px;
  border-top: 1px solid rgba(80, 120, 200, 0.2);
  margin-top: auto;
}

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

  .control-section {
    grid-template-columns: 1fr;
  }

  .path-input-group {
    flex-direction: column;
  }
}
</style>