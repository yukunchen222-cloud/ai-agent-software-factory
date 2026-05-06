export type FormState = {
  clientName: string;
  projectName: string;
  projectType: string;
  targetPlatforms: string;
  coreProblem: string;
  requiredFeatures: string;
  targetUsers: string;
  budget: string;
  deadline: string;
  needsLogin: string;
  needsDatabase: string;
  needsAdmin: string;
  needsAi: string;
  needsPayment: string;
  needsListing: string;
  thirdPartyIntegrations: string;
  complianceNotes: string;
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

export type DeliveryRisk = {
  level: "低" | "中" | "高";
  title: string;
  detail: string;
};

export type SoftwarePlan = {
  projectName: string;
  summary: string;
  maturity: string;
  risks: DeliveryRisk[];
  workflow: AgentWorkflowStep[];
  modules: ResultModule[];
};

function asList(value: string, fallback: string[]) {
  const items = value
    .split(/\n|,|，|、/)
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length > 0 ? items : fallback;
}

function isNeeded(value: string) {
  return value === "需要";
}

function buildRisks(form: FormState): DeliveryRisk[] {
  const risks: DeliveryRisk[] = [];

  if (isNeeded(form.needsPayment)) {
    risks.push({
      level: "高",
      title: "真实支付需要单独确认",
      detail: "接入支付前必须确认支付主体、回调安全、退款规则和合规要求，本工具不会自动接入真实支付。",
    });
  }

  if (isNeeded(form.needsListing)) {
    risks.push({
      level: "中",
      title: "上架审核存在不确定性",
      detail: "应用商店、小程序平台或插件市场可能要求隐私政策、截图、测试账号和审核说明。",
    });
  }

  if (isNeeded(form.needsDatabase)) {
    risks.push({
      level: "中",
      title: "数据库迁移需要人工确认",
      detail: "正式创建表、迁移数据库、删除字段或清理数据前必须再次确认，避免误删客户数据。",
    });
  }

  if (form.thirdPartyIntegrations.trim()) {
    risks.push({
      level: "中",
      title: "第三方平台密钥不能写进代码",
      detail: "第三方 API Key、Secret、Webhook Token 必须放在环境变量或平台密钥管理中。",
    });
  }

  if (!form.coreProblem.trim() || !form.requiredFeatures.trim()) {
    risks.push({
      level: "高",
      title: "客户需求还不够清楚",
      detail: "核心问题或指定功能为空时，只能生成初步方案，不能直接进入开发交付。",
    });
  }

  return risks.length > 0
    ? risks
    : [
        {
          level: "低",
          title: "当前未发现高风险项",
          detail: "仍建议在正式开发、部署、上架和接入真实服务前逐项复核。",
        },
      ];
}

function buildMaturity(form: FormState, risks: DeliveryRisk[]) {
  if (!form.coreProblem.trim() || !form.requiredFeatures.trim()) {
    return "需求不清楚";
  }

  if (risks.some((risk) => risk.level === "高")) {
    return "可做 MVP，开发前需确认高风险项";
  }

  if (isNeeded(form.needsListing)) {
    return "可开发，后续需要补齐上架材料";
  }

  return "可开发，可进入本地 MVP 制作";
}

export function planToMarkdown(plan: SoftwarePlan) {
  const risks = plan.risks
    .map((risk) => `- 【${risk.level}】${risk.title}：${risk.detail}`)
    .join("\n");

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

  return `# ${plan.projectName}\n\n${plan.summary}\n\n## 交付成熟度\n\n${plan.maturity}\n\n## 风险提示\n\n${risks}\n\n## Agent 执行链路\n\n${workflow}\n\n${modules}\n`;
}

export function runSoftwareFactoryAgent(form: FormState): SoftwarePlan {
  const projectName = form.projectName.trim() || "客户项目交付包";
  const clientName = form.clientName.trim() || "未填写客户";
  const features = asList(form.requiredFeatures, [
    "需求录入",
    "结果生成",
    "本地历史",
    "交付包复制",
  ]);
  const platforms = asList(form.targetPlatforms, ["Web"]);
  const integrations = asList(form.thirdPartyIntegrations, ["暂无第三方集成"]);
  const risks = buildRisks(form);

  return {
    projectName,
    summary: `${projectName} 是为 ${clientName} 制作的 ${form.projectType} 交付方案，目标平台为 ${platforms.join("、")}，预算 ${form.budget}，期望交付时间 ${form.deadline || "待确认"}。`,
    maturity: buildMaturity(form, risks),
    risks,
    workflow: [
      {
        name: "客户需求分析 Agent",
        role: "把客户口头需求整理成可执行的交付目标。",
        output: "输出客户需求摘要、边界和待确认问题。",
      },
      {
        name: "功能架构 Agent",
        role: "判断项目类型、平台范围和核心功能组合。",
        output: "输出最终产品定义、功能范围和操作流程。",
      },
      {
        name: "技术落地 Agent",
        role: "把功能翻译成数据结构、接口和技术选型。",
        output: "输出数据结构、API / 自动化接口、技术栈建议。",
      },
      {
        name: "交付管理 Agent",
        role: "把项目拆成开发任务、测试验收和发布准备。",
        output: "输出开发任务、测试验收清单、部署与上架清单。",
      },
      {
        name: "迭代规划 Agent",
        role: "判断当前版本能否交付，并规划后续版本。",
        output: "输出交付成熟度、风险提示和后续迭代路线。",
      },
    ],
    modules: [
      {
        title: "客户需求摘要",
        items: [
          `客户：${clientName}。`,
          `项目目标：${form.coreProblem || "需要进一步补充客户要解决的问题"}。`,
          `目标用户：${form.targetUsers || "待确认"}。`,
        ],
      },
      {
        title: "最终产品定义",
        items: [
          `交付类型：${form.projectType}。`,
          `目标平台：${platforms.join("、")}。`,
          "目标是交付一个可运行、可验收、可继续迭代的客户项目版本。",
        ],
      },
      {
        title: "功能范围",
        items: [
          ...features.map((feature) => `核心功能：${feature}。`),
          isNeeded(form.needsLogin) ? "包含登录 / 身份识别。" : "第一版不强制登录。",
          isNeeded(form.needsAdmin) ? "包含后台管理能力。" : "第一版不包含复杂后台。",
        ],
      },
      {
        title: "Agent 能力设计",
        items: [
          isNeeded(form.needsAi)
            ? "需要 AI Agent：建议拆成需求理解、任务执行、结果检查三个阶段。"
            : "当前不强制接入 AI，可先做规则型流程或普通程序。",
          "每个 Agent 都需要明确输入、处理步骤、输出格式和失败兜底策略。",
          "真实模型接入前先保留本地模拟逻辑，方便测试和验收。",
        ],
      },
      {
        title: "页面 / 操作流程",
        items: [
          "入口页：录入客户需求或任务参数。",
          "执行页：展示处理进度、步骤和中间结果。",
          "结果页：展示交付成果、复制内容和导出材料。",
          isNeeded(form.needsAdmin)
            ? "后台页：管理项目、用户、配置和生成记录。"
            : "后台页可放到后续版本。",
        ],
      },
      {
        title: "数据结构",
        items: [
          isNeeded(form.needsDatabase)
            ? "建议设计 projects、project_requirements、generated_outputs、delivery_reviews 表。"
            : "第一版可使用浏览器本地存储，后续再接数据库。",
          "任何数据库迁移、删表、清理客户数据前都必须人工确认。",
          "敏感字段、API Key、客户隐私信息不能硬编码到前端代码。",
        ],
      },
      {
        title: "API / 自动化接口",
        items: [
          "创建项目接口：保存客户需求和项目配置。",
          "生成交付包接口：根据需求生成方案、任务和验收清单。",
          "读取历史接口：查看客户项目记录。",
          `第三方集成：${integrations.join("、")}。`,
        ],
      },
      {
        title: "技术选型",
        items: [
          "Web MVP：Next.js + TypeScript + Tailwind CSS。",
          isNeeded(form.needsDatabase)
            ? "数据库建议：Supabase，正式建表前先确认表结构和 RLS 权限。"
            : "当前阶段可继续用浏览器本地存储。",
          isNeeded(form.needsAi)
            ? "AI 接入建议：OpenAI API，Key 只放环境变量。"
            : "暂不需要真实 AI API。",
        ],
      },
      {
        title: "开发任务",
        items: [
          "整理客户需求字段和验收口径。",
          "实现核心页面和主要交互。",
          "实现本地或后端数据保存。",
          "实现交付包生成、复制和导出。",
          "补充错误提示、空状态和基本权限边界。",
        ],
      },
      {
        title: "测试验收清单",
        items: [
          "空表单、长文本、多功能列表都能正常生成。",
          "客户指定功能都出现在交付包里。",
          "复制 Markdown 内容完整可读。",
          "涉及支付、数据库、上架、第三方密钥时都有风险提示。",
          "交付版本能在目标平台本地运行或预览。",
        ],
      },
      {
        title: "部署与上架清单",
        items: [
          "本地验收：运行 lint、build 和手动页面检查。",
          "预览部署：可使用 Vercel 预览环境，但正式上线前必须确认。",
          isNeeded(form.needsListing)
            ? "上架材料：名称、简介、截图、隐私政策、测试账号、审核说明。"
            : "当前不做应用商店上架。",
          "不会自动提交生产发布或商店审核。",
        ],
      },
      {
        title: "后续迭代路线",
        items: [
          "V1：完成客户指定核心功能，保证可运行和可验收。",
          "V2：增加历史记录、编辑能力、导出能力和更完整配置。",
          "V3：接入真实数据库、真实 AI 或第三方平台。",
          "V4：补齐部署、监控、上架材料和客户交付文档。",
        ],
      },
    ],
  };
}
