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
        text-zinc-300
        leading-8

        [&_h1]:mb-6
        [&_h1]:mt-10
        [&_h1]:text-4xl
        [&_h1]:font-bold
        [&_h1]:text-white

        [&_h2]:mb-5
        [&_h2]:mt-10
        [&_h2]:text-3xl
        [&_h2]:font-semibold
        [&_h2]:text-white

        [&_h3]:mb-4
        [&_h3]:mt-8
        [&_h3]:text-2xl
        [&_h3]:font-semibold
        [&_h3]:text-white

        [&_p]:my-5
        [&_p]:text-[17px]
        [&_p]:leading-8
        [&_p]:text-zinc-300

        [&_strong]:font-semibold
        [&_strong]:text-white

        [&_ul]:my-6
        [&_ul]:list-disc
        [&_ul]:pl-7

        [&_ol]:my-6
        [&_ol]:list-decimal
        [&_ol]:pl-7

        [&_li]:my-2

        [&_blockquote]:my-8
        [&_blockquote]:border-l-4
        [&_blockquote]:border-blue-500
        [&_blockquote]:pl-6
        [&_blockquote]:italic
        [&_blockquote]:text-zinc-400

        [&_hr]:my-10
        [&_hr]:border-zinc-700

        [&_code]:rounded
        [&_code]:bg-zinc-800
        [&_code]:px-2
        [&_code]:py-1
        [&_code]:text-blue-300

        [&_pre]:my-8
        [&_pre]:overflow-x-auto
        [&_pre]:rounded-2xl
        [&_pre]:bg-zinc-950
        [&_pre]:p-5

        [&_table]:my-8
        [&_table]:w-full
        [&_table]:border-collapse

        [&_th]:border
        [&_th]:border-zinc-700
        [&_th]:bg-zinc-800
        [&_th]:px-4
        [&_th]:py-3

        [&_td]:border
        [&_td]:border-zinc-700
        [&_td]:px-4
        [&_td]:py-3
      "
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </article>
  );
}

export default MarkdownViewer;