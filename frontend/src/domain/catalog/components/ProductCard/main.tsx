import { useState } from 'react';
import { Card, CardContent } from '@/core/components/card';
import { Badge } from '@/core/components/badge';
import { cn } from '@/core/lib/utils';
import type { ProductCardProps } from './types';

function ProductCard({ product, onClick }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick(product);
    }
  };

  const displayImage = imageError ? product.imageFallbackUrl : product.imageUrl;

  return (
    <Card
      className={cn(
        'group relative cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-lg',
        !product.available && 'opacity-75'
      )}
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden">
          {!imageLoaded && product.imagePlaceholderSvg && (
            <div
              className="bg-muted absolute inset-0 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: product.imagePlaceholderSvg }}
            />
          )}
          <img
            src={displayImage}
            alt={product.name}
            className={cn(
              'h-full w-full object-cover transition-all duration-300 group-hover:scale-105',
              !imageLoaded && 'opacity-0',
              !product.available && 'opacity-50'
            )}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          {!product.available && <div className="absolute inset-0 bg-black/50" />}
          <div className="absolute right-2 top-2">
            {product.available ? (
              <Badge variant="default" className="bg-green-600 text-white">
                Disponível
              </Badge>
            ) : (
              <Badge variant="destructive">Indisponível</Badge>
            )}
          </div>
        </div>
        <div className="space-y-2 p-4">
          <h3 className="line-clamp-2 text-lg font-semibold leading-tight">{product.name}</h3>
          <p className="text-muted-foreground text-sm">{product.categoryName}</p>
          <div className="flex items-center justify-between">
            <p
              className={cn(
                'text-primary text-2xl font-bold',
                !product.available && 'line-through opacity-50'
              )}
            >
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(product.price)}
            </p>
          </div>
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <span>{product.dimensions}</span>
            <span>•</span>
            <span>{product.material}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { ProductCard };
