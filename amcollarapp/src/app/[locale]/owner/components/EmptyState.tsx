type Props = {
  title: string;
  description: string;
};

export default function EmptyState({ title, description }: Props) {
  return (
    <div className="rounded-2xl bg-[#102a23] p-6 text-center">
      <p className="mb-2 text-white">{title}</p>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
