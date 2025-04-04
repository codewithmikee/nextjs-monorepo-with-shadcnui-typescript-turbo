/**
 * @author Mikiyas Birhanu And AI
 * @description Form hook for simplifying form management with React Hook Form and Zod
 */
import { useForm, UseFormProps, UseFormReturn, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface UseZodFormProps<T extends FieldValues> extends UseFormProps<T> {
  schema: z.ZodType<T>;
}

/**
 * Custom hook that integrates React Hook Form with Zod validation
 */
export function useZodForm<T extends FieldValues>({
  schema,
  ...formProps
}: UseZodFormProps<T>): UseFormReturn<T> {
  return useForm<T>({
    ...formProps,
    resolver: zodResolver(schema),
  });
}
