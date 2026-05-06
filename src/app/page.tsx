"use client";

import { FormEvent, useMemo, useState } from "react";

type FormState = {
  idea: string;
  industry: string;
  targetUser: string;
  budget: string;
  mobile: string;
  appStore: string;
};

type ResultModule = {
  title: string;
  items: string[];
};

const initialForm: FormState = {
  idea: "",
  industry: "企业服务",
  targetUser: "中小企业负责人",
  budget: "5万以内",
  mobile: "暂不需要",
  appStore: "暂不需要",
};

const fieldStyle =
  "mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

function buildMockResults(form: FormState): ResultModule[] {
  const productName = form.idea.trim() || "企业级 AI Agent 软件生成助手";

  return [
    {
      title: "产品定位",
      items: [
        `${productName} 是一个面向 ${form.industry} 场景的 Web SaaS 工具，帮助用户把软件想法整理成可执行的产品与开发方案。`,
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
        "收集软件想法和约束条件。",
        "拆分产品、技术、测试、发布四类输出。",
        "生成结构化结果并提示下一步开发任务。",
      ],
    },
    {
      title: "测试用例",
      items: [
        "表单为空时仍能展示默认模拟结果。",
        "选择移动端或应用商店上架后，生成结果中能反映对应约束。",
      ],
    },
    {
      title: "开发任务清单",
      items: [
        "初始化 Next.js + TypeScript + Tailwind CSS 项目。",
        "完成中文工作台页面、输入表单和模拟结果展示。",
        "运行 lint 与 build，确认基础工程可用。",
      ],
    },
    {
      title: "上架材料清单",
      items: [
        form.appStore === "需要"
          ? "后续需要准备应用名称、介绍文案、截图、隐私政策和审核说明。"
          : "当前阶段不准备应用商店上架材料。",
        "本次不会提交任何应用商店审核。",
      ],
    },
    {
      title: "迭代计划",
      items: [
        `预算范围建议按 ${form.budget} 控制 MVP 范围，先验证核心工作台。`,
        form.mobile === "需要"
          ? "下一步需要补充移动端适配和移动端页面验收。"
          : "下一步优先完善 Web 端生成质量、历史记录和账号体系。",
      ],
    },
  ];
}

export default function Home() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [hasGenerated, setHasGenerated] = useState(false);

  const results = useMemo(() => buildMockResults(form), [form]);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasGenerated(true);
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-gray-950">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-8 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">Web SaaS MVP</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-gray-950 sm:text-4xl">
              企业级 AI Agent 软件生成助手
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600">
              输入一个软件想法，先用模拟生成方式输出产品、研发、测试和发布准备材料，让非技术用户也能看懂下一步该做什么。
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 rounded-md border border-gray-200 bg-gray-50 p-3 text-center">
            <div>
              <p className="text-2xl font-semibold text-gray-950">12</p>
              <p className="text-xs text-gray-500">生成模块</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-950">0</p>
              <p className="text-xs text-gray-500">真实 API</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-950">MVP</p>
              <p className="text-xs text-gray-500">第一阶段</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[400px_1fr]">
        <form
          onSubmit={handleSubmit}
          className="h-fit rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-xl font-semibold text-gray-950">软件想法输入</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              先填写业务信息，点击生成后展示静态模拟结果。
            </p>
          </div>

          <div className="mt-5 space-y-5">
            <label className="block text-sm font-medium text-gray-800">
              软件想法
              <textarea
                value={form.idea}
                onChange={(event) => updateField("idea", event.target.value)}
                rows={5}
                placeholder="例如：帮企业自动生成 AI Agent 软件开发方案的工具"
                className={`${fieldStyle} resize-none`}
              />
            </label>

            <label className="block text-sm font-medium text-gray-800">
              目标行业
              <select
                value={form.industry}
                onChange={(event) => updateField("industry", event.target.value)}
                className={fieldStyle}
              >
                <option>企业服务</option>
                <option>教育培训</option>
                <option>本地生活</option>
                <option>电商零售</option>
                <option>医疗健康</option>
                <option>金融科技</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-gray-800">
              目标用户
              <input
                value={form.targetUser}
                onChange={(event) =>
                  updateField("targetUser", event.target.value)
                }
                placeholder="例如：中小企业负责人、产品经理、创业者"
                className={fieldStyle}
              />
            </label>

            <label className="block text-sm font-medium text-gray-800">
              预算范围
              <select
                value={form.budget}
                onChange={(event) => updateField("budget", event.target.value)}
                className={fieldStyle}
              >
                <option>5万以内</option>
                <option>5万-20万</option>
                <option>20万-50万</option>
                <option>50万以上</option>
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <label className="block text-sm font-medium text-gray-800">
                是否需要移动端
                <select
                  value={form.mobile}
                  onChange={(event) => updateField("mobile", event.target.value)}
                  className={fieldStyle}
                >
                  <option>暂不需要</option>
                  <option>需要</option>
                </select>
              </label>

              <label className="block text-sm font-medium text-gray-800">
                是否需要应用商店上架
                <select
                  value={form.appStore}
                  onChange={(event) =>
                    updateField("appStore", event.target.value)
                  }
                  className={fieldStyle}
                >
                  <option>暂不需要</option>
                  <option>需要</option>
                </select>
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              生成模拟软件方案
            </button>
          </div>
        </form>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-950">模拟生成结果</h2>
              <p className="mt-2 text-sm text-gray-600">
                当前仅为静态演示，不连接 Supabase、OpenAI API、支付或部署服务。
              </p>
            </div>
            <span className="w-fit rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              安全模式
            </span>
          </div>

          {hasGenerated ? (
            <div className="grid gap-4 p-5 md:grid-cols-2">
              {results.map((module, index) => (
                <article
                  key={module.title}
                  className="rounded-md border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-blue-700 text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <h3 className="text-base font-semibold text-gray-950">
                      {module.title}
                    </h3>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm leading-6 text-gray-600">
                    {module.items.map((item) => (
                      <li key={item} className="border-l-2 border-gray-300 pl-3">
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[520px] items-center justify-center p-8 text-center">
              <div className="max-w-md">
                <p className="text-lg font-semibold text-gray-950">
                  填写左侧表单后，点击按钮查看 12 个模块的模拟输出。
                </p>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  这一步用于验证 Web MVP 骨架和页面体验，后续确认后再接入真实 AI 和数据库。
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
