export type FormState = {
  idea: string;
  industry: string;
  targetUser: string;
  budget: string;
  mobile: string;
  appStore: string;
};

export type AgentWorkflowStep = {
  name: string;
  role: string;
  output: string;
};

export type ResultModule = {
  title: string;
  items: string[];
};

export type SoftwarePlan = {
  projectName: string;
  summary: string;
  workflow: AgentWorkflowStep[];
  modules: ResultModule[];
};

export function planToMarkdown(plan: SoftwarePlan) {
  const workflow = plan.workflow
    .map(
      (step, index) =>
        `${index + 1}. ${step.name}\n   - 角色：${step.role}\n   - 输出：${step.output}`,
    )
    .join("\n\n");

  const modules = plan.modules
    .map(
      (module) =>
        `## ${module.title}\n\n${module.items
          .map((item) => `- ${item}`)
          .join("\n")}`,
    )
    .join("\n\n");

  return `# ${plan.projectName}\n\n${plan.summary}\n\n## Agent 执行链路\n\n${workflow}\n\n${modules}\n`;
}

function needMobile(form: FormState) {
  return form.mobile === "需要";
}

function needAppStore(form: FormState) {
  return form.appStore === "需要";
}

export function runSoftwareFactoryAgent(form: FormState): SoftwarePlan {
  const projectName = form.idea.trim() || "企业级 AI Agent 软件生成助手";
  const mobileScope = needMobile(form)
    ? "包含 Web 端与移动端适配"
    : "第一阶段只做 Web 端";
  const launchScope = needAppStore(form)
    ? "后续需要准备应用商店上架材料，但本阶段不提交审核"
    : "本阶段不涉及应用商店上架";

  return {
    projectName,
    summary: `${projectName} 面向 ${form.industry}，服务 ${form.targetUser}。建议按 ${form.budget} 控制 MVP，${mobileScope}，${launchScope}。`,
    workflow: [
      {
        name: "需求理解 Agent",
        role: "把用户的软件想法翻译成产品目标和约束条件。",
        output: "识别行业、目标用户、预算、移动端和上架要求。",
      },
      {
        name: "产品经理 Agent",
        role: "整理产品定位、目标用户、PRD 和 MVP 范围。",
        output: "生成产品定位、PRD 产品需求文档、MVP 功能清单。",
      },
      {
        name: "架构设计 Agent",
        role: "把产品需求拆成页面、数据和接口。",
        output: "生成页面结构、数据库设计、API 接口清单。",
      },
      {
        name: "研发管理 Agent",
        role: "把方案变成开发人员能执行的任务。",
        output: "生成 AI Agent 工作流、测试用例、开发任务清单。",
      },
      {
        name: "发布规划 Agent",
        role: "判断上线准备范围，规避未确认的生产风险。",
        output: "生成上架材料清单和迭代计划。",
      },
    ],
    modules: [
      {
        title: "产品定位",
        items: [
          `${projectName} 是一个面向 ${form.industry} 场景的 Web SaaS 工具，帮助用户把软件想法整理成可执行的产品与开发方案。`,
          "第一阶段聚焦需求梳理、方案生成和任务拆分，不接入真实 AI、数据库或支付。",
        ],
      },
      {
        title: "目标用户",
        items: [
          `主要服务对象：${form.targetUser}。`,
          "适合不熟悉软件开发流程、但需要快速评估软件可行性和开发范围的业务团队。",
        ],
      },
      {
        title: "PRD 产品需求文档",
        items: [
          "用户输入软件想法后，系统输出产品背景、核心目标、功能范围、页面结构和交付清单。",
          "MVP 需要保证输入清晰、结果结构完整、内容便于复制给开发或外包团队。",
        ],
      },
      {
        title: "MVP 功能清单",
        items: [
          "软件想法输入表单。",
          "本地 Agent 工作流展示。",
          "模拟生成 12 个标准模块。",
          "结果分区展示，方便逐块阅读和后续复制。",
        ],
      },
      {
        title: "页面结构",
        items: [
          "首页 / 工作台：输入想法并查看生成结果。",
          "后续版本可增加项目历史页、项目详情页、设置页和登录页。",
        ],
      },
      {
        title: "数据库设计",
        items: [
          "MVP 本次不连接数据库。",
          "后续可设计 users、projects、generated_documents、generation_runs 四类核心数据表。",
        ],
      },
      {
        title: "API 接口清单",
        items: [
          "MVP 本次不创建后端 API。",
          "后续可增加创建项目、生成文档、读取历史记录、更新项目状态等接口。",
        ],
      },
      {
        title: "AI Agent 工作流",
        items: [
          "需求理解 Agent 收集软件想法和约束条件。",
          "产品经理 Agent 拆分定位、PRD 和 MVP。",
          "架构设计 Agent 生成页面、数据和接口。",
          "研发管理 Agent 输出测试与开发任务。",
          "发布规划 Agent 输出上架材料和迭代建议。",
        ],
      },
      {
        title: "测试用例",
        items: [
          "表单为空时仍能展示默认模拟结果。",
          "选择移动端或应用商店上架后，生成结果中能反映对应约束。",
          "每个 Agent 步骤都能在结果区看到对应说明。",
        ],
      },
      {
        title: "开发任务清单",
        items: [
          "初始化 Next.js + TypeScript + Tailwind CSS 项目。",
          "完成中文工作台页面、输入表单和模拟结果展示。",
          "抽离本地 Agent 引擎，沉淀可扩展的数据结构。",
          "运行 lint 与 build，确认基础工程可用。",
        ],
      },
      {
        title: "上架材料清单",
        items: [
          needAppStore(form)
            ? "后续需要准备应用名称、介绍文案、截图、隐私政策和审核说明。"
            : "当前阶段不准备应用商店上架材料。",
          "本次不会提交任何应用商店审核。",
        ],
      },
      {
        title: "迭代计划",
        items: [
          `预算范围建议按 ${form.budget} 控制 MVP 范围，先验证核心工作台。`,
          needMobile(form)
            ? "下一步需要补充移动端适配和移动端页面验收。"
            : "下一步优先完善 Web 端生成质量、历史记录和账号体系。",
        ],
      },
    ],
  };
}
