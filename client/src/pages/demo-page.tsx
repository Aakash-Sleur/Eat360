import * as React from "react"
import { Button } from "@/components/ui/button"
import { RecipeStepsModal } from "@/components/shared/recipe-steps-modal"

export default function Page() {
  const [open, setOpen] = React.useState(false)

  const steps = [
    {
      title: "Prep Ingredients",
      description: "Gather all your ingredients and measure them. Preheat your oven to 180°C (350°F).",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/ingredients-on-cutting-board-cooking-prep-X6vytTHxSqcsBYARTIkIgO0p9kfs8R.jpg",
    },
    {
      title: "Mix Batter",
      description: "Whisk the dry ingredients, then fold in the wet ingredients until just combined.",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/mixing-batter-in-a-bowl-with-whisk-G6mLvZCIpCjtPugoqofhtvesdkR6Yd.jpg",
    },
    {
      title: "Bake",
      description: "Pour into a lined pan and bake until golden. Let cool before slicing and serving.",
      image: "https://res.cloudinary.com/diviaanea/image/upload/v1760523561/ingredients-on-cutting-board-cooking-prep-X6vytTHxSqcsBYARTIkIgO0p9kfs8R_x4frf3.jpg"
    },
  ]

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="grid gap-4 text-center">
        <h1 className="text-2xl font-semibold text-[color:var(--brand-primary)] text-pretty">
          Recipe Steps Modal Demo
        </h1>
        <p className="max-w-prose text-[color:var(--brand-accent-1)] mx-auto">
          Click the button below to open the recipe steps modal using your brand palette.
        </p>
        <div className="flex justify-center">
          <Button
            onClick={() => setOpen(true)}
            className="bg-brand text-brand-contrast hover:bg-[color:var(--brand-accent-1)]"
          >
            Open Recipe
          </Button>
        </div>
        <RecipeStepsModal
          steps={steps}
          open={open}
          onOpenChange={setOpen}
          title="Chocolate Loaf"
          description="Follow these steps to bake a delicious chocolate loaf."
        />
      </div>
    </main>
  )
}
