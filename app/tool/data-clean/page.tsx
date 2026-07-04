"use client";

import { useState } from "react";

type Row = Record<string, string>;

const OPERATIONS = [
  { id: "dedupe", label: "去重(基于整行)" },
  { id: "dropEmpty", label: "去除空行" },
  { id: "trim", label: "去除首尾空格" },
  { id: "phone", label: "标准化手机号(保留 11 位)" },
  { id: "date", label: "标准化日期(转 YYYY-MM-DD)" },
];

function parseCSV(text: string): Row[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return [];
  const headers = splitCSVLine(lines[0]);
  const rows: Row[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = splitCSVLine(lines[i]);
    const row: Row = {};
    headers.forEach((h, j) => (row[h] = cells[j] ?? ""));
    rows.push(row);
  }
  return rows;
}

function splitCSVLine(line: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuote && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuote = !inQuote;
      }
    } else if (c === "," && !inQuote) {
      result.push(cur);
      cur = "";
    } else {
      cur += c;
    }
  }
  result.push(cur);
  return result.map((s) => s.trim());
}

function toCSV(rows: Row[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(
      headers
        .map((h) => {
          const v = row[h] ?? "";
          return v.includes(",") || v.includes('"')
            ? `"${v.replace(/"/g, '""')}"`
            : v;
        })
        .join(",")
    );
  }
  return lines.join("\n");
}

function normalizePhone(s: string): string {
  const digits = s.replace(/\D/g, "");
  return digits.length >= 11 ? digits.slice(-11) : digits;
}

function normalizeDate(s: string): string {
  const m = s.match(/(\d{4})[/\-.年](\d{1,2})[/\-.月](\d{1,2})/);
  if (m) {
    return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  }
  return s;
}

function clean(rows: Row[], ops: Set<string>): Row[] {
  let result = [...rows];

  if (ops.has("trim")) {
    result = result.map((r) => {
      const nr: Row = {};
      for (const k in r) nr[k] = r[k].trim();
      return nr;
    });
  }

  if (ops.has("dropEmpty")) {
    result = result.filter((r) => Object.values(r).some((v) => v.trim()));
  }

  if (ops.has("phone")) {
    result = result.map((r) => {
      const nr = { ...r };
      for (const k in nr) {
        if (/^1\d{10}$/.test(nr[k].replace(/\D/g, ""))) {
          nr[k] = normalizePhone(nr[k]);
        }
      }
      return nr;
    });
  }

  if (ops.has("date")) {
    result = result.map((r) => {
      const nr = { ...r };
      for (const k in nr) {
        if (/\d{4}[/\-.年]\d{1,2}[/\-.月]\d{1,2}/.test(nr[k])) {
          nr[k] = normalizeDate(nr[k]);
        }
      }
      return nr;
    });
  }

  if (ops.has("dedupe")) {
    const seen = new Set<string>();
    result = result.filter((r) => {
      const key = JSON.stringify(r);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  return result;
}

export default function DataCleanPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [ops, setOps] = useState<Set<string>>(new Set(["dedupe", "dropEmpty"]));
  const [fileName, setFileName] = useState("");
  const [cleaned, setCleaned] = useState<Row[]>([]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const parsed = parseCSV(text);
      setRows(parsed);
      setCleaned([]);
    };
    reader.readAsText(file);
  }

  function toggleOp(id: string) {
    setOps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleClean() {
    setCleaned(clean(rows, ops));
  }

  function download() {
    if (cleaned.length === 0) return;
    const csv = toCSV(cleaned);
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cleaned_${fileName || "data.csv"}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-3">🧹 数据清洗器</h1>
        <p className="text-gray-400">
          上传 CSV,选择清洗选项,自动处理并下载结果。完全本地处理,不上传服务器。
        </p>
      </header>

      <div className="space-y-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">上传 CSV 文件</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFile}
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-gradient file:text-white file:cursor-pointer"
          />
          {fileName && (
            <p className="mt-2 text-sm text-gray-500">
              已加载 {fileName} · {rows.length} 行
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">清洗选项</label>
          <div className="grid grid-cols-2 gap-2">
            {OPERATIONS.map((op) => (
              <label
                key={op.id}
                className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition"
              >
                <input
                  type="checkbox"
                  checked={ops.has(op.id)}
                  onChange={() => toggleOp(op.id)}
                  className="accent-indigo-500"
                />
                <span className="text-sm">{op.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleClean}
          disabled={rows.length === 0}
          className="px-6 py-3 rounded-lg bg-brand-gradient text-white font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          开始清洗
        </button>

        {cleaned.length > 0 && (
          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                清洗完成: {rows.length} 行 → {cleaned.length} 行
              </span>
              <button
                onClick={download}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition"
              >
                下载 CSV
              </button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-white/5">
                  <tr>
                    {Object.keys(cleaned[0]).map((h) => (
                      <th key={h} className="text-left p-2 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cleaned.slice(0, 100).map((r, i) => (
                    <tr key={i} className="border-t border-white/5">
                      {Object.keys(cleaned[0]).map((h) => (
                        <td key={h} className="p-2 text-gray-300">
                          {r[h]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {cleaned.length > 100 && (
                <p className="p-2 text-xs text-gray-500 text-center">
                  仅显示前 100 行,完整数据请下载
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
