import ReactMarkdown from "react-markdown";

interface MarkdownViewerProps {
  content: string;
}

function MarkdownViewer({
  content,
}: MarkdownViewerProps) {
  return (
    <div className="prose prose-slate max-w-none">
      <ReactMarkdown>
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownViewer;