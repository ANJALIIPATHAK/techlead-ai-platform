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
        text-[16px]
        leading-8

        [&>*:first-child]:mt-0
        [&>*:last-child]:mb-0

        /* H1 */

        [&_h1]:mb-6
        [&_h1]:mt-2
        [&_h1]:border-b
        [&_h1]:border-white/10
        [&_h1]:pb-4
        [&_h1]:text-4xl
        [&_h1]:font-bold
        [&_h1]:tracking-tight
        [&_h1]:text-white

        /* H2 */

        [&_h2]:mb-5
        [&_h2]:mt-14
        [&_h2]:text-3xl
        [&_h2]:font-bold
        [&_h2]:tracking-tight
        [&_h2]:text-white

        /* H3 */

        [&_h3]:mb-4
        [&_h3]:mt-10
        [&_h3]:text-2xl
        [&_h3]:font-semibold
        [&_h3]:text-white

        /* H4 */

        [&_h4]:mb-3
        [&_h4]:mt-8
        [&_h4]:text-xl
        [&_h4]:font-semibold
        [&_h4]:text-white

        /* Paragraph */

        [&_p]:my-6
        [&_p]:leading-8
        [&_p]:text-slate-300

        /* Strong */

        [&_strong]:font-semibold
        [&_strong]:text-white

        /* Lists */

        [&_ul]:my-6
        [&_ul]:list-disc
        [&_ul]:space-y-3
        [&_ul]:pl-8

        [&_ol]:my-6
        [&_ol]:list-decimal
        [&_ol]:space-y-3
        [&_ol]:pl-8

        [&_li]:leading-8
        [&_li]:text-slate-300

        /* Blockquote */

        [&_blockquote]:my-8
        [&_blockquote]:rounded-r-xl
        [&_blockquote]:border-l-4
        [&_blockquote]:border-cyan-400
        [&_blockquote]:bg-cyan-500/5
        [&_blockquote]:py-4
        [&_blockquote]:pl-6
        [&_blockquote]:pr-4
        [&_blockquote]:italic
        [&_blockquote]:text-slate-400

        /* HR */

        [&_hr]:my-12
        [&_hr]:border-white/10

        /* Inline Code */

        [&_code]:rounded-md
        [&_code]:border
        [&_code]:border-cyan-400/10
        [&_code]:bg-cyan-400/10
        [&_code]:px-2
        [&_code]:py-1
        [&_code]:font-mono
        [&_code]:text-[14px]
        [&_code]:text-cyan-200

        /* Code Blocks */

        [&_pre]:my-8
        [&_pre]:overflow-x-auto
        [&_pre]:rounded-2xl
        [&_pre]:border
        [&_pre]:border-white/10
        [&_pre]:bg-[#0b0f14]
        [&_pre]:p-6

        [&_pre_code]:border-0
        [&_pre_code]:bg-transparent
        [&_pre_code]:p-0

        /* Tables */

        [&_table]:my-8
        [&_table]:w-full
        [&_table]:overflow-hidden
        [&_table]:rounded-2xl
        [&_table]:border
        [&_table]:border-white/10
        [&_table]:border-collapse

        [&_thead]:bg-[#171d25]

        [&_th]:border-b
        [&_th]:border-white/10
        [&_th]:px-5
        [&_th]:py-4
        [&_th]:text-left
        [&_th]:font-semibold
        [&_th]:text-white

        [&_td]:border-t
        [&_td]:border-white/10
        [&_td]:px-5
        [&_td]:py-4
        [&_td]:text-slate-300

        /* Links */

        [&_a]:font-medium
        [&_a]:text-cyan-300
        [&_a]:underline
        [&_a]:underline-offset-4
        hover:[&_a]:text-cyan-200
      "
    >
      <ReactMarkdown>
        {content}
      </ReactMarkdown>
    </article>
  );
}

export default MarkdownViewer;