import ReactMarkdown from "react-markdown";

interface MarkdownViewerProps {
  content: string;
}

function MarkdownViewer({
  content,
}: MarkdownViewerProps) {
  return (
    <article
      className="
        max-w-none
        text-slate-300
        leading-7

        [&_h1]:mb-4
        [&_h1]:mt-2
        [&_h1]:text-2xl
        [&_h1]:font-semibold
        [&_h1]:text-white

        [&_h2]:mb-3
        [&_h2]:mt-8
        [&_h2]:text-xl
        [&_h2]:font-semibold
        [&_h2]:text-white

        [&_h3]:mb-3
        [&_h3]:mt-6
        [&_h3]:text-lg
        [&_h3]:font-semibold
        [&_h3]:text-white

        [&_p]:my-4
        [&_p]:text-[15px]
        [&_p]:leading-7
        [&_p]:text-slate-300

        [&_strong]:font-semibold
        [&_strong]:text-white

        [&_ul]:my-4
        [&_ul]:list-disc
        [&_ul]:pl-6

        [&_ol]:my-4
        [&_ol]:list-decimal
        [&_ol]:pl-6

        [&_li]:my-1.5
        [&_li]:text-[15px]

        [&_blockquote]:my-6
        [&_blockquote]:border-l-4
        [&_blockquote]:border-amber-300
        [&_blockquote]:pl-5
        [&_blockquote]:italic
        [&_blockquote]:text-slate-400

        [&_hr]:my-8
        [&_hr]:border-[#343a44]

        [&_code]:rounded
        [&_code]:bg-[#20242b]
        [&_code]:px-2
        [&_code]:py-1
        [&_code]:text-amber-200

        [&_pre]:my-6
        [&_pre]:overflow-x-auto
        [&_pre]:rounded-xl
        [&_pre]:bg-[#0b0d10]
        [&_pre]:p-4

        [&_table]:my-6
        [&_table]:w-full
        [&_table]:border-collapse

        [&_th]:border
        [&_th]:border-[#343a44]
        [&_th]:bg-[#20242b]
        [&_th]:px-4
        [&_th]:py-3

        [&_td]:border
        [&_td]:border-[#343a44]
        [&_td]:px-4
        [&_td]:py-3
      "
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </article>
  );
}

export default MarkdownViewer;
