import React, { useEffect, useState } from "react";
import { Container, Typography, Box, List, ListItem, ListItemText } from "@mui/material";
import { useUser } from "../context/User.tsx";
import { getPaymentsForRunner } from "../services/payments.tsx";
import { getEventById } from "../services/api.tsx";
import { Payment, RaceEvent, PaymentWithEvent } from "../types";

const PaymentHistory: React.FC = () => {
  const { userId } = useUser();
  const [payments, setPayments] = useState<PaymentWithEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const paymentData = await getPaymentsForRunner(Number(userId));

      const paymentsWithEvent = await Promise.all(
        paymentData.map(async (payment) => {
          let event: RaceEvent;
          try {
            event = await getEventById(payment.event_id);
          } catch (err) {
            console.error("Error fetching event:", err);
            event = { 
              id: 0, 
              name: "Unknown Event", 
              date: "", 
              distance: 0, 
              location: { city: "", country: "" }, 
              track: { name: "", distance: 0, difficulty_level: "" }, 
              runners: [] 
            };
          }
          return {
            ...payment,
            eventName: event.name,
            eventDate: event.date,
          };
        })
      );

      setPayments(paymentsWithEvent);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (!userId) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h6" color="error">
          Please log in to view your payment history.
        </Typography>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Typography variant="body1">Loading payment history...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        My Payment History
      </Typography>
      {payments.length === 0 ? (
        <Typography variant="body1">No payments found.</Typography>
      ) : (
        <List>
          {payments.map((payment) => (
            <ListItem key={payment.id}>
              <ListItemText
                primary={`Payment for ${payment.eventName}`}
                secondary={`Date: ${new Date(payment.eventDate).toLocaleDateString()} | Amount: ${payment.amount} PLN | Status: ${payment.status}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default PaymentHistory;
