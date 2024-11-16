type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PageHeaderProps = {
  icon: string;
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
};

export const PageHeader = ({
  icon,
  title,
  description,
  breadcrumbs,
}: PageHeaderProps) => (
  <div className="mb-4 flex flex-col gap-2 rounded-lg bg-black p-4">
    {breadcrumbs && (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {breadcrumbs.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {index > 0 && <span className="text-muted-foreground">/</span>}
            {item.href ? (
              <a
                href={item.href}
                className="hover:text-spotify hover:underline"
              >
                {item.label}
              </a>
            ) : (
              <span>{item.label}</span>
            )}
          </div>
        ))}
      </div>
    )}
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-white">{icon}</span>
      <h1 className="text-3xl font-bold text-white">{title}</h1>
    </div>
    <p className="text-muted-foreground">{description}</p>
    <div className="h-0.5 w-full bg-spotify" />
  </div>
);
