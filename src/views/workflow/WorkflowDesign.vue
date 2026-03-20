<template>
  <div class="workflow-design-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>流程设计</span>
          <div class="header-actions">
            <el-button type="primary" @click="saveWorkflow">保存流程</el-button>
            <el-button @click="previewWorkflow">预览流程</el-button>
          </div>
        </div>
      </template>
      
      <div class="design-content">
        <!-- 左侧工具栏 -->
        <div class="toolbox">
          <h3>工具栏</h3>
          <div class="tool-item" @dragstart="handleDragStart($event, 'start')">
            <el-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/></svg></el-icon>
            <span>开始节点</span>
          </div>
          <div class="tool-item" @dragstart="handleDragStart($event, 'task')">
            <el-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4h18zM7 10l4-4 4 4v11H7V10zm2-4h4l-2-2-2 2z"/></svg></el-icon>
            <span>任务节点</span>
          </div>
          <div class="tool-item" @dragstart="handleDragStart($event, 'decision')">
            <el-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11h2v6h-2v-6zm0-4h2v2h-2V7z"/></svg></el-icon>
            <span>决策节点</span>
          </div>
          <div class="tool-item" @dragstart="handleDragStart($event, 'end')">
            <el-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11h2v6h-2v-6zm0-4h2v2h-2V7z"/></svg></el-icon>
            <span>结束节点</span>
          </div>
        </div>
        
        <!-- 中间画布 -->
        <div class="canvas" @drop="handleDrop" @dragover.prevent>
          <div class="workflow-diagram" ref="workflowDiagram">
            <!-- 流程节点将在这里动态生成 -->
            <div class="node start-node" style="top: 50px; left: 50px;">
              <div class="node-content">
                <el-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"/></svg></el-icon>
                <span>开始</span>
              </div>
            </div>
            
            <div class="node task-node" style="top: 150px; left: 50px;">
              <div class="node-content">
                <el-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4h18zM7 10l4-4 4 4v11H7V10zm2-4h4l-2-2-2 2z"/></svg></el-icon>
                <span>处理订单</span>
              </div>
            </div>
            
            <div class="node decision-node" style="top: 250px; left: 50px;">
              <div class="node-content">
                <el-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11h2v6h-2v-6zm0-4h2v2h-2V7z"/></svg></el-icon>
                <span>是否通过</span>
              </div>
            </div>
            
            <div class="node end-node" style="top: 350px; left: 50px;">
              <div class="node-content">
                <el-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11h2v6h-2v-6zm0-4h2v2h-2V7z"/></svg></el-icon>
                <span>结束</span>
              </div>
            </div>
            
            <!-- 连接线 -->
            <svg class="connection-lines" width="100%" height="100%" style="position: absolute; top: 0; left: 0; pointer-events: none;">
              <line x1="100" y1="90" x2="100" y2="150" stroke="#909399" stroke-width="2" />
              <line x1="100" y1="190" x2="100" y2="250" stroke="#909399" stroke-width="2" />
              <line x1="100" y1="290" x2="100" y2="350" stroke="#909399" stroke-width="2" />
            </svg>
          </div>
        </div>
        
        <!-- 右侧属性面板 -->
        <div class="properties-panel">
          <h3>属性设置</h3>
          <el-form :model="nodeProperties">
            <el-form-item label="节点名称">
              <el-input v-model="nodeProperties.name" />
            </el-form-item>
            <el-form-item label="节点类型">
              <el-select v-model="nodeProperties.type" disabled>
                <el-option label="开始节点" value="start" />
                <el-option label="任务节点" value="task" />
                <el-option label="决策节点" value="decision" />
                <el-option label="结束节点" value="end" />
              </el-select>
            </el-form-item>
            <el-form-item label="负责人">
              <el-select v-model="nodeProperties.assignee" multiple>
                <el-option label="管理员" value="admin" />
                <el-option label="财务人员" value="finance" />
                <el-option label="运营人员" value="operation" />
              </el-select>
            </el-form-item>
            <el-form-item label="描述">
              <el-input
                v-model="nodeProperties.description"
                type="textarea"
                :rows="3"
              />
            </el-form-item>
            <el-form-item label="超时设置">
              <el-input-number v-model="nodeProperties.timeout" :min="0" />
              <span style="margin-left: 10px;">小时</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// 响应式数据
const workflowDiagram = ref<HTMLElement>()
const nodeProperties = reactive({
  name: '开始节点',
  type: 'start',
  assignee: [],
  description: '',
  timeout: 0
})

// 方法
const handleDragStart = (event: DragEvent, type: string) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', type)
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    const type = event.dataTransfer.getData('text/plain')
    const canvas = event.currentTarget as HTMLElement
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    console.log(`Dropped ${type} at (${x}, ${y})`)
    // 这里可以实现添加节点的逻辑
  }
}

const saveWorkflow = () => {
  console.log('保存流程')
  // 实现保存逻辑
}

const previewWorkflow = () => {
  console.log('预览流程')
  // 实现预览逻辑
}
</script>

<style scoped>
.workflow-design-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.design-content {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.toolbox {
  width: 150px;
  background: #f5f7fa;
  padding: 15px;
  border-radius: 8px;
}

.toolbox h3 {
  margin-bottom: 15px;
  font-size: 14px;
  color: #303133;
}

.tool-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  margin-bottom: 10px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  cursor: move;
  transition: all 0.3s;
}

.tool-item:hover {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.canvas {
  flex: 1;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  position: relative;
  min-height: 500px;
  overflow: auto;
}

.workflow-diagram {
  position: relative;
  width: 1000px;
  height: 600px;
  padding: 20px;
}

.node {
  position: absolute;
  width: 100px;
  height: 80px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.node-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.start-node {
  background: #67c23a;
  color: #fff;
}

.task-node {
  background: #409eff;
  color: #fff;
}

.decision-node {
  background: #e6a23c;
  color: #fff;
}

.end-node {
  background: #f56c6c;
  color: #fff;
}

.properties-panel {
  width: 300px;
  background: #f5f7fa;
  padding: 15px;
  border-radius: 8px;
}

.properties-panel h3 {
  margin-bottom: 15px;
  font-size: 14px;
  color: #303133;
}
</style>