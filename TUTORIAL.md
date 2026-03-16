# Cursor Cloud Agents API 教程 / Cursor Cloud Agents API Tutorial

## 目录 / Table of Contents

- [1. 介绍 / Introduction](#1-介绍--introduction)
- [2. 前置条件 / Prerequisites](#2-前置条件--prerequisites)
- [3. 认证 / Authentication](#3-认证--authentication)
- [4. 核心 API 端点 / Core API Endpoints](#4-核心-api-端点--core-api-endpoints)
- [5. 完整工作流示例 / Full Workflow Example](#5-完整工作流示例--full-workflow-example)
- [6. JavaScript/Node.js 代码示例 / JavaScript/Node.js Code Example](#6-javascriptnodejs-代码示例--javascriptnodejs-code-example)
- [7. 最佳实践 / Best Practices](#7-最佳实践--best-practices)
- [8. 实际用例 / Real Use Cases](#8-实际用例--real-use-cases)

---

## 1. 介绍 / Introduction

### 中文

**Cursor Cloud Agents** 是一个强大的 API 服务，允许你通过编程方式启动和管理 AI 代码助手代理。它解决了以下问题：

- **自动化代码任务**：无需手动操作，通过 API 即可让 AI 代理完成代码生成、测试编写、文档生成等任务
- **批量处理**：可以同时管理多个代理，处理不同的代码库或任务
- **集成到 CI/CD**：将 AI 代码助手集成到你的开发工作流中
- **远程执行**：代理在云端运行，无需本地环境配置

### English

**Cursor Cloud Agents** is a powerful API service that allows you to programmatically launch and manage AI code assistant agents. It solves the following problems:

- **Automate coding tasks**: Complete code generation, test writing, documentation generation, and more through API without manual operations
- **Batch processing**: Manage multiple agents simultaneously to handle different repositories or tasks
- **CI/CD integration**: Integrate AI code assistants into your development workflow
- **Remote execution**: Agents run in the cloud, eliminating the need for local environment configuration

---

## 2. 前置条件 / Prerequisites

### 中文

在使用 Cursor Cloud Agents API 之前，你需要：

1. **获取 API 密钥**
   - 访问 [cursor.com/settings](https://cursor.com/settings)
   - 在设置页面中找到 "API Keys" 或 "Cloud Agents" 部分
   - 生成一个新的 API 密钥并妥善保存

2. **GitHub 仓库要求**
   - 你的代码仓库必须托管在 GitHub 上
   - 仓库必须是公开的，或者你的 API 密钥有访问私有仓库的权限
   - 确保仓库有正确的分支结构（通常需要 `main` 或 `master` 分支）

3. **网络访问**
   - 确保你的环境可以访问 `https://api.cursor.com` 或相应的 API 端点

### English

Before using the Cursor Cloud Agents API, you need:

1. **Get API Key**
   - Visit [cursor.com/settings](https://cursor.com/settings)
   - Find the "API Keys" or "Cloud Agents" section in settings
   - Generate a new API key and save it securely

2. **GitHub Repository Requirements**
   - Your code repository must be hosted on GitHub
   - The repository must be public, or your API key must have access to private repositories
   - Ensure the repository has proper branch structure (typically requires `main` or `master` branch)

3. **Network Access**
   - Ensure your environment can access `https://api.cursor.com` or the corresponding API endpoint

---

## 3. 认证 / Authentication

### 中文

Cursor Cloud Agents API 使用 **HTTP Basic Authentication** 进行身份验证。

#### 基本格式

在 HTTP 请求头中添加 `Authorization` 字段：

```
Authorization: Basic <base64_encoded_api_key>
```

#### cURL 示例

```bash
# 方式 1: 使用 -u 参数（推荐）
curl -u "YOUR_API_KEY:" https://api.cursor.com/v0/agents

# 方式 2: 手动设置 Authorization 头
curl -H "Authorization: Basic $(echo -n 'YOUR_API_KEY:' | base64)" \
  https://api.cursor.com/v0/agents
```

#### 注意事项

- API 密钥应该保密，不要提交到代码仓库
- 使用环境变量存储 API 密钥
- 在 Basic Auth 中，用户名是 API 密钥，密码为空（注意冒号）

### English

Cursor Cloud Agents API uses **HTTP Basic Authentication** for authentication.

#### Basic Format

Add the `Authorization` field in the HTTP request header:

```
Authorization: Basic <base64_encoded_api_key>
```

#### cURL Examples

```bash
# Method 1: Using -u parameter (recommended)
curl -u "YOUR_API_KEY:" https://api.cursor.com/v0/agents

# Method 2: Manually set Authorization header
curl -H "Authorization: Basic $(echo -n 'YOUR_API_KEY:' | base64)" \
  https://api.cursor.com/v0/agents
```

#### Notes

- API keys should be kept secret and not committed to code repositories
- Use environment variables to store API keys
- In Basic Auth, the username is the API key and the password is empty (note the colon)

---

## 4. 核心 API 端点 / Core API Endpoints

### 4.1 启动代理 / Launch an Agent

#### 中文

创建一个新的代理实例。

**端点**: `POST /v0/agents`

**请求体**:
```json
{
  "repository": "owner/repo-name",
  "branch": "main",
  "instructions": "你的任务描述，例如：生成 API 文档"
}
```

**cURL 示例**:
```bash
curl -X POST https://api.cursor.com/v0/agents \
  -u "YOUR_API_KEY:" \
  -H "Content-Type: application/json" \
  -d '{
    "repository": "username/repo-name",
    "branch": "main",
    "instructions": "Generate comprehensive API documentation for all endpoints"
  }'
```

**响应**:
```json
{
  "id": "agent_1234567890",
  "status": "CREATING",
  "repository": "username/repo-name",
  "branch": "main",
  "created_at": "2026-03-16T10:00:00Z"
}
```

#### English

Create a new agent instance.

**Endpoint**: `POST /v0/agents`

**Request Body**:
```json
{
  "repository": "owner/repo-name",
  "branch": "main",
  "instructions": "Your task description, e.g., Generate API documentation"
}
```

**cURL Example**:
```bash
curl -X POST https://api.cursor.com/v0/agents \
  -u "YOUR_API_KEY:" \
  -H "Content-Type: application/json" \
  -d '{
    "repository": "username/repo-name",
    "branch": "main",
    "instructions": "Generate comprehensive API documentation for all endpoints"
  }'
```

**Response**:
```json
{
  "id": "agent_1234567890",
  "status": "CREATING",
  "repository": "username/repo-name",
  "branch": "main",
  "created_at": "2026-03-16T10:00:00Z"
}
```

---

### 4.2 列出所有代理 / List All Agents

#### 中文

获取你的所有代理列表。

**端点**: `GET /v0/agents`

**cURL 示例**:
```bash
curl -u "YOUR_API_KEY:" https://api.cursor.com/v0/agents
```

**响应**:
```json
{
  "agents": [
    {
      "id": "agent_1234567890",
      "status": "RUNNING",
      "repository": "username/repo-name",
      "branch": "main",
      "created_at": "2026-03-16T10:00:00Z"
    },
    {
      "id": "agent_0987654321",
      "status": "FINISHED",
      "repository": "username/another-repo",
      "branch": "main",
      "created_at": "2026-03-16T09:00:00Z"
    }
  ]
}
```

#### English

Get a list of all your agents.

**Endpoint**: `GET /v0/agents`

**cURL Example**:
```bash
curl -u "YOUR_API_KEY:" https://api.cursor.com/v0/agents
```

**Response**:
```json
{
  "agents": [
    {
      "id": "agent_1234567890",
      "status": "RUNNING",
      "repository": "username/repo-name",
      "branch": "main",
      "created_at": "2026-03-16T10:00:00Z"
    },
    {
      "id": "agent_0987654321",
      "status": "FINISHED",
      "repository": "username/another-repo",
      "branch": "main",
      "created_at": "2026-03-16T09:00:00Z"
    }
  ]
}
```

---

### 4.3 获取代理状态 / Get Agent Status

#### 中文

查询特定代理的当前状态。

**端点**: `GET /v0/agents/{id}`

**状态值**:
- `CREATING`: 代理正在创建中
- `RUNNING`: 代理正在运行
- `FINISHED`: 代理已完成任务
- `FAILED`: 代理执行失败
- `STOPPED`: 代理已被停止

**cURL 示例**:
```bash
curl -u "YOUR_API_KEY:" https://api.cursor.com/v0/agents/agent_1234567890
```

**响应**:
```json
{
  "id": "agent_1234567890",
  "status": "RUNNING",
  "repository": "username/repo-name",
  "branch": "main",
  "created_at": "2026-03-16T10:00:00Z",
  "updated_at": "2026-03-16T10:05:00Z"
}
```

#### English

Query the current status of a specific agent.

**Endpoint**: `GET /v0/agents/{id}`

**Status Values**:
- `CREATING`: Agent is being created
- `RUNNING`: Agent is running
- `FINISHED`: Agent has completed the task
- `FAILED`: Agent execution failed
- `STOPPED`: Agent has been stopped

**cURL Example**:
```bash
curl -u "YOUR_API_KEY:" https://api.cursor.com/v0/agents/agent_1234567890
```

**Response**:
```json
{
  "id": "agent_1234567890",
  "status": "RUNNING",
  "repository": "username/repo-name",
  "branch": "main",
  "created_at": "2026-03-16T10:00:00Z",
  "updated_at": "2026-03-16T10:05:00Z"
}
```

---

### 4.4 发送后续指令 / Send Follow-up Instructions

#### 中文

向正在运行的代理发送额外的指令或修改请求。

**端点**: `POST /v0/agents/{id}/followup`

**请求体**:
```json
{
  "instructions": "请修改刚才生成的文档，添加更多示例"
}
```

**cURL 示例**:
```bash
curl -X POST https://api.cursor.com/v0/agents/agent_1234567890/followup \
  -u "YOUR_API_KEY:" \
  -H "Content-Type: application/json" \
  -d '{
    "instructions": "Please modify the previously generated documentation to add more examples"
  }'
```

**响应**:
```json
{
  "id": "agent_1234567890",
  "status": "RUNNING",
  "message": "Follow-up instructions received"
}
```

#### English

Send additional instructions or modification requests to a running agent.

**Endpoint**: `POST /v0/agents/{id}/followup`

**Request Body**:
```json
{
  "instructions": "Please modify the previously generated documentation to add more examples"
}
```

**cURL Example**:
```bash
curl -X POST https://api.cursor.com/v0/agents/agent_1234567890/followup \
  -u "YOUR_API_KEY:" \
  -H "Content-Type: application/json" \
  -d '{
    "instructions": "Please modify the previously generated documentation to add more examples"
  }'
```

**Response**:
```json
{
  "id": "agent_1234567890",
  "status": "RUNNING",
  "message": "Follow-up instructions received"
}
```

---

### 4.5 停止代理 / Stop an Agent

#### 中文

停止正在运行的代理。

**端点**: `POST /v0/agents/{id}/stop`

**cURL 示例**:
```bash
curl -X POST https://api.cursor.com/v0/agents/agent_1234567890/stop \
  -u "YOUR_API_KEY:"
```

**响应**:
```json
{
  "id": "agent_1234567890",
  "status": "STOPPED",
  "message": "Agent stopped successfully"
}
```

#### English

Stop a running agent.

**Endpoint**: `POST /v0/agents/{id}/stop`

**cURL Example**:
```bash
curl -X POST https://api.cursor.com/v0/agents/agent_1234567890/stop \
  -u "YOUR_API_KEY:"
```

**Response**:
```json
{
  "id": "agent_1234567890",
  "status": "STOPPED",
  "message": "Agent stopped successfully"
}
```

---

### 4.6 删除代理 / Delete an Agent

#### 中文

删除一个代理实例（无论其状态如何）。

**端点**: `DELETE /v0/agents/{id}`

**cURL 示例**:
```bash
curl -X DELETE https://api.cursor.com/v0/agents/agent_1234567890 \
  -u "YOUR_API_KEY:"
```

**响应**:
```json
{
  "message": "Agent deleted successfully"
}
```

#### English

Delete an agent instance (regardless of its status).

**Endpoint**: `DELETE /v0/agents/{id}`

**cURL Example**:
```bash
curl -X DELETE https://api.cursor.com/v0/agents/agent_1234567890 \
  -u "YOUR_API_KEY:"
```

**Response**:
```json
{
  "message": "Agent deleted successfully"
}
```

---

### 4.7 查看对话历史 / View Conversation History

#### 中文

获取代理的完整对话历史记录。

**端点**: `GET /v0/agents/{id}/conversation`

**cURL 示例**:
```bash
curl -u "YOUR_API_KEY:" \
  https://api.cursor.com/v0/agents/agent_1234567890/conversation
```

**响应**:
```json
{
  "conversation": [
    {
      "role": "user",
      "content": "Generate comprehensive API documentation",
      "timestamp": "2026-03-16T10:00:00Z"
    },
    {
      "role": "assistant",
      "content": "I'll analyze the codebase and generate API documentation...",
      "timestamp": "2026-03-16T10:00:05Z"
    },
    {
      "role": "user",
      "content": "Add more examples to the documentation",
      "timestamp": "2026-03-16T10:10:00Z"
    }
  ]
}
```

#### English

Get the complete conversation history of an agent.

**Endpoint**: `GET /v0/agents/{id}/conversation`

**cURL Example**:
```bash
curl -u "YOUR_API_KEY:" \
  https://api.cursor.com/v0/agents/agent_1234567890/conversation
```

**Response**:
```json
{
  "conversation": [
    {
      "role": "user",
      "content": "Generate comprehensive API documentation",
      "timestamp": "2026-03-16T10:00:00Z"
    },
    {
      "role": "assistant",
      "content": "I'll analyze the codebase and generate API documentation...",
      "timestamp": "2026-03-16T10:00:05Z"
    },
    {
      "role": "user",
      "content": "Add more examples to the documentation",
      "timestamp": "2026-03-16T10:10:00Z"
    }
  ]
}
```

---

### 4.8 列出生成的文件 / List Generated Files

#### 中文

获取代理生成的所有文件列表。

**端点**: `GET /v0/agents/{id}/artifacts`

**cURL 示例**:
```bash
curl -u "YOUR_API_KEY:" \
  https://api.cursor.com/v0/agents/agent_1234567890/artifacts
```

**响应**:
```json
{
  "artifacts": [
    {
      "path": "docs/API.md",
      "size": 15234,
      "created_at": "2026-03-16T10:15:00Z",
      "download_url": "https://api.cursor.com/v0/agents/agent_1234567890/artifacts/docs/API.md"
    },
    {
      "path": "docs/examples.js",
      "size": 3456,
      "created_at": "2026-03-16T10:16:00Z",
      "download_url": "https://api.cursor.com/v0/agents/agent_1234567890/artifacts/docs/examples.js"
    }
  ]
}
```

#### English

Get a list of all files generated by the agent.

**Endpoint**: `GET /v0/agents/{id}/artifacts`

**cURL Example**:
```bash
curl -u "YOUR_API_KEY:" \
  https://api.cursor.com/v0/agents/agent_1234567890/artifacts
```

**Response**:
```json
{
  "artifacts": [
    {
      "path": "docs/API.md",
      "size": 15234,
      "created_at": "2026-03-16T10:15:00Z",
      "download_url": "https://api.cursor.com/v0/agents/agent_1234567890/artifacts/docs/API.md"
    },
    {
      "path": "docs/examples.js",
      "size": 3456,
      "created_at": "2026-03-16T10:16:00Z",
      "download_url": "https://api.cursor.com/v0/agents/agent_1234567890/artifacts/docs/examples.js"
    }
  ]
}
```

---

## 5. 完整工作流示例 / Full Workflow Example

### 中文

以下是一个完整的工作流，展示如何创建代理、监控状态、发送后续指令并下载生成的文件。

#### 步骤 1: 创建代理

```bash
# 创建代理
RESPONSE=$(curl -X POST https://api.cursor.com/v0/agents \
  -u "YOUR_API_KEY:" \
  -H "Content-Type: application/json" \
  -d '{
    "repository": "username/my-repo",
    "branch": "main",
    "instructions": "Generate API documentation for all endpoints in the src/api directory"
  }')

# 提取代理 ID
AGENT_ID=$(echo $RESPONSE | jq -r '.id')
echo "Agent ID: $AGENT_ID"
```

#### 步骤 2: 轮询状态

```bash
# 等待代理完成（最多等待 5 分钟）
MAX_WAIT=300
ELAPSED=0
INTERVAL=10

while [ $ELAPSED -lt $MAX_WAIT ]; do
  STATUS=$(curl -s -u "YOUR_API_KEY:" \
    https://api.cursor.com/v0/agents/$AGENT_ID | jq -r '.status')
  
  echo "Current status: $STATUS"
  
  if [ "$STATUS" = "FINISHED" ]; then
    echo "Agent completed successfully!"
    break
  elif [ "$STATUS" = "FAILED" ]; then
    echo "Agent failed!"
    exit 1
  fi
  
  sleep $INTERVAL
  ELAPSED=$((ELAPSED + INTERVAL))
done
```

#### 步骤 3: 发送后续指令（可选）

```bash
# 如果需要修改，发送后续指令
curl -X POST https://api.cursor.com/v0/agents/$AGENT_ID/followup \
  -u "YOUR_API_KEY:" \
  -H "Content-Type: application/json" \
  -d '{
    "instructions": "Add code examples for each endpoint"
  }'

# 再次等待完成...
```

#### 步骤 4: 列出生成的文件

```bash
# 获取所有生成的文件
curl -u "YOUR_API_KEY:" \
  https://api.cursor.com/v0/agents/$AGENT_ID/artifacts | jq '.artifacts[]'
```

#### 步骤 5: 下载文件

```bash
# 下载特定文件
curl -u "YOUR_API_KEY:" \
  https://api.cursor.com/v0/agents/$AGENT_ID/artifacts/docs/API.md \
  -o API.md
```

### English

The following is a complete workflow showing how to create an agent, monitor status, send follow-up instructions, and download generated files.

#### Step 1: Create Agent

```bash
# Create agent
RESPONSE=$(curl -X POST https://api.cursor.com/v0/agents \
  -u "YOUR_API_KEY:" \
  -H "Content-Type: application/json" \
  -d '{
    "repository": "username/my-repo",
    "branch": "main",
    "instructions": "Generate API documentation for all endpoints in the src/api directory"
  }')

# Extract agent ID
AGENT_ID=$(echo $RESPONSE | jq -r '.id')
echo "Agent ID: $AGENT_ID"
```

#### Step 2: Poll Status

```bash
# Wait for agent to complete (max 5 minutes)
MAX_WAIT=300
ELAPSED=0
INTERVAL=10

while [ $ELAPSED -lt $MAX_WAIT ]; do
  STATUS=$(curl -s -u "YOUR_API_KEY:" \
    https://api.cursor.com/v0/agents/$AGENT_ID | jq -r '.status')
  
  echo "Current status: $STATUS"
  
  if [ "$STATUS" = "FINISHED" ]; then
    echo "Agent completed successfully!"
    break
  elif [ "$STATUS" = "FAILED" ]; then
    echo "Agent failed!"
    exit 1
  fi
  
  sleep $INTERVAL
  ELAPSED=$((ELAPSED + INTERVAL))
done
```

#### Step 3: Send Follow-up Instructions (Optional)

```bash
# If modifications are needed, send follow-up instructions
curl -X POST https://api.cursor.com/v0/agents/$AGENT_ID/followup \
  -u "YOUR_API_KEY:" \
  -H "Content-Type: application/json" \
  -d '{
    "instructions": "Add code examples for each endpoint"
  }'

# Wait for completion again...
```

#### Step 4: List Generated Files

```bash
# Get all generated files
curl -u "YOUR_API_KEY:" \
  https://api.cursor.com/v0/agents/$AGENT_ID/artifacts | jq '.artifacts[]'
```

#### Step 5: Download Files

```bash
# Download specific file
curl -u "YOUR_API_KEY:" \
  https://api.cursor.com/v0/agents/$AGENT_ID/artifacts/docs/API.md \
  -o API.md
```

---

## 6. JavaScript/Node.js 代码示例 / JavaScript/Node.js Code Example

### 中文

以下是一个完整的 Node.js 示例，展示了如何使用 Cursor Cloud Agents API。

```javascript
const https = require('https');
const { Buffer } = require('buffer');

class CursorAgentsClient {
  constructor(apiKey, baseUrl = 'https://api.cursor.com') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  // 基础请求方法
  async request(method, path, body = null) {
    return new Promise((resolve, reject) => {
      const auth = Buffer.from(`${this.apiKey}:`).toString('base64');
      const url = new URL(path, this.baseUrl);
      
      const options = {
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname + url.search,
        method: method,
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      };

      const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(json);
            } else {
              reject(new Error(`API Error: ${res.statusCode} - ${JSON.stringify(json)}`));
            }
          } catch (e) {
            reject(new Error(`Parse Error: ${e.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (body) {
        req.write(JSON.stringify(body));
      }
      
      req.end();
    });
  }

  // 创建代理
  async createAgent(repository, branch, instructions) {
    return this.request('POST', '/v0/agents', {
      repository,
      branch,
      instructions,
    });
  }

  // 获取代理状态
  async getAgentStatus(agentId) {
    return this.request('GET', `/v0/agents/${agentId}`);
  }

  // 列出所有代理
  async listAgents() {
    return this.request('GET', '/v0/agents');
  }

  // 发送后续指令
  async sendFollowup(agentId, instructions) {
    return this.request('POST', `/v0/agents/${agentId}/followup`, {
      instructions,
    });
  }

  // 停止代理
  async stopAgent(agentId) {
    return this.request('POST', `/v0/agents/${agentId}/stop`);
  }

  // 删除代理
  async deleteAgent(agentId) {
    return this.request('DELETE', `/v0/agents/${agentId}`);
  }

  // 获取对话历史
  async getConversation(agentId) {
    return this.request('GET', `/v0/agents/${agentId}/conversation`);
  }

  // 列出生成的文件
  async listArtifacts(agentId) {
    return this.request('GET', `/v0/agents/${agentId}/artifacts`);
  }

  // 等待代理完成
  async waitForCompletion(agentId, maxWaitMs = 300000, intervalMs = 10000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitMs) {
      const status = await this.getAgentStatus(agentId);
      
      console.log(`Agent ${agentId} status: ${status.status}`);
      
      if (status.status === 'FINISHED') {
        return status;
      } else if (status.status === 'FAILED' || status.status === 'STOPPED') {
        throw new Error(`Agent ${status.status}: ${JSON.stringify(status)}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
    
    throw new Error(`Timeout waiting for agent ${agentId} to complete`);
  }
}

// 使用示例
async function main() {
  const apiKey = process.env.CURSOR_API_KEY;
  if (!apiKey) {
    throw new Error('CURSOR_API_KEY environment variable is required');
  }

  const client = new CursorAgentsClient(apiKey);

  try {
    // 1. 创建代理
    console.log('Creating agent...');
    const agent = await client.createAgent(
      'username/my-repo',
      'main',
      'Generate comprehensive API documentation for all endpoints'
    );
    console.log('Agent created:', agent);

    // 2. 等待完成
    console.log('Waiting for agent to complete...');
    const completed = await client.waitForCompletion(agent.id);
    console.log('Agent completed:', completed);

    // 3. 获取生成的文件
    console.log('Fetching artifacts...');
    const artifacts = await client.listArtifacts(agent.id);
    console.log('Artifacts:', artifacts);

    // 4. 获取对话历史
    console.log('Fetching conversation...');
    const conversation = await client.getConversation(agent.id);
    console.log('Conversation:', conversation);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此文件
if (require.main === module) {
  main();
}

module.exports = CursorAgentsClient;
```

### English

The following is a complete Node.js example demonstrating how to use the Cursor Cloud Agents API.

```javascript
const https = require('https');
const { Buffer } = require('buffer');

class CursorAgentsClient {
  constructor(apiKey, baseUrl = 'https://api.cursor.com') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  // Base request method
  async request(method, path, body = null) {
    return new Promise((resolve, reject) => {
      const auth = Buffer.from(`${this.apiKey}:`).toString('base64');
      const url = new URL(path, this.baseUrl);
      
      const options = {
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname + url.search,
        method: method,
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      };

      const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(json);
            } else {
              reject(new Error(`API Error: ${res.statusCode} - ${JSON.stringify(json)}`));
            }
          } catch (e) {
            reject(new Error(`Parse Error: ${e.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (body) {
        req.write(JSON.stringify(body));
      }
      
      req.end();
    });
  }

  // Create agent
  async createAgent(repository, branch, instructions) {
    return this.request('POST', '/v0/agents', {
      repository,
      branch,
      instructions,
    });
  }

  // Get agent status
  async getAgentStatus(agentId) {
    return this.request('GET', `/v0/agents/${agentId}`);
  }

  // List all agents
  async listAgents() {
    return this.request('GET', '/v0/agents');
  }

  // Send follow-up instructions
  async sendFollowup(agentId, instructions) {
    return this.request('POST', `/v0/agents/${agentId}/followup`, {
      instructions,
    });
  }

  // Stop agent
  async stopAgent(agentId) {
    return this.request('POST', `/v0/agents/${agentId}/stop`);
  }

  // Delete agent
  async deleteAgent(agentId) {
    return this.request('DELETE', `/v0/agents/${agentId}`);
  }

  // Get conversation history
  async getConversation(agentId) {
    return this.request('GET', `/v0/agents/${agentId}/conversation`);
  }

  // List generated files
  async listArtifacts(agentId) {
    return this.request('GET', `/v0/agents/${agentId}/artifacts`);
  }

  // Wait for agent completion
  async waitForCompletion(agentId, maxWaitMs = 300000, intervalMs = 10000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitMs) {
      const status = await this.getAgentStatus(agentId);
      
      console.log(`Agent ${agentId} status: ${status.status}`);
      
      if (status.status === 'FINISHED') {
        return status;
      } else if (status.status === 'FAILED' || status.status === 'STOPPED') {
        throw new Error(`Agent ${status.status}: ${JSON.stringify(status)}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
    
    throw new Error(`Timeout waiting for agent ${agentId} to complete`);
  }
}

// Usage example
async function main() {
  const apiKey = process.env.CURSOR_API_KEY;
  if (!apiKey) {
    throw new Error('CURSOR_API_KEY environment variable is required');
  }

  const client = new CursorAgentsClient(apiKey);

  try {
    // 1. Create agent
    console.log('Creating agent...');
    const agent = await client.createAgent(
      'username/my-repo',
      'main',
      'Generate comprehensive API documentation for all endpoints'
    );
    console.log('Agent created:', agent);

    // 2. Wait for completion
    console.log('Waiting for agent to complete...');
    const completed = await client.waitForCompletion(agent.id);
    console.log('Agent completed:', completed);

    // 3. Get generated files
    console.log('Fetching artifacts...');
    const artifacts = await client.listArtifacts(agent.id);
    console.log('Artifacts:', artifacts);

    // 4. Get conversation history
    console.log('Fetching conversation...');
    const conversation = await client.getConversation(agent.id);
    console.log('Conversation:', conversation);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// If running this file directly
if (require.main === module) {
  main();
}

module.exports = CursorAgentsClient;
```

---

## 7. 最佳实践 / Best Practices

### 7.1 速率限制 / Rate Limits

#### 中文

- **请求频率**: 建议每秒不超过 10 个请求
- **并发代理**: 同时运行的代理数量可能有限制，建议不超过 5 个
- **错误处理**: 如果收到 `429 Too Many Requests` 响应，使用指数退避策略重试

```javascript
async function requestWithRetry(client, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await client.request(...);
    } catch (error) {
      if (error.message.includes('429') && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // 指数退避
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}
```

#### English

- **Request Frequency**: Recommended not to exceed 10 requests per second
- **Concurrent Agents**: There may be limits on the number of simultaneously running agents, recommended not to exceed 5
- **Error Handling**: If you receive a `429 Too Many Requests` response, use an exponential backoff strategy to retry

```javascript
async function requestWithRetry(client, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await client.request(...);
    } catch (error) {
      if (error.message.includes('429') && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}
```

---

### 7.2 轮询策略 / Polling Strategies

#### 中文

- **初始延迟**: 代理创建后，等待 5-10 秒再开始轮询
- **轮询间隔**: 
  - `CREATING` 状态: 每 5 秒轮询一次
  - `RUNNING` 状态: 每 10-15 秒轮询一次
- **超时设置**: 设置合理的超时时间（通常 5-30 分钟，取决于任务复杂度）
- **使用 Webhooks**（如果支持）: 比轮询更高效

```javascript
async function smartPoll(client, agentId) {
  let lastStatus = 'CREATING';
  let pollInterval = 5000; // 5 seconds
  
  while (true) {
    const status = await client.getAgentStatus(agentId);
    
    // 根据状态调整轮询间隔
    if (status.status === 'RUNNING' && lastStatus === 'CREATING') {
      pollInterval = 10000; // 切换到 10 秒
    }
    
    if (status.status === 'FINISHED' || status.status === 'FAILED') {
      return status;
    }
    
    lastStatus = status.status;
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }
}
```

#### English

- **Initial Delay**: Wait 5-10 seconds after agent creation before starting to poll
- **Polling Interval**:
  - `CREATING` status: Poll every 5 seconds
  - `RUNNING` status: Poll every 10-15 seconds
- **Timeout Settings**: Set reasonable timeout (typically 5-30 minutes, depending on task complexity)
- **Use Webhooks** (if supported): More efficient than polling

```javascript
async function smartPoll(client, agentId) {
  let lastStatus = 'CREATING';
  let pollInterval = 5000; // 5 seconds
  
  while (true) {
    const status = await client.getAgentStatus(agentId);
    
    // Adjust polling interval based on status
    if (status.status === 'RUNNING' && lastStatus === 'CREATING') {
      pollInterval = 10000; // Switch to 10 seconds
    }
    
    if (status.status === 'FINISHED' || status.status === 'FAILED') {
      return status;
    }
    
    lastStatus = status.status;
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }
}
```

---

### 7.3 错误处理 / Error Handling

#### 中文

- **网络错误**: 实现重试机制，使用指数退避
- **API 错误**: 检查 HTTP 状态码和错误消息
- **超时处理**: 设置合理的超时时间并优雅处理
- **日志记录**: 记录所有错误以便调试

```javascript
class CursorAgentsClient {
  async requestWithErrorHandling(method, path, body = null, retries = 3) {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await this.request(method, path, body);
      } catch (error) {
        const isRetryable = 
          error.message.includes('ECONNRESET') ||
          error.message.includes('ETIMEDOUT') ||
          error.message.includes('429');
        
        if (isRetryable && attempt < retries - 1) {
          const delay = Math.pow(2, attempt) * 1000;
          console.warn(`Retry ${attempt + 1}/${retries} after ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        throw error;
      }
    }
  }
}
```

#### English

- **Network Errors**: Implement retry mechanism with exponential backoff
- **API Errors**: Check HTTP status codes and error messages
- **Timeout Handling**: Set reasonable timeouts and handle gracefully
- **Logging**: Log all errors for debugging

```javascript
class CursorAgentsClient {
  async requestWithErrorHandling(method, path, body = null, retries = 3) {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await this.request(method, path, body);
      } catch (error) {
        const isRetryable = 
          error.message.includes('ECONNRESET') ||
          error.message.includes('ETIMEDOUT') ||
          error.message.includes('429');
        
        if (isRetryable && attempt < retries - 1) {
          const delay = Math.pow(2, attempt) * 1000;
          console.warn(`Retry ${attempt + 1}/${retries} after ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        throw error;
      }
    }
  }
}
```

---

### 7.4 安全性 / Security

#### 中文

- **API 密钥管理**: 
  - 使用环境变量存储 API 密钥
  - 不要在代码中硬编码密钥
  - 不要将密钥提交到版本控制系统
- **HTTPS**: 始终使用 HTTPS 连接
- **最小权限**: 只授予必要的权限

```bash
# .env 文件（不要提交到 Git）
CURSOR_API_KEY=your_api_key_here
```

```javascript
// 从环境变量读取
const apiKey = process.env.CURSOR_API_KEY;
if (!apiKey) {
  throw new Error('CURSOR_API_KEY is required');
}
```

#### English

- **API Key Management**:
  - Use environment variables to store API keys
  - Do not hardcode keys in code
  - Do not commit keys to version control
- **HTTPS**: Always use HTTPS connections
- **Least Privilege**: Grant only necessary permissions

```bash
# .env file (do not commit to Git)
CURSOR_API_KEY=your_api_key_here
```

```javascript
// Read from environment variable
const apiKey = process.env.CURSOR_API_KEY;
if (!apiKey) {
  throw new Error('CURSOR_API_KEY is required');
}
```

---

## 8. 实际用例 / Real Use Cases

### 8.1 自动生成文档 / Auto-generate Documentation

#### 中文

**场景**: 每次代码更新后自动生成 API 文档

```javascript
async function autoGenerateDocs(repo, branch) {
  const client = new CursorAgentsClient(process.env.CURSOR_API_KEY);
  
  const agent = await client.createAgent(
    repo,
    branch,
    'Analyze all API endpoints in the src/routes directory and generate comprehensive OpenAPI/Swagger documentation. Include request/response examples, parameter descriptions, and error codes.'
  );
  
  await client.waitForCompletion(agent.id);
  const artifacts = await client.listArtifacts(agent.id);
  
  // 下载文档文件
  for (const artifact of artifacts.artifacts) {
    // 下载逻辑...
  }
  
  return artifacts;
}
```

#### English

**Scenario**: Automatically generate API documentation after each code update

```javascript
async function autoGenerateDocs(repo, branch) {
  const client = new CursorAgentsClient(process.env.CURSOR_API_KEY);
  
  const agent = await client.createAgent(
    repo,
    branch,
    'Analyze all API endpoints in the src/routes directory and generate comprehensive OpenAPI/Swagger documentation. Include request/response examples, parameter descriptions, and error codes.'
  );
  
  await client.waitForCompletion(agent.id);
  const artifacts = await client.listArtifacts(agent.id);
  
  // Download documentation files
  for (const artifact of artifacts.artifacts) {
    // Download logic...
  }
  
  return artifacts;
}
```

---

### 8.2 编写测试 / Write Tests

#### 中文

**场景**: 为新功能自动生成单元测试和集成测试

```javascript
async function generateTests(repo, branch, featurePath) {
  const client = new CursorAgentsClient(process.env.CURSOR_API_KEY);
  
  const agent = await client.createAgent(
    repo,
    branch,
    `Write comprehensive unit tests and integration tests for the code in ${featurePath}. 
     Include edge cases, error handling, and ensure test coverage is above 80%. 
     Use the existing test framework and patterns in the project.`
  );
  
  await client.waitForCompletion(agent.id);
  return await client.listArtifacts(agent.id);
}
```

#### English

**Scenario**: Automatically generate unit tests and integration tests for new features

```javascript
async function generateTests(repo, branch, featurePath) {
  const client = new CursorAgentsClient(process.env.CURSOR_API_KEY);
  
  const agent = await client.createAgent(
    repo,
    branch,
    `Write comprehensive unit tests and integration tests for the code in ${featurePath}. 
     Include edge cases, error handling, and ensure test coverage is above 80%. 
     Use the existing test framework and patterns in the project.`
  );
  
  await client.waitForCompletion(agent.id);
  return await client.listArtifacts(agent.id);
}
```

---

### 8.3 修复 Bug / Fix Bugs

#### 中文

**场景**: 通过 API 自动修复代码中的 Bug

```javascript
async function fixBugs(repo, branch, bugDescription) {
  const client = new CursorAgentsClient(process.env.CURSOR_API_KEY);
  
  const agent = await client.createAgent(
    repo,
    branch,
    `Analyze and fix the following bug: ${bugDescription}. 
     Ensure the fix doesn't break existing functionality. 
     Add appropriate tests to prevent regression.`
  );
  
  await client.waitForCompletion(agent.id);
  
  // 如果需要，发送后续指令进行改进
  if (needsImprovement) {
    await client.sendFollowup(
      agent.id,
      'Review the fix and optimize performance if needed'
    );
    await client.waitForCompletion(agent.id);
  }
  
  return await client.listArtifacts(agent.id);
}
```

#### English

**Scenario**: Automatically fix bugs in code via API

```javascript
async function fixBugs(repo, branch, bugDescription) {
  const client = new CursorAgentsClient(process.env.CURSOR_API_KEY);
  
  const agent = await client.createAgent(
    repo,
    branch,
    `Analyze and fix the following bug: ${bugDescription}. 
     Ensure the fix doesn't break existing functionality. 
     Add appropriate tests to prevent regression.`
  );
  
  await client.waitForCompletion(agent.id);
  
  // If needed, send follow-up instructions for improvements
  if (needsImprovement) {
    await client.sendFollowup(
      agent.id,
      'Review the fix and optimize performance if needed'
    );
    await client.waitForCompletion(agent.id);
  }
  
  return await client.listArtifacts(agent.id);
}
```

---

### 8.4 CI/CD 集成 / CI/CD Integration

#### 中文

**场景**: 在 CI/CD 流水线中集成 Cursor Agents

```yaml
# .github/workflows/cursor-agents.yml
name: Cursor Agents CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  generate-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Generate API Documentation
        env:
          CURSOR_API_KEY: ${{ secrets.CURSOR_API_KEY }}
        run: |
          node scripts/generate-docs.js
          
      - name: Commit Documentation
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add docs/
          git commit -m "Auto-generated docs" || exit 0
          git push
```

```javascript
// scripts/generate-docs.js
const CursorAgentsClient = require('./cursor-client');

async function main() {
  const client = new CursorAgentsClient(process.env.CURSOR_API_KEY);
  const repo = process.env.GITHUB_REPOSITORY;
  const branch = process.env.GITHUB_REF_NAME;
  
  const agent = await client.createAgent(
    repo,
    branch,
    'Generate API documentation and save to docs/ directory'
  );
  
  await client.waitForCompletion(agent.id);
  console.log('Documentation generated successfully');
}

main().catch(console.error);
```

#### English

**Scenario**: Integrate Cursor Agents into CI/CD pipeline

```yaml
# .github/workflows/cursor-agents.yml
name: Cursor Agents CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  generate-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Generate API Documentation
        env:
          CURSOR_API_KEY: ${{ secrets.CURSOR_API_KEY }}
        run: |
          node scripts/generate-docs.js
          
      - name: Commit Documentation
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add docs/
          git commit -m "Auto-generated docs" || exit 0
          git push
```

```javascript
// scripts/generate-docs.js
const CursorAgentsClient = require('./cursor-client');

async function main() {
  const client = new CursorAgentsClient(process.env.CURSOR_API_KEY);
  const repo = process.env.GITHUB_REPOSITORY;
  const branch = process.env.GITHUB_REF_NAME;
  
  const agent = await client.createAgent(
    repo,
    branch,
    'Generate API documentation and save to docs/ directory'
  );
  
  await client.waitForCompletion(agent.id);
  console.log('Documentation generated successfully');
}

main().catch(console.error);
```

---

## 总结 / Conclusion

### 中文

Cursor Cloud Agents API 为开发者提供了一个强大的工具，可以自动化各种代码相关任务。通过本教程，你应该能够：

- 理解 API 的基本概念和使用方法
- 使用各种 API 端点管理代理
- 实现完整的工作流程
- 集成到你的开发工具链中

如有问题或需要帮助，请访问 [Cursor 官方文档](https://cursor.com/docs) 或联系支持团队。

### English

The Cursor Cloud Agents API provides developers with a powerful tool to automate various code-related tasks. Through this tutorial, you should be able to:

- Understand the basic concepts and usage of the API
- Use various API endpoints to manage agents
- Implement complete workflows
- Integrate into your development toolchain

If you have questions or need help, please visit the [Cursor official documentation](https://cursor.com/docs) or contact the support team.

---

**最后更新 / Last Updated**: 2026-03-16
