import { useState, useMemo } from 'react';
import { useProductList, useCategoryList } from '@/domain/catalog/hooks';
import {
  ProductCard,
  CategoryFilter,
  SortControl,
  PageSizeControl,
  CatalogBreadcrumb,
} from '@/domain/catalog/components';
import type { SortOption } from '@/domain/catalog/components/SortControl/types';
import type { PageSize } from '@/domain/catalog/components/PageSizeControl/types';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/core/components/pagination';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from '@/core/components/empty';
import { Skeleton } from '@/core/components/skeleton';
import { PackageOpen } from 'lucide-react';

function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<SortOption>('nome_asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(12);

  const { categories, isLoading: categoriesLoading } = useCategoryList();
  const {
    products,
    totalCount,
    isLoading: productsLoading,
  } = useProductList({
    filters: {
      idCategory: selectedCategory,
      sortBy,
      page,
      pageSize,
    },
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  const breadcrumbItems = useMemo(() => {
    const items = [{ label: 'Home', href: '/' }, { label: 'Catálogo' }];
    if (selectedCategory) {
      const category = categories?.find((c) => c.idCategory === selectedCategory);
      if (category) {
        items.push({ label: category.name });
      }
    }
    return items;
  }, [selectedCategory, categories]);

  const paginationItems = useMemo(() => {
    const items: (number | 'ellipsis')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      items.push(1);

      if (page > 3) {
        items.push('ellipsis');
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        items.push(i);
      }

      if (page < totalPages - 2) {
        items.push('ellipsis');
      }

      items.push(totalPages);
    }

    return items;
  }, [page, totalPages]);

  const handleCategoryChange = (categoryId?: number) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setPage(1);
  };

  const handlePageSizeChange = (newSize: PageSize) => {
    setPageSize(newSize);
    setPage(1);
  };

  const selectedCategoryName = useMemo(() => {
    if (!selectedCategory) return null;
    return categories?.find((c) => c.idCategory === selectedCategory)?.name;
  }, [selectedCategory, categories]);

  return (
    <div className="space-y-6 py-6">
      <div className="space-y-4">
        <CatalogBreadcrumb items={breadcrumbItems} />
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            {selectedCategoryName ?? 'Catálogo de Produtos'}
          </h1>
          {selectedCategoryName && (
            <p className="text-muted-foreground text-lg">
              {categories?.find((c) => c.idCategory === selectedCategory)?.description}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {categoriesLoading ? (
          <div className="flex gap-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-32" />
          </div>
        ) : (
          <CategoryFilter
            categories={categories ?? []}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-muted-foreground text-sm">
            {totalCount > 0 && (
              <span>
                Exibindo {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, totalCount)} de{' '}
                {totalCount} produtos
              </span>
            )}
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <SortControl value={sortBy} onChange={handleSortChange} />
            <PageSizeControl value={pageSize} onChange={handlePageSizeChange} />
          </div>
        </div>
      </div>

      {productsLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: pageSize }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : products?.length === 0 ? (
        <Empty className="min-h-[400px]">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PackageOpen className="size-6" />
            </EmptyMedia>
            <EmptyTitle>Nenhum produto encontrado</EmptyTitle>
            <EmptyDescription>
              Não encontramos produtos{' '}
              {selectedCategoryName
                ? `na categoria "${selectedCategoryName}"`
                : 'com os filtros selecionados'}
              . Tente ajustar os filtros ou explorar outras categorias.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products?.map((product) => (
              <ProductCard key={product.idProduct} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) setPage(page - 1);
                    }}
                    className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                {paginationItems.map((item, index) =>
                  item === 'ellipsis' ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={item}>
                      <PaginationLink
                        href="#"
                        isActive={page === item}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(item);
                        }}
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < totalPages) setPage(page + 1);
                    }}
                    className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}

export { CatalogPage };
