import { useQuery } from '@tanstack/react-query';
import { loadCSV, type BOMRecord, type ComponentRecord, type RiskRecord, type SupplierRecord } from '@/lib/csv-loader';

export function useBOMData() {
  return useQuery({
    queryKey: ['bom'],
    queryFn: () => loadCSV<BOMRecord>('/data/bom.csv'),
    staleTime: Infinity,
  });
}

export function useComponentData() {
  return useQuery({
    queryKey: ['components'],
    queryFn: () => loadCSV<ComponentRecord>('/data/components.csv'),
    staleTime: Infinity,
  });
}

export function useRiskData() {
  return useQuery({
    queryKey: ['risk'],
    queryFn: () => loadCSV<RiskRecord>('/data/risk.csv'),
    staleTime: Infinity,
  });
}

export function useSupplierData() {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: () => loadCSV<SupplierRecord>('/data/suppliers.csv'),
    staleTime: Infinity,
  });
}
