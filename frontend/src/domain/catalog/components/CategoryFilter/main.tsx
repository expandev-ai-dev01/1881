import { Button } from '@/core/components/button';
import { cn } from '@/core/lib/utils';
import type { CategoryFilterProps } from './types';

function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedCategory === undefined ? 'default' : 'outline'}
        size="sm"
        onClick={() => onCategoryChange(undefined)}
      >
        Todas as Categorias
      </Button>
      {categories?.map((category) => (
        <Button
          key={category.idCategory}
          variant={selectedCategory === category.idCategory ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(category.idCategory)}
          className={cn(
            'transition-all',
            selectedCategory === category.idCategory && 'ring-primary ring-2 ring-offset-2'
          )}
        >
          {category.name}
          <span className="text-muted-foreground ml-1.5 text-xs">({category.productCount})</span>
        </Button>
      ))}
    </div>
  );
}

export { CategoryFilter };
