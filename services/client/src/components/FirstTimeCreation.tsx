import { Link } from "@tanstack/react-router"
import { CirclePlus } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FirstTimeCreationProps {
  title: string
  description: string
  icon?: LucideIcon
  buttonText?: string
  buttonLink: string
  buttonIcon?: LucideIcon
  className?: string
}

export function FirstTimeCreation({
  title,
  description,
  icon: Icon,
  buttonText,
  buttonLink,
  buttonIcon: ButtonIcon = CirclePlus,
  className = "",
}: FirstTimeCreationProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 border rounded-lg bg-muted/30 ${className}`}>
      {Icon && (
        <div className="rounded-full bg-primary/10 p-4 mb-4">
          <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
        </div>
      )}
      
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        {description}
      </p>
      
      {buttonText && (
        <Button asChild size="lg">
          <Link to={buttonLink}>
            <ButtonIcon className="mr-2 h-4 w-4" />
            {buttonText}
          </Link>
        </Button>
      )}
    </div>
  )
}

