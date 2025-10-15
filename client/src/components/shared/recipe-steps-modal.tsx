import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type RecipeStep = {
  title: string
  description: string
  image: string
}

type RecipeStepsModalProps = {
  steps: RecipeStep[]
  open: boolean
  onOpenChange: (open: boolean) => void
  initialStep?: number
  title?: string
  description?: string
  className?: string
}

export function RecipeStepsModal({
  steps,
  open,
  onOpenChange,
  initialStep = 0,
  title = "Recipe Steps",
  description,
  className,
}: RecipeStepsModalProps) {
  const [index, setIndex] = React.useState(Math.min(initialStep, Math.max(0, steps.length - 1)))

  React.useEffect(() => {
    if (open) {
      setIndex(Math.min(initialStep, Math.max(0, steps.length - 1)))
    }
  }, [open, initialStep, steps.length])

  const hasSteps = steps && steps.length > 0
  const step = hasSteps ? steps[index] : undefined
  const atStart = index <= 0
  const atEnd = hasSteps ? index >= steps.length - 1 : true

  const goPrev = () => setIndex((i) => Math.max(0, i - 1))
  const goNext = () => setIndex((i) => (hasSteps ? Math.min(steps.length - 1, i + 1) : i))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "sm:max-w-3xl max-h-[800px] p-0 overflow-hidden border-0 shadow-2xl",
          className
        )}
        style={{ backgroundColor: 'white', borderRadius: '24px' }}
      >
        {/* Header */}
        <DialogHeader className="px-8 py-6" style={{ backgroundColor: '#f47e17' }}>
          <DialogTitle className="text-white text-2xl font-bold">{title}</DialogTitle>
          {description && (
            <DialogDescription className="mt-2 text-white/95 text-sm">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="p-5 grid gap-6">
          {/* Progress */}
          {hasSteps && (
            <div className="flex justify-between items-center">
              <div className="text-sm font-semibold text-gray-700" aria-live="polite">
                Step {index + 1} of {steps.length}
              </div>
              <div className="flex gap-2" role="group" aria-label="Progress">
                {steps.map((_, i) => ( 
                  <span
                    key={i}
                    aria-current={i === index}
                    className={cn(
                      "h-2.5 rounded-full transition-all duration-300",
                      i === index ? "w-8" : "w-2.5"
                    )}
                    style={{ 
                      backgroundColor: i === index ? '#f47e17' : '#f7b479'
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step Body */}
          {hasSteps && step ? (
            <div className="grid gap-5">
              <div className="relative aspect-video w-full overflow-hidden bg-gray-100" style={{ borderRadius: '16px' }}>
                <img
                  src={step.image || "/placeholder.svg"}
                  alt={`Step ${index + 1}: ${step.title}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="grid gap-3">
                <h3 className="text-2xl font-bold" style={{ color: '#f47e17' }}>
                  {step.title}
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 italic py-8">
              Add steps to see the recipe flow here.
            </div>
          )}

          {/* Controls */}
          <div className="mt-2 flex justify-between items-center gap-4">
            <button
              type="button"
              onClick={goPrev}
              disabled={atStart || !hasSteps}
              className="px-6 py-3 rounded-full font-medium text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: 'white',
                color: '#f47e17',
                border: '2px solid #f47e17'
              }}
              onMouseEnter={(e) => {
                if (!atStart && hasSteps) {
                  e.currentTarget.style.backgroundColor = '#f7b479'
                  e.currentTarget.style.borderColor = '#f7b479'
                  e.currentTarget.style.color = 'white'
                }
              }}
              onMouseLeave={(e) => {
                if (!atStart && hasSteps) {
                  e.currentTarget.style.backgroundColor = 'white'
                  e.currentTarget.style.borderColor = '#f47e17'
                  e.currentTarget.style.color = '#f47e17'
                }
              }}
            >
              Previous
            </button>

            <button
              type="button"
              onClick={atEnd ? () => onOpenChange(false) : goNext}
              className="px-8 py-3 rounded-full font-semibold text-sm text-white transition-all duration-200 hover:shadow-lg"
              style={{ backgroundColor: '#f47e17' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1913d'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f47e17'}
            >
              {atEnd ? "Finish" : "Next Step"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}