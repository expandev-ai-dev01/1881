export type PageSize = 12 | 24 | 36;

export interface PageSizeControlProps {
  value: PageSize;
  onChange: (value: PageSize) => void;
}
