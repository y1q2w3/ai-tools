import Link from "next/link";

type Props = {
  href: string;
  emoji: string;
  title: string;
  desc: string;
  tags: string[];
};

export default function ToolCard({ href, emoji, title, desc, tags }: Props) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/[0.07] hover:border-white/20 transition"
    >
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className="text-xl font-semibold mb-2 group-hover:text-white">
        {title}
      </h3>
      <p className="text-sm text-gray-400 mb-4 leading-relaxed">{desc}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="mt-4 text-sm text-indigo-400 group-hover:text-indigo-300 transition">
        开始使用 →
      </div>
    </Link>
  );
}
