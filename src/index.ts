import { useCallback, useMemo, useState } from "react";

export function choose(
  condition: number,
  negative: number,
  zero: number,
  positive: number
): number {
  if (condition < 0) return negative
  if (condition > 0) return positive
  return zero
}

export function reducer(
  range: number[],
  index: number,
  value: number
): number[] {
  // index: l'indice del valore che sto modificando
  const exceeds = Math.max(0, (range[index] ?? 0) + value - 100)
  const lastExceeds = (range[index] ?? 0) + value - 100
  const newValue = Math.min(100, (range[index] ?? 0) + value)
  const isLast = index === range.length - 2
  return range.slice(1, -1).map((val, idx) =>
    choose(
      idx - index,
      // index > idx
      isLast ? Math.max(0, val - lastExceeds) : Math.max(0, val - exceeds),
      // index === idx
      newValue,
      // index < idx
      Math.max(val, newValue)
    )
  )
}

type UseSlidersReturnType = [
  number[],
  (index: number, value: number | number[]) => void,
  number[],
  (value: number | number[]) => void
]

export function useSliders(num: number = 2): UseSlidersReturnType {
  // Corpo
  const [range, setRange] = useState<number[]>([
    0,
    ...Array(num - 1)
      .fill(true)
      .map((_, idx) => (100 / num) * (idx + 1)),
    100
  ])

  const handleChangeRange = useCallback((value: number | number[]) => {
    if (Array.isArray(value)) {
      setRange([0, ...value, 100])
    }
  }, [])

  const handleChange = useCallback(
    (index: number, value: number | number[]) => {
      if (typeof value === 'number') {
        setRange((range) => [0, ...reducer(range, index, value), 100])
      }
    },
    []
  )

  const values = useMemo(
    () => range.slice(1).map((val, idx) => val - range[idx]),
    [range]
  )
  const rangeValues = useMemo(() => range.slice(1, -1), [range])

  return [values, handleChange, rangeValues, handleChangeRange]
}
