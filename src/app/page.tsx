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
  clientName: "",
  projectName: "",
  projectType: "AI Agent",
  targetPlatforms: "Web",
  coreProblem: "",
  requiredFeatures: "",
  targetUsers: "",
  budget: "5万以内",
  deadline: "2-4周",
  needsLogin: "暂不需要",
  needsDatabase: "暂不需要",
  needsAdmin: "暂不需要",
  needsAi: "需要",
  needsPayment: "暂不需要",
  needsListing: "暂不需要",
  thirdPartyIntegrations: "",
  complianceNotes: "",
};

const fieldStyle =
  "mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

const historyStorageKey = "delivery-factory-local-projects";

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
  const [copyStatus, setCopyStatus] = useState("复制交付包 Markdown");

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
    setCopyStatus("复制交付包 Markdown");
  }

  async function copyCurrentPlan() {
    await navigator.clipboard.writeText(planToMarkdown(plan));
    setCopyStatus("已复制");
  }

  function openLocalProject(project: LocalProject) {
    setForm(project.form);
    setGeneratedAt(project.createdAt);
    setHasGenerated(true);
    setCopyStatus("复制交付包 Markdown");
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-gray-950">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-8 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              本地客户项目交付工厂
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-gray-950 sm:text-4xl">
              企业级 AI Agent / 程序交付工厂
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600">
              面向你自己的客户项目，输入客户需求和指定功能，生成可开发、可测试、可部署、可上架、可迭代的本地交付包。
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 rounded-md border border-gray-200 bg-gray-50 p-3 text-center">
            <div>
              <p className="text-2xl font-semibold text-gray-950">12</p>
              <p className="text-xs text-gray-500">交付模块</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-950">0</p>
              <p className="text-xs text-gray-500">真实支付</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-950">本地</p>
              <p className="text-xs text-gray-500">优先使用</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[430px_1fr]">
        <form
          onSubmit={handleSubmit}
          className="h-fit rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-xl font-semibold text-gray-950">
              客户项目需求表
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              先把客户是谁、要做什么、哪些功能必须落地写清楚。
            </p>
          </div>

          <div className="mt-5 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <label className="block text-sm font-medium text-gray-800">
                客户名称
                <input
                  value={form.clientName}
                  onChange={(event) =>
                    updateField("clientName", event.target.value)
                  }
                  placeholder="例如：某某教育公司"
                  className={fieldStyle}
                />
              </label>

              <label className="block text-sm font-medium text-gray-800">
                项目名称
                <input
                  value={form.projectName}
                  onChange={(event) =>
                    updateField("projectName", event.target.value)
                  }
                  placeholder="例如：招生客服 Agent"
                  className={fieldStyle}
                />
              </label>
            </div>

            <label className="block text-sm font-medium text-gray-800">
              客户要解决的问题
              <textarea
                value={form.coreProblem}
                onChange={(event) =>
                  updateField("coreProblem", event.target.value)
                }
                rows={4}
                placeholder="例如：客户每天收到大量咨询，需要自动回复、收集线索、提醒人工跟进。"
                className={`${fieldStyle} resize-none`}
              />
            </label>

            <label className="block text-sm font-medium text-gray-800">
              客户指定功能列表
              <textarea
                value={form.requiredFeatures}
                onChange={(event) =>
                  updateField("requiredFeatures", event.target.value)
                }
                rows={5}
                placeholder="每行一个功能，例如：自动回复咨询、客户资料收集、生成跟进任务、导出线索表"
                className={`${fieldStyle} resize-none`}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-gray-800">
                项目类型
                <select
                  value={form.projectType}
                  onChange={(event) =>
                    updateField("projectType", event.target.value)
                  }
                  className={fieldStyle}
                >
                  <option>AI Agent</option>
                  <option>Web 程序</option>
                  <option>内部工具</option>
                  <option>微信小程序</option>
                  <option>浏览器插件</option>
                  <option>移动 App</option>
                  <option>桌面软件</option>
                </select>
              </label>

              <label className="block text-sm font-medium text-gray-800">
                目标平台
                <input
                  value={form.targetPlatforms}
                  onChange={(event) =>
                    updateField("targetPlatforms", event.target.value)
                  }
                  placeholder="例如：Web、微信小程序、App"
                  className={fieldStyle}
                />
              </label>
            </div>

            <label className="block text-sm font-medium text-gray-800">
              目标用户
              <input
                value={form.targetUsers}
                onChange={(event) =>
                  updateField("targetUsers", event.target.value)
                }
                placeholder="例如：销售人员、客服主管、终端客户"
                className={fieldStyle}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-gray-800">
                客户预算
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

              <label className="block text-sm font-medium text-gray-800">
                交付时间
                <select
                  value={form.deadline}
                  onChange={(event) =>
                    updateField("deadline", event.target.value)
                  }
                  className={fieldStyle}
                >
                  <option>1周内</option>
                  <option>2-4周</option>
                  <option>1-3个月</option>
                  <option>时间待确认</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["needsLogin", "是否需要登录"],
                ["needsDatabase", "是否需要数据库"],
                ["needsAdmin", "是否需要后台管理"],
                ["needsAi", "是否需要 AI"],
                ["needsPayment", "是否需要支付"],
                ["needsListing", "是否需要上架"],
              ].map(([field, label]) => (
                <label
                  key={field}
                  className="block text-sm font-medium text-gray-800"
                >
                  {label}
                  <select
                    value={form[field as keyof FormState]}
                    onChange={(event) =>
                      updateField(field as keyof FormState, event.target.value)
                    }
                    className={fieldStyle}
                  >
                    <option>暂不需要</option>
                    <option>需要</option>
                  </select>
                </label>
              ))}
            </div>

            <label className="block text-sm font-medium text-gray-800">
              第三方平台 / API
              <input
                value={form.thirdPartyIntegrations}
                onChange={(event) =>
                  updateField("thirdPartyIntegrations", event.target.value)
                }
                placeholder="例如：企业微信、飞书、Stripe、微信支付"
                className={fieldStyle}
              />
            </label>

            <label className="block text-sm font-medium text-gray-800">
              合规 / 隐私 / 上架备注
              <textarea
                value={form.complianceNotes}
                onChange={(event) =>
                  updateField("complianceNotes", event.target.value)
                }
                rows={3}
                placeholder="例如：需要隐私政策、不能上传客户数据、需要审核测试账号"
                className={`${fieldStyle} resize-none`}
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-md bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              生成客户项目交付包
            </button>
          </div>

          <section className="mt-6 border-t border-gray-100 pt-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-gray-950">
                本地项目历史
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
                    <p className="text-sm font-medium text-gray-900">
                      {project.form.projectName || "未命名客户项目"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {project.form.clientName || "未填写客户"} /{" "}
                      {project.createdAt}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-gray-500">
                生成后会自动保存在当前浏览器，方便你回看客户项目。
              </p>
            )}
          </section>
        </form>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-950">
                客户项目交付包
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                当前由本地交付 Agent 生成，不下载外部项目，不连接真实 API、支付、部署或上架服务。
              </p>
            </div>
            <span className="w-fit rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              本地安全模式
            </span>
          </div>

          {hasGenerated ? (
            <div className="space-y-5 p-5">
              <section className="rounded-md border border-blue-100 bg-blue-50 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-800">
                      交付 Agent 已完成一次本地推演
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

              <section className="grid gap-4 md:grid-cols-[260px_1fr]">
                <article className="rounded-md border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-gray-950">
                    交付成熟度
                  </p>
                  <p className="mt-3 text-lg font-semibold text-blue-700">
                    {plan.maturity}
                  </p>
                </article>
                <article className="rounded-md border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-gray-950">
                    风险提示
                  </p>
                  <div className="mt-3 grid gap-2 md:grid-cols-2">
                    {plan.risks.map((risk) => (
                      <div
                        key={`${risk.level}-${risk.title}`}
                        className="rounded-md border border-gray-200 bg-white p-3"
                      >
                        <p className="text-sm font-semibold text-gray-950">
                          【{risk.level}】{risk.title}
                        </p>
                        <p className="mt-2 text-xs leading-5 text-gray-600">
                          {risk.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
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
            <div className="flex min-h-[620px] items-center justify-center p-8 text-center">
              <div className="max-w-md">
                <p className="text-lg font-semibold text-gray-950">
                  填写左侧客户需求表后，点击按钮生成交付包。
                </p>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  交付包会包含 12 个模块、风险提示、成熟度判断和可复制的 Markdown 文档。
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
