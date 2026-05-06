"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import {
  FormState,
  planToMarkdown,
  runSoftwareFactoryAgent,
} from "@/lib/softwareFactoryAgent";

type LocalProject = {
  id: string;
  createdAt: string;
  form: FormState;
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

const historyStorageKey = "software-factory-local-projects";

function readLocalProjects() {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = window.localStorage.getItem(historyStorageKey);
  if (!rawValue) {
    return [];
  }

  try {
    return JSON.parse(rawValue) as LocalProject[];
  } catch {
    return [];
  }
}

function writeLocalProjects(projects: LocalProject[]) {
  window.localStorage.setItem(historyStorageKey, JSON.stringify(projects));
}

export default function Home() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [generatedAt, setGeneratedAt] = useState("");
  const [localProjects, setLocalProjects] = useState<LocalProject[]>([]);
  const [copyStatus, setCopyStatus] = useState("复制 Markdown");

  const plan = useMemo(() => runSoftwareFactoryAgent(form), [form]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLocalProjects(readLocalProjects());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const createdAt = new Date().toLocaleString("zh-CN");
    const nextProject: LocalProject = {
      id: crypto.randomUUID(),
      createdAt,
      form,
    };
    const nextProjects = [nextProject, ...readLocalProjects()];

    writeLocalProjects(nextProjects);
    setLocalProjects(nextProjects);
    setHasGenerated(true);
    setGeneratedAt(createdAt);
    setCopyStatus("复制 Markdown");
  }

  async function copyCurrentPlan() {
    await navigator.clipboard.writeText(planToMarkdown(plan));
    setCopyStatus("已复制");
  }

  function openLocalProject(project: LocalProject) {
    setForm(project.form);
    setGeneratedAt(project.createdAt);
    setHasGenerated(true);
    setCopyStatus("复制 Markdown");
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

          <section className="mt-6 border-t border-gray-100 pt-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-gray-950">
                本地生成历史
              </h3>
              <span className="text-xs text-gray-500">
                {localProjects.length} 条
              </span>
            </div>
            {localProjects.length > 0 ? (
              <div className="mt-3 space-y-2">
                {localProjects.slice(0, 5).map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => openLocalProject(project)}
                    className="w-full rounded-md border border-gray-200 bg-gray-50 p-3 text-left transition hover:border-blue-200 hover:bg-blue-50"
                  >
                    <p className="line-clamp-2 text-sm font-medium text-gray-900">
                      {project.form.idea || "未命名软件想法"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {project.createdAt}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-gray-500">
                生成后会自动保存在当前浏览器，方便你回看。
              </p>
            )}
          </section>
        </form>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-950">模拟生成结果</h2>
              <p className="mt-2 text-sm text-gray-600">
                当前由本地模拟 Agent 引擎生成，不连接 Supabase、OpenAI API、支付或部署服务。
              </p>
            </div>
            <span className="w-fit rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              安全模式
            </span>
          </div>

          {hasGenerated ? (
            <div className="space-y-5 p-5">
              <section className="rounded-md border border-blue-100 bg-blue-50 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-800">
                      Agent 已完成一次本地推演
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-gray-950">
                      {plan.projectName}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-gray-700">
                      {plan.summary}
                    </p>
                  </div>
                  <span className="w-fit rounded-md bg-white px-3 py-1 text-xs font-medium text-blue-800">
                    {generatedAt}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={copyCurrentPlan}
                  className="mt-4 rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  {copyStatus}
                </button>
              </section>

              <section>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-gray-950">
                    Agent 执行链路
                  </h3>
                  <span className="text-xs font-medium text-gray-500">
                    本地模拟，未调用真实模型
                  </span>
                </div>
                <div className="grid gap-3 lg:grid-cols-5">
                  {plan.workflow.map((step, index) => (
                    <article
                      key={step.name}
                      className="rounded-md border border-gray-200 bg-gray-50 p-3"
                    >
                      <span className="flex size-7 items-center justify-center rounded-md bg-gray-900 text-xs font-semibold text-white">
                        {index + 1}
                      </span>
                      <h4 className="mt-3 text-sm font-semibold text-gray-950">
                        {step.name}
                      </h4>
                      <p className="mt-2 text-xs leading-5 text-gray-600">
                        {step.role}
                      </p>
                      <p className="mt-3 border-t border-gray-200 pt-3 text-xs leading-5 text-gray-700">
                        {step.output}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-2">
                {plan.modules.map((module, index) => (
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
                        <li
                          key={item}
                          className="border-l-2 border-gray-300 pl-3"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </section>
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
