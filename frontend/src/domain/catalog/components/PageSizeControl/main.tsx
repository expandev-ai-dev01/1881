import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import type { PageSizeControlProps } from './types';

function PageSizeControl({ value, onChange }: PageSizeControlProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-sm font-medium">Produtos por página:</span>
      <Select
        value={value.toString()}
        onValueChange={(val) => onChange(Number(val) as 12 | 24 | 36)}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="12">12</SelectItem>
          <SelectItem value="24">24</SelectItem>
          <SelectItem value="36">36</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export { PageSizeControl };
