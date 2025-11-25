import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import type { SortControlProps } from './types';

function SortControl({ value, onChange }: SortControlProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-sm font-medium">Ordenar por:</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="nome_asc">Nome (A-Z)</SelectItem>
          <SelectItem value="nome_desc">Nome (Z-A)</SelectItem>
          <SelectItem value="preco_asc">Preço (Menor-Maior)</SelectItem>
          <SelectItem value="preco_desc">Preço (Maior-Menor)</SelectItem>
          <SelectItem value="data_cadastro_desc">Mais Recentes</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export { SortControl };
