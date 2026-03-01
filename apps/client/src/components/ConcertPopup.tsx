import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Calendar, MapPin, Ticket } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import TicketPurchaseDialog from '@/components/TicketPurchaseDialog';

export default function ConcertPopup() {
  const [concert, setConcert] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);

  useEffect(() => {
    const fetchActiveConcert = async () => {
      try {
        const res = await api.get('/concerts/active');
        if (res.data) {
          setConcert(res.data);
          setTimeout(() => setIsOpen(true), 2000);
        }
      } catch {
        // No active concert or network error — popup won't show
      }
    };
    fetchActiveConcert();
  }, []);

  if (!concert) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-sm"
          >
            <Card className="rounded-xl border shadow-lg bg-card overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 rounded-full h-8 w-8 p-0"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>

              {concert.imageUrl && (
                <div className="h-40 w-full overflow-hidden">
                  <img src={concert.imageUrl} alt={concert.title} className="h-full w-full object-cover" />
                </div>
              )}

              <CardContent className="p-6">
                <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-xs font-bold text-foreground/80 mb-3">
                  <span className="h-2 w-2 rounded-full bg-[hsl(var(--brand-red))] animate-pulse" />
                  Special Event
                </div>
                <h3 className="text-xl font-black text-foreground mb-2">{concert.title}</h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    {concert.dateTime}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    {concert.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <Ticket className="h-4 w-4 text-primary" />
                    Starting at UGX {Number(concert.price).toLocaleString()}
                  </div>
                </div>

                <Button
                  className="w-full h-12 font-bold"
                  onClick={() => {
                    setTicketDialogOpen(true);
                    setIsOpen(false);
                  }}
                >
                  Buy Tickets Now
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <TicketPurchaseDialog
        open={ticketDialogOpen}
        onOpenChange={setTicketDialogOpen}
        concert={concert}
      />
    </>
  );
}
