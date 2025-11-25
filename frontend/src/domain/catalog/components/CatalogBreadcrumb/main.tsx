import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/core/components/breadcrumb';
import type { CatalogBreadcrumbProps } from './types';

function CatalogBreadcrumb({ items }: CatalogBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items?.map((item, index) => (
          <>
            <BreadcrumbItem key={index}>
              {index === items.length - 1 ? (
                <BreadcrumbPage className="font-semibold">{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href ?? '#'}>{item.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export { CatalogBreadcrumb };
