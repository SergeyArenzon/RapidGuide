import dayjs from 'dayjs'
import type { TourDto } from '@rapid-guide-io/contracts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface TimeSlot {
  id: string
  startTime: string
  endTime: string
}

interface ReservationDetailsCardProps {
  tour: TourDto
  selectedDate: Date
  selectedTimeSlot: TimeSlot
  onFinalize: () => void
  isLoading?: boolean
}

export function ReservationDetailsCard({
  tour,
  selectedDate,
  selectedTimeSlot,
  onFinalize,
  isLoading = false,
}: ReservationDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reservation Details</CardTitle>
        <CardDescription>Review your reservation before finalizing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tour:</span>
            <span className="font-medium">{tour.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date:</span>
            <span className="font-medium">{dayjs(selectedDate).format('MMMM D, YYYY')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Time:</span>
            <span className="font-medium">{selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Duration:</span>
            <span className="font-medium">{tour.duration_minutes} minutes</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Price:</span>
            <span className="font-medium">€{tour.price}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onFinalize} 
          className="w-full" 
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Reservation...' : 'Finalize Reservation'}
        </Button>
      </CardFooter>
    </Card>
  )
}

