import { cva, type VariantProps } from "class-variance-authority"

const textVariants = cva("", {
  variants: {
    role: {
      "hero-title":
        "font-heading text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl",
      "section-title":
        "font-heading text-xl font-semibold leading-tight tracking-tight sm:text-2xl",
      body: "text-base leading-7 font-normal",
      metadata: "text-xs leading-5 font-medium",
      label: "text-sm leading-6 font-medium",
    },
  },
  defaultVariants: {
    role: "body",
  },
})

type TextRole = NonNullable<VariantProps<typeof textVariants>["role"]>

export { textVariants }
export type { TextRole }
