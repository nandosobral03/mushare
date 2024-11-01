type PageHeaderProps = {
  icon: string;
  title: string;
  description: string;
};

export const PageHeader = ({ icon, title, description }: PageHeaderProps) => (
  <div className="mb-4 flex flex-col gap-2 rounded-lg bg-black p-4">
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-white">{icon}</span>
      <h1 className="text-3xl font-bold text-white">{title}</h1>
    </div>
    <p className="text-muted-foreground">{description}</p>
  </div>
);
