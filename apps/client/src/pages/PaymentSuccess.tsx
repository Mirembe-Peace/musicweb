import * as React from "react";
import { useSearchParams, Link } from "react-router-dom";
import Container from "@/components/Container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("OrderMerchantReference") || searchParams.get("paymentId");

  const [status, setStatus] = React.useState<string>("loading");
  const [purchase, setPurchase] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!paymentId) {
      setStatus("unknown");
      return;
    }

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 10;

    const poll = async () => {
      if (cancelled) return;

      try {
        const { data } = await api.get(`/purchases/status/${paymentId}`);
        if (cancelled) return;
        setPurchase(data);

        if (data.status === "COMPLETED") {
          setStatus("completed");
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 3000);
        } else {
          setStatus("pending");
        }
      } catch {
        if (cancelled) return;
        try {
          const { data } = await api.get(`/payments/${paymentId}`);
          if (cancelled) return;
          if (data?.status === "COMPLETED") {
            setStatus("completed");
          } else {
            attempts++;
            if (attempts < maxAttempts) {
              setTimeout(poll, 3000);
            } else {
              setStatus("pending");
            }
          }
        } catch {
          if (cancelled) return;
          setError("Could not verify payment status");
          setStatus("error");
        }
      }
    };

    poll();

    return () => {
      cancelled = true;
    };
  }, [paymentId]);

  return (
    <Container>
      <div className="py-16 flex justify-center">
        <Card className="rounded-3xl max-w-md w-full">
          <CardContent className="p-8 text-center">
            {status === "loading" && (
              <>
                <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
                <div className="mt-4 font-black text-lg">
                  Verifying payment...
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Please wait while we confirm your payment.
                </p>
              </>
            )}

            {status === "completed" && (
              <>
                <div className="text-5xl">&#10003;</div>
                <div className="mt-4 font-black text-xl text-green-600">
                  Payment Successful!
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Thank you for your purchase. Check your email for details.
                </p>

                {purchase?.downloadToken && (
                  <Button asChild className="mt-6 rounded-2xl w-full">
                    <Link to={`/download/${purchase.downloadToken}`}>
                      Download Your Music
                    </Link>
                  </Button>
                )}

                <Button
                  asChild
                  variant="outline"
                  className="mt-3 rounded-2xl w-full"
                >
                  <Link to="/music">Back to Music</Link>
                </Button>
              </>
            )}

            {status === "pending" && (
              <>
                <div className="text-5xl">&#9203;</div>
                <div className="mt-4 font-black text-lg">
                  Payment Processing
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your payment is still being processed. You will receive an
                  email once confirmed.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="mt-6 rounded-2xl w-full"
                >
                  <Link to="/">Go Home</Link>
                </Button>
              </>
            )}

            {status === "unknown" && (
              <>
                <div className="mt-4 font-black text-lg">Thank You!</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your payment is being processed. Check your email for
                  confirmation.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="mt-6 rounded-2xl w-full"
                >
                  <Link to="/">Go Home</Link>
                </Button>
              </>
            )}

            {status === "error" && (
              <>
                <div className="text-5xl">&#9888;</div>
                <div className="mt-4 font-black text-lg text-destructive">
                  Error
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{error}</p>
                <Button
                  asChild
                  variant="outline"
                  className="mt-6 rounded-2xl w-full"
                >
                  <Link to="/">Go Home</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
