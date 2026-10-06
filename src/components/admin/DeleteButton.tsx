"use client";

export default function DeleteButton({
  action,
  fields,
  confirmMessage,
  label = "Delete",
}: {
  action: (formData: FormData) => void | Promise<void>;
  fields: Record<string, string>;
  confirmMessage: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <button type="submit" className="text-xs uppercase tracking-wide text-cherry hover:underline">
        {label}
      </button>
    </form>
  );
}
