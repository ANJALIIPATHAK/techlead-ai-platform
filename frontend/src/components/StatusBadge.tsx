interface StatusBadgeProps {
  status: string;
}

function StatusBadge({
  status,
}: StatusBadgeProps) {
  switch (status) {
    case "APPROVED":
      return (
        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
          Approved
        </span>
      );

    case "REJECTED":
      return (
        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
          Rejected
        </span>
      );

    default:
      return (
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
          Pending
        </span>
      );
  }
}

export default StatusBadge;