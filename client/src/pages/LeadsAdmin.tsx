import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Download, LockKeyhole, ShieldCheck, UsersRound } from "lucide-react";

type LeadRow = { id: number; parentName: string; phone: string; district: string; grade: string; track: string; score: number; weaknessSummary: string; consentAt: Date | string; createdAt: Date | string; followUpStatus: "new" | "contacted" | "closed" };
const csvCell = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
export function parentLeadsToCsv(leads: LeadRow[]) {
  const header = ["提交編號", "家長稱呼", "聯絡電話", "十八區", "年級", "評估卷", "答對題數", "弱項摘要", "同意時間", "提交時間", "跟進狀態"];
  const rows = leads.map((lead) => [lead.id, lead.parentName, lead.phone, lead.district, lead.grade, lead.track, `${lead.score}/20`, lead.weaknessSummary, new Date(lead.consentAt).toISOString(), new Date(lead.createdAt).toISOString(), lead.followUpStatus]);
  return `\uFEFF${[header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n")}`;
}
const localTime = (value: Date | string) => new Intl.DateTimeFormat("zh-HK", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

export default function LeadsAdmin() {
  const { user, loading } = useAuth();
  const isAdmin = user?.role === "admin";
  const leads = trpc.leads.adminList.useQuery(undefined, { enabled: isAdmin });
  const exportLeads = trpc.leads.adminExport.useQuery(undefined, { enabled: false });
  const downloadCsv = async () => {
    const result = await exportLeads.refetch();
    if (!result.data) return;
    const blob = new Blob([parentLeadsToCsv(result.data as LeadRow[])], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `學習航圖-家長跟進資料-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return <DashboardLayout><div className="max-w-7xl mx-auto p-2 md:p-8 space-y-8 text-slate-900"><header className="flex flex-col gap-4 border-b border-slate-200 pb-7 md:flex-row md:items-end md:justify-between"><div><p className="text-xs uppercase tracking-[0.18em] text-emerald-700 font-bold">Learning Compass · Admin</p><h1 className="mt-2 text-3xl md:text-4xl font-serif text-emerald-950">家長跟進資料</h1><p className="mt-3 max-w-2xl text-sm text-slate-600 leading-6">僅顯示家長已同意作學習跟進的提交資料。電話與評估摘要不會在公開網站、PDF、分享內容或任何公開 API 顯示。</p></div>{isAdmin && <button onClick={downloadCsv} disabled={exportLeads.isFetching} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"><Download size={16} />{exportLeads.isFetching ? "正在準備 CSV…" : "匯出 CSV"}</button>}</header>{loading ? <p className="text-sm text-slate-500">正在檢查管理權限…</p> : !isAdmin ? <section className="rounded-xl border border-amber-200 bg-amber-50 p-6"><LockKeyhole className="text-amber-800" /><h2 className="mt-3 font-bold text-amber-900">需要管理員權限</h2><p className="text-sm text-amber-800 mt-2">家長聯絡資料只供管理員按已取得的同意作後續學習跟進使用。</p></section> : <><section className="grid gap-4 md:grid-cols-3"><article className="rounded-xl border border-emerald-100 bg-emerald-50 p-4"><UsersRound className="text-emerald-800" size={20} /><strong className="mt-3 block text-2xl text-emerald-950">{leads.data?.length ?? 0}</strong><span className="text-sm text-emerald-800">已提交跟進資料</span></article><article className="rounded-xl border border-blue-100 bg-blue-50 p-4"><ShieldCheck className="text-blue-800" size={20} /><strong className="mt-3 block text-sm text-blue-950">權限保護</strong><span className="text-sm text-blue-800">後端僅允許管理員讀取與匯出</span></article><article className="rounded-xl border border-slate-200 bg-white p-4"><Download className="text-slate-700" size={20} /><strong className="mt-3 block text-sm text-slate-950">本機下載</strong><span className="text-sm text-slate-600">CSV 只在此管理員瀏覽器產生</span></article></section><section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-5 py-4"><h2 className="font-bold text-emerald-950">已授權的家長提交</h2><p className="mt-1 text-xs text-slate-500">請只在必要的學習跟進情況下使用資料，並依私隱要求安全保存及刪除。</p></div>{leads.isLoading ? <p className="p-6 text-sm text-slate-500">正在讀取受保護資料…</p> : leads.error ? <p className="p-6 text-sm text-red-700">未能讀取資料：{leads.error.message}</p> : !leads.data?.length ? <p className="p-8 text-center text-sm text-slate-600">暫未有已同意的家長跟進資料。</p> : <div className="overflow-x-auto"><table className="min-w-[1050px] w-full text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-600"><tr><th className="px-4 py-3">提交時間</th><th className="px-4 py-3">家長／電話</th><th className="px-4 py-3">十八區</th><th className="px-4 py-3">評估</th><th className="px-4 py-3">結果摘要</th><th className="px-4 py-3">同意</th></tr></thead><tbody className="divide-y divide-slate-100">{leads.data.map((lead) => <tr key={lead.id} className="align-top"><td className="px-4 py-4 whitespace-nowrap text-slate-600">{localTime(lead.createdAt)}</td><td className="px-4 py-4"><strong className="block text-emerald-950">{lead.parentName}</strong><a className="mt-1 inline-block font-mono text-xs text-emerald-800 underline" href={`tel:${lead.phone}`}>{lead.phone}</a></td><td className="px-4 py-4 text-slate-700">{lead.district}</td><td className="px-4 py-4"><strong className="block text-slate-900">{lead.grade} · {lead.track}</strong><span className="text-xs text-slate-600">答對 {lead.score}/20</span></td><td className="max-w-xs px-4 py-4 text-xs leading-5 text-slate-600">{lead.weaknessSummary}</td><td className="px-4 py-4 text-xs text-slate-600">{localTime(lead.consentAt)}</td></tr>)}</tbody></table></div>}</section></>}</div></DashboardLayout>;
}
